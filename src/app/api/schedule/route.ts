import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';

// Helper to format ISO timestamp with explicit UTC+1 (WAT) offset
const formatWATDateTime = (dateString: string, timeString: string) => {
  const cleanTime = timeString.trim().toUpperCase();
  const isPM = cleanTime.includes('PM');
  const isAM = cleanTime.includes('AM');
  const timeOnly = cleanTime.replace(/[^\d:]/g, '');
  
  const [hoursStr, minutesStr = '00'] = timeOnly.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const padH = hours.toString().padStart(2, '0');
  const padM = minutes.toString().padStart(2, '0');

  // Explicit UTC+1 (Lagos / WAT) offset string
  return `${dateString}T${padH}:${padM}:00+01:00`;
};

export async function POST(req: Request) {
  try {
    const { date, time, email, companyName } = await req.json();

    if (!date || !time || !email) {
      return NextResponse.json({ error: "Missing required fields (date, time, email)" }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || process.env.GOOGLE_TARGET_CALENDAR || 'primary';

    if (!clientEmail || !rawKey) {
      return NextResponse.json({ error: "Google Calendar service account credentials missing in .env" }, { status: 500 });
    }

    // Strip wrapping quotes and format newlines
    const privateKey = rawKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // 1. Calculate guaranteed start and end Date objects
    const startIso = formatWATDateTime(date, time);
    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Exactly 30 mins after start

    // 2. Build event payload using UTC ISO strings
    const eventPayload: any = {
      summary: `Discovery Call: TalentCore x ${companyName || 'Employer'}`,
      description: `Introductory call to discuss hiring requirements.\n\nEmployer Contact: ${email}`,
      start: { 
        dateTime: startDate.toISOString(), // e.g. "2026-09-03T12:00:00.000Z" (1:00 PM WAT)
        timeZone: 'Africa/Lagos' 
      },
      end: { 
        dateTime: endDate.toISOString(),   // e.g. "2026-09-03T12:30:00.000Z" (1:30 PM WAT)
        timeZone: 'Africa/Lagos' 
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `talentcore-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    let event;
    try {
      event = await calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: eventPayload,
      });
    } catch (insertError: any) {
      // Fallback: If Google Meet auto-creation fails on non-workspace accounts, insert event without conferenceData
      console.warn("[CALENDAR] Retrying insert without conferenceData:", insertError?.message);
      delete eventPayload.conferenceData;
      event = await calendar.events.insert({
        calendarId,
        sendUpdates: 'all',
        requestBody: eventPayload,
      });
    }

    // Extract Meet URL safely from hangoutLink or conference entryPoints
    const meetLink = 
      event.data.hangoutLink || 
      event.data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri || 
      event.data.htmlLink || 
      '';

    // Save the booking to PostgreSQL
    await db.insert(bookings).values({
      employerEmail: email,
      companyName: companyName || 'Unknown',
      scheduledAt: startDate,
      meetLink: meetLink,
      status: 'CONFIRMED',
    });

    // Form UTC strings for Google Calendar "Add to Calendar" link template
    const calStartUTC = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const calEndUTC = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Discovery+Call:+TalentCore+x+${encodeURIComponent(companyName || 'Employer')}&dates=${calStartUTC}/${calEndUTC}&details=Discussing+hiring+needs&location=${encodeURIComponent(meetLink)}`;

    return NextResponse.json({ 
      success: true,
      meetLink, 
      calLink,
      eventLink: event.data.htmlLink 
    }, { status: 200 });

  } catch (error: any) {
    const errorMsg = error?.response?.data?.error?.message || error?.message || "Failed to schedule call";
    console.error("[SCHEDULING ERROR]", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
"use server";

import { google } from "googleapis";
import { db } from "@/lib/db";
import { bookings, availabilitySettings } from "@/lib/db/schema";
import { eq, and, gte, lte, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Default schedule fallback (Mon–Fri, 9:00 AM to 5:00 PM WAT)
const DEFAULT_SCHEDULE: Record<string, { enabled: boolean; start: string; end: string }> = {
  mon: { enabled: true, start: "09:00", end: "17:00" },
  tue: { enabled: true, start: "09:00", end: "17:00" },
  wed: { enabled: true, start: "09:00", end: "17:00" },
  thu: { enabled: true, start: "09:00", end: "17:00" },
  fri: { enabled: true, start: "09:00", end: "17:00" },
  sat: { enabled: false, start: "10:00", end: "14:00" },
  sun: { enabled: false, start: "10:00", end: "14:00" },
};

const DAY_MAP = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const pad = (n: number) => n.toString().padStart(2, "0");

// 1. GET AVAILABLE DATES & OPEN SLOTS (Calendly Engine)
export async function getAvailableSlots(selectedDateStr?: string) {
  try {
    const settingsRecord = await db.query.availabilitySettings.findFirst({
      where: eq(availabilitySettings.id, "default"),
    });

    const weekly = (settingsRecord?.weeklySchedule as typeof DEFAULT_SCHEDULE) || DEFAULT_SCHEDULE;
    const slotDuration = settingsRecord?.slotDuration || 15;
    const bufferTime = settingsRecord?.bufferTime || 15;
    const minNoticeHours = settingsRecord?.minNoticeHours || 2;
    const maxDays = settingsRecord?.maxDaysInFuture || 14;

    // Generate enabled future dates (Starting from tomorrow up to maxDays)
    const availableDates: { dateStr: string; dayLabel: string; dateNum: number; monthLabel: string }[] = [];
    const today = new Date();

    for (let i = 1; i <= maxDays && availableDates.length < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayKey = DAY_MAP[d.getDay()];
      if (weekly[dayKey]?.enabled) {
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());

        availableDates.push({
          dateStr: `${year}-${month}-${day}`,
          dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
          dateNum: d.getDate(),
          monthLabel: d.toLocaleDateString("en-US", { month: "short" }),
        });
      }
    }

    const targetDateStr = selectedDateStr || availableDates[0]?.dateStr;
    if (!targetDateStr) {
      return { availableDates: [], availableSlots: [] };
    }

    // Explicit WAT (+01:00) date to get correct day of week
    const targetDate = new Date(`${targetDateStr}T00:00:00+01:00`);
    const dayKey = DAY_MAP[targetDate.getDay()];
    const dayConfig = weekly[dayKey];

    if (!dayConfig || !dayConfig.enabled) {
      return { availableDates, availableSlots: [] };
    }

    // Query booked intervals for target date to prevent double-booking
    const startOfDay = new Date(`${targetDateStr}T00:00:00+01:00`);
    const endOfDay = new Date(`${targetDateStr}T23:59:59+01:00`);

    const existingBookings = await db
      .select({ scheduledAt: bookings.scheduledAt, duration: bookings.durationMinutes })
      .from(bookings)
      .where(
        and(
          gte(bookings.scheduledAt, startOfDay),
          lte(bookings.scheduledAt, endOfDay),
          ne(bookings.status, "CANCELLED")
        )
      );

    const bookedIntervals = existingBookings.map((b) => ({
      start: new Date(b.scheduledAt).getTime(),
      end: new Date(b.scheduledAt).getTime() + (b.duration || slotDuration) * 60000,
    }));

    // Generate discrete time slots purely in minutes to avoid server timezone skew
    const [startH, startM] = dayConfig.start.split(":").map(Number);
    const [endH, endM] = dayConfig.end.split(":").map(Number);

    const stepMinutes = slotDuration + bufferTime;
    const nowTimestamp = Date.now();
    const minNoticeTimestamp = nowTimestamp + minNoticeHours * 3600000;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const openSlots: string[] = [];

    while (currentMinutes + slotDuration <= endMinutes) {
      const slotHour = Math.floor(currentMinutes / 60);
      const slotMin = currentMinutes % 60;

      // Build explicit ISO in Africa/Lagos (+01:00)
      const slotIso = `${targetDateStr}T${pad(slotHour)}:${pad(slotMin)}:00+01:00`;
      const slotStartTime = new Date(slotIso).getTime();
      const slotEndTime = slotStartTime + slotDuration * 60000;

      const isPast = slotStartTime < minNoticeTimestamp;
      const isBooked = bookedIntervals.some(
        (b) => slotStartTime < b.end && slotEndTime > b.start
      );

      if (!isPast && !isBooked) {
        const ampm = slotHour >= 12 ? "PM" : "AM";
        const displayH = slotHour % 12 === 0 ? 12 : slotHour % 12;
        const displayM = pad(slotMin);
        openSlots.push(`${pad(displayH)}:${displayM} ${ampm}`);
      }

      currentMinutes += stepMinutes;
    }

    return { availableDates, availableSlots: openSlots };
  } catch (error) {
    console.error("[GET_AVAILABLE_SLOTS_ERROR]", error);
    return { availableDates: [], availableSlots: [] };
  }
}

// 2. SCHEDULE MEETING & SYNC WITH DB & GOOGLE CALENDAR
export interface ScheduleMeetingInput {
  dateStr: string;
  timeStr: string;
  clientEmail: string;
  clientName?: string;
  companyName?: string;
  meetingType?: "employer" | "graduate";
  notes?: string;
}

export async function scheduleMeeting(
  inputOrDateStr: ScheduleMeetingInput | string,
  maybeTimeStr?: string,
  maybeClientEmail?: string,
  maybeCompanyName?: string
) {
  // Support both object syntax and positional legacy syntax
  let dateStr: string;
  let timeStr: string;
  let clientEmail: string;
  let clientName: string = "Client";
  let companyName: string = "Employer";
  let meetingType: "employer" | "graduate" = "employer";
  let notes: string = "";

  if (typeof inputOrDateStr === "object") {
    dateStr = inputOrDateStr.dateStr;
    timeStr = inputOrDateStr.timeStr;
    clientEmail = inputOrDateStr.clientEmail;
    clientName = inputOrDateStr.clientName || "Client";
    companyName = inputOrDateStr.companyName || (inputOrDateStr.meetingType === "graduate" ? "Candidate Screening" : "Employer");
    meetingType = inputOrDateStr.meetingType || "employer";
    notes = inputOrDateStr.notes || "";
  } else {
    dateStr = inputOrDateStr;
    timeStr = maybeTimeStr!;
    clientEmail = maybeClientEmail!;
    companyName = maybeCompanyName || "Employer";
  }

  try {
    const clientEmailEnv = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKeyEnv = process.env.GOOGLE_PRIVATE_KEY;
    const targetCalendarId = 
      process.env.GOOGLE_CALENDAR_ID || 
      process.env.GOOGLE_TARGET_CALENDAR || 
      "primary";

    if (!clientEmailEnv || !privateKeyEnv) {
      console.error("[GOOGLE CALENDAR] Missing credentials in .env");
      return { 
        success: false, 
        error: "Google Calendar service account is not configured." 
      };
    }

    // Dynamic slot duration from settings
    const settingsRecord = await db.query.availabilitySettings.findFirst({
      where: eq(availabilitySettings.id, "default"),
    });
    const durationMinutes = settingsRecord?.slotDuration || 15;

    const formattedPrivateKey = privateKeyEnv
      .replace(/^"|"$/g, "")
      .replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmailEnv,
        private_key: formattedPrivateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Parse 12h time string
    const cleanTime = timeStr.trim().toUpperCase();
    const isPM = cleanTime.includes("PM");
    const isAM = cleanTime.includes("AM");
    const timeOnly = cleanTime.replace(/[^\d:]/g, "");

    const [hoursStr, minutesStr = "00"] = timeOnly.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const startIso = `${dateStr}T${pad(hours)}:${pad(minutes)}:00+01:00`;
    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // Final safety check to prevent race-condition double-booking
    const conflict = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.scheduledAt, startDate),
        ne(bookings.status, "CANCELLED")
      ),
    });

    if (conflict) {
      return { 
        success: false, 
        error: "This slot was just booked by another user. Please choose another slot." 
      };
    }

    const summary = meetingType === "employer"
      ? `TalentCore Alignment Call: ${companyName || clientName}`
      : `TalentCore Screening Call: ${clientName}`;

    const description = meetingType === "employer"
      ? `Employer Discovery Call\n\nContact: ${clientName} (${clientEmail})\nCompany: ${companyName || "N/A"}\nNotes: ${notes}`
      : `Candidate Screening Call\n\nCandidate: ${clientName} (${clientEmail})\nNotes: ${notes}`;

    const eventPayload: any = {
      summary,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Africa/Lagos",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Africa/Lagos",
      },
      conferenceData: {
        createRequest: {
          requestId: `talentcore-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    let response;
    try {
      response = await calendar.events.insert({
        calendarId: targetCalendarId,
        requestBody: eventPayload,
        conferenceDataVersion: 1,
      });
    } catch (insertError: any) {
      console.warn("[GOOGLE CALENDAR] Retrying insert without conferenceData:", insertError?.message);
      delete eventPayload.conferenceData;

      response = await calendar.events.insert({
        calendarId: targetCalendarId,
        requestBody: eventPayload,
      });
    }

    const hangoutLink = 
      response.data.hangoutLink || 
      response.data.conferenceData?.entryPoints?.[0]?.uri || 
      "";

    // Insert into PostgreSQL
    const [newBooking] = await db
      .insert(bookings)
      .values({
        employerEmail: clientEmail,
        companyName: companyName,
        contactName: clientName,
        scheduledAt: startDate,
        durationMinutes: durationMinutes,
        meetLink: hangoutLink,
        calendarEventId: response.data.id || null,
        notes: notes,
        status: "CONFIRMED",
      })
      .returning();

    // Revalidate all administrative views
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { 
      success: true, 
      bookingId: newBooking.id,
      link: response.data.htmlLink, 
      meetLink: hangoutLink,
      scheduledAt: startDate.toISOString(),
    };

  } catch (error: any) {
    const errorDetails = error?.response?.data?.error?.message || error?.message || "Unknown error";
    console.error("[GOOGLE CALENDAR API ERROR]", errorDetails);

    return { 
      success: false, 
      error: `Calendar error: ${errorDetails}` 
    };
  }
}
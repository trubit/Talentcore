"use server";

import { db } from "@/lib/db";
import { bookings, availabilitySettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { google } from "googleapis";
import { handleDatabaseError } from "@/lib/db/errors";

// 1. Update Booking Status (Confirmed, Completed, Cancelled)
export async function updateBookingStatusAction(
  bookingId: string, 
  newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  try {
    const existing = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
    });

    if (!existing) {
      return { success: false, error: "Booking not found." };
    }

    if (newStatus === "CANCELLED" && existing.calendarEventId) {
      try {
        const clientEmailEnv = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKeyEnv = process.env.GOOGLE_PRIVATE_KEY;
        const targetCalendarId = 
          process.env.GOOGLE_CALENDAR_ID || 
          process.env.GOOGLE_TARGET_CALENDAR || 
          "primary";

        if (clientEmailEnv && privateKeyEnv) {
          const formattedPrivateKey = privateKeyEnv
            .replace(/^"|"$/g, "")
            .replace(/\\n/g, "\n");

          const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: clientEmailEnv,
              private_key: formattedPrivateKey,
            },
            scopes: ["https://www.googleapis.com/auth/calendar.events"],
          });

          const calendar = google.calendar({ version: "v3", auth });
          await calendar.events.delete({
            calendarId: targetCalendarId,
            eventId: existing.calendarEventId,
          });
        }
      } catch (calErr: any) {
        console.warn("[CALENDAR DELETE WARNING]", calErr?.message);
      }
    }

    await db
      .update(bookings)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, "Failed to update booking status.");
  }
}

// 2. Save Admin Availability Rules
export async function saveAvailabilitySettingsAction(payload: {
  weeklySchedule: Record<string, { enabled: boolean; start: string; end: string }>;
  slotDuration: number;
  bufferTime: number;
  minNoticeHours: number;
  maxDaysInFuture: number;
}) {
  try {
    const safeSchedule = payload.weeklySchedule || {};
    const safeSlotDuration = Number(payload.slotDuration) || 15;
    const safeBufferTime = Number(payload.bufferTime) || 15;
    const safeMinNoticeHours = Number(payload.minNoticeHours) || 2;
    const safeMaxDaysInFuture = Number(payload.maxDaysInFuture) || 14;

    await db
      .insert(availabilitySettings)
      .values({
        id: "default",
        weeklySchedule: safeSchedule,
        slotDuration: safeSlotDuration,
        bufferTime: safeBufferTime,
        minNoticeHours: safeMinNoticeHours,
        maxDaysInFuture: safeMaxDaysInFuture,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: availabilitySettings.id,
        set: {
          weeklySchedule: safeSchedule,
          slotDuration: safeSlotDuration,
          bufferTime: safeBufferTime,
          minNoticeHours: safeMinNoticeHours,
          maxDaysInFuture: safeMaxDaysInFuture,
          updatedAt: new Date(),
        },
      });

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, "Failed to save availability settings.");
  }
}
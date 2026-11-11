import { db } from "@/lib/db";
import { bookings, availabilitySettings } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

const DEFAULT_SCHEDULE = {
  mon: { enabled: true, start: "09:00", end: "17:00" },
  tue: { enabled: true, start: "09:00", end: "17:00" },
  wed: { enabled: true, start: "09:00", end: "17:00" },
  thu: { enabled: true, start: "09:00", end: "17:00" },
  fri: { enabled: true, start: "09:00", end: "17:00" },
  sat: { enabled: false, start: "10:00", end: "14:00" },
  sun: { enabled: false, start: "10:00", end: "14:00" },
};

export default async function AdminBookingsPage() {
  let allBookings: any[] = [];
  let settingsRecord: any = null;

  try {
    const [bookingsRes, settingsRes] = await Promise.all([
      db.select().from(bookings).orderBy(desc(bookings.scheduledAt)),
      db.query.availabilitySettings.findFirst({
        where: eq(availabilitySettings.id, "default"),
      }),
    ]);
    allBookings = bookingsRes;
    settingsRecord = settingsRes;
  } catch (error) {
    console.error("[BACKEND] Error loading bookings:", error);
  }

  const initialSettings = {
    weeklySchedule: (settingsRecord?.weeklySchedule as typeof DEFAULT_SCHEDULE) || DEFAULT_SCHEDULE,
    slotDuration: settingsRecord?.slotDuration || 15,
    bufferTime: settingsRecord?.bufferTime || 15,
    minNoticeHours: settingsRecord?.minNoticeHours || 2,
    maxDaysInFuture: settingsRecord?.maxDaysInFuture || 14,
  };

  return (
    <BookingsClient 
      initialBookings={allBookings} 
      initialSettings={initialSettings} 
    />
  );
}
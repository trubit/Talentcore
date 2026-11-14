"use server";

import { db } from "@/lib/db";
import { admins, systemPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "@/lib/db/errors";

export type AdminProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SystemPreferences = {
  defaultJobExpiry: number;
  emailNotifications: boolean;
};

// Update Admin Profile Details
export async function updateProfile(data: AdminProfile) {
  try {
    if (!data.id?.trim() || !data.email?.trim()) {
      return { success: false, error: "Admin ID and email are required." };
    }

    await db.update(admins)
      .set({
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
        email: data.email?.trim()?.toLowerCase(),
      })
      .where(eq(admins.id, data.id));

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to update profile.");
  }
}

// Update Global System Preferences
export async function updatePreferences(data: SystemPreferences) {
  try {
    const safeExpiry = Number(data.defaultJobExpiry) || 14;
    const safeNotifications = Boolean(data.emailNotifications);

    await db.insert(systemPreferences)
      .values({
        id: "global",
        defaultJobExpiry: safeExpiry,
        emailNotifications: safeNotifications,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemPreferences.id,
        set: {
          defaultJobExpiry: safeExpiry,
          emailNotifications: safeNotifications,
          updatedAt: new Date(),
        }
      });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to update preferences.");
  }
}
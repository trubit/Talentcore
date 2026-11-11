"use server";

import { db } from "@/lib/db";
import { admins, systemPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    await db.update(admins)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      })
      .where(eq(admins.id, data.id));

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("[BACKEND] Error updating profile:", error);
    return { success: false, error: "Failed to update profile." };
  }
}

// Update Global System Preferences
export async function updatePreferences(data: SystemPreferences) {
  try {
    await db.insert(systemPreferences)
      .values({
        id: "global",
        defaultJobExpiry: data.defaultJobExpiry,
        emailNotifications: data.emailNotifications,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemPreferences.id,
        set: {
          defaultJobExpiry: data.defaultJobExpiry,
          emailNotifications: data.emailNotifications,
          updatedAt: new Date(),
        }
      });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("[BACKEND] Error updating preferences:", error);
    return { success: false, error: "Failed to update preferences." };
  }
}
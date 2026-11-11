import { db } from "@/lib/db";
import { admins, systemPreferences } from "@/lib/db/schema";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let adminUser: any = null;
  let prefs: any = null;

  try {
    // 1. Fetch the first Admin profile
    const adminQuery = await db.select().from(admins).limit(1);
    adminUser = adminQuery[0];

    // 2. Fetch the global system preferences
    const prefsQuery = await db.select().from(systemPreferences).limit(1);
    prefs = prefsQuery[0];
  } catch (error) {
    console.error("[BACKEND] Error loading settings from database:", error);
  }

  // 3. Format default data if none exists
  const initialProfile = {
    id: adminUser?.id || "00000000-0000-0000-0000-000000000000", 
    firstName: adminUser?.firstName || "TalentCore",
    lastName: adminUser?.lastName || "Admin",
    email: adminUser?.email || "admin@talentcore.local",
  };

  const initialPreferences = {
    defaultJobExpiry: prefs?.defaultJobExpiry || 14,
    emailNotifications: prefs?.emailNotifications ?? true,
  };

  return (
    <SettingsClient 
      initialProfile={initialProfile} 
      initialPreferences={initialPreferences} 
    />
  );
}
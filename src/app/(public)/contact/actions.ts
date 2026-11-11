"use server";

import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(data: { name: string; email: string; message: string }) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "All fields are required." };
    }

    await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      subject: "General Inquiry", // Default subject for the general contact form
      message: data.message,
      status: "NEW",
    });

    // Clear the cache for the admin messages dashboard so it shows up instantly
    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error) {
    console.error("[BACKEND] Error submitting contact message:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
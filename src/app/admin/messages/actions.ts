"use server";

import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "@/lib/db/errors";

export type ContactMessage = {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  snippet: string;
  date: string;
  status: "New" | "Read" | "Replied";
};

export async function updateMessageStatus(id: string | number, newStatus: "New" | "Read" | "Replied") {
  try {
    const dbStatus = newStatus === "New" ? "NEW" : newStatus === "Read" ? "READ" : "REPLIED";

    await db.update(contactMessages)
      .set({ status: dbStatus })
      .where(eq(contactMessages.id, id as any)); 
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to update message status.");
  }
}

export async function deleteMessage(id: string | number) {
  try {
    await db.delete(contactMessages)
      .where(eq(contactMessages.id, id as any));
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to delete message.");
  }
}
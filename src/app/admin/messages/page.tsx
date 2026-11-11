import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  let formattedMessages: any[] = [];

  try {
    const rawMessages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    formattedMessages = rawMessages.map((msg) => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      snippet: msg.message,
      date: msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-CA") : "N/A",
      status: (msg.status === "NEW" ? "New" : msg.status === "READ" ? "Read" : "Replied") as "New" | "Read" | "Replied",
    }));
  } catch (error) {
    console.error("[BACKEND] Error loading messages:", error);
  }

  return <MessagesClient initialMessages={formattedMessages} />;
}
import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ResumeWritingClient from "./ResumeWritingClient";

export const dynamic = "force-dynamic";

export default async function ResumeWritingPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "resume_writing"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading resume_writing schema:", error);
  }

  return <ResumeWritingClient initialSchema={initialSchema} />;
}
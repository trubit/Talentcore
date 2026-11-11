import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import JobMatchingClient from "./JobMatchingClient";

export const dynamic = "force-dynamic";

export default async function JobMatchingPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "candidate_request"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading candidate_request schema:", error);
  }

  return <JobMatchingClient initialSchema={initialSchema} />;
}
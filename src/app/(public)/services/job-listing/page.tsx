import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import JobListingClient from "./JobListingClient";

export const dynamic = "force-dynamic";

export default async function JobListingPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "job_listing"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading job_listing schema:", error);
  }

  return <JobListingClient initialSchema={initialSchema} />;
}
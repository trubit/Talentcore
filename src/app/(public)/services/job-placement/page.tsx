import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import JobPlacementClient from "./JobPlacementClient";

export const dynamic = "force-dynamic";

export default async function JobPlacementPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "job_placement"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading job_placement schema:", error);
  }

  return <JobPlacementClient initialSchema={initialSchema} />;
}
import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import CareerReadinessClient from "./CareerReadinessClient";

export const dynamic = "force-dynamic";

export default async function CareerReadinessPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "career_readiness"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading career_readiness schema:", error);
  }

  return <CareerReadinessClient initialSchema={initialSchema} />;
}
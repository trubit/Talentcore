import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OutsourceHRClient from "./OutsourceHRClient";

export const dynamic = "force-dynamic";

export default async function OutsourceHRPage() {
  let initialSchema: any[] = [];

  try {
    const result = await db
      .select()
      .from(formSchemas)
      .where(eq(formSchemas.id, "outsource_hr"))
      .limit(1);

    const dbSchema = result[0]?.schemaDefinition;
    if (Array.isArray(dbSchema) && dbSchema.length > 0) {
      initialSchema = dbSchema;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading outsource_hr schema:", error);
  }

  return <OutsourceHRClient initialSchema={initialSchema} />;
}
import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import FormsClient from "./FormsClient";

export const dynamic = "force-dynamic";

export default async function AdminFormsPage() {
  try {
    const schemas = await db.select().from(formSchemas);
    return <FormsClient initialForms={schemas} />;
  } catch (error) {
    console.error("[BACKEND] Error fetching form schemas:", error);
    return <FormsClient initialForms={[]} />;
  }
}
import { db } from "@/lib/db";
import NewJobForm from "./NewJobForm";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  let forms: { id: string }[] = [];

  try {
    const availableForms = await db.query.formSchemas.findMany();
    forms = availableForms.map((f) => ({
      id: f.id,
    }));
  } catch (error) {
    console.error("[BACKEND] Error loading form schemas for job creation:", error);
  }

  return <NewJobForm availableForms={forms} />;
}
import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import FormBuilderClient from "./FormBuilderClient";

export const dynamic = "force-dynamic";

interface FormPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminFormEditorPage({ params }: FormPageProps) {
  const resolvedParams = await params;
  const formId = resolvedParams.id;

  let schemaDefinition: any[] = [];
  try {
    const record = await db.query.formSchemas.findFirst({
      where: eq(formSchemas.id, formId),
    });
    if (record && Array.isArray(record.schemaDefinition)) {
      schemaDefinition = record.schemaDefinition;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading form schema:", error);
  }

  const title = formId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <FormBuilderClient
      formId={formId}
      formTitle={title}
      initialSchema={schemaDefinition}
    />
  );
}


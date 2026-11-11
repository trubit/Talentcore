import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import GraduateForm from "@/components/forms/GraduateForm";

// Fallback just in case the admin hasn't saved a schema to the DB yet
const DEFAULT_SCHEMA = [
  {
    step: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
    ]
  }
];

export default async function GraduateFormWrapper() {
  const result = await db
    .select()
    .from(formSchemas)
    .where(eq(formSchemas.id, 'application'))
    .limit(1);

  const dbSchema = result[0]?.schemaDefinition;
  const dynamicSchema = Array.isArray(dbSchema) && dbSchema.length > 0 
    ? dbSchema 
    : DEFAULT_SCHEMA;

  return <GraduateForm initialSchema={dynamicSchema} />;
}
import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import GraduateForm from "@/components/forms/GraduateForm";

// 1. Define a solid fallback that matches the exact structure of the Schema Editor
const DEFAULT_SCHEMA = [
  {
    step: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: [
      { id: "fullName", type: "text", label: "Full Name", required: true },
      { id: "email", type: "email", label: "Email Address", required: true }
    ]
  }
];

export default async function GraduateFormWrapper() {
  // 2. Fetch directly from Drizzle
  const result = await db
    .select()
    .from(formSchemas)
    .where(eq(formSchemas.id, 'application'))
    .limit(1);

  // 3. Extract the JSONB schema or fall back
  const dbSchema = result[0]?.schemaDefinition;
  
  // 4. Validate that it's an array and actually has steps, otherwise use default
  const dynamicSchema = Array.isArray(dbSchema) && dbSchema.length > 0 
    ? dbSchema 
    : DEFAULT_SCHEMA;

  // 5. Pass it directly to the Client Component
  return <GraduateForm initialSchema={dynamicSchema} />;
}
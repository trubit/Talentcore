"use server";

import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Canonical mapping for service subroutes
const SERVICE_PATH_MAP: Record<string, string> = {
  outsource_hr: "/services/outsource-hr",
  hr_outsourcing: "/services/outsource-hr",
  job_placement: "/services/job-placement",
  job_matching: "/services/job-matching",
  resume_writing: "/services/resume-writing",
  career_readiness: "/services/career-readiness",
  job_listing: "/services/job-listing",
  candidate_request: "/services",
  application: "/jobs",
};

export async function saveFormSchemaAction(formId: string, schemaDefinition: any[]) {
  try {
    // 1. Normalize ID (lowercase, trim, hyphens to underscores, alias cleanup)
    let cleanId = formId.trim().toLowerCase().replace(/-/g, "_");
    if (cleanId === "hr_outsourcing") cleanId = "outsource_hr";

    // 2. Atomic Upsert in PostgreSQL via Drizzle
    await db
      .insert(formSchemas)
      .values({
        id: cleanId,
        schemaDefinition,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: formSchemas.id,
        set: {
          schemaDefinition,
          updatedAt: new Date(),
        },
      });

    // 3. Revalidate Admin paths
    revalidatePath(`/admin/forms/${cleanId}`);
    revalidatePath("/admin/forms");
    revalidatePath("/admin/jobs/new");

    // 4. Revalidate Public Frontend paths
    revalidatePath("/");
    revalidatePath("/services");
    
    // Specifically revalidate the targeted service route (e.g., /services/outsource-hr)
    const specificRoute = SERVICE_PATH_MAP[cleanId];
    if (specificRoute) {
      revalidatePath(specificRoute);
    }

    return { success: true, formId: cleanId };
  } catch (error: any) {
    console.error(`[SAVE_SCHEMA_ERROR] Form: ${formId}`, error);
    return { success: false, error: error.message || "Failed to save form schema." };
  }
}

// Exported alias to satisfy FormsClient.tsx
export async function updateFormSchema(formId: string, schemaDefinition: any[]) {
  return saveFormSchemaAction(formId, schemaDefinition);
}

// Fetch helper so client components can read schemas dynamically
export async function getFormSchema(formId: string) {
  try {
    const cleanId = formId.trim().toLowerCase().replace(/-/g, "_");
    
    const result = await db.query.formSchemas.findFirst({
      where: or(
        eq(formSchemas.id, cleanId),
        eq(formSchemas.id, formId)
      ),
    });

    return (result?.schemaDefinition as any[]) || [];
  } catch (error) {
    console.error(`[GET_SCHEMA_ERROR] Form: ${formId}`, error);
    return [];
  }
}
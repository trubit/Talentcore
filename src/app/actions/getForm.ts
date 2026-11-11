"use server";

import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFormSchema(formId: string) {
  try {
    const form = await db.query.formSchemas.findFirst({
      where: eq(formSchemas.id, formId),
    });
    return form?.schemaDefinition || [];
  } catch (error) {
    console.error(`[BACKEND] Failed to fetch form schema for ${formId}:`, error);
    return [];
  }
}

export async function updateFormSchema(formId: string, schemaDefinition: any[]) {
  try {
    const existing = await db.query.formSchemas.findFirst({
      where: eq(formSchemas.id, formId),
    });

    if (existing) {
      await db.update(formSchemas)
        .set({ schemaDefinition })
        .where(eq(formSchemas.id, formId));
    } else {
      await db.insert(formSchemas).values({
        id: formId,
        schemaDefinition,
      });
    }

    revalidatePath(`/${formId}`);
    return { success: true };
  } catch (error) {
    console.error(`[BACKEND] Failed to update form schema for ${formId}:`, error);
    return { success: false, error: "Database update failed." };
  }
}
"use server";

import { db } from "@/lib/db";
import { formSubmissions } from "@/lib/db/schema";
import { uploadFileToR2 } from "@/lib/r2";
import { revalidatePath } from "next/cache";

export async function submitDynamicForm(
  formId: string, 
  payloadOrFormData: FormData | Record<string, any>
) {
  const normalizedFormId = formId?.toLowerCase().trim();

  try {
    const rawPayload: Record<string, any> = {};
    const filesToUpload: { key: string; file: File }[] = [];

    // 1. Extract form values and isolate File objects
    if (payloadOrFormData instanceof FormData) {
      for (const [key, value] of payloadOrFormData.entries()) {
        if (value instanceof File && value.size > 0 && value.name !== "undefined") {
          filesToUpload.push({ key, file: value });
        } else if (typeof value === "string") {
          rawPayload[key] = value;
        }
      }
    } else if (payloadOrFormData && typeof payloadOrFormData === "object") {
      for (const [key, value] of Object.entries(payloadOrFormData)) {
        if (value instanceof File && value.size > 0) {
          filesToUpload.push({ key, file: value });
        } else {
          rawPayload[key] = value;
        }
      }
    }

    // 2. Upload any attached documents to Cloudflare R2
    if (filesToUpload.length > 0) {
      for (const { key, file } of filesToUpload) {
        const fileUrl = await uploadFileToR2(file, normalizedFormId);
        rawPayload[key] = fileUrl;
      }
    }

    // 3. Save directly into PostgreSQL
    await db.insert(formSubmissions).values({
      formId: normalizedFormId,
      data: rawPayload,
    });

    console.log(`[BACKEND] Successfully saved "${normalizedFormId}" submission to database.`);

    // 4. Revalidate paths
    revalidatePath(`/admin/forms/${normalizedFormId}/submissions`);
    revalidatePath("/admin/forms");
    if (normalizedFormId === "application") {
      revalidatePath("/admin/candidates");
    }

    return { success: true };

  } catch (error: any) {
    console.error(`[BACKEND] Form submission crash for "${normalizedFormId}":`, error);
    return { 
      success: false, 
      error: error?.message || "Failed to submit form. Please check database/storage configuration." 
    };
  }
}
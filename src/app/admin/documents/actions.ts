"use server";

import { db } from "@/lib/db";
import { legalDocs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateLegalDocument(slug: string, content: string, title: string) {
  try {
    console.log(`🔍 [DEBUG] REAL Server action triggered for: "${slug}"`);
    
    // 1. Check if the document already exists using the unique slug
    const existing = await db.query.legalDocs.findFirst({
      where: eq(legalDocs.slug, slug),
    });

    if (existing) {
      // 2. Update if it exists
      await db.update(legalDocs)
        .set({ 
          content: content, 
          updatedAt: new Date() 
        })
        .where(eq(legalDocs.slug, slug));
      console.log(`✅ [DEBUG] Database UPDATE successful.`);
    } else {
      // 3. Insert new row (PostgreSQL auto-generates the UUID for `id`)
      await db.insert(legalDocs).values({
        slug: slug,
        title: title,
        content: content,
        isPublic: true,
      });
      console.log(`✅ [DEBUG] Database INSERT successful.`);
    }

    revalidatePath("/admin/documents");
    revalidatePath(`/legal/${slug}`);
    
    return { success: true };
    
  } catch (error: any) {
    console.error(`❌ [CRITICAL DATABASE ERROR]:`, error);
    return { 
      success: false, 
      error: error?.message || "Failed to save document to database." 
    };
  }
}
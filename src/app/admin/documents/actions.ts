"use server";

import { db } from "@/lib/db";
import { legalDocs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "@/lib/db/errors";

export async function updateLegalDocument(slug: string, content: string, title: string) {
  try {
    if (!slug?.trim() || !title?.trim() || !content?.trim()) {
      return { success: false, error: "Slug, title, and document content are required." };
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    // 1. Check if the document already exists using the unique slug
    const existing = await db.query.legalDocs.findFirst({
      where: eq(legalDocs.slug, cleanSlug),
    });

    if (existing) {
      // 2. Update if it exists
      await db.update(legalDocs)
        .set({ 
          title: cleanTitle,
          content: cleanContent, 
          updatedAt: new Date() 
        })
        .where(eq(legalDocs.slug, cleanSlug));
    } else {
      // 3. Insert new row
      await db.insert(legalDocs).values({
        slug: cleanSlug,
        title: cleanTitle,
        content: cleanContent,
        isPublic: true,
      });
    }

    revalidatePath("/admin/documents");
    revalidatePath(`/legal/${cleanSlug}`);
    
    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, `Failed to save document "${slug}".`);
  }
}
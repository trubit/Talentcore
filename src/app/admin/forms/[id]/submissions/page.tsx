import { db } from "@/lib/db";
import { formSubmissions, formSchemas } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import SubmissionsClient from "./SubmissionsClient";

export const dynamic = "force-dynamic";

// Note: params is a Promise in modern Next.js
export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. AWAIT the params to ensure Next.js has finished parsing the URL
    const resolvedParams = await params;
    const currentFormId = resolvedParams.id;

    // Safety check: if there's no ID in the URL, bail out cleanly
    if (!currentFormId) {
      throw new Error("No form ID provided in the URL.");
    }

    // 2. Fetch the Form's Title from the schema table so the UI knows what category it's looking at
    const schemaRecord = await db
      .select({ title: formSchemas.schemaDefinition })
      .from(formSchemas)
      .where(eq(formSchemas.id, currentFormId))
      .limit(1);

    // 3. Fetch submissions STRICTLY for this specific form category using formId
    const rawSubmissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, currentFormId))
      .orderBy(desc(formSubmissions.createdAt));

    // 4. Format the raw database rows to match the Client UI
    const formattedSubmissions = rawSubmissions.map((sub: any) => ({
      id: sub.id,
      data: sub.data || {},
      submittedAt: new Date(sub.createdAt).toLocaleDateString("en-CA"),
    }));

    return (
  <SubmissionsClient 
    formId={currentFormId} 
    formTitle={String(schemaRecord[0]?.title || "Form")}
    submissions={formattedSubmissions} 
  />
);

  } catch (error) {
    console.error("[SUBMISSIONS] Error fetching data:", error);
    
    // Graceful fallback to prevent total crashes
    return (
      <div className="p-8 text-center text-brand-dark/50">
        <h2 className="font-bold text-lg text-brand-orange mb-2">Failed to Load Submissions</h2>
        <p>Could not load the submissions for this form. Please check your server logs.</p>
      </div>
    );
  }
}
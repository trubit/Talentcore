"use server";

import { db } from "@/lib/db";
import { candidates, formSubmissions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Candidate = {
  id: number | string;
  name: string;
  email: string;
  role: string;
  badges: string[];
  status: "Available" | "In-Review" | "Placed";
  dateAdded: string;
  resumeUrl?: string;
  bio?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  experience?: any[];
  education?: any[];
};

// 1. Update Candidate Status
export async function updateCandidateStatus(
  id: number | string, 
  newStatus: "Available" | "In-Review" | "Placed"
) {
  try {
    const dbStatus = newStatus === "In-Review" ? "IN_REVIEW" : newStatus.toUpperCase() as any;

    await db.update(candidates)
      .set({ 
        status: dbStatus,
        updatedAt: new Date()
      })
      .where(eq(candidates.id, id as any)); 
    
    console.log(`[BACKEND] Successfully updated candidate ${id} status to ${dbStatus}`);
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    console.error(`[BACKEND] Error updating candidate status:`, error);
    return { success: false, error: "Failed to update candidate status." };
  }
}

// 2. Delete Candidate Profile
export async function deleteCandidate(id: number | string) {
  try {
    await db.delete(candidates)
      .where(eq(candidates.id, id as any));
    
    console.log(`[BACKEND] Successfully deleted candidate ${id}`);
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    console.error(`[BACKEND] Error deleting candidate:`, error);
    return { success: false, error: "Failed to delete candidate." };
  }
}

// 3. Promote / Convert a Form Submission to Talent Pool
export async function convertSubmissionToCandidate(data: {
  fullName: string;
  email: string;
  role?: string;
  badges?: string[];
  resumeUrl?: string;
}) {
  try {
    if (!data.fullName || !data.email) {
      return { success: false, error: "Name and email are required to create a candidate." };
    }

    await db.insert(candidates).values({
      name: data.fullName, 
      email: data.email,
      role: data.role || "General Applicant", 
      badges: data.badges || [],
      status: "AVAILABLE",
      resumeUrl: data.resumeUrl,
    });

    console.log(`[BACKEND] Promoted submission to talent pool: ${data.email}`);
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    console.error(`[BACKEND] Error promoting submission to candidate:`, error);
    return { success: false, error: "Failed to promote candidate to talent pool." };
  }
}

// 4. Manually Add Candidate
export async function createCandidate(data: {
  name: string;
  email: string;
  role: string;
  status: "Available" | "In-Review" | "Placed";
  resumeUrl?: string; // <-- ADDED: Now accepts the resume link from the manual form
}) {
  try {
    const dbStatus = data.status === "In-Review" ? "IN_REVIEW" : data.status.toUpperCase() as any;

    const insertedRecord = await db.insert(candidates).values({
      name: data.name, 
      email: data.email,
      role: data.role, 
      badges: [],
      status: dbStatus,
      resumeUrl: data.resumeUrl, // <-- ADDED: Saves it directly to PostgreSQL
    }).returning();

    const dbRow = insertedRecord[0];

    console.log(`[BACKEND] Created new candidate manually: ${dbRow.name}`);
    revalidatePath("/admin/candidates");

    const newCandidate: Candidate = {
      id: dbRow.id,
      name: dbRow.name,
      email: dbRow.email,
      role: dbRow.role || "",
      badges: (dbRow.badges as string[]) || [],
      status: data.status,
      dateAdded: new Date().toLocaleDateString('en-CA'),
      resumeUrl: dbRow.resumeUrl || undefined, // <-- ADDED: Returns it to the UI instantly
    };

    return newCandidate;
    
  } catch (error) {
    console.error(`[BACKEND] Error creating candidate:`, error);
    throw new Error("Failed to create candidate record.");
  }
}

// 5. Fetch Form Submissions for the "Add Candidate" Modal
export async function getGraduateSubmissions() {
  try {
    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, "application")) // <-- ADDED: Strictly pulls only graduate applications!
      .orderBy(desc(formSubmissions.createdAt));

    return submissions.map((sub: any) => ({
      id: sub.id,
      data: sub.data || {},
      submittedAt: new Date(sub.createdAt).toLocaleDateString("en-CA"),
    }));
  } catch (error) {
    console.error("[BACKEND] Error fetching submissions for candidates:", error);
    return [];
  }
}

export async function updateCandidateProfile(id: string | number, data: Partial<Candidate>) {
  try {
    await db.update(candidates)
      .set({
        name: data.name,
        email: data.email,
        role: data.role,
        resumeUrl: data.resumeUrl,
        bio: data.bio,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
        experience: data.experience,
        education: data.education,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id as any));

    console.log(`[BACKEND] Successfully updated candidate profile: ${id}`);
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    console.error(`[BACKEND] Error updating candidate profile:`, error);
    return { success: false, error: "Failed to update profile." };
  }
}
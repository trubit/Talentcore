"use server";

import { db } from "@/lib/db";
import { candidates, formSubmissions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "@/lib/db/errors";

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
    
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to update candidate status.");
  }
}

// 2. Delete Candidate Profile
export async function deleteCandidate(id: number | string) {
  try {
    await db.delete(candidates)
      .where(eq(candidates.id, id as any));
    
    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to delete candidate.");
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
    if (!data.fullName?.trim() || !data.email?.trim()) {
      return { success: false, error: "Name and email are required to create a candidate." };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    // Check for existing candidate with same email
    const existing = await db.query.candidates.findFirst({
      where: eq(candidates.email, cleanEmail)
    });

    if (existing) {
      return { 
        success: false, 
        error: `A candidate with ${cleanEmail} is already in the talent pool.` 
      };
    }

    const [inserted] = await db.insert(candidates).values({
      name: data.fullName.trim(), 
      email: cleanEmail,
      role: data.role?.trim() || "General Applicant", 
      badges: Array.isArray(data.badges) ? data.badges : [],
      status: "AVAILABLE",
      resumeUrl: data.resumeUrl?.trim() || null,
    }).returning();

    revalidatePath("/admin/candidates");
    return { success: true, candidateId: inserted.id };
  } catch (error) {
    return handleDatabaseError(error, "Failed to promote candidate to talent pool.");
  }
}

// 4. Manually Add Candidate
export async function createCandidate(data: {
  name: string;
  email: string;
  role: string;
  status: "Available" | "In-Review" | "Placed";
  resumeUrl?: string;
}) {
  try {
    if (!data.name?.trim() || !data.email?.trim()) {
      return { success: false, error: "Candidate name and email are mandatory." };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const dbStatus = data.status === "In-Review" ? "IN_REVIEW" : data.status.toUpperCase() as any;

    const insertedRecord = await db.insert(candidates).values({
      name: data.name.trim(), 
      email: cleanEmail,
      role: data.role?.trim() || "General Applicant", 
      badges: [],
      status: dbStatus,
      resumeUrl: data.resumeUrl?.trim() || null,
    }).returning();

    const dbRow = insertedRecord[0];

    revalidatePath("/admin/candidates");

    const newCandidate: Candidate = {
      id: dbRow.id,
      name: dbRow.name,
      email: dbRow.email,
      role: dbRow.role || "",
      badges: (dbRow.badges as string[]) || [],
      status: data.status,
      dateAdded: new Date().toLocaleDateString('en-CA'),
      resumeUrl: dbRow.resumeUrl || undefined,
    };

    return newCandidate;
  } catch (error) {
    return handleDatabaseError(error, "Failed to create candidate record.");
  }
}

// 5. Fetch Form Submissions for the "Add Candidate" Modal
export async function getGraduateSubmissions() {
  try {
    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, "application"))
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
        name: data.name?.trim(),
        email: data.email?.trim()?.toLowerCase(),
        role: data.role?.trim(),
        resumeUrl: data.resumeUrl?.trim() || null,
        bio: data.bio?.trim() || null,
        linkedinUrl: data.linkedinUrl?.trim() || null,
        portfolioUrl: data.portfolioUrl?.trim() || null,
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id as any));

    revalidatePath("/admin/candidates");
    return { success: true };
  } catch (error) {
    return handleDatabaseError(error, "Failed to update profile.");
  }
}
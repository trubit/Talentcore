"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AdminJob = {
  id: string;
  title: string;
  company: string;
  empType: string;
  datePosted: string;
  status: "ACTIVE" | "CLOSED" | "ARCHIVED";
  isFeatured: boolean;
  gradFillCode: string | null;
};

// 1. Create a New Job Posting
export async function createJob(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const industry = formData.get("industry") as string;
    const salary = formData.get("salary") as string;
    const empType = formData.get("empType") as string;
    const workMode = formData.get("workMode") as string;
    const deadline = formData.get("deadline") as string;
    const description = formData.get("description") as string;
    const skillBadgesRaw = formData.get("skillBadges") as string;
    const applicationMethod = formData.get("applicationMethod") as string;
    const gradFillCodeRaw = formData.get("gradFillCode") as string;
    const isFeatured = formData.get("isFeatured") === "on";

    const gradFillCode = gradFillCodeRaw?.trim() ? gradFillCodeRaw.trim() : null;
    const expiresAt = deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await db.insert(jobs).values({
      title,
      company,
      location,
      industry,
      salary,
      empType,
      workMode,
      description,
      skillBadges: skillBadgesRaw?.trim() || null,
      applicationMethod,
      gradFillCode,
      isFeatured,
      status: "ACTIVE",
      expiresAt,
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("[BACKEND] Failed to create job:", error);
    return { success: false, error: error.message || "Failed to create job posting." };
  }
}

// 2. Update an Existing Job Posting
export async function updateJobAction(jobId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const industry = formData.get("industry") as string;
    const salary = formData.get("salary") as string;
    const empType = formData.get("empType") as string;
    const workMode = formData.get("workMode") as string;
    const deadline = formData.get("deadline") as string;
    const status = (formData.get("status") as "ACTIVE" | "CLOSED" | "ARCHIVED") || "ACTIVE";
    const description = formData.get("description") as string;
    const skillBadgesRaw = formData.get("skillBadges") as string;
    const applicationMethod = formData.get("applicationMethod") as string;
    const gradFillCodeRaw = formData.get("gradFillCode") as string;
    const isFeatured = formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";

    const gradFillCode = gradFillCodeRaw?.trim() ? gradFillCodeRaw.trim() : null;
    const expiresAt = deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await db
      .update(jobs)
      .set({
        title,
        company,
        location,
        industry,
        salary,
        empType,
        workMode,
        expiresAt,
        status,
        description,
        skillBadges: skillBadgesRaw?.trim() || null,
        applicationMethod,
        gradFillCode,
        isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${jobId}/edit`);
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error(`[BACKEND] Error updating job ID ${jobId}:`, error);
    return { success: false, error: error.message || "Failed to update job." };
  }
}

// 3. Duplicate an Existing Job
export async function duplicateJob(id: string) {
  try {
    const sourceJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!sourceJobs.length) {
      return { success: false, error: "Source job not found to duplicate." };
    }

    const source = sourceJobs[0];

    const newExpiresAt = source.expiresAt
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await db.insert(jobs).values({
      title: `Copy of ${source.title}`,
      company: source.company,
      location: source.location,
      industry: source.industry,
      salary: source.salary,
      empType: source.empType,
      workMode: source.workMode,
      description: source.description,
      skillBadges: source.skillBadges,
      applicationMethod: source.applicationMethod,
      gradFillCode: source.gradFillCode,
      isFeatured: false,
      status: "ACTIVE",
      expiresAt: newExpiresAt,
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error(`[BACKEND] Error duplicating job ID ${id}:`, error);
    return { success: false, error: error.message || "Failed to duplicate job." };
  }
}

// 4. Update Job Status
export async function updateJobStatus(id: string, newStatus: "ACTIVE" | "CLOSED" | "ARCHIVED") {
  try {
    await db
      .update(jobs)
      .set({ 
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id));
    
    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error(`[BACKEND] Error updating job status for ID ${id}:`, error);
    return { success: false, error: error.message || "Failed to update job status." };
  }
}

// 5. Delete Job Posting
export async function deleteJob(id: string) {
  try {
    await db.delete(jobs).where(eq(jobs.id, id));
    
    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error(`[BACKEND] Error deleting job ID ${id}:`, error);
    return { success: false, error: error.message || "Failed to delete job." };
  }
}
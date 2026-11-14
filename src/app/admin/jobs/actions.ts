"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "@/lib/db/errors";

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
    const title = (formData.get("title") as string)?.trim();
    const company = (formData.get("company") as string)?.trim();
    const location = (formData.get("location") as string)?.trim() || "Remote";
    const industry = (formData.get("industry") as string)?.trim() || "General";
    const salary = (formData.get("salary") as string)?.trim() || "Competitive";
    const empType = (formData.get("empType") as string)?.trim() || "Full-time";
    const workMode = (formData.get("workMode") as string)?.trim() || "Remote";
    const deadline = (formData.get("deadline") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const skillBadgesRaw = (formData.get("skillBadges") as string)?.trim();
    const applicationMethod = (formData.get("applicationMethod") as string)?.trim();
    const gradFillCodeRaw = (formData.get("gradFillCode") as string)?.trim();
    const isFeatured = formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";

    if (!title || !company || !description || !applicationMethod) {
      return { 
        success: false, 
        error: "Please complete all mandatory fields: Title, Company, Description, and Application Method." 
      };
    }

    const gradFillCode = gradFillCodeRaw && gradFillCodeRaw.length > 0 ? gradFillCodeRaw : null;
    const skillBadges = skillBadgesRaw && skillBadgesRaw.length > 0 ? skillBadgesRaw : null;

    let expiresAt: Date;
    if (deadline && !isNaN(Date.parse(deadline))) {
      expiresAt = new Date(deadline);
    } else {
      expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }

    try {
      await db.insert(jobs).values({
        title,
        company,
        location,
        industry,
        salary,
        empType,
        workMode,
        description,
        skillBadges,
        applicationMethod,
        gradFillCode,
        isFeatured,
        status: "ACTIVE",
        expiresAt,
      });
    } catch (insertErr: any) {
      const errMsg = (insertErr?.cause?.message || insertErr?.message || "").toLowerCase();
      // Graceful fallback if database enum expects lowercase 'active'
      if (errMsg.includes("enum") || errMsg.includes("job_status") || errMsg.includes("invalid input value")) {
        console.warn("[BACKEND] Retrying insert with lowercase status value 'active'...");
        await db.insert(jobs).values({
          title,
          company,
          location,
          industry,
          salary,
          empType,
          workMode,
          description,
          skillBadges,
          applicationMethod,
          gradFillCode,
          isFeatured,
          status: "active" as any,
          expiresAt,
        });
      } else {
        throw insertErr;
      }
    }

    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, "Failed to publish job. Please verify your inputs and try again.");
  }
}

// 2. Update an Existing Job Posting
export async function updateJobAction(jobId: string, formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    const company = (formData.get("company") as string)?.trim();
    const location = (formData.get("location") as string)?.trim() || "Remote";
    const industry = (formData.get("industry") as string)?.trim() || "General";
    const salary = (formData.get("salary") as string)?.trim() || "Competitive";
    const empType = (formData.get("empType") as string)?.trim() || "Full-time";
    const workMode = (formData.get("workMode") as string)?.trim() || "Remote";
    const deadline = (formData.get("deadline") as string)?.trim();
    const rawStatus = (formData.get("status") as string)?.trim() || "ACTIVE";
    const description = (formData.get("description") as string)?.trim();
    const skillBadgesRaw = (formData.get("skillBadges") as string)?.trim();
    const applicationMethod = (formData.get("applicationMethod") as string)?.trim();
    const gradFillCodeRaw = (formData.get("gradFillCode") as string)?.trim();
    const isFeatured = formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";

    if (!title || !company || !description || !applicationMethod) {
      return { 
        success: false, 
        error: "Please complete all mandatory fields: Title, Company, Description, and Application Method." 
      };
    }

    const gradFillCode = gradFillCodeRaw && gradFillCodeRaw.length > 0 ? gradFillCodeRaw : null;
    const skillBadges = skillBadgesRaw && skillBadgesRaw.length > 0 ? skillBadgesRaw : null;

    let expiresAt: Date;
    if (deadline && !isNaN(Date.parse(deadline))) {
      expiresAt = new Date(deadline);
    } else {
      expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }

    try {
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
          status: rawStatus as any,
          description,
          skillBadges,
          applicationMethod,
          gradFillCode,
          isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));
    } catch (updateErr: any) {
      const errMsg = (updateErr?.cause?.message || updateErr?.message || "").toLowerCase();
      if (errMsg.includes("enum") || errMsg.includes("job_status") || errMsg.includes("invalid input value")) {
        console.warn("[BACKEND] Retrying update with lowercase status value...");
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
            status: rawStatus.toLowerCase() as any,
            description,
            skillBadges,
            applicationMethod,
            gradFillCode,
            isFeatured,
            updatedAt: new Date(),
          })
          .where(eq(jobs.id, jobId));
      } else {
        throw updateErr;
      }
    }

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${jobId}/edit`);
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, "Failed to update job posting. Please check your inputs.");
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

    const duplicateTitle = source.title.endsWith("(Copy)") 
      ? source.title 
      : `${source.title} (Copy)`;

    await db.insert(jobs).values({
      title: duplicateTitle,
      company: source.company,
      location: source.location,
      industry: source.industry,
      salary: source.salary,
      empType: source.empType,
      workMode: source.workMode,
      description: source.description,
      skillBadges: source.skillBadges,
      applicationMethod: source.applicationMethod,
      gradFillCode: source.gradFillCode ? `${source.gradFillCode}-COPY` : null,
      isFeatured: false,
      status: "ARCHIVED", // Default to ARCHIVED/Draft so it does not accidentally publish immediately
      expiresAt: newExpiresAt,
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    return handleDatabaseError(error, `Failed to duplicate job ID ${id}.`);
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
    return handleDatabaseError(error, `Failed to update job status for ID ${id}.`);
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
    return handleDatabaseError(error, `Failed to delete job ID ${id}.`);
  }
}
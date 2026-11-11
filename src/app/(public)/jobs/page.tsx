import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import JobBoardClient, { Job } from "./JobBoardClient";

export const dynamic = "force-dynamic";

export default async function PublicJobBoardPage() {
  try {
    const rawJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "ACTIVE"))
      .orderBy(desc(jobs.createdAt));

    const formattedJobs: Job[] = rawJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      empType: job.empType,
      workMode: job.workMode,
      salary: job.salary,
      datePosted: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recent",
      industry: job.industry,
      isFeatured: job.isFeatured || false,
      gradFillCode: job.gradFillCode,
    }));

    return <JobBoardClient initialJobs={formattedJobs} />;
  } catch (error) {
    console.error("[BACKEND] Error fetching jobs for job board:", error);
    return <JobBoardClient initialJobs={[]} />;
  }
}
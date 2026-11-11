import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import JobsClient from "./JobsClient";
import { AdminJob } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  try {
    const rawJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    const formattedJobs: AdminJob[] = rawJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      empType: job.empType,
      datePosted: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recent",
      status: job.status as "ACTIVE" | "CLOSED" | "ARCHIVED",
      isFeatured: job.isFeatured || false,
      gradFillCode: job.gradFillCode,
    }));

    return <JobsClient initialJobs={formattedJobs} />;
  } catch (error) {
    console.error("[BACKEND] Error fetching admin jobs:", error);
    return <JobsClient initialJobs={[]} />;
  }
}
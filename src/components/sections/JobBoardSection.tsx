import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import JobBoardClient, { Job } from "./JobBoardClient";

export default async function JobBoardSection() {
  try {
    // 1. Fetch the 6 most recent ACTIVE jobs from PostgreSQL
    const rawJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "ACTIVE"))
      .orderBy(desc(jobs.createdAt))
      .limit(6);

    // 2. Relative timestamp calculator
    const calculateTimeAgo = (date: Date) => {
      const diffMs = new Date().getTime() - new Date(date).getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHrs / 24);

      if (diffHrs < 1) return "Just now";
      if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    };

    // 3. Map database columns to JobBoardClient props
    const formattedJobs: Job[] = rawJobs.map((job, index) => ({
      id: job.id,
      company: job.company || "Hiring Partner",
      title: job.title,
      type: job.empType || "Full Time",
      location: job.location || "Remote",
      pay: job.salary || "Competitive",
      period: "Per month",
      theme: index % 2 === 0 ? "green" : "dark",
      timeLabel: job.createdAt ? calculateTimeAgo(new Date(job.createdAt)) : undefined,
    }));

    return <JobBoardClient jobs={formattedJobs} />;
  } catch (error) {
    console.error("[BACKEND] Error fetching jobs for homepage:", error);
    return <JobBoardClient jobs={[]} />;
  }
}
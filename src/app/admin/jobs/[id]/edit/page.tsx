import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditJobForm from "./EditJobForm";

export const dynamic = "force-dynamic";

interface EditJobPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const resolvedParams = await params;
  const jobId = resolvedParams.id;

  // Fetch the specific job record from PostgreSQL
  const jobResults = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  if (!jobResults || jobResults.length === 0) {
    notFound();
  }

  const job = jobResults[0];

  return <EditJobForm job={job} />;
}
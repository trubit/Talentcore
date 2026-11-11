import { db } from "@/lib/db";
import { candidates } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import CandidatesClient, { ExtendedCandidate } from "./CandidatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  let list: ExtendedCandidate[] = [];

  try {
    const rawCandidates = await db.select().from(candidates).orderBy(desc(candidates.createdAt));
    list = rawCandidates.map((c) => {
      let statusFormatted: "Available" | "In-Review" | "Placed" = "Available";
      if (c.status === "IN_REVIEW") statusFormatted = "In-Review";
      else if (c.status === "PLACED") statusFormatted = "Placed";

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        role: c.role,
        badges: Array.isArray(c.badges) ? (c.badges as string[]) : [],
        status: statusFormatted,
        dateAdded: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
        resumeUrl: c.resumeUrl || undefined,
        bio: c.bio || undefined,
        linkedinUrl: c.linkedinUrl || undefined,
        portfolioUrl: c.portfolioUrl || undefined,
        experience: Array.isArray(c.experience) ? c.experience : [],
        education: Array.isArray(c.education) ? c.education : [],
      };
    });
  } catch (error) {
    console.error("[BACKEND] Error loading candidates:", error);
  }

  return <CandidatesClient initialCandidates={list} />;
}


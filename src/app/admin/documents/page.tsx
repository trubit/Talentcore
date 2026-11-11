import { db } from "@/lib/db";
import DocumentsClient from "./DocumentsClient";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  // 1. Fallback default templates (used if the DB is empty or during build)
  const defaultDocs = [
    {
      id: "service_agreement",
      title: "Employer Service Agreement",
      slug: "employer-service-agreement",
      content: "This Employer Service Agreement is entered into by and between TalentCore and the engaging organization...",
      lastUpdated: "Aug 12, 2026"
    },
    {
      id: "terms",
      title: "Terms and Conditions",
      slug: "terms-and-conditions",
      content: "Welcome to TalentCore. By accessing our platform and services, you agree to comply with our terms...",
      lastUpdated: "Jul 25, 2026"
    },
    {
      id: "privacy",
      title: "Data Privacy Policy",
      slug: "privacy-policy",
      content: "At TalentCore, we take your privacy seriously. Candidate and employer data is processed strictly in accordance with applicable data protection regulations...",
      lastUpdated: "Aug 01, 2026"
    }
  ];

  let dbDocs: any[] = [];
  try {
    // 2. Fetch live documents from your database
    dbDocs = await db.query.legalDocs.findMany();
  } catch (error) {
    console.error("[BACKEND] Database unavailable for legal docs, using default templates:", error);
  }

  // 3. Merge database records with the defaults
  const initialDocs = defaultDocs.map(def => {
    const found = dbDocs.find(d => d.slug === def.slug);
    return found ? {
      id: found.id,
      title: found.title,
      slug: found.slug,
      content: found.content,
      lastUpdated: new Date(found.updatedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    } : def;
  });

  return <DocumentsClient initialDocs={initialDocs} />;
}
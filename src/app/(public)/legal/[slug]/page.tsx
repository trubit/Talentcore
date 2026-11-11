import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { legalDocs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const FALLBACK_DOCS: Record<string, { title: string; content: string }> = {
  "employer-service-agreement": {
    title: "Employer Service Agreement",
    content: "This Employer Service Agreement governs the terms under which TalentCore provides talent matching and hiring support services to employer partners. All candidate introductions, candidate screening, and fee structures adhere to our transparent professional service model.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    content: "Welcome to TalentCore. By accessing and using our application, websites, and associated talent matching workflows, you agree to be bound by these Terms and Conditions. Our platform connects candidates and employers under fair and professional industry standards.",
  },
  "privacy-policy": {
    title: "Data Privacy Policy",
    content: "At TalentCore, we take data privacy and protection seriously. Candidate and employer data is processed strictly in accordance with applicable privacy standards. We do not sell or disclose candidate information to third parties without consent.",
  },
};

async function getLegalDocument(slug: string) {
  try {
    // 1. Query the live database by slug using Drizzle ORM
    const doc = await db.query.legalDocs.findFirst({
      where: eq(legalDocs.slug, slug),
    });

    if (doc) {
      const formattedDate = doc.updatedAt
        ? new Date(doc.updatedAt).toLocaleDateString("en-US", { 
            month: "short", 
            day: "2-digit", 
            year: "numeric" 
          }) 
        : "Recent";

      return {
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        lastUpdated: formattedDate,
      };
    }
  } catch (error) {
    console.error(`[BACKEND] Failed to fetch legal document for slug ${slug}:`, error);
  }

  // Fallback to static legal content
  if (FALLBACK_DOCS[slug]) {
    return {
      title: FALLBACK_DOCS[slug].title,
      slug,
      content: FALLBACK_DOCS[slug].content,
      lastUpdated: "Recent",
    };
  }

  return null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);

  if (!doc) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-white pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-brand-dark/70 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark/70" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Document Header */}
        <div className="border-b border-brand-ash/60 pb-6 sm:pb-8 md:pb-10 mb-8 sm:mb-12">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-4 sm:mb-6 shadow-xs">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          
          <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark leading-tight sm:leading-[1.15] mb-3 sm:mb-4 tracking-tight">
            {doc.title}
          </h1>
          
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-dark/60 font-medium">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark/50" />
            <span>Last Updated: {doc.lastUpdated}</span>
          </div>
        </div>
        
        {/* Document Content Canvas */}
        <div className="bg-brand-ash/10 border border-brand-ash/50 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 md:p-10 shadow-xs">
          <div className="text-brand-dark/85 whitespace-pre-wrap leading-relaxed text-xs xs:text-sm sm:text-base font-body tracking-normal">
            {doc.content}
          </div>
        </div>

      </div>
    </main>
  );
}
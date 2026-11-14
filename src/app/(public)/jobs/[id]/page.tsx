import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Briefcase, Clock, 
  CalendarDays, Zap, Star, Share2, Flag, 
  ArrowRight, MessageCircle 
} from "lucide-react";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
import ApplyButton from "./ApplyButton";

export const dynamic = "force-dynamic";

interface JobDetailsProps {
  params: Promise<{ id: string }> | { id: string };
}

function formatDescription(raw: string = ""): string {
  if (!raw) return "";

  if (raw.includes("<p>") || raw.includes("<div>")) {
    return raw;
  }

  const html = raw
    .replace(/^### (.*$)/gim, '<h3 class="font-header font-bold text-base sm:text-lg text-brand-dark mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-header font-bold text-lg sm:text-xl text-brand-dark mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-brand-dark">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-brand-dark">$1</em>')
    .replace(/<u>(.*?)<\/u>/gim, '<u class="underline text-brand-dark">$1</u>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-green underline">$1</a>')
    .replace(/^[•\-] (.*$)/gim, '<li class="ml-4 list-disc text-brand-dark/80 mb-1.5 leading-relaxed">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-brand-dark/80 mb-1.5 leading-relaxed">$1</li>')
    .replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br />');

  return `<p class="mb-4 leading-relaxed">${html}</p>`;
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Fetch current active job
  const jobRecord = await db.query.jobs.findFirst({
    where: and(
      eq(jobs.id, id),
      eq(jobs.status, "ACTIVE")
    ),
  });

  if (!jobRecord) {
    notFound();
  }

  // 2. Fetch Similar Jobs matching the same industry (up to 3)
  let similarRecords = await db.query.jobs.findMany({
    where: and(
      ne(jobs.id, id),
      eq(jobs.status, "ACTIVE"),
      jobRecord.industry ? eq(jobs.industry, jobRecord.industry) : undefined
    ),
    orderBy: [desc(jobs.createdAt)],
    limit: 3,
  });

  // Fallback: If less than 3 jobs in the same industry, backfill with newest active jobs
  if (similarRecords.length < 3) {
    const existingIds = [id, ...similarRecords.map((j) => j.id)];
    const fallbackJobs = await db.query.jobs.findMany({
      where: and(
        eq(jobs.status, "ACTIVE"),
        ne(jobs.id, id)
      ),
      orderBy: [desc(jobs.createdAt)],
      limit: 6,
    });

    const additionalJobs = fallbackJobs.filter((j) => !existingIds.includes(j.id));
    similarRecords = [...similarRecords, ...additionalJobs].slice(0, 3);
  }

  // 3. Format Date Values
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Ongoing";
    return new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
      day: "2-digit", 
      year: "numeric" 
    });
  };

  // 4. Safely extract badges from comma-separated string
  const badgesArray: string[] = jobRecord.skillBadges
    ? jobRecord.skillBadges.split(",").map((b) => b.trim()).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-brand-white pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 relative">
      
      {/* Top Navigation & Action Controls */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-brand-dark/70 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark/70" /> 
          <span>Back to Job Board</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ash/20 border border-brand-ash/60 text-brand-dark/70 hover:text-brand-dark hover:bg-brand-ash/40 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            aria-label="Share Job"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-dark/60" /> 
            <span>Share</span>
          </button>
          
          <button 
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ash/20 border border-brand-ash/60 text-brand-dark/70 hover:text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            aria-label="Report Job"
          >
            <Flag className="w-3.5 h-3.5 text-brand-dark/60" /> 
            <span>Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Job Header Card */}
        <div className="mb-8 sm:mb-12 border-b border-brand-ash/60 pb-8 sm:pb-12">
          
          {/* Badge Indicators */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {jobRecord.isFeatured && (
              <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2.5 py-0.5 rounded-md text-[10px] xs:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-brand-orange" /> Featured
              </span>
            )}
            {jobRecord.gradFillCode && (
              <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-0.5 rounded-md text-[10px] xs:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-brand-green" /> {jobRecord.gradFillCode}
              </span>
            )}
            <span className="bg-brand-ash/30 text-brand-dark/70 px-2.5 py-0.5 rounded-md text-[10px] xs:text-xs font-bold uppercase tracking-wider">
              Entry-Level
            </span>
          </div>
          
          {/* Job Title & Company */}
          <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark leading-tight sm:leading-[1.15] mb-2 sm:mb-3 tracking-tight">
            {jobRecord.title}
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-brand-green font-bold mb-4 sm:mb-6">
            {jobRecord.company}
          </p>

          {/* Quick Meta Ribbon */}
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-brand-dark/75">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-brand-green shrink-0" /> 
              <span>{jobRecord.location}</span>
              <span className="text-brand-dark/30">•</span>
              <span>{jobRecord.workMode}</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-medium">
              <Briefcase className="w-4 h-4 text-brand-orange shrink-0" /> 
              <span>{jobRecord.empType}</span>
              <span className="text-brand-dark/30">•</span>
              <span>Entry-Level</span>
            </div>
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Job Description */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <h2 className="font-header text-xl sm:text-2xl font-bold text-brand-dark mb-4 sm:mb-6 tracking-tight">
              About the Role
            </h2>
            
            {/* Formatted Description Body */}
            <div 
              className="prose prose-brand max-w-none text-brand-dark/80 text-xs xs:text-sm sm:text-base leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: formatDescription(jobRecord.description) }}
            />

            {/* Skill Badges List */}
            {badgesArray.length > 0 && (
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-brand-ash/60">
                <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-3 sm:mb-4">
                  Required Skill Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {badgesArray.map((badge, i) => (
                    <span 
                      key={i} 
                      className="bg-brand-ash/20 border border-brand-ash/60 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-brand-dark/80 font-semibold shadow-2xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Facts & Apply Card */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-28">
            
            {/* Overview Box */}
            <div className="bg-brand-ash/20 border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-7 shadow-xs">
              <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-4 sm:mb-6">
                Job Overview
              </h3>
              
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <p className="text-[10px] xs:text-xs text-brand-dark/50 uppercase tracking-wider font-bold mb-0.5">
                    Salary
                  </p>
                  <p className="font-bold text-brand-dark text-xs sm:text-sm">
                    {jobRecord.salary || "Competitive"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] xs:text-xs text-brand-dark/50 uppercase tracking-wider font-bold mb-0.5">
                    Industry
                  </p>
                  <p className="font-semibold text-brand-dark text-xs sm:text-sm">
                    {jobRecord.industry || "General"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] xs:text-xs text-brand-dark/50 uppercase tracking-wider font-bold mb-0.5">
                    Date Posted
                  </p>
                  <p className="font-semibold text-brand-dark text-xs sm:text-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" /> 
                    <span>{formatDate(jobRecord.createdAt)}</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] xs:text-xs text-brand-dark/50 uppercase tracking-wider font-bold mb-0.5">
                    Application Deadline
                  </p>
                  <p className="font-semibold text-brand-dark text-xs sm:text-sm flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-brand-green" /> 
                    <span>{formatDate(jobRecord.expiresAt)}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Application Action Trigger */}
              <ApplyButton 
                method={jobRecord.applicationMethod} 
                jobTitle={jobRecord.title} 
                gradFillCode={jobRecord.gradFillCode}
              />
            </div>

            {/* Official WhatsApp Network Channel Link */}
            <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-2.5">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
              </div>
              <h4 className="font-bold text-brand-dark text-xs sm:text-sm mb-1">
                Join TalentCore Network
              </h4>
              <p className="text-brand-dark/70 text-[11px] sm:text-xs leading-relaxed mb-3">
                Join our talent network to receive direct referral updates and job opening alerts.
              </p>
              <a 
                href="https://bit.ly/gradfill-network" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-orange font-bold text-xs hover:underline active:scale-95 transition-all"
              >
                <span>Join Network</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

        {/* Similar Jobs (Filtered by Industry) */}
        {similarRecords.length > 0 && (
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-brand-ash/60">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-header text-lg sm:text-2xl font-bold text-brand-dark tracking-tight">
                Similar Jobs in {jobRecord.industry || "General"}
              </h2>
              <Link 
                href="/jobs" 
                className="text-xs sm:text-sm font-bold text-brand-green hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {similarRecords.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
                  <div className="bg-brand-white border border-brand-ash/60 p-4 sm:p-5 rounded-2xl hover:shadow-card-hover hover:border-brand-green/40 active:scale-[0.99] transition-all shadow-xs">
                    <h3 className="font-bold text-sm sm:text-base text-brand-dark mb-1 group-hover:text-brand-green transition-colors leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-dark/70 mb-3 font-medium">
                      {job.company}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] sm:text-xs text-brand-dark/50">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-brand-green" /> {job.location}
                      </span>
                      <span className="text-brand-dark/30">•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Briefcase className="w-3 h-3 text-brand-orange" /> {job.workMode}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
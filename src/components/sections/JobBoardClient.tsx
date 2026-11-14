"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type Job = {
  id: string | number;
  company: string;
  title: string;
  type: string;
  location: string;
  pay: string;
  period: string;
  theme: string;
  timeLabel?: string;
};

// Fallbacks are only used if the database is completely empty
const FALLBACK_JOBS: Job[] = [
  { id: 1, company: "TechNova", title: "Product Manager", timeLabel: "2 hours ago", type: "Full Time", location: "Remote", pay: "₦150k-250k", period: "Per month", theme: "green" },
  { id: 2, company: "Creative HQ", title: "Brand Designer", timeLabel: "5 hours ago", type: "Part Time", location: "Lagos", pay: "₦85k-120k", period: "Per month", theme: "dark" },
];

export default function JobBoardClient({ jobs = [] }: { jobs?: Job[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayJobs = jobs.length > 0 ? jobs : FALLBACK_JOBS;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <h2 className="font-header text-2xl xs:text-3xl sm:text-4xl font-bold text-brand-dark mb-2 tracking-tight">
            Latest Job Openings
          </h2>
          <p className="text-brand-dark/75 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
            Browse the latest job vacancies and get matched to these employers to land your first job today.
          </p>
        </div>
        
        {/* Controls Bar: Scroll Arrows + Compact Vacancies Button */}
        <div className="flex items-center justify-between gap-3 w-full pt-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll("left")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-ash/80 bg-brand-white flex items-center justify-center hover:bg-brand-ash/40 active:scale-95 transition-all text-brand-dark shadow-xs"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-ash/80 bg-brand-white flex items-center justify-center hover:bg-brand-ash/40 active:scale-95 transition-all text-brand-dark shadow-xs"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <Link 
            href="/jobs" 
            className="flex items-center gap-1 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border border-brand-green bg-brand-green/10 text-brand-green font-bold text-xs sm:text-sm hover:bg-brand-green hover:text-brand-white active:scale-95 transition-all shrink-0"
          >
            <span>All Vacancies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 sm:pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {displayJobs.map((job) => (
          <div 
            key={job.id} 
            className={`shrink-0 w-[84vw] xs:w-[300px] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 flex flex-col justify-between shadow-card-hover ${
              job.theme === "green" 
                ? "bg-gradient-to-br from-brand-green to-brand-green/80 text-brand-white" 
                : "bg-brand-dark text-brand-white"
            }`}
          >
            {/* Logo Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-1 opacity-80">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white -ml-2 mix-blend-overlay"></div>
                <div className="w-5 h-full rounded-r-full bg-white ml-0.5"></div>
              </div>
            </div>

            {/* Meta & Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs opacity-80 mb-1.5">
                <span className="font-medium">{job.company}</span>
                {job.timeLabel && (
                  <>
                    <span>•</span>
                    <span>{job.timeLabel}</span>
                  </>
                )}
              </div>
              
              <h3 className="font-header text-lg sm:text-2xl font-bold tracking-tight mb-3 text-brand-white leading-snug">
                {job.title}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md bg-white/10 border border-white/10 font-medium">
                  {job.type}
                </span>
                <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md bg-white/10 border border-white/10 font-medium">
                  {job.location}
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-white/10 mb-4 sm:mb-6" />

            {/* Salary & Action */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="font-bold text-base sm:text-xl text-brand-white leading-tight">{job.pay}</div>
                <div className="text-[11px] sm:text-xs opacity-80 text-brand-white">{job.period}</div>
              </div>
              <Link 
                href={`/jobs/${job.id}`}
                className="bg-brand-white text-brand-dark px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange hover:text-white active:scale-95 transition-all text-center shrink-0"
              >
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
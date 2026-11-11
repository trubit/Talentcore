"use client";

import { useState, useMemo } from "react";
import { 
  Search, MapPin, Briefcase, Clock, 
  Filter, Star, Zap, X, ChevronDown, ArrowRight
} from "lucide-react";
import Link from "next/link";

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  empType: string;
  workMode: string;
  salary: string;
  datePosted: string;
  industry: string;
  isFeatured: boolean;
  gradFillCode: string | null;
}

export default function JobBoardClient({ initialJobs = [] }: { initialJobs: Job[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter States
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>([]);

  // Toggle filter arrays
  const toggleFilter = (state: string[], setState: (val: string[]) => void, value: string) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedWorkModes([]);
    setSelectedEmpTypes([]);
  };

  const activeFiltersCount =
    selectedWorkModes.length +
    selectedEmpTypes.length +
    (locationQuery ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Live Filtering Logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const searchMatch = 
        !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.gradFillCode && job.gradFillCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const locationMatch =
        !locationQuery ||
        job.location?.toLowerCase().includes(locationQuery.toLowerCase()) ||
        job.workMode?.toLowerCase().includes(locationQuery.toLowerCase());

      const modeMatch = selectedWorkModes.length === 0 || selectedWorkModes.includes(job.workMode);
      const typeMatch = selectedEmpTypes.length === 0 || selectedEmpTypes.includes(job.empType);

      return searchMatch && locationMatch && modeMatch && typeMatch;
    });
  }, [initialJobs, searchQuery, locationQuery, selectedWorkModes, selectedEmpTypes]);

  const featuredJobs = filteredJobs.filter((job) => job.isFeatured);
  const regularJobs = filteredJobs.filter((job) => !job.isFeatured);

  return (
    <main className="min-h-screen bg-brand-ash/10 pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-20 md:pb-24 relative">
      
      {/* Hero & Search Section */}
      <section className="bg-brand-dark pt-14 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 mb-8 sm:mb-12 rounded-b-3xl sm:rounded-b-[2.5rem] relative overflow-hidden shadow-brand-glow">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-brand-green/20 rounded-full blur-[90px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-orange/20 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Content Container */}
        <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center">
          
          {/* Verified Vacancies Badge */}
          <div 
            className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full mb-4 border shadow-sm"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              borderColor: "rgba(34, 197, 94, 0.35)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span 
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#4ADE80" }}
            >
              Verified Vacancies
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className="font-header text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight !text-white"
            style={{ color: "#FFFFFF" }}
          >
            Find Your Next Role
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto font-light leading-relaxed !text-white/85"
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            Real entry-level roles. No experience? No problem.
          </p>

          {/* Search Inputs Bar */}
          <div className="w-full max-w-3xl bg-white p-2 sm:p-2.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 border border-brand-ash/50 text-brand-dark">
            
            {/* Title / Keyword Search */}
            <div className="flex-1 flex items-center px-3.5 py-2.5 md:py-1 border-b md:border-b-0 md:border-r border-brand-ash/60">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark/60 shrink-0 mr-2.5" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or Job Code..." 
                className="w-full bg-transparent border-none outline-none text-brand-dark text-xs sm:text-sm placeholder:text-brand-dark/50 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="p-1 text-brand-dark/50 hover:text-brand-dark"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Search */}
            <div className="flex-1 flex items-center px-3.5 py-2.5 md:py-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark/60 shrink-0 mr-2.5" />
              <input 
                type="text" 
                placeholder="Location (e.g. Lagos, Remote)..." 
                className="w-full bg-transparent border-none outline-none text-brand-dark text-xs sm:text-sm placeholder:text-brand-dark/50 font-medium"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
              {locationQuery && (
                <button 
                  onClick={() => setLocationQuery("")} 
                  className="p-1 text-brand-dark/50 hover:text-brand-dark"
                  aria-label="Clear location"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Button */}
            <button className="w-full md:w-auto bg-brand-green text-white px-7 py-3 md:py-2.5 rounded-xl md:rounded-full text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-95 transition-all shrink-0 text-center shadow-md cursor-pointer">
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Main Layout: Filters + Job Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full space-y-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-1 bg-white border border-brand-ash/60 px-4 py-3 rounded-xl flex items-center justify-between font-semibold text-brand-dark text-xs sm:text-sm shadow-xs active:scale-98 transition-all"
            >
              <span className="flex items-center gap-2 text-brand-dark">
                <Filter className="w-4 h-4 text-brand-green" /> 
                <span className="font-bold">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-green text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-brand-dark transition-transform duration-200 ${showMobileFilters ? "rotate-180 text-brand-orange" : ""}`} />
            </button>

            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters} 
                className="px-3.5 py-3 rounded-xl bg-brand-ash/30 border border-brand-ash/60 text-brand-dark font-bold hover:text-brand-orange text-xs whitespace-nowrap active:scale-95 transition-all"
              >
                Reset
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {(selectedWorkModes.length > 0 || selectedEmpTypes.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedWorkModes.map((mode) => (
                <span 
                  key={mode} 
                  onClick={() => toggleFilter(selectedWorkModes, setSelectedWorkModes, mode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-brand-green text-brand-green text-xs font-bold cursor-pointer shadow-xs"
                >
                  <span>{mode}</span>
                  <X className="w-3.5 h-3.5 text-brand-green" />
                </span>
              ))}
              {selectedEmpTypes.map((type) => (
                <span 
                  key={type} 
                  onClick={() => toggleFilter(selectedEmpTypes, setSelectedEmpTypes, type)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-brand-orange text-brand-orange text-xs font-bold cursor-pointer shadow-xs"
                >
                  <span>{type}</span>
                  <X className="w-3.5 h-3.5 text-brand-orange" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-brand-ash/60 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-brand-ash/40">
              <h3 className="font-header font-bold text-brand-dark text-sm sm:text-base">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={clearFilters} 
                  className="text-xs text-brand-orange hover:underline font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Group: Work Mode */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-3">
                Work Mode
              </h4>
              <div className="space-y-2.5">
                {["Remote", "Onsite", "Hybrid"].map((mode) => (
                  <label key={mode} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedWorkModes.includes(mode)}
                      onChange={() => toggleFilter(selectedWorkModes, setSelectedWorkModes, mode)}
                      className="w-4 h-4 rounded border-brand-ash/80 text-brand-green focus:ring-brand-green/30 accent-brand-green cursor-pointer" 
                    />
                    <span className="text-xs sm:text-sm text-brand-dark font-medium group-hover:text-brand-green transition-colors">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Employment Type */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-3">
                Employment Type
              </h4>
              <div className="space-y-2.5">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedEmpTypes.includes(type)}
                      onChange={() => toggleFilter(selectedEmpTypes, setSelectedEmpTypes, type)}
                      className="w-4 h-4 rounded border-brand-ash/80 text-brand-green focus:ring-brand-green/30 accent-brand-green cursor-pointer" 
                    />
                    <span className="text-xs sm:text-sm text-brand-dark font-medium group-hover:text-brand-green transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Job Listings Column */}
        <div className="flex-1 w-full space-y-8 sm:space-y-10">
          
          {/* Featured Roles Section */}
          {featuredJobs.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
                <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                  Featured Roles
                </h2>
                <span className="ml-auto text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full border border-brand-orange/20">
                  {featuredJobs.length} {featuredJobs.length === 1 ? "Role" : "Roles"}
                </span>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* All Jobs Section */}
          <section>
            <div className="flex items-center justify-between mb-3.5 sm:mb-4">
              <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                All Openings
              </h2>
              <span className="text-xs font-bold text-brand-dark/70">
                Showing {regularJobs.length} {regularJobs.length === 1 ? "opening" : "openings"}
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {regularJobs.length > 0 ? (
                regularJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="bg-white border border-brand-ash/60 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-brand-ash/30 text-brand-dark/70 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-1">
                    No matching roles found
                  </h3>
                  <p className="text-brand-dark/80 text-xs sm:text-sm mb-4 max-w-sm mx-auto leading-relaxed">
                    Try loosening your filters or searching for a different job title.
                  </p>
                  <button 
                    onClick={clearFilters} 
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-orange hover:underline active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Clear all active filters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}

// Subcomponent: Job Card
function JobCard({ job }: { job: Job }) {
  const formattedSalary = job.salary
    ? job.salary.trim().startsWith("₦")
      ? job.salary
      : `₦${job.salary}`
    : "Competitive";

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div 
        className={`bg-white border ${
          job.isFeatured 
            ? "border-brand-orange/40 shadow-[0_0_15px_rgba(244,163,46,0.12)] bg-gradient-to-br from-white to-brand-orange/[0.02]" 
            : "border-brand-ash/60 shadow-xs"
        } rounded-2xl p-4 xs:p-5 sm:p-6 hover:shadow-card-hover hover:border-brand-green/40 active:scale-[0.99] transition-all duration-200 relative`}
      >
        
        {/* Card Header & Badges */}
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            {job.isFeatured && (
              <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-brand-orange" /> Featured
              </span>
            )}
            {job.gradFillCode && (
              <span className="bg-brand-green/10 text-brand-green border border-brand-green/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-brand-green" /> {job.gradFillCode}
              </span>
            )}
            <span className="bg-brand-ash/40 text-brand-dark font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
              Entry-Level
            </span>
          </div>

          <h3 className="font-header text-base xs:text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-green transition-colors leading-snug">
            {job.title}
          </h3>
          <p className="text-brand-dark font-semibold text-xs sm:text-sm mt-0.5">
            {job.company}
          </p>
        </div>

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mb-3.5 sm:mb-4 text-xs sm:text-sm text-brand-dark">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
            <span>{job.location || "Nigeria"} {job.workMode ? `• ${job.workMode}` : ""}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span>{job.empType || "Full-time"}</span>
          </div>
          
          <div className="flex items-center gap-1 font-bold text-brand-green">
            <span>{formattedSalary}</span>
          </div>
        </div>

        {/* Card Footer: Category & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-ash/40 text-[11px] sm:text-xs">
          <span className="inline-block px-2.5 py-0.5 bg-brand-ash/30 text-brand-dark font-bold rounded-full">
            {job.industry || "General"}
          </span>
          <div className="flex items-center gap-1 text-brand-dark/70 font-semibold">
            <Clock className="w-3 h-3 text-brand-dark/60" />
            <span>{job.datePosted || "Recently"}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}
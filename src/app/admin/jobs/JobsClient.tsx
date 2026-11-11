"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, MoreVertical, Edit, Copy,
  Trash2, Archive, Star, Zap, Clock, 
  CheckCircle2, XCircle, X, Loader2
} from "lucide-react";
import { AdminJob, updateJobStatus, deleteJob, duplicateJob } from "./actions";

export default function JobsClient({ initialJobs }: { initialJobs: AdminJob[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminJob[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "CLOSED" | "ARCHIVED">("ALL");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Live Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        (job.gradFillCode && job.gradFillCode.toLowerCase().includes(query));

      const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // Update Status Handler
  const handleUpdateStatus = async (id: string, newStatus: "ACTIVE" | "CLOSED" | "ARCHIVED") => {
    setActiveDropdown(null);
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job)));
    await updateJobStatus(id, newStatus);
    router.refresh();
  };

  // Duplicate Job Handler
  const handleDuplicate = async (id: string) => {
    setActiveDropdown(null);
    setLoadingJobId(id);

    try {
      const response = await duplicateJob(id);
      if (response.success) {
        router.refresh();
      } else {
        alert(response.error || "Failed to duplicate job posting.");
      }
    } catch (error) {
      console.error(error);
      alert("A network error occurred while duplicating the job.");
    } finally {
      setLoadingJobId(null);
    }
  };

  // Delete Job Handler
  const handleDelete = async (id: string) => {
    setActiveDropdown(null);
    if (confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      setJobs(jobs.filter((job) => job.id !== id));
      await deleteJob(id);
      router.refresh();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl xs:text-3xl font-bold text-brand-dark mb-1 tracking-tight">
            Job Board Management
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            Manage, edit, duplicate, and monitor all open vacancies across the network.
          </p>
        </div>

        <Link 
          href="/admin/jobs/new"
          className="w-full sm:w-auto bg-brand-green text-brand-white px-5 py-3.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 text-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> 
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-brand-white p-3 sm:p-4 rounded-2xl border border-brand-ash/60 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
          <input 
            type="text" 
            placeholder="Search by title, company, or GF Code..." 
            className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/45 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-dark p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 md:pt-0">
          {(["ALL", "ACTIVE", "CLOSED", "ARCHIVED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer capitalize ${
                statusFilter === status
                  ? "bg-brand-dark text-brand-white shadow-xs"
                  : "bg-brand-ash/30 text-brand-dark/70 hover:bg-brand-ash/60 hover:text-brand-dark"
              }`}
            >
              {status.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW: App-Style Card Feed (md:hidden)                              */}
      {/* ========================================================================= */}
      <div className="space-y-3.5 md:hidden">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className={`bg-brand-white border border-brand-ash/60 rounded-2xl p-4 shadow-xs relative transition-all ${
              job.status === "ARCHIVED" ? "opacity-60 bg-brand-ash/10" : ""
            }`}
          >
            {/* Header: Title, Company & Status */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="min-w-0 pr-1">
                <h3 className="font-bold text-brand-dark text-base tracking-tight leading-snug">
                  {job.title}
                </h3>
                <p className="text-brand-dark/70 text-xs font-semibold mt-0.5">
                  {job.company}
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 border capitalize ${
                job.status === "ACTIVE" ? "bg-brand-green/10 text-brand-green border-brand-green/25" :
                job.status === "CLOSED" ? "bg-brand-orange/10 text-brand-orange border-brand-orange/25" :
                "bg-brand-ash/50 text-brand-dark/70 border-brand-ash/80"
              }`}>
                {job.status === "ACTIVE" && <CheckCircle2 className="w-3 h-3 text-brand-green" />}
                {job.status === "CLOSED" && <XCircle className="w-3 h-3 text-brand-orange" />}
                {job.status === "ARCHIVED" && <Archive className="w-3 h-3 text-brand-dark/60" />}
                {job.status.toLowerCase()}
              </span>
            </div>

            {/* Badges & Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {job.isFeatured && (
                <span className="bg-brand-orange/10 border border-brand-orange/25 text-brand-orange px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-brand-orange" /> Featured
                </span>
              )}
              {job.gradFillCode && (
                <span className="bg-brand-green/10 border border-brand-green/25 text-brand-green px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-brand-green" /> {job.gradFillCode}
                </span>
              )}
              {!job.isFeatured && !job.gradFillCode && (
                <span className="bg-brand-ash/40 text-brand-dark/70 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Standard
                </span>
              )}
            </div>

            {/* Card Footer: Date & Quick Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-ash/40 text-xs">
              <span className="text-brand-dark/60 text-[11px] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-dark/50" /> {job.datePosted}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/jobs/${job.id}/edit`}
                  className="px-3 py-1 bg-brand-ash/30 text-brand-dark font-bold rounded-lg text-xs hover:bg-brand-ash/60 active:scale-95 transition-all"
                >
                  Edit
                </Link>

                <button
                  onClick={() => toggleDropdown(job.id)}
                  disabled={loadingJobId === job.id}
                  className="p-1.5 text-brand-dark/70 hover:text-brand-dark bg-brand-ash/20 rounded-lg active:scale-95 transition-all cursor-pointer"
                  aria-label="More actions"
                >
                  {loadingJobId === job.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Actions Dropdown Popover */}
            {activeDropdown === job.id && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-brand-dark/30 backdrop-blur-2xs" 
                  onClick={() => setActiveDropdown(null)} 
                />
                
                <div className="absolute right-4 bottom-12 w-52 bg-brand-white border border-brand-ash/70 rounded-2xl shadow-xl z-50 py-2 flex flex-col text-left">
                  <Link 
                    href={`/admin/jobs/${job.id}/edit`} 
                    className="px-4 py-2.5 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-brand-dark/60" /> 
                    <span>Edit Job Posting</span>
                  </Link>

                  <button 
                    onClick={() => handleDuplicate(job.id)} 
                    className="px-4 py-2.5 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-brand-green" /> 
                    <span>Duplicate Job</span>
                  </button>
                  
                  <div className="h-px bg-brand-ash/40 my-1" />
                  
                  {job.status !== "ACTIVE" && (
                    <button 
                      onClick={() => handleUpdateStatus(job.id, "ACTIVE")} 
                      className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> 
                      <span>Mark as Active</span>
                    </button>
                  )}
                  {job.status !== "CLOSED" && (
                    <button 
                      onClick={() => handleUpdateStatus(job.id, "CLOSED")} 
                      className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-brand-orange" /> 
                      <span>Mark as Closed</span>
                    </button>
                  )}
                  {job.status !== "ARCHIVED" && (
                    <button 
                      onClick={() => handleUpdateStatus(job.id, "ARCHIVED")} 
                      className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5 text-brand-dark/60" /> 
                      <span>Archive Job</span>
                    </button>
                  )}

                  <div className="h-px bg-brand-ash/40 my-1" />
                  
                  <button 
                    onClick={() => handleDelete(job.id)} 
                    className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" /> 
                    <span>Delete Job</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="bg-brand-white border border-brand-ash/60 rounded-2xl p-8 text-center text-brand-dark/60 text-xs sm:text-sm font-medium">
            No job postings found matching your search or filters.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW: Data Table (hidden md:block)                                */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-brand-white border border-brand-ash/60 rounded-2xl shadow-xs overflow-hidden min-h-[380px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ash/20 text-brand-dark/70 text-xs uppercase tracking-wider border-b border-brand-ash/60">
                <th className="px-6 py-4 font-bold">Job Role & Company</th>
                <th className="px-6 py-4 font-bold">Tags</th>
                <th className="px-6 py-4 font-bold">Date Posted</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ash/40">
              {filteredJobs.map((job) => (
                <tr key={job.id} className={`hover:bg-brand-ash/5 transition-colors ${job.status === "ARCHIVED" ? "opacity-60 bg-brand-ash/10" : ""}`}>
                  
                  {/* Job Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-brand-dark text-sm sm:text-base leading-snug">{job.title}</p>
                    <p className="text-brand-dark/60 text-xs sm:text-sm font-medium">{job.company}</p>
                  </td>

                  {/* Tags */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {job.isFeatured && (
                        <span className="bg-brand-orange/10 border border-brand-orange/25 text-brand-orange px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max">
                          <Star className="w-2.5 h-2.5 fill-brand-orange" /> Featured
                        </span>
                      )}
                      {job.gradFillCode && (
                        <span className="bg-brand-green/10 border border-brand-green/25 text-brand-green px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max">
                          <Zap className="w-2.5 h-2.5 fill-brand-green" /> {job.gradFillCode}
                        </span>
                      )}
                      {!job.isFeatured && !job.gradFillCode && (
                        <span className="bg-brand-ash/40 text-brand-dark/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Standard
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date Posted */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-brand-dark/70 text-xs sm:text-sm flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-dark/50" /> {job.datePosted}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border capitalize ${
                      job.status === "ACTIVE" ? "bg-brand-green/10 text-brand-green border-brand-green/25" : 
                      job.status === "CLOSED" ? "bg-brand-orange/10 text-brand-orange border-brand-orange/25" : 
                      "bg-brand-ash/50 text-brand-dark/60 border-brand-ash/80"
                    }`}>
                      {job.status === "ACTIVE" && <CheckCircle2 className="w-3 h-3 text-brand-green" />}
                      {job.status === "CLOSED" && <XCircle className="w-3 h-3 text-brand-orange" />}
                      {job.status === "ARCHIVED" && <Archive className="w-3 h-3 text-brand-dark/60" />}
                      {job.status.toLowerCase()}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button 
                      onClick={() => toggleDropdown(job.id)}
                      disabled={loadingJobId === job.id}
                      className="p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-ash/30 rounded-full active:scale-95 transition-all cursor-pointer"
                      aria-label="Open actions menu"
                    >
                      {loadingJobId === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                      ) : (
                        <MoreVertical className="w-4 h-4" />
                      )}
                    </button>
                    
                    {activeDropdown === job.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-30 bg-transparent" 
                          onClick={() => setActiveDropdown(null)} 
                        />
                        
                        <div className="absolute right-8 top-12 w-48 bg-brand-white border border-brand-ash/70 rounded-xl shadow-lg z-40 py-2 flex flex-col text-left">
                          <Link 
                            href={`/admin/jobs/${job.id}/edit`} 
                            className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-brand-dark/60" /> 
                            <span>Edit Job</span>
                          </Link>

                          <button 
                            onClick={() => handleDuplicate(job.id)} 
                            className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-brand-green" /> 
                            <span>Duplicate Job</span>
                          </button>
                          
                          <div className="h-px bg-brand-ash/40 my-1" />
                          
                          {job.status !== "ACTIVE" && (
                            <button 
                              onClick={() => handleUpdateStatus(job.id, "ACTIVE")} 
                              className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> 
                              <span>Mark as Active</span>
                            </button>
                          )}
                          {job.status !== "CLOSED" && (
                            <button 
                              onClick={() => handleUpdateStatus(job.id, "CLOSED")} 
                              className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5 text-brand-orange" /> 
                              <span>Mark as Closed</span>
                            </button>
                          )}
                          {job.status !== "ARCHIVED" && (
                            <button 
                              onClick={() => handleUpdateStatus(job.id, "ARCHIVED")} 
                              className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5 text-brand-dark/60" /> 
                              <span>Archive Job</span>
                            </button>
                          )}

                          <div className="h-px bg-brand-ash/40 my-1" />
                          
                          <button 
                            onClick={() => handleDelete(job.id)} 
                            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" /> 
                            <span>Delete Job</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                  
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-brand-dark/50 text-xs sm:text-sm">
                    No jobs found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
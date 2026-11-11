"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, LayoutTemplate, Loader2, Bold, 
  Heading2, List, Underline, Sparkles 
} from "lucide-react";
import { updateJobAction } from "@/app/admin/jobs/actions";

interface EditJobFormProps {
  job: any;
}

export default function EditJobForm({ job }: EditJobFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState(job.description || "");

  // Helper to insert markdown formatting into description textarea
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("job-description") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newDescription = 
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    setDescription(newDescription);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("description", description);

    try {
      const response = await updateJobAction(job.id, formData);
      if (response.success) {
        alert("Job updated successfully!");
        router.push("/admin/jobs");
        router.refresh();
      } else {
        alert(response.error || "Failed to update job.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred while updating the job.");
    } finally {
      setIsSaving(false);
    }
  };

  // Format date safely for HTML date input (YYYY-MM-DD)
  const formattedDeadline = job.deadline 
    ? new Date(job.deadline).toISOString().split("T")[0] 
    : "";

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-14">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/jobs"
          className="p-2.5 bg-brand-white border border-brand-ash/60 rounded-xl text-brand-dark/70 hover:text-brand-dark hover:bg-brand-ash/20 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
            Edit Job Posting
          </h1>
          <p className="text-brand-dark/60 text-xs sm:text-sm">
            Updating details for <strong className="text-brand-dark">{job.title}</strong> at {job.company}
          </p>
        </div>
      </div>

      <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
        
        {/* Section 1: Basic Information */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-green" /> Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Job Title *</label>
              <input 
                type="text" 
                name="title" 
                defaultValue={job.title} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Company Name *</label>
              <input 
                type="text" 
                name="company" 
                defaultValue={job.company} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Location *</label>
              <input 
                type="text" 
                name="location" 
                defaultValue={job.location} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Industry Tag *</label>
              <input 
                type="text" 
                name="industry" 
                defaultValue={job.industry} 
                placeholder="e.g. Content & Social Media, Software, Design" 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Salary / Range *</label>
              <input 
                type="text" 
                name="salary" 
                defaultValue={job.salary} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Job Specifications */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-6">Job Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Employment Type *</label>
              <select 
                name="empType" 
                defaultValue={job.empType || "Full-time"} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Work Mode *</label>
              <select 
                name="workMode" 
                defaultValue={job.workMode || "Remote"} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Application Deadline *</label>
              <input 
                type="date" 
                name="deadline" 
                defaultValue={formattedDeadline} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Listing Status *</label>
              <select 
                name="status" 
                defaultValue={job.status || "ACTIVE"} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE (Visible on board)</option>
                <option value="CLOSED">CLOSED (Archived)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Description with Formatting Toolbar */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark">
              Description & Formatting
            </h2>
            
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 bg-brand-ash/20 p-1 rounded-xl border border-brand-ash/60 w-fit">
              <button 
                type="button" 
                onClick={() => insertFormatting("**", "**")} 
                className="p-1.5 hover:bg-brand-white rounded-lg text-brand-dark/70 hover:text-brand-dark transition-colors cursor-pointer"
                title="Bold (**text**)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => insertFormatting("<u>", "</u>")} 
                className="p-1.5 hover:bg-brand-white rounded-lg text-brand-dark/70 hover:text-brand-dark transition-colors cursor-pointer"
                title="Underline (<u>text</u>)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => insertFormatting("\n### ", "\n")} 
                className="p-1.5 hover:bg-brand-white rounded-lg text-brand-dark/70 hover:text-brand-dark transition-colors cursor-pointer"
                title="Section Heading (### Heading)"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => insertFormatting("\n• ")} 
                className="p-1.5 hover:bg-brand-white rounded-lg text-brand-dark/70 hover:text-brand-dark transition-colors cursor-pointer"
                title="Bullet Point (• Item)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <textarea 
                id="job-description"
                name="description"
                rows={12} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl p-4 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-y leading-relaxed font-mono text-xs"
                placeholder="Write the role details, responsibilities, and requirements here..."
                required
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Skill Badges (Comma Separated)</label>
              <input 
                type="text" 
                name="skillBadges" 
                defaultValue={Array.isArray(job.skillBadges) ? job.skillBadges.join(", ") : job.skillBadges || ""} 
                placeholder="Canva, Content Writing, SEO"
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
              />
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-2">Application Link / Email *</label>
              <input 
                type="text" 
                name="applicationMethod" 
                defaultValue={job.applicationMethod} 
                className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                required 
              />
            </div>
          </div>
        </div>

        {/* Section 4: TalentCore Specifics */}
        <div className="bg-brand-dark border border-brand-dark rounded-3xl p-6 sm:p-8 shadow-brand-glow text-brand-white">
          <h2 className="font-header text-lg sm:text-xl font-bold mb-6">TalentCore Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-brand-white/80 text-xs sm:text-sm font-bold mb-2">TalentCore Job Code</label>
              <input 
                type="text" 
                name="gradFillCode" 
                defaultValue={job.gradFillCode || ""} 
                placeholder="e.g. TC004"
                className="w-full bg-brand-white/10 border border-brand-white/20 rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
              />
              <p className="text-[11px] text-brand-white/50 mt-2 leading-relaxed">
                Only add a code if this is managed by TalentCore. This enables direct candidate referrals.
              </p>
            </div>

            <div className="bg-brand-white/5 border border-brand-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <input 
                type="checkbox" 
                id="isFeatured" 
                name="isFeatured" 
                defaultChecked={Boolean(job.isFeatured)} 
                className="w-5 h-5 mt-0.5 rounded border-brand-ash/60 text-brand-orange focus:ring-brand-orange cursor-pointer" 
              />
              <div>
                <label htmlFor="isFeatured" className="block text-brand-white font-bold text-sm mb-1 cursor-pointer flex items-center gap-1.5">
                  <span>Mark as Featured Job</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                </label>
                <p className="text-[11px] text-brand-white/50 leading-relaxed">
                  Featured jobs are highlighted, pinned to the top of the job board, and active for 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link 
            href="/admin/jobs" 
            className="px-6 py-3 rounded-xl font-bold text-sm text-brand-dark hover:bg-brand-ash/20 transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-brand-green text-brand-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center gap-2 shadow-brand-glow cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
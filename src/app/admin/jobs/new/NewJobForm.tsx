"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, LayoutTemplate, Briefcase, FileText, 
  Settings2, Sparkles, AlertCircle, Loader2, Link as LinkIcon, 
  FileJson, Bold, Italic, Underline, Heading2, Heading3, 
  List, ListOrdered, Eye, Edit3
} from "lucide-react";
import { createJob } from "../actions"; 

// Strictly the 8 official active forms matching the Admin sidebar
const OFFICIAL_ACTIVE_FORMS = [
  { id: "application", label: "Graduate Onboarding (Default)" },
  { id: "candidate_request", label: "Employer Request" },
  { id: "job_listing", label: "Job Listing Service" },
  { id: "job_matching", label: "Job Matching Service" },
  { id: "outsource_hr", label: "Outsource HR Service" },
  { id: "job_placement", label: "Job Placement Service" },
  { id: "career_readiness", label: "Career Readiness" },
  { id: "resume_writing", label: "Resume Writing" },
];

interface FormOption {
  id: string;
  title?: string;
}

export default function NewJobForm({ availableForms = [] }: { availableForms?: FormOption[] }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Application Method toggle
  const [appMethodType, setAppMethodType] = useState<"internal" | "url">("internal");
  const [selectedFormId, setSelectedFormId] = useState<string>("form:application");

  // Rich text description state & preview toggle
  const [description, setDescription] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Draft restoration on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("talentcore_draft_job_new");
      if (saved) {
        setDescription(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Autosave draft on description change
  useEffect(() => {
    if (description) {
      setIsDirty(true);
      try {
        localStorage.setItem("talentcore_draft_job_new", description);
      } catch (e) {
        // ignore
      }
    }
  }, [description]);

  // Unsaved changes beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Strictly return only the 8 official forms
  const mappedForms = useMemo(() => {
    return OFFICIAL_ACTIVE_FORMS.map((form) => ({
      value: `form:${form.id}`,
      label: form.label,
    }));
  }, []);

  // Toolbar helper to insert Markdown formatting at cursor
  const insertMarkdown = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end) || placeholder;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = description.substring(0, start) + replacement + description.substring(end);
    setDescription(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Simple parser to preview Markdown in the admin editor
  const renderPreview = (text: string) => {
    if (!text) return '<p class="text-brand-dark/40 italic">Nothing to preview yet.</p>';
    return text
      .replace(/^### (.*$)/gim, '<h3 class="font-bold text-base sm:text-lg text-brand-dark mt-4 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-bold text-lg sm:text-xl text-brand-dark mt-5 mb-2">$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-brand-dark">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-brand-dark">$1</em>')
      .replace(/<u>(.*?)<\/u>/gim, '<u class="underline text-brand-dark">$1</u>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-green underline">$1</a>')
      .replace(/^[•\-] (.*$)/gim, '<li class="ml-4 list-disc text-brand-dark/80 mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-brand-dark/80 mb-1">$1</li>')
      .replace(/\n\n+/g, '</p><p class="mb-3 leading-relaxed">')
      .replace(/\n/g, '<br />');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("description", description);

    try {
      const result = await createJob(formData);
      
      if (!result || !result.success) {
        throw new Error(result?.error || "Failed to save job.");
      }
      
      setIsDirty(false);
      try {
        localStorage.removeItem("talentcore_draft_job_new");
      } catch (err) {}

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "A network error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link 
          href="/admin/jobs"
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-brand-white border border-brand-ash/60 rounded-xl text-brand-dark/70 hover:text-brand-dark hover:bg-brand-ash/20 active:scale-95 transition-all shrink-0 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
        </Link>
        <div>
          <h1 className="font-header text-xl xs:text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight leading-tight">
            Post New Job
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
            Create and publish a new entry-level vacancy for the job board.
          </p>
        </div>
      </div>

      <form className="space-y-5 sm:space-y-8" onSubmit={handleSubmit}>
        
        {/* Section 1: Basic Information */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
          <h2 className="font-header text-base sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6 flex items-center gap-2 tracking-tight">
            <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green shrink-0" /> 
            <span>Basic Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Job Title <span className="text-brand-orange">*</span></label>
              <input type="text" name="title" placeholder="e.g. Social Media Assistant" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" required />
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Company Name <span className="text-brand-orange">*</span></label>
              <input type="text" name="company" placeholder="e.g. Acme Corp" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" required />
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Location <span className="text-brand-orange">*</span></label>
              <input type="text" name="location" placeholder="e.g. Lagos, Nigeria" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" required />
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Industry Tag <span className="text-brand-orange">*</span></label>
              <input type="text" name="industry" placeholder="e.g. Content & Social Media" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" required />
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Salary / Range <span className="text-brand-orange">*</span></label>
              <input type="text" name="salary" placeholder="e.g. ₦70,000 - ₦100,000/month" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" required />
            </div>
          </div>
        </div>

        {/* Section 2: Job Specifications */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
          <h2 className="font-header text-base sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6 flex items-center gap-2 tracking-tight">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" />
            <span>Job Specifications</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Employment Type <span className="text-brand-orange">*</span></label>
              <select name="empType" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green cursor-pointer">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Work Mode <span className="text-brand-orange">*</span></label>
              <select name="workMode" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green cursor-pointer">
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Experience Level</label>
              <input type="text" value="Entry-level" disabled className="w-full bg-brand-ash/30 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark/70 font-semibold cursor-not-allowed" />
              <p className="text-[11px] sm:text-xs text-brand-dark/60 mt-1 font-medium">All roles default to Entry-level.</p>
            </div>
            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Application Deadline <span className="text-brand-orange">*</span></label>
              <input type="date" name="deadline" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green" required />
            </div>
          </div>
        </div>

        {/* Section 3: Description with Rich Text Toolbar & Application */}
        <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
          <h2 className="font-header text-base sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6 flex items-center gap-2 tracking-tight">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green shrink-0" />
            <span>Description & Application</span>
          </h2>
          <div className="space-y-6">
            
            {/* RICH TEXT FORMATTING TOOLBAR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-brand-dark text-xs sm:text-sm font-bold">
                  Full Job Description <span className="text-brand-orange">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-bold flex items-center gap-1.5 text-brand-green hover:underline cursor-pointer"
                >
                  {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{previewMode ? "Back to Edit" : "Preview Layout"}</span>
                </button>
              </div>

              {!previewMode && (
                <div className="flex flex-wrap items-center gap-1.5 bg-brand-ash/20 border border-brand-ash/60 border-b-0 rounded-t-xl p-2">
                  <button
                    type="button"
                    onClick={() => insertMarkdown("## ", "", "Section Heading")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                    <span>H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("### ", "", "Subsection Heading")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Heading 3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                    <span>H3</span>
                  </button>
                  <div className="w-[1px] h-4 bg-brand-ash/60 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown("**", "**", "bold text")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("*", "*", "italic text")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("<u>", "</u>", "underlined text")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-brand-ash/60 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown("• ", "", "Bullet point item")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("1. ", "", "Numbered item")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("[", "](https://)", "link text")}
                    className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark cursor-pointer transition-colors"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {previewMode ? (
                <div 
                  className="w-full bg-brand-ash/10 border border-brand-ash/70 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-brand-dark leading-relaxed min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: renderPreview(description) }}
                />
              ) : (
                <textarea 
                  ref={textareaRef}
                  name="description" 
                  rows={8} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="### About the Role&#10;Write overview here...&#10;&#10;### Key Responsibilities&#10;• Handle social media posts&#10;• Collaborate with the team" 
                  className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-b-xl p-3.5 sm:p-4 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green resize-y leading-relaxed font-mono" 
                  required 
                />
              )}
              <p className="text-[11px] text-brand-dark/50 mt-1.5 font-medium">
                Tip: Use <code className="bg-brand-ash/30 px-1 py-0.5 rounded">### Section</code> for titles, <code className="bg-brand-ash/30 px-1 py-0.5 rounded">**bold**</code> for emphasis, and <code className="bg-brand-ash/30 px-1 py-0.5 rounded">•</code> for bullet points.
              </p>
            </div>

            <div>
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Skill Badges (Comma-separated)</label>
              <input type="text" name="skillBadges" placeholder="e.g. Canva Badge, Social Media Management, Copywriting" className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green" />
            </div>

            {/* METHOD OF APPLICATION: STRICTLY 8 FORMS */}
            <div className="bg-brand-ash/10 border border-brand-ash/40 rounded-xl p-4 sm:p-5">
              <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-3">
                Method of Application <span className="text-brand-orange">*</span>
              </label>
              
              <div className="flex items-center bg-brand-ash/30 rounded-xl p-1.5 border border-brand-ash/50 w-full sm:w-max mb-4">
                <button
                  type="button"
                  onClick={() => setAppMethodType("internal")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    appMethodType === "internal" ? "bg-brand-white text-brand-dark shadow-xs border border-brand-ash/60" : "text-brand-dark/60 hover:text-brand-dark"
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-brand-green" /> Select Platform Form
                </button>
                <button
                  type="button"
                  onClick={() => setAppMethodType("url")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    appMethodType === "url" ? "bg-brand-white text-brand-dark shadow-xs border border-brand-ash/60" : "text-brand-dark/60 hover:text-brand-dark"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5 text-brand-orange" /> External URL
                </button>
              </div>

              {appMethodType === "internal" ? (
                <div className="animate-fade-in">
                  <select 
                    name="applicationMethod"
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                    className="w-full bg-brand-white border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer font-medium" 
                    required 
                  >
                    {mappedForms.map((form) => (
                      <option key={form.value} value={form.value}>
                        {form.label} ({form.value})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] sm:text-xs text-brand-dark/60 mt-2 font-medium">
                    When applicants click "Apply Now", this custom modal form will open instantly on the job page.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <input 
                    type="url" 
                    name="applicationMethod"
                    placeholder="https://company.com/careers/apply" 
                    className="w-full bg-brand-white border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green" 
                    required 
                  />
                  <p className="text-[11px] sm:text-xs text-brand-dark/60 mt-2 font-medium">
                    Candidates will be redirected to this external website to complete their application.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Section 4: TalentCore Specifics */}
        <div className="bg-brand-dark border border-brand-dark rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-brand-glow text-brand-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none -z-0" />
          <h2 className="font-header text-base sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 tracking-tight relative z-10">
            <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" />
            <span>TalentCore Configuration</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start relative z-10">
            <div>
              <label className="block text-brand-white/85 text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">TalentCore Job Code (Optional)</label>
              <input type="text" name="gradFillCode" placeholder="e.g. TC004" className="w-full bg-brand-white/10 border border-brand-white/20 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-white focus:outline-none focus:border-brand-green font-mono" />
            </div>
            <div className="bg-brand-white/5 border border-brand-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
              <input type="checkbox" id="featured" name="isFeatured" className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-brand-ash/60 text-brand-orange focus:ring-brand-orange cursor-pointer accent-brand-orange shrink-0" />
              <div>
                <label htmlFor="featured" className="block text-brand-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 cursor-pointer flex items-center gap-1.5">
                  <span>Mark as Featured Job</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                </label>
                <p className="text-[11px] sm:text-xs text-brand-white/60 leading-relaxed font-light">Featured roles are pinned to the top of the job board.</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2.5 sm:gap-4 pt-2 sm:pt-4">
          <Link href="/admin/jobs" className="w-full xs:w-auto px-5 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-brand-dark bg-brand-ash/30 hover:bg-brand-ash/50 transition-all text-center">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="w-full xs:w-auto bg-brand-green text-brand-white px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-brand-glow text-center cursor-pointer disabled:opacity-70">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            <span>{isSubmitting ? "Publishing..." : "Publish Job"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
"use client";

import Link from "next/link";
import { 
  ArrowLeft, Inbox, Download, Search, FileJson, 
  X, FileText, ExternalLink, Eye, UserPlus 
} from "lucide-react";
import { useState } from "react";
import { convertSubmissionToCandidate } from "@/app/admin/candidates/actions";

interface Submission {
  id: string;
  data: Record<string, any>;
  submittedAt: string;
}

interface SubmissionsClientProps {
  formId: string;
  formTitle: string;
  submissions?: Submission[];
  fieldLabels?: Record<string, string>;
}

export default function SubmissionsClient({ 
  formId, 
  formTitle, 
  submissions = [], 
  fieldLabels = {} 
}: SubmissionsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  // Dynamic table headers based on first submission keys
  const dynamicHeaders = submissions?.length > 0 
    ? Object.keys(submissions[0]?.data || {}).filter((k) => !k.startsWith("_")) 
    : [];

  // Filter submissions by search query across all field values
  const filteredSubmissions = (submissions || []).filter((sub) => {
    if (!searchQuery) return true;
    const allValues = Object.values(sub?.data || {}).join(" ").toLowerCase();
    return allValues.includes(searchQuery.toLowerCase());
  });

  // Enhanced file URL detector for Cloudflare R2, custom CDNs, and file extensions
  const checkIsFileUrl = (value: string): boolean => {
    if (typeof value !== "string" || !value.startsWith("http")) return false;
    const lower = value.toLowerCase();
    const hasExtension = [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg", ".webp"].some(ext => lower.includes(ext));
    const isCloudStorage = lower.includes("r2.dev") || lower.includes("cloudflarestorage") || lower.includes("google") || lower.includes("/uploads/");
    return hasExtension || isCloudStorage;
  };

  // Client-Side CSV Export
  const handleExportCSV = () => {
    if (!filteredSubmissions.length) {
      alert("No submission data available to export.");
      return;
    }

    const headers = ["Submission ID", "Submitted At", ...dynamicHeaders.map(h => fieldLabels[h] || h)];
    const rows = filteredSubmissions.map(sub => [
      sub.id,
      sub.submittedAt,
      ...dynamicHeaders.map(h => {
        const val = sub.data[h];
        if (typeof val === "object" && val !== null) return JSON.stringify(val).replace(/"/g, '""');
        return String(val ?? "").replace(/"/g, '""');
      })
    ]);

    const csvContent = [
      headers.map(h => `"${h}"`).join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${formId}_submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pipeline Automation: Promote Submission to Talent Pool
  const handlePromoteCandidate = async () => {
    if (!selectedSub) return;
    setIsPromoting(true);

    try {
      const data = selectedSub.data;
      
      const fullName = 
        data.fullName || 
        data.name || 
        data.contactPerson || 
        data["Full Name"] || 
        "";

      const email = 
        data.email || 
        data.workEmail || 
        data["Email Address"] || 
        data["Email"] || 
        "";

      const role = 
        data.primarySkill || 
        data.targetRole || 
        data.roleHiringFor || 
        data.role || 
        "General Applicant";
      
      const resumeUrl = 
        data.resumeUrl || 
        (Object.values(data).find(val => checkIsFileUrl(String(val))) as string | undefined);

      if (!fullName || !email) {
        alert("Cannot promote: Missing required Name or Email in this response.");
        setIsPromoting(false);
        return;
      }

      const response = await convertSubmissionToCandidate({
        fullName,
        email,
        role,
        resumeUrl,
        badges: []
      });

      if (response.success) {
        alert("Candidate profile registered in Talent Pool!");
        setSelectedSub(null);
      } else {
        alert(response.error || "Failed to promote candidate.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred while promoting candidate.");
    } finally {
      setIsPromoting(false);
    }
  };

  // Safe document viewer URL (routes DOCX through Google Docs Viewer for browser rendering)
  const getViewerUrl = (url: string) => {
    if (url.toLowerCase().endsWith(".docx") || url.toLowerCase().endsWith(".doc")) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return url;
  };

  const isCandidateForm = ["application", "job_placement", "job_matching", "career_readiness", "resume_writing"].includes(formId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/admin/forms"
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-brand-white border border-brand-ash/60 rounded-xl text-brand-dark/70 hover:text-brand-dark hover:bg-brand-ash/20 active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
          </Link>
          <div>
            <h1 className="font-header text-xl xs:text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight leading-tight flex items-center gap-2">
              <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark" />
              <span>{formTitle} Submissions</span>
            </h1>
            <p className="text-brand-dark/70 text-xs sm:text-sm font-medium mt-0.5">
              Form ID: <span className="font-mono text-brand-dark">{formId}</span> • {submissions?.length || 0} total responses
            </p>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={!filteredSubmissions.length}
          className="w-full sm:w-auto bg-brand-dark text-brand-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> 
          <span>Export CSV ({filteredSubmissions.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-brand-white p-3 sm:p-4 rounded-2xl border border-brand-ash/60 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
          <input 
            type="text" 
            placeholder="Search across all responses..." 
            className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-brand-white border border-brand-ash/60 rounded-2xl shadow-xs overflow-hidden min-h-[380px]">
        {!submissions || submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-brand-ash/30 flex items-center justify-center mb-3">
              <FileJson className="w-5 h-5 text-brand-dark/60" />
            </div>
            <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-1">No Submissions Yet</h3>
            <p className="text-brand-dark/60 text-xs sm:text-sm">When users fill out this form, their responses will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-brand-dark text-brand-white text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Submitted At</th>
                  {dynamicHeaders.map((header) => (
                    <th key={header} className="px-6 py-4 font-bold whitespace-nowrap">
                      {fieldLabels[header] || header.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ash/40">
                {filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedSub(sub)}
                    className="hover:bg-brand-ash/10 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-brand-dark/70 group-hover:text-brand-green transition-colors">
                      {sub.submittedAt}
                    </td>
                    {dynamicHeaders.map((header) => {
                      const value = String(sub.data[header] || "—");
                      const isFileUrl = checkIsFileUrl(value);
                      
                      return (
                        <td key={`${sub.id}-${header}`} className="px-6 py-4 text-sm text-brand-dark max-w-[200px] truncate">
                          {isFileUrl ? (
                            <span className="inline-flex items-center gap-1.5 text-brand-green font-semibold text-xs bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20">
                              <FileText className="w-3 h-3" /> Attached File
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={dynamicHeaders.length + 1} className="text-center py-12 text-brand-dark/50 text-sm font-medium">
                      No responses match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            onClick={() => setSelectedSub(null)}
          />
          
          <div className="relative w-full max-w-2xl bg-brand-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in border border-brand-ash/60 z-10">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-brand-ash/50 bg-brand-ash/10">
              <div>
                <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-green" />
                  Submission Details
                </h3>
                <p className="text-xs text-brand-dark/60 font-medium mt-1">
                  Received on {selectedSub.submittedAt}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSub(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-white border border-brand-ash/60 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-ash/20 transition-colors shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar space-y-4 sm:space-y-5">
              {Object.entries(selectedSub.data)
                .filter(([key]) => !key.startsWith("_"))
                .map(([key, rawValue]) => {
                  const value = String(rawValue || "—");
                  const isFileUrl = checkIsFileUrl(value);
                  const isEmail = value.includes("@") && !value.includes(" ");
                  const label = fieldLabels[key] || key.toUpperCase();
                  
                  return (
                    <div key={key} className="bg-brand-ash/15 border border-brand-ash/50 rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1.5">
                        {label}
                      </p>
                      
                      {isFileUrl ? (
                        <div className="flex items-center justify-between gap-3 bg-brand-white border border-brand-ash/60 p-3 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-brand-dark truncate">
                              Document File Attached
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewDocUrl(value)}
                              className="flex items-center gap-1.5 text-xs font-bold text-brand-white bg-brand-dark hover:bg-brand-orange px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </button>
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-brand-dark/60 hover:text-brand-dark bg-brand-ash/20 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ) : isEmail ? (
                        <a href={`mailto:${value}`} className="text-sm font-semibold text-brand-green hover:underline flex items-center gap-1.5">
                          {value} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-sm sm:text-base font-medium text-brand-dark whitespace-pre-wrap break-words">
                          {value}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-brand-ash/50 bg-brand-ash/10">
              <button 
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 text-sm font-bold text-brand-dark hover:bg-brand-ash/20 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
              {isCandidateForm && (
                <button 
                  onClick={handlePromoteCandidate}
                  disabled={isPromoting}
                  className="px-5 py-2.5 text-sm font-bold bg-brand-dark text-brand-white rounded-xl hover:bg-brand-orange transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4" />
                  {isPromoting ? "Promoting..." : "Promote to Talent Pool"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Document Preview Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div 
            className="absolute inset-0 bg-brand-dark/75 backdrop-blur-sm"
            onClick={() => setPreviewDocUrl(null)}
          />
          
          <div className="relative w-full max-w-5xl h-[88vh] bg-brand-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-brand-ash/60 z-10 animate-fade-in">
            
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-ash/50 bg-brand-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark truncate">
                    Document Viewer
                  </h3>
                  <p className="text-[11px] text-brand-dark/60 font-medium truncate">
                    Cloud Storage Preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 hover:text-brand-dark bg-brand-ash/20 hover:bg-brand-ash/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Direct Link</span>
                </a>

                <button 
                  onClick={() => setPreviewDocUrl(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-ash/20 border border-brand-ash/60 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-ash/30 transition-colors shadow-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full h-full bg-brand-ash/15 p-2 sm:p-4">
              <iframe
                src={getViewerUrl(previewDocUrl)}
                className="w-full h-full rounded-2xl border border-brand-ash/40 bg-white shadow-inner"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
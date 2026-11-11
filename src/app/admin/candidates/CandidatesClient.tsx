"use client";

import { useState, useMemo } from "react";
import { 
  Search, MoreVertical, 
  Trash2, CheckCircle2, FileText, 
  UserPlus, Mail, ShieldCheck, Download, X, Clock,
  Filter, ExternalLink, Inbox, Check, Loader2, Save, Edit3, Briefcase, Link as LinkIcon
} from "lucide-react";
import { 
  Candidate, 
  updateCandidateStatus, 
  deleteCandidate, 
  convertSubmissionToCandidate,
  getGraduateSubmissions,
  createCandidate,
  updateCandidateProfile // <-- Make sure this is exported from actions.ts!
} from "./actions";

// Extended interface for the new Resume Builder fields
export interface ExtendedCandidate extends Candidate {
  bio?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  experience?: any[];
  education?: any[];
}

// Ultra-resilient data extractor
const extractCandidateData = (data: Record<string, any> | undefined) => {
  let fullName = "Unnamed Applicant";
  let email = "No email";
  let role = "General Applicant";
  let resumeUrl: string | undefined = undefined;

  if (!data) return { fullName, email, role, resumeUrl };

  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const dataKeys = Object.keys(data);
  const dataValues = Object.values(data).map(v => String(v));

  const emailValue = dataValues.find(v => v.includes("@") && !v.includes(" ") && !v.startsWith("http"));
  if (emailValue) {
    email = emailValue;
  } else {
    const emailKey = dataKeys.find(k => normalize(k).includes("email"));
    if (emailKey && data[emailKey]) email = String(data[emailKey]);
    else if (data.f2) email = String(data.f2); 
  }

  const nameKey = dataKeys.find(k => {
    const norm = normalize(k);
    return norm.includes("fullname") || norm === "name" || norm.includes("applicantname");
  });
  if (nameKey && data[nameKey]) fullName = String(data[nameKey]);
  else if (data.f1) fullName = String(data.f1);

  const roleKey = dataKeys.find(k => {
    const norm = normalize(k);
    return norm.includes("skill") || norm.includes("role") || norm.includes("position");
  });
  if (roleKey && data[roleKey]) role = String(data[roleKey]);
  else if (data.f3) role = String(data.f3);

  resumeUrl = Object.values(data).find(
    (val) => typeof val === "string" && val.startsWith("http") && (val.includes("r2.dev") || val.includes("google"))
  ) as string | undefined;

  return { fullName, email, role, resumeUrl };
};

export default function CandidatesClient({ initialCandidates }: { initialCandidates: ExtendedCandidate[] }) {
  const [candidates, setCandidates] = useState<ExtendedCandidate[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Available" | "In-Review" | "Placed">("All");
  const [activeDropdown, setActiveDropdown] = useState<number | string | null>(null);
  
  // Modals State
  const [viewingCandidate, setViewingCandidate] = useState<ExtendedCandidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ExtendedCandidate>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Hybrid Add Modal State
  const [addMode, setAddMode] = useState<"import" | "manual">("import");
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    name: "",
    email: "",
    role: "",
    resumeUrl: "",
    status: "Available" as "Available" | "In-Review" | "Placed"
  });

  const toggleDropdown = (id: number | string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleOpenAddModal = async () => {
    setIsAddModalOpen(true);
    setAddMode("import");
    setLoadingSubmissions(true);
    try {
      const list = await getGraduateSubmissions();
      setSubmissionsList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        (candidate?.name || "").toLowerCase().includes(query) ||
        (candidate?.role || "").toLowerCase().includes(query) ||
        candidate?.badges?.some((badge) => badge.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "All" || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  const handleUpdateStatus = async (id: number | string, newStatus: "Available" | "In-Review" | "Placed") => {
    setActiveDropdown(null);
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    if (viewingCandidate && viewingCandidate.id === id) {
      setViewingCandidate({ ...viewingCandidate, status: newStatus });
    }
    await updateCandidateStatus(id, newStatus);
  };

  const handleDelete = async (id: number | string) => {
    setActiveDropdown(null);
    if (confirm("Are you sure you want to delete this candidate profile? This action cannot be undone.")) {
      setCandidates(candidates.filter((c) => c.id !== id));
      if (viewingCandidate && viewingCandidate.id === id) setViewingCandidate(null);
      await deleteCandidate(id);
    }
  };

  const handleAddFromSubmission = async (sub: any) => {
    setPromotingId(sub.id);
    try {
      const { fullName, email, role, resumeUrl } = extractCandidateData(sub.data);
      const res = await convertSubmissionToCandidate({ fullName, email, role, resumeUrl, badges: [] });

      if (res.success) {
        const newEntry: ExtendedCandidate = {
          id: sub.id, name: fullName, email, role, badges: [], status: "Available", dateAdded: new Date().toLocaleDateString("en-CA"), resumeUrl
        };
        setCandidates([newEntry, ...candidates]);
        setSubmissionsList(submissionsList.filter((s) => s.id !== sub.id));
      } else {
        alert(res.error || "Could not add candidate.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add candidate.");
    } finally {
      setPromotingId(null);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);
    try {
      const newCandidate = await createCandidate(manualFormData);
      setCandidates([newCandidate, ...candidates]);
      setIsAddModalOpen(false);
      setManualFormData({ name: "", email: "", role: "", resumeUrl: "", status: "Available" });
    } catch (error) {
      alert("Failed to add candidate manually. Please try again.");
      console.error(error);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Save the Edited Profile
  const handleSaveProfile = async () => {
    if (!viewingCandidate) return;
    setIsSavingProfile(true);
    try {
      const result = await updateCandidateProfile(viewingCandidate.id, editFormData);
      if (result.success) {
        const updatedCandidate = { ...viewingCandidate, ...editFormData };
        setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        setViewingCandidate(updatedCandidate);
        setIsEditingProfile(false);
      } else {
        alert(result.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl xs:text-3xl font-bold text-brand-dark mb-1 tracking-tight">
            Talent Pool
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            Manage vetted graduates, track candidate availability, and build resumes.
          </p>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto bg-brand-dark text-brand-white px-5 py-3.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 text-center cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> 
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-brand-white p-3 sm:p-4 rounded-2xl border border-brand-ash/60 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
          <input 
            type="text" 
            placeholder="Search by name, role, or skill..." 
            className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/45 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-dark p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 md:pt-0">
          {(["All", "Available", "In-Review", "Placed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer ${
                statusFilter === status
                  ? "bg-brand-dark text-brand-white shadow-xs"
                  : "bg-brand-ash/30 text-brand-dark/70 hover:bg-brand-ash/60 hover:text-brand-dark"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-3.5 md:hidden">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-brand-white border border-brand-ash/60 rounded-2xl p-4 shadow-xs relative transition-all">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0 pr-1 cursor-pointer" onClick={() => { setViewingCandidate(candidate); setIsEditingProfile(false); }}>
                <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 flex items-center justify-center font-bold font-header uppercase text-sm shrink-0">
                  {String(candidate?.name || "?").charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-brand-dark text-sm sm:text-base truncate tracking-tight leading-snug hover:text-brand-green transition-colors">
                    {candidate?.name || "Unnamed Candidate"}
                  </h3>
                  <p className="text-brand-dark/70 text-xs font-medium truncate mt-0.5">
                    {candidate?.role || "No role specified"}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                candidate.status === "Available" ? "bg-brand-green/10 text-brand-green border-brand-green/25" :
                candidate.status === "In-Review" ? "bg-brand-orange/10 text-brand-orange border-brand-orange/25" :
                "bg-brand-dark text-brand-white border-brand-dark"
              }`}>
                {candidate.status === "Available" && <CheckCircle2 className="w-3 h-3 text-brand-green" />}
                {candidate.status}
              </span>
            </div>

            {candidate.badges && candidate.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {candidate.badges.map((badge, i) => (
                  <span key={i} className="bg-brand-ash/30 border border-brand-ash/60 text-brand-dark/75 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-brand-green" /> {badge}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-brand-ash/40 text-xs">
              <span className="text-brand-dark/60 text-[11px] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-dark/50" /> {candidate.dateAdded}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setViewingCandidate(candidate); setIsEditingProfile(false); }}
                  className="px-3 py-1 bg-brand-ash/30 text-brand-dark font-bold rounded-lg text-xs hover:bg-brand-ash/60 active:scale-95 transition-all cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={() => toggleDropdown(candidate.id)}
                  className="p-1.5 text-brand-dark/70 hover:text-brand-dark bg-brand-ash/20 rounded-lg active:scale-95 transition-all cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {activeDropdown === candidate.id && (
              <>
                <div className="fixed inset-0 z-40 bg-brand-dark/30 backdrop-blur-2xs" onClick={() => setActiveDropdown(null)} />
                <div className="absolute right-4 bottom-12 w-52 bg-brand-white border border-brand-ash/70 rounded-2xl shadow-xl z-50 py-2 flex flex-col text-left">
                  <button 
                    onClick={() => { setViewingCandidate(candidate); setIsEditingProfile(false); setActiveDropdown(null); }} 
                    className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-dark/60" /> 
                    <span>View Profile</span>
                  </button>
                  <button 
                    onClick={() => { setViewingCandidate(candidate); setEditFormData(candidate); setIsEditingProfile(true); setActiveDropdown(null); }} 
                    className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-dark/60" /> 
                    <span>Edit Profile</span>
                  </button>
                  <div className="h-px bg-brand-ash/40 my-1" />
                  <button onClick={() => handleDelete(candidate.id)} className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-left cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5 text-red-600" /> <span>Delete Profile</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-brand-white border border-brand-ash/60 rounded-2xl shadow-xs min-h-[380px] pb-32">
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ash/20 text-brand-dark/70 text-xs uppercase tracking-wider border-b border-brand-ash/60">
                <th className="px-6 py-4 font-bold">Candidate Info</th>
                <th className="px-6 py-4 font-bold">Verified Badges</th>
                <th className="px-6 py-4 font-bold">Date Added</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ash/40">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-brand-ash/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => { setViewingCandidate(candidate); setIsEditingProfile(false); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold font-header uppercase shrink-0">
                        {String(candidate?.name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm sm:text-base hover:text-brand-green transition-colors leading-snug">
                          {candidate?.name || "Unnamed Candidate"}
                        </p>
                        <p className="text-brand-dark/60 text-xs sm:text-sm font-medium">
                          {candidate?.role || "No role specified"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {candidate.badges?.map((badge, i) => (
                        <span key={i} className="bg-brand-ash/30 border border-brand-ash/60 text-brand-dark/75 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max">
                          <ShieldCheck className="w-2.5 h-2.5 text-brand-green" /> {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-brand-dark/70 text-xs sm:text-sm font-medium">{candidate.dateAdded}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border ${
                      candidate.status === "Available" ? "bg-brand-green/10 text-brand-green border-brand-green/25" : 
                      candidate.status === "In-Review" ? "bg-brand-orange/10 text-brand-orange border-brand-orange/25" : 
                      "bg-brand-dark text-brand-white border-brand-dark"
                    }`}>
                      {candidate.status === "Available" && <CheckCircle2 className="w-3 h-3 text-brand-green" />}
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button 
                      onClick={() => toggleDropdown(candidate.id)}
                      className="p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-ash/30 rounded-full active:scale-95 transition-all cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {activeDropdown === candidate.id && (
                      <>
                        <div className="fixed inset-0 z-30 bg-transparent" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-8 top-12 w-48 bg-brand-white border border-brand-ash/70 rounded-xl shadow-lg z-40 py-2 flex flex-col text-left">
                          <button 
                            onClick={() => { setViewingCandidate(candidate); setIsEditingProfile(false); setActiveDropdown(null); }} 
                            className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 cursor-pointer text-left"
                          >
                            <FileText className="w-3.5 h-3.5 text-brand-dark/60" /> <span>View Profile</span>
                          </button>
                          
                          <button 
                            onClick={() => { setViewingCandidate(candidate); setEditFormData(candidate); setIsEditingProfile(true); setActiveDropdown(null); }} 
                            className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 cursor-pointer text-left"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-brand-dark/60" /> <span>Edit Profile</span>
                          </button>
                          
                          <div className="h-px bg-brand-ash/40 my-1" />
                          <button onClick={() => handleDelete(candidate.id)} className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5 text-red-600" /> <span>Delete Profile</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD CANDIDATE MODAL (Unchanged)                                           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
         <div className="fixed inset-0" onClick={() => !isSubmittingManual && setIsAddModalOpen(false)} />
         <div className="relative w-full max-w-2xl bg-brand-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 xs:p-6 sm:p-7 z-10 my-auto border border-brand-ash/60 animate-fade-in flex flex-col max-h-[85vh]">
           {/* ... (Your existing Add Candidate code remains fully intact here) ... */}
           {/* Modal Header */}
           <div className="flex items-center justify-between pb-4 border-b border-brand-ash/50">
             <div>
               <h2 className="font-header text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
                 <UserPlus className="w-5 h-5 text-brand-green" />
                 Add Candidate
               </h2>
               <p className="text-brand-dark/60 text-xs sm:text-sm mt-0.5">
                 Import from submissions or manually create a profile.
               </p>
             </div>
             <button 
               onClick={() => !isSubmittingManual && setIsAddModalOpen(false)}
               className="w-8 h-8 flex items-center justify-center bg-brand-ash/30 hover:bg-brand-ash/60 rounded-full transition-colors active:scale-95 shadow-xs cursor-pointer"
               disabled={isSubmittingManual}
             >
               <X className="w-4 h-4 text-brand-dark" />
             </button>
           </div>

           {/* Toggle Switch */}
           <div className="flex items-center bg-brand-ash/30 rounded-xl p-1 mt-5 mb-2 border border-brand-ash/50">
             <button
               onClick={() => setAddMode("import")}
               className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                 addMode === "import" ? "bg-brand-white text-brand-dark shadow-sm border border-brand-ash/60" : "text-brand-dark/60 hover:text-brand-dark"
               }`}
             >
               Import from Forms
             </button>
             <button
               onClick={() => setAddMode("manual")}
               className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                 addMode === "manual" ? "bg-brand-white text-brand-dark shadow-sm border border-brand-ash/60" : "text-brand-dark/60 hover:text-brand-dark"
               }`}
             >
               Manual Entry
             </button>
           </div>

           {/* Content Body */}
           <div className="flex-1 overflow-y-auto no-scrollbar py-2">
             {addMode === "import" && (
               <div className="space-y-3 mt-2">
                 {loadingSubmissions ? (
                   <div className="py-12 flex flex-col items-center justify-center gap-3 text-brand-dark/60 text-sm">
                     <Loader2 className="w-6 h-6 animate-spin text-brand-green" />
                     <span>Loading recent form applicants...</span>
                   </div>
                 ) : submissionsList.length === 0 ? (
                   <div className="py-12 text-center text-brand-dark/60 text-sm">
                     No unassigned form submissions found.
                   </div>
                 ) : (
                   submissionsList.map((sub) => {
                     const { fullName, email, role } = extractCandidateData(sub.data);
                     const isProcessing = promotingId === sub.id;
                     return (
                       <div key={sub.id} className="bg-brand-ash/15 border border-brand-ash/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-green/40 transition-colors">
                         <div className="min-w-0">
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-brand-dark text-sm sm:text-base truncate">{fullName}</h4>
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-green/10 text-brand-green border border-brand-green/20">{role}</span>
                           </div>
                           <p className="text-xs text-brand-dark/60 truncate mt-0.5">{email} • Submitted {sub.submittedAt}</p>
                         </div>
                         <button
                           onClick={() => handleAddFromSubmission(sub)}
                           disabled={isProcessing}
                           className="px-4 py-2 bg-brand-dark text-brand-white text-xs font-bold rounded-xl hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                         >
                           {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                           <span>{isProcessing ? "Adding..." : "Add to Pool"}</span>
                         </button>
                       </div>
                     );
                   })
                 )}
               </div>
             )}

             {addMode === "manual" && (
               <form onSubmit={handleManualSubmit} className="space-y-4 mt-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Full Name</label>
                     <input type="text" required value={manualFormData.name} onChange={(e) => setManualFormData({...manualFormData, name: e.target.value})} className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="e.g., Matthew Raji" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Email Address</label>
                     <input type="email" required value={manualFormData.email} onChange={(e) => setManualFormData({...manualFormData, email: e.target.value})} className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="name@example.com" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Primary Role</label>
                   <input type="text" required value={manualFormData.role} onChange={(e) => setManualFormData({...manualFormData, role: e.target.value})} className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="e.g., Frontend Developer" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider flex items-center justify-between"><span>Resume Link</span><span className="text-[10px] text-brand-dark/40 font-medium normal-case">(Optional)</span></label>
                   <input type="url" value={manualFormData.resumeUrl} onChange={(e) => setManualFormData({...manualFormData, resumeUrl: e.target.value})} className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="https://drive.google.com/..." />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Initial Status</label>
                   <select value={manualFormData.status} onChange={(e) => setManualFormData({...manualFormData, status: e.target.value as "Available" | "In-Review" | "Placed"})} className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer appearance-none">
                     <option value="Available">Available</option><option value="In-Review">In-Review</option><option value="Placed">Placed</option>
                   </select>
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="submit" disabled={isSubmittingManual} className="w-full px-4 py-3 rounded-xl bg-brand-dark text-brand-white font-bold text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:active:scale-100 shadow-xs">
                     {isSubmittingManual ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4" /> Save Candidate Manually</>}
                   </button>
                 </div>
               </form>
             )}
           </div>
         </div>
       </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW / EDIT CANDIDATE PROFILE MODAL                                       */}
      {/* ========================================================================= */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
          <div className="fixed inset-0" onClick={() => !isSavingProfile && setViewingCandidate(null)} />
          
          <div className="relative w-full max-w-2xl bg-brand-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-5 xs:p-6 sm:p-8 z-10 my-auto max-h-[calc(90vh-2rem)] overflow-y-auto no-scrollbar border border-brand-ash/60">
            
            {/* Action Header */}
            <div className="flex justify-between items-center w-full mb-6 pb-6 border-b border-brand-ash/60">
              <h2 className="font-header text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
                {isEditingProfile ? <Edit3 className="w-5 h-5 text-brand-green" /> : <Briefcase className="w-5 h-5 text-brand-green" />}
                {isEditingProfile ? "Edit Profile" : "Candidate Profile"}
              </h2>
              
              <div className="flex gap-2">
                {!isEditingProfile ? (
                  <>
                    <button 
                      onClick={() => { setEditFormData(viewingCandidate); setIsEditingProfile(true); }}
                      className="px-4 py-2 bg-brand-ash/30 text-brand-dark border border-brand-ash/60 text-xs font-bold rounded-xl hover:bg-brand-ash/50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={() => setViewingCandidate(null)}
                      className="w-8 h-8 flex items-center justify-center bg-brand-ash/30 hover:bg-brand-ash/60 rounded-full transition-colors active:scale-95 shadow-xs cursor-pointer"
                    >
                      <X className="w-4 h-4 text-brand-dark" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isSavingProfile}
                      className="px-4 py-2 text-brand-dark/60 text-xs font-bold rounded-xl hover:bg-brand-ash/20 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-4 py-2 bg-brand-green text-brand-white text-xs font-bold rounded-xl hover:bg-brand-orange transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* MODAL BODY */}
            {isEditingProfile ? (
              /* EDIT MODE */
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" value={editFormData.name || ""} 
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" value={editFormData.email || ""} 
                      onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Primary Role</label>
                  <input 
                    type="text" value={editFormData.role || ""} 
                    onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Professional Bio</label>
                  <textarea 
                    rows={4} value={editFormData.bio || ""} 
                    onChange={e => setEditFormData({...editFormData, bio: e.target.value})}
                    className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green resize-y"
                    placeholder="Brief summary of their career and goals..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">LinkedIn URL</label>
                    <input 
                      type="url" value={editFormData.linkedinUrl || ""} 
                      onChange={e => setEditFormData({...editFormData, linkedinUrl: e.target.value})}
                      className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Portfolio URL</label>
                    <input 
                      type="url" value={editFormData.portfolioUrl || ""} 
                      onChange={e => setEditFormData({...editFormData, portfolioUrl: e.target.value})}
                      className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                      placeholder="https://github.com/... or personal site"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 mb-1.5 uppercase tracking-wider">Resume / CV Link</label>
                  <input 
                    type="url" value={editFormData.resumeUrl || ""} 
                    onChange={e => setEditFormData({...editFormData, resumeUrl: e.target.value})}
                    className="w-full bg-brand-ash/15 border border-brand-ash/60 rounded-xl px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            ) : (
              /* READ-ONLY MODE */
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold font-header uppercase text-2xl sm:text-3xl shrink-0 shadow-xs">
                    {String(viewingCandidate?.name || "?").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-header text-xl xs:text-2xl sm:text-3xl font-bold text-brand-dark mb-0.5 tracking-tight">
                      {viewingCandidate?.name || "Unnamed Candidate"}
                    </h2>
                    <p className="text-brand-dark/75 text-sm sm:text-base font-semibold mb-2">
                      {viewingCandidate?.role || "No role specified"}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-xs sm:text-sm text-brand-dark/70">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Mail className="w-3.5 h-3.5 text-brand-green" /> 
                        <span className="break-all">{viewingCandidate.email}</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max border ${
                        viewingCandidate.status === "Available" ? "bg-brand-green/10 text-brand-green border-brand-green/25" : 
                        viewingCandidate.status === "In-Review" ? "bg-brand-orange/10 text-brand-orange border-brand-orange/25" : 
                        "bg-brand-dark text-brand-white border-brand-dark"
                      }`}>
                        {viewingCandidate.status === "Available" && <CheckCircle2 className="w-3 h-3" />}
                        {viewingCandidate.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {viewingCandidate.bio && (
                    <div>
                      <h3 className="font-header text-sm sm:text-base font-bold text-brand-dark mb-2.5">About Candidate</h3>
                      <div className="bg-brand-ash/10 rounded-xl p-4 text-sm text-brand-dark/85 border border-brand-ash/40 whitespace-pre-wrap leading-relaxed">
                        {viewingCandidate.bio}
                      </div>
                    </div>
                  )}

                  {(viewingCandidate.linkedinUrl || viewingCandidate.portfolioUrl) && (
                    <div>
                      <h3 className="font-header text-sm sm:text-base font-bold text-brand-dark mb-2.5">Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {viewingCandidate.linkedinUrl && (
                          <a href={viewingCandidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-ash/20 border border-brand-ash/50 rounded-lg text-xs font-bold text-brand-dark hover:bg-brand-ash/40 transition-colors">
                            <LinkIcon className="w-3.5 h-3.5 text-brand-green" /> LinkedIn
                          </a>
                        )}
                        {viewingCandidate.portfolioUrl && (
                          <a href={viewingCandidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-ash/20 border border-brand-ash/50 rounded-lg text-xs font-bold text-brand-dark hover:bg-brand-ash/40 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 text-brand-orange" /> Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-header text-sm sm:text-base font-bold text-brand-dark mb-2.5">Verified Badges</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {viewingCandidate.badges?.length ? (
                        viewingCandidate.badges.map((badge, i) => (
                          <span key={i} className="bg-brand-ash/30 border border-brand-ash/60 text-brand-dark/80 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" /> {badge}
                          </span>
                        ))
                      ) : (
                        <span className="text-brand-dark/50 text-xs italic">No badges added yet. Edit profile to add.</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-header text-sm sm:text-base font-bold text-brand-dark mb-2.5">System Information</h3>
                    <div className="bg-brand-ash/15 rounded-xl p-4 text-xs sm:text-sm text-brand-dark/80 space-y-2.5 border border-brand-ash/50">
                      <p className="flex justify-between items-center"><strong className="font-bold text-brand-dark">Candidate ID:</strong> <span className="font-mono">#{viewingCandidate.id?.toString().padStart(4, "0") || "NEW"}</span></p>
                      <p className="flex justify-between items-center"><strong className="font-bold text-brand-dark">Date Added:</strong> <span>{viewingCandidate.dateAdded}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-5 mt-6 border-t border-brand-ash/60">
                  <a href={`mailto:${viewingCandidate.email}`} className="flex-1 bg-brand-dark text-brand-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs text-center">
                    <Mail className="w-4 h-4" /> <span>Send Email</span>
                  </a>
                  
                  {viewingCandidate.resumeUrl ? (
                    <a href={viewingCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-brand-ash/30 border border-brand-ash/70 text-brand-dark py-3 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-ash/50 active:scale-98 transition-all flex items-center justify-center gap-2 text-center cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> <span>View Resume</span>
                    </a>
                  ) : (
                    <button type="button" disabled className="flex-1 bg-brand-ash/10 border border-brand-ash/40 text-brand-dark/40 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-center cursor-not-allowed">
                      <FileText className="w-4 h-4" /> <span>No Resume Attached</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
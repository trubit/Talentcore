"use client";

import { useState } from "react";
import { 
  Building2, GraduationCap, FileText, Briefcase, 
  Settings2, Eye, ShieldCheck 
} from "lucide-react";
import EmployerForm from "@/components/forms/EmployerForm";
import GraduateForm from "@/components/forms/GraduateForm";
import DynamicForm from "@/components/DynamicForm";

type FormKey = "application" | "candidate_request" | "job_listing" | "resume_writing";

export default function AdminFormsPage() {
  const [activeForm, setActiveForm] = useState<FormKey>("application");

  const formTabs = [
    { key: "application" as FormKey, label: "Graduate Form", icon: GraduationCap, color: "text-brand-green" },
    { key: "candidate_request" as FormKey, label: "Employer Form", icon: Building2, color: "text-brand-orange" },
    { key: "job_listing" as FormKey, label: "Job Listing Form", icon: Briefcase, color: "text-blue-500" },
    { key: "resume_writing" as FormKey, label: "Resume Package Form", icon: FileText, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-brand-ash/10 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-white p-6 rounded-3xl border border-brand-ash/40 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-brand-dark" />
              <h1 className="font-header text-2xl font-bold text-brand-dark">Forms Administration</h1>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">Preview, test, and manage client-facing forms in live admin mode.</p>
          </div>
          <div className="flex items-center gap-2 bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1.5 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> System Ready
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {formTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeForm === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveForm(tab.key)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  isActive
                    ? "bg-brand-dark text-white border-brand-dark shadow-md scale-[1.01]"
                    : "bg-brand-white text-brand-dark border-brand-ash/50 hover:border-brand-dark/40"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-white" : tab.color}`} />
                <span className="font-bold text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Form Display Area */}
        <div className="bg-brand-white rounded-3xl p-6 md:p-8 border border-brand-ash/40 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-ash/20">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/50 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Live Form Preview
            </span>
            <span className="text-xs text-brand-dark/60">
              Form Schema ID: <code className="bg-brand-ash/30 px-2 py-0.5 rounded font-mono text-brand-dark">{activeForm}</code>
            </span>
          </div>

          <div className="flex justify-center">
            {activeForm === "application" ? (
              <GraduateForm isAdmin />
            ) : activeForm === "candidate_request" ? (
              <EmployerForm isAdmin />
            ) : (
              <DynamicForm formId={activeForm} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
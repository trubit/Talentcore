"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Save, Plus, Trash2, CheckCircle2, ChevronRight, 
  GripVertical, Sliders, FileCode2, AlertCircle, Inbox 
} from "lucide-react";
import { updateFormSchema } from "./actions";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "email" | "select" | "file";
  required: boolean;
  options?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export default function FormsClient({ initialForms }: { initialForms: any[] }) {
  
  // 1. DATA NORMALIZER: Map all 8 Forms
  const [forms, setForms] = useState<FormSchema[]>(() => {
    const standardForms = [
      // --- ONBOARDING FORMS ("How it Works") ---
      { id: "application", title: "Graduate Onboarding", description: "Main application form for graduates joining the network." },
      { id: "candidate_request", title: "Employer Request", description: "Main request form for employers seeking talent." },
      
      // --- EMPLOYER SERVICES ---
      { id: "job_listing", title: "Job Listing Service", description: "Intake fields for employers posting a job." },
      { id: "job_matching", title: "Job Matching Service", description: "Intake fields for premium candidate matching." },
      { id: "outsource_hr", title: "Outsource HR Service", description: "Inquiry fields for HR outsourcing." },

      // --- CANDIDATE SERVICES ---
      { id: "job_placement", title: "Job Placement Service", description: "Intake fields for graduate job placement." },
      { id: "career_readiness", title: "Career Readiness", description: "Application for career readiness coaching." },
      { id: "resume_writing", title: "Resume Writing", description: "Intake fields for the resume writing package." },
    ];

    return standardForms.map((standard) => {
      const dbMatch = initialForms.find((dbForm) => dbForm.id === standard.id);
      return {
        ...standard,
        fields: dbMatch?.schemaDefinition || [],
      };
    });
  });

  const [activeFormId, setActiveFormId] = useState<string>(forms[0]?.id || "application");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const activeForm = forms.find((f: FormSchema) => f.id === activeFormId);

  const handleAddField = () => {
    if (!activeForm) return;
    const newField: FormField = { 
      id: `f_${Date.now()}`, 
      label: "New Field Label", 
      type: "text", 
      required: false 
    };
    setForms(forms.map((f: FormSchema) => 
      f.id === activeFormId ? { ...f, fields: [...f.fields, newField] } : f
    ));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!activeForm) return;
    setForms(forms.map((f: FormSchema) => 
      f.id === activeFormId ? {
        ...f,
        fields: f.fields.map((field: FormField) => 
          field.id === fieldId ? { ...field, ...updates } : field
        )
      } : f
    ));
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeForm) return;
    setForms(forms.map((f: FormSchema) => 
      f.id === activeFormId ? { 
        ...f, 
        fields: f.fields.filter((field: FormField) => field.id !== fieldId) 
      } : f
    ));
  };

  const handleSaveForm = async () => {
    if (!activeForm) return;
    setIsSaving(true);
    setIsSaved(false);
    
    try {
      const result = await updateFormSchema(activeForm.id, activeForm.fields);
      
      if (result && result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      } else {
        alert(result?.error || "Failed to update database.");
      }
    } catch (err) {
      console.error("Client side save error:", err);
      alert("Network or server error while saving form.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl xs:text-3xl font-bold text-brand-dark mb-1 tracking-tight">
            Form Schema Builder
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            Configure dynamic fields, inputs, and validation rules for all 8 application forms.
          </p>
        </div>

        {activeForm && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link 
              href={`/admin/forms/${activeForm.id}/submissions`}
              className="text-xs sm:text-sm font-bold text-brand-white bg-brand-dark px-4 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-orange active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Inbox className="w-4 h-4" />
              <span>View Submissions</span>
            </Link>
          </div>
        )}
      </div>

      {/* MOBILE FORM SELECTOR STRIP */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {forms.map((form: FormSchema) => (
          <button
            key={form.id}
            onClick={() => setActiveFormId(form.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 flex items-center gap-1.5 border cursor-pointer ${
              activeFormId === form.id
                ? "bg-brand-dark text-brand-white border-brand-dark shadow-xs"
                : "bg-brand-white text-brand-dark/70 border-brand-ash/70 hover:bg-brand-ash/30"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-brand-green shrink-0" />
            <span>{form.title}</span>
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
        
        {/* Desktop Sidebar Selector */}
        <aside className="hidden md:block w-full md:w-1/3 bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs shrink-0">
          <div className="flex items-center justify-between mb-4 px-2 pb-2 border-b border-brand-ash/40">
            <h3 className="font-header font-bold text-brand-dark text-xs uppercase tracking-wider">
              Available Forms
            </h3>
            <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
              {forms.length} Active
            </span>
          </div>

          {/* Form List with Visual Grouping */}
          <div className="space-y-1.5">
            {forms.map((form: FormSchema, idx: number) => {
              const isActive = activeFormId === form.id;
              
              // Add tiny visual dividers between categories for better UI
              const showDivider = idx === 2 || idx === 5;

              return (
                <div key={form.id}>
                  {showDivider && <div className="h-px bg-brand-ash/50 my-3 mx-2" />}
                  <button
                    onClick={() => setActiveFormId(form.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left active:scale-98 cursor-pointer border ${
                      isActive 
                        ? "bg-brand-green/10 border-brand-green/30 text-brand-green font-bold shadow-2xs" 
                        : "bg-transparent border-transparent hover:bg-brand-ash/20 text-brand-dark/75 hover:text-brand-dark"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Sliders className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-green" : "text-brand-dark/50"}`} />
                      <span className="text-xs sm:text-sm truncate">{form.title}</span>
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 text-brand-green shrink-0" />}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Form Fields Canvas */}
        {activeForm && (
          <div className="w-full md:w-2/3 bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs flex flex-col min-h-[500px]">
            
            {/* Form Info Header */}
            <div className="mb-6 sm:mb-8 border-b border-brand-ash/50 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCode2 className="w-4 h-4 text-brand-green shrink-0" />
                  <h2 className="font-header text-lg sm:text-2xl font-bold text-brand-dark tracking-tight">
                    {activeForm.title}
                  </h2>
                </div>
                <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
                  {activeForm.description || "Configure the dynamic schema for this form."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="text-[10px] sm:text-xs font-bold text-brand-dark bg-brand-ash/30 border border-brand-ash/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-mono">
                  ID: {activeForm.id}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand-dark bg-brand-ash/30 border border-brand-ash/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                  {activeForm.fields.length} {activeForm.fields.length === 1 ? "Field" : "Fields"}
                </span>
              </div>
            </div>

            {/* Dynamic Fields List */}
            <div className="space-y-4 mb-8">
              {activeForm.fields.map((field: FormField, index: number) => (
                <div 
                  key={field.id} 
                  className="group relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-brand-ash/15 border border-brand-ash/70 rounded-2xl hover:border-brand-green/40 hover:bg-brand-ash/25 transition-all shadow-2xs"
                >
                  <div className="mt-2.5 flex flex-col items-center gap-1 text-brand-dark/40 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-brand-dark/60">
                      0{index + 1}
                    </span>
                    <GripVertical className="w-4 h-4 cursor-grab" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 uppercase tracking-wider mb-1.5">
                        Field Label <span className="text-brand-orange">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={field.label}
                        onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                        className="w-full bg-brand-white border border-brand-ash/70 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-brand-dark font-medium placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="e.g. Full Name"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 uppercase tracking-wider mb-1.5">
                        Input Type
                      </label>
                      <select 
                        value={field.type}
                        onChange={(e) => handleUpdateField(field.id, { type: e.target.value as FormField["type"] })}
                        className="w-full bg-brand-white border border-brand-ash/70 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text (Paragraph)</option>
                        <option value="email">Email Address</option>
                        <option value="select">Dropdown Menu</option>
                        <option value="file">File / Document Upload</option>
                      </select>
                    </div>

                    {field.type === "select" && (
                      <div className="sm:col-span-2 bg-brand-white/80 p-3 rounded-xl border border-brand-ash/60">
                        <label className="block text-[11px] sm:text-xs font-bold text-brand-dark/70 uppercase tracking-wider mb-1">
                          Dropdown Options (Comma-Separated)
                        </label>
                        <input 
                          type="text" 
                          value={field.options || ""}
                          placeholder="Option A, Option B, Option C"
                          onChange={(e) => handleUpdateField(field.id, { options: e.target.value })}
                          className="w-full bg-brand-ash/10 border border-brand-ash/70 rounded-lg px-3 py-2 text-xs sm:text-sm text-brand-dark font-medium placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input 
                        type="checkbox" 
                        id={`req_${field.id}`}
                        checked={field.required}
                        onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-brand-ash/80 text-brand-green focus:ring-brand-green/30 accent-brand-green cursor-pointer" 
                      />
                      <label htmlFor={`req_${field.id}`} className="text-xs sm:text-sm font-bold text-brand-dark select-none cursor-pointer">
                        Mark as Required Field
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteField(field.id)}
                    className="p-2 text-brand-dark/40 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}

              {activeForm.fields.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-brand-ash/70 rounded-2xl space-y-2">
                  <AlertCircle className="w-6 h-6 text-brand-dark/40 mx-auto" />
                  <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
                    This form currently has no input fields. Click below to add one.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pt-6 mt-auto border-t border-brand-ash/50">
              <button onClick={handleAddField} className="w-full sm:w-auto px-5 py-3 sm:py-3.5 border-2 border-brand-green/80 text-brand-green rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-green hover:text-brand-white active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Add New Field
              </button>

              <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center gap-3 justify-end">
                {isSaved && (
                  <span className="text-xs sm:text-sm font-bold text-brand-green flex items-center justify-center gap-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-2 rounded-xl animate-fade-in text-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" /> Form Schema Saved!
                  </span>
                )}
                <button 
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-brand-green text-brand-white px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-brand-glow disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {isSaving ? "Saving Schema..." : "Save Form"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Building2, 
  Upload, AlertCircle, Loader2 
} from "lucide-react";
import { submitDynamicForm } from "@/components/DynamicForm/actions";
import MeetingScheduler from "@/components/scheduling/MeetingScheduler";
import { useFormModal } from "@/context/FormModalContext";

interface EmployerFormProps {
  formId?: string;
  initialSchema?: any[]; 
  isAdmin?: boolean;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}

export default function EmployerForm({ 
  formId = "candidate_request",
  initialSchema = [], 
  isAdmin = false, 
  onSuccess, 
  onClose 
}: EmployerFormProps) {
  const { setIsDirty } = useFormModal();
  
  // 1. DATA NORMALIZER: Synchronize schema dynamically with props
  const schema = useMemo(() => {
    if (!initialSchema || initialSchema.length === 0) return [];
    if (initialSchema[0]?.fields) return initialSchema;
    
    return [{ 
      step: 1, 
      title: "Role Requirements", 
      description: "Specify the details and scope for your ideal candidate.", 
      fields: initialSchema 
    }];
  }, [initialSchema]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = schema.length;
  const currentSection = schema[currentStep - 1] || schema[0];

  // Auto-detect employer details for meeting scheduling
  const employerEmail = useMemo(() => {
    return Object.entries(formData).find(([k, v]) => 
      k.toLowerCase().includes("email") && typeof v === "string" && v.includes("@")
    )?.[1] || "";
  }, [formData]);

  const employerCompany = useMemo(() => {
    return Object.entries(formData).find(([k, v]) => 
      (k.toLowerCase().includes("company") || k.toLowerCase().includes("organization")) && typeof v === "string"
    )?.[1] || "";
  }, [formData]);

  const employerContactName = useMemo(() => {
    return Object.entries(formData).find(([k, v]) => 
      (k.toLowerCase().includes("name") || k.toLowerCase().includes("fullname") || k.toLowerCase().includes("contact")) &&
      !k.toLowerCase().includes("company") && typeof v === "string"
    )?.[1] || "";
  }, [formData]);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`talentcore_draft_${formId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormData(parsed);
          setIsDirty(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [formId, setIsDirty]);

  const handleInputChange = (fieldId: string, value: any) => {
    if (validationError) setValidationError(null);
    setFormData(prev => {
      const next = { ...prev, [fieldId]: value };
      try {
        if (!(value instanceof File)) {
          localStorage.setItem(`talentcore_draft_${formId}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
    setIsDirty(true);
  };

  // Validate active step fields
  const validateCurrentStep = (): boolean => {
    if (!currentSection?.fields) return true;

    for (const field of currentSection.fields) {
      if (field.required) {
        const val = formData[field.id];
        if (val === undefined || val === null || val === "" || (field.type === "file" && !(val instanceof File))) {
          setValidationError(`Please fill in "${field.label}".`);
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    } 
    
    setIsSubmitting(true);
    setValidationError(null);

    try {
      // Package text and files
      const submissionData = new FormData();
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          submissionData.append(key, formData[key]);
        }
      }

      const response = await submitDynamicForm(formId, submissionData);
      
      if (!response.success) {
        throw new Error(response.error || "Submission failed.");
      }

      try {
        localStorage.removeItem(`talentcore_draft_${formId}`);
      } catch {}
      setIsDirty(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess(formData);
    } catch (error: any) {
      console.error("Submission failed", error);
      setValidationError(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!schema || schema.length === 0) {
    return (
      <div className="text-center p-8 sm:p-10 border-2 border-dashed border-brand-ash/60 rounded-3xl text-brand-dark/50 text-xs sm:text-sm font-medium">
        No Employer form configuration found. Please check the Admin Dashboard.
      </div>
    );
  }

  // SUCCESS STEP: Render the Reusable Scheduling Section
  if (isSuccess) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-brand-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-ash/40 shadow-xs">
        <MeetingScheduler
          clientEmail={employerEmail}
          clientName={employerContactName}
          companyName={employerCompany}
          meetingType="employer"
          title="Schedule Alignment Call"
          subtitle="Select an open 15-minute slot with our talent team to discuss your candidate requirements."
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-brand-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-ash/40 shadow-xs">
      
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-brand-ash/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-brand-orange shrink-0" />
            <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">Employer Candidate Request</h2>
          </div>
          <p className="text-[11px] sm:text-xs text-brand-dark/60 font-medium">Specify role details, qualifications, and recruitment scope.</p>
        </div>
        {isAdmin && (
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-brand-dark text-brand-white px-2.5 py-1 rounded-md shrink-0">
            Admin Mode
          </span>
        )}
      </div>

      {/* Multi-Step Tracker */}
      {totalSteps > 1 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between relative max-w-sm mx-auto isolate">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-brand-ash/30 -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-dark -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / Math.max(totalSteps - 1, 1)) * 100}%` }}
            />
            {schema.map((s: any, index: number) => {
              const stepNum = s.step || index + 1;
              const isCompleted = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;

              return (
                <div key={`step-${stepNum}`} className="bg-brand-white px-2 relative z-10">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-colors shadow-xs ${
                      isCurrent
                        ? "bg-brand-dark text-brand-white ring-4 ring-brand-dark/15"
                        : isCompleted
                        ? "bg-brand-green text-brand-white"
                        : "bg-brand-ash/30 text-brand-dark/40"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fields Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          className="bg-brand-ash/15 border border-brand-ash/60 p-5 sm:p-6 rounded-2xl"
        >
          <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-1 tracking-tight">{currentSection?.title}</h3>
          {currentSection?.description && (
            <p className="text-brand-dark/65 text-xs sm:text-sm mb-4 sm:mb-5 font-medium">{currentSection.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-4">
            {currentSection?.fields?.map((field: any) => (
              <div key={field.id} className={field.type === "textarea" || field.type === "file" ? "md:col-span-2" : ""}>
                <label className="block text-xs sm:text-sm font-bold text-brand-dark mb-1.5">
                  {field.label} {field.required && <span className="text-brand-orange">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder || "Enter details..."}
                    className="w-full bg-brand-white border border-brand-ash/70 rounded-xl p-3 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-y"
                    value={formData[field.id] || ""}
                    onChange={e => handleInputChange(field.id, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <select
                    className="w-full bg-brand-white border border-brand-ash/70 rounded-xl p-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all appearance-none cursor-pointer"
                    value={formData[field.id] || ""}
                    onChange={e => handleInputChange(field.id, e.target.value)}
                  >
                    <option value="" disabled>Select option...</option>
                    {(Array.isArray(field.options) ? field.options : field.options?.split(",") || []).map((opt: string, i: number) => (
                      <option key={i} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <div className="w-full bg-brand-white border-2 border-dashed border-brand-ash/70 rounded-xl p-6 text-center hover:border-brand-green hover:bg-brand-ash/10 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => handleInputChange(field.id, e.target.files?.[0])}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-brand-dark/70 text-xs sm:text-sm">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                      {formData[field.id] instanceof File ? (
                        <span className="font-bold text-brand-green">{formData[field.id].name}</span>
                      ) : (
                        <span className="font-medium">Click or drag document to attach</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className="w-full bg-brand-white border border-brand-ash/70 rounded-xl p-3 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                    value={formData[field.id] || ""}
                    onChange={e => handleInputChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Validation Banner */}
      {validationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-brand-ash/40">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1 || isSubmitting}
          className="flex items-center gap-1.5 px-2 py-2 font-bold text-[11px] sm:text-xs text-brand-dark/70 hover:text-brand-dark disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-brand-dark text-brand-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> <span>Processing...</span></>
          ) : currentStep === totalSteps ? (
            "Submit Request"
          ) : (
            <><span>Continue</span> <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
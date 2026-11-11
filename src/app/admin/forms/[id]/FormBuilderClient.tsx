"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, 
  Layers, Settings, Eye, Loader2
} from "lucide-react";
import { saveFormSchemaAction } from "../actions";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "file" | "email" | "tel" | "number";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FormStep {
  step: number;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormBuilderClientProps {
  formId: string;
  formTitle: string;
  initialSchema: any[];
}

export default function FormBuilderClient({
  formId,
  formTitle,
  initialSchema = [],
}: FormBuilderClientProps) {
  const router = useRouter();

  const normalizeSchema = (raw: any[]): FormStep[] => {
    if (!raw || raw.length === 0) {
      return [{ step: 1, title: "Step 1: General Details", description: "", fields: [] }];
    }
    if (raw[0]?.fields) {
      return raw.map((s, idx) => ({
        step: s.step || idx + 1,
        title: s.title || `Step ${idx + 1}`,
        description: s.description || "",
        fields: Array.isArray(s.fields) ? s.fields : [],
      }));
    }
    return [{ step: 1, title: "General Information", description: "", fields: raw }];
  };

  const [steps, setSteps] = useState<FormStep[]>(() => normalizeSchema(initialSchema));
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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

  const activeStep = steps[activeStepIndex] || steps[0];

  const moveField = (fieldIndex: number, direction: "up" | "down") => {
    setSteps((prevSteps) => {
      const nextSteps = structuredClone(prevSteps);
      const fields = nextSteps[activeStepIndex].fields;

      if (direction === "up" && fieldIndex > 0) {
        const [moved] = fields.splice(fieldIndex, 1);
        fields.splice(fieldIndex - 1, 0, moved);
      } else if (direction === "down" && fieldIndex < fields.length - 1) {
        const [moved] = fields.splice(fieldIndex, 1);
        fields.splice(fieldIndex + 1, 0, moved);
      }

      setIsDirty(true);
      return nextSteps;
    });
  };

  const handleAddField = () => {
    const newId = `field_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      label: "New Question / Field",
      type: "text",
      placeholder: "Enter placeholder...",
      required: false,
    };

    setSteps((prev) => {
      const next = structuredClone(prev);
      next[activeStepIndex].fields.push(newField);
      setIsDirty(true);
      return next;
    });
  };

  // Safe typed updater preventing 'never' assignment error
  const handleUpdateField = (fieldIndex: number, key: keyof FormField, value: any) => {
    setSteps((prev) => {
      const next = structuredClone(prev);
      const targetField = next[activeStepIndex]?.fields[fieldIndex];
      if (targetField) {
        (targetField as Record<string, any>)[key] = value;
      }
      setIsDirty(true);
      return next;
    });
  };

  const handleDeleteField = (fieldIndex: number) => {
    if (!confirm("Are you sure you want to remove this field?")) return;
    setSteps((prev) => {
      const next = structuredClone(prev);
      next[activeStepIndex].fields.splice(fieldIndex, 1);
      setIsDirty(true);
      return next;
    });
  };

  const handleAddStep = () => {
    setSteps((prev) => {
      const next = [
        ...prev,
        {
          step: prev.length + 1,
          title: `Step ${prev.length + 1}`,
          description: "",
          fields: [],
        },
      ];
      setIsDirty(true);
      return next;
    });
    setActiveStepIndex(steps.length);
  };

  const handleDeleteStep = (stepIdx: number) => {
    if (steps.length <= 1) {
      alert("Forms must have at least one step.");
      return;
    }
    if (!confirm(`Delete "${steps[stepIdx].title}" and all its fields?`)) return;

    setSteps((prev) => {
      const next = prev.filter((_, idx) => idx !== stepIdx).map((s, idx) => ({ ...s, step: idx + 1 }));
      setIsDirty(true);
      return next;
    });
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await saveFormSchemaAction(formId, steps);
      if (response.success) {
        setIsDirty(false);
        alert("Form schema saved successfully!");
        router.refresh();
      } else {
        alert(response.error || "Failed to save schema.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 relative">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/admin/forms" 
            onClick={(e) => {
              if (isDirty && !confirm("You have unsaved changes. Discard and return?")) {
                e.preventDefault();
              }
            }}
            className="w-10 h-10 flex items-center justify-center bg-brand-white border border-brand-ash/60 rounded-xl text-brand-dark/70 hover:text-brand-dark hover:bg-brand-ash/20 transition-all shrink-0 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
          </Link>
          <div>
            <h1 className="font-header text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark tracking-tight flex items-center gap-2">
              <span>{formTitle}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-brand-ash/30 rounded-md text-brand-dark/70">
                {formId}
              </span>
            </h1>
            <p className="text-brand-dark/60 text-xs sm:text-sm font-medium mt-0.5">
              Customize questions, field order, and input validation requirements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border ${
              previewMode 
                ? "bg-brand-dark text-brand-white border-brand-dark" 
                : "bg-brand-white text-brand-dark border-brand-ash/70 hover:bg-brand-ash/20"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? "Exit Preview" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="bg-brand-green text-brand-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : isDirty ? "Save Schema" : "Saved"}</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Bar */}
      <div className="bg-brand-white border border-brand-ash/60 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeStepIndex === idx
                  ? "bg-brand-dark text-brand-white shadow-xs"
                  : "bg-brand-ash/20 text-brand-dark/70 hover:bg-brand-ash/40"
              }`}
            >
              <span>{idx + 1}. {step.title || `Step ${idx + 1}`}</span>
              <span className="text-[10px] opacity-70">({step.fields.length} fields)</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddStep}
          className="px-3.5 py-2 bg-brand-ash/20 hover:bg-brand-ash/40 text-brand-dark text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-brand-green" /> Add Step
        </button>
      </div>

      {/* Step Config Panel */}
      <div className="bg-brand-white border border-brand-ash/60 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-ash/40">
          <div className="flex items-center gap-2 text-brand-dark font-bold text-base sm:text-lg">
            <Layers className="w-5 h-5 text-brand-orange" />
            <span>Step {activeStepIndex + 1} Configuration</span>
          </div>

          {steps.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteStep(activeStepIndex)}
              className="text-xs font-bold text-red-600 hover:text-red-700 p-1 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Step
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Step Title</label>
            <input
              type="text"
              value={activeStep.title}
              onChange={(e) => {
                const val = e.target.value;
                setSteps((prev) => {
                  const next = structuredClone(prev);
                  next[activeStepIndex].title = val;
                  setIsDirty(true);
                  return next;
                });
              }}
              className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green"
              placeholder="e.g. Candidate Profile"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1.5">Step Subtitle / Description</label>
            <input
              type="text"
              value={activeStep.description || ""}
              onChange={(e) => {
                const val = e.target.value;
                setSteps((prev) => {
                  const next = structuredClone(prev);
                  next[activeStepIndex].description = val;
                  setIsDirty(true);
                  return next;
                });
              }}
              className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green"
              placeholder="e.g. Specify your skills, portfolio, and current CV."
            />
          </div>
        </div>
      </div>

      {/* Fields List with Up / Down Ordering */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark flex items-center gap-2">
            <span>Fields in this Step</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-ash/30 text-brand-dark/70 font-sans">
              {activeStep.fields.length}
            </span>
          </h2>

          <button
            type="button"
            onClick={handleAddField}
            className="bg-brand-dark text-brand-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-green transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Question / Field
          </button>
        </div>

        {activeStep.fields.length === 0 ? (
          <div className="bg-brand-white border-2 border-dashed border-brand-ash/80 rounded-3xl p-10 text-center text-brand-dark/60">
            <Settings className="w-8 h-8 text-brand-dark/30 mx-auto mb-2" />
            <p className="text-sm font-bold">No fields in this step yet.</p>
            <p className="text-xs text-brand-dark/50 mt-0.5">Click "Add Question / Field" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeStep.fields.map((field, fieldIdx) => {
              const isFirst = fieldIdx === 0;
              const isLast = fieldIdx === activeStep.fields.length - 1;

              return (
                <div
                  key={field.id}
                  className="bg-brand-white border border-brand-ash/70 hover:border-brand-dark/40 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-start gap-4"
                >
                  {/* Reordering Controls (Up / Down) */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-1 bg-brand-ash/15 p-1.5 rounded-xl border border-brand-ash/50 shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveField(fieldIdx, "up")}
                      className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Field Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    
                    <span className="text-[11px] font-bold text-brand-dark/60 font-mono px-1">
                      {fieldIdx + 1}
                    </span>

                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveField(fieldIdx, "down")}
                      className="p-1.5 rounded-lg hover:bg-brand-white text-brand-dark/70 hover:text-brand-dark disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Field Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Field Configuration Inputs */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    
                    {/* Field Label */}
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-brand-dark/70 mb-1">Field Label / Title</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(fieldIdx, "label", e.target.value)}
                        className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                        placeholder="e.g. Upload Your Resume / CV"
                      />
                    </div>

                    {/* Database Field ID */}
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark/70 mb-1">Database Key (id)</label>
                      <input
                        type="text"
                        value={field.id}
                        onChange={(e) => handleUpdateField(fieldIdx, "id", e.target.value.replace(/\s+/g, ""))}
                        className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-brand-dark font-mono focus:outline-none focus:border-brand-green"
                        placeholder="e.g. resumeUrl"
                      />
                    </div>

                    {/* Field Type */}
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark/70 mb-1">Input Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateField(fieldIdx, "type", e.target.value as any)}
                        className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                      >
                        <option value="text">Text (Single Line)</option>
                        <option value="textarea">Textarea (Multi-line)</option>
                        <option value="email">Email Address</option>
                        <option value="tel">Phone / WhatsApp</option>
                        <option value="select">Dropdown Select</option>
                        <option value="file">File Upload (Cloudflare R2)</option>
                        <option value="number">Number</option>
                      </select>
                    </div>

                    {/* Options (Only if Select) */}
                    {field.type === "select" && (
                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className="block text-[11px] font-bold text-brand-dark/70 mb-1">
                          Dropdown Options (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(field.options) ? field.options.join(", ") : field.options || ""}
                          onChange={(e) => handleUpdateField(fieldIdx, "options", e.target.value.split(",").map((s) => s.trim()))}
                          className="w-full bg-brand-ash/15 border border-brand-ash/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green"
                          placeholder="e.g. Remote, Onsite, Hybrid"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions: Required Switch & Delete */}
                  <div className="flex items-center md:flex-col justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-brand-ash/40">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-brand-dark select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(field.required)}
                        onChange={(e) => handleUpdateField(fieldIdx, "required", e.target.checked)}
                        className="w-4 h-4 rounded text-brand-green focus:ring-brand-green cursor-pointer"
                      />
                      <span>Required</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteField(fieldIdx)}
                      className="p-1.5 text-brand-dark/40 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, 
  Settings, GripVertical, Loader2, CheckCircle2 
} from "lucide-react";
import { getFormSchema, updateFormSchema } from "@/app/actions/getForm";

interface FormSchemaEditorProps {
  formId: string;
}

export default function FormSchemaEditor({ formId }: FormSchemaEditorProps) {
  // Guaranteed array initialization to satisfy TypeScript
  const [schema, setSchema] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSchema() {
      setLoading(true);
      try {
        const data = await getFormSchema(formId);
        setSchema(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load schema", err);
        setSchema([]);
      } finally {
        setLoading(false);
      }
    }
    loadSchema();
  }, [formId]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const result = await updateFormSchema(formId, schema);
      
      if (result && result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(result?.error || "Failed to save schema to database.");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Step Management ---
  const addStep = () => {
    setSchema((prev: any[]) => [
      ...prev, 
      { step: prev.length + 1, title: "New Step", description: "", fields: [] }
    ]);
  };

  const removeStep = (index: number) => {
    setSchema((prev: any[]) => {
      const newSchema = prev.filter((_, i: number) => i !== index);
      return newSchema.map((s: any, i: number) => ({ ...s, step: i + 1 }));
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === schema.length - 1) return;
    
    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newSchema[index], newSchema[targetIndex]] = [newSchema[targetIndex], newSchema[index]];
      return newSchema.map((s: any, i: number) => ({ ...s, step: i + 1 }));
    });
  };

  const updateStep = (index: number, key: string, value: string) => {
    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      newSchema[index] = { ...newSchema[index], [key]: value };
      return newSchema;
    });
  };

  // --- Field Management ---
  const addField = (stepIndex: number) => {
    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      if (!newSchema[stepIndex].fields) {
        newSchema[stepIndex].fields = [];
      }
      newSchema[stepIndex].fields.push({
        id: `field_${Date.now()}`,
        label: "New Field",
        type: "text",
        placeholder: "",
        required: false
      });
      return newSchema;
    });
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      newSchema[stepIndex].fields = newSchema[stepIndex].fields.filter((_: any, i: number) => i !== fieldIndex);
      return newSchema;
    });
  };

  const updateField = (stepIndex: number, fieldIndex: number, key: string, value: any) => {
    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      newSchema[stepIndex].fields[fieldIndex] = {
        ...newSchema[stepIndex].fields[fieldIndex],
        [key]: value
      };
      return newSchema;
    });
  };

  const moveField = (stepIndex: number, fieldIndex: number, direction: 'up' | 'down') => {
    const fields = schema[stepIndex]?.fields || [];
    if (direction === 'up' && fieldIndex === 0) return;
    if (direction === 'down' && fieldIndex === fields.length - 1) return;

    setSchema((prev: any[]) => {
      const newSchema = [...prev];
      const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
      
      const stepFields = [...(newSchema[stepIndex].fields || [])];
      [stepFields[fieldIndex], stepFields[targetIndex]] = [stepFields[targetIndex], stepFields[fieldIndex]];
      newSchema[stepIndex].fields = stepFields;
      
      return newSchema;
    });
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-dark animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-header text-xl font-bold text-brand-dark flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-dark" /> Schema Editor
          </h2>
          <p className="text-xs text-brand-dark/60 mt-1">
            Modify the structure, steps, and fields for <code className="bg-brand-ash/40 px-1.5 py-0.5 rounded font-mono font-bold text-brand-dark">{formId}</code>.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-orange transition-colors disabled:opacity-70 shadow-sm cursor-pointer w-full sm:w-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4 text-brand-green" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Schema"}
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {schema.map((step, stepIndex) => (
          <div key={stepIndex} className="bg-brand-white border border-brand-ash/60 rounded-2xl overflow-hidden shadow-xs">
            
            {/* Step Header */}
            <div className="bg-brand-ash/20 border-b border-brand-ash/50 p-4 flex items-start gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-1 mt-1">
                <button onClick={() => moveStep(stepIndex, 'up')} disabled={stepIndex === 0} className="text-brand-dark/40 hover:text-brand-dark disabled:opacity-30 cursor-pointer">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div className="w-6 h-6 rounded-md bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {step.step}
                </div>
                <button onClick={() => moveStep(stepIndex, 'down')} disabled={stepIndex === schema.length - 1} className="text-brand-dark/40 hover:text-brand-dark disabled:opacity-30 cursor-pointer">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-2.5">
                <input 
                  type="text" 
                  value={step.title || ""} 
                  onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                  placeholder="Step Title"
                  className="w-full bg-white border border-brand-ash/60 rounded-lg p-2.5 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-dark"
                />
                <input 
                  type="text" 
                  value={step.description || ""} 
                  onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                  placeholder="Step Description (Optional)"
                  className="w-full bg-white border border-brand-ash/60 rounded-lg p-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-dark"
                />
              </div>

              <button onClick={() => removeStep(stepIndex)} className="p-2 text-brand-dark/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Step Fields */}
            <div className="p-4 sm:p-5 bg-brand-ash/5 space-y-3">
              <div className="text-[11px] font-bold text-brand-dark/50 uppercase tracking-wider mb-3 pl-1">Form Fields</div>
              
              {step.fields?.map((field: any, fieldIndex: number) => (
                <div key={fieldIndex} className="flex flex-col sm:flex-row items-start gap-3 bg-white border border-brand-ash/50 rounded-xl p-3 relative group hover:border-brand-dark/30 transition-colors shadow-2xs">
                  
                  <div className="hidden sm:flex flex-col items-center gap-1 mt-1 shrink-0">
                    <button onClick={() => moveField(stepIndex, fieldIndex, 'up')} disabled={fieldIndex === 0} className="text-brand-dark/30 hover:text-brand-dark disabled:opacity-20 cursor-pointer">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <GripVertical className="w-3 h-3 text-brand-ash my-0.5 cursor-grab" />
                    <button onClick={() => moveField(stepIndex, fieldIndex, 'down')} disabled={fieldIndex === (step.fields?.length || 0) - 1} className="text-brand-dark/30 hover:text-brand-dark disabled:opacity-20 cursor-pointer">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    <div className="md:col-span-4">
                      <label className="text-[10px] uppercase text-brand-dark/60 font-bold mb-1.5 block">Label</label>
                      <input type="text" value={field.label || ""} onChange={e => updateField(stepIndex, fieldIndex, 'label', e.target.value)} className="w-full border border-brand-ash/60 rounded-lg p-2 text-xs text-brand-dark focus:outline-none focus:border-brand-dark" />
                    </div>
                    
                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-brand-dark/60 font-bold mb-1.5 block">Type</label>
                      <select value={field.type || "text"} onChange={e => updateField(stepIndex, fieldIndex, 'type', e.target.value)} className="w-full border border-brand-ash/60 rounded-lg p-2 text-xs text-brand-dark focus:outline-none focus:border-brand-dark bg-white cursor-pointer">
                        <option value="text">Text Input</option>
                        <option value="email">Email</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Dropdown (Select)</option>
                        <option value="file">File Upload</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-brand-dark/60 font-bold mb-1.5 block">ID (Database Key)</label>
                      <input type="text" value={field.id || ""} onChange={e => updateField(stepIndex, fieldIndex, 'id', e.target.value)} className="w-full border border-brand-ash/50 rounded-lg p-2 text-xs focus:outline-none focus:border-brand-dark font-mono text-brand-dark/80 bg-brand-ash/20" />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-start md:justify-center pt-2 md:pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!field.required} onChange={e => updateField(stepIndex, fieldIndex, 'required', e.target.checked)} className="w-4 h-4 rounded border-brand-ash/60 text-brand-dark focus:ring-brand-dark accent-brand-dark cursor-pointer" />
                        <span className="text-xs font-bold text-brand-dark">Required</span>
                      </label>
                    </div>

                    {field.type === 'select' && (
                      <div className="md:col-span-12">
                        <label className="text-[10px] uppercase text-brand-dark/60 font-bold mb-1.5 block">Dropdown Options (Comma separated)</label>
                        <input type="text" value={field.options || ""} onChange={e => updateField(stepIndex, fieldIndex, 'options', e.target.value)} placeholder="e.g. Lagos, Abuja, Port Harcourt" className="w-full border border-brand-ash/60 rounded-lg p-2 text-xs text-brand-dark focus:outline-none focus:border-brand-dark bg-brand-ash/5" />
                      </div>
                    )}
                  </div>

                  <button onClick={() => removeField(stepIndex, fieldIndex)} className="absolute top-3 right-3 sm:relative sm:top-0 sm:right-0 text-brand-dark/30 hover:text-red-500 transition-colors sm:mt-6 sm:ml-2 cursor-pointer bg-brand-white sm:bg-transparent rounded-full p-1 sm:p-0">
                    <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}

              <button onClick={() => addField(stepIndex)} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-brand-dark hover:text-brand-white bg-brand-ash/40 hover:bg-brand-dark px-3.5 py-2.5 rounded-lg transition-all mt-3 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Field to Step {step.step}
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addStep} 
          className="w-full border-2 border-dashed border-brand-ash/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-brand-dark/60 hover:text-brand-dark hover:bg-brand-ash/15 hover:border-brand-dark/40 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-ash/40 group-hover:bg-brand-dark group-hover:text-brand-white flex items-center justify-center transition-colors mb-2 sm:mb-3 shadow-xs">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-xs sm:text-sm">Add New Step</span>
        </button>

      </div>
    </div>
  );
}
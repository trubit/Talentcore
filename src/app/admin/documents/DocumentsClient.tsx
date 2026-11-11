"use client";

import { useState } from "react";
import { Save, FileText, CheckCircle2, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { updateLegalDocument } from "./actions"; 

export type LegalDocument = {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
};

export default function DocumentsClient({ initialDocs }: { initialDocs: LegalDocument[] }) {
  // Uses the DB data passed from page.tsx!
  const [docs, setDocs] = useState<LegalDocument[]>(initialDocs);
  const [activeDocId, setActiveDocId] = useState<string>(initialDocs[0]?.id || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeDoc = docs.find(d => d.id === activeDocId);

  const handleContentChange = (newContent: string) => {
    if (!activeDoc) return;
    setDocs(docs.map(doc => 
      doc.id === activeDocId ? { ...doc, content: newContent } : doc
    ));
    if (error) setError(null);
  };

  const handleSaveDocument = async () => {
    if (!activeDoc) return;
    
    setIsSaving(true);
    setIsSaved(false);
    setError(null);
    
    try {
      const result = await updateLegalDocument(activeDoc.slug, activeDoc.content, activeDoc.title);
      
      if (!result || !result.success) {
        throw new Error(result?.error || "Database failed to save.");
      }
      
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      setDocs(docs.map(doc => doc.id === activeDocId ? { ...doc, lastUpdated: today } : doc));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(err.message || "Network Error. Could not reach database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-3xl font-bold text-brand-dark mb-1">Legal Documents</h1>
          <p className="text-brand-dark/60 text-sm">Manage the public policies and agreements on your platform.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 bg-brand-white border border-brand-ash/60 rounded-3xl p-4 shadow-sm shrink-0">
          <h3 className="font-header font-bold text-brand-dark text-sm uppercase tracking-wider mb-4 px-2">Published Docs</h3>
          <div className="space-y-2">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveDocId(doc.id);
                  setError(null);
                  setIsSaved(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                  activeDocId === doc.id 
                    ? "bg-brand-green/10 border-brand-green/30 text-brand-green font-bold shadow-sm" 
                    : "hover:bg-brand-ash/20 text-brand-dark/70 hover:text-brand-dark"
                } border border-transparent`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {doc.title}
                </span>
                {activeDocId === doc.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {activeDoc && (
          <div className="w-full md:w-2/3 bg-brand-white border border-brand-ash/60 rounded-3xl p-8 shadow-sm flex flex-col min-h-[600px]">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-brand-ash/50 pb-6">
              <div>
                <h2 className="font-header text-2xl font-bold text-brand-dark mb-1">{activeDoc.title}</h2>
                <p className="text-brand-dark/50 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Last updated: {activeDoc.lastUpdated}
                </p>
              </div>
              <div className="bg-brand-ash/10 text-brand-dark/60 px-3 py-1.5 rounded-lg text-xs font-mono border border-brand-ash/50">
                /{activeDoc.slug}
              </div>
            </div>

            <div className="flex-1 flex flex-col mb-6">
              <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wide mb-2">
                Document Content
              </label>
              <textarea 
                className="flex-1 w-full bg-brand-ash/5 border border-brand-ash/50 rounded-xl p-5 text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-y min-h-[400px] font-sans leading-relaxed"
                value={activeDoc.content}
                onChange={(e) => handleContentChange(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 mt-auto border-t border-brand-ash/50">
              {error && (
                <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {error}
                </span>
              )}
              {isSaved && !error && (
                <span className="text-sm font-bold text-brand-green flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Document Saved & Published!
                </span>
              )}
              <button 
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full sm:w-auto bg-brand-dark text-brand-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {isSaving ? "Publishing..." : "Save & Publish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
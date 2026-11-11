"use client";

import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import DynamicForm from "@/components/DynamicForm"; 

interface ApplyButtonProps {
  method?: string | null; 
  jobTitle: string;
}

export default function ApplyButton({ method, jobTitle }: ApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeMethod = method || ""; 

  const isEmail = safeMethod.includes("@");
  const isForm = safeMethod.startsWith("form:");

  // Extract form ID (e.g., "form:application" -> "application")
  const formSlug = isForm ? safeMethod.replace("form:", "") : "";

  return (
    <div className="mt-6 pt-5 border-t border-brand-ash/60">

      {/* Button Render Logic */}
      {isForm ? (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full inline-block bg-brand-green text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-95 transition-all shadow-brand-glow text-center cursor-pointer"
        >
          Apply via TalentCore
        </button>
      ) : isEmail ? (
        <a 
          href={`mailto:${safeMethod}?subject=Application for ${jobTitle} via TalentCore`}
          className="w-full inline-block bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-95 transition-all text-center"
        >
          Apply via Email
        </a>
      ) : (
        <a 
          href={safeMethod || "#"}
          target={safeMethod ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="w-full inline-flex bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-95 transition-all items-center justify-center gap-2 text-center"
        >
          <span>Apply Externally</span> 
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {/* Application Modal */}
      {isModalOpen && isForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-brand-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-brand-ash/60">
              <div>
                <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark">Apply for Role</h3>
                <p className="text-xs text-brand-dark/60 font-medium">{jobTitle}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-ash/20 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-ash/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar">
              {/* Fixed: Pass formId correctly and close modal on completion */}
              <DynamicForm 
                formId={formSlug} 
                onSuccess={() => setTimeout(() => setIsModalOpen(false), 2500)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
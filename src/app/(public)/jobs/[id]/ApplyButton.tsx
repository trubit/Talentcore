"use client";

import { ExternalLink, Zap } from "lucide-react";
import { useFormModal } from "@/context/FormModalContext";

interface ApplyButtonProps {
  method?: string | null; 
  jobTitle: string;
  gradFillCode?: string | null;
}

export default function ApplyButton({ method, jobTitle, gradFillCode }: ApplyButtonProps) {
  const { openFormModal } = useFormModal();

  const safeMethod = method || ""; 
  const isEmail = safeMethod.includes("@");
  const isForm = safeMethod.startsWith("form:");
  const formSlug = isForm ? safeMethod.replace("form:", "") : "";

  return (
    <div className="mt-6 pt-5 border-t border-brand-ash/60 space-y-3">
      {/* If this job has a TalentCore Job Code, offer direct referral application */}
      {gradFillCode && (
        <button 
          type="button"
          onClick={() => openFormModal({
            formId: "job_placement",
            title: `Referral Application - ${gradFillCode} (${jobTitle})`,
            isGraduate: true,
          })}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-green text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-95 transition-all shadow-brand-glow text-center cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-brand-white text-brand-white" />
          <span>Get Referred ({gradFillCode})</span>
        </button>
      )}

      {/* Button Render Logic based on method */}
      {isForm ? (
        <button 
          type="button"
          onClick={() => openFormModal({
            formId: formSlug || "application",
            title: `Apply for ${jobTitle}`,
            isGraduate: true,
          })}
          className={`w-full inline-block ${gradFillCode ? "bg-brand-dark hover:bg-brand-dark/90" : "bg-brand-green hover:bg-brand-orange"} text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-brand-glow text-center cursor-pointer`}
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
    </div>
  );
}

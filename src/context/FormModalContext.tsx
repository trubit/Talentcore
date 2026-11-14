"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minimize2, Maximize2, Building2, GraduationCap, ClipboardList } from "lucide-react";
import EmployerForm from "@/components/forms/EmployerForm";
import GraduateForm from "@/components/forms/GraduateForm";
import DynamicForm from "@/components/DynamicForm";

export type ModalType = "employer" | "graduate" | "custom" | null;

export interface FormModalOptions {
  formId?: string;
  title?: string;
  initialSchema?: any[];
  isEmployer?: boolean;
  isGraduate?: boolean;
}

export interface FormModalContextType {
  isOpen: boolean;
  modalType: ModalType;
  formId: string;
  formTitle: string;
  initialSchema: any[];
  isMinimized: boolean;
  isDirty: boolean;
  openModal: (type: "employer" | "graduate") => void;
  openFormModal: (options: FormModalOptions) => void;
  closeModal: (force?: boolean) => void;
  toggleMinimize: () => void;
  setIsDirty: (dirty: boolean) => void;
}

const FormModalContext = createContext<FormModalContextType | undefined>(undefined);

export function useFormModal() {
  const context = useContext(FormModalContext);
  if (!context) {
    throw new Error("useFormModal must be used within a FormModalProvider");
  }
  return context;
}

export function useOptionalFormModal() {
  return useContext(FormModalContext);
}

export function FormModalProvider({ 
  children,
  employerSchema = [],
  graduateSchema = [],
}: { 
  children: ReactNode;
  employerSchema?: any[];
  graduateSchema?: any[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formId, setFormId] = useState<string>("candidate_request");
  const [formTitle, setFormTitle] = useState<string>("Application Form");
  const [activeSchema, setActiveSchema] = useState<any[]>([]);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const openModal = (type: "employer" | "graduate") => {
    setModalType(type);
    if (type === "employer") {
      setFormId("candidate_request");
      setFormTitle("Employer Candidate Request");
      setActiveSchema(employerSchema);
    } else {
      setFormId("application");
      setFormTitle("Graduate Application");
      setActiveSchema(graduateSchema);
    }
    setIsOpen(true);
    setIsMinimized(false);
  };

  const openFormModal = (options: FormModalOptions) => {
    const targetFormId = options.formId || "candidate_request";
    setFormId(targetFormId);
    setFormTitle(options.title || "TalentCore Form");
    setActiveSchema(options.initialSchema || []);

    if (options.isEmployer || targetFormId === "candidate_request") {
      setModalType("employer");
    } else if (targetFormId === "application") {
      setModalType("graduate");
    } else {
      setModalType("custom");
    }

    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeModal = useCallback((force: boolean = false) => {
    if (!force && isDirty) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes in your form. Are you sure you want to discard your progress?"
      );
      if (!confirmDiscard) return;
    }

    setIsOpen(false);
    setModalType(null);
    setIsMinimized(false);
    setIsDirty(false);
  }, [isDirty]);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // 1. Scroll lock when modal is open and not minimized
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, isMinimized]);

  // 2. Prevent accidental browser tab closure while filling form
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

  const getFormIcon = () => {
    if (modalType === "employer") return <Building2 className="w-4 h-4" />;
    if (modalType === "graduate") return <GraduationCap className="w-4 h-4" />;
    return <ClipboardList className="w-4 h-4" />;
  };

  return (
    <FormModalContext.Provider
      value={{
        isOpen,
        modalType,
        formId,
        formTitle,
        initialSchema: activeSchema,
        isMinimized,
        isDirty,
        openModal,
        openFormModal,
        closeModal,
        toggleMinimize,
        setIsDirty,
      }}
    >
      {children}

      {/* GLOBAL MODAL DIALOG */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
            {/* Safe backdrop click with unsaved verification */}
            <div className="fixed inset-0" onClick={() => closeModal(false)} />
            
            <div className="relative w-full max-w-3xl my-auto py-4 z-10 pointer-events-auto">
              {/* Modal Window Controls: Title, Minimize & Close */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 bg-brand-dark/90 px-4 py-2.5 rounded-2xl border border-brand-ash/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-brand-white">
                  <div className="w-7 h-7 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center">
                    {getFormIcon()}
                  </div>
                  <span className="font-header text-xs sm:text-sm font-bold text-brand-white truncate max-w-[280px] xs:max-w-sm sm:max-w-md">
                    {formTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    type="button"
                    onClick={toggleMinimize}
                    className="w-8 h-8 flex items-center justify-center text-brand-white/80 hover:text-brand-green hover:bg-white/10 rounded-lg transition-colors active:scale-95 cursor-pointer"
                    aria-label="Minimize form"
                    title="Minimize form (Preserves entered data)"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => closeModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-brand-white/80 hover:text-brand-orange hover:bg-white/10 rounded-lg transition-colors active:scale-95 cursor-pointer"
                    aria-label="Close form"
                    title="Close form"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl no-scrollbar bg-brand-white shadow-2xl border border-brand-ash/60">
                {modalType === "employer" ? (
                  <EmployerForm 
                    formId={formId}
                    initialSchema={activeSchema.length > 0 ? activeSchema : employerSchema} 
                    onClose={() => closeModal(true)} 
                  />
                ) : modalType === "graduate" ? (
                  <GraduateForm 
                    formId={formId}
                    initialSchema={activeSchema.length > 0 ? activeSchema : graduateSchema} 
                    onClose={() => closeModal(true)} 
                  />
                ) : (
                  <div className="p-5 sm:p-8">
                    <DynamicForm
                      formId={formId}
                      initialSchema={activeSchema}
                      onSuccess={() => {
                        setIsDirty(false);
                        setTimeout(() => closeModal(true), 2500);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING MINIMIZED DOCK */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-5 right-5 z-50 bg-brand-dark text-brand-white border border-brand-green/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
              {getFormIcon()}
            </div>
            
            <div className="text-left cursor-pointer" onClick={toggleMinimize}>
              <p className="text-xs font-bold text-brand-white leading-tight max-w-[200px] truncate">
                {formTitle}
              </p>
              <p className="text-[10px] text-brand-green font-medium">In progress • Click to expand</p>
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <button
                type="button"
                onClick={toggleMinimize}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Expand form"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => closeModal(false)}
                className="p-1.5 text-white/70 hover:text-brand-orange rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Discard form"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </FormModalContext.Provider>
  );
}

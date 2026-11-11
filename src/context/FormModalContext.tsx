"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minimize2, Maximize2, Building2, GraduationCap } from "lucide-react";
import EmployerForm from "@/components/forms/EmployerForm";
import GraduateForm from "@/components/forms/GraduateForm";

export type ModalType = "employer" | "graduate" | null;

export interface FormModalContextType {
  isOpen: boolean;
  modalType: ModalType;
  isMinimized: boolean;
  isDirty: boolean;
  openModal: (type: "employer" | "graduate") => void;
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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const openModal = (type: "employer" | "graduate") => {
    setModalType(type);
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

  return (
    <FormModalContext.Provider
      value={{
        isOpen,
        modalType,
        isMinimized,
        isDirty,
        openModal,
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
            <div className="fixed inset-0" onClick={() => closeModal(false)} />
            
            <div className="relative w-full max-w-3xl my-auto py-4 z-10">
              {/* Modal Window Controls: Minimize & Close */}
              <div className="flex justify-end gap-2 mb-2 sm:mb-3">
                <button 
                  type="button"
                  onClick={toggleMinimize}
                  className="w-10 h-10 flex items-center justify-center text-brand-white hover:text-brand-green bg-brand-dark/80 rounded-full transition-colors backdrop-blur-md active:scale-95 shadow-xs cursor-pointer border border-brand-ash/30"
                  aria-label="Minimize form"
                  title="Minimize form"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => closeModal(false)}
                  className="w-10 h-10 flex items-center justify-center text-brand-white hover:text-brand-orange bg-brand-dark/80 rounded-full transition-colors backdrop-blur-md active:scale-95 shadow-xs cursor-pointer border border-brand-ash/30"
                  aria-label="Close form"
                  title="Close form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl no-scrollbar">
                {modalType === "employer" ? (
                  <EmployerForm 
                    initialSchema={employerSchema} 
                    onClose={() => closeModal(true)} 
                  />
                ) : (
                  <GraduateForm 
                    initialSchema={graduateSchema} 
                    onClose={() => closeModal(true)} 
                  />
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
            className="fixed bottom-5 right-5 z-50 bg-brand-dark text-brand-white border border-brand-green/30 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
              {modalType === "employer" ? <Building2 className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </div>
            
            <div className="text-left cursor-pointer" onClick={toggleMinimize}>
              <p className="text-xs font-bold text-brand-white leading-tight">
                {modalType === "employer" ? "Employer Request Form" : "Graduate Application Form"}
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
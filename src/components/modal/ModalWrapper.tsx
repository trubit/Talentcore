"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, AlertTriangle } from "lucide-react";
import { useFormModal } from "@/context/FormModalContext";
import GraduateForm from "../forms/GraduateForm";
import EmployerForm from "../forms/EmployerForm";

export default function ModalWrapper() {
  const { isOpen, modalType, isMinimized, isDirty, closeModal, toggleMinimize } = useFormModal();
  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowExitWarning(true);
    } else {
      closeModal();
    }
  };

  const confirmClose = () => {
    setShowExitWarning(false);
    closeModal();
  };

  if (!isOpen) return null;

  const renderForm = () => {
    switch (modalType) {
      case "graduate":
        return <GraduateForm initialSchema={[]} onClose={handleCloseAttempt} />;
      case "employer":
        return <EmployerForm initialSchema={[]} onClose={handleCloseAttempt} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {/* Dimmed Background - Only show when NOT minimized */}
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[90]"
          onClick={handleCloseAttempt}
        />
      )}

      {/* The Modal Container */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={
          isMinimized 
            ? { opacity: 1, y: 0, scale: 1, bottom: 24, right: 24, top: "auto", left: "auto", width: 320, height: 60 }
            : { opacity: 1, y: "-50%", x: "-50%", scale: 1, top: "50%", left: "50%", width: "90%", maxWidth: 800, height: "auto", maxHeight: "90vh" }
        }
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed z-[100] bg-brand-white shadow-card-hover border border-brand-ash flex flex-col overflow-hidden ${
          isMinimized ? "rounded-full cursor-pointer hover:bg-brand-ash/20" : "rounded-2xl"
        }`}
        style={!isMinimized ? { transform: "translate(-50%, -50%)" } : {}}
      >
        
        {/* Minimized View (Sticky Bottom Right) */}
        {isMinimized ? (
          <div className="flex items-center justify-between w-full h-full px-6" onClick={toggleMinimize}>
            <span className="font-header font-semibold text-brand-dark text-sm">
              Continue filling details...
            </span>
            <Maximize2 className="w-4 h-4 text-brand-green" />
          </div>
        ) : (
          
          /* Maximized View (Center Screen) */
          <>
            {/* Header / Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-ash/50 bg-brand-white sticky top-0 z-10">
              <span className="font-header font-semibold text-brand-green">
                {modalType === "graduate" ? "Candidate Application" : "Employer Request"}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={toggleMinimize} className="p-2 hover:bg-brand-ash rounded-full text-brand-dark transition-colors" title="Minimize">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={handleCloseAttempt} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto no-scrollbar">
              {renderForm()}
            </div>
          </>
        )}
      </motion.div>

      {/* Internal Exit Warning Prompt */}
      <AnimatePresence>
        {showExitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-brand-dark/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-brand-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-card-hover text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-header font-bold text-lg mb-2">Unsaved Changes</h3>
              <p className="text-sm text-brand-ash/80 mb-6">
                If you close this form now, all your current details will be lost. Are you sure you want to exit?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 py-2.5 rounded-full border border-brand-ash text-brand-dark hover:bg-brand-ash/20 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClose}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 font-medium shadow-md transition-colors"
                >
                  Yes, Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
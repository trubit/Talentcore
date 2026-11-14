"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, PhoneCall, Users, UserPlus, Search, Briefcase } from "lucide-react";
import { useFormModal } from "@/context/FormModalContext";

interface HowItWorksProps {
  employerSchema: any[];
  graduateSchema: any[];
}

export default function HowItWorksSection({ employerSchema, graduateSchema }: HowItWorksProps) {
  const [activeTab, setActiveTab] = useState<"employers" | "graduates">("employers");
  const { openModal } = useFormModal();

  const employerSteps = [
    {
      num: "01.",
      title: "Send a Request",
      desc: "Fill out the Candidate Request Form, highlight the position you're hiring for and all other requirements.",
      icon: <Send className="w-5 h-5" />,
      cta: "Fill Request Form",
      action: () => openModal("employer"),
    },
    {
      num: "02.",
      title: "Schedule a Brief Call",
      desc: "Our team will reach out to you to schedule a call at your earliest convenience to ensure we capture what your company really needs.",
      icon: <PhoneCall className="w-5 h-5" />,
    },
    {
      num: "03.",
      title: "Hire Top Talent",
      desc: "We send you 3-5 pre-vetted candidates’ profiles. You interview and hire. It's that simple.",
      icon: <Users className="w-5 h-5" />,
      cta: "Request Candidates Today",
      action: () => openModal("employer"),
    },
  ];

  const graduateSteps = [
    {
      num: "01.",
      title: "Join our Network",
      desc: "Fill out an application form to join our network of 40+ graduates and begin your journey to landing your first job.",
      icon: <UserPlus className="w-5 h-5" />,
      cta: "Join Network Form",
      action: () => openModal("graduate"),
    },
    {
      num: "02.",
      title: "Get Matched to Employers",
      desc: "As soon as we receive a request for your skills, you get contacted by our team and your profile gets sent to the employers.",
      icon: <Search className="w-5 h-5" />,
    },
    {
      num: "03.",
      title: "You Get Invited for Interviews",
      desc: "Our employer partners will invite you for an interview, and if you're selected - you get hired just like that in 3 easy steps.",
      icon: <Briefcase className="w-5 h-5" />,
      cta: "Join Our Network Now",
      action: () => openModal("graduate"),
    },
  ];

  const activeSteps = activeTab === "employers" ? employerSteps : graduateSteps;

  return (
    <section 
      id="how-it-works-employers" 
      className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 relative"
    >
      <div id="how-it-works-graduates" className="absolute -top-24 sm:-top-32" />

      {/* Section Heading & Interactive Tab Selector */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-14 md:mb-16">
        <h2 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-4 sm:mb-6 tracking-tight">
          How it Works
        </h2>
        
        {/* Segmented Switcher */}
        <div className="w-full max-w-[320px] xs:max-w-sm sm:max-w-md flex items-center bg-brand-ash/30 rounded-full p-1 sm:p-1.5 mb-5 sm:mb-6 border border-brand-ash">
          <button
            onClick={() => setActiveTab("employers")}
            className={`flex-1 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "employers" 
                ? "bg-brand-white text-brand-dark shadow-sm border border-brand-ash/50" 
                : "text-brand-dark/60 hover:text-brand-dark active:scale-98"
            }`}
          >
            For Employers
          </button>
          <button
            onClick={() => setActiveTab("graduates")}
            className={`flex-1 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "graduates" 
                ? "bg-brand-white text-brand-dark shadow-sm border border-brand-ash/50" 
                : "text-brand-dark/60 hover:text-brand-dark active:scale-98"
            }`}
          >
            For Graduates
          </button>
        </div>

        {/* Subtitle with dynamic min-height to prevent layout jump */}
        <p className="text-brand-dark/70 text-xs sm:text-sm md:text-base max-w-xl min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center leading-relaxed">
          {activeTab === "employers" 
            ? "Get matched to top talents across Africa and beyond. Try at no cost."
            : "Get matched directly to employers and land your first job. No aimless applications, no silence after applying."}
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative isolate">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand-ash)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-ash)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0 opacity-50 pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeSteps.map((step, index) => (
            <motion.div
              key={step.title + activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className={`bg-brand-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 relative overflow-hidden flex flex-col h-full border border-brand-ash/60 transition-all duration-300 shadow-sm hover:shadow-card-hover ${
                index === 1 ? "md:-translate-y-3 lg:-translate-y-4 shadow-brand-glow border-brand-green/20" : ""
              }`}
            >
              {/* Background Watermark Number */}
              <div className="absolute top-2 sm:top-4 -left-2 sm:-left-4 font-header text-6xl sm:text-7xl md:text-[7.5rem] font-bold text-brand-ash/35 leading-none select-none z-0 pointer-events-none">
                {step.num.replace(".", "")}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mb-4 sm:mb-6">
                  {step.icon}
                </div>
                
                <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-2 sm:mb-3">
                  {step.title}
                </h3>
                
                <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 flex-grow">
                  {step.desc}
                </p>

                {step.cta && (
                  <button 
                    type="button"
                    onClick={step.action}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-brand-dark text-brand-white text-xs sm:text-sm font-semibold hover:bg-brand-orange active:scale-98 transition-all mt-auto flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    {step.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Disclaimer */}
      <AnimatePresence>
        {activeTab === "graduates" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-6 sm:mt-10 text-[11px] sm:text-xs text-brand-dark/60 font-medium px-4"
          >
            * All communication happens directly via Email and verified notification channels. No sign up required.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

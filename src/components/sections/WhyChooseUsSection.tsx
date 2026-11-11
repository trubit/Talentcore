"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import { useFormModal } from "@/context/FormModalContext";

export default function WhyChooseUsSection() {
  const { openModal } = useFormModal();

  return (
    <section className="bg-brand-ash/30 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          <div className="max-w-3xl">
            <h2 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-2 sm:mb-4 md:mb-6 tracking-tight leading-tight">
              Why Choose TalentCore?
            </h2>
            <p className="text-brand-dark/80 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed">
              TalentCore is not a job board or a recruitment agency, but a talent referral partner. Here's why we're different and chosen by employers and graduates alike:
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          
          {/* Employers Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-brand-green rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col h-full text-brand-white shadow-card-hover"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center mb-5 sm:mb-8 shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            
            <h3 className="font-header text-xl sm:text-2xl font-bold mb-2.5 sm:mb-4 text-brand-white">
              For Employers
            </h3>
            
            <p className="text-white/85 sm:text-white/80 text-xs xs:text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 flex-grow font-light">
              As an SME or an early-stage startup founder, you are already handling product, operations, logistics, and so much more. Hiring can feel burdensome and time-consuming. With TalentCore, you receive 3-5 candidates per role so you only have to interview a small group of people and focus your attention on scaling your business.
            </p>

            <button 
              type="button"
              onClick={() => openModal("employer")}
              className="w-full sm:w-auto self-stretch sm:self-start px-6 sm:px-8 py-3.5 sm:py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-brand-green text-xs sm:text-sm font-semibold transition-all border border-white/20 active:scale-98 text-center cursor-pointer"
            >
              Request Candidates
            </button>
          </motion.div>

          {/* Graduates Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-brand-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col h-full text-brand-dark shadow-card-hover border border-brand-ash/60"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-green/10 flex items-center justify-center mb-5 sm:mb-8 shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-brand-green" />
            </div>
            
            <h3 className="font-header text-xl sm:text-2xl font-bold mb-2.5 sm:mb-4">
              For Graduates
            </h3>
            
            <p className="text-brand-dark/80 text-xs xs:text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 flex-grow">
              You have sent 40+ applications, joined many job groups, and are constantly checking your email. But you receive auto-rejection emails or silence. With TalentCore, we walk you into the interview room and guide you on your path to success. We don’t stop until you're hired.
            </p>

            <button 
              type="button"
              onClick={() => openModal("graduate")}
              className="w-full sm:w-auto self-stretch sm:self-start px-6 sm:px-8 py-3.5 sm:py-3 rounded-full bg-brand-dark hover:bg-brand-orange text-brand-white text-xs sm:text-sm font-semibold transition-all active:scale-98 text-center shadow-xs cursor-pointer"
            >
              Join our Network
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
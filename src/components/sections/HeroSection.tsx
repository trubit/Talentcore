"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useFormModal } from "@/context/FormModalContext";

export default function HeroSection() {
  const { openModal } = useFormModal();

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-4 pb-4 md:pb-8 max-w-[1600px] mx-auto">
      
      {/* Expansive, Cinematic Hero Box */}
      <section className="relative w-full bg-brand-dark rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[460px] xs:min-h-[500px] sm:min-h-[580px] md:min-h-[85vh] flex flex-col justify-center px-5 sm:px-8 md:px-16 py-8 sm:py-12 md:py-20 border border-brand-ash/20 isolate shadow-2xl">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105 opacity-60"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Dual Dark Gradient Overlays to Guarantee High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/40 z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40 z-[1] pointer-events-none" />

        {/* Main Content Wrapper */}
        <div className="relative z-10 w-full max-w-3xl mt-0 sm:mt-4 md:mt-20">
            
          {/* Main Typography - Editorial Style */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-header text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-brand-white leading-[1.1] mb-3 sm:mb-6 drop-shadow-sm"
          >
            Talent-Matching, <br />
            <span className="font-serif italic font-light text-brand-white/90 tracking-wide">
              Reimagined.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs xs:text-sm sm:text-base md:text-lg text-brand-white/85 mb-6 sm:mb-8 md:mb-10 font-light max-w-xl leading-relaxed drop-shadow-sm"
          >
            A platform directly connecting vetted graduates with Employers. Hire pre-vetted junior talents for your startup or SME across the continent.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto"
          >
            {/* Opens Employer Modal directly */}
            <button 
              type="button"
              onClick={() => openModal("employer")}
              className="bg-brand-white text-brand-dark px-7 sm:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold hover:bg-brand-green hover:text-brand-white active:scale-98 transition-all flex items-center justify-center gap-2 text-xs xs:text-sm md:text-base text-center cursor-pointer shadow-md"
            >
              <Building2 className="w-4 h-4" />
              <span>Hire Talent</span>
            </button>
            
            {/* Routes directly to all live vacancies */}
            <Link 
              href="/jobs"
              className="bg-brand-dark/60 backdrop-blur-md border border-brand-white/30 text-brand-white px-7 sm:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-medium hover:bg-brand-white/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-xs xs:text-sm md:text-base group text-center shadow-md"
            >
              <span>Find a Job</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom Right: Floating Skill Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-6 sm:bottom-8 right-6 md:right-16 hidden lg:flex flex-wrap justify-end gap-3 max-w-[400px] z-10"
        >
          {["Frontend Dev", "Product Management", "Digital Marketing", "UI/UX Design", "Operations"].map((skill, i) => (
            <span 
              key={i} 
              className="px-4 py-2 rounded-full border border-brand-white/25 text-brand-white/90 text-xs backdrop-blur-md bg-brand-dark/50 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </motion.div>

      </section>
    </div>
  );
}

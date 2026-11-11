"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, TrendingUp } from "lucide-react";

export default function SocialProofSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-6">
        <div>
          <p className="text-brand-orange font-bold text-[10px] xs:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">
            Our Impact
          </p>
          <h2 className="font-header text-2xl xs:text-3xl sm:text-4xl font-bold text-brand-dark leading-tight tracking-tight">
            Bridging the gap between <br className="hidden md:block" /> talent and opportunity.
          </h2>
        </div>
        <p className="text-brand-dark/70 text-xs sm:text-sm max-w-xs md:text-right pb-1 leading-relaxed">
          We promise to deliver beyond your expectations, matching you with the perfect fit quickly.
        </p>
      </div>

      {/* Bento Box Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
      >
        
        {/* Column 1: Stacked Small Cards */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Card 1: Open Vacancies */}
          <motion.div 
            variants={itemVariants} 
            className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-sm hover:shadow-card-hover transition-shadow flex flex-col justify-between h-full min-h-[160px] sm:min-h-[180px]"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
              <span className="text-[10px] xs:text-xs font-bold text-brand-dark/50 uppercase tracking-wider">Jobs</span>
            </div>
            <div>
              <h3 className="font-header text-3xl xs:text-4xl md:text-5xl font-bold text-brand-dark mb-1 tracking-tight">
                10+
              </h3>
              <p className="font-bold text-brand-dark mb-0.5 text-xs sm:text-sm">Open Vacancies</p>
              <p className="text-[11px] sm:text-xs text-brand-dark/60 leading-relaxed">
                From Employers hiring in Nigeria and beyond.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Verified Hires */}
          <motion.div 
            variants={itemVariants} 
            className="bg-gradient-to-br from-brand-ash/40 to-brand-ash/10 border border-brand-ash/60 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-sm hover:shadow-card-hover transition-shadow flex flex-col justify-between h-full min-h-[160px] sm:min-h-[180px]"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
              <span className="text-[10px] xs:text-xs font-bold text-brand-dark/50 uppercase tracking-wider">Success</span>
            </div>
            <div>
              <h3 className="font-header text-3xl xs:text-4xl md:text-5xl font-bold text-brand-dark mb-1 tracking-tight">
                5+
              </h3>
              <p className="font-bold text-brand-dark mb-0.5 text-xs sm:text-sm">Verified Hired</p>
              <p className="text-[11px] sm:text-xs text-brand-dark/60 leading-relaxed">
                By Graduates within our network.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Column 2: Tall Center Card */}
        <motion.div 
          variants={itemVariants} 
          className="bg-brand-ash/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-card-hover transition-shadow border border-brand-ash/60 h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px]"
        >
          <div>
            <p className="text-brand-dark font-semibold text-xs sm:text-base md:text-lg mb-2 leading-snug">
              Through our rigorous vetting and coaching processes...
            </p>
          </div>
          <div className="pt-6 sm:pt-0">
            <h3 className="font-header text-5xl xs:text-6xl lg:text-7xl font-bold text-brand-green mb-2 sm:mb-3 flex items-end tracking-tight">
              100<span className="text-3xl sm:text-4xl text-brand-green/50 mb-0.5 sm:mb-1">+</span>
            </h3>
            <p className="font-bold text-brand-dark text-base sm:text-lg mb-1.5 sm:mb-2">Active Talents</p>
            <p className="text-xs sm:text-sm text-brand-dark/70 flex items-start gap-2 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse mt-1 sm:mt-1.5 shrink-0" />
              Ready to be hired into your organisation today.
            </p>
          </div>
        </motion.div>

        {/* Column 3: Dark Focus Card */}
        <motion.div 
          variants={itemVariants} 
          className="bg-brand-dark rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between text-brand-white shadow-brand-glow relative overflow-hidden h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px]"
        >
          {/* Faint Background Graphic */}
          <TrendingUp 
            className="absolute -bottom-6 -right-6 w-40 h-40 sm:w-56 sm:h-56 text-brand-white opacity-5 pointer-events-none" 
            strokeWidth={1} 
          />
          
          <div className="relative z-10">
            <p className="text-brand-white/80 text-xs sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-light">
              We move at the speed of your startup, eliminating aimless applications and slow recruitment cycles.
            </p>
          </div>

          <div className="relative z-10 pt-4 sm:pt-0">
            <h3 className="font-header text-5xl xs:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3 tracking-tight">
              5
            </h3>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="font-bold text-base sm:text-lg text-brand-orange mb-0.5 sm:mb-1">Working Days</p>
                <p className="text-[10px] xs:text-[11px] leading-relaxed text-brand-white/60 max-w-[170px]">
                  On average to receive profiles and begin interviewing.
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-0.5 mb-1 text-brand-orange">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[8px] xs:text-[9px] font-bold text-brand-white/50 uppercase tracking-widest">
                  Speed
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10+", label: "Open Vacancies" },
  { value: "5+", label: "Verified Hires" },
  { value: "100+", label: "Active Talents" },
];

export default function StatsSection() {
  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 -mt-6 sm:-mt-8 md:-mt-10 relative z-20 mb-10 sm:mb-14 md:mb-16">
      <motion.div 
        // Initial load animation
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        
        // The "Living Page" Dynamic Color Animation
        animate={{ 
          backgroundColor: ["#FFFFFF", "#F8FAFC", "#F1F5F9", "#FFFFFF"],
          borderColor: ["#E2E8F0", "#2563EB33", "#47556933", "#E2E8F0"]
        }}
        transition={{ 
          backgroundColor: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          borderColor: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 0.6 },
          opacity: { duration: 0.6 }
        }}
        className="rounded-2xl sm:rounded-[2rem] shadow-brand-glow p-5 sm:p-8 md:p-10 lg:p-12 border-2 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12"
      >
        
        {/* Left Side: Title & Subtitle */}
        <div className="w-full lg:max-w-sm">
          <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-1.5 sm:mb-2">
            Our Stats
          </h2>
          <p className="text-brand-dark/70 text-xs sm:text-sm md:text-base leading-relaxed">
            We are actively connecting vetted graduates with growing startups and SMEs.
          </p>
        </div>

        {/* Right Side: The Numbers */}
        <div className="grid grid-cols-3 gap-2 xs:gap-4 sm:gap-8 md:gap-12 lg:gap-14 w-full lg:w-auto pt-2 sm:pt-0 border-t border-brand-ash/30 lg:border-t-0">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-0.5 sm:gap-1"
            >
              <span className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green tracking-tight">
                {stat.value}
              </span>
              <span className="text-brand-dark font-medium text-[11px] xs:text-xs sm:text-sm md:text-base leading-tight sm:leading-normal">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
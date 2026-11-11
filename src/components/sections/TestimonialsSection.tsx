"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    id: 1,
    position: "Operations Manager",
    industry: "E-commerce Startup",
    quote: "We spent weeks sifting through unqualified applications. TalentCore sent us 4 pre-vetted candidates, and we hired our new inventory specialist in just 5 days.",
    type: "employer",
  },
  {
    id: 2,
    position: "Co-Founder",
    industry: "FinTech SME",
    quote: "Hiring used to distract me from building our product. The matched profiles we received were incredibly accurate to our technical requirements and culture fit.",
    type: "employer",
  },
  {
    id: 3,
    position: "Recent Graduate",
    industry: "Frontend Development",
    quote: "After 50+ ignored applications on traditional job boards, TalentCore matched me directly with an agency. I walked into the interview confident and got the offer.",
    type: "graduate",
  },
  {
    id: 4,
    position: "Lead Designer",
    industry: "Creative Agency",
    quote: "The quality of junior talent is unmatched. It’s clear they actually vet for both hard skills and professional readiness before making a referral.",
    type: "employer",
  },
  {
    id: 5,
    position: "Junior Product Manager",
    industry: "HealthTech",
    quote: "No silence, no auto-rejections. The team guided me right into the interview room of a fast-growing startup. This is how early-career hiring should be.",
    type: "graduate",
  },
  {
    id: 6,
    position: "HR Director",
    industry: "Logistics Company",
    quote: "A game-changer for our SME. We've completely outsourced our junior-level sourcing to this platform. The 5-day turnaround time is exceptionally reliable.",
    type: "employer",
  },
];

const DYNAMIC_COLORS = ["#FFFFFF", "#4ADE80", "#FBBF24", "#FFFFFF"];

export default function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 3 >= TESTIMONIALS.length ? 0 : prev + 3));
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = TESTIMONIALS.slice(startIndex, startIndex + 3);
  const totalSlides = Math.ceil(TESTIMONIALS.length / 3);
  const currentSlide = Math.floor(startIndex / 3);

  return (
    <section className="bg-brand-dark py-10 sm:py-14 md:py-20 lg:py-24 overflow-hidden border-t border-brand-ash/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Area */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white mb-2 sm:mb-3 tracking-tight"
          >
            Proven Results with TalentCore.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-ash/60 text-xs sm:text-sm md:text-base font-light max-w-lg"
          >
            Hear what others are saying about us.
          </motion.p>
        </div>

        {/* Schematic Grid Layout (Animated Auto-Slider) */}
        <div className="relative min-h-[520px] xs:min-h-[480px] md:min-h-[260px]">
          {/* Background grid line for desktop */}
          <div className="hidden lg:block absolute top-[11px] left-0 w-full h-[1px] bg-brand-white/10 z-0" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={startIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-7 sm:gap-y-9 lg:gap-y-12 relative z-10"
            >
              {visibleTestimonials.map((item, index) => (
                <div key={item.id} className="relative flex flex-col">
                  
                  {/* Connecting Dot & Line Container */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 lg:mb-8 relative">
                    {/* Glowing Dot */}
                    <motion.div 
                      animate={{ 
                        backgroundColor: DYNAMIC_COLORS,
                        boxShadow: [
                          "0 0 15px rgba(255,255,255,0.2)",
                          "0 0 15px rgba(74,222,128,0.4)",
                          "0 0 15px rgba(251,191,36,0.4)",
                          "0 0 15px rgba(255,255,255,0.2)",
                        ],
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: index * 2 }}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0" 
                    />
                    
                    {/* Mobile/Tablet connecting line */}
                    <div className="flex-grow h-[1px] bg-brand-white/10 lg:hidden" />
                    
                    {/* Arrow indicator pointing to next card (Desktop only) */}
                    {index !== 2 && (
                      <div className="hidden lg:block absolute -right-6 text-brand-white/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Identity (Position & Industry) */}
                  <div className="mb-2 sm:mb-3">
                    <motion.h3 
                      animate={{ color: DYNAMIC_COLORS }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: index * 2 }}
                      className="font-header text-lg xs:text-xl sm:text-2xl font-bold leading-snug"
                    >
                      {item.position}
                    </motion.h3>
                    <p className="text-[10px] xs:text-xs font-semibold text-brand-ash/50 mt-0.5 sm:mt-1 uppercase tracking-wider">
                      {item.industry}
                    </p>
                  </div>

                  {/* Quote Body */}
                  <p className="text-brand-ash/80 text-xs sm:text-sm md:text-base leading-relaxed font-light pr-0 sm:pr-2 lg:pr-4">
                    "{item.quote}"
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Progress Dots Indicator with 44px Touch Envelope */}
        <div className="flex items-center justify-center gap-1 mt-6 sm:mt-10">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i * 3)}
              aria-label={`Go to testimonial batch ${i + 1}`}
              className="p-3 flex items-center justify-center group focus:outline-none"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 block ${
                  currentSlide === i 
                    ? "w-7 bg-brand-green" 
                    : "w-2 bg-brand-white/20 group-hover:bg-brand-white/40"
                }`}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
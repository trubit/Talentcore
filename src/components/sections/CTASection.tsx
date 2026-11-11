"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/context/FormModalContext";

export default function CTASection() {
  const { openModal } = useFormModal();

  return (
    <section className="bg-brand-dark py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden relative border-t border-brand-ash/10">
      
      {/* Ambient Mobile Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xs:w-[340px] sm:w-[450px] h-[280px] xs:h-[340px] sm:h-[450px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-brand-orange font-bold text-[10px] xs:text-xs uppercase tracking-wider">
                Ready to scale?
              </span>
            </div>
            
            <h2 className="font-header text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-white mb-8 sm:mb-10 leading-[1.15] max-w-lg tracking-tight">
              Hire the right talent to help your SME thrive.
            </h2>
            
            <button 
              onClick={() => openModal("employer")}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-white text-brand-white hover:text-brand-dark px-8 sm:px-9 py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 group shadow-brand-glow active:scale-95 text-center"
            >
              <span>Hire Talents Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right Column: Visual Graphic (cta.png) with Dot Grid Background */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative h-[280px] xs:h-[340px] sm:h-[400px] md:h-[480px] w-full flex items-center justify-center rounded-3xl overflow-hidden"
          >
            {/* Subtle Dot Grid Background Pattern */}
            <div 
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#E7EFE6 1.5px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
            />
            
            {/* The Image (Floating Animation) */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-[90%] h-[90%]"
            >
              <Image 
                src="/cta.png" 
                alt="Communication graphic" 
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
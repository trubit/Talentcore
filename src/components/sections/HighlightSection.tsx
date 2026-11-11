"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HighlightSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden isolate rounded-[2rem] sm:rounded-[2.75rem] md:rounded-[3.25rem] border border-white/15 bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 px-6 py-14 sm:px-10 sm:py-20 md:px-16 md:py-24 text-center shadow-2xl"
      >
        {/* Background Image Layer */}
        <Image 
          src="/discovery.jpg"
          alt="Discovery Background"
          fill
          priority={false}
          className="object-cover opacity-20 mix-blend-overlay pointer-events-none z-0 scale-105"
        />

        {/* Ambient Gradient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] sm:w-[540px] h-[220px] bg-brand-green/40 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute -bottom-20 right-10 w-72 h-72 bg-brand-orange/20 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Subtle Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Tailored Solutions</span>
          </div>

          {/* Headline */}
          <h2 className="font-header text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-white tracking-tight leading-[1.12] mb-4 sm:mb-6">
            Discover how we <br className="hidden sm:block" />
            can help you grow
          </h2>
          
          {/* Subtitle */}
          <p className="text-brand-white/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10 font-normal">
            Explore our tailored services to know how we can help you hire top vetted junior talent, or get placed into your dream role.
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/services"
            className="inline-flex items-center justify-center gap-2.5 bg-brand-white text-brand-dark hover:bg-brand-white/95 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold shadow-xl shadow-black/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group cursor-pointer"
          >
            <span>View Our Services</span>
            <ArrowRight className="w-4 h-4 text-brand-dark group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

        </div>
      </motion.div>
    </section>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MessageCircle, ChevronDown } from "lucide-react";

// Inline SVGs for Brand Icons
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-brand-dark text-brand-ash pt-12 sm:pt-16 pb-8 border-t border-brand-green/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Brand Summary & Socials Header */}
        <div className="flex flex-col space-y-4 pb-8 md:pb-0 md:mb-12 border-b border-brand-white/10 md:border-b-0">
          <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
              <Image 
                src="/gicon.png" 
                alt="TalentCore Icon" 
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="font-header font-bold text-lg sm:text-xl text-brand-white tracking-tight">TalentCore</span>
          </Link>
          
          <p className="text-brand-ash/70 text-xs sm:text-sm leading-relaxed max-w-md">
            A modern talent-matching platform directly connecting vetted graduates and early-career professionals with employers globally.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-1">
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TalentCore on LinkedIn"
              className="w-10 h-10 rounded-full bg-brand-white/5 border border-brand-white/10 flex items-center justify-center text-brand-ash hover:bg-brand-orange hover:text-brand-dark active:scale-95 transition-all duration-200"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TalentCore on X"
              className="w-10 h-10 rounded-full bg-brand-white/5 border border-brand-white/10 flex items-center justify-center text-brand-ash hover:bg-brand-orange hover:text-brand-dark active:scale-95 transition-all duration-200"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a 
              href="#contact" 
              aria-label="Contact TalentCore"
              className="w-10 h-10 rounded-full bg-brand-white/5 border border-brand-white/10 flex items-center justify-center text-brand-ash hover:bg-brand-orange hover:text-brand-dark active:scale-95 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW: Interactive Animated Accordions (< md)                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col divide-y divide-brand-white/10 md:hidden mb-8">
          
          {/* Company Accordion */}
          <div className="py-3">
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between text-left py-2 font-header text-sm font-semibold text-brand-white"
              aria-expanded={openSection === "company"}
            >
              <span>Company</span>
              <ChevronDown className={`w-4 h-4 text-brand-ash/60 transition-transform duration-200 ${openSection === "company" ? "rotate-180 text-brand-orange" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "company" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="pt-2 pb-3 space-y-2.5 pl-2 text-xs">
                    <li><Link href="/" className="text-brand-ash/70 hover:text-brand-orange block py-1">Home</Link></li>
                    <li><Link href="/jobs" className="text-brand-ash/70 hover:text-brand-orange block py-1">Job Vacancies</Link></li>
                    <li><Link href="/services" className="text-brand-ash/70 hover:text-brand-orange block py-1">All Services</Link></li>
                    <li><Link href="/contact" className="text-brand-ash/70 hover:text-brand-orange block py-1">Contact</Link></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Services Accordion */}
          <div className="py-3">
            <button
              onClick={() => toggleSection("services")}
              className="w-full flex items-center justify-between text-left py-2 font-header text-sm font-semibold text-brand-white"
              aria-expanded={openSection === "services"}
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 text-brand-ash/60 transition-transform duration-200 ${openSection === "services" ? "rotate-180 text-brand-orange" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "services" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-3 space-y-4 pl-2 text-xs">
                    <div>
                      <p className="text-brand-green font-bold text-[10px] uppercase tracking-wider mb-2">For Employers</p>
                      <ul className="space-y-2">
                        <li><Link href="/services/job-listing" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Job Listing</Link></li>
                        <li><Link href="/services/job-matching" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Job Matching Service</Link></li>
                        <li><Link href="/services/outsource-hr" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Outsource HR Service</Link></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-brand-orange font-bold text-[10px] uppercase tracking-wider mb-2">For Candidates</p>
                      <ul className="space-y-2">
                        <li><Link href="/services/job-placement" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Job Placement Service</Link></li>
                        <li><Link href="/services/career-readiness" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Career Readiness</Link></li>
                        <li><Link href="/services/resume-writing" className="text-brand-ash/70 hover:text-brand-orange block py-0.5">Resume Writing</Link></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Accordion */}
          <div className="py-3">
            <button
              onClick={() => toggleSection("contact")}
              className="w-full flex items-center justify-between text-left py-2 font-header text-sm font-semibold text-brand-white"
              aria-expanded={openSection === "contact"}
            >
              <span>Contact Us</span>
              <ChevronDown className={`w-4 h-4 text-brand-ash/60 transition-transform duration-200 ${openSection === "contact" ? "rotate-180 text-brand-orange" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "contact" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="pt-2 pb-3 space-y-3 pl-2 text-xs">
                    <li>
                      <a href="tel:+15550000000" className="flex items-center gap-2.5 text-brand-ash/80 hover:text-brand-orange py-1">
                        <Phone className="w-3.5 h-3.5 text-brand-green" />
                        <span>+1 (555) 000-0000</span>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:contact@talentcore.local" className="flex items-center gap-2.5 text-brand-ash/80 hover:text-brand-orange py-1">
                        <Mail className="w-3.5 h-3.5 text-brand-green" />
                        <span>contact@talentcore.local</span>
                      </a>
                    </li>
                    <li className="pt-2">
                      <Link 
                        href="/contact" 
                        className="inline-flex items-center justify-center text-xs font-semibold text-brand-dark bg-brand-green px-5 py-2.5 rounded-full hover:bg-brand-orange active:scale-95 transition-all w-full text-center"
                      >
                        Open Contact Form
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: Multi-Column Static Layout (>= md)                         */}
        {/* ========================================================================= */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          
          {/* Column: Company Menu */}
          <div>
            <h4 className="font-header text-brand-white font-semibold text-sm sm:text-base mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-brand-ash/70 hover:text-brand-orange text-sm transition-colors">Home</Link></li>
              <li><Link href="/jobs" className="text-brand-ash/70 hover:text-brand-orange text-sm transition-colors">Job Vacancies</Link></li>
              <li><Link href="/services" className="text-brand-ash/70 hover:text-brand-orange text-sm transition-colors">All Services</Link></li>
              <li><Link href="/contact" className="text-brand-ash/70 hover:text-brand-orange text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column: Services */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-header text-brand-white font-semibold text-sm sm:text-base mb-5">
                For Employers
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/job-listing" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Job Listing</Link></li>
                <li><Link href="/services/job-matching" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Job Matching Service</Link></li>
                <li><Link href="/services/outsource-hr" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Outsource HR Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-header text-brand-white font-semibold text-sm sm:text-base mb-5">
                For Candidates
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/job-placement" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Job Placement Service</Link></li>
                <li><Link href="/services/career-readiness" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Career Readiness</Link></li>
                <li><Link href="/services/resume-writing" className="text-brand-ash/70 hover:text-brand-orange transition-colors">Resume Writing</Link></li>
              </ul>
            </div>
          </div>

          {/* Column: Contact Information */}
          <div>
            <h4 className="font-header text-brand-white font-semibold text-sm sm:text-base mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+15550000000" className="inline-flex items-center gap-3 text-brand-ash/80 hover:text-brand-orange text-sm group">
                  <span className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                    <Phone className="w-4 h-4 text-brand-green group-hover:text-brand-orange transition-colors" />
                  </span>
                  +1 (555) 000-0000
                </a>
              </li>
              <li>
                <a href="mailto:contact@talentcore.local" className="inline-flex items-center gap-3 text-brand-ash/80 hover:text-brand-orange text-sm group">
                  <span className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                    <Mail className="w-4 h-4 text-brand-green group-hover:text-brand-orange transition-colors" />
                  </span>
                  contact@talentcore.local
                </a>
              </li>
              <li className="pt-2">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center text-sm font-semibold text-brand-dark bg-brand-green px-6 py-3 rounded-full hover:bg-brand-orange active:scale-95 transition-all text-center"
                >
                  Open Contact Form
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-brand-white/10 gap-4 text-[11px] sm:text-xs text-brand-ash/50 text-center md:text-left">
          <p>
            © 2026 TalentCore Platform. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-2">
            <Link href="/legal/employer-service-agreement" className="hover:text-brand-orange transition-colors py-0.5">
              Employer Service Agreement
            </Link>
            <Link href="/legal/terms-and-conditions" className="hover:text-brand-orange transition-colors py-0.5">
              Terms & Conditions
            </Link>
            <Link href="/legal/privacy-policy" className="hover:text-brand-orange transition-colors py-0.5">
              Data Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
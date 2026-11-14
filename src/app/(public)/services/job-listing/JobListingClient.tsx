"use client";

import Link from "next/link";
import { ArrowLeft, Edit3, Globe, Zap, CheckCircle2, Star, Users } from "lucide-react";
import JobListingFaq from "@/components/JobListingFaq";
import { useFormModal } from "@/context/FormModalContext";

const FAQS = [
  {
    question: "Can I post a job for free?",
    answer: "Yes, your entry-level job vacancy can be posted on our job board completely for free."
  },
  {
    question: "Can you promote my job? I’m not getting enough candidates.",
    answer: "Yes, we can feature your job vacancy on our job board for a small fee. All featured jobs are promoted at the top of our page for up to 30 days and shared directly in our community channels."
  }
];

export default function JobListingClient({ initialSchema }: { initialSchema: any[] }) {
  const { openFormModal } = useFormModal();

  const handleOpenForm = () => {
    openFormModal({
      formId: "job_listing",
      title: "Post a Job Vacancy",
      initialSchema,
      isEmployer: true,
    });
  };

  return (
    <main className="min-h-screen bg-brand-white pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 relative">
      
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
        <Link 
          href="/services" 
          className="inline-flex items-center gap-2 text-brand-dark/70 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark/70" /> 
          <span>Back to Services</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-brand-ash/20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden border border-brand-ash/60">
          
          {/* Decorative Glow Elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-orange/10 rounded-full blur-[70px] sm:blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-green/10 rounded-full blur-[70px] sm:blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none z-0" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-white text-brand-orange text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 shadow-xs border border-brand-ash/40">
              For Employers
            </span>
            
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight sm:leading-[1.1] mb-3 sm:mb-6 tracking-tight">
              Post your job. Reach 1000+ verified graduates <span className="text-brand-green">for free.</span>
            </h1>
            
            <p className="text-brand-dark/75 text-xs xs:text-sm sm:text-base md:text-lg font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              Share your entry-level vacancy with us and we will post it on our website and share it across our network of over 1000 pre-screened Nigerian graduates. No hidden fees.
            </p>
            
            <button 
              onClick={handleOpenForm}
              className="w-full xs:w-auto bg-brand-dark text-brand-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-95 transition-all inline-flex items-center justify-center gap-2 shadow-brand-glow cursor-pointer text-center"
            >
              <span>Post a Job</span>
              <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />
            </button>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Process & Requirements */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-12">
            
            {/* How it Works Sub-Grid */}
            <div>
              <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-4 sm:mb-8 tracking-tight">
                How it Works
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
                {[
                  { icon: <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, title: "1. Fill out details", desc: "Fill out a short form with the role details." },
                  { icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "2. We publish", desc: "Based on the info you provide, we create a full job description and publish your vacancy on our board." },
                  { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark" />, title: "3. Graduates apply", desc: "Our graduate community sees it instantly and applies directly via your preferred method." },
                  { icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, title: "4. You hire", desc: "You manage applications and interview candidates your way." }
                ].map((step, i) => (
                  <div key={i} className="bg-brand-white border border-brand-ash/60 p-4 xs:p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-card-hover transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-ash/30 flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                      {step.icon}
                    </div>
                    <h3 className="font-header font-bold text-brand-dark text-base sm:text-lg mb-1.5 sm:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dark Information Box */}
            <div className="bg-brand-dark rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 md:p-10 text-brand-white shadow-brand-glow">
              <h2 className="font-header text-lg sm:text-2xl font-bold text-brand-white mb-2 sm:mb-4">
                What We Need from You:
              </h2>
              <p className="text-brand-white/80 text-xs sm:text-sm mb-4 sm:mb-6 font-light">
                A completed job listing form with the following details:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  "Job title, type, and location",
                  "Short description and requirements",
                  "Application link or contact email"
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-brand-white/90">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium leading-snug">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing Comparison Cards */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6">
            
            {/* Standard Free Card */}
            <div className="bg-brand-white border-2 border-brand-ash/80 rounded-2xl sm:rounded-[2rem] p-5 xs:p-6 sm:p-8 shadow-xs">
              <span className="inline-block px-3 py-1 bg-brand-ash/40 text-brand-dark text-[10px] xs:text-xs font-bold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
                Standard Listing
              </span>
              <div className="flex items-end gap-1 mb-4 sm:mb-6">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
                  ₦5,000
                </span>
                <span className="text-brand-dark/50 text-xs sm:text-sm pb-1 font-medium">/always free</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/75">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/50 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Visible on our public job board</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/75">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/50 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Listed active for 14 days</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/75">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/50 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Full control over the hiring process</span>
                </li>
              </ul>
            </div>

            {/* Featured Upgrade Card */}
            <div className="bg-brand-green border-2 border-brand-green rounded-2xl sm:rounded-[2rem] p-5 xs:p-6 sm:p-8 text-brand-white shadow-card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 pointer-events-none text-brand-white">
                <Star className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-white/20 text-brand-white text-[10px] xs:text-xs font-bold rounded-full mb-3 sm:mb-4 uppercase tracking-wider backdrop-blur-xs">
                <Star className="w-3 h-3 text-brand-white fill-brand-white" /> 
                <span>Featured Listing</span>
              </div>
              
              <div className="flex items-end gap-1 mb-4 sm:mb-6 relative z-10">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-white tracking-tight">
                  ₦10,000
                </span>
                <span className="text-brand-white/80 text-xs sm:text-sm pb-1 font-medium">/per job</span>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 relative z-10">
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-white font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Everything in Standard, plus:</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Pinned at the top of the job board</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Extended 30-day listing duration</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                  <span className="leading-relaxed">Mentioned in weekly email & network alerts</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            Commonly asked questions about how we help.
          </p>
        </div>
        <JobListingFaq faqs={FAQS} />
      </section>

    </main>
  );
}
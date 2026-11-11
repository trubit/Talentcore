"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Search, FileUp, PhoneCall, UserCheck, 
  Zap, MessageCircle, CheckCircle2, X 
} from "lucide-react";
import DynamicForm from "@/components/DynamicForm";
import JobPlacementFaq from "@/components/JobPlacementFaq";

const FAQS = [
  {
    question: "Is this service actually 100% free?",
    answer: "Yes, completely free. We do not charge graduates for job placements. Employers pay us to find and refer fantastic talent like you."
  },
  {
    question: "What is a TalentCore job code?",
    answer: "It's a unique identifier (e.g., TC004) attached to jobs that are exclusively managed by TalentCore. Applying to these jobs triggers our direct referral process."
  },
  {
    question: "What happens if I don't get the job?",
    answer: "Your profile remains active in our system. We provide ongoing referrals for other suitable roles until you start landing interviews and secure a job."
  }
];

export default function JobPlacementClient({ initialSchema }: { initialSchema: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

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

      {/* Uplifting & Bright Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          
          <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-orange/15 rounded-full blur-[70px] sm:blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-green/15 rounded-full blur-[70px] sm:blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none z-0" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-green/10 text-brand-green text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 border border-brand-green/20">
              For Graduates
            </span>
            
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight sm:leading-[1.1] mb-3 sm:mb-6 tracking-tight">
              Get matched to employers without sending another CV.
            </h1>
            
            <p className="text-brand-dark/75 text-xs xs:text-sm sm:text-base md:text-lg font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              Stop applying aimlessly. Get matched directly to employers, get prepared for every role, and get hired. We directly refer you to companies hiring entry-level talent. If selected, employers interview and hire you at zero cost.
            </p>
            
            {/* Modal Trigger */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full xs:w-auto bg-brand-dark text-brand-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-95 transition-all inline-flex items-center justify-center gap-2 shadow-brand-glow cursor-pointer text-center"
            >
              <span>Start Here</span>
              <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content: How it Works & Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Steps & Community CTA */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-4 sm:mb-6 tracking-tight">
              How it Works
            </h2>
            
            <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
              {[
                { 
                  icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 text-brand-white" />, 
                  title: "1. Apply via Job Codes", 
                  desc: "Apply to relevant jobs with TalentCore’s job codes (e.g., TC004) by clicking on the 'Get Referred' button on our job board." 
                },
                { 
                  icon: <FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-white" />, 
                  title: "2. Submit Documents", 
                  desc: "Fill out the short application form and upload all necessary documents." 
                },
                { 
                  icon: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-brand-white" />, 
                  title: "3. Quick Chat & Assessment", 
                  desc: "If you qualify, we will reach out to schedule a 15-minute call (not an interview). You may also be asked to complete a short assessment." 
                },
                { 
                  icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-white" />, 
                  title: "4. Direct Referral", 
                  desc: "We build your profile based on your skills and refer you directly to the hiring employer, who will then invite you for an interview." 
                }
              ].map((step, i) => (
                <div 
                  key={i} 
                  className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 bg-brand-white border border-brand-ash/60 p-4 xs:p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-card-hover transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-dark flex items-center justify-center shrink-0 shadow-brand-glow">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-header text-base sm:text-xl font-bold text-brand-dark mb-1 sm:mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Highlight Card */}
            <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 sm:gap-4 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-orange/20 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-sm sm:text-base mb-1">
                  Priority is given to our network.
                </h4>
                <p className="text-brand-dark/75 text-xs sm:text-sm mb-3 leading-relaxed">
                  Candidates already in the TalentCore network get first access to referrals.
                </p>
                <a 
                  href="#talent-network" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-brand-orange font-bold text-xs sm:text-sm hover:underline active:scale-98 transition-all"
                >
                  <span>Join our Talent Network →</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing / Plan Box */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6">
            <div className="bg-brand-white border-2 border-brand-green/30 rounded-2xl sm:rounded-[2rem] p-5 xs:p-6 sm:p-8 shadow-xs">
              <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] xs:text-xs font-bold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
                Graduate Service
              </span>
              
              <div className="flex items-end gap-1 mb-2">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
                  ₦0
                </span>
                <span className="text-brand-dark/60 text-xs sm:text-sm pb-1 font-medium">/forever free</span>
              </div>
              
              <p className="text-brand-dark/70 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                No expiration date. No hidden fees.
              </p>
              
              <hr className="border-brand-ash/60 mb-4 sm:mb-6" />
              
              <h4 className="font-bold text-brand-dark text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" /> 
                <span>What’s Included:</span>
              </h4>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>Your profile personally delivered to hiring companies.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>Ongoing referrals until you start landing interviews.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span>Direct connection to verified entry-level roles.</span>
                </li>
              </ul>

              <Link 
                href="/jobs"
                className="w-full block text-center bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all shadow-xs"
              >
                Explore Latest Jobs
              </Link>
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
            Everything you need to know about getting matched.
          </p>
        </div>
        
        <JobPlacementFaq faqs={FAQS} />
      </section>

      {/* Application Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsModalOpen(false)}
          />
          
          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative w-full max-w-3xl bg-brand-white rounded-2xl sm:rounded-[2rem] shadow-2xl my-auto py-2 z-10 overflow-hidden"
          >
            {/* Header / Close Button */}
            <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-brand-ash/50 bg-brand-ash/20">
              <h3 className="font-header text-lg sm:text-2xl font-bold text-brand-dark">Apply for Job Placement</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-brand-dark/60 hover:text-brand-dark bg-brand-white rounded-full transition-colors shadow-xs active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
              </button>
            </div>

            {/* Form Content Container */}
            <div className="p-4 sm:p-6 md:p-8 max-h-[calc(85vh-4rem)] overflow-y-auto no-scrollbar">
              <DynamicForm 
                formId="job_placement" 
                initialSchema={initialSchema} 
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
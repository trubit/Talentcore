"use client";

import Link from "next/link";
import { 
  ArrowLeft, FileText, UserCircle, PenTool, Clock, 
  FileCheck2, CheckCircle2, MessageSquare 
} from "lucide-react";
import ResumeWritingFaq from "@/components/ResumeWritingFaq";
import { useFormModal } from "@/context/FormModalContext";

const FAQS = [
  {
    question: "Do I need to pay for the service right now?",
    answer: "No, we don’t collect upfront payment. You fill out the form, schedule a call, and speak to a real person over video. You pay only if you decide to move forward with the service."
  },
  {
    question: "Can I pay in instalments?",
    answer: "You can make a down payment of 60% initially and 40% once the work has been completed (usually after a week)."
  },
  {
    question: "I only need help with my CV, I don’t need to optimise my LinkedIn. Will I still pay the same amount?",
    answer: "We have individual services for the resume writing package. That means you can pay for each service individually. When filling out the form, you can indicate the specific service you want."
  }
];

export default function ResumeWritingClient({ initialSchema }: { initialSchema: any[] }) {
  const { openFormModal } = useFormModal();

  const handleOpenForm = () => {
    openFormModal({
      formId: "resume_writing",
      title: "Request Resume Writing",
      initialSchema,
      isGraduate: true,
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
        <div className="bg-brand-orange/10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden border border-brand-orange/20 shadow-xs">
          
          <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-orange/20 rounded-full blur-[70px] sm:blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-white text-brand-green text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 shadow-xs border border-brand-orange/20">
              For Graduates
            </span>
            
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight sm:leading-[1.1] mb-3 sm:mb-6 tracking-tight">
              A CV, LinkedIn, and Cover Letter that actually <span className="text-brand-orange">sounds like you.</span>
            </h1>
            
            <p className="text-brand-dark/75 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl">
              Most graduates use the same templates. Employers can tell. We'll work with you one-on-one to rewrite your documents from scratch, tailored to the jobs you want.
            </p>
            
            {/* Modal Trigger */}
            <button 
              onClick={handleOpenForm}
              className="w-full xs:w-auto bg-brand-dark text-brand-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-95 transition-all inline-flex items-center justify-center gap-2 shadow-brand-glow cursor-pointer text-center"
            >
              <span>Start Here</span>
              <PenTool className="w-4 h-4 text-brand-orange fill-brand-orange" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start">
          
          {/* Left Column: How it Works */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-4 sm:mb-6 tracking-tight">
              How it Works
            </h2>
            
            <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
              {[
                { 
                  icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, 
                  title: "1. Share Your Story", 
                  desc: "You fill out a brief form sharing your experiences, goals, and target roles." 
                },
                { 
                  icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, 
                  title: "2. The Strategy Chat", 
                  desc: "You schedule a 15‑minute chat with one of our coaches to dig deeper into your story and align on your career direction." 
                },
                { 
                  icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, 
                  title: "3. We Get to Work", 
                  desc: "Within 7-10 working days, our experts completely rewrite and optimize your materials." 
                },
                { 
                  icon: <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />, 
                  title: "4. Review & Finalize", 
                  desc: "We deliver your new documents. One round of minor revisions is included to ensure everything is perfect." 
                }
              ].map((step, i) => (
                <div 
                  key={i} 
                  className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 bg-brand-white border border-brand-ash/60 p-4 xs:p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-card-hover hover:border-brand-orange/30 transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-ash/30 flex items-center justify-center shrink-0">
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
          </div>

          {/* Right Column: Complete Package & Pricing */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-6">
            
            {/* The Complete Package Card */}
            <div className="bg-brand-dark text-brand-white rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-brand-glow">
              <h3 className="font-header text-xl sm:text-2xl font-bold text-brand-white mb-1">
                The Complete Package
              </h3>
              <p className="text-brand-white/60 text-xs sm:text-sm mb-6 sm:mb-8 font-light">
                Everything you need to stand out.
              </p>
              
              <ul className="space-y-4 sm:space-y-6">
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-white text-xs sm:text-sm mb-0.5 sm:mb-1">
                      Tailored CV
                    </h4>
                    <p className="text-[11px] sm:text-xs text-brand-white/70 leading-relaxed font-light">
                      A fully rewritten CV in both Word and PDF formats, optimized for ATS systems.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-white text-xs sm:text-sm mb-0.5 sm:mb-1">
                      Optimised LinkedIn Profile
                    </h4>
                    <p className="text-[11px] sm:text-xs text-brand-white/70 leading-relaxed font-light">
                      A compelling summary, optimized headline, and correctly mapped skills.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-white text-xs sm:text-sm mb-0.5 sm:mb-1">
                      Cover Letter Draft
                    </h4>
                    <p className="text-[11px] sm:text-xs text-brand-white/70 leading-relaxed font-light">
                      One tailored cover letter template that you can easily adjust for various applications.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Pricing Box */}
            <div className="bg-brand-white border-2 border-brand-ash/80 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
              <p className="text-brand-dark/50 text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                One-Time Investment
              </p>
              
              <div className="flex items-end gap-1 mb-3 sm:mb-4">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
                  ₦20,000
                </span>
              </div>
              
              <div className="bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm font-medium flex items-start gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-brand-green" />
                <p className="text-brand-dark/85 leading-relaxed">
                  Pay only when you decide to proceed after the initial chat. <strong className="font-bold text-brand-dark">No upfront payment.</strong>
                </p>
              </div>

              {/* Modal Trigger */}
              <button 
                onClick={handleOpenForm}
                className="w-full inline-block text-center bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                Request Service
              </button>
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
        
        <ResumeWritingFaq faqs={FAQS} />
      </section>

    </main>
  );
}
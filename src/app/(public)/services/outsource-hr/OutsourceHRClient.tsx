"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ClipboardList, Search, PhoneCall, Users, 
  CalendarCheck, Handshake, ShieldCheck, Clock, CheckCircle2, X 
} from "lucide-react";
import DynamicForm from "@/components/DynamicForm";
import OutsourceHrFaq from "@/components/OutsourceHrFaq";

const FAQS = [
  {
    question: "How long does the entire Outsource HR process take?",
    answer: "The timeline varies based on the complexity of the role, but you will receive a fixed-price quote and timeline within 48 hours of our discovery call. Typically, the first shortlist is delivered within a few days."
  },
  {
    question: "Do I have a say in the final hiring decision?",
    answer: "Absolutely. We handle all the heavy lifting—sourcing, screening, and coordinating—but you stay in 100% control of the final hiring decision."
  }
];

export default function OutsourceHRClient({ initialSchema = [] }: { initialSchema?: any[] }) {
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-brand-dark rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden shadow-brand-glow">
          
          <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_80%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-green/10 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-white/10 text-brand-orange text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 border border-brand-white/10">
              For Employers
            </span>
            
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white leading-tight sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              Your entire recruitment process, handled.
            </h1>
            
            <p className="text-brand-white/80 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl">
              We run your entire junior-level recruitment process from job description to offer, saving you every hour of screening. We plan, source, screen, and help you hire. <strong className="text-brand-white font-semibold">You stay in full control with the final decision.</strong>
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full xs:w-auto bg-brand-white text-brand-dark px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange hover:text-brand-white active:scale-95 transition-all inline-flex items-center justify-center cursor-pointer shadow-sm text-center"
            >
              Start Hiring
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        
        {/* 7-Step Process Grid */}
        <div className="mb-14 sm:mb-20">
          <div className="max-w-2xl mb-6 sm:mb-10">
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-2 sm:mb-3 tracking-tight">
              How it Works
            </h2>
            <p className="text-brand-dark/75 text-xs sm:text-sm md:text-base leading-relaxed">
              For busy founders and team leads who need hiring to just work. We take care of the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
            {[
              { icon: <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Planning", desc: "A 30-minute call to meet with leadership to align on job details, culture, and requirements. We draft the JD." },
              { icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Sourcing", desc: "We actively source beyond TalentCore’s existing pool if necessary (e.g., social media)." },
              { icon: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Screening", desc: "We review CVs and conduct initial phone/video pre-interviews to assess qualifications, culture fit, and salary expectations." },
              { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Shortlist", desc: "You receive 3–5 best-matched candidates with detailed notes on each." },
              { icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Selecting", desc: "We help coordinate interview invitations and formal interviews. We provide feedback, but you choose the best person." },
              { icon: <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Hiring", desc: "We draft the offer letter, negotiate terms, and handle the initial negotiation process until the candidate accepts." },
              { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />, title: "Onboarding", desc: "We guide the new hire through their first few days with paperwork, initial training, and integration into your company." }
            ].map((step, i) => (
              <div key={i} className="bg-brand-ash/20 border border-brand-ash/60 p-5 xs:p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden group hover:border-brand-green/30 transition-all shadow-xs">
                <div className="absolute -right-3 -bottom-3 text-7xl sm:text-8xl md:text-9xl font-header font-bold text-brand-dark/[0.04] select-none pointer-events-none group-hover:text-brand-green/[0.07] transition-colors">
                  0{i + 1}
                </div>
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-6">{step.icon}</div>
                  <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-2">
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

        {/* Pricing, Inclusions, and Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start">
          
          {/* Left: Service Package Box */}
          <div className="lg:col-span-6 xl:col-span-6 bg-brand-dark text-brand-white rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 md:p-10 shadow-brand-glow">
            <h3 className="font-header text-xl sm:text-2xl font-bold text-brand-white mb-6 sm:mb-8">
              Service Package
            </h3>
            
            <div className="mb-6 sm:mb-8">
              <p className="text-brand-white/70 text-[10px] xs:text-xs mb-1.5 uppercase tracking-wider font-bold">
                Custom Pricing
              </p>
              <div className="flex items-end gap-2">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-orange tracking-tight">
                  ₦150k - 300k
                </span>
              </div>
              <p className="text-brand-white/50 text-[11px] sm:text-xs mt-2 leading-relaxed">
                /month per role (covers all stages). Final quote provided after discovery call.
              </p>
            </div>
            
            <hr className="border-brand-white/10 mb-6 sm:mb-8" />
            
            <h4 className="font-bold text-brand-white text-xs sm:text-sm mb-4 sm:mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" /> 
              <span>What’s Included:</span>
            </h4>
            
            <ul className="space-y-3 sm:space-y-4">
              {[
                "A dedicated point person for the entire process",
                "Weekly updates on the processes, no guesswork",
                "Reference checks on finalists",
                "Onboarding pack tailored to your company (with 1 revision round)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Timeline & What We Need */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-6">
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
              <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" /> 
                <span>Timeline & Process</span>
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed border-l-2 border-brand-ash/80 pl-3 sm:pl-4">
                  <strong className="text-brand-dark block mb-0.5">1. Request</strong> 
                  Submit your hiring request indicating the Outsource HR package.
                </li>
                <li className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed border-l-2 border-brand-ash/80 pl-3 sm:pl-4">
                  <strong className="text-brand-dark block mb-0.5">2. Align</strong> 
                  We hold a brief 30-min meeting to align on role, ideal profile, and process.
                </li>
                <li className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed border-l-2 border-brand-ash/80 pl-3 sm:pl-4">
                  <strong className="text-brand-dark block mb-0.5">3. Quote</strong> 
                  You receive a fixed-price quote and duration of work within 48 hours.
                </li>
                <li className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed border-l-2 border-brand-ash/80 pl-3 sm:pl-4">
                  <strong className="text-brand-dark block mb-0.5">4. Deliver</strong> 
                  We deliver profiles, prepare the onboarding pack, and coordinate interviews.
                </li>
              </ul>
            </div>

            <div className="bg-brand-green/10 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 border border-brand-green/20">
              <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-2 sm:mb-3">
                What We Need from You
              </h3>
              <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                Fill out the candidate request form with your role requirements and schedule a discovery call with our team to get started.
              </p>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-block text-center bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                Start Hiring Now
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
        
        <OutsourceHrFaq faqs={FAQS} />
      </section>

      {/* Request Form Modal */}
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
              <h3 className="font-header text-lg sm:text-2xl font-bold text-brand-dark">Request Outsource HR</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-brand-dark/60 hover:text-brand-dark bg-brand-white rounded-full transition-colors shadow-xs active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
              </button>
            </div>

            {/* Form Scroll Container */}
            <div className="p-4 sm:p-6 md:p-8 max-h-[calc(85vh-4rem)] overflow-y-auto no-scrollbar">
              <DynamicForm 
                formId="outsource_hr" 
                initialSchema={initialSchema} 
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
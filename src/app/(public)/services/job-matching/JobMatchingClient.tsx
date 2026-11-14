"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, ShieldCheck, FileText, CheckCircle2, Clock } from "lucide-react";
import JobMatchingFaq from "@/components/JobMatchingFaq";
import { useFormModal } from "@/context/FormModalContext";

const FAQS = [
  {
    question: "Do I have to pay upfront?",
    answer: "No. You only pay when you successfully hire a candidate we referred to you."
  },
  {
    question: "What if the candidate leaves after a week?",
    answer: "We offer a free replacement guarantee. We will send you another round of pre-vetted candidates at no extra cost to ensure you find the perfect fit."
  }
];

export default function JobMatchingClient({ initialSchema }: { initialSchema: any[] }) {
  const { openFormModal } = useFormModal();

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

      {/* Premium Dark Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-brand-dark rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden shadow-brand-glow">
          
          <Image 
            src="/jobm.jpg"
            alt="Job Matching Background"
            fill
            priority
            className="object-cover opacity-20 mix-blend-luminosity pointer-events-none z-0"
          />

          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-green/20 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-white/10 text-brand-orange text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 border border-brand-white/10">
              For Employers
            </span>
            
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white leading-tight sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              Hand-picked, pre-vetted candidates directly in your inbox.
            </h1>
            
            <p className="text-brand-white/80 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl">
              We don’t send 200 CVs. We send 3-5 people we’ve personally vetted. You have full control over the final interview and selection. <strong className="text-brand-white font-semibold">You pay only when you hire.</strong>
            </p>
            
            <button 
              type="button"
              onClick={() => openFormModal({
                formId: "job_matching",
                title: "Request Candidate Matching",
                initialSchema,
                isEmployer: true,
              })}
              className="w-full xs:w-auto bg-brand-green text-brand-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-95 transition-all inline-flex items-center justify-center cursor-pointer shadow-sm text-center"
            >
              Request Candidates
            </button>
          </div>
        </div>
      </section>

      {/* Two-Column Layout for Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          
          {/* Left Column: How it Works (Vertical Timeline Style) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-6 sm:mb-10 tracking-tight">
              How it Works
            </h2>
            
            <div className="space-y-6 sm:space-y-8 md:space-y-10 relative before:absolute before:inset-0 before:left-5 xs:before:left-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-ash/80 before:to-transparent">
              
              {[
                { title: "Job Description Creation", desc: "Based on the information you provide, we create a full job description and publish your vacancy on our board.", icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" /> },
                { title: "Candidate Sourcing", desc: "We source candidates required to fill the open position from within our network and outside, if necessary.", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" /> },
                { title: "Skill-Badge Vetting & Human Screening", desc: "We vet every candidate on willingness to work, practical skills, and overall employability.", icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" /> },
                { title: "Candidate Matching", desc: "We send you 3-5 best-matched candidates’ profiles, complete with our human coaching notes, based on the role.", icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" /> },
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 sm:border-4 border-brand-white bg-brand-ash/60 text-brand-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xs relative z-10">
                    {step.icon}
                  </div>
                  <div className="w-[calc(100%-3.25rem)] xs:w-[calc(100%-3.75rem)] md:w-[calc(50%-3rem)] bg-brand-ash/20 p-4 xs:p-5 sm:p-6 rounded-2xl border border-brand-ash/60 hover:border-brand-green/30 transition-all shadow-xs">
                    <h3 className="font-header font-bold text-brand-dark text-base sm:text-lg mb-1 sm:mb-2">
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

          {/* Right Column: Pricing, Timeline & What's Included */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-[2rem] p-5 xs:p-6 sm:p-8 shadow-xs">
              <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-1.5 sm:mb-2">
                Pricing
              </h3>
              
              <div className="flex items-end gap-1 mb-2 sm:mb-3">
                <span className="font-header text-3xl xs:text-4xl font-bold text-brand-green tracking-tight">
                  ₦100,000
                </span>
                <span className="text-brand-dark/60 text-xs sm:text-sm pb-1 font-medium">/per role</span>
              </div>
              
              <p className="text-brand-dark/70 text-xs sm:text-sm mb-4 sm:mb-6">
                Custom pricing available for multiple hires.
              </p>
              
              <hr className="border-brand-ash/60 mb-4 sm:mb-6" />
              
              <h4 className="font-bold text-brand-dark text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" /> 
                <span>What's Included:</span>
              </h4>
              
              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  "3-5 pre-vetted candidate profiles",
                  "Skill summaries & verified badges",
                  "Candid human evaluation notes",
                  "Free replacement guarantee",
                  "Dedicated account & hiring support"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-dark/75">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline & Process Card */}
            <div className="bg-brand-dark text-brand-white rounded-2xl sm:rounded-[2rem] p-5 xs:p-6 sm:p-8 shadow-brand-glow">
              <h3 className="font-header text-base sm:text-xl font-bold text-brand-white mb-4 sm:mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" /> 
                <span>Timeline & Process</span>
              </h3>
              <ul className="space-y-3 sm:space-y-4 text-brand-white/80 text-xs sm:text-sm font-light leading-relaxed">
                <li><strong className="font-bold text-brand-orange mr-1">1.</strong> Complete form & schedule discovery call.</li>
                <li><strong className="font-bold text-brand-orange mr-1">2.</strong> Profiles delivered within 5 working days.</li>
                <li><strong className="font-bold text-brand-orange mr-1">3.</strong> You interview and decide.</li>
                <li><strong className="font-bold text-brand-orange mr-1">4.</strong> Invoice sent within 2 weeks of offer acceptance.</li>
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
        
        <JobMatchingFaq faqs={FAQS} />
      </section>

    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle2, Compass, FileText, Mic, Target, 
  Calendar, Star, UserCircle2, X
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import DynamicForm from "@/components/DynamicForm";

const FAQS = [
  {
    question: "Do I need to pay for the service right now?",
    answer: "No, we don’t collect upfront payment. You fill out the form, schedule a call, and speak to a real person over video. You pay only if you decide to move forward with the service."
  },
  {
    question: "Can I pay in instalments?",
    answer: "You can make a down payment of 60% initially and 40% once the work has been completed (usually after a week)."
  }
];

const COACHES = [
  {
    name: "Sarah Adebayo",
    role: "Career Strategist & HR Expert",
    specialty: "Tech & Product Roles",
    exp: "5+ years screening junior talent for startups."
  },
  {
    name: "Michael Okon",
    role: "Interview Specialist",
    specialty: "Business & Operations",
    exp: "Helped 200+ graduates land their first roles."
  }
];

export default function CareerReadinessClient({ initialSchema }: { initialSchema: any[] }) {
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
          className="inline-flex items-center gap-2 text-brand-dark/60 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
          <span>Back to Services</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-brand-dark text-brand-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden shadow-brand-glow">
          
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-green/20 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-white/10 text-brand-orange text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 border border-white/10">
              For Graduates
            </span>
            <h1 className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white leading-tight sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              Gain clarity. Translate your skills. <br className="hidden sm:block" />
              <span className="text-brand-orange">Interview like a pro.</span>
            </h1>
            <p className="text-brand-white/80 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl">
              We make you stand out during the hiring process, coach you on your strengths, and revamp your CV. You practice with someone who understands entry-level interviews, get honest feedback, and learn to answer questions like the professional you're becoming.
            </p>
            
            {/* Modal Trigger */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full xs:w-auto bg-brand-green text-brand-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
            >
              <span>Start Here</span>
              <Target className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* What's Included (4 Pillars) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-header text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark mb-2 sm:mb-3 tracking-tight">
            What’s Included
          </h2>
          <p className="text-brand-dark/70 text-xs sm:text-sm md:text-base">
            A comprehensive approach to making you highly employable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[
            { icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Career Coaching", desc: "We coach you on the best career path based on your skills, determine what is transferable, and how to position them for your next role." },
            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Job Search Tools", desc: "We revamp your CV/Resume, and write a strong cover letter to make you stand out in every application." },
            { icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Interview Prep", desc: "We teach you how to answer tough interview questions and talk about your skills with confidence in mock interviews." },
            { icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Job Search Strategies", desc: "We coach you on proven, modern strategies to secure your first role quickly and effectively." }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-brand-ash/20 border border-brand-ash/60 p-5 xs:p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl hover:border-brand-green/30 hover:shadow-card-hover transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-white rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-green mb-4 sm:mb-6 shadow-xs group-hover:scale-110 transition-transform shrink-0">
                {item.icon}
              </div>
              <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-2 sm:mb-3">
                {item.title}
              </h3>
              <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process & Pricing Split */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Left: How it Works & Deliverables */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-12">
            <div>
              <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mb-5 sm:mb-8 tracking-tight">
                How it Works
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { icon: <UserCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />, title: "Select your coach", desc: "Choose a coach below, fill out the form, and upload your current CV." },
                  { icon: <Calendar className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />, title: "Schedule Sessions", desc: "Your coach will personally reach out within 48 hours to schedule sessions at a time that suits you." },
                  { icon: <Star className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />, title: "Transform & Feedback", desc: "Undergo your coaching and mock interviews. Afterwards, you are welcome to share feedback on your experience." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4 items-start">
                    {step.icon}
                    <div>
                      <h4 className="font-bold text-brand-dark text-sm sm:text-base mb-0.5 sm:mb-1">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8">
              <h3 className="font-header text-lg sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6">
                At the end, you get:
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "A tailored CV and Cover Letter",
                  "Live 1-on-1 mock interview sessions via video call",
                  "Walkthrough of common entry-level questions and answers",
                  "Feedback on communication, body language, and structure",
                  "A personalised tip sheet after each session"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-brand-dark/80 font-medium text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Pricing & Coach Selection */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-brand-white border-2 border-brand-ash rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm">
              <p className="text-brand-dark/50 text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">
                One-Time Investment
              </p>
              <div className="flex items-end gap-1 mb-3 sm:mb-4">
                <span className="font-header text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
                  ₦50,000
                </span>
              </div>
              
              <div className="bg-brand-orange/10 text-brand-dark/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm font-medium flex items-start gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Pay only when you decide to proceed after the initial chat. <strong className="font-bold text-brand-dark">No upfront payment.</strong>
                </p>
              </div>

              {/* Modal Trigger */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-block text-center bg-brand-dark text-brand-white py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                Request Service
              </button>
            </div>

            <div className="bg-brand-dark rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-brand-glow text-brand-white">
              <h3 className="font-header text-lg sm:text-xl text-brand-orange font-bold mb-4 sm:mb-6">
                Choose Your Coach
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {COACHES.map((coach, i) => (
                  <div 
                    key={i} 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/10 active:scale-98 transition-all cursor-pointer group"
                  >
                    <h4 className="font-bold text-sm sm:text-base text-brand-orange mb-1 group-hover:text-brand-green transition-colors">
                      {coach.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-white/80 font-medium mb-1.5 sm:mb-2">
                      {coach.role} • {coach.specialty}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed italic">
                      "{coach.exp}"
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-center text-[10px] xs:text-xs text-brand-white/40 mt-3 sm:mt-4">
                Click any coach to open the service request form.
              </p>
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
        
        <FaqAccordion faqs={FAQS} />
      </section>

      {/* Application Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative w-full max-w-3xl bg-brand-white rounded-2xl sm:rounded-[2rem] shadow-2xl my-auto py-2 z-10 overflow-hidden">
            {/* Header / Close Button */}
            <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-brand-ash/50 bg-brand-ash/20">
              <h3 className="font-header text-lg sm:text-2xl font-bold text-brand-dark">Request Career Readiness</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-brand-dark/60 hover:text-brand-dark bg-brand-white rounded-full transition-colors shadow-xs active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Form Content Container */}
            <div className="p-4 sm:p-6 md:p-8 max-h-[calc(85vh-4rem)] overflow-y-auto no-scrollbar">
              <DynamicForm 
                formId="career_readiness" 
                initialSchema={initialSchema} 
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
import Link from "next/link";
import { 
  Briefcase, Users, FileCheck2, Compass, ShieldCheck, 
  ArrowRight, Sparkles, CheckCircle2 
} from "lucide-react";

export const metadata = {
  title: "Services | TalentCore",
  description: "Explore tailored recruitment, job matching, and career readiness services for employers and emerging talent.",
};

const EMPLOYER_SERVICES = [
  {
    title: "Post a Job Vacancy",
    href: "/services/job-listing",
    description: "Publish your entry-level vacancies on our targeted job board and get direct exposure to over 1,000 pre-screened Nigerian graduates.",
    icon: Briefcase,
    badge: "For Employers",
    highlights: [
      "Standard listings on our public job board",
      "Featured options with priority network alerts",
      "Direct applications via your preferred link or email"
    ]
  },
  {
    title: "Candidate Matching & Sourcing",
    href: "/services/job-matching",
    description: "Stop sifting through hundreds of mismatched resumes. We scout, screen, and interview pre-vetted candidates tailored to your specific role.",
    icon: Users,
    badge: "For Employers",
    highlights: [
      "Pay only when you successfully hire",
      "Free replacement guarantee",
      "Shortlisted candidates delivered in under 7 business days"
    ]
  },
  {
    title: "Outsource HR & Talent Operations",
    href: "/services/outsource-hr",
    description: "Comprehensive end-to-end HR and recruitment operations designed specifically for Nigerian startups and growing SMEs.",
    icon: ShieldCheck,
    badge: "For Employers",
    highlights: [
      "Candidate screening and interview coordination",
      "Structured onboarding and policy alignment",
      "Scalable HR support without internal overhead"
    ]
  }
];

const GRADUATE_SERVICES = [
  {
    title: "Job Placement & Direct Referral",
    href: "/services/job-placement",
    description: "Stop applying blindly. Get matched directly to employers hiring entry-level talent with zero cost to you.",
    icon: Sparkles,
    badge: "For Graduates",
    highlights: [
      "100% free for graduates and job seekers",
      "Direct referral using TalentCore job codes",
      "Active placement support until you land interviews"
    ]
  },
  {
    title: "Career Readiness Coaching",
    href: "/services/career-readiness",
    description: "Work one-on-one with seasoned HR specialists to refine your interview skills, communication, and market position.",
    icon: Compass,
    badge: "For Graduates",
    highlights: [
      "Live 1-on-1 mock interviews with video feedback",
      "Honest advice from recruiters screening junior talent",
      "Personalized interview cheat-sheets and prep frameworks"
    ]
  },
  {
    title: "Resume & LinkedIn Optimization",
    href: "/services/resume-writing",
    description: "Transform your CV, LinkedIn profile, and cover letters so they truly reflect your strengths and pass recruiter screenings.",
    icon: FileCheck2,
    badge: "For Graduates",
    highlights: [
      "Complete rewrite tailored to your target industry",
      "LinkedIn profile optimization for recruiter search",
      "Flexible modular options for CV or full packages"
    ]
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24">
      {/* Hero Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <div className="bg-brand-dark text-brand-white rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-brand-glow">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-md bg-white/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4 border border-white/10">
              TalentCore Solutions
            </span>
            <h1 className="font-header text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight">
              Empowering Employers &amp; Emerging Talent
            </h1>
            <p className="text-brand-white/80 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl">
              Whether you are an ambitious business looking to build your core team or a graduate ready to launch your career, TalentCore provides the streamlined tools and support to get you there.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Employer Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-16 sm:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-brand-ash/60 pb-4">
          <div>
            <span className="text-brand-green text-xs font-bold uppercase tracking-widest">
              Business &amp; Hiring
            </span>
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
              Services for Employers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md">
            Hire vetted, motivated entry-level talent faster with lower risk and zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {EMPLOYER_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link 
                key={service.href} 
                href={service.href}
                className="group flex flex-col justify-between bg-brand-white border border-brand-ash/70 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:border-brand-green/40 hover:shadow-card-hover transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-green group-hover:text-brand-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-brand-ash/40 text-brand-dark/70">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-header text-xl font-bold text-brand-dark group-hover:text-brand-green transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6 border-t border-brand-ash/40 pt-4">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 2: Graduate Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-brand-ash/60 pb-4">
          <div>
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">
              Career Growth &amp; Placement
            </span>
            <h2 className="font-header text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
              Services for Graduates
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md">
            Gain clarity, polish your profile, and connect directly with verified employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {GRADUATE_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link 
                key={service.href} 
                href={service.href}
                className="group flex flex-col justify-between bg-brand-white border border-brand-ash/70 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:border-brand-orange/40 hover:shadow-card-hover transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-orange group-hover:text-brand-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-brand-ash/40 text-brand-dark/70">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-header text-xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6 border-t border-brand-ash/40 pt-4">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

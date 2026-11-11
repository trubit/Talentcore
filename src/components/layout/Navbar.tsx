"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";

const SERVICES_MENU = {
  employers: [
    { name: "Job Listing", path: "/services/job-listing" },
    { name: "Job Matching Service", path: "/services/job-matching" },
    { name: "Outsource HR Service", path: "/services/outsource-hr" },
  ],
  candidates: [
    { name: "Job Placement Service", path: "/services/job-placement" },
   // { name: "Career Readiness Service", path: "/services/career-readiness" },
   // { name: "Resume Writing", path: "/services/resume-writing" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open on smaller devices
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const NavItem = ({ name, path }: { name: string; path: string }) => {
    const isActive = pathname === path;
    const isHovered = hoveredItem === name;

    return (
      <Link
        href={path}
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`relative px-3.5 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors z-10 ${
          isActive || isHovered ? "text-brand-green" : "text-brand-dark"
        }`}
      >
        <span className="relative z-20">{name}</span>
        {isHovered && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 bg-brand-green/10 rounded-full z-0"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  const AnimatedLogo = () => (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="flex-shrink-0 cursor-pointer relative z-50"
    >
      <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="TalentCore Home">
        <Image 
          src="/logo.png" 
          alt="TalentCore Logo" 
          width={160} 
          height={45} 
          className="object-contain h-7 xs:h-8 sm:h-9 md:h-10 lg:h-12 w-auto" 
          priority
        />
      </Link>
    </motion.div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-2 sm:pt-3 md:pt-4 px-3 sm:px-6 md:px-8 pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        
        {/* Desktop / Tablet Landscape Navigation (md and above) */}
        <nav className="hidden md:flex items-center justify-between bg-brand-white/95 backdrop-blur-md shadow-card-hover rounded-full px-3 py-1.5 lg:px-4 lg:py-2 border border-brand-ash/50 relative">
          
          {/* Left Navigation Links */}
          <div className="flex items-center justify-end flex-1 pr-4 lg:pr-6 gap-1 lg:gap-2">
            <NavItem name="Home" path="/" />
            <NavItem name="Job Vacancies" path="/jobs" />
          </div>

          {/* Centered Brand Logo */}
          <AnimatedLogo />

          {/* Right Navigation Links & Mega Dropdown */}
          <div className="flex items-center justify-start flex-1 pl-4 lg:pl-6 gap-1 lg:gap-2">
            
            <div 
              className="relative"
              onMouseEnter={() => {
                setHoveredItem("Services");
                setIsServicesHovered(true);
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                setIsServicesHovered(false);
              }}
            >
              <Link 
                href="/services" 
                className={`relative flex items-center gap-1 px-3.5 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors z-10 ${
                  pathname.startsWith("/services") || isServicesHovered ? "text-brand-green" : "text-brand-dark"
                }`}
              >
                <span className="relative z-20">Services</span>
                <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 relative z-20 transition-transform duration-200 ${isServicesHovered ? "rotate-180" : ""}`} />
                {hoveredItem === "Services" && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-green/10 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>

              {/* Desktop Mega Menu */}
              <AnimatePresence>
                {isServicesHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[380px] lg:w-[440px] bg-brand-white rounded-3xl shadow-2xl border border-brand-ash/80 p-5 lg:p-6 grid grid-cols-2 gap-4 lg:gap-6 before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3"
                  >
                    <div className="space-y-3">
                      <h4 className="text-[11px] lg:text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-ash/40 pb-1.5">
                        For Employers
                      </h4>
                      <ul className="space-y-1">
                        {SERVICES_MENU.employers.map((item) => (
                          <li key={item.name}>
                            <Link 
                              href={item.path} 
                              className="text-xs lg:text-sm text-brand-dark hover:text-brand-green hover:translate-x-1 transition-all block py-1 font-medium"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[11px] lg:text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-ash/40 pb-1.5">
                        For Candidates
                      </h4>
                      <ul className="space-y-1">
                        {SERVICES_MENU.candidates.map((item) => (
                          <li key={item.name}>
                            <Link 
                              href={item.path} 
                              className="text-xs lg:text-sm text-brand-dark hover:text-brand-green hover:translate-x-1 transition-all block py-1 font-medium"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavItem name="Contact" path="/contact" />
          </div>
        </nav>

        {/* Mobile Navigation Header (below md) */}
        <nav className="md:hidden flex items-center justify-between bg-brand-white/95 backdrop-blur-md shadow-card-hover rounded-full px-3 py-2 border border-brand-ash/60 relative z-50">
          {/* Spacer on the left to ensure the center logo stays perfectly aligned */}
          <div className="w-10 h-10" aria-hidden="true" />
          
          {/* Centered Logo */}
          <AnimatedLogo />
          
          {/* Menu Trigger Button on the Right */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-brand-dark active:bg-brand-ash/40 rounded-full transition-colors focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Drawer and Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Tap Outside Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-brand-dark/40 backdrop-blur-xs z-40"
              />

              {/* Mobile Drawer Menu */}
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute top-[calc(100%+0.5rem)] inset-x-3 sm:inset-x-6 bg-brand-white rounded-3xl shadow-2xl border border-brand-ash p-4 sm:p-5 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain z-50"
              >
                <div className="flex flex-col space-y-1">
                  
                  <Link 
                    href="/" 
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-colors ${
                      pathname === "/" ? "bg-brand-green/10 text-brand-green" : "text-brand-dark active:bg-brand-ash/30"
                    }`}
                  >
                    <span>Home</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>

                  <Link 
                    href="/jobs" 
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-colors ${
                      pathname === "/jobs" ? "bg-brand-green/10 text-brand-green" : "text-brand-dark active:bg-brand-ash/30"
                    }`}
                  >
                    <span>Job Vacancies</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>
                  
                  {/* Mobile Collapsible Services Section */}
                  <div className="rounded-2xl border border-brand-ash/40 bg-brand-ash/10 overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-brand-dark text-left"
                      aria-expanded={mobileServicesOpen}
                    >
                      <span className={pathname.startsWith("/services") ? "text-brand-green" : ""}>Services</span>
                      <ChevronDown className={`w-4 h-4 text-brand-dark/60 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {mobileServicesOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-brand-white/80 border-t border-brand-ash/30"
                        >
                          <div className="p-4 space-y-4">
                            
                            {/* Employers Block */}
                            <div>
                              <p className="text-[10px] font-bold tracking-wider uppercase text-brand-orange mb-2">
                                For Employers
                              </p>
                              <div className="flex flex-col space-y-1">
                                {SERVICES_MENU.employers.map((item) => (
                                  <Link 
                                    key={item.name} 
                                    href={item.path} 
                                    className={`px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                                      pathname === item.path ? "bg-brand-green/10 text-brand-green" : "text-brand-dark/80 active:bg-brand-ash/30"
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Candidates Block */}
                            <div>
                              <p className="text-[10px] font-bold tracking-wider uppercase text-brand-orange mb-2">
                                For Candidates
                              </p>
                              <div className="flex flex-col space-y-1">
                                {SERVICES_MENU.candidates.map((item) => (
                                  <Link 
                                    key={item.name} 
                                    href={item.path} 
                                    className={`px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                                      pathname === item.path ? "bg-brand-green/10 text-brand-green" : "text-brand-dark/80 active:bg-brand-ash/30"
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link 
                    href="/contact" 
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-colors ${
                      pathname === "/contact" ? "bg-brand-green/10 text-brand-green" : "text-brand-dark active:bg-brand-ash/30"
                    }`}
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
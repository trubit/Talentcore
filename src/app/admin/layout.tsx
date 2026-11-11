"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Briefcase, Users, Calendar,
  MessageSquare, Settings, ClipboardList, FileText, 
  Menu, X, ShieldCheck
} from "lucide-react";
import LogoutButton from "./LogoutButton"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4 Core Everyday Operations (Shown directly on Mobile Bottom Dock)
  const primaryNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Job Board", href: "/admin/jobs", icon: Briefcase },
    { name: "Candidates", href: "/admin/candidates", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  ];

  // Secondary Tools (Accessible in Desktop Sidebar & Mobile "More" Drawer)
  const secondaryNavItems = [
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Forms", href: "/admin/forms", icon: ClipboardList },
    { name: "Documents", href: "/admin/documents", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  // Match current route including nested subpages (e.g. /admin/jobs/new)
  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const currentRouteName = 
    allNavItems.find(item => isItemActive(item.href))?.name || "Admin Portal";

  return (
    <div className="flex h-screen bg-brand-ash/10 overflow-hidden relative">
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (md:flex)                                                 */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-brand-dark text-brand-white flex flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-brand-white/10">
          <span className="font-header text-2xl font-bold text-brand-white flex items-center">
            Talent<span className="text-brand-green">Core</span>
            <span className="text-brand-white text-[10px] ml-2 tracking-widest uppercase opacity-60 bg-brand-white/10 px-2 py-0.5 rounded">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? "bg-brand-green text-brand-white font-semibold shadow-xs" 
                    : "text-brand-white/70 hover:bg-brand-white/5 hover:text-brand-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER                                                  */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header (App Bar) */}
        <header className="h-16 sm:h-20 bg-brand-white border-b border-brand-ash/60 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          
          {/* Brand/Current Page Label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-green/10 border border-brand-green/25 text-brand-green flex items-center justify-center font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 block md:hidden">
                Admin Panel
              </span>
              <h2 className="font-header text-base sm:text-xl font-bold text-brand-dark tracking-tight">
                {currentRouteName}
              </h2>
            </div>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-brand-ash/30 border border-brand-ash/60 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-bold text-brand-dark">Admin</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-8">
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE APP-STYLE BOTTOM NAVIGATION DOCK (md:hidden)                       */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-t border-brand-white/10 px-2 py-1.5 shadow-2xl safe-area-bottom">
        <nav className="flex items-center justify-around">
          
          {/* 4 Primary Navigation Tabs */}
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
                  active ? "text-brand-orange" : "text-brand-white/60 hover:text-brand-white"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold mt-1 tracking-tight">
                  {item.name === "Job Board" ? "Jobs" : item.name}
                </span>
              </Link>
            );
          })}

          {/* App-Style "More" Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
              isMobileMenuOpen || secondaryNavItems.some(i => isItemActive(i.href))
                ? "text-brand-orange"
                : "text-brand-white/60 hover:text-brand-white"
            }`}
            aria-label="Toggle secondary menu"
          >
            <div className="relative">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {secondaryNavItems.some(i => isItemActive(i.href)) && !isMobileMenuOpen && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1 tracking-tight">More</span>
          </button>

        </nav>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE "MORE" SLIDE-UP APP SHEET                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-brand-dark/70 backdrop-blur-xs z-40"
            />

            {/* Slide-Up Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="md:hidden fixed bottom-[65px] left-3 right-3 z-50 bg-brand-dark border border-brand-white/15 rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brand-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-white/50">
                  Quick Actions & Admin Tools
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-brand-white/10 flex items-center justify-center text-brand-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2x2 Grid for Secondary Items */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all active:scale-95 ${
                        active
                          ? "bg-brand-green/20 border-brand-green text-brand-green"
                          : "bg-brand-white/5 border-brand-white/10 text-brand-white/80 hover:bg-brand-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="text-xs font-bold text-center">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-brand-white/10">
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
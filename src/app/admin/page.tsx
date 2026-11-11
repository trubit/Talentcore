import { db } from "@/lib/db";
import { jobs, candidates, bookings, contactMessages } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { Briefcase, Users, Calendar, MessageSquare, ArrowRight, ShieldCheck, Plus, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = {
    totalJobs: 0,
    activeCandidates: 0,
    totalBookings: 0,
    unreadMessages: 0,
  };

  try {
    const [jobsRes, candidatesRes, bookingsRes, messagesRes] = await Promise.all([
      db.select({ value: count() }).from(jobs),
      db.select({ value: count() }).from(candidates),
      db.select({ value: count() }).from(bookings),
      db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.status, "NEW")),
    ]);

    stats = {
      totalJobs: jobsRes[0]?.value || 0,
      activeCandidates: candidatesRes[0]?.value || 0,
      totalBookings: bookingsRes[0]?.value || 0,
      unreadMessages: messagesRes[0]?.value || 0,
    };
  } catch (error) {
    console.error("[BACKEND] Error fetching dashboard stats:", error);
  }

  const statCards = [
    {
      title: "Job Board",
      count: stats.totalJobs,
      label: "Total Posted Jobs",
      href: "/admin/jobs",
      icon: Briefcase,
      color: "text-brand-green",
      bg: "bg-brand-green/10",
    },
    {
      title: "Candidate Pool",
      count: stats.activeCandidates,
      label: "Registered Candidates",
      href: "/admin/candidates",
      icon: Users,
      color: "text-brand-green",
      bg: "bg-brand-green/10",
    },
    {
      title: "Scheduled Bookings",
      count: stats.totalBookings,
      label: "Upcoming Calls",
      href: "/admin/bookings",
      icon: Calendar,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
    },
    {
      title: "Incoming Messages",
      count: stats.unreadMessages,
      label: "New Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "text-brand-green",
      bg: "bg-brand-green/10",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-white p-6 sm:p-8 rounded-2xl border border-brand-ash/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/60">TalentCore Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
            Real-time management for talent matching, listings, inquiries, and schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 bg-brand-green text-brand-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-green/90 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-brand-ash/30 text-brand-dark px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-ash/50 transition-all border border-brand-ash/60"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Site</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-brand-white p-5 sm:p-6 rounded-2xl border border-brand-ash/60 shadow-xs hover:border-brand-green/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-brand-dark/40 group-hover:translate-x-1 group-hover:text-brand-green transition-all" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                {card.count}
              </p>
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark/80 mt-1">
                {card.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-brand-dark/50 mt-0.5">
                {card.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

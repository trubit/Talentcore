"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Video, Mail, Building2, 
  Search, ExternalLink, Copy, Check, CheckCircle2, 
  XCircle, Filter, Loader2, Save, Settings2, Sliders
} from "lucide-react";
import { updateBookingStatusAction, saveAvailabilitySettingsAction } from "./actions";

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export default function BookingsClient({ 
  initialBookings = [], 
  initialSettings 
}: { 
  initialBookings: any[];
  initialSettings: any;
}) {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"meetings" | "settings">("meetings");

  // Meetings List State
  const [bookingsList, setBookingsList] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Settings Form State
  const [weeklySchedule, setWeeklySchedule] = useState(initialSettings.weeklySchedule);
  const [slotDuration, setSlotDuration] = useState(initialSettings.slotDuration);
  const [bufferTime, setBufferTime] = useState(initialSettings.bufferTime);
  const [minNoticeHours, setMinNoticeHours] = useState(initialSettings.minNoticeHours);
  const [maxDaysInFuture, setMaxDaysInFuture] = useState(initialSettings.maxDaysInFuture);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Filter Bookings
  const filteredBookings = bookingsList.filter((b) => {
    const matchesSearch =
      b.employerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      (b.contactName && b.contactName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = filter === "ALL" || b.status?.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCopyLink = (id: string, link: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (bookingId: string, newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    setUpdatingId(bookingId);
    try {
      const res = await updateBookingStatusAction(bookingId, newStatus);
      if (res.success) {
        setBookingsList((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else {
        alert(res.error || "Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await saveAvailabilitySettingsAction({
        weeklySchedule,
        slotDuration: Number(slotDuration),
        bufferTime: Number(bufferTime),
        minNoticeHours: Number(minNoticeHours),
        maxDaysInFuture: Number(maxDaysInFuture),
      });

      if (res.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert(res.error || "Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const updateDay = (dayKey: string, field: "enabled" | "start" | "end", value: any) => {
    setWeeklySchedule((prev: any) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  const totalConfirmed = bookingsList.filter((b) => b.status?.toUpperCase() === "CONFIRMED").length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-14 sm:pb-16 max-w-6xl mx-auto">
      
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-xl xs:text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
            Meeting & Schedule Hub
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
            Manage your booked calls and configure your open calendar availability.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-brand-ash/30 p-1.5 rounded-2xl border border-brand-ash/60 w-full sm:w-max">
          <button
            onClick={() => setActiveTab("meetings")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "meetings"
                ? "bg-brand-white text-brand-dark shadow-xs border border-brand-ash/60"
                : "text-brand-dark/70 hover:text-brand-dark"
            }`}
          >
            <Calendar className="w-4 h-4 text-brand-green" />
            <span>Scheduled Meetings ({totalConfirmed})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-brand-white text-brand-dark shadow-xs border border-brand-ash/60"
                : "text-brand-dark/70 hover:text-brand-dark"
            }`}
          >
            <Sliders className="w-4 h-4 text-brand-orange" />
            <span>Availability Rules</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCHEDULED MEETINGS */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-brand-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company, contact, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-white border border-brand-ash/70 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green shadow-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-brand-ash/20 p-1 rounded-xl border border-brand-ash/60 self-start sm:self-auto">
              {(["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === tab 
                      ? "bg-brand-white text-brand-dark shadow-2xs" 
                      : "text-brand-dark/60 hover:text-brand-dark"
                  }`}
                >
                  {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-brand-dark/50 text-xs sm:text-sm font-medium">
                No scheduled meetings match your filter.
              </div>
            ) : (
              <div className="divide-y divide-brand-ash/40">
                {filteredBookings.map((b) => {
                  const meetingDate = new Date(b.scheduledAt);
                  const dateStr = meetingDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const timeStr = meetingDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div 
                      key={b.id} 
                      className="p-4 sm:p-6 hover:bg-brand-ash/10 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : b.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-xs text-brand-dark/50 font-medium">
                            {b.durationMinutes || 15} mins
                          </span>
                        </div>

                        <div>
                          <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-brand-orange shrink-0" />
                            <span className="truncate">{b.companyName}</span>
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-brand-dark/70 font-medium pt-1">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-brand-dark/40" />
                            <span className="truncate">{b.employerEmail}</span>
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-brand-dark">
                            <Calendar className="w-3.5 h-3.5 text-brand-green" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-brand-dark">
                            <Clock className="w-3.5 h-3.5 text-brand-green" />
                            {timeStr} WAT
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-brand-ash/40">
                        <select
                          disabled={updatingId === b.id}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                          className="bg-brand-ash/20 border border-brand-ash/60 rounded-xl px-3 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        {b.meetLink && (
                          <button
                            onClick={() => handleCopyLink(b.id, b.meetLink)}
                            className="px-3 py-2 rounded-xl bg-brand-white border border-brand-ash/60 text-brand-dark hover:bg-brand-ash/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Copy Meet Link"
                          >
                            {copiedId === b.id ? (
                              <Check className="w-3.5 h-3.5 text-brand-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-brand-dark/70" />
                            )}
                            <span>{copiedId === b.id ? "Copied" : "Copy"}</span>
                          </button>
                        )}

                        {b.meetLink ? (
                          <a
                            href={b.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-brand-dark text-brand-white hover:bg-brand-orange text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Meet</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-xs text-brand-dark/40 italic px-2">No Meet URL</span>
                        )}

                        {updatingId === b.id && <Loader2 className="w-4 h-4 animate-spin text-brand-green ml-1" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABILITY & WORKING HOURS CONFIGURATION */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 sm:space-y-8">
          
          {/* Working Days & Hours Card */}
          <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-brand-orange" />
              <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                Weekly Operating Schedule (WAT)
              </h2>
            </div>
            <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 font-medium">
              Enable the days you are open for calls and specify the available time range for each day.
            </p>

            <div className="divide-y divide-brand-ash/40 border border-brand-ash/60 rounded-2xl overflow-hidden">
              {DAYS.map(({ key, label }) => {
                const dayData = weeklySchedule[key] || { enabled: false, start: "09:00", end: "17:00" };

                return (
                  <div 
                    key={key} 
                    className={`p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      dayData.enabled ? "bg-brand-white" : "bg-brand-ash/15 opacity-60"
                    }`}
                  >
                    {/* Day Toggle */}
                    <div className="flex items-center gap-3 w-36">
                      <input
                        type="checkbox"
                        id={`toggle-${key}`}
                        checked={dayData.enabled}
                        onChange={(e) => updateDay(key, "enabled", e.target.checked)}
                        className="w-4 h-4 rounded text-brand-green focus:ring-brand-green accent-brand-green cursor-pointer"
                      />
                      <label 
                        htmlFor={`toggle-${key}`}
                        className="font-bold text-xs sm:text-sm text-brand-dark cursor-pointer select-none"
                      >
                        {label}
                      </label>
                    </div>

                    {/* Hours Range Pickers */}
                    {dayData.enabled ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs font-bold text-brand-dark/60">From:</span>
                        <input
                          type="time"
                          value={dayData.start}
                          onChange={(e) => updateDay(key, "start", e.target.value)}
                          className="bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green"
                          required
                        />
                        <span className="text-xs font-bold text-brand-dark/60">To:</span>
                        <input
                          type="time"
                          value={dayData.end}
                          onChange={(e) => updateDay(key, "end", e.target.value)}
                          className="bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green"
                          required
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-brand-dark/50 italic">
                        Unavailable for calls
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meeting Rules & Buffers Card */}
          <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-brand-green" />
              <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                Booking Rules & Horizon
              </h2>
            </div>
            <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 font-medium">
              Control the pacing of your calls to avoid back-to-back burnout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Call Duration
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl p-2.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Buffer Between Calls
                </label>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(Number(e.target.value))}
                  className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl p-2.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value={0}>0 Minutes</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Minimum Notice
                </label>
                <select
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                  className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl p-2.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value={1}>1 Hour before</option>
                  <option value={2}>2 Hours before</option>
                  <option value={4}>4 Hours before</option>
                  <option value={24}>24 Hours before</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Booking Horizon
                </label>
                <select
                  value={maxDaysInFuture}
                  onChange={(e) => setMaxDaysInFuture(Number(e.target.value))}
                  className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl p-2.5 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value={7}>7 Days out</option>
                  <option value={14}>14 Days out</option>
                  <option value={30}>30 Days out</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            {settingsSuccess ? (
              <span className="text-xs sm:text-sm font-bold text-brand-green flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Availability preferences saved successfully!
              </span>
            ) : (
              <span className="text-xs text-brand-dark/50">
                Changes apply instantly across all live booking forms.
              </span>
            )}

            <button
              type="submit"
              disabled={isSavingSettings}
              className="bg-brand-green text-brand-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-70"
            >
              {isSavingSettings ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> <span>Saving...</span></>
              ) : (
                <><Save className="w-4 h-4" /> <span>Save Availability Rules</span></>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
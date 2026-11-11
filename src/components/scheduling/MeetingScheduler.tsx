"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, Video, Mail, 
  CheckCircle2, Loader2, Copy, Check, CalendarPlus 
} from "lucide-react";
import { getAvailableSlots, scheduleMeeting } from "@/lib/calendar";

export interface MeetingSchedulerProps {
  clientEmail?: string;
  clientName?: string;
  companyName?: string;
  meetingType?: "employer" | "graduate";
  title?: string;
  subtitle?: string;
  onSuccess?: (bookingDetails: { meetLink: string; date: string; time: string }) => void;
  onClose?: () => void;
}

export default function MeetingScheduler({
  clientEmail: defaultEmail = "",
  clientName = "",
  companyName = "",
  meetingType = "employer",
  title = "Schedule Alignment Call",
  subtitle = "Pick a convenient 15-minute slot for our team briefing.",
  onSuccess,
  onClose,
}: MeetingSchedulerProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; dayLabel: string; dateNum: number; monthLabel: string }[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [status, setStatus] = useState<"idle" | "scheduling" | "booked">("idle");
  const [confirmedMeetLink, setConfirmedMeetLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync email prop if changed externally
  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  // Load initial available dates on mount
  useEffect(() => {
    getAvailableSlots().then((res) => {
      setAvailableDates(res.availableDates);
      if (res.availableDates.length > 0) {
        setSelectedDate(res.availableDates[0].dateStr);
        setAvailableSlots(res.availableSlots);
      }
    });
  }, []);

  // Fetch slots whenever user selects a different date
  const handleDateSelect = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime("");
    setIsLoadingSlots(true);
    try {
      const res = await getAvailableSlots(dateStr);
      setAvailableSlots(res.availableSlots);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleConfirmMeeting = async () => {
    if (!selectedDate || !selectedTime || !email) return;
    setStatus("scheduling");

    try {
      const result = await scheduleMeeting({
        dateStr: selectedDate,
        timeStr: selectedTime,
        clientEmail: email,
        clientName,
        companyName,
        meetingType,
      });

      if (result.success) {
        const link = result.meetLink || "";
        setConfirmedMeetLink(link);
        setStatus("booked");
        if (onSuccess) {
          onSuccess({
            meetLink: link,
            date: selectedDate,
            time: selectedTime,
          });
        }
      } else {
        alert(result.error || "Failed to schedule meeting. Please select another slot.");
        setStatus("idle");
      }
    } catch (error) {
      console.error(error);
      alert("A network error occurred while scheduling.");
      setStatus("idle");
    }
  };

  const handleCopy = () => {
    if (!confirmedMeetLink) return;
    navigator.clipboard.writeText(confirmedMeetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const generateGoogleCalendarLink = () => {
    if (!selectedDate || !selectedTime) return "#";
    const [time, modifier] = selectedTime.trim().split(" ");
    const [hoursRaw, minutes = 0] = time.split(":").map(Number);
    let hours = hoursRaw;
    if (modifier?.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const startDate = new Date(`${selectedDate}T${pad(hours)}:${pad(minutes)}:00+01:00`);
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000);

    const formatUTC = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const calTitle = encodeURIComponent(title);
    const details = encodeURIComponent(`Meeting Link: ${confirmedMeetLink || "https://meet.google.com"}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${formatUTC(startDate)}/${formatUTC(endDate)}&details=${details}`;
  };

  // 1. CONFIRMED SCREEN
  if (status === "booked") {
    return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
        <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto mb-4" />
        <h2 className="font-header text-2xl font-bold text-brand-dark mb-1 tracking-tight">Meeting Confirmed!</h2>
        <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 max-w-md mx-auto">
          Your 15-minute slot is scheduled for <br />
          <strong className="text-brand-dark font-bold">{selectedDate} at {selectedTime} (WAT)</strong>.
        </p>

        {confirmedMeetLink && (
          <div className="bg-brand-ash/20 border border-brand-ash/60 rounded-2xl p-4 sm:p-5 max-w-md mx-auto mb-6 text-left">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-dark/60 block mb-1">
              Google Meet Link
            </span>
            <div className="flex items-center justify-between gap-2">
              <a 
                href={confirmedMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-brand-green hover:underline truncate font-semibold"
              >
                {confirmedMeetLink}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-brand-white hover:bg-brand-ash/40 text-brand-dark/70 hover:text-brand-dark transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Copy Meet Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-brand-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {confirmedMeetLink && (
            <a 
              href={confirmedMeetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-brand-dark text-brand-white px-6 py-3.5 rounded-xl font-bold hover:bg-brand-orange active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Video className="w-4 h-4" />
              Join Google Meet
            </a>
          )}

          <a 
            href={generateGoogleCalendarLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-brand-green text-brand-white px-6 py-3.5 rounded-xl font-bold hover:bg-brand-orange active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to Calendar
          </a>

          {onClose && (
            <button 
              onClick={onClose} 
              className="w-full sm:w-auto bg-brand-ash/30 border border-brand-ash/60 text-brand-dark px-6 py-3.5 rounded-xl font-bold hover:bg-brand-ash/50 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. SCHEDULER SELECTOR SCREEN
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <Video className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      
      <h2 className="font-header text-xl sm:text-2xl font-bold text-brand-dark mb-1.5 tracking-tight">
        {title}
      </h2>
      <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 font-medium max-w-md mx-auto">
        {subtitle}
      </p>

      <div className="bg-brand-ash/15 rounded-2xl p-4 sm:p-6 mb-6 text-left border border-brand-ash/50 shadow-2xs">
        
        {/* Email Input */}
        <div className="mb-5 sm:mb-6">
          <h4 className="font-bold text-xs sm:text-sm text-brand-dark mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-brand-orange" /> Meeting Contact Email
          </h4>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-brand-white border border-brand-ash/70 rounded-xl p-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            required
          />
        </div>

        {/* Date Selector */}
        <h4 className="font-bold text-xs sm:text-sm text-brand-dark mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-brand-orange" /> Available Dates
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
          {availableDates.map((d, i) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDateSelect(d.dateStr)}
                className={`p-2 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-dark text-brand-white border-brand-dark shadow-sm"
                    : "bg-brand-white border-brand-ash/70 text-brand-dark/80 hover:border-brand-orange hover:bg-brand-orange/5"
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-bold uppercase block">{d.dayLabel}</span>
                <span className="text-base sm:text-lg font-header font-bold block">{d.dateNum}</span>
                <span className="text-[10px] sm:text-[11px] block">{d.monthLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Time Slots (WAT) */}
        <h4 className="font-bold text-xs sm:text-sm text-brand-dark mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-orange" /> Open Time Slots (WAT)
        </h4>
        
        {isLoadingSlots ? (
          <div className="py-6 flex items-center justify-center gap-2 text-brand-dark/60 text-xs font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking available slots...
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="py-6 text-center text-xs text-brand-dark/60 bg-brand-white rounded-xl border border-brand-ash/60 font-medium">
            No open slots remaining for this date. Please pick another day.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.map((time, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedTime === time
                    ? "bg-brand-green text-brand-white border-brand-green shadow-sm"
                    : "bg-brand-white border-brand-ash/70 text-brand-dark hover:border-brand-green hover:bg-brand-green/5"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleConfirmMeeting}
        disabled={!selectedDate || !selectedTime || !email || status === "scheduling"}
        className="w-full bg-brand-dark text-brand-white py-3.5 rounded-xl font-bold hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
      >
        {status === "scheduling" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
        ) : (
          "Confirm Meeting"
        )}
      </button>
    </motion.div>
  );
}
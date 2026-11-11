"use client";

import { useState, useMemo } from "react";
import { 
  Search, MoreVertical, 
  Mail, MailOpen, Reply, Trash2, CheckCircle2, X, Clock,
  MessageSquare, Send
} from "lucide-react";
import { ContactMessage, updateMessageStatus, deleteMessage } from "./actions";

export default function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Read" | "Replied">("All");
  const [activeDropdown, setActiveDropdown] = useState<number | string | null>(null);
  
  // State for the "View Full Message" modal
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  const toggleDropdown = (id: number | string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Live Search & Status Filtering
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        msg.name?.toLowerCase().includes(query) ||
        msg.email?.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.snippet?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || msg.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  // Handlers for Backend Actions
  const handleViewMessage = async (msg: ContactMessage) => {
    setActiveDropdown(null);
    setViewingMessage(msg);
    
    // Automatically mark as "Read" if opened as "New"
    if (msg.status === "New") {
      setMessages((prev) => 
        prev.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m))
      );
      await updateMessageStatus(msg.id, "Read");
    }
  };

  const handleMarkAsReplied = async (id: number | string) => {
    setActiveDropdown(null);
    setMessages((prev) => 
      prev.map((m) => (m.id === id ? { ...m, status: "Replied" } : m))
    );
    if (viewingMessage && viewingMessage.id === id) {
      setViewingMessage({ ...viewingMessage, status: "Replied" });
    }
    await updateMessageStatus(id, "Replied");
  };

  const handleDelete = async (id: number | string) => {
    setActiveDropdown(null);
    if (confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (viewingMessage && viewingMessage.id === id) setViewingMessage(null);
      await deleteMessage(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl xs:text-3xl font-bold text-brand-dark mb-1 tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            View, review, and manage direct inquiries from your public contact forms.
          </p>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-brand-white p-3 sm:p-4 rounded-2xl border border-brand-ash/60 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
          <input 
            type="text" 
            placeholder="Search by sender, email, or message..." 
            className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/45 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-dark p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 md:pt-0">
          {(["All", "New", "Read", "Replied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer ${
                statusFilter === status
                  ? "bg-brand-dark text-brand-white shadow-xs"
                  : "bg-brand-ash/30 text-brand-dark/70 hover:bg-brand-ash/60 hover:text-brand-dark"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW: App-Style Message Cards (md:hidden)                          */}
      {/* ========================================================================= */}
      <div className="space-y-3.5 md:hidden">
        {filteredMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`bg-brand-white border rounded-2xl p-4 shadow-xs relative transition-all ${
              msg.status === "New" 
                ? "border-brand-green/40 bg-gradient-to-br from-brand-white to-brand-green/[0.03]" 
                : "border-brand-ash/60"
            }`}
          >
            {/* Header: Sender Avatar, Name, Email & Status */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div 
                className="flex items-center gap-2.5 min-w-0 pr-1 cursor-pointer"
                onClick={() => handleViewMessage(msg)}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-header uppercase text-xs shrink-0 border ${
                  msg.status === "New" 
                    ? "bg-brand-green text-brand-white border-brand-green" 
                    : "bg-brand-green/10 text-brand-green border-brand-green/20"
                }`}>
                  {msg.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm tracking-tight leading-snug truncate hover:text-brand-green transition-colors ${
                    msg.status === "New" ? "font-bold text-brand-dark" : "font-semibold text-brand-dark/90"
                  }`}>
                    {msg.name}
                  </h3>
                  <p className="text-brand-dark/60 text-[11px] font-medium truncate">
                    {msg.email}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                msg.status === "New" ? "bg-brand-green/15 text-brand-green border-brand-green/30" : 
                msg.status === "Replied" ? "bg-brand-orange/15 text-brand-orange border-brand-orange/30" : 
                "bg-brand-ash/40 text-brand-dark/70 border-brand-ash/70"
              }`}>
                {msg.status === "New" && <Mail className="w-2.5 h-2.5" />}
                {msg.status === "Read" && <MailOpen className="w-2.5 h-2.5" />}
                {msg.status === "Replied" && <Reply className="w-2.5 h-2.5" />}
                {msg.status}
              </span>
            </div>

            {/* Message Subject & Snippet */}
            <div 
              className="cursor-pointer mb-3 bg-brand-ash/15 rounded-xl p-2.5 border border-brand-ash/40"
              onClick={() => handleViewMessage(msg)}
            >
              <h4 className={`text-xs mb-0.5 tracking-tight leading-snug ${
                msg.status === "New" ? "font-bold text-brand-dark" : "font-semibold text-brand-dark/85"
              }`}>
                {msg.subject}
              </h4>
              <p className="text-brand-dark/70 text-[11px] line-clamp-2 leading-relaxed font-light">
                {msg.snippet}
              </p>
            </div>

            {/* Card Footer: Date & Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-brand-ash/40 text-xs">
              <span className="text-brand-dark/60 text-[11px] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-dark/50" /> {msg.date}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewMessage(msg)}
                  className="px-3 py-1 bg-brand-ash/30 text-brand-dark font-bold rounded-lg text-xs hover:bg-brand-ash/60 active:scale-95 transition-all cursor-pointer"
                >
                  Read
                </button>

                <button
                  onClick={() => toggleDropdown(msg.id)}
                  className="p-1.5 text-brand-dark/70 hover:text-brand-dark bg-brand-ash/20 rounded-lg active:scale-95 transition-all cursor-pointer"
                  aria-label="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Actions Dropdown Popover */}
            {activeDropdown === msg.id && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-brand-dark/30 backdrop-blur-2xs" 
                  onClick={() => setActiveDropdown(null)} 
                />
                
                <div className="absolute right-4 bottom-12 w-52 bg-brand-white border border-brand-ash/70 rounded-2xl shadow-xl z-50 py-2 flex flex-col text-left">
                  <button 
                    onClick={() => handleViewMessage(msg)} 
                    className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <MailOpen className="w-3.5 h-3.5 text-brand-dark/60" /> 
                    <span>View Full Message</span>
                  </button>
                  
                  <a 
                    href={`mailto:${msg.email}`} 
                    className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left"
                  >
                    <Reply className="w-3.5 h-3.5 text-brand-dark/60" /> 
                    <span>Reply via Email</span>
                  </a>
                  
                  <div className="h-px bg-brand-ash/40 my-1" />
                  
                  {msg.status !== "Replied" && (
                    <button 
                      onClick={() => handleMarkAsReplied(msg.id)} 
                      className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> 
                      <span>Mark as Replied</span>
                    </button>
                  )}

                  <div className="h-px bg-brand-ash/40 my-1" />
                  
                  <button 
                    onClick={() => handleDelete(msg.id)} 
                    className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" /> 
                    <span>Delete Message</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="bg-brand-white border border-brand-ash/60 rounded-2xl p-8 text-center text-brand-dark/60 text-xs sm:text-sm font-medium">
            No inquiries or messages found matching your filters.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW: Data Table (hidden md:block)                                */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-brand-white border border-brand-ash/60 rounded-2xl shadow-xs overflow-hidden min-h-[380px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ash/20 text-brand-dark/70 text-xs uppercase tracking-wider border-b border-brand-ash/60">
                <th className="px-6 py-4 font-bold">Sender</th>
                <th className="px-6 py-4 font-bold">Subject & Preview</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ash/40">
              {filteredMessages.map((msg) => (
                <tr 
                  key={msg.id} 
                  className={`hover:bg-brand-ash/5 transition-colors ${
                    msg.status === "New" ? "bg-brand-green/[0.04]" : ""
                  }`}
                >
                  
                  {/* Sender Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm sm:text-base text-brand-dark leading-snug ${
                      msg.status === "New" ? "font-bold" : "font-medium"
                    }`}>
                      {msg.name}
                    </p>
                    <a 
                      href={`mailto:${msg.email}`} 
                      className="text-brand-dark/60 text-xs sm:text-sm hover:text-brand-orange transition-colors font-medium"
                    >
                      {msg.email}
                    </a>
                  </td>

                  {/* Message Snippet Column */}
                  <td className="px-6 py-4 cursor-pointer max-w-md" onClick={() => handleViewMessage(msg)}>
                    <p className={`text-xs sm:text-sm text-brand-dark mb-0.5 tracking-tight leading-snug ${
                      msg.status === "New" ? "font-bold" : "font-semibold"
                    }`}>
                      {msg.subject}
                    </p>
                    <p className="text-brand-dark/65 text-xs line-clamp-1 leading-relaxed font-light">
                      {msg.snippet}
                    </p>
                  </td>

                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-brand-dark/70 text-xs sm:text-sm font-medium">
                      {msg.date}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border ${
                      msg.status === "New" ? "bg-brand-green/15 text-brand-green border-brand-green/30" : 
                      msg.status === "Replied" ? "bg-brand-orange/15 text-brand-orange border-brand-orange/30" : 
                      "bg-brand-ash/50 text-brand-dark/70 border-brand-ash/80"
                    }`}>
                      {msg.status === "New" && <Mail className="w-3 h-3 text-brand-green" />}
                      {msg.status === "Read" && <MailOpen className="w-3 h-3 text-brand-dark/60" />}
                      {msg.status === "Replied" && <Reply className="w-3 h-3 text-brand-orange" />}
                      {msg.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button 
                      onClick={() => toggleDropdown(msg.id)}
                      className="p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-ash/30 rounded-full active:scale-95 transition-all cursor-pointer"
                      aria-label="Open message actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {activeDropdown === msg.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-30 bg-transparent" 
                          onClick={() => setActiveDropdown(null)} 
                        />
                        
                        <div className="absolute right-8 top-12 w-48 bg-brand-white border border-brand-ash/70 rounded-xl shadow-lg z-40 py-2 flex flex-col text-left">
                          <button 
                            onClick={() => handleViewMessage(msg)} 
                            className="px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <MailOpen className="w-3.5 h-3.5 text-brand-dark/60" /> 
                            <span>View Full Message</span>
                          </button>
                          
                          <a 
                            href={`mailto:${msg.email}`} 
                            className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2"
                          >
                            <Reply className="w-3.5 h-3.5 text-brand-dark/60" /> 
                            <span>Reply via Email</span>
                          </a>
                          
                          <div className="h-px bg-brand-ash/40 my-1" />
                          
                          {msg.status !== "Replied" && (
                            <button 
                              onClick={() => handleMarkAsReplied(msg.id)} 
                              className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-ash/20 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> 
                              <span>Mark as Replied</span>
                            </button>
                          )}
                          
                          <div className="h-px bg-brand-ash/40 my-1" />

                          <button 
                            onClick={() => handleDelete(msg.id)} 
                            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" /> 
                            <span>Delete Message</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                  
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-brand-dark/50 text-xs sm:text-sm">
                    No messages found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW FULL MESSAGE MODAL                                                   */}
      {/* ========================================================================= */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto">
          <div 
            className="fixed inset-0" 
            onClick={() => setViewingMessage(null)} 
          />
          
          <div className="relative w-full max-w-2xl bg-brand-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-5 xs:p-6 sm:p-8 z-10 my-auto max-h-[calc(90vh-2rem)] overflow-y-auto no-scrollbar border border-brand-ash/60">
            
            {/* Close Button */}
            <button 
              onClick={() => setViewingMessage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-brand-ash/30 hover:bg-brand-ash/60 rounded-full transition-colors active:scale-95 shadow-xs cursor-pointer"
              aria-label="Close message modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark" />
            </button>
            
            {/* Subject Title */}
            <h2 className="font-header text-lg xs:text-xl sm:text-2xl font-bold text-brand-dark mb-4 sm:mb-6 pr-10 tracking-tight leading-snug">
              {viewingMessage.subject}
            </h2>
            
            {/* Sender Metadata Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 pb-5 border-b border-brand-ash/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-bold font-header uppercase text-base sm:text-lg shrink-0 shadow-xs">
                  {viewingMessage.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-sm sm:text-base leading-snug">
                    {viewingMessage.name}
                  </p>
                  <a 
                    href={`mailto:${viewingMessage.email}`} 
                    className="text-brand-dark/70 text-xs sm:text-sm hover:text-brand-orange transition-colors font-medium break-all"
                  >
                    {viewingMessage.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-brand-dark/60 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-orange" />
                <span>{viewingMessage.date}</span>
              </div>
            </div>

            {/* Message Body Content */}
            <div className="bg-brand-ash/10 border border-brand-ash/50 rounded-2xl p-4 sm:p-5 mb-6 text-brand-dark/85 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-sans">
              {viewingMessage.snippet}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-4 border-t border-brand-ash/60">
              <a 
                href={`mailto:${viewingMessage.email}`} 
                className="flex-1 bg-brand-dark text-brand-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs text-center"
              >
                <Reply className="w-4 h-4" /> 
                <span>Reply via Email</span>
              </a>

              {viewingMessage.status !== "Replied" && (
                <button 
                  onClick={() => {
                    handleMarkAsReplied(viewingMessage.id);
                    setViewingMessage(null);
                  }}
                  className="flex-1 bg-brand-green text-brand-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-orange active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs text-center cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> 
                  <span>Mark as Replied</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
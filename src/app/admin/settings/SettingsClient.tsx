"use client";

import { useState } from "react";
import { 
  Save, User, Lock, Bell, Globe, 
  Check, ShieldCheck, Sliders, CheckCircle2, 
  Camera, Sparkles, KeyRound
} from "lucide-react";
import { AdminProfile, SystemPreferences, updateProfile, updatePreferences } from "./actions";

type SettingsClientProps = {
  initialProfile: AdminProfile;
  initialPreferences: SystemPreferences;
};

type SettingsTab = "profile" | "preferences" | "security" | "notifications";

export default function SettingsClient({ initialProfile, initialPreferences }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // State for Profile Form
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // State for Preferences Form
  const [preferences, setPreferences] = useState<SystemPreferences>(initialPreferences);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaved(false);
    
    await updateProfile(profile);
    
    setIsSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3500);
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    setPrefsSaved(false);
    
    await updatePreferences(preferences);
    
    setIsSavingPrefs(false);
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Alerts", icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-14 sm:pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-header text-2xl xs:text-3xl font-bold text-brand-dark mb-1 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-brand-dark/70 text-xs sm:text-sm">
            Manage your administrator profile, security credentials, and system parameters.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE TAB SELECTOR STRIP (md:hidden)                                     */}
      {/* ========================================================================= */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                isActive
                  ? "bg-brand-dark text-brand-white border-brand-dark shadow-xs"
                  : "bg-brand-white text-brand-dark/70 border-brand-ash/70 hover:bg-brand-ash/30"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-orange" : "text-brand-dark/50"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MAIN SETTINGS LAYOUT (DESKTOP SIDEBAR + CONTENT PANELS)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Desktop Sidebar Navigation (hidden on mobile) */}
        <aside className="hidden md:block md:col-span-4 bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs shrink-0 space-y-1.5">
          <div className="px-2 pb-2 mb-2 border-b border-brand-ash/40">
            <h3 className="font-header font-bold text-brand-dark text-xs uppercase tracking-wider">
              Settings Navigation
            </h3>
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer border ${
                  isActive
                    ? "bg-brand-green/10 border-brand-green/30 text-brand-green shadow-2xs"
                    : "bg-transparent border-transparent text-brand-dark/70 hover:bg-brand-ash/20 hover:text-brand-dark"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-green" : "text-brand-dark/50"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Panels Area */}
        <div className="md:col-span-8 space-y-6 sm:space-y-8">
          
          {/* ===================================================================== */}
          {/* TAB 1: PROFILE DETAILS                                                */}
          {/* ===================================================================== */}
          {(activeTab === "profile" || typeof window === "undefined") && (
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-brand-green shrink-0" />
                <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                  Admin Profile Details
                </h2>
              </div>
              <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 font-medium">
                Update your identity details and primary contact address.
              </p>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleProfileSubmit}>
                
                {/* Avatar Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-brand-ash/15 border border-brand-ash/50">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green/15 border-2 border-brand-green text-brand-green flex items-center justify-center font-bold font-header text-xl sm:text-2xl uppercase shrink-0 shadow-xs">
                    {profile.firstName?.charAt(0) || "A"}{profile.lastName?.charAt(0) || "D"}
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <p className="font-bold text-brand-dark text-xs sm:text-sm">Profile Avatar</p>
                    <p className="text-brand-dark/60 text-[11px] sm:text-xs">
                      Avatar initials are automatically generated from your name.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="sm:ml-auto px-4 py-2 bg-brand-white border border-brand-ash/70 text-brand-dark text-xs font-bold rounded-xl hover:bg-brand-ash/30 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                      First Name <span className="text-brand-orange">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                      Last Name <span className="text-brand-orange">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                      Email Address <span className="text-brand-orange">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                      required
                    />
                  </div>
                </div>

                {/* Profile Submit Button */}
                <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-3 pt-4 border-t border-brand-ash/50">
                  {profileSaved && (
                    <span className="text-xs sm:text-sm font-bold text-brand-green flex items-center justify-center gap-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-2 rounded-xl animate-fade-in text-center">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" /> 
                      <span>Profile Changes Saved!</span>
                    </span>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSavingProfile}
                    className="w-full xs:w-auto bg-brand-green text-brand-white px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-brand-glow disabled:opacity-50 cursor-pointer text-center"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>{isSavingProfile ? "Saving Profile..." : "Save Profile"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: SYSTEM PREFERENCES                                             */}
          {/* ===================================================================== */}
          {(activeTab === "preferences" || typeof window === "undefined") && (
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-brand-green shrink-0" />
                <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                  System Preferences
                </h2>
              </div>
              <p className="text-brand-dark/70 text-xs sm:text-sm mb-6 font-medium">
                Configure vacancy lifespans and automated administrative preferences.
              </p>

              <form className="space-y-5 sm:space-y-6" onSubmit={handlePreferencesSubmit}>
                
                {/* Default Job Expiry */}
                <div>
                  <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Default Job Expiry Window
                  </label>
                  <select 
                    value={preferences.defaultJobExpiry}
                    onChange={(e) => setPreferences({ ...preferences, defaultJobExpiry: Number(e.target.value) })}
                    className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
                  >
                    <option value={7}>7 Days (Short Cycle)</option>
                    <option value={14}>14 Days (Standard Duration)</option>
                    <option value={30}>30 Days (Extended Duration)</option>
                  </select>
                  <p className="text-[11px] sm:text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-medium">
                    Standard duration a job listing remains publicly accessible before auto-closing.
                  </p>
                </div>

                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between gap-4 p-4 border border-brand-ash/70 rounded-2xl bg-brand-ash/15">
                  <div>
                    <h4 className="font-bold text-brand-dark text-xs sm:text-sm mb-0.5">
                      New Submission Email Alerts
                    </h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/60 leading-relaxed font-medium">
                      Receive immediate notification when a candidate or employer submits a request.
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-brand-ash/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green shadow-2xs"></div>
                  </label>
                </div>

                {/* Preferences Submit Button */}
                <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-3 pt-4 border-t border-brand-ash/50">
                  {prefsSaved && (
                    <span className="text-xs sm:text-sm font-bold text-brand-green flex items-center justify-center gap-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-2 rounded-xl animate-fade-in text-center">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" /> 
                      <span>Preferences Saved!</span>
                    </span>
                  )}

                  <button 
                    type="submit"
                    disabled={isSavingPrefs}
                    className="w-full xs:w-auto bg-brand-dark text-brand-white px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer text-center"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>{isSavingPrefs ? "Saving Preferences..." : "Save Preferences"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: SECURITY CONTROLS                                              */}
          {/* ===================================================================== */}
          {activeTab === "security" && (
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-brand-orange shrink-0" />
                <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                  Security & Access Passcode
                </h2>
              </div>
              <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
                Update the master administrator passcode guarding the control center.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Current Passcode
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    New Secure Passcode
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-ash/50 flex justify-end">
                <button 
                  type="button" 
                  className="w-full xs:w-auto bg-brand-green text-brand-white px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand-orange active:scale-95 transition-all flex items-center justify-center gap-2 shadow-brand-glow cursor-pointer text-center"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update Passcode</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: NOTIFICATIONS SETUP                                            */}
          {/* ===================================================================== */}
          {activeTab === "notifications" && (
            <div className="bg-brand-white border border-brand-ash/60 rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-brand-green shrink-0" />
                <h2 className="font-header text-lg sm:text-xl font-bold text-brand-dark tracking-tight">
                  Notification Channels
                </h2>
              </div>
              <p className="text-brand-dark/70 text-xs sm:text-sm font-medium">
                Manage how system alerts, job applications, and inquiries reach you.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-brand-ash/70 rounded-2xl bg-brand-ash/15">
                  <div>
                    <h4 className="font-bold text-brand-dark text-xs sm:text-sm">Candidate Applications</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/60 font-medium">
                      Notify immediately when a graduate applies via job codes.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-green focus:ring-brand-green/30 accent-brand-green cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-4 border border-brand-ash/70 rounded-2xl bg-brand-ash/15">
                  <div>
                    <h4 className="font-bold text-brand-dark text-xs sm:text-sm">Employer Outsource Requests</h4>
                    <p className="text-[11px] sm:text-xs text-brand-dark/60 font-medium">
                      Notify when a company requests hiring or outsourcing support.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-green focus:ring-brand-green/30 accent-brand-green cursor-pointer" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
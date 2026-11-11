"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { 
  Lock, ArrowRight, ShieldCheck, Eye, EyeOff, 
  ArrowLeft, AlertCircle 
} from "lucide-react";
import { adminLogin } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-brand-green text-brand-white py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-98 transition-all flex items-center justify-center gap-2 shadow-brand-glow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
    >
      <span>{pending ? "Authenticating..." : "Access Control Center"}</span>
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient Lighting Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-brand-green/10 rounded-full blur-[90px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-48 sm:w-64 h-48 sm:h-64 bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none -z-0" />

      {/* Back to Public Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-brand-white/60 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1 px-3 rounded-lg bg-brand-white/5 border border-brand-white/10 hover:bg-brand-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-brand-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 xs:p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative z-10 border border-brand-ash/60 my-auto">
        
        {/* Header Branding */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green/10 text-brand-green mb-2 shadow-xs border border-brand-green/20">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-header text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              Talent<span className="text-brand-green">Core</span>
            </span>
            <span className="bg-brand-green/10 border border-brand-green/25 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin
            </span>
          </div>
          
          <p className="text-brand-dark/70 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            Enter your secure administrator passcode to manage the platform.
          </p>
        </div>

        {/* Login Form */}
        <form action={formAction} className="space-y-4 sm:space-y-6">
          <div>
            <label 
              htmlFor="admin-passcode"
              className="block text-brand-dark text-xs sm:text-sm font-bold mb-1.5 sm:mb-2"
            >
              Admin Passcode
            </label>
            
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-brand-dark/50 pointer-events-none" />
              
              <input 
                id="admin-passcode"
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••••••" 
                autoComplete="current-password"
                autoFocus
                className="w-full bg-brand-ash/20 border border-brand-ash/70 rounded-xl pl-10 sm:pl-12 pr-11 py-3 sm:py-3.5 text-xs sm:text-sm text-brand-dark font-mono placeholder:font-sans placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                required
              />

              {/* Password Visibility Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-brand-dark/50 hover:text-brand-dark rounded-lg transition-colors active:scale-95"
                aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {state?.error && (
            <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm font-semibold bg-red-50 p-3.5 rounded-xl border border-red-200 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <SubmitButton />
        </form>

      </div>
      
      {/* Footer System Tag */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-[11px] text-brand-white/40 font-medium">
          TalentCore Internal Administration • Restricted Access
        </p>
      </div>

    </div>
  );
}
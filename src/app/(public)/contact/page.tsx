"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { submitContactMessage } from "./actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitContactMessage(formData);
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-white pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-brand-dark/70 hover:text-brand-green active:scale-95 transition-all text-xs sm:text-sm font-medium py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark/70" /> 
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Header & Direct Contact Channels */}
          <div className="lg:col-span-5 xl:col-span-5 max-w-xl">
            <span className="inline-block py-1 px-2.5 sm:px-3 rounded-md bg-brand-green/10 text-brand-green text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4 border border-brand-green/20">
              Get in Touch
            </span>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-header text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark leading-tight sm:leading-[1.1] mb-3 sm:mb-4 tracking-tight"
            >
              Contact Us
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-brand-dark/75 text-xs xs:text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 font-light"
            >
              Let us know how we can help below or reach out via email directly. Our team is always ready to assist you.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3.5 sm:space-y-4"
            >
              {/* Email Block */}
              <div className="flex items-start gap-3.5 sm:gap-4 p-4 xs:p-5 sm:p-6 bg-brand-ash/20 border border-brand-ash/60 rounded-2xl sm:rounded-3xl hover:border-brand-green/40 transition-all shadow-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-white shadow-xs flex items-center justify-center shrink-0 text-brand-green">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-0.5 sm:mb-1">
                    Email Us
                  </h3>
                  <a 
                    href="mailto:contact@talentcore.local" 
                    className="text-brand-dark/75 text-xs sm:text-sm hover:text-brand-orange active:scale-98 transition-colors break-all font-medium"
                  >
                    contact@talentcore.local
                  </a>
                </div>
              </div>

              {/* Direct Support Block */}
              <div className="flex items-start gap-3.5 sm:gap-4 p-4 xs:p-5 sm:p-6 bg-brand-ash/20 border border-brand-ash/60 rounded-2xl sm:rounded-3xl hover:border-brand-orange/40 transition-all shadow-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-white shadow-xs flex items-center justify-center shrink-0 text-brand-orange">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-header text-base sm:text-lg font-bold text-brand-dark mb-0.5 sm:mb-1">
                    Direct Support
                  </h3>
                  <a 
                    href="tel:+15550000000" 
                    className="text-brand-dark/75 text-xs sm:text-sm hover:text-brand-green active:scale-98 transition-colors font-medium"
                  >
                    +1 (555) 000-0000
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-7 xl:col-span-7 bg-brand-dark rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-brand-glow relative overflow-hidden w-full"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-brand-green/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-0 w-56 sm:w-64 h-56 sm:h-64 bg-brand-orange/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none -z-0" />

            {isSuccess ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-brand-green mb-4" />
                <h3 className="font-header text-2xl font-bold text-brand-white mb-2">Message Sent!</h3>
                <p className="text-brand-white/70 text-sm max-w-sm">
                  Thank you for reaching out. Our team has received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-brand-green text-sm font-bold hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="relative z-10 flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl text-center font-bold">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-brand-white/85 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-brand-white/5 border border-brand-white/15 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-brand-white/85 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-brand-white/5 border border-brand-white/15 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-brand-white/85 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                    How can we help?
                  </label>
                  <textarea 
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your hiring needs or general inquiry..."
                    className="w-full bg-brand-white/5 border border-brand-white/15 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-none leading-relaxed"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-green text-brand-white py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm md:text-base font-bold hover:bg-brand-orange active:scale-98 transition-all flex items-center justify-center gap-2 group mt-2 shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Sending...</span></>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </main>
  );
}
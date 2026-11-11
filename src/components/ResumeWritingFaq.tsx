"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function ResumeWritingFaq({ faqs }: { faqs: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-brand-ash/60 rounded-2xl overflow-hidden bg-brand-white shadow-sm">
          <button 
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-ash/10 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-brand-dark pr-4">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-brand-dark/50 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="p-6 pt-0 text-brand-dark/70 text-sm leading-relaxed border-t border-brand-ash/20 mt-2">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
"use client";

import { motion } from "framer-motion";

const CLIENTS = ["Enterprise Partners", "Global Startups", "Technology Studios", "Growth Ventures"];

// Repeat list to maintain a seamless continuous loop
const SCROLL_ITEMS = [
  ...CLIENTS,
  ...CLIENTS,
  ...CLIENTS,
  ...CLIENTS,
];

// Brand Hex Colors
const BRAND_COLORS = ["#0F172A", "#2563EB", "#475569", "#0F172A"];

export default function TrustBanner() {
  return (
    <section className="py-6 sm:py-8 md:py-12 overflow-hidden bg-brand-white border-y border-brand-ash/40 flex flex-col justify-center select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-4 sm:mb-6 md:mb-8 w-full">
        <h3 className="font-header text-[10px] xs:text-xs font-bold uppercase tracking-wider text-brand-dark/50 text-center">
          Trusted by Growing Teams & Companies
        </h3>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex items-center whitespace-nowrap gap-10 sm:gap-16 md:gap-20 px-4 sm:px-8 min-w-max will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {SCROLL_ITEMS.map((client, i) => (
            <motion.span
              key={i}
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-header font-bold cursor-default tracking-tight"
              animate={{
                color: BRAND_COLORS,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            >
              {client}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
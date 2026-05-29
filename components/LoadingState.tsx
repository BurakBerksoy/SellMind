"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { UI_TEXT } from "@/lib/constants";

/** Gemini yanıtı beklenirken gösterilen animasyonlu iskelet. */
export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {/* Başlık + animasyonlu noktalar */}
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600"
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </motion.span>
        <div>
          <p className="flex items-center font-medium text-slate-800">
            {UI_TEXT.loadingTitle}
            <AnimatedDots />
          </p>
          <p className="text-xs text-slate-500">{UI_TEXT.loadingHint}</p>
        </div>
      </div>

      {/* Üç shimmer kart */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((col) => (
          <div key={col} className="rounded-2xl border border-slate-200 bg-white p-5">
            <Shimmer className="mb-4 h-7 w-2/3 rounded-lg" />
            <div className="space-y-2.5">
              {[0, 1, 2].map((row) => (
                <Shimmer key={row} className="h-3.5 rounded" style={{ width: `${90 - row * 12}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedDots() {
  return (
    <span className="ml-0.5 inline-flex">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

function Shimmer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`} style={style}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

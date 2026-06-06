"use client";

import { motion } from "framer-motion";
import { Link2, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/constants";

// İkon adını (constants'tan gelen metin) gerçek bileşene çevirir.
const ICONS: Record<string, LucideIcon> = { Link2, Sparkles, TrendingUp };

/** "Nasıl Çalışır?" — kullanıcı yolculuğunu 3 adımda anlatan bölüm. */
export function HowItWorks() {
  return (
    <section className="mt-20 text-center" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
        {HOW_IT_WORKS.title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{HOW_IT_WORKS.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {HOW_IT_WORKS.steps.map((step, index) => {
          const Icon = ICONS[step.icon] ?? Sparkles;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 shadow-sm">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-600">{step.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

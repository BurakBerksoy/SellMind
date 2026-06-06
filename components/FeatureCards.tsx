"use client";

import { motion } from "framer-motion";
import { Zap, Search, Target, ShoppingBag, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = { Zap, Search, Target, ShoppingBag };

/** "Neden SellMind?" — değer önerisini pazarlama kartlarıyla anlatan bölüm. */
export function FeatureCards() {
  return (
    <section className="mt-20 text-center" aria-labelledby="features-title">
      <h2 id="features-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
        {FEATURES.title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{FEATURES.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.items.map((feature, index) => {
          const Icon = ICONS[feature.icon] ?? Zap;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
            >
              <Card className="h-full text-left transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-800">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICING } from "@/lib/constants";

/**
 * Statik fiyatlandırma bölümü. Gerçek ödeme YOK (CLAUDE.md — kapsam dışı);
 * amaç komisyona iş modelinin (Freemium + abonelik) düşünüldüğünü göstermek.
 */
export function Pricing() {
  return (
    <section className="mt-20 text-center" aria-labelledby="pricing-title">
      <div className="flex flex-col items-center gap-2">
        <h2 id="pricing-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {PRICING.title}
        </h2>
        <Badge className="border-amber-200 bg-amber-50 text-amber-700">{PRICING.demoBadge}</Badge>
      </div>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{PRICING.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PRICING.plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card
              className={`flex h-full flex-col p-6 text-left ${
                plan.highlighted ? "border-brand-300 ring-2 ring-brand-200" : ""
              }`}
            >
              {plan.highlighted && (
                <Badge className="mb-3 self-start">En Popüler</Badge>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className="mt-6 w-full"
                disabled
                aria-label={`${plan.cta} (demo — yakında)`}
              >
                {plan.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

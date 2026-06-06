"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TAGLINE_INTERVAL_MS = 3200;

/** Sayfa ilk açıldığında çalışan animasyonlu karşılama bölümü. */
export function Hero() {
  const taglines = UI_TEXT.heroTaglines;
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTagIndex((i) => (i + 1) % taglines.length);
    }, TAGLINE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [taglines.length]);

  return (
    <motion.header variants={container} initial="hidden" animate="show" className="mb-10 text-center">
      <motion.div variants={item}>
        <Badge className="mx-auto mb-5">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {UI_TEXT.heroBadge}
        </Badge>
      </motion.div>

      {/* Değer önerisi (value proposition) başlığı */}
      <motion.h1
        variants={item}
        className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl"
      >
        {UI_TEXT.heroHeadlineLead}{" "}
        <span className="bg-gradient-to-r from-brand-500 via-fuchsia-500 to-brand-700 bg-clip-text text-transparent">
          {UI_TEXT.heroHeadlineHighlight}
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600"
      >
        {UI_TEXT.heroSubtitle}
      </motion.p>

      {/* Dönen alt-başlık (ürünün ne yaptığını döngüyle anlatır) */}
      <motion.div variants={item} className="mx-auto mt-3 flex h-8 max-w-xl items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={tagIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-brand-600"
          >
            {taglines[tagIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}

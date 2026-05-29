"use client";

import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Lightbulb, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

interface CardConfig {
  key: "strengths" | "weaknesses" | "suggestions";
  title: string;
  icon: LucideIcon;
  accentText: string;
  accentBg: string;
  border: string;
  marker: string;
}

const CARD_CONFIGS: CardConfig[] = [
  {
    key: "strengths",
    title: UI_TEXT.strengthsTitle,
    icon: ThumbsUp,
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    border: "border-emerald-200",
    marker: "bg-emerald-500",
  },
  {
    key: "weaknesses",
    title: UI_TEXT.weaknessesTitle,
    icon: ThumbsDown,
    accentText: "text-rose-700",
    accentBg: "bg-rose-50",
    border: "border-rose-200",
    marker: "bg-rose-500",
  },
  {
    key: "suggestions",
    title: UI_TEXT.suggestionsTitle,
    icon: Lightbulb,
    accentText: "text-brand-700",
    accentBg: "bg-brand-50",
    border: "border-brand-200",
    marker: "bg-brand-500",
  },
];

interface ResultCardsProps {
  result: AnalysisResult;
}

export function ResultCards({ result }: ResultCardsProps) {
  return (
    <div className="space-y-4">
      {(result.summary || typeof result.score === "number") && (
        <ScoreSummary score={result.score} summary={result.summary} />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CARD_CONFIGS.map((config, index) => {
          const items = result[config.key];
          const Icon = config.icon;
          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.12, ease: "easeOut" }}
            >
              <Card className={config.border}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${config.accentText}`}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.accentBg}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {config.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length > 0 ? (
                    <ul className="space-y-2.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.marker}`} aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">Bu bölüm için madde bulunamadı.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function scoreColor(score: number): { bar: string; text: string } {
  if (score >= 70) return { bar: "bg-emerald-500", text: "text-emerald-600" };
  if (score >= 40) return { bar: "bg-amber-500", text: "text-amber-600" };
  return { bar: "bg-rose-500", text: "text-rose-600" };
}

function ScoreSummary({ score, summary }: { score?: number; summary?: string }) {
  const hasScore = typeof score === "number";
  const colors = hasScore ? scoreColor(score) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {hasScore && colors && (
          <div className="shrink-0">
            <div className="mb-1 flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${colors.text}`}>{score}</span>
              <span className="text-sm text-slate-400">/100</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {UI_TEXT.scoreLabel}
            </span>
            <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${colors.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {summary && (
          <p className="text-sm leading-relaxed text-slate-700 sm:border-l sm:border-slate-200 sm:pl-4">
            {summary}
          </p>
        )}
      </div>
    </motion.div>
  );
}

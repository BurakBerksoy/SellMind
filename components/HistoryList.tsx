"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ImageOff } from "lucide-react";
import { UI_TEXT } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/history";

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryList({ entries, onSelect, onClear }: HistoryListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <History className="h-4 w-4 text-brand-500" aria-hidden="true" />
          {UI_TEXT.historyTitle}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-slate-400 transition hover:text-rose-500"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          {UI_TEXT.historyClear}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-brand-300 hover:shadow-sm"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImageOff className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{entry.title}</p>
                {typeof entry.score === "number" && (
                  <p className="text-xs text-slate-400">{UI_TEXT.scoreLabel}: {entry.score}/100</p>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

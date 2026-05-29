"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertCircle, Wand2, Eraser, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultCards } from "@/components/ResultCards";
import { ProductPreviewCard } from "@/components/ProductPreviewCard";
import { LoadingState } from "@/components/LoadingState";
import { HistoryList } from "@/components/HistoryList";
import { UI_TEXT, FRIENDLY_MESSAGES, SAMPLE_PRODUCT_URL } from "@/lib/constants";
import { loadHistory, saveHistoryEntry, clearHistory, type HistoryEntry } from "@/lib/history";
import { resultToText } from "@/lib/formatResult";
import type { AnalysisResult, AnalyzeResponse, ProductPreview } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export function AnalyzeForm() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<ProductPreview | null>(null);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);

  // Geçmişi tarayıcıda yükle (yalnızca istemcide).
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage(FRIENDLY_MESSAGES.empty);
      return;
    }

    setStatus("loading");
    setResult(null);
    setPreview(null);
    setMessage("");
    setCopied(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });
      const data = (await res.json()) as AnalyzeResponse;

      if (data.ok) {
        setResult(data.result);
        setPreview(data.preview);
        setStatus("success");
        setHistory(saveHistoryEntry(toHistoryEntry(trimmed, data.result, data.preview)));
      } else {
        setMessage(FRIENDLY_MESSAGES[data.reason] ?? FRIENDLY_MESSAGES["ai-error"]);
        setStatus("error");
      }
    } catch {
      setMessage(FRIENDLY_MESSAGES["ai-error"]);
      setStatus("error");
    }
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setPreview(null);
    setMessage("");
    setStatus("idle");
    setCopied(false);
  }

  function handleSelectHistory(entry: HistoryEntry) {
    setInput(entry.input);
    setResult(entry.result);
    setPreview(entry.preview);
    setStatus("success");
    setMessage("");
    setCopied(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(resultToText(result, preview));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano erişimi yoksa sessizce geç.
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="product-input" className="block text-sm font-medium text-slate-700">
          {UI_TEXT.inputLabel}
        </label>
        <textarea
          id="product-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={UI_TEXT.inputPlaceholder}
          rows={3}
          disabled={isLoading}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:opacity-60"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="lg" disabled={isLoading} className="flex-1 sm:flex-none">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {UI_TEXT.analyzingButton}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {UI_TEXT.analyzeButton}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isLoading}
            onClick={() => setInput(SAMPLE_PRODUCT_URL)}
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            {UI_TEXT.sampleButton}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={isLoading || (!input && !result)}
            onClick={handleClear}
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            {UI_TEXT.clearButton}
          </Button>
        </div>
      </form>

      <div className="mt-8" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === "loading" && <LoadingState key="loading" />}

          {status === "error" && message && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === "success" && result && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {preview && <ProductPreviewCard preview={preview} />}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">{UI_TEXT.resultsTitle}</h2>
                <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {UI_TEXT.copiedButton}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      {UI_TEXT.copyButton}
                    </>
                  )}
                </Button>
              </div>
              <ResultCards result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HistoryList entries={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />
    </div>
  );
}

/** Bir analiz sonucundan geçmiş kaydı üretir. */
function toHistoryEntry(
  input: string,
  result: AnalysisResult,
  preview: ProductPreview | null,
): HistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    input,
    title: preview?.title ?? (input.length > 60 ? `${input.slice(0, 60)}…` : input),
    image: preview?.image,
    score: result.score,
    result,
    preview,
    createdAt: Date.now(),
  };
}

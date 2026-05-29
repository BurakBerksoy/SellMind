import { HISTORY_STORAGE_KEY, HISTORY_LIMIT } from "./constants";
import type { AnalysisResult, ProductPreview } from "./types";

/** Geçmişte saklanan tek bir analiz kaydı (tarayıcıda localStorage'da). */
export interface HistoryEntry {
  id: string;
  input: string;
  title: string;
  image?: string;
  score?: number;
  result: AnalysisResult;
  preview: ProductPreview | null;
  createdAt: number;
}

/** Geçmişi localStorage'dan güvenle okur. */
export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

/** Yeni kaydı başa ekler (aynı girdiyi tekilleştirir), sınırı uygular, kaydeder. */
export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const current = loadHistory().filter((e) => e.input !== entry.input);
  const next = [entry, ...current].slice(0, HISTORY_LIMIT);
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Kota dolu vb. — sessizce geç.
  }
  return next;
}

/** Geçmişi tamamen siler. */
export function clearHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // yok say
  }
}

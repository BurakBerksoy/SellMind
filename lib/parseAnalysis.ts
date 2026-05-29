import type { AnalysisResult } from "./types";
import { MAX_SUGGESTIONS } from "./constants";

/** Bir değeri temiz bir string dizisine çevirir (boşları atar, kırpar). */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

/**
 * Modelden gelen ham metinden JSON gövdesini ayıklar.
 * Kod bloğu (```json ... ```) veya etrafında metin olsa bile { ... } kısmını çeker.
 */
function extractJsonBlock(raw: string): string | null {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  return candidate.slice(start, end + 1);
}

/**
 * Gemini çıktısını güvenle AnalysisResult'a çevirir.
 * Geçersiz/bozuk JSON'da çökmek yerine null döner (çağıran yedek mesaja düşer).
 */
export function parseAnalysis(
  raw: string | null | undefined,
  maxSuggestions: number = MAX_SUGGESTIONS,
): AnalysisResult | null {
  if (!raw) return null;

  const jsonText = extractJsonBlock(raw);
  if (!jsonText) return null;

  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return null;
  }

  if (typeof data !== "object" || data === null) return null;

  const obj = data as Record<string, unknown>;
  const strengths = toStringArray(obj.strengths);
  const weaknesses = toStringArray(obj.weaknesses);
  const suggestions = toStringArray(obj.suggestions).slice(0, maxSuggestions);

  // En az bir bölümde içerik yoksa anlamlı bir sonuç değildir.
  if (strengths.length === 0 && weaknesses.length === 0 && suggestions.length === 0) {
    return null;
  }

  const summary = typeof obj.summary === "string" && obj.summary.trim().length > 0
    ? obj.summary.trim()
    : undefined;
  const score = toScore(obj.score);

  return { summary, score, strengths, weaknesses, suggestions };
}

/** Puanı güvenle 0-100 aralığına çeker; geçersizse undefined. */
function toScore(value: unknown): number | undefined {
  const num = typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : NaN;
  if (!Number.isFinite(num)) return undefined;
  return Math.max(0, Math.min(100, Math.round(num)));
}

import { UI_TEXT } from "./constants";
import type { AnalysisResult, ProductPreview } from "./types";

/** Analiz sonucunu panoya kopyalanacak düz metne çevirir. */
export function resultToText(result: AnalysisResult, preview: ProductPreview | null): string {
  const lines: string[] = [];

  if (preview?.title) lines.push(preview.title);
  if (typeof result.score === "number") lines.push(`${UI_TEXT.scoreLabel}: ${result.score}/100`);
  if (result.summary) lines.push(result.summary);
  lines.push("");

  appendSection(lines, UI_TEXT.strengthsTitle, result.strengths);
  appendSection(lines, UI_TEXT.weaknessesTitle, result.weaknesses);
  appendSection(lines, UI_TEXT.suggestionsTitle, result.suggestions);

  lines.push("— SellMind ile analiz edildi");
  return lines.join("\n").trim();
}

function appendSection(lines: string[], title: string, items: string[]): void {
  if (items.length === 0) return;
  lines.push(`${title}:`);
  for (const item of items) lines.push(`• ${item}`);
  lines.push("");
}

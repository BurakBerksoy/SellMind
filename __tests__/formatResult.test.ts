import { describe, it, expect } from "vitest";
import { resultToText } from "@/lib/formatResult";
import type { AnalysisResult } from "@/lib/types";

const result: AnalysisResult = {
  summary: "Rekabetçi bir kulaklık.",
  score: 72,
  strengths: ["Uzun pil ömrü"],
  weaknesses: ["Az yorum"],
  suggestions: ["Görselleri zenginleştir"],
};

describe("resultToText", () => {
  it("başlık, puan, özet ve bölümleri düz metne dökerek üretir", () => {
    const text = resultToText(result, {
      url: "https://x",
      title: "Test Kulaklık",
      images: [],
      attributes: [],
    });
    expect(text).toContain("Test Kulaklık");
    expect(text).toContain("Satış Potansiyeli: 72/100");
    expect(text).toContain("Rekabetçi bir kulaklık.");
    expect(text).toContain("• Uzun pil ömrü");
    expect(text).toContain("• Görselleri zenginleştir");
  });

  it("önizleme olmadan da çalışır", () => {
    const text = resultToText(result, null);
    expect(text).toContain("Güçlü Yönler:");
    expect(text).toContain("SellMind");
  });
});

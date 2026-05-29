import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCards } from "@/components/ResultCards";
import { UI_TEXT } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

const sample: AnalysisResult = {
  strengths: ["Hızlı kargo", "Kaliteli paketleme"],
  weaknesses: ["Fiyat biraz yüksek"],
  suggestions: ["Açıklamayı zenginleştir", "Video ekle"],
};

describe("ResultCards", () => {
  it("üç başlığı (güçlü/zayıf/öneri) da render eder", () => {
    render(<ResultCards result={sample} />);
    expect(screen.getByText(UI_TEXT.strengthsTitle)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.weaknessesTitle)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.suggestionsTitle)).toBeInTheDocument();
  });

  it("her bölümün maddelerini gösterir", () => {
    render(<ResultCards result={sample} />);
    expect(screen.getByText("Hızlı kargo")).toBeInTheDocument();
    expect(screen.getByText("Fiyat biraz yüksek")).toBeInTheDocument();
    expect(screen.getByText("Video ekle")).toBeInTheDocument();
  });
});

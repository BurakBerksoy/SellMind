import { describe, it, expect } from "vitest";
import { parseAnalysis } from "@/lib/parseAnalysis";

describe("parseAnalysis", () => {
  it("geçerli düz JSON'u doğru ayrıştırır", () => {
    const raw = JSON.stringify({
      strengths: ["Hızlı kargo", "Uygun fiyat"],
      weaknesses: ["Az yorum"],
      suggestions: ["Daha fazla fotoğraf ekle"],
    });
    const result = parseAnalysis(raw);
    expect(result).toEqual({
      strengths: ["Hızlı kargo", "Uygun fiyat"],
      weaknesses: ["Az yorum"],
      suggestions: ["Daha fazla fotoğraf ekle"],
    });
  });

  it("kod bloğu (```json) içine gömülü JSON'u ayıklar", () => {
    const raw = "İşte analiz:\n```json\n{\"strengths\":[\"İyi\"],\"weaknesses\":[],\"suggestions\":[]}\n```";
    const result = parseAnalysis(raw);
    expect(result?.strengths).toEqual(["İyi"]);
  });

  it("önerileri en fazla sınıra göre kırpar", () => {
    const raw = JSON.stringify({
      strengths: [],
      weaknesses: [],
      suggestions: ["1", "2", "3", "4", "5"],
    });
    const result = parseAnalysis(raw, 3);
    expect(result?.suggestions).toEqual(["1", "2", "3"]);
  });

  it("özet ve puanı ayrıştırır, puanı 0-100 aralığına sıkıştırır", () => {
    const raw = JSON.stringify({
      summary: "Rekabetçi bir ürün.",
      score: 150,
      strengths: ["İyi"],
      weaknesses: [],
      suggestions: [],
    });
    const result = parseAnalysis(raw);
    expect(result?.summary).toBe("Rekabetçi bir ürün.");
    expect(result?.score).toBe(100);
  });

  it("puan yoksa undefined bırakır", () => {
    const raw = JSON.stringify({ strengths: ["İyi"], weaknesses: [], suggestions: [] });
    const result = parseAnalysis(raw);
    expect(result?.score).toBeUndefined();
  });

  it("bozuk JSON'da çökmeden null döner", () => {
    expect(parseAnalysis("{ bu gecerli json degil ")).toBeNull();
  });

  it("boş/eksik girişte null döner", () => {
    expect(parseAnalysis("")).toBeNull();
    expect(parseAnalysis(null)).toBeNull();
    expect(parseAnalysis(undefined)).toBeNull();
  });

  it("üç bölüm de boşsa null döner", () => {
    const raw = JSON.stringify({ strengths: [], weaknesses: [], suggestions: [] });
    expect(parseAnalysis(raw)).toBeNull();
  });
});

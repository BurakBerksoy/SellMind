import "server-only";
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "./types";
import { GEMINI_MODEL, MAX_SUGGESTIONS } from "./constants";
import { parseAnalysis } from "./parseAnalysis";

/**
 * Yapay zeka sağlayıcısı arkasındaki TEK fonksiyon (Dependency Inversion — CLAUDE.md md.8).
 * Sağlayıcı ileride değişse bu imza (string girer, AnalysisResult | null çıkar) sabit kalır.
 *
 * - Yalnızca sunucu tarafında çalışır ("server-only").
 * - Anahtar yoksa veya analiz başarısızsa CÖKMEZ; null döner.
 * - Katı JSON ister; başarısız ayrıştırmada bir kez daha dener.
 */
export async function analyzeProduct(productInput: string): Promise<AnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(productInput);

  // İlk deneme + bozuk JSON / geçici hata olursa bir tekrar (toplam 2 deneme).
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = parseAnalysis(response.text, MAX_SUGGESTIONS);
      if (parsed) return parsed;
    } catch {
      // Sessizce yut; döngü bir kez daha dener, sonra null döner.
    }
  }

  return null;
}

/** Gemini'ye gönderilecek, SADECE katı JSON isteyen Türkçe komut. */
function buildPrompt(productInput: string): string {
  return [
    "Sen bir e-ticaret satış uzmanı yapay zekasısın. Aşağıda GERÇEK verileri verilen Trendyol",
    "ürününü, bir satıcının satışını artırması açısından analiz et. Cevabını YALNIZCA aşağıdaki",
    "şemaya birebir uyan geçerli bir JSON nesnesi olarak ver. JSON dışında HİÇBİR metin yazma.",
    "",
    "Şema:",
    "{",
    '  "summary": string,       // tek cümlelik genel değerlendirme',
    '  "score": number,         // 0-100 arası satış potansiyeli puanı',
    '  "strengths": string[],   // güçlü yönler (2-4 madde)',
    '  "weaknesses": string[],  // zayıf yönler (2-4 madde)',
    `  "suggestions": string[]  // satıcıya somut öneriler (en fazla ${MAX_SUGGESTIONS} madde)`,
    "}",
    "",
    "ÇOK ÖNEMLİ KURALLAR:",
    "- SADECE aşağıda verilen gerçek verilere dayan. Verilmeyen bir özelliği VARSAYMA veya UYDURMA.",
    "- suggestions, strengths veya weaknesses ile AYNI ŞEYİ TEKRARLAMASIN. Öneri = satıcının",
    "  YAPACAĞI somut bir eylem olmalı (zaten var olan bir özelliği 'ekleyin' deme).",
    "- Veri zaten bir özelliği gösteriyorsa (ör. 'Mikrofon: Var'), onu öneride 'eklensin' diye yazma.",
    "- Puan/yorum bilgisi varsa değerlendirmene kat; yoksa 'değerlendirme yok' gerçeğini dikkate al.",
    "- Genel geçer klişe ('daha fazla fotoğraf ekleyin') yazma; ürüne ve verilere özgü ol.",
    "- Tüm metinler Türkçe, kısa ve net olsun.",
    `- suggestions en fazla ${MAX_SUGGESTIONS} madde içersin.`,
    "",
    "Ürün verileri:",
    productInput,
  ].join("\n");
}

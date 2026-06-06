import "server-only";
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "./types";
import { GEMINI_MODEL, GEMINI_FALLBACK_MODEL, MAX_SUGGESTIONS } from "./constants";
import { parseAnalysis } from "./parseAnalysis";

/** Model başına en fazla deneme sayısı. */
const MAX_ATTEMPTS_PER_MODEL = 2;
/** Tekrar denemeden önceki temel bekleme (üstel artar: 600ms, 1200ms…). */
const RETRY_BASE_DELAY_MS = 600;
/**
 * "Geçici" (tekrar denemeye değer) HTTP durum kodları:
 * 429 = kota/hız limiti, 503 = model anlık aşırı yoğun.
 */
const RETRYABLE_STATUS = new Set([429, 503]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ApiError nesnesinden HTTP durum kodunu güvenle okur. */
function statusOf(error: unknown): number | undefined {
  const status = (error as { status?: unknown })?.status;
  return typeof status === "number" ? status : undefined;
}

/**
 * Yapay zeka sağlayıcısı arkasındaki TEK fonksiyon (Dependency Inversion — CLAUDE.md md.8).
 * Sağlayıcı ileride değişse bu imza (string girer, AnalysisResult | null çıkar) sabit kalır.
 *
 * - Yalnızca sunucu tarafında çalışır ("server-only").
 * - Anahtar yoksa veya analiz başarısızsa CÖKMEZ; null döner.
 * - Katı JSON ister; başarısız ayrıştırmada tekrar dener.
 * - Ana model "yoğunluk" (503/429) verirse üstel bekleyip tekrar dener, hâlâ olmuyorsa
 *   yedek modele (GEMINI_FALLBACK_MODEL) geçer — demo "model yoğun" diye çökmesin.
 */
export async function analyzeProduct(productInput: string): Promise<AnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(productInput);

  // Önce ana model; o yoğunsa yedek model. Her modelde birkaç deneme + üstel bekleme.
  for (const model of [GEMINI_MODEL, GEMINI_FALLBACK_MODEL]) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const parsed = parseAnalysis(response.text, MAX_SUGGESTIONS);
        if (parsed) return parsed;
        // Çağrı başarılı ama JSON bozuk: kısa bekleyip tekrar dene.
        console.warn(`[gemini] ${model}: yanıt ayrıştırılamadı (deneme ${attempt + 1}).`);
      } catch (error) {
        const status = statusOf(error);
        console.error(`[gemini] ${model} başarısız (deneme ${attempt + 1}, durum=${status ?? "?"}).`);
        // Kalıcı bir hata ise (ör. 400/404) bu modelde uğraşmadan yedek modele geç.
        if (status !== undefined && !RETRYABLE_STATUS.has(status)) break;
      }

      // Son denemeden sonra beklemeden çık (bir sonraki model/dönüşe geç).
      if (attempt < MAX_ATTEMPTS_PER_MODEL - 1) {
        await sleep(RETRY_BASE_DELAY_MS * (attempt + 1));
      }
    }
  }

  console.error("[gemini] Tüm modeller ve denemeler başarısız; null dönülüyor.");
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

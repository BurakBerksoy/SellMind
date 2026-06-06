import { NextResponse } from "next/server";
import { analyzeProduct } from "@/lib/gemini";
import { fetchProductPreview, isHttpUrl } from "@/lib/productPreview";
import type { AnalyzeResponse, ProductPreview } from "@/lib/types";

// Gemini SDK + harici fetch Node ortamı gerektirir.
export const runtime = "nodejs";

// Yedek-model zinciri yavaş kalırsa Vercel'in varsayılan zaman aşımına takılmamak için
// daha geniş bir üst sınır (saniye). Normalde analiz ~2sn'de döner.
export const maxDuration = 30;

/**
 * POST /api/analyze
 * Gövde: { input: string }
 *
 * Akış (CLAUDE.md md.5):
 * 1. Girdi bir link ise sunucu tarafında ürün önizlemesi (görsel + başlık) çekilir.
 * 2. Önizleme metni Gemini'ye verilir → daha kaliteli analiz.
 * 3. Gemini çağrısı YALNIZCA burada (sunucu) yapılır.
 * Hiçbir durumda ham hata/çökme dönmez.
 */
export async function POST(request: Request): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const body = (await request.json().catch(() => ({}))) as { input?: unknown };
    const input = typeof body.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json({ ok: false, reason: "empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ ok: false, reason: "no-key" });
    }

    // Link ise önizleme çek; metinse doğrudan kullan.
    let preview: ProductPreview | null = null;
    let promptInput = input;

    if (isHttpUrl(input)) {
      preview = await fetchProductPreview(input);
      if (preview?.title) {
        promptInput = buildPromptInput(preview, input);
      }
    }

    const result = await analyzeProduct(promptInput);
    if (!result) {
      return NextResponse.json({ ok: false, reason: "ai-error" });
    }

    return NextResponse.json({ ok: true, result, preview });
  } catch {
    return NextResponse.json({ ok: false, reason: "ai-error" });
  }
}

/** Önizlemedeki GERÇEK verilerden Gemini'ye gidecek zengin metni oluşturur. */
function buildPromptInput(preview: ProductPreview, url: string): string {
  const lines = [`Ürün adı: ${preview.title}`];
  if (preview.price) lines.push(`Fiyat: ${preview.price}`);
  if (preview.rating && preview.ratingCount) {
    lines.push(`Puan: ${preview.rating}/5 (${preview.ratingCount} değerlendirme)`);
  } else {
    lines.push("Puan: Henüz değerlendirme yok.");
  }
  if (preview.attributes.length > 0) {
    lines.push("Teknik özellikler:");
    for (const attr of preview.attributes) {
      lines.push(`- ${attr.name}: ${attr.value}`);
    }
  }
  if (preview.description) lines.push(`Açıklama: ${preview.description}`);
  lines.push(`Ürün linki: ${url}`);
  return lines.join("\n");
}

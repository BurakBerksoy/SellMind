// Hem Gemini'den dönen hem de arayüzde kullanılan TEK analiz veri biçimi.
export interface AnalysisResult {
  /** Tek cümlelik genel değerlendirme */
  summary?: string;
  /** Satış potansiyeli puanı (0-100) */
  score?: number;
  /** Ürünün güçlü yönleri */
  strengths: string[];
  /** Ürünün zayıf / geliştirilmesi gereken yönleri */
  weaknesses: string[];
  /** Satıcıya somut öneriler (en fazla 3) */
  suggestions: string[];
}

/** Üründen çekilen tek bir teknik özellik (ör. Renk = Beyaz). */
export interface ProductAttribute {
  name: string;
  value: string;
}

/** Trendyol linkinden çekilen ürün önizlemesi (görsel + başlık + gerçek veriler). */
export interface ProductPreview {
  url: string;
  title?: string;
  description?: string;
  /** Ana görsel (kapak). */
  image?: string;
  /** Galeri görselleri (ana görsel dahil). */
  images: string[];
  /** Fiyat metni (ör. "809,10 TL"). */
  price?: string;
  /** Ortalama puan (0-5). */
  rating?: number;
  /** Yorum/değerlendirme sayısı. */
  ratingCount?: number;
  /** Teknik özellikler (Renk, Garanti vb.). */
  attributes: ProductAttribute[];
}

/** /api/analyze uç noktasının dönebileceği yanıt biçimleri. */
export type AnalyzeFailureReason = "empty" | "no-key" | "ai-error";

export type AnalyzeResponse =
  | { ok: true; result: AnalysisResult; preview: ProductPreview | null }
  | { ok: false; reason: AnalyzeFailureReason };

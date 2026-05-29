// Tek noktada toplanan sabitler (sihirli sayı/metin yok — CLAUDE.md md.8).

/** Kullanılan Gemini modeli (ücretsiz katman, hızlı). */
export const GEMINI_MODEL = "gemini-2.5-flash";

/** Önerilerde gösterilecek en fazla madde sayısı. */
export const MAX_SUGGESTIONS = 3;

/** Marka rengi (mor). */
export const BRAND_COLOR = "#8B5CF6";

// --- Arayüz metinleri (Türkçe) ---
export const APP_NAME = "SellMind";
export const APP_TITLE = "SellMind — Trendyol Ürün Analizi";
export const APP_DESCRIPTION =
  "Trendyol ürün linkini yapıştır, yapay zeka senin için analiz etsin: güçlü yönler, zayıf yönler ve somut öneriler.";

export const UI_TEXT = {
  welcomeGreeting: "Merhaba 👋",
  heroBadge: "Yapay Zeka Destekli Ürün Analizi",
  heroTaglines: [
    "Ürününü yapay zekayla saniyeler içinde analiz et.",
    "Güçlü yönleri, zayıf yönleri ve satış önerilerini gör.",
    "Satışını artıracak somut adımları keşfet.",
  ],
  inputLabel: "Trendyol ürün linki veya ürün açıklaması",
  inputPlaceholder: "https://www.trendyol.com/... veya ürün adını ve özelliklerini yapıştırın",
  analyzeButton: "Analiz Et",
  analyzingButton: "Analiz ediliyor…",
  sampleButton: "Örnek link dene",
  clearButton: "Temizle",
  copyButton: "Sonucu kopyala",
  copiedButton: "Kopyalandı!",
  loadingTitle: "Ürün analiz ediliyor",
  loadingHint: "Yapay zeka ürünü inceliyor, birkaç saniye sürebilir…",
  previewTitle: "İncelenen Ürün",
  resultsTitle: "Analiz Sonucu",
  scoreLabel: "Satış Potansiyeli",
  strengthsTitle: "Güçlü Yönler",
  weaknessesTitle: "Zayıf Yönler",
  suggestionsTitle: "Öneriler",
  historyTitle: "Son Analizler",
  historyClear: "Geçmişi temizle",
  ratingSuffix: "değerlendirme",
} as const;

/** "Örnek link dene" butonunun dolduracağı gerçek Trendyol linki (canlı analiz edilir). */
export const SAMPLE_PRODUCT_URL =
  "https://www.trendyol.com/link/tws-kablosuz-kulaklik-p-1119416137";

/** localStorage geçmiş anahtarı ve sınırı. */
export const HISTORY_STORAGE_KEY = "sellmind:history";
export const HISTORY_LIMIT = 6;

/** Hata/uyarı durumlarında gösterilecek dostça mesajlar (ham hata gösterilmez). */
export const FRIENDLY_MESSAGES: Record<string, string> = {
  empty: "Lütfen önce bir Trendyol ürün linki ya da ürün açıklaması girin.",
  "no-key":
    "Canlı analiz şu anda yapılandırılmamış. Yöneticinin geçerli bir Gemini API anahtarı eklemesi gerekiyor.",
  "ai-error":
    "Analiz şu anda tamamlanamadı. Lütfen birkaç saniye sonra tekrar deneyin.",
};

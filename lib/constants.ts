// Tek noktada toplanan sabitler (sihirli sayı/metin yok — CLAUDE.md md.8).

/**
 * Ana Gemini modeli (ücretsiz katman). flash-lite seçildi çünkü testlerde
 * tutarlı ~1.7sn'de yanıt verdi ve hep kararlıydı; normal "flash" ise sık sık
 * 503 (aşırı yoğunluk) verip analizi 10sn+'ya uzatıyordu. Demo için hız + güven öncelikli.
 */
export const GEMINI_MODEL = "gemini-2.5-flash-lite";

/**
 * Yedek model: ana model "yoğunluk" (503/429) verirse otomatik buna geçilir.
 * Tam "flash" daha zengin analiz üretir; lite anlık çalışmazsa devreye girer.
 */
export const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

/** Önerilerde gösterilecek en fazla madde sayısı. */
export const MAX_SUGGESTIONS = 3;

/** Marka rengi (mor). */
export const BRAND_COLOR = "#8B5CF6";

// --- Arayüz metinleri (Türkçe) ---
export const APP_NAME = "SellMind";
export const APP_TITLE = "SellMind — Trendyol Satıcıları İçin Yapay Zekâ Büyüme Asistanı";
export const APP_DESCRIPTION =
  "Trendyol ürün linkini yapıştır, yapay zeka satış potansiyelini puanlasın: güçlü yönler, zayıf yönler ve satışını artıracak somut öneriler.";

/** Projeyle ilgili dış bağlantılar (footer, README vb.). */
export const LINKS = {
  liveDemo: "https://sell-mind.vercel.app",
  github: "https://github.com/BurakBerksoy/SellMind",
} as const;

export const UI_TEXT = {
  welcomeGreeting: "Merhaba 👋",
  heroBadge: "Trendyol Satıcıları İçin Yapay Zekâ",
  // Değer önerisi (value proposition) — komisyona "araç değil, ürün" hissi verir.
  heroHeadlineLead: "Trendyol Satıcıları İçin",
  heroHeadlineHighlight: "Yapay Zekâ Destekli Büyüme Asistanı",
  heroSubtitle:
    "Ürününü analiz et, eksikleri gör, satışını dakikalar içinde artır.",
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
  reportButton: "Raporu İndir (PDF)",
  loadingTitle: "Ürün analiz ediliyor",
  loadingHint: "Yapay zeka ürünü inceliyor, birkaç saniye sürebilir…",
  previewTitle: "İncelenen Ürün",
  resultsTitle: "Analiz Sonucu",
  reportSubtitle: "Yapay zeka destekli ürün analiz raporu",
  scoreLabel: "Satış Potansiyeli",
  scoreInfo:
    "Bu skor; fiyat rekabeti, açıklama kalitesi ve müşteri yorum hissiyatı (sentiment) temel alınarak hesaplanır.",
  scoreInfoLabel: "Skor nasıl hesaplanır?",
  strengthsTitle: "Güçlü Yönler",
  weaknessesTitle: "Zayıf Yönler",
  suggestionsTitle: "Öneriler",
  historyTitle: "Son Analizler",
  historyClear: "Geçmişi temizle",
  ratingSuffix: "değerlendirme",
  // Boş durum (ilk açılış) ipucu
  emptyStateTitle: "Analize hazır mısın?",
  emptyStateText:
    "Bir Trendyol ürün linki yapıştır ya da hızlıca denemek için aşağıdaki örneği kullan.",
} as const;

/** "Nasıl Çalışır?" üç adımı (ikon adları lucide-react'ten). */
export const HOW_IT_WORKS = {
  title: "Nasıl Çalışır?",
  subtitle: "Üç adımda, dakikalar içinde rakiplerinin önüne geç.",
  steps: [
    {
      icon: "Link2",
      title: "1. Linki Yapıştır",
      text: "Trendyol ürün linkini ya da ürün açıklamasını kutuya yapıştır.",
    },
    {
      icon: "Sparkles",
      title: "2. Yapay Zeka Analiz Etsin",
      text: "SellMind, ürünün verilerini, fiyatını ve yorumlarını saniyeler içinde inceler.",
    },
    {
      icon: "TrendingUp",
      title: "3. Rakiplerinin Önüne Geç",
      text: "Güçlü/zayıf yönleri ve satışını artıracak somut önerileri uygula.",
    },
  ],
} as const;

/** "Neden SellMind?" özellik kartları. */
export const FEATURES = {
  title: "Neden SellMind?",
  subtitle: "Satıcıların kafasındaki “nasıl daha çok satarım?” sorusuna veriyle cevap.",
  items: [
    {
      icon: "Zap",
      title: "Saniyeler İçinde Analiz",
      text: "Saatlerce uğraşmadan, ürününün eksiklerini tek tıkla gör.",
    },
    {
      icon: "Search",
      title: "SEO + Yorum Hissiyatı",
      text: "Başlık, açıklama ve müşteri yorumlarındaki sinyalleri birlikte değerlendirir.",
    },
    {
      icon: "Target",
      title: "Somut ROI Önerileri",
      text: "“Şunu yap” diyen, satışa ve dönüşüme dönük net aksiyonlar.",
    },
    {
      icon: "ShoppingBag",
      title: "Trendyol'a Özel",
      text: "Genel tavsiye değil; Trendyol satıcısının gerçek metriklerine odaklı.",
    },
  ],
} as const;

/** Statik fiyatlandırma planları (DEMO — gerçek ödeme yok; iş modelini gösterir). */
export const PRICING = {
  title: "Planlar",
  subtitle: "Demo aşamasındayız — aşağıdaki planlar ürünün iş modelini gösterir.",
  demoBadge: "Demo",
  plans: [
    {
      name: "Ücretsiz",
      price: "₺0",
      period: "/ay",
      description: "Bireysel satıcılar için başlangıç.",
      features: ["Aylık 5 analiz", "Güçlü/zayıf yön raporu", "Temel satış önerileri"],
      cta: "Hemen Dene",
      highlighted: false,
    },
    {
      name: "Pro Satıcı",
      price: "₺299",
      period: "/ay",
      description: "Büyümek isteyen aktif satıcılar için.",
      features: [
        "Sınırsız analiz",
        "Satış potansiyeli skoru",
        "PDF rapor çıktısı",
        "Rakip karşılaştırma (yakında)",
      ],
      cta: "Pro'ya Geç",
      highlighted: true,
    },
    {
      name: "Kurumsal",
      price: "Teklif",
      period: "",
      description: "Ajanslar ve çok mağazalı işletmeler için.",
      features: ["Toplu ürün analizi", "API erişimi", "Özel raporlama", "Öncelikli destek"],
      cta: "İletişime Geç",
      highlighted: false,
    },
  ],
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

import "server-only";
import type { ProductAttribute, ProductPreview } from "./types";

const FETCH_TIMEOUT_MS = 8000;
const MAX_GALLERY = 5;
const MAX_ATTRIBUTES = 10;
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Girdi bir http(s) bağlantısı mı? */
export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/** Bir <meta property="..."> etiketinin content değerini çeker (öznitelik sırasından bağımsız). */
function readMeta(html: string, property: string): string | undefined {
  const tag = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*>`, "i"))?.[0];
  if (!tag) return undefined;
  return tag.match(/content=["']([^"']*)["']/i)?.[1];
}

/** <title> içeriğini çeker. */
function readTitleTag(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
}

/** JSON içindeki \uXXXX ve \/ kaçışlarını çözer. */
function decodeJson(value: string): string {
  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\//g, "/");
}

/** Basit HTML entity + JSON kaçış çözümü + boşluk temizliği. */
function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const decoded = decodeJson(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
  return decoded.length > 0 ? decoded : undefined;
}

/** Fiyat metnini çeker (indirimli fiyat öncelikli). */
function extractPrice(html: string): string | undefined {
  const discounted = html.match(/"discountedPrice":\{"value":[\d.]+,"text":"([^"]+)"/)?.[1];
  const selling = html.match(/"sellingPrice":\{"value":[\d.]+,"text":"([^"]+)"/)?.[1];
  return clean(discounted ?? selling);
}

/** Ortalama puan ve yorum sayısını çeker. */
function extractRating(html: string): { rating?: number; ratingCount?: number } {
  const match = html.match(
    /"ratingScore":\{"averageRating":([\d.]+),"commentCount":(\d+),"totalCount":(\d+)\}/,
  );
  if (!match) return {};
  const rating = parseFloat(match[1]);
  const count = parseInt(match[3], 10) || parseInt(match[2], 10);
  return {
    rating: rating > 0 ? Math.round(rating * 10) / 10 : undefined,
    ratingCount: count > 0 ? count : undefined,
  };
}

/** Ürün teknik özelliklerini (key.name = value.name) çeker. */
function extractAttributes(html: string): ProductAttribute[] {
  const regex =
    /"key":\{"id":\d+,"name":"([^"]+)"\},"value":\{"id":\d+,"name":"([^"]+)"\}/g;
  const seen = new Set<string>();
  const attributes: ProductAttribute[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null && attributes.length < MAX_ATTRIBUTES) {
    const name = clean(match[1]);
    const value = clean(match[2]);
    if (name && value && !seen.has(name)) {
      seen.add(name);
      attributes.push({ name, value });
    }
  }
  return attributes;
}

/** Trendyol başlığından "Fiyatı, Yorumları - Trendyol" gibi ekleri ayıklar. */
function cleanTitle(value: string | undefined): string | undefined {
  const base = clean(value);
  if (!base) return undefined;
  const stripped = base
    .replace(/\s*-\s*Trendyol\s*$/i, "") // "- Trendyol" eki
    .replace(/\s*-?\s*Fiyat[ıi],?\s*Yorumlar[ıi]\s*$/i, "") // "- Fiyatı, Yorumları" eki
    .trim();
  return stripped || base;
}

/** Sayfadaki ürün görsellerini (cdn.dsmcdn.com .._org_zoom.jpg) toplar ve tekilleştirir. */
function extractGallery(html: string): string[] {
  const matches = html.match(/https:\/\/cdn\.dsmcdn\.com\/[^"'\\\s]*?_org_zoom\.(?:jpg|jpeg|png|webp)/gi) ?? [];
  // /mnresize/<w>/<h>/ önekini kaldırarak aynı görselin farklı boyutlarını teke indir.
  const normalized = matches.map((url) => url.replace(/\/mnresize\/\d+\/\d+\//, "/"));
  return [...new Set(normalized)];
}

/**
 * Ham HTML'den ürün önizlemesini ayıklar (saf fonksiyon — test edilebilir).
 */
export function parseProductHtml(html: string, url: string): ProductPreview {
  const title = cleanTitle(readMeta(html, "og:title") ?? readTitleTag(html));
  const description = clean(readMeta(html, "og:description"));
  const ogImage = readMeta(html, "og:image");
  const gallery = extractGallery(html);

  const images = [...new Set([ogImage, ...gallery].filter((u): u is string => Boolean(u)))].slice(
    0,
    MAX_GALLERY,
  );

  const { rating, ratingCount } = extractRating(html);

  return {
    url,
    title,
    description,
    image: images[0] ?? ogImage ?? undefined,
    images,
    price: extractPrice(html),
    rating,
    ratingCount,
    attributes: extractAttributes(html),
  };
}

/**
 * Trendyol ürün sayfasını sunucu tarafında indirir ve önizleme çıkarır.
 * Engellenirse / hata olursa CÖKMEZ; null döner (akış metinle devam eder).
 */
export async function fetchProductPreview(url: string): Promise<ProductPreview | null> {
  if (!isHttpUrl(url)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        "Accept-Language": "tr-TR,tr;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;

    const html = await response.text();
    const preview = parseProductHtml(html, url);

    // Anlamlı hiçbir şey çıkmadıysa önizleme yok say.
    if (!preview.title && preview.images.length === 0) return null;
    return preview;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

import { describe, it, expect } from "vitest";
import { parseProductHtml, isHttpUrl } from "@/lib/productPreview";

const SAMPLE_HTML = `
<html><head>
<title>Link Tech Tw4 Kablosuz Bluetooth Kulaklik Fiyatı, Yorumları - Trendyol</title>
<meta property="og:title" content="Link Tech Tw4 Kablosuz Bluetooth Kulaklik Fiyatı, Yorumları - Trendyol"/>
<meta property="og:description" content="TWS KABLOSUZ KULAKLIK yorumlarını inceleyin - Trendyol"/>
<meta property="og:image" content="https://cdn.dsmcdn.com/ty1/prod/abc/1_org_zoom.jpg"/>
</head><body>
<img src="https://cdn.dsmcdn.com/mnresize/620/920/ty1/prod/abc/1_org_zoom.jpg"/>
<img src="https://cdn.dsmcdn.com/ty1/prod/abc/2_org_zoom.jpg"/>
<script>
window.state = {"sellingPrice":{"value":899,"text":"899 TL"},"discountedPrice":{"value":809.1,"text":"809,10 TL"},
"ratingScore":{"averageRating":4.3,"commentCount":1200,"totalCount":1500},
"attributes":[{"key":{"id":1,"name":"Renk"},"value":{"id":2,"name":"Beyaz"}},{"key":{"id":3,"name":"Suya\\u002FTere Dayanıklılık"},"value":{"id":4,"name":"Var"}}]}
</script>
</body></html>`;

describe("isHttpUrl", () => {
  it("link ve metni ayırt eder", () => {
    expect(isHttpUrl("https://www.trendyol.com/x-p-1")).toBe(true);
    expect(isHttpUrl("kablosuz kulaklık 599 TL")).toBe(false);
  });
});

describe("parseProductHtml", () => {
  it("başlığı temizler (Fiyatı, Yorumları - Trendyol ekini atar)", () => {
    const p = parseProductHtml(SAMPLE_HTML, "https://www.trendyol.com/x-p-1");
    expect(p.title).toBe("Link Tech Tw4 Kablosuz Bluetooth Kulaklik");
  });

  it("og:image'i ana görsel yapar ve galeriyi tekilleştirir", () => {
    const p = parseProductHtml(SAMPLE_HTML, "https://www.trendyol.com/x-p-1");
    expect(p.image).toBe("https://cdn.dsmcdn.com/ty1/prod/abc/1_org_zoom.jpg");
    expect(p.images).toContain("https://cdn.dsmcdn.com/ty1/prod/abc/2_org_zoom.jpg");
    expect(p.images.length).toBe(2);
  });

  it("indirimli fiyatı çeker", () => {
    const p = parseProductHtml(SAMPLE_HTML, "https://www.trendyol.com/x-p-1");
    expect(p.price).toBe("809,10 TL");
  });

  it("puan ve yorum sayısını çeker", () => {
    const p = parseProductHtml(SAMPLE_HTML, "https://www.trendyol.com/x-p-1");
    expect(p.rating).toBe(4.3);
    expect(p.ratingCount).toBe(1500);
  });

  it("teknik özellikleri çeker ve \\u kaçışlarını çözer", () => {
    const p = parseProductHtml(SAMPLE_HTML, "https://www.trendyol.com/x-p-1");
    expect(p.attributes).toContainEqual({ name: "Renk", value: "Beyaz" });
    expect(p.attributes).toContainEqual({ name: "Suya/Tere Dayanıklılık", value: "Var" });
  });
});

# CLAUDE.md — SellMind Demo (Başvuru Sürümü)

> Bu dosya Claude Code içindir. Proje kökünde durur ve her oturumda otomatik okunur.
> Bu projedeki TEK doğru kaynak budur. Çelişki olursa bu dosya kazanır.

> 🔄 **SAHİBİN GÜNCEL KARARI (2026-05-29):** Demo **yalnızca canlı Google Gemini** ile çalışır.
> **Örnek/gömülü ürün analizleri (sampleData) KALDIRILDI** — `lib/sampleData.ts` yok, "örnek ürünü
> dene" butonları yok. Kullanıcı kendi Trendyol linkini girer → sunucu route'u Gemini'ye sorar →
> canlı analiz döner. Anahtar yok / Gemini hata-limit verirse uygulama ÇÖKMEZ; nazik bir Türkçe
> mesaj gösterir. Aşağıdaki metinde "örnek ürün / sampleData" geçen yerler bu kararla geçersizdir.

## 1. Proje Nedir?

SellMind Demo, üniversite burs başvurusu (ApplyBAU / İKÜ WeAccept) için yapılan
**tek sayfalık** bir web uygulamasıdır. Kullanıcı bir Trendyol ürün linki yapıştırır
(veya hazır bir örnek ürün seçer), butona basar, **gerçek bir yapay zeka analizi** gelir:
**güçlü yönler, zayıf yönler ve en fazla 3 somut öneri.**

Bu bir DEMO'dur, tam ürün DEĞİLDİR. Minimal, şık ve profesyonel tut.

## 2. Hedef

- Profesyonel görünmeli, güvenilir çalışmalı (demo videosunda + komisyona + GitHub'da görünecek).
- Sadelik > tamlık. Kapsam dışına çıkma.
- **Demo, kredi kartı OLMADAN tam çalışmalı.** Bunu Google Gemini'nin ÜCRETSİZ katmanıyla
  (kart gerekmez) yaparız; ayrıca hazır gömülü örnek analizler yedek olarak bulunur.

## 3. Teknoloji Yığını

| Katman | Seçim | Görev |
|---|---|---|
| İskelet | **Next.js (App Router) + TypeScript** | Tek sayfa + güvenli sunucu tarafı API route |
| Stil | **Tailwind CSS** | Hızlı, responsive tasarım |
| Bileşen | **shadcn/ui** | Profesyonel Button/Card/Badge |
| Animasyon | **Framer Motion** | Kartların yumuşak açılışı, yükleme efekti |
| İkon | **lucide-react** | Güçlü/zayıf/öneri ikonları |
| Yapay zeka | **Google Gemini API (ücretsiz katman)** | Canlı ürün analizi (kart gerekmez) |
| Test | **Vitest + React Testing Library** | Birkaç odaklı test (bkz. 9) |

Kütüphaneler `npm` ile kurulur. GitHub'dan elle dosya indirilmez.

## 4. Yapay Zeka Sağlayıcı — Google Gemini (ÜCRETSİZ, Kartsız)

- Anahtar **Google AI Studio**'dan (aistudio.google.com) alınır — kredi kartı GEREKMEZ.
- Model: **gemini-2.5-flash** (yeterli, hızlı, ücretsiz). Güncel resmi Google AI SDK'sini kullan;
  paket adını ve model adını kurulumda doğrula.
- Anahtar ortam değişkeni: **GEMINI_API_KEY**.
- Ücretsiz katman günlük istek limitlidir; bu demo için fazlasıyla yeterli.

## 5. Mimari Kuralları (ÖNEMLİ)

- Tek sayfalık arayüz (App Router).
- Gemini çağrısı **YALNIZCA sunucu tarafı route handler** içinde yapılır
  (ör. `app/api/analyze/route.ts`). İstemci bileşeninden ASLA AI API çağırma.
- Anahtar yalnızca `process.env.GEMINI_API_KEY` üzerinden okunur. Koda ASLA gömme,
  istemciye ASLA sızdırma, `NEXT_PUBLIC_` değişkenine ASLA koyma.
- **REPO HERKESE AÇIK.** Anahtar ASLA repoya commit'lenmez. `.env.local` gitignore'lu olmalı;
  anahtar sadece yerelde `.env.local`'de ve canlıda Vercel ortam değişkenlerinde durur.
- Anahtar yoksa uygulama ÇÖKMEZ: örnek ürünler her zaman çalışır, kullanıcı linki için
  nazik bir "tam sürümde gelecek" mesajı gösterilir.
- Giriş/üyelik, veritabanı, ödeme, mağaza bağlama, mobil YOK.

## 6. Veri & Akış

1. Kullanıcı bir **örnek ürün** seçtiyse → kısa animasyon → `lib/sampleData.ts`'ten hazır analiz.
2. Kullanıcı **kendi linkini** yapıştırdıysa ve `GEMINI_API_KEY` var → sunucu route'u ürün
   metnini/yorumları Gemini'ye gönderir → canlı analiz döner.
3. Anahtar yoksa veya Gemini hata/limit verirse → nazik mesaj + örnek ürünlere yönlendir.
4. Hiçbir durumda ham hata / çökme gösterme.

> Örnek analizler (sampleData.ts) yedektir: video çekerken internet/limit sorununda demo
> yine kusursuz çalışsın diye. Proje sahibi içerikleri ayrıca verecektir.

## 7. Yapay Zeka Çıktı Biçimi

- Hem Gemini'den hem gömülü örneklerden gelen veri AYNI yapıda olmalı:
  `strengths: string[]`, `weaknesses: string[]`, `suggestions: string[]` (en fazla 3).
- Gemini'den SADECE katı JSON iste; JSON dışında metin olmasın.
- JSON ayrıştırma güvenli olsun: başarısızsa bir kez tekrar dene, sonra dostça yedek mesaj göster.

## 8. Kod Kalitesi — Clean Code & SOLID (Abartmadan)

- **Clean code:** Anlamlı isimler, küçük fonksiyonlar, tekrar yok (DRY), sihirli sayı/metin yok
  (sabitleri ayrı tut), açık ve okunur akış.
- **SOLID (demoya uygun ölçüde):**
  - *Single Responsibility:* Her bileşen/dosya tek bir iş yapsın (girdi, buton, sonuç ayrı).
  - *Dependency Inversion (hafif):* AI çağrısını bir arayüz/fonksiyon arkasına koy ki
    sağlayıcı (Gemini) ileride değişse arayüz değişmesin.
- **Aşırıya kaçma:** Bu küçük bir demo. Gereksiz soyutlama, fazladan katman, "her ihtimale karşı"
  mimari KURMA. Basit, temiz ve okunur > "kurumsal" ama karmaşık.

## 9. Testler (Orantılı — Az Ama Anlamlı)

- Araç: **Vitest + React Testing Library**.
- Şunları test et (yeterli):
  1. Analiz sonucu üç kartın (güçlü/zayıf/öneri) doğru render edildiği.
  2. Yedek (fallback) mantığı: anahtar yokken örnek ürünün doğru gösterildiği.
  3. JSON ayrıştırma yardımcı fonksiyonu (geçerli/bozuk JSON durumları).
- Tam E2E / yüksek kapsama HEDEFLEME — demo için bu üç test profesyonellik gösterir, yeter.
- Test komutu `package.json`'a eklensin: `npm test`.

## 10. Tasarım Yönü

- Temiz, modern, profesyonel. Ana renk: mor (#8B5CF6). Yeşil = iyi, kırmızı/turuncu = zayıf.
- Tamamen responsive (önce mobil). Ferah boşluk, yuvarlatılmış kart, hafif gölge.
- Sonuç üç renk kodlu kart grubu; ince fade/slide-in animasyon; şık yükleme durumu.
- Arayüz metinleri Türkçe.
- Erişilebilirlik temeli: anlamlı HTML, butonlarda erişilebilir etiket, yeterli kontrast.
- Sayfa meta'sı (başlık + açıklama + sosyal önizleme) düzgün olsun — link paylaşılınca şık görünsün.

## 11. Git & GitHub

- Uzak repo: **https://github.com/BurakBerksoy/SellMind.git**
- Proje sahibi git bilmiyor; tüm git işlemlerini SEN yap: `git init` (gerekirse), remote ekle,
  anlamlı commit'ler, push.
- **`.gitignore` MUTLAKA** şunları içersin: `node_modules`, `.next`, `.env*` (özellikle
  `.env.local`), build çıktıları. Anahtar ASLA push edilmesin.
- Commit mesajları kısa ve anlamlı (ör. "feat: analiz sonuç kartları", "fix: mobil düzen").
- İş bittiğinde push et ve repo linkini proje sahibine ver.

## 12. README.md (Komisyon İçin Önemli)

Profesyonel bir `README.md` yaz (Türkçe): proje nedir, ne yapar, hangi teknolojiler,
nasıl çalıştırılır, canlı demo linki ve 1-2 ekran görüntüsü için yer. Komisyon repoyu açınca
ilk bunu görecek; ilk izlenim burada.

## 13. Yayın — Vercel

- Vercel'e yüklenir (GitHub repo bağlanarak veya `vercel` CLI ile). Sahip Vercel'i bilmiyor;
  adımları sen yürüt/anlat.
- **Canlı tarafta `GEMINI_API_KEY` Vercel ortam değişkenlerine eklenmeli** (yoksa canlıda
  Gemini çalışmaz; örnek ürünler yine çalışır).
- Sonuçta tek bir canlı link çıkmalı.

## 14. Kapsam Dışı (YAPMA)

Giriş/kayıt/hesap · ödeme · mağaza bağlama · mobil uygulama · çoklu sayfa/panel · veritabanı.

## 15. Konvansiyonlar

- Her yerde TypeScript, açık isimler, küçük bileşenler.
- Gerekli yerlerde Türkçe yorum (proje sahibi öğreniyor).
- `.env.example` dosyası: `GEMINI_API_KEY=` (boş, açıklamalı). Gerçek anahtar yalnızca `.env.local`.

## 16. Komutlar

- Geliştirme: `npm run dev`
- Test: `npm test`
- Derleme: `npm run build`
- Yayın: Vercel (repo bağla veya `vercel` CLI).

## 17. Verimlilik Notları (ajan için)

- `node_modules`, `.next`, build çıktıları gitignore'lu — okuma/tarama.
- Yalnızca o anki görevle ilgili dosyaları aç; tüm ağacı gereksiz tarama.
- Odaklı, küçük, kademeli değişiklik yap.

## 18. Proje Sahibi Notu

Sahip kod ve git bilmeyen, kredi kartı olmayan bir başlangıç seviyesidir. Adımları sade anlat,
yıkıcı işlemlerden (silme, force push) önce onay al, anahtarı asla repoya koyma, anlaşılır olanı
zekice olana tercih et. Demonun kartsız ve Gemini ücretsiz katmanıyla çalışması zorunludur.
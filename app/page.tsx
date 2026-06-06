import { AnalyzeForm } from "@/components/AnalyzeForm";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeatureCards } from "@/components/FeatureCards";
import { Pricing } from "@/components/Pricing";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Yumuşak arka plan efektleri */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-12 sm:py-20">
        {/* Hero + analiz formu — odak için dar bir sütunda tutulur */}
        <div className="mx-auto w-full max-w-3xl">
          <Hero />

          <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-7">
            <AnalyzeForm />
          </section>
        </div>

        {/* Tanıtım bölümleri — komisyona ürünü ve iş modelini anlatır */}
        <HowItWorks />
        <FeatureCards />
        <Pricing />

        <footer className="mt-auto pt-16 text-center text-xs text-slate-400">
          {APP_NAME} Demo · Yapay zeka analizleri Google Gemini ile üretilir.
        </footer>
      </main>
    </div>
  );
}

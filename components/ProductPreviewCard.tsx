"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff, ExternalLink, Star, Tag } from "lucide-react";
import { UI_TEXT } from "@/lib/constants";
import type { ProductPreview } from "@/lib/types";

interface ProductPreviewCardProps {
  preview: ProductPreview;
}

export function ProductPreviewCard({ preview }: ProductPreviewCardProps) {
  const images = preview.images.length > 0 ? preview.images : preview.image ? [preview.image] : [];
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const current = images[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        {/* Ana görsel */}
        <div className="relative mx-auto aspect-square w-full max-w-[220px] shrink-0 overflow-hidden rounded-xl bg-slate-50">
          {current && !failed ? (
            <motion.img
              key={current}
              src={current}
              alt={preview.title ?? "Ürün görseli"}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setFailed(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
              <span className="text-xs">Görsel yüklenemedi</span>
            </div>
          )}
        </div>

        {/* Bilgi + küçük galeri */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {UI_TEXT.previewTitle}
          </span>
          <h3 className="mt-1 line-clamp-3 text-base font-semibold text-slate-800">
            {preview.title ?? "Trendyol Ürünü"}
          </h3>

          {/* Fiyat + puan */}
          {(preview.price || preview.rating) && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {preview.price && (
                <span className="inline-flex items-center gap-1.5 text-base font-bold text-brand-700">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  {preview.price}
                </span>
              )}
              {preview.rating && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {preview.rating}
                  {preview.ratingCount ? (
                    <span className="text-slate-400">({preview.ratingCount} {UI_TEXT.ratingSuffix})</span>
                  ) : null}
                </span>
              )}
            </div>
          )}

          {/* Özellik etiketleri */}
          {preview.attributes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {preview.attributes.slice(0, 6).map((attr) => (
                <span
                  key={attr.name}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  <span className="text-slate-400">{attr.name}:</span> {attr.value}
                </span>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setFailed(false);
                  }}
                  aria-label={`Görsel ${i + 1}`}
                  className={`h-12 w-12 overflow-hidden rounded-lg border bg-white transition ${
                    i === active ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center gap-1.5 pt-3 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
          >
            Trendyol'da görüntüle
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

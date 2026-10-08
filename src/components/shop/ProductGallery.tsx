"use client";

import React, { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  discountPercent: number;
}

/**
 * Main image plus a thumbnail strip. With a single image (or none) it
 * collapses to the plain cover block the detail page used to render.
 */
export default function ProductGallery({ images, title, discountPercent }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? null;

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl overflow-hidden border border-card-border bg-slate-100 aspect-square">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current}
            src={current}
            alt={images.length > 1 ? `${title} — image ${active + 1} of ${images.length}` : title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🧸</div>
        )}
        {discountPercent > 0 && (
          <span className="absolute top-5 right-5 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full shadow-md tracking-wider bg-rose-500 text-white">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label={`${title} images`}
        >
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Show image ${index + 1}`}
                onClick={() => setActive(index)}
                className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 bg-slate-100 transition-all cursor-pointer ${
                  selected
                    ? "border-[#FF7A2F] shadow-md"
                    : "border-card-border opacity-70 hover:opacity-100 hover:border-orange-500/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

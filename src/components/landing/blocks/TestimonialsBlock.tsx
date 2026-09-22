import React from "react";
import SectionHeading from "../SectionHeading";

export interface TestimonialEntry {
  id: string;
  text: string;
  authorName: string;
  authorRole: string;
  avatarLetter: string;
}

interface TestimonialsBlockProps {
  title: string;
  subtitle: string;
  items: TestimonialEntry[];
}

/** Parent reviews — the trust layer just before the ask. */
export default function TestimonialsBlock({ title, subtitle, items }: TestimonialsBlockProps) {
  if (!items.length) return null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-3xl border border-white/12 bg-white/6 p-7 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD966]/30"
            >
              <div className="mb-4 flex gap-0.5 text-[#FFD966]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .951-.69l1.285-3.957Z" />
                  </svg>
                ))}
              </div>

              <blockquote className="grow leading-relaxed text-white/75">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-white/10 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] font-heading text-lg font-extrabold text-white">
                  {t.avatarLetter || t.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-heading font-bold text-white">{t.authorName}</div>
                  {t.authorRole && (
                    <div className="truncate text-sm text-white/50">{t.authorRole}</div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

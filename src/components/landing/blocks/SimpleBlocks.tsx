import React from "react";
import Image from "next/image";
import { StatsData, FeaturesData, RichTextData, GalleryData, VideoData, CtaData } from "@/types/landing";
import SectionHeading from "../SectionHeading";
import CtaButton from "../CtaButton";

/** Social-proof numbers. Short, scannable, right under the hero. */
export function StatsBlock({ data }: { data: StatsData }) {
  const items = data.items || [];
  if (!items.length) return null;

  return (
    <section className="relative z-10 px-5 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl px-6 py-8 shadow-xl">
        <div className="grid grid-cols-3 gap-4 divide-x divide-white/10">
          {items.map((s) => (
            <div key={s.id} className="px-2 text-center">
              <div className="font-heading text-2xl font-extrabold text-[#FFD966] sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/55 sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Benefit cards — the "why should I care" grid. */
export function FeaturesBlock({ data }: { data: FeaturesData }) {
  const items = data.items || [];
  if (!items.length) return null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="group rounded-3xl border border-white/12 bg-white/6 p-7 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF7A2F]/40 hover:bg-white/10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F]/25 to-[#FFD966]/15 text-3xl">
                {f.icon || "✨"}
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{f.title}</h3>
              <p className="mt-2.5 leading-relaxed text-white/65">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Free-form copy. Blank lines become separate paragraphs. */
export function RichTextBlock({ data }: { data: RichTextData }) {
  const paragraphs = (data.body || "").split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <section className="relative z-10 px-5 py-16">
      <div className="mx-auto max-w-2xl">
        {data.title && (
          <h2 className="mb-6 font-heading text-3xl font-extrabold text-white sm:text-4xl">
            {data.title}
          </h2>
        )}
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-white/70">
              {p.trim()}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Image grid — screenshots, product shots, event photos. */
export function GalleryBlock({ data }: { data: GalleryData }) {
  const items = (data.items || []).filter((i) => i.imageUrl);
  if (!items.length) return null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <figure
              key={g.id}
              className="overflow-hidden rounded-3xl border border-white/12 bg-white/5 shadow-lg"
            >
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={g.imageUrl}
                  alt={g.caption || ""}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  unoptimized
                />
              </div>
              {g.caption && (
                <figcaption className="px-5 py-3.5 text-center text-sm font-semibold text-white/70">
                  {g.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Embedded video. Handles YouTube/Vimeo links and direct files alike. */
export function VideoBlock({ data }: { data: VideoData }) {
  const url = (data.videoUrl || "").trim();
  if (!url) return null;

  // YouTube and Vimeo need an iframe; anything else plays as a <video>.
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  const embedSrc = yt
    ? `https://www.youtube.com/embed/${yt[1]}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo[1]}`
      : null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={data.title} subtitle={data.subtitle} />
        <div className="overflow-hidden rounded-3xl border border-white/12 bg-black/40 shadow-2xl">
          <div className="relative aspect-video w-full">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title={data.title || "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={url}
                poster={data.posterUrl || undefined}
                controls
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Closing conversion prompt at the bottom of the page. */
export function CtaBlock({ data }: { data: CtaData }) {
  return (
    <section className="relative z-10 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#FF7A2F]/25 bg-linear-to-br from-[#FF7A2F]/20 via-[#2A1D5C]/40 to-[#FFD966]/10 px-7 py-14 text-center backdrop-blur-xl shadow-2xl sm:px-14">
        <h2 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          {data.headline}
        </h2>
        {data.text && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">{data.text}</p>
        )}
        <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:justify-center sm:gap-4">
          <CtaButton cta={data.primaryCta} variant="primary" />
          {data.showSecondary && <CtaButton cta={data.secondaryCta} variant="secondary" />}
        </div>
      </div>
    </section>
  );
}

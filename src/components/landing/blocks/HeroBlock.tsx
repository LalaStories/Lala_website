import React from "react";
import Image from "next/image";
import { HeroData } from "@/types/landing";
import CtaButton from "../CtaButton";

/**
 * Above-the-fold hero. This is the first thing ad traffic sees, so it
 * carries the promise and the primary conversion action — nothing else.
 */
export default function HeroBlock({ data }: { data: HeroData }) {
  const leftAligned = data.align === "left";
  const hasImage = !!data.imageUrl;

  return (
    <section className="relative z-10 px-5 pt-16 pb-16 sm:pt-24 sm:pb-20">
      <div
        className={
          hasImage
            ? "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
            : "mx-auto max-w-3xl"
        }
      >
        <div className={leftAligned || hasImage ? "text-left" : "text-center"}>
          {data.badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF7A2F]/30 bg-[#FF7A2F]/15 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#FFB380]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A2F]" />
              {data.badge}
            </span>
          )}

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {data.headline}
            {data.highlight && (
              <>
                {" "}
                <span className="bg-linear-to-r from-[#FF7A2F] to-[#FFD966] bg-clip-text text-transparent">
                  {data.highlight}
                </span>
              </>
            )}
          </h1>

          {data.subhead && (
            <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">{data.subhead}</p>
          )}

          <div
            className={`mt-9 flex flex-col gap-3.5 sm:flex-row sm:gap-4 ${
              leftAligned || hasImage ? "" : "sm:justify-center"
            }`}
          >
            <CtaButton cta={data.primaryCta} variant="primary" />
            {data.showSecondary && <CtaButton cta={data.secondaryCta} variant="secondary" />}
          </div>
        </div>

        {hasImage && (
          <div className="relative animate-float-slow">
            <div className="absolute inset-0 -z-10 rounded-full bg-orange-500/20 blur-3xl" />
            <Image
              src={data.imageUrl}
              alt={data.headline || "Lala Stories"}
              width={640}
              height={640}
              className="mx-auto h-auto w-full max-w-md rounded-3xl object-cover shadow-2xl"
              priority
              unoptimized
            />
          </div>
        )}
      </div>
    </section>
  );
}

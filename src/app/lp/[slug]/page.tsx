import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseBlocks } from "@/types/landing";
import { Story, Testimonial, FAQItem } from "@/types";
import LandingBackground from "@/components/landing/LandingBackground";
import BlockRenderer from "@/components/landing/BlockRenderer";
import MetaPixel from "@/components/landing/MetaPixel";

// Campaign content changes mid-flight, so never serve a stale page.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Fetch the page plus the shared library content its blocks may need. */
async function getLandingPage(slug: string) {
  const page = await db.landingPage.findUnique({ where: { slug } });
  if (!page || !page.isPublished) return null;
  return page;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) {
    return { title: "Page Not Found — Lala Stories" };
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: `https://lalastories.com/lp/${page.slug}` },
    openGraph: {
      type: "website",
      siteName: "Lala Stories",
      url: `https://lalastories.com/lp/${page.slug}`,
      title: page.seoTitle,
      description: page.seoDescription,
      ...(page.ogImageUrl ? { images: [{ url: page.ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      ...(page.ogImageUrl ? { images: [page.ogImageUrl] } : {}),
    },
    // Ad landing pages shouldn't compete with the main site in search.
    robots: { index: false, follow: true },
  };
}

export default async function LandingPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) notFound();

  const blocks = parseBlocks(page.blocks);

  // Only query shared tables the page actually uses.
  const needsStories = blocks.some((b) => b.enabled && b.type === "stories");
  const needsTestimonials = blocks.some(
    (b) => b.enabled && b.type === "testimonials" && (b.data as { useExisting?: boolean }).useExisting
  );
  const needsFaqs = blocks.some(
    (b) => b.enabled && b.type === "faq" && (b.data as { useExisting?: boolean }).useExisting
  );

  const [storyRows, testimonialRows, faqRows] = await Promise.all([
    needsStories ? db.story.findMany({ orderBy: { createdAt: "desc" }, take: 12 }) : Promise.resolve([]),
    needsTestimonials
      ? db.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 12 })
      : Promise.resolve([]),
    needsFaqs ? db.fAQ.findMany({ orderBy: { order: "asc" }, take: 20 }) : Promise.resolve([]),
  ]);

  const stories: Story[] = storyRows.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    durationText: s.durationText,
    ageRange: s.ageRange,
    badge: (s.badge || "New") as Story["badge"],
    imageSrc: s.imageSrc,
    audioSrc: s.audioSrc,
  }));

  const testimonials: Testimonial[] = testimonialRows.map((t) => ({
    id: t.id,
    text: t.text,
    avatarLetter: t.avatarLetter,
    authorName: t.authorName,
    authorRole: t.authorRole,
  }));

  const faqs: FAQItem[] = faqRows.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  // Count the visit. Failure here must never break the page for ad traffic.
  db.landingPage
    .update({ where: { id: page.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return (
    // The dark colour lives on this wrapper as well as the fixed background
    // layer, so mobile overscroll never flashes the white site body.
    <div className="relative min-h-screen bg-[#0F0826]">
      <MetaPixel pixelId={page.metaPixelId} />

      <LandingBackground
        type={page.bgType}
        imageUrl={page.bgImageUrl}
        videoUrl={page.bgVideoUrl}
        overlay={page.bgOverlay}
      />

      <main className="relative min-h-screen w-full overflow-x-hidden font-body">
        {/* Minimal header — a landing page keeps the only exit as the CTA. */}
        <header className="relative z-10 flex items-center justify-center px-5 pt-8">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/assets/images/LALA logo- PNG.png"
              alt="Lala Stories"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </header>

        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            landingPageId={page.id}
            campaignName={page.name}
            stories={stories}
            testimonials={testimonials}
            faqs={faqs}
          />
        ))}

        <footer className="relative z-10 border-t border-white/10 px-5 py-10 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Lala Stories. All rights reserved.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/35">
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/70">
              Terms
            </Link>
            <Link href="/" className="transition-colors hover:text-white/70">
              Main Site
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

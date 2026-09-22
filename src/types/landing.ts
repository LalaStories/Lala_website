/**
 * Landing page block definitions.
 *
 * A landing page stores its layout as a JSON array of Block objects in
 * LandingPage.blocks. The admin builder writes this shape; the public
 * renderer at /lp/[slug] reads it. Keep the two in sync via this file.
 */

// --- Call to action ---------------------------------------------------

export type CtaType =
  | "form" // scroll down to the lead form block
  | "whatsapp" // wa.me click-to-chat
  | "call" // tel: click-to-call
  | "appstore" // external app store / download link
  | "internal" // another page on this site, e.g. /premium
  | "external"; // any other URL

export interface Cta {
  label: string;
  type: CtaType;
  /** Phone number, URL or path — meaning depends on `type`. Unused for "form". */
  value: string;
  /** Prefilled text, WhatsApp only. */
  message?: string;
}

export const CTA_TYPE_LABELS: Record<CtaType, string> = {
  form: "Scroll to lead form",
  whatsapp: "WhatsApp chat",
  call: "Phone call",
  appstore: "App store / download",
  internal: "Page on this site",
  external: "External link",
};

/** Placeholder shown in the admin for each CTA type's value field. */
export const CTA_VALUE_PLACEHOLDER: Record<CtaType, string> = {
  form: "— not needed —",
  whatsapp: "919876543210 (country code, no +)",
  call: "+919876543210",
  appstore: "https://play.google.com/store/apps/details?id=...",
  internal: "/premium",
  external: "https://example.com",
};

/**
 * Resolve a CTA into an href. Returns null for "form", which is handled
 * as an in-page scroll rather than a link.
 */
export function ctaHref(cta: Cta): string | null {
  const value = (cta.value || "").trim();
  switch (cta.type) {
    case "form":
      return null;
    case "whatsapp": {
      const digits = value.replace(/[^\d]/g, "");
      if (!digits) return null;
      const text = cta.message ? `?text=${encodeURIComponent(cta.message)}` : "";
      return `https://wa.me/${digits}${text}`;
    }
    case "call":
      return value ? `tel:${value.replace(/\s/g, "")}` : null;
    case "internal":
      return value.startsWith("/") ? value : `/${value}`;
    case "appstore":
    case "external":
      return value || null;
    default:
      return null;
  }
}

/** External CTAs open in a new tab; in-site ones do not. */
export function ctaOpensNewTab(cta: Cta): boolean {
  return cta.type === "appstore" || cta.type === "external";
}

// --- Lead form fields -------------------------------------------------

export type LeadFieldType = "text" | "tel" | "email" | "number" | "select" | "textarea";

export interface LeadField {
  id: string;
  label: string;
  type: LeadFieldType;
  required: boolean;
  /** Comma-separated choices, "select" only. */
  options?: string;
  placeholder?: string;
}

// --- Blocks -----------------------------------------------------------

export type BlockType =
  | "hero"
  | "stats"
  | "features"
  | "stories"
  | "testimonials"
  | "faq"
  | "leadForm"
  | "video"
  | "gallery"
  | "richText"
  | "cta";

export interface HeroData {
  badge: string;
  headline: string;
  /** Rendered in the accent colour, appended after `headline`. */
  highlight: string;
  subhead: string;
  imageUrl: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  showSecondary: boolean;
  /** "center" | "left" */
  align: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}
export interface StatsData {
  items: StatItem[];
}

export interface FeatureItem {
  id: string;
  icon: string; // emoji
  title: string;
  text: string;
}
export interface FeaturesData {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

/** Pulls live rows from the Story table so stories stay in one place. */
export interface StoriesData {
  title: string;
  subtitle: string;
  limit: number;
}

export interface TestimonialItem {
  id: string;
  text: string;
  authorName: string;
  authorRole: string;
  avatarLetter: string;
}
export interface TestimonialsData {
  title: string;
  subtitle: string;
  /** Use the shared Testimonial table instead of `items`. */
  useExisting: boolean;
  limit: number;
  items: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
export interface FaqData {
  title: string;
  subtitle: string;
  /** Use the shared FAQ table instead of `items`. */
  useExisting: boolean;
  items: FaqItem[];
}

export interface LeadFormData {
  title: string;
  subtitle: string;
  fields: LeadField[];
  buttonLabel: string;
  consentText: string;
  successTitle: string;
  successMessage: string;
}

export interface VideoData {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}
export interface GalleryData {
  title: string;
  subtitle: string;
  items: GalleryItem[];
}

export interface RichTextData {
  title: string;
  body: string;
}

export interface CtaData {
  headline: string;
  text: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  showSecondary: boolean;
}

export type BlockData =
  | HeroData
  | StatsData
  | FeaturesData
  | StoriesData
  | TestimonialsData
  | FaqData
  | LeadFormData
  | VideoData
  | GalleryData
  | RichTextData
  | CtaData;

export interface Block {
  id: string;
  type: BlockType;
  enabled: boolean;
  data: BlockData;
}

// --- Block catalogue (drives the "Add section" menu) ------------------

export const BLOCK_META: Record<BlockType, { label: string; icon: string; description: string }> = {
  hero: { label: "Hero", icon: "★", description: "Headline, subtext and main call-to-action" },
  stats: { label: "Stats Bar", icon: "▤", description: "Social-proof numbers in a row" },
  features: { label: "Features", icon: "◈", description: "Benefit cards in a grid" },
  stories: { label: "Stories", icon: "♪", description: "Live story cards from your library" },
  testimonials: { label: "Testimonials", icon: "❝", description: "Parent reviews and quotes" },
  faq: { label: "FAQ", icon: "?", description: "Expandable question list" },
  leadForm: { label: "Lead Form", icon: "✎", description: "Capture name, phone and custom fields" },
  video: { label: "Video", icon: "▶", description: "Embedded video player" },
  gallery: { label: "Gallery", icon: "▦", description: "Image grid" },
  richText: { label: "Text Block", icon: "¶", description: "Heading plus paragraphs" },
  cta: { label: "Closing CTA", icon: "➜", description: "Final conversion prompt" },
};

/** Order the "Add section" menu presents blocks in. */
export const BLOCK_ORDER: BlockType[] = [
  "hero",
  "stats",
  "features",
  "leadForm",
  "stories",
  "testimonials",
  "video",
  "gallery",
  "faq",
  "richText",
  "cta",
];

// --- Defaults ---------------------------------------------------------

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const emptyCta = (label: string, type: CtaType = "form"): Cta => ({
  label,
  type,
  value: "",
  message: "",
});

/** Sensible starting content for a freshly added block. */
export function defaultBlockData(type: BlockType): BlockData {
  switch (type) {
    case "hero":
      return {
        badge: "Limited Time Offer",
        headline: "Bedtime Stories That",
        highlight: "Kids Actually Love",
        subhead:
          "3000+ magical audio stories for ages 3–10. Screen-free, calming, and built to grow vocabulary while they drift off.",
        imageUrl: "",
        primaryCta: { ...emptyCta("Start Free Tonight", "form") },
        secondaryCta: { ...emptyCta("Chat on WhatsApp", "whatsapp") },
        showSecondary: false,
        align: "center",
      } satisfies HeroData;

    case "stats":
      return {
        items: [
          { id: newId(), value: "3000+", label: "Stories" },
          { id: newId(), value: "50K+", label: "Happy Kids" },
          { id: newId(), value: "4.8★", label: "Parent Rating" },
        ],
      } satisfies StatsData;

    case "features":
      return {
        title: "Why Parents Choose Lala",
        subtitle: "Built with sleep experts and storytellers.",
        items: [
          { id: newId(), icon: "🌙", title: "Better Sleep", text: "Calming narration that settles little minds in minutes." },
          { id: newId(), icon: "📚", title: "Richer Vocabulary", text: "Every story is written to grow language naturally." },
          { id: newId(), icon: "📵", title: "Screen-Free", text: "Audio only — imagination does the rest, no blue light." },
        ],
      } satisfies FeaturesData;

    case "stories":
      return { title: "Tonight's Favourites", subtitle: "A taste of what's inside.", limit: 3 } satisfies StoriesData;

    case "testimonials":
      return {
        title: "Loved by Parents",
        subtitle: "",
        useExisting: true,
        limit: 3,
        items: [],
      } satisfies TestimonialsData;

    case "faq":
      return { title: "Questions, Answered", subtitle: "", useExisting: true, items: [] } satisfies FaqData;

    case "leadForm":
      return {
        title: "Get Your Free Trial",
        subtitle: "Drop your details and we'll send the link straight to your phone.",
        fields: [
          { id: newId(), label: "Child's Age", type: "select", required: false, options: "3-4, 5-6, 7-8, 9-10", placeholder: "" },
        ],
        buttonLabel: "Send Me The Link",
        consentText: "We'll only use your number to send the trial link. No spam, ever.",
        successTitle: "You're all set! 🎉",
        successMessage: "Check your phone — the free trial link is on its way.",
      } satisfies LeadFormData;

    case "video":
      return { title: "See It In Action", subtitle: "", videoUrl: "", posterUrl: "" } satisfies VideoData;

    case "gallery":
      return { title: "Inside The App", subtitle: "", items: [] } satisfies GalleryData;

    case "richText":
      return {
        title: "About Lala Stories",
        body: "Write a paragraph here.\n\nBlank lines start a new paragraph.",
      } satisfies RichTextData;

    case "cta":
      return {
        headline: "Ready For A Calmer Bedtime?",
        text: "Join thousands of families who've made bedtime the best part of the day.",
        primaryCta: { ...emptyCta("Start Free Tonight", "form") },
        secondaryCta: { ...emptyCta("Download The App", "appstore") },
        showSecondary: false,
      } satisfies CtaData;
  }
}

export function createBlock(type: BlockType): Block {
  return { id: newId(), type, enabled: true, data: defaultBlockData(type) };
}

/**
 * Parse the stored JSON defensively — a malformed or hand-edited value
 * must never crash a live campaign page.
 */
export function parseBlocks(raw: string | null | undefined): Block[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is Block =>
        !!b && typeof b === "object" && typeof b.id === "string" && typeof b.type === "string" && !!b.data
    );
  } catch {
    return [];
  }
}

/** A starter page so "New Page" lands on something presentable. */
export function starterBlocks(): Block[] {
  return [
    createBlock("hero"),
    createBlock("stats"),
    createBlock("features"),
    createBlock("leadForm"),
    createBlock("testimonials"),
    createBlock("faq"),
    createBlock("cta"),
  ];
}

/** Slugify a campaign name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

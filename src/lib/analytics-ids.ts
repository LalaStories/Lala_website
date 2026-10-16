/**
 * Site-wide analytics IDs. Same convention as src/lib/meta-pixel.ts: the
 * NEXT_PUBLIC_* variable overrides at build time, and an unset OR empty
 * value falls back to the hardcoded Lala Stories ID, because the Dockerfile
 * always defines these variables (as "" when no build arg is passed).
 */

/** Microsoft Clarity project ID (clarity.microsoft.com → Settings → Overview). */
export const SITE_CLARITY_PROJECT_ID: string =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "yyjtedvipj";

/**
 * Google Analytics 4 Measurement ID
 * (analytics.google.com → Admin → Data streams → Web; stream 16141366670).
 */
export const SITE_GA_MEASUREMENT_ID: string =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-6HLH3Y2Y17";

/**
 * Google Ads conversion ID, e.g. "AW-123456789"
 * (ads.google.com → Goals → Conversions → a conversion → Tag setup).
 *
 * Optional. When set, the same Google tag is configured for Ads too, so
 * remarketing audiences fill and conversions imported from GA4 attribute
 * correctly. Empty means the Ads account is not tagged yet.
 */
export const SITE_GOOGLE_ADS_ID: string =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

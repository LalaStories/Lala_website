/**
 * Site-wide Meta (Facebook) Pixel ID.
 *
 * NEXT_PUBLIC_META_PIXEL_ID overrides it at build time. Unset OR empty falls
 * back to the Lala Stories pixel, because the Dockerfile always defines the
 * variable (as "" when no build arg is passed) and an empty value must not
 * silently disable tracking in production.
 */
export const SITE_META_PIXEL_ID: string =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1204980414756789";

/**
 * Site-wide Meta (Facebook) Pixel ID.
 *
 * NEXT_PUBLIC_META_PIXEL_ID overrides it at build time; the fallback is the
 * Lala Stories pixel so a plain `npm run build` tracks out of the box.
 * Set it to an empty string to disable the pixel (e.g. on staging).
 */
export const SITE_META_PIXEL_ID: string =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1204980414756789";

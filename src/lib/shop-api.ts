import type {
  ShopHomeData,
  ShopProduct,
  ShopProductType,
  ShopSubscriptionInfo,
} from "@/types/shop";

// Server-side only: keeps the upstream origin out of the client bundle and
// avoids CORS. Overridable per environment without a code change.
const SHOP_API_BASE_URL =
  process.env.SHOP_API_BASE_URL?.replace(/\/+$/, "") ||
  "https://cpanel.lalastories.com";

const FETCH_TIMEOUT_MS = 10_000;
const REVALIDATE_SECONDS = 300;

// Upper bounds so a compromised or buggy upstream can't blow up render
// time or page size.
const MAX_ITEMS = 100;
const MAX_TEXT_LENGTH = 300;
const MAX_NOTE_LENGTH = 600;

function asText(value: unknown, maxLength = MAX_TEXT_LENGTH): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

// Only https URLs may reach an <img src>; rejects javascript:/data:/etc.
function asHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

// Type colors are rendered via inline styles, so only accept hex literals.
function asHexColor(value: unknown): string | null {
  return typeof value === "string" && /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
    ? value
    : null;
}

function asSlug(value: unknown): string {
  const text = asText(value, 120);
  return /^[a-z0-9][a-z0-9-_]*$/i.test(text) ? text : "";
}

function asIsoDate(value: unknown): string | null {
  const text = asText(value, 40);
  if (!text) return null;
  const time = Date.parse(text);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseType(raw: unknown): ShopProductType | null {
  if (!isRecord(raw)) return null;
  const id = asFiniteNumber(raw.id);
  const name = asText(raw.name, 80);
  const slug = asSlug(raw.slug);
  if (id === null || !name || !slug) return null;
  return { id, name, slug, color: asHexColor(raw.color) };
}

function parseSubscription(raw: unknown): ShopSubscriptionInfo | null {
  if (!isRecord(raw)) return null;
  const title = asText(raw.title, 120);
  if (!title) return null;
  const qty = asFiniteNumber(raw.qty) ?? 1;
  return {
    planId: asFiniteNumber(raw.plan_id),
    title,
    durationLabel: asText(raw.duration_label, 80),
    qty: Math.min(Math.max(Math.round(qty), 1), 99),
    platformNote: asText(raw.platform_note, MAX_NOTE_LENGTH),
  };
}

function parseProduct(raw: unknown): ShopProduct | null {
  if (!isRecord(raw)) return null;
  const id = asFiniteNumber(raw.id);
  const title = asText(raw.title, 160);
  const price = asFiniteNumber(raw.price);
  if (id === null || !title || price === null || price < 0) return null;

  const mrp = asFiniteNumber(raw.mrp);
  const discount = asFiniteNumber(raw.discount_percent) ?? 0;
  const qty = asFiniteNumber(raw.available_qty) ?? 0;

  return {
    id,
    title,
    slug: asSlug(raw.slug),
    type: parseType(raw.type),
    coverImage: asHttpsUrl(raw.cover_image),
    price,
    pricePrefix: asText(raw.price_prefix, 20),
    mrp: mrp !== null && mrp > price ? mrp : null,
    discountPercent: Math.min(Math.max(Math.round(discount), 0), 100),
    isOnOffer: raw.is_on_offer === true,
    offerEndsAt: asIsoDate(raw.offer_ends_at),
    hasVariants: raw.has_variants === true,
    isBundle: raw.is_bundle === true,
    inStock: raw.in_stock === true,
    availableQty: Math.max(Math.round(qty), 0),
    includesSubscription: raw.includes_subscription === true,
    subscription: parseSubscription(raw.subscription),
  };
}

function parseList<T>(raw: unknown, parse: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_ITEMS)
    .map(parse)
    .filter((item): item is T => item !== null);
}

/**
 * Fetches the public shop-home feed. Returns null on any upstream failure
 * (timeout, non-2xx, malformed payload) so the page can render a fallback
 * instead of crashing.
 */
export async function getShopHome(): Promise<ShopHomeData | null> {
  try {
    const res = await fetch(`${SHOP_API_BASE_URL}/api/public/shop-home`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`shop-home API responded ${res.status}`);
      return null;
    }

    const payload: unknown = await res.json();
    if (!isRecord(payload) || payload.ErrorCode !== 0 || !isRecord(payload.Data)) {
      console.error("shop-home API returned an unexpected payload shape");
      return null;
    }

    return {
      types: parseList(payload.Data.types, parseType),
      onOffer: parseList(payload.Data.on_offer, parseProduct),
      latest: parseList(payload.Data.latest, parseProduct),
    };
  } catch (error) {
    console.error("shop-home API request failed", error);
    return null;
  }
}

/** Every product in the feed, deduped by id, offers first. */
export function collectProducts(shop: ShopHomeData): ShopProduct[] {
  const seen = new Map<number, ShopProduct>();
  for (const product of [...shop.onOffer, ...shop.latest]) {
    if (!seen.has(product.id)) seen.set(product.id, product);
  }
  return Array.from(seen.values());
}

/**
 * Looks a product up by slug. The upstream API exposes no per-product
 * endpoint, so detail pages are served from the shop-home feed: only
 * products listed there can resolve.
 */
export async function getShopProduct(
  slug: string
): Promise<{ product: ShopProduct; related: ShopProduct[] } | null> {
  const safeSlug = asSlug(slug);
  if (!safeSlug) return null;

  const shop = await getShopHome();
  if (!shop) return null;

  const products = collectProducts(shop);
  const product = products.find(
    (item) => item.slug.toLowerCase() === safeSlug.toLowerCase()
  );
  if (!product) return null;

  const related = products
    .filter(
      (item) => item.id !== product.id && item.type?.id === product.type?.id
    )
    .slice(0, 3);

  return { product, related };
}

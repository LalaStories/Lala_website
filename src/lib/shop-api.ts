import type {
  ShopBundleItem,
  ShopHomeData,
  ShopProduct,
  ShopProductDetail,
  ShopProductDetailRow,
  ShopProductType,
  ShopProductVariant,
  ShopSubscriptionInfo,
} from "@/types/shop";
import { SHOP_API_BASE_URL } from "@/lib/shop-origin";

// Server-side only: keeps the upstream origin out of the client bundle and
// avoids CORS. Overridable per environment without a code change.

const FETCH_TIMEOUT_MS = 10_000;
const REVALIDATE_SECONDS = 300;

// Upper bounds so a compromised or buggy upstream can't blow up render
// time or page size.
const MAX_ITEMS = 100;
const MAX_TEXT_LENGTH = 300;
const MAX_NOTE_LENGTH = 600;
const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_IMAGES = 12;

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

function firstText(raw: Record<string, unknown>, keys: string[], max: number): string {
  for (const key of keys) {
    const value = asText(raw[key], max);
    if (value) return value;
  }
  return "";
}

// The feed documents `details` loosely; accept "text", {label,value} and
// close cousins, and drop anything else rather than render junk.
function parseDetailRow(raw: unknown): ShopProductDetailRow | null {
  if (typeof raw === "string") {
    const value = asText(raw, MAX_NOTE_LENGTH);
    return value ? { label: "", value } : null;
  }
  if (!isRecord(raw)) return null;
  const label = firstText(raw, ["label", "key", "title", "name"], 120);
  const rawValue = raw.value ?? raw.text ?? raw.description;
  const value =
    typeof rawValue === "number" && Number.isFinite(rawValue)
      ? String(rawValue)
      : asText(rawValue, MAX_NOTE_LENGTH);
  if (!label && !value) return null;
  return { label, value };
}

function parseVariant(raw: unknown): ShopProductVariant | null {
  if (!isRecord(raw)) return null;
  const name = firstText(raw, ["name", "title", "label"], 120);
  if (!name) return null;
  return {
    id: asFiniteNumber(raw.id),
    name,
    price: asFiniteNumber(raw.price),
    mrp: asFiniteNumber(raw.mrp),
    inStock: typeof raw.in_stock === "boolean" ? raw.in_stock : null,
  };
}

function parseBundleItem(raw: unknown): ShopBundleItem | null {
  if (!isRecord(raw)) return null;
  const title = firstText(raw, ["title", "name"], 160);
  if (!title) return null;
  const qty = asFiniteNumber(raw.qty) ?? asFiniteNumber(raw.quantity) ?? 1;
  return {
    id: asFiniteNumber(raw.id) ?? asFiniteNumber(raw.product_id),
    title,
    qty: Math.min(Math.max(Math.round(qty), 1), 99),
    coverImage: asHttpsUrl(raw.cover_image ?? raw.image),
  };
}

function parseImages(raw: unknown, cover: string | null): string[] {
  const seen = new Set<string>();
  const images: string[] = [];
  const push = (value: unknown) => {
    const url = asHttpsUrl(value);
    if (url && !seen.has(url) && images.length < MAX_IMAGES) {
      seen.add(url);
      images.push(url);
    }
  };
  push(cover);
  if (Array.isArray(raw)) {
    for (const item of raw) {
      // Some feeds wrap each image as { url } instead of a bare string.
      push(isRecord(item) ? item.url ?? item.src ?? item.image : item);
    }
  }
  return images;
}

/** The feed's card data padded to the detail shape, used when the detail call fails. */
function withEmptyDetail(product: ShopProduct): ShopProductDetail {
  return {
    ...product,
    description: "",
    images: product.coverImage ? [product.coverImage] : [],
    details: [],
    variants: [],
    bundleItems: [],
  };
}

function parseProductDetail(raw: unknown): ShopProductDetail | null {
  const product = parseProduct(raw);
  if (!product || !isRecord(raw)) return null;
  return {
    ...product,
    description: asText(raw.description, MAX_DESCRIPTION_LENGTH),
    images: parseImages(raw.images, product.coverImage),
    details: parseList(raw.details, parseDetailRow),
    variants: parseList(raw.variants, parseVariant),
    bundleItems: parseList(raw.bundle_items, parseBundleItem),
  };
}

/**
 * Fetches one product's full record (description, gallery, variants, bundle
 * contents) from the product-detail endpoint, which is keyed by numeric id
 * only. Returns null on any failure so callers can fall back to feed data.
 */
export async function getShopProductDetail(id: number): Promise<ShopProductDetail | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const res = await fetch(
      `${SHOP_API_BASE_URL}/api/public/product-detail?id=${encodeURIComponent(id)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      }
    );
    if (!res.ok) {
      console.error(`product-detail API responded ${res.status} for id ${id}`);
      return null;
    }

    const payload: unknown = await res.json();
    // The API reports "not found" as ErrorCode 1 with a 200, not as a 404.
    if (!isRecord(payload) || payload.ErrorCode !== 0 || !isRecord(payload.Data)) {
      console.error(`product-detail API returned no product for id ${id}`);
      return null;
    }
    return parseProductDetail(payload.Data);
  } catch (error) {
    console.error(`product-detail API request failed for id ${id}`, error);
    return null;
  }
}

/**
 * Looks a product up by slug. The detail endpoint only takes an id, so the
 * slug is first resolved through the shop-home feed: only products listed
 * there can resolve. The feed's card data is the fallback if the detail
 * call fails, so the page still renders with the cover image.
 */
export async function getShopProduct(
  slug: string
): Promise<{ product: ShopProductDetail; related: ShopProduct[] } | null> {
  const safeSlug = asSlug(slug);
  if (!safeSlug) return null;

  const shop = await getShopHome();
  if (!shop) return null;

  const products = collectProducts(shop);
  const listed = products.find(
    (item) => item.slug.toLowerCase() === safeSlug.toLowerCase()
  );
  if (!listed) return null;

  const detail = await getShopProductDetail(listed.id);
  const product = detail ?? withEmptyDetail(listed);

  const related = products
    .filter(
      (item) => item.id !== product.id && item.type?.id === product.type?.id
    )
    .slice(0, 3);

  return { product, related };
}

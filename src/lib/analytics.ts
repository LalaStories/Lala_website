/**
 * One call reports a user action to every analytics tool on the page:
 * Google Analytics 4 (gtag) and Microsoft Clarity. The Meta Pixel keeps its
 * own vocabulary (Lead, Purchase…) and is reported separately through
 * trackPixel, so campaign optimisation isn't tied to GA event names.
 *
 * Every function here is safe to call anywhere: on the server or before a
 * tag has loaded it simply does nothing (gtag queues into dataLayer, which
 * the tag drains when it arrives).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/** GA4 item shape, used by the ecommerce events (view_item, purchase…). */
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

export type AnalyticsParams = Record<string, unknown>;

/**
 * Events worth a full Clarity session recording. Clarity samples recordings;
 * "upgrade" asks it to keep this one, so conversions can always be replayed.
 */
const CLARITY_UPGRADE_EVENTS = new Set([
  "purchase",
  "generate_lead",
  "redeem_complete",
  "begin_checkout",
]);

export const CURRENCY = "INR";

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  } else {
    // gtag.js replays everything pushed before it loaded.
    window.dataLayer.push(args);
  }
}

/** Send one event to GA4 and Clarity. Names follow GA4's snake_case. */
export function trackEvent(name: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;

  gtag("event", name, {
    ...params,
    // Lets Explorations split conversions by the page they happened on.
    source_page: window.location.pathname,
  });

  if (typeof window.clarity === "function") {
    // Clarity custom events carry a name only; the recording has the rest.
    window.clarity("event", name);
    if (CLARITY_UPGRADE_EVENTS.has(name)) window.clarity("upgrade", name);
  }
}

/** Report a client-side route change to GA4 as a page_view. */
export function trackPageView(url: string) {
  if (typeof window === "undefined") return;
  gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Build a GA4 item from a shop product for the ecommerce events. */
export function shopItem(
  product: {
    id: number;
    title: string;
    price: number;
    type?: { name: string } | null;
  },
  quantity = 1
): AnalyticsItem {
  return {
    item_id: String(product.id),
    item_name: product.title,
    ...(product.type?.name ? { item_category: product.type.name } : {}),
    price: product.price,
    quantity,
  };
}

/** Sum of price × quantity over a list of items, for the `value` parameter. */
export function itemsValue(items: AnalyticsItem[]): number {
  return items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
}

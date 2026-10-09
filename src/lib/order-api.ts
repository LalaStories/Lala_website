import type {
  OrderFieldErrors,
  OrderItemPayload,
  PlaceOrderPayload,
  PlacedOrder,
} from "@/types/order";
import type { ShopProduct } from "@/types/shop";
import { collectProducts, getShopHome } from "@/lib/shop-api";
import { SHOP_API_BASE_URL } from "@/lib/shop-origin";

// Server-side only. Same origin as the catalog feed.

const PLACE_ORDER_TIMEOUT_MS = 20_000;

// Documented limits for POST /api/public/place-order.
const MAX_LINES = 50;
const MAX_QTY = 99;
const FIELD_LIMITS = {
  name: 120,
  line1: 255,
  line2: 255,
  city: 100,
  state: 100,
} as const;

// Mirrors the upstream throttle (6/min per IP, 4/min per phone) so abusive
// traffic is stopped here instead of burning the shared quota. In-memory, so
// it resets on deploy and is per-container — a backstop, not the real limit.
const RATE_LIMITS = { ip: 6, phone: 4 } as const;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function text(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function digits(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

export interface RawBasketLine {
  productId: number;
  qty: number;
}

/** Basket lines as the browser sent them — ids and quantities only. */
export function parseBasket(raw: FormDataEntryValue | null): RawBasketLine[] {
  if (typeof raw !== "string" || !raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.slice(0, MAX_LINES).flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { productId, qty } = entry as Record<string, unknown>;
    if (!Number.isInteger(productId) || !Number.isInteger(qty)) return [];
    return [{ productId: productId as number, qty: qty as number }];
  });
}

export interface ValidatedOrder {
  payload: PlaceOrderPayload;
  products: { product: ShopProduct; qty: number }[];
}

export type ValidationResult =
  | { ok: true; value: ValidatedOrder }
  | { ok: false; message: string; fieldErrors: OrderFieldErrors };

function fail(message: string, fieldErrors: OrderFieldErrors = {}): ValidationResult {
  return { ok: false, message, fieldErrors };
}

/**
 * Validates a submitted order against the documented rules *and* the live
 * catalog. The browser only supplies product ids and quantities; everything
 * priced or ordered is re-read server-side, so a tampered basket cannot
 * change what is actually bought.
 */
export async function validateOrder(formData: FormData): Promise<ValidationResult> {
  const basket = parseBasket(formData.get("items"));
  if (basket.length === 0) {
    return fail("Your basket is empty.", { items: "Add at least one product." });
  }
  if (basket.length > MAX_LINES) {
    return fail(`An order can hold at most ${MAX_LINES} different products.`, {
      items: `Too many products (max ${MAX_LINES}).`,
    });
  }

  const shop = await getShopHome();
  if (!shop) {
    return fail("We couldn't reach the shop just now. Please try again in a moment.");
  }
  const catalog = new Map(collectProducts(shop).map((p) => [p.id, p]));

  const items: OrderItemPayload[] = [];
  const products: { product: ShopProduct; qty: number }[] = [];

  for (const line of basket) {
    const product = catalog.get(line.productId);
    if (!product) {
      return fail("A product in your basket is no longer available.", {
        items: "Please remove unavailable items and try again.",
      });
    }
    if (!product.inStock) {
      return fail(`"${product.title}" is out of stock.`, {
        items: "Please remove out-of-stock items and try again.",
      });
    }
    if (line.qty < 1 || line.qty > MAX_QTY) {
      return fail(`Quantity for "${product.title}" must be between 1 and ${MAX_QTY}.`, {
        items: "Check the quantities in your basket.",
      });
    }
    if (product.availableQty > 0 && line.qty > product.availableQty) {
      return fail(
        `Only ${product.availableQty} of "${product.title}" are available.`,
        { items: "Reduce the quantity and try again." }
      );
    }
    // The API requires variant_id for products that have variants, but the
    // public catalog exposes no variant list to choose from.
    if (product.hasVariants) {
      return fail(
        `"${product.title}" comes in options that can't be picked online yet — please contact us to order it.`,
        { items: "Remove this product to continue." }
      );
    }

    // variant_id is deliberately omitted: the API rejects it for products
    // without variants.
    items.push({ product_id: product.id, qty: line.qty });
    products.push({ product, qty: line.qty });
  }

  const name = text(formData.get("name"), FIELD_LIMITS.name);
  const phone = digits(formData.get("phone"));
  const line1 = text(formData.get("line1"), FIELD_LIMITS.line1);
  const line2 = text(formData.get("line2"), FIELD_LIMITS.line2);
  const city = text(formData.get("city"), FIELD_LIMITS.city);
  const state = text(formData.get("state"), FIELD_LIMITS.state);
  const pincode = digits(formData.get("pincode"));
  const email = text(formData.get("email"), 160);

  const fieldErrors: OrderFieldErrors = {};
  if (!name) fieldErrors.name = "Enter the name for delivery.";
  if (phone.length !== 10) fieldErrors.phone = "Enter a 10-digit mobile number.";
  if (!line1) fieldErrors.line1 = "Enter the street address.";
  if (!city) fieldErrors.city = "Enter the city.";
  if (!state) fieldErrors.state = "Enter the state.";
  if (pincode.length !== 6) fieldErrors.pincode = "Enter a 6-digit PIN code.";
  // Optional, but a typo means no confirmation and no tracking link.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    fieldErrors.email = "Enter a valid email address, or leave it blank.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please check the highlighted fields.", fieldErrors);
  }

  // A basket containing a subscription needs a verification_token, whose
  // issuing flow is not documented to us yet.
  const subscriptionItem = products.find((p) => p.product.includesSubscription);
  if (subscriptionItem) {
    return fail(
      `"${subscriptionItem.product.title}" includes an app subscription, which needs phone verification we haven't enabled online yet. Please contact us to order it.`,
      { items: "Remove this product to continue." }
    );
  }

  const payload: PlaceOrderPayload = {
    items,
    address: {
      name,
      phone,
      line1,
      ...(line2 ? { line2 } : {}),
      city,
      state,
      pincode,
    },
    ...(email ? { email } : {}),
  };

  return { ok: true, value: { payload, products } };
}

/** A single line the shop refused, as reported in Data.errors. */
export interface OrderItemIssue {
  productId: number;
  reason: string;
  availableQty: number | null;
}

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | {
      ok: false;
      message: string;
      retryable: boolean;
      itemIssues?: OrderItemIssue[];
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseItemIssues(data: unknown): OrderItemIssue[] {
  if (!isRecord(data) || !Array.isArray(data.errors)) return [];
  return data.errors.slice(0, MAX_LINES).flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const productId = entry.product_id;
    if (typeof productId !== "number" || !Number.isFinite(productId)) return [];
    const availableQty = entry.available_qty;
    return [
      {
        productId,
        reason:
          typeof entry.reason === "string" ? entry.reason.trim().slice(0, 80) : "",
        availableQty:
          typeof availableQty === "number" && Number.isFinite(availableQty)
            ? availableQty
            : null,
      },
    ];
  });
}

/**
 * Reads the order out of the place-order response.
 *
 * The shape was confirmed from a live order:
 *   { order_id, order_number, track_token, subtotal, shipping_fee, total,
 *     reserved_until, razorpay: { ... } }
 *
 * Razorpay's own handle lives in the nested `razorpay` object and is a
 * string like "order_ABC123", while the shop's order_id is numeric — so the
 * two are told apart by type as well as by where they sit.
 */
function readPlacedOrder(data: unknown): {
  reference: string | null;
  orderId: number | null;
  razorpayOrderId: string | null;
  amount: number | null;
  razorpayKey: string | null;
  currency: string | null;
} {
  const root = isRecord(data) ? data : {};
  const nested = isRecord(root.order) ? root.order : null;
  const razorpay = isRecord(root.razorpay) ? root.razorpay : null;

  let reference: string | null = null;
  let orderId: number | null = null;
  let razorpayOrderId: string | null = null;

  for (const scope of [root, nested].filter(isRecord)) {
    for (const key of ["order_number", "order_no", "reference"]) {
      const value = scope[key];
      if (reference === null && typeof value === "string" && value.trim()) {
        reference = value.trim().slice(0, 64);
      }
    }
    for (const key of ["order_id", "id"]) {
      const value = scope[key];
      if (orderId === null && typeof value === "number" && Number.isInteger(value)) {
        orderId = value;
      }
    }
  }

  // Razorpay ids are always strings prefixed "order_", so this can never
  // pick up the shop's numeric id by mistake.
  for (const scope of [razorpay, root].filter(isRecord)) {
    for (const key of ["order_id", "id", "razorpay_order_id", "razorpay_id", "rzp_order_id"]) {
      const value = scope[key];
      if (
        razorpayOrderId === null &&
        typeof value === "string" &&
        value.trim().startsWith("order_")
      ) {
        razorpayOrderId = value.trim().slice(0, 64);
      }
    }
  }

  // Only ever the amount Razorpay itself reports, which is in paise. The
  // top-level `total` is in rupees and would show a figure 100x too small.
  const razorpayAmount = razorpay?.amount;
  const amount =
    typeof razorpayAmount === "number" && Number.isFinite(razorpayAmount)
      ? razorpayAmount
      : null;

  // The shop reports the account that holds this order; trusting it keeps
  // test orders on test keys and live orders on live keys.
  const keyRaw = razorpay?.key;
  const razorpayKey =
    typeof keyRaw === "string" && /^rzp_(test|live)_[A-Za-z0-9]+$/.test(keyRaw.trim())
      ? keyRaw.trim()
      : null;

  const currencyRaw = razorpay?.currency;
  const currency =
    typeof currencyRaw === "string" && /^[A-Z]{3}$/.test(currencyRaw.trim())
      ? currencyRaw.trim()
      : null;

  if (reference === null && orderId !== null) reference = String(orderId);

  return { reference, orderId, razorpayOrderId, amount, razorpayKey, currency };
}

export async function placeOrder(
  payload: PlaceOrderPayload,
  clientIp: string
): Promise<PlaceOrderResult> {
  if (rateLimited(`ip:${clientIp}`, RATE_LIMITS.ip)) {
    return {
      ok: false,
      retryable: true,
      message: "Too many order attempts. Please wait a minute and try again.",
    };
  }
  if (rateLimited(`phone:${payload.address.phone}`, RATE_LIMITS.phone)) {
    return {
      ok: false,
      retryable: true,
      message:
        "Too many orders from this mobile number. Please wait a minute and try again.",
    };
  }

  try {
    const res = await fetch(`${SHOP_API_BASE_URL}/api/public/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // The upstream throttles per IP; without this every customer would
        // share this server's address.
        "X-Forwarded-For": clientIp,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(PLACE_ORDER_TIMEOUT_MS),
    });

    if (res.status === 429) {
      return {
        ok: false,
        retryable: true,
        message: "Too many order attempts. Please wait a minute and try again.",
      };
    }
    if (!res.ok) {
      console.error(`place-order API responded ${res.status}`);
      return {
        ok: false,
        retryable: true,
        message: "We couldn't place your order just now. Please try again.",
      };
    }

    // Errors come back as HTTP 200 with a non-zero ErrorCode.
    const body: unknown = await res.json();
    if (!isRecord(body)) {
      return {
        ok: false,
        retryable: true,
        message: "We got an unexpected reply from the shop. Please try again.",
      };
    }

    const upstreamMessage =
      typeof body.Message === "string" ? body.Message.trim().slice(0, 300) : "";

    if (body.ErrorCode !== 0) {
      console.error("place-order rejected", body.ErrorCode, upstreamMessage);
      return {
        ok: false,
        retryable: false,
        message: upstreamMessage || "Your order could not be placed.",
        itemIssues: parseItemIssues(body.Data),
      };
    }

    const placed = readPlacedOrder(body.Data);

    // Field names only — never values — so the response shape can be checked
    // without putting a customer's address or phone number in the logs.
    console.info(
      "place-order succeeded:",
      JSON.stringify({
        dataKeys: isRecord(body.Data) ? Object.keys(body.Data) : null,
        razorpayKeys:
          isRecord(body.Data) && isRecord(body.Data.razorpay)
            ? Object.keys(body.Data.razorpay)
            : null,
        matched: {
          orderId: placed.orderId !== null,
          razorpayOrderId: placed.razorpayOrderId !== null,
          amount: placed.amount !== null,
        },
      })
    );

    return {
      ok: true,
      order: {
        ...placed,
        message: upstreamMessage || "Your order has been placed.",
      },
    };
  } catch (error) {
    console.error("place-order request failed", error);
    return {
      ok: false,
      retryable: true,
      message:
        "We couldn't reach the shop to place your order. Please try again in a moment.",
    };
  }
}

export type VerifyPaymentResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

/**
 * Confirms a Razorpay payment with the shop.
 *
 * The four field names below were confirmed against the live endpoint; it
 * rejects camelCase. The signature is checked by the shop backend using the
 * Razorpay key secret, which this app never holds — that check is what makes
 * it safe for these ids to travel back through the browser.
 */
export async function verifyOrderPayment(input: {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<VerifyPaymentResult> {
  try {
    const res = await fetch(`${SHOP_API_BASE_URL}/api/public/verify-order-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        order_id: input.orderId,
        razorpay_order_id: input.razorpayOrderId,
        razorpay_payment_id: input.razorpayPaymentId,
        razorpay_signature: input.razorpaySignature,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(PLACE_ORDER_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`verify-order-payment responded ${res.status}`);
      return {
        ok: false,
        message:
          "We couldn't confirm your payment automatically. Our team will check and contact you.",
      };
    }

    const body: unknown = await res.json();
    if (!isRecord(body)) {
      return {
        ok: false,
        message:
          "We couldn't confirm your payment automatically. Our team will check and contact you.",
      };
    }

    const message =
      typeof body.Message === "string" ? body.Message.trim().slice(0, 300) : "";

    if (body.ErrorCode !== 0) {
      // The money may well have left the customer's account, so this is
      // logged loudly and never phrased as "payment failed".
      console.error("verify-order-payment rejected", body.ErrorCode, message);
      return {
        ok: false,
        message:
          message ||
          "We couldn't confirm your payment automatically. Our team will check and contact you.",
      };
    }

    return { ok: true, message: message || "Payment confirmed." };
  } catch (error) {
    console.error("verify-order-payment request failed", error);
    return {
      ok: false,
      message:
        "We couldn't confirm your payment automatically. Our team will check and contact you.",
    };
  }
}

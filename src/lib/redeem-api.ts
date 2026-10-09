import "server-only";

import type {
  RedeemActionResult,
  RedeemCoupon,
  RedeemGrant,
  RedeemOtpSession,
  RedeemPlan,
  RedeemRazorpayOrder,
  RedeemVerifyOutcome,
} from "@/types/redeem";
import { SHOP_API_BASE_URL } from "@/lib/shop-origin";

/**
 * Server-side client for /api/public/redeem/*.
 *
 * Everything here runs on the server so the shop key never reaches the
 * browser and the upstream origin stays out of the client bundle. Prices,
 * OTPs and Razorpay orders are all decided upstream; this module only
 * relays, validates shapes, and maps errors to messages.
 */


const REDEEM_TIMEOUT_MS = 20_000;
const MAX_MESSAGE_LENGTH = 300;

/** Message shown for anything the visitor cannot fix themselves. */
const GENERIC_ERROR =
  "We couldn't reach the redemption service just now. Please try again in a moment.";
const THROTTLED = "Please wait a minute and try again.";

// Accept the documented 40-character token with some slack for the alphabet,
// but never anything that could carry a path or query.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;
export function isRedeemToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

/**
 * The document says the redeem routes take "the same key and rules as the
 * shop endpoints". The shop endpoints currently work without one, so the
 * header is sent only when SHOP_API_KEY is configured; if the backend
 * starts requiring it, the ErrorCode 4 branch below makes that visible in
 * the logs without blaming the visitor.
 */
function shopKey(): string | null {
  const key = process.env.SHOP_API_KEY?.trim();
  return key ? key : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  // The backend is PHP; numeric strings happen.
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return Number(value);
  }
  return null;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function fail(message: string, retryable: boolean): RedeemActionResult<never> {
  return { ok: false, message, retryable };
}

/**
 * Posts to one redeem route and unwraps the documented envelope.
 *
 * Returns `Data` on ErrorCode 0. ErrorCode 1 carries a message written for
 * the visitor and is shown as-is. ErrorCode 4 is a mis-set shop key — a
 * deployment problem, so it is logged loudly and hidden behind a generic
 * message rather than blamed on the visitor.
 */
async function callRedeem(
  route: "check" | "send-otp" | "verify-otp" | "verify-payment",
  body: Record<string, string | number>,
  clientIp: string
): Promise<RedeemActionResult<unknown>> {
  const key = shopKey();

  let res: Response;
  try {
    res = await fetch(`${SHOP_API_BASE_URL}/api/public/redeem/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(key ? { "X-Shop-Key": key } : {}),
        // The upstream throttles per visitor; without this every visitor
        // would share this server's address.
        "X-Forwarded-For": clientIp,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REDEEM_TIMEOUT_MS),
    });
  } catch (error) {
    console.error(`redeem/${route} request failed`, error);
    return fail(GENERIC_ERROR, true);
  }

  if (res.status === 429) return fail(THROTTLED, true);
  if (!res.ok) {
    console.error(`redeem/${route} responded ${res.status}`);
    return fail(GENERIC_ERROR, true);
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    console.error(`redeem/${route} returned non-JSON`);
    return fail(GENERIC_ERROR, true);
  }
  if (!isRecord(payload)) {
    console.error(`redeem/${route} returned an unexpected payload`);
    return fail(GENERIC_ERROR, true);
  }

  const code = num(payload.ErrorCode);
  const message = text(payload.Message, MAX_MESSAGE_LENGTH);

  if (code === 0) {
    // One line per successful hop so a "no OTP arrived" report can be traced
    // on the live box: `docker compose logs web | grep redeem/`. Field names
    // and statuses only — never the mobile number, OTP, token or receipt.
    const data = payload.Data;
    const summary: Record<string, unknown> = {
      dataKeys: isRecord(data) ? Object.keys(data) : typeof data,
    };
    if (isRecord(data)) {
      if ("status" in data) summary.status = text(data.status, 32);
      if ("otp_expires_in" in data) summary.otpExpiresIn = num(data.otp_expires_in);
      if ("amount" in data) summary.amount = num(data.amount);
      if (Array.isArray(data.plans)) summary.plans = data.plans.length;
      if ("token" in data) summary.token = isRedeemToken(data.token) ? "ok" : "unusable";
    }
    if (route === "send-otp" && typeof body.mobile === "string") {
      summary.countryCode = body.country_code;
      summary.mobileEndsWith = body.mobile.slice(-2);
    }
    console.info(`redeem/${route} ok`, JSON.stringify(summary));
    return { ok: true, data };
  }
  if (code === 4) {
    console.error(
      `redeem/${route}: shop key ${key ? "rejected" : "required but SHOP_API_KEY is not set"} (ErrorCode 4)`
    );
    return fail(GENERIC_ERROR, true);
  }
  // ErrorCode 1 and anything else undocumented: the message is for the
  // visitor, and the request itself is not worth repeating unchanged.
  if (code !== 1) console.error(`redeem/${route} returned ErrorCode ${code}`);
  return fail(message || "This request was refused. Please check and try again.", false);
}

function parsePlan(raw: unknown): RedeemPlan | null {
  if (!isRecord(raw)) return null;
  const planId = num(raw.plan_id);
  const title = text(raw.title, 80);
  const price = num(raw.price);
  const payable = num(raw.payable);
  if (planId === null || !title || price === null || payable === null || payable < 0) {
    return null;
  }
  return {
    planId,
    title,
    durationDays: Math.max(0, Math.round(num(raw.duration_days) ?? 0)),
    extraDays: Math.max(0, Math.round(num(raw.extra_days) ?? 0)),
    price,
    discount: Math.max(0, num(raw.discount) ?? price - payable),
    payable,
  };
}

export async function checkCoupon(
  coupon: string,
  clientIp: string
): Promise<RedeemActionResult<RedeemCoupon>> {
  const result = await callRedeem("check", { coupon }, clientIp);
  if (!result.ok) return result;

  const data = result.data;
  if (!isRecord(data) || !Array.isArray(data.plans)) {
    console.error("redeem/check: unexpected Data shape");
    return fail(GENERIC_ERROR, true);
  }
  const plans = data.plans
    .slice(0, 20)
    .map(parsePlan)
    .filter((plan): plan is RedeemPlan => plan !== null);
  if (plans.length === 0) {
    return fail("This coupon has no plans available right now.", false);
  }

  return {
    ok: true,
    data: {
      coupon: text(data.coupon, 64) || coupon,
      extraDays: Math.max(0, Math.round(num(data.extra_days) ?? 0)),
      plans,
    },
  };
}

export async function sendOtp(
  input: { coupon: string; planId: number; mobile: string; countryCode: string },
  clientIp: string
): Promise<RedeemActionResult<RedeemOtpSession>> {
  const result = await callRedeem(
    "send-otp",
    {
      coupon: input.coupon,
      plan_id: input.planId,
      mobile: input.mobile,
      country_code: input.countryCode,
    },
    clientIp
  );
  if (!result.ok) return result;

  const data = result.data;
  if (!isRecord(data) || !isRedeemToken(data.token)) {
    console.error("redeem/send-otp: no usable token in Data");
    return fail(GENERIC_ERROR, true);
  }
  return {
    ok: true,
    data: {
      token: data.token,
      otpExpiresIn: Math.max(60, Math.round(num(data.otp_expires_in) ?? 600)),
      amount: Math.max(0, num(data.amount) ?? 0),
    },
  };
}

function parseGrant(data: Record<string, unknown>): RedeemGrant {
  return {
    plan: text(data.plan, 80),
    startDate: text(data.start_date, 40),
    endDate: text(data.end_date, 40),
    mobile: text(data.mobile, 32),
  };
}

function parseRazorpay(raw: unknown): RedeemRazorpayOrder | null {
  if (!isRecord(raw)) return null;
  const key = text(raw.key, 64);
  const orderId = text(raw.order_id, 64);
  const amount = num(raw.amount);
  // A key secret pasted into the key slot would start with something else.
  if (!/^rzp_(test|live)_[A-Za-z0-9]+$/.test(key) || !orderId || amount === null) {
    return null;
  }
  return {
    key,
    orderId,
    amount: Math.round(amount),
    currency: text(raw.currency, 8) || "INR",
    prefillContact: text(raw.prefill_contact, 20).replace(/\D/g, ""),
  };
}

/**
 * Reads the shared "what next" shape returned by verify-otp and
 * verify-payment. The fallback token keeps the session alive when the
 * server omits it from a response.
 */
function parseOutcome(
  route: string,
  data: unknown,
  fallbackToken: string
): RedeemActionResult<RedeemVerifyOutcome> {
  if (!isRecord(data)) {
    console.error(`redeem/${route}: unexpected Data shape`);
    return fail(GENERIC_ERROR, true);
  }
  const token = isRedeemToken(data.token) ? data.token : fallbackToken;
  const status = text(data.status, 32);

  if (status === "granted") {
    return { ok: true, data: { status, token, grant: parseGrant(data) } };
  }
  if (status === "payment_required") {
    const razorpay = parseRazorpay(data.razorpay);
    if (!razorpay) {
      console.error(`redeem/${route}: payment_required without a usable razorpay block`);
      return fail(GENERIC_ERROR, true);
    }
    return {
      ok: true,
      data: {
        status,
        token,
        plan: text(data.plan, 80),
        amount: Math.max(0, num(data.amount) ?? razorpay.amount / 100),
        razorpay,
      },
    };
  }
  if (status === "processing") {
    return {
      ok: true,
      data: {
        status,
        token,
        message:
          "We're still confirming your payment. Your plan will be activated automatically once it clears.",
      },
    };
  }

  console.error(`redeem/${route}: unknown status "${status}"`);
  return fail(GENERIC_ERROR, true);
}

export async function verifyOtp(
  input: { token: string; otp: string },
  clientIp: string
): Promise<RedeemActionResult<RedeemVerifyOutcome>> {
  const result = await callRedeem(
    "verify-otp",
    { token: input.token, otp: input.otp },
    clientIp
  );
  if (!result.ok) return result;
  return parseOutcome("verify-otp", result.data, input.token);
}

export async function verifyRedeemPayment(
  input: {
    token: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
  clientIp: string
): Promise<RedeemActionResult<RedeemVerifyOutcome>> {
  const result = await callRedeem(
    "verify-payment",
    {
      token: input.token,
      razorpay_order_id: input.razorpayOrderId,
      razorpay_payment_id: input.razorpayPaymentId,
      razorpay_signature: input.razorpaySignature,
    },
    clientIp
  );
  if (!result.ok) {
    // The money may have left the visitor's account, so a refusal here is
    // never phrased as "payment failed" and is logged for follow-up.
    console.error("redeem/verify-payment did not confirm", result.message);
    return fail(
      result.retryable
        ? result.message
        : `${result.message} If you were charged, please don't pay again — contact us and we'll sort it out.`,
      result.retryable
    );
  }
  return parseOutcome("verify-payment", result.data, input.token);
}

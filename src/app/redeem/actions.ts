"use server";

import { headers } from "next/headers";
import { rateLimited } from "@/lib/rate-limit";
import {
  checkCoupon,
  isRedeemToken,
  sendOtp,
  verifyOtp,
  verifyRedeemPayment,
} from "@/lib/redeem-api";
import type {
  RedeemActionResult,
  RedeemCoupon,
  RedeemOtpSession,
  RedeemVerifyOutcome,
} from "@/types/redeem";

/**
 * Server Actions are reachable by direct POST, not just from our page, so
 * every input is re-checked here and the upstream throttles are mirrored.
 * Nothing priced or secret is accepted from the browser: the coupon, plan
 * id, mobile, OTP and Razorpay receipt are the only inputs, and the server
 * decides what they are worth.
 */

const MINUTE = 60_000;
const LIMITS = {
  check: { max: 15, window: MINUTE },
  sendOtpIp: { max: 5, window: MINUTE },
  sendOtpMobile: { max: 3, window: 10 * MINUTE },
  verifyOtp: { max: 10, window: MINUTE },
  verifyPayment: { max: 10, window: MINUTE },
} as const;

const THROTTLED = "Please wait a minute and try again.";

// Letters, digits, dash and underscore cover every code the shop issues;
// anything else is rejected before it reaches the network.
const COUPON_PATTERN = /^[A-Za-z0-9_-]{3,64}$/;
const COUNTRY_CODE_PATTERN = /^\+\d{1,4}$/;

async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return headerList.get("x-real-ip")?.slice(0, 64) || "unknown";
}

function refuse<T>(message: string, retryable = false): RedeemActionResult<T> {
  return { ok: false, message, retryable };
}

function cleanCoupon(value: unknown): string | null {
  const coupon = typeof value === "string" ? value.trim() : "";
  return COUPON_PATTERN.test(coupon) ? coupon : null;
}

export async function checkCouponAction(input: {
  coupon: string;
}): Promise<RedeemActionResult<RedeemCoupon>> {
  const coupon = cleanCoupon(input?.coupon);
  if (!coupon) return refuse("Enter the coupon code exactly as it was given to you.");

  const ip = await clientIp();
  if (rateLimited(`redeem:check:${ip}`, LIMITS.check.max, LIMITS.check.window)) {
    return refuse(THROTTLED, true);
  }
  return checkCoupon(coupon, ip);
}

export async function sendOtpAction(input: {
  coupon: string;
  planId: number;
  mobile: string;
  countryCode?: string;
}): Promise<RedeemActionResult<RedeemOtpSession>> {
  const coupon = cleanCoupon(input?.coupon);
  if (!coupon) return refuse("Enter the coupon code exactly as it was given to you.");

  const planId = input?.planId;
  if (!Number.isInteger(planId) || planId <= 0) return refuse("Choose a plan first.");

  const countryCode =
    typeof input?.countryCode === "string" && input.countryCode.trim()
      ? input.countryCode.trim()
      : "+91";
  if (!COUNTRY_CODE_PATTERN.test(countryCode)) {
    return refuse("Enter a country code like +91.");
  }

  // Digits only. For India the server strips a leading 91 or 0 itself, but a
  // number that isn't 10 digits after that can't be right.
  let mobile = typeof input?.mobile === "string" ? input.mobile.replace(/\D/g, "") : "";
  if (countryCode === "+91") {
    if (mobile.length === 12 && mobile.startsWith("91")) mobile = mobile.slice(2);
    if (mobile.length === 11 && mobile.startsWith("0")) mobile = mobile.slice(1);
    if (!/^[6-9]\d{9}$/.test(mobile)) return refuse("Enter a valid 10-digit mobile number.");
  } else if (mobile.length < 6 || mobile.length > 15) {
    return refuse("Enter a valid mobile number.");
  }

  const ip = await clientIp();
  if (rateLimited(`redeem:otp:ip:${ip}`, LIMITS.sendOtpIp.max, LIMITS.sendOtpIp.window)) {
    return refuse(THROTTLED, true);
  }
  if (
    rateLimited(
      `redeem:otp:mobile:${countryCode}${mobile}`,
      LIMITS.sendOtpMobile.max,
      LIMITS.sendOtpMobile.window
    )
  ) {
    return refuse(
      "Too many codes were sent to this number. Please wait 10 minutes and try again.",
      true
    );
  }

  return sendOtp({ coupon, planId, mobile, countryCode }, ip);
}

export async function verifyOtpAction(input: {
  token: string;
  otp: string;
}): Promise<RedeemActionResult<RedeemVerifyOutcome>> {
  if (!isRedeemToken(input?.token)) {
    return refuse("This session has expired. Please request a new code.");
  }
  const otp = typeof input?.otp === "string" ? input.otp.replace(/\D/g, "") : "";
  if (otp.length < 4 || otp.length > 6) return refuse("Enter the code from the message you received.");

  const ip = await clientIp();
  if (rateLimited(`redeem:verify:${ip}`, LIMITS.verifyOtp.max, LIMITS.verifyOtp.window)) {
    return refuse(THROTTLED, true);
  }
  return verifyOtp({ token: input.token, otp }, ip);
}

export async function verifyRedeemPaymentAction(input: {
  token: string;
  payment: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
}): Promise<RedeemActionResult<RedeemVerifyOutcome>> {
  const unconfirmed =
    "We couldn't confirm your payment automatically. If you were charged, please don't pay again — contact us and we'll sort it out.";

  const payment = input?.payment;
  if (
    !isRedeemToken(input?.token) ||
    typeof payment?.razorpay_order_id !== "string" ||
    typeof payment?.razorpay_payment_id !== "string" ||
    typeof payment?.razorpay_signature !== "string"
  ) {
    return refuse(unconfirmed);
  }

  const ip = await clientIp();
  if (
    rateLimited(`redeem:payment:${ip}`, LIMITS.verifyPayment.max, LIMITS.verifyPayment.window)
  ) {
    return refuse(THROTTLED, true);
  }

  return verifyRedeemPayment(
    {
      token: input.token,
      razorpayOrderId: payment.razorpay_order_id.slice(0, 64),
      razorpayPaymentId: payment.razorpay_payment_id.slice(0, 64),
      razorpaySignature: payment.razorpay_signature.slice(0, 256),
    },
    ip
  );
}

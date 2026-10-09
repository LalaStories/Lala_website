/** A plan the coupon can be applied to, as /check reports it. */
export interface RedeemPlan {
  planId: number;
  title: string;
  durationDays: number;
  extraDays: number;
  price: number;
  discount: number;
  /** 0 means the coupon covers the whole plan. */
  payable: number;
}

export interface RedeemCoupon {
  coupon: string;
  extraDays: number;
  plans: RedeemPlan[];
}

/** What /send-otp hands back. The OTP itself is never in it. */
export interface RedeemOtpSession {
  token: string;
  otpExpiresIn: number;
  amount: number;
}

/** Razorpay checkout parameters, fixed by the server for one redemption. */
export interface RedeemRazorpayOrder {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  prefillContact: string;
}

export interface RedeemGrant {
  plan: string;
  startDate: string;
  endDate: string;
  /** Formatted for display, e.g. "+91 98765 43210". */
  mobile: string;
}

export type RedeemVerifyOutcome =
  | { status: "granted"; token: string; grant: RedeemGrant }
  | {
      status: "payment_required";
      token: string;
      plan: string;
      amount: number;
      razorpay: RedeemRazorpayOrder;
    }
  /** The server is still confirming the payment with Razorpay. */
  | { status: "processing"; token: string; message: string };

/**
 * Every action resolves to one of these. `retryable` tells the UI whether
 * to offer the same button again (network hiccup, throttle) or to send the
 * visitor back a step (the server refused the request).
 */
export type RedeemFailure = {
  ok: false;
  message: string;
  retryable: boolean;
};

export type RedeemActionResult<T> = { ok: true; data: T } | RedeemFailure;

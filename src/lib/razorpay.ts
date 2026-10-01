/**
 * Razorpay configuration, read on the server at request time.
 *
 * Only the Key ID lives here. It is publishable — Razorpay's own checkout
 * script needs it in the browser — but the Key *Secret* must never reach
 * this app: the shop backend holds it and verifies the payment signature in
 * /api/public/verify-order-payment.
 *
 * Online payment stays switched off until RAZORPAY_KEY_ID is set, so the
 * checkout keeps working exactly as before until someone enables it.
 */
export function getRazorpayKeyId(): string | null {
  const key = process.env.RAZORPAY_KEY_ID?.trim();
  if (!key) return null;
  // Guard against a secret being pasted in by mistake.
  return /^rzp_(test|live)_[A-Za-z0-9]+$/.test(key) ? key : null;
}

export function isPaymentEnabled(): boolean {
  return getRazorpayKeyId() !== null;
}

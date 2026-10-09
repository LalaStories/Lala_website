"use client";

/**
 * Browser-side Razorpay Checkout loader shared by the shop and the redeem
 * page. Only the publishable Key ID ever reaches this code; signatures are
 * verified by the shop backend, which alone holds the key secret.
 */

import type { RazorpayResult } from "@/types/order";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export interface RazorpayOptions {
  key: string;
  order_id: string;
  name: string;
  description?: string;
  amount?: number;
  currency?: string;
  prefill?: { name?: string; contact?: string; email?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayResult) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let scriptPromise: Promise<boolean> | null = null;

/** Loads Razorpay's checkout script once per page. */
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/** Shape-checks what Razorpay hands to `handler` before it goes anywhere. */
export function isRazorpayResult(value: unknown): value is RazorpayResult {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.razorpay_order_id === "string" &&
    typeof r.razorpay_payment_id === "string" &&
    typeof r.razorpay_signature === "string"
  );
}

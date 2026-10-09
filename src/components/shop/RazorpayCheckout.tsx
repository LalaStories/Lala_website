"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { verifyPaymentAction } from "@/app/shop/actions";
import { loadRazorpay } from "@/lib/razorpay-client";
import type { PlacedOrder, RazorpayResult } from "@/types/order";

type PayState =
  | { kind: "ready" }
  | { kind: "opening" }
  | { kind: "verifying" }
  | { kind: "paid"; message: string }
  | { kind: "unconfirmed"; message: string }
  | { kind: "failed"; message: string };

interface RazorpayCheckoutProps {
  keyId: string;
  order: PlacedOrder;
  customer: { name: string; phone: string; email: string };
}

export default function RazorpayCheckout({
  keyId,
  order,
  customer,
}: RazorpayCheckoutProps) {
  const [payState, setPayState] = useState<PayState>({ kind: "opening" });
  // Guards against a double "handler" call verifying the same payment twice.
  const verifyingRef = useRef(false);

  const verify = useCallback(
    async (response: RazorpayResult) => {
      if (verifyingRef.current || order.orderId === null) return;
      verifyingRef.current = true;
      setPayState({ kind: "verifying" });

      const result = await verifyPaymentAction({
        orderId: order.orderId,
        payment: response,
      });
      verifyingRef.current = false;

      setPayState(
        result.ok
          ? { kind: "paid", message: result.message }
          : { kind: "unconfirmed", message: result.message }
      );
    },
    [order.orderId]
  );

  const pay = useCallback(async () => {
    if (!order.razorpayOrderId) return;

    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      setPayState({
        kind: "failed",
        message:
          "We couldn't open the payment window. Check your connection and try again.",
      });
      return;
    }

    const checkout = new window.Razorpay({
      key: keyId,
      order_id: order.razorpayOrderId,
      name: "LALA Stories",
      description: order.reference ? `Order ${order.reference}` : "Shop order",
      // Razorpay takes the real amount from the order it already holds; this
      // is only what the customer sees while paying.
      ...(order.amount !== null ? { amount: order.amount } : {}),
      currency: order.currency ?? "INR",
      prefill: {
        name: customer.name,
        contact: customer.phone,
        ...(customer.email ? { email: customer.email } : {}),
      },
      theme: { color: "#FF7A2F" },
      handler: (response) => {
        void verify(response);
      },
      modal: {
        ondismiss: () =>
          setPayState({
            kind: "failed",
            message: "Payment was cancelled. You can try again below.",
          }),
      },
    });

    checkout.on("payment.failed", () => {
      setPayState({
        kind: "failed",
        message:
          "That payment didn't go through. Please try again.",
      });
    });

    checkout.open();
  }, [keyId, order, customer, verify]);

  // Take the customer straight into Razorpay rather than asking them to
  // click twice. Handing off to a third-party modal is the external-system
  // synchronisation an effect is for; pay() only changes state after an
  // await, well past the render it was started from.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void pay();
    // Mount only: re-running would reopen the modal under the customer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payState.kind === "paid") {
    return (
      <div className="bg-card-bg border border-emerald-500/30 rounded-3xl p-10 text-center space-y-4">
        <span className="text-5xl block">🎉</span>
        <h2 className="font-heading font-extrabold text-2xl">Payment received!</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
          {payState.message}
        </p>
        {order.reference && (
          <p className="font-heading text-sm font-extrabold">
            Order reference:{" "}
            <span className="text-[#FF7A2F]">{order.reference}</span>
          </p>
        )}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md transition-all"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  // The money may have left the customer's account even though we couldn't
  // confirm it, so this never says the payment failed.
  if (payState.kind === "unconfirmed") {
    return (
      <div className="bg-card-bg border border-amber-500/40 rounded-3xl p-10 text-center space-y-4">
        <span className="text-5xl block">⏳</span>
        <h2 className="font-heading font-extrabold text-2xl">
          We&apos;re confirming your payment
        </h2>
        <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
          {payState.message} Please don&apos;t pay again
          {order.reference && <> — quote order {order.reference}</>}.
        </p>
        <a
          href="tel:+918590166898"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-secondary border border-card-border hover:border-orange-500/30 text-sm font-extrabold transition-all"
        >
          📞 Call us
        </a>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-3xl p-10 text-center space-y-4">
      <span className="text-5xl block">🔒</span>
      <h2 className="font-heading font-extrabold text-2xl">
        {payState.kind === "verifying"
          ? "Confirming your payment…"
          : payState.kind === "opening"
            ? "Opening secure payment…"
            : "Payment not completed"}
      </h2>
      <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
        {payState.kind === "failed"
          ? payState.message
          : "Please don't close this page."}
      </p>
      {order.reference && (
        <p className="font-heading text-sm font-extrabold">
          Order reference:{" "}
          <span className="text-[#FF7A2F]">{order.reference}</span>
        </p>
      )}
      {payState.kind !== "verifying" && (
        <button
          type="button"
          onClick={() => void pay()}
          disabled={payState.kind === "opening"}
          className="inline-flex items-center gap-1.5 px-8 py-4 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md transition-all disabled:opacity-50"
        >
          {payState.kind === "opening" ? "Opening payment…" : "Pay now"}
        </button>
      )}
    </div>
  );
}

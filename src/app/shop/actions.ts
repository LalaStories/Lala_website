"use server";

import { headers } from "next/headers";
import { placeOrder, validateOrder, verifyOrderPayment } from "@/lib/order-api";
import { getRazorpayKeyId } from "@/lib/razorpay";
import type { OrderFormState, RazorpayResult } from "@/types/order";

/**
 * Server Actions are reachable by direct POST, not just through our form, so
 * every rule is enforced here rather than in the browser.
 */
async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return headerList.get("x-real-ip")?.slice(0, 64) || "unknown";
}

export async function placeOrderAction(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const validated = await validateOrder(formData);
  if (!validated.ok) {
    return {
      status: "error",
      message: validated.message,
      fieldErrors: validated.fieldErrors,
      order: null,
      razorpayKeyId: null,
    };
  }

  const result = await placeOrder(validated.value.payload, await clientIp());
  if (!result.ok) {
    // Name the products the shop refused, rather than just echoing "some
    // items in your cart are unavailable".
    const titles = new Map(
      validated.value.products.map(({ product }) => [product.id, product.title])
    );
    const details = (result.itemIssues ?? []).map((issue) => {
      const title = titles.get(issue.productId) ?? `Product #${issue.productId}`;
      if (issue.availableQty !== null && issue.availableQty > 0) {
        return `${title} (only ${issue.availableQty} left)`;
      }
      return issue.reason === "unavailable" || !issue.reason
        ? `${title} (unavailable)`
        : `${title} (${issue.reason.replace(/_/g, " ")})`;
    });

    return {
      status: "error",
      message: details.length
        ? `${result.message} ${details.join(", ")}.`
        : result.message,
      fieldErrors: details.length ? { items: "Please update your basket." } : {},
      order: null,
      razorpayKeyId: null,
    };
  }

  const razorpayKeyId = getRazorpayKeyId();
  const needsPayment =
    razorpayKeyId !== null &&
    result.order.razorpayOrderId !== null &&
    result.order.orderId !== null;

  return {
    status: needsPayment ? "awaiting_payment" : "success",
    message: result.order.message,
    fieldErrors: {},
    order: result.order,
    razorpayKeyId: needsPayment ? razorpayKeyId : null,
  };
}

/**
 * Confirms a Razorpay payment after the customer completes checkout.
 *
 * The ids arrive from the browser, which cannot be trusted on its own — the
 * shop backend re-checks the Razorpay signature against its key secret, so a
 * forged call is rejected there.
 */
export async function verifyPaymentAction(input: {
  orderId: number;
  payment: RazorpayResult;
}): Promise<{ ok: boolean; message: string }> {
  const { orderId, payment } = input;

  if (
    !Number.isInteger(orderId) ||
    typeof payment?.razorpay_order_id !== "string" ||
    typeof payment?.razorpay_payment_id !== "string" ||
    typeof payment?.razorpay_signature !== "string"
  ) {
    return {
      ok: false,
      message:
        "We couldn't confirm your payment automatically. Our team will check and contact you.",
    };
  }

  const result = await verifyOrderPayment({
    orderId,
    razorpayOrderId: payment.razorpay_order_id.slice(0, 64),
    razorpayPaymentId: payment.razorpay_payment_id.slice(0, 64),
    razorpaySignature: payment.razorpay_signature.slice(0, 256),
  });

  return { ok: result.ok, message: result.message };
}

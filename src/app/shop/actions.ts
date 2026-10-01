"use server";

import { headers } from "next/headers";
import { placeOrder, validateOrder } from "@/lib/order-api";
import type { OrderFormState } from "@/types/order";

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
    };
  }

  return {
    status: "success",
    message: result.order.message,
    fieldErrors: {},
    order: result.order,
  };
}

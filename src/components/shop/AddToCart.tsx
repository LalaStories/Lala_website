"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/CartStore";
import type { ShopProduct } from "@/types/shop";

const MAX_QTY = 99;

/**
 * Products that need a variant choice or phone-verified subscription can't be
 * ordered online yet, so they point at support instead of the basket. The
 * server enforces the same rules — this is only to save a wasted trip.
 */
function blockedReason(product: ShopProduct): string | null {
  if (!product.inStock) return "This product is currently out of stock.";
  if (product.hasVariants)
    return "This product comes in options that can't be picked online yet.";
  if (product.includesSubscription)
    return "Orders including an app subscription need phone verification we haven't enabled online yet.";
  return null;
}

export default function AddToCart({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const blocked = blockedReason(product);
  if (blocked) {
    return (
      <div className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-3">
        <h2 className="font-heading font-extrabold text-lg">How to order</h2>
        <p className="text-sm text-text-muted leading-relaxed">{blocked} Reach our
          team and we&apos;ll help you complete your purchase.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
          >
            Enquire to order →
          </Link>
          <a
            href="tel:+918590166898"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-secondary border border-card-border hover:border-orange-500/30 text-sm font-extrabold transition-all"
          >
            📞 Call us
          </a>
        </div>
      </div>
    );
  }

  // Never offer more than the shop says it has.
  const maxQty = product.availableQty > 0 ? Math.min(product.availableQty, MAX_QTY) : MAX_QTY;

  return (
    <div className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-4">
      <h2 className="font-heading font-extrabold text-lg">Order this</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-text-muted">Quantity</span>
        <div className="flex items-center gap-1 border border-card-border rounded-full bg-secondary p-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="w-9 h-9 rounded-full font-extrabold text-lg hover:bg-card-bg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            −
          </button>
          <span className="w-10 text-center font-extrabold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty}
            aria-label="Increase quantity"
            className="w-9 h-9 rounded-full font-extrabold text-lg hover:bg-card-bg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            addItem(product.id, qty);
            setAdded(true);
          }}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
        >
          🛒 Add to basket
        </button>
        {added && (
          <Link
            href="/shop/cart"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-secondary border border-card-border hover:border-orange-500/30 text-sm font-extrabold transition-all"
          >
            Go to basket →
          </Link>
        )}
      </div>

      {added && (
        <p className="text-xs font-bold text-emerald-600" role="status">
          ✓ Added to your basket.
        </p>
      )}
      <p className="text-xs text-text-muted">
        No payment is taken online — the shop will contact you to confirm your order.
      </p>
    </div>
  );
}

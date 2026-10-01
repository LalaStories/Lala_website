"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/store/CartStore";

export default function CartLink() {
  const { totalCount, ready } = useCart();

  return (
    <Link
      href="/shop/cart"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card-bg border border-card-border hover:border-orange-500/30 text-sm font-extrabold transition-all"
    >
      🛒 Basket
      {ready && totalCount > 0 && (
        <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-[#FF7A2F] text-white text-xs tabular-nums">
          {totalCount}
        </span>
      )}
    </Link>
  );
}

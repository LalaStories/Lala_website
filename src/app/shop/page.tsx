import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getShopHome } from "@/lib/shop-api";
import ShopCatalog from "./ShopCatalog";
import CartLink from "@/components/shop/CartLink";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop — LALA Stories",
  description:
    "Browse the LALA Stories shop: storybooks, toys, combos, and bundles with app subscriptions — all designed around our screen-free bedtime stories.",
};

export default async function ShopPage() {
  const shop = await getShopHome();

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
              🛍️ LALA Shop
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
              Books, Toys <span className="text-[#FF7A2F]">& Bundles</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              Explore our storybooks, plush toys, and combo packs — some even
              bundle a LALA Stories app subscription for extra bedtime magic.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <CartLink />
              <Link
                href="/redeem"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
              >
                🎟️ Redeem coupon
              </Link>
            </div>
          </div>

          {shop ? (
            <ShopCatalog types={shop.types} onOffer={shop.onOffer} latest={shop.latest} />
          ) : (
            <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl">
              <span className="text-5xl block">🛒</span>
              <h3 className="font-heading font-extrabold text-2xl mt-4 text-text-dark">
                The shop is taking a nap
              </h3>
              <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">
                We couldn&apos;t load the products right now. Please refresh or
                check back in a few minutes.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

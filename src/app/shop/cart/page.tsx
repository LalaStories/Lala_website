import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { collectProducts, getShopHome } from "@/lib/shop-api";
import CheckoutForm from "./CheckoutForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Your Basket — LALA Stories Shop",
  description: "Review your basket and place your LALA Stories order.",
  robots: { index: false },
};

export default async function CartPage() {
  const shop = await getShopHome();
  // The basket itself lives in the browser; this is the live catalog it is
  // rendered against, so prices and stock are never read from localStorage.
  const products = shop ? collectProducts(shop) : [];

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <nav className="text-sm text-text-muted">
              <Link href="/shop" className="hover:text-[#FF7A2F] font-bold">
                ← Continue shopping
              </Link>
            </nav>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
              Your <span className="text-[#FF7A2F]">Basket</span>
            </h1>
          </div>

          {products.length > 0 ? (
            <CheckoutForm products={products} />
          ) : (
            <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl">
              <span className="text-5xl block">🛒</span>
              <h2 className="font-heading font-extrabold text-2xl mt-4">
                The shop is taking a nap
              </h2>
              <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">
                We couldn&apos;t load the catalog right now. Please refresh or
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

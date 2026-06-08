import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import ProductCatalog from "./ProductCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Books & Toys Catalog — LALA Stories",
  description:
    "Explore physical companion books and soft plush toys designed to complement our screen-free bedtime audio stories program.",
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
              🧸 LALA Shop
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
              Companion <span className="text-[#FF7A2F]">Books & Toys</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              Bring the magical stories into the physical world! Explore our custom-illustrated board books and snuggle-friendly plush toys.
            </p>
          </div>

          <ProductCatalog initialProducts={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

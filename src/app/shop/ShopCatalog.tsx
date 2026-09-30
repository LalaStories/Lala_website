"use client";

import React, { useMemo, useState } from "react";
import type { ShopProduct, ShopProductType } from "@/types/shop";

interface ShopCatalogProps {
  types: ShopProductType[];
  onOffer: ShopProduct[];
  latest: ShopProduct[];
}

function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <div className="group flex flex-col bg-card-bg border border-card-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-orange-500/20 transition-all duration-350 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-64 w-full bg-slate-100 overflow-hidden border-b border-card-border">
        {product.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🧸</div>
        )}
        {product.type && (
          <span
            className="absolute top-4 left-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider text-white"
            style={{ backgroundColor: product.type.color ?? "#FF7A2F" }}
          >
            {product.type.name}
          </span>
        )}
        {product.discountPercent > 0 && (
          <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider bg-rose-500 text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col grow justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-xl group-hover:text-[#FF7A2F] transition-colors leading-tight line-clamp-2">
            {product.title}
          </h3>
          {product.includesSubscription && product.subscription && (
            <p className="text-text-muted text-xs leading-relaxed">
              Includes <strong>{product.subscription.durationLabel || product.subscription.title}</strong> app
              subscription.
              {product.subscription.platformNote && (
                <span className="block mt-1 text-[11px] opacity-80">
                  {product.subscription.platformNote}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
          <div className="font-heading">
            <span className="text-xs text-text-muted font-bold block leading-none">PRICE</span>
            <span className="text-2xl font-extrabold text-[#FF7A2F] tracking-tight">
              ₹{product.price}
            </span>
            {product.mrp && (
              <span className="ml-2 text-sm text-text-muted line-through">₹{product.mrp}</span>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold select-none ${
              product.inStock
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ShopCatalog({ types, onOffer, latest }: ShopCatalogProps) {
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // The feed can repeat a product in both lists; dedupe by id for the grid.
  const allProducts = useMemo(() => {
    const seen = new Map<number, ShopProduct>();
    for (const product of [...latest, ...onOffer]) {
      if (!seen.has(product.id)) seen.set(product.id, product);
    }
    return Array.from(seen.values());
  }, [latest, onOffer]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesType = activeTypeId === null || product.type?.id === activeTypeId;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    return matchesType && matchesSearch;
  });

  const showOfferSection =
    onOffer.length > 0 && activeTypeId === null && searchQuery.trim() === "";

  return (
    <div className="space-y-12">
      {/* Search & Type Filter */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTypeId(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap border ${
              activeTypeId === null
                ? "bg-[#FF7A2F] border-[#FF7A2F] text-white shadow-md scale-102"
                : "bg-secondary border-card-border text-text-muted hover:text-text-dark hover:border-orange-500/30"
            }`}
          >
            🛍️ All
          </button>
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTypeId(type.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap border ${
                activeTypeId === type.id
                  ? "bg-[#FF7A2F] border-[#FF7A2F] text-white shadow-md scale-102"
                  : "bg-secondary border-card-border text-text-muted hover:text-text-dark hover:border-orange-500/30"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={100}
            className="w-full rounded-full border border-card-border bg-secondary text-text-dark px-5 py-2.5 pr-10 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* On Offer */}
      {showOfferSection && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight">
            🔥 On Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {onOffer.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight">
          ✨ All Products
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl">
            <span className="text-5xl block animate-bounce">📦</span>
            <h3 className="font-heading font-extrabold text-2xl mt-4 text-text-dark">
              No products found
            </h3>
            <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">
              Try adjusting your search query or switching filters to see
              available items.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

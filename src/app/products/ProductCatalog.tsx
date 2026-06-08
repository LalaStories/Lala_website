"use client";

import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  category: string;
}

interface ProductCatalogProps {
  initialProducts: Product[];
}

export default function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = initialProducts.filter((product) => {
    const matchesTab = activeTab === "All" || product.category === activeTab;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
        {/* Category Tabs */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {["All", "Book", "Toy"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap border ${
                activeTab === category
                  ? "bg-[#FF7A2F] border-[#FF7A2F] text-white shadow-md scale-102"
                  : "bg-secondary border-card-border text-text-muted hover:text-text-dark hover:border-orange-500/30"
              }`}
            >
              {category === "All" ? "🛍️ All Products" : category === "Book" ? "📖 Books" : "🧸 Toys"}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-card-border bg-secondary text-text-dark px-5 py-2.5 pr-10 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group flex flex-col bg-card-bg border border-card-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-orange-500/20 transition-all duration-350 hover:-translate-y-1"
            >
              {/* Product Image Wrapper */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden border-b border-card-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <span className={`absolute top-4 left-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider border ${
                  prod.category === "Book"
                    ? "bg-amber-500 text-white border-amber-600/20"
                    : "bg-sky-500 text-white border-sky-600/20"
                }`}>
                  {prod.category === "Book" ? "Book" : "Toy"}
                </span>
              </div>

              {/* Product Copy Details */}
              <div className="p-6 flex flex-col grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl group-hover:text-[#FF7A2F] transition-colors leading-tight line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
                  <div className="font-heading">
                    <span className="text-xs text-text-muted font-bold block leading-none">PRICE</span>
                    <span className="text-2xl font-extrabold text-[#FF7A2F] tracking-tight">₹{prod.price}</span>
                  </div>
                  <a
                    href={prod.buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all select-none hover:scale-103 active:scale-97 cursor-pointer border-none"
                  >
                    Buy Now ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl">
          <span className="text-5xl block animate-bounce">📦</span>
          <h3 className="font-heading font-extrabold text-2xl mt-4 text-text-dark">No products found</h3>
          <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">
            Try adjusting your search query or switching filters to see available items.
          </p>
        </div>
      )}
    </div>
  );
}

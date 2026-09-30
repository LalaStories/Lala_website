import React from "react";
import Link from "next/link";
import type { ShopProduct } from "@/types/shop";

/**
 * Presentational card with no hooks or handlers, so it renders from both the
 * client catalog and the server-rendered detail page.
 */
export default function ProductCard({ product }: { product: ShopProduct }) {
  const body = (
    <>
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
              Includes{" "}
              <strong>
                {product.subscription.durationLabel || product.subscription.title}
              </strong>{" "}
              app subscription.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
          <div className="font-heading">
            <span className="text-xs text-text-muted font-bold block leading-none">
              {product.pricePrefix || "PRICE"}
            </span>
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
    </>
  );

  const shell =
    "group flex flex-col bg-card-bg border border-card-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-orange-500/20 transition-all duration-350 hover:-translate-y-1";

  // Products the feed gave no usable slug for have no detail page to link to.
  return product.slug ? (
    <Link href={`/shop/${product.slug}`} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  );
}

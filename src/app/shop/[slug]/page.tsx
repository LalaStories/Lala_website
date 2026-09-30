import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { collectProducts, getShopHome, getShopProduct } from "@/lib/shop-api";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const shop = await getShopHome();
  if (!shop) return [];
  return collectProducts(shop)
    .filter((product) => product.slug)
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await getShopProduct(slug);
  if (!found) return { title: "Product not found — LALA Stories" };

  const { product } = found;
  return {
    title: `${product.title} — LALA Stories Shop`,
    description: `${product.title} — ₹${product.price}${
      product.mrp ? ` (was ₹${product.mrp})` : ""
    }. ${product.type?.name ?? "Product"} from the LALA Stories shop.`,
    openGraph: product.coverImage ? { images: [product.coverImage] } : undefined,
  };
}

function formatOfferEnd(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const found = await getShopProduct(slug);
  if (!found) notFound();

  const { product, related } = found;
  const savings = product.mrp ? product.mrp - product.price : 0;

  // Escape "<" so a title can never break out of the JSON-LD script block.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.coverImage ?? undefined,
    category: product.type?.name ?? undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }).replace(/</g, "\\u003c");

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-text-muted">
            <Link href="/shop" className="hover:text-[#FF7A2F] font-bold">
              ← Back to Shop
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden border border-card-border bg-slate-100 aspect-square">
              {product.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🧸</div>
              )}
              {product.discountPercent > 0 && (
                <span className="absolute top-5 right-5 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full shadow-md tracking-wider bg-rose-500 text-white">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                {product.type && (
                  <span
                    className="inline-flex text-[11px] font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider text-white"
                    style={{ backgroundColor: product.type.color ?? "#FF7A2F" }}
                  >
                    {product.type.name}
                  </span>
                )}
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-3">
                {product.pricePrefix && (
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    {product.pricePrefix}
                  </span>
                )}
                <div className="flex flex-wrap items-baseline gap-3 font-heading">
                  <span className="text-4xl font-extrabold text-[#FF7A2F] tracking-tight">
                    ₹{product.price}
                  </span>
                  {product.mrp && (
                    <span className="text-xl text-text-muted line-through">₹{product.mrp}</span>
                  )}
                  {savings > 0 && (
                    <span className="text-sm font-extrabold text-emerald-600">
                      You save ₹{savings}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold ${
                      product.inStock
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.inStock && product.availableQty > 0 && product.availableQty <= 5 && (
                    <span className="text-xs font-bold text-amber-600">
                      Only {product.availableQty} left
                    </span>
                  )}
                </div>

                {product.isOnOffer && product.offerEndsAt && (
                  <p className="text-xs font-bold text-rose-600">
                    🔥 Offer ends {formatOfferEnd(product.offerEndsAt)}
                  </p>
                )}
              </div>

              {/* Subscription */}
              {product.includesSubscription && product.subscription && (
                <div className="bg-violet-500/5 border border-violet-500/20 rounded-3xl p-6 space-y-2">
                  <h2 className="font-heading font-extrabold text-lg">
                    📱 Includes app subscription
                  </h2>
                  <p className="text-sm text-text-muted">
                    <strong>
                      {product.subscription.durationLabel || product.subscription.title}
                    </strong>{" "}
                    of LALA Stories
                    {product.subscription.qty > 1 && ` × ${product.subscription.qty}`}.
                  </p>
                  {product.subscription.platformNote && (
                    <p className="text-xs text-text-muted leading-relaxed bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
                      ⚠️ {product.subscription.platformNote}
                    </p>
                  )}
                </div>
              )}

              {/* Bundle / variant notes */}
              {(product.isBundle || product.hasVariants) && (
                <ul className="text-sm text-text-muted space-y-1.5">
                  {product.isBundle && <li>🎁 This is a bundle of multiple items.</li>}
                  {product.hasVariants && (
                    <li>🎨 Available in multiple options — our team will confirm your choice.</li>
                  )}
                </ul>
              )}

              {/* Ordering */}
              <div className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-3">
                <h2 className="font-heading font-extrabold text-lg">How to order</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  Online checkout isn&apos;t available on the website yet. Reach our
                  team and we&apos;ll help you complete your purchase.
                </p>
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
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight">
                You may also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

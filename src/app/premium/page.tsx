import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Subscription Plans — LALA Stories",
  description:
    "Unlock 3000+ magical bedtime stories, offline downloads, screen-free music, and sleep timer settings. Try LALA Stories Premium today.",
};

export default async function PremiumPlansPage() {
  const plans = await db.pricingPlan.findMany({
    orderBy: { order: "asc" },
  });

  const books = await db.product.findMany({
    where: { category: "Book" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
              ✨ Premium Membership
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
              Unlock the <span className="text-[#FF7A2F]">Full Magic</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              Choose a subscription tier to access our complete library of over 3000+ bedtime stories, offline listening modes, and advanced sleep controls.
            </p>
          </div>

          {/* Pricing Grid */}
          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
              {plans.map((plan) => {
                const featuresList = plan.features.split(",");
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between bg-card-bg border rounded-3xl p-8 transition-all duration-300 ${
                      plan.isPopular
                        ? "border-[#FF7A2F] shadow-lg shadow-orange-500/10 scale-103 md:-translate-y-2 z-10"
                        : "border-card-border shadow-xs hover:border-orange-500/20"
                    }`}
                  >
                    {/* Popular badge */}
                    {plan.isPopular && (
                      <span className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#FF7A2F] text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-full tracking-wider shadow-md">
                        ★ Most Popular ★
                      </span>
                    )}

                    {/* Card Top Details */}
                    <div className="space-y-6">
                      <div className="space-y-2 text-center md:text-left">
                        {plan.badge && !plan.isPopular && (
                          <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-600 border border-violet-500/20 mb-1">
                            {plan.badge}
                          </span>
                        )}
                        <h3 className="font-heading font-extrabold text-2xl">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline justify-center md:justify-start gap-1 pt-2">
                          <span className="text-4xl font-extrabold tracking-tight text-[#FF7A2F]">{plan.price}</span>
                          <span className="text-text-muted text-xs font-semibold">/ {plan.period}</span>
                        </div>
                      </div>

                      {/* Features Check list */}
                      <ul className="space-y-3.5 text-sm">
                        {featuresList.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-text-muted">
                            <span className="text-emerald-500 shrink-0 text-base font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Button */}
                    <div className="pt-8">
                      <a
                        href="https://lalakidsstories.page.link/share"
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full text-center inline-flex justify-center items-center py-3.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer border-none select-none hover:scale-102 active:scale-98 ${
                          plan.isPopular
                            ? "bg-[#FF7A2F] hover:bg-[#E55A10] text-white shadow-md shadow-orange-500/25"
                            : "bg-orange-500/10 hover:bg-orange-500/20 text-[#FF7A2F]"
                        }`}
                      >
                        Subscribe Now
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card-bg border border-card-border rounded-3xl max-w-lg mx-auto">
              <span className="text-4xl">📭</span>
              <p className="text-text-muted text-sm font-semibold mt-2">No pricing tiers defined. Check back later!</p>
            </div>
          )}

          {/* Special Program Banner */}
          <div className="max-w-4xl mx-auto bg-linear-to-br from-[#1A1040] to-[#25144D] text-white rounded-3xl p-8 md:p-10 shadow-xl border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-[#FFB380] uppercase tracking-wider mb-1">
                🤝 Special Free Access
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold leading-tight">
                Program for Differently Abled Kids
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                We believe that magical bedtime audio stories should be accessible to all. If you have a child with special needs, we would love to offer you premium app credentials entirely for free.
              </p>
            </div>
            <Link
              href="/differently-abled"
              className="shrink-0 inline-flex items-center justify-center px-6 py-3.5 bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold rounded-full shadow-lg hover:shadow-orange-500/20 transition-all select-none hover:scale-105 active:scale-95"
            >
              Apply for Free Access
            </Link>
          </div>

          {/* Books Companion Section */}
          {books.length > 0 && (
            <div className="space-y-10 pt-10 border-t border-card-border/50">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-[#FF7A2F] uppercase tracking-widest block">
                  📖 Snuggle & Read
                </span>
                <h2 className="font-heading text-3xl font-extrabold tracking-tight">
                  Complete the Bedtime Magic with <span className="text-[#FF7A2F]">Companion Books</span>
                </h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  Turn storytime into a shared reading adventure with our premium printed companion books. They are perfect for children to read along with while listening to LALA audio stories!
                </p>
              </div>

              {/* Books List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {books.map((book) => (
                  <div key={book.id} className="flex flex-col sm:flex-row bg-card-bg border border-card-border rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="sm:w-2/5 h-52 sm:h-auto relative bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col justify-between grow space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Board Book
                        </span>
                        <h3 className="font-heading font-extrabold text-base leading-snug line-clamp-2">{book.name}</h3>
                        <p className="text-text-muted text-[11px] leading-relaxed line-clamp-4">{book.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-card-border/50">
                        <span className="text-lg font-extrabold text-[#FF7A2F]">₹{book.price}</span>
                        <a href={book.buyUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-[11px] font-extrabold rounded-full shadow-md transition-all select-none hover:scale-102 border-none">
                          Buy Book ↗
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

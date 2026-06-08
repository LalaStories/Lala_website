import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";

export const metadata: Metadata = {
  title: "Shipping Policy — Lala Stories",
  description:
    "Read the Lala Stories Shipping Policy — processing times, delivery timelines, shipping charges, order tracking and digital product delivery.",
  alternates: {
    canonical: "https://lalastories.com/shipping",
  },
};

export default function Shipping() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shipping Policy — Lala Stories",
    "url": "https://lalastories.com/shipping",
    "publisher": {
      "@type": "Organization",
      "name": "Lala Stories",
      "url": "https://lalastories.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#FFF7F0] font-body text-gray-800">
        <Header />

        <main className="grow">
          {/* ========== HERO ========== */}
          <section className="relative pt-36 pb-20 text-center overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white">
            <StarBackground count={40} />

            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1 bg-orange-500/20 text-[#FFB380] border border-orange-500/30 px-4.5 py-1.5 rounded-full text-xs font-bold font-heading">
                📦 Legal
              </div>
              <h1 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-white leading-tight">
                Shipping <span className="text-[#FF7A2F]">Policy</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-semibold">
                Lala Stories &nbsp;·&nbsp; Funfeed Global Private Limited
              </p>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full z-10 pointer-events-none select-none">
              <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
                <path
                  d="M0,60 C360,80 720,30 1080,60 C1260,75 1380,40 1440,60 L1440,80 L0,80 Z"
                  fill="#FFF7F0"
                />
              </svg>
            </div>
          </section>

          {/* ========== CONTENT ========== */}
          <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            {/* Intro */}
            <div className="p-8 bg-white border-l-4 border-[#FF7A2F] rounded-2xl shadow-xs leading-relaxed text-gray-600 text-[15px] sm:text-base">
              At <strong>Lala Stories</strong>, we are committed to delivering your products safely and on time. This Shipping Policy explains how we process, ship and deliver your orders.
            </div>

            {/* Quick summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">⚡</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">Fast Processing</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Orders processed within 1–3 business days after payment confirmation.
                </p>
              </div>
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">🚚</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">India Delivery</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  3–7 business days for domestic orders across India.
                </p>
              </div>
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">📲</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">Digital = Instant</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Subscriptions and digital products delivered instantly via email.
                </p>
              </div>
            </div>

            {/* Section 1: Processing Time */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  ⚙️
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Processing Time</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Orders are usually processed and shipped within <strong>1–3 business days</strong> after payment confirmation.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Orders placed on <strong>weekends or public holidays</strong> will be processed on the next working day.</p>
                </li>
              </ul>
            </div>

            {/* Section 2: Shipping Timelines */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  🚚
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Shipping Timelines</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                <div className="p-6 rounded-2xl bg-orange-50/30 border border-orange-100/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">Domestic</span>
                  </div>
                  <h4 className="font-heading font-bold text-gray-900 text-lg">3–7 Business Days</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-semibold">For orders within India, delivery time depends on your location.</p>
                </div>
                <div className="p-6 rounded-2xl bg-violet-50/30 border border-violet-100/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✈️</span>
                    <span className="text-xs font-bold text-[#2A1D5C] uppercase tracking-wider">International</span>
                  </div>
                  <h4 className="font-heading font-bold text-gray-900 text-lg">10–21 Business Days</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-semibold">Subject to customs clearance and local courier availability.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 text-[#E55A10] text-xs sm:text-sm font-semibold">
                Delivery timelines are estimates and may vary during peak seasons or due to unforeseen circumstances.
              </div>
            </div>

            {/* Section 3: Shipping Charges */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  💲
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Shipping Charges</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Shipping charges are <strong>calculated at checkout</strong> and displayed before you confirm your order — no hidden fees.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Occasionally, we may offer <strong>free shipping promotions</strong>, which will be clearly mentioned on our website.</p>
                </li>
              </ul>
            </div>

            {/* Section 4: Order Tracking */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  📍
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Order Tracking</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Once your order has been shipped, you will receive an <strong>email or SMS with tracking details</strong>.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>You can track your order using the <strong>tracking link</strong> provided in the notification.</p>
                </li>
              </ul>
            </div>

            {/* Section 5: Delivery Issues */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  ⚠️
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Delivery Issues</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>If your order is <strong>delayed or lost in transit</strong>, please contact our support team at <a href="mailto:support@lalastories.com" className="text-[#FF7A2F] hover:underline font-bold">support@lalastories.com</a> with your order ID.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>If delivery is attempted and the package is <strong>returned due to an incorrect address or non-availability</strong>, re-shipping charges may apply.</p>
                </li>
              </ul>
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 text-[#E55A10] text-xs sm:text-sm font-semibold">
                Please double-check your delivery address before confirming your order to avoid return-to-sender situations.
              </div>
            </div>

            {/* Section 6: Digital Products */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  📲
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Shipping for Digital Products</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>For digital items such as <strong>subscriptions or downloads</strong>, delivery is instant via email or account access once payment is confirmed.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p><strong>No physical shipping is required</strong> for digital products — access is granted immediately after successful payment.</p>
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#1A1040] to-[#2A1D5C] text-[#FFF] rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md">
                ⚡ Digital products are delivered <span className="text-[#FFB380]">instantly</span>
              </div>
            </div>

            {/* Corporate contact banner */}
            <div className="rounded-3xl bg-linear-to-br from-[#1A1040] to-[#2A1D5C] p-8 text-white flex gap-6 items-start shadow-xl border border-white/5">
              <span className="text-4xl shrink-0">📦</span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base sm:text-lg">Questions About Your Order?</h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  Our support team is happy to help with any shipping or delivery queries. Email us at{" "}
                  <a href="mailto:support@lalastories.com" className="text-[#FFB380] hover:underline font-semibold">
                    support@lalastories.com
                  </a>{" "}
                  with your order ID and we'll get back to you promptly.
                </p>
                <p className="text-white/40 text-[10px] sm:text-xs pt-1 font-semibold leading-relaxed">
                  Funfeed Global Private Limited &nbsp;·&nbsp; 48/1961 Sahakarana Road, Vyttila, Ernakulam, Kerala 682019, India
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

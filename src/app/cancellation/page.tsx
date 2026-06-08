import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Lala Stories",
  description:
    "Read the Lala Stories Cancellation and Refund Policy — how to cancel your subscription, request refunds and manage billing for the Lala Stories app.",
  alternates: {
    canonical: "https://lalastories.com/cancellation",
  },
};

export default function Cancellation() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cancellation and Refund Policy — Lala Stories",
    "url": "https://lalastories.com/cancellation",
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
                💳 Legal
              </div>
              <h1 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-white leading-tight">
                Cancellation &amp; <span className="text-[#FF7A2F]">Refund</span> Policy
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
              At <strong>Lala Stories</strong>, we believe in fair and transparent billing. This policy outlines how cancellations and refunds work for our subscriptions, in-app purchases and content purchases. Please read it carefully so you always know what to expect.
            </div>

            {/* Quick summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">🔄</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">Cancel Anytime</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Cancel your subscription at any time — access continues until the end of your billing cycle.
                </p>
              </div>
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">⏱️</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">5-Day Refund Window</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Contact us within 5 business days of a billing error or accidental charge.
                </p>
              </div>
              <div className="p-6 bg-white border-t-3 border-[#FF7A2F] rounded-2xl shadow-xs text-center space-y-2">
                <span className="text-3xl block">💬</span>
                <h4 className="font-heading font-bold text-sm text-gray-900">We're Here to Help</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Reach our support team at support@lalastories.com for any billing questions.
                </p>
              </div>
            </div>

            {/* Section 1: Cancellation */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  🔄
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Cancellation of Paid Services</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Users can cancel their subscription or paid services with Lala Stories <strong>at any time</strong>. The cancellation will be effective at the end of the current billing cycle.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Users will <strong>continue to have access</strong> to all paid features until the end of the current billing period, even after cancellation is submitted.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Lala Stories does <strong>not provide pro-rated refunds</strong> for unused portions of the subscription or service.</p>
                </li>
              </ul>
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 text-[#E55A10] text-xs sm:text-sm font-semibold">
                To cancel, manage your subscription through the App Store (iOS) or Google Play Store (Android) — the same platform where your subscription was originally purchased.
              </div>
            </div>

            {/* Section 2: Refunds */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  💰
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Refunds</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Refunds are typically processed in cases of <strong>accidental overcharges, billing errors</strong>, or any other issues arising from Lala Stories' end.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Refunds are <strong>subject to review and approval</strong> by Lala Stories and are issued at their discretion.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>In-app purchases, if applicable, are typically subject to the <strong>respective app store's refund policies</strong> (Apple App Store / Google Play Store).</p>
                </li>
              </ul>

              {/* Timeline */}
              <div className="pt-6 border-t border-gray-100 space-y-6">
                <h4 className="font-heading font-bold text-gray-900 text-base">How to Request a Refund</h4>
                <div className="relative border-l-2 border-orange-100 ml-5 space-y-8">
                  {/* Item 1 */}
                  <div className="relative pl-8">
                    <span className="absolute left-[-21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-sm font-bold text-white shadow-md">
                      1
                    </span>
                    <h5 className="font-heading font-bold text-sm sm:text-base text-gray-900 mb-1">
                      Contact Customer Support
                    </h5>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 font-semibold">
                      Email <a href="mailto:support@lalastories.com" className="text-[#FF7A2F] hover:underline">support@lalastories.com</a> within 5 business days of the charge, providing all necessary details and documentation.
                    </p>
                    <span className="inline-block bg-orange-50 text-[#FF7A2F] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      Within 5 business days
                    </span>
                  </div>
                  {/* Item 2 */}
                  <div className="relative pl-8">
                    <span className="absolute left-[-21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-sm font-bold text-white shadow-md">
                      2
                    </span>
                    <h5 className="font-heading font-bold text-sm sm:text-base text-gray-900 mb-1">
                      Review &amp; Approval
                    </h5>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 font-semibold">
                      Our support team reviews your request, verifies billing records, and confirms eligibility. You will be notified of the outcome.
                    </p>
                    <span className="inline-block bg-orange-50 text-[#FF7A2F] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      Review period
                    </span>
                  </div>
                  {/* Item 3 */}
                  <div className="relative pl-8">
                    <span className="absolute left-[-21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-sm font-bold text-white shadow-md">
                      3
                    </span>
                    <h5 className="font-heading font-bold text-sm sm:text-base text-gray-900 mb-1">
                      Refund Initiated
                    </h5>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 font-semibold">
                      Once approved, the refund transaction is initiated by our billing department within <strong>5–7 business days</strong>.
                    </p>
                    <span className="inline-block bg-orange-50 text-[#FF7A2F] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      5–7 business days
                    </span>
                  </div>
                  {/* Item 4 */}
                  <div className="relative pl-8">
                    <span className="absolute left-[-21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-sm font-bold text-white shadow-md">
                      4
                    </span>
                    <h5 className="font-heading font-bold text-sm sm:text-base text-gray-900 mb-1">
                      Amount Credited
                    </h5>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 font-semibold">
                      The refund amount is credited back to your original payment method within <strong>3 business days</strong> after initiation.
                    </p>
                    <span className="inline-block bg-orange-50 text-[#FF7A2F] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      3 business days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Content Purchases */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  🎁
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Content Purchases</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Refunds for content purchases (e.g., virtual gifts, premium content bundles) are <strong>generally not provided</strong> unless there is a technical issue or an error on Lala Stories' part.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Users should contact customer support for any content-related refund requests, <strong>providing relevant transaction IDs and details</strong>.</p>
                </li>
              </ul>
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100/50 text-red-700 text-xs sm:text-sm font-semibold flex gap-2">
                <span>⚠️</span>
                <p>Content purchases are final unless a verifiable technical error or billing mistake has occurred on Lala Stories' end.</p>
              </div>
            </div>

            {/* Section 4: Subscription Renewals */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  🔁
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Subscription Renewals</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Subscriptions are <strong>renewed automatically</strong> unless canceled by the user before the scheduled renewal date.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Refunds are <strong>not typically provided</strong> for subscription renewals if the user fails to cancel before the renewal date.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Users should <strong>manage their subscriptions</strong> through the app store account (Apple App Store or Google Play Store) to turn off automatic renewals.</p>
                </li>
              </ul>
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 text-[#E55A10] text-xs sm:text-sm font-semibold">
                We recommend setting up renewal reminders in your device settings or app store account settings to avoid unexpected charges.
              </div>
            </div>

            {/* Section 5: Policy Updates */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-2xl text-white shadow-md shadow-orange-500/20">
                  📝
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-900">Policy Updates</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Lala Stories reserves the right to <strong>update or modify</strong> this cancellation and refund policy at its sole discretion.</p>
                </li>
                <li className="flex gap-4 items-start text-sm sm:text-[15px] text-gray-500 leading-relaxed font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A2F] mt-2 shrink-0" />
                  <p>Users are encouraged to <strong>review this policy periodically</strong> for any changes. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
                </li>
              </ul>
            </div>

            {/* Corporate contact banner */}
            <div className="rounded-3xl bg-linear-to-br from-[#1A1040] to-[#2A1D5C] p-8 text-white flex gap-6 items-start shadow-xl border border-white/5">
              <span className="text-4xl shrink-0">✉️</span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base sm:text-lg">Need Help with a Refund?</h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  Our customer support team is ready to assist you with any billing or refund queries. Email us at{" "}
                  <a href="mailto:support@lalastories.com" className="text-[#FFB380] hover:underline font-semibold">
                    support@lalastories.com
                  </a>{" "}
                  — please include your account details and a description of the issue.
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

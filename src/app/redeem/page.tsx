import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RedeemFlow from "./RedeemFlow";

export const metadata: Metadata = {
  title: "Redeem a Coupon — LALA Stories",
  description:
    "Have a LALA Stories coupon code? Enter it here, confirm your mobile number, and your plan is activated on the LALA Stories app.",
};

export default function RedeemPage() {
  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
              🎟️ Redeem
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
              Redeem your <span className="text-[#FF7A2F]">coupon</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed max-w-lg mx-auto">
              Enter your code, confirm your mobile number with a one-time
              password, and your plan is activated on the LALA Stories app.
            </p>
          </div>

          <RedeemFlow />

          <section className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-3 text-sm text-text-muted leading-relaxed">
            <h2 className="font-heading font-extrabold text-lg text-text-dark">
              Good to know
            </h2>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                The plan goes on the app account for the mobile number you
                confirm here. Log in to the app with that same number to use it.
              </li>
              <li>Some coupons cover the whole plan. Others cover part of it, and you pay the rest here securely.</li>
              <li>A one-time password is sent by SMS (or WhatsApp outside India) and is valid for 10 minutes.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

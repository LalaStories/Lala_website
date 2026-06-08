import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ApplicationForm from "./ApplicationForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Special Free Access Program for Kids with Special Needs — LALA Stories",
  description:
    "LALA Stories is committed to making screen-free bedtime stories accessible. Families with differently abled children can apply to receive a full premium account for free.",
};

export default async function DifferentlyAbledProgramPage() {
  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* Header section */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider">
              🤝 Social Impact Initiative
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Stories are for <span className="text-[#FF7A2F]">Everyone</span>
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              We are dedicated to supporting children with special needs. Discover how screen-free audio stories can benefit your child, and apply for a free premium subscription.
            </p>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
            
            {/* Info Column */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div className="space-y-4">
                <h2 className="font-heading text-2xl font-extrabold text-[#FF7A2F]">
                  Why Audio Stories Benefit Special Kids
                </h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  Audio stories act as an exceptional learning and relaxing tool, offering screen-free engagement that benefits developmental processes.
                </p>
              </div>

              {/* Benefit List cards */}
              <div className="space-y-6">
                {[
                  {
                    icon: "👁️",
                    title: "Screen-Free Auditory Comfort",
                    desc: "Perfect for visually impaired children. Relies entirely on premium, professional audio narration that is warm and engaging.",
                  },
                  {
                    icon: "🧘",
                    title: "Calms Sensory Overload",
                    desc: "Ideal for kids on the Autism spectrum. Gentle background music and soft voices reduce anxiety and soothe hyper-sensitivities.",
                  },
                  {
                    icon: "🧠",
                    title: "Focus and ADHD Support",
                    desc: "Audio narratives spark vivid imagination and lock in attention, helping children practice focus and listening comprehension in a relaxing way.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-card-bg border border-card-border shadow-xs hover:border-orange-500/10 hover:shadow-md transition-all">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-base text-text-dark">{item.title}</h3>
                      <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <ApplicationForm />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

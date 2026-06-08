"use client";

import React from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/utils/helpers";

export const ExploreMore: React.FC = () => {
  const { ref: revealRef, isVisible } = useScrollReveal();

  const offerings = [
    {
      emoji: "🧸",
      title: "LALA Shop",
      description: "Snuggle up with our cuddly crescent moon plush toys and turn pages of beautifully illustrated bedtime board books.",
      btnText: "Explore Books & Toys",
      href: "/products",
      color: "border-amber-500/10 hover:border-amber-500/30",
      btnBg: "bg-amber-500 hover:bg-amber-600",
    },
    {
      emoji: "💳",
      title: "Premium Plans",
      description: "Enjoy unlimited access to 3000+ bedtime audios, offline downloads, sleep timers, and priority account updates.",
      btnText: "View Subscriptions",
      href: "/premium",
      color: "border-[#FF7A2F]/10 hover:border-[#FF7A2F]/30",
      btnBg: "bg-[#FF7A2F] hover:bg-[#E55A10]",
    },
    {
      emoji: "🤝",
      title: "Free Access Program",
      description: "We are committed to helping special needs children. Learn about our program and apply for free premium app credentials.",
      btnText: "Apply for Free Access",
      href: "/differently-abled",
      color: "border-violet-500/10 hover:border-violet-500/30",
      btnBg: "bg-violet-600 hover:bg-violet-700",
    },
  ];

  return (
    <section
      id="explore-more"
      className="py-24 bg-bg-warm-alt relative overflow-hidden font-body"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#FF7A2F] uppercase tracking-widest block">
            More to Explore
          </span>
          <h2 className="font-heading text-3.5xl md:text-4.5xl font-extrabold text-text-dark tracking-tight">
            Discover LALA Stories <span className="text-[#FF7A2F]">Universe</span>
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
            Beyond bedtime listening, check out our products shop, custom plans, and social impact programs.
          </p>
        </div>

        {/* Offerings Grid */}
        <div
          ref={revealRef as any}
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {offerings.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "group flex flex-col justify-between p-8 rounded-3xl bg-card-bg border shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                item.color
              )}
            >
              <div className="space-y-4">
                <span className="text-4xl block group-hover:scale-110 transition-transform duration-300 select-none">
                  {item.emoji}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-text-dark">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={item.href}
                  className={cn(
                    "w-full text-center inline-flex justify-center items-center py-3 rounded-full text-white text-xs font-extrabold shadow-sm transition-all select-none hover:scale-102 active:scale-98 cursor-pointer border-none",
                    item.btnBg
                  )}
                >
                  {item.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;

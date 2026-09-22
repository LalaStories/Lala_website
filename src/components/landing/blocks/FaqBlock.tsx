"use client";

import React, { useState } from "react";
import SectionHeading from "../SectionHeading";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface FaqBlockProps {
  title: string;
  subtitle: string;
  items: FaqEntry[];
}

/** Accordion FAQ — handles the objections that stop people converting. */
export default function FaqBlock({ title, subtitle, items }: FaqBlockProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="space-y-3.5">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                  isOpen
                    ? "border-[#FF7A2F]/40 bg-white/10"
                    : "border-white/12 bg-white/5 hover:bg-white/8"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-6 py-5 text-left"
                >
                  <span className="font-heading text-base font-bold text-white sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-[#FF7A2F] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-white/70">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

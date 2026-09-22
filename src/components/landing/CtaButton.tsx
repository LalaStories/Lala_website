"use client";

import React from "react";
import { Cta, ctaHref, ctaOpensNewTab } from "@/types/landing";
import { trackPixel } from "./MetaPixel";
import { cn } from "@/utils/helpers";

/** Anchor the lead form carries, so "form" CTAs have somewhere to scroll. */
export const LEAD_FORM_ANCHOR = "lead-form";

interface CtaButtonProps {
  cta: Cta;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
}

/**
 * Renders one call-to-action. Every click reports to the Meta pixel so
 * campaigns can optimise on the action that actually happened:
 * Contact for WhatsApp/call, Lead for form scroll, InitiateCheckout otherwise.
 */
export default function CtaButton({ cta, variant = "primary", size = "lg", className }: CtaButtonProps) {
  const href = ctaHref(cta);
  const label = cta.label?.trim() || "Get Started";

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 font-heading font-bold rounded-full cursor-pointer select-none",
    "transition-all duration-300 hover:scale-105 active:scale-95 text-center",
    size === "lg" ? "py-4 px-9 text-base sm:text-lg" : "py-3 px-6 text-sm",
    variant === "primary" &&
      "bg-linear-to-br from-[#FF7A2F] to-[#E55A10] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40",
    variant === "secondary" &&
      "bg-white/10 text-white border-2 border-white/25 backdrop-blur-md hover:bg-white/20 hover:border-[#FFB380]",
    className
  );

  const handleClick = (e: React.MouseEvent) => {
    switch (cta.type) {
      case "form": {
        e.preventDefault();
        const target = document.getElementById(LEAD_FORM_ANCHOR);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          // Focus the first input so a tap goes straight to typing.
          const input = target.querySelector<HTMLInputElement>("input, select, textarea");
          window.setTimeout(() => input?.focus({ preventScroll: true }), 600);
        }
        trackPixel("Lead", { content_name: label, lead_type: "form_scroll" });
        break;
      }
      case "whatsapp":
      case "call":
        trackPixel("Contact", { content_name: label, method: cta.type });
        break;
      default:
        trackPixel("InitiateCheckout", { content_name: label, method: cta.type });
    }
  };

  // "form" CTAs scroll rather than navigate, so they stay buttons.
  if (!href) {
    return (
      <button type="button" onClick={handleClick} className={classes}>
        {label}
      </button>
    );
  }

  const newTab = ctaOpensNewTab(cta);

  return (
    <a
      href={href}
      onClick={handleClick}
      className={classes}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

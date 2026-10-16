"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Classify a clicked link into an analytics event, or null to ignore it.
 * Ordinary in-site navigation is already covered by page_view, and GA4's
 * enhanced measurement reports generic outbound clicks on its own.
 */
function classify(anchor: HTMLAnchorElement): { name: string; params: Record<string, string> } | null {
  const href = anchor.getAttribute("href") ?? "";
  const label = (anchor.getAttribute("aria-label") || anchor.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  if (href.startsWith("tel:")) return { name: "contact_call", params: { method: "phone", link_text: label } };
  if (href.startsWith("mailto:")) return { name: "contact_email", params: { method: "email", link_text: label } };
  if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) {
    return { name: "contact_whatsapp", params: { method: "whatsapp", link_text: label } };
  }
  if (/apps\.apple\.com|itunes\.apple\.com/i.test(href)) {
    return { name: "app_store_click", params: { store: "app_store", link_text: label } };
  }
  if (/play\.google\.com/i.test(href)) {
    return { name: "app_store_click", params: { store: "google_play", link_text: label } };
  }
  const social = href.match(/(facebook|instagram|youtube|twitter|x\.com|linkedin)/i);
  if (social) return { name: "social_click", params: { network: social[1].toLowerCase(), link_text: label } };

  return null;
}

/**
 * Read `data-track="event_name"` plus any `data-track-<param>` attributes,
 * so server components can mark a button without becoming client components:
 *   <Link data-track="cta_click" data-track-cta-label="Redeem coupon" …>
 */
function fromDataAttributes(el: HTMLElement): { name: string; params: Record<string, string> } | null {
  const name = el.dataset.track;
  if (!name) return null;
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key !== "track" && key.startsWith("track") && value !== undefined) {
      // dataset camel-cases: data-track-cta-label → trackCtaLabel → cta_label
      const param = key.slice(5).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`).replace(/^_/, "");
      params[param] = value;
    }
  }
  return { name, params };
}

/**
 * One delegated listener for the clicks that matter site-wide — call,
 * WhatsApp, email, app-store and social links — so every page reports them
 * without each button needing its own handler. Listens in the capture
 * phase so a handler that stops propagation can't hide the click.
 */
export default function ClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      const tagged = target.closest("[data-track]") as HTMLElement | null;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;

      // An explicit data-track wins over link classification so a tagged
      // link isn't reported twice.
      const hit = (tagged && fromDataAttributes(tagged)) || (anchor && classify(anchor));
      if (hit) trackEvent(hit.name, hit.params);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

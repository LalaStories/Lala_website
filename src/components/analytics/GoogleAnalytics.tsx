"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { trackPageView } from "@/lib/analytics";

interface GoogleAnalyticsProps {
  /** GA4 Measurement ID ("G-…"). Nothing renders when empty. */
  measurementId?: string | null;
  /** Google Ads conversion ID ("AW-…"). Configured on the same tag when set. */
  adsId?: string | null;
}

/**
 * Google Analytics 4 base tag.
 *
 * The `config` call reports the first page view itself. The App Router
 * doesn't reload the page on navigation, so later page views are sent from
 * an effect keyed on the pathname; the first run is skipped so the landing
 * page isn't counted twice.
 */
export default function GoogleAnalytics({ measurementId, adsId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!measurementId) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackPageView(`${pathname}${window.location.search}`);
  }, [measurementId, pathname]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
          ${adsId ? `gtag('config', '${adsId}');` : ""}
        `}
      </Script>
    </>
  );
}

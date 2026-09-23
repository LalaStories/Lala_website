"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a Meta standard event on every pixel initialised on the page
 * (site pixel plus any campaign pixel). Safe to call when no pixel is
 * configured — fbq simply won't exist and the call is skipped.
 */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

interface MetaPixelProps {
  /** Pixel ID from Meta Events Manager. Nothing renders when empty. */
  pixelId?: string | null;
}

/**
 * Meta Pixel base code, loaded through next/script so it never blocks first
 * paint. Several instances can coexist (site pixel in the root layout, a
 * campaign pixel on a landing page): the loader is idempotent and every
 * PageView is scoped to its own pixel with `trackSingle`, so no pixel is
 * ever counted twice.
 *
 * The App Router doesn't re-run scripts on client-side navigation, so
 * PageView is fired from an effect keyed on the pathname instead of from
 * the inline snippet.
 */
export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pixelId || typeof window.fbq !== "function") return;
    window.fbq("trackSingle", pixelId, "PageView");
  }, [pixelId, pathname]);

  if (!pixelId) return null;

  return (
    <>
      <Script id={`meta-pixel-${pixelId}`} strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

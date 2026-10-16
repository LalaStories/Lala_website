"use client";

import Script from "next/script";

interface ClarityProps {
  /** Project ID from clarity.microsoft.com. Nothing renders when empty. */
  projectId?: string | null;
}

/**
 * Microsoft Clarity tag (session recordings, heatmaps, rage/dead clicks).
 *
 * Loaded through next/script after hydration so it never delays first
 * paint; that is the App Router equivalent of putting the snippet in
 * <head>. Clarity hooks the History API itself, so client-side navigation
 * is recorded without any extra code here.
 */
export default function Clarity({ projectId }: ClarityProps) {
  if (!projectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}

import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { AudioProvider } from "@/store/AudioContext";
import { ThemeProvider } from "@/store/ThemeContext";
import MetaPixel from "@/components/analytics/MetaPixel";
import Clarity from "@/components/analytics/Clarity";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ClickTracker from "@/components/analytics/ClickTracker";
import { SITE_META_PIXEL_ID } from "@/lib/meta-pixel";
import {
  SITE_CLARITY_PROJECT_ID,
  SITE_GA_MEASUREMENT_ID,
  SITE_GOOGLE_ADS_ID,
} from "@/lib/analytics-ids";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lalastories.com"),
  title: "LALA Stories — Magical Bedtime Stories for Kids",
  description: "Screen-free audio storytelling app for kids aged 3–10. 3000+ magical bedtime stories that boost sleep, vocabulary and imagination.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${quicksand.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-secondary text-text-dark">
        <ThemeProvider>
          <AudioProvider>{children}</AudioProvider>
        </ThemeProvider>
        {/* Site-wide Meta Pixel. Landing pages may add a campaign pixel on top. */}
        <MetaPixel pixelId={SITE_META_PIXEL_ID} />
        {/* Analytics only in production builds so local work doesn't show up as traffic. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleAnalytics measurementId={SITE_GA_MEASUREMENT_ID} adsId={SITE_GOOGLE_ADS_ID} />
            <Clarity projectId={SITE_CLARITY_PROJECT_ID} />
          </>
        )}
        <ClickTracker />
      </body>
    </html>
  );
}

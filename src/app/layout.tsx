import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { AudioProvider } from "@/store/AudioContext";
import { ThemeProvider } from "@/store/ThemeContext";
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
      </body>
    </html>
  );
}

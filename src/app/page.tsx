import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";

export const dynamic = "force-dynamic";

import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedStories from "@/components/sections/FeaturedStories";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import AppShowcase from "@/components/sections/AppShowcase";
import Cta from "@/components/sections/Cta";
import ExploreMore from "@/components/sections/ExploreMore";
import ActiveAudioPlayer from "@/components/common/ActiveAudioPlayer";
import QrPopup from "@/components/common/QrPopup";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "LALA Stories — Magical Bedtime Stories for Kids Aged 3–10",
  description:
    "Lala Stories is a screen-free audio storytelling app for kids aged 3–10. 3000+ magical bedtime stories that boost sleep, vocabulary and imagination. Try free tonight!",
  alternates: {
    canonical: "https://lalastories.com/",
  },
  openGraph: {
    type: "website",
    siteName: "Lala Stories",
    url: "https://lalastories.com/",
    title: "Lala Stories — Magical Bedtime Stories for Kids",
    description:
      "Screen-free audio bedtime stories for kids aged 3–10. 3000+ tales that spark imagination and help little ones drift off to dreamland.",
    images: [
      {
        url: "https://lalastories.com/assets/images/hero_illustration.png",
        width: 1200,
        height: 630,
        alt: "Lala Stories Bedtime child reading crescent moon illustration",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lala Stories — Magical Bedtime Stories for Kids",
    description:
      "Screen-free audio bedtime stories for kids aged 3–10. 3000+ tales that spark imagination and help little ones drift off to dreamland.",
    images: ["https://lalastories.com/assets/images/hero_illustration.png"],
  },
};

export default async function Home() {
  const rawStories = await db.story.findMany();
  const stories = rawStories.map(s => ({
    ...s,
    badge: s.badge as any
  }));
  const testimonials = await db.testimonial.findMany();
  
  const activeVideo = await db.bgVideo.findFirst({
    where: { isActive: true },
  });
  const heroVideoUrl = activeVideo ? activeVideo.videoUrl : "";

  // Structured Data schemas
  const schemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://lalastories.com/#organization",
        "name": "Lala Stories",
        "legalName": "Funfeed Global Private Limited",
        "url": "https://lalastories.com",
        "logo": "https://lalastories.com/assets/images/LALA logo- PNG.png",
        "email": "support@lalastories.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "48/1961 Sahakarana Road, Manjunivas",
          "addressLocality": "Vyttila, Ernakulam",
          "addressRegion": "Kerala",
          "postalCode": "682019",
          "addressCountry": "IN"
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://lalastories.com/#website",
        "url": "https://lalastories.com",
        "name": "Lala Stories",
        "publisher": { "@id": "https://lalastories.com/#organization" }
      },
      {
        "@type": "MobileApplication",
        "name": "Lala Stories — Bedtime Stories",
        "description": "Screen-free audio storytelling app for kids aged 3–10 with 3000+ magical bedtime tales.",
        "operatingSystem": "iOS, Android",
        "applicationCategory": "EducationalApplication",
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "Children aged 3–10"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "50000"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      }
    ]
  };

  return (
    <>
      {/* Insert JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
        <Header />
        <main className="grow">
          <Hero videoUrl={heroVideoUrl} />
          <FeaturedStories stories={stories} />
          <HowItWorks />
          <AppShowcase />
          <Testimonials testimonials={testimonials} />
          <ExploreMore />
          <Cta />
        </main>
        <Footer />
        <ActiveAudioPlayer />
        <QrPopup />
      </div>
    </>
  );
}

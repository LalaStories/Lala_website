import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — Lala Stories | Screen-Free Bedtime Stories for Kids",
  description:
    "Learn about Lala Stories — the screen-free audio storytelling app helping kids aged 3–10 sleep better, grow vocabulary and bond with family at bedtime.",
  alternates: {
    canonical: "https://lalastories.com/about",
  },
  openGraph: {
    type: "website",
    siteName: "Lala Stories",
    url: "https://lalastories.com/about",
    title: "About Lala Stories — Screen-Free Bedtime Stories for Kids",
    description:
      "Lala Stories helps kids aged 3–10 build healthier bedtime routines with magical audio tales that boost sleep, vocabulary and family bonding.",
    images: [
      {
        url: "https://lalastories.com/assets/images/hero_illustration.png",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Lala Stories — Screen-Free Bedtime Stories for Kids",
    description:
      "Lala Stories helps kids aged 3–10 build healthier bedtime routines with magical audio tales that boost sleep, vocabulary and family bonding.",
    images: ["https://lalastories.com/assets/images/hero_illustration.png"],
  },
};

export default function About() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Lala Stories",
    "url": "https://lalastories.com/about",
    "description": "Learn about Lala Stories, the screen-free audio storytelling platform for children aged 3–10.",
    "publisher": {
      "@type": "Organization",
      "name": "Lala Stories",
      "url": "https://lalastories.com"
    }
  };

  return (
    <>
      {/* Dynamic JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#FFF7F0] font-body text-gray-800">
        <Header />

        <main className="grow">
          {/* ========== HERO ========== */}
          <section className="relative pt-36 pb-20 text-center overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white">
            <StarBackground count={80} />

            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-4 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-[#FFB380] border border-orange-500/30 px-4.5 py-1.5 rounded-full text-xs font-bold font-heading">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                Our Story
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                About <span className="text-[#FF7A2F]">Lala Stories</span>
              </h1>
              <p className="text-white/80 max-w-xl mx-auto text-base sm:text-[17px] leading-relaxed">
                Helping children aged 3–10 build healthier bedtime routines through the magic of screen-free audio storytelling.
              </p>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full z-10 pointer-events-none select-none">
              <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
                <path
                  d="M0,60 C360,80 720,30 1080,60 C1260,75 1380,40 1440,60 L1440,80 L0,80 Z"
                  fill="#1A1040"
                />
              </svg>
            </div>
          </section>

          {/* ========== STATS BAR ========== */}
          <section className="bg-[#1A1040] py-12 text-white border-t border-white/5 relative z-10 font-body">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                <div className="text-3xl font-heading font-extrabold text-[#FF7A2F]">3000+</div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Audio Stories</div>
              </div>
              <div className="text-center space-y-3 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>
                <div className="text-3xl font-heading font-extrabold text-[#FF7A2F]">200K+</div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Happy Kids</div>
              </div>
              <div className="text-center space-y-3 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                <div className="text-3xl font-heading font-extrabold text-[#FF7A2F]">30K+</div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Families</div>
              </div>
              <div className="text-center space-y-3 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-400"><path fillRule="evenodd" d="M10.788 2.903a.75.75 0 0 1 1.424 0l2.082 5.006 5.404.434a.75.75 0 0 1 .415 1.298l-4.043 3.543 1.258 5.25a.75.75 0 0 1-1.086.86L12 16.586l-4.498 2.502a.75.75 0 0 1-1.086-.86l1.258-5.25L3.63 9.641a.75.75 0 0 1 .415-1.298l5.404-.434 2.082-5.006Z" clipRule="evenodd" /></svg>
                <div className="text-3xl font-heading font-extrabold text-[#FF7A2F]">4.9</div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">App Rating</div>
              </div>
            </div>
          </section>

          {/* ========== SCREEN TIME SECTION ========== */}
          <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Visual Box */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-linear-to-br from-[#1A1040] to-[#2A1D5C] shadow-lg flex items-center justify-center select-none group border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-20 h-20 text-[#FFD966] filter drop-shadow-[0_0_15px_rgba(255,217,102,0.6)] animate-pulse">
                <path d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 1 1-13.754-13.754.75.75 0 0 1 .838.182Z" />
              </svg>
              <span className="absolute bottom-6 right-6 rounded-lg bg-orange-500/20 text-xs font-semibold px-4 py-2 text-white border border-orange-500/25">
                Ages <span className="text-[#FF7A2F] font-bold">3–10</span> &nbsp;·&nbsp; Bedtime
              </span>
            </div>
            {/* Text Box */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-[#FF7A2F] px-3.5 py-1 rounded-full text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h12" /><path d="M3 3l18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                Screen-Free Bedtime
              </div>
              <h2 className="font-heading text-2.5xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Worried About Too Much <span className="text-[#FF7A2F]">Screen Time?</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                Lala Stories offers a fun, screen-free alternative for your kids. Our audio storytelling platform helps children aged 3–10 develop healthier bedtime routines.
              </p>
              <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                Instead of staring at screens, kids can indulge in delightful audio tales every night. Not only does this promote better sleep, but it also boosts their cognitive development — so you can rest easy knowing your child is engaging in a healthier habit.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">Cognitive Development</span>
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">Better Sleep</span>
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">No Screens</span>
              </div>
            </div>
          </section>

          {/* ========== FAMILY BONDING SECTION ========== */}
          <section className="py-20 bg-white border-y border-orange-50/50">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text Box */}
              <div className="space-y-4 order-2 md:order-1 font-body">
                <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-[#FF7A2F] px-3.5 py-1 rounded-full text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                  Family Bonding
                </div>
                <h2 className="font-heading text-2.5xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                  A Special Way to <span className="text-[#FF7A2F]">Connect</span> with Your Kids
                </h2>
                <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                  Lala Stories is more than just bedtime entertainment — it's a special way to connect with your kids. We invite parents to join their children in the storytelling tradition.
                </p>
                <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                  Listening to stories together isn't just fun — it's a chance to create cherished memories and strengthen family bonding. Make bedtime a time for togetherness and love with Lala Stories.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full bg-[#FFF7F0] px-4 py-1.5 text-xs font-bold text-gray-700 border border-orange-50">Cherished Memories</span>
                  <span className="rounded-full bg-[#FFF7F0] px-4 py-1.5 text-xs font-bold text-gray-700 border border-orange-50">Family Time</span>
                </div>
              </div>
              {/* Visual Box */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-linear-to-br from-[#FFF7F0] to-[#FFE5CC] shadow-lg flex items-center justify-center select-none order-1 md:order-2 border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24 text-[#FF7A2F] filter drop-shadow-md">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span className="absolute bottom-6 right-6 rounded-lg bg-orange-500/10 text-xs font-bold px-4 py-2 text-[#FF7A2F] border border-orange-500/15">
                  Together <span className="text-[#E55A10]">Every Night</span>
                </span>
              </div>
            </div>
          </section>

          {/* ========== SPEECH DEVELOPMENT SECTION ========== */}
          <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Visual Box */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-linear-to-br from-[#FFF9E6] to-[#FFF0C2] shadow-lg flex items-center justify-center select-none border border-yellow-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24 text-yellow-600 filter drop-shadow-md">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
              <span className="absolute bottom-6 right-6 rounded-lg bg-orange-500/10 text-xs font-bold px-4 py-2 text-[#FF7A2F] border border-orange-500/15">
                Speech &amp; <span className="text-[#E55A10]">Hearing</span>
              </span>
            </div>
            {/* Text Box */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-[#FF7A2F] px-3.5 py-1 rounded-full text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                Speech Development
              </div>
              <h2 className="font-heading text-2.5xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Boost the <span className="text-[#FF7A2F]">Baby Babble!</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                Listening to stories is beneficial for your child's speech and hearing development. When kids listen to stories, they're exposed to new words, helping them learn to speak fluently.
              </p>
              <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
                Lala Stories enhances listening skills, which in turn improves speaking abilities. Plus, it's a great way to boost concentration in children. Experience Lala Stories and watch your child's baby babble flourish!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">Vocabulary Growth</span>
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">Listening Skills</span>
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm border border-orange-50">Concentration</span>
              </div>
            </div>
          </section>

          {/* ========== LALA BOOKS SECTION ========== */}
          <section className="py-20 bg-white border-t border-orange-50/50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative rounded-3xl bg-linear-to-b from-[#1A1040] to-[#3A2070] p-10 md:p-14 overflow-hidden text-white grid grid-cols-1 md:grid-cols-2 gap-10 items-center border border-white/5 shadow-2xl">
                {/* Visual SVG Watermark */}
                <div className="absolute right-[-50px] bottom-[-50px] text-white/5 w-80 h-80 pointer-events-none select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>

                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#FF7A2F]/20 text-[#FFB380] border border-[#FF7A2F]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.71h-5.91l.813-5.194L4 15.904h5.813zM9.813 15.904L9 21" /></svg>
                    New Feature
                  </div>
                  <h2 className="font-heading text-2.5xl sm:text-4xl font-extrabold text-white leading-tight">
                    Lala Books: Where Stories <br />Come to <span className="text-[#FFD966]">Life</span>
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    At Lala Books, we curate an eclectic collection of literature to ignite your imagination and satisfy your literary cravings. From classic tales to contemporary bestsellers, we offer something for every reader.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Step into our welcoming space, connect with fellow book lovers, and let the adventure begin. Join us at Lala Books, where every page holds a new world to explore.
                  </p>
                  <div className="pt-2">
                    <Button variant="accent">🛒 Buy Now</Button>
                  </div>
                </div>

                <div className="flex justify-center items-center z-10">
                  <div className="h-64 w-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-8xl shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-32 h-32 text-white/40"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== WHY LALA STORIES ========== */}
          <section className="py-20 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-gray-900 mb-4">
                Why <span className="text-[#FF7A2F]">Lala Stories?</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Everything we do is designed to give your child the best possible start — one bedtime story at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Soothing Narration</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Professional voices paired with calming background music create the perfect sleep atmosphere.</p>
              </div>

              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">100% Kid-Safe</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">No ads, no spam, fully parent-approved. Every story is thoroughly reviewed for age appropriateness.</p>
              </div>

              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">New Stories Weekly</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Fresh audio tales released every single week to keep bedtimes exciting and fresh.</p>
              </div>

              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Sleep Timer</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Auto-stop features trigger so audio terminates once kids drift off — no screens left on.</p>
              </div>

              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.71h-5.91l.813-5.194L4 15.904h5.813z" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Educational Value</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Every narrative is crafted to boost vocabulary, trigger imagination, and build cognition.</p>
              </div>

              <div className="p-8 bg-white border border-orange-50/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-8 h-8 text-[#FF7A2F] mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h12" /></svg>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Works Everywhere</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Available on Android and iOS. Listen at home, in the car, or wherever bedtime happens.</p>
              </div>
            </div>
          </section>

          {/* ========== FINAL CTA ========== */}
          <section className="py-20 bg-linear-to-b from-[#FF7A2F] to-[#E55A10] text-center text-white relative overflow-hidden flex flex-col items-center">
            {/* Glowing decorations SVG */}
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 select-none pointer-events-none w-48 h-48 opacity-[0.03]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 1 1-13.754-13.754.75.75 0 0 1 .838.182Z" /></svg>
            </div>
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 select-none pointer-events-none w-40 h-40 opacity-[0.02]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M10.788 2.903a.75.75 0 0 1 .415 1.298l-4.043 3.543 1.258 5.25a.75.75 0 0 1-1.086.86L12 16.586l-4.498 2.502a.75.75 0 0 1-1.086-.86l1.258-5.25L3.63 9.641a.75.75 0 0 1 .415-1.298l5.404-.434 2.082-5.006Z" clipRule="evenodd" /></svg>
            </div>

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto px-6 flex flex-col items-center">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">Start Your Bedtime Magic Tonight</h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-md mx-auto">
                Join thousands of happy families and make bedtime the best part of the day. Your first stories are completely free.
              </p>
              <div className="pt-2">
                <Button href="https://lalakidsstories.page.link/share" variant="secondary">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

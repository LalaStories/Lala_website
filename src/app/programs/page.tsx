import type { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgramCard from "@/components/sections/ProgramCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programs & Events — LALA Stories",
  description: "Join LALA Stories seasonal programs and events — Story Telling workshops, LALA Meetups, and more! Register online with ease.",
  alternates: { canonical: "https://lalastories.com/programs" },
};

export default async function ProgramsPage() {
  const programs = await db.program.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary text-text-dark">
      <Header />
      <main className="grow pt-24 pb-20">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white py-20 px-6 text-center">
          {/* Decorative glows */}
          <div className="absolute top-[-20%] left-[10%] w-72 h-72 rounded-full bg-[#FF7A2F]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[10%] w-72 h-72 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-[#FFB380] px-4 py-1.5 text-xs font-bold font-heading">
              <span className="h-2 w-2 rounded-full bg-[#FF7A2F] animate-pulse" />
              Seasonal Events
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight">
              LALA <span className="text-[#FF7A2F]">Programs</span> &amp; Events
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Join our magical seasonal events — story telling workshops, LALA meetups, and more. Register in seconds and make unforgettable memories!
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          {programs.length > 0 ? (
            <>
              <p className="text-center text-sm text-[#6B6B6B] dark:text-white/50 font-semibold mb-10">
                {programs.length} upcoming program{programs.length !== 1 ? "s" : ""} — click any card to register!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24 flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-10 h-10 text-[#FF7A2F]/60">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#2D2D2D] dark:text-white">No upcoming programs</h2>
                <p className="text-[#6B6B6B] dark:text-white/50 text-sm mt-2 max-w-sm mx-auto">
                  We&apos;re planning something magical! Check back soon or follow us on social media for announcements.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

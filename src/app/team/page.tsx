import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Meet the Team — Lala Stories | The Minds Behind the Magic",
  description:
    "Discover the founders, storytellers, illustrators, and sound designers behind Lala Stories. The passionate team dedicated to making screen-free bedtime magical for kids aged 3–10.",
  alternates: {
    canonical: "https://lalastories.com/team",
  },
  openGraph: {
    type: "website",
    siteName: "Lala Stories",
    url: "https://lalastories.com/team",
    title: "Meet the Team — Lala Stories | The Minds Behind the Magic",
    description:
      "Meet the passionate team behind Lala Stories, creating screen-free audio bedtime stories that kids love and parents trust.",
    images: [
      {
        url: "https://lalastories.com/assets/images/hero_illustration.png",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the Team — Lala Stories | The Minds Behind the Magic",
    description:
      "Meet the passionate team behind Lala Stories, creating screen-free audio bedtime stories that kids love and parents trust.",
    images: ["https://lalastories.com/assets/images/hero_illustration.png"],
  },
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  avatarSrc: string;
  bio: string;
  favStory: string;
  bgGradient: string;
  badgeColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Arjun Nair",
    role: "Founder & Chief Dreamweaver",
    title: "CEO",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun&eyebrows=variant05&eyes=variant04&mouth=variant05",
    bio: "Arjun founded Lala Stories to help his daughter build a screen-free bedtime routine. He leads our big dreams and guides our magical strategy.",
    favStory: "Battle of the Ants",
    bgGradient: "from-[#FFF7F0] to-[#FFE5CC]",
    badgeColor: "bg-[#FF7A2F]/10 text-[#FF7A2F]",
  },
  {
    id: "member-2",
    name: "Sneha Iyer",
    role: "Lead Story Architect",
    title: "Head of Writing",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sneha&hair=variant02&hairColor=b13322&mouth=variant10",
    bio: "Sneha writes the whimsical tales that fuel our sleep journeys. With a background in child development, she crafts narratives that teach and soothe.",
    favStory: "The Golden Feather",
    bgGradient: "from-[#FFF9E6] to-[#FFF0C2]",
    badgeColor: "bg-yellow-500/10 text-yellow-600",
  },
  {
    id: "member-3",
    name: "Rohan Das",
    role: "Lullaby Composer",
    title: "Lead Sound Engineer",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan&hair=variant12&hairColor=2c1b18&eyes=variant02",
    bio: "Rohan is the genius behind our soothing soundtracks and soundscapes. He ensures every whisper and musical chord guides kids to peaceful dreams.",
    favStory: "Sparkling Sea Lullaby",
    bgGradient: "from-[#EBF5FF] to-[#D0E7FF]",
    badgeColor: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "member-4",
    name: "Meera Krishnan",
    role: "Chief Magic Painter",
    title: "Lead Illustrator",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meera&hair=variant09&hairColor=e1a036&mouth=variant05",
    bio: "Meera paints the rich visual covers and in-app illustrations that fire up kids' imaginations before they close their eyes for the night.",
    favStory: "കുഞ്ഞന്‍ ഓന്ത് (Rainbow Chameleon)",
    bgGradient: "from-[#F0FDF4] to-[#DCFCE7]",
    badgeColor: "bg-green-500/10 text-green-600",
  },
  {
    id: "member-5",
    name: "Devika Menon",
    role: "Guardian of Joy",
    title: "Community & Support Lead",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Devika&hair=variant15&hairColor=9a3300&eyes=variant08",
    bio: "Devika looks after our wonderful family community. She reads all parent reviews, answers support inquiries, and spreads joy every single day.",
    favStory: "परी की जादुई छड़ी",
    bgGradient: "from-[#FFF5F5] to-[#FFE4E4]",
    badgeColor: "bg-red-500/10 text-red-600",
  },
  {
    id: "member-6",
    name: "Karthik R.",
    role: "Technical Dreamweaver",
    title: "Engineering Lead",
    avatarSrc: "https://api.dicebear.com/7.x/adventurer/svg?seed=Karthik&hair=variant05&hairColor=2c1b18&glasses=variant02",
    bio: "Karthik makes sure our app is as smooth and kid-safe as a soft blanket. He builds the clean interface and reliable offline story features.",
    favStory: "Castle in the Clouds",
    bgGradient: "from-[#F5F3FF] to-[#EDE9FE]",
    badgeColor: "bg-purple-500/10 text-purple-600",
  },
];

export default function Team() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Meet the Lala Stories Team",
    "url": "https://lalastories.com/team",
    "description": "Meet the creators, writers, sound designers, and engineers behind Lala Stories Bedtime App.",
    "publisher": {
      "@type": "Organization",
      "name": "Lala Stories",
      "url": "https://lalastories.com"
    }
  };

  return (
    <>
      {/* Dynamic JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#FFF7F0] font-body text-gray-800 animate-fade-in">
        <Header />

        <main className="grow">
          {/* ========== HERO COLLAGE SECTION (SALHASOFT INSPIRED) ========== */}
          <section className="relative pt-36 pb-28 overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white">
            <StarBackground count={90} />

            {/* Giant Watermark Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
              <span className="font-heading font-extrabold text-[12vw] md:text-[11vw] uppercase text-white/[0.03] tracking-widest whitespace-nowrap">
                LALA STORIES
              </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
              {/* Header Texts */}
              <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-[#FFB380] border border-orange-500/30 px-4.5 py-1.5 rounded-full text-xs font-bold font-heading">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3 text-[#FFB380]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.71h-5.91l.813-5.194L4 15.904h5.813z" /></svg>
                  Join the Bedtime Magic
                </div>
                <h1 className="font-heading text-4.5xl sm:text-6xl font-extrabold text-white leading-tight">
                  Meet the <span className="text-[#FF7A2F]">Dreamweavers</span>
                </h1>
                <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                  The parents, storytellers, illustrators, and lullaby composers who build peaceful sleep routines for children worldwide.
                </p>
              </div>

              {/* OVERLAPPING TEAM COLLAGE BANNER */}
              <div className="relative w-full max-w-4xl flex flex-col items-center select-none pt-12">
                
                {/* Floating "Mail Us" CTA Above the Silhouette */}
                <div className="absolute top-[-30px] right-[10%] sm:right-[15%] md:right-[20%] lg:right-[22%] z-30 animate-float-slow">
                  <div className="flex flex-col items-center">
                    <a
                      href="mailto:support@lalastories.com"
                      className="bg-white/10 hover:bg-[#FF7A2F] backdrop-blur-md border border-white/20 text-white font-heading font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      Mail us
                    </a>
                    {/* Tiny animated hand-drawn helper text and indicator */}
                    <div className="text-[10px] sm:text-xs font-heading font-bold text-[#FFB380] mt-1.5 flex flex-col items-center gap-0.5">
                      <span>Who's Next?</span>
                      <span className="animate-bounce">↓</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Row of Avatars */}
                <div className="flex justify-center items-center flex-wrap -space-x-4 sm:-space-x-6 md:-space-x-8 lg:-space-x-10 p-4 w-full">
                  
                  {TEAM_MEMBERS.map((member, idx) => (
                    <div 
                      key={member.id}
                      className={`relative w-18 h-18 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-[3px] sm:border-[4.5px] border-[#FF7A2F] bg-linear-to-br ${member.bgGradient} shadow-lg flex items-center justify-center overflow-hidden cursor-pointer hover:z-25 hover:scale-115 hover:-translate-y-2 ${idx % 2 === 0 ? "hover:rotate-3" : "hover:-rotate-3"} transition-all duration-300 group`}
                      title={`${member.name} - ${member.role}`}
                    >
                      {/* Network vector image */}
                      <img 
                        src={member.avatarSrc} 
                        alt={member.name}
                        className="w-full h-full object-cover scale-102"
                      />
                      <span className="absolute bottom-1 bg-[#FF7A2F] text-white text-[8px] sm:text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                        {member.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}

                  {/* PULSING SILHOUETTE OUTLINE */}
                  <a
                    href="mailto:support@lalastories.com"
                    className="relative w-18 h-18 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-[3.5px] sm:border-[4.5px] border-dashed border-[#FFB380] bg-[#1A1040]/75 hover:bg-[#FF7A2F]/20 cursor-pointer shadow-lg flex items-center justify-center overflow-hidden hover:z-25 hover:scale-110 active:scale-95 transition-all duration-300 group animate-pulse"
                    title="Join Us - Who's Next?"
                  >
                    <img 
                      src="https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=FF7A2F&fontSize=42" 
                      alt="Join us avatar placeholder"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 bg-[#FF7A2F] text-white text-[8px] sm:text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                      You?
                    </span>
                  </a>

                </div>
              </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full z-10 pointer-events-none select-none">
              <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
                <path
                  d="M0,60 C360,80 720,30 1080,60 C1260,75 1380,40 1440,60 L1440,80 L0,80 Z"
                  fill="#FFF7F0"
                />
              </svg>
            </div>
          </section>

          {/* ========== TEAM SHOWCASE SECTION ========== */}
          <section className="py-16 max-w-7xl mx-auto px-6 font-body">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <h2 className="font-heading text-3xl font-extrabold text-gray-900">
                Meet the <span className="text-[#FF7A2F]">Dream Team</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every story, sound effect, and feature inside Lala Stories is crafted with love and caution by our dedicated experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-6 border border-orange-50/50 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-orange-100/30 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Avatar Container */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`h-16 w-16 shrink-0 rounded-2xl bg-linear-to-br ${member.bgGradient} flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-108 transition-transform duration-300`}>
                      <img 
                        src={member.avatarSrc} 
                        alt={member.name}
                        className="w-full h-full object-cover scale-102"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-0.5">
                        {member.name}
                      </h3>
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${member.badgeColor}`}>
                        {member.title}
                      </span>
                    </div>
                  </div>

                  {/* Playful Role */}
                  <div className="font-heading font-bold text-sm text-[#FF7A2F] mb-3">
                    {member.role}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Favorite story card footer */}
                  <div className="mt-auto pt-4 border-t border-orange-50/60 flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span>🌙 Favorite Bedtime Tale:</span>
                    <span className="text-[#1A1040] font-bold italic">{member.favStory}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== VALUES SECTION ========== */}
          <section className="py-20 bg-white border-y border-orange-50/50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                <h2 className="font-heading text-3xl font-extrabold text-gray-900">
                  Our Creative <span className="text-[#FF7A2F]">Vibe</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We follow a strict set of values to guarantee your children have a safe, magical, and soothing experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Value 1 */}
                <div className="p-8 rounded-2xl bg-[#FFF7F0] border border-orange-50 space-y-4 shadow-xs flex flex-col">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-orange-600 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                  <h3 className="font-heading font-bold text-lg text-gray-900">100% Kid-Safe & Screen-Free</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    We believe bedtime is sacred. We never host ads, third-party promotions, or blue-light screens. Everything we produce is designed purely for hearing and dreaming.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="p-8 rounded-2xl bg-[#FFF7F0] border border-orange-50 space-y-4 shadow-xs flex flex-col">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-yellow-600 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                  <h3 className="font-heading font-bold text-lg text-gray-900">Artistry in Every Sound</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    From professional voice talents who record with soothing cadences to carefully mixed organic sounds and lullabies, we make sure our audio quality is top-tier.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="p-8 rounded-2xl bg-[#FFF7F0] border border-orange-50 space-y-4 shadow-xs flex flex-col">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-blue-600 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  <h3 className="font-heading font-bold text-lg text-gray-900">Cozy Family Bonding</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Our dream is to make bedtime the highlight of the day. We construct narratives that engage both kids and parents, encouraging cozy bedtime snuggles and shared memories.
                  </p>
                </div>
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
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Experience the Magic Tonight
              </h2>
              <p className="text-white/85 text-sm leading-relaxed max-w-md mx-auto">
                Join our family of 30,000+ happy listeners. Make bedtime clean, calming, and truly sweet.
              </p>
              <div className="pt-2">
                <Button href="https://lalakidsstories.page.link/share" variant="secondary">
                  Start Your Bedtime Magic
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

"use client";

import React, { useEffect, useState, useRef } from "react";
import { StarBackground } from "@/components/common/StarBackground";
import { FloatingParticles } from "@/components/common/FloatingParticles";
import { Button } from "@/components/ui/Button";

interface StatItemProps {
  target: number;
  label: string;
  suffix?: string;
  decimals?: number;
  isTriggered: boolean;
}

const StatCounter: React.FC<StatItemProps> = ({
  target,
  label,
  suffix = "",
  decimals = 0,
  isTriggered,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = target * easeOut;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, isTriggered]);

  return (
    <div className="text-center font-heading">
      <div className="text-3xl font-extrabold text-[#FFD966] leading-none">
        {count.toFixed(decimals)}
        {suffix}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1 font-semibold">
        {label}
      </div>
    </div>
  );
};

interface HeroProps {
  videoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ videoUrl }) => {
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track when statistics are in viewport to fire counter triggers
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleScrollToStories = (e: React.MouseEvent) => {
    e.preventDefault();
    const storiesSection = document.getElementById("stories");
    if (storiesSection) {
      const headerHeight = 70;
      const targetPos = storiesSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });
    }
  };

  // Parallax factors
  const moonParallax = scrollY * 0.25;
  const moonScale = Math.max(0.8, 1 - scrollY * 0.0006);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white pt-24 pb-12"
    >
      {/* Background video overlay if active */}
      {videoUrl && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
      )}

      {/* Background twinkles and drifting stardust particles */}
      <StarBackground count={120} />
      <FloatingParticles />

      {/* Floating clouds decorative background */}
      <div className="absolute left-[-2%] top-[15%] pointer-events-none select-none animate-float w-32 h-32">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white/5"><path d="M19.375 8h-1.25a6.5 6.5 0 0 0-12.25 2.5A4.5 4.5 0 0 0 6 19.5h13.375a4.625 4.625 0 0 0 0-9.25Z"/></svg>
      </div>
      <div className="absolute left-[-4%] top-[45%] pointer-events-none select-none animate-float-slow w-24 h-24">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white/4"><path d="M19.375 8h-1.25a6.5 6.5 0 0 0-12.25 2.5A4.5 4.5 0 0 0 6 19.5h13.375a4.625 4.625 0 0 0 0-9.25Z"/></svg>
      </div>
      <div className="absolute left-[10%] bottom-[20%] pointer-events-none select-none animate-float w-28 h-28">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white/4"><path d="M19.375 8h-1.25a6.5 6.5 0 0 0-12.25 2.5A4.5 4.5 0 0 0 6 19.5h13.375a4.625 4.625 0 0 0 0-9.25Z"/></svg>
      </div>

      {/* Parallax Floating Crescent Moon with soft glowing aura */}
      <div
        className="absolute top-[10%] right-[12%] w-[100px] h-[100px] rounded-full bg-radial-to-br from-[#FFD966] to-[#FFC44D] z-10 pointer-events-none transition-transform duration-75 shadow-[0_0_40px_rgba(255,217,102,0.3)]"
        style={{
          transform: `translateY(${moonParallax}px) scale(${moonScale})`,
          animation: "floatSlow 6s ease-in-out infinite",
        }}
      />

      {/* Hero Layout Content */}
      <div className="max-w-4xl mx-auto px-6 w-full relative z-20 flex flex-col items-center justify-center text-center">
        {/* Centered copy wrapper */}
        <div className="space-y-6 flex flex-col items-center justify-center max-w-2xl animate-slide-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-[#FFB380] px-4.5 py-1.5 text-xs font-bold font-heading">
            <span className="h-2 w-2 rounded-full bg-[#FF7A2F] animate-pulse" />
            Beyond Tales
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-[56px] font-extrabold leading-[1.1] text-white">
            Where <span className="text-[#FF7A2F] relative inline-block">Dreams<span className="absolute -top-3 -right-6 text-xl animate-pulse text-yellow-300"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg></span></span> Begin Every Night
          </h1>

          <p className="text-white/80 font-body text-base md:text-[18px] leading-relaxed max-w-xl">
            Magical bedtime stories crafted to spark imagination, soothe little minds, and carry your children to the most wonderful dreamland adventures.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 pt-2 justify-center">
            <Button onClick={handleScrollToStories} variant="primary">
              Explore Stories
            </Button>
            <Button
              href="https://lalakidsstories.page.link/share"
              target="_blank"
              variant="secondary"
              className="flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
              Listen Now
            </Button>
          </div>

          {/* Stats Bar */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-12 pt-8 border-t border-white/10 font-body w-full max-w-md justify-center"
          >
            <StatCounter
              target={3000}
              label="Stories"
              suffix="+"
              isTriggered={statsVisible}
            />
            <StatCounter
              target={200}
              label="Happy Kids"
              suffix="K+"
              isTriggered={statsVisible}
            />
            <StatCounter
              target={4.8}
              label="Rating"
              suffix=" ★"
              decimals={1}
              isTriggered={statsVisible}
            />
          </div>
        </div>
      </div>

      {/* Hero Wave Divider SVG */}
      <div className="absolute bottom-[-1px] left-0 right-0 w-full z-20 pointer-events-none select-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px]">
          <path
            d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z"
            fill="var(--color-bg-warm)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

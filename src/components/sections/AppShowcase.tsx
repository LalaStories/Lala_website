"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { APP_SCREENS } from "@/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/utils/helpers";

export const AppShowcase: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0, isHovered: false });
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: revealRef, isVisible } = useScrollReveal();

  const total = APP_SCREENS.length;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % total);
    resetAutoPlay();
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
    resetAutoPlay();
  };

  const handleGoTo = (idx: number) => {
    setCurrent(idx);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3800);
  };

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  // Swiping support for mobile viewports
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  // Mouse tilt handlers on active phone frame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setMouseTilt({ x: mx * 12, y: -my * 9, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0, isHovered: false });
  };

  const prevI = (current - 1 + total) % total;
  const nextI = (current + 1) % total;

  return (
    <section
      id="app-showcase"
      className="py-24 bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white relative overflow-hidden font-body"
    >
      {/* Decorative stars and shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,122,47,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute top-10 right-10 text-xl opacity-20 animate-pulse select-none pointer-events-none">⭐</div>
      <div className="absolute bottom-10 left-10 text-2xl opacity-25 animate-float select-none pointer-events-none">🌟</div>
      <div className="absolute top-1/2 left-[5%] text-lg opacity-15 animate-float-slow select-none pointer-events-none">✨</div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Features Left Column */}
        <div
          ref={revealRef as any}
          className={cn(
            "md:col-span-7 space-y-8 transition-all duration-700 ease-out transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          )}
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-[#FFB380] px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs select-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h12" /></svg>
              Our App
            </div>
            <h2 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-white leading-tight">
              Storytime in Your <span className="text-[#FF7A2F]">Pocket</span>
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl">
              Download the LALA Stories app and carry hundreds of magical bedtime tales with professional soothing audio, sleep timers, and weekly updates wherever you go.
            </p>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-body">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-[#FFB380] animate-float-slow shadow-md border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-[#FFB380]">Soothing Narration</h4>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">Professional voices layered with calming ambient sounds.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-[#FFD966] animate-float shadow-md border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-[#FFD966]">Sleep Timer</h4>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">Auto-stop triggers so stories shut off when kids fall asleep.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-[#FFB380] animate-float shadow-md border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-[#FFB380]">New Stories Weekly</h4>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">Fresh audio tales released every single week to keep bedtimes fun.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-[#FFD966] animate-float-slow shadow-md border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-[#FFD966]">100% Kid-Safe</h4>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">Absolutely zero advertisements, zero spam, completely parent approved.</p>
              </div>
            </div>
          </div>

          {/* App Store Links */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="https://lalakidsstories.page.link/share"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block w-40 h-[50px] hover:scale-105 active:scale-95 transition-all shadow-lg rounded-lg overflow-hidden border border-white/10"
              aria-label="Download on Apple App Store"
            >
              <svg className="w-full h-full" viewBox="0 0 165 50" xmlns="http://www.w3.org/2000/svg">
                <rect width="165" height="50" rx="8" fill="#000" />
                <rect width="165" height="50" rx="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                {/* Apple logo */}
                <path
                  d="M22.7 25.6c0-3.5 1.9-6.7 4.8-8.5a9.7 9.7 0 0 0-7.7-4.2C16.7 12.6 13.5 15 12 15c-1.7 0-4.2-1.8-7-1.8a10.2 10.2 0 0 0-8.6 5.2c-3.7 6.4-.9 15.8 2.6 21a13.3 13.3 0 0 0 6.6 5.3c2.7-.1 3.7-1.7 7-1.7 3.2 0 4.1 1.7 6.9 1.6A14 14 0 0 0 26 39a21 21 0 0 0 2.9-6A9.3 9.3 0 0 1 22.7 25.6z"
                  fill="#fff" transform="translate(14, 5) scale(0.42)" />
                <path d="M35.6 11a9.3 9.3 0 0 0 5.4-4.8 9.5 9.5 0 0 0-6.4 3.3A9 9 0 0 0 32.3 15a7.9 7.9 0 0 0 3.3-4z"
                  fill="#fff" transform="translate(14, 5) scale(0.42)" />
                <text x="44" y="19" fontFamily="-apple-system,Helvetica,Arial,sans-serif" fontSize="9"
                  fill="rgba(255,255,255,0.75)" letterSpacing="0.3">Download on the</text>
                <text x="44" y="34" fontFamily="-apple-system,Helvetica,Arial,sans-serif" fontSize="17"
                  fontWeight="600" fill="#fff">App Store</text>
              </svg>
            </a>
            <a
              href="https://lalakidsstories.page.link/share"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block w-40 h-[50px] hover:scale-105 active:scale-95 transition-all shadow-lg rounded-lg overflow-hidden border border-white/10"
              aria-label="Download on Google Play Store"
            >
              <svg className="w-full h-full" viewBox="0 0 165 50" xmlns="http://www.w3.org/2000/svg">
                <rect width="165" height="50" rx="8" fill="#000" />
                <rect width="165" height="50" rx="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <defs>
                  <linearGradient id="gplay-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C3F7" />
                    <stop offset="100%" stopColor="#009BF7" />
                  </linearGradient>
                  <linearGradient id="gplay-tr" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3DD784" />
                    <stop offset="100%" stopColor="#00E676" />
                  </linearGradient>
                  <linearGradient id="gplay-bl" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFD600" />
                    <stop offset="100%" stopColor="#FFAB00" />
                  </linearGradient>
                  <linearGradient id="gplay-br" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF5252" />
                    <stop offset="100%" stopColor="#C51162" />
                  </linearGradient>
                </defs>
                {/* Play icon - 4 coloured triangles */}
                <polygon points="14,10 14,25 26,17.5" fill="url(#gplay-tl)" />
                <polygon points="14,25 14,40 26,32.5" fill="url(#gplay-bl)" />
                <polygon points="14,10 26,17.5 14,25" fill="url(#gplay-tr)" />
                <polygon points="14,25 26,32.5 14,40" fill="url(#gplay-br)" />
                <polygon points="26,17.5 32,25 26,32.5" fill="url(#gplay-br)" />
                <text x="40" y="19" fontFamily="-apple-system,Helvetica,Arial,sans-serif" fontSize="9"
                  fill="rgba(255,255,255,0.75)" letterSpacing="0.5">GET IT ON</text>
                <text x="40" y="34" fontFamily="-apple-system,Helvetica,Arial,sans-serif" fontSize="16"
                  fontWeight="600" fill="#fff">Google Play</text>
              </svg>
            </a>
          </div>
        </div>

        {/* 3D Phone Slider Column */}
        <div
          className={cn(
            "md:col-span-5 flex flex-col items-center justify-center relative transition-all duration-700 ease-out transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          )}
        >
          {/* Carousel Stage Area */}
          <div
            className="w-full max-w-[230px] sm:max-w-[280px] h-[390px] sm:h-[480px] relative select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {APP_SCREENS.map((screen, idx) => {
              const isActive = idx === current;
              const isPrev = idx === prevI;
              const isNext = idx === nextI;

              return (
                <div
                  key={screen.index}
                  onClick={() => !isActive && handleGoTo(idx)}
                  className={cn(
                    "app-phone-card absolute inset-0 cursor-pointer transition-all duration-500 ease-in-out select-none",
                    isActive && "active z-30 opacity-100 pointer-events-auto",
                    isPrev && "card-prev z-10 opacity-65 pointer-events-auto",
                    isNext && "card-next z-10 opacity-65 pointer-events-auto",
                    !isActive && !isPrev && !isNext && "card-hidden opacity-0 pointer-events-none"
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Phone Device Frame Model */}
                  <div
                    onMouseMove={isActive ? handleMouseMove : undefined}
                    onMouseLeave={isActive ? handleMouseLeave : undefined}
                    className={cn(
                      "w-full h-full rounded-[32px] sm:rounded-[40px] border-[8px] sm:border-[10px] border-[#0e0724] bg-[#0c051f] shadow-2xl relative overflow-hidden transition-transform duration-100 ease-out flex flex-col",
                      isActive && !mouseTilt.isHovered && "animate-phone-tilt"
                    )}
                    style={
                      isActive && mouseTilt.isHovered
                        ? {
                            transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
                          }
                        : undefined
                    }
                  >
                    {/* Notch Speaker */}
                    <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-3.5 sm:h-4.5 bg-[#0e0724] rounded-full z-30 flex items-center justify-center">
                      <div className="w-8 sm:w-10 h-0.5 sm:h-1 bg-white/10 rounded-full" />
                    </div>

                    {/* App Interface Screen Content */}
                    <div className="w-full h-full relative z-10">
                      <Image
                        src={screen.imageSrc}
                        alt={screen.altText}
                        fill
                        sizes="(max-width: 640px) 230px, 280px"
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>

                    {/* Bottom home bar indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-white/30 rounded-full z-20" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Carousel Card Label */}
          <div className="mt-8 font-heading text-lg font-bold text-[#FFD966] transition-opacity duration-300">
            {APP_SCREENS[current].labelText}
          </div>

          {/* Navigation Dot Indicators */}
          <div className="flex gap-2.5 mt-4">
            {APP_SCREENS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleGoTo(idx)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all border-none cursor-pointer",
                  idx === current
                    ? "bg-[#FF7A2F] scale-110 shadow-[0_0_8px_rgba(255,122,47,0.5)]"
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Show app screen ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrow controllers */}
          <button
            onClick={handlePrev}
            className="absolute left-[-25px] sm:left-[-40px] md:left-[-60px] top-[45%] -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF7A2F] text-xl sm:text-2xl font-bold cursor-pointer transition-colors border-none z-30 shadow-md select-none"
            aria-label="Previous screen"
          >
            &#8249;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-25px] sm:right-[-40px] md:right-[-60px] top-[45%] -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF7A2F] text-xl sm:text-2xl font-bold cursor-pointer transition-colors border-none z-30 shadow-md select-none"
            aria-label="Next screen"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;

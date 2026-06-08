"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface QrPopupProps {
  forceShowTrigger?: boolean;
  onCloseTrigger?: () => void;
}

export const QrPopup: React.FC<QrPopupProps> = ({
  forceShowTrigger = false,
  onCloseTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("qrDismissed") === "true";

    if (forceShowTrigger) {
      setIsOpen(true);
      return;
    }

    if (isDismissed) return;

    // Track scroll depth and trigger at 60%
    const handleScroll = () => {
      if (sessionStorage.getItem("qrDismissed") === "true") return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      if (scrollPercent > 0.6) {
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceShowTrigger]);

  // Handle Escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("qrDismissed", "true");
    if (onCloseTrigger) onCloseTrigger();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal popup */}
      <div
        className="fixed top-1/2 left-1/2 z-[51] w-[90%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-linear-to-b from-[#1A1040] to-[#2A1D5C] p-8 text-center text-white shadow-[0_20px_50px_rgba(255,122,47,0.3)] border border-white/10 animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors text-2xl font-bold cursor-pointer"
          onClick={handleClose}
          aria-label="Close popup"
        >
          &times;
        </button>

        {/* Emoji Indicator */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-4xl animate-bounce">
          🎁
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-bold mb-2">
          Get the <span className="text-[#FF7A2F]">LALA</span> App
        </h3>

        {/* Description */}
        <p className="text-white/75 text-sm leading-relaxed mb-6">
          Scan the code or click below to explore over 3000+ magical bedtime stories on your phone.
        </p>

        {/* QR Code Container */}
        <div className="relative mx-auto w-[180px] h-[180px] bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center mb-6 border-2 border-[#FFD966]">
          <div className="relative w-full h-full">
            <Image
              src="/assets/images/qr_code.png"
              alt="Scan QR Code to Download LALA Stories"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Subtle neon pulse */}
          <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(255,217,102,0.4)] pointer-events-none animate-pulse" />
        </div>

        {/* App Stores */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href="https://lalakidsstories.page.link/share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/10 p-3 hover:bg-white/20 hover:border-orange-400/40 transition-all shadow-md group"
          >
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Download on</span>
            <strong className="text-sm font-semibold text-[#FFB380] group-hover:text-white transition-colors">App Store</strong>
          </a>
          <a
            href="https://lalakidsstories.page.link/share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/10 p-3 hover:bg-white/20 hover:border-orange-400/40 transition-all shadow-md group"
          >
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Get it on</span>
            <strong className="text-sm font-semibold text-[#FFD966] group-hover:text-white transition-colors">Google Play</strong>
          </a>
        </div>
      </div>
    </>
  );
};

export default QrPopup;

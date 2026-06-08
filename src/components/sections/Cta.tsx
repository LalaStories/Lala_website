"use client";

import React, { useState } from "react";
import { StarBackground } from "@/components/common/StarBackground";
import { Button } from "@/components/ui/Button";
import { QrPopup } from "@/components/common/QrPopup";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/utils/helpers";

export const Cta: React.FC = () => {
  const [showQr, setShowQr] = useState(false);
  const { ref: revealRef, isVisible } = useScrollReveal();

  return (
    <section
      id="cta"
      className="py-28 bg-linear-to-r from-[#FF7A2F] to-[#E55A10] text-white text-center relative overflow-hidden font-body flex flex-col items-center"
    >
      {/* Canvas stars backdrop */}
      <StarBackground count={60} />

      {/* Floating stars or decorative details */}
      <div className="absolute opacity-20 left-[15%] top-1/4 animate-bounce pointer-events-none select-none w-12 h-12 text-yellow-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M10.788 2.903a.75.75 0 0 1 1.424 0l2.082 5.006 5.404.434a.75.75 0 0 1 .415 1.298l-4.043 3.543 1.258 5.25a.75.75 0 0 1-1.086.86L12 16.586l-4.498 2.502a.75.75 0 0 1-1.086-.86l1.258-5.25L3.63 9.641a.75.75 0 0 1 .415-1.298l5.404-.434 2.082-5.006Z" clipRule="evenodd" /></svg>
      </div>
      <div className="absolute opacity-15 right-[20%] bottom-1/4 animate-float pointer-events-none select-none w-10 h-10 text-yellow-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M9.813 15.904L9 21l8.982-11.71h-5.91l.813-5.194L4 15.904h5.813z"/></svg>
      </div>

      <div
        ref={revealRef as any}
        className={cn(
          "max-w-4xl mx-auto px-6 relative z-10 space-y-6 transition-all duration-700 ease-out transform flex flex-col items-center",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}
      >
        {/* Floating Moon Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border border-white/20 animate-float-slow select-none text-[#FFD966]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(255,217,102,0.4)]"><path d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 1 1-13.754-13.754.75.75 0 0 1 .838.182Z" /></svg>
        </div>

        <h2 className="font-heading text-3.5xl sm:text-5xl font-extrabold text-white leading-tight">
          Ready for <span className="text-[#FFD966]">Magical</span> Bedtimes?
        </h2>

        <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Join thousands of happy families and make bedtime the best part of your child's day. Start your screen-free storytelling trial tonight!
        </p>

        <div className="pt-4">
          <Button
            onClick={() => setShowQr(true)}
            variant="accent"
            enableSparkles
            className="shadow-2xl shadow-orange-950/20"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Manual QR popup click wrapper */}
      <QrPopup
        forceShowTrigger={showQr}
        onCloseTrigger={() => setShowQr(false)}
      />
    </section>
  );
};

export default Cta;

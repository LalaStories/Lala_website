"use client";

import React from "react";
import StarBackground from "@/components/common/StarBackground";

interface LandingBackgroundProps {
  /** "stars" | "gradient" | "image" | "video" */
  type: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  /** Darkening overlay strength, 0–100. Keeps text readable over media. */
  overlay?: number;
}

/**
 * Fixed full-bleed background behind every landing page block.
 * Sits at z-0; page content renders above it.
 */
export default function LandingBackground({
  type,
  imageUrl,
  videoUrl,
  overlay = 60,
}: LandingBackgroundProps) {
  const dim = Math.min(100, Math.max(0, overlay)) / 100;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0F0826]">
      {type === "video" && videoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          // A poster-less video shows the page background until the first frame.
          preload="auto"
        />
      )}

      {type === "image" && imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {type === "gradient" && (
        <div className="absolute inset-0 bg-linear-to-br from-[#1A1040] via-[#2A1D5C] to-[#0F0826]" />
      )}

      {type === "stars" && (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-[#1A1040] via-[#241552] to-[#0F0826]" />
          <StarBackground count={120} className="absolute inset-0" />
        </>
      )}

      {/* Readability overlay — only over real media, the built-ins are dark already. */}
      {(type === "image" || type === "video") && (
        <div className="absolute inset-0 bg-[#0F0826]" style={{ opacity: dim }} />
      )}

      {/* Soft brand glows, consistent across every background type. */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-3xl" />
    </div>
  );
}

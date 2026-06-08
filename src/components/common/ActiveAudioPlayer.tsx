"use client";

import React from "react";
import Image from "next/image";
import { useAudio } from "@/store/AudioContext";
import { formatTime } from "@/utils/helpers";

export const ActiveAudioPlayer: React.FC = () => {
  const {
    activeStory,
    isPlaying,
    listenedSeconds,
    gateReached,
    pauseStory,
    resumeStory,
    closePlayer,
    totalGateSeconds,
  } = useAudio();

  if (!activeStory) return null;

  // Circular progress calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = listenedSeconds / totalGateSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-40 w-[90%] max-w-[560px] -translate-x-1/2 rounded-2xl bg-white/90 p-4 text-gray-800 shadow-[0_10px_35px_rgba(255,122,47,0.25)] border border-orange-100 backdrop-blur-md transition-all duration-500 ease-out transform translate-y-0 opacity-100 flex items-center justify-between gap-4`}
      role="region"
      aria-label="Story Audio Player"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Story Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-orange-200">
          <Image
            src={activeStory.imageSrc}
            alt={activeStory.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Story Information */}
        <div className="overflow-hidden min-w-0">
          <div className="truncate font-heading text-sm font-semibold text-gray-900 leading-snug">
            {activeStory.title}
          </div>
          <div className="text-[11px] font-medium text-gray-500 mt-0.5">
            {gateReached ? (
              <span className="text-orange-600 font-semibold animate-pulse">Preview ended</span>
            ) : (
              `Preview: ${formatTime(listenedSeconds)} / ${totalGateSeconds}s`
            )}
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Playback Control circular countdown */}
        {!gateReached && (
          <div className="relative flex h-11 w-11 items-center justify-center shrink-0">
            {/* SVG circular track progress */}
            <svg className="absolute inset-0 -rotate-90 h-full w-full" viewBox="0 0 44 44">
              <circle
                className="text-gray-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="22"
                cy="22"
              />
              <circle
                className="text-[#FF7A2F] transition-all duration-300 ease-out"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="22"
                cy="22"
              />
            </svg>

            {/* Play/Pause icon overlay */}
            <button
              onClick={isPlaying ? pauseStory : resumeStory}
              className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] text-white hover:scale-105 active:scale-95 transition-transform shadow-md text-xs pl-0.5"
              aria-label={isPlaying ? "Pause story preview" : "Play story preview"}
            >
              {isPlaying ? (
                // Pause Icon
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                // Play Icon
                <svg className="h-3 w-3 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Dynamic CTA Gate Button */}
        {gateReached && (
          <a
            href="https://lalakidsstories.page.link/share"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-linear-to-r from-amber-500 to-[#FF7A2F] px-4 py-2 text-xs font-bold text-white hover:from-amber-600 hover:to-[#E55A10] shadow-[0_4px_12px_rgba(255,122,47,0.3)] transition-all animate-bounce shrink-0"
          >
            Listen Full App
          </a>
        )}

        {/* Close Button */}
        <button
          onClick={closePlayer}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors text-lg font-semibold cursor-pointer shrink-0"
          aria-label="Close audio player"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ActiveAudioPlayer;

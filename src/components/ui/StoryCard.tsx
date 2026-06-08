"use client";

import React from "react";
import Image from "next/image";
import { Story } from "@/types";
import { use3dTilt } from "@/hooks/use3dTilt";
import { useAudio } from "@/store/AudioContext";
import { cn } from "@/utils/helpers";

interface StoryCardProps {
  story: Story;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, className = "" }) => {
  const { ref, style, handleMouseMove, handleMouseLeave } = use3dTilt(6, 6);
  const { activeStory, isPlaying, playStory, pauseStory } = useAudio();

  const isCurrentStory = activeStory?.id === story.id;
  const isCurrentlyPlaying = isCurrentStory && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pauseStory();
    } else {
      playStory(story);
    }
  };

  const badgeColors = {
    New: "bg-[#FF7A2F] text-white",
    Popular: "bg-[#FFD966] text-[#1A1040]",
    Favorite: "bg-emerald-500 text-white",
  };

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => playStory(story)}
      className={cn(
        "group relative flex flex-col rounded-3xl bg-card-bg shadow-md hover:shadow-2xl transition-all duration-350 cursor-pointer overflow-hidden border border-card-border",
        isCurrentStory ? "ring-2 ring-[#FF7A2F]/50 shadow-orange-500/10" : "",
        className
      )}
    >
      {/* Story Thumbnail Area */}
      <div className="relative h-[320px] w-full overflow-hidden shrink-0">
        <Image
          src={story.imageSrc}
          alt={story.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          priority
        />
        {/* Badge */}
        <span className={cn("absolute top-4 left-4 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm z-10", badgeColors[story.badge])}>
          {story.badge}
        </span>
        {/* Duration */}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md z-10 flex items-center gap-1">
          🕐 {story.durationText}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col justify-between grow">
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-text-dark leading-snug group-hover:text-[#FF7A2F] transition-colors">
            {story.title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
            {story.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-border-t">
          <span className="rounded-full bg-bg-warm-alt text-[#FF7A2F] px-3.5 py-1 text-xs font-bold font-heading">
            {story.ageRange}
          </span>

          {/* Floating playback toggle */}
          <button
            onClick={handlePlayClick}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer",
              isCurrentlyPlaying
                ? "bg-[#1A1040] shadow-indigo-950/20"
                : "bg-linear-to-br from-[#FF7A2F] to-[#E55A10] shadow-orange-500/20"
            )}
            aria-label={isCurrentlyPlaying ? `Pause ${story.title}` : `Play ${story.title}`}
          >
            {isCurrentlyPlaying ? (
              // Pause icon
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              // Play icon
              <svg className="h-4.5 w-4.5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;

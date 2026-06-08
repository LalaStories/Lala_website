"use client";

import React from "react";
import { Story } from "@/types";
import { StoryCard } from "@/components/ui/StoryCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface FeaturedStoriesProps {
  stories?: Story[];
}

export const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ stories = [] }) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="stories"
      className="py-24 bg-bg-warm relative overflow-hidden font-body"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          ref={ref as any}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 bg-bg-warm-alt text-[#FF7A2F] px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs select-none font-body">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            Featured Stories
          </div>
          <h2 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-text-dark leading-tight mb-4">
            Tonight's <span className="text-[#FF7A2F]">Magical</span> Tales
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            Choose from our collection of enchanting stories, each one crafted to inspire sweet dreams, soothe minds, and rest busy eyes.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div
              key={story.id}
              className={`transition-all duration-700 delay-[${(i + 1) * 150}ms] ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;

"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StepCardProps {
  icon: React.ReactNode;
  stepNum: number;
  title: string;
  text: string;
  delayClass: string;
  isVisible: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  stepNum,
  title,
  text,
  delayClass,
  isVisible,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center p-8 bg-card-bg rounded-3xl shadow-md border border-card-border text-center transition-all duration-700 ease-out transform ${delayClass} ${
        isVisible ? "opacity-100 translate-y-0 hover:shadow-xl hover:-translate-y-2" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Icon Badge */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-bg-warm-alt shadow-inner animate-float-slow text-[#FF7A2F]">
        {icon}
        {/* Step Indicator */}
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] text-sm font-extrabold text-white shadow-md border border-white">
          {stepNum}
        </span>
      </div>

      <h3 className="font-heading text-xl font-bold text-text-dark mb-3">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{text}</p>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="how-it-works"
      className="py-24 bg-secondary relative overflow-hidden font-body"
    >
      {/* Dynamic decor grids */}
      <div className="absolute top-1/4 left-5 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          ref={ref as any}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 bg-bg-warm-alt text-[#FF7A2F] px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.71h-5.91l.813-5.194L4 15.904h5.813z" /></svg>
            How It Works
          </div>
          <h2 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-text-dark leading-tight mb-4">
            Three Simple <span className="text-[#FF7A2F]">Steps</span> to Dreamland
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            Getting started is as easy as tucking in your little one. Watch their imagination grow as they drift off naturally.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>}
            stepNum={1}
            title="Choose a Story"
            text="Browse our magical library of over 3000+ bedtime stories for every age group, language preference, and emotional mood."
            delayClass="delay-75"
            isVisible={isVisible}
          />
          <StepCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>}
            stepNum={2}
            title="Listen Together"
            text="Snuggle up and enjoy the professional, soothing narration layered with soft, calming ambient background music."
            delayClass="delay-200"
            isVisible={isVisible}
          />
          <StepCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>}
            stepNum={3}
            title="Drift to Sleep"
            text="Watch your little ones drift naturally into peaceful, happy dreams full of screen-free wonder and sleep satisfaction."
            delayClass="delay-350"
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

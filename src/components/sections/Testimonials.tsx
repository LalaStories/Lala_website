"use client";

import React from "react";
import { Testimonial } from "@/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = [] }) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="testimonials"
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
            Happy Families
          </div>
          <h2 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-text-dark leading-tight mb-4">
            Loved by <span className="text-[#FF7A2F]">Parents</span> Everywhere
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            See how families around the world have transformed their bedtime routines with our screen-free tales.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div
              key={test.id}
              className={`flex flex-col justify-between p-8 bg-card-bg rounded-3xl shadow-md border border-card-border relative transition-all duration-700 ease-out transform ${
                isVisible ? "opacity-100 translate-y-0 hover:shadow-xl hover:-translate-y-2" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${(i + 1) * 150}ms` }}
            >
              {/* Quote icon background decoration */}
              <span className="absolute top-4 right-6 text-7xl font-serif text-orange-200/20 select-none pointer-events-none">
                “
              </span>

              <p className="text-text-muted text-sm leading-relaxed mb-6 relative z-10 italic">
                {test.text}
              </p>

              {/* Author Row */}
              <div className="flex items-center gap-4 border-t border-border-t pt-5 mt-auto">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] text-sm font-bold text-white shadow-md select-none shrink-0">
                  {test.avatarLetter}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="text-sm font-heading font-bold text-text-dark truncate">
                    {test.authorName}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#FF7A2F] mt-0.5 tracking-wider truncate">
                    {test.authorRole}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

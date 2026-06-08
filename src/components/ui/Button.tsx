"use client";

import React, { useState } from "react";
import { cn } from "@/utils/helpers";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  href?: string;
  target?: string;
  enableSparkles?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  href,
  target,
  enableSparkles = true,
  ...props
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleMouseEnter = () => {
    if (!enableSparkles) return;

    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100, // percentage offsets
      y: Math.random() * 100,
      size: Math.random() * 12 + 8, // pixel size
      delay: Math.random() * 0.3,
    }));

    setSparkles(newSparkles);

    // Auto cleanup after animation ends
    setTimeout(() => {
      setSparkles([]);
    }, 1500);
  };

  const buttonClasses = cn(
    "relative inline-flex items-center justify-center font-heading font-bold rounded-full overflow-hidden transition-all duration-350 cursor-pointer shadow-md",
    variant === "primary" &&
      "bg-linear-to-br from-[#FF7A2F] to-[#E55A10] text-white hover:scale-105 active:scale-95 hover:shadow-lg shadow-orange-500/20 py-4 px-8 text-base select-none",
    variant === "secondary" &&
      "bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-[#FFB380] hover:scale-105 active:scale-95 backdrop-blur-md py-3.5 px-8 text-base",
    variant === "accent" &&
      "bg-linear-to-r from-amber-400 to-[#FFD966] text-[#1A1040] hover:scale-105 active:scale-95 hover:shadow-lg shadow-yellow-500/20 py-4 px-8 text-base select-none",
    className
  );

  const renderContent = () => (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Twinkling micro sparkles overlay */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute pointer-events-none select-none text-yellow-300 animate-sparkle"
          style={{
            top: `${s.y}%`,
            left: `${s.x}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            lineHeight: 1,
            zIndex: 5,
          }}
        >
          ✨
        </span>
      ))}
    </>
  );

  if (href) {
    if (target === "_blank") {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
        >
          {renderContent()}
        </a>
      );
    }
    return (
      <a href={href} className={buttonClasses} onMouseEnter={handleMouseEnter}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button className={buttonClasses} onMouseEnter={handleMouseEnter} {...props}>
      {renderContent()}
    </button>
  );
};

export default Button;

"use client";

import React, { useEffect, useRef } from "react";

interface StarBackgroundProps {
  count?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDirection: number;
}

export const StarBackground: React.FC<StarBackgroundProps> = ({
  count = 100,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    // Fit canvas to parent container size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initStars();
    };

    // Initialize stars randomly across canvas boundaries
    const initStars = () => {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    // Twinkle loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFD966"; // Warm gold star color

      stars.forEach((star) => {
        // Adjust star opacity for a realistic twinkling cycle
        star.opacity += star.twinkleSpeed * star.twinkleDirection;

        if (star.opacity >= 1) {
          star.opacity = 1;
          star.twinkleDirection = -1;
        } else if (star.opacity <= 0.2) {
          star.opacity = 0.2;
          star.twinkleDirection = 1;
        }

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Listeners
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default StarBackground;

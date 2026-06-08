"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 35;
    const colors = ["#FFD966", "#FF7A2F", "#FFB380", "#FFF0C2"];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const createParticle = (isInitial = false): Particle => {
      const x = Math.random() * canvas.width;
      const y = isInitial
        ? Math.random() * canvas.height
        : canvas.height + Math.random() * 20;

      return {
        x,
        y,
        size: Math.random() * 3 + 1.5,
        speedY: -(Math.random() * 0.6 + 0.3), // Drifts upward
        speedX: (Math.random() - 0.5) * 0.4, // Subtle weaving drift
        opacity: Math.random() * 0.5 + 0.2,
        fadeSpeed: Math.random() * 0.003 + 0.001,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(true));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fadeSpeed;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Recycle dead or off-screen particles
        if (p.opacity <= 0 || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[index] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default FloatingParticles;

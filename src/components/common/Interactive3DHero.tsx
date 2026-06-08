"use client";

import React, { useEffect, useRef, useState } from "react";

interface Star3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  originalX: number;
  originalY: number;
  originalZ: number;
  isSphere: boolean; // distinguish sphere sphere structure from background
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  opacity: number;
  active: boolean;
}

export const Interactive3DHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interactive controls
  const mousePos = useRef({ x: 0, y: 0, rx: 0, ry: 0, isHovered: false });
  const stars = useRef<Star3D[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);

  // Initialize Professional-Grade 3D Scene
  const initScene = (width: number, height: number) => {
    const tempStars: Star3D[] = [];
    const colors = ["#FFD966", "#FF7A2F", "#A098C3", "#FFFFFF", "#FFB380"];
    
    // 1. Generate 3D Central Constellation Sphere (approx 90 particles)
    const sphereStarCount = 95;
    const sphereRadius = 110;
    for (let i = 0; i < sphereStarCount; i++) {
      // Math: distribute points uniformly on sphere surface using golden spiral spacing
      const theta = Math.acos(-1 + (2 * i) / sphereStarCount);
      const phi = Math.sqrt(sphereStarCount * Math.PI) * theta;

      const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(theta);

      tempStars.push({
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
        size: Math.random() * 1.8 + 1.2,
        color: i % 3 === 0 ? "#FFD966" : i % 3 === 1 ? "#FF7A2F" : "#FFFFFF",
        isSphere: true,
      });
    }

    // 2. Generate Ambient Background Cosmic Dust (approx 65 particles)
    const ambientStarCount = 65;
    for (let i = 0; i < ambientStarCount; i++) {
      const x = (Math.random() - 0.5) * 550;
      const y = (Math.random() - 0.5) * 550;
      const z = (Math.random() - 0.5) * 350;

      tempStars.push({
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
        size: Math.random() * 1.2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        isSphere: false,
      });
    }

    stars.current = tempStars;

    // 3. Initialize Shooting Stars Pool
    const tempShooting: ShootingStar[] = [];
    for (let i = 0; i < 2; i++) {
      tempShooting.push({
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        length: 0,
        speed: 0,
        opacity: 0,
        active: false,
      });
    }
    shootingStars.current = tempShooting;
  };

  // Trigger a shooting star randomly
  const triggerShootingStar = (width: number, height: number) => {
    const activeStar = shootingStars.current.find((s) => !s.active);
    if (!activeStar) return;

    const angle = Math.PI / 6 + Math.random() * (Math.PI / 6); // 30 to 60 deg down-left direction
    activeStar.x = Math.random() * (width * 0.7) + width * 0.2;
    activeStar.y = -20;
    activeStar.dx = -Math.cos(angle);
    activeStar.dy = Math.sin(angle);
    activeStar.speed = Math.random() * 8 + 8;
    activeStar.length = Math.random() * 60 + 50;
    activeStar.opacity = Math.random() * 0.6 + 0.4;
    activeStar.active = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 500);

    initScene(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    // Speed tracking variables
    let angleY = 0.003;
    let angleX = 0.0015;
    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 350;

      pulseTime += 0.015;
      // Core sphere breathing wave animation (radius pulses softly)
      const pulseFactor = 1 + Math.sin(pulseTime) * 0.07;

      // Interaction eases
      let targetAngleY = 0.003;
      let targetAngleX = 0.0015;
      if (mousePos.current.isHovered) {
        // Rotates sphere space based on cursor drag direction
        targetAngleY = mousePos.current.rx * 0.018;
        targetAngleX = -mousePos.current.ry * 0.018;
      }

      angleY += (targetAngleY - angleY) * 0.06;
      angleX += (targetAngleX - angleX) * 0.06;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Randomly spawn shooting stars
      if (Math.random() < 0.007) {
        triggerShootingStar(width, height);
      }

      // Render custom background glowing space portal halo behind the constellation
      const haloGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 130 * pulseFactor);
      haloGlow.addColorStop(0, "rgba(26, 16, 64, 0.45)");
      haloGlow.addColorStop(0.5, "rgba(255, 122, 47, 0.06)");
      haloGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.fill();

      // Project and animate stars
      const projectedStars = stars.current.map((star) => {
        let xVal = star.x;
        let yVal = star.y;
        let zVal = star.z;

        // Apply breathing pulse to sphere coordinates
        if (star.isSphere) {
          xVal = star.x * pulseFactor;
          yVal = star.y * pulseFactor;
          zVal = star.z * pulseFactor;
        }

        // 3D rotations
        let x1 = xVal * cosY - zVal * sinY;
        let z1 = zVal * cosY + xVal * sinY;

        let y2 = yVal * cosX - z1 * sinX;
        let z2 = z1 * cosX + yVal * sinX;

        // Mouse gravity suction
        if (mousePos.current.isHovered) {
          const pullX = mousePos.current.rx * 170;
          const pullY = mousePos.current.ry * 170;

          // Background dust particles are drawn more heavily than the solid sphere stars
          const pullStrength = star.isSphere ? 0.006 : 0.025;
          x1 += (pullX - x1) * pullStrength;
          y2 += (pullY - y2) * pullStrength;
        } else {
          // Restore smoothly to home positions
          x1 += (star.originalX * (star.isSphere ? pulseFactor : 1) - x1) * 0.015;
          y2 += (star.originalY * (star.isSphere ? pulseFactor : 1) - y2) * 0.015;
          z2 += (star.originalZ * (star.isSphere ? pulseFactor : 1) - z2) * 0.015;
        }

        star.x = x1;
        star.y = y2;
        star.z = z2;

        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        return {
          ...star,
          screenX,
          screenY,
          scale,
        };
      });

      // RENDER CONSTELLATION MESH
      ctx.lineWidth = 0.65;
      for (let i = 0; i < projectedStars.length; i++) {
        const s1 = projectedStars[i];
        if (s1.screenX < 0 || s1.screenX > width || s1.screenY < 0 || s1.screenY > height) continue;

        for (let j = i + 1; j < projectedStars.length; j++) {
          const s2 = projectedStars[j];

          // Draw links only between components of the same assembly (Sphere vertices connect to sphere, dust connects to dust)
          if (s1.isSphere !== s2.isSphere) continue;

          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dz = s1.z - s2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Connection threshold
          const threshold = s1.isSphere ? 62 : 80;
          if (dist3D < threshold) {
            const alpha = (1 - dist3D / threshold) * (s1.isSphere ? 0.22 : 0.12) * s1.scale;
            ctx.strokeStyle = s1.isSphere 
              ? `rgba(255, 217, 102, ${alpha})`
              : `rgba(160, 152, 195, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(s1.screenX, s1.screenY);
            ctx.lineTo(s2.screenX, s2.screenY);
            ctx.stroke();
          }
        }
      }

      // DRAW STORY BOOK STARS
      projectedStars.forEach((star) => {
        if (star.screenX < 0 || star.screenX > width || star.screenY < 0 || star.screenY > height) return;

        const size = star.size * star.scale * (star.isSphere && mousePos.current.isHovered ? 1.2 : 1);
        const opacity = Math.max(0.12, Math.min(1, 0.4 + (star.z + 200) / 400)) * star.scale;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        // Sphere stars render as soft glowing coordinates, dust as standard points
        ctx.arc(star.screenX, star.screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // Extra glowing flares for sphere star vertices on hover
        if (star.isSphere && mousePos.current.isHovered && Math.random() < 0.08) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = star.color;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(star.screenX, star.screenY, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // DRAW SHOOTING STARS
      ctx.globalAlpha = 1;
      shootingStars.current.forEach((star) => {
        if (!star.active) return;

        // Move shooting star coordinates
        star.x += star.dx * star.speed;
        star.y += star.dy * star.speed;

        // Fade tail glow
        const tailX = star.x - star.dx * star.length;
        const tailY = star.y - star.dy * star.length;

        const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        grad.addColorStop(0.3, `rgba(255, 217, 102, ${star.opacity * 0.6})`);
        grad.addColorStop(1, "rgba(255, 122, 47, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Check boundary limits to recycle star
        if (star.x < -100 || star.x > width + 100 || star.y > height + 100) {
          star.active = false;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Interactive handlers on MouseMove for constellation stardust sway
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const centerX = r.width / 2;
    const centerY = r.height / 2;

    const rx = (x - centerX) / centerX;
    const ry = (y - centerY) / centerY;

    mousePos.current = { x, y, rx, ry, isHovered: true };
  };

  const handleMouseLeave = () => {
    mousePos.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex justify-center items-center w-full max-w-[480px] aspect-square select-none md:pl-6 cursor-pointer"
    >
      {/* 3D Constellation Canvas Space */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
    </div>
  );
};

export default Interactive3DHero;

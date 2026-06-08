import { useState, useRef, MouseEvent } from "react";

export function use3dTilt(maxRotateX = 5, maxRotateY = 5) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxRotateX;
    const rotateY = ((x - centerX) / centerX) * maxRotateY;

    setStyle({
      transform: `translateY(-12px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "translateY(0px) perspective(800px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });
  };

  return { ref, style, handleMouseMove, handleMouseLeave };
}
export default use3dTilt;

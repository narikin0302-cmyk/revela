"use client";

import { useMemo } from "react";

interface Particle {
  left: string;
  top: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

// Deterministic pseudo-random based on index so SSR/CSR match
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const COLORS = ["#d4af37", "#d4af37", "#d4af37", "#e8a0bf", "#e8a0bf", "#ffffff"];

export default function GoldParticles() {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const r = (offset: number) => pseudoRandom(i * 100 + offset);
      return {
        left: `${Math.round(r(1) * 95)}%`,
        top: `${Math.round(r(2) * 90)}%`,
        size: Math.round(r(3) * 3 + 3), // 3-6px
        color: COLORS[Math.floor(r(4) * COLORS.length)],
        duration: Math.round((r(5) * 8 + 6) * 10) / 10, // 6-14s
        delay: Math.round(r(6) * 80) / 10, // 0-8s
      };
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes goldParticleFloatUp {
          0%   { opacity: 0; transform: translateY(0) scale(0.8); }
          15%  { opacity: 1; }
          85%  { opacity: 0.35; }
          100% { opacity: 0; transform: translateY(-100vh) scale(1.1); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: p.color,
              opacity: 0,
              animation: `goldParticleFloatUp ${p.duration}s ${p.delay}s ease-in-out infinite`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}88`,
            }}
          />
        ))}
      </div>
    </>
  );
}

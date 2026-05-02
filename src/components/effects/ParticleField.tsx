"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    const particles: Particle[] = [];

    function resize() {
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      const fromBottom = Math.random() < 0.7;
      particles.push({
        x: Math.random() * W,
        y: fromBottom ? H + 10 : Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.6,
        life: 0,
        maxLife: 220 + Math.random() * 280,
        size: 0.6 + Math.random() * 1.8,
      });
    }

    function getAccent(): string {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      return v || "#2c5840";
    }

    function frame() {
      ctx!.clearRect(0, 0, W, H);
      const accent = getAccent();

      if (particles.length < 90 && Math.random() < 0.6) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.02;

        const t = p.life / p.maxLife;
        const alpha = Math.sin(t * Math.PI) * 0.85;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = accent;
        ctx!.globalAlpha = alpha;
        ctx!.shadowColor = accent;
        ctx!.shadowBlur = 8;
        ctx!.fill();

        if (p.life >= p.maxLife || p.y < -20) {
          particles.splice(i, 1);
        }
      }
      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

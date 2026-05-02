"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; life: number; size: number };

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    const dots: Dot[] = [];
    let lastSpawn = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getAccent(): string {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      return v || "#2c5840";
    }

    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastSpawn < 16) return;
      lastSpawn = now;
      for (let i = 0; i < 3; i++) {
        dots.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          life: 0,
          size: 6 + Math.random() * 6,
        });
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, W, H);
      const accent = getAccent();
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life++;
        const t = d.life / 28;
        const alpha = Math.max(0, 1 - t) * 0.55;
        const r = d.size * (1 - t * 0.6);
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = accent;
        ctx!.globalAlpha = alpha;
        ctx!.shadowColor = accent;
        ctx!.shadowBlur = 14;
        ctx!.fill();
        if (d.life >= 28) dots.splice(i, 1);
      }
      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}

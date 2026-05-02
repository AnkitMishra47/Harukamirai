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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let raf = 0;
    const dots: Dot[] = [];
    let lastSpawn = 0;
    let accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#2c5840";

    const themeObserver = new MutationObserver(() => {
      accent =
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
        "#2c5840";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastSpawn < 32) return;
      lastSpawn = now;
      dots.push({
        x: e.clientX,
        y: e.clientY,
        life: 0,
        size: 7 + Math.random() * 4,
      });
    }

    function frame() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = accent;
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life++;
        const t = d.life / 28;
        const alpha = Math.max(0, 1 - t) * 0.55;
        const r = d.size * (1 - t * 0.6);
        ctx!.globalAlpha = alpha;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx!.fill();
        if (d.life >= 28) dots.splice(i, 1);
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
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

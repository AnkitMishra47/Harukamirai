"use client";

import { useEffect, useRef, useState } from "react";

type Dot = { x: number; y: number; life: number; size: number };

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  /*
   * Whether to render the canvas at all.
   *
   * The loop below has always skipped touch, so nothing was ever drawn there -
   * but the element was still rendered, and it is `fixed inset-0 z-[60]`: a
   * full-viewport layer sitting on top of every scrolling thing on the page,
   * for an effect that cannot happen. Not drawing into a compositing layer does
   * not make it free.
   *
   * It starts rendered so the first client render matches the server's, and is
   * removed once the pointer type is known.
   */
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

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

    // The loop only runs while dots are alive. With the pointer still, the
    // canvas costs nothing.
    let running = false;
    function wake() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
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
      wake();
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
      if (dots.length === 0) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (isTouch) return null;

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}

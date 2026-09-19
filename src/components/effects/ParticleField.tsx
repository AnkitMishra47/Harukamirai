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
    /*
     * Not on a touch screen, for the same reason `CursorTrail` is not: the
     * effect costs more there than it is worth. This one is the homepage's
     * single most expensive thing to draw - a canvas the height of the hero,
     * cleared and repainted whole on every frame (measured: a 618x1755 backing
     * store at 412px of viewport). Skipping it on a coarse pointer took
     * main-thread long-task time across a scripted scroll from 6838ms to
     * 3279ms, more than every other effect on the page put together. Desktop,
     * which has the frames to spend, is unchanged.
     */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let raf = 0;
    const particles: Particle[] = [];
    const MAX_PARTICLES = 50;
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
        size: 0.8 + Math.random() * 1.6,
      });
    }

    // Pause when the hero is scrolled away or the tab is hidden; resume on
    // return. `active` gates the loop, `scheduled` prevents double loops.
    let inView = true;
    let active = true;
    let scheduled = false;
    function schedule() {
      if (!active || scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(frame);
    }
    function recompute() {
      active = inView && !document.hidden;
      schedule();
    }
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      recompute();
    });
    io.observe(canvas!);
    const onVisibility = () => recompute();
    document.addEventListener("visibilitychange", onVisibility);

    function frame() {
      scheduled = false;
      if (!active) return;
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = accent;

      if (particles.length < MAX_PARTICLES && Math.random() < 0.4) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.02;

        const t = p.life / p.maxLife;
        const alpha = Math.sin(t * Math.PI) * 0.7;

        ctx!.globalAlpha = alpha;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();

        if (p.life >= p.maxLife || p.y < -20) {
          particles.splice(i, 1);
        }
      }
      ctx!.globalAlpha = 1;
      schedule();
    }

    resize();
    window.addEventListener("resize", resize);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
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

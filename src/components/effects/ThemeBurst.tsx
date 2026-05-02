"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type BurstEvent = {
  x: number;
  y: number;
  to: "leaf-4" | "leaf-5";
  id: number;
};

export function ThemeBurst() {
  const [bursts, setBursts] = useState<BurstEvent[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ x: number; y: number; to: "leaf-4" | "leaf-5" }>;
      const { x, y, to } = ce.detail;
      const id = Date.now() + Math.random();
      setBursts((b) => [...b, { x, y, to, id }]);
      setTimeout(() => {
        setBursts((b) => b.filter((x) => x.id !== id));
      }, 1200);

      // Brief screen shake when going dark
      if (to === "leaf-5") {
        document.body.animate(
          [
            { transform: "translate(0,0)" },
            { transform: "translate(-2px, 1px)" },
            { transform: "translate(3px, -2px)" },
            { transform: "translate(-1px, 2px)" },
            { transform: "translate(0,0)" },
          ],
          { duration: 320, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" }
        );
      }
    };
    window.addEventListener("hm-theme-burst", handler);
    return () => window.removeEventListener("hm-theme-burst", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <AnimatePresence>
        {bursts.map((b) => (
          <BurstLayer key={b.id} burst={b} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function BurstLayer({ burst }: { burst: BurstEvent }) {
  const isDark = burst.to === "leaf-5";
  const color = isDark ? "#c8102e" : "#2c5840";

  return (
    <>
      {/* Ink-burst expanding circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: burst.x,
          top: burst.y,
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          background: `radial-gradient(circle, ${color} 0%, ${color}aa 35%, ${color}00 70%)`,
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
        initial={{ scale: 0, opacity: 0.95 }}
        animate={{ scale: 140, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Full-screen flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, isDark ? 0.35 : 0.18, 0] }}
        transition={{ duration: 0.55, times: [0, 0.25, 1], ease: "easeOut" }}
      />

      {/* Radial energy ring */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          left: burst.x,
          top: burst.y,
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          borderColor: color,
          boxShadow: `0 0 60px ${color}, inset 0 0 30px ${color}`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 30, opacity: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}

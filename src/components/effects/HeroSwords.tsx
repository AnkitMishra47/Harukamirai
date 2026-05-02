"use client";

import { motion } from "motion/react";

/**
 * Two crossed-sword silhouettes behind the hero title.
 * Original abstract art — long broadsword + slimmer hooked sword crossed
 * at ~50° angles. Anti-magic motif without resembling any specific
 * copyrighted character. Accent stroke + low fill, slowly pulsing.
 */
export function HeroSwords() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none flex items-center justify-center overflow-visible"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.svg
        viewBox="0 0 600 600"
        width={680}
        height={680}
        className="opacity-[0.07] dark:opacity-[0.13] will-change-transform"
        style={{ transform: "translateZ(0)" }}
        animate={{ rotate: [0, 2.5, 0, -2.5, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="hs-blade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Sword 1 — heavy broadsword, leaning left */}
        <g
          transform="rotate(-22 300 300)"
          fill="url(#hs-blade)"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          {/* blade with jagged hammered edge to evoke a brute / anti-magic feel */}
          <path d="M 300 50 L 312 90 L 308 200 L 314 230 L 308 320 L 314 350 L 308 440 L 312 466 L 288 466 L 292 440 L 286 350 L 292 320 L 286 230 L 292 200 L 288 90 Z" />
          {/* cross-guard */}
          <rect x="246" y="466" width="108" height="16" rx="3" />
          {/* grip */}
          <rect x="293" y="482" width="14" height="64" />
          {/* pommel */}
          <circle cx="300" cy="555" r="11" />
        </g>

        {/* Sword 2 — slimmer hooked saber, leaning right */}
        <g
          transform="rotate(28 300 300)"
          fill="url(#hs-blade)"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          {/* slimmer pointed blade with a small hook at the tip */}
          <path d="M 300 70 L 308 110 L 306 440 L 310 460 L 290 460 L 294 440 L 292 110 Z" />
          {/* hooked tip detail */}
          <path
            d="M 300 70 L 306 60 L 310 65 L 308 76 Z"
            fill="var(--accent)"
            fillOpacity="0.85"
          />
          {/* cross-guard, narrower */}
          <rect x="266" y="460" width="68" height="13" rx="2" />
          {/* grip */}
          <rect x="295" y="473" width="10" height="56" />
          {/* pommel */}
          <circle cx="300" cy="535" r="8" />
        </g>

        {/* Subtle glow at the cross point */}
        <circle
          cx="300"
          cy="300"
          r="14"
          fill="var(--accent)"
          fillOpacity="0.25"
        />
      </motion.svg>
    </motion.div>
  );
}

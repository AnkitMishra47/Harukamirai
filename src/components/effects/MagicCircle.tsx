"use client";

import { motion } from "motion/react";

const RUNES = "魔法騎士団黒夜空遥か未来反魔法五葉";
const RUNES2 = "ANTIMAGIC·HARUKAMIRAI·GRIMOIRE·";

type Props = {
  size?: number;
  className?: string;
  intensity?: "subtle" | "full";
};

export function MagicCircle({ size = 720, className = "", intensity = "full" }: Props) {
  const opacity = intensity === "subtle" ? 0.18 : 0.55;
  return (
    <motion.svg
      viewBox="0 0 800 800"
      width={size}
      height={size}
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden
    >
      <defs>
        <radialGradient id="mc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <path id="mc-outer-path" d="M 400,400 m -360,0 a 360,360 0 1,1 720,0 a 360,360 0 1,1 -720,0" />
        <path id="mc-inner-path" d="M 400,400 m -260,0 a 260,260 0 1,1 520,0 a 260,260 0 1,1 -520,0" />
      </defs>

      {/* Glow */}
      <circle cx="400" cy="400" r="380" fill="url(#mc-glow)" />

      {/* Outer rotating ring with kanji */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "400px 400px" }}
      >
        <circle cx="400" cy="400" r="360" fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="400" cy="400" r="345" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4" />
        <text fontSize="22" fill="var(--accent)" fillOpacity="0.85" letterSpacing="14">
          <textPath href="#mc-outer-path" startOffset="0%">
            {RUNES.repeat(4)}
          </textPath>
        </text>
      </motion.g>

      {/* Mid counter-rotating ring with latin runes */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "400px 400px" }}
      >
        <circle cx="400" cy="400" r="300" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.5" />
        <text fontSize="14" fill="var(--accent)" fillOpacity="0.6" letterSpacing="6" fontFamily="monospace">
          <textPath href="#mc-outer-path" startOffset="0%">
            {RUNES2.repeat(8)}
          </textPath>
        </text>
      </motion.g>

      {/* Inner pentagram + clover star */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "400px 400px" }}
      >
        <circle cx="400" cy="400" r="260" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.7" />
        {/* 5-point star — anti-magic */}
        <path
          d="M 400 160 L 461 348 L 658 348 L 499 463 L 561 651 L 400 535 L 239 651 L 301 463 L 142 348 L 339 348 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
      </motion.g>

      {/* Crosshair lines */}
      <g stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="0.5">
        <line x1="40" y1="400" x2="760" y2="400" />
        <line x1="400" y1="40" x2="400" y2="760" />
      </g>

      {/* Pulsing inner circle */}
      <motion.circle
        cx="400"
        cy="400"
        r="120"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        animate={{ r: [120, 138, 120], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

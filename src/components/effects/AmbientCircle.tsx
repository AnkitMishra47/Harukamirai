"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Lightweight always-on background magic circle for non-home routes.
 * - Single ring rotated by a CSS animation (no JS per frame, no gradient).
 * - Renders behind everything at very low opacity.
 * - Skipped on `/` because the home hero has its own (heavier) circle.
 * - Honours prefers-reduced-motion.
 */
export function AmbientCircle() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setEnabled(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!enabled) return null;
  if (pathname === "/") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-50 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 800 800"
        width={1100}
        height={1100}
        className="spin-cw opacity-[0.05] dark:opacity-[0.08]"
        style={{ "--spin": "120s", transformOrigin: "50% 50%" } as React.CSSProperties}
      >
        <circle cx="400" cy="400" r="360" fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.8" />
        <circle cx="400" cy="400" r="345" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.5" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.5" />
        <circle cx="400" cy="400" r="260" fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.6" />
        <path
          d="M 400 160 L 461 348 L 658 348 L 499 463 L 561 651 L 400 535 L 239 651 L 301 463 L 142 348 L 339 348 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.7"
          strokeOpacity="0.45"
        />
        <g stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="0.5">
          <line x1="40" y1="400" x2="760" y2="400" />
          <line x1="400" y1="40" x2="400" y2="760" />
        </g>
      </svg>
    </div>
  );
}

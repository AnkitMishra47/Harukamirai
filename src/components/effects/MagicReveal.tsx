"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function MagicReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Summoning Circle Effect */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
        animate={inView ? { opacity: [0, 0.4, 0], scale: [0.5, 1.2, 1.4], rotate: 45 } : {}}
        transition={{ duration: 1.2, ease: "easeOut", delay }}
      >
        <svg width="240" height="240" viewBox="0 0 100 100" className="text-[var(--accent)] opacity-30">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <path d="M 50 5 L 95 80 L 5 80 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M 50 95 L 5 20 L 95 20 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
        className="relative z-10"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function BrushDivider() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 600 24"
      className="mx-auto block w-full max-w-md my-16"
      aria-hidden
    >
      <motion.path
        d="M 20 12 C 80 4, 180 20, 280 10 S 480 18, 580 12"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.circle
        cx="300"
        cy="12"
        r="2.5"
        fill="var(--accent)"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.2 }}
      />
    </motion.svg>
  );
}

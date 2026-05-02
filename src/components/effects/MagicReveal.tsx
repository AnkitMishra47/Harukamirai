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
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
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

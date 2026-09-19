"use client";

import { useEffect, useRef, useState } from "react";

/** Continuous viewport observer for bidirectional scroll animations */
function useInView<T extends Element>(margin = "0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
      },
      { rootMargin: margin, threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

export function MagicReveal({
  children,
  delay = 0,
  direction = "up",
  index,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "alternate";
  index?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  
  let revealClass = "reveal-up";
  if (direction === "left") {
    revealClass = "reveal-left";
  } else if (direction === "right") {
    revealClass = "reveal-right";
  } else if (direction === "alternate") {
    revealClass = (index ?? 0) % 2 === 0 ? "reveal-left" : "reveal-right";
  }

  return (
    <div
      ref={ref}
      className={`${revealClass} ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function BrushDivider() {
  const { ref, inView } = useInView<SVGSVGElement>("-50px");
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 24"
      className={`brush mx-auto block w-full max-w-md my-16 ${inView ? "is-in" : ""}`}
      aria-hidden
    >
      <path
        d="M 20 12 C 80 4, 180 20, 280 10 S 480 18, 580 12"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
      />
      <circle cx="300" cy="12" r="2.5" fill="var(--accent)" />
    </svg>
  );
}

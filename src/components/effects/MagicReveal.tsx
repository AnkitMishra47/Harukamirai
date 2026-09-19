"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has entered the viewport; never flips back. */
function useInViewOnce<T extends Element>(margin = "100px") {
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
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

export function MagicReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal-up ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function BrushDivider() {
  const { ref, inView } = useInViewOnce<SVGSVGElement>("-50px");
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

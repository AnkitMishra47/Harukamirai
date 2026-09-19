"use client";

import { useEffect, useRef } from "react";

/**
 * One IntersectionObserver for the whole resume.
 *
 * Every block that should arrive on scroll carries `data-reveal` in the
 * server-rendered markup; this flips `data-in` on it once and stops watching
 * it. There is no scroll listener and no React state, so a page with ~40
 * revealing blocks costs one observer and ~40 attribute writes for the whole
 * visit rather than a render per frame.
 *
 * Three ways the content stays reachable when the observer never runs:
 *
 *   - `prefers-reduced-motion: reduce` - the CSS module already renders every
 *     block arrived, and this effect marks them all immediately as well.
 *   - no JavaScript - the <noscript> rule below neutralises the hidden state.
 *   - print - the module's @media print block forces the arrived state.
 */
export function RevealScope({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const arriveAll = () => targets.forEach((el) => el.setAttribute("data-in", ""));

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      arriveAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "[data-reveal]{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Transmutation Circle Navigation Transition Indicator
 *
 * Displays a lightweight, GPU-accelerated alchemy transmutation circle
 * when navigating between pages, dissolving smoothly once the destination page mounts.
 */
export function TransmutationLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Dismiss loader whenever the route change completes (pathname changes)
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Intercept internal link clicks to display transmutation circle immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor || !anchor.href) return;

      // Ignore external links, downloads, new tabs, hash links, or modifier clicks
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      // Check if it is an internal same-origin link to a different path
      if (url.origin === window.location.origin) {
        const targetPath = url.pathname;
        const currentPath = window.location.pathname;

        // Only trigger if going to a different route (not in-page hash jump)
        if (targetPath !== currentPath) {
          setIsNavigating(true);

          // Failsafe timeout: auto-hide after 2.5s if navigation is cancelled or stalled
          setTimeout(() => {
            setIsNavigating(false);
          }, 2500);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none bg-black/40 backdrop-blur-[4px]"
          aria-live="polite"
          aria-label="Loading page..."
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 shadow-[0_16px_48px_-10px_rgba(0,0,0,0.6),0_0_32px_var(--accent-glow)] flex flex-col items-center justify-center text-center"
          >
            {/* The Animated Transmutation Circle */}
            <div className="relative size-24 alchemy-pulse-box flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="size-full">
                {/* Outer Inscribed Circle with Runic Dash Drawing */}
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  className="alchemy-draw-outer"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  opacity="0.65"
                />

                {/* Interlocking Transmutation Triangles */}
                <polygon
                  points="50,14 81,68 19,68"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  className="alchemy-draw-inner"
                />
                <polygon
                  points="50,86 81,32 19,32"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                  className="alchemy-draw-inner"
                />

                {/* Core Alchemy Focus Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="16"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.6"
                />
              </svg>

              {/* Center 5-Leaf Alchemy Rune */}
              <span className="absolute text-lg select-none drop-shadow-[0_0_8px_var(--accent)] animate-pulse">
                🍀
              </span>
            </div>

            <div className="mt-3.5 space-y-0.5">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Transmuting Route
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                遥か未来 · Consulting Grimoire
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

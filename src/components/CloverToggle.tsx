"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CloverIcon } from "./CloverIcon";

type Theme = "leaf-4" | "leaf-5";
const STORAGE_KEY = "hm-theme";

function getCurrent(): Theme {
  if (typeof document === "undefined") return "leaf-4";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "leaf-5" ? "leaf-5" : "leaf-4";
}

export function CloverToggle() {
  const [theme, setThemeState] = useState<Theme>("leaf-4");
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setThemeState(getCurrent());
  }, []);

  function applyTheme(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setThemeState(next);
  }

  function toggle() {
    const next: Theme = getCurrent() === "leaf-4" ? "leaf-5" : "leaf-4";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("hm-theme-burst", {
          detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, to: next },
        })
      );
    }

    const vt = (
      document as unknown as { startViewTransition?: (cb: () => void) => unknown }
    ).startViewTransition;
    const apply = () => applyTheme(next);
    if (!reduced && typeof vt === "function") {
      vt.call(document, apply);
    } else {
      apply();
    }
  }

  const isFive = theme === "leaf-5";

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Always-on magic ring — rotating, theme-responsive */}
      <motion.svg
        viewBox="0 0 60 60"
        className="pointer-events-none absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <defs>
          <path
            id="ct-arc"
            d="M 30 30 m -26 0 a 26 26 0 1 1 52 0 a 26 26 0 1 1 -52 0"
          />
        </defs>
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.5"
          strokeWidth="0.6"
          strokeDasharray="2 4"
        />
        <text
          fontSize="5"
          fill="var(--accent)"
          fillOpacity="0.85"
          letterSpacing="2"
          fontFamily="monospace"
        >
          <textPath href="#ct-arc" startOffset="0%">
            ANTIMAGIC·遥か未来·GRIMOIRE·
          </textPath>
        </text>
      </motion.svg>

      {/* Pulsing glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: "0 0 18px var(--accent-glow)" }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={isFive ? "Switch to four-leaf theme" : "Switch to five-leaf theme"}
        aria-pressed={isFive}
        className="
          relative z-10 inline-flex items-center justify-center
          rounded-full border border-[var(--accent)]
          bg-[var(--bg-elevated)] p-2
          transition-all duration-200
          hover:scale-110 hover:shadow-[0_0_28px_var(--accent-glow)]
          focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]
        "
      >
        <CloverIcon size={24} />
      </button>
    </div>
  );
}

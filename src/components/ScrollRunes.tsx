"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./scroll-runes.module.css";

/**
 * The scroll runes: two rune seals floating at the horizontal centre of the
 * viewport, one under the header and one above the fold line.
 *
 * WHAT THEY ARE. The top seal takes you back to the cover. The bottom seal
 * moves you on by roughly a screen. Each drifts gently the way it will send
 * you, as an invitation to press it. They were one clasp on the right edge
 * before; centred, they no longer sit in the reader's margin, and the split
 * puts each one where the reader is already looking when they want it.
 *
 * ONE SEAL, ONE JOB. The old bottom-right "back to the top" button and the
 * old up ring did nearly the same thing from two places. There is now exactly
 * one way up (the top seal) and one way on (the bottom seal).
 *
 * ONLY WHEN NEEDED. The top seal is absent until there is something above
 * you, the bottom seal until there is something below you, and both are
 * absent on a page too short to be worth a control at all. They fade rather
 * than pop.
 *
 * MATERIALS. Leather, foil and gilt, from the fixed --leather-a, --foil and
 * --gilt tokens rather than the surface tokens, for the same reason the book
 * uses them: a seal is one object in both themes and the theme reaches it as
 * light, through --accent on the inner rule and the hover halo.
 *
 * COST. Always mounted while the page is scrollable, so it does no per-frame
 * work of its own. The one scroll listener is passive and rAF-coalesced, and
 * it writes nothing but three booleans that change a handful of times per
 * page, so a scroll never re-renders React in the common case. Nothing loops
 * except the bob, which is pure transform, is switched off while a seal is
 * hidden and never runs under prefers-reduced-motion.
 *
 * STAYING OUT OF THE WAY. Both seals sit at z-30: above the page, below the
 * sticky nav (z-40), below every full-screen overlay (z-50) and below the
 * cursor trail and theme burst. `blocked` then unmounts them outright so they
 * are not reachable by keyboard while an overlay is up. All widths: a seal at
 * the centre top or centre bottom sits on the page's own edges rather than in
 * the reading column, which is what kept the old right-hand rail off phones.
 */

/** Slack at either end of the document that still counts as the end. */
const EDGE = 8;

/** One screen, less a sliver so you keep a line of context across the jump. */
const STEP = 0.9;

/** 24 teeth on a circle of r=17.5: circumference 109.96 / 24 = 4.58 per tooth. */
const TEETH = "1.4 3.18";

function instantScroll() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ScrollRunes() {
  /** The page is long enough to be worth a control at all. */
  const [armed, setArmed] = useState(false);
  /** There is somewhere to go in that direction. */
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);
  /**
   * An overlay owns the screen. Starts true so the first paint (which is the
   * story overlay's) never shows a seal, and so the server and the client
   * agree on the first render.
   */
  const [blocked, setBlocked] = useState(true);

  const rafRef = useRef(0);

  const measure = useCallback(() => {
    rafRef.current = 0;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const y = window.scrollY;

    // Same primitive back means React bails out, so a scroll that changes
    // nothing costs three comparisons and no render.
    setArmed(max > vh * 0.5);
    setCanUp(y > EDGE);
    setCanDown(y < max - EDGE);
  }, []);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // The document grows and shrinks between routes and as images settle, and
    // neither of those fires scroll or resize.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [schedule]);

  /**
   * Two signals, either of which means something else owns the screen:
   *
   *   1. #storyline-theater is in the document - ShutterStoryExperience is
   *      mounted. It renders null once dismissed and remounts on the
   *      `open-shutter-story` event, so its presence is the state.
   *   2. body carries an inline overflow lock - the command palette, the
   *      recruiter brief and the lightbox all set one while they are open,
   *      and a page you cannot scroll has no use for a scroll control.
   *
   * Both are read from a MutationObserver watching only body's own children
   * and its style attribute, so this costs nothing until one of those two
   * things actually changes.
   */
  useEffect(() => {
    const check = () => {
      setBlocked(
        document.body.style.overflow === "hidden" ||
          document.getElementById("storyline-theater") !== null,
      );
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, {
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => mo.disconnect();
  }, []);

  const visible = armed && !blocked;

  // Settle the two directions the moment the seals (re)appear.
  useEffect(() => {
    if (visible) schedule();
  }, [visible, schedule]);

  if (!visible) return null;

  const behavior: ScrollBehavior = instantScroll() ? "auto" : "smooth";

  return (
    <>
      <div className={`${styles.dock} ${styles.top} print:hidden`} data-show={canUp}>
        <button
          type="button"
          className={styles.seal}
          onClick={() => window.scrollTo({ top: 0, behavior })}
          disabled={!canUp}
          aria-hidden={!canUp}
          aria-label="Back to the top of the page"
        >
          <Ring>
            <path d="M13.5 25 L22 16.5 L30.5 25" />
            <path d="M14 12 L30 12" />
          </Ring>
        </button>
      </div>

      <div className={`${styles.dock} ${styles.bottom} print:hidden`} data-show={canDown}>
        <button
          type="button"
          className={styles.seal}
          onClick={() =>
            window.scrollBy({ top: Math.round(window.innerHeight * STEP), behavior })
          }
          disabled={!canDown}
          aria-hidden={!canDown}
          aria-label="Scroll down one screen"
        >
          <Ring>
            <path d="M13.5 18.5 L22 27 L30.5 18.5" />
          </Ring>
        </button>
      </div>
    </>
  );
}

/**
 * The seal a chevron is struck into: an outer rim, a 24-tooth ring that turns
 * only while the pointer is on it, an inner rule carrying the theme's colour,
 * and a halo that answers a hover.
 */
function Ring({ children }: { children: React.ReactNode }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <circle
        cx="22"
        cy="22"
        r="20.25"
        fill="none"
        stroke="var(--foil)"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <circle
        className={styles.teeth}
        cx="22"
        cy="22"
        r="17.5"
        fill="none"
        stroke="var(--foil)"
        strokeWidth="3"
        strokeOpacity="0.2"
        strokeDasharray={TEETH}
      />
      <circle
        cx="22"
        cy="22"
        r="14.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.9"
        strokeOpacity="0.5"
      />
      <circle
        className={styles.halo}
        cx="22"
        cy="22"
        r="20.25"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4"
      />
      <g
        className={styles.glyph}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

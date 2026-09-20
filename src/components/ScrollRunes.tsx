"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./scroll-runes.module.css";

/**
 * The scroll runes: two rune seals floating at the horizontal centre of the
 * viewport, one under the header and one above the fold line.
 *
 * WHAT THEY ARE. The top seal takes you back to the cover. The bottom seal
 * moves you on by roughly a screen. Each drifts gently the way it will send
 * you, as an invitation to press it.
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
 * NEVER ON THE WORDS. This is the part that earns the complexity below. The
 * page is a centred column and so are the seals, so anything that scrolls
 * through the band at the viewport's centre passes under one of them. Moving
 * the seals up or down only picks a different victim. So a seal withdraws
 * instead: whenever the reader is still and there is ink under the seal - a
 * line of type, a picture, something you can click - it fades right out and
 * stops taking the pointer, so clicks land on the page beneath it. It comes
 * straight back when the reader scrolls (they are navigating, not reading),
 * when the pointer comes within REACH of it (they are going for it), or when
 * it takes focus. Over empty page it never withdraws at all, so on most
 * screens it keeps the presence it is supposed to have.
 *
 * MATERIALS. Leather, foil and gilt, from the fixed --leather-a, --foil and
 * --gilt tokens rather than the surface tokens, for the same reason the book
 * uses them: a seal is one object in both themes and the theme reaches it as
 * light, through --accent on the inner rule and the hover halo.
 *
 * COST. One passive scroll listener, rAF-coalesced, exactly as before. The
 * pointer listener added for REACH does nothing but compare two numbers
 * against a cached centre and only wakes the frame when the answer changes,
 * so moving the mouse across the page costs no layout. Inside the frame the
 * occlusion test is at most six hit tests against points we already have, on
 * a frame that already reads the document height. Nothing loops except the
 * bob, which is pure transform, is switched off while a seal is hidden or
 * withdrawn, and never runs under prefers-reduced-motion.
 *
 * STAYING OUT OF THE WAY. Both seals sit at z-30: above the page, below the
 * sticky nav (z-40), below every full-screen overlay (z-50) and below the
 * cursor trail and theme burst. `blocked` then unmounts them outright so they
 * are not reachable by keyboard while an overlay is up.
 */

/** Slack at either end of the document that still counts as the end. */
const EDGE = 8;

/** One screen, less a sliver so you keep a line of context across the jump. */
const STEP = 0.9;

/** 24 teeth on a circle of r=17.5: circumference 109.96 / 24 = 4.58 per tooth. */
const TEETH = "1.4 3.18";

/**
 * How long after the last scroll a seal keeps its full presence. Long enough
 * that a seal does not blink during a paused flick, short enough that it is
 * gone by the time anyone has read a line.
 */
const QUIET = 1100;

/** How near the pointer has to come before a seal counts as reached for. */
const REACH = 120;

/**
 * The grid sampled for ink, in px from the seal's centre.
 *
 * The rows run to +/-34 rather than the plate's own 27, because the bob
 * carries the seal 5px past its box and type clipping that sliver is still
 * type with a seal on it. Both of those were measured misses. The spacing is
 * the other half of it: no gap between neighbouring points exceeds 12px, so
 * nothing 13px or larger can sit under a seal unseen, which is every line of
 * type on the site and every picture. A miss of an 18x16 section numeral is
 * what set that figure.
 *
 * Thirty-five points is affordable because the probe only runs once the reader has
 * settled, never during a scroll: while the page is moving the seal is kept
 * present anyway, so there is nothing to decide. It also stops at the first
 * hit, and the case that runs all thirty is the one where nothing is there,
 * which is the case with the shallowest stacks.
 */
const PROBE_X = [-24, -12, 0, 12, 24];
const PROBE_Y = [-34, -23, -11, 0, 11, 23, 34];

/** Tags that are ink in their own right, whatever text they do or do not own. */
const INK = new Set([
  "IMG",
  "VIDEO",
  "CANVAS",
  "SVG",
  "A",
  "BUTTON",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "PICTURE",
]);

function instantScroll() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Is there anything worth reading directly under this seal?
 *
 * Hit-tests a short vertical line down the seal and walks each stack from the
 * front, skipping the seal's own nodes. An element counts as ink if it is a
 * picture or something you can click, or if it owns text directly - the last
 * test is what keeps a bare wrapper or a full-bleed wash from reading as
 * content, since those own no text of their own. Layers marked
 * pointer-events: none never come back from a hit test at all, which is
 * exactly right: the ambient art is meant to be passed over.
 */
function inkUnder(dock: HTMLElement, cx: number, cy: number) {
  for (const dy of PROBE_Y) {
    for (const dx of PROBE_X) {
      const stack = document.elementsFromPoint(cx + dx, cy + dy);
      for (const el of stack) {
        if (el === dock || dock.contains(el)) continue;
        const tag = el.tagName.toUpperCase();
        if (tag === "BODY" || tag === "HTML") break;
        if (INK.has(tag)) return true;
        for (let n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 3 && (n.nodeValue || "").trim()) return true;
        }
      }
    }
  }
  return false;
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

  const upRef = useRef<HTMLDivElement | null>(null);
  const downRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const idleRef = useRef(0);
  /** When the reader last scrolled. Seeded on mount so a seal says hello. */
  const activeAt = useRef(0);
  /** Cached seal centres, refreshed in the frame, read by the pointer. */
  const centres = useRef([
    { x: -1e4, y: -1e4 },
    { x: -1e4, y: -1e4 },
  ]);
  /** Whether the pointer is currently within REACH of each seal. */
  const near = useRef([false, false]);
  /** schedule(), reachable from measure() without a dependency cycle. */
  const wake = useRef(() => {});

  /**
   * Document height, cached. Read from the layout only when the document can
   * actually have changed size, never while scrolling.
   */
  const maxRef = useRef(0);
  const remeasureDoc = useCallback(() => {
    maxRef.current = document.documentElement.scrollHeight - window.innerHeight;
  }, []);

  /*
   * Nothing in here may read the layout.
   *
   * This runs once per animation frame for the whole length of a scroll, and it
   * used to open by reading `document.documentElement.scrollHeight` - which
   * forces a full document layout - and then, for each seal, a
   * `getBoundingClientRect()` interleaved with `dataset` writes, which is a
   * read/write/read thrash that forces layout again. Traced across one touch
   * scroll at 412x748: Layout ran 152 times and UpdateLayoutTree 152 times,
   * about once per frame, for a gesture that should need neither.
   *
   * The document height is cached and refreshed only when the document can have
   * changed size. The seals' rects are not read here at all: the docks are
   * `position: fixed` (see scroll-runes.module.css), so scrolling cannot move
   * them, and the only code that wants their centres - the pointer reach test
   * and the ink probe - runs in the settled branch below, off the scroll path.
   */
  const measure = useCallback(() => {
    rafRef.current = 0;
    const vh = window.innerHeight;
    const max = maxRef.current;
    const y = window.scrollY;

    // Same primitive back means React bails out, so a scroll that changes
    // nothing costs three comparisons and no render.
    setArmed(max > vh * 0.5);
    setCanUp(y > EDGE);
    setCanDown(y < max - EDGE);

    // The veil is written straight to the DOM rather than held in state: it
    // changes many times during a single scroll and none of it is React's
    // business.
    const quietFor = performance.now() - activeAt.current;
    const settled = quietFor >= QUIET;
    let waiting = false;
    const docks = [upRef.current, downRef.current];
    for (let i = 0; i < docks.length; i++) {
      const dock = docks[i];
      if (!dock) continue;
      if (dock.dataset.show !== "true" || near.current[i]) {
        dock.dataset.veiled = "false";
        continue;
      }
      if (!settled) {
        // Still moving, so the seal stays present whatever is under it, and
        // there is no reason to pay for the probe at all - nor for the geometry
        // the probe needs, which is why the rect is read below this line and
        // not above it.
        dock.dataset.veiled = "false";
        waiting = true;
        continue;
      }
      const rect = dock.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2;
      const cy = (rect.top + rect.bottom) / 2;
      centres.current[i].x = cx;
      centres.current[i].y = cy;
      dock.dataset.veiled = inkUnder(dock, cx, cy) ? "true" : "false";
    }

    // A seal held out only by the quiet period needs one more look once that
    // period is up, because by then nothing else will be firing.
    if (waiting) {
      clearTimeout(idleRef.current);
      idleRef.current = window.setTimeout(() => wake.current(), QUIET - quietFor + 40);
    }
  }, []);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    wake.current = schedule;
  }, [schedule]);

  useEffect(() => {
    activeAt.current = performance.now();
    const onScroll = () => {
      activeAt.current = performance.now();
      schedule();
    };
    /**
     * Pure arithmetic against the cached centres: the frame is only woken
     * when the pointer crosses into or out of a seal's reach, so sweeping the
     * mouse across the page costs nothing.
     */
    const onPointer = (e: PointerEvent) => {
      let changed = false;
      for (let i = 0; i < 2; i++) {
        const c = centres.current[i];
        const n = Math.abs(e.clientX - c.x) <= REACH && Math.abs(e.clientY - c.y) <= REACH;
        if (n !== near.current[i]) {
          near.current[i] = n;
          changed = true;
        }
      }
      if (changed) schedule();
    };

    /**
     * A lazy picture arriving in a box that was already the right size adds
     * ink under a seal without moving anything: no scroll, no resize, no
     * mutation the body observer can see. Measured, that was most of the
     * misses. A capturing listener picks up every img and iframe load event
     * as it bubbles nowhere, and costs nothing on a page that has finished
     * loading.
     */
    const onLoad = () => {
      remeasureDoc();
      schedule();
    };

    remeasureDoc();
    schedule();
    const onResize = () => {
      remeasureDoc();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("load", onLoad, true);
    // The document grows and shrinks between routes and as images settle, and
    // neither of those fires scroll or resize.
    const ro = new ResizeObserver(() => {
      remeasureDoc();
      schedule();
    });
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("load", onLoad, true);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      clearTimeout(idleRef.current);
    };
  }, [schedule]);

  /**
   * One signal: `data-scroll-lock` is in the document.
   *
   * That is the same mark the storyline theater, the command palette, the
   * recruiter brief, the case study modal, the lightbox and the mobile nav
   * panel each carry while they own the screen, and the one globals.css locks
   * the root against. A page you cannot scroll has no use for a scroll
   * control, so the mark answers this question too and there is no second
   * signal to keep in step with the first.
   *
   * It used to read body's inline overflow instead, which quietly stopped
   * meaning anything once the lock moved to the root where it actually works.
   *
   * The observer has to reach the whole subtree because two of those six
   * mount deep in the page rather than beside it, but it is filtered to the
   * one attribute nothing else uses, and the callback it runs is a single
   * selector match.
   */
  useEffect(() => {
    const check = () => {
      setBlocked(document.querySelector("[data-scroll-lock]") !== null);
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-scroll-lock"],
    });
    return () => mo.disconnect();
  }, []);

  const visible = armed && !blocked;

  // Settle both seals the moment they (re)appear, and give them their say
  // before the veil can take them.
  useEffect(() => {
    if (visible) {
      activeAt.current = performance.now();
      schedule();
    }
  }, [visible, schedule]);

  if (!visible) return null;

  const behavior: ScrollBehavior = instantScroll() ? "auto" : "smooth";

  return (
    <>
      <div
        ref={upRef}
        className={`${styles.dock} ${styles.top} print:hidden`}
        data-show={canUp}
      >
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

      <div
        ref={downRef}
        className={`${styles.dock} ${styles.bottom} print:hidden`}
        data-show={canDown}
      >
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

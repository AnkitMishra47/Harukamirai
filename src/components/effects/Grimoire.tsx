"use client";

import { timeline } from "@/content";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * The grimoire: Ankit's career as a book you can leaf through.
 *
 * Stage 0 is the closed cover; it opens itself shortly after mount, and the
 * bookmark ribbons then hang from the top edge, one per chapter.
 *
 * MATERIALS. Everything the book is made of comes from the fixed --leather-*,
 * --parchment-*, --foil and --gilt tokens, never from --bg-*. The book is the
 * same object in both themes; only the room around it changes. Painting it from
 * the surface tokens (as this did) made it cream-on-cream in leaf-4 and
 * black-on-black in leaf-5, so it read as a panel rather than a thing.
 * The theme still reaches the book, but as *light*: the aura and the spine beam
 * use --accent.
 *
 * SIZE. One number drives the whole object: --grimoire-w. Height, and the type
 * inside, are derived from it in `em`, so the book scales down to a phone
 * without anything being re-tuned by hand.
 */

type Chapter = {
  id: string;
  year: string;
  date: string;
  silk: string;
  romaji: string;
  kanji: string;
  title: string;
  body: string;
  sigil: "asta" | "spade" | "trophy" | "crown" | "dawn";
};

/**
 * Decoration per timeline entry. Only entries listed here become chapters.
 * Silks are dyed thread, so they are fixed colours like the rest of the book,
 * not theme variables. Each one carries the year in #fdf8ec at 4.9:1 or better.
 */
const DECOR: Record<string, Pick<Chapter, "silk" | "romaji" | "kanji" | "sigil">> = {
  bca: { silk: "#7a6a52", romaji: "Hajimari", kanji: "始まり", sigil: "dawn" },
  "oneit-intern": { silk: "#14634a", romaji: "Nyuudan", kanji: "入団", sigil: "asta" },
  "award-2024": { silk: "#8a6415", romaji: "Hyoushou", kanji: "表彰", sigil: "trophy" },
  "award-2025": { silk: "#a8172f", romaji: "Eiyo", kanji: "栄誉", sigil: "crown" },
  now: { silk: "#33306b", romaji: "Ima", kanji: "現在", sigil: "spade" },
};

const CHAPTERS: Chapter[] = timeline
  .filter((t) => t.id in DECOR)
  .map((t) => ({
    id: t.id,
    // First year in the date, so "2019 - 2022" reads 2019 and does not collide
    // with "Jul 2022" on the ribbon labels.
    year: t.id === "now" ? "今" : (t.date.match(/\d{4}/)?.[0] ?? t.date),
    date: t.date,
    title: t.title,
    body: t.note,
    ...DECOR[t.id],
  }));

type Stage = "closed" | "opening" | "open";

export function Grimoire() {
  const [stage, setStage] = useState<Stage>("closed");
  const [chapter, setChapter] = useState(0);
  const [flipping, setFlipping] = useState(false);

  // Auto-open after mount
  useEffect(() => {
    const t1 = setTimeout(() => setStage("opening"), 600);
    const t2 = setTimeout(() => setStage("open"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function jumpTo(i: number) {
    if (i === chapter || flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setChapter(i);
      setTimeout(() => setFlipping(false), 350);
    }, 350);
  }

  const c = CHAPTERS[chapter];

  return (
    <div
      className="relative select-none"
      style={{
        width: "var(--grimoire-w)",
        height: "calc(var(--grimoire-w) * 1.15)",
        // Internal type is sized in em off this, so the whole book scales as one.
        fontSize: "calc(var(--grimoire-w) * 0.04)",
        perspective: "1800px",
      }}
    >
      {/* Pulsing aura - the theme's light falling on a fixed object */}
      <div
        aria-hidden
        className="aura pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 65%)",
        }}
      />

      {/* Floor shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-3 w-4/5 -translate-x-1/2 rounded-full"
        style={{ background: "rgba(0,0,0,0.45)", filter: "blur(8px)" }}
      />

      {/* Bookmark ribbons - visible once the book opens */}
      <AnimatePresence>
        {stage === "open" && (
          <div
            className="absolute left-1/2 top-0 z-30 flex"
            style={{ transform: "translate(-50%, -3.9em)", gap: "0.5em" }}
          >
            {CHAPTERS.map((ch, i) => (
              <motion.button
                key={ch.id}
                onClick={() => jumpTo(i)}
                className="group relative cursor-pointer"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`Jump to ${ch.year}: ${ch.title}`}
                aria-current={i === chapter ? "true" : undefined}
              >
                <Ribbon active={i === chapter} silk={ch.silk} year={ch.year} />
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Book body */}
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        <BookShell />

        {/* Inner pages - visible after opening */}
        <AnimatePresence>
          {stage !== "closed" && (
            <motion.div
              /*
               * Inset from the board so the leather frames the leaves and the
               * gilt fore-edge shows as a bright line around them. Without this
               * the pages covered the binding completely and the open book was
               * just two parchment rectangles.
               */
              className="absolute flex"
              style={{ inset: "0.82em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="relative flex-1 overflow-hidden" style={{ marginRight: 2 }}>
                <PageBackground side="left" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`L-${chapter}`}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                    style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
                    className="absolute inset-0 flex flex-col justify-between"
                  >
                    <LeftPage chapter={c} index={chapter} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative flex-1 overflow-hidden" style={{ marginLeft: 2 }}>
                <PageBackground side="right" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`R-${chapter}`}
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
                    style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                    className="absolute inset-0 flex flex-col justify-between"
                  >
                    <RightPage chapter={c} index={chapter} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRONT COVER - on top until opened, then swings away */}
        <motion.div
          className="absolute inset-0 origin-left"
          style={{ transformStyle: "preserve-3d", zIndex: 20 }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: stage === "closed" ? 0 : -160 }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        >
          <FrontCover />
        </motion.div>

        {/* Leather spine over the gutter, with raised bands like a bound book */}
        {stage !== "closed" && <Spine />}

        {/*
         * Light rising off the spine. The softness is in the gradient's own
         * stops rather than a blur filter, so this composites without a
         * repaint pass every frame.
         */}
        {stage !== "closed" && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full -translate-x-1/2"
            style={{
              width: "2.6em",
              zIndex: 14,
              background:
                "radial-gradient(ellipse 50% 45% at 50% 50%, var(--accent) 0%, color-mix(in oklab, var(--accent) 45%, transparent) 38%, transparent 72%)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.85, 0.45], scaleY: [0, 1.1, 1] }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        )}

        {/* Sparks - CSS keyframe, deterministic spread so nothing re-randomises */}
        {stage === "open" &&
          Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="spark absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
              style={
                {
                  background: i % 3 === 0 ? "var(--gold)" : "var(--accent)",
                  boxShadow: `0 0 8px ${i % 3 === 0 ? "var(--gold)" : "var(--accent)"}`,
                  "--dx": `${((i * 37) % 80) - 40}px`,
                  "--dy": `${-100 - ((i * 53) % 100)}px`,
                  animationDelay: `${1.5 + i * 0.2}s`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>
    </div>
  );
}

/* ─────────────── PARTS ─────────────── */

/** Back board plus the block of leaves, seen at the edges. */
function BookShell() {
  return (
    <div
      className="absolute inset-0 rounded-md"
      style={{
        background:
          "linear-gradient(135deg, var(--leather-edge) 0%, var(--leather-b) 50%, var(--leather-edge) 100%)",
        boxShadow:
          "inset 0 0 0 2px var(--foil), inset 0 0 0 5px var(--leather-edge), 0 30px 60px rgba(0,0,0,0.55)",
      }}
    >
      {/* Gilded fore-edge: the stacked leaves catch light. Sits 0.55em inside
          the board and 0.27em outside the pages, so it reads as a thin bright
          rule of paper edges all the way round. */}
      <div
        className="absolute"
        style={{
          inset: "0.55em",
          background:
            "repeating-linear-gradient(0deg, var(--parchment-edge) 0px, var(--parchment-edge) 2px, var(--gilt) 2px, var(--gilt) 3px)",
          boxShadow: "0 0 6px rgba(212,175,55,0.5)",
        }}
      />
    </div>
  );
}

/** The bound spine, seen edge-on down the gutter of the open book. */
function Spine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-1/2 h-full -translate-x-1/2"
      style={{
        width: "1.15em",
        zIndex: 15,
        background:
          "linear-gradient(to right, var(--leather-edge) 0%, var(--leather-b) 38%, var(--leather-a) 62%, var(--leather-edge) 100%)",
        boxShadow: "0 0 10px 2px rgba(0,0,0,0.5)",
      }}
    >
      {/* raised bands */}
      {[18, 38, 62, 82].map((top) => (
        <div
          key={top}
          className="absolute inset-x-0"
          style={{
            top: `${top}%`,
            height: "0.32em",
            background: "linear-gradient(to right, transparent, var(--foil) 35%, var(--foil-hi) 50%, var(--foil) 65%, transparent)",
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}

function FrontCover() {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-md"
      style={{
        background:
          "linear-gradient(135deg, var(--leather-edge) 0%, var(--leather-b) 38%, var(--leather-a) 70%, var(--leather-edge) 100%)",
        boxShadow:
          "inset 0 0 0 2px var(--foil), inset 0 0 28px rgba(0,0,0,0.65), 0 20px 40px rgba(0,0,0,0.5)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Leather grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: "url(/textures/grain-128.png)", backgroundSize: "128px 128px" }}
      />

      {/* Corner brackets, stamped in foil */}
      {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 left-3 -rotate-90", "bottom-3 right-3 rotate-180"].map(
        (pos) => (
          <svg key={pos} className={`absolute ${pos}`} width="36" height="36" viewBox="0 0 36 36" aria-hidden>
            <path
              d="M 2 2 L 32 2 M 2 2 L 2 32 M 7 7 L 24 7 L 24 13 M 7 7 L 7 24 L 13 24"
              stroke="var(--foil)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        ),
      )}

      <div className="absolute left-1/2 top-[11%] -translate-x-1/2 text-center">
        <p className="font-display" style={{ color: "var(--foil-hi)", fontSize: "1em", letterSpacing: "0.4em" }}>
          GRIMOIRE
        </p>
        <p
          className="font-display"
          style={{ color: "var(--foil)", fontSize: "0.72em", letterSpacing: "0.3em", marginTop: "0.3em", opacity: 0.8 }}
        >
          NO. 17
        </p>
      </div>

      {/* Embossed clover, stamped in foil */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "30%" }}>
        <svg viewBox="0 0 100 100" width="100%" aria-hidden>
          <defs>
            <radialGradient id="emboss-grad" cx="50%" cy="38%" r="62%">
              <stop offset="0%" stopColor="var(--foil-hi)" />
              <stop offset="100%" stopColor="var(--foil)" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#emboss-grad)" strokeWidth="0.8" opacity="0.9" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#emboss-grad)"
            strokeWidth="0.4"
            strokeDasharray="1 2"
            opacity="0.8"
          />
          <g fill="url(#emboss-grad)">
            <path d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z" />
            <path d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z" />
            <path d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z" />
            <path d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z" />
          </g>
        </svg>
      </div>

      <div className="absolute left-1/2 bottom-[9%] -translate-x-1/2 text-center">
        <p className="font-jp" style={{ color: "var(--foil-hi)", fontSize: "1.5em" }}>
          遥か未来
        </p>
        <p
          className="font-display"
          style={{ color: "var(--foil)", fontSize: "0.62em", letterSpacing: "0.3em", marginTop: "0.3em", opacity: 0.75 }}
        >
          HARUKA · MIRAI
        </p>
      </div>
    </div>
  );
}

function PageBackground({ side }: { side: "left" | "right" }) {
  const toGutter = side === "left" ? "to right" : "to left";
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${toGutter}, var(--parchment) 0%, var(--parchment) 55%, var(--parchment-b) 100%)`,
        boxShadow:
          side === "left"
            ? "inset -22px 0 26px -20px rgba(58,40,20,0.55)"
            : "inset 22px 0 26px -20px rgba(58,40,20,0.55)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] mix-blend-multiply"
        style={{ backgroundImage: "url(/textures/grain-128.png)", backgroundSize: "128px 128px" }}
      />
      {/* The theme's light spilling onto the page from the spine */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${toGutter}, transparent 58%, var(--accent-glow) 100%)`,
          opacity: 0.3,
        }}
      />
    </div>
  );
}

/** Left page: the chapter's name plate. */
function LeftPage({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <div className="flex h-full flex-col" style={{ padding: "1.5em 1.4em" }}>
      <div>
        <p
          className="font-mono"
          style={{ color: "var(--gilt-ink)", fontSize: "0.58em", letterSpacing: "0.25em", textTransform: "uppercase" }}
        >
          Chapter {index + 1}
        </p>
        <p className="font-jp" style={{ color: "var(--page-ink)", fontSize: "2.2em", marginTop: "0.25em", lineHeight: 1.1 }}>
          {chapter.kanji}
        </p>
        <p
          className="font-display italic"
          style={{ color: "var(--page-ink-soft)", fontSize: "0.72em", letterSpacing: "0.04em", marginTop: "0.2em" }}
        >
          {chapter.romaji}
        </p>
      </div>

      <div style={{ marginTop: "1.5em" }}>
        <div style={{ height: 1, width: "100%", background: "var(--gilt-ink)", opacity: 0.45 }} />
        <p
          className="font-display"
          style={{ color: "var(--page-ink)", fontSize: "1.05em", lineHeight: 1.22, marginTop: "0.55em" }}
        >
          {chapter.title}
        </p>
        <p
          className="font-mono"
          style={{ color: "var(--page-ink-soft)", fontSize: "0.56em", letterSpacing: "0.14em", marginTop: "0.5em" }}
        >
          {chapter.date}
        </p>
      </div>

      <div className="mt-auto">
        <Folio n={index * 2 + 1} align="left" />
      </div>
    </div>
  );
}

/** Right page: the sigil and the account. */
function RightPage({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-between" style={{ padding: "1.5em 1.2em" }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Sigil kind={chapter.sigil} />
        <p
          style={{
            color: "var(--page-ink)",
            fontSize: "0.7em",
            lineHeight: 1.6,
            marginTop: "1.1em",
            maxWidth: "20ch",
          }}
        >
          {chapter.body}
        </p>
      </div>
      <Folio n={index * 2 + 2} align="right" />
    </div>
  );
}

/** Page number, set the way a printed book sets one. */
function Folio({ n, align }: { n: number; align: "left" | "right" }) {
  return (
    <p
      className="font-display w-full"
      style={{
        color: "var(--page-ink-soft)",
        fontSize: "0.55em",
        opacity: 0.7,
        textAlign: align === "left" ? "left" : "right",
      }}
    >
      {n}
    </p>
  );
}

function Ribbon({ active, silk, year }: { active: boolean; silk: string; year: string }) {
  return (
    <motion.div
      whileHover={{ y: 4 }}
      animate={{ y: active ? 8 : 0, scale: active ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative flex flex-col items-center"
      style={{ filter: active ? `drop-shadow(0 0 10px ${silk})` : "none" }}
    >
      <svg width="2.1em" height="4.25em" viewBox="0 0 34 68" aria-hidden>
        <path d="M 0 0 L 34 0 L 34 56 L 17 48 L 0 56 Z" fill={silk} />
        {/* woven highlight along the top, and a foil thread when selected */}
        <path d="M 4 4 L 30 4 L 30 11 L 4 11 Z" fill="rgba(255,255,255,0.16)" />
        {active && <path d="M 0 0 L 34 0 L 34 2.5 L 0 2.5 Z" fill="var(--foil)" />}
      </svg>
      <span
        className="font-mono absolute font-bold"
        style={{
          top: "0.8em",
          fontSize: "0.6em",
          letterSpacing: "0.06em",
          color: "#fdf8ec",
          textShadow: "0 1px 2px rgba(0,0,0,0.45)",
        }}
      >
        {year}
      </span>
    </motion.div>
  );
}

function Sigil({ kind }: { kind: Chapter["sigil"] }) {
  const ink = "var(--gilt-ink)";
  return (
    <svg
      width="5.6em"
      height="5.6em"
      viewBox="0 0 100 100"
      className="spin-cw"
      style={{ "--spin": "38s", transformOrigin: "50% 50%" } as React.CSSProperties}
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.65" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={ink} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.55" />

      {kind === "asta" && (
        <g fill={ink}>
          <path d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z" />
          <path d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z" />
          <path d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z" />
          <path d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z" />
        </g>
      )}
      {kind === "spade" && (
        <path
          d="M 50 18 C 70 38 80 50 70 64 C 64 72 56 70 52 64 L 54 78 L 46 78 L 48 64 C 44 70 36 72 30 64 C 20 50 30 38 50 18 Z"
          fill={ink}
        />
      )}
      {kind === "trophy" && (
        <g fill={ink}>
          <path d="M 30 26 L 70 26 L 68 50 C 68 60 60 64 50 64 C 40 64 32 60 32 50 Z" />
          <rect x="44" y="64" width="12" height="10" />
          <rect x="36" y="74" width="28" height="4" />
          <path d="M 30 30 L 22 30 L 22 44 L 32 48" stroke={ink} strokeWidth="2" fill="none" />
          <path d="M 70 30 L 78 30 L 78 44 L 68 48" stroke={ink} strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === "crown" && (
        <g fill={ink}>
          <path d="M 22 60 L 28 32 L 38 50 L 50 28 L 62 50 L 72 32 L 78 60 Z" />
          <rect x="22" y="62" width="56" height="8" />
          <circle cx="50" cy="40" r="3" fill="var(--parchment)" />
        </g>
      )}
      {kind === "dawn" && (
        <g>
          <circle cx="50" cy="60" r="14" fill={ink} />
          <line x1="50" y1="36" x2="50" y2="42" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="44" x2="38" y2="48" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="66" y1="44" x2="62" y2="48" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="60" x2="32" y2="60" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="60" x2="74" y2="60" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="76" x2="78" y2="76" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

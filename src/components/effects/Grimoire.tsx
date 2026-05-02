"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Interactive grimoire — turns the pages of Ankit's life.
 * Stage 0: closed cover with embossed clover sigil.
 * Stage 1+: opened, bookmark ribbons hang from top edge by year.
 *           Click a ribbon to flip to that chapter.
 */

type Chapter = {
  year: string;
  ribbon: string; // ribbon color theme
  romaji: string;
  kanji: string;
  title: string;
  body: string;
  sigil: "asta" | "spade" | "trophy" | "crown" | "dawn";
};

const CHAPTERS: Chapter[] = [
  {
    year: "2019",
    ribbon: "var(--text-muted)",
    romaji: "Hajimari",
    kanji: "始まり",
    title: "The Beginning",
    body: "BCA at GGSIPU. First lines of code. 86% by the end.",
    sigil: "dawn",
  },
  {
    year: "2022",
    ribbon: "var(--accent)",
    romaji: "Nyuudan",
    kanji: "入団",
    title: "Joined the Order",
    body: "Junior SWE intern at OneIT. MCA begins same month — two paths, one life.",
    sigil: "asta",
  },
  {
    year: "2024",
    ribbon: "#d4a017",
    romaji: "Hyoushou",
    kanji: "表彰",
    title: "First Recognition",
    body: "Mid-Tier Developer of the Year. MCA completed. Stack expanded into Python, Twilio, Ionic.",
    sigil: "trophy",
  },
  {
    year: "2025",
    ribbon: "#c8102e",
    romaji: "Saikou",
    kanji: "最高",
    title: "Employee of the Year",
    body: "Company-wide, across all engineering tiers. Promoted to Senior L3.",
    sigil: "crown",
  },
  {
    year: "今",
    ribbon: "var(--accent-hover)",
    romaji: "Ima",
    kanji: "現在",
    title: "Now",
    body: "Building harukamirai.engineer. Java, Angular, Python — and whatever the next ticket needs.",
    sigil: "spade",
  },
];

type Stage = "closed" | "opening" | "open";

export function Grimoire({ size = 400 }: { size?: number }) {
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
        width: size,
        height: size * 1.15,
        perspective: "1800px",
      }}
    >
      {/* Pulsing aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ opacity: [0.55, 0.95, 0.55], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 65%)",
        }}
      />

      {/* Floor shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-3 w-4/5 -translate-x-1/2 rounded-full"
        style={{ background: "rgba(0,0,0,0.45)", filter: "blur(8px)" }}
      />

      {/* Bookmark ribbons — visible once book opens */}
      <AnimatePresence>
        {stage === "open" && (
          <div
            className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 gap-2"
            style={{ transform: "translate(-50%, -28px)" }}
          >
            {CHAPTERS.map((ch, i) => (
              <motion.button
                key={ch.year}
                onClick={() => jumpTo(i)}
                className="group relative cursor-pointer"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`Jump to ${ch.year} — ${ch.title}`}
              >
                <Ribbon active={i === chapter} color={ch.ribbon} year={ch.year} />
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Book body */}
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {/* Closed back cover — always behind */}
        <BookShell />

        {/* Inner pages — visible after opening */}
        <AnimatePresence>
          {stage !== "closed" && (
            <motion.div
              className="absolute inset-0 flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {/* LEFT PAGE */}
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
                    className="absolute inset-0 flex flex-col justify-between p-6"
                  >
                    <LeftPageContent chapter={c} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT PAGE */}
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
                    className="absolute inset-0 flex items-center justify-center p-6"
                  >
                    <RightPageContent chapter={c} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRONT COVER — sits on top until opened, then rotates away */}
        <motion.div
          className="absolute inset-0 origin-left"
          style={{ transformStyle: "preserve-3d", zIndex: 20 }}
          initial={{ rotateY: 0 }}
          animate={{
            rotateY: stage === "closed" ? 0 : -160,
          }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        >
          <FrontCover />
        </motion.div>

        {/* Light beam from spine */}
        {stage !== "closed" && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-12 -translate-x-1/2 z-25"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.9, 0.55], scaleY: [0, 1.1, 1] }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, var(--accent) 50%, transparent 100%)",
              mixBlendMode: "screen",
              filter: "blur(8px)",
            }}
          />
        )}

        {/* Sparks */}
        {stage === "open" &&
          Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 80,
                y: -100 - Math.random() * 100,
              }}
              transition={{
                duration: 2.4 + Math.random() * 2,
                delay: 1.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 1.2,
                ease: "easeOut",
              }}
            />
          ))}
      </div>
    </div>
  );
}

/* ─────────────── PARTS ─────────────── */

function BookShell() {
  return (
    <div
      className="absolute inset-0 rounded-md"
      style={{
        background: "linear-gradient(135deg, var(--bg-inset) 0%, var(--bg-elevated) 50%, var(--bg-inset) 100%)",
        boxShadow:
          "inset 0 0 0 2px var(--accent), inset 0 0 0 6px var(--bg-inset), 0 30px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Page block visible at edges */}
      <div
        className="absolute"
        style={{
          inset: "12px 12px 12px 12px",
          background:
            "repeating-linear-gradient(0deg, #d8c8a8 0px, #d8c8a8 2px, #c8b890 2px, #c8b890 3px)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}

function FrontCover() {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-md"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-inset) 0%, var(--bg-elevated) 35%, var(--bg-inset) 100%)",
        boxShadow:
          "inset 0 0 0 2px var(--accent), inset 0 0 30px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.5)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Leather grain */}
      <svg className="absolute inset-0 h-full w-full opacity-30 mix-blend-multiply" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Corner brackets */}
      {[
        "top-3 left-3",
        "top-3 right-3 rotate-90",
        "bottom-3 left-3 -rotate-90",
        "bottom-3 right-3 rotate-180",
      ].map((pos) => (
        <svg
          key={pos}
          className={`absolute ${pos}`}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          aria-hidden
        >
          <defs>
            <linearGradient id="cf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-hover)" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-hover)" />
            </linearGradient>
          </defs>
          <path
            d="M 2 2 L 32 2 M 2 2 L 2 32 M 7 7 L 24 7 L 24 13 M 7 7 L 7 24 L 13 24"
            stroke="url(#cf)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ))}

      {/* Title strip */}
      <div className="absolute left-1/2 top-12 -translate-x-1/2 text-center">
        <p
          className="font-display text-base tracking-[0.4em]"
          style={{ color: "var(--accent)" }}
        >
          GRIMOIRE
        </p>
        <p
          className="font-display text-xs tracking-[0.3em] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          NO. 17
        </p>
      </div>

      {/* Center embossed clover */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="120" height="120" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="emboss-grad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="var(--accent-hover)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </radialGradient>
          </defs>
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#emboss-grad)" strokeWidth="0.8" opacity="0.9" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="url(#emboss-grad)" strokeWidth="0.4" strokeDasharray="1 2" opacity="0.8" />
          {/* Clover */}
          <g fill="url(#emboss-grad)">
            <path d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z" />
            <path d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z" />
            <path d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z" />
            <path d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z" />
          </g>
        </svg>
      </div>

      {/* Bottom kanji */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 text-center">
        <p className="font-jp text-2xl" style={{ color: "var(--accent)" }}>
          遥か未来
        </p>
        <p
          className="font-display text-[10px] tracking-[0.3em] mt-1"
          style={{ color: "var(--text-subtle)" }}
        >
          HARUKA · MIRAI
        </p>
      </div>
    </div>
  );
}

function PageBackground({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          side === "left"
            ? "linear-gradient(to right, var(--bg-elevated) 0%, var(--bg-inset) 100%)"
            : "linear-gradient(to left, var(--bg-elevated) 0%, var(--bg-inset) 100%)",
        boxShadow:
          side === "left"
            ? "inset -20px 0 30px -20px rgba(0,0,0,0.4)"
            : "inset 20px 0 30px -20px rgba(0,0,0,0.4)",
      }}
    >
      {/* Page texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
        <filter id={`pg-${side}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#pg-${side})`} />
      </svg>
    </div>
  );
}

function LeftPageContent({ chapter }: { chapter: Chapter }) {
  return (
    <>
      <div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "var(--accent)" }}
        >
          Chapter · {chapter.year}
        </p>
        <p className="font-jp text-3xl mt-2" style={{ color: "var(--text)" }}>
          {chapter.kanji}
        </p>
        <p
          className="font-display text-xs italic tracking-wide mt-0.5"
          style={{ color: "var(--text-subtle)" }}
        >
          {chapter.romaji}
        </p>
      </div>

      {/* Drop cap + handwritten lines */}
      <div className="flex-1 flex items-start gap-2 mt-3">
        <span
          className="font-display italic font-bold leading-none"
          style={{ color: "var(--accent)", fontSize: 56 }}
        >
          {chapter.title.charAt(0)}
        </span>
        <div className="flex-1 pt-2 space-y-1.5">
          {[0.95, 0.85, 0.92, 0.78, 0.88, 0.7].map((w, i) => (
            <motion.div
              key={i}
              className="h-px"
              style={{ background: "var(--text-muted)", opacity: 0.5, width: `${w * 100}%` }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
            />
          ))}
        </div>
      </div>

      <div>
        <div
          className="h-px w-full"
          style={{ background: "var(--accent)", opacity: 0.4 }}
        />
        <p
          className="font-display text-sm italic mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          — {chapter.title}
        </p>
      </div>
    </>
  );
}

function RightPageContent({ chapter }: { chapter: Chapter }) {
  return (
    <div className="text-center">
      <Sigil kind={chapter.sigil} />
      <p
        className="font-display text-xl mt-4 leading-tight"
        style={{ color: "var(--text)" }}
      >
        {chapter.title}
      </p>
      <p
        className="text-xs mt-3 leading-relaxed max-w-[88%] mx-auto"
        style={{ color: "var(--text-muted)" }}
      >
        {chapter.body}
      </p>
    </div>
  );
}

function Ribbon({ active, color, year }: { active: boolean; color: string; year: string }) {
  return (
    <motion.div
      whileHover={{ y: 4 }}
      animate={{ y: active ? 8 : 0, scale: active ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative flex flex-col items-center"
      style={{ filter: active ? `drop-shadow(0 0 12px ${color})` : "none" }}
    >
      <svg width="34" height="68" viewBox="0 0 34 68" aria-hidden>
        <path
          d="M 0 0 L 34 0 L 34 56 L 17 48 L 0 56 Z"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
        />
        <path
          d="M 4 4 L 30 4 L 30 12 L 4 12 Z"
          fill="rgba(255,255,255,0.18)"
        />
      </svg>
      <span
        className="absolute top-3 font-mono text-[10px] font-bold tracking-wider"
        style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        {year}
      </span>
    </motion.div>
  );
}

function Sigil({ kind }: { kind: Chapter["sigil"] }) {
  const stroke = "var(--accent)";
  const fill = "var(--accent)";
  const sz = 90;
  return (
    <motion.svg
      width={sz}
      height={sz}
      viewBox="0 0 100 100"
      animate={{ rotate: 360 }}
      transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.7" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6" />

      {kind === "asta" && (
        <g fill={fill}>
          {/* 5-leaf clover, anti-magic */}
          <path d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z" />
          <path d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z" />
          <path d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z" />
          <path d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z" />
        </g>
      )}
      {kind === "spade" && (
        <path
          d="M 50 18 C 70 38 80 50 70 64 C 64 72 56 70 52 64 L 54 78 L 46 78 L 48 64 C 44 70 36 72 30 64 C 20 50 30 38 50 18 Z"
          fill={fill}
        />
      )}
      {kind === "trophy" && (
        <g fill={fill}>
          <path d="M 30 26 L 70 26 L 68 50 C 68 60 60 64 50 64 C 40 64 32 60 32 50 Z" />
          <rect x="44" y="64" width="12" height="10" />
          <rect x="36" y="74" width="28" height="4" />
          <path d="M 30 30 L 22 30 L 22 44 L 32 48" stroke={fill} strokeWidth="2" fill="none" />
          <path d="M 70 30 L 78 30 L 78 44 L 68 48" stroke={fill} strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === "crown" && (
        <g fill={fill}>
          <path d="M 22 60 L 28 32 L 38 50 L 50 28 L 62 50 L 72 32 L 78 60 Z" />
          <rect x="22" y="62" width="56" height="8" />
          <circle cx="50" cy="40" r="3" fill="var(--bg)" />
        </g>
      )}
      {kind === "dawn" && (
        <g>
          <circle cx="50" cy="60" r="14" fill={fill} />
          <line x1="50" y1="36" x2="50" y2="42" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="44" x2="38" y2="48" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <line x1="66" y1="44" x2="62" y2="48" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="60" x2="32" y2="60" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="60" x2="74" y2="60" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="76" x2="78" y2="76" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
    </motion.svg>
  );
}

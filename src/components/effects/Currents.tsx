"use client";

import { motion } from "motion/react";
import { MagicReveal } from "./MagicReveal";

/**
 * "Currents" — what I'm reading, drinking, listening to.
 * Manga book with flipping pages + coffee cup with rising steam.
 */
export function Currents() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <MagicReveal>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          Currents · 今
        </p>
        <h2 className="font-display text-5xl md:text-6xl mt-2 text-[var(--text)]">
          Reading, drinking, watching.
        </h2>
        <p className="mt-4 max-w-xl text-[var(--text-muted)]">
          A site about an engineer who reads manga should probably show that.
        </p>
      </MagicReveal>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <MagicReveal delay={0.05}>
          <Card label="Reading" jp="読書">
            <MangaBook />
            <CardMeta
              title="Black Clover"
              meta="Manga · Yūki Tabata"
              line="Ch. 370-something. Asta&apos;s arc still unmatched in shonen pacing — say what you want about the anime."
            />
          </Card>
        </MagicReveal>

        <MagicReveal delay={0.18}>
          <Card label="Drinking" jp="珈琲">
            <CoffeeCup />
            <CardMeta
              title="Hand-pour, every morning"
              meta="V60 · medium roast · 1:16"
              line="The kind of coffee that takes ten minutes to make. Worth it."
            />
          </Card>
        </MagicReveal>

        <MagicReveal delay={0.32}>
          <Card label="Playing" jp="将棋">
            <ChessBoard />
            <CardMeta
              title="Chess — Sicilian, mostly"
              meta="Lichess · 1500-ish"
              line="Analysis after losses is where the hobby actually lives."
            />
          </Card>
        </MagicReveal>
      </div>
    </section>
  );
}

function Card({
  label,
  jp,
  children,
}: {
  label: string;
  jp: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-7 transition-all hover:border-[var(--accent)] hover:shadow-[0_30px_80px_-30px_var(--accent-glow)]"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {label}
        </p>
        <p className="font-jp text-sm text-[var(--text-subtle)]">{jp}</p>
      </div>
      {children}
    </motion.div>
  );
}

function CardMeta({
  title,
  meta,
  line,
}: {
  title: string;
  meta: string;
  line: string;
}) {
  return (
    <div className="mt-4">
      <p className="font-display text-2xl text-[var(--text)]">{title}</p>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-subtle)] mt-1">
        {meta}
      </p>
      <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">{line}</p>
    </div>
  );
}

/* ============================================================
   MANGA BOOK with flipping pages
   ============================================================ */
function MangaBook() {
  return (
    <div className="flex h-44 items-center justify-center">
      <svg viewBox="0 0 240 180" className="h-auto w-full max-w-[220px] overflow-visible">
        <defs>
          <linearGradient id="manga-cover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-hover)" />
          </linearGradient>
          <linearGradient id="manga-page" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg)" />
            <stop offset="100%" stopColor="var(--bg-inset)" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="120" cy="160" rx="80" ry="6" fill="#000" opacity="0.3" />

        {/* Back cover */}
        <rect x="40" y="30" width="160" height="120" rx="3" fill="url(#manga-cover)" opacity="0.85" />

        {/* Page stack */}
        <rect x="44" y="34" width="152" height="112" fill="url(#manga-page)" />
        {[38, 42, 46, 50, 54, 58].map((y, i) => (
          <line key={i} x1="44" y1={y + 92} x2="196" y2={y + 92} stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
        ))}

        {/* Spine */}
        <rect x="118" y="30" width="4" height="120" fill="var(--accent-hover)" />

        {/* Left page panels (manga grid) */}
        <g>
          <rect x="50" y="40" width="62" height="36" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          <rect x="50" y="80" width="28" height="28" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          <rect x="84" y="80" width="28" height="28" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          <rect x="50" y="112" width="62" height="28" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          {/* Speedlines */}
          <g stroke="var(--text)" strokeWidth="0.5" opacity="0.6">
            <line x1="56" y1="46" x2="106" y2="58" />
            <line x1="56" y1="52" x2="106" y2="62" />
            <line x1="56" y1="58" x2="106" y2="68" />
            <line x1="56" y1="64" x2="106" y2="72" />
          </g>
          {/* Star burst */}
          <path d="M 96 92 L 100 100 L 108 102 L 100 104 L 96 112 L 92 104 L 84 102 L 92 100 Z" fill="var(--accent)" opacity="0.9" />
        </g>

        {/* Right page — flipping pages animation */}
        <motion.g
          animate={{ rotateY: [0, -160, -160, 0] }}
          transition={{
            duration: 5,
            times: [0, 0.4, 0.6, 1],
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "120px 90px" }}
        >
          <rect x="124" y="40" width="68" height="100" fill="url(#manga-page)" stroke="var(--border)" strokeWidth="0.5" />
          {/* Right page panel content */}
          <rect x="130" y="46" width="56" height="40" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          <rect x="130" y="92" width="26" height="42" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          <rect x="160" y="92" width="26" height="42" fill="var(--bg)" stroke="var(--text)" strokeWidth="1" />
          {/* Big "BOOM" SFX */}
          <path
            d="M 138 60 L 144 52 L 148 62 L 156 54 L 160 64 L 168 56 L 172 66 L 178 58 L 178 78 L 138 78 Z"
            fill="var(--accent)"
            opacity="0.85"
          />
        </motion.g>

        {/* Page-turn shadow */}
        <motion.rect
          x="118" y="30" width="2" height="120"
          fill="#000" opacity="0.4"
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   COFFEE CUP with rising steam
   ============================================================ */
function CoffeeCup() {
  return (
    <div className="flex h-44 items-end justify-center pt-2">
      <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[200px] overflow-visible">
        <defs>
          <linearGradient id="cup-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-elevated)" />
            <stop offset="100%" stopColor="var(--bg-inset)" />
          </linearGradient>
          <radialGradient id="liquid" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#5a3a22" />
            <stop offset="100%" stopColor="#2a1a10" />
          </radialGradient>
        </defs>

        {/* Steam — three wavy paths rising and fading */}
        {[
          { x: 78, delay: 0 },
          { x: 100, delay: 0.6 },
          { x: 122, delay: 1.2 },
        ].map((s) => (
          <motion.path
            key={s.x}
            d={`M ${s.x} 110 Q ${s.x - 6} 90 ${s.x} 70 Q ${s.x + 6} 50 ${s.x} 30 Q ${s.x - 4} 18 ${s.x} 10`}
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, y: 20, pathLength: 0 }}
            animate={{
              opacity: [0, 0.55, 0],
              y: [20, -30],
              pathLength: [0, 1, 1],
            }}
            transition={{
              duration: 3,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Saucer */}
        <ellipse cx="100" cy="178" rx="70" ry="6" fill="#000" opacity="0.35" />
        <ellipse cx="100" cy="170" rx="62" ry="8" fill="url(#cup-grad)" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1" />

        {/* Cup body */}
        <path
          d="M 50 100 Q 50 160 100 162 Q 150 160 150 100 Z"
          fill="url(#cup-grad)"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />

        {/* Handle */}
        <path
          d="M 150 110 Q 178 110 178 130 Q 178 150 150 150"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeOpacity="0.8"
          strokeLinecap="round"
        />

        {/* Coffee surface */}
        <ellipse cx="100" cy="100" rx="50" ry="8" fill="url(#liquid)" />
        <ellipse cx="100" cy="98" rx="48" ry="6" fill="none" stroke="var(--accent)" strokeOpacity="0.4" />

        {/* Crema swirl */}
        <motion.path
          d="M 78 100 Q 100 96 122 100 Q 100 104 78 100"
          fill="none"
          stroke="#a07550"
          strokeWidth="1"
          opacity="0.6"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   CHESS BOARD with a knight-move animation
   ============================================================ */
function ChessBoard() {
  return (
    <div className="flex h-44 items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[180px]">
        {/* Board */}
        <g>
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => {
              const dark = (r + c) % 2 === 1;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={20 + c * 20}
                  y={20 + r * 20}
                  width="20"
                  height="20"
                  fill={dark ? "var(--accent)" : "var(--bg-inset)"}
                  fillOpacity={dark ? 0.85 : 1}
                />
              );
            })
          )}
          <rect x="20" y="20" width="160" height="160" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
        </g>

        {/* Knight glyph that hops in an L-shape */}
        <motion.g
          animate={{
            x: [0, 40, 40, 0, 0],
            y: [0, 0, -40, -40, 0],
          }}
          transition={{
            duration: 6,
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <circle cx="50" cy="150" r="9" fill="var(--bg)" stroke="var(--text)" strokeWidth="1.5" />
          <text
            x="50"
            y="155"
            textAnchor="middle"
            fontSize="14"
            fill="var(--text)"
            fontFamily="serif"
            fontWeight="700"
          >
            ♞
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

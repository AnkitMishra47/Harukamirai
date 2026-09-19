"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MagicCircle } from "@/components/effects/MagicCircle";
import { ParticleField } from "@/components/effects/ParticleField";
import { Grimoire } from "@/components/effects/Grimoire";
import { profile } from "@/content";

/**
 * Home hero. Text is rendered in HTML and revealed with CSS keyframes
 * (`.hero-in`) so it paints before hydration; only the scroll parallax on the
 * circle and the book needs JavaScript.
 */
export function HeroIntro() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const grimoireY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const grimoireRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const circleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Disable Grimoire scroll transforms below `lg` - on mobile the layout
  // stacks vertically and the y/rotate offsets drag the book over the CTAs.
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [first, second] = profile.nameLines;

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      <motion.div
        style={{ scale: circleScale, opacity: circleOpacity }}
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <MagicCircle size={900} />
      </motion.div>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 75%, var(--bg) 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 z-0 hidden lg:block w-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 70%, transparent) 35%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-24 pb-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="hero-in hero-in-1 text-xs uppercase tracking-[0.32em] text-[var(--accent)]">
            <span className="font-jp text-base tracking-normal">アスタ</span>
            <span className="mx-2 opacity-40">·</span>
            <span className="font-jp text-base tracking-normal">反魔法</span>
            <span className="mx-3 opacity-40">·</span>
            ANTI-MAGIC GRIMOIRE
          </p>
          <p className="hero-in hero-in-2 mt-1.5 text-xs uppercase tracking-[0.32em] text-[var(--text-subtle)]">
            <span className="font-jp text-base tracking-normal">遥か未来</span>
            <span className="mx-3 opacity-40">·</span>
            No. 17
          </p>

          {/* Title - the A and I in ANKIT are accent-coloured: they spell AI. */}
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] tracking-tight text-[var(--text)] mt-6">
            {[first, second].map((line, li) => (
              <span key={line} className="block whitespace-nowrap">
                {Array.from(line).map((c, i) => {
                  const isAIChar = li === 0 && (i === 0 || i === 3);
                  return (
                    <span
                      key={i}
                      className={`hero-letter inline-block ${isAIChar ? "text-[var(--accent)]" : ""}`}
                      style={{
                        animationDelay: `${0.25 + (li * 5 + i) * 0.045}s`,
                        ...(isAIChar
                          ? { textShadow: "0 0 28px var(--accent-glow), 0 0 12px var(--accent-glow)" }
                          : {}),
                      }}
                    >
                      {c}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <div className="hero-in hero-in-4 mt-5 inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-3 py-1.5">
              <span className="font-display text-base font-bold text-[var(--accent)]">A</span>
              <span className="text-xs text-[var(--text-subtle)]">·</span>
              <span className="font-display text-base font-bold text-[var(--accent)]">I</span>
              <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                engineer
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)] hidden sm:inline">
              ↑ not a coincidence
            </span>
          </div>

          <div
            className="hero-rule mt-6 h-[2px] w-40 origin-left bg-[var(--accent)]"
            style={{ boxShadow: "0 0 18px var(--accent-glow)" }}
          />

          <p
            className="hero-in hero-in-5 mt-8 max-w-xl text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed"
            style={{ textShadow: "0 0 18px var(--bg), 0 0 6px var(--bg)" }}
          >
            {profile.heroLine}{" "}
            <a
              href={profile.employer.href}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline decoration-1 underline-offset-4 hover:text-[var(--accent-hover)]"
            >
              {profile.employer.name}
            </a>
            .
          </p>

          <div className="hero-in hero-in-6 mt-10 flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/work"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-[var(--bg)] transition-all hover:shadow-[0_0_30px_var(--accent-glow)]"
            >
              <span className="relative z-10">Open the grimoire</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              <span className="absolute inset-0 -translate-x-full bg-[var(--accent-hover)] transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Read the story
            </Link>
          </div>
        </div>

        <motion.div
          style={isLg ? { y: grimoireY, rotate: grimoireRotate } : undefined}
          className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0"
        >
          <div className="relative">
            <div
              aria-hidden
              className="hero-aura absolute left-1/2 top-1/2 -z-10 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
            />
            <Grimoire size={400} />
          </div>
        </motion.div>
      </div>

      <div className="hero-in hero-in-7 absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.32em] text-[var(--text-subtle)]">
        <span className="hero-bob block">scroll down</span>
      </div>
    </section>
  );
}

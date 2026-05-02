"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MagicCircle } from "@/components/effects/MagicCircle";
import { ParticleField } from "@/components/effects/ParticleField";
import { Grimoire } from "@/components/effects/Grimoire";
import { HeroSwords } from "@/components/effects/HeroSwords";
import { MagicReveal, BrushDivider } from "@/components/effects/MagicReveal";
import { Currents } from "@/components/effects/Currents";

const NAME_LINES = ["ANKIT", "MISHRA"];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const grimoireY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const grimoireRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const circleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Disable Grimoire scroll transforms below `lg` — on mobile the layout
  // stacks vertically and the y/rotate offsets drag the book over the CTAs.
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>

        {/* Crossed-sword silhouettes — anti-magic motif behind the title */}
        <div
          aria-hidden
          className="absolute left-[26%] top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none"
        >
          <HeroSwords />
        </div>

        {/* Magic circle — rotating ring layer */}
        <motion.div
          style={{ scale: circleScale, opacity: circleOpacity }}
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <MagicCircle size={900} />
        </motion.div>

        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 75%, var(--bg) 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-24 pb-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.32em] text-[var(--accent)]"
            >
              <span className="font-jp text-base tracking-normal">アスタ</span>
              <span className="mx-2 opacity-40">·</span>
              <span className="font-jp text-base tracking-normal">反魔法</span>
              <span className="mx-3 opacity-40">·</span>
              ANTI-MAGIC GRIMOIRE
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-1.5 text-xs uppercase tracking-[0.32em] text-[var(--text-subtle)]"
            >
              <span className="font-jp text-base tracking-normal">遥か未来</span>
              <span className="mx-3 opacity-40">·</span>
              No. 17
            </motion.p>

            {/* Title — two clean lines, never breaks mid-word.
                The A and I in ANKIT are colored accent — they spell AI. */}
            <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] tracking-tight text-[var(--text)] mt-6">
              {NAME_LINES.map((line, li) => (
                <span key={li} className="block whitespace-nowrap">
                  {Array.from(line).map((c, i) => {
                    const isAIChar = li === 0 && (i === 0 || i === 3);
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 60, rotateX: -90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.4 + (li * 5 + i) * 0.045,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`inline-block ${
                          isAIChar ? "text-[var(--accent)]" : ""
                        }`}
                        style={{
                          transformOrigin: "50% 100%",
                          ...(isAIChar
                            ? {
                                textShadow:
                                  "0 0 28px var(--accent-glow), 0 0 12px var(--accent-glow)",
                              }
                            : {}),
                        }}
                      >
                        {c}
                      </motion.span>
                    );
                  })}
                </span>
              ))}
            </h1>

            {/* AI annotation — the A and the I in ANKIT spell AI on purpose */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.55 }}
              className="mt-5 inline-flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-3 py-1.5">
                <span className="font-display text-base font-bold text-[var(--accent)]">
                  A
                </span>
                <span className="text-xs text-[var(--text-subtle)]">·</span>
                <span className="font-display text-base font-bold text-[var(--accent)]">
                  I
                </span>
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  engineer
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)] hidden sm:inline">
                ↑ not a coincidence
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.75, ease: [0.65, 0, 0.35, 1] }}
              className="mt-6 h-[2px] w-40 origin-left bg-[var(--accent)]"
              style={{ boxShadow: "0 0 18px var(--accent-glow)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.95 }}
              className="mt-8 max-w-xl text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed"
              style={{ textShadow: "0 0 18px var(--bg), 0 0 6px var(--bg)" }}
            >
              From BCA to{" "}
              <span className="text-[var(--text)] font-medium">Senior&nbsp;L3</span>{" "}
              in three years, with a Master&apos;s earned in the cracks between
              deploys. I ship{" "}
              <strong className="text-[var(--text)]">AI features</strong> —
              RAG, OCR, MCP tooling, DPO fine-tuning — into Java, Angular, and
              Python platforms at{" "}
              <a
                href="https://oneit.com.au"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] underline decoration-1 underline-offset-4 hover:text-[var(--accent-hover)]"
              >
                OneIT
              </a>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.25 }}
              className="mt-10 flex flex-wrap items-center gap-4 text-sm"
            >
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
            </motion.div>
          </div>

          <motion.div
            style={isLg ? { y: grimoireY, rotate: grimoireRotate } : undefined}
            className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="relative">
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Grimoire size={400} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.32em] text-[var(--text-subtle)]"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="block"
          >
            scroll down
          </motion.span>
        </motion.div>
      </section>

      {/* CREDIBILITY */}
      <section className="relative border-y border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <MagicCircle size={1200} intensity="subtle" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3">
          <Stat kicker="2025" value="Runner-up · Employee of the Year" note="Company-wide award, OneIT." delay={0} />
          <Stat kicker="2024" value="Mid Developer of the Year" note="Signed by MD David Barton." delay={0.15} />
          <Stat kicker="3 in 3" value="Promotions in three years" note="Junior Intern → Senior L3." delay={0.3} />
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Featured spells
          </p>
          <h2 className="font-display text-5xl md:text-6xl mt-2 text-[var(--text)]">
            Things I shipped.
          </h2>
        </MagicReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-5">
          <MagicReveal delay={0.1} className="md:col-span-3">
            <ProjectTile
              tag="Client · Next.js · 2025"
              title="The Sprachkraft"
              body="A 7-page Next.js production site for a language and study-abroad consultancy — scoped, designed, and shipped end-to-end in a single day."
              chips={["Next.js", "TypeScript", "Tailwind", "Vercel"]}
              accent
            />
          </MagicReveal>
          <MagicReveal delay={0.25} className="md:col-span-2">
            <ProjectTile
              tag="Day job · 2022 — present"
              title="OneIT — Cougar"
              body="Backend systems, integrations, and release pipelines for an Australian engineering team."
              chips={["Java", "Spring", "Angular", "Postgres", "Twilio"]}
            />
          </MagicReveal>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            All work, full timeline
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <Currents />

      <section className="mx-auto max-w-3xl px-6 pb-32">
        <BrushDivider />
        <MagicReveal>
          <p className="font-display text-2xl md:text-3xl leading-relaxed text-[var(--text)]">
            Outside work, I like quiet things — chess, manga, long-format anime,
            the kind of coffee that takes ten minutes to make. The five-leaf
            clover at the top of this page is not a logo; it&apos;s a switch.{" "}
            <span className="text-[var(--accent)]">Click it.</span>
          </p>
        </MagicReveal>
        <div className="mt-10 text-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            More about me
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({
  kicker,
  value,
  note,
  delay = 0,
}: {
  kicker: string;
  value: string;
  note: string;
  delay?: number;
}) {
  return (
    <MagicReveal delay={delay}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {kicker}
      </p>
      <p className="font-display text-2xl mt-2 text-[var(--text)]">{value}</p>
      <p className="text-sm text-[var(--text-muted)] mt-1.5">{note}</p>
    </MagicReveal>
  );
}

function ProjectTile({
  tag,
  title,
  body,
  chips,
  accent,
}: {
  tag: string;
  title: string;
  body: string;
  chips: string[];
  accent?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`group relative h-full overflow-hidden rounded-2xl border p-8 transition-all ${
        accent
          ? "border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:shadow-[0_20px_60px_-20px_var(--accent-glow)]"
          : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {tag}
      </p>
      <h3 className="font-display text-3xl mt-3 text-[var(--text)]">{title}</h3>
      <p className="mt-4 text-[var(--text-muted)] leading-relaxed">{body}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {chips.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[var(--text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

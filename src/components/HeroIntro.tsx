"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MagicCircle } from "@/components/effects/MagicCircle";
import { ParticleField } from "@/components/effects/ParticleField";
import { GrimoireLazy } from "@/components/effects/GrimoireLazy";
import { profile } from "@/content";

/**
 * Home hero. Text is rendered in HTML and revealed with CSS keyframes
 * (`.hero-in`) so it paints before hydration; only the scroll parallax on the
 * circle and the book needs JavaScript.
 *
 * The parallax is one passive, rAF-throttled scroll listener that writes
 * `--hero-p` (0 = hero at the top of the viewport, 1 = hero fully scrolled
 * out) on the section. The circle and the book read it in CSS `calc()`.
 * It only listens while the hero is on screen, and not under reduced motion
 * (the section then keeps the default of 0).
 */
export function HeroIntro() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const write = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      el.style.setProperty("--hero-p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const [first, second] = profile.nameLines;

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Desktop seal: centred on the hero, behind name and book alike. */}
      <div
        style={{
          transform: "scale(calc(1 + var(--hero-p, 0) * 0.3))",
          opacity: "calc(1 - var(--hero-p, 0) / 0.8)",
        }}
        className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:block"
      >
        <MagicCircle size={900} />
      </div>

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

      <div className="relative z-10 mx-auto grid min-h-[70vh] md:min-h-[88vh] max-w-7xl grid-cols-1 items-center gap-8 md:gap-12 px-6 lg:px-12 pt-10 md:pt-24 pb-12 md:pb-20 lg:grid-cols-[1.3fr_1fr]">
        <div>

          <p className="hero-in hero-in-1 flex flex-wrap items-center text-xs uppercase tracking-[0.18em] sm:tracking-[0.32em] text-[var(--accent)]">
            <span className="font-jp text-sm tracking-normal">アスタ</span>
            <span className="mx-2 opacity-50">·</span>
            <span className="font-jp text-sm tracking-normal">反魔法</span>
            <span className="mx-3 opacity-50">·</span>
            <span className="whitespace-nowrap">ANTI-MAGIC GRIMOIRE</span>
          </p>
          <p className="hero-in hero-in-2 mt-2 flex flex-wrap items-center text-xs uppercase tracking-[0.18em] sm:tracking-[0.32em] text-[var(--text-subtle)]">
            <span className="font-jp text-sm tracking-normal">遥か未来</span>
            <span className="mx-3 opacity-50">·</span>
            <span>NO. 17</span>
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

          <div className="hero-in hero-in-4 mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--bg-elevated)_70%,var(--accent-glow))] py-1.5 pl-2 pr-3.5 shadow-[0_2px_12px_var(--accent-glow)] backdrop-blur-sm">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--accent)] px-2 py-0.5 font-display text-xs font-bold leading-none text-[var(--bg)] shadow-[0_0_8px_var(--accent)]">
                <span>A</span>
                <span className="opacity-70">·</span>
                <span>I</span>
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text)]">
                Software Engineer
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>Not a coincidence</span>
            </span>
          </div>

          {/*
            Lede. The accent rule belongs to the paragraph, not to the
            "not a coincidence" caption above it: the space above the rule is
            roughly twice the space below, so it reads as the mark that opens
            the paragraph rather than an orphan underline for the caption.
            That matters most at 390px, where the caption wraps onto its own
            line and lands directly above the rule. The two are grouped in one
            wrapper so the relationship survives future spacing edits.
          */}
          <div className="mt-8 sm:mt-10">
            <div
              className="hero-rule h-[2px] w-44 origin-left bg-[var(--accent)]"
              style={{ boxShadow: "0 0 18px var(--accent-glow)" }}
            />

            <p className="hero-in hero-in-5 mt-4 max-w-xl text-lg sm:text-xl text-[var(--text)] leading-relaxed">
              {profile.heroLine}{" "}
              <a
                href={profile.employer.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--accent)] underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--accent-hover)]"
              >
                {profile.employer.name}
              </a>
              .
            </p>
          </div>

          <div className="hero-in hero-in-6 mt-10 flex flex-col items-start gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-shutter-story"))}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[var(--accent)] px-6 py-3.5 font-sans font-medium text-[var(--bg)] shadow-[0_4px_20px_var(--accent-glow)] transition-all hover:shadow-[0_0_30px_var(--accent-glow)] cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="relative z-10 font-semibold tracking-wide">Experience Storyline</span>
                <span className="absolute inset-0 -translate-x-full bg-[var(--accent-hover)] transition-transform duration-500 group-hover:translate-x-0" />
              </button>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 py-3.5 font-sans font-medium text-[var(--text-muted)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              >
                <span>View My Work</span>
                <span aria-hidden>→</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-recruiter-brief"))}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors pl-2 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Quick overview for recruiters</span>
            </button>
          </div>
        </div>

        <div className="hero-book relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
          <div className="relative">
            {/*
              Mobile seal: sized off the book rather than the viewport, and
              centred on it, so it reads as the book's own casting circle
              instead of a pattern running behind the paragraph.
            */}
            <div className="hero-seal-sm pointer-events-none absolute left-1/2 top-1/2 -z-10 lg:hidden" aria-hidden>
              <MagicCircle size={900} />
            </div>
            <div
              aria-hidden
              className="hero-aura absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "calc(var(--grimoire-w) * 1.15)",
                height: "calc(var(--grimoire-w) * 1.15)",
                background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
              }}
            />
            <GrimoireLazy />
          </div>
        </div>
      </div>

      <div className="hero-in hero-in-7 absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.32em] text-[var(--text-subtle)]">
        <span className="hero-bob block">scroll down</span>
      </div>
    </section>
  );
}

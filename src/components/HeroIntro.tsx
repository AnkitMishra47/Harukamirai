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

      <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:px-12 pt-24 pb-20 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="hero-in hero-in-1 mb-3.5 inline-flex items-center gap-2.5 rounded-full border border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--bg-elevated)_70%,var(--accent-glow))] px-3.5 py-1.5 shadow-[0_0_15px_var(--accent-glow)] backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Welcome to Haruka Mirai · Grimoire No. 17
            </span>
          </div>

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
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text)] leading-none">
                Software Engineer
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>Not a coincidence</span>
            </span>
          </div>

          <div
            className="hero-rule mt-6 h-[2px] w-44 origin-left bg-[var(--accent)]"
            style={{ boxShadow: "0 0 18px var(--accent-glow)" }}
          />

          <p className="hero-in hero-in-5 mt-8 max-w-xl text-lg sm:text-xl text-[var(--text)] leading-relaxed">
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

          <div className="hero-in hero-in-6 mt-10 flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-interactive-story"))}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[var(--accent)] px-6 py-3.5 font-medium text-[var(--bg)] shadow-[0_4px_20px_var(--accent-glow)] transition-all hover:shadow-[0_0_30px_var(--accent-glow)] cursor-pointer"
            >
              <span className="relative z-10 font-bold text-xs">▶</span>
              <span className="relative z-10 font-semibold">Play Career Story (45s)</span>
              <span className="absolute inset-0 -translate-x-full bg-[var(--accent-hover)] transition-transform duration-500 group-hover:translate-x-0" />
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-recruiter-brief"))}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/60 bg-[color-mix(in_oklab,var(--bg-elevated)_80%,var(--accent-glow))] px-5 py-3.5 font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)] cursor-pointer"
            >
              <span>🎯</span>
              <span>30s Recruiter Brief</span>
            </button>

            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-5 py-3.5 font-medium text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              <span>Work & Projects</span>
              <span aria-hidden>→</span>
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3.5 text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)] cursor-pointer"
              aria-label="Open vector search palette"
            >
              <span className="text-[var(--accent)] font-bold">⌘K</span>
              <span className="hidden sm:inline">Search</span>
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

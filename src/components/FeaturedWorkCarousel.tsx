"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { caseStudies, type CaseStudy } from "@/content";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyModal } from "@/components/CaseStudyModal";

export function FeaturedWorkCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  // Show all case studies in the slideable carousel
  const items = caseStudies;

  useEffect(() => {
    if (isPaused || selectedStudy !== null) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused, selectedStudy, items.length]);

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const current = items[activeIndex];
  const isGold = activeIndex % 2 === 1;
  const accentColor = isGold ? "var(--gold)" : "var(--accent)";
  const glowColor = isGold ? "var(--gold-glow)" : "var(--accent-glow)";

  return (
    <section className="w-full" aria-labelledby="featured-work-title">
      <header className="mb-6 text-center">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
            Featured Systems · 実戦記録
          </p>
          <h2
            id="featured-work-title"
            className="font-display text-3xl sm:text-4xl md:text-5xl mt-1.5 text-[var(--text)] leading-tight"
          >
            Things I Shipped
          </h2>
        </MagicReveal>
      </header>

      {/* Full-width Carousel Container */}
      <div
        className="relative flex items-center gap-2 sm:gap-4 w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Chevron (Desktop only to prevent mobile squeezing) */}
        <button
          type="button"
          onClick={goPrev}
          className="hidden sm:inline-flex shrink-0 size-10 sm:size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-glow)] transition-all cursor-pointer shadow-sm"
          aria-label="Previous system"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Carousel Card: Full width on mobile, rounded-3xl, zero jitter */}
        <div className="flex-1 min-w-0 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent)] shadow-sm">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-transparent"
            aria-hidden
          />

          {/* Fixed-height container to eliminate vertical jitter */}
          <div className="p-5 sm:p-7 md:p-8 min-h-[340px] sm:min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, x: direction * 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -18 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-between text-center gap-2"
              >
                {/* Row 1: Tag at Top Center */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 font-mono text-[11px] sm:text-xs font-semibold border shadow-sm whitespace-nowrap"
                    style={{
                      backgroundColor: glowColor,
                      borderColor: `color-mix(in oklab, ${accentColor} 40%, transparent)`,
                      color: accentColor,
                    }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                      aria-hidden
                    />
                    <span>0{activeIndex + 1} / 0{items.length} · {current.kicker.split("·")[0].trim()}</span>
                  </span>

                  <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full font-mono text-xs bg-[var(--bg-inset)] border border-[var(--border)] text-[var(--text-subtle)] whitespace-nowrap">
                    {current.org === "independent" ? "Independent" : "OneIT Enterprise"}
                  </span>
                </div>

                {/* Row 2: Main Title */}
                <div className="flex items-center justify-center px-1 sm:px-4">
                  <h3 className="font-display text-lg sm:text-2xl md:text-3xl text-[var(--text)] font-semibold leading-snug line-clamp-2">
                    {current.title}
                  </h3>
                </div>

                {/* Row 3: 1-Line Overview */}
                <div className="flex items-center justify-center px-1 sm:px-4">
                  <p className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] leading-relaxed line-clamp-3 max-w-2xl mx-auto">
                    {current.domain}
                  </p>
                </div>

                {/* Row 4: Full Stack Chips */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1 py-1">
                  {current.stack.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-mono bg-[var(--bg-inset)] border border-[var(--border)] text-[var(--text)] whitespace-nowrap"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Row 5: In-Place Blueprint Modal Trigger */}
                <div className="border-t border-[var(--border)] flex items-center justify-center pt-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedStudy(current)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    <span>Read Architecture Blueprint</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Dot Indicators with mobile chevrons flanking */}
          <div className="flex items-center justify-between sm:justify-center px-4 sm:px-0 gap-2 py-2 border-t border-[var(--border)] bg-[var(--bg)]/40">
            {/* Mobile Left Chevron */}
            <button
              type="button"
              onClick={goPrev}
              className="sm:hidden inline-flex size-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] active:border-[var(--accent)] cursor-pointer"
              aria-label="Previous system"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className="p-1 cursor-pointer"
                  aria-label={`Switch to system ${idx + 1}`}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-5 sm:w-6 bg-[var(--accent)]"
                        : "w-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-subtle)]"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Right Chevron */}
            <button
              type="button"
              onClick={goNext}
              className="sm:hidden inline-flex size-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] active:border-[var(--accent)] cursor-pointer"
              aria-label="Next system"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Chevron (Desktop only) */}
        <button
          type="button"
          onClick={goNext}
          className="hidden sm:inline-flex shrink-0 size-10 sm:size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-glow)] transition-all cursor-pointer shadow-sm"
          aria-label="Next system"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* In-Place Architecture Blueprint Modal */}
      <CaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </section>
  );
}

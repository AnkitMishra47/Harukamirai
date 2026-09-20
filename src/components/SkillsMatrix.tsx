"use client";

import { disciplines } from "@/content";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { HoverLift } from "@/components/effects/HoverLift";

interface SkillsMatrixProps {
  /** Optional title override */
  title?: string;
  /** Optional subtitle/kicker override */
  kicker?: string;
  /** Optional lead description override */
  lead?: string;
  /** Whether to show header inside component (defaults to true) */
  showHeader?: boolean;
}

export function SkillsMatrix({
  title = "Engineering Disciplines & Production Arsenal",
  kicker = "Record of Craft · 技術領域",
  lead = "A grimoire is a record of techniques tested under real load. Below are the five production pillars I architect, deploy, and maintain across Australian enterprise platforms.",
  showHeader = true,
}: SkillsMatrixProps) {
  return (
    <section className="w-full" aria-labelledby="skills-matrix-title">
      {showHeader && (
        <header className="mb-8 md:mb-12">
          <MagicReveal direction="left">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
                {kicker}
              </p>
              <p className="font-mono text-xs text-[var(--gold)]">
                {disciplines.length} Core Disciplines
              </p>
            </div>
            <h2
              id="skills-matrix-title"
              className="font-display text-3xl sm:text-4xl md:text-5xl mt-3 text-[var(--text)] leading-tight"
            >
              {title}
            </h2>
            {lead && (
              <p className="mt-3.5 max-w-2xl text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
                {lead}
              </p>
            )}
          </MagicReveal>
        </header>
      )}

      {/* Grid: 2-column layout on desktop with the 5th pillar spanning full width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {disciplines.map((pillar, idx) => {
          const isSpanned = idx === disciplines.length - 1 && disciplines.length % 2 !== 0;
          const isGoldAccent = idx % 2 === 1;
          const accentVar = isGoldAccent ? "var(--gold)" : "var(--accent)";
          const glowVar = isGoldAccent ? "var(--gold-glow)" : "var(--accent-glow)";

          return (
            <div
              key={pillar.id}
              className={`${isSpanned ? "lg:col-span-2" : "col-span-1"} h-full`}
            >
              <MagicReveal
                direction={idx % 2 === 0 ? "left" : "right"}
                delay={0.05 + idx * 0.08}
                className="h-full"
              >
                <HoverLift y={-4}>
                  <article
                    className="group relative flex flex-col justify-between h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-7 md:p-8 transition-all hover:border-[var(--accent)] hover:shadow-[0_16px_40px_-15px_var(--accent-glow)] overflow-hidden"
                  >
                    {/* Top gradient glow blade */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-transparent opacity-80 group-hover:opacity-100 transition-opacity"
                      aria-hidden
                    />

                    <div>
                      {/* Header: Rubric, Subtitle & Scale Indicator */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p
                            className="font-mono text-xs uppercase tracking-[0.16em] font-semibold"
                            style={{ color: accentVar }}
                          >
                            {pillar.numeral} · {pillar.subtitle}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl mt-1 text-[var(--text)] font-semibold leading-snug">
                            {pillar.title}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                            {pillar.summary}
                          </p>
                        </div>

                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border transition-colors shadow-sm"
                          style={{
                            backgroundColor: glowVar,
                            borderColor: `color-mix(in oklab, ${accentVar} 40%, transparent)`,
                            color: accentVar,
                          }}
                        >
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: accentVar }}
                            aria-hidden
                          />
                          <span>{pillar.scaleBadge}</span>
                        </span>
                      </div>

                      {/* Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {pillar.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--bg-inset)] border border-[var(--border)] text-[var(--text)] transition-colors group-hover:border-[var(--border-strong)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Concrete Highlights */}
                      <div
                        className={`mt-6 ${
                          isSpanned
                            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                            : "space-y-3"
                        }`}
                      >
                        {pillar.highlights.map((bullet, bIdx) => (
                          <div
                            key={bIdx}
                            className="flex items-start gap-2.5 text-sm text-[var(--text-muted)] leading-relaxed"
                          >
                            <span
                              className="font-bold select-none text-sm leading-tight shrink-0 mt-0.5"
                              style={{ color: accentVar }}
                              aria-hidden
                            >
                              ✦
                            </span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </HoverLift>
              </MagicReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

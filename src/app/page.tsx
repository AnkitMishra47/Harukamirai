import Link from "next/link";
import { HeroIntro } from "@/components/HeroIntro";
import { MagicCircle } from "@/components/effects/MagicCircle";
import { MagicReveal, BrushDivider } from "@/components/effects/MagicReveal";
import { FeaturedWorkCarousel } from "@/components/FeaturedWorkCarousel";
import { SkillsCarousel } from "@/components/SkillsCarousel";
import { Currents } from "@/components/effects/Currents";
import { awards, profile, testimonials } from "@/content";

export default function HomePage() {
  const [newest, previous] = awards;

  return (
    <>
      <HeroIntro />

      {/* CREDIBILITY */}
      <section className="relative border-y border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* `band-seal` lets the stylesheet cap this below lg - a 1200px texture
            for wallpaper at 4% opacity on a 384px screen is the single largest
            layer on the page after the document itself. */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <MagicCircle size={1200} intensity="subtle" className="band-seal" />
        </div>
        {/* Banded section: padding sits inside the tinted box, so it takes both sides. */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-band grid gap-10 md:grid-cols-3">
          <Stat kicker={newest.year} value={newest.title} note="Company-wide award, OneIT." delay={0} />
          <Stat kicker={previous.year} value={previous.title} note="Awarded across OneIT engineering." delay={0.15} />
          <Stat kicker="3 in 3" value="Three Career Milestones" note="Junior Intern to Senior Software Engineer." delay={0.3} />
        </div>
      </section>

      {/* FEATURED WORK CAROUSEL */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pt-section">
        <FeaturedWorkCarousel />
        <div className="mt-6 text-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <span>View all 7 case studies & architecture blueprints</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CORE DISCIPLINES / SKILLS CAROUSEL */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pt-section">
        <SkillsCarousel />
        <div className="mt-8 text-center">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <span>View full record & credentials in Resume</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* PEER RECOGNITION / SOCIAL PROOF */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pt-section">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--gold)] via-[var(--accent)] to-transparent" />
          <div className="w-full">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--gold)] font-semibold">
              From OneIT Engineering Peers
            </p>
            <h2 className="font-display text-2xl sm:text-3xl mt-2 text-[var(--text)] leading-snug">
              &ldquo;{testimonials[1].quote}&rdquo;
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
              <p className="text-xs font-mono text-[var(--text-subtle)]">
                {testimonials[1].attribution}
              </p>
              <Link
                href="/about"
                className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 leading-none group"
              >
                <span>Read all peer nominations in About</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 -translate-y-[0.5px] transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Currents />

      {/* PHILOSOPHY & ABOUT HANDOFF */}
      <section className="mx-auto max-w-3xl px-6">
        <BrushDivider />
        <MagicReveal>
          <p className="font-display text-2xl md:text-3xl leading-relaxed text-[var(--text)]">
            Outside work, I like quiet things - chess, manga, long-format anime,
            the kind of coffee that takes ten minutes to make. The five-leaf
            clover at the top of this page is not a logo; it&apos;s a switch.{" "}
            <span className="text-[var(--accent)]">Click it.</span>
          </p>
        </MagicReveal>
        <div className="mt-stack text-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            <span>More about {profile.name.split(" ")[0]}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ kicker, value, note, delay = 0 }: { kicker: string; value: string; note: string; delay?: number }) {
  return (
    <MagicReveal delay={delay}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{kicker}</p>
      <p className="font-display text-2xl mt-2 text-[var(--text)]">{value}</p>
      <p className="text-sm text-[var(--text-muted)] mt-1.5">{note}</p>
    </MagicReveal>
  );
}

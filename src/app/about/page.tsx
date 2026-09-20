import type { Metadata } from "next";
import Link from "next/link";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { AboutBio } from "@/components/AboutBio";
import { AboutPortraitTimezone } from "@/components/about/AboutPortraitTimezone";
import { RecognitionGrid } from "@/components/about/RecognitionGrid";
import { PersonalMottoBanner } from "@/components/about/PersonalMottoBanner";
import { photos, profile, testimonials, timeline } from "@/content";
import styles from "@/components/about.module.css";

export const metadata: Metadata = {
  title: `About - ${profile.name}`,
  description: profile.heroLine.split(". ")[0] + ".",
};

/** Four-point seal, the same shape as the core star in the hero's magic circle. */
function Seal() {
  return (
    <svg viewBox="0 0 12 12" className={styles.seal} aria-hidden focusable="false">
      <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" fill="var(--gold)" />
    </svg>
  );
}

/**
 * A section opening: seal, numeral and a thread of rule, then the heading.
 * The mark itself is decoration, so it is hidden from assistive tech; the <h2>
 * underneath carries the structure.
 */
function ChapterMark({
  numeral,
  title,
  lead,
  centered = false,
}: {
  numeral: string;
  title: string;
  lead: string;
  centered?: boolean;
}) {
  return (
    <MagicReveal>
      <div
        className={`${styles.chapter} ${centered ? styles.chapterCentered : ""}`}
        aria-hidden
      >
        <span
          className={`${styles.thread} ${styles.threadFadeLeft} ${centered ? "" : styles.threadShort}`}
        />
        <Seal />
        <span className={styles.numeral}>{numeral}</span>
        <span className={`${styles.thread} ${styles.threadFadeRight}`} />
      </div>
      <h2
        className={`font-display text-3xl text-[var(--text)] mt-4 ${centered ? "text-center" : ""}`}
      >
        {title}
      </h2>
      <p
        className={`text-sm text-[var(--text-muted)] mt-2 leading-relaxed ${
          centered ? "text-center mx-auto max-w-xl" : "max-w-2xl"
        }`}
      >
        {lead}
      </p>
    </MagicReveal>
  );
}

export default function AboutPage() {
  const emailLink = profile.links.find((l) => l.label === "Email")!;

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 pt-page">
      {/* FRONTISPIECE - the page opens the way a folio opens. Deliberately not
          wrapped in a scroll reveal: the h1 must never depend on JavaScript. */}
      <header className="mb-stack">
        <div className={styles.rule} aria-hidden />
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            About
          </p>
          <p className="font-jp text-sm text-[var(--gold)]" aria-hidden>
            魔法書
          </p>
        </div>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          The grind, plainspoken.
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--text-muted)]">
          A grimoire is only a record of what someone practised until it worked. This one holds the
          arc, the people who vouched for it, and the hours off the page.
        </p>
        <div className={`${styles.rule} mt-7`} aria-hidden />
      </header>

      {/* PORTRAIT + BIO */}
      <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16 items-start">
        <MagicReveal direction="left">
          <AboutBio bio={profile.bio} emailLink={emailLink} />
        </MagicReveal>
        <MagicReveal direction="right" delay={0.1}>
          <AboutPortraitTimezone />
        </MagicReveal>
      </div>

      {/* CHAPTER I: AWARDS / RECOGNITION (CENTERED) */}
      <section className="mt-section">
        <ChapterMark
          numeral="I"
          title="Recognition"
          lead="Two consecutive years of company-wide recognition at OneIT, awarded by executive leadership."
          centered
        />

        <div className="mt-stack">
          <RecognitionGrid />
        </div>
      </section>

      {/* CHAPTER II: PEER TESTIMONIALS (CENTERED) */}
      <section className="mt-section">
        <ChapterMark
          numeral="II"
          title="From peers"
          lead="Excerpts from internal peer nominations submitted at OneIT in 2025. Names removed; wording is theirs."
          centered
        />

        <MagicReveal direction="left" className="mt-stack">
          <TestimonialCarousel testimonials={testimonials} />
        </MagicReveal>
      </section>

      {/* PHILOSOPHICAL CREED BANNER (CINEMATIC BRIDGE TO THE ARC) */}
      <section className="mt-section">
        <MagicReveal direction="right">
          <PersonalMottoBanner />
        </MagicReveal>
      </section>

      {/* CHAPTER III: THE ARC (CENTERED) */}
      <section className="mt-section">
        <ChapterMark
          numeral="III"
          title="The arc"
          lead={"Intern to Senior Engineer in three years, while completing a Master’s Degree. That’s the headline, not “proficient in Java, Angular, TypeScript.”"}
          centered
        />

        <div className="mt-stack max-w-3xl mx-auto">
          <ol className="relative border-l border-[var(--gold)]/30 pl-6 sm:pl-8 space-y-8">
            {timeline.map((step, i) => (
              <li key={step.id} className="relative">
                <MagicReveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.08}>
                  <span
                    className="absolute -left-[31px] sm:-left-[39px] top-1.5 block size-3 rounded-full bg-[var(--gold)] ring-4 ring-[var(--bg)]"
                    aria-hidden
                  />
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--gold)] font-semibold">
                    {step.date}
                  </p>
                  <p className="font-display text-xl text-[var(--text)] mt-0.5 font-medium">
                    {step.title}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    {step.note}
                  </p>
                </MagicReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CHAPTER IV: OFF THE CLOCK (CENTERED) */}
      <section className="mt-section">
        <ChapterMark
          numeral="IV"
          title="Off the clock"
          lead={"Hills, rivers, and the occasional barefoot walk. Home is flat; the mountains are a night’s drive."}
          centered
        />

        <MagicReveal direction="left" className="mt-stack">
          <PhotoGallery photos={photos.offTheClock} />
        </MagicReveal>
      </section>

      {/* BOTTOM RETURN BRIDGE */}
      <section className="mt-section mb-12 text-center">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Done reading?</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Return to explore production systems & skills.</p>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--bg)] px-5 py-2.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all whitespace-nowrap leading-none"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 -translate-y-[0.5px] transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to Homepage Overview</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

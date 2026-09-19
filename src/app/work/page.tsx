import type { Metadata } from "next";
import Link from "next/link";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { caseStudies, profile, timeline } from "@/content";

export const metadata: Metadata = {
  title: `Work - ${profile.name}`,
  description: "Anonymised case studies from OneIT plus independent client work. Real architecture, real stack.",
};

export default function WorkPage() {
  const independent = caseStudies.filter((c) => c.org === "independent");
  const oneit = caseStudies.filter((c) => c.org === "oneit");
  const career = timeline.filter((t) => t.kind === "role" || t.kind === "award");

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 pt-page">
      <header className="mb-stack">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">Work</p>
          <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
            Built, shipped, owned.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-muted)] leading-relaxed">
            Most of what I&apos;ve shipped lives behind OneIT customer logins. The case studies
            below are anonymised - same systems, real architecture, real stack. Numbers are kept
            off the page because the work is under NDA; the patterns and integrations are honest.
          </p>
        </MagicReveal>
      </header>

      {/* ONEIT CASE STUDIES - no pt-section: the page header above owns this
          boundary (mb-stack), because a header and its first section read as
          one opening movement. Every section after this one owns its own. */}
      <section>
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Inside OneIT · Selected work
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            {oneit.length === 1 ? "One system" : `${numberWord(oneit.length)} systems`} I&apos;ve had my hands on.
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
            Client names removed. Architecture, stack, and outcomes are real.
          </p>
        </MagicReveal>

        <CaseStudyGrid studies={oneit} />
      </section>

      {/* INDEPENDENT CLIENT WORK */}
      {independent.length > 0 && (
        <section className="pt-section">
          <MagicReveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              Featured · Independent client work
            </p>
            <h2 className="font-display text-4xl mt-3 text-[var(--text)]">Outside the day job.</h2>
          </MagicReveal>
          <CaseStudyGrid studies={independent} />
        </section>
      )}

      {/* ONEIT TIMELINE */}
      <section className="pt-section">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Day job · {career[0].date} - present
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            {profile.employer.name} - three years, three promotions.
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            {profile.title} on {profile.employer.name}&apos;s Australian engineering team. Backend,
            integrations, AI, and release cycle.
          </p>
        </MagicReveal>

        <ol className="mt-stack relative border-l border-[var(--border)] pl-8 space-y-12">
          {career.map((step, i) => (
            <MagicReveal key={step.id} delay={i * 0.1}>
              <li className="list-none relative">
                <span
                  className="timeline-dot absolute -left-[37px] top-1 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)] shadow-[0_0_10px_var(--accent)]"
                  aria-hidden
                />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] font-medium">{step.date}</p>
                <p className="font-display text-xl mt-0.5 text-[var(--text)]">{step.title}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">{step.note}</p>
              </li>
            </MagicReveal>
          ))}
        </ol>
      </section>

      <div className="mt-section text-center">
        <MagicReveal delay={0.5}>
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-8 py-4 text-sm text-[var(--bg)] font-medium transition-all hover:shadow-[0_0_30px_var(--accent-glow)]"
          >
            <span className="relative z-10">Talk to me</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            <span className="absolute inset-0 -translate-x-full bg-[var(--accent-hover)] transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </MagicReveal>
      </div>
    </article>
  );
}

function numberWord(n: number) {
  return ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][n] ?? String(n);
}



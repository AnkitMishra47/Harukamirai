import type { Metadata } from "next";
import Link from "next/link";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { caseStudies, profile, timeline } from "@/content";
import type { CaseStudy } from "@/content";

export const metadata: Metadata = {
  title: `Work - ${profile.name}`,
  description: "Anonymised case studies from OneIT plus independent client work. Real architecture, real stack.",
};

export default function WorkPage() {
  const independent = caseStudies.filter((c) => c.org === "independent");
  const oneit = caseStudies.filter((c) => c.org === "oneit");
  const career = timeline.filter((t) => t.kind === "role" || t.kind === "award");

  return (
    <article className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <header className="mb-20">
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

      {/* INDEPENDENT CLIENT WORK */}
      {independent.length > 0 && (
        <section className="mb-28">
          <MagicReveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              Featured · Independent client work
            </p>
            <h2 className="font-display text-4xl mt-3 text-[var(--text)]">Outside the day job.</h2>
          </MagicReveal>
          <div className="mt-10 space-y-12">
            {independent.map((c) => (
              <MagicReveal key={c.slug}>
                <CaseStudyCard study={c} />
              </MagicReveal>
            ))}
          </div>
        </section>
      )}

      {/* ONEIT CASE STUDIES */}
      <section className="mb-28">
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

        <div className="mt-12 space-y-12">
          {oneit.map((c, i) => (
            <MagicReveal key={c.slug} delay={i * 0.05}>
              <CaseStudyCard study={c} />
            </MagicReveal>
          ))}
        </div>
      </section>

      {/* ONEIT TIMELINE */}
      <section className="mb-24">
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

        <ol className="mt-12 relative border-l border-[var(--border)] pl-8 space-y-12">
          {career.map((step, i) => (
            <MagicReveal key={step.id} delay={i * 0.1}>
              <li className="list-none">
                <span
                  className="timeline-dot absolute -left-[5px] mt-1.5 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)] shadow-[0_0_10px_var(--accent)]"
                  aria-hidden
                />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">{step.date}</p>
                <p className="font-display text-xl mt-0.5 text-[var(--text)]">{step.title}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">{step.note}</p>
              </li>
            </MagicReveal>
          ))}
        </ol>
      </section>

      <div className="mt-24 text-center">
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

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article
      id={study.slug}
      className="group relative scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)]"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{study.kicker}</p>
      <h3 className="font-display text-2xl md:text-3xl mt-3 text-[var(--text)] leading-tight">{study.title}</h3>
      <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{study.domain}</p>

      <div className="mt-7 grid gap-7 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <Block label="Problem">
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">{study.problem}</p>
          </Block>
          <Block label="Approach">
            <ul className="mt-2 space-y-2 text-[var(--text-muted)]">
              {study.approach.map((line) => (
                <li key={line} className="leading-relaxed">
                  <span className="mr-2 text-[var(--accent)]">▹</span>
                  {line}
                </li>
              ))}
            </ul>
          </Block>
          <Block label="Result">
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">{study.result}</p>
          </Block>
        </div>

        <aside className="space-y-3 md:border-l md:border-[var(--border)] md:pl-7">
          {study.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">{m.label}</p>
              <p className="font-display text-xl mt-1 text-[var(--text)] leading-tight">{m.value}</p>
            </div>
          ))}
        </aside>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        {study.stack.map((s) => (
          <span key={s} className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
            {s}
          </span>
        ))}
        {study.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            {l.label}
            <span aria-hidden>↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">{label}</p>
      {children}
    </div>
  );
}

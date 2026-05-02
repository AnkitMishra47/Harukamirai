"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "motion/react";
import { MagicReveal } from "@/components/effects/MagicReveal";

const oneIT = [
  { year: "Aug 2022", title: "Junior SWE Intern", body: "Joined right after BCA." },
  { year: "Jan 2023", title: "Junior Software Engineer", body: "First promotion. Java + AngularJS work on the Cougar platform." },
  { year: "Oct 2023", title: "Software Engineer", body: "Owned Cougar infrastructure features, APIs, JSON/XML transports, Postgres." },
  { year: "Oct 2024", title: "Associate Senior SWE · Mid Developer of the Year 2024", body: "Stack expanded into Python/Flask/Twilio/Ionic. Award signed by MD David Barton." },
  { year: "2025", title: "Senior Software Engineer L3 · Runner-up, Employee of the Year 2025", body: "Company-wide recognition. Lead on integrations and release cycle for the AU engineering team — from Faridabad, six AEDT timezone hours away." },
];

export default function WorkPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <header className="mb-20">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
            Built, shipped, owned.
          </h1>
        </MagicReveal>
      </header>

      {/* SPRACHKRAFT ─────────────────────────── */}
      <section className="mb-24">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Featured · Client work · 2025
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            The Sprachkraft
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Language &amp; study-abroad consultancy. Multi-page Next.js
            production site, end-to-end in one day.
          </p>
        </MagicReveal>

        <div className="mt-10 grid gap-8 md:grid-cols-5">
          <MagicReveal delay={0.1} className="md:col-span-3">
            <div className="group relative h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)]">
              <h3 className="font-display text-xl text-[var(--text)] mb-3">
                What I built
              </h3>
              <ul className="space-y-3 text-[var(--text-muted)]">
                <li>• 7-page Next.js production site, App Router + TypeScript.</li>
                <li>• Bilingual content scaffolding for English / German routes.</li>
                <li>• Contact + lead-capture flow with WhatsApp deep-link CTA.</li>
                <li>• Deployed to Vercel; custom domain on day one.</li>
                <li>• Wrote the README and handed off the keys.</li>
              </ul>
            </div>
          </MagicReveal>
          <div className="md:col-span-2 space-y-6">
            <MagicReveal delay={0.2}>
              <CaseStat label="Scoping → live" value="1 day" />
            </MagicReveal>
            <MagicReveal delay={0.3}>
              <CaseStat label="Pages" value="7" />
            </MagicReveal>
            <MagicReveal delay={0.4}>
              <CaseStat label="Stack" value="Next.js · TS · Tailwind" />
            </MagicReveal>
          </div>
        </div>
      </section>

      {/* ONEIT TIMELINE ─────────────────────── */}
      <section className="mb-24">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Day job · 2022 — present
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            OneIT — three years, three promotions.
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Senior Software Engineer L3 on OneIT&apos;s Australian engineering
            team. Backend, integrations, and release cycle.
          </p>
        </MagicReveal>

        <div className="mt-12 relative border-l border-[var(--border)] pl-8 space-y-12">
          {oneIT.map((step, i) => (
            <MagicReveal key={step.year + step.title} delay={i * 0.1}>
              <li className="list-none">
                <motion.span
                  whileInView={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -left-[5px] mt-1.5 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)] shadow-[0_0_10px_var(--accent)]"
                  aria-hidden
                />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  {step.year}
                </p>
                <p className="font-display text-xl mt-0.5 text-[var(--text)]">
                  {step.title}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">
                  {step.body}
                </p>
              </li>
            </MagicReveal>
          ))}
        </div>
      </section>

      {/* OTHER PROJECTS ─────────────────────── */}
      <section>
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Also
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            Other things I&apos;ve built.
          </h2>
        </MagicReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <MagicReveal delay={0.1}>
            <ProjectCard
              title="Employee Management System"
              stack="Spring Boot · Angular · Postgres"
              body="Full CRUD with auth — REST APIs, login, role-based access. Solid Java/Angular showcase from the OneIT-era stack."
            />
          </MagicReveal>
          <MagicReveal delay={0.2}>
            <ProjectCard
              title="Lab — coming soon"
              stack="Weekend-sized"
              body="Manga tracker, coffee + commits dashboard, chess opening trainer. Pick one. Ship in two weekends."
              muted
            />
          </MagicReveal>
        </div>

        <p className="mt-12 text-sm text-[var(--text-subtle)]">
          The 2022 HTML/CSS portfolio, TextUtility, and Sudoku Solver are
          retired with thanks. They were good for what they were.
        </p>
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

function CaseStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-all hover:border-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)]">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)]">
        {label}
      </p>
      <p className="font-display text-2xl mt-1 text-[var(--text)]">{value}</p>
    </div>
  );
}

function ProjectCard({
  title,
  stack,
  body,
  muted,
}: {
  title: string;
  stack: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <article
      className={`group relative h-full rounded-2xl border p-7 transition-all ${
        muted
          ? "border-dashed border-[var(--border)] bg-transparent opacity-60"
          : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:shadow-[0_0_25px_var(--accent-glow)]"
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
        {stack}
      </p>
      <h3 className="font-display text-2xl mt-2 text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
        {title}
      </h3>
      <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{body}</p>
    </article>
  );
}

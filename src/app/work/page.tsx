import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work — Ankit Mishra",
  description:
    "OneIT timeline, Sprachkraft case study, and selected projects.",
};

const oneIT = [
  { year: "Aug 2022", title: "Junior SWE Intern", body: "Joined right after BCA." },
  { year: "Jan 2023", title: "Junior Software Engineer", body: "First promotion. Java + AngularJS work on the Cougar platform." },
  { year: "Oct 2023", title: "Software Engineer", body: "Owned Cougar infrastructure features, APIs, JSON/XML transports, Postgres." },
  { year: "Oct 2024", title: "Associate Senior SWE · Mid-Tier Developer of the Year 2024", body: "Stack expanded into Python/Flask/Twilio/Ionic. Award signed by MD David Barton." },
  { year: "2025", title: "Senior Software Engineer L3 · Employee of the Year 2025", body: "Company-wide award. Lead on integrations and release cycle for the AU engineering team — from Faridabad, six AEDT timezone hours away." },
];

export default function WorkPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <header className="mb-20">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          Work
        </p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          Built, shipped, owned.
        </h1>
      </header>

      {/* SPRACHKRAFT ─────────────────────────── */}
      <section className="mb-24">
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

        <div className="mt-10 grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8">
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
          <div className="md:col-span-2 space-y-6">
            <CaseStat label="Scoping → live" value="1 day" />
            <CaseStat label="Pages" value="7" />
            <CaseStat label="Stack" value="Next.js · TS · Tailwind" />
          </div>
        </div>
      </section>

      <div className="divider-dots my-16" aria-hidden>
        <span /><span /><span />
      </div>

      {/* ONEIT TIMELINE ─────────────────────── */}
      <section className="mb-24">
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

        <ol className="mt-12 relative border-l border-[var(--border)] pl-6 space-y-8">
          {oneIT.map((step) => (
            <li key={step.year + step.title}>
              <span
                className="absolute -left-[5px] mt-1.5 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)]"
                aria-hidden
              />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                {step.year}
              </p>
              <p className="font-display text-xl mt-0.5 text-[var(--text)]">
                {step.title}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="divider-dots my-16" aria-hidden>
        <span /><span /><span />
      </div>

      {/* OTHER PROJECTS ─────────────────────── */}
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Also
        </p>
        <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
          Other things I&apos;ve built.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ProjectCard
            title="Employee Management System"
            stack="Spring Boot · Angular · Postgres"
            body="Full CRUD with auth — REST APIs, login, role-based access. Solid Java/Angular showcase from the OneIT-era stack."
          />
          <ProjectCard
            title="Lab — coming soon"
            stack="Weekend-sized"
            body="Manga tracker, coffee + commits dashboard, chess opening trainer. Pick one. Ship in two weekends."
            muted
          />
        </div>

        <p className="mt-12 text-sm text-[var(--text-subtle)]">
          The 2022 HTML/CSS portfolio, TextUtility, and Sudoku Solver are
          retired with thanks. They were good for what they were.
        </p>
      </section>

      <div className="mt-24 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-[var(--bg)] font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          Talk to me
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function CaseStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
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
      className={`rounded-2xl border p-7 transition-colors ${
        muted
          ? "border-dashed border-[var(--border)] bg-transparent"
          : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
        {stack}
      </p>
      <h3 className="font-display text-2xl mt-2 text-[var(--text)]">
        {title}
      </h3>
      <p className="mt-3 text-[var(--text-muted)]">{body}</p>
    </article>
  );
}

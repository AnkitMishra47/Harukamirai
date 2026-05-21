"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MagicReveal } from "@/components/effects/MagicReveal";

const oneIT = [
  { year: "Aug 2022", title: "Junior SWE Intern", body: "Joined right after BCA." },
  { year: "Jan 2023", title: "Junior Software Engineer", body: "First promotion. Java + Angular work on the Cougar platform." },
  { year: "Oct 2023", title: "Software Engineer", body: "Owned Cougar infrastructure features, APIs, JSON/XML transports, Postgres." },
  { year: "Oct 2024", title: "Associate Senior SWE · Mid Developer of the Year 2024", body: "Stack expanded into Python/Flask/Twilio/Ionic. Award signed by MD David Barton." },
  { year: "2025", title: "Senior Software Engineer L3 · Runner-up, Employee of the Year 2025", body: "Company-wide recognition. Lead on integrations and release cycle for the AU engineering team — from Faridabad, six AEDT timezone hours away." },
];

type CaseStudy = {
  kicker: string;
  title: string;
  domain: string;
  problem: string;
  approach: string[];
  result: string;
  metrics: { label: string; value: string }[];
  stack: string[];
};

const cases: CaseStudy[] = [
  {
    kicker: "Multi-site platform · Industrial operations",
    title: "Hub-and-spoke CMS for a national mining-services operator",
    domain:
      "An Australian mining-services operator running independent site instances of the same Java platform across geographically distributed locations.",
    problem:
      "Each site needed to run autonomously — collecting equipment telemetry, alerts, and operational events into its own database — while feeding a central server for cross-site analytics, executive dashboards, and disaster-recovery backup.",
    approach: [
      "Java + Angular application deployed as independent site instances, each with a local PostgreSQL/TimescaleDB store for time-series equipment data.",
      "SymmetricDS hub-and-spoke replication: sites act as leaf nodes, replicating writes to a master server asynchronously with conflict resolution and staged onboarding for new sites.",
      "Ingestion pipeline for device-generated JSON payloads — alerts, telemetry samples, event history — with unit conversions, custom alert-threshold evaluation, and email notifications.",
      "Grafana dashboards over the central database for cross-site fleet analytics; periodic sync from a secondary MS SQL Server for machine metadata.",
      "RAG conversational agent on top of live metrics + a PDF manuals knowledge base (embeddings) so on-site staff can ask natural-language questions over equipment history.",
    ],
    result:
      "Sites run autonomously and survive WAN drops; replicated state catches up to the central server when connectivity returns. New-site onboarding became a staged checklist, not a one-off engineering project.",
    metrics: [
      { label: "Pattern", value: "Hub-and-spoke" },
      { label: "Data model", value: "Time-series + replication" },
      { label: "My role", value: "Backend + integrations" },
    ],
    stack: [
      "Java",
      "Angular",
      "PostgreSQL · TimescaleDB",
      "SymmetricDS",
      "Grafana",
      "Docker",
      "RAG · Embeddings",
      "Python",
    ],
  },
  {
    kicker: "Compliance LMS · Australian RTO sector",
    title: "End-to-end LMS for a national Registered Training Organisation",
    domain:
      "A national Australian RTO needing a single platform to author courses, deliver them online, issue regulator-recognised certificates, run their billing, and stay compliant with national identifier rules.",
    problem:
      "Replace a fragmented stack (separate course, finance, and certificate tools) with one Angular + Java platform that owned the full learner journey — from enrolment and payment through to government-issued credentialing.",
    approach: [
      "Course authoring + delivery surface: lessons, assessments, learner progress, certificate generation on completion.",
      "Mailouts / lifecycle email: enrolment confirmation, due-date reminders, expiry warnings, certificate dispatch.",
      "Finance module — invoice generation, reconciliation, refunds — with two-way Xero accounting integration so finance staff never re-key a transaction.",
      "Eway payment gateway integration for card-on-file enrolments and recurring training subscriptions.",
      "USI (Unique Student Identifier) integration with the Australian government registry for compliant credential issuance — a hard regulatory requirement for any RTO.",
    ],
    result:
      "One platform owns the full learner journey — enrolment, payment, delivery, credentialing — so finance never re-keys a transaction and USIs are verified inline at enrolment.",
    metrics: [
      { label: "Compliance", value: "USI · regulator-recognised" },
      { label: "Integrations", value: "Xero · Eway · USI" },
      { label: "Surface", value: "Author → enrol → certify" },
    ],
    stack: [
      "Angular (modern)",
      "Java · Spring",
      "PostgreSQL",
      "Xero API",
      "Eway",
      "USI Registry API",
      "PrimeNG",
      "PDF generation",
    ],
  },
  {
    kicker: "AI-first improvements · Platform-wide",
    title: "Bringing LLMs into the production stack, end-to-end",
    domain:
      "Cross-cutting AI work spanning OneIT's product family — moving from \"we use ChatGPT to draft\" to AI features running inside the products customers pay for.",
    problem:
      "Make LLM features cheap, accurate, and testable enough to ship to production: not a demo, not a side-tool — features that real users hit.",
    approach: [
      "RAG retrieval over operational corpora — equipment manuals, internal documentation, historical tickets — chunked, embedded, and served behind product-specific assistants.",
      "OCR pipeline for ingesting paper-trail documents (forms, certificates, invoice PDFs) into structured, queryable records.",
      "MCP-style tool layer giving the LLM controlled access to live product APIs — read metrics, draft updates, surface evidence — instead of free-form generation.",
      "DPO (Direct Preference Optimisation) fine-tuning on collected agent responses so the assistant matches the company's voice and business rules without prompt-bloat.",
      "AI-assisted test automation — generated UI/API tests, regression checks, and assertion synthesis layered onto the existing release pipeline.",
    ],
    result:
      "LLM features that live inside the products users pay for — not a side-tool. RAG, OCR, MCP-style tool access, and DPO-tuned responses, all running against real product APIs.",
    metrics: [
      { label: "Patterns", value: "RAG · MCP · DPO" },
      { label: "Stage", value: "In production" },
      { label: "Scope", value: "Cross-product" },
    ],
    stack: [
      "Python",
      "RAG · Vector DB",
      "OCR",
      "MCP tooling",
      "DPO fine-tuning",
      "Test automation",
      "Java integration",
    ],
  },
  {
    kicker: "Interactive canvas · Construction takeoff",
    title: "Drawing-based takeoff, measure sheets & BOQ on Paper.js",
    domain:
      "An estimating surface for construction / quantity-surveying workflows — estimators mark up plan drawings to extract quantities into measure sheets, SOR (Schedule of Rates), and BOQ (Bill of Quantities) outputs.",
    problem:
      "Takeoffs were being done by hand on PDFs and re-keyed into spreadsheets, with no audit trail back to the drawing. The team needed a canvas where lines, areas, and count markers trace directly on the plan and flow into a typed measure sheet that rolls up into SOR / BOQ totals.",
    approach: [
      "Paper.js canvas embedded in an Angular 19 component, with linear-measure, polygon-area, and count-marker tools each tied to a rate-coded item in the catalogue.",
      "Drawing-scale calibration and multi-page plan support so measurements come out in real-world units, not pixels.",
      "Live measure sheet: every shape on the canvas writes back to a typed measurement row that rolls into SOR and BOQ totals — no re-keying into Excel.",
      "Serialisable canvas state so a takeoff can be reopened, audited, and revised; state-bridged into the wider Angular form/data model without DOM leaks.",
    ],
    result:
      "Replaced the manual drawing → spreadsheet handoff with a single auditable surface. Included here as a clean example of bringing a non-React, non-DOM rendering library into a modern Angular app and modelling a real quantitative workflow on top of it.",
    metrics: [
      { label: "Surface", value: "Paper.js · Angular 19" },
      { label: "Domain", value: "Takeoff · SOR · BOQ" },
      { label: "Output", value: "Measure sheets" },
    ],
    stack: ["Angular 19", "Paper.js", "TypeScript", "PrimeNG", "PDF rendering"],
  },
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
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-muted)] leading-relaxed">
            Most of what I&apos;ve shipped lives behind OneIT customer logins.
            The case studies below are anonymised — same systems, real
            architecture, real stack. Numbers are kept off the page because the
            work is under NDA; the patterns and integrations are honest.
          </p>
        </MagicReveal>
      </header>

      {/* SPRACHKRAFT ─────────────────────────── */}
      <section className="mb-28">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Featured · Independent client work · 2025
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            The Sprachkraft
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Language &amp; study-abroad consultancy. Multi-page Next.js
            production site, end-to-end in one day.
          </p>
          <a
            href="https://thesprachkraft.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            thesprachkraft.com
            <span aria-hidden>↗</span>
          </a>
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

      {/* ONEIT CASE STUDIES ─────────────────────── */}
      <section className="mb-28">
        <MagicReveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Inside OneIT · Selected work
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            Four systems I&apos;ve had my hands on.
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
            Client names removed. Architecture, stack, and outcomes are real.
          </p>
        </MagicReveal>

        <div className="mt-12 space-y-12">
          {cases.map((c, i) => (
            <MagicReveal key={c.title} delay={i * 0.05}>
              <CaseStudyCard study={c} />
            </MagicReveal>
          ))}
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
            team. Backend, integrations, AI, and release cycle.
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
            Outside OneIT
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            Side things I&apos;ve built.
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

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)]">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {study.kicker}
      </p>
      <h3 className="font-display text-2xl md:text-3xl mt-3 text-[var(--text)] leading-tight">
        {study.title}
      </h3>
      <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
        {study.domain}
      </p>

      <div className="mt-7 grid gap-7 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              Problem
            </p>
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">
              {study.problem}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              Approach
            </p>
            <ul className="mt-2 space-y-2 text-[var(--text-muted)]">
              {study.approach.map((line) => (
                <li key={line} className="leading-relaxed">
                  <span className="mr-2 text-[var(--accent)]">▹</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              Result
            </p>
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">
              {study.result}
            </p>
          </div>
        </div>

        <aside className="space-y-3 md:border-l md:border-[var(--border)] md:pl-7">
          {study.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                {m.label}
              </p>
              <p className="font-display text-xl mt-1 text-[var(--text)] leading-tight">
                {m.value}
              </p>
            </div>
          ))}
        </aside>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {study.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-muted)]"
          >
            {s}
          </span>
        ))}
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

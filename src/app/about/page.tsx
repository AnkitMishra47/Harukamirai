import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Ankit Mishra",
  description:
    "From BCA to Senior L3 in three years, with a Master's earned in the cracks between deploys.",
};

const arc = [
  { year: "2019 – 2022", title: "BCA, GGSIPU (USMS)", note: "Graduated with 86%. First portfolio shipped in 2022." },
  { year: "Aug 2022", title: "Junior SWE Intern, OneIT", note: "Joined right after graduation." },
  { year: "Sep 2022", title: "MCA begins, Chandigarh University", note: "Two-year Master's, started while working full-time." },
  { year: "Jan 2023", title: "Junior Software Engineer", note: "First step up. Java, Angular." },
  { year: "Oct 2023", title: "Software Engineer", note: "Owned Cougar infrastructure work, APIs, JSON/XML, Postgres." },
  { year: "Sep 2024", title: "MCA completed", note: "While shipping production code." },
  { year: "Oct 2024", title: "Associate Senior + Mid Developer of the Year 2024", note: "Recognized by MD David Barton. Stack expanded into Python/Flask/Twilio/Ionic." },
  { year: "2025", title: "Senior Software Engineer L3 + Runner-up Employee of the Year 2025", note: "Company-wide recognition, across all engineering tiers." },
  { year: "Now", title: "harukamirai.engineer", note: "You're here." },
];

const testimonials = [
  {
    quote:
      "He takes full ownership of his work and is a dedicated team member, ensuring tasks are done right, even when they're complex. He makes himself readily available whenever we need support, which makes collaboration much easier and more effective.",
    attribution: "Peer nomination · OneIT 2025",
  },
  {
    quote:
      "His build quality is consistently very high — it&apos;s difficult to find issues during testing, which gives me greater confidence on client calls. Whenever I have questions he doesn&apos;t just explain the answer, he encourages me to explore and find it independently. My understanding of the overall system improves after every discussion.",
    attribution: "Peer nomination · OneIT 2025",
  },
  {
    quote:
      "Outstanding contribution. He took full ownership and spent extra time, even late nights, to ensure the functionality worked exactly as required. Instead of rejecting good-to-have requests, he patiently worked through them — significantly improving the feature.",
    attribution: "Peer nomination · OneIT 2025",
  },
];

const awards = [
  {
    year: "2025",
    title: "Runner-up — Employee of the Year",
    body: "Company-wide recognition at OneIT, across all engineering tiers. Signed by Managing Director David Barton.",
  },
  {
    year: "2024",
    title: "Mid Developer of the Year",
    body: "Recognised for contribution across the OneIT engineering team in 2024. Signed by Managing Director David Barton.",
  },
];

const skills = {
  daily: [
    "Java + Spring Boot",
    "Angular (modern)",
    "TypeScript",
    "PostgreSQL",
    "REST APIs · JSON/XML",
    "Jenkins · SmartGit · Git",
    "Linux · bash",
  ],
  recent: [
    "Python + Flask",
    "Twilio (telephony / SMS)",
    "Ionic Framework",
    "Docker",
    "Xero · Eway integrations",
    "PrimeNG · Paper.js",
  ],
  growing: ["Kubernetes", "Next.js", "RAG · MCP tooling", "DPO fine-tuning"],
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          About
        </p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          The grind, plainspoken.
        </h1>
      </header>

      {/* PORTRAIT + BIO ─────────────────────────── */}
      <div className="grid gap-12 md:grid-cols-[1fr_280px] md:gap-14 items-start">
        <div className="prose-lg space-y-6 text-lg leading-relaxed text-[var(--text-muted)] order-2 md:order-1">
          <p>
            I&apos;m Ankit, a software engineer based in Faridabad. I work
            full-time at <strong className="text-[var(--text)]">OneIT</strong> — an
            Australian software firm — where I&apos;ve moved from intern to{" "}
            <strong className="text-[var(--text)]">Senior Software Engineer L3</strong>{" "}
            over three years, mostly on backend systems (Java, Spring Boot,
            Postgres) and increasingly on integrations (Twilio, Flask, Ionic) and
            AI tooling (RAG, OCR, MCP, DPO fine-tuning). In 2024 I was named{" "}
            <strong className="text-[var(--text)]">Mid Developer of the Year</strong>.
            In 2025, I placed{" "}
            <strong className="text-[var(--text)]">Runner-up for Employee of the Year</strong> —
            company-wide, across all engineering tiers.
          </p>
          <p>
            I picked up an MCA from Chandigarh University while doing this. The
            two years overlapped completely with my full-time work, which means
            I&apos;ve debugged production at 11pm on a Tuesday before a 9am exam
            more times than I&apos;d like to admit. I&apos;m not sure I&apos;d
            recommend it — but it taught me how to ship.
          </p>
          <p>
            Outside work, I like quiet things — chess, manga, long-format anime,
            the kind of coffee that takes ten minutes to make. I read more than I
            post. The five-leaf clover at the top of this page is not a logo;
            it&apos;s a switch. Click it.
          </p>
          <p>
            If you want to talk about backend architecture, telephony
            integrations, AI in production, the <em>Black Clover</em> anime
            adaptation pacing problem, or freelance work —{" "}
            <a
              href="mailto:ankitm17.2001@gmail.com"
              className="text-[var(--text)] underline decoration-[var(--accent)] decoration-1 underline-offset-4 hover:text-[var(--accent)]"
            >
              ankitm17.2001@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="order-1 md:order-2 md:sticky md:top-28">
          <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image
              src="/photos/portrait.jpeg"
              alt="Ankit Mishra"
              fill
              sizes="(min-width: 768px) 280px, 80vw"
              className="object-cover grayscale-[0.15] transition-all duration-500 hover:grayscale-0"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                Faridabad · IST
              </p>
              <p className="font-display text-sm text-white/95 mt-0.5">
                Working AEDT hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AWARDS ─────────────────────────────────── */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">
          Recognition
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Two consecutive years of named recognition at OneIT — both signed
          by Managing Director David Barton.
        </p>

        <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start">
          <div className="relative aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image
              src="/photos/award-trophy.jpeg"
              alt="Ankit Mishra holding the OneIT Runner-up Employee of the Year 2025 trophy"
              fill
              sizes="(min-width: 768px) 260px, 80vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5">
            {awards.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition-colors hover:border-[var(--accent)]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                  {a.year}
                </p>
                <p className="font-display text-xl mt-2 text-[var(--text)]">
                  {a.title}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PEER TESTIMONIALS ──────────────────── */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">
          From peers
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Excerpts from internal peer nominations submitted at OneIT in 2025.
          Names removed; wording is theirs.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.attribution + t.quote.slice(0, 24)}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition-colors hover:border-[var(--accent)]"
            >
              <span
                className="absolute -top-3 left-5 font-display text-5xl leading-none text-[var(--accent)]"
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote
                className="text-[var(--text-muted)] leading-relaxed text-sm pt-2"
                dangerouslySetInnerHTML={{ __html: t.quote }}
              />
              <figcaption className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                — {t.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ARC ─────────────────────────────────── */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">
          The arc
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Three promotions in three years, while completing a Master&apos;s.
          That&apos;s the headline — not &ldquo;proficient in Java, Angular,
          TypeScript.&rdquo;
        </p>

        <ol className="relative border-l border-[var(--border)] pl-6 space-y-7">
          {arc.map((step) => (
            <li key={step.title}>
              <span
                className="absolute -left-[5px] mt-1.5 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)]"
                aria-hidden
              />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                {step.year}
              </p>
              <p className="font-display text-xl text-[var(--text)] mt-0.5">
                {step.title}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {step.note}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* SKILLS ────────────────────────────────── */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">
          Stack, segmented for honesty
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          No wall of logos. Group by depth.
        </p>

        <SkillBlock title="Daily drivers" subtitle="The ones I&apos;d defend in a code review." items={skills.daily} />
        <SkillBlock title="Recently in production" subtitle="Last 12 months." items={skills.recent} />
        <SkillBlock title="Tinkering · want to grow" subtitle="Weekends and side projects." items={skills.growing} />
      </section>

      {/* SLOGAN BANNER ─────────────────────────── */}
      <section className="mt-28 -mx-6">
        <div className="relative h-[420px] overflow-hidden md:rounded-3xl">
          <Image
            src="/photos/open-road.jpeg"
            alt="On an open road"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/75">
                Personal motto
              </p>
              <p className="font-display text-4xl md:text-5xl text-white mt-3 leading-tight">
                &ldquo;Push past my limit.&rdquo;
              </p>
              <p className="font-jp text-base text-white/70 mt-2">
                限界を超える
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function SkillBlock({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="mb-10">
      <p className="font-display text-xl text-[var(--text)]">{title}</p>
      <p
        className="text-sm text-[var(--text-subtle)] mb-4"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li
            key={s}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-sm text-[var(--text-muted)]"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

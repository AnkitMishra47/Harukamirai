import type { Metadata } from "next";

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
  { year: "Oct 2024", title: "Associate Senior + Mid-Tier Developer of the Year 2024", note: "Recognized by MD David Barton. Stack expanded into Python/Flask/Twilio/Ionic." },
  { year: "2025", title: "Senior Software Engineer L3 + Employee of the Year 2025", note: "Company-wide award, across all engineering tiers." },
  { year: "Now", title: "harukamirai.engineer", note: "You're here." },
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
  ],
  growing: ["Kubernetes", "Next.js", "LLM tooling / agents"],
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          About
        </p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          The grind, plainspoken.
        </h1>
      </header>

      <div className="prose-lg space-y-6 text-lg leading-relaxed text-[var(--text-muted)]">
        <p>
          I&apos;m Ankit, a software engineer based in Faridabad. I work
          full-time at <strong className="text-[var(--text)]">OneIT</strong> — an
          Australian software firm — where I&apos;ve moved from intern to{" "}
          <strong className="text-[var(--text)]">Senior Software Engineer L3</strong>{" "}
          over three years, mostly on backend systems (Java, Spring Boot,
          Postgres) and increasingly on integrations (Twilio, Flask, Ionic).
          In 2024 I was named Mid-Tier Developer of the Year. In 2025, I was
          named <strong className="text-[var(--text)]">Employee of the Year</strong> —
          company-wide, not tier-restricted.
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
          integrations, the <em>Black Clover</em> anime adaptation pacing
          problem, or freelance work —{" "}
          <a
            href="mailto:ankitm17.2001@gmail.com"
            className="text-[var(--text)] underline decoration-[var(--accent)] decoration-1 underline-offset-4 hover:text-[var(--accent)]"
          >
            ankitm17.2001@gmail.com
          </a>
          .
        </p>
      </div>

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

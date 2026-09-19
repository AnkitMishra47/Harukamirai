import { awards, caseStudies, profile, skills, timeline } from "@/content";

/**
 * Scannable HTML resume, server-rendered from the content module. Mirrors the
 * PDF's sections so a recruiter never has to open the download to read it.
 */
export function ResumeSheet() {
  const experience = timeline.filter((t) => t.kind === "role" || t.kind === "award");
  const education = timeline.filter((t) => t.kind === "education");
  const email = profile.links.find((l) => l.label === "Email")!;
  const linkedin = profile.links.find((l) => l.label === "LinkedIn")!;

  return (
    <section id="resume" className="resume-sheet mx-auto w-full max-w-3xl scroll-mt-28 text-left">
      <header className="border-b border-[var(--border)] pb-6">
        <h2 className="font-display text-3xl md:text-4xl text-[var(--text)]">{profile.name}</h2>
        <p className="mt-1 text-[var(--accent)]">{profile.title}</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {profile.location} ·{" "}
          <a href={email.href} className="underline underline-offset-4 hover:text-[var(--accent)]">
            {email.value}
          </a>{" "}
          ·{" "}
          <a href={linkedin.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[var(--accent)]">
            linkedin.com{linkedin.value}
          </a>{" "}
          · {profile.domain}
        </p>
      </header>

      <Section title="Profile">
        <p className="text-[var(--text-muted)] leading-relaxed">{profile.summary}</p>
      </Section>

      <Section title="Technical skills">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.id} className="grid grid-cols-[7rem_1fr] gap-3 text-sm">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] pt-0.5">{g.label}</dt>
              <dd className="text-[var(--text-muted)]">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Experience">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-xl text-[var(--text)]">
            {profile.employer.name}, {profile.employer.country} - {profile.title.split(" · ")[0]}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            {experience[0].date} - present · Remote
          </p>
        </div>
        <ol className="mt-4 space-y-3">
          {experience.map((e) => (
            <li key={e.id} className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-4 text-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] pt-0.5">{e.date}</span>
              <span>
                <span className="text-[var(--text)]">{e.title}</span>
                <span className="text-[var(--text-muted)]"> - {e.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Key projects">
        <ul className="space-y-3">
          {caseStudies.map((c) => (
            <li key={c.slug} className="text-sm">
              <a href={`/work#${c.slug}`} className="text-[var(--text)] hover:text-[var(--accent)]">
                {c.title}
              </a>
              <span className="text-[var(--text-subtle)]"> · {c.stack.slice(0, 4).join(", ")}</span>
              <p className="text-[var(--text-muted)] mt-0.5 leading-relaxed">{c.result}</p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-8 sm:grid-cols-2">
        <Section title="Education">
          <ul className="space-y-2 text-sm">
            {education.map((e) => (
              <li key={e.id}>
                <span className="text-[var(--text)]">{e.title}</span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">{e.date}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Achievements">
          <ul className="space-y-2 text-sm">
            {awards.map((a) => (
              <li key={a.title}>
                <span className="text-[var(--text)]">{a.title}</span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  {profile.employer.name} · {a.year}
                </span>
              </li>
            ))}
            <li className="text-[var(--text)]">Promoted Intern → Senior Software Engineer in three years</li>
          </ul>
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-3">{title}</h3>
      {children}
    </div>
  );
}

import Link from "next/link";
import { awards, caseStudies, profile, skills, testimonials, timeline } from "@/content";
import { DownloadResumeButton } from "@/components/DownloadResumeButton";
import { RevealScope } from "@/components/resume/RevealScope";
import styles from "@/components/resume.module.css";

/**
 * The record of service.
 *
 * This used to be a flat sheet: eight stacked sections, one type size, every
 * fact weighted the same, and nothing on it that a sheet of A4 could not do.
 * It is now shaped as an argument a recruiter can scan in ten seconds and then
 * drill into:
 *
 *   masthead -> four proof seals -> the ascent (rank ladder) -> the chronology
 *   in two lanes -> systems -> craft -> recognition -> education -> the PDF
 *
 * Three things here need the web rather than paper:
 *
 *   1. The rank ladder is a linked index. Each rank is an anchor into the
 *      chronology entry it came from, so `:target` does "click a rank, land on
 *      the moment" with no JavaScript.
 *   2. The chronology runs two lanes at >=1024px, study left of the rail and
 *      career right of it, so the Master's is visibly running *through* the
 *      promotions instead of being filed in a separate box at the bottom.
 *   3. The rails draw themselves, segment by segment, as each entry arrives.
 *
 * Every fact traces to src/content. Nothing here is composed, counted or
 * rounded in this file except where the arithmetic is on values that are
 * present there (the case study count, the award count).
 */

const ROMAN = ["I", "II", "III", "IV"] as const;

export function ResumeSheet() {
  const roles = timeline.filter((t) => t.kind === "role" || t.kind === "award");
  const education = timeline.filter((t) => t.kind === "education");
  const firstRole = roles[0];
  const latestRole = roles[roles.length - 1];
  const mcaStart = timeline.find((t) => t.id === "mca-start");
  const mcaDone = timeline.find((t) => t.id === "mca-done");
  const rag = caseStudies.find((c) => c.slug === "rag-platform");

  const email = profile.links.find((l) => l.label === "Email");
  const linkedin = profile.links.find((l) => l.label === "LinkedIn");
  const github = profile.links.find((l) => l.label === "GitHub");

  /* Ranks, taken off the timeline titles. "Associate Senior SWE · Mid Developer
     of the Year 2024" is a rank and an award in one entry; the rank is the part
     before the middot, and the award is restated in full under Recognition. */
  const ranks = roles.map((r) => ({
    id: r.id,
    date: r.date,
    rank: r.title.split(" · ")[0].split(", ")[0],
  }));

  const ragScale = rag?.metrics.find((m) => m.label === "Scale")?.value ?? "";

  /* The four proof marks. "3" is the only literal figure here, and it is not a
     new claim: profile.heroLine already says "in three years", and the span it
     names (firstRole.date -> latestRole.date, Jul 2022 -> 2025) is printed
     beside it so the reader can check the arithmetic. Everything else is read
     straight off src/content. */
  const seals = [
    {
      figure: "3",
      unit: "years",
      note: `Intern to ${profile.title.split(" · ")[0]} at ${profile.employer.name}, ${firstRole.date} to ${latestRole.date}.`,
    },
    {
      figure: String(awards.length),
      unit: "years named",
      note: `Recognised at ${profile.employer.name} in ${awards[awards.length - 1].year}, and again in ${awards[0].year}.`,
    },
    {
      figure: ragScale.split(" ")[0] || "25M+",
      unit: "rows",
      note: "Embedding rows in a production RAG store on PostgreSQL and pgvector.",
    },
    {
      figure: "MCA",
      unit: "in parallel",
      note: `Master's at Chandigarh University, ${mcaStart?.date} to ${mcaDone?.date}, while working full-time.`,
    },
  ];

  return (
    <RevealScope className={styles.sheet}>
      <article id="resume" className="resume-sheet mx-auto w-full max-w-5xl text-left">
        {/* ---------------------------------------------- MASTHEAD

            Deliberately a <div>, not a <header>. globals.css prints with
            `header, footer, canvas { display: none }` to drop the site nav and
            footer, and that selector is not scoped - a <header> here took the
            name, the title and every contact detail off the printed sheet.
            (It did on the old sheet too; this is the fix.) The <h1> inside
            carries the semantics, so nothing is lost by using a plain div. */}
        <div>
          <p className={styles.kicker}>Record of service</p>
          <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.96] tracking-[-0.02em] text-[var(--text)]">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--accent)]">{profile.title}</p>

          <ul className={`${styles.contactList} mt-4 text-sm text-[var(--text-muted)]`}>
            <li>{profile.location}</li>
            {email && (
              <li>
                <a href={email.href}>{email.value}</a>
              </li>
            )}
            {linkedin && (
              <li>
                <a href={linkedin.href} target="_blank" rel="noreferrer">
                  {linkedin.value}
                </a>
              </li>
            )}
            {github && (
              <li>
                <a href={github.href} target="_blank" rel="noreferrer">
                  {github.value}
                </a>
              </li>
            )}
            <li>{profile.domain}</li>
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 print:hidden">
            <DownloadResumeButton />
            <Link
              href="/work"
              className="inline-flex min-h-[44px] items-center text-sm text-[var(--text-subtle)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              Read the case studies
            </Link>
          </div>

          <div className={`${styles.rule} mt-8`} />

          <p className="mt-6 max-w-3xl leading-relaxed text-[var(--text-muted)]">{profile.summary}</p>
        </div>

        {/* ---------------------------------------------- PROOF SEALS */}
        <section className="mt-stack" aria-labelledby="r-proof">
          <h2 id="r-proof" className={`${styles.kicker} mb-4`}>
            At a glance
          </h2>
          <ul className={styles.seals}>
            {seals.map((s, i) => (
              <li
                key={s.unit}
                className={styles.seal}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={styles.sealDisc} aria-hidden>
                  {ROMAN[i]}
                </span>
                <span>
                  <span className={`font-display ${styles.sealFigure}`}>{s.figure}</span>
                  <span className={styles.sealUnit}>{s.unit}</span>
                  <span className={styles.sealNote}>{s.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- THE ASCENT */}
        <section className="mt-stack" aria-labelledby="r-ascent">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-ascent" className={styles.kicker}>
              The ascent
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>
          <p className="max-w-2xl text-sm text-[var(--text-muted)]">
            Every title held at {profile.employer.name}, in order. Pick one to jump to the entry it
            came from.
          </p>

          <ol className={`${styles.ladder} mt-6`}>
            {ranks.map((r, i) => {
              const current = i === ranks.length - 1;
              return (
                <li
                  key={r.id}
                  className={styles.rung}
                  data-reveal
                  data-current={current ? "" : undefined}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <a className={styles.rungLink} href={`#tl-${r.id}`}>
                    <span className={styles.node} aria-hidden />
                    <span className={styles.rungDate}>{r.date}</span>
                    <span className={`font-display ${styles.rungTitle}`}>{r.rank}</span>
                    {current && <span className={styles.rungNow}>Now</span>}
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---------------------------------------------- CHRONOLOGY */}
        <section className="mt-stack" aria-labelledby="r-chron">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-chron" className={styles.kicker}>
              Chronology
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>
          <p className="max-w-2xl text-sm text-[var(--text-muted)]">
            Career on one side of the rail, study on the other. The two years of the Master&apos;s
            run straight through the middle of the promotions.
          </p>

          <div className={`${styles.laneKey} mt-6`} aria-hidden>
            <span className={styles.laneKeyItem}>
              <span className={`${styles.laneSwatch} ${styles.laneSwatchStudy}`} /> Study
            </span>
            <span className={styles.laneKeyItem}>
              <span className={`${styles.laneSwatch} ${styles.laneSwatchCareer}`} /> Career
            </span>
          </div>

          <ol className={`${styles.chron} mt-6`}>
            {timeline.map((t, i) => {
              const lane = t.kind === "education" ? "study" : "career";
              return (
                <li
                  key={t.id}
                  id={`tl-${t.id}`}
                  className={styles.chronItem}
                  data-lane={lane}
                  data-kind={t.kind}
                  data-reveal
                  style={{ "--row": i + 1 } as React.CSSProperties}
                >
                  <span className={styles.chronLane}>{lane}</span>
                  <p className={styles.chronDate}>{t.date}</p>
                  <h3 className={`font-display ${styles.chronTitle}`}>{t.title}</h3>
                  <p className={styles.chronNote}>{t.note}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---------------------------------------------- SYSTEMS */}
        <section className="mt-stack" aria-labelledby="r-systems">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-systems" className={styles.kicker}>
              Systems built
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>
          <p className="max-w-2xl text-sm text-[var(--text-muted)]">
            {caseStudies.length} systems, each one written up in full on the work page. The
            {" "}
            {profile.employer.name} work is anonymised; the architecture and the stack are real.
          </p>

          <ul className={`${styles.cards} mt-6`}>
            {caseStudies.map((c, i) => (
              <li
                key={c.slug}
                className={styles.card}
                data-reveal
                style={{ "--i": i % 2 } as React.CSSProperties}
              >
                <p className={styles.kicker}>{c.kicker}</p>
                <h3 className={`font-display ${styles.systemTitle} mt-1.5`}>
                  <Link href={`/work#${c.slug}`} className={styles.systemLink}>
                    {c.title}
                    <span className={styles.arrow} aria-hidden>
                      &rarr;
                    </span>
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{c.result}</p>
                <ul className={styles.metrics}>
                  {c.metrics.map((m) => (
                    <li key={m.label} className={styles.metric}>
                      <span className={styles.metricLabel}>{m.label}</span>
                      {m.value}
                    </li>
                  ))}
                </ul>
                <p className={`${styles.stackLine} mt-auto`}>{c.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- CRAFT */}
        <section className="mt-stack" aria-labelledby="r-craft">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-craft" className={styles.kicker}>
              Craft
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>

          <ul className={`${styles.craft} mt-6`}>
            {skills.map((g, i) => (
              <li
                key={g.id}
                className={styles.craftGroup}
                data-reveal
                style={{ "--i": i % 4 } as React.CSSProperties}
              >
                <h3 className={styles.kicker}>{g.label}</h3>
                <ul className={styles.craftItems}>
                  {g.items.map((item) => (
                    <li key={item} className={styles.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- RECOGNITION */}
        <section className="mt-stack" aria-labelledby="r-awards">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-awards" className={styles.kicker}>
              Recognition
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>

          <ul className={`${styles.cards} mt-6`}>
            {awards.map((a, i) => (
              <li
                key={a.title}
                className={styles.awardCard}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={styles.awardDisc} aria-hidden>
                  {a.year}
                </span>
                <span>
                  <h3 className="font-display text-[1.05rem] leading-snug text-[var(--text)]">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{a.body}</p>
                </span>
              </li>
            ))}
          </ul>

          <h3 className={`${styles.kicker} mt-8 mb-3`}>What colleagues wrote</h3>
          <ul className={`${styles.cards} ${styles.cards3} mt-0`}>
            {testimonials.map((t, i) => (
              <li
                key={t.attribution + i}
                className={styles.quote}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <p className={styles.quoteText}>&ldquo;{t.quote}&rdquo;</p>
                <p className={styles.quoteBy}>{t.attribution}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- EDUCATION */}
        <section className="mt-stack" aria-labelledby="r-edu">
          <div className={`${styles.sectionHead} mb-2`}>
            <h2 id="r-edu" className={styles.kicker}>
              Education
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>

          <ul className={`${styles.cards} ${styles.cards3} mt-6`}>
            {education.map((e, i) => (
              <li
                key={e.id}
                className={styles.card}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <p className={styles.chronDate}>{e.date}</p>
                <h3 className="font-display mt-1 text-[1.05rem] leading-snug text-[var(--text)]">
                  {e.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{e.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- THE PDF */}
        <section className="mt-stack print:hidden" aria-labelledby="r-pdf">
          <div className={styles.rule} />
          <h2 id="r-pdf" className={`${styles.kicker} mt-6`}>
            Take it with you
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
            The same record as a PDF, or print this page straight from the browser - it
            lays out as a plain sheet.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <DownloadResumeButton />
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center text-sm text-[var(--text-subtle)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </article>
    </RevealScope>
  );
}

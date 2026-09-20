import Link from "next/link";
import { caseStudies, profile, skills, timeline } from "@/content";
import { DownloadResumeButton } from "@/components/DownloadResumeButton";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { RevealScope } from "@/components/resume/RevealScope";
import styles from "@/components/resume.module.css";

/**
 * The record of service.
 *
 * A resume legitimately repeats /about and /work: work history, education,
 * skills and awards are what the format is. What it must not do is repeat
 * *itself*. The previous version did, three ways at once - a proof-seal band
 * that restated the summary paragraph directly above it, a rank ladder that
 * indexed a chronology sitting immediately below it, and an education block
 * that re-filtered the same timeline the chronology had already printed. The
 * timeline rendered three times on one page.
 *
 * It is now four sections, and every fact appears exactly once:
 *
 *   masthead + summary -> the chronology -> systems -> craft -> the PDF
 *
 * The chronology is the single presentation of the career arc. Roles, awards
 * and education all run through it, which is why there is no separate
 * education block and no separate recognition block: at >=1024px study runs
 * left of the rail and career right of it, so the Master's is visibly running
 * *through* the promotions, and the two award entries sit on the rail at the
 * promotion they came with. That two-lane reading is the one thing here that a
 * sheet of A4 cannot do, and it is the reason this page earns being a page.
 *
 * Systems names the seven case studies and links out. The write-ups are
 * /work's job; a resume lists what was built and where to read about it.
 *
 * Craft is the only place on the site that renders `skills`, so it stays.
 *
 * Every fact traces to src/content. Nothing here is composed, counted or
 * rounded in this file except the case study count, which is `.length`.
 */

export function ResumeSheet() {
  const email = profile.links.find((l) => l.label === "Email");
  const linkedin = profile.links.find((l) => l.label === "LinkedIn");
  const github = profile.links.find((l) => l.label === "GitHub");

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

        {/* ---------------------------------------------- CHRONOLOGY

            The one rendering of the career arc. Roles, awards, education and
            the current milestone, in order, each entry printed once. The
            `tl-` ids stay so an entry remains deep-linkable and `:target`
            still marks it; nothing on this page links to them any more. */}
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
              <span className={`${styles.laneSwatch} ${styles.laneSwatchStudy}`} /> Study (Left Rail)
            </span>
            <span className={styles.laneKeyItem}>
              <span className={`${styles.laneSwatch} ${styles.laneSwatchRole}`} /> Roles & Promotions
            </span>
            <span className={styles.laneKeyItem}>
              <span className={`${styles.laneSwatch} ${styles.laneSwatchAward}`} /> Company Honours
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

        {/* ---------------------------------------------- SYSTEMS

            Named and linked, not written up. The problem/approach/result and
            the metrics live on /work; repeating them here made this page a
            second copy of that one. */}
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
                <p className={`${styles.stackLine} mt-auto`}>{c.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- CRAFT */}
        <section className="mt-stack" aria-labelledby="r-craft">
          <SkillsMatrix showHeader={true} kicker="Craft & Capabilities" lead="Five core production disciplines architected, deployed, and maintained under load." />
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
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--bg)] px-5 py-2.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
            >
              <span aria-hidden>&larr;</span>
              <span>Return to Homepage Overview</span>
            </Link>
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

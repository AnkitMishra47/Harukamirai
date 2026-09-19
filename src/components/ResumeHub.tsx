"use client";

import Link from "next/link";
import { profile } from "@/content";
import { DownloadResumeButton } from "@/components/DownloadResumeButton";
import styles from "@/components/resume-hub.module.css";

/**
 * The resume, as a hub rather than a record.
 *
 * The page used to restate the site. The chronology was /about's arc printed a
 * second time, the systems block was /work's case studies with the write-ups
 * taken out, and the craft grid was the only thing on it that appeared nowhere
 * else. A recruiter reading top to bottom read the same career three times and
 * then downloaded the PDF, which is what they came for.
 *
 * So there are now three things on the page: the name, the PDF, and where the
 * rest of it lives. Nothing here restates a destination; each panel carries one
 * line of orientation and hands off.
 *
 * WHY THESE FOUR. Work, About and Contact are the site's own nav, minus Resume
 * itself - they are the three pages that hold the material a resume would
 * summarise. The storyline earns the fourth slot on a different argument: it is
 * the one destination on the site that is NOT a page, so it is the one thing a
 * visitor can only reach if something offers it. It sits last, and it is the
 * only panel that is a <button>, because it opens an overlay rather than
 * navigating. The other three are ordinary crawlable <a href>.
 */

type Destination = {
  id: string;
  label: string;
  /** One line of orientation. Never a summary of the destination. */
  line: string;
  /** A real route. Absent only for the storyline, which is an overlay. */
  href?: string;
};

const destinations: Destination[] = [
  {
    id: "work",
    label: "Work",
    line: "Case studies, one system at a time.",
    href: "/work",
  },
  {
    id: "about",
    label: "About",
    line: "The arc, the grind, the detours.",
    href: "/about",
  },
  {
    id: "contact",
    label: "Contact",
    line: "A form, an inbox, and the other profiles.",
    href: "/contact",
  },
  {
    id: "story",
    label: "Story",
    line: "Six acts, with photographs. The long way round.",
  },
];

/**
 * The decoration, in one place. Every child is presentational: the chamfered
 * plate, the hairline fill inside it, the cut, the light that runs along the
 * cut and the fainter blade across the face. `.frame` carries the clip-path,
 * so it also clips all three moving layers and none of them needs its own
 * overflow box.
 */
function Cut() {
  return (
    <span className={styles.frame} aria-hidden>
      <span className={styles.fill} />
      <span className={styles.cut}>
        <span className={styles.glint} />
      </span>
      <span className={styles.wash} />
    </span>
  );
}

function PanelBody({
  index,
  label,
  line,
  path,
  printUrl,
}: {
  index: string;
  label: string;
  line: string;
  path: string;
  printUrl?: string;
}) {
  return (
    <span className={styles.body}>
      <span className={styles.index} aria-hidden>
        {index}
      </span>
      <span className={styles.label}>{label}</span>
      <span className={styles.line}>{line}</span>
      {/* The path and the arrow repeat what the link already says, so they are
          decoration; the accessible name is the label plus the line. */}
      <span className={styles.meta} aria-hidden>
        <span className={styles.path}>{path}</span>
        <span className={styles.arrow}>&rarr;</span>
      </span>
      {printUrl && (
        <span className={styles.printUrl} aria-hidden>
          {printUrl}
        </span>
      )}
    </span>
  );
}

export function ResumeHub() {
  return (
    <div className={`${styles.sheet} mx-auto w-full max-w-4xl`}>
      <header>
        <div className={styles.rule} aria-hidden />
        <p className={`${styles.kicker} mt-5`}>Resume</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.96] tracking-[-0.02em] text-[var(--text)]">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-[var(--accent)]">{profile.title}</p>

        <p className="mt-6 max-w-2xl leading-relaxed text-[var(--text-muted)]">
          The PDF is the resume. Everything it would summarise is already written out properly
          elsewhere on this site, so this page points rather than repeats.
        </p>

        {/* The one thing a recruiter came here to do, directly under the name
            and before anything else on the page. */}
        <div className="mt-7 print:hidden">
          <DownloadResumeButton />
        </div>

        <p className={`${styles.printNote} mt-7`}>
          The resume itself is a PDF: {profile.domain}
          {profile.resumePdf}
        </p>
      </header>

      <section className="mt-stack" aria-labelledby="hub-heading">
        <div className={`${styles.sectionHead} mb-6`}>
          <h2 id="hub-heading" className={styles.kicker}>
            Where the rest of it lives
          </h2>
          <span className={styles.thread} aria-hidden />
        </div>

        <ul className={styles.list}>
          {destinations.map((d, i) => {
            const index = String(i + 1).padStart(2, "0");
            const slot = { "--slot": i } as React.CSSProperties;

            if (!d.href) {
              return (
                <li key={d.id} className={`${styles.cell} ${styles.cellAction}`} style={slot}>
                  <button
                    type="button"
                    className={styles.panel}
                    onClick={() => window.dispatchEvent(new CustomEvent("open-shutter-story"))}
                  >
                    <Cut />
                    <PanelBody
                      index={index}
                      label={d.label}
                      line={d.line}
                      path="opens here"
                    />
                  </button>
                </li>
              );
            }

            return (
              <li key={d.id} className={styles.cell} style={slot}>
                <Link href={d.href} className={styles.panel}>
                  <Cut />
                  <PanelBody
                    index={index}
                    label={d.label}
                    line={d.line}
                    path={d.href}
                    printUrl={`${profile.domain}${d.href}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

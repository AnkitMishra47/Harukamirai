"use client";

import Link from "next/link";
import { profile } from "@/content";
import { DownloadResumeButton } from "@/components/DownloadResumeButton";
import { MagicReveal } from "@/components/effects/MagicReveal";
import styles from "@/components/resume-hub.module.css";

type Destination = {
  id: string;
  roman: string;
  tag: string;
  label: string;
  line: string;
  href?: string;
};

const destinations: Destination[] = [
  {
    id: "work",
    roman: "I",
    tag: "Chronicle of Spells",
    label: "Work",
    line: "Case studies, systems and production deployments.",
    href: "/work",
  },
  {
    id: "about",
    roman: "II",
    tag: "The Mage's Path",
    label: "About",
    line: "The arc, the grind, and the quiet detours.",
    href: "/about",
  },
  {
    id: "contact",
    roman: "III",
    tag: "Send a Courier",
    label: "Contact",
    line: "Direct inbox, message form, and verified channels.",
    href: "/contact",
  },
  {
    id: "story",
    roman: "IV",
    tag: "Interactive Grimoire",
    label: "Storyline",
    line: "Six cinematic acts with photographs and telemetry.",
  },
];

export function ResumeHub() {
  return (
    <div className={`${styles.sheet} w-full`}>
      {/* Expansive Header */}
      <header className="mb-stack">
        <div className={styles.rule} aria-hidden />
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Resume & Index
          </p>
          <p className="font-jp text-sm text-[var(--gold)]" aria-hidden>
            履歴書
          </p>
        </div>
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
          <MagicReveal direction="left">
            <h1 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-[-0.02em] text-[var(--text)]">
              {profile.name}
            </h1>
            <p className="mt-3 text-lg md:text-xl text-[var(--accent)] font-medium">
              {profile.title}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-[var(--text-muted)] text-base md:text-lg">
              The PDF is the portable record. Everything it summarises is chronicled across this
              grimoire, so choose an expedition chapter below or take the official credentials scroll with you.
            </p>
          </MagicReveal>

          <MagicReveal direction="right" delay={0.1} className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end print:hidden">
            <DownloadResumeButton />
            <p className="text-xs text-[var(--text-subtle)] font-mono">
              Verified Production Credentials (PDF)
            </p>
          </MagicReveal>
        </div>

        <p className={`${styles.printNote} mt-7`}>
          The resume itself is a PDF: {profile.domain}
          {profile.resumePdf}
        </p>
        <div className={`${styles.rule} mt-7`} aria-hidden />
      </header>

      {/* Chapters Grid: 2 columns on desktop to utilize full width with alternating left/right arrival */}
      <section className="mt-section" aria-labelledby="hub-heading">
        <MagicReveal direction="left">
          <div className={`${styles.sectionHead} mb-8`}>
            <h2 id="hub-heading" className={styles.kicker}>
              Chapters of the Chronicle
            </h2>
            <span className={styles.thread} aria-hidden />
          </div>
        </MagicReveal>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((d, i) => {
            const slot = { "--slot": i } as React.CSSProperties;
            const dir = i % 2 === 0 ? "left" : "right";

            if (!d.href) {
              return (
                <li key={d.id} className={`${styles.cell} ${styles.cellAction}`} style={slot}>
                  <MagicReveal direction={dir} delay={i * 0.08} className="w-full">
                    <button
                      type="button"
                      className={styles.panel}
                      onClick={() => window.dispatchEvent(new CustomEvent("open-shutter-story"))}
                    >
                      <span className={styles.sealDisc} aria-hidden>
                        {d.roman}
                      </span>
                      <span className={styles.body}>
                        <span className={styles.headerRow}>
                          <span className={styles.label}>{d.label}</span>
                          <span className={styles.tag}>· {d.tag}</span>
                        </span>
                        <span className={styles.line}>{d.line}</span>
                      </span>
                      <span className={styles.meta} aria-hidden>
                        <span className={styles.path}>opens here</span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.arrow}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </MagicReveal>
                </li>
              );
            }

            return (
              <li key={d.id} className={styles.cell} style={slot}>
                <MagicReveal direction={dir} delay={i * 0.08} className="w-full">
                  <Link href={d.href} className={styles.panel}>
                    <span className={styles.sealDisc} aria-hidden>
                      {d.roman}
                    </span>
                    <span className={styles.body}>
                      <span className={styles.headerRow}>
                        <span className={styles.label}>{d.label}</span>
                        <span className={styles.tag}>· {d.tag}</span>
                      </span>
                      <span className={styles.line}>{d.line}</span>
                    </span>
                    <span className={styles.meta} aria-hidden>
                      <span className={styles.path}>{d.href}</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.arrow}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className={styles.printUrl} aria-hidden>
                      {profile.domain}
                      {d.href}
                    </span>
                  </Link>
                </MagicReveal>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

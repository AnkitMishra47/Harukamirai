"use client";

import type { CaseStudy } from "@/content";
import { CaseStudyMotif } from "@/components/CaseStudyMotif";
import styles from "@/components/case-study.module.css";

export function cardTitleId(slug: string) {
  return `${slug}-title`;
}

/**
 * Case Study Card.
 * Clicking anywhere on the card or the action button opens the full
 * case study blueprint in a focused Grimoire modal dialog.
 */
export function CaseStudyCard({
  study,
  index = 0,
  onSelect,
}: {
  study: CaseStudy;
  index?: number;
  onSelect: () => void;
}) {
  const tiltClass = index % 2 === 0 ? styles.timberCardEven : styles.timberCardOdd;

  return (
    <article
      id={study.slug}
      onClick={onSelect}
      className={`group ${styles.timberCard} ${tiltClass} relative flex h-full flex-1 flex-col overflow-hidden scroll-mt-28 p-6 md:p-8 cursor-pointer`}
    >
      <CaseStudyMotif slug={study.slug} />

      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)] mt-6 md:mt-8">
        {study.kicker}
      </p>
      <h3
        id={cardTitleId(study.slug)}
        className="font-display text-xl md:text-2xl mt-2 text-[var(--text)] leading-tight group-hover:text-[var(--accent)] transition-colors"
      >
        {study.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
        {study.domain}
      </p>

      {/* Footer: Tech pills and open dialog action */}
      <div className="mt-auto pt-6 flex items-center justify-between gap-3 border-t border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-1.5">
          {study.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--text-subtle)]"
            >
              {tech}
            </span>
          ))}
          {study.stack.length > 3 && (
            <span className="font-mono text-[11px] text-[var(--text-subtle)]">
              +{study.stack.length - 3}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-semibold shrink-0 group-hover:text-[var(--accent-hover)]">
          <span>Read case study</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  );
}

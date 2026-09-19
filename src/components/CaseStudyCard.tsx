"use client";

import type { CaseStudy } from "@/content";
import { TechPill } from "@/components/TechPill";

/** Id of the detail panel a card's toggle controls. Shared with CaseStudyGrid. */
export function detailPanelId(slug: string) {
  return `${slug}-detail`;
}

/** Id of the card heading, used to label the detail panel. */
export function cardTitleId(slug: string) {
  return `${slug}-title`;
}

/**
 * Collapsed summary card. It is deliberately a headline and nothing more:
 * kicker, title, and two lines of `domain` saying what the system was. The
 * stack, metrics, problem, approach and result are all one click away in the
 * detail panel, so a phone-width column of these reads as a list of things
 * rather than a wall of prose.
 *
 * `line-clamp-2` hides the rest of `domain` visually but leaves the full
 * sentence in the DOM, so screen readers and crawlers still get it.
 *
 * Its height never changes: the detail it toggles is rendered by CaseStudyGrid
 * as a separate full-width row, so opening a card cannot move the card, its
 * footer, or the card beside it. The card is a flex column that fills its grid
 * cell, which is what keeps both cards in a row the same height.
 */
export function CaseStudyCard({
  study,
  expanded,
  onToggle,
}: {
  study: CaseStudy;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      id={study.slug}
      className={`group relative flex h-full flex-1 flex-col scroll-mt-28 rounded-2xl border bg-[var(--bg-elevated)] p-6 md:p-8 transition-[border-color,box-shadow] duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)] ${
        expanded
          ? "border-[var(--accent)] shadow-[0_0_30px_var(--accent-glow)]"
          : "border-[var(--border)]"
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{study.kicker}</p>
      <h3
        id={cardTitleId(study.slug)}
        className="font-display text-xl md:text-2xl mt-2 text-[var(--text)] leading-tight"
      >
        {study.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">{study.domain}</p>

      {/* Footer: pushed to the bottom edge so every card in a row lines up.
          Only actions live here now - a live-site link where there is one, and
          the toggle. The stack pills moved into the detail panel; they were up
          to four wrapped rows of text on a 390px card. */}
      <div className="mt-auto pt-5">
        {study.links?.length ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {study.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                {l.label}
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={detailPanelId(study.slug)}
          className="flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          {expanded ? "Hide details" : "Show details"}
          <span className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} aria-hidden>
            ↓
          </span>
        </button>
      </div>
    </article>
  );
}

/**
 * The full case study, rendered into the grid's full-width detail row. It
 * repeats the kicker and title because at two columns the panel sits under a
 * pair of cards and needs to say which one it belongs to, and it carries the
 * full `domain` text that the card clamps to two lines.
 *
 * It also owns the stack pills. They used to sit on the collapsed card, so this
 * is the only place they appear now - the card must not be the sole copy of
 * anything it stops showing.
 */
export function CaseStudyDetail({ study }: { study: CaseStudy }) {
  return (
    <div className="rounded-2xl border border-[var(--accent)] bg-[var(--bg-elevated)] p-6 md:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{study.kicker}</p>
      <p className="font-display text-xl md:text-2xl mt-2 text-[var(--text)] leading-tight">{study.title}</p>
      <p className="mt-3 max-w-3xl text-[var(--text-muted)] leading-relaxed">{study.domain}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {study.stack.map((s) => (
          <TechPill key={s}>{s}</TechPill>
        ))}
      </div>

      <div className="mt-7 grid gap-7 md:grid-cols-3">
        <aside className="space-y-3 md:col-start-3 md:row-start-1 md:border-l md:border-[var(--border)] md:pl-7">
          {study.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">{m.label}</p>
              <p className="font-display text-xl mt-1 text-[var(--text)] leading-tight">{m.value}</p>
            </div>
          ))}
        </aside>

        <div className="md:col-span-2 md:col-start-1 md:row-start-1 space-y-5">
          <Block label="Problem">
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">{study.problem}</p>
          </Block>
          <Block label="Approach">
            <ul className="mt-2 space-y-2 text-[var(--text-muted)]">
              {study.approach.map((line) => (
                <li key={line} className="leading-relaxed">
                  <span className="mr-2 text-[var(--accent)]">▹</span>
                  {line}
                </li>
              ))}
            </ul>
          </Block>
          <Block label="Result">
            <p className="mt-1.5 text-[var(--text-muted)] leading-relaxed">{study.result}</p>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">{label}</p>
      {children}
    </div>
  );
}

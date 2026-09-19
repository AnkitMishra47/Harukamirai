"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CaseStudy } from "@/content";
import { TechPill } from "@/components/TechPill";

export function CaseStudyCard({ study, expanded, onToggle }: { study: CaseStudy; expanded?: boolean; onToggle?: () => void }) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = expanded ?? internalExpanded;
  const toggle = onToggle ?? (() => setInternalExpanded((v) => !v));

  return (
    <article
      id={study.slug}
      className="group relative scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8 transition-all hover:border-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)] h-full flex flex-col"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{study.kicker}</p>
      <h3 className="font-display text-xl md:text-2xl mt-2 text-[var(--text)] leading-tight">{study.title}</h3>
      {!isExpanded && (
        <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">{study.domain}</p>
      )}
      {isExpanded && (
        <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{study.domain}</p>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {study.stack.slice(0, isExpanded ? undefined : 5).map((s) => (
          <TechPill key={s}>{s}</TechPill>
        ))}
        {study.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            {l.label}
            <span aria-hidden>↗</span>
          </a>
        ))}
      </div>

      <button
        onClick={toggle}
        className="mt-auto pt-4 flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
      >
        {isExpanded ? "Hide details" : "Show details"}
        <span className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>↓</span>
      </button>
    </article>
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

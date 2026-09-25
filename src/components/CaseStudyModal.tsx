"use client";

import { ArrowText } from "@/components/ArrowText";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content";
import { TechPill } from "@/components/TechPill";
import styles from "./case-study-modal.module.css";

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
}

export function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & trigger discovery event
  useEffect(() => {
    if (!study) return;

    // Trigger quest relic discovery event for opening an archived case study
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("grimoire-relic-discover", {
          detail: { relicId: "blueprint" },
        })
      );
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [study, onClose]);

  return (
    <AnimatePresence>
      {study && (
        <motion.div
          data-scroll-lock
          key={study.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.24 }}
          className={styles.backdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-modal-title"
        >
          <motion.div
            ref={dialogRef}
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.94, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, scale: 1 }
                : { opacity: 0, scale: 0.94, y: 16 }
            }
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={styles.dialog}
          >
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <header className={styles.header}>
              <p className={styles.kicker}>{study.kicker}</p>
              <h2 id="case-study-modal-title" className={styles.title}>
                {study.title}
              </h2>
              <p className={styles.domain}>{study.domain}</p>

              {study.links?.length ? (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {study.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[color-mix(in_oklab,var(--bg)_75%,var(--accent-glow))] px-3.5 py-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                    >
                      <span>{l.label}</span>
                      <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </header>

            <div className={styles.rule} />

            {/* Stack badges */}
            <div>
              <p className={styles.blockTitle}>Core Stack & Platform</p>
              <div className="flex flex-wrap items-center gap-2">
                {study.stack.map((s) => (
                  <TechPill key={s}>{s}</TechPill>
                ))}
              </div>
            </div>

            {/* Metrics & details */}
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {study.metrics.length > 0 && (
                <aside className="space-y-3 md:col-start-3 md:row-start-1 md:border-l md:border-[var(--border)] md:pl-6">
                  <p className={styles.blockTitle}>Impact Metrics</p>
                  {study.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]">
                        {m.label}
                      </p>
                      <p className="font-display text-lg mt-0.5 text-[var(--text)] font-semibold">
                        <ArrowText text={m.value} />
                      </p>
                    </div>
                  ))}
                </aside>
              )}

              <div
                className={`space-y-5 ${
                  study.metrics.length > 0
                    ? "md:col-span-2 md:col-start-1 md:row-start-1"
                    : "md:col-span-3"
                }`}
              >
                <div>
                  <p className={styles.blockTitle}>The Challenge</p>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {study.problem}
                  </p>
                </div>

                <div>
                  <p className={styles.blockTitle}>Architecture & Engineering Approach</p>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    {study.approach.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="text-[var(--accent)] font-bold shrink-0">▹</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className={styles.blockTitle}>Production Result</p>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {study.result}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

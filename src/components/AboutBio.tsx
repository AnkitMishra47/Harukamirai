"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { RichText } from "@/components/RichText";
import type { Link } from "@/content/types";
import styles from "@/components/about.module.css";

interface AboutBioProps {
  bio: string[];
  emailLink: Link;
}

export function AboutBio({ bio, emailLink }: AboutBioProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [p1, p2, ...moreParagraphs] = bio;

  return (
    <div className="order-2 md:order-1 flex flex-col justify-between">
      <div className="prose-lg space-y-6 text-lg leading-relaxed text-[var(--text-muted)]">
        {/* First two bio paragraphs visible by default */}
        <p className={styles.dropCap}>
          <RichText text={p1} />
        </p>
        {p2 && (
          <p>
            <RichText text={p2} />
          </p>
        )}

        {/* Expandable additional paragraphs */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id="about-bio-details"
              key="extra-content"
              initial={
                shouldReduceMotion
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 0, height: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 1, height: "auto" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, height: 0 }
                  : { opacity: 0, height: 0 }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden space-y-6"
            >
              {moreParagraphs.map((para) => (
                <p key={para.slice(0, 32)}>
                  <RichText text={para} />
                </p>
              ))}

              <p>
                If you want to talk about backend architecture, enterprise integrations, AI in
                production, the <em>Black Clover</em> anime adaptation pacing problem, or freelance
                work -{" "}
                <a
                  href={emailLink.href}
                  className="text-[var(--text)] underline decoration-[var(--accent)] decoration-1 underline-offset-4 hover:text-[var(--accent)] transition-colors"
                >
                  {emailLink.value ?? emailLink.href}
                </a>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show details / Show less toggle */}
      <div className="pt-6">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls="about-bio-details"
          className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] cursor-pointer"
        >
          <span>{isExpanded ? "Show less" : "Show details"}</span>
          <motion.svg
            viewBox="0 0 16 16"
            className="size-4 stroke-current transition-transform duration-300"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" />
          </motion.svg>
        </button>
      </div>
    </div>
  );
}

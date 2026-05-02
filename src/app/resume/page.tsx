"use client";

import { Grimoire } from "@/components/effects/Grimoire";
import { MagicReveal } from "@/components/effects/MagicReveal";
import Link from "next/link";
import { motion } from "motion/react";

export default function ResumePage() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      
      <MagicReveal delay={0.2} className="text-center mb-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
          Interactive Chronology
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--text)]">
          The Grimoire of Ankit
        </h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
          Flip through the chapters of my career. From the first line of code
          to leading engineering cycles at OneIT.
        </p>
      </MagicReveal>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 mt-4"
      >
        <Grimoire size={450} />
      </motion.div>

      <MagicReveal delay={1.2} className="mt-16 flex flex-col items-center gap-6">
        <a
          href="/docs/AnkitResume.pdf"
          download
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--accent)] px-8 py-4 font-medium text-[var(--text)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
        >
          <span className="relative z-10">Download Traditional PDF</span>
          <svg
            className="relative z-10 size-4 transition-transform group-hover:translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8l-8 8-8-8" />
          </svg>
        </a>

        <Link
          href="/work"
          className="text-sm text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors"
        >
          View detailed case studies →
        </Link>
      </MagicReveal>

      {/* Background Magic Circle - Unique to this page */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10 blur-sm">
        <div className="animate-pulse-slow">
           <svg viewBox="0 0 100 100" width="800" height="800" className="text-[var(--accent)] opacity-20">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
            <path d="M 50 2 L 98 50 L 50 98 L 2 50 Z" fill="none" stroke="currentColor" strokeWidth="0.05" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

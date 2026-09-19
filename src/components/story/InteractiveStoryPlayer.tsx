"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { profile, awards } from "@/content";

interface StoryChapter {
  chapter: number;
  kicker: string;
  title: string;
  chips: string[];
  narrative: string;
  highlight: string;
  linkText?: string;
  linkHref?: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    chapter: 1,
    kicker: "Chapter 1 · The Ascent",
    title: "From Intern to Senior Engineer in Three Years",
    chips: ["3 Promotions in 3 Years", "MCA (86% Marks)", "OneIT (Australia)"],
    narrative:
      "Joined OneIT Australia as an intern in 2022 right after graduating with 86% in BCA. Earned three consecutive promotions to Senior Software Engineer while completing a full Master's degree in computer applications.",
    highlight: "Debugged production at 11pm before 9am exams. Taught me how to ship under pressure.",
    linkText: "Read full career arc →",
    linkHref: "/about",
  },
  {
    chapter: 2,
    kicker: "Chapter 2 · Production Scale",
    title: "RAG over 25M+ Embeddings on PostgreSQL",
    chips: ["25M+ pgvector Rows", "HNSW Index Scan", "XML/EDI Middleware"],
    narrative:
      "Engineered enterprise document retrieval across SharePoint, equipment manuals, and tickets. Solved index bloat and VACUUM stalls on pgvector at 25 million rows. Built fault-tolerant XML/EDI middleware connecting ERPs with MYOB and CargoWise.",
    highlight: "Zero ghost records. Sub-15ms filtered vector search in active production.",
    linkText: "Inspect RAG case study →",
    linkHref: "/work#rag-platform",
  },
  {
    chapter: 3,
    kicker: "Chapter 3 · High Velocity",
    title: "7-Page Client Platform Shipped in a Single Day",
    chips: ["1-Day Delivery", "Next.js App Router", "Live Production"],
    narrative:
      "A language and study-abroad consultancy needed an international presence fast. Scoped, built, and shipped a 7-page Next.js platform with bilingual scaffolding and lead capture—live in 24 hours.",
    highlight: "Live at thesprachkraft.com with zero ongoing engineering overhead for the client.",
    linkText: "View client work →",
    linkHref: "/work#sprachkraft",
  },
  {
    chapter: 4,
    kicker: "Chapter 4 · Recognition & The Ask",
    title: "Recognized for Technical Impact Across the Firm",
    chips: ["Mid Developer of the Year (2024)", "Runner-up Employee of the Year (2025)"],
    narrative:
      "Awarded company-wide honours two years in a row, signed by Managing Director David Barton. Ready to build high-scale AI systems, backend architectures, and enterprise platforms.",
    highlight: "Fastest response via email. Open to senior engineering and staff opportunities.",
    linkText: "Download verified resume PDF ↓",
    linkHref: profile.resumePdf,
  },
];

const SLIDE_DURATION_MS = 10000;

export function InteractiveStoryPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Global listener to trigger story
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setCurrentIndex(0);
      setProgress(0);
      setIsPaused(false);
    };

    window.addEventListener("open-interactive-story", handleOpen);
    return () => window.removeEventListener("open-interactive-story", handleOpen);
  }, []);

  // Keyboard navigation & Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, currentIndex]);

  // Automated progress bar ticker
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const stepMs = 50;
    const increment = (stepMs / SLIDE_DURATION_MS) * 100;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          goNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    progressTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex]);

  const goNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1 < CHAPTERS.length ? prev + 1 : 0));
  };

  const goPrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : CHAPTERS.length - 1));
  };

  if (!isOpen) return null;

  const current = CHAPTERS[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Story Container Card */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Segment Progress Bars */}
        <div className="px-6 pt-5 pb-2 flex gap-2">
          {CHAPTERS.map((ch, idx) => (
            <div
              key={ch.chapter}
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-[var(--border)]"
            >
              <div
                className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-75"
                style={{
                  width:
                    idx === currentIndex
                      ? `${progress}%`
                      : idx < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Control Header */}
        <div className="flex items-center justify-between px-6 py-2 text-xs font-mono text-[var(--text-subtle)]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="uppercase tracking-widest text-[var(--accent)]">
              {current.kicker}
            </span>
            <span className="opacity-40">·</span>
            <span>{isPaused ? "Paused" : "Auto-playing"}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="rounded px-2 py-0.5 hover:bg-[var(--bg)] text-[var(--text)] transition-colors cursor-pointer"
              title="Spacebar to toggle play/pause"
            >
              {isPaused ? "▶ Play" : "⏸ Pause"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Close story"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Story Body */}
        <div className="px-6 sm:px-8 py-6 space-y-5 min-h-[300px] flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-[var(--text)] leading-snug">
              {current.title}
            </h3>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {current.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-mono text-[var(--accent)] font-medium"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Narrative */}
            <p className="text-base text-[var(--text)] leading-relaxed pt-1">
              {current.narrative}
            </p>

            {/* Highlight quote */}
            <div className="rounded-2xl border-l-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent-glow)_30%,var(--bg))] p-4 text-sm text-[var(--text-muted)] leading-relaxed italic">
              &ldquo;{current.highlight}&rdquo;
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            {current.linkHref?.endsWith(".pdf") ? (
              <a
                href={current.linkHref}
                download
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-medium text-[var(--bg)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
              >
                <span>Download Resume PDF</span>
                <span aria-hidden>↓</span>
              </a>
            ) : (
              <Link
                href={current.linkHref ?? "/about"}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-5 py-2.5 text-xs font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>{current.linkText}</span>
              </Link>
            )}

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                aria-label="Previous chapter"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                aria-label="Next chapter"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

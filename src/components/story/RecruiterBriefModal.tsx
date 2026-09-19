"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/content";
import { trackDownload } from "@/lib/track-download";

export function RecruiterBriefModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-recruiter-brief", handleOpen);
    return () => window.removeEventListener("open-recruiter-brief", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const copyEmail = () => {
    const email = profile.links.find((l) => l.label === "Email")?.value || "ankitm17.2001@gmail.com";
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playStory = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("open-shutter-story"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recruiter-brief-title"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] text-left"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-semibold mb-2">
              <span>EXECUTIVE SUMMARY · ONEIT</span>
            </div>
            <h2 id="recruiter-brief-title" className="font-display text-2xl sm:text-3xl text-[var(--text)]">
              {profile.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--accent)]">
              {profile.title} · {profile.employer.name} ({profile.employer.country})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--text-subtle)] hover:border-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Core Value Pillars (Fast Scannable Grid) */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-subtle)] font-semibold block">
              Trajectory
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-[var(--text)]">
              3 Promotions
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Intern → Senior SWE in 3 yrs + MCA (86%)
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-subtle)] font-semibold block">
              Scale & AI
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-[var(--text)]">
              25M+ Vectors
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              pgvector HNSW, sub-15ms, zero bloat
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-subtle)] font-semibold block">
              Firm Recognition
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-[var(--text)]">
              Double Honoree
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Mid Dev (2024), Runner-up Emp (2025)
            </span>
          </div>
        </div>

        {/* Narrative Highlights */}
        <div className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
          <p>
            <strong className="text-[var(--text)]">What I do:</strong> I design and scale mission-critical AI systems, backend microservices, and enterprise data pipelines. At OneIT Australia, I run pgvector retrieval over 25M+ embeddings and build XML/EDI middleware connecting legacy ERPs with modern cloud logistics.
          </p>
          <p>
            <strong className="text-[var(--text)]">Primary Stack:</strong> Java 21 / Spring Boot, PostgreSQL / pgvector, Angular 19, Next.js / TypeScript, Python / FastMCP, Docker, and distributed replication engines.
          </p>
          <p>
            <strong className="text-[var(--text)]">Current Status:</strong> Based in India working remotely with Australian and international engineering teams. Open to senior engineering and tech lead opportunities.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mt-7 pt-5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={profile.resumePdf}
              download
              onClick={() => trackDownload(profile.resumePdf)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] shadow-md hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Resume PDF</span>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer min-w-[190px] px-4"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? "Copied!" : "Copy Email"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={playStory}
              className="font-medium text-[var(--accent)] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Experience Storyline</span>
            </button>
            <span className="text-[var(--text-subtle)]">·</span>
            <Link
              href="/work"
              onClick={() => setIsOpen(false)}
              className="font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1 group"
            >
              <span>View Work</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

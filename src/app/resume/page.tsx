import type { Metadata } from "next";
import Link from "next/link";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { ResumeSheet } from "@/components/ResumeSheet";
import { DownloadResumeButton } from "@/components/DownloadResumeButton";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: `Resume - ${profile.name}`,
  description: `${profile.title}. Career chronology, skills, projects and the PDF.`,
};

export default function ResumePage() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center px-6 py-10 md:py-20 overflow-hidden">
      <MagicReveal delay={0.2} className="text-center mb-6 md:mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">Career Chronology</p>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--text)]">
          Resume · {profile.name.split(" ")[0]}
        </h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
          The full career arc — from the first line of code to leading
          engineering cycles at {profile.employer.name}.
        </p>
      </MagicReveal>

      <MagicReveal delay={0.4} className="mt-4 flex flex-col items-center gap-6 print:hidden">
        <a href="#resume" className="text-sm text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors">
          View the plain resume ↓
        </a>
      </MagicReveal>

      <div className="mt-8 md:mt-12 w-full max-w-3xl border-t border-[var(--border)] pt-8 md:pt-16">
        <ResumeSheet />
        <div className="mt-12 flex flex-wrap items-center gap-6 print:hidden">
          <DownloadResumeButton />
          <Link href="/work" className="text-sm text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors">
            View detailed case studies →
          </Link>
        </div>
      </div>

      {/* Background circle unique to this page */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10 blur-sm print:hidden" aria-hidden>
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


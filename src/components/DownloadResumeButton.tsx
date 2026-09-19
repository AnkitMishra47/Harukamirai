"use client";

import { profile } from "@/content";
import { trackDownload } from "@/lib/track-download";

/**
 * The one thing a recruiter most wants off this page, so it is the only filled
 * control on it: --accent ground with --bg text, the pairing the site already
 * uses for a primary action (measured 5.6:1 on vellum, 4.8:1 on ink).
 *
 * `trackDownload` fires on click via sendBeacon so the beacon leaves before the
 * browser starts the download.
 */
export function DownloadResumeButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <a
      href={profile.resumePdf}
      download
      onClick={() => trackDownload(profile.resumePdf)}
      className="group inline-flex min-h-[48px] items-center gap-3 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-7 py-3 font-medium text-[var(--bg)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <span>{label}</span>
      <svg
        className="size-4 transition-transform duration-200 group-hover:translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8l-8 8-8-8" />
      </svg>
    </a>
  );
}

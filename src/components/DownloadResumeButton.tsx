"use client";

import { profile } from "@/content";
import { trackDownload } from "@/lib/track-download";

export function DownloadResumeButton() {
  return (
    <a
      href={profile.resumePdf}
      download
      onClick={() => trackDownload(profile.resumePdf)}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--accent)] px-8 py-4 font-medium text-[var(--text)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
    >
      <span className="relative z-10">Download PDF</span>
      <svg className="relative z-10 size-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8l-8 8-8-8" />
      </svg>
    </a>
  );
}

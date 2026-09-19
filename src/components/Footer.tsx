"use client";

import Link from "next/link";
import { profile } from "@/content";

export function Footer() {
  const email = profile.links.find((l) => l.label === "Email")!;
  const linkedin = profile.links.find((l) => l.label === "LinkedIn")!;
  const github = profile.links.find((l) => l.label === "GitHub")!;
  
  return (
    // The footer owns the gap above itself (mt-section), so no page adds bottom
    // padding for it. py-band is interior padding, inside the bordered box.
    <footer className="mt-section border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-band grid gap-12 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-6 inline-flex self-start items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="text-xs font-medium text-[var(--text)]">Open to senior / staff opportunities</span>
          </div>

          <p className="font-display text-2xl text-[var(--text)]">遥か未来</p>
          <p className="font-jp text-sm text-[var(--text-subtle)] mt-1">Haruka Mirai - the future, forged.</p>
          <p className="font-display text-base italic text-[var(--accent)] mt-5">&ldquo;{profile.motto.en}&rdquo;</p>
        </div>

        <div className="md:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)] mb-3">Elsewhere</p>
          <ul className="text-sm space-y-1">
            <li>
              <a className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" href={email.href}>
                {email.value}
              </a>
            </li>
            <li>
              <a
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                href={linkedin.href}
                target="_blank"
                rel="noreferrer"
              >
                {linkedin.label}
              </a>
            </li>
            {github && (
              <li>
                <a
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  href={github.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {github.label}
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl px-6 lg:px-12 py-5">
          <p className="text-xs text-[var(--text-subtle)]">
            © {new Date().getFullYear()} {profile.name} · {profile.domain}
          </p>
          
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">About</Link>
            <Link href="/work" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Work</Link>
            <Link href="/resume" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Resume</Link>
            <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Contact</Link>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
          >
            <span>Back to top</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:-translate-y-0.5"
              aria-hidden
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

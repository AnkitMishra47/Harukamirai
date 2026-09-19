"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloverIcon } from "./CloverIcon";
import { CloverToggle } from "./CloverToggle";

// Writing / Now / Lab stay routable but leave the nav until they have content.
const links = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12 py-4">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-3 group"
          onClick={() => setOpen(false)}
        >
          <CloverIcon size={32} />
          <span className="font-display text-lg tracking-tight text-[var(--text)]">
            harukamirai
            <span className="text-[var(--text-subtle)]">.engineer</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            aria-label="Search with vector palette (Cmd+K)"
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)] hover:shadow-[0_0_12px_var(--accent-glow)] cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="8" cy="8" r="6" />
              <line x1="13" y1="13" x2="18" y2="18" />
            </svg>
            <span className="hidden lg:inline text-[11px] font-mono tracking-wider">AI SEARCH</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 font-mono text-[10px] text-[var(--accent)]">
              ⌘K
            </kbd>
          </button>

          <div className="ml-1 hidden md:block">
            <CloverToggle />
          </div>

          {/* Mobile: theme toggle stays visible, hamburger replaces link list */}
          <div className="flex items-center gap-1 md:hidden">
            <CloverToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((v) => !v)}
              className="ml-1 inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--accent)]"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel - slides down from below the nav bar (CSS keyframe on mount) */}
      {open && (
        <div
          id="mobile-nav-panel"
          className="nav-panel md:hidden border-t border-[var(--border)] bg-[var(--bg)]"
        >
          <ul className="mx-auto max-w-6xl px-6 py-3 flex flex-col">
            {links.map((l, i) => (
              <li
                key={l.href}
                className="nav-item"
                style={{ animationDelay: `${0.04 + i * 0.04}s` }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 font-display text-lg text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/** Two bars that rotate into an X; the transform transitions in CSS. */
function HamburgerIcon({ open }: { open: boolean }) {
  const line = (dy: number, deg: number): React.CSSProperties => ({
    transform: open ? `rotate(${deg}deg) translateY(${dy}px)` : "none",
    transformOrigin: "10px 10px",
    transformBox: "view-box",
    transition: "transform .2s",
  });
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="17" y2="6" style={line(4, 45)} />
      <line x1="3" y1="14" x2="17" y2="14" style={line(-4, -45)} />
    </svg>
  );
}

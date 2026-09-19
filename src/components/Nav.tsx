"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const pathname = usePathname();

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
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-shutter-story"))}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] cursor-pointer flex items-center gap-1.5"
              >
                <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                <span>Story</span>
              </button>
            </li>
            {links.map((l) => {
              const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent)]/10"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop: full search capsule */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            aria-label="Search (Cmd+K)"
            className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)] hover:shadow-[0_0_12px_var(--accent-glow)] cursor-pointer min-w-[160px]"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="8" cy="8" r="6" />
              <line x1="13" y1="13" x2="18" y2="18" />
            </svg>
            <span className="hidden lg:inline text-xs font-mono tracking-wider">SEARCH</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--accent)]">
              ⌘K
            </kbd>
          </button>

          {/* Mobile: icon-only search button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            aria-label="Search"
            className="sm:hidden inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)] cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="8" cy="8" r="6" />
              <line x1="13" y1="13" x2="18" y2="18" />
            </svg>
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
            <li className="nav-item" style={{ animationDelay: "0.04s" }}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-shutter-story"));
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-3 font-display text-lg text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
              >
                <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                <span>Story</span>
              </button>
            </li>
            {links.map((l, i) => {
              const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li
                  key={l.href}
                  className="nav-item"
                  style={{ animationDelay: `${0.04 + (i + 1) * 0.04}s` }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-3 font-display text-lg transition-colors ${
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent)]/10"
                        : "text-[var(--text)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
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

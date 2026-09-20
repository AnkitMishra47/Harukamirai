"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloverIcon } from "./CloverIcon";
import { CloverToggle } from "./CloverToggle";

// Writing / Now / Lab stay routable but leave the nav until they have content.
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

/** Matches the `md:` Tailwind breakpoint, where the compact header swaps for the full one. */
const DESKTOP_QUERY = "(min-width: 768px)";

function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" />
      <line x1="13" y1="13" x2="18" y2="18" />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openSearch = useCallback(() => {
    // Dispatch synchronously inside the tap so the palette can focus its input
    // while the user gesture is still on the stack.
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }, []);

  // Close menu on Escape, returning focus to the control that opened it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The panel is md:hidden, so growing past the breakpoint would otherwise
  // leave `open` true with the panel invisible and body scroll still locked.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 lg:px-12 py-4">
        {/* No aria-label: the visible wordmark is the accessible name, so a
            voice-control user can say what they can read (WCAG 2.5.3). */}
        <Link
          href="/"
          prefetch={true}
          className="flex items-center gap-3 group shrink-0"
          onClick={() => setOpen(false)}
        >
          <CloverIcon size={32} />
          <span className="font-display text-lg tracking-tight text-[var(--text)] whitespace-nowrap">
            harukamirai
            {/* The TLD is decoration; below lg it is the first thing to go. */}
            <span className="hidden lg:inline text-[var(--text-subtle)]">.engineer</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
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
              const isActive =
                l.href === "/"
                  ? pathname === "/"
                  : pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch={true}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent)]/10 font-semibold"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop only: the search capsule advertises a shortcut a phone has no
              keys for. Below md, Search lives in the menu panel instead. */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search (Cmd+K)"
            className="hidden md:flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)] hover:shadow-[0_0_12px_var(--accent-glow)] cursor-pointer lg:min-w-[160px]"
          >
            <SearchIcon />
            <span className="hidden lg:inline text-xs font-mono tracking-wider cap-align">SEARCH</span>
            {/* ml-auto: at lg the capsule has a min width, and the shortcut
                hint belongs on its trailing edge rather than floating mid-capsule. */}
            <kbd className="ml-auto inline-flex h-[22px] items-center justify-center rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 font-mono text-[11px] text-[var(--accent)]">
              <span className="cap-align">⌘K</span>
            </kbd>
          </button>

          <div className="ml-1 hidden md:block">
            <CloverToggle />
          </div>

          {/* Compact header: the clover switch stays in the bar (the About page
              tells visitors to click it); everything else folds into the menu. */}
          <div className="flex items-center gap-2 md:hidden">
            <CloverToggle />
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel - slides down from below the nav bar.
          .nav-panel / .nav-item animate opacity + transform only and are
          neutralised by the global prefers-reduced-motion rule. */}
      {open && (
        <div
          id="mobile-nav-panel"
          className="nav-panel md:hidden border-t border-[var(--border)] bg-[var(--bg)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-3">
            <div className="nav-item" style={{ animationDelay: "0.04s" }}>
              <button
                type="button"
                onClick={openSearch}
                className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-left text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <SearchIcon size={17} />
                <span className="text-base">Search</span>
              </button>
            </div>

            <ul className="mt-2 flex flex-col">
              <li className="nav-item" style={{ animationDelay: "0.08s" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("open-shutter-story"));
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-3 font-display text-lg text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                  <span>Story</span>
                </button>
              </li>
              {links.map((l, i) => {
                const isActive =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <li
                    key={l.href}
                    className="nav-item"
                    style={{ animationDelay: `${0.08 + (i + 1) * 0.04}s` }}
                  >
                    <Link
                      href={l.href}
                      prefetch={true}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-3 font-display text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                        isActive
                          ? "text-[var(--accent)] bg-[var(--accent)]/10 font-semibold"
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

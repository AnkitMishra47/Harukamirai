"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloverIcon } from "./CloverIcon";
import { CloverToggle } from "./CloverToggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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

          <div className="ml-2 hidden md:block">
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

      {/* Mobile menu panel — slides down from below the nav bar */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]"
          >
            <ul className="mx-auto max-w-6xl px-6 py-3 flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 font-display text-lg text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
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
      <motion.line
        x1="3"
        y1="6"
        x2="17"
        y2="6"
        animate={open ? { x1: 4, y1: 4, x2: 16, y2: 16 } : { x1: 3, y1: 6, x2: 17, y2: 6 }}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="3"
        y1="14"
        x2="17"
        y2="14"
        animate={open ? { x1: 4, y1: 16, x2: 16, y2: 4 } : { x1: 3, y1: 14, x2: 17, y2: 14 }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}

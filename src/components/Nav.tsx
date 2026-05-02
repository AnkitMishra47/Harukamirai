import Link from "next/link";
import { CloverIcon } from "./CloverIcon";
import { CloverToggle } from "./CloverToggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-3 group"
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
          <div className="ml-2">
            <CloverToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

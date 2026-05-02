import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-12 md:grid-cols-2">
        <div>
          <p className="font-display text-2xl text-[var(--text)]">
            遥か未来
          </p>
          <p className="font-jp text-sm text-[var(--text-subtle)] mt-1">
            Haruka Mirai — the future, forged.
          </p>
          <p className="font-display text-base italic text-[var(--accent)] mt-5">
            “Push past my limit.”
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="text-xs font-medium text-[var(--text)]">
              Open to senior / staff opportunities
            </span>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)] mb-3">
            Elsewhere
          </p>
          <ul className="text-sm space-y-1">
            <li>
              <a
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                href="mailto:ankitm17.2001@gmail.com"
              >
                ankitm17.2001@gmail.com
              </a>
            </li>
            <li>
              <a
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                href="https://www.linkedin.com/in/ankitmishra47"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-[var(--text-subtle)]">
          © {new Date().getFullYear()} Ankit Mishra · harukamirai.engineer
        </p>
      </div>
    </footer>
  );
}

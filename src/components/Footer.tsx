import Link from "next/link";

const mentors = [
  "Akhil Kandpal",
  "Abirami Thurairajah",
  "Towhidul Islam (Tuhin)",
  "Pankaj Vaghasiya",
  "Harsh Shah",
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-[var(--text)]">
            遥か未来
          </p>
          <p className="font-jp text-sm text-[var(--text-subtle)] mt-1">
            Haruka Mirai — the future, forged.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)] mb-3">
            Engineers who shaped this craft
          </p>
          <ul className="text-sm text-[var(--text-muted)] space-y-1">
            {mentors.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>

        <div>
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
                href="https://www.linkedin.com/in/ankitm17/"
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
          © {new Date().getFullYear()} Ankit Mishra. Built in Faridabad,
          shipped from a 6-hour timezone gap.
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: `Contact - ${profile.name}`,
  description: "Email, LinkedIn, GitHub, and the rest.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">Contact</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          Send a message.
        </h1>
        <p className="mt-6 text-lg text-[var(--text-muted)]">
          Backend architecture, enterprise integrations, AI in production, freelance work, the{" "}
          <em>Black Clover</em> anime adaptation pacing problem - all welcome.
        </p>
      </header>

      <ul className="space-y-6">
        {profile.links.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 hover:border-[var(--accent)] transition-colors"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)]">{c.label}</p>
              <p className="font-display text-2xl mt-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {c.value ?? c.href}
              </p>
              {c.note && <p className="text-sm text-[var(--text-muted)] mt-2">{c.note}</p>}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

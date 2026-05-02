import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Ankit Mishra",
  description: "Email, LinkedIn, GitHub, and the rest.",
};

const channels = [
  {
    label: "Email",
    value: "ankitm17.2001@gmail.com",
    href: "mailto:ankitm17.2001@gmail.com",
    note: "The fastest way. I read everything.",
  },
  {
    label: "LinkedIn",
    value: "/in/ankitm17",
    href: "https://www.linkedin.com/in/ankitm17/",
    note: "Career arc, recommendations, and a still-too-old About section.",
  },
  {
    label: "GitHub",
    value: "github.com/AnkitM17",
    href: "https://github.com/AnkitM17",
    note: "Where I push, sometimes. More writing than code lately.",
  },
];

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          Contact
        </p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          Send a message.
        </h1>
        <p className="mt-6 text-lg text-[var(--text-muted)]">
          Backend architecture, telephony integrations, freelance work, the{" "}
          <em>Black Clover</em> anime adaptation pacing problem — all welcome.
        </p>
      </header>

      <ul className="space-y-6">
        {channels.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 hover:border-[var(--accent)] transition-colors"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                {c.label}
              </p>
              <p className="font-display text-2xl mt-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {c.value}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-2">{c.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

import type { Metadata } from "next";
import { profile } from "@/content";
import { ContactForm } from "@/components/ContactForm";
import { MagicReveal } from "@/components/effects/MagicReveal";
import styles from "@/components/contact.module.css";

export const metadata: Metadata = {
  title: `Contact - ${profile.name}`,
  description: "Send a message, or leave a note about the site itself. Email, LinkedIn, GitHub, and the rest.",
};

const firstName = profile.name.split(" ")[0];
const city = profile.location.split(",")[0].trim();

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 pt-page">
      <header className="mb-stack">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
            Send a message.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-muted)]">
            Backend architecture, enterprise integrations, AI in production, freelance work, the{" "}
            <em>Black Clover</em> anime adaptation pacing problem - all welcome. So is a note about
            this site itself. I read everything that lands in that inbox.
          </p>
        </MagicReveal>
      </header>

      <ContactForm />

      {/* A visible rule owns this boundary, so it takes a half-step either side
          (stack + stack = one section step) rather than a section step plus a
          rule's worth of padding on top of it. */}
      <section className="mt-stack pt-stack border-t border-[var(--border)]">
        <MagicReveal delay={0.2}>
          <h2 className="font-display text-2xl text-[var(--text)] mb-6">Prefer another channel?</h2>
        </MagicReveal>

        <ul className="space-y-6">
          {profile.links.map((c, i) => (
            <MagicReveal key={c.label} delay={0.3 + i * 0.1}>
              <li>
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
            </MagicReveal>
          ))}
        </ul>
      </section>

      {/* The part that is not a transaction: an invitation back, and an
          invitation to say something about the place itself. */}
      <section className="mt-section" aria-labelledby="come-back">
        <MagicReveal delay={0.2}>
          <div
            className={`${styles.ruled} rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-7 md:p-10`}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              Before you go
            </p>
            <h2
              id="come-back"
              className="font-display text-3xl md:text-4xl mt-3 text-[var(--text)] leading-[1.05]"
            >
              Come back whenever.
            </h2>

            <p className="mt-6 text-[var(--text-muted)] leading-relaxed">
              This site is never quite finished, which is the one honest thing about calling it a
              grimoire. Pages get added, the writing gets rewritten, and the dark theme gets nudged
              at odd hours. If you have read this far, there will be something here next time that
              is not here now.
            </p>
            <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
              So come back. And if something struck you on the way through - a page that worked, a
              page that did not, a line you disagreed with - leave a note. I keep every one of them.
            </p>

            <p className="mt-4">
              <a href="#note" className={styles.inkLink}>
                Leave a note on the site
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              </a>
            </p>

            <p className="mt-6 pt-5 border-t border-[var(--border)] font-display text-lg text-[var(--text)]">
              - {firstName}
              <span className="block font-sans text-sm text-[var(--text-subtle)] mt-1">{city}</span>
            </p>
          </div>
        </MagicReveal>
      </section>
    </article>
  );
}

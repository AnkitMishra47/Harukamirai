import type { Metadata } from "next";
import { profile } from "@/content";
import { ContactForm } from "@/components/ContactForm";
import { MagicReveal } from "@/components/effects/MagicReveal";
import styles from "@/components/contact.module.css";

export const metadata: Metadata = {
  title: `Contact - ${profile.name}`,
  description: "Send a message, or leave a note about the site itself. Email, LinkedIn, GitHub, and the rest.",
};

/** Ways to reach Ankit. Profiles flagged personal are not channels. */
const channels = profile.links.filter((l) => !l.personal);

const firstName = profile.name.split(" ")[0];

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 pt-page">
      {/* Frontispiece Header */}
      <header className="mb-stack max-w-3xl">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)] font-mono">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
            Send a message.
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Backend architecture, enterprise integrations, AI in production, freelance work, the{" "}
            <em>Black Clover</em> anime adaptation pacing problem - all welcome. So is a note about
            this site itself. I read everything that lands in that inbox.
          </p>
        </MagicReveal>
      </header>

      {/* Main 2-Column Grid Layout utilizing full screen width with matched heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Direct Message Form */}
        <div className="h-full">
          <MagicReveal direction="left" delay={0.1} className="h-full">
            <div className={`${styles.ruled} rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8 shadow-sm h-full flex flex-col justify-between`}>
              <div>
                <h2 className="font-display text-2xl text-[var(--text)] mb-6">Write a dispatch</h2>
                <ContactForm />
              </div>
            </div>
          </MagicReveal>
        </div>

        {/* Right Column: Alternative Channels & Invitation */}
        <div className="h-full flex flex-col justify-between space-y-6">
          {/* Alternative Channels */}
          <section aria-labelledby="channels-heading">
            <MagicReveal direction="right" delay={0.15}>
              <h2 id="channels-heading" className="font-display text-2xl text-[var(--text)] mb-5">
                Direct Channels
              </h2>
            </MagicReveal>

            <ul className="space-y-4">
              {channels.map((c, i) => (
                <li key={c.label}>
                  <MagicReveal direction="right" delay={0.2 + i * 0.08}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noreferrer" : undefined}
                      className={`${styles.ruled} ${styles.channelCard} group block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 hover:border-[var(--accent)] hover:shadow-md transition-all duration-200`}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
                        {c.label}
                      </p>
                      <p className="font-display text-xl mt-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {c.value ?? c.href}
                      </p>
                      {c.note && (
                        <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                          {c.note}
                        </p>
                      )}
                    </a>
                  </MagicReveal>
                </li>
              ))}
            </ul>
          </section>

          {/* Invitation Note */}
          <section aria-labelledby="come-back">
            <MagicReveal direction="right" delay={0.35}>
              <div
                className={`${styles.ruled} rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8 shadow-sm`}
              >
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--gold)] font-medium">
                  Before you go
                </p>
                <h2
                  id="come-back"
                  className="font-display text-2xl md:text-3xl mt-2 text-[var(--text)] leading-[1.1]"
                >
                  Come back whenever.
                </h2>

                <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
                  This site is never quite finished, which is the one honest thing about calling it a
                  grimoire. Pages get added, writing evolves, and the dark theme gets nudged at odd hours.
                </p>
                <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
                  If something struck you on the way through, leave a note. I keep and reply to every one of them.
                </p>

                <p className="mt-5 pt-4 border-t border-[var(--border)] font-display text-base text-[var(--text)]">
                  — {firstName}
                  <span className="block font-sans text-xs text-[var(--text-subtle)] mt-0.5">
                    {profile.location} · Working {profile.workingHours.zone}
                  </span>
                </p>
              </div>
            </MagicReveal>
          </section>
        </div>
      </div>
    </article>
  );
}

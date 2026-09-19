import Link from "next/link";
import { HeroIntro } from "@/components/HeroIntro";
import { MagicCircle } from "@/components/effects/MagicCircle";
import { MagicReveal, BrushDivider } from "@/components/effects/MagicReveal";
import { Currents } from "@/components/effects/Currents";
import { HoverLift } from "@/components/effects/HoverLift";
import { awards, caseStudies, profile } from "@/content";

export default function HomePage() {
  const featured = caseStudies.filter((c) => c.featured);
  const [newest, previous] = awards;

  return (
    <>
      <HeroIntro />

      {/* CREDIBILITY */}
      <section className="relative border-y border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <MagicCircle size={1200} intensity="subtle" />
        </div>
        {/* Banded section: padding sits inside the tinted box, so it takes both sides. */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-band grid gap-10 md:grid-cols-3">
          <Stat kicker={newest.year} value={newest.title} note="Company-wide award, OneIT." delay={0} />
          <Stat kicker={previous.year} value={previous.title} note="Awarded across OneIT engineering." delay={0.15} />
          <Stat kicker="3 in 3" value="Three Career Milestones" note="Junior Intern to Senior Software Engineer." delay={0.3} />
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pt-section">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Featured spells
          </p>
          <h2 className="font-display text-5xl md:text-6xl mt-2 text-[var(--text)]">
            Things I shipped.
          </h2>
        </MagicReveal>

        <div className="mt-stack grid gap-8 md:grid-cols-5">
          {featured.map((c, i) => (
            <MagicReveal key={c.slug} delay={0.1 + i * 0.15} className={i === 0 ? "md:col-span-3" : "md:col-span-2"}>
              <HoverLift>
                <Link href={`/work#${c.slug}`} className="block h-full">
                  <article
                    className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border p-8 transition-all ${
                      i === 0
                        ? "border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:shadow-[0_20px_60px_-20px_var(--accent-glow)]"
                        : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--accent)] to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{c.kicker}</p>
                    <h3 className="font-display text-3xl mt-3 text-[var(--text)]">{c.title}</h3>
                    {/* Teaser only. The card is a headline: kicker, title, and two
                        lines saying what the system was. The stack and the full
                        write-up live at the destination this card links to, so
                        nothing here is the only copy of anything. `line-clamp`
                        hides the overflow visually but leaves the whole sentence
                        in the DOM for screen readers and crawlers. */}
                    <p className="mt-4 text-[var(--text-muted)] leading-relaxed line-clamp-2">{c.domain}</p>
                    <div className="mt-auto pt-6 flex items-center text-sm font-medium text-[var(--accent)]">
                      <span>Read case study</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 shrink-0 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </article>
                </Link>
              </HoverLift>
            </MagicReveal>
          ))}
        </div>

        <div className="mt-stack text-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-7 py-3.5 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            <span>All work, full timeline</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <Currents />

      {/* No pt-section here: the BrushDivider below already carries my-16, and it
          is a visible reason for the gap. Adding a section step on top of it is
          exactly the doubling this pass removed. No bottom padding either - the
          footer owns the gap above itself. */}
      <section className="mx-auto max-w-3xl px-6">
        <BrushDivider />
        <MagicReveal>
          <p className="font-display text-2xl md:text-3xl leading-relaxed text-[var(--text)]">
            Outside work, I like quiet things - chess, manga, long-format anime,
            the kind of coffee that takes ten minutes to make. The five-leaf
            clover at the top of this page is not a logo; it&apos;s a switch.{" "}
            <span className="text-[var(--accent)]">Click it.</span>
          </p>
        </MagicReveal>
        <div className="mt-stack text-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            <span>More about {profile.name.split(" ")[0]}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ kicker, value, note, delay = 0 }: { kicker: string; value: string; note: string; delay?: number }) {
  return (
    <MagicReveal delay={delay}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{kicker}</p>
      <p className="font-display text-2xl mt-2 text-[var(--text)]">{value}</p>
      <p className="text-sm text-[var(--text-muted)] mt-1.5">{note}</p>
    </MagicReveal>
  );
}

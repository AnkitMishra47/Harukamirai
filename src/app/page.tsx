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
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-14 grid gap-10 md:grid-cols-3">
          <Stat kicker={newest.year} value={newest.title} note="Company-wide award, OneIT." delay={0} />
          <Stat kicker={previous.year} value={previous.title} note="Awarded across OneIT engineering." delay={0.15} />
          <Stat kicker="3 in 3" value="Promotions in three years" note="Junior Intern → Senior Software Engineer." delay={0.3} />
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-28 md:py-36">
        <MagicReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Featured spells
          </p>
          <h2 className="font-display text-5xl md:text-6xl mt-2 text-[var(--text)]">
            Things I shipped.
          </h2>
        </MagicReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-5">
          {featured.map((c, i) => (
            <MagicReveal key={c.slug} delay={0.1 + i * 0.15} className={i === 0 ? "md:col-span-3" : "md:col-span-2"}>
              <HoverLift>
                <article
                  className={`group relative h-full overflow-hidden rounded-2xl border p-8 transition-all ${
                    i === 0
                      ? "border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:shadow-[0_20px_60px_-20px_var(--accent-glow)]"
                      : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
                  }`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{c.kicker}</p>
                  <h3 className="font-display text-3xl mt-3 text-[var(--text)]">{c.title}</h3>
                  <p className="mt-4 text-[var(--text-muted)] leading-relaxed">{c.domain}</p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    {c.stack.slice(0, 5).map((t) => (
                      <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </HoverLift>
            </MagicReveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-7 py-3.5 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            <span>All work, full timeline</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <Currents />

      <section className="mx-auto max-w-3xl px-6 pb-32">
        <BrushDivider />
        <MagicReveal>
          <p className="font-display text-2xl md:text-3xl leading-relaxed text-[var(--text)]">
            Outside work, I like quiet things - chess, manga, long-format anime,
            the kind of coffee that takes ten minutes to make. The five-leaf
            clover at the top of this page is not a logo; it&apos;s a switch.{" "}
            <span className="text-[var(--accent)]">Click it.</span>
          </p>
        </MagicReveal>
        <div className="mt-10 text-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            More about {profile.name.split(" ")[0]}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
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

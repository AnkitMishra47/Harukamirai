import type { Metadata } from "next";
import Image from "next/image";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RichText } from "@/components/RichText";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ClickableImage } from "@/components/ClickableImage";
import { awards, photos, profile, testimonials, timeline } from "@/content";
import styles from "@/components/about.module.css";

export const metadata: Metadata = {
  title: `About - ${profile.name}`,
  description: profile.heroLine.split(". ")[0] + ".",
};

/** Four-point seal, the same shape as the core star in the hero's magic circle. */
function Seal() {
  return (
    <svg viewBox="0 0 12 12" className={styles.seal} aria-hidden focusable="false">
      <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" fill="var(--gold)" />
    </svg>
  );
}

/**
 * A section opening: seal, numeral and a thread of rule, then the heading.
 * The mark itself is decoration, so it is hidden from assistive tech; the <h2>
 * underneath carries the structure.
 */
function ChapterMark({
  numeral,
  title,
  lead,
  centered = false,
}: {
  numeral: string;
  title: string;
  lead: string;
  centered?: boolean;
}) {
  return (
    <MagicReveal>
      <div
        className={`${styles.chapter} ${centered ? styles.chapterCentered : ""}`}
        aria-hidden
      >
        <span
          className={`${styles.thread} ${centered ? styles.threadFadeLeft : styles.threadStub}`}
        />
        <Seal />
        <span className={styles.numeral}>{numeral}</span>
        <span className={`${styles.thread} ${styles.threadFadeRight}`} />
      </div>
      <h2
        className={`font-display text-3xl text-[var(--text)] mt-4 ${centered ? "text-center" : ""}`}
      >
        {title}
      </h2>
      <p
        className={`text-sm text-[var(--text-muted)] mt-2 leading-relaxed ${
          centered ? "text-center mx-auto max-w-xl" : "max-w-2xl"
        }`}
      >
        {lead}
      </p>
    </MagicReveal>
  );
}

export default function AboutPage() {
  const emailLink = profile.links.find((l) => l.label === "Email")!;

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 pt-page">
      {/* FRONTISPIECE - the page opens the way a folio opens. Deliberately not
          wrapped in a scroll reveal: the h1 must never depend on JavaScript. */}
      <header className="mb-stack">
        <div className={styles.rule} aria-hidden />
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            About
          </p>
          <p className="font-jp text-sm text-[var(--gold)]" aria-hidden>
            魔法書
          </p>
        </div>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          The grind, plainspoken.
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--text-muted)]">
          A grimoire is only a record of what someone practised until it worked. This one holds the
          arc, the people who vouched for it, and the hours off the page.
        </p>
        <div className={`${styles.rule} mt-7`} aria-hidden />
      </header>

      {/* PORTRAIT + BIO */}
      <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16 items-start">
        <div className="prose-lg space-y-6 text-lg leading-relaxed text-[var(--text-muted)] order-2 md:order-1">
          {profile.bio.map((para, i) => (
            <p key={para.slice(0, 32)} className={i === 0 ? styles.dropCap : undefined}>
              <RichText text={para} />
            </p>
          ))}
          <p>
            If you want to talk about backend architecture, enterprise integrations, AI in
            production, the <em>Black Clover</em> anime adaptation pacing problem, or freelance
            work -{" "}
            <a
              href={emailLink.href}
              className="text-[var(--text)] underline decoration-[var(--accent)] decoration-1 underline-offset-4 hover:text-[var(--accent)]"
            >
              {emailLink.value}
            </a>
            .
          </p>
        </div>

        <div className="order-1 md:order-2 md:sticky md:top-28">
          <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image
              src={photos.portrait.src}
              alt={photos.portrait.alt}
              fill
              unoptimized
              sizes="(min-width: 768px) 320px, 80vw"
              className="object-cover grayscale-[0.15] transition-all duration-500 hover:grayscale-0"
              placeholder="blur"
              blurDataURL={photos.portrait.blurDataURL}
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">Faridabad · IST</p>
              <p className="font-display text-sm text-white/95 mt-0.5">Working AEDT hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AWARDS */}
      <section className="mt-section">
        <ChapterMark
          numeral="I"
          title="Recognition"
          lead="Two consecutive years of company-wide recognition at OneIT, awarded by executive leadership."
        />

        <div className="mt-stack grid gap-8 md:grid-cols-[260px_1fr] items-center">
          <ClickableImage
            src={photos.awardTrophy.src}
            alt={photos.awardTrophy.alt}
            fill
            unoptimized
            sizes="(min-width: 768px) 260px, 80vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={photos.awardTrophy.blurDataURL}
            wrapperClassName="relative aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
          />

          <div className="space-y-5">
            {awards.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition-colors hover:border-[var(--accent)]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{a.year}</p>
                <p className="font-display text-xl mt-2 text-[var(--text)]">{a.title}</p>
                <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PEER TESTIMONIALS */}
      <section className="mt-section">
        <ChapterMark
          numeral="II"
          title="From peers"
          lead="Excerpts from internal peer nominations submitted at OneIT in 2025. Names removed; wording is theirs."
          centered
        />

        <MagicReveal className="mt-stack">
          <TestimonialCarousel testimonials={testimonials} />
        </MagicReveal>
      </section>

      {/* ARC */}
      <section className="mt-section">
        <ChapterMark
          numeral="III"
          title="The arc"
          lead={"Three promotions in three years, while completing a Master’s. That’s the headline, not “proficient in Java, Angular, TypeScript.”"}
        />

        <ol className="mt-stack relative border-l border-[var(--border)] pl-6 space-y-7">
          {timeline.map((step, i) => (
            <li key={step.id} className="relative">
              <MagicReveal delay={i * 0.1}>
                <span
                  className="absolute -left-[30px] top-1 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)]"
                  aria-hidden
                />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{step.date}</p>
                <p className="font-display text-xl text-[var(--text)] mt-0.5">{step.title}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{step.note}</p>
              </MagicReveal>
            </li>
          ))}
        </ol>
      </section>

      {/* OFF THE CLOCK */}
      <section className="mt-section">
        <ChapterMark
          numeral="IV"
          title="Off the clock"
          lead={"Hills, rivers, and the occasional barefoot walk. Faridabad is flat; the mountains are a night’s drive."}
          centered
        />

        <MagicReveal className="mt-stack">
          <PhotoGallery photos={photos.offTheClock} />
        </MagicReveal>
      </section>

      {/* SLOGAN BANNER */}
      <section className="mt-section">
        <MagicReveal>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-[var(--border)]">
            <Image
              src={photos.openRoad.src}
              alt={photos.openRoad.alt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL={photos.openRoad.blurDataURL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 md:p-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/75">Personal motto</p>
                <p className="font-display text-4xl md:text-5xl text-white mt-3 leading-tight">
                  &ldquo;{profile.motto.en}&rdquo;
                </p>
                <p className="font-jp text-base text-white/70 mt-2">{profile.motto.jp}</p>
              </div>
            </div>
          </div>
        </MagicReveal>
      </section>
    </article>
  );
}

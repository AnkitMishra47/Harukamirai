import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { caseStudies, photos, profile } from "@/content";

export const metadata: Metadata = {
  title: `Work - ${profile.name}`,
  description: "Anonymised case studies from OneIT plus independent client work. Real architecture, real stack.",
};

export default function WorkPage() {
  const independent = caseStudies.filter((c) => c.org === "independent");
  const oneit = caseStudies.filter((c) => c.org === "oneit");

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 pt-page">
      {/* The one photograph on this page. It is the desk, not the product: the
          case studies below are anonymised NDA work, so the only honest
          picture of them is a picture of where they were written. Second in
          source order so the <h1> stays the mobile LCP candidate, and lazy
          (no `priority`) so it never blocks the first paint. It is also the
          only <Image> on the site that goes through the Next optimizer - see
          the note on <sizes> below. */}
      <header className="mb-stack">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16">
          <MagicReveal direction="left">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">Work</p>
            <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
              Built, shipped, owned.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--text-muted)] leading-relaxed">
              Most of what I&apos;ve shipped lives behind OneIT customer logins. The case studies
              below are anonymised - same systems, real architecture, real stack. Numbers are kept
              off the page because the work is under NDA; the patterns and integrations are honest.
            </p>
          </MagicReveal>

          <MagicReveal direction="right" delay={0.12}>
            <figure className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] lg:mx-0">
              {/* The frame is the file's own 899x682, so object-cover never
                  actually crops and the photo is not upscaled past its pixels. */}
              {/* Deliberately NOT `unoptimized`, which the rest of the site's
                  images carry: that flag kills srcset and ships the raw file,
                  which here is 175 KB to every phone. Through the optimizer a
                  phone picks the 750w WebP. Measured on this file: 34.4 KB at
                  q75, 29.3 KB at q62, and at a 2x downscale into a 342px frame
                  the two are indistinguishable. */}
              <div className="relative aspect-[899/682]">
                <Image
                  src={photos.setup.src}
                  alt={photos.setup.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 56vw, 92vw"
                  quality={62}
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={photos.setup.blurDataURL}
                />
              </div>
              {/* The caption is a plate under the picture rather than an
                  overlay. Measured: the bottom of this photo runs from rgb(26,22,16)
                  to a near-white specular highlight, so overlaid text would have
                  needed a ~75% black wash to clear 4.5:1 and the photograph
                  would have been thrown away to carry six words. Down here the
                  text is --text-subtle on --bg-elevated: 5.14:1 in leaf-4,
                  6.79:1 in leaf-5. */}
              <figcaption className="flex items-center gap-2.5 border-t border-[var(--border)] px-4 py-3">
                <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  {photos.setup.caption}
                </span>
              </figcaption>
            </figure>
          </MagicReveal>
        </div>
      </header>

      {/* ONEIT CASE STUDIES - no pt-section: the page header above owns this
          boundary (mb-stack), because a header and its first section read as
          one opening movement. Every section after this one owns its own. */}
      <section>
        <MagicReveal direction="left">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Inside OneIT · Selected work
          </p>
          <h2 className="font-display text-4xl mt-3 text-[var(--text)]">
            {oneit.length === 1 ? "One system" : `${numberWord(oneit.length)} systems`} I&apos;ve had my hands on.
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
            Client names removed. Architecture, stack, and outcomes are real.
          </p>
        </MagicReveal>

        <CaseStudyGrid studies={oneit} />
      </section>

      {/* INDEPENDENT CLIENT WORK */}
      {independent.length > 0 && (
        <section className="pt-section">
          <MagicReveal direction="left">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              Featured · Independent client work
            </p>
            <h2 className="font-display text-4xl mt-3 text-[var(--text)]">Outside the day job.</h2>
          </MagicReveal>
          <CaseStudyGrid studies={independent} />
        </section>
      )}

      {/* CAREER OWNERSHIP BRIDGE */}
      <section className="pt-section">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-transparent" />
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
              End-to-End Delivery & Progression
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3 text-[var(--text)] leading-tight">
              From Junior Intern to Senior Engineer in three years.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
              Every system on this page was delivered while working full-time across Australian timezones, owning backend APIs, database architecture, third-party middleware, and production RAG pipelines.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--bg)] px-6 py-3 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
              >
                <span aria-hidden>&larr;</span>
                <span>Return to Homepage Overview</span>
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>Read the personal arc & nominations</span>
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline px-2 py-3"
              >
                <span>View verified resume</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-section text-center">
        <MagicReveal delay={0.5}>
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-8 py-4 text-sm text-[var(--bg)] font-medium transition-all hover:shadow-[0_0_30px_var(--accent-glow)]"
          >
            <span className="relative z-10">Talk to me</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="absolute inset-0 -translate-x-full bg-[var(--accent-hover)] transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </MagicReveal>
      </div>
    </article>
  );
}

function numberWord(n: number) {
  return ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][n] ?? String(n);
}



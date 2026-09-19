import type { Metadata } from "next";
import Image from "next/image";
import { PhotoStrip } from "@/components/PhotoStrip";
import { RichText } from "@/components/RichText";
import { awards, photos, profile, skills, testimonials, timeline } from "@/content";

export const metadata: Metadata = {
  title: `About - ${profile.name}`,
  description: profile.heroLine.split(". ")[0] + ".",
};

export default function AboutPage() {
  const emailLink = profile.links.find((l) => l.label === "Email")!;

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-12 py-20 md:py-28">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">About</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 text-[var(--text)] leading-[1.02]">
          The grind, plainspoken.
        </h1>
      </header>

      {/* PORTRAIT + BIO */}
      <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16 items-start">
        <div className="prose-lg space-y-6 text-lg leading-relaxed text-[var(--text-muted)] order-2 md:order-1">
          {profile.bio.map((para) => (
            <p key={para.slice(0, 32)}>
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
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">Recognition</h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Two consecutive years of company-wide recognition at OneIT, awarded by executive leadership.
        </p>

        <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start">
          <div className="relative aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image
              src={photos.awardTrophy.src}
              alt={photos.awardTrophy.alt}
              fill
              unoptimized
              sizes="(min-width: 768px) 260px, 80vw"
              className="object-cover"
            />
          </div>

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
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">From peers</h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Excerpts from internal peer nominations submitted at OneIT in 2025. Names removed;
          wording is theirs.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.quote.slice(0, 24)}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition-colors hover:border-[var(--accent)]"
            >
              <span className="font-display text-4xl leading-none text-[var(--accent)] select-none block mb-2" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="text-[var(--text-muted)] leading-relaxed text-sm">{t.quote}</blockquote>
              <figcaption className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                - {t.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ARC */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">The arc</h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Three promotions in three years, while completing a Master&apos;s. That&apos;s the
          headline - not &ldquo;proficient in Java, Angular, TypeScript.&rdquo;
        </p>

        <ol className="relative border-l border-[var(--border)] pl-6 space-y-7">
          {timeline.map((step) => (
            <li key={step.id} className="relative">
              <span
                className="absolute -left-[30px] top-1 block size-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)]"
                aria-hidden
              />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{step.date}</p>
              <p className="font-display text-xl text-[var(--text)] mt-0.5">{step.title}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">{step.note}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SKILLS */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">Stack, as on the resume</h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          No wall of logos. Grouped the way I actually use them.
        </p>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {skills.map((g) => (
            <div key={g.id}>
              <p className="font-display text-xl text-[var(--text)] mb-3">{g.label}</p>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-sm text-[var(--text-muted)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* OFF THE CLOCK */}
      <section className="mt-24">
        <h2 className="font-display text-3xl text-[var(--text)] mb-2">Off the clock</h2>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          Hills, rivers, and the occasional barefoot walk. Faridabad is flat; the mountains are a
          night&apos;s drive.
        </p>
        <PhotoStrip photos={photos.offTheClock} />
      </section>

      {/* SLOGAN BANNER */}
      <section className="mt-28">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-[var(--border)]">
          <Image
            src={photos.openRoad.src}
            alt={photos.openRoad.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover object-center"
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
      </section>
    </article>
  );
}

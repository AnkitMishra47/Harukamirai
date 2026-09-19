"use client";

import { ClickableImage } from "@/components/ClickableImage";
import { photos, awards } from "@/content";

import { MagicReveal } from "@/components/effects/MagicReveal";

export function RecognitionGrid() {
  const handleTriggerRelic = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("grimoire-relic-discover", {
          detail: { relicId: "trophy" },
        })
      );
    }
  };

  return (
    <div className="mt-stack grid gap-8 md:grid-cols-[280px_1fr] items-center max-w-5xl mx-auto">
      {/* Award Trophy Photo with Relic Trigger */}
      <MagicReveal direction="left">
        <div 
          onClick={handleTriggerRelic}
          onMouseEnter={handleTriggerRelic}
          className="cursor-pointer group relative"
        >
          <ClickableImage
            src={photos.awardTrophy.src}
            alt={photos.awardTrophy.alt}
            fill
            unoptimized
            sizes="(min-width: 768px) 280px, 80vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={photos.awardTrophy.blurDataURL}
            wrapperClassName="relative aspect-[3/4] w-full max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-[var(--bg-elevated)] shadow-lg"
          />
          <div className="mt-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--gold)] opacity-80 group-hover:opacity-100 transition-opacity">
              🏆 <span>Click trophy to inspect Honours</span>
            </span>
          </div>
        </div>
      </MagicReveal>

      {/* Award Cards with Hover & Discovery */}
      <MagicReveal direction="right" delay={0.1} className="space-y-5">
        {awards.map((a, i) => (
          <div
            key={a.title}
            onClick={handleTriggerRelic}
            onMouseEnter={handleTriggerRelic}
            className={`group rounded-2xl border border-[var(--border)] border-l-[5px] border-l-[color-mix(in_oklab,var(--gold)_75%,#5a3014)] bg-gradient-to-br from-[var(--bg-elevated)] via-[color-mix(in_oklab,var(--bg-elevated)_90%,#5c381e)] to-[var(--bg-elevated)] p-6 transition-all duration-300 hover:border-[var(--gold)]/80 hover:shadow-[0_12px_32px_-10px_rgba(201,169,110,0.2)] hover:-translate-y-1 hover:rotate-0 cursor-pointer ${
              i % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.6deg]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--gold)] font-medium">
                {a.year}
              </p>
              <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ✦
              </span>
            </div>
            <p className="font-display text-xl mt-2 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
              {a.title}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              {a.body}
            </p>
          </div>
        ))}
      </MagicReveal>
    </div>
  );
}

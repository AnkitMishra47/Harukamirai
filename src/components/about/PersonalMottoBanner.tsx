import Image from "next/image";
import { photos, profile } from "@/content";

export function PersonalMottoBanner() {
  return (
    <div className="relative h-[380px] sm:h-[440px] overflow-hidden rounded-3xl border border-[var(--gold)]/35 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] group">
      <Image
        src={photos.openRoad.src}
        alt={photos.openRoad.alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 1280px, 100vw"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
        placeholder="blur"
        blurDataURL={photos.openRoad.blurDataURL}
      />
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.15),transparent_65%)]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 md:p-14">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[var(--gold)] text-sm">✦</span>
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-[var(--gold)] font-medium">
              The Driving Resolve · Haruka Mirai
            </p>
          </div>
          
          <p className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-medium leading-[1.12]">
            &ldquo;{profile.motto.en}&rdquo;
          </p>

          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <p className="font-jp text-base md:text-lg text-white/80 tracking-widest font-light">
              {profile.motto.jp}
            </p>
            <span className="text-white/30 hidden sm:inline">|</span>
            <p className="font-sans text-xs text-white/70">
              The mindset behind three promotions, 25M+ vectors, and sustained remote execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { photos, profile } from "@/content";

export function AboutPortraitTimezone() {
  const handleTriggerAWST = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("grimoire-relic-discover", {
          detail: { relicId: "compass" },
        })
      );
    }
  };

  return (
    <div className="order-1 md:order-2 md:sticky md:top-28">
      <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg group">
        <Image
          src={photos.portrait.src}
          alt={photos.portrait.alt}
          fill
          unoptimized
          sizes="(min-width: 768px) 320px, 80vw"
          className="object-cover grayscale-[0.12] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
          placeholder="blur"
          blurDataURL={photos.portrait.blurDataURL}
          priority
        />
        
        {/* Interactive AWST Timezone Relic Overlay */}
        <div
          onClick={handleTriggerAWST}
          onMouseEnter={handleTriggerAWST}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 cursor-pointer transition-all duration-300 hover:from-black/95"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleTriggerAWST();
          }}
          title="Click to discover the AWST Synchronizer Compass"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 flex items-center gap-1.5">
              <span>{profile.location} · IST</span>
            </p>
            <span className="text-xs opacity-75 group-hover:opacity-100 transition-opacity">🧭</span>
          </div>
          <p className="font-display text-sm text-white/95 mt-1 flex items-center gap-1.5 font-medium">
            <span>Working {profile.workingHours.zone} hours ({profile.workingHours.offset})</span>
          </p>
          <p className="text-[10px] text-[var(--gold)] mt-1 font-mono tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            ✦ Remote Delivery Across Australia & Global
          </p>
        </div>
      </div>
    </div>
  );
}

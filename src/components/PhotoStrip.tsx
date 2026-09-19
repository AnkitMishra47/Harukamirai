"use client";

import Image from "next/image";
import type { Photo } from "@/content/types";
import styles from "./photo-strip.module.css";

/**
 * A row of photographs at their true aspect ratios, sharing one height, the way
 * prints land on a contact sheet.
 *
 * Each print's width is derived from its own shape rather than forced into a
 * shared frame, which is what keeps them sharp: a landscape photo in a portrait
 * slot has to be cropped and upscaled to cover, and `hills-walk.jpeg`
 * (1448x1086) was losing 44% of its width and gaining a 1.4x upscale that way.
 * Nothing here is ever cropped.
 *
 * The layout maths lives in photo-strip.module.css: one shared height `--h` and
 * `width = --h * aspect`. This file only feeds it the ratios.
 *
 * The strip is the selector for `PhotoGallery`: it is centred, it wraps on
 * narrow screens, and the marked print is the one on the stage above it.
 */
export function PhotoStrip({
  photos,
  activeIndex,
  onSelect,
  controls,
}: {
  photos: readonly Photo[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** id of the element the strip drives, for `aria-controls`. */
  controls?: string;
}) {
  return (
    <div className={styles.strip}>
      {photos.map((photo, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={photo.src}
            type="button"
            onClick={() => onSelect(i)}
            aria-controls={controls}
            aria-current={active ? "true" : undefined}
            aria-label={`Show photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
            className={`${styles.thumb} ${active ? styles.isActive : ""}`}
            style={{ "--ar-num": (photo.width / photo.height).toFixed(4) } as React.CSSProperties}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="120px"
              {...(photo.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                : {})}
            />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Photo } from "@/content/types";
import { PhotoStrip } from "./PhotoStrip";
import { Lightbox } from "./Lightbox";
import styles from "./photo-gallery.module.css";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const numeral = (n: number) => NUMERALS[n] ?? String(n + 1);

/**
 * The caption as a museum plate writes it: the name of the print, then where it
 * was taken when `photos.ts` records a location. It is one phrase, not two
 * fields, which is what keeps the four prints with no confirmed location
 * reading as a whole line rather than one with a gap in it. A location is only
 * ever shown when it is in the content module; none is inferred here.
 */
function plateCaption(photo: Photo) {
  if (!photo.caption) return photo.location;
  return photo.location ? `${photo.caption}, ${photo.location}` : photo.caption;
}

/**
 * The off-the-clock gallery: one print at a time, mounted on a board, with the
 * contact sheet underneath as the selector.
 *
 * WHY A MOUNT BOARD. The photos are a mix of landscape and portrait, so any
 * single frame shaped to one of them has to crop the others. The board is a
 * fixed shape, the print is laid on it at its own aspect ratio and centred, and
 * the leftover board is the margin. Nothing is cropped and nothing is upscaled:
 * the board is capped at 700px wide, so the widest print ever asked for is
 * 700x525 CSS px (1400x1050 at 2x), inside every source file in the set.
 *
 * The lightbox is the same idea at full size; the board becomes the backdrop.
 */
export function PhotoGallery({ photos }: { photos: readonly Photo[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduce = useReducedMotion();
  const stageId = useId();

  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);

  const goTo = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setIndex((next + photos.length) % photos.length);
    },
    [photos.length],
  );

  const step = useCallback(
    (delta: number) => goTo(index + delta, delta),
    [goTo, index],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  }

  const photo = photos[index];
  const caption = plateCaption(photo);
  const shift = reduce ? 0 : 24;

  return (
    <div className={styles.gallery} onKeyDown={onKeyDown}>
      <div className={styles.stage}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => step(-1)}
          aria-label="Previous photo"
        >
          <Chevron dir="left" />
        </button>

        <div
          id={stageId}
          className={styles.mount}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
            swiped.current = false;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1);
            }
          }}
        >
          <Corners />
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={photo.src}
              type="button"
              className={styles.print}
              onClick={() => {
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                setLightboxOpen(true);
              }}
              aria-label={`Open ${caption ?? "photo"} full size`}
              initial={{ opacity: 0, x: dir * shift }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -shift }}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                unoptimized
                sizes="(min-width: 768px) 720px, 100vw"
                className={styles.printImg}
                {...(photo.blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                  : {})}
              />
            </motion.button>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => step(1)}
          aria-label="Next photo"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <p className={styles.plateLine} aria-live="polite">
        <span className={styles.plateNo}>Plate {numeral(index)}</span>
        {caption && <span className={styles.plateName}>{caption}</span>}
      </p>

      <PhotoStrip photos={photos} activeIndex={index} onSelect={(i) => goTo(i, i > index ? 1 : -1)} controls={stageId} />

      <Lightbox
        images={photos.map((p) => ({
          src: p.src,
          alt: p.alt,
          caption: plateCaption(p),
          width: p.width,
          height: p.height,
        }))}
        currentIndex={index}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(i) => goTo(i, i > index ? 1 : -1)}
      />
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        d={dir === "left" ? "M15 4 L7 12 L15 20" : "M9 4 L17 12 L9 20"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Gilt brackets at the four corners of the board, as on a mounted plate. */
function Corners() {
  return (
    <>
      <span className={`${styles.corner} ${styles.tl}`} aria-hidden />
      <span className={`${styles.corner} ${styles.tr}`} aria-hidden />
      <span className={`${styles.corner} ${styles.bl}`} aria-hidden />
      <span className={`${styles.corner} ${styles.br}`} aria-hidden />
    </>
  );
}

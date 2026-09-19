import Image from "next/image";
import type { Photo } from "@/content/types";
import styles from "./photo-strip.module.css";

/** Container width the strip sits in on desktop: max-w-7xl (1280px) less px-12 (96px). */
const CONTAINER = 1184;
const GAP = 16;

/**
 * A row of photographs at their true aspect ratios, sharing one height.
 *
 * Each photo's width is derived from its own shape rather than forced into a
 * shared frame, which is what keeps them sharp: a landscape photo in a portrait
 * slot has to be cropped and upscaled to cover, and `hills-walk.jpeg`
 * (1448x1086) was losing 44% of its width and gaining a 1.4x upscale that way.
 *
 * The layout maths lives in photo-strip.module.css; this file only feeds it the
 * ratios and works out matching `sizes` hints so next/image requests the right
 * source width.
 */
export function PhotoStrip({ photos }: { photos: readonly Photo[] }) {
  const ratios = photos.map((p) => p.width / p.height);
  const ratioSum = ratios.reduce((a, b) => a + b, 0);
  const available = CONTAINER - GAP * (photos.length - 1);

  return (
    <div className={styles.strip}>
      {photos.map((photo, i) => {
        const share = ratios[i] / ratioSum;
        // Desktop: a fixed slice of the 1184px container.
        const wide = Math.round(available * share);
        // Tablet: the container tracks the viewport, so the slice does too.
        const mid = (share * (available / CONTAINER) * 100).toFixed(1);

        return (
          <figure
            key={photo.src}
            className={styles.frame}
            style={
              {
                "--ar": `${photo.width} / ${photo.height}`,
                "--ar-num": ratios[i].toFixed(4),
              } as React.CSSProperties
            }
          >
            <div className={styles.plate}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                sizes={`(min-width: 1024px) ${wide}px, (min-width: 640px) ${mid}vw, 100vw`}
              />
            </div>
            {photo.caption && <figcaption className={styles.caption}>{photo.caption}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}

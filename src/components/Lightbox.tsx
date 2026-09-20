"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./lightbox.module.css";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Intrinsic pixel size of the file, when the caller knows it. With it the
   * frame is the photograph's own shape, so the print is never letterboxed
   * inside a box that swallows backdrop clicks; without it the image falls back
   * to being contained in a 92vw x 76vh box.
   */
  width?: number;
  height?: number;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * A single plate lifted out of the book and held against the dark.
 *
 * The backdrop is a plain radial gradient rather than a backdrop-filter: a
 * full-viewport blur is the single most expensive thing this site could paint,
 * and an ink vignette separates the print from the page just as well.
 *
 * Chrome here is drawn from the fixed grimoire materials (--gilt, --parchment)
 * rather than the theme tokens, because the backdrop is ink in both themes and
 * leaf-4's --gold is far too dark to sit on it.
 *
 * IT RENDERS INTO `document.body`, THROUGH A PORTAL.
 *
 * `position: fixed` is only fixed to the viewport while no ancestor has made
 * itself a containing block, and a transform of ANY kind does exactly that -
 * including `matrix(1, 0, 0, 1, 0, 0)`, which is the identity, moves nothing,
 * and is what `MagicReveal` leaves behind on every element it has finished
 * revealing. Opened from inside one, this dialog laid itself out against that
 * div rather than the screen: measured at 1440x900, a backdrop 1184x659 at
 * (123, 188), with the page still showing around it and the close button and
 * arrows pinned to the wrong box.
 *
 * A portal is the fix rather than hunting transforms out of ancestors, because
 * the next transform someone adds anywhere above a gallery would bring the bug
 * straight back.
 */
export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  /**
   * The portal host, resolved after mount. `document` does not exist while this
   * renders on the server, and the dialog has nothing to contribute to the
   * initial HTML anyway - it is closed until somebody clicks a photograph.
   */
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const many = images.length > 1;

  // Focus capture and focus restore. The scroll lock is `data-scroll-lock`
  // on the backdrop below, not an effect - see globals.css.
  useEffect(() => {
    if (!isOpen) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      restoreTo.current?.focus?.();
    };
  }, [isOpen]);

  // Escape, arrow keys, and a Tab trap so focus cannot wander back to the page
  // underneath while the dialog is up.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && many) {
        e.preventDefault();
        onNavigate((currentIndex - 1 + images.length) % images.length);
        return;
      }
      if (e.key === "ArrowRight" && many) {
        e.preventDefault();
        onNavigate((currentIndex + 1) % images.length);
        return;
      }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const stops = Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (stops.length === 0) {
        e.preventDefault();
        return;
      }
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, currentIndex, images.length, many, onClose, onNavigate]);

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  const image = images[currentIndex];

  if (!portalHost) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          data-scroll-lock
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={image.caption ? `Photo: ${image.caption}` : "Photo"}
          tabIndex={-1}
          className={styles.backdrop}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <button
            type="button"
            className={`${styles.chip} ${styles.close}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close photo"
          >
            <Glyph kind="close" />
          </button>

          {many && (
            <>
              <button
                type="button"
                className={`${styles.chip} ${styles.navPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + images.length) % images.length);
                }}
                aria-label="Previous photo"
              >
                <Glyph kind="left" />
              </button>
              <button
                type="button"
                className={`${styles.chip} ${styles.navNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % images.length);
                }}
                aria-label="Next photo"
              >
                <Glyph kind="right" />
              </button>
            </>
          )}

          <motion.figure
            key={image.src}
            className={styles.figure}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
          >
            {image.width && image.height ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                unoptimized
                className={styles.photo}
              />
            ) : (
              <span className={styles.photoBox}>
                <Image src={image.src} alt={image.alt} fill unoptimized className={styles.contain} />
              </span>
            )}

            {(image.caption || many) && (
              <figcaption className={styles.caption}>
                {many && (
                  <span className={styles.counter}>
                    {currentIndex + 1} / {images.length}
                  </span>
                )}
                {image.caption && <span>{image.caption}</span>}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    portalHost,
  );
}

function Glyph({ kind }: { kind: "close" | "left" | "right" }) {
  const d =
    kind === "close"
      ? "M6 6 L18 18 M18 6 L6 18"
      : kind === "left"
        ? "M15 4 L7 12 L15 20"
        : "M9 4 L17 12 L9 20";
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

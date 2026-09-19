"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Testimonial } from "@/content/types";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  return (
    <div 
      className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 md:p-12 transition-colors hover:border-[var(--accent)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[180px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full text-center"
          >
            <span className="font-display text-4xl md:text-5xl leading-none text-[var(--accent)] select-none block mb-4" aria-hidden>
              &ldquo;
            </span>
            <blockquote className="text-[var(--text-muted)] leading-relaxed text-base md:text-lg mb-6">
              {testimonials[currentIndex].quote}
            </blockquote>
            <figcaption className="font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              - {testimonials[currentIndex].attribution}
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The dot stays 6px tall; the button around it is 28x28 so the touch
          target clears the 24px minimum without changing how the row reads. */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-0.5">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className="group grid size-7 place-items-center rounded-full"
            aria-label={`Go to testimonial ${idx + 1}`}
            aria-current={idx === currentIndex ? "true" : undefined}
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-[var(--accent)]"
                  : "w-1.5 bg-[var(--border-strong)] group-hover:bg-[var(--text-subtle)]"
              }`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors hidden md:inline-flex items-center justify-center cursor-pointer"
        aria-label="Previous testimonial"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors hidden md:inline-flex items-center justify-center cursor-pointer"
        aria-label="Next testimonial"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

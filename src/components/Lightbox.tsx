"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
        if (e.key === "ArrowRight") onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 md:p-4 text-white hover:bg-white/20 transition-colors z-[60]"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
                }}
              >
                ←
              </button>
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 md:p-4 text-white hover:bg-white/20 transition-colors z-[60]"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
                }}
              >
                →
              </button>
            </>
          )}

          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-[60]"
            onClick={onClose}
          >
            ✕
          </button>

          <div 
            className="relative h-full w-full max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              unoptimized
              className="object-contain"
            />
            {images[currentIndex].caption && (
              <p className="absolute bottom-4 left-0 right-0 text-center text-white/90 bg-black/50 p-2 md:p-3 text-sm md:text-base max-w-2xl mx-auto rounded-lg">
                {images[currentIndex].caption}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

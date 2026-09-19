"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Lightbox } from "./Lightbox";

interface ClickableImageProps extends ImageProps {
  caption?: string;
  className?: string;
  wrapperClassName?: string;
}

export function ClickableImage({ caption, wrapperClassName, ...props }: ClickableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert the single image to the Lightbox photos array format
  const photos = [{
    src: props.src as string,
    alt: props.alt,
    caption,
  }];

  return (
    <>
      <div 
        className={`cursor-pointer transition-transform duration-300 hover:scale-105 w-full h-full ${wrapperClassName || ""}`}
        onClick={() => setIsOpen(true)}
      >
        <Image {...props} />
      </div>
      <Lightbox
        images={photos}
        currentIndex={0}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={() => {}}
      />
    </>
  );
}

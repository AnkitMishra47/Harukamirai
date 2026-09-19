"use client";

import dynamic from "next/dynamic";

const GrimoireDynamic = dynamic(() => import("./Grimoire").then((m) => m.Grimoire), {
  ssr: false,
});

/**
 * Loads `Grimoire` (and with it the `motion` library) in its own chunk after
 * first paint. The wrapper reserves the book's exact footprint so nothing
 * shifts when the chunk arrives.
 */
export function GrimoireLazy({ size = 400 }: { size?: number }) {
  return (
    <div aria-hidden={false} style={{ width: size, height: size * 1.15 }}>
      <GrimoireDynamic size={size} />
    </div>
  );
}

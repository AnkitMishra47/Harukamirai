"use client";

import dynamic from "next/dynamic";

const GrimoireDynamic = dynamic(() => import("./Grimoire").then((m) => m.Grimoire), {
  ssr: false,
});

/**
 * Loads `Grimoire` (and with it the `motion` library) in its own chunk after
 * first paint. The wrapper reserves the book's exact footprint from the same
 * `--grimoire-w` the book itself uses, so nothing shifts when the chunk lands.
 */
export function GrimoireLazy() {
  return (
    <div style={{ width: "var(--grimoire-w)", height: "calc(var(--grimoire-w) * 1.15)" }}>
      <GrimoireDynamic />
    </div>
  );
}

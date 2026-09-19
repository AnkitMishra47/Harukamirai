# Grimoire, made instant: Lighthouse

All runs: Lighthouse 12.8.2 via `npx lighthouse`, headless Chrome
(`--headless=new --no-sandbox --disable-gpu`), mobile profile (simulated slow
4G, 4x CPU slowdown), performance category only, local `next start` on port
3100, same machine, same day (2026-09-19).

Scores on this machine move by up to 6 points between identical runs, so
every route was sampled more than once and the foundation was re-measured
alongside rather than quoted from its own document.

## Home (`/`)

| Metric | Foundation `1415494` (2 runs) | This branch `94b5844` (3 runs) |
|---|---|---|
| Performance score | 93, 96 | 90, 96, 91 |
| First Contentful Paint | 0.8 s, 0.8 s | 0.9 s, 0.8 s, 0.9 s |
| Largest Contentful Paint | 2.9 s, 2.9 s | 3.1 s, 2.4 s, 2.6 s |
| Total Blocking Time | 180 ms, 60 ms | 200 ms, 150 ms, 270 ms |
| Speed Index | 1.6 s, 1.5 s | 3.3 s, 1.5 s, 1.6 s |
| Total byte weight | 338 KiB | 342 KiB |
| First-load JS (`next build`) | 167 kB | 118 kB |
| Script Evaluation (main thread) | 974 ms, 898 ms | 713 ms |
| Cumulative Layout Shift | 0 | 0 |

## Other routes (this branch)

| Route | Score | FCP | LCP | TBT | Speed Index | Bytes | First-load JS (was) |
|---|---|---|---|---|---|---|---|
| `/resume` | 94, 93 | 0.8 s | 3.1 s, 3.1 s | 40 ms, 120 ms | 1.6 s, 1.7 s | 322 KiB | 111 kB (158 kB) |
| `/work` | 97, 97 | 1.0 s, 0.9 s | 2.6 s, 2.6 s | 40 ms, 40 ms | 1.0 s, 0.9 s | 277 KiB | 110 kB (151 kB) |

`/about`, `/contact` and the other static routes share the 105 kB base and
were not re-measured.

## Targets

- First-load JS for `/` under 120 kB: met (118 kB, from 167 kB).
  `motion/react` is imported only by `src/components/effects/Grimoire.tsx`,
  which `GrimoireLazy` loads in its own chunk after first paint.
- Score 95+: not met on the median. Home samples 90 / 96 / 91 against the
  foundation's 93 / 96 on the same box. The difference is inside the
  run-to-run spread; the branch is not measurably slower or faster on score.
- LCP under 1.5 s: not met. Home LCP 2.4-3.1 s (median 2.6 s) against the
  foundation's 2.9 s. The LCP element in every home trace is the nav
  wordmark, `<span class="font-display text-lg ...">`, with the breakdown
  TTFB 463 ms, load delay 0, load time 0, render delay 2,620 ms. The wordmark
  is set in Fraunces, self-hosted as a 68,748 byte woff2 with
  `display: "swap"` (`src/app/layout.tsx:15-20`). On the simulated slow 4G
  profile that render delay is font and style bound, not script bound:
  Style & Layout is the largest main-thread bucket in both foundation and
  branch traces (about 1.25-1.3 s), and cutting 49 kB of first-load JS moved
  Script Evaluation from about 900-970 ms to 713 ms without moving LCP much.
  Closing the LCP gap is a fonts and critical-CSS question, outside this
  branch's scope (cost of decoration, not the type pipeline).

## What this branch changed on the wire

- `feTurbulence` filters (two per book, re-rasterised on every transform)
  replaced by one 8,476 byte tiling PNG, requested once.
- Every continuous animation (rings, sparks, aura, steam, page flip, knight,
  clover ring and glow, reveals, hover lift, nav panel, theme burst) is a CSS
  keyframe or transition on `transform` and `opacity`.
- Hero parallax is one passive scroll listener writing `--hero-p`; the circle
  and book read it in `calc()`.
- The remaining `motion` usage is the cover flip, page turns, ribbon springs
  and the light-beam entrance inside `Grimoire`, all gated behind
  `next/dynamic` with `ssr: false` and a size-matched placeholder (CLS 0).

# Foundation: Lighthouse before and after

Both runs: Lighthouse 12 via `npx lighthouse`, headless Chrome, mobile profile
(simulated slow 4G, 4x CPU slowdown), performance category only.

- Before: live `https://www.harukamirai.engineer/` on 2026-09-19 (commit 5e3a7c3).
- After: local `next start` of `feature/Feature-ContentModule` at commit "Fonts:
  self-host Fraunces and Geist subsets", same day.

| Metric | Before (live) | After (foundation) |
|---|---|---|
| Performance score | 54 | 95 |
| First Contentful Paint | 2.7 s | 0.9 s |
| Largest Contentful Paint | 23.7 s | 2.9 s |
| Speed Index | 11.9 s | 1.5 s |
| Total Blocking Time | 330 ms | 60 ms |
| Total byte weight | 4,425 KiB | 338 KiB |
| Font files / bytes | 138 / 4.26 MB | 3 / 114 KB |
| Font preload tags | 125 | 3 |
| JS transfer | 194 KB | 185 KB |

## What moved it

1. Shippori Mincho replaced by a 9 KB self-hosted glyph subset (was every
   Google unicode-range slice, preloaded).
2. Fraunces and Geist self-hosted as Latin subsets; JetBrains Mono dropped for
   the system monospace stack. Builds no longer touch fonts.gstatic.com.
3. Hero text server-rendered with CSS entrance keyframes instead of JS-gated
   opacity.
4. Pages converted to server components; only effects stay client-side.
5. Canvas loops (`CursorTrail`, `ParticleField`) sleep when idle or off-screen.

## Gap against the spec target

The spec asks for LCP under 1.5 s. The foundation lands at 2.9 s simulated.

The observed (unthrottled) LCP in the same trace is 169 ms, identical to FCP,
so the hero paints on the first frame. The simulated 2.9 s is Lighthouse's
network model: every script chunk starts before the first paint, so the
185 KB of first-load JS is counted as an LCP dependency on slow 4G. An
experiment with the hero entrance animation disabled produced the same 2.9 s,
which rules the animation out.

Closing the gap means cutting first-load JS, which is the motion library plus
the Grimoire and effects code. That is Direction 1 and Direction 2 work
(sections 4 and 5 of the spec), not the shared foundation.

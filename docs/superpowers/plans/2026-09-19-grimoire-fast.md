# Direction 1: Grimoire, Made Instant - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Grimoire No. 17 identity pixel-for-pixel in spirit, but make every page paint in under a second on throttled mobile and scroll at 60 fps, by moving decoration from JavaScript to CSS and keeping the `motion` library off the critical path.

**Architecture:** Every continuous or entrance animation becomes a CSS keyframe or transition. `motion/react` remains only inside `Grimoire` (page-flip springs and `AnimatePresence`) and is loaded through `next/dynamic` so it leaves the first-load bundle. `feTurbulence` grain becomes a tiled PNG.

**Tech Stack:** Next.js 15.1, React 19, Tailwind 4, Motion 12 (Grimoire only), Python 3 + Pillow (grain tile), Lighthouse via npx.

**Spec:** `docs/superpowers/specs/2026-09-19-portfolio-refresh-design.md`, section 4.

## Global Constraints

- Worktree `/home/dev/PersonalProjects/Portfolio-grimoire`, branch `feature/Feature-GrimoireFast`. Dev server on port 3000. Push after each commit. Never merge to `main`.
- No `Co-Authored-By` / `Claude-Session` trailers in commits. No em dash in new code or copy; use "-".
- Visual identity unchanged: same colours, same layout, same copy (copy lives in `src/content`, do not edit it), same book, same circle, same theme burst.
- `prefers-reduced-motion: reduce` disables every animation (already global in `globals.css`; keep it working).
- `npm run typecheck && npm test && npm run build` pass at the end of every task.
- Kill stray Next servers by PID via `ps -eo pid,args | grep -E "next (dev|start)|next-server"`; `lsof` does not see them in this sandbox, and `pkill -f "next dev"` kills the calling shell. Always `rm -rf .next` before switching between `next build` and `next dev`.
- Success target: Lighthouse mobile (`npx lighthouse http://localhost:3100/ --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance`) score 95+, LCP under 1.5 s, first-load JS for `/` under 120 kB (currently 167 kB). Report honestly if not met.

---

### Task 1: Grain tile replaces feTurbulence

**Files:**
- Create: `scripts/make-grain.py`, `public/textures/grain-128.png`
- Modify: `src/components/effects/Grimoire.tsx` (FrontCover leather grain at the `<svg ... mix-blend-multiply>` block; the `PageSurface` texture `<svg ... opacity-[0.07]>` block)

- [ ] **Step 1: Generate the tile**

`scripts/make-grain.py`:

```python
"""Writes a 128x128 tiling monochrome noise PNG used as leather/paper grain."""
import random
from PIL import Image

random.seed(17)
size = 128
img = Image.new("LA", (size, size))
px = img.load()
for y in range(size):
    for x in range(size):
        v = random.randint(0, 255)
        px[x, y] = (v, 110)  # grey value, ~43% alpha
img.save("public/textures/grain-128.png", optimize=True)
print("wrote public/textures/grain-128.png")
```

Run: `mkdir -p public/textures && python3 scripts/make-grain.py && ls -l public/textures/grain-128.png`
Expected: file under 20 KB.

- [ ] **Step 2: Replace both SVG filters**

FrontCover: replace the whole `<svg className="absolute inset-0 h-full w-full opacity-30 mix-blend-multiply" ...>...</svg>` with

```tsx
<div
  aria-hidden
  className="absolute inset-0 opacity-30 mix-blend-multiply"
  style={{ backgroundImage: "url(/textures/grain-128.png)", backgroundSize: "128px 128px" }}
/>
```

PageSurface: replace the `<svg className="absolute inset-0 h-full w-full opacity-[0.07]" ...>` block with the same div at `opacity-[0.07]` and no blend mode.

- [ ] **Step 3: Verify and commit**

`grep -n "feTurbulence" src` returns nothing. `npm run typecheck && npm run build`.

```bash
git add scripts/make-grain.py public/textures src/components/effects/Grimoire.tsx
git commit -m "Grimoire: tiled PNG grain instead of feTurbulence filters"
git push -u origin feature/Feature-GrimoireFast
```

---

### Task 2: AmbientCircle and MagicCircle on CSS

**Files:**
- Modify: `src/components/effects/AmbientCircle.tsx`, `src/components/effects/MagicCircle.tsx`, `src/app/globals.css`

- [ ] **Step 1: Keyframes**

Append to `globals.css`:

```css
/* Magic circle rings - GPU transforms only */
@keyframes spin-cw  { to { transform: rotate(360deg); } }
@keyframes spin-ccw { to { transform: rotate(-360deg); } }
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.15); opacity: 0.2; }
}
@keyframes circle-in { from { opacity: 0; transform: scale(0.8); } }
.spin-cw  { animation: spin-cw  var(--spin, 60s) linear infinite; transform-origin: 400px 400px; transform-box: view-box; }
.spin-ccw { animation: spin-ccw var(--spin, 80s) linear infinite; transform-origin: 400px 400px; transform-box: view-box; }
.ring-pulse { animation: ring-pulse 4s ease-in-out infinite; transform-origin: 400px 400px; transform-box: view-box; }
.circle-in { animation: circle-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
```

- [ ] **Step 2: AmbientCircle**

Remove the `motion` import and `motion.svg`; render a plain `<svg>` with `className="spin-cw opacity-[0.05] dark:opacity-[0.08]"` and `style={{ "--spin": "120s" } as React.CSSProperties}`. Delete the `<radialGradient>` and the glow `<circle fill="url(#ac-glow)">`; keep the stroked circles, star and crosshair. Keep `usePathname` and the reduced-motion gate.

- [ ] **Step 3: MagicCircle**

Remove `motion`. Outer `<svg>` gets `className="circle-in ..."` and `style={{ opacity }}`. The three `motion.g` groups become `<g className="spin-cw" style={{"--spin":"60s"}}>`, `<g className="spin-ccw" style={{"--spin":"80s"}}>`, `<g className="spin-cw" style={{"--spin":"40s"}}>`. The pulsing `motion.circle` becomes `<circle className="ring-pulse" r="128" ... />`.

- [ ] **Step 4: Verify and commit**

Open `/about` in the dev server and confirm the ambient ring still turns; open `/` and confirm the three rings counter-rotate and the inner ring breathes. `npm run typecheck && npm run build`.

```bash
git add src/components/effects/AmbientCircle.tsx src/components/effects/MagicCircle.tsx src/app/globals.css
git commit -m "Effects: magic circles animate with CSS transforms, no motion"
git push
```

---

### Task 3: MagicReveal, BrushDivider, HoverLift on CSS + IntersectionObserver

**Files:**
- Modify: `src/components/effects/MagicReveal.tsx`, `src/components/effects/HoverLift.tsx`, `src/app/globals.css`

- [ ] **Step 1: A tiny in-view hook**

In `MagicReveal.tsx`, replace the motion implementation:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

function useInViewOnce<T extends Element>(margin = "-80px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

export function MagicReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal-up ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export function BrushDivider() {
  const { ref, inView } = useInViewOnce<SVGSVGElement>("-50px");
  return (
    <svg ref={ref} viewBox="0 0 600 24" className={`brush mx-auto block w-full max-w-md my-16 ${inView ? "is-in" : ""}`} aria-hidden>
      <path d="M 20 12 C 80 4, 180 20, 280 10 S 480 18, 580 12" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} />
      <circle cx="300" cy="12" r="2.5" fill="var(--accent)" />
    </svg>
  );
}
```

CSS:

```css
.reveal-up { opacity: 0; transform: translateY(28px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
.reveal-up.is-in { opacity: 1; transform: none; }
.brush path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s cubic-bezier(0.65,0,0.35,1); }
.brush circle { opacity: 0; transform: scale(0); transform-origin: 300px 12px; transform-box: view-box; transition: opacity .4s 1.2s, transform .4s 1.2s; }
.brush.is-in path { stroke-dashoffset: 0; }
.brush.is-in circle { opacity: 1; transform: scale(1); }
```

- [ ] **Step 2: HoverLift**

Replace with a server-safe wrapper (no `"use client"`, no motion):

```tsx
export function HoverLift({ children, y = -4 }: { children: React.ReactNode; y?: number }) {
  return (
    <div className="h-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:[transform:translateY(var(--lift))]" style={{ "--lift": `${y}px` } as React.CSSProperties}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

Scroll `/` and `/work`: sections still rise in once, the brush stroke still draws. `npm run typecheck && npm run build`.

```bash
git add src/components/effects/MagicReveal.tsx src/components/effects/HoverLift.tsx src/app/globals.css
git commit -m "Effects: reveals and hover lift on CSS with IntersectionObserver"
git push
```

---

### Task 4: Currents, Nav, CloverToggle, ThemeBurst without motion

**Files:**
- Modify: `src/components/effects/Currents.tsx`, `src/components/Nav.tsx`, `src/components/CloverToggle.tsx`, `src/components/effects/ThemeBurst.tsx`, `src/app/globals.css`

- [ ] **Step 1: Currents**

Manga page flip: `motion.g animate={{ rotateY: [0,-160,-160,0] }}` becomes `<g className="manga-flip">` with

```css
@keyframes manga-flip { 0% { transform: rotateY(0); } 40%, 60% { transform: rotateY(-160deg); } 100% { transform: rotateY(0); } }
.manga-flip { animation: manga-flip 6.2s ease-in-out infinite; transform-origin: 120px 90px; transform-box: view-box; transform-style: preserve-3d; }
@keyframes shadow-breathe { 0%,100% { opacity: .4; } 50% { opacity: .1; } }
.shadow-breathe { animation: shadow-breathe 5s ease-in-out infinite; }
@keyframes steam { 0% { opacity: 0; transform: translateY(20px); stroke-dashoffset: 1; } 40% { opacity: .55; } 100% { opacity: 0; transform: translateY(-30px); stroke-dashoffset: 0; } }
.steam { stroke-dasharray: 1; animation: steam 3s ease-out infinite; }
@keyframes crema { 0%,100% { opacity: .4; } 50% { opacity: .7; } }
.crema { animation: crema 4s ease-in-out infinite; }
@keyframes knight { 0%,100% { transform: translate(0,0); } 25% { transform: translate(40px,0); } 50% { transform: translate(40px,-40px); } 75% { transform: translate(0,-40px); } }
.knight { animation: knight 6s ease-in-out infinite; }
```

Steam paths get `className="steam" pathLength={1} style={{ animationDelay: \`${s.delay}s\` }}`. Card hover lift: replace `motion.div whileHover` with the `HoverLift` wrapper (y = -6). Remove the `motion` import.

- [ ] **Step 2: Nav**

Mobile panel: replace `AnimatePresence`/`motion.div` with a plain div that mounts when `open` and carries `className="nav-panel"`; `@keyframes nav-panel { from { opacity: 0; transform: translateY(-8px); } }` `.nav-panel { animation: nav-panel .22s cubic-bezier(.16,1,.3,1) both; }`. List items get `style={{ animationDelay }}` with a `nav-item` keyframe (`from { opacity:0; transform: translateX(-8px) }`, 0.3 s). Hamburger lines: two `<line>` elements with `className="transition-all duration-200"` and the `x1/y1/x2/y2` chosen by `open` (SVG attribute changes without tween are acceptable; keep the CSS transition on `transform` by instead rotating two lines: `open ? "rotate(45 10 10)" : ""` and `"rotate(-45 10 10)"` via `transform` attribute plus `style={{ transformOrigin: "10px 10px", transition: "transform .2s" }}`).

- [ ] **Step 3: CloverToggle**

Read the file first. Replace `motion.svg` / `motion.span` with plain elements; whatever `animate={{ rotate, scale }}` expressed on toggle becomes a class toggled by state (`.clover-spin { animation: clover-spin .6s cubic-bezier(.34,1.56,.64,1); }`, keyframes from the current values in the file). Keep the burst `CustomEvent` dispatch untouched.

- [ ] **Step 4: ThemeBurst**

Replace the three `motion.div`s with plain divs carrying `burst-ink`, `burst-flash`, `burst-ring` classes and keyframes reproducing the existing values (ink: scale 0 to 140, opacity .95 to 0, .95 s; flash: opacity 0 to .35/.18 to 0 over .55 s; ring: scale 0 to 30, opacity 1 to 0, .85 s). Remove `AnimatePresence`; the existing `setTimeout` already unmounts after 1.2 s.

- [ ] **Step 5: Verify and commit**

`grep -rln 'from "motion/react"' src` must list only `Grimoire.tsx` and `HeroIntro.tsx`. Toggle the clover on `/`: flash, ink and shake still fire. Open the mobile menu at 390 px width. `npm run typecheck && npm run build`.

```bash
git add src/components src/app/globals.css
git commit -m "Effects: Currents, Nav, CloverToggle and ThemeBurst on CSS; motion only in Grimoire and hero"
git push
```

---

### Task 5: Motion off the critical path

**Files:**
- Modify: `src/components/HeroIntro.tsx`, `src/app/page.tsx`, `src/app/resume/page.tsx`
- Create: `src/components/effects/GrimoireLazy.tsx`

- [ ] **Step 1: HeroIntro parallax without motion**

Replace `useScroll`/`useTransform`/`motion.div` with one `requestAnimationFrame`-throttled scroll listener that writes CSS variables on the section: `--hero-p` (0..1 progress of the hero leaving the viewport). The circle wrapper gets `style={{ transform: "scale(calc(1 + var(--hero-p) * 0.3))", opacity: "calc(1 - var(--hero-p) / 0.8)" }}` and the book wrapper (lg only, via a `lg:` class that reads the same var) `transform: translateY(calc(var(--hero-p) * -120px)) rotate(calc(var(--hero-p) * 8deg))`. The listener is passive, runs only while the hero is within the viewport (IntersectionObserver gate), and is skipped under reduced motion.

- [ ] **Step 2: Lazy Grimoire**

```tsx
"use client";
import dynamic from "next/dynamic";

export const GrimoireLazy = dynamic(() => import("./Grimoire").then((m) => m.Grimoire), {
  ssr: false,
  loading: () => <div aria-hidden style={{ width: 400, height: 460 }} />,
});
```

`HeroIntro` and `resume/page.tsx` import `GrimoireLazy` instead of `Grimoire` (pass the same `size`). The placeholder keeps layout stable (CLS 0).

- [ ] **Step 3: Verify and commit**

`npm run build`: the `/` route's First Load JS must drop below 120 kB. `grep -rln 'from "motion/react"' src` lists only `Grimoire.tsx`.

```bash
git add src
git commit -m "Hero: scroll parallax via CSS variables; Grimoire loaded lazily so motion leaves the first-load bundle"
git push
```

---

### Task 6: Grimoire internals

**Files:**
- Modify: `src/components/effects/Grimoire.tsx`

- [ ] **Step 1: Cheaper decoration**

Sparks: the 14 `motion.span` sparks become 10 plain spans with a `spark` keyframe (`translate(var(--dx), var(--dy)) scale(0)` to scale 1 and back, 1.6 s, staggered via `animationDelay`). Light beam: `filter: blur(8px)` becomes `blur(4px)`. Pulsing aura: CSS keyframe (`aura`, 5 s). Rotating sigil (`animate={{ rotate: 360 }}` at line ~544): `className="spin-cw"` with `--spin: 32s`. Keep `motion` for cover flip, page turn and ribbon springs.

- [ ] **Step 2: Verify and commit**

Open `/resume`, click the book, flip chapters via ribbons; DevTools Performance shows no long tasks while idle. `npm run typecheck && npm run build`.

```bash
git add src/components/effects/Grimoire.tsx
git commit -m "Grimoire: sparks, aura and sigil on CSS; lighter beam blur"
git push
```

---

### Task 7: Measure and record

**Files:**
- Create: `docs/superpowers/plans/2026-09-19-grimoire-fast-lighthouse.md`

- [ ] **Step 1: Lighthouse**

```bash
for p in $(ps -eo pid,args | grep -E "next (dev|start)|next-server" | grep -v grep | awk '{print $1}'); do kill $p; done
rm -rf .next && npm run build > /tmp/grim-build.log 2>&1 && grep -A3 "^Route" /tmp/grim-build.log
(nohup npx next start -p 3100 > /tmp/grim-prod.log 2>&1 &) ; sleep 5
npx --yes lighthouse http://localhost:3100/ --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance --output=json --output-path=/tmp/lh-grimoire.json --quiet
node -e 'const a=require("/tmp/lh-grimoire.json");const x=a.audits;console.log("score",Math.round(a.categories.performance.score*100));for(const k of ["first-contentful-paint","largest-contentful-paint","total-blocking-time","speed-index","total-byte-weight"])console.log(k,x[k].displayValue)'
```

Also run against `/resume` and `/work`.

- [ ] **Step 2: Record**

Table: foundation (95 / LCP 2.9 s / 338 KiB / 167 kB first-load JS) versus this branch, per route. Note any target not met and why. Commit and push.

- [ ] **Step 3: Restart the dev server for the user**

`rm -rf .next && (nohup npm run dev > /tmp/grim-dev.log 2>&1 &)` and confirm `curl -s -o /dev/null -w "%{http_code}" localhost:3000/` returns 200. Leave it running.

---

## Self-review

- Spec section 4 items: grain (Task 1), AmbientCircle and MagicCircle (Task 2), Grimoire sparks and beam (Task 6), motion only where springs are needed with CSS reveals (Tasks 3, 4, 5). Verification (Task 7).
- Names used across tasks: `HoverLift` (Tasks 3, 4), `GrimoireLazy` (Task 5), CSS classes `spin-cw`, `spin-ccw`, `ring-pulse`, `reveal-up`, `brush` (Tasks 2, 3, 6).

# Portfolio refresh: content module, resume alignment, two visual directions

Date: 2026-09-19
Status: approved in conversation, implementation pending

## 1. Why

Lighthouse (mobile profile) against the live site on 2026-09-19:

| Metric | Value |
|---|---|
| Performance score | 54 |
| Largest Contentful Paint | 23.7 s (96% render delay) |
| Speed Index | 11.9 s |
| Font transfer | 138 files, 4.26 MB |
| Main-thread work | 5.7 s |

Root causes, in order of damage:

1. `Shippori_Mincho` in `src/app/layout.tsx` has no `subsets`, so Next bundles every
   Google unicode-range slice and emits 125 `<link rel="preload" as="font">` tags.
   The local production build cannot finish because fetching them times out.
2. Every hero element is a `motion` element starting at opacity 0. Nothing paints
   until JS and fonts arrive.
3. Always-on loops: `CursorTrail` and `ParticleField` run full-screen canvas
   `requestAnimationFrame` loops forever; `AmbientCircle` rotates an 1100 px
   gradient SVG continuously; `Grimoire` composites three `feTurbulence` filters
   on 3D-flipped surfaces.
4. Every page is `"use client"`; no content is server-rendered.

Content is six hardcoded arrays across four files (`work/page.tsx`,
`about/page.tsx`, `Grimoire.tsx`, `page.tsx`) and is out of date against the
September 2026 resume.

## 2. Scope

Three deliverables, in order:

1. **Shared foundation** on `feature/Feature-ContentModule`.
2. **Direction 1, "Grimoire, made instant"** on `feature/Feature-GrimoireFast`,
   worktree `../Portfolio-grimoire`, dev port 3000.
3. **Direction 2, "Fable"** on `feature/Feature-Fable`, worktree
   `../Portfolio-fable`, dev port 3001.

Both directions branch from the foundation. The user compares them locally and
picks one, or a merge of both. Nothing merges to `main` until the user chooses.

Out of scope: any database or admin panel (Option B/C in the conversation), the
Writing/Lab/Now page content, GitHub links (profile intentionally hidden).

## 3. Shared foundation

### 3.1 Content module

`src/content/` holds all site copy as typed TypeScript data. Pages import from
here and contain no copy of their own beyond labels.

| File | Type | Consumers today |
|---|---|---|
| `profile.ts` | name, title, location, summary, email, links, resume PDF path | layout metadata, home hero, contact, footer |
| `timeline.ts` | `TimelineEntry[]` (date, title, note, kind: education \| role \| award \| milestone) | about arc, work sidebar, Grimoire chapters |
| `case-studies.ts` | `CaseStudy[]` (slug, kicker, title, domain, problem, approach[], result, metrics[], stack[], links?) | work page, home featured tiles |
| `skills.ts` | groups matching the resume: languages, backend, frontend, data, ai, integrations, devops, practices | about skills |
| `testimonials.ts` | quote, attribution | about |
| `awards.ts` | year, title, body | about, home credibility strip |
| `index.ts` | re-exports | |

Rules:
- One source per fact. The Grimoire chapters derive from `timeline.ts`: a
  small decoration map keyed by entry id (romaji, kanji, ribbon, sigil) decides
  which entries become chapters, so the book never keeps its own copy of dates
  or titles.
- No fabricated facts. Every entry traces to the September 2026 resume, the
  content brief, or a prior user statement. Metrics stay NDA-safe.
- "Runner-up, Employee of the Year" is never shortened to "Employee of the Year".

### 3.2 Resume alignment (from `Ankit_Mishra_2026.pdf`, 2026-09-19)

- Title: "Senior Software Engineer · AI & Automation".
- OneIT start: Jul 2022 (site currently says Aug 2022).
- Summary rewritten from the PDF profile paragraph, in the brief's voice.
- New case studies: Enterprise Knowledge Retrieval (RAG) platform (pgvector/HNSW,
  SharePoint Graph sync, 25M+ row embeddings store, bloat/VACUUM/orphan
  reconciliation); MYOB and CargoWise integration middleware (XML/EDI, REST,
  configurable mapping, retries, dead-lettering); Service-desk automation
  (Twilio call workflows, HaloPSA Chrome extension fed from Excel).
- Kept case studies: mining-services hub-and-spoke CMS, RTO LMS, construction
  takeoff on Paper.js. Existing AI case study merges into the RAG platform entry
  to avoid two overlapping AI stories.
- Skills regrouped into the PDF's eight categories.
- `public/docs/AnkitResume.pdf` replaced by the September PDF (same filename so
  existing links keep working). `Documentation/AnkitResume.pdf` (May) deleted.
- Home hero copy: "AI features" line updated to name RAG on pgvector, AI-assisted
  code and test generation, and enterprise integrations, dropping OCR/DPO from
  the hero unless the user confirms they belong (they remain in the case study
  where the brief supports them).

### 3.3 Performance floor (shared)

- `Shippori_Mincho` loaded with `subsets: ["latin"]` only is not enough (the JP
  glyphs are the point). Replace with a self-hosted subset: `pyftsubset` the
  400 weight to the exact glyphs used (遥か未来, アスタ, 反魔法, 今, 読書, 珈琲,
  将棋, 始まり, 入団, 表彰, 栄誉, 現在, and any added later), served from
  `public/fonts/` via `next/font/local`. Expected size under 20 KB.
- `Fraunces` limited to `opsz` axis and weights used; `JetBrains_Mono` dropped in
  favour of Geist Mono if only used for kickers, else kept with `latin` only.
- Pages become server components; only effect components stay `"use client"`.
- Hero text renders visible in HTML. Entrance motion is CSS keyframes applied
  on top, so the page is readable before hydration.
- `CursorTrail`: loop starts on first `mousemove`, stops after 500 ms with no
  dots. `ParticleField`: paused via `IntersectionObserver` when the hero is off
  screen and on `visibilitychange`.
- Accept target: Lighthouse mobile LCP under 1.5 s, score 95+, on both directions.

### 3.4 Recruiter pass (shared)

- `/resume` gains a scannable HTML resume above the download button, generated
  from the content module (summary, skills grid, experience, projects,
  education, awards).
- Open Graph image via `opengraph-image.tsx` (name, title, clover).
- Case studies show a live link when `links` is present (Sprachkraft only today).
- Writing, Lab, Now removed from the nav and sitemap until they have content;
  routes stay so old links do not 404.

## 4. Direction 1: Grimoire, made instant

Identity, layout, copy and the book stay. Only the cost changes.

- Grain: `feTurbulence` replaced by a 128 px tiling PNG at 4 KB, `mix-blend-mode`
  kept.
- `AmbientCircle`: rotation via a CSS animation on a `transform` layer, radial
  gradient removed (strokes only), so it is composited on the GPU.
- `MagicCircle`: rings rotate via CSS animations; the pulsing inner circle
  animates `transform: scale` instead of the `r` attribute.
- `Grimoire`: sparks capped and CSS-driven; light beam blur reduced to 4 px.
- Motion library only in components that need spring/gesture behaviour; entrance
  reveals use CSS with `IntersectionObserver` fallback.

## 5. Direction 2: Fable

Concept: harukamirai means "distant future". The career is a rail map to it.

- **Lines**: Java Platform (green), AI and Automation (accent), Integrations
  (amber). Each timeline entry and case study declares which lines it sits on.
  Interchange stations are entries on two or more lines.
- **Hero**: name in large editorial serif, the map drawn in with
  `stroke-dashoffset` animation, terminus labelled 遥か未来. Text visible on
  first paint; the draw-in is decoration.
- **Scroll**: stations light in order using scroll-driven CSS animations
  (`animation-timeline: view()`), with an `IntersectionObserver` fallback.
- **Work**: each case study is a station card with line badges, problem,
  approach, result, stack. Same data as Direction 1.
- **Resume**: a ticket stub with stamped stations plus the HTML resume and PDF
  download.
- **Theme**: the clover toggle switches to "last train" night service: dark
  map, lit stations, same burst moment as today.
- **Type**: fresh pair chosen during implementation; one variable serif for
  display, Geist for body. Two families maximum.
- **Motion budget**: no canvas, no continuous loops, no SVG filters. Everything
  is CSS or SVG stroke animation.

The maximalist preference still applies: the map draw-in, the station cascade
and the night-service switch must feel like an event, not a fade.

## 6. Verification

- `npm run build` succeeds locally in each worktree (currently impossible due
  to the font fetch).
- Lighthouse mobile against each worktree's production server, numbers recorded
  in the PR description for each direction.
- Screenshot set per direction: home, about, work, resume, contact, in both
  themes, desktop and 390 px wide.
- Every fact on every page traced to its content entry; no copy left in page
  components.

## 7. Branching and delivery

- `feature/Feature-ContentModule` holds sections 3 and 6 scaffolding.
- `feature/Feature-GrimoireFast` and `feature/Feature-Fable` branch from it.
- Commits carry no AI co-author trailers. Feature branches are pushed so Vercel
  builds previews; `main` is untouched until the user picks.

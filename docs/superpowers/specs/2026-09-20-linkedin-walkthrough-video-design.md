# LinkedIn walkthrough video - design

Date: 2026-09-20
Status: approved, in build

## Goal

A ~90 second video of `harukamirai.engineer` for LinkedIn. One post asset.
A viewer who watches it muted should understand what the site is and want to
open it. A viewer who unmutes gets the Succession Theme under it.

Not a hype trailer, not an engineering build-log. A guided walkthrough with a
clear call to action.

## Constraints that drove the design

1. **LinkedIn autoplays muted.** Every load-bearing statement is burned into
   the frame as an annotation. Audio is a bonus layer, never the carrier.
2. **`story_sound.mp3` is 39.027s and ends with its own ~2s outro fade**
   (`ffprobe`; documented at `src/lib/audio-synthesizer.ts:20`). Looping it
   raw dips to silence at 0:39 and 1:18. The bed is therefore built offline:
   trim the tail, crossfade-loop the body, fade under the end card.
3. **Frame is 4:5 portrait (1080x1350)**, desktop-first, resolving to a
   desktop/phone side-by-side. 4:5 takes ~1.8x the mobile feed height of 16:9.
4. **No fabricated claims.** (The first cut shipped "25M embeddings, 14.8ms p99". The
   corpus was overstated ~10x - `select count(1)` returned 2,590,043 - and the
   p99 had no source at all. Both corrected 2026-09-21.)
    Annotation copy is drawn from `src/content/*.ts`
   and `src/components/story/ShutterStoryExperience.tsx` only. Performance
   figures in memory were measured on `feature/Feature-GrimoireFast` before
   the story experience landed and are treated as stale: either re-measured
   on `main` or omitted.

## Pipeline

```
  site @ localhost:3000 (next start, production build)
        │
        ├─ CDP director (node --experimental-websocket)
        │    launches system Chrome 150 at fixed window geometry,
        │    drives a timed action script over DevTools Protocol
        │                            │
        │                            ▼
        │                 ffmpeg x11grab @60fps ──► desktop.mkv 1920x1080
        │                                        └► phone.mkv    430x932
        │
        └─ CDP screenshot of card HTML ──► cards/*.png (transparent)

  story_sound.mp3 ──► trim outro ──► crossfade loop ──► bed.wav (90s)

                       ffmpeg filter_complex
     desktop.mkv + phone.mkv + cards/*.png + plate.png + bed.wav
                              │
                              ▼
             harukamirai-walkthrough-1080x1350.mp4
```

### Why CDP and not Playwright

Playwright would add a ~400 MB Chromium download and a devDependency to a
portfolio repo, on a machine with ~2.4 GB RAM available. Node 20.20 exposes
`WebSocket` under `--experimental-websocket`, and Chrome 150 is already
installed, so the DevTools Protocol gives the same deterministic driving with
no new dependency.

### Why x11grab and not the browser's own video capture

Browser screencast APIs are variable-framerate and smear exactly the kind of
animation this site is built from. A headed Chrome window grabbed at a locked
60fps captures real compositing. The run stays reproducible because the
*driving* is scripted; only the *recording* is external.

### Why annotation cards are rendered HTML, not ffmpeg drawtext

`drawtext` cannot load the site's woff2 subsets, so it would set captions in a
generic face over a site whose argument is typography. Cards are real HTML
styled with `globals.css` tokens, screenshotted transparent, overlaid with
`overlay=enable='between(t,a,b)'`.

## Composition (1080x1350)

- Title band: y 0-130, static, `harukamirai.engineer` + clover mark.
- Stage: y 130-1150.
  - Acts 1-5: desktop 1920x1080 scaled to 1000x563, centred.
  - Act 6 (from ~1:14): desktop scaled to 700x394 slides left, phone
    430x932 scaled to 260x563 slides in right, same moment on both.
- Annotation band: y 1150-1350.
- Ground plate rendered from the site's own leather/parchment tokens.

## Shot list

| t | Shot | Annotation |
|---|---|---|
| 0:00 | Gate closed. 遥か未来 / HARUKA MIRAI | Every visit opens on a gate. |
| 0:05 | Gate lifts, Act 01 lands behind it | Lift it. A six-act story starts. |
| 0:11 | Act 01, IST 23:14 / AWST 01:44 | Act 01 - 2022. Intern at OneIT Australia, on Perth hours. |
| 0:20 | Act 03, 2,590,043 / pgvector HNSW | Act 03 - 2,590,043 embeddings, kept honest against their sources. |
| 0:29 | Act 04, trophy photo | Act 04 - Developer of the Year 2024. Runner-up EOTY 2025. |
| 0:36 | Act 06, dossier | Act 06 - the executive summary, at a glance. |
| 0:43 | Exit to site. Hero, magic circle, scroll | Behind the story: the portfolio itself. |
| 0:51 | Clover toggle, ThemeBurst | The clover isn't a logo. It's a switch. |
| 0:59 | Work, case-study modal | Seven case studies, with the architecture. |
| 1:04 | Resume, grimoire spread | |
| 1:08 | Command palette | Cmd-K, because recruiters skim. |
| 1:14 | Desktop shrinks left, phone slides in right | Same build. Two viewports. |
| 1:24 | End card, audio fades | Ankit Mishra - harukamirai.engineer |

## Deliverables

- `scripts/video/` committed - the pipeline is re-runnable as the site changes.
- `Documentation/video/*.mp4` gitignored - a 90s 1080x1350 h264 is 15-25 MB.

## Open

- End-card performance figure: measure fresh on `main` or omit. Decided at
  assembly time, from a real measurement, or not at all.

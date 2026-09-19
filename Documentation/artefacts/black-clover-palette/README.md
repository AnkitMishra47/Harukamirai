# Black Clover palette and motif - 1iT HTML artefact

Five candidate palettes for `leaf-4` and `leaf-5`, drawn from the source
material rather than from a European scriptorium, plus glyph and motion
proposals and a retune of the fixed grimoire materials. Every contrast figure
is measured, every screenshot is a real build of the site.

This is the second pass. The first (`../accent-options/`) was rejected for being
grimoire-adjacent rather than Black Clover: it grounded everything in iron gall,
lapis, vermilion and gold leaf. This one starts from Asta, Yami, the Black Bulls
and the Clover Kingdom.

## Which file to open, which file to publish

| File | Use |
|---|---|
| `open-local.html` | **Open this one** to read the artefact off disk. It loads the house theme from the `af-resources/` copy bundled here, so the theme, the table of contents and the annotation toolbar all work over `file://`. |
| `index.html` | **Publish this one.** It is the canonical artefact and references `/af-resources/` absolutely, which is what the 1iT Artefact Server provides centrally. Opened straight off disk it renders as unstyled browser defaults, which is expected and not a fault. |

The two are identical apart from that one `<script src>` and their opening
comment, and both are written by the same function in the same run, so they
cannot drift. Both are generated; do not hand-edit either.

Publishing the wrong one is hard to do by accident: the house validator accepts
`index.html` and rejects `open-local.html` with
`af-script must use src="/af-resources/artefact.js"`.

## Why this directory is tracked, not gitignored

The house rule (`~/.claude/skills/publishing-artefacts/SKILL.md`) is that an
artefact lives somewhere git ignores, because publishing to the Artefact Server
is the delivery and the local copy is only the source for the next version.

That does not hold here. This is a personal repository with no TrackIt task
behind it, so there is nowhere to publish to and **the stored artefact is the
deliverable**. It is committed on purpose. If a task id ever exists, publish
`index.html` from here.

## Source of truth

```bash
cd Documentation/artefacts/black-clover-palette
python3 palette.py        # the contrast gate on its own: 153 pairings, floor 4.5:1
python3 build-index.py    # rewrites index.html AND open-local.html
```

| File | Holds |
|---|---|
| `palette.py` | The candidates, the WCAG checker, the gate. A candidate is declared as a ground hue, a text hue and three accent intents with a target ratio; the generator binary-searches the lightness that reaches the target. No colour on the page is picked by eye, and the checker is validated against the sixteen ratios already written into `src/app/globals.css`. |
| `research.py` | Every research claim, split into quoted text (with its wiki source URL) and measured colour (with the frame it was sampled from). Anything that could not be verified is listed as such and is not used as a design input. |
| `build-index.py` | The page. Refuses to write if the bundled `af-resources/` is missing, or if an em dash reaches the output. |
| `shots/` | 36 in-situ renders, lossless WebP. |

## How the renders were made

The site was never built from the working tree. A `tar` snapshot of the repo
(excluding `node_modules`, `.next`, `.git` and `Documentation/artefacts`) was
unpacked under `/tmp/claude-1001/bc/snap` with `node_modules` symlinked in, and
token values were injected into the snapshot's copy of `globals.css` only.
`src/app/globals.css` was hashed before and after and is unchanged.

Each screenshot is gated twice. Before any frame is captured the served page and
its stylesheet must both return 200, and the stylesheet must contain that
candidate's own accent hexes, ground hexes and the retuned `--leather-a`. After
each navigation the live DOM is asked for `data-theme` and the capture is
abandoned if it is not the theme being shot.

Renders are lossless WebP: identical pixels to PNG at roughly half the bytes.
The neighbouring `accent-options/` artefact carries 17 MB of PNG; this one does
not repeat that.

## IP

No copyrighted imagery is used. Published frames were fetched to a scratch
directory, sampled for colour with PIL, and left there. No image, trace,
redraw, screenshot or official insignia appears in the artefact or is proposed
for the site. Every glyph in the artefact is original geometry built from the
vocabulary: clover shapes, a rule, a sweep, an eye.

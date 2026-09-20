/**
 * Compose the final 1080x1350 video from the two captures, the rendered
 * frames and the audio bed.
 *
 * All timings are derived from the marks the capture driver recorded, not
 * hard-coded: the six acts advance on a 6s timer the page owns, and load
 * jitter shifts everything after the gate, so a fixed schedule would drift
 * out of sync with the footage within one re-run.
 *
 * Layout (see docs/superpowers/specs/2026-09-20-linkedin-walkthrough-video-design.md):
 *     y    0..130   title band   (baked into plate.png)
 *     y  130..1150  stage        (the capture(s))
 *     y 1150..1350  annotation band (card PNGs overlaid)
 *
 * Usage: node scripts/video/assemble.mjs <workdir> <output.mp4>
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const WORK = process.argv[2] || "/tmp/video-out";
const OUT = process.argv[3] || `${WORK}/harukamirai-walkthrough-1080x1350.mp4`;

const desk = JSON.parse(readFileSync(`${WORK}/desktop.marks.json`, "utf8"));
const phone = JSON.parse(readFileSync(`${WORK}/phone.marks.json`, "utf8"));
const D = Object.fromEntries(Object.entries(desk.marks).map(([k, v]) => [k, v / 1000]));
const P = Object.fromEntries(Object.entries(phone.marks).map(([k, v]) => [k, v / 1000]));

// ---- edit points ----------------------------------------------------------
const DESK_IN   = 1.2;                 // trim dead air before the gate reads
// Both captures mark finaleHold at the same point in an identical hold-then-
// scroll, so anchoring the split to that mark puts the two panes at matching
// scroll offsets rather than at whatever each happened to be showing.
const SPLIT_AT  = D.finaleHold - 0.6;
const DESK_OUT  = D.end - 0.8;
const PHONE_IN  = P.finaleHold - 0.6;
const PHONE_OUT = PHONE_IN + (DESK_OUT - SPLIT_AT);
const END_SECS  = 5.4;
const XF        = 0.5;                 // segment crossfade

const segA = SPLIT_AT - DESK_IN;
const segB = DESK_OUT - SPLIT_AT;
const total = segA + segB + END_SECS - 2 * XF;

// The audio bed has to be built to exactly this length: its fade-out is placed
// relative to the end, so a bed longer than the video would simply be cut off
// mid-phrase. build-audio.sh is therefore driven by this number.
if (process.argv.includes("--duration-only")) {
  console.log(total.toFixed(3));
  process.exit(0);
}

// ---- geometry -------------------------------------------------------------
const CANVAS = { w: 1080, h: 1350 };
const STAGE = { y: 130, h: 1020 };
const fit = (sw, sh, tw) => ({ w: tw, h: Math.round((sh / sw) * tw / 2) * 2 });

const dFull = fit(desk.rect.w, desk.rect.h, 1000);
const dFullPos = { x: (CANVAS.w - dFull.w) / 2, y: STAGE.y + Math.round((STAGE.h - dFull.h) / 2) };

/*
 * Split-screen layout. Two equal panes were tried first and did not work: a
 * 1920-wide viewport shrunk to 640px in a 1080px frame is illegible, so the
 * desktop read as an empty rectangle beside a bright phone. The desktop is
 * therefore the larger pane and the phone overlaps its lower right, the way a
 * responsive mockup is normally shown. Each pane gets a bezel so the overlap
 * reads as two devices rather than one clipped screenshot.
 */
const D_BEZEL = 2, P_BEZEL = 6;
const dInner = fit(desk.rect.w, desk.rect.h, 896);
const dHalf = { w: dInner.w + 2 * D_BEZEL, h: dInner.h + 2 * D_BEZEL };
const pInnerH = 551;
const pInner = { w: Math.round((phone.rect.w / phone.rect.h) * pInnerH / 2) * 2, h: pInnerH };
const pHalf = { w: pInner.w + 2 * P_BEZEL, h: pInner.h + 2 * P_BEZEL };
const dHalfPos = { x: 40, y: 300 };
const pHalfPos = { x: CANVAS.w - pHalf.w - 40, y: 520 };

// ---- annotation schedule (segment-A local time) ---------------------------
const t = (mark) => D[mark] - DESK_IN;
/*
 * Lead times differ per beat because the marks do not all mean the same thing.
 * A mark taken right after a navigation click fires BEFORE the new view has
 * rendered, so its caption needs a positive offset or it describes the page
 * being left. A mark taken after an assertion (caseStudy, palette) is already
 * looking at the thing, so its caption can lead slightly.
 */
const CARDS_A = [
  ["gate",    0.3,        t("act1") - 0.9],
  ["act01",   t("act1") - 0.5, t("act2") - 1.4],
  ["act02",   t("act2") - 0.1, t("act3") - 1.6],
  ["act03",   t("act3") - 0.1, t("act4") - 1.5],
  ["act04",   t("act4") - 0.1, t("act5") - 1.5],
  ["act05",   t("act5") - 0.1, t("act6") - 1.5],
  ["act06",   t("act6") - 0.1, t("actsEnd") - 1.5],
  ["site",    t("exitToSite") + 1.6, t("heroScroll") - 1.2],
  ["theme",   t("themeBurst") - 0.9, t("work") - 1.5],
  ["work",    t("work") + 0.7, t("caseStudy") - 1.4],
  ["case",    t("caseStudy") - 0.9, t("resume") - 1.5],
  ["resume",  t("resume") + 0.8, t("palette") - 1.4],
  ["palette", t("palette") - 0.9, segA - 1.5],
];
const CARD_B = ["split", 0.5, segB - 0.4];

// ---- guards ---------------------------------------------------------------
for (const [id, a, b] of CARDS_A) {
  if (!existsSync(`${WORK}/cards/card-${id}.png`)) throw new Error(`missing card asset: ${id}`);
  if (b - a < 1.2) throw new Error(`card "${id}" would be on screen ${(b - a).toFixed(2)}s - too short to read`);
  if (a < 0 || b > segA) throw new Error(`card "${id}" (${a.toFixed(1)}..${b.toFixed(1)}) falls outside segment A (0..${segA.toFixed(1)})`);
}
if (PHONE_OUT > P.end) throw new Error(`split needs phone footage to ${PHONE_OUT.toFixed(1)}s but capture ends at ${P.end.toFixed(1)}s`);

console.log(`segment A  ${segA.toFixed(2)}s   desktop [${DESK_IN.toFixed(2)} .. ${SPLIT_AT.toFixed(2)}]`);
console.log(`segment B  ${segB.toFixed(2)}s   split: desktop [${SPLIT_AT.toFixed(2)} .. ${DESK_OUT.toFixed(2)}] + phone [${PHONE_IN.toFixed(2)} .. ${PHONE_OUT.toFixed(2)}]`);
console.log(`end card   ${END_SECS.toFixed(2)}s`);
console.log(`total      ${total.toFixed(2)}s`);
console.log(`desktop full ${dFull.w}x${dFull.h} @ ${dFullPos.x},${dFullPos.y}`);
console.log(`split: desktop ${dHalf.w}x${dHalf.h} @ ${dHalfPos.x},${dHalfPos.y} | phone ${pHalf.w}x${pHalf.h} @ ${pHalfPos.x},${pHalfPos.y} (overlap ${dHalfPos.x + dHalf.w - pHalfPos.x}px)`);

// ---- build ----------------------------------------------------------------
const cardInputs = CARDS_A.map(([id]) => id);
const inputs = [
  "-loop", "1", "-framerate", "30", "-t", String(segA + segB + END_SECS), "-i", `${WORK}/cards/plate.png`,
  "-ss", String(DESK_IN),   "-t", String(segA), "-i", `${WORK}/desktop.mkv`,
  "-ss", String(SPLIT_AT),  "-t", String(segB), "-i", `${WORK}/desktop.mkv`,
  "-ss", String(PHONE_IN),  "-t", String(segB), "-i", `${WORK}/phone.mkv`,
  "-loop", "1", "-framerate", "30", "-t", String(END_SECS), "-i", `${WORK}/cards/end.png`,
  ...cardInputs.flatMap((id) => ["-i", `${WORK}/cards/card-${id}.png`]),
  "-i", `${WORK}/cards/card-split.png`,
  "-i", `${WORK}/bed.wav`,
];
const CARD0 = 5;                       // index of the first card input
const SPLITCARD = CARD0 + cardInputs.length;
const AUDIO = SPLITCARD + 1;

const f = [];
f.push(`[0:v]fps=30,scale=1080:1350,setsar=1,trim=0:${segA},setpts=PTS-STARTPTS[plateA]`);
f.push(`[0:v]fps=30,scale=1080:1350,setsar=1,trim=0:${segB},setpts=PTS-STARTPTS[plateB]`);
f.push(`[1:v]fps=30,scale=${dFull.w}:${dFull.h},setsar=1[dfull]`);
f.push(`[plateA][dfull]overlay=${dFullPos.x}:${dFullPos.y}:shortest=0[a0]`);

let prev = "a0";
CARDS_A.forEach(([id, start, end], i) => {
  const lbl = `a${i + 1}`;
  f.push(`[${CARD0 + i}:v]format=rgba[c${i}]`);
  f.push(`[${prev}][c${i}]overlay=0:1150:enable='between(t,${start.toFixed(3)},${end.toFixed(3)})'[${lbl}]`);
  prev = lbl;
});
f.push(`[${prev}]trim=0:${segA},setpts=PTS-STARTPTS[segA]`);

f.push(`[2:v]fps=30,scale=${dInner.w}:${dInner.h},setsar=1,pad=${dHalf.w}:${dHalf.h}:${D_BEZEL}:${D_BEZEL}:0x544068[dhalf]`);
f.push(`[3:v]fps=30,scale=${pInner.w}:${pInner.h},setsar=1,pad=${pHalf.w}:${pHalf.h}:${P_BEZEL}:${P_BEZEL}:0x101014[phalf]`);
f.push(`[plateB][dhalf]overlay=${dHalfPos.x}:${dHalfPos.y}:shortest=0[b0]`);
f.push(`[b0][phalf]overlay=${pHalfPos.x}:${pHalfPos.y}:shortest=0[b1]`);
f.push(`[${SPLITCARD}:v]format=rgba[cs]`);
f.push(`[b1][cs]overlay=0:1150:enable='between(t,${CARD_B[1]},${CARD_B[2].toFixed(3)})'[b2]`);
f.push(`[b2]trim=0:${segB},setpts=PTS-STARTPTS[segB]`);

f.push(`[4:v]fps=30,scale=1080:1350,setsar=1,trim=0:${END_SECS},setpts=PTS-STARTPTS[segC]`);

f.push(`[segA][segB]xfade=transition=fade:duration=${XF}:offset=${(segA - XF).toFixed(3)}[ab]`);
f.push(`[ab][segC]xfade=transition=fade:duration=${XF}:offset=${(segA + segB - 2 * XF).toFixed(3)}[vout]`);
f.push(`[${AUDIO}:a]atrim=0:${total.toFixed(3)},asetpts=PTS-STARTPTS[aout]`);

const args = [
  "-y", "-hide_banner", "-loglevel", "error", "-stats",
  ...inputs,
  "-filter_complex", f.join(";"),
  "-map", "[vout]", "-map", "[aout]",
  "-c:v", "libx264", "-profile:v", "high", "-level", "4.1",
  "-preset", "slow", "-crf", "19",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart",
  "-r", "30", "-g", "60",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-t", total.toFixed(3),
  OUT,
];

console.log("\nencoding...");
execFileSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
console.log(`\nwrote ${OUT}`);

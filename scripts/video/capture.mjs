/**
 * Drive the site through a scripted journey and record it.
 *
 * The journey is driven over CDP so a re-run produces the same video; the
 * recording itself is ffmpeg x11grab, because browser screencast APIs are
 * variable-framerate and smear the animation this site is made of.
 *
 * Every beat calls mark(), which writes the elapsed milliseconds since the
 * grab started into a JSON sidecar. Annotation timings are then derived from
 * what the capture ACTUALLY did rather than from what this script hoped it
 * would do - the acts auto-advance on a 6s timer the page owns, and page load
 * jitter moves everything after it.
 *
 * Usage:
 *   node --experimental-websocket scripts/video/capture.mjs desktop  out/dir
 *   node --experimental-websocket scripts/video/capture.mjs phone    out/dir
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { launchChrome, fitViewport, clientRect, startGrab, stopGrab, killChromeFor, raiseWindow } from "./lib/chrome.mjs";
import { sleep } from "./lib/cdp.mjs";
import { startNestedX, keepDisplayAwake, assertDisplayPainting } from "./lib/xserver.mjs";

const PROFILE = process.argv[2] || "desktop";
const OUTDIR = process.argv[3] || "/tmp/video-out";
const BASE = process.env.SITE_URL || "http://localhost:3000";

const PROFILES = {
  desktop: { width: 1920, height: 1080, port: 9401, left: 0, top: 0, theme: "leaf-4" },
  // The phone starts on the five-leaf dark ground on purpose. The desktop
  // journey toggles to dark partway through, and the two are shown side by
  // side at the end - starting the phone light would put a light phone next
  // to a dark desktop, which reads as a rendering bug, not a viewport demo.
  phone:   { width: 430,  height: 932,  port: 9402, left: 0, top: 0, theme: "leaf-5",
             ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" },
};

const cfg = PROFILES[PROFILE];
if (!cfg) throw new Error(`unknown profile: ${PROFILE}`);
mkdirSync(OUTDIR, { recursive: true });

/*
 * A fresh profile directory and debugging port per run.
 *
 * Reusing them is what produced silently-black captures: a Chrome from an
 * earlier run that could not be killed still held the profile lock and the
 * port, so the next launch forwarded its URL to that old browser and exited,
 * leaving CDP driving one window while x11grab recorded another. A unique
 * dir and port make the new browser genuinely new, whatever is still running.
 */
const RUN_ID = `${Date.now().toString(36)}`;
const USER_DATA_DIR = `${OUTDIR}/profile-${PROFILE}-${RUN_ID}`;
const PORT = 9400 + (parseInt(RUN_ID.slice(-3), 36) % 400);

// ---- selectors ------------------------------------------------------------
const SEL = {
  gateOpen:    'button',                                   // resolved by text
  cloverToggle:'button[aria-label="Switch to five-leaf theme"], button[aria-label="Switch to four-leaf theme"]',
  navWork:     'header a[href="/work"]',
  navResume:   'header a[href="/resume"]',
  navHome:     'header a[href="/"]',
};

/**
 * Click the most specific visible element whose text matches.
 *
 * Three things this has to get right, each learned from a miss:
 *  - Smallest match wins. On /work the page section is itself an <article>
 *    wrapping every card, so a plain "first match" picked the 3081px-tall
 *    container instead of a 359px card.
 *  - The CLICK POINT must be on screen, not merely the element. That container
 *    intersects the viewport while its centre sits 150px below the fold, so
 *    the click landed on nothing and silently did nothing.
 *  - elementFromPoint must actually resolve to the target (or a descendant),
 *    which catches anything overlaying it.
 */
async function clickByText(cdp, text, { tag = "button" } = {}) {
  const hit = await cdp.eval(`(() => {
    const want = ${JSON.stringify(text.toLowerCase())};
    const cands = [];
    for (const el of document.querySelectorAll(${JSON.stringify(tag)})) {
      const t = (el.innerText || '').trim().toLowerCase();
      if (!t.includes(want)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
      const at = document.elementFromPoint(cx, cy);
      if (!at || !(at === el || el.contains(at))) continue;
      cands.push({ x: cx, y: cy, area: r.width * r.height });
    }
    cands.sort((a, b) => a.area - b.area);
    return cands[0] || null;
  })()`);
  if (!hit) throw new Error(`no clickable <${tag}> with text ${JSON.stringify(text)} on screen`);
  await cdp.clickAt(hit.x, hit.y);
  return hit;
}

/**
 * Assert that something the annotation claims is actually on screen.
 *
 * The case-study beat shipped once with the caption "Every card opens into the
 * real design" over six seconds of an unchanged grid: the click targeted a
 * <button> containing "Read architecture blueprint", which is on the home
 * carousel, not /work - and a .catch(() => {}) swallowed the miss. A caption
 * that describes something the footage does not show is the one defect this
 * pipeline must never ship, so the beats that make a claim assert it.
 */
async function assertVisible(cdp, selector, what) {
  const ok = await cdp.eval(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 8 && r.height > 8;
  })()`);
  if (!ok) throw new Error(`${what} did not appear (no visible ${selector})`);
}

/** rAF-driven eased scroll - smoother and more repeatable than wheel events. */
async function smoothScroll(cdp, to, ms) {
  await cdp.eval(`new Promise((res) => {
    const start = window.scrollY, end = ${to}, dur = ${ms}, t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2);
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, start + (end - start) * ease(p));
      if (p < 1) requestAnimationFrame(step); else res(1);
    }
    requestAnimationFrame(step);
  })`, { awaitPromise: true });
}

/*
 * Finale timing, shared by both profiles so the split screen lines up.
 * Both journeys reach their hero, hold, then scroll the same distance over the
 * same duration. The layouts diverge - that is the point of the shot - but the
 * scroll position does not.
 */
const FINALE_HOLD = 2600;
const FINALE_SCROLL = 150;      // small enough that the hero headline stays in frame
const FINALE_SCROLL_MS = 7000;

// ---- journeys -------------------------------------------------------------

async function desktopJourney(cdp, mark) {
  mark("gate");                       await sleep(4500);
  await clickByText(cdp, "see what's behind");
  mark("gateLift");                   await sleep(900);
  mark("act1");
  // Six acts auto-advance on the page's own 6s timer; just hold and mark.
  for (let i = 2; i <= 6; i++) { await sleep(6000); mark(`act${i}`); }
  await sleep(5200);
  mark("actsEnd");

  await clickByText(cdp, "skip to portfolio").catch(() => clickByText(cdp, "exit to portfolio"));
  mark("exitToSite");                 await sleep(2600);

  mark("hero");                       await sleep(2200);
  await smoothScroll(cdp, 760, 3800); mark("heroScroll");   await sleep(900);
  await smoothScroll(cdp, 0, 1400);   await sleep(700);

  await cdp.click(SEL.cloverToggle);
  mark("themeBurst");                 await sleep(3000);

  await cdp.click(SEL.navWork);
  mark("work");                       await sleep(2400);
  await smoothScroll(cdp, 420, 1800); await sleep(1200);
  // The card is an <article onClick>, not a button: "Read case study" is a
  // span inside it (src/components/CaseStudyCard.tsx:28).
  await clickByText(cdp, "read case study", { tag: "article" });
  await sleep(900);
  await assertVisible(cdp, "#case-study-modal-title", "case study modal");
  mark("caseStudy");                  await sleep(4200);
  await cdp.key("Escape", { code: "Escape", keyCode: 27 });
  await sleep(1200);

  await smoothScroll(cdp, 0, 900);
  await cdp.click(SEL.navResume);
  mark("resume");                     await sleep(2600);
  await smoothScroll(cdp, 380, 2000); await sleep(1600);

  await cdp.key("k", { modifiers: 2, code: "KeyK", keyCode: 75 });  // 2 = Ctrl
  await sleep(700);
  await assertVisible(cdp, '[role="dialog"][aria-label="Grimoire Scroll Search"]', "command palette");
  mark("palette");                    await sleep(2500);
  await cdp.key("Escape", { code: "Escape", keyCode: 27 });
  await sleep(900);

  await cdp.click(SEL.navHome);
  mark("home");                       await sleep(2500);
  // The finale is the split-screen shot. Both profiles run the SAME hold and
  // scroll here (see FINALE_*), so the desktop and the phone are at matching
  // scroll offsets when they appear together - otherwise the two panes show
  // unrelated parts of the page and the shot reads as two screenshots rather
  // than one site at two widths.
  mark("finaleHold");                 await sleep(FINALE_HOLD);
  await smoothScroll(cdp, FINALE_SCROLL, FINALE_SCROLL_MS);
  await sleep(2500);
  mark("end");
}

async function phoneJourney(cdp, mark) {
  mark("gate");                       await sleep(4000);
  await clickByText(cdp, "see what's behind");
  mark("gateLift");                   await sleep(900);
  mark("act1");
  for (let i = 2; i <= 3; i++) { await sleep(6000); mark(`act${i}`); }
  await sleep(4000);
  await clickByText(cdp, "skip to portfolio").catch(() => clickByText(cdp, "exit to portfolio"));
  mark("exitToSite");                 await sleep(2600);
  mark("hero");                       await sleep(2500);
  mark("finaleHold");                 await sleep(FINALE_HOLD);
  await smoothScroll(cdp, FINALE_SCROLL, FINALE_SCROLL_MS);
  await sleep(2500);
  mark("end");
}

// ---- run ------------------------------------------------------------------

// Sweep any Chrome left over from an earlier run before launching. A stale
// window is another `--class chrome` candidate and, if it is stacked above the
// new one, it is what x11grab records - silently, as black.
const stale = killChromeFor(`${OUTDIR}/profile-${PROFILE}`);
if (stale) console.log(`[${PROFILE}] killed ${stale} stale chrome process(es)`);

/*
 * Where the browser renders.
 *
 *   x0     - the real display. Hardware GPU compositing, measured at ~54 of 60
 *            frames distinct during motion. Needs the screen awake (see
 *            keepDisplayAwake) and briefly puts a window on the user's desktop.
 *   nested - a private Xephyr server. Immune to screen blanking and does not
 *            touch the user's desktop, but renders in software: measured at
 *            21-29 fps through the gate lift, which is the fastest animation in
 *            the whole video. Correct, but visibly less smooth.
 *
 * x0 is the default because this is an animation showcase and the difference is
 * the point of the piece. Resolution is not the lever - the same benchmark gave
 * ~40 fps scrolling at 1920, 1440 and 1280 alike, so the gate lift is CPU-bound
 * on rasterisation, not on pixel count.
 */
const MODE = process.env.CAPTURE_MODE || "x0";
let xs, stopAwake = () => {};
if (MODE === "nested") {
  xs = await startNestedX({ width: cfg.width, height: cfg.height });
  console.log(`[${PROFILE}] nested X on ${xs.display} at ${cfg.width}x${cfg.height}`);
} else {
  xs = { display: process.env.DISPLAY || ":0", stop: () => {} };
  stopAwake = keepDisplayAwake({ display: xs.display });
  console.log(`[${PROFILE}] capturing the real display ${xs.display} (GPU)`);
}

const { proc, cdp } = await launchChrome({
  url: `${BASE}/`,
  port: PORT,
  width: cfg.width, height: cfg.height, left: 0, top: 0,
  userDataDir: USER_DATA_DIR,
  display: xs.display,
  extraArgs: cfg.ua ? [`--user-agent=${cfg.ua}`] : [],
});

await sleep(2500);
const vp = await fitViewport(cdp, { width: cfg.width, height: cfg.height });
console.log(`[${PROFILE}] run ${RUN_ID} on :${PORT} | viewport ${vp.w}x${vp.h} (asked ${cfg.width}x${cfg.height})`);

// Deterministic starting theme, per profile (see PROFILES): the desktop opens
// on the four-leaf light ground so the clover toggle later lands as a visible
// event; the phone opens dark to match the desktop at the split-screen finale.
await cdp.eval(`localStorage.setItem('hm-theme', ${JSON.stringify(cfg.theme)})`);
await cdp.send("Page.reload", { ignoreCache: false });
await sleep(4000);
await cdp.waitForSelector("body");
const theme = await cdp.eval(`document.documentElement.getAttribute('data-theme')`);
console.log(`[${PROFILE}] theme: ${theme}`);

// Park the pointer out of the way so no stray hover state is captured.
await cdp.mouseMove(Math.round(vp.w / 2), vp.h - 8);
await sleep(1200);

// Tag the window so it is identified by title, not by "last one xdotool
// listed". Next.js overwrites document.title on client-side navigation, but
// the rect is measured once, here, before recording starts.
const MARKER = `HM-CAPTURE-${PROFILE}-${RUN_ID}`;
await cdp.eval(`document.title = ${JSON.stringify(MARKER)}`);
await sleep(600);
const rect = clientRect({ display: xs.display, titleMatch: MARKER });
raiseWindow(rect.id, xs.display);
await sleep(500);
const grey = assertDisplayPainting({ display: xs.display, rect });
console.log(`[${PROFILE}] grabbing ${rect.w}x${rect.h} @ ${rect.x},${rect.y} (window ${rect.id}, mean grey ${grey})`);
if (rect.w !== vp.w || rect.h !== vp.h) {
  throw new Error(
    `x11 window is ${rect.w}x${rect.h} but CDP reports a ${vp.w}x${vp.h} viewport - ` +
    `the window being recorded is not the one being driven`);
}

const videoPath = `${OUTDIR}/${PROFILE}.mkv`;
const grab = startGrab({ display: xs.display, rect, fps: 60, out: videoPath });
await sleep(1500);                        // let ffmpeg reach steady state

const t0 = Date.now();
const marks = {};
const mark = (name) => {
  marks[name] = Date.now() - t0;
  console.log(`  [${PROFILE}] ${String(marks[name]).padStart(6)}ms  ${name}`);
};

try {
  await (PROFILE === "phone" ? phoneJourney : desktopJourney)(cdp, mark);
} catch (e) {
  console.error(`[${PROFILE}] journey failed:`, e.message);
  marks.__error = e.message;
}

await stopGrab(grab);
cdp.close();
proc.kill("SIGTERM");
await sleep(1200);
killChromeFor(USER_DATA_DIR);
stopAwake();
xs.stop();

/*
 * Verify the capture actually contains the page.
 *
 * The failure this guards against is silent: if the wrong window is recorded,
 * every mark still fires, the journey still "succeeds", and the only symptom
 * is a black video discovered much later in the edit. blackdetect is cheap
 * and turns that into an error here, next to its cause.
 */
const black = (() => {
  try {
    const out = execSync(
      `ffmpeg -hide_banner -i ${JSON.stringify(videoPath)} ` +
      `-vf "blackdetect=d=0.5:pic_th=0.98:pix_th=0.10" -an -f null - 2>&1 | grep blackdetect || true`,
      { encoding: "utf8", shell: "/bin/bash" });
    return out.trim();
  } catch { return ""; }
})();
if (black) {
  const secs = [...black.matchAll(/black_duration:([\d.]+)/g)].reduce((a, m) => a + parseFloat(m[1]), 0);
  const dur = (marks.end ?? 0) / 1000;
  console.error(`[${PROFILE}] WARNING black frames: ${secs.toFixed(1)}s of ~${dur.toFixed(1)}s`);
  console.error(`  ${black.split("\n").join("\n  ")}`);
  if (secs > dur * 0.15) {
    throw new Error(`capture is ${((secs / dur) * 100).toFixed(0)}% black - recorded the wrong window`);
  }
}

writeFileSync(`${OUTDIR}/${PROFILE}.marks.json`, JSON.stringify({
  profile: PROFILE, viewport: { w: vp.w, h: vp.h }, rect, marks,
}, null, 2));
console.log(`[${PROFILE}] wrote ${videoPath}`);

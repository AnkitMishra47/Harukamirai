/**
 * Screenshot the ground plate, the annotation cards and the end card.
 *
 * The page is loaded from file:// with the three woff2 subsets inlined as
 * data URIs. Serving it over http instead would make the font requests
 * cross-origin, and fonts are CORS-checked, so they would silently fall back
 * to a system face - the exact failure this whole approach exists to avoid.
 *
 * Usage: node --experimental-websocket scripts/video/render-frames.mjs out/dir
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome, fitViewport, killChromeFor } from "./lib/chrome.mjs";
import { sleep } from "./lib/cdp.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const OUTDIR = process.argv[2] || "/tmp/video-out";
const CARDS_DIR = `${OUTDIR}/cards`;
mkdirSync(CARDS_DIR, { recursive: true });

// ---- inline the fonts -----------------------------------------------------
const fonts = {
  "http://localhost:3000/fonts/Geist-subset.woff2": "public/fonts/Geist-subset.woff2",
  "http://localhost:3000/fonts/Fraunces-subset.woff2": "public/fonts/Fraunces-subset.woff2",
  "http://localhost:3000/fonts/ShipporiMincho-subset.woff2": "public/fonts/ShipporiMincho-subset.woff2",
};
let html = readFileSync(`${HERE}/frames.html`, "utf8");
for (const [url, rel] of Object.entries(fonts)) {
  const b64 = readFileSync(resolve(REPO, rel)).toString("base64");
  html = html.replaceAll(url, `data:font/woff2;base64,${b64}`);
}
const tmpHtml = `${OUTDIR}/frames.inlined.html`;
writeFileSync(tmpHtml, html);

// ---- render ---------------------------------------------------------------
// Fresh profile and port per run, for the same reason capture.mjs uses them:
// a Chrome still holding the profile lock swallows the launch and hands the
// URL to the old browser instead.
const RUN_ID = Date.now().toString(36);

const { proc, cdp } = await launchChrome({
  url: `file://${tmpHtml}`,
  port: 9800 + (parseInt(RUN_ID.slice(-3), 36) % 190),
  width: 1120, height: 900, left: 0, top: 0,
  userDataDir: `${OUTDIR}/profile-frames-${RUN_ID}`,
  extraArgs: ["--allow-file-access-from-files", "--force-color-profile=srgb"],
});
await sleep(2000);
await fitViewport(cdp, { width: 1120, height: 900 });
await cdp.eval("document.fonts.ready", { awaitPromise: true });
await sleep(700);

const ids = await cdp.eval("window.__CARD_IDS");
const targets = ["plate", "end", ...ids.map((i) => `card-${i}`)];

/** Screenshot one element by its own bounding box, at device scale 1. */
async function shot(id) {
  const box = await cdp.eval(`(() => {
    const el = document.getElementById(${JSON.stringify(id)});
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  })()`);
  if (!box) throw new Error(`missing element: ${id}`);
  const res = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { ...box, scale: 1 },
  });
  const out = `${CARDS_DIR}/${id}.png`;
  writeFileSync(out, Buffer.from(res.data, "base64"));
  return { id, w: Math.round(box.width), h: Math.round(box.height), out };
}

for (const id of targets) {
  const r = await shot(id);
  console.log(`  ${r.id.padEnd(14)} ${r.w}x${r.h}`);
}

// Report which families actually resolved, so a silent fallback cannot ship.
const loaded = await cdp.eval(`[...document.fonts].map(f => f.family + ':' + f.status).join(', ')`);
console.log("fonts:", loaded);

cdp.close();
proc.kill("SIGTERM");
killChromeFor(`${OUTDIR}/profile-frames-${RUN_ID}`);
console.log(`wrote ${targets.length} frames to ${CARDS_DIR}`);

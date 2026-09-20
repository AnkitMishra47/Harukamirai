/**
 * Measure how many DISTINCT frames the browser actually produces during real
 * motion, at a given capture size.
 *
 * Software rasterisation cost scales with pixel count, and the desktop capture
 * is downscaled to ~1000px wide in the final composite, so capturing at 1920
 * may be paying for resolution the output never uses. This answers that with a
 * number instead of a guess.
 *
 * Usage: node --experimental-websocket scripts/video/bench-fps.mjs 1280 720
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";
import { launchChrome, fitViewport, clientRect, startGrab, stopGrab, killChromeFor } from "./lib/chrome.mjs";
import { startNestedX } from "./lib/xserver.mjs";
import { sleep } from "./lib/cdp.mjs";

const W = parseInt(process.argv[2] || "1920", 10);
const H = parseInt(process.argv[3] || "1080", 10);
const BASE = process.env.SITE_URL || "http://localhost:3000";
const dir = mkdtempSync(`${tmpdir()}/hmbench-`);
const RUN = Date.now().toString(36);

const xs = await startNestedX({ width: W, height: H });
const { proc, cdp } = await launchChrome({
  url: `${BASE}/`, port: 9600 + (parseInt(RUN.slice(-3), 36) % 300),
  width: W, height: H, left: 0, top: 0,
  userDataDir: `${dir}/p`, display: xs.display,
});
await sleep(2500);
const vp = await fitViewport(cdp, { width: W, height: H });
await cdp.eval(`localStorage.setItem('hm-theme','leaf-5')`);
await cdp.send("Page.reload", {});
await sleep(4000);
const MARKER = `HM-BENCH-${RUN}`;
await cdp.eval(`document.title = ${JSON.stringify(MARKER)}`);
await sleep(500);
const rect = clientRect({ display: xs.display, titleMatch: MARKER });

const out = `${dir}/bench.mkv`;
const grab = startGrab({ display: xs.display, rect, fps: 60, out });
await sleep(1200);

// Motion: lift the gate, then a continuous rAF scroll.
const hit = await cdp.eval(`(() => {
  for (const el of document.querySelectorAll('button')) {
    if ((el.innerText||'').toLowerCase().includes("see what's behind")) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    }
  } return null; })()`);
if (hit) await cdp.clickAt(hit.x, hit.y);
await sleep(9000);
await cdp.eval(`(() => { for (const b of document.querySelectorAll('button'))
  if ((b.innerText||'').toLowerCase().includes('skip to portfolio')) { b.click(); return true; } return false; })()`);
await sleep(3000);
await cdp.eval(`new Promise(res => { const t0=performance.now();
  (function step(now){ const p=Math.min(1,(now-t0)/6000); window.scrollTo(0, p*1800);
    p<1?requestAnimationFrame(step):res(1); })(performance.now()); })`, { awaitPromise: true });
await sleep(800);

await stopGrab(grab);
cdp.close(); proc.kill("SIGTERM"); killChromeFor(`${dir}/p`); xs.stop();

const seg = (ss, t, name) => {
  execSync(`ffmpeg -y -hide_banner -loglevel error -ss ${ss} -t ${t} -i ${out} -c:v libx264 -preset ultrafast -qp 0 ${dir}/s.mkv`);
  const tot = parseInt(execSync(`ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 ${dir}/s.mkv`).toString().trim(), 10);
  const uniq = parseInt(execSync(`ffmpeg -hide_banner -i ${dir}/s.mkv -vf mpdecimate=hi=64:lo=32:frac=0.002 -loglevel debug -f null - 2>&1 | grep -c "keep pts" || true`, { shell: "/bin/bash" }).toString().trim(), 10);
  console.log(`  ${name.padEnd(12)} ${String(uniq).padStart(3)} unique / ${String(tot).padStart(3)} = ${(uniq / t).toFixed(0)} fps`);
  return uniq / t;
};
console.log(`\n${W}x${H} (viewport ${vp.w}x${vp.h}, grab ${rect.w}x${rect.h}):`);
seg(1.2, 2.5, "gate-lift");
seg(14.0, 5.0, "scroll");
execSync(`rm -rf ${dir}`);

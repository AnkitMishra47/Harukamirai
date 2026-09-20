/**
 * A private nested X server for the capture to render into.
 *
 * Capturing the real display (:0) does not work, for two independent reasons
 * found the hard way:
 *
 *   1. When the physical screen blanks or locks, XGetImage on the root window
 *      returns black for the WHOLE screen. The browser is still rendering; the
 *      recording is not. Captures came out black from the moment the display
 *      slept, with no error anywhere.
 *   2. The desktop's window manager clamps windows to its work area, so a
 *      1920x1080 window only ever had a 1920x1048 client area - the viewport
 *      could not be made 16:9.
 *
 * Xephyr has neither problem: it is its own X server with its own framebuffer,
 * it never blanks, it has no window manager to clamp anything, and it does not
 * take over the user's desktop. It renders in software, which is the cost.
 */
import { spawn, execFileSync } from "node:child_process";
import { sleep } from "./cdp.mjs";

function displayInUse(n) {
  try {
    execFileSync("xdpyinfo", ["-display", `:${n}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Start Xephyr on the first free display >= 20. Returns { display, proc, stop }. */
export async function startNestedX({ width, height, depth = 24 } = {}) {
  let n = 20;
  while (n < 90 && displayInUse(n)) n++;
  if (n >= 90) throw new Error("no free X display number");
  const display = `:${n}`;

  // No -resizeable: with it, the host window manager can shrink the nested
  // screen (observed: an asked-for 1920x1080 came up as 1920x1048).
  const proc = spawn("Xephyr", [
    display,
    "-screen", `${width}x${height}x${depth}`,
    "-ac", "-br", "-noreset",
    "-title", `hm-capture ${display}`,
  ], { stdio: ["ignore", "pipe", "pipe"] });
  proc.stdout.on("data", () => {});
  proc.stderr.on("data", () => {});

  for (let i = 0; i < 60; i++) {
    await sleep(250);
    if (displayInUse(n)) {
      const info = execFileSync("xdpyinfo", ["-display", display], { encoding: "utf8" });
      const m = info.match(/dimensions:\s+(\d+)x(\d+)/);
      const got = m ? { w: +m[1], h: +m[2] } : null;
      if (!got || got.w !== width || got.h !== height) {
        throw new Error(`nested X came up ${got ? `${got.w}x${got.h}` : "unreadable"}, wanted ${width}x${height}`);
      }
      return {
        display,
        proc,
        stop: () => { try { proc.kill("SIGTERM"); } catch {} },
      };
    }
  }
  throw new Error(`Xephyr did not start on ${display}`);
}

/**
 * Keep the real display awake and painting for the length of a capture.
 *
 * The desktop blanked itself mid-capture and XGetImage then returned black for
 * the entire root window - the browser was still rendering, the recording was
 * not, and nothing errored. Core X screen-saving was already off (`xset q`
 * reported timeout 0 and no DPMS), so the blanking comes from the session
 * daemon's own idle monitor. CDP input does not touch that: it is dispatched
 * straight to the renderer and never reaches the X input layer, so a scripted
 * journey looks completely idle no matter how much is happening on screen.
 *
 * A real pointer nudge does reset it. The cursor is parked outside the capture
 * rect so the nudge cannot appear in the frame.
 */
export function keepDisplayAwake({ display = ":0", parkAt = { x: 3500, y: 1400 }, everyMs = 15000 } = {}) {
  const env = { ...process.env, DISPLAY: display };
  const nudge = () => {
    try {
      execFileSync("xset", ["dpms", "force", "on"], { env, stdio: "ignore" });
      execFileSync("xset", ["s", "reset"], { env, stdio: "ignore" });
      execFileSync("xdotool", ["mousemove", String(parkAt.x), String(parkAt.y)], { env, stdio: "ignore" });
      execFileSync("xdotool", ["mousemove", String(parkAt.x + 1), String(parkAt.y + 1)], { env, stdio: "ignore" });
    } catch {}
  };
  nudge();
  const timer = setInterval(nudge, everyMs);
  timer.unref?.();
  return () => clearInterval(timer);
}

/** Fail fast if the display is not actually painting (blanked screen reads as black). */
export function assertDisplayPainting({ display = ":0", rect }) {
  const out = execFileSync("bash", ["-c",
    `ffmpeg -hide_banner -v error -f x11grab -video_size ${rect.w}x${rect.h} ` +
    `-i ${display}.0+${rect.x},${rect.y} -frames:v 1 -vf scale=1:1 -f rawvideo -pix_fmt gray - | od -An -tu1`,
  ], { env: { ...process.env, DISPLAY: display }, encoding: "utf8" });
  const mean = parseInt(out.trim(), 10);
  if (!Number.isFinite(mean) || mean <= 1) {
    throw new Error(
      `display ${display} is not painting at ${rect.w}x${rect.h}+${rect.x},${rect.y} ` +
      `(mean grey ${mean}). The screen is blanked or the window is off-screen; ` +
      `wake the display, or re-run with CAPTURE_MODE=nested.`);
  }
  return mean;
}

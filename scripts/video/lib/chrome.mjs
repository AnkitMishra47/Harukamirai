/**
 * Launch a Chrome window at an exact client size and tell ffmpeg where to grab.
 *
 * Getting the window size right is the whole job here. `--window-size` is the
 * OUTER size, so a window manager title bar eats into the viewport: asking for
 * 1920x1080 measured 1920x1048 of actual page. CDP's Browser.setWindowBounds
 * has the same outer-size semantics, so the fix is to measure the shortfall
 * from the page itself (innerWidth/innerHeight) and grow the window by the
 * difference. Two passes settle it on every WM tested here.
 */
import { spawn, execFileSync, execSync } from "node:child_process";
import { CDP, findPageTarget, sleep } from "./cdp.mjs";


/**
 * Kill any Chrome still running against a given --user-data-dir.
 *
 * This is not hygiene, it is correctness. clientRect() finds the capture
 * window with `xdotool search --class chrome`, so a leftover Chrome from an
 * earlier run is another candidate window - and a stale window stacked on top
 * of the new one is what x11grab records. That failure is silent: the capture
 * succeeds, every mark fires, and the video is 40 seconds of black.
 *
 * SIGTERM on the launcher is not enough on its own; Chrome's zygote and
 * renderer children outlive it, so this sweeps by user-data-dir instead.
 */
export function killChromeFor(userDataDir) {
  let out = "";
  try {
    out = execSync("ps -eo pid,args", { encoding: "utf8" });
  } catch { return 0; }
  let killed = 0;
  for (const line of out.split("\n")) {
    // Match on the FLAG, not just the directory. The directory alone also
    // appears in the command line of this script and of the shell that ran it,
    // and killing those kills the capture instead of the browser.
    if (!line.includes(`--user-data-dir=${userDataDir}`)) continue;
    if (!/\/chrome(_crashpad_handler)?\b/.test(line)) continue;
    const pid = parseInt(line.trim().split(/\s+/)[0], 10);
    if (!pid || pid === process.pid || pid === process.ppid) continue;
    try { process.kill(pid, "SIGKILL"); killed++; } catch {}
  }
  return killed;
}

/** Raise a window and confirm it is the topmost one over its own rect. */
export function raiseWindow(id, display = ":0") {
  const env = { ...process.env, DISPLAY: display };
  try { execFileSync("xdotool", ["windowraise", id], { env }); } catch {}
  try { execFileSync("xdotool", ["windowactivate", "--sync", id], { env }); } catch {}
}

export async function launchChrome({
  url,
  port = 9222,
  width,
  height,
  left = 0,
  top = 0,
  userDataDir,
  display = process.env.DISPLAY || ":0",
  extraArgs = [],
}) {
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-infobars",
    "--disable-session-crashed-bubble",
    "--disable-features=TranslateUI,InfiniteSessionRestore,OutdatedBuildDetector",
    // Chrome raises a "Can't update Chrome" infobar over the page on some
    // launches, which landed in the top 60px of a phone capture. Both flags
    // are needed: the feature switch kills the detector, the date stops the
    // already-scheduled bubble from firing.
    '--simulate-outdated-no-au=Tue, 31 Dec 2099 23:59:59 GMT',
    "--mute-audio",              // the soundtrack is built offline, not captured
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-position=${left},${top}`,
    `--window-size=${width},${height}`,
    ...extraArgs,
    `--app=${url}`,
  ];

  const proc = spawn("google-chrome", args, {
    env: { ...process.env, DISPLAY: display },
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });
  proc.stderr.on("data", () => {});
  proc.stdout.on("data", () => {});

  /*
   * A Chrome launched against a --user-data-dir that another Chrome still
   * holds does NOT start a browser: it hands the URL to the running instance
   * and exits ~immediately. The debugging port then still answers - from the
   * OLD browser - so CDP connects, every command succeeds, and the window
   * being driven is not the window being recorded. The captures come out
   * black. Catch it here, where it is obvious, by noticing the early exit.
   */
  let exitedEarly = null;
  proc.on("exit", (code) => { exitedEarly = code; });
  await sleep(2500);
  if (exitedEarly !== null) {
    throw new Error(
      `chrome exited immediately (code ${exitedEarly}) - another instance is holding ` +
      `${userDataDir}. Use a fresh --user-data-dir per run.`);
  }

  const target = await findPageTarget(port);
  const cdp = await new CDP(target.webSocketDebuggerUrl).connect();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  return { proc, cdp, port, display };
}

/**
 * Grow the window until the page's own innerWidth/innerHeight match the target.
 * Returns the achieved viewport.
 */
export async function fitViewport(cdp, { width, height, left = 0, top = 0 }) {
  const { windowId } = await cdp.send("Browser.getWindowForTarget");
  let outerW = width;
  let outerH = height;

  for (let pass = 0; pass < 4; pass++) {
    await cdp.send("Browser.setWindowBounds", {
      windowId,
      bounds: { left, top, width: outerW, height: outerH, windowState: "normal" },
    });
    await sleep(350);
    const vp = await cdp.eval("({ w: window.innerWidth, h: window.innerHeight })");
    if (vp.w === width && vp.h === height) return { ...vp, outerW, outerH, windowId };
    outerW += width - vp.w;
    outerH += height - vp.h;
  }
  const vp = await cdp.eval("({ w: window.innerWidth, h: window.innerHeight })");
  return { ...vp, outerW, outerH, windowId };
}

/**
 * Absolute screen rect of the window's CLIENT area (no decoration), which is
 * exactly what x11grab should capture. xwininfo reports the client origin,
 * which is why it is preferred over xdotool getwindowgeometry (that one
 * reports the frame origin and disagrees by the decoration offset).
 */
export function clientRect({ display = ":0", titleMatch } = {}) {
  const ids = execFileSync("xdotool", ["search", "--onlyvisible", "--class", "chrome"], {
    env: { ...process.env, DISPLAY: display },
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);
  if (!ids.length) throw new Error("no visible chrome window found");

  let chosen = null;
  if (titleMatch) {
    const seen = [];
    for (const id of ids) {
      const info = execFileSync("xwininfo", ["-id", id], {
        env: { ...process.env, DISPLAY: display }, encoding: "utf8",
      });
      const title = (info.match(/xwininfo: Window id: \S+ "([^"]*)"/) || [, ""])[1];
      seen.push(title);
      if (title.includes(titleMatch)) { chosen = id; break; }
    }
    if (!chosen) {
      throw new Error(
        `no chrome window titled "${titleMatch}" among ${ids.length}: ${JSON.stringify(seen)}`);
    }
  } else {
    if (ids.length > 1) {
      throw new Error(
        `${ids.length} chrome windows visible and no titleMatch given - refusing to guess ` +
        `which one to record (a stale window on top is captured as black)`);
    }
    chosen = ids[0];
  }

  const info = execFileSync("xwininfo", ["-id", chosen], {
    env: { ...process.env, DISPLAY: display },
    encoding: "utf8",
  });
  const num = (re) => {
    const m = info.match(re);
    if (!m) throw new Error(`xwininfo: could not read ${re}`);
    return parseInt(m[1], 10);
  };
  return {
    id: chosen,
    x: num(/Absolute upper-left X:\s+(-?\d+)/),
    y: num(/Absolute upper-left Y:\s+(-?\d+)/),
    w: num(/^\s+Width:\s+(\d+)/m),
    h: num(/^\s+Height:\s+(\d+)/m),
  };
}

/** Start ffmpeg grabbing a screen rect. Returns the child process. */
export function startGrab({ display = ":0", rect, fps = 60, out }) {
  const w = rect.w - (rect.w % 2);
  const h = rect.h - (rect.h % 2);
  const args = [
    "-y", "-hide_banner", "-loglevel", "error",
    "-f", "x11grab",
    "-framerate", String(fps),
    "-video_size", `${w}x${h}`,
    // CDP dispatches input straight to the renderer and never moves the real X
    // pointer, so a drawn cursor is a stationary arrow sitting in every frame
    // wherever the mouse happened to be. Record without it.
    "-draw_mouse", "0",
    "-i", `${display}.0+${rect.x},${rect.y}`,
    "-c:v", "libx264", "-preset", "ultrafast", "-qp", "0",
    "-pix_fmt", "yuv444p",
    out,
  ];
  const proc = spawn("ffmpeg", args, { stdio: ["pipe", "ignore", "pipe"] });
  let err = "";
  proc.stderr.on("data", (d) => { err += d.toString(); });
  proc.on("exit", (code) => {
    if (code && code !== 255) process.stderr.write(`ffmpeg exited ${code}: ${err}\n`);
  });
  return proc;
}

/** Ask ffmpeg to finish cleanly so the container gets its index written. */
export function stopGrab(proc) {
  return new Promise((resolve) => {
    proc.on("exit", () => resolve());
    try { proc.stdin.write("q"); } catch {}
    setTimeout(() => { try { proc.kill("SIGINT"); } catch {} }, 800);
    setTimeout(() => { try { proc.kill("SIGKILL"); } catch {} resolve(); }, 6000);
  });
}

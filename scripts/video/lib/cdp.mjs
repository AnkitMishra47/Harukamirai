/**
 * Minimal Chrome DevTools Protocol client.
 *
 * Node 20 exposes WebSocket only under --experimental-websocket, so every
 * entry point into this module must be run with that flag. The alternative
 * was a Playwright dependency: a ~400 MB Chromium download and a devDependency
 * in a portfolio repo, to drive a Chrome that is already installed.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export { sleep };

/** Poll /json/list until Chrome has a page target with a debugger URL. */
export async function findPageTarget(port, { timeoutMs = 20000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch (e) {
      lastErr = e;
    }
    await sleep(200);
  }
  throw new Error(`no CDP page target on :${port}${lastErr ? ` (${lastErr.message})` : ""}`);
}

export class CDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 0;
    this.pending = new Map();
    this.handlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (typeof WebSocket === "undefined") {
        reject(new Error("WebSocket is undefined - run node with --experimental-websocket"));
        return;
      }
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;
      ws.onopen = () => resolve(this);
      ws.onerror = () => reject(new Error(`CDP websocket failed: ${this.wsUrl}`));
      ws.onclose = () => {
        for (const { reject: rj } of this.pending.values()) rj(new Error("CDP closed"));
        this.pending.clear();
      };
      ws.onmessage = (ev) => {
        let msg;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.id !== undefined && this.pending.has(msg.id)) {
          const { resolve: rs, reject: rj } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rj(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? "")})`));
          else rs(msg.result);
        } else if (msg.method) {
          for (const h of this.handlers.get(msg.method) ?? []) h(msg.params);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(handler);
  }

  /** Wait for one occurrence of a CDP event. */
  once(method, { timeoutMs = 15000 } = {}) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), timeoutMs);
      this.on(method, (p) => {
        clearTimeout(t);
        resolve(p);
      });
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }

  // ---- convenience -------------------------------------------------------

  async eval(expression, { awaitPromise = false } = {}) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise,
    });
    if (r.exceptionDetails) {
      throw new Error(`eval failed: ${r.exceptionDetails.text} :: ${expression.slice(0, 120)}`);
    }
    return r.result?.value;
  }

  /** Centre of the first element matching `selector`, in CSS viewport pixels. */
  async centreOf(selector) {
    const box = await this.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`);
    if (!box) throw new Error(`element not found or not laid out: ${selector}`);
    return box;
  }

  async waitForSelector(selector, { timeoutMs = 15000, visible = true } = {}) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const ok = await this.eval(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        if (!${visible}) return true;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })()`);
      if (ok) return true;
      await sleep(120);
    }
    throw new Error(`waitForSelector timed out: ${selector}`);
  }

  async mouseMove(x, y) {
    await this.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none", buttons: 0 });
  }

  async clickAt(x, y) {
    await this.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none", buttons: 0 });
    await sleep(60);
    await this.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1 });
    await sleep(50);
    await this.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1 });
  }

  async click(selector) {
    const { x, y } = await this.centreOf(selector);
    await this.clickAt(x, y);
  }

  /** Smooth wheel scroll, dispatched in steps so the page animates rather than jumps. */
  async scrollBy(x, y, deltaY, { steps = 30, stepMs = 16 } = {}) {
    const per = deltaY / steps;
    for (let i = 0; i < steps; i++) {
      await this.send("Input.dispatchMouseEvent", {
        type: "mouseWheel", x, y, deltaX: 0, deltaY: per,
      });
      await sleep(stepMs);
    }
  }

  async key(text, { modifiers = 0, code, keyCode } = {}) {
    const base = { modifiers, key: text, code: code ?? `Key${text.toUpperCase()}`, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
    await this.send("Input.dispatchKeyEvent", { type: "keyDown", ...base });
    await sleep(40);
    await this.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
  }
}

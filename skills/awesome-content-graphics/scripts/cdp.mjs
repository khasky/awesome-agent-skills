// Minimal Chrome DevTools Protocol driver: launch a headless Chromium, open pages,
// navigate, evaluate, screenshot. No npm dependencies; needs Node 22+ (global WebSocket)
// and any Chromium-family binary on the machine.

import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";

export function findBrowser() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const home = homedir();
  const candidates = [];
  const pw = platform() === "win32"
    ? join(process.env.LOCALAPPDATA ?? join(home, "AppData", "Local"), "ms-playwright")
    : platform() === "darwin" ? join(home, "Library", "Caches", "ms-playwright") : join(home, ".cache", "ms-playwright");
  if (existsSync(pw)) {
    for (const d of readdirSync(pw).filter((d) => d.startsWith("chromium")).sort().reverse()) {
      candidates.push(
        join(pw, d, "chrome-headless-shell-win64", "chrome-headless-shell.exe"),
        join(pw, d, "chrome-win", "chrome.exe"),
        join(pw, d, "chrome-headless-shell-mac-arm64", "chrome-headless-shell"),
        join(pw, d, "chrome-headless-shell-mac-x64", "chrome-headless-shell"),
        join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"),
        join(pw, d, "chrome-mac-arm64", "Chromium.app", "Contents", "MacOS", "Chromium"),
        join(pw, d, "chrome-headless-shell-linux64", "chrome-headless-shell"),
        join(pw, d, "chrome-linux", "chrome"),
      );
    }
  }
  candidates.push(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge",
  );
  return candidates.find((c) => existsSync(c)) ?? null;
}

export async function launch({ width = 1080, height = 1080, scale = 2 } = {}) {
  const exe = findBrowser();
  if (!exe) throw new Error("no Chromium-family browser found; set CHROME_PATH");
  const proc = spawn(exe, [
    "--headless=new", "--remote-debugging-port=0", "--no-first-run", "--no-default-browser-check",
    "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    `--window-size=${width},${height}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => reject(new Error("browser did not report a DevTools URL")), 20000);
    proc.stderr.on("data", (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(t); resolve(m[1]); }
    });
    proc.on("exit", (code) => { clearTimeout(t); reject(new Error(`browser exited early (${code})`)); });
  });
  const browser = await connect(wsUrl);
  browser.exe = exe;
  browser.close = async () => { try { await browser.send("Browser.close"); } catch {} proc.kill(); };
  browser.newPage = async () => {
    const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
    const page = new Page(browser, sessionId, targetId);
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.setViewport(width, height, scale);
    return page;
  };
  return browser;
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws connect failed")); });
  const pending = new Map();
  const listeners = new Map();
  let id = 0;
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      for (const fn of listeners.get(`${msg.sessionId ?? ""}:${msg.method}`) ?? []) fn(msg.params);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  });
  const on = (sessionId, method, fn) => {
    const k = `${sessionId ?? ""}:${method}`;
    if (!listeners.has(k)) listeners.set(k, []);
    listeners.get(k).push(fn);
  };
  return { send: (m, p) => send(m, p), sendTo: send, on, ws };
}

class Page {
  constructor(browser, sessionId, targetId) { this.b = browser; this.s = sessionId; this.t = targetId; }
  send(method, params) { return this.b.sendTo(method, params, this.s); }
  async setViewport(width, height, scale) {
    this.w = width; this.h = height; this.scale = scale;
    await this.send("Emulation.setDeviceMetricsOverride", {
      width, height, deviceScaleFactor: scale, mobile: false, screenWidth: width, screenHeight: height,
    });
  }
  async goto(url) {
    const loaded = new Promise((res) => this.b.on(this.s, "Page.loadEventFired", res));
    await this.send("Page.navigate", { url });
    await loaded;
    await this.evaluate("document.fonts ? document.fonts.ready.then(() => true) : true");
    await new Promise((r) => setTimeout(r, 60));
  }
  async evaluate(expression) {
    const { result, exceptionDetails } = await this.send("Runtime.evaluate", {
      expression, awaitPromise: true, returnByValue: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? "evaluate failed");
    return result.value;
  }
  async screenshot() {
    const { data } = await this.send("Page.captureScreenshot", {
      format: "png", captureBeyondViewport: false,
      clip: { x: 0, y: 0, width: this.w, height: this.h, scale: this.scale },
    });
    return Buffer.from(data, "base64");
  }
  // The same pixels as deviceScaleFactor=f, produced through CSS zoom at DPR 1. Headless Chromium
  // stalls captureScreenshot at DPR 2 on some gradient and blur layers; the zoom path does not.
  async screenshotZoomed(f) {
    const { w, h } = this;
    await this.send("Emulation.setDeviceMetricsOverride", { width: w * f, height: h * f, deviceScaleFactor: 1, mobile: false });
    await this.evaluate(`document.documentElement.style.zoom='${f}'; new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
    try {
      const { data } = await this.send("Page.captureScreenshot", {
        format: "png", captureBeyondViewport: false, clip: { x: 0, y: 0, width: w * f, height: h * f, scale: 1 },
      });
      return Buffer.from(data, "base64");
    } finally {
      await this.evaluate("document.documentElement.style.zoom=''");
      await this.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    }
  }
  async close() { await this.b.send("Target.closeTarget", { targetId: this.t }); }
}

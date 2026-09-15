import { spawn } from 'node:child_process';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { browserPath } from './config.mjs';

export class Browser {
  constructor(proc, ws, profile) { this.proc = proc; this.ws = ws; this.profile = profile; this.id = 0; this.waiting = new Map(); }

  static async launch(port = 9333 + Math.floor(Math.random() * 400)) {
    const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'gfx-prof-'));
    const proc = spawn(browserPath(), [
      '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
      '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars',
      '--disable-extensions', '--disable-dev-shm-usage', '--force-device-scale-factor=1',
      '--allow-file-access-from-files', '--font-render-hinting=none', 'about:blank',
    ], { stdio: 'ignore', detached: false });
    let url = null;
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 250));
      try { const j = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); url = j.webSocketDebuggerUrl; break; } catch {}
    }
    if (!url) { proc.kill(); throw new Error('chrome did not expose a debugging port'); }
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = e => rej(new Error('ws error')); });
    const b = new Browser(proc, ws, profile);
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && b.waiting.has(m.id)) {
        const { res, rej } = b.waiting.get(m.id); b.waiting.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    };
    return b;
  }

  send(method, params = {}, sessionId, timeout = 45000) {
    const id = ++this.id;
    const msg = { id, method, params };
    if (sessionId) msg.sessionId = sessionId;
    this.ws.send(JSON.stringify(msg));
    return new Promise((res, rej) => {
      this.waiting.set(id, { res, rej });
      setTimeout(() => { if (this.waiting.has(id)) { this.waiting.delete(id); rej(new Error('timeout ' + method)); } }, timeout);
    });
  }

  async page(width, height) {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    await this.send('Page.enable', {}, sessionId);
    await this.send('Runtime.enable', {}, sessionId);
    await this.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
    return new Page(this, sessionId, targetId);
  }

  async close() {
    try { this.ws.close(); } catch {}
    try { this.proc.kill(); } catch {}
    await new Promise(r => setTimeout(r, 300));
    try { spawn('taskkill', ['/PID', String(this.proc.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
    try { await fs.rm(this.profile, { recursive: true, force: true }); } catch {}
  }
}

export class Page {
  constructor(b, sessionId, targetId) { this.b = b; this.s = sessionId; this.t = targetId; }
  async goto(fileUrl, timeout = 30000) {
    await this.b.send('Page.navigate', { url: fileUrl }, this.s, timeout);
    const t0 = Date.now();
    for (;;) {
      const r = await this.eval('document.readyState === "complete" && window.__fitted === true');
      if (r === true) return true;
      if (Date.now() - t0 > timeout) return false;
      await new Promise(r2 => setTimeout(r2, 60));
    }
  }
  async eval(expr, timeout = 45000) {
    const r = await this.b.send('Runtime.evaluate', { expression: `(function(){ ${expr.trim().startsWith('return') ? expr : 'return (' + expr + ')'} })()`, returnByValue: true, awaitPromise: true }, this.s, timeout);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval threw');
    return r.result.value;
  }
  async shot(format = 'png', quality) {
    const p = { format, captureBeyondViewport: false, fromSurface: true };
    if (quality != null) p.quality = quality;
    const r = await this.b.send('Page.captureScreenshot', p, this.s, 60000);
    return Buffer.from(r.data, 'base64');
  }
  async close() { try { await this.b.send('Target.closeTarget', { targetId: this.t }); } catch {} }
}

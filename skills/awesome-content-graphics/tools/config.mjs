// Where the shared caches live and which browser renders the set. Everything
// else in tools/ resolves paths through here, so no file carries a machine path.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BS = String.fromCharCode(92);
export const fileUrl = p => 'file:///' + p.split(BS).join('/').replace(/^[/]+/, '');

// The asset cache is shared across runs: fonts, icons and stock photographs are
// fetched once per machine. GRAPHICS_ASSETS overrides it.
export function assetCache() {
  const named = process.env.GRAPHICS_ASSETS;
  const dir = named || path.join(os.tmpdir(), 'graphics-assets');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// A Chromium-family binary, in the order the machine is likely to expose one:
// an explicit path, then an automation cache, then an installed browser.
export function browserPath() {
  const named = process.env.CHROME_PATH;
  if (named && fs.existsSync(named)) return named;

  const roots = [
    path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright'),
    path.join(os.homedir(), '.cache', 'ms-playwright'),
    path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
  ];
  const inside = ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux/chrome',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium'];
  for (const root of roots) {
    let entries = [];
    try { entries = fs.readdirSync(root).filter(d => d.startsWith('chromium-')).sort().reverse(); } catch { continue; }
    for (const e of entries) for (const rel of inside) {
      const p = path.join(root, e, rel);
      if (fs.existsSync(p)) return p;
    }
  }

  const installed = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ];
  for (const p of installed) if (fs.existsSync(p)) return p;

  throw new Error('no Chromium-family browser found; set CHROME_PATH');
}

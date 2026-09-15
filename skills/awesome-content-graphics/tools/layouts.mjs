import { headBlock, esc, W, H, SAFE, setPageCanvas } from './page.mjs';

export let SW = W * (1 - 2 * SAFE), SH = H * (1 - 2 * SAFE);
export function setCanvas(w, h) {
  setPageCanvas(w, h);
  SW = w * (1 - 2 * SAFE);
  SH = h * (1 - 2 * SAFE);
}
const px = n => Math.round(n) + 'px';

function icon(ctx, name, style) {
  const svg = ctx.icons[name];
  if (!svg) throw new Error('missing icon ' + name);
  return `<div class="subject" data-mark data-subject style="${style}">${svg}</div>`;
}
function photoDiv(ctx, row, style, cls = '') {
  const b64 = ctx.photos[row.photo];
  if (!b64) throw new Error('missing photo ' + row.photo);
  return `<div class="photo ${cls}" data-mark data-photo data-photo-slug="${row.photo}" style="${style};background-image:url(data:image/jpeg;base64,${b64});background-position:${row.focus || 'center'}"></div>`;
}
const val = (text, style, fit, fill) => `<div class="val" data-mark data-value ${fit ? `data-fit="${fit}"` : ''} ${fill ? `data-fill="${fill}"` : ''} style="${style}">${esc(text)}</div>`;
const cap = (text, style) => `<div class="cap" data-mark data-caption style="${style}">${esc(text)}</div>`;

// ---------------------------------------------------------------- glyph
export const LAYOUTS = {
  'glyph/stack': (row, ctx) => {
    const size = SH * 0.5;
    return headBlock(row, { maxH: SH * 0.35, counts: [2, 3], style: `left:0;top:0;width:100%` })
      + icon(ctx, row.subject, `left:${px((SW - size) / 2)};top:${px(SH * 0.44)};width:${px(size)};height:${px(size)}`);
  },
  'glyph/small-top': (row, ctx) => {
    const size = SW * 0.372;
    const bottom = SH * 0.88;
    return icon(ctx, row.subject, `left:0;top:0;width:${px(size)};height:${px(size)}`)
      + headBlock(row, { maxH: bottom - SH * 0.326, counts: [3, 4, 5], bottom: true, anchorBottom: bottom, style: `left:0;top:${px(SH * 0.326)};width:100%` })
      + `<div class="rule" data-rule style="left:0;bottom:0;width:62%;height:16px"></div>`;
  },

  // ---------------------------------------------------------------- lockup
  'lockup/top': (row) => headBlock(row, { maxH: SH * 0.36, counts: [2, 3], style: `left:0;top:0;width:100%` })
    + `<div id="vbox" style="position:absolute;left:0;top:${px(SH * 0.44)};width:100%;height:${px(SH * 0.4)}">`
    + val(row.value, `font-size:${px(H * 0.235)};text-align:left`, null, 'vbox') + `</div>`
    + cap(row.caption, `position:absolute;left:0;top:${px(SH * 0.87)};width:86%;font-size:${px(H * 0.033)}`),
  'lockup/bottom': (row) => `<div id="vbox" style="position:absolute;left:0;top:0;width:100%;height:${px(SH * 0.34)}">`
    + val(row.value, `font-size:${px(H * 0.235)}`, null, 'vbox') + `</div>`
    + cap(row.caption, `position:absolute;left:0;top:${px(SH * 0.36)};width:80%;font-size:${px(H * 0.032)}`)
    + headBlock(row, { maxH: SH * 0.45, counts: [3, 4], bottom: true, anchorBottom: SH, style: `left:0;top:${px(SH * 0.52)};width:100%` }),
  'lockup/side': (row) => `<div id="vbox" style="position:absolute;left:0;top:${px(SH * 0.02)};width:30%;height:${px(SH * 0.2)}">`
    + val(row.value, `font-size:${px(H * 0.115)}`, null, 'vbox') + `</div>`
    + cap(row.caption, `position:absolute;left:0;top:${px(SH * 0.88)};width:29%;font-size:${px(H * 0.027)}`)
    + headBlock(row, { maxH: SH * 0.94, counts: [4, 5], column: true, center: true, style: `left:34%;top:0;width:66%` }),
  'lockup/knockout': (row) => headBlock(row, { maxH: SH * 0.4, counts: [2, 3], style: `left:0;top:0;width:100%;background:var(--accent);padding:${px(SH * 0.025)} ${px(SW * 0.03)}` })
    + `<div id="vbox" style="position:absolute;right:0;top:${px(SH * 0.5)};width:100%;height:${px(SH * 0.36)}">`
    + val(row.value, `font-size:${px(H * 0.22)};text-align:right`, null, 'vbox') + `</div>`
    + cap(row.caption, `position:absolute;right:0;top:${px(SH * 0.89)};width:80%;font-size:${px(H * 0.032)};text-align:right`),

  // ---------------------------------------------------------------- figure
  'figure/mass': (row) => figBars(row, 2, 'h'),
  'figure/bars': (row) => figBars(row, 3, 'v'),
  'figure/squares': (row) => figArea(row, 'square'),
  'figure/discs': (row) => figArea(row, 'disc'),
  'figure/rows': (row) => figRows(row),
  'figure/arc': (row) => figArc(row, true),
  'figure/arc-hero': (row) => figArc(row, false),
  'figure/duel': (row) => figDuel(row),
  'figure/steps': (row) => figSteps(row),

  // ---------------------------------------------------------------- list
  'list/compare': (row) => listCompare(row),
  'list/bullets': (row) => listItems(row, false),
  'list/checklist': (row) => listItems(row, true),
  'list/stats': (row) => listStats(row),

  // ---------------------------------------------------------------- photo
  'photo/split': (row, ctx) => photoDiv(ctx, row, `left:0;top:0;width:46%;height:100%;border-radius:14px`)
    + headBlock(row, { maxH: SH * 0.94, counts: [4, 5], column: true, center: true, style: `left:51%;top:0;width:49%` }),
  'photo/card': (row, ctx) => headBlock(row, { maxH: SH * 0.3, counts: [2, 3], style: `left:0;top:0;width:100%` })
    + photoDiv(ctx, row, `left:3%;top:${px(SH * 0.36)};width:94%;height:${px(SH * 0.62)};border-radius:20px;transform:rotate(${row.tilt || -2}deg)`, 'shadowcard'),
  'photo/duotone': (row, ctx) => `<div style="position:absolute;inset:0;border-radius:14px;overflow:hidden">`
    + photoDiv(ctx, row, `inset:0;width:100%;height:100%;filter:grayscale(1) contrast(1.06)`)
    + `<div style="position:absolute;inset:0;background:linear-gradient(160deg, var(--accent), var(--muted));mix-blend-mode:color;opacity:.92"></div>`
    + `<div style="position:absolute;inset:0;background:linear-gradient(to top, var(--bg) 4%, transparent 52%);opacity:.94"></div></div>`
    + headBlock(row, { maxH: SH * 0.4, counts: [3, 4], bottom: true, anchorBottom: SH, style: `left:0;top:${px(SH * 0.55)};width:100%` }),
  'photo/frame': (row, ctx) => headBlock(row, { maxH: SH * 0.28, counts: [2, 3], style: `left:0;top:0;width:100%` })
    + `<div style="position:absolute;left:4%;top:${px(SH * 0.34)};width:92%;height:${px(SH * 0.58)};background:var(--fg);border-radius:22px;padding:18px" class="shadowcard">`
    + photoDiv(ctx, row, `position:relative;left:0;top:0;width:100%;height:100%;border-radius:10px`) + `</div>`
    + `<div class="rule" data-rule style="left:38%;bottom:${px(SH * 0.03)};width:24%;height:18px"></div>`,
  'photo/caption': (row, ctx) => headBlock(row, { maxH: SH * 0.3, counts: [2, 3], style: `left:0;top:0;width:100%` })
    + photoDiv(ctx, row, `left:0;top:${px(SH * 0.34)};width:100%;height:${px(SH * 0.5)};border-radius:14px`)
    + cap(row.note, `position:absolute;left:0;top:${px(SH * 0.88)};width:94%;font-size:${px(H * 0.031)}`),
  'photo/band': (row, ctx) => photoDiv(ctx, row, `left:0;top:0;width:100%;height:${px(SH * 0.52)};border-radius:14px 14px 0 0`)
    + `<div style="position:absolute;left:0;top:${px(SH * 0.52)};width:100%;height:${px(SH * 0.48)};background:var(--accent);border-radius:0 0 14px 14px"></div>`
    + headBlock(row, { maxH: SH * 0.38, counts: [3, 4], center: false, style: `left:5%;top:${px(SH * 0.58)};width:90%;color:var(--bg)` }),
  'photo/quiet': (row, ctx) => quiet(row, ctx),
};

function quiet(row, ctx) {
  const z = row.zone || 'bottom';
  const tint = {
    bottom: 'to top, var(--bg) 6%, color-mix(in srgb, var(--bg) 82%, transparent) 30%, transparent 56%',
    top: 'to bottom, var(--bg) 6%, color-mix(in srgb, var(--bg) 82%, transparent) 30%, transparent 56%',
    left: 'to right, var(--bg) 6%, color-mix(in srgb, var(--bg) 80%, transparent) 34%, transparent 62%',
    right: 'to left, var(--bg) 6%, color-mix(in srgb, var(--bg) 80%, transparent) 34%, transparent 62%',
  }[z];
  const pos = {
    bottom: { style: `left:0;top:${px(SH * 0.56)};width:100%`, maxH: SH * 0.42, counts: [3, 4], column: false },
    top: { style: `left:0;top:0;width:100%`, maxH: SH * 0.4, counts: [3, 4], column: false },
    left: { style: `left:0;top:0;width:52%`, maxH: SH * 0.96, counts: [4, 5], column: true },
    right: { style: `left:48%;top:0;width:52%`, maxH: SH * 0.96, counts: [4, 5], column: true },
  }[z];
  return `<div style="position:absolute;inset:0;border-radius:14px;overflow:hidden">`
    + photoDiv(ctx, row, `inset:0;width:100%;height:100%`)
    + `<div style="position:absolute;inset:0;background:linear-gradient(${tint})"></div></div>`
    + headBlock(row, pos);
}

// ---------------------------------------------------------------- figure builders
function figBars(row, n, dir) {
  const vs = row.values.slice(0, n);
  const max = Math.max(...vs.map(v => v.v));
  const head = headBlock(row, { maxH: SH * 0.32, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.36, boxH = SH * 0.62;
  if (dir === 'h') {
    const bh = boxH / (n * 1.34 + 0.05);
    const bars = vs.map((v, i) => {
      const y = top + i * bh * 1.34;
      const w = SW * 0.98 * (v.v / max);
      const inside = w > SW * 0.82;
      const slot = 'mslot' + i;
      const freeBox = `<div id="mfree${i}" style="position:absolute;left:${px(w)};top:${px(y)};width:${px(SW - w)};height:${px(bh)}"></div>`;
      return freeBox + `<div class="fig" data-mark id="${slot}" style="left:0;top:${px(y)};width:${px(w)};height:${px(bh)};background:${i === 0 ? 'var(--accent)' : 'var(--muted)'};border-radius:${px(bh / 2)}"></div>`
        + (inside
          ? val(v.text, `position:absolute;left:${px(w * 0.04)};top:${px(y + bh * 0.2)};width:${px(w * 0.92)};font-size:${px(bh * 0.52)};text-align:right;color:var(--bg)`, null, slot)
          : val(v.text, `position:absolute;left:${px(w + SW * 0.03)};top:${px(y + bh * 0.2)};width:${px(SW - w - SW * 0.03)};font-size:${px(bh * 0.52)};text-align:right`, null, 'mfree' + i))
        + cap(v.label, `position:absolute;left:0;top:${px(y + bh + 14)};font-size:${px(H * 0.026)}`);
    }).join('');
    return head + `<div data-figure style="position:absolute;inset:0">${bars}</div>`;
  }
  const bw = SW / (n * 1.28);
  const bars = vs.map((v, i) => {
    const h = boxH * 0.72 * (v.v / max);
    const x = i * bw * 1.28 + (SW - (n * 1.28 - 0.28) * bw) / 2;
    const y = top + boxH * 0.76 - h;
    const slot = 'bslot' + i;
    return `<div class="fig" data-mark id="${slot}" style="left:${px(x)};top:${px(y)};width:${px(bw)};height:${px(h)};background:${i === 0 ? 'var(--accent)' : 'var(--muted)'};border-radius:16px"></div>`
      + val(v.text, `position:absolute;left:${px(x - bw * 0.05)};top:${px(y - H * 0.054)};width:${px(bw * 1.1)};font-size:${px(H * 0.042)};text-align:center`, null, slot)
      + cap(v.label, `position:absolute;left:${px(x - bw * 0.1)};top:${px(top + boxH * 0.8)};width:${px(bw * 1.2)};font-size:${px(H * 0.022)};text-align:center;white-space:normal`);
  }).join('');
  return head + `<div data-figure style="position:absolute;inset:0">${bars}</div>`;
}

function figArea(row, shape) {
  const vs = row.values.slice(0, 2);
  const max = Math.max(...vs.map(v => v.v));
  const big = SH * 0.47;
  const head = headBlock(row, { maxH: SH * 0.26, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const baseline = SH * 0.86;
  const forms = vs.map((v, i) => {
    const sz = Math.max(big * Math.sqrt(v.v / max), SH * 0.1);
    const x = i === 0 ? 0 : SW - sz;
    const y = baseline - sz;
    const r = shape === 'disc' ? '50%' : '26px';
    return `<div class="fig" data-mark style="left:${px(x)};top:${px(y)};width:${px(sz)};height:${px(sz)};background:${i === 0 ? 'var(--accent)' : 'var(--muted)'};border-radius:${r}"></div>`
      + val(v.text, `position:absolute;${i === 0 ? 'left:0' : 'right:0'};top:${px(SH * 0.3)};font-size:${px(H * 0.046)};text-align:${i ? 'right' : 'left'}`)
      + cap(v.label, `position:absolute;${i === 0 ? 'left:0' : 'right:0'};top:${px(SH * 0.92)};font-size:${px(H * 0.026)};text-align:${i ? 'right' : 'left'}`);
  }).join('');
  return head + `<div data-figure style="position:absolute;inset:0">${forms}</div>`;
}

function figRows(row) {
  const vs = row.values.slice(0, 4);
  const max = Math.max(...vs.map(v => v.v));
  const head = headBlock(row, { maxH: SH * 0.3, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.38, rh = SH * 0.145;
  const rows = vs.map((v, i) => {
    const y = top + i * rh * 1.08;
    const w = SW * 0.62 * (v.v / max);
    return `<div class="fig" data-mark style="left:0;top:${px(y)};width:${px(Math.max(w, 90))};height:${px(rh * 0.56)};background:${i === 0 ? 'var(--accent)' : 'var(--muted)'};border-radius:99px"></div>`
      + val(v.text, `position:absolute;right:0;top:${px(y - rh * 0.04)};font-size:${px(H * 0.05)};text-align:right`)
      + cap(v.label, `position:absolute;left:0;top:${px(y + rh * 0.6)};font-size:${px(H * 0.023)}`);
  }).join('');
  return head + `<div data-figure style="position:absolute;inset:0">${rows}</div>`;
}

function figArc(row, side) {
  const f = row.fraction;
  const size = side ? SW * 0.4 : SH * 0.47;
  const r = 42, C = 2 * Math.PI * r;
  const top = side ? SH * 0.198 : SH * 0.36;
  const ring = `<div class="fig" data-mark id="ringbox" style="left:${side ? 0 : px((SW - size) / 2)};top:${px(top)};width:${px(size)};height:${px(size)}">
    <svg viewBox="0 0 100 100" style="width:100%;height:100%;transform:rotate(-90deg)">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--muted)" stroke-width="13" opacity=".45"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--accent)" stroke-width="13" stroke-linecap="round" stroke-dasharray="${(C * f).toFixed(2)} ${(C * (1 - f)).toFixed(2)}"/>
    </svg>
    <div style="position:absolute;left:0;top:${px(size * 0.34)};width:100%;text-align:center"><span class="val" data-mark data-value data-fit="ringbox" style="font-size:${px(size * 0.22)}">${esc(row.value)}</span></div>
  </div>`;
  if (side) {
    return `<div data-figure style="position:absolute;inset:0">${ring}${cap(row.caption, `position:absolute;left:0;top:${px(SH * 0.76)};width:38%;font-size:${px(H * 0.026)}`)}</div>`
      + headBlock(row, { maxH: SH * 0.94, counts: [4, 5], column: true, center: true, style: `left:44%;top:0;width:56%` });
  }
  return headBlock(row, { maxH: SH * 0.28, counts: [2, 3], style: `left:0;top:0;width:100%` })
    + `<div data-figure style="position:absolute;inset:0">${ring}${cap(row.caption, `position:absolute;left:10%;top:${px(SH * 0.92)};width:80%;text-align:center;font-size:${px(H * 0.027)}`)}</div>`;
}

function figDuel(row) {
  const vs = row.values.slice(0, 2);
  const head = headBlock(row, { maxH: SH * 0.3, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.42;
  const side = (v, i) => val(v.text, `position:absolute;${i === 0 ? 'left:0' : 'right:0'};top:${px(top + (i ? SH * 0.3 : 0))};width:100%;font-size:${px(H * 0.082)};text-align:${i ? 'right' : 'left'};color:${i ? 'var(--muted)' : 'var(--accent)'}`)
    + cap(v.label, `position:absolute;${i === 0 ? 'left:0' : 'right:0'};top:${px(top + (i ? SH * 0.3 : 0) + H * 0.088)};width:100%;font-size:${px(H * 0.026)};text-align:${i ? 'right' : 'left'}`);
  return head + `<div data-figure data-mark style="position:absolute;inset:0">`
    + vs.map(side).join('')
    + `<div class="cap" style="position:absolute;left:0;top:${px(SH * 0.235)};width:100%;text-align:center;font-size:${px(H * 0.03)};opacity:.8">vs</div></div>`;
}

function figSteps(row) {
  const head = headBlock(row, { maxH: SH * 0.28, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.36, bh = SH * 0.2;
  const rows = row.steps.slice(0, 3).map((s, i) => {
    const y = top + i * bh * 1.12;
    const bwid = SW * (0.62 + i * 0.19);
    const slot = 'sslot' + i;
    return `<div class="fig" data-mark id="${slot}" style="left:0;top:${px(y)};width:${px(bwid)};height:${px(bh * 0.72)};background:${i === 2 ? 'var(--accent)' : 'var(--muted)'};border-radius:18px"></div>`
      + val(String(i + 1), `position:absolute;left:${px(SW * 0.03)};top:${px(y + bh * 0.1)};font-size:${px(bh * 0.48)};color:var(--bg)`)
      + cap(s, `position:absolute;left:${px(SW * 0.13)};top:${px(y + bh * 0.22)};width:${px(bwid - SW * 0.17)};font-size:${px(H * 0.026)};color:var(--bg);white-space:normal;line-height:1.1`);
  }).join('');
  return head + `<div data-figure style="position:absolute;inset:0">${rows}</div>`;
}

// ---------------------------------------------------------------- list builders
function listCompare(row) {
  const head = headBlock(row, { maxH: SH * 0.28, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.36, cardH = SH * 0.62, cw = SW * 0.475;
  const card = (c, i) => `<div class="fig shadowcard" data-mark style="left:${px(i * (cw + SW * 0.05))};top:${px(top)};width:${px(cw)};height:${px(cardH)};border-radius:20px;background:color-mix(in srgb, var(--fg) ${i === 0 ? 10 : 6}%, var(--bg));border:2px solid ${i === 0 ? 'var(--accent)' : 'color-mix(in srgb, var(--muted) 45%, transparent)'}">
    <div class="cap" data-caption style="position:absolute;left:8%;top:5%;width:84%;font-size:${px(H * 0.028)};color:${i === 0 ? 'var(--accent)' : 'var(--muted)'};font-weight:800">${esc(c.title)}</div>
    ${c.items.map((t, k) => `<div class="item" data-mark data-item style="position:absolute;left:8%;top:${px(cardH * (0.2 + k * 0.24))};width:84%;font-size:${px(H * 0.026)}">${esc(t)}</div>`).join('')}
  </div>`;
  return head + row.cards.slice(0, 2).map(card).join('');
}

function listItems(row, check) {
  const head = headBlock(row, { maxH: SH * 0.3, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const items = row.items.slice(0, 5);
  const top = SH * 0.38, step = (SH * 0.6) / items.length;
  const body = items.map((t, i) => {
    const y = top + i * step;
    const marker = check
      ? `<svg viewBox="0 0 24 24" style="position:absolute;left:0;top:${px(y + step * 0.06)};width:${px(step * 0.34)};height:${px(step * 0.34)};stroke:var(--accent);fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round"><path d="M4 12l6 6L20 6"/></svg>`
      : `<div class="val" style="position:absolute;left:0;top:${px(y)};font-size:${px(step * 0.46)};width:${px(SW * 0.1)}">${i + 1}</div>`;
    return marker + `<div class="item" data-mark data-item style="position:absolute;left:${px(SW * 0.13)};top:${px(y + step * 0.03)};width:${px(SW * 0.87)};font-size:${px(H * 0.03)}">${esc(t)}</div>`;
  }).join('');
  return head + `<div data-mark style="position:absolute;inset:0">${body}</div>`;
}

function listStats(row) {
  const head = headBlock(row, { maxH: SH * 0.33, counts: [2, 3], style: `left:0;top:0;width:100%` });
  const top = SH * 0.37, step = SH * 0.2;
  const body = row.values.slice(0, 3).map((v, i) => {
    const y = top + i * step;
    return val(v.text, `position:absolute;left:0;top:${px(y)};font-size:${px(H * 0.072)}`)
      + cap(v.label, `position:absolute;left:0;top:${px(y + H * 0.076)};width:94%;font-size:${px(H * 0.025)}`);
  }).join('');
  return head + `<div data-figure data-mark style="position:absolute;inset:0">${body}</div>`;
}

export function layoutKey(row) {
  if (row.kind === 'glyph') return 'glyph/' + (row.layout || 'stack');
  if (row.kind === 'lockup') return 'lockup/' + (row.layout || 'top');
  if (row.kind === 'figure') return 'figure/' + row.pattern;
  if (row.kind === 'list') return 'list/' + row.pattern;
  if (row.kind === 'photo') return 'photo/' + (row.layout === 'quiet' ? 'quiet' : row.layout);
  throw new Error('unknown kind ' + row.kind);
}

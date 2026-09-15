// the geometry check, run in the page before the screenshot
export const GATE_SRC = `
(function(){
  const W = window.innerWidth, H = window.innerHeight, SAFE = 0.04;
  const L = W*SAFE, T = H*SAFE, R = W*(1-SAFE), B = H*(1-SAFE);
  const rect = el => el.getBoundingClientRect();
  const marks = [...document.querySelectorAll('[data-mark]')];
  const content = marks.filter(m => !m.hasAttribute('data-rule'));
  const texts = [...document.querySelectorAll('[data-line],[data-value],[data-caption],[data-item],[data-note]')];
  const lines = [...document.querySelectorAll('[data-line]')];
  const out = {};

  const eps = 0.75;
  out.over = marks.concat(texts.filter(t=>!t.hasAttribute('data-mark'))).filter(m => { const r = rect(m); return r.left < L-eps || r.top < T-eps || r.right > R+eps || r.bottom > B+eps; })
    .map(m => (m.dataset.head!==undefined?'head':m.className||m.tagName));

  const ext = els => {
    if(!els.length) return {x:0,y:0,l:0,t:0,r:0,b:0};
    let l=1e9,t=1e9,r=-1e9,b=-1e9;
    for(const e of els){ const q=rect(e); l=Math.min(l,q.left); t=Math.min(t,q.top); r=Math.max(r,q.right); b=Math.max(b,q.bottom); }
    return {x:(r-l)/W, y:(b-t)/H, l,t,r,b};
  };
  const em = ext(marks), ec = ext(content);
  out.spanX = +em.x.toFixed(3); out.spanY = +em.y.toFixed(3);
  out.contentX = +ec.x.toFixed(3); out.contentY = +ec.y.toFixed(3);

  // largest empty square over content marks
  const CELL = 27, GX = Math.ceil(W/CELL), GY = Math.ceil(H/CELL);
  const grid = new Uint8Array(GX*GY);
  for(const e of content){
    const q = rect(e);
    const x0=Math.max(0,Math.floor(q.left/CELL)), x1=Math.min(GX-1,Math.ceil(q.right/CELL)-1);
    const y0=Math.max(0,Math.floor(q.top/CELL)), y1=Math.min(GY-1,Math.ceil(q.bottom/CELL)-1);
    for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++) grid[y*GX+x]=1;
  }
  const dp = new Int16Array(GX*GY); let best=0, bx=0, by=0;
  for(let y=0;y<GY;y++) for(let x=0;x<GX;x++){
    if(grid[y*GX+x]) { dp[y*GX+x]=0; continue; }
    dp[y*GX+x] = (x===0||y===0) ? 1 : 1+Math.min(dp[(y-1)*GX+x], dp[y*GX+x-1], dp[(y-1)*GX+x-1]);
    if(dp[y*GX+x]>best) { best=dp[y*GX+x]; bx=x; by=y; }
  }
  out.voidRect = [(bx-best+1)*CELL, (by-best+1)*CELL, best*CELL, best*CELL];
  out.voidSide = Math.round(best*CELL);
  out.voidBlock = best*CELL >= 0.4*Math.min(W,H);

  const head = document.querySelector('[data-head]');
  if(head){
    const hr = rect(head), stage = head.parentElement ? rect(head.parentElement) : {width:W*0.92};
    const col = head.dataset.col === '1';
    out.headW = +(hr.width/(W*0.92)).toFixed(3);
    out.headH = +(hr.height/H).toFixed(3);
    out.headSize = +(parseFloat(getComputedStyle(head).fontSize)/H).toFixed(4);
    let wid = 0; for(const t of head.querySelectorAll('.t')) wid = Math.max(wid, rect(t).width);
    out.lineFill = +(wid/W).toFixed(3);
    out.col = col;
    const text = head.dataset.text || '';
    out.titleChars = text.length;
    out.titleWords = text.trim().split(/\\s+/).length;
    out.semicolon = text.indexOf(';') >= 0;
    const NUMW = /\\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|million|billion|один|два|три|четыре|пять)\\b/i;
    out.numberWords = NUMW.test(text) ? (text.match(NUMW)||[])[0] : '';
    const shapes = [];
    if(/^why\\b/i.test(text)) shapes.push('why-opener');
    if(/\\b(we|you)\\s+(just\\s+)?(got|get|are getting|finally)\\b/i.test(text)) shapes.push('announcement');
    if(/[.!?]\\s+[A-Z]/.test(text)) shapes.push('two-sentences');
    if(/[.]\\s*$/.test(text)) shapes.push('terminal-period');
    if(/,\\s*(while still|without|instead of|but still)\\b/i.test(text)) shapes.push('trailing-qualifier');
    if((text.match(/,/g)||[]).length >= 3) shapes.push('roll-call');
    out.titleShape = shapes.join(',');
  }

  // line rhythm
  const lrs = lines.map(rect).sort((a,b)=>a.top-b.top);
  let gaps = [], lh = lrs.length ? lrs[0].height : 1;
  for(let i=1;i<lrs.length;i++) gaps.push(lrs[i].top - lrs[i-1].bottom);
  out.gapMin = gaps.length ? +(Math.min(...gaps)/lh).toFixed(3) : 1;
  out.gapSpread = gaps.length>1 ? +((Math.max(...gaps)-Math.min(...gaps))/lh).toFixed(3) : 0;
  out.lineOver = lines.filter(l => { const q = rect(l.querySelector('.t')||l); return q.left<L-eps||q.right>R+eps||q.top<T-eps||q.bottom>B+eps; }).length;
  out.wrapped = lines.filter(l => { const t=l.querySelector('.t'); return t && t.scrollWidth > t.clientWidth+1; }).length;

  // clearance between type and a drawn subject or figure form
  const subjects = [...document.querySelectorAll('[data-subject]')];
  let clear = 1;
  for(const s of subjects){ const sr = rect(s);
    for(const l of lines){ const q = rect(l);
      const dx = Math.max(sr.left - q.right, q.left - sr.right, 0);
      const dy = Math.max(sr.top - q.bottom, q.top - sr.bottom, 0);
      const d = (dx===0 && dy===0) ? -1 : Math.max(dx,dy)/Math.min(W,H);
      clear = Math.min(clear, d);
    }
  }
  out.clearance = +clear.toFixed(3);

  // duplicate content words and digit strings across text elements
  const STOP = new Set(('a an the of to in on at it its is are was were be been and or but for with from that this these those you your yours my our their as by into out up down over under not no than then so if when what which who how why do does did can could will would shall should may might must have has had i me we us them he she they one'.split(' ')));
  const seen = new Map(); const dup = [];
  for(const e of texts){
    const words = (e.textContent||'').toLowerCase().replace(/[^a-z0-9а-яё .-]/gi,' ').split(/\\s+/).filter(Boolean);
    const uniq = new Set(words.filter(w => w.length>2 && !STOP.has(w) && !/^[0-9.]+$/.test(w)));
    for(const w of uniq){
      if(seen.has(w) && seen.get(w) !== e) { dup.push(w); } else if(!seen.has(w)) seen.set(w, e);
    }
  }
  out.dup = [...new Set(dup)];
  const digits = [];
  for(const e of texts) for(const d of ((e.textContent||'').match(/[0-9][0-9.,]*/g)||[])) digits.push(d.replace(/[.,]$/,''));
  const dd = digits.filter((d,i)=>digits.indexOf(d)!==i);
  out.dupDigits = [...new Set(dd)];

  // a lockup's digits must not also be in the sentence (R6)
  if(head){
    const hv = (head.dataset.text||'').match(/[0-9][0-9.,]*/g)||[];
    const lock = [...document.querySelectorAll('.val[data-value]')].map(v=>v.textContent).join(' ');
    const clash = hv.filter(d => lock.indexOf(d) >= 0);
    if(clash.length) out.dupDigits = [...new Set(out.dupDigits.concat(clash))];
  }

  // text that must fit inside a shape
  out.fitFail = [...document.querySelectorAll('[data-fit]')].filter(el=>{
    const box = document.getElementById(el.dataset.fit); if(!box) return true;
    const b = rect(box), q = rect(el);
    return q.left < b.left+b.width*0.1-eps || q.right > b.right-b.width*0.1+eps || q.top < b.top+b.height*0.1-eps || q.bottom > b.bottom-b.height*0.1+eps;
  }).length;

  // figures carry values, values carry captions
  const figs = [...document.querySelectorAll('[data-figure]')];
  let unlab = 0, uncap = 0;
  for(const f of figs){
    const vs = f.querySelectorAll('[data-value]').length, cs = f.querySelectorAll('[data-caption]').length;
    if(vs < 2 && !(vs === 1 && cs >= 1)) unlab++;
    if(cs < vs) uncap += (vs - cs);
  }
  out.unlabelled = unlab; out.uncaptioned = uncap;

  // nothing clipped by any box
  out.clipped = marks.concat(texts).filter(e => {
    const cs = getComputedStyle(e);
    const hides = cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
    if(hides && (e.scrollWidth > e.clientWidth+1 || e.scrollHeight > e.clientHeight+1)) return true;
    // a nowrap value paints outside its own box while its rect stays inside it
    if((e.hasAttribute('data-value')||e.hasAttribute('data-caption')||e.hasAttribute('data-item')) && e.scrollWidth > e.clientWidth+1) return true;
    const q = rect(e);
    let p = e.parentElement;
    while(p && p.tagName !== 'BODY'){
      const pc = getComputedStyle(p);
      if(pc.overflowX !== 'visible' || pc.overflowY !== 'visible'){
        const pr = rect(p);
        if(q.left < pr.left-eps || q.right > pr.right+eps || q.top < pr.top-eps || q.bottom > pr.bottom+eps) return true;
      }
      p = p.parentElement;
    }
    return false;
  }).map(e => e.dataset.head!==undefined ? 'head' : (e.className||e.tagName)).slice(0,6);

  // no plate behind a glyph
  out.plated = subjects.some(s => {
    let p = s.parentElement, n = 0;
    while(p && n++ < 3){
      const bg = getComputedStyle(p).backgroundColor;
      if(bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && !p.classList.contains('ground') && p.tagName !== 'BODY') return true;
      p = p.parentElement;
    }
    return false;
  });

  // solid type only
  out.stroke = texts.some(e => {
    const cs = getComputedStyle(e);
    const sw = parseFloat(cs.webkitTextStrokeWidth || '0');
    const clipped = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';
    return sw > 0.4 || (!clipped && (cs.color === 'rgba(0, 0, 0, 0)' || cs.color === 'transparent'));
  });

  // layout skeleton, quantised to a twentieth of the canvas
  const q20 = v => Math.round(v/ (W/20));
  const headText = head ? (head.dataset.text||'') : '';
  const photoSlug = (document.querySelector('[data-photo-slug]')||{dataset:{}}).dataset.photoSlug||'';
  out.skeleton = headText + '@' + photoSlug + '@' + content.map(e=>{ const r=rect(e);
    const role = e.dataset.head!==undefined?'h':(e.hasAttribute('data-subject')?'s':(e.hasAttribute('data-photo')?'p':(e.hasAttribute('data-figure')?'f':'m')));
    return role+q20(r.left)+','+q20(r.top)+','+q20(r.width)+','+q20(r.height);
  }).sort().join('|') + '#' + [...document.querySelectorAll('[data-value]')].map(v=>v.textContent.trim()).sort().join('~');

  return out;
})()
`;

export function judge(m, opts = {}) {
  const f = [];
  const col = !!m.col;
  if (m.over && m.over.length) f.push('R1 over:' + m.over.join('/'));
  if (m.gapMin < 0.06) f.push('R2 gapMin=' + m.gapMin);
  if (m.gapSpread > 0.08) f.push('R2 gapSpread=' + m.gapSpread);
  if (m.lineOver) f.push('R2 lineOver=' + m.lineOver);
  if (m.wrapped) f.push('R2 wrapped=' + m.wrapped);
  if (m.clearance < 0.02) f.push('R3 clearance=' + m.clearance);
  if (m.fitFail) f.push('R4 fitFail=' + m.fitFail);
  if (m.dup && m.dup.length) f.push('R5 dup:' + m.dup.join('/'));
  if (m.dupDigits && m.dupDigits.length) f.push('R6 dupDigits:' + m.dupDigits.join('/'));
  if (m.clipped && m.clipped.length) f.push('R16 clipped:' + m.clipped.join('/'));
  if (m.plated) f.push('R18 plated');
  if (m.stroke) f.push('R9 stroke');
  if (m.unlabelled) f.push('R7 unlabelled=' + m.unlabelled);
  if (m.uncaptioned) f.push('R8 uncaptioned=' + m.uncaptioned);
  if (m.spanX < 0.8) f.push('R11 spanX=' + m.spanX);
  if (m.spanY < 0.8) f.push('R11 spanY=' + m.spanY);
  if (m.contentX < 0.7) f.push('R11 contentX=' + m.contentX);
  if (m.contentY < 0.7) f.push('R11 contentY=' + m.contentY);
  if (m.voidBlock) f.push('R11 void=' + m.voidSide);
  if (m.headW < (col ? 0.3 : 0.7)) f.push('R11 headW=' + m.headW);
  if (m.headH < 0.22) f.push('R11 headH=' + m.headH);
  if (m.lineFill < (col ? 0.24 : 0.66)) f.push('R11 lineFill=' + m.lineFill);
  if (m.headSize < (col ? 0.042 : 0.05) || m.headSize > 0.14) f.push('R22 headSize=' + m.headSize);
  if (m.numberWords) f.push('R22 numberWord:' + m.numberWords);
  if (m.semicolon) f.push('R22 semicolon');
  if (m.titleChars > 70) f.push('R22 titleChars=' + m.titleChars);
  if (m.titleWords > 12) f.push('R22 titleWords=' + m.titleWords);
  if (m.titleShape) f.push('R22 titleShape:' + m.titleShape);
  return f;
}

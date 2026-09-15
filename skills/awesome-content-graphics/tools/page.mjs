// page scaffolding: grounds, headline block, fit script
// The ratio is the caller's, so W and H are live bindings the build sets from
// set.json before any layout runs. SAFE is the one constant that never moves.
export let W = 1080, H = 1350;
export const SAFE = 0.04;
export function setPageCanvas(w, h) { W = w; H = h; }

export function fontCss(fonts, face) {
  const list = fonts[face] || [];
  return list.map(f => `@font-face{font-family:"${face}";font-style:normal;font-weight:${f.w};font-display:block;src:url(data:font/woff2;base64,${f.b64}) format("woff2")}`).join('');
}

export const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function ground(row, grain) {
  const p = row.palette, a = row.gradientAngle || 147;
  const mix = (hex, pct) => `color-mix(in srgb, ${hex} ${pct}%, ${p.bg})`;
  let css = '';
  switch (row.ground) {
    case 'gradient':
      css = `background:linear-gradient(${a}deg, ${mix(p.accent, 16)} 0%, ${p.bg} 52%, ${mix(p.muted, 20)} 100%)`;
      break;
    case 'blob':
      css = `background:${p.bg}`;
      break;
    case 'spot':
      css = `background:radial-gradient(58% 46% at 24% -8%, ${mix(p.accent, 26)}, transparent 70%), radial-gradient(54% 46% at 94% 8%, ${mix(p.muted, 24)}, transparent 72%), ${p.bg}`;
      break;
    case 'glow':
      css = `background:radial-gradient(closest-side at 86% 112%, ${mix(p.accent, 34)}, transparent 76%), radial-gradient(closest-side at -14% -10%, ${mix(p.muted, 22)}, transparent 72%), ${p.bg}`;
      break;
    case 'paper':
      css = `background:linear-gradient(176deg, ${mix(p.muted, 14)}, ${p.bg} 62%)`;
      break;
    default:
      css = `background:${p.bg}`;
  }
  let extra = '';
  if (row.ground === 'blob') {
    const b = (x, y, s, col, alpha) => `<div class="blob" style="left:${x}%;top:${y}%;width:${s}%;height:${s * 0.8}%;background:${col};opacity:${alpha}"></div>`;
    extra = `<div class="blobs">${b(-12, -10, 62, p.accent, .3)}${b(52, 44, 68, p.muted, .26)}${b(16, 70, 50, p.accent, .18)}</div>`;
  }
  const g = row.grain ? `<div class="grain" style="opacity:${row.grain};background-image:url(data:image/png;base64,${grain})"></div>` : '';
  return { css, html: `<div class="ground" style="${css}"></div>${extra}${g}` };
}

export function headBlock(row, opts) {
  const { maxH, counts, column, center, bottom, anchorBottom, style } = opts;
  const text = row.headline.join(' ');
  const effect = row.effect || 'plain';
  return `<div class="head ${effect}${column ? ' col' : ''}" data-mark data-head data-max-h="${Math.round(maxH)}" data-counts="${counts.join(',')}" data-center="${center ? 1 : 0}" data-bottom="${bottom ? 1 : 0}" data-anchor-bottom="${Math.round(anchorBottom || 0)}" data-col="${column ? 1 : 0}" data-text="${esc(text)}" data-mark-word="${esc(row.markWord || '')}" data-accent-line="${row.accentLine == null ? -1 : row.accentLine}" style="${style || ''}"></div>`;
}

export const baseCss = () => `
*{box-sizing:border-box}
html,body{margin:0;padding:0;width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased}
.ground{position:absolute;inset:0;z-index:0}
.blobs{position:absolute;inset:0;z-index:0;filter:blur(110px)}
.blob{position:absolute;border-radius:62% 38% 47% 53% / 43% 55% 45% 57%}
.grain{position:absolute;inset:0;z-index:5;pointer-events:none;background-repeat:repeat}
.stage{position:absolute;left:${SAFE * 100}%;top:${SAFE * 100}%;right:${SAFE * 100}%;bottom:${SAFE * 100}%;z-index:2}
.head{position:absolute;font-family:var(--face);font-weight:var(--fw);letter-spacing:-.025em;line-height:1}
.head .ln{display:block;white-space:nowrap;line-height:1;margin-bottom:var(--gap,.12em)}
.head .ln:last-child{margin-bottom:0}
.head .t{display:inline-block;color:var(--fg)}
.accent{color:var(--accent)}
.rule{position:absolute;background:var(--accent);border-radius:99px}
.head .t .hi{background:var(--accent);color:var(--bg);padding:0 .08em;border-radius:.05em}
.head .t .un{box-shadow:inset 0 -.13em 0 var(--accent)}
.head.mixed-weight .ln:first-child .t{font-weight:900}
.head.mixed-weight .ln:not(:first-child) .t{font-weight:var(--fwlight)}
.head.quote .t{font-family:var(--serif)}
.subject{position:absolute;color:var(--accent)}
.subject svg{width:100%;height:100%;display:block;stroke-width:1.3}
.fig{position:absolute}
.val{font-family:var(--face);font-weight:var(--fw);color:var(--accent);letter-spacing:-.03em;line-height:.9;white-space:nowrap}
.cap{font-family:var(--face);font-weight:600;color:var(--muted);letter-spacing:.005em;line-height:1.15}
.item{font-family:var(--face);font-weight:600;color:var(--fg);line-height:1.2}
.photo{position:absolute;background-size:cover;background-repeat:no-repeat}
.shadowcard{box-shadow:0 40px 90px -34px rgba(0,0,0,.6)}
`;

export function fitScript(faces, weights) {
  return `
const FACES=${JSON.stringify(faces)}, WEIGHTS=${JSON.stringify(weights)}, H=${H}, W=${W};
// the probe lives inside the headline and carries its class, so an effect that
// changes the face (quote sets the serif) is measured rather than guessed
let MEAS=null;
function measure(text, size, head){
  if(!MEAS || MEAS.parentElement!==head){
    MEAS=document.createElement('span');
    MEAS.className='t';
    MEAS.setAttribute('data-probe','1');
    MEAS.style.cssText='position:absolute;visibility:hidden;white-space:pre;left:-99999px;top:0';
    head.appendChild(MEAS);
  }
  if(head.style.fontSize!==size+'px') head.style.fontSize=size+'px';
  MEAS.textContent=text;
  return MEAS.getBoundingClientRect().width;
}
function dropProbe(){ if(MEAS && MEAS.parentElement) MEAS.remove(); MEAS=null; }
// greedy wrap at a given size; returns the lines or null when a single word will not fit
function wrapAt(text, size, maxW, head){
  const words=text.split(' '); const out=[]; let cur='';
  for(const w of words){
    const trial=cur?cur+' '+w:w;
    if(measure(trial,size,head)<=maxW) cur=trial;
    else { if(!cur) return null; out.push(cur); cur=w; if(measure(w,size,head)>maxW) return null; }
  }
  if(cur) out.push(cur);
  return out;
}
// balance the last line so a wrap never leaves one short word alone
function rebalance(lines, size, maxW, head){
  if(lines.length<2) return lines;
  for(let pass=0;pass<3;pass++){
    const last=lines[lines.length-1];
    if(measure(last,size,head) > maxW*0.42) break;
    const prev=lines[lines.length-2].split(' ');
    if(prev.length<2) break;
    const moved=prev.pop();
    const cand=[...lines]; cand[cand.length-2]=prev.join(' '); cand[cand.length-1]=moved+' '+last;
    if(measure(cand[cand.length-1],size,head)>maxW) break;
    lines=cand;
  }
  return lines;
}
function markUp(line, head, idx){
  const mw=head.dataset.markWord, eff=head.className;
  let html=line.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const al=+head.dataset.accentLine;
  if(/accent-line/.test(eff) && al===idx) return '<span class="t accent">'+html+'</span>';
  if(/slab|highlight/.test(eff) && mw && line.indexOf(mw)>=0)
    return '<span class="t">'+html.split(mw).join('<span class="hi">'+mw+'</span>')+'</span>';
  if(/underline/.test(eff) && mw && line.indexOf(mw)>=0)
    return '<span class="t">'+html.split(mw).join('<span class="un">'+mw+'</span>')+'</span>';
  return '<span class="t">'+html+'</span>';
}
function render(head, lines){
  head.innerHTML=lines.map((l,i)=>'<div class="ln" data-line>'+markUp(l,head,i)+'</div>').join('');
}
function widest(head){ let m=0; for(const t of head.querySelectorAll('.t')) m=Math.max(m,t.getBoundingClientRect().width); return m; }
const LINE_GAP=0.12, GAP_MAX=0.34;
// a real face sets a line box taller than its font size; measure the factor once
// so the height model matches what the page will actually lay out
let LF=1;
function lineFactor(head){
  const keep=head.innerHTML, ks=head.style.fontSize;
  head.style.fontSize='100px';
  head.innerHTML='<div class="ln" data-line><span class="t">Mgjpq</span></div>';
  const h=head.querySelector('.ln').getBoundingClientRect().height;
  head.innerHTML=keep; head.style.fontSize=ks;
  return h/100;
}
// leading is a lever: word boundaries make the block height jump between line
// counts, and the gap is what lands it inside the band a layout reserves
function gapFor(n, size, maxH, hFloor){
  const h=g=>n*size*LF+(n-1)*g*size;
  let g=LINE_GAP;
  if(n>1 && h(g)<hFloor) g=Math.min(GAP_MAX, (hFloor-n*size*LF)/((n-1)*size));
  if(h(g)>maxH+0.5){
    if(n<2) return null;
    g=(maxH-n*size*LF)/((n-1)*size);
    if(g<LINE_GAP*0.85) return null;
  }
  return {g:+g.toFixed(4), h:h(g)};
}
function feasible(text, size, maxW, maxH, maxLines, head, hFloor){
  const ls0=wrapAt(text,size,maxW,head);
  if(!ls0 || ls0.length>maxLines) return null;
  const gp=gapFor(ls0.length, size, maxH, hFloor);
  if(!gp) return null;
  const ls=rebalance(ls0,size,maxW,head);
  return {lines:ls, gap:gp.g, h:gp.h};
}
async function run(){
  try{
    const jobs=[];
    for(const f of FACES) for(const w of WEIGHTS) jobs.push(document.fonts.load(w+' 100px "'+f+'"'));
    await Promise.all(jobs);
    await document.fonts.ready;
  }catch(e){}
  const head=document.querySelector('[data-head]');
  if(head){
    const col=head.dataset.col==='1';
    const pad=parseFloat(getComputedStyle(head).paddingLeft)||0;
    const maxW=head.getBoundingClientRect().width - pad*2;
    const maxH=+head.dataset.maxH;
    const counts=head.dataset.counts.split(',').map(Number);
    const maxLines=col?Math.min(9,Math.max(...counts)+5):Math.min(5,Math.max(...counts)+1);
    const text=head.dataset.text;
    LF=lineFactor(head);
    const floor=Math.floor(col?H*0.044:H*0.052), ceil=Math.floor(H*0.137);
    // the block has to clear 22% of the canvas height, so a measure that is too wide
    // is narrowed until the type stacks tall enough, never below the lineFill floor
    const minLine=col?W*0.25:W*0.68;
    const widths=col?[maxW, maxW*0.86, maxW*0.72, maxW*0.6, maxW*0.55]:[maxW, maxW*0.95, maxW*0.9, maxW*0.86, maxW*0.82, maxW*0.78, maxW*0.74];
    const widestOf=(ls,s2)=>{ let m=0; for(const l of ls) m=Math.max(m,measure(l,s2,head)); return m; };
    const hFloor=col?H*0.41:H*0.2295;
    let bestSize=0, bestLines=null, bestGap=LINE_GAP, bestScore=-1;
    for(const mw of widths){
      for(let s2=ceil; s2>=floor; s2--){
        const c=feasible(text,s2,mw,maxH,maxLines,head,hFloor);
        if(!c) continue;
        if(c.h<hFloor || widestOf(c.lines,s2)<minLine) continue;
        if(s2>bestSize){ bestSize=s2; bestLines=c.lines; bestGap=c.gap; bestScore=1; }
        break;
      }
    }
    if(!bestLines){
      for(const mw of widths){
        let lo=floor, hi=ceil, s3=0, c3=null;
        while(lo<=hi){ const mid=Math.floor((lo+hi)/2); const c=feasible(text,mid,mw,maxH,maxLines,head,hFloor); if(c){ s3=mid; c3=c; lo=mid+1; } else hi=mid-1; }
        if(!c3) continue;
        const score=(c3.h>=hFloor?4000:0)+(widestOf(c3.lines,s3)>=minLine?4000:0)+Math.round(600*Math.min(1,c3.h/maxH))+s3;
        if(score>bestScore){ bestScore=score; bestSize=s3; bestLines=c3.lines; bestGap=c3.gap; }
      }
    }
    window.__fit={path:bestScore===1?'primary':(bestLines?'fallback':'none'),size:bestSize,lines:bestLines&&bestLines.length,gap:bestGap,maxW:Math.round(maxW),maxH:maxH,maxLines:maxLines,minLine:Math.round(minLine),hFloor:Math.round(hFloor)};
    if(!bestLines){ bestSize=floor; bestLines=wrapAt(text,floor,maxW,head)||[text]; }
    dropProbe();
    head.style.setProperty('--gap', bestGap+'em');
    head.style.fontSize=bestSize+'px';
    render(head,bestLines);
    // the model counts line boxes at line-height 1; a real face adds its own
    // descent, so the block is corrected against its measured height
    for(let guard=0; guard<220 && bestSize>12; guard++){
      if(head.getBoundingClientRect().height<=maxH+0.5) break;
      bestSize-=1; head.style.fontSize=bestSize+'px';
    }
    if(bestLines.length>1){
      let g=bestGap;
      while(head.getBoundingClientRect().height<hFloor && g<0.34){
        const next=+(g+0.01).toFixed(3);
        head.style.setProperty('--gap', next+'em');
        if(head.getBoundingClientRect().height>maxH+0.5){ head.style.setProperty('--gap', g+'em'); break; }
        g=next;
      }
    }
    if(head.dataset.center==='1'){
      const r=head.getBoundingClientRect(), st=head.parentElement.getBoundingClientRect();
      head.style.top=Math.max(0,(st.height-r.height)/2)+'px';
    }
    if(head.dataset.bottom==='1'){
      const r=head.getBoundingClientRect();
      head.style.top=Math.max(0,(+head.dataset.anchorBottom)-r.height)+'px';
    }
  }
  // a display value fills its box: shrink until the text actually fits the width
  for(const el of document.querySelectorAll('[data-fill]')){
    const box=document.getElementById(el.dataset.fill);
    if(!box) continue;
    const bh=box.getBoundingClientRect().height;
    let size=parseFloat(getComputedStyle(el).fontSize);
    for(let i=0;i<300 && size>14;i++){
      if(el.scrollWidth<=el.clientWidth+1 && el.getBoundingClientRect().height<=bh*1.9) break;
      size-=2; el.style.fontSize=size+'px';
    }
  }
  for(const el of document.querySelectorAll('[data-fit]')){
    const box=document.getElementById(el.dataset.fit);
    if(!box) continue;
    const br=box.getBoundingClientRect();
    const padW=br.width*0.78, padH=br.height*0.78;
    let size=parseFloat(getComputedStyle(el).fontSize);
    for(let i=0;i<80;i++){
      const r=el.getBoundingClientRect();
      if(r.width<=padW && r.height<=padH) break;
      size-=2; el.style.fontSize=size+'px';
      if(size<12) break;
    }
  }
  window.__fitted=true;
}
run();
`;
}

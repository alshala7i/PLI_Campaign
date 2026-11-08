// Shared helpers: paths, placeholders, components, Playwright render pool.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/content.json'), 'utf8'));
const PH = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/placeholders.json'), 'utf8'));

const furl = (p) => 'file://' + path.join(ROOT, p);
const LOGO = {
  shield: furl('assets/logos/pli_shield.png'),
  aca: furl('assets/logos/aca_logo.png'),
  smuDark: furl('assets/logos/smu_dark.png'),
  smuWhite: furl('assets/logos/smu_white.png'),
};
const PHOTO = {
  ceremony: furl('assets/photos/grad_ceremony.jpg'),
  trio: furl('assets/photos/grad_trio.jpg'),
  class: furl('assets/photos/class_session.jpg'),
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Visual text: escape, **bold** -> <b>, *italic note* -> small, {{KEY}} -> value or magenta box.
function vt(s, opts = {}) {
  let t = esc(s);
  t = t.replace(/\{\{([A-Z0-9_.]+)\}\}/g, (m, k) => {
    const p = PH[k];
    if (p && p.visual) return p.confirmed || opts.fill !== false ? esc(p.visual) : `<span class="ph">${k}</span>`;
    return `<span class="ph">${k}</span>`;
  });
  t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return t;
}
// Copy text (captions): placeholders become visible [BRACKETS] unless a value exists.
function ct(s) {
  return String(s).replace(/\{\{([A-Z0-9_.]+)\}\}/g, (m, k) => {
    const p = PH[k];
    return p && p.copy ? p.copy : m;
  });
}

const shield = (cls = '') => `<img class="shield ${cls}" src="${LOGO.shield}">`;
const counter = (i, n) => `<div class="counter">${i}/${n}</div>`;
const dots = (opts = {}) => {
  const { size = 64, gap = 22, color = 'var(--indigo)', w = 6, filled = 6 } = opts;
  let h = '';
  for (let i = 0; i < 10; i++) h += `<i class="${i < filled ? 'f' : ''}"></i>`;
  return `<div class="dots" style="--ds:${size}px;--dg:${gap}px;--dc:${color};--dw:${w}px">${h}</div>`;
};
const lockup = (scale = 1) =>
  `<div class="lockup" style="transform:scale(${scale});transform-origin:left bottom">
     <img src="${LOGO.shield}" style="height:${84}px">
     <div class="sep"></div>
     <img src="${LOGO.smuDark}" style="height:${78}px">
     <div class="sep"></div>
     <img src="${LOGO.aca}" style="height:${92}px">
   </div>`;
const dateblock = (m, d, extra = '') => `<div class="dateblock" ${extra}><div class="m">${esc(m)}</div><div class="d">${esc(d)}</div></div>`;
const swipe = (color = 'currentColor') =>
  `<div class="swipe" style="color:${color}">Swipe <svg viewBox="0 0 86 24"><path d="M2 12h78M68 2l12 10-12 10" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;

function page({ w = 1080, h = 1350, body, css = '', cls = '' }) {
  const fonts = fs.readFileSync(path.join(ROOT, 'fonts/fonts.css'), 'utf8').replace(/FONTDIR/g, 'file://' + path.join(ROOT, 'fonts'));
  const brand = fs.readFileSync(path.join(ROOT, 'src/brand.css'), 'utf8');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}\n:root{--W:${w}px;--H:${h}px}\n${brand}\n${css}</style></head>
<body><div class="cv ${cls}">${body}</div></body></html>`;
}

// ---------- render pool
let _browser = null;
async function browser() {
  if (_browser) return _browser;
  const { chromium } = require('playwright');
  const opts = { args: ['--allow-file-access-from-files', '--disable-web-security', '--font-render-hinting=none'] };
  if (process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
  _browser = await chromium.launch(opts);
  return _browser;
}
async function closeBrowser() { if (_browser) await _browser.close(); _browser = null; }

const TMP = path.join(OUT, '_html');
fs.mkdirSync(TMP, { recursive: true });
let tmpN = 0;
async function writeHtml(html) {
  const f = path.join(TMP, `p${process.pid}_${tmpN++}.html`);
  fs.writeFileSync(f, html);
  return f;
}

// jobs: [{html, out, w, h, pdf?, check?}] -> renders PNG (or JPEG) with overflow check
async function renderAll(jobs, conc = 4) {
  const b = await browser();
  const issues = [];
  let idx = 0;
  async function worker() {
    const ctx = await b.newContext({ deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    while (idx < jobs.length) {
      const j = jobs[idx++];
      await pg.setViewportSize({ width: j.w, height: j.h });
      const f = await writeHtml(j.html);
      await pg.goto('file://' + f, { waitUntil: 'load' });
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForFunction(() => !document.querySelector('script') || document.body.getAttribute('data-ready') === '1', null, { timeout: 8000 }).catch(() => {});
      await pg.waitForTimeout(30);
      const of = await pg.evaluate(() => {
        const bad = [];
        document.querySelectorAll('[data-fit]').forEach((el) => {
          if (window.__over ? window.__over(el) : (el.scrollWidth > el.clientWidth + 2)) bad.push((el.textContent || '').trim().slice(0, 50));
        });
        return bad;
      });
      if (of.length) issues.push({ out: j.out, overflow: of });
      fs.mkdirSync(path.dirname(j.out), { recursive: true });
      if (j.out.endsWith('.pdf')) await pg.pdf({ path: j.out, width: j.w + 'px', height: j.h + 'px', printBackground: true, pageRanges: '1' });
      else await pg.screenshot({ path: j.out, type: j.out.endsWith('.jpg') ? 'jpeg' : 'png', quality: j.out.endsWith('.jpg') ? 92 : undefined });
      fs.unlinkSync(f);
    }
    await ctx.close();
  }
  await Promise.all(Array.from({ length: Math.min(conc, jobs.length) }, worker));
  return issues;
}

// Auto-fit: shrink font-size of [data-fit] elements until they fit (runs in page).
const FIT_JS = `<script>
(function(){
  function over(el){
    var cs=getComputedStyle(el), fs=parseFloat(cs.fontSize);
    var limit = cs.maxHeight!=='none' ? parseFloat(cs.maxHeight) : (el.style.height ? el.clientHeight : Infinity);
    var oh = el.scrollHeight > limit + Math.max(6, fs*0.3);
    var ow = el.scrollWidth > el.clientWidth + 2;
    return oh||ow;
  }
  window.__over=over;
  function fit(el){
    var min = parseFloat(el.getAttribute('data-min')||'20');
    var fs = parseFloat(getComputedStyle(el).fontSize);
    var guard=0;
    while(over(el)&&fs>min&&guard<200){fs-=2;el.style.fontSize=fs+'px';guard++;}
  }
  document.fonts.ready.then(function(){document.querySelectorAll('[data-fit]').forEach(fit);document.body.setAttribute('data-ready','1')});
})();
</script>`;

module.exports = { ROOT, OUT, C, PH, LOGO, PHOTO, esc, vt, ct, shield, counter, dots, lockup, dateblock, swipe, page, renderAll, closeBrowser, browser, FIT_JS, furl, writeHtml };

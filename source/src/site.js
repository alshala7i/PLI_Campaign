// Builds the campaign-kit website (GitHub Pages) into out/site/.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib');
const OUT = L.OUT;
const SITE = path.join(OUT, 'site');
const SITE_URL = process.env.SITE_URL || 'https://alshala7i.github.io/pli-campaign/';
const kit = JSON.parse(fs.readFileSync(path.join(OUT, 'kit.json'), 'utf8'));

function cp(src, dst) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
function cpDir(src, dst, filter = () => true) {
  if (!fs.existsSync(src)) return;
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    if (fs.statSync(s).isDirectory()) cpDir(s, d, filter); else if (filter(f)) cp(s, d);
  }
}
function thumb(srcRel, w) {
  const src = path.join(OUT, srcRel);
  const dst = path.join(SITE, 'thumbs', srcRel.replace(/\.png$/, '.jpg'));
  if (!fs.existsSync(src)) return '';
  if (!fs.existsSync(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', `scale=${w}:-2`, '-q:v', '4', dst]);
  }
  return 'thumbs/' + srcRel.replace(/\.png$/, '.jpg');
}

fs.rmSync(path.join(SITE, 'assets'), { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });
// full-res assets
cpDir(path.join(OUT, 'assets'), path.join(SITE, 'assets'), (f) => !/_silent|_mix/.test(f));
// downloads
const DL = path.join(SITE, 'downloads');
fs.mkdirSync(DL, { recursive: true });
['PLI_Campaign_Plan_Grow_Where_You_Teach.pdf', 'calendar.csv', 'calendar.xlsx', 'captions.md', 'QA_REPORT.md', 'PLACEHOLDERS_OPEN.md', 'HR_REVIEW_PACK.md'].forEach((f) => fs.existsSync(path.join(OUT, f)) && cp(path.join(OUT, f), path.join(DL, f)));
cpDir(path.join(OUT, 'captions'), path.join(DL, 'captions'));
// branding
cp(path.join(L.ROOT, 'assets/logos/masna3-icon.png'), path.join(SITE, 'masna3-icon.png'));
cp(path.join(L.ROOT, 'assets/logos/home-logo.png'), path.join(SITE, 'masna3-logo.png'));
cp(path.join(L.ROOT, 'assets/logos/pli_shield.png'), path.join(SITE, 'pli-shield.png'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(L.ROOT, 'assets/logos/pli_shield.png'), '-vf', 'scale=64:-2', path.join(SITE, 'favicon.png')]);
if (fs.existsSync(path.join(OUT, 'assets/extras/covers/facebook_cover_1640x624.png'))) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(OUT, 'assets/extras/covers/facebook_cover_1640x624.png'), '-vf', 'scale=1200:-2', '-q:v', '3', path.join(SITE, 'og.jpg')]);
// static zip (images + docs, no videos)
try {
  fs.rmSync(path.join(DL, 'PLI_kit_images_and_docs.zip'), { force: true });
  execFileSync('bash', ['-c', `cd "${SITE}" && zip -qr downloads/PLI_kit_images_and_docs.zip assets/posts assets/carousels assets/stories assets/extras downloads/calendar.csv downloads/calendar.xlsx downloads/captions.md downloads/PLI_Campaign_Plan_Grow_Where_You_Teach.pdf downloads/PLACEHOLDERS_OPEN.md`]);
} catch (e) { console.error('zip failed', e.message); }

// thumbnails + view model
const A = kit.assets.map((a) => {
  const o = { ...a };
  if (a.kind === 'post') o.thumb = thumb(a.file, 540);
  if (a.kind === 'carousel') o.thumbs = a.slides.map((s) => thumb(s, 540));
  if (a.kind === 'story') o.thumbs = a.frames.map((s) => thumb(s, 360));
  if (a.kind === 'video') o.posters = Object.fromEntries(Object.entries(a.files).map(([v, f]) => [v, fs.existsSync(path.join(OUT, f.cover)) ? thumb(f.cover, 540) : '']));
  return o;
});
const extras = {
  highlights: fs.readdirSync(path.join(OUT, 'assets/extras/highlights')).sort().map((f) => ({ file: `assets/extras/highlights/${f}`, thumb: thumb(`assets/extras/highlights/${f}`, 240), name: f.replace('highlight_', '').replace('.png', '') })),
  covers: fs.readdirSync(path.join(OUT, 'assets/extras/covers')).sort().map((f) => ({ file: `assets/extras/covers/${f}`, thumb: thumb(`assets/extras/covers/${f}`, 900), name: f })),
  emails: fs.readdirSync(path.join(OUT, 'assets/extras/emails')).sort().map((f) => ({ file: `assets/extras/emails/${f}`, text: fs.readFileSync(path.join(OUT, 'assets/extras/emails', f), 'utf8') })),
};
const DATA = { assets: A, calendar: kit.calendar, weekly: kit.weekly, placeholders: kit.placeholders, bio: kit.bio, tagline: kit.tagline, ads: kit.ads, extras, voices: kit.voices };
const counts = { videos: A.filter((a) => a.kind === 'video').length, carousels: A.filter((a) => a.kind === 'carousel').length, slides: A.filter((a) => a.kind === 'carousel').reduce((n, a) => n + a.slides.length, 0), posts: A.filter((a) => a.kind === 'post').length, stories: A.filter((a) => a.kind === 'story').reduce((n, a) => n + a.frames.length, 0), cal: kit.calendar.length };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Grow Where You Teach — PLI Campaign Kit</title>
<meta name="description" content="Every video, carousel, post, story, caption, hashtag, link and the full 20-week calendar for the Professional Learning Institute cohort campaign — made with the Content Factory app (مصنع المحتوى).">
<meta property="og:title" content="Grow Where You Teach — PLI Campaign Kit">
<meta property="og:description" content="Videos (male and female voice), carousels, posts, stories, captions and the full calendar — ready to download and post.">
<meta property="og:image" content="${SITE_URL}og.jpg">
<meta property="og:url" content="${SITE_URL}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Tajawal:wght@700;800&display=swap">
<style>
:root{--indigo:#4B4F9E;--deep:#363A80;--peri:#A9C1F3;--peri-soft:#E3EBFC;--cream:#F6F0E2;--ink:#1E2047;--red:#D3202F;--card:#fff;--line:rgba(30,32,71,.12);--mut:#5b5f86;--bg:#F6F0E2;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#15173a;--card:#1f2250;--ink:#eef1ff;--mut:#b7bde6;--line:rgba(255,255,255,.12);--peri-soft:#2a2e66;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#15173a;--card:#1f2250;--ink:#eef1ff;--mut:#b7bde6;--line:rgba(255,255,255,.12);--peri-soft:#2a2e66;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:Montserrat,system-ui,sans-serif;font-size:16px;line-height:1.55}
a{color:inherit}
.wrap{max-width:1200px;margin:0 auto;padding:0 16px}
.made{background:var(--deep);color:#fff;font-size:14px}
.made .wrap{display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 16px;flex-wrap:wrap;text-align:center}
.made img{width:26px;height:26px;border-radius:7px}
.ar{font-family:Tajawal,sans-serif;font-weight:800}
header.hero{background:var(--indigo);color:#fff;position:relative;overflow:hidden}
header.hero:after{content:'';position:absolute;right:-120px;top:-60px;width:520px;height:760px;border-radius:999px 999px 0 0;border:3px solid rgba(169,193,243,.3)}
.hero .wrap{padding:36px 16px 40px;position:relative;z-index:1}
.brandrow{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.brandrow img{height:58px;background:#fff;border-radius:12px;padding:4px}
.brandrow .t{font-weight:800;letter-spacing:.18em;font-size:12px;line-height:1.5}
h1{font-family:Anton,Impact,sans-serif;font-weight:400;font-size:clamp(48px,9vw,104px);line-height:.92;margin:22px 0 12px;color:var(--cream);text-transform:uppercase}
.lede{max-width:760px;font-size:18px;color:#e4e9ff}
.dots{display:flex;gap:8px;margin:18px 0 6px}.dots i{width:18px;height:18px;border-radius:50%;border:2.5px solid var(--peri)}.dots i.f{background:var(--peri)}
.stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.stat{background:rgba(255,255,255,.12);border-radius:999px;padding:8px 16px;font-weight:700;font-size:14px}.stat b{color:var(--peri);font-variant-numeric:tabular-nums}
.cta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--peri);color:var(--deep);border:0;border-radius:999px;padding:10px 18px;font:700 14px Montserrat,sans-serif;text-decoration:none;cursor:pointer;white-space:nowrap}
.btn.ghost{background:transparent;color:inherit;border:2px solid currentColor}
.btn.sm{padding:6px 12px;font-size:12.5px}
.btn.dark{background:var(--indigo);color:#fff}
.btn:focus-visible{outline:3px solid var(--red);outline-offset:2px}
nav.tabs{position:sticky;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--line)}
nav.tabs .wrap{display:flex;gap:6px;overflow-x:auto;padding:10px 16px;scrollbar-width:none}
nav.tabs a{flex:0 0 auto;text-decoration:none;font-weight:700;font-size:14px;padding:8px 14px;border-radius:999px;color:var(--mut)}
nav.tabs a.on,nav.tabs a:hover{background:var(--indigo);color:#fff}
section{padding:44px 0 8px;scroll-margin-top:60px}
h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4.4vw,40px);margin:0 0 6px;color:var(--indigo)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) h2{color:var(--peri)}}
:root[data-theme="dark"] h2{color:var(--peri)}
.sub{color:var(--mut);margin:0 0 20px;max-width:800px}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px}
.grid{display:grid;gap:16px}.grid>*,.card,details,.tblwrap{min-width:0;max-width:100%}main{overflow-x:clip}
.g-vid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.g-post{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.id{font:800 12px Montserrat;letter-spacing:.1em;color:var(--indigo);background:var(--peri-soft);border-radius:999px;padding:3px 10px;display:inline-block}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .id{color:var(--peri)}}
.ttl{font-weight:800;font-size:16px;margin:8px 0 4px}
.meta{font-size:12.5px;color:var(--mut)}
video,.thumb{width:100%;border-radius:12px;background:#000;display:block}
.thumb{background:var(--peri-soft);aspect-ratio:4/5;object-fit:cover}
.vtog{display:inline-flex;background:var(--peri-soft);border-radius:999px;padding:3px;margin:10px 0}
.vtog button{border:0;background:transparent;font:700 12.5px Montserrat;padding:6px 12px;border-radius:999px;cursor:pointer;color:var(--ink)}
.vtog button.on{background:var(--indigo);color:#fff}
.dl{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
details{margin-top:10px;border-top:1px dashed var(--line);padding-top:8px}
summary{cursor:pointer;font-weight:700;font-size:13.5px}
pre.cap{white-space:pre-wrap;font:500 13.5px/1.5 Montserrat,sans-serif;background:var(--peri-soft);border-radius:12px;padding:12px;margin:8px 0;max-height:280px;overflow:auto}
.strip{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}
.strip a{flex:0 0 auto;scroll-snap-align:start}
.strip img{height:300px;width:auto;border-radius:12px;display:block;background:var(--peri-soft)}
.strip.st img{height:340px}
.panel{background:var(--card);border:2px solid var(--peri);border-radius:18px;padding:18px;display:grid;gap:12px}
.panel label{font-weight:700;font-size:14px}
.panel input{width:100%;font:500 15px Montserrat;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}
.row2{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th{text-align:left;background:var(--indigo);color:#fff;padding:8px 10px;font-size:12.5px}
td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
.wk{margin:14px 0}
.wk > summary{font-family:Anton,sans-serif;font-weight:400;font-size:22px;letter-spacing:.02em;color:var(--indigo);list-style:none;display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .wk > summary{color:var(--peri)}}
.wk > summary small{font:600 13px Montserrat;color:var(--mut)}
.tblwrap{overflow-x:auto}
.pl{font-weight:800;font-size:12px;border-radius:999px;padding:2px 9px;white-space:nowrap}
.pl.li{background:#dbe8fb;color:#0a4f9e}.pl.ig{background:#fbe0ee;color:#a2185e}.pl.fb{background:#dfe6fb;color:#2a4ab0}.pl.sa{background:#efe3fb;color:#5a2a9e}
.filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.chip{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:6px 12px;font:700 13px Montserrat;cursor:pointer}.chip.on{background:var(--indigo);color:#fff;border-color:var(--indigo)}
.toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);background:var(--deep);color:#fff;padding:10px 18px;border-radius:999px;font-weight:700;font-size:14px;opacity:0;transition:.25s;z-index:99;pointer-events:none}
.toast.on{opacity:1}
.ph{background:#fde7f2;color:#a3005f;border-radius:6px;padding:0 4px;font-weight:700}
.warn{background:#fff4d6;color:#6b4b00;border-radius:12px;padding:10px 14px;font-size:14px}
footer{margin-top:60px;background:var(--deep);color:#fff;padding:30px 0;text-align:center}
footer img{height:70px;background:var(--cream);border-radius:12px;padding:6px 12px}
.themebtn{position:absolute;right:16px;top:16px;z-index:2}
@media (max-width:600px){.strip img{height:240px}.strip.st img{height:280px}table thead{display:none}table tr{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;padding:10px 0;border-bottom:1px solid var(--line)}td{border:0;padding:2px 4px}td:nth-child(3),td:nth-child(4){grid-column:1/-1}}
</style>
</head>
<body>
<div class="made"><div class="wrap"><img src="masna3-icon.png" alt=""><span>Everything on this page was made with the <span class="ar">مصنع المحتوى</span> (Content Factory) app — strategy, design, motion, voiceover, captions and calendar.</span></div></div>
<header class="hero"><div class="wrap">
  <button class="btn sm ghost themebtn" id="theme" aria-label="Toggle dark mode">◐</button>
  <div class="brandrow"><img src="pli-shield.png" alt="PLI shield"><div class="t">PROFESSIONAL<br>LEARNING INSTITUTE</div></div>
  <h1>Grow where<br>you teach</h1>
  <p class="lede">The complete campaign kit for the Saint Mary's University of Minnesota MAED and Ed.D cohorts — January and March 2027. Download, copy, post.</p>
  <div class="dots" aria-hidden="true"><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i></i><i></i><i></i><i></i></div>
  <div style="font-size:14px;color:var(--peri)">More than 6 in 10 of our past MAED students were ACA educators.</div>
  <div class="stats"><span class="stat"><b>${counts.videos}</b> videos × 2 voices</span><span class="stat"><b>${counts.carousels}</b> carousels · <b>${counts.slides}</b> slides</span><span class="stat"><b>${counts.posts}</b> posts</span><span class="stat"><b>${counts.stories}</b> story frames</span><span class="stat"><b>${counts.cal}</b> scheduled posts</span></div>
  <div class="cta-row"><a class="btn" href="downloads/PLI_Campaign_Plan_Grow_Where_You_Teach.pdf" download>⬇ Campaign plan (PDF)</a><a class="btn ghost" href="downloads/calendar.xlsx" download>Calendar (Excel)</a><a class="btn ghost" href="downloads/PLI_kit_images_and_docs.zip" download>All images + docs (zip)</a></div>
</div></header>
<nav class="tabs" aria-label="Sections"><div class="wrap">
  <a href="#start">Start here</a><a href="#calendar">Calendar</a><a href="#videos">Videos</a><a href="#carousels">Carousels</a><a href="#posts">Posts</a><a href="#stories">Stories</a><a href="#linkedin">LinkedIn</a><a href="#ads">Ads</a><a href="#extras">Emails &amp; extras</a><a href="#files">Files</a>
</div></nav>
<main class="wrap">
<section id="start">
  <h2>Start here</h2>
  <p class="sub">Fill these in once. Every “Copy” button on this page then uses your real link and dates. They are saved in this browser only.</p>
  <div class="panel">
    <div class="row2">
      <div><label for="f-link">Application / enquiry form link</label><input id="f-link" placeholder="https://forms.office.com/…" inputmode="url"></div>
      <div><label for="f-jan">January deadline (as written)</label><input id="f-jan" placeholder="Thursday 24 December"></div>
      <div><label for="f-mar">March deadline (as written)</label><input id="f-mar" placeholder="Friday 5 March"></div>
    </div>
    <div class="row2">
      <div><label>Instagram bio</label><pre class="cap" style="margin:4px 0" id="bio"></pre><button class="btn sm" data-copy-el="bio">Copy bio</button></div>
    </div>
    <div class="warn" id="ph-warn"></div>
  </div>
</section>
<section id="calendar"><h2>20-week calendar</h2><p class="sub">Launch Thu 12 Nov 2026 (week 0), then weeks 1–20 to Sat 3 Apr 2027 · Kuwait time · weeks run Sunday to Saturday. Every row has the file, the caption and a tracked link.</p>
  <div class="filters" id="calf"></div><div id="cal"></div></section>
<section id="videos"><h2>Motion videos</h2><p class="sub">Each video exists with a male (Eric) and a female (Sarah) voiceover: Reel 9:16 for Instagram/Facebook, feed 4:5 for LinkedIn/Facebook, captions burned in, plus .srt, voiceover .mp3 and a Reel cover.</p><div class="grid g-vid" id="vids"></div></section>
<section id="carousels"><h2>Carousels</h2><p class="sub">Swipe to see the slides. PNG slides for Instagram/Facebook, one PDF per carousel for LinkedIn document posts.</p><div class="grid" id="cars"></div></section>
<section id="posts"><h2>Single posts</h2><p class="sub">1080×1350. Magenta boxes mark templates that need real graduate details (never invented).</p><div class="grid g-post" id="posts-g"></div></section>
<section id="stories"><h2>Story sets</h2><p class="sub">1080×1920 frames. Dashed areas show where to place Instagram stickers (poll, quiz, question, countdown, link).</p><div class="grid" id="sts"></div></section>
<section id="linkedin"><h2>LinkedIn posts for Salwa</h2><p class="sub">Drafts in Salwa's voice — she edits before posting from her personal profile.</p><div class="grid g-vid" id="lis"></div></section>
<section id="ads"><h2>Paid ads copy</h2><p class="sub">Variations for testing on Meta and LinkedIn.</p><div class="grid g-vid" id="ads-g"></div></section>
<section id="extras"><h2>Emails &amp; extras</h2><p class="sub">Staff emails, story highlight covers, page covers, staff-room posters and the 2-page programme guide.</p><div id="ext"></div></section>
<section id="files"><h2>Files</h2><div class="card"><div class="dl" id="filelist"></div></div></section>
</main>
<footer><img src="masna3-logo.png" alt="Content Factory (مصنع المحتوى) logo"><p style="margin:12px 0 0">Made entirely with the <span class="ar">مصنع المحتوى</span> (Content Factory) app</p><p style="margin:4px 0 0;color:#c9d0ff;font-size:13px">For the Professional Learning Institute · American Creativity Academy · pli@aca.edu.kw</p></footer>
<div class="toast" id="toast">Copied</div>
<script>
const D=${JSON.stringify(DATA)};
const $=s=>document.querySelector(s), h=(t,a={},...c)=>{const e=document.createElement(t);for(const[k,v]of Object.entries(a)){if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v)}c.flat().forEach(x=>x!=null&&e.append(x));return e};
const store={get(k){try{return localStorage.getItem('pli.'+k)||''}catch(e){return''}},set(k,v){try{localStorage.setItem('pli.'+k,v)}catch(e){}}};
let VOICE=store.get('voice')||'eric';
function fill(t){if(!t)return'';const link=store.get('link'),jan=store.get('jan'),mar=store.get('mar');let s=t;if(link)s=s.split('{{APPLY_LINK}}').join(link);if(jan)s=s.split('Thursday 24 December').join(jan);if(mar)s=s.split('Friday 5 March').join(mar);return s}
function toast(m){const t=$('#toast');t.textContent=m||'Copied';t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1300)}
async function copy(t){t=fill(t);try{await navigator.clipboard.writeText(t)}catch(e){const a=h('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}toast(t.includes('{{')?'Copied — still has a {{placeholder}}':'Copied')}
const capBlock=(label,text)=>text?h('details',{},h('summary',{},label),h('pre',{class:'cap',html:esc(text).replace(/\\{\\{([A-Z_0-9]+)\\}\\}/g,'<span class="ph">{{$1}}</span>')}),h('button',{class:'btn sm',onclick:()=>copy(text)},'Copy')):null;
function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
const dlb=(href,label)=>h('a',{class:'btn sm ghost',href,download:''},'⬇ '+label);
const byId=id=>D.assets.find(a=>a.id===id);
// start
['link','jan','mar'].forEach(k=>{const i=$('#f-'+k);i.value=store.get(k);i.addEventListener('input',()=>{store.set(k,i.value.trim());warn()})});
$('#bio').textContent=D.bio; document.querySelectorAll('[data-copy-el]').forEach(b=>b.onclick=()=>copy($('#'+b.dataset.copyEl).textContent));
function warn(){const open=Object.entries(D.placeholders).filter(([k,v])=>!v.confirmed).length;$('#ph-warn').innerHTML=((store.get('link')||(D.placeholders.APPLY_LINK||{}).confirmed)?'':'<b>Add your form link above</b> — captions use {{APPLY_LINK}} until you do. ')+open+' items are still open (form link, graduate stories, photos and logos, HR review…). See <a href="downloads/PLACEHOLDERS_OPEN.md">PLACEHOLDERS_OPEN.md</a>.'}
warn();
function setVoice(v){VOICE=v;store.set('voice',v);document.querySelectorAll('.vtog [data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===v));document.querySelectorAll('[data-vid]').forEach(el=>renderVid(el))}
// videos
function renderVid(el){const a=byId(el.dataset.vid);const f=a.files[VOICE];el.innerHTML='';el.append(h('video',{controls:'',preload:'none',playsinline:'',poster:(a.posters||{})[VOICE]||'',src:f.reel}),h('div',{class:'dl'},dlb(f.reel,'Reel 9:16'),dlb(f.feed,'Feed 4:5'),dlb(f.srt,'SRT'),dlb(f.vo,'Voice MP3'),dlb(f.cover,'Cover')))}
D.assets.filter(a=>a.kind==='video').forEach(a=>{const v=h('div',{'data-vid':a.id});const tog=h('div',{class:'vtog'},...['eric','sarah'].map(x=>h('button',{'data-v':x,class:x===VOICE?'on':'',onclick:()=>setVoice(x)},x==='eric'?'Eric · male':'Sarah · female')));
$('#vids').append(h('div',{class:'card'},h('span',{class:'id'},a.id),h('div',{class:'ttl'},a.title),h('div',{class:'meta'},a.meta),tog,v,capBlock('Instagram / Facebook caption',a.caption_ig),capBlock('LinkedIn caption',a.caption_li),capBlock('Voiceover script',a.vo)));renderVid(v)});
// carousels
D.assets.filter(a=>a.kind==='carousel').forEach(a=>{$('#cars').append(h('div',{class:'card'},h('span',{class:'id'},a.id),h('div',{class:'ttl'},a.title),h('div',{class:'meta'},a.slides.length+' slides · '+a.meta),
 h('div',{class:'strip',style:'margin-top:10px'},...a.slides.map((s,i)=>h('a',{href:s,target:'_blank'},h('img',{src:a.thumbs[i],loading:'lazy',alt:(a.alt||[])[i]||a.title})))),
 h('div',{class:'dl'},dlb(a.pdf,'LinkedIn PDF'),...a.slides.map((s,i)=>dlb(s,'Slide '+(i+1)))),capBlock('Instagram / Facebook caption',a.caption_ig),capBlock('LinkedIn caption',a.caption_li),capBlock('Alt text',(a.alt||[]).map((t,i)=>(i+1)+'. '+t).join('\\n'))))});
// posts
D.assets.filter(a=>a.kind==='post').forEach(a=>{$('#posts-g').append(h('div',{class:'card'},h('a',{href:a.file,target:'_blank'},h('img',{class:'thumb',src:a.thumb,loading:'lazy',alt:a.alt})),h('div',{style:'margin-top:10px'},h('span',{class:'id'},a.id)),h('div',{class:'ttl'},a.title),a.template?h('div',{class:'meta'},'Template — add real details before posting'):null,h('div',{class:'dl'},dlb(a.file,'PNG')),capBlock('Instagram / Facebook caption',a.caption_ig),capBlock('LinkedIn caption',a.caption_li),capBlock('Alt text',a.alt)))});
// stories
D.assets.filter(a=>a.kind==='story').forEach(a=>{$('#sts').append(h('div',{class:'card'},h('span',{class:'id'},a.id),h('div',{class:'ttl'},a.title),h('div',{class:'meta'},a.guide),h('div',{class:'strip st',style:'margin-top:10px'},...a.frames.map((s,i)=>h('a',{href:s,target:'_blank'},h('img',{src:a.thumbs[i],loading:'lazy',alt:a.id+' frame '+(i+1)})))),h('div',{class:'dl'},...a.frames.map((s,i)=>dlb(s,'Frame '+(i+1))))))});
// linkedin
D.assets.filter(a=>a.kind==='linkedin').forEach(a=>{$('#lis').append(h('div',{class:'card'},h('span',{class:'id'},a.id),h('div',{class:'ttl'},a.title),h('div',{class:'meta'},a.when),h('pre',{class:'cap',html:esc(a.caption_li).replace(/\\{\\{([A-Z_0-9]+)\\}\\}/g,'<span class="ph">{{$1}}</span>')}),h('button',{class:'btn sm',onclick:()=>copy(a.caption_li)},'Copy')))});
// ads
const ad=D.ads; const adCard=(t,items)=>h('div',{class:'card'},h('div',{class:'ttl'},t),...items.map(x=>h('div',{style:'display:flex;gap:8px;align-items:flex-start;margin:8px 0'},h('pre',{class:'cap',style:'flex:1;margin:0'},x),h('button',{class:'btn sm',onclick:()=>copy(x)},'Copy'))));
$('#ads-g').append(adCard('Primary text / intro text',ad.primary_text),adCard('Headlines (≤40 characters)',ad.headlines),adCard('Lead form',[ad.lead_form_questions,ad.thank_you,'CTA buttons: '+ad.cta_buttons]));
// extras
const ex=D.extras;
$('#ext').append(h('div',{class:'grid g-vid'},...ex.emails.map((e,i)=>h('div',{class:'card'},h('span',{class:'id'},'STAFF EMAIL #'+(i+1)),h('pre',{class:'cap'},e.text),h('button',{class:'btn sm',onclick:()=>copy(e.text)},'Copy'),' ',dlb(e.file,'TXT')))),
 h('h3',{},'Story highlight covers'),h('div',{class:'strip'},...ex.highlights.map(x=>h('a',{href:x.file,download:''},h('img',{src:x.thumb,style:'height:220px',alt:'Highlight '+x.name})))),
 h('h3',{},'Page covers'),h('div',{class:'grid'},...ex.covers.map(x=>h('div',{class:'card'},h('img',{src:x.thumb,style:'width:100%;border-radius:10px',alt:x.name}),h('div',{class:'dl'},dlb(x.file,x.name))))),
 h('h3',{},'Print & guide'),h('div',{class:'dl'},dlb('assets/extras/poster_jan.pdf','Staff-room poster · January (A3)'),dlb('assets/extras/poster_mar.pdf','Staff-room poster · March (A3)'),dlb('assets/extras/programme_guide.pdf','Programme guide (2 pages)')),
 h('h3',{},'LinkedIn showcase tagline'),h('pre',{class:'cap'},D.tagline));
// files
[['downloads/PLI_Campaign_Plan_Grow_Where_You_Teach.pdf','Campaign plan PDF'],['downloads/calendar.xlsx','Calendar + lead tracker (Excel)'],['downloads/calendar.csv','Calendar (CSV)'],['downloads/captions.md','All captions'],['downloads/PLACEHOLDERS_OPEN.md','Placeholders to confirm'],['downloads/HR_REVIEW_PACK.md','HR review pack (all copy)'],['downloads/QA_REPORT.md','QA report'],['downloads/PLI_kit_images_and_docs.zip','All images + docs (zip)']].forEach(([f,l])=>$('#filelist').append(dlb(f,l)));
// calendar
const plcls=p=>p.startsWith('LinkedIn (S')?'sa':p.startsWith('LinkedIn')?'li':p==='Instagram'?'ig':'fb';
let CF=store.get('calf')||'All';
function renderCal(){const box=$('#cal');box.innerHTML='';D.weekly.forEach(w=>{const rows=D.calendar.filter(r=>r.Week===w.week&&(CF==='All'||r.Platform.startsWith(CF)));
 const tb=h('tbody',{},...rows.map(r=>{const a=byId(r['Asset ID'])||{};const file=(r['File(s)']||'').split(' | ').filter(Boolean);let f0=file[0]||'';if(a.kind==='video'){const fv=a.files[VOICE];f0=r.Platform.startsWith('LinkedIn')?fv.feed:fv.reel}
  return h('tr',{},h('td',{},h('b',{},r.Weekday+' '+r.Date.slice(5)),h('div',{class:'meta'},r['Time (Kuwait)'])),h('td',{},h('span',{class:'pl '+plcls(r.Platform)},r.Platform.replace(' (PLI page)','').replace('LinkedIn (Salwa personal)','Salwa · LinkedIn'))),
  h('td',{},h('span',{class:'id'},r['Asset ID']),h('div',{style:'font-weight:700;margin-top:4px'},r.Title),h('div',{class:'meta'},r.Format+(r.Note?' · '+r.Note:''))),
  h('td',{},f0?(f0.endsWith('/')?h('a',{class:'btn sm ghost',href:'#carousels'},'Slides'):dlb(f0,'File')):'—',' ',r.Caption?h('button',{class:'btn sm',onclick:()=>copy(r.Caption)},'Caption'):null,' ',h('button',{class:'btn sm ghost',onclick:()=>copy(r['UTM link'])},'Link')))}));
 box.append(h('details',{class:'wk card',open:''},h('summary',{},'WEEK '+w.week,h('small',{},w.dates+' · '+w.phase)),h('div',{class:'meta',style:'margin:6px 0'},'Stories: '+w.stories+' · Off-platform / ads: '+w.offplatform),h('div',{class:'tblwrap'},h('table',{},h('thead',{},h('tr',{},h('th',{},'When'),h('th',{},'Platform'),h('th',{},'Asset'),h('th',{},'Get it'))),tb))))})}
['All','LinkedIn','Instagram','Facebook'].forEach(p=>$('#calf').append(h('button',{class:'chip'+(p===CF?' on':''),onclick:e=>{CF=p;store.set('calf',p);document.querySelectorAll('#calf .chip').forEach(c=>c.classList.toggle('on',c.textContent===p));renderCal()}},p)));
renderCal();
const _sv=setVoice;setVoice=v=>{_sv(v);renderCal()};
// tabs highlight
const secs=[...document.querySelectorAll('main section')];const tabs=[...document.querySelectorAll('nav.tabs a')];
addEventListener('scroll',()=>{let cur=secs[0].id;secs.forEach(s=>{if(s.getBoundingClientRect().top<120)cur=s.id});tabs.forEach(t=>t.classList.toggle('on',t.getAttribute('href')==='#'+cur))},{passive:true});
// theme
$('#theme').onclick=()=>{const r=document.documentElement;const d=r.getAttribute('data-theme')==='dark'||(!r.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme:dark)').matches);r.setAttribute('data-theme',d?'light':'dark');store.set('theme',r.getAttribute('data-theme'))};
if(store.get('theme'))document.documentElement.setAttribute('data-theme',store.get('theme'));
</script>
</body>
</html>`;
fs.writeFileSync(path.join(SITE, 'index.html'), html);
fs.writeFileSync(path.join(SITE, '.nojekyll'), '');
const du = execFileSync('du', ['-sh', SITE]).toString().trim();
console.log('site built', du, counts);

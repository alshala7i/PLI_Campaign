// Carousels C01–C15 (+C04b, C07b, C09b): 1080×1350 PNG slides + one LinkedIn PDF per carousel.
const path = require('path');
const fs = require('fs');
const L = require('./lib');
const { vt, esc, shield, counter, dots, lockup, swipe, page, FIT_JS, PHOTO, LOGO } = L;

const W = 1080, H = 1350;

// Per-carousel art direction (cover style + photos + special slides)
const ART = {
  C01: { cover: 'stat', ctaPhoto: 'trio' },
  C02: { cover: 'stack', coverPhoto: 'ceremony' },
  C03: { cover: 'deep' },
  C04: { cover: 'stack' },
  C05: { cover: 'stack' },
  C06: { cover: 'split' },
  C07: { cover: 'question' },
  C08: { cover: 'stack' },
  C09: { cover: 'stack' },
  C10: { cover: 'editorial', photoSlide: { 6: 'trio' } },
  C11: { cover: 'stack' },
  C12: { cover: 'event', photoSlide: { 5: 'class' } },
  C13: { cover: 'stack' },
  C14: { cover: 'stack' },
  C15: { cover: 'editorial' },
};

// March variants: same slides, March CTA/dates
const VARIANTS = {
  C04b: { base: 'C04', map: (s, i, n) => (i === n - 1 ? s : s) , ctaExtra: 'March cohort · applications open' },
  C07b: { base: 'C07', map: (s, i, n) => (i === n - 1 ? s.replace('January and end of March', 'End of March') : s) },
  C09b: { base: 'C09', map: (s, i, n) => (i === n - 1 ? 'Start your cohort · End of March · Deadline: {{MAR_DEADLINE}}' : s) },
};

function splitSlide(s) {
  // "**Bold** · rest · rest" or "**Bold** rest"
  const m = s.match(/^\*\*(.+?)\*\*\s*(?:·\s*)?(.*)$/);
  if (m) return { head: m[1].trim(), rest: m[2].trim() };
  const parts = s.split(' · ');
  return { head: null, rest: s };
}
const items = (rest) => rest.split(/\s·\s/).map((x) => x.trim()).filter(Boolean);

const CSS = `
.hd{font-family:var(--anton);text-transform:uppercase;line-height:.95}
.body{font-size:40px;line-height:1.38;font-weight:500}
.body b{font-weight:800}
.body em{font-style:normal;font-size:.78em;opacity:.8}
.list{display:flex;flex-direction:column;gap:22px}
.row{display:flex;align-items:center;gap:26px;border-radius:24px;padding:30px 36px;font-size:42px;font-weight:600;line-height:1.25}
.bg-cream .row{background:#fff}
.bg-indigo .row,.bg-deep .row{background:rgba(255,255,255,.1)}
.row .tick{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:var(--peri);display:flex;align-items:center;justify-content:center}
.bignum{font-family:var(--anton);font-size:250px;line-height:.82}
.eq{font-family:var(--anton);font-size:120px;line-height:1}
.res{display:inline-block;background:var(--peri);color:var(--deep);border-radius:28px;padding:18px 36px 10px;font-family:var(--anton);font-size:150px;line-height:1}
.myth{border-radius:28px;padding:36px 40px;font-size:42px;line-height:1.3;font-weight:600}
.tagl{font-family:var(--sans);font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase}
.stackw{position:absolute;left:80px;right:80px}
.mid{position:absolute;left:80px;right:80px;top:190px;bottom:190px;display:flex;flex-direction:column;justify-content:center}
.foot{position:absolute;left:80px;right:80px;bottom:70px;display:flex;align-items:center;justify-content:space-between;white-space:nowrap;font-family:var(--sans);font-weight:700;font-size:20px;letter-spacing:.12em;text-transform:uppercase;opacity:.8}
.foot .md{display:grid;grid-template-columns:repeat(5,14px);gap:6px}
.foot .md i{width:14px;height:14px;border-radius:50%;border:2.5px solid currentColor}
.foot .md i.f{background:currentColor}
.deco{position:absolute;border-radius:999px 999px 0 0;pointer-events:none}
.cta-h{font-family:var(--serif);font-weight:700;line-height:1.05}
`;

const TICK = `<svg width="26" height="26" viewBox="0 0 26 26"><path d="M5 13.5l5 5L21 7" stroke="#363A80" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function coverSlide(id, s, n, art) {
  const { head, rest } = splitSlide(s);
  const title = head || s.split(' · ')[0];
  const sub = head ? rest : s.split(' · ').slice(1).join(' · ');
  const subClean = sub.replace(/→\s*\(dot motif\)/, '').replace(/\(dot motif\)/, '').trim();
  const kind = art.cover;
  if (kind === 'stat') {
    // MORE THAN 6 IN 10
    return { cls: 'bg-cream', body: `${shield()}
      <div class="stackw" style="top:150px">
        <div class="tagl c-indigo" style="margin-bottom:26px">Grow where you teach</div>
        <div class="hd c-indigo" style="font-size:132px">More than</div>
        <div class="hd c-indigo" style="font-size:330px;line-height:.86">6 in 10</div>
        <div style="margin:40px 0 44px">${dots({ size: 74, gap: 26 })}</div>
        <div class="serif" style="font-size:58px;line-height:1.15;font-weight:600;max-width:880px" data-fit data-min="40">${vt(subClean)}</div>
      </div>${swipe('var(--indigo)')}` };
  }
  if (kind === 'question') {
    return { cls: 'bg-cream', body: `${shield()}
      <div style="position:absolute;right:-40px;top:120px;font-family:var(--serif);font-weight:800;font-size:1100px;line-height:1;color:var(--peri);opacity:.55">?</div>
      <div class="stackw" style="top:330px">
        <div class="hd c-indigo" style="font-size:190px">${vt(title)}</div>
        <div class="serif c-deep" style="font-size:64px;line-height:1.15;margin-top:36px;max-width:760px">${vt(subClean)}</div>
      </div>${swipe('var(--indigo)')}` };
  }
  if (kind === 'deep') {
    return { cls: 'bg-deep', body: `${shield()}
      <div class="stackw" style="top:240px">
        <div class="hd c-cream" style="font-size:200px" data-fit data-min="120">${vt(title)}</div>
        <div style="height:10px;width:140px;background:var(--red);margin:46px 0 40px;border-radius:5px"></div>
        <div class="serif c-peri" style="font-size:60px;line-height:1.2;font-style:italic;max-width:860px">${vt(subClean).replace(/\s·\s/g, '<br>')}</div>
      </div>${swipe('var(--cream)')}` };
  }
  if (kind === 'editorial') {
    return { cls: 'bg-cream', body: `${shield()}
      <div class="stackw" style="top:260px">
        <div class="tagl c-indigo">Professional Learning Institute</div>
        <div class="serif c-indigo" style="font-size:120px;font-weight:700;line-height:1.02;margin-top:30px" data-fit data-min="80">${vt(title.charAt(0) + title.slice(1).toLowerCase()).replace(/2027/, '2027')}</div>
        <div style="height:8px;width:120px;background:var(--red);margin:44px 0 36px;border-radius:4px"></div>
        <div class="body c-deep" style="font-size:44px">${vt(subClean)}</div>
      </div>${swipe('var(--indigo)')}` };
  }
  if (kind === 'event') {
    return { cls: 'bg-indigo', body: `${shield()}
      <div class="stackw" style="top:150px"><div class="hd c-cream" style="font-size:150px">Saturday<br>Learning<br>Series</div>
      <div class="pill" style="margin-top:30px">Recap</div></div>
      <div class="arch" style="position:absolute;right:80px;bottom:140px;width:440px;height:600px;display:flex;align-items:center;justify-content:center;color:var(--deep);font-weight:700;font-size:28px;text-align:center;padding:30px">Speaker photo<br>({{SLS_SPEAKER}})</div>
      <div class="body c-cream" style="position:absolute;left:80px;bottom:150px;width:440px;font-size:38px">${vt(subClean)}</div>` };
  }
  if (kind === 'split') {
    return { cls: 'bg-cream', body: `${shield()}
      <div style="position:absolute;left:0;top:0;bottom:0;width:50%;background:var(--peri)"></div>
      <div style="position:absolute;right:0;top:0;bottom:0;width:50%;background:var(--indigo)"></div>
      <div class="stackw" style="top:330px;text-align:center">
        <div class="hd" style="font-size:210px;color:var(--deep)"><span>C&amp;I</span> <span class="c-cream" style="font-size:.5em;vertical-align:middle">or</span></div>
        <div class="hd c-cream" style="font-size:190px">Leadership?</div>
        <div class="serif" style="font-size:58px;margin-top:40px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.08)">${vt(subClean)}</div>
      </div>${swipe('#fff')}` };
  }
  // stack without sub/photo: full indigo, centred headline
  if (!subClean && !art.coverPhoto) {
    return { cls: 'bg-indigo', body: `${shield()}
      <div class="deco" style="right:-200px;bottom:-320px;width:700px;height:1000px;border:3px solid rgba(169,193,243,.3)"></div>
      <div class="mid" style="top:170px;bottom:200px"><div class="tagl c-peri" style="margin-bottom:34px">Saint Mary's University of Minnesota · MAED</div>
      <div class="hd c-cream" style="font-size:190px;max-height:760px;overflow:hidden" data-fit data-min="100">${vt(title)}</div>
      <div style="margin-top:50px">${dots({ size: 40, gap: 14, color: 'var(--peri)', w: 4 })}</div></div>${swipe('var(--cream)')}` };
  }
  // stack (default): indigo top with cream Anton stack, cream bottom, optional photo
  const photo = art.coverPhoto ? `<div class="arch" style="position:absolute;right:80px;top:640px;width:400px;height:560px"><img src="${PHOTO[art.coverPhoto]}"></div>` : '';
  return { cls: 'bg-cream', body: `<div style="position:absolute;left:0;right:0;top:0;height:${art.coverPhoto ? 880 : 900}px;background:var(--indigo)"></div>${shield()}
    <div class="stackw" style="top:150px;${art.coverPhoto ? 'right:520px' : ''}"><div class="hd c-cream" style="font-size:${art.coverPhoto ? 150 : 170}px;max-height:700px;overflow:hidden" data-fit data-min="96">${vt(title)}</div></div>
    ${photo}
    <div class="body c-deep" style="position:absolute;left:80px;top:950px;width:${art.coverPhoto ? 440 : 920}px;font-size:${art.coverPhoto ? 38 : 46}px;font-weight:600;max-height:300px;overflow:hidden" data-fit data-min="28">${vt(subClean).replace(/\s·\s/g, '<br>')}</div>
    ${swipe('var(--indigo)')}` };
}

function ctaSlide(id, s, n, art, variant) {
  const { head, rest } = splitSlide(s);
  const title = head || s.split(' · ')[0];
  const its = items(head ? rest : s.split(' · ').slice(1).join(' · '));
  const photo = art.ctaPhoto ? `<div class="arch" style="position:absolute;right:80px;top:150px;width:360px;height:470px"><img src="${PHOTO[art.ctaPhoto]}"></div>` : '';
  return { cls: 'bg-indigo', body: `${counter(n, n)}${art.ctaPhoto ? '' : shield()}${photo}
    <div class="stackw" style="top:${art.ctaPhoto ? 660 : 300}px">
      <div class="cta-h c-cream" style="font-size:${art.ctaPhoto ? 92 : 104}px;max-height:${art.ctaPhoto ? 260 : 420}px;overflow:hidden" data-fit data-min="56">${vt(title)}</div>
      <div style="margin-top:34px;display:flex;flex-direction:column;gap:14px">${its.map((t) => `<div class="body c-white" style="font-size:38px">${vt(t)}</div>`).join('')}</div>
    </div>
    <div style="position:absolute;left:80px;bottom:70px">${lockup(0.95)}</div>` };
}

function contentSlide(id, s, i, n, art) {
  const bg = i % 2 === 1 ? 'bg-cream' : 'bg-indigo';
  const onDark = bg !== 'bg-cream';
  const hc = onDark ? 'c-cream' : 'c-indigo';
  const bc = onDark ? 'c-white' : 'c-deep';
  const { head, rest } = splitSlide(s);
  const md = Array.from({ length: 10 }, (_, k) => `<i class="${k < 6 ? 'f' : ''}"></i>`).join('');
  const deco = onDark ? `<div class="deco" style="right:-160px;bottom:-260px;width:620px;height:900px;border:3px solid rgba(169,193,243,.25)"></div>` : `<div class="deco" style="right:-180px;bottom:-300px;width:640px;height:940px;background:rgba(169,193,243,.32)"></div>`;
  const base = `${deco}${counter(i + 1, n)}${shield()}<div class="foot ${onDark ? 'c-peri' : 'c-indigo'}"><span style="display:flex;align-items:center;gap:18px"><span class="md">${md}</span>Grow where you teach</span><span>Professional Learning Institute</span></div>`;
  const photoKey = art.photoSlide && art.photoSlide[i + 1];
  const photo = photoKey ? `<div class="frame" style="position:absolute;left:80px;right:80px;bottom:80px;height:520px"><img src="${PHOTO[photoKey]}"></div>` : '';

  // equation slide: "X ÷ Y = **Z**"
  if (/÷/.test(s)) {
    const m = s.match(/^\*\*(.+?)\*\*\s*·\s*(.+?)\s*=\s*\*\*(.+?)\*\*/) || s.match(/^(.+?)\s*·\s*(.+?)\s*=\s*\*\*(.+?)\*\*/);
    const who = m ? m[1] : head; const eq = m ? m[2] : rest; const res = m ? m[3] : '';
    const [a, b2] = eq.split(/\s*÷\s*/);
    return { cls: bg, body: `${base}<div class="mid">
      <div class="tagl ${hc}" style="font-size:34px">${vt(who)}</div>
      <div class="eq ${hc}" style="margin-top:34px;font-size:190px;white-space:nowrap">${vt(a)}</div>
      <div class="eq ${hc}" style="font-size:96px;opacity:.85;white-space:nowrap">÷ ${vt(b2)} =</div>
      <div><div class="res" style="margin-top:40px">${vt(res.replace(' KD/month', ''))}<span style="font-size:.34em;margin-left:16px">KD / month</span></div></div>
      </div>` };
  }
  // myth/fact
  if (/^\*\*Myth:\*\*/.test(s)) {
    const m = s.match(/\*\*Myth:\*\*\s*(.+?)\s*·\s*\*\*Fact:\*\*\s*(.+)$/);
    return { cls: bg, body: `${base}<div class="mid" style="gap:34px">
      <div class="myth" style="background:${onDark ? 'rgba(255,255,255,.08)' : '#fff'};position:relative"><div class="tagl" style="color:var(--red);margin-bottom:16px">Myth</div><div class="${bc}" style="text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:4px;opacity:.85">${vt(m[1])}</div></div>
      <div class="myth" style="background:var(--peri);color:var(--deep)"><div class="tagl" style="margin-bottom:16px">Fact</div><div class="serif" style="font-size:54px;font-weight:600;line-height:1.18">${vt(m[2])}</div></div>
    </div>` };
  }
  // numbered reason "**1. It's here.** text" or "**1.** text"
  const nm = head && head.match(/^(\d+)\.\s*(.*)$/);
  if (nm) {
    return { cls: bg, body: `${base}<div class="mid">
      <div class="bignum" style="color:var(--peri)">${nm[1]}</div>
      ${nm[2] ? `<div class="hd ${hc}" style="font-size:118px;margin-top:30px" data-fit data-min="70">${vt(nm[2])}</div>` : ''}
      <div class="body ${bc}" style="margin-top:36px;font-size:${nm[2] ? 50 : 70}px;${nm[2] ? '' : 'font-family:var(--serif);font-weight:600;line-height:1.2'}">${vt(rest)}</div></div>${photo}` };
  }
  // step slide "**Step 1 · Say hello** · text"
  const st = s.match(/^\*\*Step (\d) · (.+?)\*\*\s*·\s*(.+)$/);
  if (st) {
    return { cls: bg, body: `${base}<div class="mid">
      <div class="tagl ${hc}">Step ${st[1]} of 4</div>
      <div class="hd ${hc}" style="font-size:150px;margin-top:24px">${vt(st[2])}</div>
      <div class="body ${bc}" style="margin-top:40px;font-size:46px">${vt(st[3])}</div></div>` };
  }
  // question slide (FAQ): "**Question?** Answer"
  if (head && /\?$/.test(head)) {
    return { cls: bg, body: `${base}<div class="mid">
      <div class="serif ${hc}" style="font-size:84px;font-weight:700;line-height:1.08">${vt(head)}</div>
      <div style="height:8px;width:110px;background:var(--peri);margin:40px 0;border-radius:4px"></div>
      <div class="body ${bc}" style="font-size:50px;max-height:620px;overflow:hidden" data-fit data-min="30">${vt(rest)}</div></div>` };
  }
  // stats trio "30 credits · 10 courses · 18 months"
  const its = items(rest);
  const statLike = its.length >= 2 && its.every((t) => /^\d[\d,.]*\+?\s+\w+/.test(t)) && its.length <= 3;
  if (statLike) {
    return { cls: bg, body: `${base}<div class="mid">
      <div class="hd ${hc}" style="font-size:130px">${vt(head || '')}</div>
      <div style="margin-top:60px;display:flex;flex-direction:column;gap:26px">${its.map((t) => { const mm = t.match(/^([\d,.]+\+?)\s+(.+)$/); return `<div style="display:flex;align-items:baseline;gap:30px;border-bottom:3px solid ${onDark ? 'rgba(255,255,255,.2)' : 'var(--line)'};padding-bottom:18px"><span class="hd" style="font-size:170px;color:var(--peri)">${esc(mm[1])}</span><span class="hd ${hc}" style="font-size:90px">${vt(mm[2])}</span></div>`; }).join('')}</div></div>` };
  }
  // generic: heading + list or paragraph
  const longHead = head && head.length > 22;
  const headHtml = head ? `<div class="${longHead ? 'serif' : 'hd'} ${hc}" style="font-size:${longHead ? 80 : 130}px;${longHead ? 'font-weight:700;line-height:1.08' : ''}" data-fit data-min="56">${vt(head)}</div>` : '';
  let bodyHtml;
  if (its.length >= 2) {
    bodyHtml = `<div class="list" style="margin-top:46px">${its.map((t) => `<div class="row ${bc}"><span class="tick">${TICK}</span><span>${vt(t)}</span></div>`).join('')}</div>`;
  } else {
    bodyHtml = `<div class="${head ? 'body' : 'serif'} ${bc}" style="margin-top:${head ? 40 : 0}px;font-size:${head ? 54 : 80}px;${head ? '' : 'font-weight:600;line-height:1.16'}">${vt(rest)}</div>`;
  }
  if (photo) return { cls: bg, body: `${base}<div class="stackw" style="top:200px;max-height:480px;overflow:hidden" data-fit data-min="24">${headHtml}${bodyHtml}</div>${photo}` };
  return { cls: bg, body: `${base}<div class="mid"><div style="max-height:960px;overflow:hidden" data-fit data-min="24">${headHtml}${bodyHtml}</div></div>` };
}

function buildCarousel(id) {
  let base = id, map = null;
  if (VARIANTS[id]) { base = VARIANTS[id].base; map = VARIANTS[id].map; }
  const c = L.C.carousels.find((x) => x.id === base);
  const art = ART[base] || { cover: 'stack' };
  let slides = c.slides.slice();
  const n = slides.length;
  if (map) slides = slides.map((s, i) => map(s, i, n));
  // strip production notes from visuals (kept in the QA/placeholder report)
  slides = slides.map((s) => s.replace(/\s*\((?:use a real[^)]*|labels with[^)]*|speaker photo[^)]*)\)/g, '').replace(/\s*·\s*real event photo/g, '').replace(/\s*\*\(confirm for online\)\*/g, ''));
  if (id === 'C04b' || id === 'C01b') slides[n - 1] = slides[n - 1];
  return slides.map((s, i) => {
    let r;
    if (i === 0) r = coverSlide(id, s, n, art);
    else if (i === n - 1) r = ctaSlide(id, s, n, art);
    else r = contentSlide(id, s, i, n, art);
    return { html: page({ w: W, h: H, body: r.body + FIT_JS, css: CSS, cls: r.cls }), idx: i + 1, n };
  });
}

const ALL = [...L.C.carousels.map((c) => c.id), 'C04b', 'C07b', 'C09b'];

async function run(ids) {
  ids = ids && ids.length ? ids : ALL;
  const jobs = [];
  for (const id of ids) {
    const slides = buildCarousel(id);
    for (const s of slides) {
      const nn = String(s.idx).padStart(2, '0');
      jobs.push({ html: s.html, out: path.join(L.OUT, `assets/carousels/${id}/${id}_${nn}.png`), w: W, h: H });
    }
  }
  const issues = await L.renderAll(jobs, 4);
  // LinkedIn PDF per carousel from PNGs
  const { PDFDocument } = require('pdf-lib');
  for (const id of ids) {
    const dir = path.join(L.OUT, `assets/carousels/${id}`);
    const pngs = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
    const doc = await PDFDocument.create();
    const c = L.C.carousels.find((x) => x.id === (VARIANTS[id] ? VARIANTS[id].base : id));
    doc.setTitle(c.title); doc.setAuthor('Professional Learning Institute'); doc.setCreator('مصنع المحتوى — Content Factory');
    for (const f of pngs) {
      const img = await doc.embedPng(fs.readFileSync(path.join(dir, f)));
      const pg = doc.addPage([W, H]); pg.drawImage(img, { x: 0, y: 0, width: W, height: H });
    }
    fs.writeFileSync(path.join(dir, `${id}_linkedin.pdf`), await doc.save());
  }
  return issues;
}

module.exports = { run, ALL, buildCarousel };
if (require.main === module) {
  run(process.argv.slice(2)).then((iss) => { console.log('overflow issues:', JSON.stringify(iss, null, 1)); return L.closeBrowser(); }).catch((e) => { console.error(e); process.exit(1); });
}

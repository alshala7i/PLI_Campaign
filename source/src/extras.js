// Stories (ST-*), highlight covers, LinkedIn/Facebook covers, A3 posters (QR), programme guide (A4 ×2), staff emails.
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');
const L = require('./lib');
const { vt, esc, shield, dots, lockup, dateblock, page, FIT_JS, PHOTO } = L;

const CSS = `
.hd{font-family:var(--anton);text-transform:uppercase;line-height:.93}
.sub{font-family:var(--sans);font-weight:600;line-height:1.32}
.tagline{font-family:var(--sans);font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.abs{position:absolute}
.zone{position:absolute;left:140px;right:140px;border:4px dashed rgba(169,193,243,.9);border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:var(--sans);font-weight:700;font-size:30px;color:rgba(169,193,243,.95);padding:20px;letter-spacing:.02em}
.bg-cream .zone{border-color:rgba(75,79,158,.45);color:rgba(75,79,158,.75)}
.ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round}
`;
const ICON = {
  cap: '<svg viewBox="0 0 120 90"><path d="M10 32 60 10l50 22-50 22z"/><path d="M30 42v22c0 8 14 16 30 16s30-8 30-16V42"/><path d="M106 34v26"/></svg>',
  edd: '<svg viewBox="0 0 120 100"><path d="M10 38 60 16l50 22-50 22z"/><path d="M30 48v22c0 8 14 16 30 16s30-8 30-16V48"/><path d="M60 2l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/></svg>',
  coins: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="24" rx="30" ry="10"/><path d="M20 24v14c0 6 13 10 30 10s30-4 30-10V24M20 38v14c0 6 13 10 30 10s30-4 30-10V38M20 52v14c0 6 13 10 30 10s30-4 30-10V52"/></svg>',
  faq: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><path d="M38 38c0-7 5-12 12-12s12 5 12 12c0 9-12 10-12 20M50 70v2"/></svg>',
  grads: '<svg viewBox="0 0 140 90"><circle cx="35" cy="28" r="12"/><circle cx="70" cy="24" r="14"/><circle cx="105" cy="28" r="12"/><path d="M15 80c0-14 9-24 20-24s20 10 20 24M48 80c0-16 10-28 22-28s22 12 22 28M85 80c0-14 9-24 20-24s20 10 20 24"/></svg>',
  series: '<svg viewBox="0 0 100 100"><rect x="12" y="20" width="76" height="68" rx="10"/><path d="M12 40h76M32 10v18M68 10v18M30 58h12M58 58h12M30 72h12"/></svg>',
  apply: '<svg viewBox="0 0 100 100"><path d="M20 50h56M58 30l20 20-20 20"/><circle cx="50" cy="50" r="42"/></svg>',
  clock: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><path d="M50 26v26l16 10"/></svg>',
  crescent: '<svg viewBox="0 0 100 100"><path d="M64 14a38 38 0 1 0 22 62A32 32 0 1 1 64 14z"/></svg>',
};
const ico = (n, size, color, extra = '') => `<div class="ico abs" style="width:${size}px;height:${size}px;color:${color};${extra}">${ICON[n]}</div>`;
const SW = 1080, SH = 1920;
const st = (cls, body) => ({ cls, body: `${shield('" style="top:150px')}${body}` });

// ---------- story frames
function stories() {
  const F = [];
  const add = (id, n, r) => F.push({ id: `${id}_${String(n).padStart(2, '0')}`, ...r });
  for (const [suf, cohort, m] of [['', 'January', 'JAN'], ['-MAR', 'End-of-March', 'MAR']]) {
    const id = 'ST-LAUNCH' + suf;
    add(id, 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:640px"><div class="hd c-cream" style="font-size:250px">BIG<br>NEWS</div><div class="sub c-peri" style="font-size:54px;margin-top:40px">For every educator who keeps saying “one day”.</div></div>`));
    add(id, 2, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:520px"><div class="tagline c-indigo" style="font-size:32px">Applications open</div><div class="hd c-indigo" style="font-size:200px;margin-top:30px">${cohort.toUpperCase()}<br>COHORT</div>
      <div style="margin-top:60px;display:flex;gap:30px;align-items:center">${dateblock(m, '2027')}<div class="sub c-deep" style="font-size:40px">Saint Mary's University of Minnesota MAED<br>30 credits · 10 courses · 18 months</div></div></div>`));
    add(id, 3, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:420px"><div class="serif c-cream" style="font-size:100px;font-weight:700;line-height:1.05">Have you ever thought about a master's?</div></div><div class="zone" style="top:900px;height:330px">POLL STICKER<br>Yes · Every year 😅</div>`));
    add(id, 4, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:520px"><div class="hd c-indigo" style="font-size:180px">YOUR<br>COLLEAGUES<br>ALREADY<br>DID IT.</div><div class="hd c-deep" style="font-size:180px">YOUR TURN.</div></div><div class="zone" style="top:1440px;height:170px">LINK STICKER · “Ask us” → form link</div>`));
  }
  add('ST-QBOX', 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:430px"><div class="hd c-cream" style="font-size:170px">ASK US<br>ANYTHING</div><div class="sub c-peri" style="font-size:50px;margin-top:30px">about the MAED</div></div><div class="zone" style="top:1020px;height:420px">QUESTION STICKER<br>“Ask us anything about the MAED”</div>`));
  for (let k = 2; k <= 4; k++) add('ST-QBOX', k, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:400px"><div class="tagline c-indigo" style="font-size:30px">You asked</div><div class="zone" style="position:relative;left:0;right:0;margin-top:30px;height:300px">RESHARE THE QUESTION HERE</div>
    <div class="tagline c-indigo" style="font-size:30px;margin-top:70px">We answered</div><div class="serif c-deep" style="font-size:66px;line-height:1.2;margin-top:24px;font-weight:600"><span class="ph" style="font-size:40px">Type the answer (from C07 FAQ)</span></div></div>`));
  add('ST-QUIZ', 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:460px"><div class="tagline c-peri" style="font-size:32px">Quick quiz</div><div class="serif c-cream" style="font-size:110px;font-weight:700;margin-top:24px;line-height:1.05">How long is the MAED?</div></div><div class="zone" style="top:980px;height:420px">QUIZ STICKER<br>12 · 18 · 24 months</div>`));
  add('ST-QUIZ', 2, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:520px"><div class="tagline c-indigo" style="font-size:32px">The answer</div><div class="hd c-indigo" style="font-size:380px;line-height:.9;margin-top:20px">18</div><div class="hd c-deep" style="font-size:150px">MONTHS</div><div class="sub c-deep" style="font-size:44px;margin-top:40px">30 credits · 10 courses · while you keep teaching.</div></div>`));
  add('ST-QUIZ', 3, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:400px"><div class="tagline c-peri" style="font-size:32px">Quick quiz</div><div class="serif c-cream" style="font-size:92px;font-weight:700;margin-top:24px;line-height:1.08">How many of our past students were ACA educators?</div></div><div class="zone" style="top:1060px;height:400px">QUIZ STICKER<br>3 in 10 · 6 in 10 · 9 in 10</div>`));
  add('ST-QUIZ', 4, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:480px"><div class="tagline c-indigo" style="font-size:32px">The answer</div><div class="hd c-indigo" style="font-size:300px;margin-top:20px">6 IN 10</div><div style="margin:60px 0">${dots({ size: 110, gap: 40 })}</div><div class="serif c-deep" style="font-size:66px;font-weight:600;line-height:1.15">More than 6 in 10 of our past students were ACA educators.</div></div>`));
  add('ST-SLIDER', 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:460px"><div class="serif c-cream" style="font-size:110px;font-weight:700;line-height:1.05">How ready do you feel for a master's?</div></div><div class="zone" style="top:1050px;height:260px">EMOJI SLIDER STICKER</div>`));
  add('ST-SLIDER', 2, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:600px"><div class="serif c-indigo" style="font-size:120px;font-weight:700;line-height:1.05">Most graduates didn't feel ready either.</div><div class="sub c-deep" style="font-size:48px;margin-top:50px">They started anyway. Ask us how.</div></div>`));
  for (const [suf, cohort, dl] of [['', 'January', L.PH.JAN_DEADLINE.visual], ['-MAR', 'March', L.PH.MAR_DEADLINE.visual]]) {
    [7, 3, 1].forEach((d, k) => add('ST-COUNT' + suf, k + 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:400px"><div class="tagline c-peri" style="font-size:32px">${cohort} cohort</div>
      <div class="hd c-cream" style="font-size:520px;line-height:.9;margin-top:20px">${d}</div><div class="hd c-peri" style="font-size:170px">${d === 1 ? 'DAY LEFT' : 'DAYS LEFT'}</div>
      <div class="sub c-white" style="font-size:44px;margin-top:40px">Applications close ${esc(dl)}</div></div><div class="zone" style="top:1430px;height:180px">COUNTDOWN + LINK STICKERS</div>`)));
  }
  [['a', 'DEC', '9', 'Wed 9 Dec · 7:30 pm'], ['b', 'JAN', '27', 'Wed 27 Jan · 7:30 pm'], ['c', 'FEB', '17', 'Wed 17 Feb · 9:30 pm']].forEach(([k, m, d, t], i) => add('ST-LIVE', i + 1, st('bg-cream', `<div class="abs" style="left:90px;right:90px;top:380px"><div class="hd c-indigo" style="font-size:220px">ASK PLI<br><span class="c-deep">LIVE</span></div>
    <div style="margin-top:50px;display:flex;gap:30px;align-items:center">${dateblock(m, d)}<div class="sub c-deep" style="font-size:42px">${t}<br>with Salwa Sleiman</div></div></div>
    <div class="zone" style="top:1180px;height:180px">COUNTDOWN STICKER</div><div class="zone" style="top:1400px;height:220px">QUESTION STICKER · “What should we answer live?”</div>`)));
  add('ST-RESHARE', 1, st('bg-indigo', `<div class="abs" style="left:90px;right:90px;top:300px"><div class="hd c-cream" style="font-size:150px">NEW POST <span class="c-peri">↑</span></div></div><div class="zone" style="top:560px;height:860px">RESHARE THE FEED POST HERE</div><div class="zone" style="top:1460px;height:170px">POLL OR EMOJI SLIDER</div>`));
  add('ST-BTS', 1, { cls: 'bg-deep', body: `<img class="abs" src="${PHOTO.class}" style="left:0;top:0;width:100%;height:100%;object-fit:cover"><div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(54,58,128,.0) 40%,rgba(54,58,128,.92) 75%)"></div>${shield('" style="top:150px')}
    <div class="abs" style="left:90px;right:90px;top:1250px"><div class="hd c-cream" style="font-size:140px">THIS COULD BE<br>YOUR CLASS NIGHT</div><div class="sub c-peri" style="font-size:40px;margin-top:24px">Behind the scenes · MAED cohort</div></div>` });
  add('ST-RAMADAN', 1, st('bg-deep', `${ico('crescent', 300, 'var(--peri)', 'left:90px;top:420px')}<div class="abs" style="left:90px;right:90px;top:820px"><div class="serif c-cream" style="font-size:130px;font-weight:700;line-height:1">Ramadan<br>Kareem</div><div class="sub c-peri" style="font-size:48px;margin-top:40px">Wishing you a month of reflection, peace and growth.</div></div>`));
  add('ST-RAMADAN', 2, st('bg-indigo', `${ico('clock', 280, 'var(--peri)', 'left:90px;top:420px')}<div class="abs" style="left:90px;right:90px;top:800px"><div class="hd c-cream" style="font-size:170px">EVENING CALLS<br>AVAILABLE</div><div class="sub c-white" style="font-size:52px;margin-top:40px">Message us after 9 pm.</div></div><div class="zone" style="top:1430px;height:180px">LINK STICKER · “Message us”</div>`));
  return F.map((f) => ({ html: page({ w: SW, h: SH, body: f.body + FIT_JS, css: CSS, cls: f.cls }), out: path.join(L.OUT, `assets/stories/${f.id}.png`), w: SW, h: SH }));
}

// ---------- highlight covers, page covers
function covers() {
  const J = [];
  [['MAED', 'cap'], ['Ed.D', 'edd'], ['Fees', 'coins'], ['FAQ', 'faq'], ['Grads', 'grads'], ['Series', 'series'], ['Apply', 'apply']].forEach(([t, ic]) => {
    J.push({ html: page({ w: SW, h: SH, css: CSS, cls: 'bg-indigo', body: `<div class="abs" style="left:240px;top:660px;width:600px;height:600px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center">${ico(ic, 320, 'var(--indigo)', 'position:relative')}</div><div class="abs tagline c-cream" style="left:0;right:0;top:1330px;text-align:center;font-size:64px">${esc(t)}</div>` }), out: path.join(L.OUT, `assets/extras/highlights/highlight_${t.replace('.', '')}.png`), w: SW, h: SH });
  });
  J.push({ html: page({ w: 1128, h: 191, css: CSS, cls: 'bg-indigo', body: `<div class="abs" style="left:330px;top:38px"><div class="hd c-cream" style="font-size:66px">GROW WHERE YOU TEACH</div><div class="sub c-peri" style="font-size:19px;margin-top:8px">Saint Mary's University of Minnesota MAED &amp; Ed.D · delivered in Kuwait · Next cohorts: January &amp; March 2027</div></div><div class="abs" style="right:40px;top:58px">${dots({ size: 26, gap: 9, color: 'var(--peri)', w: 3 })}</div>` }), out: path.join(L.OUT, 'assets/extras/covers/linkedin_cover_1128x191.png'), w: 1128, h: 191 });
  J.push({ html: page({ w: 1640, h: 624, css: CSS, cls: 'bg-indigo', body: `<div class="abs" style="right:-120px;top:-200px;width:700px;height:1100px;border-radius:999px 999px 0 0;border:4px solid rgba(169,193,243,.3)"></div>
    <div class="abs" style="left:300px;top:150px"><div class="tagline c-peri" style="font-size:22px">Professional Learning Institute · ACA Kuwait</div><div class="hd c-cream" style="font-size:150px;margin-top:16px">GROW WHERE<br>YOU TEACH</div></div>
    <div class="abs" style="left:1000px;top:200px">${dots({ size: 52, gap: 18, color: 'var(--peri)', w: 5 })}<div class="sub c-white" style="font-size:24px;margin-top:22px;width:330px">More than 6 in 10 of our past MAED students were ACA educators.</div></div>` }), out: path.join(L.OUT, 'assets/extras/covers/facebook_cover_1640x624.png'), w: 1640, h: 624 });
  return J;
}

// ---------- A3 posters (PDF) + A4 guide (PDF)
async function posters() {
  const J = [];
  const target = 'mailto:pli@aca.edu.kw?subject=MAED%20enquiry';
  for (const [k, cohort, dl] of [['jan', 'January', L.PH.JAN_DEADLINE.visual], ['mar', 'March', L.PH.MAR_DEADLINE.visual]]) {
    const qr = await QR.toDataURL(target, { margin: 1, width: 600, color: { dark: '#363A80', light: '#FFFFFF' } });
    const w = 1123, h = 1587; // A3 at 96dpi/ (297x420mm)
    J.push({ html: page({ w, h, css: CSS, cls: 'bg-cream', body: `<div class="abs" style="left:0;right:0;top:0;height:900px;background:var(--indigo)"></div>${shield('" style="top:60px;right:70px;width:110px')}
      <div class="abs" style="left:80px;right:80px;top:120px"><div class="tagline c-peri" style="font-size:28px">Professional Learning Institute</div><div class="hd c-cream" style="font-size:330px;line-height:.86;margin-top:20px">6 IN 10</div>
      <div style="margin:40px 0">${dots({ size: 70, gap: 24, color: 'var(--peri)', w: 6 })}</div><div class="serif c-white" style="font-size:52px;line-height:1.15;font-weight:600;width:900px">of our past MAED students were ACA educators.</div></div>
      <div class="abs" style="left:80px;top:950px;width:600px"><div class="hd c-indigo" style="font-size:136px;white-space:nowrap">YOUR TURN.</div><div class="sub c-deep" style="font-size:27px;margin-top:20px">${cohort} cohort · applications close ${esc(dl)}<br>Saint Mary's University of Minnesota MAED · staff rate 222.22 KD/month</div></div>
      <div class="abs" style="right:80px;top:950px;width:360px;text-align:center"><img src="${qr}" style="width:360px;height:360px;border-radius:20px;background:#fff;padding:14px"><div class="tagline c-indigo" style="font-size:22px;margin-top:14px">Scan to ask us</div></div>
      <div class="abs" style="left:80px;bottom:60px">${lockup(1)}</div><div class="abs sub c-indigo" style="right:80px;bottom:80px;font-size:24px">pli@aca.edu.kw</div>` }), out: path.join(L.OUT, `assets/extras/poster_${k}.pdf`), w, h });
  }
  return J;
}

function guide() {
  const w = 794, h = 1123; // A4 @96dpi
  const css = CSS + `.g h2{font-family:var(--serif);font-weight:700;color:var(--indigo);font-size:30px;margin:0 0 10px}.g h3{font-family:var(--sans);font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--deep);margin:16px 0 6px}.g p,.g li{font-size:13.2px;line-height:1.5}.g ul{margin:0 0 0 18px}.g .card{background:#fff;border-radius:14px;padding:14px 16px}.g .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}`;
  const p1 = `<div class="g" style="position:absolute;inset:0;padding:44px 50px"><div style="display:flex;justify-content:space-between;align-items:center"><div class="tagline c-indigo" style="font-size:12px">Programme guide · Professional Learning Institute</div><img src="${L.LOGO.shield}" style="height:52px"></div>
    <div class="hd c-indigo" style="font-size:64px;margin-top:16px">THE MAED</div><div class="serif c-deep" style="font-size:20px;margin-bottom:10px">Master of Arts in Education · Saint Mary's University of Minnesota · delivered in Kuwait</div>
    <div class="row"><div class="card"><h3 style="margin-top:0">Two tracks</h3><ul><li><b>Curriculum &amp; Instruction</b> — for teachers deepening classroom practice.</li><li><b>Educational Leadership</b> — for educators stepping into school leadership.</li></ul></div>
    <div class="card"><h3 style="margin-top:0">Structure</h3><p><b>30 credits · 10 courses · 18 months</b><br>Weekly in-person classes in Kuwait, designed for working educators. Online option for learners outside Kuwait (same programme, same degree, same diploma).</p></div></div>
    <h3>Accreditation</h3><p>Saint Mary's University of Minnesota is accredited in the US by the Higher Learning Commission.</p>
    <h3>Investment</h3><div class="row"><div class="card"><p><b>ACA staff:</b> 4,000 KD<br>222.22 KD/month × 18<br>Use your PL stipend and signing bonus toward tuition.</p></div><div class="card"><p><b>External educators:</b> 4,200 KD<br>233.33 KD/month × 18</p></div></div>
    <h3>Referral reward</h3><p>Refer 2 who register → your final payment is waived. Refer 4 who register and continue → your last 2 payments are waived. Terms apply.</p>
    <h3>Next cohorts</h3><p><b>January 2027</b> — applications close ${esc(L.PH.JAN_DEADLINE.copy)} (to confirm) · <b>End of March 2027</b> — applications close ${esc(L.PH.MAR_DEADLINE.copy)} (to confirm)</p>
    <div class="abs" style="left:50px;right:50px;bottom:40px;display:flex;justify-content:space-between;align-items:center">${lockup(0.7)}<div class="sub c-indigo" style="font-size:13px;text-align:right">More than 6 in 10 of our past MAED students<br>were ACA educators.</div></div></div>`;
  const p2 = `<div class="g" style="position:absolute;inset:0;padding:44px 50px"><div class="hd c-indigo" style="font-size:46px">THE ED.D</div><div class="serif c-deep" style="font-size:17px;margin-bottom:6px">Executive Leadership Doctorate · Saint Mary's University of Minnesota</div>
    <div class="card"><p>Designed for professionals with 10+ years of leadership experience. <b>39 credits · 3 years · fully online</b> with a local cohort in Kuwait · <b>no dissertation</b>. About 14,760 KD: 410 KD/month × 36 or 307.50 KD/month × 48 (staff pricing — external price on request).</p></div>
    <h3>Straight answers</h3>
    <p><b>Can I study while teaching full-time?</b> Yes. The MAED is designed for working educators, with weekly in-person classes.</p>
    <p><b>Is it accredited?</b> Saint Mary's University of Minnesota is accredited in the US by the Higher Learning Commission.</p>
    <p><b>Is it recognized in Kuwait?</b> It is recognized by the Ministry of Education as part of work-permit approval. It is not currently recognized by the Civil Service Commission for the public-sector salary scale. Kuwaiti citizens: talk to us before you apply. <span class="ph" style="font-size:11px">wording to be approved by PLI/HR</span></p>
    <p><b>I'm not in Kuwait. Can I join?</b> Yes — through our online option. Same programme, same degree, same diploma.</p>
    <h3>How to apply in 4 steps</h3><ol style="margin-left:18px"><li><b>Say hello</b> — fill in the short form or email pli@aca.edu.kw.</li><li><b>15-minute call</b> — we answer your questions and help you choose a track.</li><li><b>Send your documents</b> — we'll send you the checklist.</li><li><b>Choose your plan</b> — pick your track and monthly payment plan.</li></ol>
    <div class="card" style="margin-top:14px;background:var(--indigo);color:#fff"><p style="margin:0"><b>Contact:</b> pli@aca.edu.kw · Instagram @professionallearninginstitute · LinkedIn: ACA Professional Learning Institute</p></div>
    <div class="abs" style="left:50px;right:50px;bottom:40px;display:flex;justify-content:space-between;align-items:center"><div class="hd c-indigo" style="font-size:30px">GROW WHERE YOU TEACH.</div>${dots({ size: 16, gap: 6, w: 2.5 })}</div></div>`;
  return [p1, p2].map((b, i) => ({ html: page({ w, h, css, cls: 'bg-cream', body: b }), out: path.join(L.OUT, `assets/extras/_guide_p${i + 1}.pdf`), w, h }));
}

function emails() {
  const dir = path.join(L.OUT, 'assets/extras/emails');
  fs.mkdirSync(dir, { recursive: true });
  const e1 = L.C.emails[0];
  const sig = 'Warm regards,\nSalwa Sleiman · Professional Learning Institute Coordinator';
  const drafts = {
    'Staff email #1': `Subject: ${e1.subject}\n\n${L.ct(e1.body)}\n`,
    'Staff email #2': `Subject: ${L.C.emails[1].subject}\n\nDear colleagues,\n\nThis is the final week to join our January Saint Mary's University of Minnesota MAED cohort. Applications close ${L.PH.JAN_DEADLINE.copy}.\n\n30 credits · 10 courses · 18 months, with weekly in-person classes here in Kuwait. ACA staff rate: 4,000 KD (222.22 KD/month over 18 months), and you can apply your PL stipend and signing bonus.\n\nBring a colleague: refer 2 who register and your final payment is waived; refer 4 who register and continue and your last 2 payments are waived (terms apply).\n\nBook a 15-minute chat: {{APPLY_LINK}} or reply to this email.\n\n${sig}\n\n[DRAFT based on plan 3.7 summary — Salwa to approve]\n`,
    'Staff email #3': `Subject: ${L.C.emails[2].subject}\n\nNew to ACA? Welcome.\n\nHere's something many new staff only hear about later: your signing bonus and your professional learning stipend can go toward a master's degree.\n\nThe Saint Mary's University of Minnesota MAED is delivered right here in Kuwait, at the ACA staff rate of 4,000 KD (222.22 KD/month over 18 months). More than 6 in 10 of our past students were ACA educators, just like you.\n\nStart your first year with a plan to grow. Our next cohort starts at the end of March: {{APPLY_LINK}}\n\n${sig}\n\n[DRAFT based on plan 3.7 summary (V14 message) — Salwa to approve]\n`,
    'Staff email #4': `Subject: ${L.C.emails[3].subject}\n\nDear colleagues,\n\nFinal call: applications for our end-of-March Saint Mary's University of Minnesota MAED cohort close ${L.PH.MAR_DEADLINE.copy}.\n\nNot sure yet? Talk to one of our graduate ambassadors on your campus — they did the MAED while teaching full days, and they're happy to share their experience.\n\nPay monthly, from 222.22 KD for ACA staff. Book a 15-minute call: {{APPLY_LINK}} or reply to this email.\n\n${sig}\n\n[DRAFT based on plan 3.7 summary — Salwa to approve]\n`,
  };
  Object.entries(drafts).forEach(([k, v], i) => fs.writeFileSync(path.join(dir, `staff_email_${i + 1}.txt`), v));
  fs.writeFileSync(path.join(L.OUT, 'assets/extras/instagram_bio.txt'), L.C.bio_instagram + '\n');
  fs.writeFileSync(path.join(L.OUT, 'assets/extras/linkedin_tagline.txt'), L.C.linkedin_tagline + '\n');
}

async function run() {
  const jobs = [...stories(), ...covers(), ...(await posters()), ...guide()];
  const iss = await L.renderAll(jobs, 4);
  // merge guide pages
  const { PDFDocument } = require('pdf-lib');
  const doc = await PDFDocument.create();
  for (const k of [1, 2]) {
    const f = path.join(L.OUT, `assets/extras/_guide_p${k}.pdf`);
    const src = await PDFDocument.load(fs.readFileSync(f));
    const [pp] = await doc.copyPages(src, [0]); doc.addPage(pp); fs.unlinkSync(f);
  }
  doc.setTitle('PLI Programme Guide — MAED & Ed.D'); doc.setCreator('مصنع المحتوى — Content Factory');
  fs.writeFileSync(path.join(L.OUT, 'assets/extras/programme_guide.pdf'), await doc.save());
  emails();
  console.log('jobs', jobs.length, 'overflow', JSON.stringify(iss));
  await L.closeBrowser();
}
run().catch((e) => { console.error(e); process.exit(1); });

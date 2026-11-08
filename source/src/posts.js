// Single posts S01–S19 (+S03a–e, S04a–c, S09b): 1080×1350 PNG.
const path = require('path');
const L = require('./lib');
const { vt, esc, shield, dots, lockup, dateblock, page, FIT_JS, PHOTO } = L;
const W = 1080, H = 1350;
const P = (id) => L.C.posts.find((p) => p.id === id || p.id.startsWith(id));

const CSS = `
.hd{font-family:var(--anton);text-transform:uppercase;line-height:.93}
.sub{font-family:var(--sans);font-weight:600;font-size:40px;line-height:1.32}
.tagline{font-family:var(--sans);font-weight:800;font-size:28px;letter-spacing:.12em;text-transform:uppercase}
.abs{position:absolute}
.ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round}
`;
const ICON = {
  clock: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><path d="M50 26v26l16 10"/></svg>',
  cap: '<svg viewBox="0 0 120 90"><path d="M10 32 60 10l50 22-50 22z"/><path d="M30 42v22c0 8 14 16 30 16s30-8 30-16V42"/><path d="M106 34v26"/></svg>',
  book: '<svg viewBox="0 0 120 90"><path d="M60 18c-12-8-30-10-48-6v64c18-4 36-2 48 6 12-8 30-10 48-6V12c-18-4-36-2-48 6zM60 18v64"/></svg>',
  crescent: '<svg viewBox="0 0 100 100"><path d="M64 14a38 38 0 1 0 22 62A32 32 0 1 1 64 14z"/></svg>',
  lantern: '<svg viewBox="0 0 60 120"><path d="M30 4v10M20 14h20l6 12H14zM14 26c-6 12-6 50 0 62h32c6-12 6-50 0-62M14 88l6 12h20l6-12M30 100v12M30 40v32M22 48c4 6 12 6 16 0"/></svg>',
  star: '<svg viewBox="0 0 100 100"><path d="M50 8l10 30h32L66 56l10 32-26-19-26 19 10-32L8 38h32z"/></svg>',
};
const ico = (n, size, color, extra = '') => `<div class="ico abs" style="width:${size}px;height:${size}px;color:${color};${extra}">${ICON[n]}</div>`;

// T1 bold stack (cohort open)
function cohortOpen(id, month, photo) {
  const p = P(id);
  const h = p.h.split(' · ');
  return { cls: 'bg-cream', body: `<div class="abs" style="left:0;right:0;top:0;height:820px;background:var(--indigo)"></div>${shield()}
    <div class="abs" style="left:80px;top:130px;width:560px"><div class="tagline c-peri" style="margin-bottom:22px">Grow where you teach</div>
      <div class="hd c-cream" style="font-size:140px;max-width:560px" data-fit data-min="90">${vt(h[0])}</div><div class="hd c-peri" style="font-size:84px;margin-top:18px;max-width:560px;white-space:nowrap" data-fit data-min="56">${vt(h[1])}</div></div>
    <div class="arch abs" style="right:80px;top:230px;width:340px;height:560px"><img src="${PHOTO[photo]}"></div>
    <div class="abs" style="left:80px;top:870px;display:flex;gap:30px;align-items:center">${dateblock(month, '2027')}
      <div class="sub c-deep" style="width:470px;font-size:34px" data-fit data-min="24">${vt(p.sub)}</div></div>
    <div class="abs tagline c-indigo" style="left:80px;top:1090px;font-size:26px">${vt(p.tag)}</div>
    <div class="abs" style="left:80px;bottom:60px">${lockup(0.9)}</div>` };
}

function finalWeek(id) {
  const p = P(id);
  return { cls: 'bg-indigo', body: `${shield()}
    <div class="abs" style="left:80px;top:150px"><div class="tagline c-peri">Grow where you teach</div><div class="hd c-cream" style="font-size:230px;margin-top:20px">${vt(p.h)}</div></div>
    <div class="abs" style="right:80px;top:470px">${dateblock('DAYS LEFT', '7', 'style="padding:30px 60px 20px"').replace('class="d"', 'class="d" style="font-size:330px"')}</div>
    <div class="abs sub c-white" style="left:80px;top:540px;width:430px;font-size:44px">${vt(p.sub)}</div>
    <div class="abs serif c-peri" style="left:80px;top:1000px;font-size:64px;font-style:italic">${vt(p.tag || "Don't wait for the next cohort.")}</div>
    <div class="abs" style="left:80px;bottom:60px">${lockup(0.9)}</div>` };
}
function lastDay(id) {
  const p = P(id);
  return { cls: 'bg-deep', body: `${shield()}${ico('clock', 420, 'var(--peri)', 'right:60px;top:330px;opacity:.9')}
    <div class="abs" style="left:80px;top:170px;width:680px"><div class="hd c-cream" style="font-size:220px">${vt(p.h)}</div></div>
    <div class="abs" style="left:80px;top:830px"><div class="pill" style="font-size:40px;padding:14px 34px">${vt(p.sub)}</div>
    <div class="sub c-white" style="margin-top:34px;font-size:34px;opacity:.9">${vt(p.tag || '')}</div></div>
    <div class="abs" style="left:80px;bottom:60px">${lockup(0.9)}</div>` };
}

const B = {
  S01: () => cohortOpen('S01', 'JAN', 'trio'),
  S10: () => cohortOpen('S10', 'MAR', 'ceremony'),
  S02: () => { const p = P('S02'); return { cls: 'bg-cream', body: `${shield()}
    <div class="abs" style="left:80px;right:80px;top:170px"><div class="tagline c-indigo">From our staff room</div>
    <div class="hd c-indigo" style="font-size:300px;line-height:.86;margin-top:30px;white-space:nowrap">6 IN 10</div>
    <div style="margin:50px 0">${dots({ size: 92, gap: 30 })}</div>
    <div class="serif c-deep" style="font-size:66px;line-height:1.14;font-weight:600">${vt(p.sub)}</div>
    <div style="margin-top:44px"><span class="pill" style="font-size:34px;padding:14px 34px">${vt(p.tag)}</span></div></div>
    <div class="abs redline" style="right:80px;bottom:90px"></div>` }; },
  S04: (k) => { const p = P('S04'); const dates = { a: ['DEC', '9', 'Wed 9 Dec · 7:30 pm'], b: ['JAN', '27', 'Wed 27 Jan · 7:30 pm'], c: ['FEB', '17', 'Wed 17 Feb · 9:30 pm'] }[k];
    return { cls: 'bg-cream', body: `<div class="abs" style="left:0;right:0;top:0;height:690px;background:var(--indigo)"></div>${shield()}
    <div class="abs" style="left:80px;top:150px"><div class="hd c-cream" style="font-size:200px">ASK PLI</div><div class="hd c-peri" style="font-size:200px;display:flex;align-items:center;gap:26px">LIVE <span style="width:44px;height:44px;border-radius:50%;background:var(--red);display:inline-block"></span></div></div>
    <div class="arch abs" style="right:80px;top:250px;width:380px;height:560px;display:flex;align-items:center;justify-content:center;flex-direction:column;background:var(--peri-soft)"><img src="${L.LOGO.shield}" style="width:210px;height:auto;object-fit:contain"><div class="tagline c-indigo" style="margin-top:30px;font-size:24px;text-align:center">Host<br>Salwa Sleiman<br><span style="font-weight:600;letter-spacing:.04em;text-transform:none">PLI Coordinator</span></div></div>
    <div class="abs sub c-deep" style="left:80px;top:760px;width:500px;font-size:38px">${vt(p.sub)}</div>
    <div class="abs" style="left:80px;top:1010px;display:flex;gap:30px;align-items:center">${dateblock(dates[0], dates[1])}<div class="sub c-indigo" style="font-size:32px;font-weight:700">${esc(dates[2])}<br><span style="font-weight:600;font-size:28px">Instagram Live<br>@professionallearninginstitute</span></div></div>` }; },
  S03: (k) => { const ext = k === 'd' || k === 'e';
    return { cls: 'bg-cream', body: `${shield()}
    <div class="frame abs" style="left:80px;top:150px;width:400px;height:480px;display:flex;align-items:center;justify-content:center;border:4px dashed #e0218a;background:rgba(224,33,138,.05)"><div class="tagline" style="color:#b0006a;text-align:center;font-size:24px">Graduate photo<br>GRAD_${'abcde'.indexOf(k) + 1}.jpg<br>(real, with consent)</div></div>
    <div class="abs tagline c-indigo" style="left:530px;top:170px;width:470px">${ext ? 'From our community' : 'From our staff room'}</div>
    <div class="abs serif c-peri" style="left:520px;top:200px;font-size:300px;line-height:1">“</div>
    <div class="abs serif c-deep" style="left:80px;right:80px;top:690px;font-size:64px;line-height:1.18;font-weight:600"><span class="ph" style="font-size:40px">{{GRAD_QUOTE_SHORT}}</span><br><span style="font-size:36px;font-family:var(--sans);font-weight:500">Real words from a real graduate, with written consent.</span></div>
    <div class="abs bar" style="left:80px;bottom:200px;font-size:34px"><span class="ph" style="font-size:28px">{{GRAD_NAME}}</span> · <span class="ph" style="font-size:28px">{{GRAD_ROLE}}</span> · MAED <span class="ph" style="font-size:28px">{{GRAD_TRACK}}</span></div>
    <div class="abs tagline c-indigo" style="left:80px;bottom:110px;font-size:24px">Saint Mary's University of Minnesota · Grow where you teach</div>` }; },
  S05: () => finalWeek('S05'), S14: () => finalWeek('S14'),
  S06: () => lastDay('S06'), S15: () => lastDay('S15'),
  S07: () => { const p = P('S07'); return { cls: 'bg-deep', body: `${shield()}${ico('cap', 300, 'var(--peri)', 'left:80px;top:170px')}
    <div class="abs" style="left:80px;right:80px;top:440px"><div class="serif c-cream" style="font-size:112px;font-weight:700;line-height:1.02">For leaders with<br><span class="c-peri">10+ years</span></div>
    <div style="height:10px;width:140px;background:var(--red);border-radius:5px;margin:46px 0"></div>
    <div class="sub c-white" style="font-size:42px">${vt(p.sub).replace(/\s·\s/g, '<br>')}</div>
    <div class="tagline c-peri" style="margin-top:40px;font-size:26px">${vt(p.tag)}</div></div>` }; },
  S08: () => { const p = P('S08'); return { cls: 'bg-cream', body: `${shield()}${ico('book', 260, 'var(--indigo)', 'left:80px;top:170px')}
    <div class="abs" style="left:80px;right:80px;top:430px"><div class="tagline c-indigo">${vt(p.sub.split(' · ')[0])}</div>
    <div class="serif c-indigo" style="font-size:104px;font-weight:700;line-height:1.02;margin-top:24px">International Day of Education</div>
    <div class="serif c-deep" style="font-size:52px;line-height:1.25;margin-top:44px;font-style:italic">${vt(p.sub.split(' · ').slice(1).join(' · '))}</div>
    <div class="hd c-indigo" style="font-size:110px;margin-top:50px">${vt(p.tag)}</div></div>` }; },
  S09: (march) => { const p = P(march ? 'S09b' : 'S09');
    return { cls: 'bg-indigo', body: `${shield()}
    <div class="arch abs" style="left:80px;right:80px;top:150px;height:640px"><img src="${PHOTO.class}"></div>
    <div class="abs" style="left:80px;right:80px;top:840px"><div class="hd c-cream" style="font-size:136px">${vt(p.h)}</div>
    <div class="sub c-peri" style="margin-top:26px;font-size:44px">${vt(p.sub || '18 months. One goal. Let\'s grow.')}</div></div>` }; },
  S11: () => { const p = P('S11'); return { cls: 'bg-cream', body: `${shield()}
    <div class="abs" style="left:80px;top:170px;display:flex;flex-direction:column;gap:0;width:18px;height:300px;border-radius:9px;overflow:hidden"><i style="flex:1;background:#007A3D"></i><i style="flex:1;background:#fff"></i><i style="flex:1;background:#CE1126"></i><i style="flex:1;background:#000"></i></div>
    <div class="abs" style="left:140px;right:80px;top:150px"><div class="tagline c-indigo">${vt(p.tag)}</div>
    <div class="hd c-indigo" style="font-size:170px;margin-top:24px">HAPPY<br>NATIONAL DAY,<br><span class="c-deep">KUWAIT</span></div>
    <div class="serif c-deep" style="font-size:60px;margin-top:50px;font-style:italic">${vt(p.sub)}</div></div>
    <div class="abs" style="left:80px;bottom:60px">${lockup(0.9)}</div>` }; },
  S12: () => { const p = P('S12'); return { cls: 'bg-deep', body: `${shield()}${ico('crescent', 330, 'var(--peri)', 'right:120px;top:190px')}${ico('lantern', 300, 'var(--peri)', 'right:330px;top:120px;opacity:.75')}
    <div class="abs" style="left:80px;right:80px;top:640px"><div class="serif c-cream" style="font-size:140px;font-weight:700;line-height:1">Ramadan<br>Kareem</div>
    <div class="sub c-peri" style="margin-top:44px;font-size:44px">${vt(p.sub)}</div></div>
    <div class="abs tagline c-peri" style="left:80px;bottom:90px;font-size:24px">Professional Learning Institute</div>` }; },
  S13: () => { const p = P('S13'); const stars = [[150, 220, 70], [860, 520, 50], [700, 180, 40], [930, 260, 90], [260, 520, 36]].map(([x, y, s]) => ico('star', s, 'var(--peri)', `left:${x}px;top:${y}px`)).join('');
    return { cls: 'bg-cream', body: `${shield()}${stars}
    <div class="abs" style="left:80px;right:80px;top:640px"><div class="serif c-indigo" style="font-size:160px;font-weight:700;line-height:1">Eid<br>Mubarak</div>
    <div class="sub c-deep" style="margin-top:44px;font-size:44px">${vt(p.sub)}</div></div>` }; },
  S16: () => { const p = P('S16'); return { cls: 'bg-cream', body: `${shield()}
    <div class="abs" style="right:-30px;top:60px;font-family:var(--serif);font-weight:800;font-size:1250px;line-height:1;color:var(--peri);opacity:.6">?</div>
    <div class="abs serif c-indigo" style="left:80px;right:180px;top:420px;font-size:96px;font-weight:700;line-height:1.08">What's one thing you want to master this year?</div>
    <div class="abs tagline c-indigo" style="left:80px;bottom:110px">Tell us in the comments</div>` }; },
  S17: () => { const p = P('S17'); return { cls: 'bg-indigo', body: `<img class="abs" src="${PHOTO.ceremony}" style="left:0;top:0;width:100%;height:100%;object-fit:cover">
    <div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(54,58,128,.15) 0%,rgba(54,58,128,.55) 45%,rgba(54,58,128,.96) 72%)"></div>${shield()}
    <div class="abs" style="left:80px;right:80px;bottom:110px"><div class="hd c-cream" style="font-size:180px">${vt(p.h)}</div>
    <div class="serif c-white" style="font-size:54px;margin-top:24px;font-style:italic">${vt(p.sub)}</div>
    <div style="margin-top:34px"><span class="pill" style="font-size:32px">${vt(p.tag)}</span></div></div>` }; },
  S18: () => { const p = P('S18'); return { cls: 'bg-cream', body: `${shield()}
    <div class="abs" style="left:80px;top:150px"><div class="tagline c-indigo">${vt(p.sub)}</div></div>
    <div class="abs" style="left:80px;right:80px;top:260px;background:var(--indigo);border-radius:40px;padding:70px 70px 60px;color:#fff">
      <div class="hd c-peri" style="font-size:90px">FROM</div>
      <div class="hd c-cream" style="font-size:300px;line-height:.9">222.22</div>
      <div class="hd c-cream" style="font-size:96px">KD / MONTH</div>
      <div style="display:flex;gap:16px;margin-top:40px">${Array.from({ length: 18 }, () => '<i style="flex:1;height:44px;border-radius:8px;background:var(--peri)"></i>').join('')}</div>
      <div class="sub" style="margin-top:22px;font-size:30px;color:#dfe6ff">ACA staff rate · 4,000 KD over 18 months</div></div>
    <div class="abs" style="left:80px;top:1150px"><span class="pill" style="font-size:32px">${vt(p.tag)}</span></div>` }; },
  S19: () => { const p = P('S19'); const conf = Array.from({ length: 40 }, (_, i) => { const x = (i * 197) % 1000 + 30, y = (i * 113) % 520 + 60, c = ['var(--peri)', 'var(--indigo)', 'var(--red)', 'var(--deep)'][i % 4], r = (i * 37) % 180; return `<i class="abs" style="left:${x}px;top:${y}px;width:${i % 3 ? 14 : 22}px;height:${i % 3 ? 34 : 22}px;border-radius:${i % 3 ? 4 : 50}px;background:${c};transform:rotate(${r}deg);opacity:${i % 4 === 2 ? .7 : 1}"></i>`; }).join('');
    return { cls: 'bg-cream', body: `${conf}${shield()}
    <div class="abs" style="left:80px;right:80px;top:640px"><div class="hd c-indigo" style="font-size:190px">NEW YEAR.<br><span class="c-deep">NEXT DEGREE.</span></div>
    <div class="serif c-deep" style="font-size:52px;margin-top:36px;font-style:italic">${vt(p.sub)}</div></div>` }; },
};

function jobs(ids) {
  const list = [];
  const add = (id, r) => list.push({ id, html: page({ w: W, h: H, body: r.body + FIT_JS, css: CSS, cls: r.cls }), out: path.join(L.OUT, `assets/posts/${id}.png`), w: W, h: H });
  const all = ['S01', 'S02', 'S03a', 'S03b', 'S03c', 'S03d', 'S03e', 'S04a', 'S04b', 'S04c', 'S05', 'S06', 'S07', 'S08', 'S09', 'S09b', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19'];
  for (const id of ids && ids.length ? ids : all) {
    if (/^S03[a-e]$/.test(id)) add(id, B.S03(id[3]));
    else if (/^S04[a-c]$/.test(id)) add(id, B.S04(id[3]));
    else if (id === 'S09b') add(id, B.S09(true));
    else if (id === 'S09') add(id, B.S09(false));
    else add(id, B[id]());
  }
  return list;
}
const ALL_POSTS = ['S01', 'S02', 'S03a', 'S03b', 'S03c', 'S03d', 'S03e', 'S04a', 'S04b', 'S04c', 'S05', 'S06', 'S07', 'S08', 'S09', 'S09b', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19'];
module.exports = { jobs, ALL_POSTS };
if (require.main === module) {
  L.renderAll(jobs(process.argv.slice(2)), 4).then((iss) => { console.log('overflow:', JSON.stringify(iss.map((i) => [path.basename(i.out), i.overflow]))); return L.closeBrowser(); }).catch((e) => { console.error(e); process.exit(1); });
}

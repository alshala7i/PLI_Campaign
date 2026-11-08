// Browser-side motion engine. window.SPEC is injected; window.seek(t) renders frame at time t (pure function of t).
(function () {
  const S = window.SPEC;
  const stage = document.getElementById('stage');
  const K = S.k; // font scale
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const eio = (x) => (x = clamp(x), x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const back = (x) => { x = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const pr = (lt, a, d = 0.35) => eo((lt - a) / d);
  const el = (tag, cls, html, style) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; return e; };
  const px = (n) => Math.round(n * K) + 'px';
  const COL = { cream: 'var(--cream)', indigo: 'var(--indigo)', deep: 'var(--deep)', peri: 'var(--peri)', white: '#fff', ink: 'var(--ink)', red: 'var(--red)' };
  const fg = (bg) => (bg === 'cream' || bg === 'peri' ? 'var(--indigo)' : 'var(--cream)');
  const sub = (bg) => (bg === 'cream' || bg === 'peri' ? 'var(--deep)' : '#fff');
  const set = (e, o, y = 0, x = 0, s = 1) => { e.style.opacity = o; e.style.transform = `translate(${x}px,${y}px) scale(${s})`; };
  const fmt = (n, dec) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const ICON = {
    cap: '<svg viewBox="0 0 120 90"><path d="M10 32 60 10l50 22-50 22z"/><path d="M30 42v22c0 8 14 16 30 16s30-8 30-16V42"/><path d="M106 34v26"/></svg>',
    shield: '<svg viewBox="0 0 90 100"><path d="M45 6 80 18v28c0 24-16 42-35 48C26 88 10 70 10 46V18z"/><path d="M28 50l12 12 24-26"/></svg>',
    clock: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><path d="M50 26v26l16 10"/></svg>',
    calendar: '<svg viewBox="0 0 100 100"><rect x="12" y="20" width="76" height="68" rx="10"/><path d="M12 40h76M32 10v18M68 10v18"/></svg>',
    laptop: '<svg viewBox="0 0 120 90"><rect x="22" y="10" width="76" height="52" rx="6"/><path d="M8 76h104l-8-12H16z"/></svg>',
    people: '<svg viewBox="0 0 140 90"><circle cx="35" cy="28" r="12"/><circle cx="70" cy="24" r="14"/><circle cx="105" cy="28" r="12"/><path d="M15 80c0-14 9-24 20-24s20 10 20 24M48 80c0-16 10-28 22-28s22 12 22 28M85 80c0-14 9-24 20-24s20 10 20 24"/></svg>',
    hand: '<svg viewBox="0 0 100 100"><path d="M34 54V26a6 6 0 0 1 12 0v22M46 46V18a6 6 0 0 1 12 0v28M58 46V22a6 6 0 0 1 12 0v30M70 50V34a6 6 0 0 1 12 0v24c0 20-12 32-30 32-12 0-20-6-26-16L16 58a6 6 0 0 1 10-8l8 8"/></svg>',
    crescent: '<svg viewBox="0 0 100 100"><path d="M64 14a38 38 0 1 0 22 62A32 32 0 1 1 64 14z"/></svg>',
    book: '<svg viewBox="0 0 120 90"><path d="M60 18c-12-8-30-10-48-6v64c18-4 36-2 48 6 12-8 30-10 48-6V12c-18-4-36-2-48 6zM60 18v64"/></svg>',
    coins: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="24" rx="30" ry="10"/><path d="M20 24v14c0 6 13 10 30 10s30-4 30-10V24M20 38v14c0 6 13 10 30 10s30-4 30-10V38M20 52v14c0 6 13 10 30 10s30-4 30-10V52"/></svg>',
  };
  const icon = (name, color, size) => el('div', 'icon', ICON[name] || '', `width:${px(size)};height:${px(size * 0.8)};color:${color}`);

  // ---------------- scene builders: return {root, update(lt,dur)}
  const B = {};
  const box = (bg) => {
    const root = el('div', 'scene' + (bg === 'indigo' || bg === 'deep' ? ' bg-dark' : ''), null, `background:${COL[bg] || bg}`);
    const inner = el('div', 'sbox');
    root.appendChild(inner);
    return { root, inner };
  };
  const words = (txt) => txt.split(/\s+/).filter(Boolean);

  B.stamp = (p) => {
    const { root, inner } = box(p.bg);
    inner.style.justifyContent = p.align === 'top' ? 'flex-start' : 'center';
    const ws = [];
    p.lines.forEach((ln) => {
      const row = el('div', 'anton', null, `font-size:${px(ln.size || 150)};color:${COL[ln.color] || fg(p.bg)};display:flex;flex-wrap:wrap;gap:0 ${px(28)};line-height:.98`);
      words(ln.text).forEach((w) => { const s = el('span', null, w, 'display:inline-block;transform-origin:50% 60%'); row.appendChild(s); ws.push(s); });
      inner.appendChild(row);
    });
    if (p.sub) { const s = el('div', 'stxt', p.sub, `color:${sub(p.bg)};margin-top:${px(40)}`); inner.appendChild(s); ws.push(s); }
    const step = p.step || 0.16;
    let bar = null;
    if (p.strike) { const last = inner.lastChild; last.style.position = 'relative'; last.style.alignSelf = 'flex-start'; bar = el('div', null, null, `position:absolute;left:-2%;top:46%;height:${px(22)};background:var(--red);border-radius:12px;width:0`); last.appendChild(bar); }
    return { root, update(lt) { ws.forEach((w, i) => { const q = clamp((lt - 0.15 - i * step) / 0.22); set(w, q > 0 ? 1 : 0, 0, 0, 1 + (1 - back(q)) * 0.45); }); if (bar) bar.style.width = (104 * eo((lt - 0.8) / 0.5)) + '%'; } };
  };

  B.dots = (p) => {
    const { root, inner } = box(p.bg);
    const pre = el('div', 'anton', p.pre, `font-size:${px(120)};color:${fg(p.bg)}`);
    const big = el('div', 'anton', p.big, `font-size:${px(p.bigSize || 300)};color:var(--indigo);line-height:.88`);
    const dots = el('div', 'dotgrid'); const ds = [];
    for (let i = 0; i < 10; i++) { const d = el('i'); dots.appendChild(d); ds.push(d); }
    const cnt = el('div', 'stxt', '', `color:var(--deep);font-weight:800;margin-top:${px(18)};font-size:${px(40)}`);
    const s = el('div', 'stxt', p.sub, `color:${sub(p.bg)};margin-top:${px(26)};font-family:var(--serif);font-weight:600;font-size:${px(56)};line-height:1.15`);
    [pre, big, dots, cnt, s].forEach((x) => inner.appendChild(x));
    return { root, update(lt) {
      set(pre, pr(lt, 0.1), (1 - pr(lt, 0.1)) * 40); set(big, pr(lt, 0.25), 0, 0, 0.85 + 0.15 * back((lt - 0.25) / 0.4));
      ds.forEach((d, i) => { const a = pr(lt, 0.6 + i * 0.09, 0.25); d.style.opacity = a; d.style.transform = `scale(${0.4 + 0.6 * back((lt - 0.6 - i * 0.09) / 0.3)})`;
        const f = i < 6 ? clamp((lt - 1.7 - i * 0.12) / 0.25) : 0; d.style.background = f > 0.5 ? 'var(--indigo)' : f > 0 ? 'var(--peri)' : 'transparent'; });
      const c = clamp((lt - 1.6) / 1.4); cnt.textContent = p.count ? Math.round(eo(c) * p.count) + '%' : ''; cnt.style.opacity = c > 0 ? 1 : 0;
      set(s, pr(lt, 2.2), (1 - pr(lt, 2.2)) * 30);
    } };
  };

  B.photo = (p) => {
    const { root, inner } = box(p.bg);
    inner.style.justifyContent = 'flex-start';
    const fr = el('div', 'arch', `<img src="${p.photo}">`, `width:${px(S.fmt === '9x16' ? 700 : 520)};height:${px(S.fmt === '9x16' ? 760 : 520)};align-self:${p.side === 'left' ? 'flex-start' : 'flex-end'}`);
    const img = fr.querySelector('img');
    const line = el('div', null, null, `width:${px(130)};height:${px(10)};background:var(--red);border-radius:6px;margin:${px(44)} 0 ${px(30)}`);
    const ls = p.lines.map((t, i) => el('div', i === 0 ? 'anton' : 'stxt', t, i === 0 ? `font-size:${px(p.size || 104)};color:${fg(p.bg)}` : `color:${sub(p.bg)}`));
    inner.appendChild(fr); inner.appendChild(line); ls.forEach((x) => inner.appendChild(x));
    return { root, update(lt, dur) {
      set(fr, pr(lt, 0.05, 0.5), (1 - pr(lt, 0.05, 0.5)) * 60); img.style.transform = `scale(${1.04 + 0.05 * (lt / Math.max(dur, 1))})`;
      line.style.width = px(130 * pr(lt, 0.45, 0.4)); ls.forEach((x, i) => set(x, pr(lt, 0.5 + i * 0.35), (1 - pr(lt, 0.5 + i * 0.35)) * 30));
    } };
  };

  B.bars = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(p.headSize || 110)};color:${fg(p.bg)};margin-bottom:${px(40)}`));
    const bs = p.items.map((it) => { const b = el('div', 'vbar anton', it.text || it, `font-size:${px(p.size || 92)}`); inner.appendChild(b); return b; });
    return { root, update(lt) { bs.forEach((b, i) => { const t0 = p.items[i].t != null ? p.items[i].t : 0.2 + i * (p.step || 0.45); const q = pr(lt, t0, 0.4); set(b, q, 0, -(1 - q) * 900 * K); }); } };
  };

  B.counters = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(96)};color:${fg(p.bg)};margin-bottom:${px(30)}`));
    const rows = p.items.map((it) => {
      const r = el('div', 'crow'); const n = el('span', 'anton', '0', `font-size:${px(p.size || 230)};color:var(--peri)`); const l = el('span', 'anton', it.label, `font-size:${px(p.lsize || 104)};color:${fg(p.bg)}`);
      r.appendChild(n); r.appendChild(l); inner.appendChild(r); return { r, n };
    });
    let foot = null; if (p.foot) { foot = el('div', 'vbar anton', p.foot, `font-size:${px(70)};margin-top:${px(40)}`); inner.appendChild(foot); }
    return { root, update(lt) { if (foot) { const q = pr(lt, p.footAt && p.footAt.t != null ? p.footAt.t : 1.6, 0.4); set(foot, q, 0, -(1 - q) * 900 * K); } rows.forEach(({ r, n }, i) => { const t0 = p.items[i].t != null ? p.items[i].t : 0.15 + i * 0.5; const q = pr(lt, t0, 0.3); set(r, q, (1 - q) * 50);
      const c = eo((lt - t0) / 1.0); const it = p.items[i]; n.textContent = (it.pre || '') + fmt(it.n * c, it.dec || 0) + (it.suf || ''); }); } };
  };

  B.stack = (p) => {
    const { root, inner } = box(p.bg);
    const glows = [];
    if (p.glow) { for (let g = 0; g < 4; g++) { const gl = el('div', null, null, `position:absolute;border-radius:50%;width:${px(420 + g * 90)};height:${px(420 + g * 90)};background:radial-gradient(circle,rgba(169,193,243,.28),rgba(169,193,243,0) 70%);left:${[8, 55, 20, 62][g]}%;top:${[12, 22, 62, 70][g]}%`); root.insertBefore(gl, inner); glows.push(gl); } }
    if (p.img === 'smu') { const im = el('img', null, null, `height:${px(150)};align-self:flex-start;margin-bottom:${px(50)}`); im.src = S.logos.smuDark; inner.appendChild(im); }
    const ls = p.lines.map((ln) => { const e = el('div', ln.serif ? 'serifh' : 'anton', ln.text, `font-size:${px(ln.size || 150)};color:${COL[ln.color] || fg(p.bg)};transform-origin:0 70%;${ln.italic ? 'font-style:italic;' : ''}`); inner.appendChild(e); return e; });
    if (p.img === 'smu') ls.unshift(inner.firstChild);
    if (p.sub) { const s = el('div', 'stxt', p.sub, `color:${sub(p.bg)};margin-top:${px(36)}`); inner.appendChild(s); ls.push(s); }
    const off = p.img === 'smu' ? 1 : 0;
    return { root, update(lt) { ls.forEach((e, ii) => { const i = ii - off; const t0 = (i >= 0 && p.lines[i] && p.lines[i].t != null) ? p.lines[i].t : 0.1 + ii * (p.step || 0.32); const q = pr(lt, t0, 0.4);
      const pop = i >= 0 && p.lines[i] && p.lines[i].pop; set(e, q, (1 - q) * 60, 0, pop ? 0.7 + 0.3 * back((lt - t0) / 0.45) : 1); });
      glows.forEach((g, k) => { g.style.transform = `translate(${Math.sin(lt * 0.5 + k) * 30}px,${Math.cos(lt * 0.4 + k * 2) * 24}px)`; g.style.opacity = pr(lt, 0, 1.2); }); } };
  };

  B.split = (p) => {
    const root = el('div', 'scene', null, 'background:var(--cream);display:flex;flex-direction:' + (S.fmt === '9x16' ? 'column' : 'row'));
    const mk = (side, bgc) => { const pan = el('div', 'pan', null, `background:${COL[bgc]};flex:1;display:flex;flex-direction:column;justify-content:center;padding:${px(70)}`);
      pan.appendChild(el('div', 'tagl', side.tag || '', `color:${fg(bgc)};opacity:.85`));
      pan.appendChild(el('div', 'anton', side.title, `font-size:${px(side.size || 110)};color:${fg(bgc)};margin-top:${px(16)}`));
      if (side.sub) pan.appendChild(el('div', 'stxt', side.sub, `color:${sub(bgc)};margin-top:${px(20)};font-size:${px(42)}`));
      root.appendChild(pan); return pan; };
    const a = mk(p.a, p.a.bg || 'peri'), b = mk(p.b, p.b.bg || 'indigo');
    const v = S.fmt === '9x16';
    if (v) { a.style.justifyContent = 'flex-end'; a.style.paddingTop = '250px'; a.style.paddingBottom = '60px'; b.style.justifyContent = 'flex-start'; b.style.paddingTop = '60px'; b.style.paddingBottom = '560px'; a.style.flex = '0 0 45%'; }
    return { root, update(lt) { const qa = pr(lt, 0.05, 0.45), qb = pr(lt, (p.b.t != null ? p.b.t : 0.5), 0.45);
      a.style.transform = v ? `translateX(${-(1 - qa) * 1100}px)` : `translateY(${-(1 - qa) * 1400}px)`; b.style.transform = v ? `translateX(${(1 - qb) * 1100}px)` : `translateY(${(1 - qb) * 1400}px)`; } };
  };

  B.equation = (p) => {
    const { root, inner } = box(p.bg);
    const lab = el('div', 'tagl', p.label, `color:${fg(p.bg)};font-size:${px(38)}`);
    const eq = el('div', 'anton', '', `font-size:${px(p.eqSize || 150)};color:${fg(p.bg)};margin-top:${px(30)};white-space:nowrap`);
    const res = el('div', 'resb anton', `${p.result}<span style="font-size:.34em;margin-left:${px(16)}">${p.unit || 'KD / MONTH'}</span>`, `font-size:${px(p.resSize || 190)};margin-top:${px(40)};align-self:flex-start;transform-origin:0 50%`);
    [lab, eq, res].forEach((x) => inner.appendChild(x));
    return { root, update(lt) { set(lab, pr(lt, 0.05)); const n = Math.floor(clamp((lt - 0.25) / Math.min(1.1, Math.max(0.5, ((p.resAt && p.resAt.t) || 1.6) - 0.5))) * p.eq.length); eq.textContent = p.eq.slice(0, n) || ' ';
      const q = clamp((lt - (p.resAt && p.resAt.t != null ? p.resAt.t : (p.rt || 1.6))) / 0.45); res.style.opacity = q > 0 ? 1 : 0; res.style.transform = `scale(${0.6 + 0.4 * back(q)})`; } };
  };

  B.tags = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(p.headSize || 120)};color:${fg(p.bg)}`));
    const wrap = el('div', null, null, `display:flex;flex-wrap:wrap;gap:${px(24)};margin-top:${px(50)}`);
    const ts = p.tags.map((t) => { const e = el('div', 'tagchip', t, `font-size:${px(p.size || 54)}`); wrap.appendChild(e); return e; });
    inner.appendChild(wrap);
    if (p.foot) { const f = el('div', 'stxt', p.foot, `color:${sub(p.bg)};margin-top:${px(46)}`); inner.appendChild(f); ts.push(f); }
    return { root, update(lt) { ts.forEach((e, i) => { const t0 = (p.tagAt && p.tagAt[i] && p.tagAt[i].t != null) ? p.tagAt[i].t : 0.3 + i * 0.4; const q = clamp((lt - t0) / 0.45); set(e, q > 0 ? 1 : 0, -(1 - back(q)) * 260 * K); }); } };
  };

  B.blocks = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(p.headSize || 104)};color:${fg(p.bg)};margin-bottom:${px(44)}`));
    const g = el('div', 'blk'); const bs = [];
    for (let i = 0; i < (p.total || 18); i++) { const b = el('div', null, String(i + 1)); g.appendChild(b); bs.push(b); }
    inner.appendChild(g);
    const lab = el('div', 'stxt', p.label || '', `color:${sub(p.bg)};margin-top:${px(44)}`); inner.appendChild(lab);
    return { root, update(lt) { bs.forEach((b, i) => { const q = pr(lt, 0.1 + i * 0.04, 0.25); set(b, q, 0, 0, 0.6 + 0.4 * q);
      const k = (p.total || 18) - i; const wt = p.wAt && p.wAt.t != null ? p.wAt.t : (p.wt || 1.6); const fl = p.waived && k <= p.waived ? clamp((lt - wt - (p.waived - k) * 0.3) / 0.35) : 0;
      b.classList.toggle('w', fl > 0.5); b.style.transform += ` rotateY(${fl < 1 && fl > 0 ? 180 * fl : 0}deg)`; if (fl > 0.5) b.textContent = 'WAIVED'; else b.textContent = String(i + 1); });
      set(lab, pr(lt, (p.wAt && p.wAt.t != null ? p.wAt.t : (p.wt || 1.6)) + 0.4)); } };
  };

  B.question = (p) => {
    const { root, inner } = box(p.bg);
    const q = el('div', null, '?', `position:absolute;right:${px(-60)};top:${px(-80)};font-family:var(--serif);font-weight:800;font-size:${px(1150)};line-height:1;color:var(--peri);opacity:.6`);
    root.insertBefore(q, inner);
    const h = el('div', 'anton', p.q, `font-size:${px(p.size || 170)};color:${fg(p.bg)}`); inner.appendChild(h);
    let s = null; if (p.sub) { s = el('div', 'serifh', p.sub, `font-size:${px(60)};color:${sub(p.bg)};margin-top:${px(30)}`); inner.appendChild(s); }
    return { root, update(lt) { q.style.transform = `scale(${0.7 + 0.3 * back((lt) / 0.6)})`; q.style.opacity = 0.6 * pr(lt, 0, 0.4); set(h, pr(lt, 0.2), (1 - pr(lt, 0.2)) * 40); if (s) set(s, pr(lt, 0.6)); } };
  };

  B.checks = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(p.headSize || 110)};color:${fg(p.bg)};margin-bottom:${px(40)}`));
    if (p.icon) inner.insertBefore(icon(p.icon, fg(p.bg), 180), inner.firstChild);
    const rs = p.items.map((t) => { const r = el('div', 'chk', `<b>✓</b><span>${t}</span>`, `font-size:${px(p.size || 52)}`); inner.appendChild(r); return r; });
    return { root, update(lt) { if (p.icon) set(inner.firstChild, pr(lt, 0.05)); rs.forEach((r, i) => { const t0 = (p.itemAt && p.itemAt[i] && p.itemAt[i].t != null) ? p.itemAt[i].t : 0.3 + i * 0.6; set(r, pr(lt, t0), 0, -(1 - pr(lt, t0)) * 80); }); } };
  };

  B.icon = (p) => {
    const { root, inner } = box(p.bg);
    const ic = icon(p.icon, p.iconColor ? COL[p.iconColor] : fg(p.bg), p.iconSize || 260); inner.appendChild(ic);
    const ls = p.lines.map((ln, i) => { const e = el('div', ln.serif ? 'serifh' : (i === 0 && !ln.small ? 'anton' : 'stxt'), ln.text, `font-size:${px(ln.size || (i === 0 ? 120 : 46))};color:${COL[ln.color] || (i === 0 ? fg(p.bg) : sub(p.bg))};margin-top:${px(i === 0 ? 50 : 22)}`); inner.appendChild(e); return e; });
    const paths = ic.querySelectorAll('path,circle,rect,ellipse');
    return { root, update(lt) { const d = clamp((lt) / 1.0); paths.forEach((pp) => { pp.style.strokeDasharray = 600; pp.style.strokeDashoffset = 600 * (1 - eo(d)); });
      ls.forEach((e, i) => { const t0 = (p.lines[i].t != null) ? p.lines[i].t : 0.5 + i * 0.4; set(e, pr(lt, t0), (1 - pr(lt, t0)) * 30); }); } };
  };

  B.fork = (p) => {
    const { root, inner } = box(p.bg);
    const W = S.w - 160, H = S.fmt === '9x16' ? 900 : 640;
    const svg = el('div', null, `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="overflow:visible"><path id="f0" d="M${W / 2} ${H} V${H * 0.55}" /><path id="f1" d="M${W / 2} ${H * 0.55} C${W / 2} ${H * 0.3} ${W * 0.2} ${H * 0.3} ${W * 0.2} ${H * 0.08}"/><path id="f2" d="M${W / 2} ${H * 0.55} C${W / 2} ${H * 0.3} ${W * 0.8} ${H * 0.3} ${W * 0.8} ${H * 0.08}"/></svg>`, `position:relative`);
    inner.appendChild(svg);
    const ps = svg.querySelectorAll('path');
    ps.forEach((pp, i) => { pp.setAttribute('fill', 'none'); pp.setAttribute('stroke', i === 0 ? fg(p.bg) : (i === 1 ? 'var(--peri)' : (p.bg === 'indigo' ? 'var(--cream)' : 'var(--indigo)'))); pp.setAttribute('stroke-width', 26 * K); pp.setAttribute('stroke-linecap', 'round'); });
    const la = el('div', 'anton', p.a, `position:absolute;left:0;top:${px(-20)};width:${px(420)};font-size:${px(70)};color:${fg(p.bg)};text-align:center;transform:translateX(${W * 0.2 - 210 * K}px)`);
    const lb = el('div', 'anton', p.b, `position:absolute;left:0;top:${px(-20)};width:${px(420)};font-size:${px(70)};color:${fg(p.bg)};text-align:center;transform:translateX(${W * 0.8 - 210 * K}px)`);
    svg.appendChild(la); svg.appendChild(lb);
    const h = p.head ? el('div', 'anton', p.head, `font-size:${px(110)};color:${fg(p.bg)};margin-bottom:${px(50)}`) : null; if (h) inner.insertBefore(h, svg);
    return { root, update(lt) { if (h) set(h, pr(lt, 0.05));
      const L = [H * 0.45, H * 0.7, H * 0.7]; ps.forEach((pp, i) => { const q = eo((lt - (i === 0 ? 0.2 : 0.8)) / 0.8); pp.style.strokeDasharray = L[i] * 1.6; pp.style.strokeDashoffset = L[i] * 1.6 * (1 - q); });
      const ta = p.aAt && p.aAt.t != null ? p.aAt.t : 1.5; la.style.opacity = pr(lt, ta); lb.style.opacity = pr(lt, ta + 0.4); } };
  };

  B.pulse = (p) => {
    const { root, inner } = box(p.bg);
    const W = S.w - 160, H = S.fmt === '9x16' ? 820 : 560;
    const area = el('div', null, null, `position:relative;width:${W}px;height:${H}px`);
    const pts = p.points; const nodes = pts.map((pt, i) => { const n = el('div', 'pnode' + (i === 0 ? ' main' : ''), `<i></i><span>${pt.label}</span>`, `left:${pt.x * W}px;top:${pt.y * H}px`); area.appendChild(n); return n; });
    const h = el('div', 'anton', p.head, `font-size:${px(p.size || 170)};color:${fg(p.bg)};margin-bottom:${px(40)}`);
    inner.appendChild(h); inner.appendChild(area);
    return { root, update(lt) { set(h, pr(lt, 0.05)); nodes.forEach((n, i) => { const q = pr(lt, i === 0 ? 0.2 : 0.9 + i * 0.22, 0.3); n.style.opacity = q; const ring = n.querySelector('i'); if (i === 0) ring.style.boxShadow = `0 0 0 ${Math.round((lt * 40) % 60 * K)}px rgba(169,193,243,${0.6 - ((lt * 40) % 60) / 100})`; }); } };
  };

  B.planner = (p) => {
    const { root, inner } = box(p.bg);
    if (p.head) inner.appendChild(el('div', 'anton', p.head, `font-size:${px(p.headSize || 110)};color:${fg(p.bg)};margin-bottom:${px(40)}`));
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU'];
    const g = el('div', 'plan'); const cells = [];
    days.forEach((d, i) => { const c = el('div', null, `<small>${p.labels ? (p.labels[i] || '&nbsp;') : d}</small><b>${i === (p.hi != null ? p.hi : -1) ? (p.hiLabel || 'MAED') : 'TEACH'}</b>`); g.appendChild(c); cells.push(c); });
    inner.appendChild(g);
    const s = p.sub ? el('div', 'stxt', p.sub, `color:${sub(p.bg)};margin-top:${px(40)}`) : null; if (s) inner.appendChild(s);
    return { root, update(lt) { cells.forEach((c, i) => { const q = pr(lt, 0.2 + i * 0.25, 0.3); set(c, q, (1 - q) * 40); const ht = p.htAt && p.htAt.t != null ? p.htAt.t : (p.ht || 1.6); c.classList.toggle('hi', i === p.hi && lt > ht); }); if (s) set(s, pr(lt, (p.htAt && p.htAt.t != null ? p.htAt.t : (p.ht || 1.6)) + 0.3)); } };
  };

  B.bignum = (p) => {
    const { root, inner } = box(p.bg);
    const h = el('div', 'anton', p.head, `font-size:${px(p.headSize || 150)};color:${fg(p.bg)}`);
    const blk = el('div', 'resb', `<div class="anton" style="font-size:${px(typeof p.num === 'number' ? 420 : 300)};line-height:.9">${p.num}</div><div style="font-family:var(--sans);font-weight:800;letter-spacing:.14em;font-size:${px(44)};margin-top:${px(10)}">${p.label || ''}</div>`, `align-self:flex-start;margin-top:${px(50)};padding:${px(40)} ${px(70)} ${px(30)};text-align:center;transform-origin:0 50%`);
    inner.appendChild(h); inner.appendChild(blk);
    const numEl = blk.firstChild;
    return { root, update(lt, dur) { set(h, pr(lt, 0.05), (1 - pr(lt, 0.05)) * 40); const q = clamp((lt - 0.35) / 0.45); blk.style.opacity = q > 0 ? 1 : 0; blk.style.transform = `scale(${0.6 + 0.4 * back(q)})`;
      if (typeof p.from === 'number') { const c = clamp((lt - 0.9) / Math.max(1, dur - 1.6)); numEl.textContent = Math.round(p.from - (p.from - p.to) * c); } } };
  };

  B.end = (p) => {
    const root = el('div', 'scene', null, `background:${COL[p.bg || 'indigo']}`);
    const inner = el('div', 'sbox', null, 'justify-content:center');
    root.appendChild(inner);
    const ls = (p.lines || []).map((ln, i) => el('div', i === 0 ? (p.serif ? 'serifh' : 'anton') : 'stxt', ln, i === 0 ? `font-size:${px(p.size || 140)};color:var(--cream)` : `color:#fff;margin-top:${px(i === 1 ? 40 : 12)}`));
    ls.forEach((x) => inner.appendChild(x));
    const cta = p.cta ? el('div', 'endcta', p.cta, `font-size:${px(46)};margin-top:${px(50)}`) : null; if (cta) inner.appendChild(cta);
    const lk = el('div', 'lockup', `<img src="${S.logos.shield}" style="height:${px(130)}"><div class="sep" style="height:${px(90)}"></div><img src="${S.logos.smuDark}" style="height:${px(120)}"><div class="sep" style="height:${px(90)}"></div><img src="${S.logos.aca}" style="height:${px(140)}">`, `margin-top:${px(70)};align-self:flex-start;transform-origin:0 50%`);
    inner.appendChild(lk);
    return { root, update(lt) { ls.forEach((x, i) => set(x, pr(lt, 0.1 + i * 0.25), (1 - pr(lt, 0.1 + i * 0.25)) * 40)); if (cta) set(cta, pr(lt, 0.7), 0, 0, 0.8 + 0.2 * back((lt - 0.7) / 0.4)); set(lk, pr(lt, 0.9), (1 - pr(lt, 0.9)) * 30); } };
  };

  // ---------------- build
  const scenes = S.scenes.map((sc) => { const b = B[sc.type](sc); b.root.style.visibility = 'hidden'; stage.insertBefore(b.root, stage.querySelector('.shield')); return { ...sc, ...b }; });
  const cap = document.getElementById('cap');
  const capTxt = cap.querySelector('span');
  const TR = 0.42;
  window.seek = function (t) {
    let active = 0;
    scenes.forEach((sc, i) => {
      const next = scenes[i + 1];
      const vis = t >= sc.t0 && (!next || t < next.t0 + TR);
      sc.root.style.visibility = vis ? 'visible' : 'hidden';
      if (vis) {
        const lt = t - sc.t0;
        const w = i === 0 ? 1 : eio(lt / TR);
        sc.root.style.clipPath = w >= 1 ? 'none' : (sc.wipe === 'up' ? `inset(${(1 - w) * 100}% 0 0 0)` : `inset(0 ${(1 - w) * 100}% 0 0)`);
        sc.root.style.zIndex = i + 1;
        sc.update(lt, (next ? next.t0 : S.duration) - sc.t0);
        if (t >= sc.t0 + (i === 0 ? 0 : TR * 0.5)) active = i;
      }
    });
    // captions
    const c = S.captions.find((c) => t >= c.t0 && t < c.t1);
    if (c && !S.noCaptions) { cap.style.opacity = 1; if (capTxt.innerHTML !== c.html) capTxt.innerHTML = c.html; const dark = ['indigo', 'deep'].includes(scenes[active].bg || 'indigo'); cap.className = dark ? 'cap light' : 'cap'; }
    else cap.style.opacity = 0;
  };
  window.__ready = true;
})();

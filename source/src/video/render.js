// Node-side video renderer: VO (ElevenLabs) -> scene timing -> frames (Playwright) -> ffmpeg (H.264 + AAC, loudnorm).
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const L = require('../lib');
const { synth, VOICES } = require('../tts');
const SPECS = require('./specs');

const FPS = 30;
const VO_OFF = 0.3; // VO starts after a short breath
const END_HOLD = 4.0; // end card minimum on screen
const FMT = {
  '9x16': { w: 1080, h: 1920, k: 1, top: 250, bot: 520, capb: 380, cap: 46 },
  '4x5': { w: 1080, h: 1350, k: 0.8, top: 110, bot: 300, capb: 92, cap: 40 },
};
const MUSIC = path.join(L.ROOT, 'assets/music/bed.wav');

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
function findPhrase(words, phrase, from = 0) {
  const ph = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = from; i <= words.length - ph.length; i++) {
    let ok = true;
    for (let j = 0; j < ph.length; j++) if (norm(words[i + j].d || words[i + j].w) !== ph[j]) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}

function captions(words, maxLine = 30) {
  // chunk words into <=2 lines of <=maxLine chars; prefer breaking at punctuation
  const chunks = []; let cur = [];
  const len = (arr) => arr.map((w) => w.d).join(' ').length;
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const endP = /[.!?]$/.test(words[i].d);
    const commaP = /[,:;]$/.test(words[i].d);
    const L1 = len(cur);
    const nextLen = i + 1 < words.length ? L1 + 1 + words[i + 1].d.length : 999;
    if (endP && L1 > 8 || (commaP && L1 > 26) || nextLen > maxLine * 2 - 4) { chunks.push(cur); cur = []; }
  }
  if (cur.length) chunks.push(cur);
  return chunks.map((c, k) => {
    const txt = c.map((w) => w.d).join(' ');
    // split into 2 balanced lines if needed
    let html = L.esc(txt);
    if (txt.length > maxLine) {
      let best = 0, bd = 1e9, acc = 0;
      c.forEach((w, i) => { acc += w.d.length + 1; const d = Math.abs(acc - txt.length / 2); if (d < bd && i < c.length - 1) { bd = d; best = i; } });
      html = L.esc(c.slice(0, best + 1).map((w) => w.d).join(' ')) + '<br>' + L.esc(c.slice(best + 1).map((w) => w.d).join(' '));
    }
    const t0 = c[0].s + VO_OFF;
    const nxt = chunks[k + 1];
    const t1 = nxt ? Math.min(nxt[0].s + VO_OFF, c[c.length - 1].e + VO_OFF + 0.6) : c[c.length - 1].e + VO_OFF + 0.5;
    return { t0, t1, text: txt, html };
  });
}

function resolveTiming(spec, words, voDur) {
  const scenes = JSON.parse(JSON.stringify(spec.scenes));
  let cursor = 0;
  scenes.forEach((sc, i) => {
    if (i === 0) sc.t0 = 0;
    else if (sc.at) {
      const wi = findPhrase(words, sc.at, cursor);
      if (wi < 0) throw new Error(`${spec.id}: anchor not found "${sc.at}"`);
      cursor = wi; sc.t0 = Math.max(0, words[wi].s + VO_OFF - 0.18);
    } else sc.t0 = scenes[i - 1].t0 + 3;
    // nested anchors -> local times
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') {
        if (typeof o.at === 'string' && o !== sc) { const wi = findPhrase(words, o.at, Math.max(0, cursor - 2)); if (wi >= 0) o.t = Math.max(0.05, words[wi].s + VO_OFF - sc.t0 - 0.05); }
        Object.values(o).forEach(walk);
      }
    };
    Object.entries(sc).forEach(([k, v]) => { if (k !== 'at') walk(v); });
  });
  const lastWord = words[words.length - 1].e + VO_OFF;
  const end = scenes[scenes.length - 1];
  const duration = Math.max(lastWord + 0.6, end.t0 + END_HOLD);
  return { scenes, duration: Math.ceil(duration * FPS) / FPS };
}

function engineHtml(spec, fmtKey, scenes, caps, duration) {
  const F = FMT[fmtKey];
  const css = `
  .scene{position:absolute;inset:0;overflow:hidden}
  .sbox{position:absolute;left:80px;right:80px;top:${F.top}px;bottom:${F.bot}px;display:flex;flex-direction:column;justify-content:center}
  .stxt{font-family:var(--sans);font-weight:600;font-size:${Math.round(50 * F.k)}px;line-height:1.3}
  .serifh{font-family:var(--serif);font-weight:700;line-height:1.08}
  .tagl{font-family:var(--sans);font-weight:800;font-size:${Math.round(30 * F.k)}px;letter-spacing:.14em;text-transform:uppercase}
  .dotgrid{display:grid;grid-template-columns:repeat(5,${Math.round(96 * F.k)}px);gap:${Math.round(30 * F.k)}px;margin-top:${Math.round(50 * F.k)}px}
  .dotgrid i{display:block;width:${Math.round(96 * F.k)}px;height:${Math.round(96 * F.k)}px;border-radius:50%;border:${Math.round(8 * F.k)}px solid var(--indigo)}
  .vbar{background:var(--peri);color:var(--deep);border-radius:${Math.round(24 * F.k)}px;padding:${Math.round(24 * F.k)}px ${Math.round(40 * F.k)}px ${Math.round(14 * F.k)}px;margin-bottom:${Math.round(30 * F.k)}px;align-self:flex-start;line-height:1}
  .crow{display:flex;align-items:baseline;gap:${Math.round(34 * F.k)}px;line-height:1}
  .resb{background:var(--peri);color:var(--deep);border-radius:${Math.round(30 * F.k)}px;padding:${Math.round(26 * F.k)}px ${Math.round(40 * F.k)}px ${Math.round(14 * F.k)}px;line-height:1}
  .tagchip{background:var(--peri);color:var(--deep);font-family:var(--sans);font-weight:800;border-radius:999px;padding:${Math.round(16 * F.k)}px ${Math.round(34 * F.k)}px}
  .blk{display:grid;grid-template-columns:repeat(6,1fr);gap:${Math.round(18 * F.k)}px;perspective:800px}
  .blk div{aspect-ratio:1.25;border-radius:${Math.round(18 * F.k)}px;background:#fff;color:var(--indigo);display:flex;align-items:center;justify-content:center;font-family:var(--anton);font-size:${Math.round(56 * F.k)}px}
  .bg-dark .blk div{background:rgba(255,255,255,.14);color:#fff}
  .blk div.w{background:var(--peri);color:var(--deep);font-family:var(--sans);font-weight:800;font-size:${Math.round(20 * F.k)}px;letter-spacing:.06em}
  .chk{display:flex;gap:${Math.round(26 * F.k)}px;align-items:center;font-family:var(--sans);font-weight:700;margin:${Math.round(14 * F.k)}px 0;line-height:1.2}
  .chk b{flex:0 0 auto;width:1.5em;height:1.5em;border-radius:50%;background:var(--peri);color:var(--deep);display:flex;align-items:center;justify-content:center;font-size:.8em}
  .icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;overflow:visible}
  .pnode{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:${Math.round(12 * F.k)}px}
  .pnode i{display:block;width:${Math.round(30 * F.k)}px;height:${Math.round(30 * F.k)}px;border-radius:50%;background:var(--peri)}
  .pnode.main i{width:${Math.round(52 * F.k)}px;height:${Math.round(52 * F.k)}px;background:var(--cream)}
  .pnode span{font-family:var(--sans);font-weight:800;letter-spacing:.1em;font-size:${Math.round(30 * F.k)}px;color:#fff}
  .pnode.main span{font-size:${Math.round(40 * F.k)}px;color:var(--cream)}
  .plan{display:grid;grid-template-columns:repeat(5,1fr);gap:${Math.round(16 * F.k)}px}
  .plan div{border-radius:${Math.round(20 * F.k)}px;background:#fff;padding:${Math.round(24 * F.k)}px 0;text-align:center;color:var(--indigo)}
  .plan small{display:block;font-family:var(--sans);font-weight:800;font-size:${Math.round(26 * F.k)}px;letter-spacing:.1em;opacity:.7}
  .plan b{display:block;font-family:var(--anton);font-weight:400;font-size:${Math.round(44 * F.k)}px;margin-top:${Math.round(10 * F.k)}px}
  .plan div.hi{background:var(--peri);color:var(--deep)}
  .endcta{background:var(--peri);color:var(--deep);border-radius:999px;padding:${Math.round(18 * F.k)}px ${Math.round(40 * F.k)}px;align-self:flex-start;font-family:var(--sans);font-weight:800}
  .arch{border-radius:999px 999px ${Math.round(40 * F.k)}px ${Math.round(40 * F.k)}px}
  .lockup img{display:block}
  .cap{position:absolute;left:60px;right:60px;bottom:${F.capb}px;display:flex;justify-content:center;z-index:500;text-align:center}
  .cap span{display:inline;background:var(--indigo);color:#fff;font-family:var(--sans);font-weight:600;font-size:${F.cap}px;line-height:1.5;padding:${Math.round(F.cap * 0.18)}px ${Math.round(F.cap * 0.5)}px;border-radius:${Math.round(F.cap * 0.4)}px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
  .cap.light span{background:var(--cream);color:var(--indigo)}
  .shield{z-index:400;${fmtKey === '9x16' ? 'top:120px;' : ''}}
  `;
  const spec2 = { id: spec.id, fmt: fmtKey, w: F.w, h: F.h, k: F.k, duration, scenes, captions: caps, logos: { shield: L.LOGO.shield, smuDark: L.LOGO.smuDark, aca: L.LOGO.aca } };
  const engine = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');
  const body = `<div id="stage" style="position:absolute;inset:0">${L.shield()}<div id="cap" class="cap" style="opacity:0"><span></span></div></div>
  <script>window.SPEC=${JSON.stringify(spec2)};</script><script>${engine}</script>`;
  return L.page({ w: F.w, h: F.h, body, css });
}

async function renderFrames(html, F, duration, outMp4, opts = {}) {
  const b = await L.browser();
  const ctx = await b.newContext({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const f = await L.writeHtml(html);
  await pg.goto('file://' + f);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForFunction(() => window.__ready === true);
  // preload images
  await pg.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))));
  const cdp = await ctx.newCDPSession(pg);
  const n = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), outMp4]);
  let ffErr = ''; ff.stderr.on('data', (d) => (ffErr += d));
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg frames: ' + ffErr)))));
  for (let i = 0; i < n; i++) {
    await pg.evaluate((t) => window.seek(t), i / FPS);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, optimizeForSpeed: true });
    const buf = Buffer.from(data, 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  if (opts.coverAt != null && opts.coverOut) {
    await pg.evaluate((t) => { window.SPEC.noCaptions = true; window.seek(t); }, opts.coverAt);
    await pg.screenshot({ path: opts.coverOut, type: 'png' });
  }
  await ctx.close();
  fs.unlinkSync(f);
}

function mixAudio(vo, duration, out, voOut) {
  // VO normalised alone (deliverable) + mix with ducked music bed, loudnorm -16 LUFS / -1.5 dBTP
  const hasMusic = fs.existsSync(MUSIC);
  if (voOut) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', vo, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-b:a', '160k', voOut]);
  const args = ['-y', '-loglevel', 'error', '-i', vo];
  let filter;
  if (hasMusic) {
    args.push('-stream_loop', '-1', '-i', MUSIC);
    filter = `[0:a]adelay=${Math.round(VO_OFF * 1000)}|${Math.round(VO_OFF * 1000)},apad,atrim=0:${duration.toFixed(3)},asplit=2[vo][sc];` +
      `[1:a]lowpass=f=6500,atrim=0:${duration.toFixed(3)},volume=0.30,afade=t=in:d=0.5,afade=t=out:st=${(duration - 1.2).toFixed(3)}:d=1.2[mu];` +
      `[mu][sc]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[duck];` +
      `[vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]`;
  } else {
    filter = `[0:a]adelay=${Math.round(VO_OFF * 1000)}|${Math.round(VO_OFF * 1000)},apad,atrim=0:${duration.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]`;
  }
  args.push('-filter_complex', filter, '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', out);
  execFileSync('ffmpeg', args);
}

const srtTime = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, r = ms % 1000; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`; };

async function renderVideo(id, voice, { fmts = ['9x16', '4x5'], outDir } = {}) {
  const spec = SPECS[id];
  if (!spec) throw new Error('no spec ' + id);
  const vo = await synth(spec.vo, voice);
  const { scenes, duration } = resolveTiming(spec, vo.words, vo.duration);
  const caps = captions(vo.words);
  outDir = outDir || path.join(L.OUT, `assets/videos/${id}/${voice}`);
  fs.mkdirSync(outDir, { recursive: true });
  const tag = `${id}_${voice}`;
  const audio = path.join(outDir, `${tag}_mix.m4a`);
  mixAudio(vo.mp3, duration, audio, path.join(outDir, `${tag}_vo.mp3`));
  fs.writeFileSync(path.join(outDir, `${tag}.srt`), caps.map((c, i) => `${i + 1}\n${srtTime(c.t0)} --> ${srtTime(c.t1)}\n${c.text}\n`).join('\n'));
  const res = { id, voice, duration, chars: vo.chars, cached: vo.cached, files: [] };
  for (const fk of fmts) {
    const F = FMT[fk];
    const html = engineHtml(spec, fk, scenes, caps, duration);
    const silent = path.join(outDir, `${tag}_${fk}_silent.mp4`);
    const coverIdx = spec.cover != null ? spec.cover : 1;
    const csc = scenes[Math.min(coverIdx, scenes.length - 1)];
    const nxt = scenes[Math.min(coverIdx, scenes.length - 1) + 1];
    const coverAt = nxt ? nxt.t0 - 0.05 : duration - 0.1;
    await renderFrames(html, F, duration, silent, fk === '9x16' ? { coverAt, coverOut: path.join(outDir, `${tag}_cover.png`) } : {});
    const out = path.join(outDir, `${tag}_${fk}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', out]);
    fs.unlinkSync(silent);
    res.files.push(out);
  }
  fs.unlinkSync(audio);
  return res;
}

module.exports = { renderVideo, FMT, captions, resolveTiming };

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const fmts = (process.env.FMTS || '9x16,4x5').split(',');
    const [ids, voices] = [args[0].split(','), (args[1] || 'eric').split(',')];
    for (const id of ids) for (const v of voices) {
      const t = Date.now();
      try {
        const r = await renderVideo(id, v, { fmts });
        console.log(JSON.stringify({ ...r, files: r.files.map((f) => path.basename(f)), sec: Math.round((Date.now() - t) / 1000) }));
      } catch (e) { console.log(JSON.stringify({ id, voice: v, error: String(e.message || e).slice(0, 300) })); }
    }
    await L.closeBrowser();
  })().catch((e) => { console.error(e); process.exit(1); });
}

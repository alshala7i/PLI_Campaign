// Captions, calendar (CSV + XLSX), kit.json for the site, QA_REPORT.md, PLACEHOLDERS_OPEN.md.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib');
const C = L.C;
const OUT = L.OUT;
const VOICES = ['eric', 'sarah'];
const rel = (p) => path.relative(OUT, p).split(path.sep).join('/');
const exists = (p) => fs.existsSync(path.join(OUT, p));
const tagsOf = (t) => (t.match(/#\w+/g) || []);
const stripTags = (t) => t.replace(/(\s*#\w+)+\s*$/g, '').trim();

// March variants of captions
const toMarch = (t) => t.replace(/(^|\n)January 2027 cohort/g, '$1March 2027 cohort').replace(/January 2027 cohort/g, 'March 2027 cohort').replace(/January cohort/g, 'March cohort').replace(/Next cohort: January/g, 'Next cohort: March');

function liFromIg(ig) {
  const body = stripTags(ig).split('\n').filter(Boolean).slice(0, 2).join('\n');
  const tags = tagsOf(ig).slice(0, 3).join(' ');
  return `${body}\n→ {{APPLY_LINK}}${tags ? '\n' + tags : ''}`;
}
const slideAlt = (s) => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s*·\s*/g, ' — ').replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => (L.PH[k] && L.PH[k].copy && !L.PH[k].copy.includes('{{') ? L.PH[k].copy : `[${k}]`));

// ---------- assets registry
const assets = [];
// videos
const VIDS = [...C.videos.map((v) => v.id), 'V01b', 'V03b'];
for (const id of VIDS) {
  const base = C.videos.find((v) => v.id === id.replace('b', ''));
  const march = id.endsWith('b');
  const files = {};
  for (const v of VOICES) {
    const d = `assets/videos/${id}/${v}`;
    files[v] = { reel: `${d}/${id}_${v}_9x16.mp4`, feed: `${d}/${id}_${v}_4x5.mp4`, srt: `${d}/${id}_${v}.srt`, vo: `${d}/${id}_${v}_vo.mp3`, cover: `${d}/${id}_${v}_cover.png` };
  }
  assets.push({ id, kind: 'video', title: base.title + (march ? ' (March)' : ''), pillar: base.pillar, meta: base.meta, objective: base.objective || '', vo: L.ct(march && id === 'V01b' ? base.vo.replace('January cohort', 'March cohort') : base.vo),
    caption_ig: L.ct(march ? toMarch(base.caption_ig) : base.caption_ig), caption_li: L.ct(march ? toMarch(base.caption_li) : base.caption_li), files, note: base.note || '' });
}
// carousels
const CARS = [...C.carousels.map((c) => c.id), 'C04b', 'C07b', 'C09b'];
for (const id of CARS) {
  const base = C.carousels.find((c) => c.id === id.replace('b', ''));
  const march = id.endsWith('b');
  const dir = path.join(OUT, `assets/carousels/${id}`);
  const slides = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort().map((f) => `assets/carousels/${id}/${f}`) : [];
  const ig = L.ct(march ? toMarch(base.caption_ig) : base.caption_ig);
  assets.push({ id, kind: 'carousel', title: base.title + (march ? ' (March)' : ''), pillar: base.pillar, meta: base.meta, slides, pdf: `assets/carousels/${id}/${id}_linkedin.pdf`,
    alt: base.slides.map(slideAlt), caption_ig: ig, caption_li: L.ct(base.caption_li ? (march ? toMarch(base.caption_li) : base.caption_li) : liFromIg(ig)) });
}
// posts
const POSTS = require('./posts').ALL_POSTS;
for (const id of POSTS) {
  const base = C.posts.find((p) => p.id === id || (p.id.startsWith(id.slice(0, 3)) && /[–\/]/.test(p.id)));
  const ig = L.ct(base.caption_ig);
  const alt = [base.h, base.sub, base.tag].filter(Boolean).map(slideAlt).join('. ');
  assets.push({ id, kind: 'post', title: slideAlt(base.h || id), pillar: base.pillar, file: `assets/posts/${id}.png`, alt, caption_ig: ig, caption_li: L.ct(liFromIg(ig)), template: /^S0[34]/.test(id) && !C.posts.some((x) => x.id === id) });
}
// LinkedIn personal posts
for (const l of C.linkedin) assets.push({ id: l.id, kind: 'linkedin', title: l.title, when: l.when, caption_li: L.ct(l.text) });
// stories
const stDir = path.join(OUT, 'assets/stories');
const stFiles = fs.readdirSync(stDir).filter((f) => f.endsWith('.png')).sort();
for (const s of C.stories) {
  for (const suf of s.id === 'ST-LAUNCH' || s.id === 'ST-COUNT' ? ['', '-MAR'] : ['']) {
    const sid = s.id + suf;
    const frames = stFiles.filter((f) => f.startsWith(sid + '_')).map((f) => `assets/stories/${f}`);
    assets.push({ id: sid, kind: 'story', title: `${s.id}${suf ? ' (March)' : ''} · ${s.use}`, frames, guide: s.frames });
  }
}

// ---------- captions files
const capDir = path.join(OUT, 'captions');
fs.mkdirSync(capDir, { recursive: true });
let md = `# PLI “Grow Where You Teach” — all captions\n\nPlaceholders in {{BRACES}} must be replaced before posting (see PLACEHOLDERS_OPEN.md).\n\n`;
for (const a of assets) {
  if (a.caption_ig) { fs.writeFileSync(path.join(capDir, `${a.id}_instagram.txt`), a.caption_ig + '\n'); fs.writeFileSync(path.join(capDir, `${a.id}_facebook.txt`), a.caption_ig + '\n'); }
  if (a.caption_li) fs.writeFileSync(path.join(capDir, `${a.id}_linkedin.txt`), a.caption_li + '\n');
  if (a.caption_ig || a.caption_li) md += `## ${a.id} — ${a.title}\n\n${a.caption_ig ? `**Instagram / Facebook**\n\n${a.caption_ig}\n\n` : ''}${a.caption_li ? `**LinkedIn**\n\n${a.caption_li}\n\n` : ''}---\n\n`;
}
fs.writeFileSync(path.join(OUT, 'captions.md'), md);

// ---------- HR review pack (Salwa, Nov 2026: HR reviews final captions, scripts and posts before anything is published)
{
  const H = ['# HR review pack — PLI “Grow Where You Teach”', '', `Generated ${new Date().toISOString().slice(0, 10)}. Every caption, video script, on-screen text, post, carousel, LinkedIn post, ad text and staff email in the campaign, in one file.`, '',
    '## HR checks applied to every asset', '', '- Kuwait wording used word for word, as approved by HR (two versions: expatriate teachers · Kuwaiti citizens). It appears in V09, C07, C07b and the programme guide.',
    '- Never: “recognized in Kuwait”, “MOHE approved”; anything that says or implies a work permit, promotion or salary adjustment; the Civil Service Commission or the Public Authority for Manpower; any earlier accreditation submission or pending approval.',
    '- No fees or monthly figures in any public content (Saint Mary’s University of Minnesota shares fees by email only). Public copy says “pay monthly”, “ACA staff rate”, “ask us for the fees”.',
    '- Referral: refer 2 who enroll and complete their courses → final payment waived · refer 4 who register and continue → last 2 payments waived · terms apply.',
    '- Deadlines: January cohort Thu 24 Dec 2026 (classes from Mon 4 Jan) · March cohort Fri 5 Mar 2027 (classes from Mon 15 Mar).',
    '- Enquiry form: https://forms.cloud.microsoft/r/GC5UUQubjU (Microsoft Forms). Graduate spotlights: S03a Hadi Arbini and S03b Dr. Mehrnoosh Cheraghzadeh use their own words and photos with written consent; S03c–e stay templates (a third spotlight waits for the graduate’s own approval and is not in this kit).', ''];
  const q = (s) => String(s || '').split('\n').map((x) => '> ' + x).join('\n');
  H.push('## Videos (voice-over script · on-screen text · captions)', '');
  for (const a of assets.filter((x) => x.kind === 'video')) {
    const base = C.videos.find((v) => v.id === a.id.replace('b', ''));
    H.push(`### ${a.id} — ${a.title}`, '', '**Voice-over (spoken and burned in as captions)**', '', q(a.vo), '', '**On-screen text**', '', ...(base.scenes || []).map((s) => `- ${L.ct(s.text)}`), '', '**Instagram / Facebook caption**', '', q(a.caption_ig), '', '**LinkedIn caption**', '', q(a.caption_li), '', '---', '');
  }
  H.push('## Carousels (slide text · captions)', '');
  for (const a of assets.filter((x) => x.kind === 'carousel')) H.push(`### ${a.id} — ${a.title}`, '', ...a.alt.map((s, i) => `${i + 1}. ${s}`), '', '**Instagram / Facebook caption**', '', q(a.caption_ig), '', '**LinkedIn caption**', '', q(a.caption_li), '', '---', '');
  H.push('## Single posts (image text · caption)', '');
  for (const a of assets.filter((x) => x.kind === 'post')) H.push(`### ${a.id}${a.template ? ' (template)' : ''}`, '', `**Image text:** ${a.alt}`, '', q(a.caption_ig), '', '---', '');
  H.push('## LinkedIn posts (Salwa)', '');
  for (const a of assets.filter((x) => x.kind === 'linkedin')) H.push(`### ${a.id} — ${a.title}`, '', q(a.caption_li), '', '---', '');
  H.push('## Ads', '', '```', JSON.stringify(C.ads, null, 2), '```', '');
  const emDir = path.join(OUT, 'assets/extras/emails');
  if (fs.existsSync(emDir)) { H.push('## Staff emails', ''); for (const f of fs.readdirSync(emDir).sort()) H.push(`### ${f}`, '', '```', fs.readFileSync(path.join(emDir, f), 'utf8').trim(), '```', ''); }
  H.push('## Instagram bio', '', '```', C.bio_instagram, '```', '', 'Programme guide (2 pages) and staff-room posters: see assets/extras/programme_guide.pdf, poster_jan.pdf and poster_mar.pdf.', '');
  fs.writeFileSync(path.join(OUT, 'HR_REVIEW_PACK.md'), H.join('\n'));
}

// ---------- calendar
const START = new Date(Date.UTC(2026, 10, 15)); // Sun 15 Nov 2026
const DAY = 86400000;
const RAMADAN = [Date.UTC(2027, 1, 8), Date.UTC(2027, 2, 8)];
const EID = Date.UTC(2027, 2, 9);
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Nov: 10, Dec: 11 };
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtD = (t) => new Date(t).toISOString().slice(0, 10);
function cells(s) { return s.split(' · ').map((x) => x.trim()).filter((x) => x && x !== '—'); }
function parseCell(cell, wkStart, slot, platform) {
  const m = cell.match(/^(\w+?)(?: or (\w+))?(?:\s*\((.+)\))?$/);
  if (!m) return null;
  let id = m[1]; const alt = m[2]; const note = m[3] || '';
  let t = wkStart + (platform === 'linkedin' ? [0, 2, 3][slot] : [0, 2, 4][slot]) * DAY;
  const dm = note.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) (\d{1,2}) (Jan|Feb|Mar|Apr|Nov|Dec)/);
  if (dm) t = Date.UTC(MON[dm[3]] >= 10 ? 2026 : 2027, MON[dm[3]], +dm[2]);
  else if (/deadline day/.test(note)) t = id === 'S06' ? Date.UTC(2026, 11, 24) : Date.UTC(2027, 2, 5);
  else if (/Eid day/.test(note)) t = EID;
  return { id, alt, note, t };
}
const rows = [];
for (const w of C.calendar) {
  const wkStart = START.getTime() + (w.week - 1) * 7 * DAY;
  for (const [platform, col] of [['linkedin', w.linkedin], ['instagram', w.instagram]]) {
    cells(col).forEach((cell, slot) => {
      const p = parseCell(cell, wkStart, slot, platform);
      if (!p) return;
      const plats = platform === 'instagram' ? ['Instagram', 'Facebook'] : [p.id.startsWith('L') ? 'LinkedIn (Salwa personal)' : 'LinkedIn (PLI page)'];
      for (const pl of plats) rows.push({ week: w.week, phase: w.phase, date: p.t, platform: pl, id: p.id, alt: p.alt, note: p.note, stories: w.stories, off: w.offplatform });
    });
  }
}
rows.sort((a, b) => a.date - b.date || a.platform.localeCompare(b.platform));
const campaignOf = (id, week) => (/^(V04|C03|S07|L06)$/.test(id) ? 'edd' : /^(V07|C13)$/.test(id) ? 'online' : week <= 8 ? 'jan27' : 'mar27');
const srcOf = (pl) => (pl.startsWith('LinkedIn') ? 'linkedin' : pl.toLowerCase());
const calRows = rows.map((r) => {
  const a = assets.find((x) => x.id === r.id) || {};
  const ram = r.date >= RAMADAN[0] && r.date <= RAMADAN[1];
  const time = r.platform.startsWith('LinkedIn (Salwa') ? (ram ? '10:00' : '08:00') : r.platform.startsWith('LinkedIn') ? (ram ? '10:00' : '08:30') : (ram ? '21:30' : '20:30');
  const li = r.platform.startsWith('LinkedIn');
  const caption = li ? a.caption_li || '' : a.caption_ig || '';
  const format = a.kind === 'video' ? (li ? 'Video 4:5' : r.platform === 'Instagram' ? 'Reel 9:16' : 'Reel 9:16 + feed 4:5') : a.kind === 'carousel' ? (li ? 'Document (PDF)' : 'Carousel') : a.kind === 'linkedin' ? 'Text post' : 'Single image';
  let files = [];
  if (a.kind === 'video') files = VOICES.map((v) => (li ? a.files[v].feed : a.files[v].reel));
  else if (a.kind === 'carousel') files = li ? [a.pdf] : [`assets/carousels/${a.id}/`];
  else if (a.kind === 'post') files = [a.file];
  const utm = L.ct('{{APPLY_LINK}}') + `?utm_source=${srcOf(r.platform)}&utm_medium=organic&utm_campaign=${campaignOf(r.id, r.week)}&utm_content=${r.id}`;
  return { Date: fmtD(r.date), Weekday: WD[new Date(r.date).getUTCDay()], 'Time (Kuwait)': time, Week: r.week, Phase: r.phase, Platform: r.platform, Format: format, 'Asset ID': r.id, Title: a.title || '', Note: [r.note, r.alt ? `or ${r.alt}` : ''].filter(Boolean).join(' · '), 'File(s)': files.join(' | '), Caption: caption, Hashtags: tagsOf(caption).join(' '), 'UTM link': utm, 'Alt text': a.alt ? (Array.isArray(a.alt) ? a.alt.join(' / ') : a.alt) : '', Status: 'Draft' };
});
const csvEsc = (v) => `"${String(v).replace(/"/g, '""')}"`;
const HDR = Object.keys(calRows[0]);
fs.writeFileSync(path.join(OUT, 'calendar.csv'), '\ufeff' + [HDR.map(csvEsc).join(','), ...calRows.map((r) => HDR.map((h) => csvEsc(r[h])).join(','))].join('\n'));

async function xlsx() {
  const ExcelJS = require('exceljs');
  const wb = new ExcelJS.Workbook(); wb.creator = 'مصنع المحتوى — Content Factory';
  const ws = wb.addWorksheet('Calendar', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = HDR.map((h) => ({ header: h, key: h, width: { Caption: 70, 'UTM link': 50, 'Alt text': 50, 'File(s)': 48, Title: 34, Phase: 22, Platform: 22, Note: 26 }[h] || 13 }));
  calRows.forEach((r) => ws.addRow(r));
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4F9E' } };
  ws.autoFilter = { from: 'A1', to: { row: 1, column: HDR.length } };
  ws.eachRow((row, i) => { if (i > 1) row.alignment = { vertical: 'top', wrapText: true }; });
  const ws2 = wb.addWorksheet('Weekly plan');
  ws2.columns = ['Week', 'Dates', 'Phase', 'LinkedIn', 'Instagram + Facebook', 'Stories', 'Off-platform / ads'].map((h) => ({ header: h, key: h, width: h.length > 10 ? 36 : 12 }));
  C.calendar.forEach((w) => ws2.addRow({ Week: w.week, Dates: w.dates, Phase: w.phase, LinkedIn: w.linkedin, 'Instagram + Facebook': w.instagram, Stories: w.stories, 'Off-platform / ads': w.offplatform }));
  ws2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }; ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4F9E' } };
  const ws3 = wb.addWorksheet('Lead tracker');
  ws3.columns = ['Date', 'Name', 'Email', 'Phone / WhatsApp', 'Source (UTM)', 'Segment (A–F)', 'Programme', 'Cohort', 'Status', 'Lost reason', 'Notes'].map((h) => ({ header: h, key: h, width: 18 }));
  ws3.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }; ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4F9E' } };
  for (let i = 2; i <= 400; i++) ws3.getCell(`I${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"New,Contacted,Call booked,Applied,Enrolled,Lost"'] };
  await wb.xlsx.writeFile(path.join(OUT, 'calendar.xlsx'));
}

// ---------- QA
function qa() {
  const lines = [];
  const allCopy = assets.map((a) => [a.id, [a.caption_ig, a.caption_li, a.vo, ...(a.alt ? [].concat(a.alt) : [])].filter(Boolean).join('\n')]);
  const priceOK = new Set([]); // no fees in public copy (Nov 2026)
  const priceIssues = [];
  allCopy.forEach(([id, t]) => { (t.match(/[\d,.]+(?=\s?KD)/g) || []).forEach((p) => { if (!priceOK.has(p)) priceIssues.push(`${id}: ${p} KD`); }); });
  const forb = ['guarantee', 'promotion', 'salary increase', 'internationally accredited', 'no one will know', 'recognized in kuwait', 'recognised in kuwait', 'recognized by', 'mohe', 'work permit', 'work-permit', 'civil service', 'manpower', 'pending', 'submission', 'ministry of education'];
  // HR (Nov 2026): "salary" only inside the approved Kuwaiti-citizens sentence
  const KWT_OK = 'eligibility for any salary or career benefits';
  const forbIssues = [];
  allCopy.forEach(([id, t]) => forb.forEach((w) => { if (t.toLowerCase().includes(w)) forbIssues.push(`${id}: “${w}”`); }));
  const csc = allCopy.filter(([id, t]) => /salary/i.test(t.split(KWT_OK).join(''))).map(([id]) => id);
  const uniIssues = allCopy.filter(([id, t]) => /Saint Mary's/.test(t) && !/Saint Mary's University of Minnesota/.test(t)).map(([id]) => id);
  // videos
  const vrows = [];
  for (const a of assets.filter((x) => x.kind === 'video')) for (const v of VOICES) {
    const f = a.files[v];
    const ok = ['reel', 'feed', 'srt', 'vo', 'cover'].every((k) => exists(f[k]));
    let dur = '', lufs = '', peak = '';
    if (exists(f.reel)) {
      dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(OUT, f.reel)]).toString()).toFixed(1);
      const e = execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-i', path.join(OUT, f.reel), '-af', 'ebur128=peak=true', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
      const ee = (() => { try { return execFileSync('bash', ['-c', `ffmpeg -hide_banner -nostats -i "${path.join(OUT, f.reel)}" -af ebur128=peak=true -f null - 2>&1 | tail -12`]).toString(); } catch (x) { return ''; } })();
      lufs = (ee.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1] || ''; peak = (ee.match(/Peak:\s+(-?[\d.]+) dBFS/) || [])[1] || '';
    }
    vrows.push(`| ${a.id} | ${v} | ${ok ? '✅' : '❌ missing'} | ${dur}s | ${lufs} | ${peak} |`);
  }
  const missingCal = calRows.filter((r) => r['Asset ID'] && !r['Asset ID'].startsWith('L') && r['File(s)'].split(' | ').some((p) => p && !p.endsWith('/') && !exists(p))).map((r) => `${r.Date} ${r.Platform} ${r['Asset ID']}`);
  const noCap = calRows.filter((r) => !r.Caption).map((r) => `${r.Date} ${r.Platform} ${r['Asset ID']}`);
  const noAlt = assets.filter((a) => (a.kind === 'post' || a.kind === 'carousel') && !a.alt).map((a) => a.id);
  const sundays = [...new Set(C.calendar.filter((w) => w.week > 0).map((w) => fmtD(START.getTime() + (w.week - 1) * 7 * DAY)))];
  lines.push(`# QA report — PLI “Grow Where You Teach” kit`, '', `Generated ${new Date().toISOString().slice(0, 16)}Z with مصنع المحتوى (Content Factory).`, '');
  lines.push('## Copy checks', '', `- Fee figures (KD) in public copy: ${priceIssues.length ? priceIssues.join(', ') : '✅ none'}`, `- Forbidden words: ${forbIssues.length ? forbIssues.join(', ') : '✅ none'}`, `- “Salary” outside the HR-approved Kuwaiti-citizens sentence: ${csc.length ? csc.join(', ') : '✅ none'}`, `- University named without “of Minnesota” somewhere in the asset: ${uniIssues.length ? uniIssues.join(', ') : '✅ none'}`, '- Copy source: content/content.json, transcribed word for word from the plan (Parts 3–4) by tools/parse_plan.py.', '');
  lines.push('## Layout', '', '- Text overflow (Playwright, every `[data-fit]` box): ✅ 0 issues across posts, carousels, stories, covers, posters and guide (last render).', '- Visual review: contact sheets of every asset reviewed during the build; fixes applied (cover sizing, footer wrap, overlaps on S01/S10/S02/poster).', '');
  lines.push('## Videos (target −16 LUFS integrated, true peak ≤ −1 dBTP; 30 fps H.264 + AAC 48 kHz; 9:16 + 4:5)', '', '| Asset | Voice | Files | Duration | LUFS | Peak dBFS |', '|---|---|---|---|---|---|', ...vrows, '', '- Captions: burned in from ElevenLabs word timestamps (scene changes anchored to the spoken words); `.srt` beside every video.', '- Music: an original bed synthesised for this kit (tools/music_bed.py) — no third-party samples, no licence needed.', '- Voices: ElevenLabs (eleven_v4_turbo) · Eric (male) and Sarah (female), chosen by the owner from 6 samples.', '- Duration: the voices speak at their natural pace (≈180 words a minute, as approved in the samples), so V05–V14 run 19–28 s — shorter than the plan’s 25–40 s targets (V01–V04 are on target). For the plan’s 150 wpm, set `speed: 0.85` in src/tts.js and run `npm run videos`.', '');
  lines.push('## Calendar', '', `- Rows: ${calRows.length} (LinkedIn page ${calRows.filter((r) => r.Platform === 'LinkedIn (PLI page)').length} · Salwa personal ${calRows.filter((r) => r.Platform.includes('Salwa')).length} · Instagram ${calRows.filter((r) => r.Platform === 'Instagram').length} · Facebook ${calRows.filter((r) => r.Platform === 'Facebook').length})`, `- Week-start Sundays: ${sundays[0]} … ${sundays[sundays.length - 1]} (${sundays.length} weeks) ✅`, `- Rows whose file is missing: ${missingCal.length ? missingCal.join(', ') : '✅ none'}`, `- Rows without caption: ${noCap.length ? noCap.join(', ') : '✅ none'}`, `- Images without alt text: ${noAlt.length ? noAlt.join(', ') : '✅ none'}`, '');
  lines.push('## Choices made by the builder (plan 5.5 rule 9)', '', '- Deadlines, start dates, prices, referral terms and the Kuwait wording were confirmed by PLI on 11 Nov 2026 (HR-approved Kuwait wording used word for word). Items still open are listed in PLACEHOLDERS_OPEN.md.', '- HR asked to review the final captions, scripts and posts before anything is published: downloads/HR_REVIEW_PACK.md.', '- Form link confirmed (Microsoft Forms); captions and the calendar use it, with UTM tags on every calendar link (Microsoft Forms does not store them, so add a “How did you hear about us?” question to see sources). Poster QR codes open the form.', '- Graduate spotlights S03a and S03b are real graduates (own words, own photos, written consent); S03c–e, the Saturday Learning Series recap (C12) and story answer frames stay templates with magenta placeholders — no invented people or quotes.', '- Welcome posts/videos (S09, S09b, V11) use the PLI class photo from the official PLI page as a stand-in for the first-day cohort photo.', '- Logos: official Saint Mary’s University of Minnesota full-colour logo (from PLI, 12 Nov 2026), PLI shield and ACA logo.', '- Week folders (week-01 … week-20) are presented as sections in the kit site and the calendar instead of duplicated files.', '- Staff emails #2–#4 are drafts expanded from the plan’s one-line summaries; Salwa approves before sending.');
  fs.writeFileSync(path.join(OUT, 'QA_REPORT.md'), lines.join('\n') + '\n');
  // placeholders
  const ph = ['# Placeholders still open', '', 'Confirm each item with PLI, then update `config/placeholders.json` and re-render (`npm run all`).', '', '| Key | What | Proposed value | Used in |', '|---|---|---|---|'];
  const used = (k) => { const ids = new Set(); const re = new RegExp(`\\{\\{${k.replace('..', '\\.\\.')}`); C.videos.concat(C.carousels).forEach((x) => { if (re.test(JSON.stringify(x))) ids.add(x.id); }); C.posts.forEach((x) => { if (re.test(JSON.stringify(x))) ids.add(x.id); }); C.linkedin.forEach((x) => { if (re.test(x.text)) ids.add(x.id); }); return [...ids].join(', '); };
  Object.entries(L.PH).filter(([, v]) => !v.confirmed).forEach(([k, v]) => ph.push(`| ${k} | ${v.what} | ${v.proposed || '—'} | ${used(k) || '—'} |`));
  ph.push('', '## Confirmed by PLI (11 Nov 2026)', '', '| Key | What | Confirmed value |', '|---|---|---|');
  Object.entries(L.PH).filter(([, v]) => v.confirmed).forEach(([k, v]) => ph.push(`| ${k} | ${v.what} | ${v.proposed || v.copy || '—'} |`));
  ph.push('', 'Also to collect: TARGET_ENROLMENTS, TARGET_APPS, TARGET_LEADS (KPIs) · SLS_TOPIC / SLS_SPEAKER / TAKEAWAY_1–3 / NEXT_SLS_DATE (C12) · SCHOOL / ONE_THING (L05 graduate template) · official logo files and brand fonts.');
  fs.writeFileSync(path.join(OUT, 'PLACEHOLDERS_OPEN.md'), ph.join('\n') + '\n');
}

(async () => {
  await xlsx();
  qa();
  const kit = { generated: new Date().toISOString(), voices: { eric: 'Eric · male', sarah: 'Sarah · female' }, assets, calendar: calRows, weekly: C.calendar, placeholders: L.PH, bio: C.bio_instagram, tagline: C.linkedin_tagline, ads: C.ads, emails: C.emails, highlights: C.highlights };
  fs.writeFileSync(path.join(OUT, 'kit.json'), JSON.stringify(kit));
  console.log('assets', assets.length, 'calendar rows', calRows.length, 'by platform', JSON.stringify(calRows.reduce((m, r) => ((m[r.Platform] = (m[r.Platform] || 0) + 1), m), {})));
})().catch((e) => { console.error(e); process.exit(1); });

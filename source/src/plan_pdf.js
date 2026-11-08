// Strategy PDF (A4, English) — "Prepared with مصنع المحتوى · Content Factory".
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const { esc } = L;
const KIT_URL = process.env.KIT_URL || '';
const img = (p) => (fs.existsSync(path.join(L.ROOT, p)) ? L.furl(p) : '');
const IMG = {
  m3icon: L.furl('assets/logos/masna3-icon.png'),
  m3logo: L.furl('assets/logos/home-logo.png'),
  c01: img('out/assets/carousels/C01/C01_01.png'),
  c04: img('out/assets/carousels/C04/C04_02.png'),
  s02: img('out/assets/posts/S02.png'),
  s01: img('out/assets/posts/S01.png'),
  v01: img('out/assets/videos/V01/eric/V01_eric_cover.png'),
};

const CSS = `
@page{size:A4;margin:0}
html,body{width:210mm;height:auto;overflow:visible;background:#fff}
body{font-family:var(--sans);color:var(--ink);font-size:10.4pt;line-height:1.5}
.pg{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;padding:20mm 18mm 22mm;background:#fff}
.pg.cream{background:var(--cream)}
.pg.indigo{background:var(--indigo);color:#fff}
h1{font-family:var(--serif);font-weight:700;font-size:30pt;line-height:1.08;color:var(--indigo);margin-bottom:5mm}
h2{font-family:var(--serif);font-weight:700;font-size:21pt;line-height:1.12;color:var(--indigo);margin:0 0 4mm}
h3{font-family:var(--sans);font-weight:800;font-size:11pt;letter-spacing:.06em;text-transform:uppercase;color:var(--deep);margin:5mm 0 2mm}
.kick{font-family:var(--sans);font-weight:800;font-size:8.6pt;letter-spacing:.16em;text-transform:uppercase;color:var(--indigo);margin-bottom:3mm;display:flex;align-items:center;gap:3mm}
.kick i{display:inline-block;width:9mm;height:1.2mm;background:var(--red);border-radius:1mm}
p{margin:0 0 3mm}
.lead{font-size:12pt;line-height:1.55;color:var(--deep)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
.card{background:#fff;border-radius:4mm;padding:4.5mm 5mm;border:0.3mm solid rgba(30,32,71,.08)}
.cream .card{background:#fff}
.card.peri{background:var(--peri-soft);border:none}
.card.ind{background:var(--indigo);color:#fff;border:none}
.card h4{font-family:var(--sans);font-weight:800;font-size:10pt;color:var(--indigo);margin-bottom:1.5mm}
.card.ind h4{color:var(--peri)}
.num{font-family:var(--anton);font-size:26pt;line-height:1;color:var(--indigo)}
.card.ind .num{color:var(--peri)}
table{width:100%;border-collapse:collapse;font-size:8.5pt;line-height:1.35}
th{background:var(--indigo);color:#fff;text-align:left;font-weight:700;padding:1.6mm 2.2mm;font-size:8.1pt;letter-spacing:.02em}
td{padding:1.5mm 2.2mm;border-bottom:0.3mm solid rgba(30,32,71,.12);vertical-align:top}
tr:nth-child(even) td{background:rgba(169,193,243,.13)}
.tag{display:inline-block;background:var(--peri);color:var(--deep);border-radius:10mm;padding:.4mm 2.6mm;font-weight:800;font-size:7.6pt;letter-spacing:.04em;margin-right:1mm}
.tag.r{background:#fbe3e5;color:#9d1622}
.tag.g{background:#e3f1e6;color:#1f6b35}
ul{margin:0 0 3mm 4.5mm;padding:0} li{margin-bottom:1.3mm}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;align-items:center;font-size:7.6pt;color:rgba(30,32,71,.6)}
.indigo .foot{color:rgba(255,255,255,.7)}
.mk{display:flex;align-items:center;gap:2mm}
.mk img{width:6mm;height:6mm;border-radius:1.4mm}
.ar{font-family:'Tajawal',var(--sans);font-weight:800}
.arrow{color:var(--red);font-weight:800}
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:3mm 0 5mm}
.flow div{background:var(--indigo);color:#fff;border-radius:3mm;padding:3.5mm;font-size:8.6pt;position:relative}
.flow div b{display:block;font-family:var(--anton);font-weight:400;font-size:13pt;letter-spacing:.02em;color:var(--peri);margin-bottom:1mm}
.tl{display:grid;grid-template-columns:repeat(8,1fr);gap:1.6mm;margin:3mm 0}
.tl div{border-radius:2.4mm;padding:2.6mm 2mm;font-size:7.5pt;line-height:1.3;background:var(--peri-soft)}
.tl div b{display:block;font-size:8pt;color:var(--indigo)}
.tl div.c{background:var(--indigo);color:#fff}.tl div.c b{color:var(--peri)}
.small{font-size:8.4pt;color:rgba(30,32,71,.75)}
.cal td{padding:1mm 1.6mm}.cal th{padding:1.2mm 1.6mm;font-size:6.8pt}
.shot{border-radius:3mm;box-shadow:0 1mm 4mm rgba(30,32,71,.18);display:block}
.check li{list-style:none;position:relative;padding-left:6mm;margin-left:-4.5mm}
.check li:before{content:'';position:absolute;left:0;top:1.2mm;width:3.4mm;height:3.4mm;border:0.5mm solid var(--indigo);border-radius:.8mm}
`;

const foot = (n) => `<div class="foot"><span>PLI · “Grow Where You Teach” · Campaign Plan 2026–27</span><span class="mk"><img src="${IMG.m3icon}">Prepared with <span class="ar">مصنع المحتوى</span> · Content Factory &nbsp;·&nbsp; ${n}</span></div>`;
const pg = (n, body, cls = '') => `<section class="pg ${cls}">${body}${foot(n)}</section>`;
const kick = (t) => `<div class="kick"><i></i>${t}</div>`;

const pages = [];
let n = 1;

// 1. COVER
pages.push(`<section class="pg indigo" style="padding:0">
  <div style="position:absolute;right:-30mm;top:-20mm;width:130mm;height:190mm;border-radius:999px 999px 0 0;border:0.8mm solid rgba(169,193,243,.35)"></div>
  <div style="position:absolute;left:18mm;top:18mm;display:flex;align-items:center;gap:5mm">
    <img src="${L.LOGO.shield}" style="height:22mm;background:#fff;border-radius:3mm;padding:1.5mm">
    <div style="font-weight:800;letter-spacing:.2em;font-size:8.5pt;line-height:1.6">PROFESSIONAL<br>LEARNING<br>INSTITUTE</div>
  </div>
  <div style="position:absolute;left:18mm;right:18mm;top:68mm">
    <div style="font-weight:800;letter-spacing:.18em;font-size:9pt;color:var(--peri)">COHORT CAMPAIGN PLAN · NOV 2026 – APR 2027</div>
    <div style="font-family:var(--anton);font-size:74pt;line-height:.92;margin-top:6mm;color:var(--cream)">GROW WHERE<br>YOU TEACH</div>
    <div style="font-family:var(--serif);font-size:17pt;line-height:1.35;margin-top:7mm;max-width:150mm">The marketing strategy and execution plan for the Saint Mary's University of Minnesota MAED and Ed.D, delivered in Kuwait.</div>
    <div style="display:flex;gap:2.4mm;margin-top:8mm">${Array.from({ length: 10 }, (_, k) => `<span style="width:7mm;height:7mm;border-radius:50%;border:0.7mm solid var(--peri);${k < 6 ? 'background:var(--peri)' : ''}"></span>`).join('')}</div>
    <div style="font-size:9pt;margin-top:2.5mm;color:var(--peri)">More than 6 in 10 of our past MAED students were ACA educators.</div>
  </div>
  <div style="position:absolute;left:18mm;right:18mm;top:196mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;font-size:8.8pt">
    <div><b style="color:var(--peri);letter-spacing:.1em;font-size:7.6pt">PREPARED FOR</b><br>Salwa Sleiman<br>PLI Coordinator, American Creativity Academy</div>
    <div><b style="color:var(--peri);letter-spacing:.1em;font-size:7.6pt">CHANNELS</b><br>LinkedIn (main) · Instagram<br>Facebook · Internal ACA channels</div>
    <div><b style="color:var(--peri);letter-spacing:.1em;font-size:7.6pt">WINDOW</b><br>Sun 15 Nov 2026 → Sat 3 Apr 2027<br>20 weeks + 1 setup week</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:44mm;background:var(--cream);color:var(--ink);display:flex;align-items:center;justify-content:space-between;padding:0 18mm">
    <div style="display:flex;align-items:center;gap:5mm">
      <img src="${IMG.m3icon}" style="width:26mm;height:26mm;border-radius:5mm">
      <div><div style="font-size:8pt;letter-spacing:.16em;font-weight:800;color:var(--indigo)">PREPARED WITH</div>
      <div class="ar" style="font-size:20pt;line-height:1.2;color:var(--deep)">مصنع المحتوى</div>
      <div style="font-size:9pt;font-weight:700;color:var(--deep)">Content Factory app — strategy, content and campaign kit</div></div>
    </div>
    <div style="display:flex;align-items:center;gap:5mm;background:#fff;border-radius:3mm;padding:3mm 5mm"><img src="${L.LOGO.smuDark}" style="height:11mm"><img src="${L.LOGO.aca}" style="height:13mm"></div>
  </div>
</section>`);
n++;

// 2. THE PLAN ON ONE PAGE
pages.push(pg(n++, `${kick('The plan on one page')}<h1>One idea, one path, twenty weeks.</h1>
<p class="lead">PLI already has the strongest proof a degree can have: most of its students are the teachers in ACA's own staff rooms. This campaign turns that fact into a clear message, builds the missing road from “interested” to “applied”, and runs it across LinkedIn, Instagram, Facebook and ACA's internal channels for two cohorts.</p>
<div class="grid3" style="margin-top:6mm">
  <div class="card ind"><h4>The big idea</h4><div style="font-family:var(--anton);font-size:19pt;line-height:1;color:var(--cream)">GROW WHERE YOU TEACH</div><p class="small" style="color:#dfe6ff;margin-top:2mm">Online: “Grow wherever you teach.” Ed.D: “Lead the next chapter.”</p></div>
  <div class="card"><h4>The proof</h4><div class="num">6 in 10</div><p class="small">of our past MAED students were ACA educators. Used in every asset.</p></div>
  <div class="card"><h4>The offer</h4><div class="num">222.22 KD</div><p class="small">a month for ACA staff (4,000 KD ÷ 18). External: 233.33 KD/month.</p></div>
  <div class="card"><h4>Who we talk to</h4><p class="small">ACA staff (the core) · new ACA hires · external educators in Kuwait · educators outside Kuwait (online) · experienced leaders (Ed.D).</p></div>
  <div class="card"><h4>Where</h4><p class="small"><b>LinkedIn</b> to convince · <b>Instagram</b> to remind · <b>Facebook</b> for reach and ads · <b>internal ACA channels</b> to convert staff.</p></div>
  <div class="card"><h4>When</h4><p class="small">January cohort: deadline proposed Sun 20 Dec 2026. March cohort: deadline proposed Sun 21 Mar 2027. Ed.D always-on.</p></div>
</div>
<h3>What gets built</h3>
<div class="grid3">
  <div class="card peri"><div class="num">16</div><p class="small">motion videos with voiceover (male and female versions), 9:16 and 4:5, burned-in captions</p></div>
  <div class="card peri"><div class="num">18</div><p class="small">carousels (Instagram/Facebook PNG + LinkedIn PDF document posts)</p></div>
  <div class="card peri"><div class="num">26</div><p class="small">single posts, plus 6 LinkedIn personal posts, 9 story sets (31 frames), emails, posters and a programme guide</p></div>
</div>
<h3>What success looks like</h3>
<ul>
<li>Every interested educator can apply in one tap, and gets a reply within one working day.</li>
<li>January and March cohorts filled to the targets PLI sets, with a clear picture of which channel brought each student.</li>
<li>PLI becomes the obvious answer when a teacher in Kuwait says “one day I'll do my master's”.</li>
</ul>
<p class="small" style="margin-top:4mm"><b>Budget (recommended):</b> about 2,000 KD of paid media over 20 weeks (lean option about 900 KD). One MAED enrolment is worth 4,000–4,200 KD, so the campaign pays for itself with very few extra students.</p>`));

// 3. SITUATION
pages.push(pg(n++, `${kick('Where PLI stands today')}<h1>A great product, told quietly.</h1>
<p class="lead">The Professional Learning Institute delivers two Saint Mary's University of Minnesota degrees in Kuwait: the <b>MAED</b> (Master of Arts in Education — Curriculum &amp; Instruction or Educational Leadership; 30 credits, 10 courses, 18 months) and the <b>Ed.D</b> (Executive Leadership Doctorate; 39 credits, 3 years, fully online, no dissertation).</p>
<div class="grid2" style="margin:6mm 0">
  <div class="card"><h4>What the numbers say</h4><ul class="small"><li>About <b>62%</b> of past students were ACA staff; <b>38%</b> were external.</li><li>Students came from at least <b>eight nationalities</b>.</li><li>Prices are clear and monthly: 4,000 KD (staff) and 4,200 KD (external) over 18 months.</li></ul></div>
  <div class="card"><h4>What the audience sees</h4><ul class="small"><li>A good-looking Instagram, mostly about events (Saturday Learning Series) and programme facts.</li><li>No price, no proof story, no clear “apply here”.</li><li>Website “Apply Now” buttons that lead to ACA job listings, not to PLI.</li></ul></div>
</div>
<h3>The diagnosis in plain words</h3>
<p>People who already know PLI like it. People who don't know it yet have no simple reason to stop scrolling, and those who are interested have no easy next step. So the campaign has two jobs at the same time:</p>
<div class="grid2"><div class="card peri"><h4>1 · Create demand</h4><p class="small">Tell the proof story (your colleagues already did it), show the price as a monthly figure, answer the hard questions honestly, and keep showing up every week.</p></div>
<div class="card peri"><h4>2 · Build the road to “applied”</h4><p class="small">One enquiry form, one link everywhere, a reply within 24 hours, a 15-minute call, a simple checklist, and a tracker that shows where every student came from.</p></div></div>
<h3>Why now</h3>
<p>Two cohorts start within five months (January and end of March). New ACA staff join in January with signing bonuses and PL stipends. The new year, the International Day of Education (24 January) and Ramadan are natural moments when educators think about their next step. And a new online option lets PLI reach former ACA staff and teachers across the GCC for the first time.</p>`));

// 4. STRENGTHS & WEAKNESSES
const SW = {
  S: [
    ['S1', 'Proof from inside', 'More than 6 in 10 past MAED students were ACA educators — the strongest social proof a teacher can hear.'],
    ['S2', 'A real US degree', "Saint Mary's University of Minnesota, accredited in the US by the Higher Learning Commission."],
    ['S3', 'Built for working teachers', 'Weekly in-person classes in Kuwait, 18 months, no career pause.'],
    ['S4', 'Simple money', '222.22 / 233.33 KD a month, PL stipend and signing bonus for ACA staff, a referral reward.'],
    ['S5', 'A diverse community', '38% external students from 8+ nationalities: credible beyond ACA.'],
    ['S6', 'Brand and events', 'A recognisable visual identity, real graduation photos and a warm Saturday Learning Series audience.'],
    ['S7', 'A rare doctorate', 'Executive Ed.D: online, 3 years, no dissertation — few local competitors.'],
    ['S8', 'New reach', 'An online option leading to the same degree and diploma.'],
  ],
  W: [
    ['W1', 'Event-heavy content', 'Posts describe events and facts, not why the degree is worth it.'],
    ['W2', 'Hidden price', 'The monthly price is never shown, so people assume “too expensive”.'],
    ['W3', 'No path to apply', 'No enquiry form, “Apply Now” goes to job listings, no lead tracking.'],
    ['W4', 'Unused proof', 'The 62% fact and graduates’ stories are rarely told.'],
    ['W5', 'Narrow channels', 'No PLI Facebook page, light LinkedIn use, no paid media.'],
    ['W6', 'Recognition questions', 'Kuwaiti citizens ask about the public-sector salary scale; silence creates doubt.'],
    ['W7', 'Inside-out audience', 'Strong with ACA staff, little awareness among external educators.'],
    ['W8', 'No measurement', 'No weekly numbers, so no way to know what works.'],
  ],
};
pages.push(pg(n++, `${kick('Strengths and weaknesses')}<h1 style="font-size:26pt;margin-bottom:2mm">What we build on, what we fix.</h1>
<div class="grid2" style="margin-top:4mm">
<div><h3 style="margin-top:0"><span class="tag g">STRENGTHS</span></h3>${SW.S.map(([k, t, d]) => `<div class="card" style="margin-bottom:1.8mm;padding:2.6mm 3.6mm"><b style="color:var(--indigo)">${k} · ${esc(t)}</b><div class="small">${esc(d)}</div></div>`).join('')}</div>
<div><h3 style="margin-top:0"><span class="tag r">WEAKNESSES</span></h3>${SW.W.map(([k, t, d]) => `<div class="card" style="margin-bottom:1.8mm;padding:2.6mm 3.6mm"><b style="color:#9d1622">${k} · ${esc(t)}</b><div class="small">${esc(d)}</div></div>`).join('')}</div>
</div>
<div class="grid2" style="margin-top:2mm">
<div class="card peri"><h4>Opportunities</h4><p class="small">January new hires · two cohorts in one season · teachers scroll Instagram in the evening · LinkedIn is where leaders evaluate degrees · GCC educators via the online option · New Year, Day of Education and Ramadan moments.</p></div>
<div class="card peri"><h4>Risks to manage</h4><p class="small">Over-claiming on accreditation or recognition · slow replies to leads · ad fatigue · Ramadan and Eid dates moving by a day · small budget spread too thin. Each has a rule in this plan.</p></div>
</div>`, 'cream'));

// 5. GOALS
pages.push(pg(n++, `${kick('Campaign goals')}<h1 style="font-size:26pt;margin-bottom:2mm">Short-term wins, long-term position.</h1>
<p class="lead" style="margin-bottom:1mm">Short-term goals fill the next two cohorts. Long-term goals make sure PLI never has to start from zero again.</p>
<h3>Short-term goals · this campaign (15 Nov 2026 – 3 Apr 2027)</h3>
<table><tr><th style="width:8%">#</th><th style="width:42%">Goal</th><th>How we measure it</th></tr>
<tr><td><b>ST1</b></td><td>Build the path to conversion in Week 0: one form, one link, “Apply Now” fixed, lead tracker live.</td><td>Done before the first post on 15 Nov; every bio, ad and post uses the same link.</td></tr>
<tr><td><b>ST2</b></td><td>Fill the January cohort (deadline proposed 20 Dec).</td><td>Enrolments vs. the target PLI sets; applications and calls booked.</td></tr>
<tr><td><b>ST3</b></td><td>Fill the end-of-March cohort, including the first online learners (deadline proposed 21 Mar).</td><td>Enrolments by segment (ACA / external / online).</td></tr>
<tr><td><b>ST4</b></td><td>Generate qualified leads every week from every channel.</td><td>Leads by source (UTM) and segment; cost per lead on paid media.</td></tr>
<tr><td><b>ST5</b></td><td>Answer fast: every lead gets a reply within 1 working day and an offer of a 15-minute call.</td><td>Reply time in the tracker; 25–35% of leads book a call.</td></tr>
<tr><td><b>ST6</b></td><td>Tell the proof story: collect 5 graduate stories with consent (3 ACA, 2 external).</td><td>5 spotlights published by Week 19.</td></tr>
<tr><td><b>ST7</b></td><td>Run 3 Live Q&amp;As and keep a weekly posting rhythm (177 scheduled posts).</td><td>Attendees, questions, saves, shares, document completion.</td></tr>
</table>
<h3>Long-term goals · the next 6–24 months</h3>
<table><tr><th style="width:8%">#</th><th style="width:42%">Goal</th><th>What it changes</th></tr>
<tr><td><b>LT1</b></td><td>Be the first name educators in Kuwait think of for a master's — “the staff-room choice”.</td><td>Demand arrives before the campaign starts.</td></tr>
<tr><td><b>LT2</b></td><td>An always-on pipeline for every intake, not campaign spikes.</td><td>Steady leads; less pressure before deadlines.</td></tr>
<tr><td><b>LT3</b></td><td>Grow the external and online share while keeping the ACA core.</td><td>A bigger, more resilient student base across the GCC.</td></tr>
<tr><td><b>LT4</b></td><td>Build an Ed.D pipeline of experienced leaders.</td><td>Higher-value enrolments and senior advocates.</td></tr>
<tr><td><b>LT5</b></td><td>A graduate ambassador community that refers new students.</td><td>Referrals become a reliable, low-cost source.</td></tr>
<tr><td><b>LT6</b></td><td>Decide with data: know the cost per enrolment by channel.</td><td>Every future dinar goes where it works.</td></tr>
</table>
<p class="small" style="margin-top:3mm">Numeric enrolment, application and lead targets are set with PLI from past cohort sizes (placeholders in the plan: TARGET_ENROLMENTS, TARGET_APPS, TARGET_LEADS). A simple rule: target the average past cohort size plus 20%, then work back with a 25–35% lead-to-call rate.</p>`));

// 6. STRENGTHS -> GOALS
const S2G = [
  ['S1 Proof from inside', 'Anchor message “Your colleagues already did it”, the 6-in-10 dot badge on every asset, V01, C01, S02, staff email #1.', 'ST2, ST3, LT1'],
  ['S2 A real US degree', 'Exact accreditation line in C02, C07, V02, V09; credibility for external educators on LinkedIn.', 'ST4, LT3'],
  ['S3 Built for working teachers', '“Teach by day, grow by week” (V05), myths vs facts (C08), 18-months map (C10).', 'ST2, ST3'],
  ['S4 Simple money', 'Show the monthly maths openly (V03, C04, S18); PL stipend and signing bonus for staff and new hires (V14); referral reward (V06, C05).', 'ST2, ST3, LT5'],
  ['S5 A diverse community', '“One classroom, eight nationalities” (C11); external graduates in spotlights.', 'ST4, LT3'],
  ['S6 Brand and events', 'New content sits naturally in the existing grid; a 2-minute PLI slot + QR at every Saturday Learning Series.', 'ST4, LT1'],
  ['S7 A rare doctorate', 'Always-on Ed.D track on LinkedIn (V04, C03, S07, L06) aimed at leaders with 10+ years.', 'LT4'],
  ['S8 New reach', '“Grow wherever you teach” (V07, C13) and GCC campaigns from 31 Jan.', 'ST3, LT3'],
];
const G2W = [
  ['ST1 Path to conversion', 'W3 No path to apply · W8 No measurement', 'Form + tracker live; every lead has a source and a status.'],
  ['ST4 Weekly qualified leads', 'W5 Narrow channels · W7 Inside-out audience', 'LinkedIn and Meta campaigns reach external educators and the GCC.'],
  ['ST5 Fast answers', 'W3 No path to apply · W6 Recognition questions', '24-hour replies and 15-minute calls; honest FAQ for Kuwaiti citizens.'],
  ['ST6 Proof stories', 'W1 Event-heavy content · W4 Unused proof', 'Five real graduates telling their own story.'],
  ['ST2 / ST3 Show the price', 'W2 Hidden price', 'Monthly figures in videos, carousels and ads.'],
  ['LT1 Staff-room choice', 'W1 · W4 · W7', 'A consistent message that people repeat to each other.'],
  ['LT6 Decide with data', 'W8 No measurement', 'Sunday snapshot every week; full report after each deadline.'],
];
pages.push(pg(n++, `${kick('How it fits together')}<h1 style="font-size:24pt;margin-bottom:2mm">Strengths power the goals. Goals fix the weaknesses.</h1>
<p class="lead" style="font-size:10.6pt;margin-bottom:1mm">Each piece of content uses a strength to move a goal forward, and reaching each goal closes a weakness. <b>The loop:</b> proof brings leads → fast answers turn leads into students → students become graduates → graduates become new proof and referrals.</p>
<h3>1 · How the campaign uses each strength</h3>
<table><tr><th style="width:24%">Strength</th><th>How the campaign uses it</th><th style="width:15%">Goals it serves</th></tr>
${S2G.map(([a, b, c]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</table>
<h3>2 · How each goal strengthens a weakness</h3>
<table><tr><th style="width:24%">Goal</th><th style="width:32%">Weakness it fixes</th><th>How we'll see it</th></tr>
${G2W.map(([a, b, c]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</table>
`, 'cream'));

// 7. BIG IDEA + MESSAGES
pages.push(pg(n++, `${kick('Big idea and messages')}<h1>Grow where you teach.</h1>
<div class="grid2" style="align-items:start">
<div>
<p class="lead">The 62% statistic does three jobs at once:</p>
<div class="card" style="margin-bottom:3mm"><h4>1 · Social proof for ACA staff</h4><p class="small">“Your colleagues already did it.” Someone in the same staff room, with the same workload, finished it.</p></div>
<div class="card" style="margin-bottom:3mm"><h4>2 · Credibility for external educators</h4><p class="small">An international school chose this programme for its own people. That is an endorsement.</p></div>
<div class="card"><h4>3 · Feasibility</h4><p class="small">If full-time ACA teachers manage it, the schedule works.</p></div>
</div>
<div>${IMG.c01 ? `<img class="shot" src="${IMG.c01}" style="width:100%">` : ''}<p class="small" style="margin-top:2mm">C01 — the campaign hero carousel, built in PLI's own style with the new 6-in-10 dot badge.</p></div>
</div>
<h3>Message order (every asset leads with one and supports it with another)</h3>
<table><tr><th style="width:6%">#</th><th style="width:28%">Message</th><th>What we say</th></tr>
<tr><td>1</td><td><b>Proof</b></td><td>Your colleagues already did it — more than 6 in 10 of our past MAED students were ACA educators.</td></tr>
<tr><td>2</td><td><b>Built for working teachers</b></td><td>Weekly in-person classes in Kuwait, 18 months, keep teaching.</td></tr>
<tr><td>3</td><td><b>Simple money</b></td><td>From 222.22 KD a month (ACA staff) / 233.33 KD (external) · PL stipend + signing bonus · referral reward.</td></tr>
<tr><td>4</td><td><b>Credibility</b></td><td>Saint Mary's University of Minnesota, accredited in the US by the Higher Learning Commission.</td></tr>
<tr><td>5</td><td><b>Reach</b></td><td>An online option for anyone outside Kuwait, leading to the same degree.</td></tr></table>
<h3>Tone of voice</h3>
<p>Warm, direct, colleague-to-colleague. Short sentences. Talk to “you”, not “candidates”. No hype, no promises of promotions or salary rises. International English for a Canadian, American, British, South African, Lebanese, Jordanian, Tunisian and Kuwaiti audience.</p>`));

// 8. AUDIENCES + CHANNELS
pages.push(pg(n++, `${kick('Who we talk to, and where')}<h1>Five audiences, four channels.</h1>
<table><tr><th style="width:4%">#</th><th style="width:22%">Audience</th><th>What they need to hear</th><th style="width:22%">Main channels</th></tr>
<tr><td>A</td><td><b>ACA staff</b> — the core (~62%)</td><td>Your colleagues did it · staff rate 4,000 KD (222.22 KD/month) · PL stipend and signing bonus · classes on campus · referrals save money</td><td>Internal first, then Instagram, LinkedIn, retargeting</td></tr>
<tr><td>B</td><td><b>New ACA hires</b></td><td>Your signing bonus and PL stipend can fund a master's · start your first year with a plan</td><td>HR onboarding, Instagram, staff email</td></tr>
<tr><td>C</td><td><b>External educators in Kuwait</b> (~38%)</td><td>A US degree delivered in Kuwait · built for working teachers · 4,200 KD (233.33 KD/month)</td><td>LinkedIn (main), Instagram, Facebook groups, Meta ads</td></tr>
<tr><td>D</td><td><b>Educators outside Kuwait</b></td><td>Same programme, same degree and diploma, studied online</td><td>LinkedIn, Meta ads (GCC), ACA alumni email</td></tr>
<tr><td>E</td><td><b>Experienced leaders</b> (10+ years)</td><td>Executive doctorate, online, no dissertation, monthly plan</td><td>LinkedIn (main), personal outreach</td></tr>
<tr><td>F</td><td><b>Kuwaiti citizens</b> (sensitive)</td><td>An honest answer on recognition — handled one-to-one, never targeted with salary messages</td><td>Personal conversations, FAQ</td></tr></table>
<h3>The job of each channel</h3>
<div class="grid2">
<div class="card"><h4>LinkedIn — convince (main)</h4><p class="small">Credibility, external educators, leaders, Ed.D. 3 posts a week (Sun, Tue, Wed, 8:30 am) + a personal post from Salwa every two weeks. Document ads, video ads, Lead Gen Forms.</p></div>
<div class="card"><h4>Instagram — remind</h4><p class="small">Emotion, community, ACA staff reach. 3 feed posts a week (Sun Reel, Tue carousel, Thu post, 8:30 pm; 9:30 pm in Ramadan) + stories 5–7 days a week.</p></div>
<div class="card"><h4>Facebook — reach</h4><p class="small">Older and Arab expat educators, teacher groups, and required for Meta ads. A PLI page linked to Instagram; cross-post every feed post the same day.</p></div>
<div class="card"><h4>Internal ACA — convert</h4><p class="small">Staff emails, principals' briefings, staff-room posters with QR, graduate ambassadors, a 2-minute slot at every Saturday Learning Series.</p></div>
</div>
<p class="small" style="margin-top:3mm"><b>Why both LinkedIn and Instagram matter for staff:</b> LinkedIn is where people evaluate a degree; Instagram is where a colleague's face in a Reel lands in the evening. LinkedIn convinces, Instagram reminds.</p>`, 'cream'));

// 9. FUNNEL + WEEK 0
pages.push(pg(n++, `${kick('The road to “applied”')}<h1>Fix the path before spending a dinar.</h1>
<div class="flow"><div><b>AWARENESS</b>Reels and video ads · “6 in 10” proof</div><div><b>CONSIDERATION</b>Carousels, FAQ, Live Q&amp;A, graduate spotlights, price breakdown</div><div><b>CONVERSION</b>Lead form / email / DM → 15-min call with Salwa → checklist → enrolment</div><div><b>ADVOCACY</b>Welcome posts, graduate spotlights, referral reward</div></div>
<div class="grid2">
<div><h3 style="margin-top:0">Five fixes in Week 0</h3>
<ol style="margin-left:5mm" class="small">
<li><b>One clear destination.</b> A short enquiry form (name, email, mobile/WhatsApp, ACA staff?, programme, cohort, best time to call). One link in bio, ads and posts. pli@aca.edu.kw stays as the second option.</li>
<li><b>Fix “Apply Now”.</b> Ask the ACA web team to point the PLI buttons on careers.aca.edu.kw to the form.</li>
<li><b>Comment-to-DM.</b> “Comment MAED and we'll send you the programme guide” (also PLAN, C&amp;I, LEAD).</li>
<li><b>Response standard.</b> A reply within 24 hours (working days) and an offer of a 15-minute call.</li>
<li><b>Lead tracker.</b> One shared sheet: date, source (UTM), segment, programme, cohort, status (New → Contacted → Call booked → Applied → Enrolled → Lost + reason).</li>
</ol></div>
<div><h3 style="margin-top:0">Week 0 checklist (8–14 Nov)</h3>
<ul class="check small">
<li>Confirm deadlines, start dates, application steps, Ed.D external price, referral terms and recognition wording.</li>
<li>Create the form and the lead tracker.</li>
<li>Create/link the PLI Facebook page; set up Meta Business Suite, Ads Manager and the Pixel.</li>
<li>LinkedIn: admin access, Campaign Manager, Insight Tag, Lead Gen Form.</li>
<li>Update the Instagram bio, story highlights, LinkedIn tagline and covers.</li>
<li>Collect 5 graduate quotes + photos + written consent; 10–20 real photos; logo files.</li>
<li>Recruit 4–6 graduate ambassadors; book hosts for the 3 Live Q&amp;As.</li>
<li>Turn on comment-to-DM automation.</li>
<li>Salwa approves V09, C07 and the programme guide wording.</li>
</ul></div></div>
<div class="card peri" style="margin-top:3mm"><h4>Instagram bio (ready to paste)</h4><p class="small" style="white-space:pre-line;margin:0">${esc(L.C.bio_instagram)}</p></div>`));

// 10. PHASES
const PHASES = [
  ['0 · Setup', '8–14 Nov', 'Path to conversion ready'],
  ['1 · Launch Jan', '15 Nov–12 Dec', 'Awareness + consideration · Live #1 (9 Dec)'],
  ['2 · Close Jan', '13–26 Dec', 'Applications · deadline 20 Dec'],
  ['3 · New year + Ed.D', '27 Dec–9 Jan', 'Growth plan, Ed.D, welcome January'],
  ['4 · Launch Mar', '10 Jan–6 Feb', 'New hires, referral, online, Live #2 (27 Jan)'],
  ['5 · Ramadan + National Day', '7 Feb–13 Mar', 'Respectful consideration · Live #3 (17 Feb)'],
  ['6 · Close Mar', '14–27 Mar', 'Final call · deadline 21 Mar'],
  ['7 · Welcome + always-on', '28 Mar–3 Apr', 'Advocacy, Ed.D, next intake'],
];
pages.push(pg(n++, `${kick('Timeline')}<h1>Eight phases, two peaks.</h1>
<div class="tl">${PHASES.map(([a, b, c], i) => `<div class="${[2, 6].includes(i) ? 'c' : ''}"><b>${esc(a)}</b>${esc(b)}<br><span style="opacity:.8">${esc(c)}</span></div>`).join('')}</div>
<h3>Ramadan rules</h3>
<p class="small">Post feed content after iftar (9:30 pm), keep the tone reflective, no hard-sell countdowns on greeting posts, no food imagery, offer evening calls. Confirm Ramadan and Eid dates with the official Kuwaiti announcement and shift posts by one day if needed.</p>
<h3>Internal ACA activation — where the 62% comes from</h3>
<table><tr><th style="width:16%">When</th><th>Action</th><th style="width:18%">Owner</th></tr>
<tr><td>Week 1</td><td><b>Staff email #1</b> “Grow where you teach” + staff rate + PL stipend + form link</td><td>Salwa</td></tr>
<tr><td>Week 1</td><td><b>Principals' briefing:</b> one slide for every campus/division meeting</td><td>Salwa + principals</td></tr>
<tr><td>Weeks 1–2</td><td><b>Staff-room posters</b> (A3, QR code to the form)</td><td>Print</td></tr>
<tr><td>Week 2</td><td><b>Graduate ambassadors:</b> 1–2 per campus, “Ask me about the MAED” sticker, coffee chats</td><td>Salwa</td></tr>
<tr><td>Every SLS</td><td><b>2-minute PLI slot + QR</b> at each Saturday Learning Series session</td><td>Salwa</td></tr>
<tr><td>Week 5</td><td><b>Staff email #2:</b> final week for January</td><td>Salwa</td></tr>
<tr><td>Week 9</td><td><b>Staff email #3 / new-hire pack</b> in HR onboarding</td><td>HR + Salwa</td></tr>
<tr><td>Week 18</td><td><b>Staff email #4:</b> final call for March</td><td>Salwa</td></tr>
<tr><td>Always</td><td><b>Referral reminder</b> to current students: refer 2 → final payment waived; refer 4 → last 2 payments waived</td><td>Salwa</td></tr></table>`, 'cream'));

// 11. CONTENT PLAN
pages.push(pg(n++, `${kick('Content plan')}<h1>Five pillars, every week.</h1>
<table><tr><th style="width:28%">Pillar</th><th style="width:10%">Share</th><th>Purpose</th><th style="width:22%">Examples</th></tr>
<tr><td><b>P1 · From our staff room</b></td><td>25%</td><td>The 62% story, graduates, ambassadors</td><td>V01, C01, S02, S03</td></tr>
<tr><td><b>P2 · Programme clarity</b></td><td>25%</td><td>What, how long, which track, how to apply</td><td>V02, V08, C02, C06, C09, C10</td></tr>
<tr><td><b>P3 · Money made simple</b></td><td>15%</td><td>Monthly plan, PL stipend, signing bonus, referral</td><td>V03, V06, V14, C04, C05, S18</td></tr>
<tr><td><b>P4 · Trust and answers</b></td><td>15%</td><td>Accreditation, FAQ, myths, Live Q&amp;A</td><td>V09, C07, C08, S04</td></tr>
<tr><td><b>P5 · Moments and deadlines</b></td><td>20%</td><td>Cohort openings, deadlines, welcomes, national and religious occasions</td><td>V10, V11, V13, S01, S05, S06</td></tr></table>
<div class="grid3" style="margin-top:5mm;align-items:start">
${[IMG.v01, IMG.c04, IMG.s02 || IMG.s01].filter(Boolean).map((u) => `<img class="shot" src="${u}" style="width:100%">`).join('')}
</div>
<p class="small" style="margin-top:2mm">Samples from the campaign kit: a Reel frame (V01), a money slide (C04) and a proof post. Every video exists with a male and a female voiceover so PLI can choose.</p>
<h3>Formats</h3>
<table><tr><th>Format</th><th>Instagram</th><th>Facebook</th><th>LinkedIn</th></tr>
<tr><td>Motion video with voiceover</td><td>Reel 1080×1920</td><td>Reel + feed 1080×1350</td><td>Feed video 1080×1350, burned-in captions</td></tr>
<tr><td>Carousel</td><td>6–9 slides 1080×1350</td><td>Same</td><td>PDF document post</td></tr>
<tr><td>Single post</td><td>1080×1350</td><td>Same</td><td>1080×1350</td></tr>
<tr><td>Stories</td><td>1080×1920 frames</td><td>Same</td><td>—</td></tr></table>`));

// 12. CALENDAR
pages.push(pg(n++, `${kick('20-week calendar')}<h1 style="font-size:24pt">What goes out, every week.</h1>
<table style="font-size:6.7pt;line-height:1.25" class="cal"><tr><th>Wk</th><th>Dates</th><th>Phase</th><th>LinkedIn (Sun · Tue · Wed)</th><th>Instagram + Facebook (Sun · Tue · Thu)</th><th>Stories</th><th>Off-platform / ads</th></tr>
${L.C.calendar.map((r) => `<tr><td><b>${r.week}</b></td><td style="white-space:nowrap">${esc(r.dates)}</td><td>${esc(r.phase)}</td><td>${esc(r.linkedin)}</td><td>${esc(r.instagram)}</td><td>${esc(r.stories)}</td><td>${esc(r.offplatform)}</td></tr>`).join('')}</table>
<p class="small" style="margin-top:2mm">Times (Kuwait): LinkedIn 08:30 (10:00 in Ramadan) · Instagram/Facebook 20:30 (21:30 in Ramadan) · Stories 12:30 and/or 21:00. The full calendar with exact dates, captions and links is in the campaign kit (calendar.csv / calendar.xlsx).</p>`, 'cream'));

// 13. PAID MEDIA
pages.push(pg(n++, `${kick('Paid media')}<h1>Spend where the proof lands.</h1>
<table><tr><th>Option</th><th>Total (20 weeks)</th><th>LinkedIn</th><th>Meta (IG + FB)</th><th>Boost reserve</th></tr>
<tr><td>Lean</td><td>~900 KD</td><td>500 KD</td><td>350 KD</td><td>50 KD</td></tr>
<tr><td><b>Recommended</b></td><td><b>~2,000 KD</b></td><td><b>1,100 KD</b></td><td><b>800 KD</b></td><td><b>100 KD</b></td></tr></table>
<h3>LinkedIn campaigns</h3>
<table><tr><th style="width:16%">Campaign</th><th style="width:20%">Dates</th><th>Audience</th><th style="width:20%">Assets</th></tr>
<tr><td>LI-1 MAED Kuwait</td><td>15 Nov–20 Dec, 10 Jan–21 Mar</td><td>Kuwait · Education job function · teacher, HOD, coordinator, coach, assistant principal titles</td><td>C02, C04, C07, V01, V02 + Lead Gen Form</td></tr>
<tr><td>LI-2 ACA staff</td><td>Same</td><td>Company: American Creativity Academy (check audience ≥ 300)</td><td>V01, C01, V03</td></tr>
<tr><td>LI-3 Ed.D leaders</td><td>Always-on from 27 Dec</td><td>Kuwait + GCC · principal, VP, head of school, director · 10+ years</td><td>V04, C03</td></tr>
<tr><td>LI-4 Online</td><td>31 Jan–21 Mar</td><td>GCC + matched list of ACA alumni (with consent)</td><td>V07, C13</td></tr>
<tr><td>LI-RT Retarget</td><td>Always-on</td><td>Video viewers 50%+, page visitors, form openers (90 days)</td><td>C07, V09, deadline posts</td></tr></table>
<h3>Meta campaigns (Instagram + Facebook)</h3>
<table><tr><th style="width:16%">Campaign</th><th style="width:20%">Dates</th><th>Audience</th><th style="width:20%">Assets</th></tr>
<tr><td>META-1 Kuwait educators</td><td>15 Nov–20 Dec, 10 Jan–21 Mar</td><td>Kuwait, 23–60, teaching and education interests, Advantage+ audience</td><td>V01, V02, V03, V05, V13</td></tr>
<tr><td>META-2 Retarget</td><td>Always-on</td><td>Engagers 60 days, video viewers 50%+, form openers</td><td>C07, C04, deadline posts</td></tr>
<tr><td>META-3 Online GCC</td><td>31 Jan–21 Mar</td><td>GCC + Jordan, Lebanon (check regulations), teaching interests</td><td>V07, C13</td></tr></table>
<h3>Simple rules</h3>
<ul class="small"><li>Test 2–3 creatives per ad set; after 10–14 days pause the one with the highest cost per lead and move budget to the best.</li><li>Raise budget 30% in the final 10 days before each deadline; pause cohort ads after the deadline (Ed.D stays on).</li><li>Tag every link: utm_source / utm_medium / utm_campaign (jan27, mar27, edd, online) / utm_content (asset ID, e.g. V01).</li></ul>`));

// 14. KPIs + GUARDRAILS
pages.push(pg(n++, `${kick('Measure and protect')}<h1>Know what works. Never over-promise.</h1>
<table><tr><th style="width:15%">Level</th><th>KPI</th><th style="width:30%">Target</th></tr>
<tr><td>Business</td><td>Enrolments per cohort (January / March / online / Ed.D)</td><td>Set with PLI</td></tr>
<tr><td>Conversion</td><td>Applications · calls booked · lead-to-application rate</td><td>25–35% lead → call</td></tr>
<tr><td>Leads</td><td>Leads by source and segment; cost per lead</td><td>Set with PLI</td></tr>
<tr><td>Engagement</td><td>Saves + shares (IG), document completion (LI), Live attendees, DMs</td><td>Week-on-week growth</td></tr>
<tr><td>Reach</td><td>Reach, 3-second video views, follower growth</td><td>Week-on-week growth</td></tr></table>
<p class="small" style="margin-top:2mm"><b>Rhythm:</b> a short snapshot every Sunday (leads, top 3 posts, actions) and a full report after each deadline (reach → leads → calls → applications → enrolments by segment and source).</p>
<h3>Claims guardrails — hard rules for every asset</h3>
<table><tr><th style="width:18%">Topic</th><th>✅ Say</th><th style="width:30%">❌ Never say</th></tr>
<tr><td>US accreditation</td><td>“Saint Mary's University of Minnesota is accredited in the US by the Higher Learning Commission.”</td><td>“Internationally accredited”</td></tr>
<tr><td>Kuwait recognition</td><td>“Recognized by Kuwait's Ministry of Education as part of work-permit approval.” (wording approved by PLI/HR)</td><td>Anything implying Civil Service Commission or salary-scale recognition</td></tr>
<tr><td>Kuwaiti citizens</td><td>FAQ only: not currently recognized by the Civil Service Commission for the public-sector salary scale — talk to us first.</td><td>Salary or promotion promises</td></tr>
<tr><td>Online option</td><td>“Same programme. Same degree. Same diploma.”</td><td>Anything that sounds like hiding it</td></tr>
<tr><td>Price</td><td>4,000 KD (222.22 × 18) staff · 4,200 KD (233.33 × 18) external · Ed.D about 14,760 KD (410 × 36 or 307.50 × 48, staff)</td><td>“Cheap”, “free”, rounded figures</td></tr>
<tr><td>Referral</td><td>Refer 2 → final payment waived · refer 4 → last 2 payments waived · terms apply</td><td>Cash rewards</td></tr>
<tr><td>Outcomes</td><td>“Grow”, “deepen your practice”, “step toward leadership”</td><td>Guaranteed promotion, salary rise, job</td></tr>
<tr><td>Testimonials</td><td>Real graduates, real words, written consent, real photos</td><td>Invented quotes, AI “graduates”, stock photos</td></tr></table>`, 'cream'));

// 15. TO CONFIRM + HOW TO RUN IT
const PHL = Object.entries(L.PH).filter(([k]) => !/SPOKEN/.test(k));
pages.push(pg(n++, `${kick('Before publishing')}<h1>What we need from PLI.</h1>
<p class="lead">These items are proposed in the plan and must be confirmed before anything goes live. Until then, the kit shows the proposed values, and the captions keep a visible [placeholder] where a real link is needed.</p>
<table><tr><th style="width:42%">Item</th><th>Proposed value</th><th style="width:16%">Status</th></tr>${PHL.map(([k, v]) => `<tr><td><b>${esc(v.what)}</b></td><td>${esc(v.proposed || '—')}</td><td><span class="tag r">To confirm</span></td></tr>`).join('')}</table>`, 'cream'));

pages.push(pg(n++, `${kick('Making it happen')}<h1>How to run it, week by week.</h1>
<div class="grid2" style="align-items:start">
<div><h3 style="margin-top:0">The first 7 days</h3>
<ol class="small" style="margin-left:5mm"><li>Confirm the items on the previous page with PLI and HR.</li><li>Create the enquiry form and the lead tracker; fix the “Apply Now” buttons.</li><li>Create the PLI Facebook page; set up Meta and LinkedIn ad accounts, Pixel and Insight Tag.</li><li>Update the Instagram bio, highlights and covers (ready in the kit).</li><li>Collect graduate stories, photos and consent; recruit ambassadors.</li><li>Choose the voice (male or female) for the videos and schedule Week 1.</li><li>Send staff email #1 and brief the principals.</li></ol>
<h3>Every week (30 minutes on Sunday)</h3>
<ol class="small" style="margin-left:5mm"><li>Check last week's numbers: leads by source, top 3 posts, cost per lead.</li><li>Update the lead tracker; adjust ad budgets.</li><li>Schedule the week's posts from the kit (captions are ready to copy).</li></ol></div>
<div><h3 style="margin-top:0">Every day (10 minutes)</h3>
<ol class="small" style="margin-left:5mm"><li>Reply to comments and DMs the same day.</li><li>Move new leads into the tracker and offer a 15-minute call.</li><li>Reshare graduate and colleague posts to stories.</li></ol>
<h3>After each Live and deadline</h3>
<ol class="small" style="margin-left:5mm"><li>Cut 2–3 short clips from each Live into Reels/LinkedIn videos.</li><li>Turn new questions into story answers.</li><li>After each deadline, write the full report and keep what worked for the next intake.</li></ol>
<div class="card ind" style="margin-top:4mm"><h4>The campaign kit</h4><p class="small" style="color:#e6ebff;margin:0">Every video (male and female voice), carousel, post, story, caption, hashtag, link and the full calendar — ready to download and copy.${KIT_URL ? `<br><b style="color:#fff">${esc(KIT_URL)}</b>` : ''}</p></div>
</div></div>`));

// 16. BACK COVER
pages.push(`<section class="pg indigo" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div style="font-family:var(--anton);font-size:56pt;line-height:.95;color:var(--cream)">YOUR COLLEAGUES<br>ALREADY DID IT.</div>
  <div style="font-family:var(--anton);font-size:56pt;line-height:.95;color:var(--peri);margin-top:2mm">YOUR TURN.</div>
  <div style="margin-top:12mm;background:#fff;border-radius:4mm;padding:4mm 7mm;display:flex;gap:7mm;align-items:center"><img src="${L.LOGO.shield}" style="height:16mm"><img src="${L.LOGO.smuDark}" style="height:14mm"><img src="${L.LOGO.aca}" style="height:17mm"></div>
  <div style="margin-top:6mm;font-size:10pt">pli@aca.edu.kw · @professionallearninginstitute</div>
  <div style="position:absolute;bottom:16mm;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:3mm">
    <img src="${IMG.m3logo}" style="height:24mm;background:var(--cream);border-radius:4mm;padding:2mm 5mm">
    <div style="font-size:8.6pt;color:#dfe6ff">This plan, its content and the campaign kit were prepared with the <span class="ar">مصنع المحتوى</span> (Content Factory) app.</div>
  </div>
</section>`);

async function build() {
  const fonts = fs.readFileSync(path.join(L.ROOT, 'fonts/tajawal.css'), 'utf8').replace(/FONTDIR/g, 'file://' + path.join(L.ROOT, 'fonts'));
  const html = L.page({ w: 794, h: 1123, body: pages.join('\n'), css: fonts + CSS }).replace('<div class="cv ">', '<div>');
  const f = await L.writeHtml(html);
  const b = await L.browser();
  const pgx = await b.newPage();
  await pgx.goto('file://' + f, { waitUntil: 'load' });
  await pgx.evaluate(() => document.fonts.ready);
  const out = path.join(L.OUT, 'PLI_Campaign_Plan_Grow_Where_You_Teach.pdf');
  await pgx.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  // overflow check per page
  const of = await pgx.evaluate(() => [...document.querySelectorAll('.pg')].map((p, i) => { const last = [...p.children].filter((c) => !c.classList.contains('foot')).pop(); const r = last ? last.getBoundingClientRect() : { bottom: 0 }; const pr = p.getBoundingClientRect(); return r.bottom > pr.bottom - 40 ? i + 1 : 0; }).filter(Boolean));
  await pgx.close();
  console.log('pdf', out, 'pages', pages.length, 'overflowing pages:', of);
  await L.closeBrowser();
}
build().catch((e) => { console.error(e); process.exit(1); });

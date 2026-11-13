// Scene scripts for V01–V14 (+V01b, V03b) — on-screen text from plan 3.1 scene tables; `at` = spoken phrase that starts the scene.
const L = require('../lib');
const vo = (id) => L.ct(L.C.videos.find((v) => v.id === id).vo);
const PH = L.PH;
const CONTACT = 'Link in bio · pli@aca.edu.kw';
const P = { trio: L.PHOTO.trio, ceremony: L.PHOTO.ceremony, class: L.PHOTO.class };
const C30 = (a, b, c) => [{ n: 30, label: 'CREDITS', at: a }, { n: 10, label: 'COURSES', at: b }, { n: 18, label: 'MONTHS', at: c }];

const S = {};

S.V01 = { vo: vo('V01'), cover: 1, scenes: [
  { type: 'stamp', bg: 'cream', lines: [{ text: 'LOOK AROUND', size: 168 }, { text: 'YOUR STAFF ROOM.', size: 168 }] },
  { type: 'dots', bg: 'cream', at: 'More than six', pre: 'MORE THAN', big: '6 IN 10', count: 62, sub: "of our past master's students were ACA educators" },
  { type: 'photo', bg: 'indigo', at: 'Teaching full days', photo: P.trio, lines: ['TEACHING FULL DAYS.', 'Earning a US degree.'] },
  { type: 'bars', bg: 'cream', at: 'Same campus', items: [{ text: 'SAME CAMPUS', at: 'Same campus' }, { text: 'SAME SCHEDULE', at: 'Same schedule' }, { text: 'SAME BUSY WEEKS', at: 'Same busy' }] },
  { type: 'counters', bg: 'indigo', at: 'The Master of Arts', head: 'MASTER OF ARTS IN EDUCATION', items: C30('thirty credits', 'ten courses', 'eighteen months') },
  { type: 'stack', bg: 'deep', at: 'Your colleagues already', lines: [{ text: 'YOUR COLLEAGUES', size: 140 }, { text: 'ALREADY DID IT.', size: 140 }, { text: 'YOUR TURN.', size: 190, color: 'peri', pop: true, at: 'Your turn' }] },
  { type: 'end', at: 'Applications for the', lines: ['JANUARY COHORT', 'Applications open', CONTACT], cta: 'Apply now' },
] };
S.V01b = { ...S.V01, vo: vo('V01').replace('January cohort', 'March cohort'), scenes: S.V01.scenes.map((s) => (s.type === 'end' ? { ...s, lines: ['MARCH COHORT', 'Applications open', CONTACT] } : s)) };

S.V02 = { vo: vo('V02'), cover: 0, scenes: [
  { type: 'stamp', bg: 'indigo', lines: [{ text: "A MASTER'S", size: 160 }, { text: 'WITHOUT PAUSING', size: 140 }, { text: 'YOUR CAREER?', size: 160, color: 'peri' }] },
  { type: 'stack', bg: 'cream', at: "Here's the Saint", img: 'smu', lines: [{ text: "Saint Mary's University of Minnesota", serif: true, size: 78, color: 'deep' }, { text: 'MASTER OF ARTS IN EDUCATION', size: 130 }], sub: 'Delivered in Kuwait' },
  { type: 'stack', bg: 'peri', at: 'Specialised in', lines: [{ text: 'CURRICULUM &', size: 150 }, { text: 'INSTRUCTION', size: 150 }], sub: 'For teachers deepening classroom practice' },
  { type: 'counters', bg: 'indigo', at: 'Thirty credits', items: C30('Thirty credits', 'Ten courses', 'Eighteen months') },
  { type: 'planner', bg: 'cream', at: 'Classes meet', head: 'IN PERSON · EVERY WEEK', hi: 2, labels: ['', '', '', '', ''], hiLabel: 'MAED', htAt: { at: 'every week' }, sub: 'Built for working educators' },
  { type: 'blocks', bg: 'indigo', at: 'You pay monthly', head: 'PAY MONTHLY', total: 18, waived: 0, label: '18 monthly payments, not one lump sum' },
  { type: 'icon', bg: 'cream', at: "And it's a US", icon: 'shield', lines: [{ text: 'ACCREDITED IN THE US', size: 116 }, { text: 'by the Higher Learning Commission', at: 'Higher Learning' }] },
  { type: 'end', at: 'Keep teaching', lines: ['KEEP TEACHING. KEEP GROWING.', 'Next cohort: January', CONTACT], cta: 'Apply now' },
] };

S.V03 = { vo: vo('V03'), cover: 1, scenes: [
  { type: 'stamp', bg: 'cream', lines: [{ text: "LET'S TALK", size: 190 }, { text: 'MONEY.', size: 230, color: 'deep' }] },
  { type: 'bars', bg: 'indigo', at: "You don't pay", items: [{ text: 'NO LUMP SUM', at: "You don't pay" }, { text: 'PAY MONTHLY', at: 'You pay monthly' }, { text: 'OVER 18 MONTHS', at: 'over eighteen' }] },
  { type: 'tags', bg: 'cream', at: 'ACA staff get', head: 'ACA STAFF RATE', tags: ['+ PL STIPEND', '+ SIGNING BONUS'], tagAt: [{ at: 'professional learning' }, { at: 'signing bonus' }], foot: 'ACA staff' },
  { type: 'blocks', bg: 'indigo', at: 'And when colleagues', head: 'REFER COLLEAGUES → FINAL PAYMENTS WAIVED*', headSize: 84, total: 18, waived: 2, wAt: { at: 'final payments' }, label: '*Terms apply' },
  { type: 'stack', bg: 'cream', at: "A master's degree, one", lines: [{ text: "A MASTER'S DEGREE.", size: 140 }, { text: 'ONE MONTH', size: 190, color: 'deep', at: 'one month' }, { text: 'AT A TIME.', size: 190, color: 'deep' }] },
  { type: 'end', at: 'Ask us for', lines: ['ASK FOR YOUR PAYMENT PLAN', 'January cohort · Applications open', CONTACT, '*Terms apply'], size: 120, cta: 'DM “PLAN”' },
] };
S.V03b = { ...S.V03, scenes: S.V03.scenes.map((s) => (s.type === 'end' ? { ...s, lines: ['ASK FOR YOUR PAYMENT PLAN', 'March cohort · Applications open', CONTACT, '*Terms apply'] } : s)) };

S.V04 = { vo: vo('V04'), cover: 4, scenes: [
  { type: 'stack', bg: 'deep', lines: [{ text: "YOU'VE LED TEAMS.", size: 140 }, { text: 'DEPARTMENTS.', size: 140, at: 'Departments' }, { text: 'A WHOLE SCHOOL.', size: 140, color: 'peri', at: 'whole school' }] },
  { type: 'stack', bg: 'deep', at: "So what's next", lines: [{ text: "So what's next?", serif: true, italic: true, size: 150, color: 'cream' }] },
  { type: 'icon', bg: 'cream', at: 'The Doctorate in', icon: 'cap', lines: [{ text: 'ED.D IN EDUCATIONAL LEADERSHIP', size: 110 }, { text: "Saint Mary's University of Minnesota", at: "Saint Mary's" }] },
  { type: 'counters', bg: 'indigo', at: 'Thirty-nine credits', items: [{ n: 39, label: 'CREDITS', at: 'Thirty-nine credits' }, { n: 3, label: 'YEARS', at: 'three years' }], foot: 'FULLY ONLINE + LOCAL COHORT', footAt: { at: 'Fully online' } },
  { type: 'stamp', bg: 'cream', at: 'And no dissertation', lines: [{ text: 'NO', size: 260, color: 'deep' }, { text: 'DISSERTATION', size: 170 }], strike: true },
  { type: 'bars', bg: 'indigo', at: "It's designed", head: 'FOR LEADERS WITH', items: [{ text: '10+ YEARS OF', at: 'ten or more' }, { text: 'LEADERSHIP EXPERIENCE', at: 'leadership experience' }] },
  { type: 'split', at: 'Pay monthly', a: { tag: 'Option 1', title: 'PAY MONTHLY', sub: 'over 36 months', bg: 'peri' }, b: { tag: 'Option 2', title: 'PAY MONTHLY', sub: 'over 48 months', bg: 'indigo', at: 'forty-eight' } },
  { type: 'end', bg: 'deep', at: 'Lead the next', lines: ['LEAD THE NEXT CHAPTER.', 'Ask about the Ed.D', CONTACT], cta: 'Ask about the Ed.D' },
] };

S.V05 = { vo: vo('V05'), cover: 1, scenes: [
  { type: 'planner', bg: 'cream', head: 'SUNDAY: TEACH. MONDAY: TEACH.', headSize: 100, hi: -1 },
  { type: 'planner', bg: 'indigo', at: 'And each week', head: '+ ONE CLASS NIGHT WITH YOUR COHORT', headSize: 96, hi: 2, labels: ['', '', '', '', ''], hiLabel: 'MAED', htAt: { at: 'meet your cohort' }, sub: 'With educators who get it' },
  { type: 'stack', bg: 'cream', at: 'What you learn', lines: [{ text: 'LEARN IT THIS WEEK', size: 130 }, { text: '→ TRY IT NEXT WEEK', size: 130, color: 'deep', pop: true, at: 'try in your' }] },
  { type: 'stamp', bg: 'deep', at: 'Eighteen months later', lines: [{ text: '18 MONTHS', size: 220, color: 'peri' }, { text: 'LATER…', size: 220 }] },
  { type: 'photo', bg: 'cream', at: "you're holding", photo: P.ceremony, lines: ["…A MASTER'S DEGREE.", 'No career pause.'] },
  { type: 'end', at: "The Saint Mary's", lines: ['GROW WHERE YOU TEACH.', "Saint Mary's University of Minnesota · MAED", CONTACT], cta: 'Ask about the next cohort' },
] };

S.V06 = { vo: vo('V06'), cover: 1, scenes: [
  { type: 'icon', bg: 'cream', icon: 'people', iconSize: 360, lines: [{ text: "A MASTER'S IS BETTER WITH FRIENDS.", size: 120 }] },
  { type: 'blocks', bg: 'indigo', at: 'Refer two', head: 'REFER 2 WHO ENROLL & COMPLETE → FINAL PAYMENT WAIVED', headSize: 88, total: 18, waived: 1, wAt: { at: 'final payment' }, label: 'Your final payment' },
  { type: 'blocks', bg: 'cream', at: 'Refer four', head: 'REFER 4 WHO REGISTER & CONTINUE → LAST 2 PAYMENTS WAIVED', headSize: 80, total: 18, waived: 2, wAt: { at: 'last two' }, label: 'Your last 2 payments' },
  { type: 'tags', bg: 'indigo', at: 'Bring your', tags: ['YOUR TEACHING PARTNER', 'YOUR GRADE TEAM', 'YOUR “ONE DAY” FRIEND'], tagAt: [{ at: 'teaching partner' }, { at: 'grade-level' }, { at: 'That friend' }], size: 60 },
  { type: 'end', at: 'Make it this', lines: ['MAKE IT THIS COHORT.', 'Terms apply · Ask us for details', CONTACT], cta: 'Tag your colleague' },
] };

S.V07 = { vo: vo('V07'), cover: 0, scenes: [
  { type: 'pulse', bg: 'indigo', head: 'NOT IN KUWAIT?', points: [{ label: 'KUWAIT', x: 0.4, y: 0.16 }, { label: 'BAHRAIN', x: 0.66, y: 0.42 }, { label: 'KSA', x: 0.26, y: 0.6 }, { label: 'QATAR', x: 0.74, y: 0.58 }, { label: 'UAE', x: 0.82, y: 0.78 }, { label: 'OMAN', x: 0.6, y: 0.92 }] },
  { type: 'icon', bg: 'cream', at: 'You can still', icon: 'laptop', iconSize: 320, lines: [{ text: 'STUDY ONLINE', size: 170 }, { text: "Saint Mary's University of Minnesota MAED", at: "Saint Mary's" }] },
  { type: 'checks', bg: 'indigo', at: 'Same programme', items: ['SAME PROGRAMME', 'SAME DEGREE', 'SAME DIPLOMA'], itemAt: [{ at: 'Same programme' }, { at: 'Same degree' }, { at: 'Same diploma' }], size: 76 },
  { type: 'counters', bg: 'cream', at: 'Thirty credits', items: C30('Thirty credits', 'ten courses', 'eighteen months') },
  { type: 'end', at: 'Grow wherever', lines: ['GROW WHEREVER YOU TEACH.', 'Online option · same degree', 'pli@aca.edu.kw'], cta: 'Message us' },
] };

S.V08 = { vo: vo('V08'), cover: 0, scenes: [
  { type: 'fork', bg: 'cream', head: "MASTER'S OR DOCTORATE?", a: 'MAED', b: 'ED.D', aAt: { at: 'Two directions' } },
  { type: 'stack', bg: 'peri', at: "The master's in", lines: [{ text: 'MAED', size: 190 }, { text: 'CURRICULUM & INSTRUCTION', size: 96 }], sub: 'For teachers deepening classroom practice' },
  { type: 'stack', bg: 'indigo', at: 'The doctorate in', lines: [{ text: 'ED.D', size: 190 }, { text: 'EDUCATIONAL LEADERSHIP', size: 100, color: 'peri' }], sub: 'For leaders with 10+ years of leadership experience' },
  { type: 'icon', bg: 'cream', at: 'Both are with', icon: 'cap', lines: [{ text: "SAINT MARY'S UNIVERSITY", size: 110 }, { text: 'of Minnesota', at: 'Minnesota' }] },
  { type: 'split', at: 'Love the classroom', a: { title: 'LOVE THE CLASSROOM?', sub: 'Go deeper.', bg: 'peri' }, b: { title: 'READY TO LEAD?', sub: 'Step up.', bg: 'indigo', at: 'Ready to lead' } },
  { type: 'end', at: 'Not sure which', lines: ['NOT SURE?', 'Book a 15-minute call', 'pli@aca.edu.kw'], cta: '15-minute call' },
] };

S.V09 = { vo: vo('V09'), cover: 0, scenes: [
  { type: 'question', bg: 'cream', q: 'IS IT ACCREDITED?', sub: 'Straight answers.' },
  { type: 'checks', bg: 'cream', at: "Saint Mary's University", icon: 'shield', items: ['Accredited by the Higher Learning Commission in the United States'], size: 58 },
  { type: 'stack', bg: 'cream', at: 'For expatriate', lines: [{ text: 'EXPATRIATE TEACHERS', size: 110 }], sub: "Acceptance of its MAED and Ed.D. qualifications for employment in Kuwait is subject to the relevant authorities' requirements and approval of the individual application." },
  { type: 'stack', bg: 'peri', at: 'For Kuwaiti', lines: [{ text: 'KUWAITI CITIZENS', size: 120 }], sub: 'Prospective Kuwaiti applicants should obtain confirmation from the Ministry of Higher Education and their employer regarding degree equivalency and eligibility for any salary or career benefits before enrolling.' },
  { type: 'end', at: 'Questions', lines: ['QUESTIONS? ASK US ANYTHING.', 'Straight answers', 'pli@aca.edu.kw'], cta: 'Ask us anything' },
] };

S.V10 = { vo: vo('V10'), cover: 0, scenes: [
  { type: 'bignum', bg: 'indigo', head: 'ONE WEEK LEFT.', num: 7, from: 7, to: 1, label: 'DAYS' },
  { type: 'stack', bg: 'cream', at: 'In eighteen months', lines: [{ text: 'IN 18 MONTHS:', size: 150 }, { text: "A MASTER'S DEGREE.", size: 150, color: 'deep', pop: true, at: "master's degree" }] },
  { type: 'stamp', bg: 'indigo', at: 'Or watching', lines: [{ text: 'OR THIS VIDEO', size: 150 }, { text: 'AGAIN NEXT YEAR.', size: 150, color: 'peri' }] },
  { type: 'bars', bg: 'cream', at: 'Thirty credits', items: [{ text: '30 CREDITS', at: 'Thirty credits' }, { text: '10 COURSES', at: 'Ten courses' }, { text: 'PAY MONTHLY', at: 'Pay monthly' }] },
  { type: 'end', at: 'Applications close', lines: ['APPLICATIONS CLOSE', PH.JAN_DEADLINE.visual, CONTACT], cta: 'Apply today' },
] };

S.V11 = { vo: vo('V11'), cover: 0, scenes: [
  { type: 'photo', bg: 'cream', photo: P.class, lines: ['WELCOME, JANUARY COHORT.'] },
  { type: 'dots', bg: 'cream', at: 'Teachers from our', pre: 'FROM OUR CLASSROOMS', big: 'AND BEYOND.', bigSize: 190, sub: 'Canadian · American · British · South African · Lebanese · Jordanian · Tunisian · Kuwaiti' },
  { type: 'stamp', bg: 'indigo', at: 'Missed it', lines: [{ text: 'MISSED IT?', size: 230 }] },
  { type: 'bignum', bg: 'cream', at: 'The next cohort', head: 'NEXT COHORT:', num: 'MAR', label: 'STARTS 15 MARCH' },
  { type: 'end', at: 'Same programme', lines: ['SAME PROGRAMME · SAME SUPPORT · SAME MONTHLY PLAN', 'March cohort · Applications open', CONTACT], size: 104, cta: 'Apply now' },
] };

S.V12 = { vo: vo('V12'), cover: 0, scenes: [
  { type: 'icon', bg: 'deep', icon: 'crescent', iconColor: 'peri', iconSize: 280, lines: [{ text: 'A MONTH OF REFLECTION.', size: 130 }] },
  { type: 'stack', bg: 'deep', at: 'Of asking', glow: true, lines: [{ text: 'Who do I want to become?', serif: true, italic: true, size: 120, color: 'cream' }] },
  { type: 'stack', bg: 'deep', at: 'For many educators', glow: true, lines: [{ text: 'For many educators, the answer starts in the classroom.', serif: true, size: 90, color: 'cream' }] },
  { type: 'icon', bg: 'indigo', at: 'Our team', icon: 'clock', iconColor: 'peri', lines: [{ text: 'EVENING CALLS', size: 150 }, { text: 'Available this Ramadan · after 9 pm' }] },
  { type: 'end', bg: 'deep', at: 'Ramadan Kareem, from', serif: true, lines: ['Ramadan Kareem', 'From the Professional Learning Institute'] },
] };

S.V13 = { vo: vo('V13'), cover: 0, scenes: [
  { type: 'stamp', bg: 'indigo', lines: [{ text: 'FINAL CALL', size: 220 }, { text: 'MARCH COHORT', size: 150, color: 'peri' }] },
  { type: 'split', at: 'Eighteen months from now', a: { tag: '18 months from now', title: '“STILL THINKING ABOUT IT”', bg: 'cream', size: 96 }, b: { tag: '…or', title: 'DONE.', bg: 'indigo', size: 220, at: 'or you can have' } },
  { type: 'counters', bg: 'cream', at: "Saint Mary's University", head: "SAINT MARY'S", items: [{ n: 30, label: 'CREDITS', at: 'Thirty credits' }, { n: 10, label: 'COURSES', at: 'Ten courses' }] },
  { type: 'stack', bg: 'indigo', at: 'Pay monthly', lines: [{ text: 'PAY MONTHLY.', size: 150 }, { text: 'ONE MONTH AT A TIME.', size: 120, color: 'peri', pop: true, at: 'one month' }] },
  { type: 'end', at: 'Applications close', lines: ['APPLICATIONS CLOSE', PH.MAR_DEADLINE.visual, CONTACT], cta: "Don't wait" },
] };

S.V14 = { vo: vo('V14'), cover: 4, scenes: [
  { type: 'icon', bg: 'cream', icon: 'hand', iconSize: 280, lines: [{ text: 'NEW TO ACA? WELCOME.', size: 140 }] },
  { type: 'stack', bg: 'indigo', at: "Here's something", lines: [{ text: "Here's something many new staff hear about later…", serif: true, italic: true, size: 96, color: 'cream' }] },
  { type: 'tags', bg: 'cream', at: 'Your signing bonus', head: "→ YOUR MASTER'S", tags: ['SIGNING BONUS', '+ PL STIPEND'], tagAt: [{ at: 'signing bonus' }, { at: 'professional learning' }] },
  { type: 'stack', bg: 'indigo', at: "The Saint Mary's", lines: [{ text: 'ACA STAFF RATE', size: 150 }, { text: 'PAY MONTHLY', size: 130, color: 'peri', pop: true, at: 'staff rate' }], sub: "Saint Mary's University of Minnesota MAED · in Kuwait" },
  { type: 'dots', bg: 'cream', at: 'More than six', pre: 'MORE THAN', big: '6 IN 10', count: 62, sub: 'of our past students were ACA educators' },
  { type: 'end', at: 'Start your first', lines: ['START YOUR FIRST YEAR WITH A PLAN.', 'ACA staff rate · pay monthly', CONTACT], size: 110, cta: 'Ask us' },
] };

Object.entries(S).forEach(([id, s]) => (s.id = id));
module.exports = S;

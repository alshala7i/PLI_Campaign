// npm run final — refuses to publish while any placeholder is unconfirmed (plan 5.5 rule 2).
const ph = require('../config/placeholders.json');
const open = Object.entries(ph).filter(([, v]) => !v.confirmed);
if (open.length) { console.error(`✋ ${open.length} placeholders are not confirmed:\n` + open.map(([k, v]) => ` - ${k}: ${v.what} (proposed: ${v.proposed || '—'})`).join('\n') + '\nSet "confirmed": true in config/placeholders.json after PLI confirms each value, then run again.'); process.exit(1); }
console.log('All placeholders confirmed — rendering final assets.');

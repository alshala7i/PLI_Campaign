// ElevenLabs TTS with timestamps (cached by text+voice+model hash). Never prints the key.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const CACHE = path.join(ROOT, 'cache/tts');
fs.mkdirSync(CACHE, { recursive: true });

const MODEL = process.env.TTS_MODEL || 'eleven_v4_turbo';
const VOICES = {
  eric: { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', gender: 'male', desc: 'Smooth, trustworthy · American' },
  chris: { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', desc: 'Charming, down-to-earth · American' },
  brian: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', desc: 'Deep, resonant, comforting · American' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'female', desc: 'Mature, reassuring, confident · American' },
  matilda: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', desc: 'Knowledgeable, professional · American' },
  bella: { id: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella', gender: 'female', desc: 'Professional, bright, warm · American' },
};

// Pronunciation for TTS input only (captions keep the display words). One token -> one token.
const PRON = [[/\bACA\b/g, 'A.C.A.']];
function ttsText(display) {
  let t = display;
  for (const [re, rep] of PRON) t = t.replace(re, rep);
  return t;
}

async function synth(displayText, voiceKey, { settings } = {}) {
  const v = VOICES[voiceKey];
  if (!v) throw new Error('unknown voice ' + voiceKey);
  const text = ttsText(displayText).replace(/\n+/g, '\n');
  const vs = settings || { stability: 0.5, similarity_boost: 0.78, style: 0.15, use_speaker_boost: true, speed: 1.0 };
  const key = crypto.createHash('sha1').update(JSON.stringify([text, v.id, MODEL, vs])).digest('hex').slice(0, 16);
  const mp3 = path.join(CACHE, key + '.mp3');
  const js = path.join(CACHE, key + '.json');
  if (fs.existsSync(mp3) && fs.existsSync(js)) return { mp3, ...JSON.parse(fs.readFileSync(js, 'utf8')), cached: true };
  if (!process.env.ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY missing');
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: vs }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const d = await res.json();
  fs.writeFileSync(mp3, Buffer.from(d.audio_base64, 'base64'));
  const al = d.normalized_alignment || d.alignment;
  const words = toWords(text, displayText, al);
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
  const meta = { text, display: displayText, voice: voiceKey, model: MODEL, chars: text.length, duration: dur, words };
  fs.writeFileSync(js, JSON.stringify(meta));
  return { mp3, ...meta, cached: false };
}

// Character alignment -> word timings, mapped back onto display words (same token count).
function toWords(text, display, al) {
  const chars = al.characters, st = al.character_start_times_seconds, en = al.character_end_times_seconds;
  const out = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (/\s/.test(ch)) { if (cur) { out.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: '', s: st[i], e: en[i] };
    cur.w += ch; cur.e = en[i];
  }
  if (cur) out.push(cur);
  const disp = display.split(/\s+/).filter(Boolean);
  if (disp.length === out.length) out.forEach((o, k) => (o.d = disp[k]));
  else out.forEach((o) => (o.d = o.w.replace(/A\.C\.A\./g, 'ACA')));
  return out;
}

module.exports = { synth, VOICES, MODEL };

if (require.main === module) {
  (async () => {
    const [voice, ...rest] = process.argv.slice(2);
    const r = await synth(rest.join(' ') || 'Grow where you teach.', voice || 'eric');
    console.log(JSON.stringify({ ...r, words: r.words.length }, null, 1));
  })().catch((e) => { console.error(e.message); process.exit(1); });
}

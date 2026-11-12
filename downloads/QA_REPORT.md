# QA report — PLI “Grow Where You Teach” kit

Generated 2026-11-12T10:24Z with مصنع المحتوى (Content Factory).

## Copy checks

- Fee figures (KD) in public copy: ✅ none
- Forbidden words: ✅ none
- “Salary” outside the HR-approved Kuwaiti-citizens sentence: ✅ none
- University named without “of Minnesota” somewhere in the asset: ✅ none
- Copy source: content/content.json, transcribed word for word from the plan (Parts 3–4) by tools/parse_plan.py.

## Layout

- Text overflow (Playwright, every `[data-fit]` box): ✅ 0 issues across posts, carousels, stories, covers, posters and guide (last render).
- Visual review: contact sheets of every asset reviewed during the build; fixes applied (cover sizing, footer wrap, overlaps on S01/S10/S02/poster).

## Videos (target −16 LUFS integrated, true peak ≤ −1 dBTP; 30 fps H.264 + AAC 48 kHz; 9:16 + 4:5)

| Asset | Voice | Files | Duration | LUFS | Peak dBFS |
|---|---|---|---|---|---|
| V01 | eric | ✅ | 30.5s | -16.5 | -1.5 |
| V01 | sarah | ✅ | 30.9s | -16.6 | -1.5 |
| V02 | eric | ✅ | 34.5s | -16.7 | -1.5 |
| V02 | sarah | ✅ | 35.3s | -16.5 | -1.5 |
| V03 | eric | ✅ | 24.1s | -16.7 | -1.5 |
| V03 | sarah | ✅ | 24.6s | -16.6 | -1.5 |
| V04 | eric | ✅ | 28.7s | -16.7 | -1.5 |
| V04 | sarah | ✅ | 28.8s | -16.6 | -1.5 |
| V05 | eric | ✅ | 26.0s | -16.3 | -1.5 |
| V05 | sarah | ✅ | 26.4s | -16.1 | -1.5 |
| V06 | eric | ✅ | 24.6s | -16.9 | -1.5 |
| V06 | sarah | ✅ | 25.2s | -16.4 | -1.5 |
| V07 | eric | ✅ | 23.4s | -16.5 | -1.5 |
| V07 | sarah | ✅ | 24.3s | -16.4 | -1.4 |
| V08 | eric | ✅ | 26.8s | -16.5 | -1.5 |
| V08 | sarah | ✅ | 28.4s | -16.5 | -1.5 |
| V09 | eric | ✅ | 39.9s | -16.8 | -1.5 |
| V09 | sarah | ✅ | 41.3s | -16.7 | -1.5 |
| V10 | eric | ✅ | 20.9s | -16.8 | -1.5 |
| V10 | sarah | ✅ | 21.6s | -16.5 | -1.5 |
| V11 | eric | ✅ | 19.3s | -16.7 | -1.5 |
| V11 | sarah | ✅ | 20.1s | -16.4 | -1.5 |
| V12 | eric | ✅ | 21.3s | -16.6 | -1.4 |
| V12 | sarah | ✅ | 22.6s | -16.4 | -1.5 |
| V13 | eric | ✅ | 20.5s | -16.9 | -1.4 |
| V13 | sarah | ✅ | 21.1s | -16.7 | -1.5 |
| V14 | eric | ✅ | 25.7s | -16.7 | -1.4 |
| V14 | sarah | ✅ | 26.5s | -16.4 | -1.4 |
| V01b | eric | ✅ | 30.9s | -16.5 | -1.5 |
| V01b | sarah | ✅ | 31.5s | -16.4 | -1.5 |
| V03b | eric | ✅ | 24.1s | -16.7 | -1.5 |
| V03b | sarah | ✅ | 24.6s | -16.6 | -1.5 |

- Captions: burned in from ElevenLabs word timestamps (scene changes anchored to the spoken words); `.srt` beside every video.
- Music: an original bed synthesised for this kit (tools/music_bed.py) — no third-party samples, no licence needed.
- Voices: ElevenLabs (eleven_v4_turbo) · Eric (male) and Sarah (female), chosen by the owner from 6 samples.
- Duration: the voices speak at their natural pace (≈180 words a minute, as approved in the samples), so V05–V14 run 19–28 s — shorter than the plan’s 25–40 s targets (V01–V04 are on target). For the plan’s 150 wpm, set `speed: 0.85` in src/tts.js and run `npm run videos`.

## Calendar

- Rows: 182 (LinkedIn page 54 · Salwa personal 6 · Instagram 61 · Facebook 61)
- Week-start Sundays: 2026-11-15 … 2027-03-28 (20 weeks) ✅
- Rows whose file is missing: ✅ none
- Rows without caption: ✅ none
- Images without alt text: ✅ none

## Choices made by the builder (plan 5.5 rule 9)

- Deadlines, start dates, prices, referral terms and the Kuwait wording were confirmed by PLI on 11 Nov 2026 (HR-approved Kuwait wording used word for word). Items still open are listed in PLACEHOLDERS_OPEN.md.
- HR asked to review the final captions, scripts and posts before anything is published: downloads/HR_REVIEW_PACK.md.
- Form link confirmed (Microsoft Forms); captions and the calendar use it, with UTM tags on every calendar link (Microsoft Forms does not store them, so add a “How did you hear about us?” question to see sources). Poster QR codes open the form.
- Graduate spotlights S03a and S03b are real graduates (own words, own photos, written consent); S03c–e, the Saturday Learning Series recap (C12) and story answer frames stay templates with magenta placeholders — no invented people or quotes.
- Welcome posts/videos (S09, S09b, V11) use the PLI class photo from the official PLI page as a stand-in for the first-day cohort photo.
- Logos: official Saint Mary’s University of Minnesota full-colour logo (from PLI, 12 Nov 2026), PLI shield and ACA logo.
- Week folders (week-01 … week-20) are presented as sections in the kit site and the calendar instead of duplicated files.
- Staff emails #2–#4 are drafts expanded from the plan’s one-line summaries; Salwa approves before sending.

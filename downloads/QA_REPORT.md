# QA report — PLI “Grow Where You Teach” kit

Generated 2026-11-08T07:18Z with مصنع المحتوى (Content Factory).

## Copy checks

- Prices outside the allowed list: ✅ none
- Forbidden words: ✅ none
- “Civil Service Commission” appears only in: C07, C07b (allowed: C07, C07b, V09 FAQ context and the programme guide)
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
| V02 | eric | ✅ | 34.5s | -16.7 | -1.4 |
| V02 | sarah | ✅ | 35.3s | -16.5 | -1.5 |
| V03 | eric | ✅ | 32.7s | -16.8 | -1.5 |
| V03 | sarah | ✅ | 33.5s | -16.8 | -1.4 |
| V04 | eric | ❌ missing | s |  |  |
| V04 | sarah | ❌ missing | s |  |  |
| V05 | eric | ❌ missing | s |  |  |
| V05 | sarah | ❌ missing | s |  |  |
| V06 | eric | ❌ missing | s |  |  |
| V06 | sarah | ❌ missing | s |  |  |
| V07 | eric | ❌ missing | s |  |  |
| V07 | sarah | ❌ missing | s |  |  |
| V08 | eric | ❌ missing | s |  |  |
| V08 | sarah | ❌ missing | s |  |  |
| V09 | eric | ❌ missing | s |  |  |
| V09 | sarah | ❌ missing | s |  |  |
| V10 | eric | ❌ missing | s |  |  |
| V10 | sarah | ❌ missing | s |  |  |
| V11 | eric | ❌ missing | s |  |  |
| V11 | sarah | ❌ missing | s |  |  |
| V12 | eric | ❌ missing | s |  |  |
| V12 | sarah | ❌ missing | s |  |  |
| V13 | eric | ❌ missing | s |  |  |
| V13 | sarah | ❌ missing | s |  |  |
| V14 | eric | ❌ missing | s |  |  |
| V14 | sarah | ❌ missing | s |  |  |
| V01b | eric | ✅ | 30.9s | -16.6 | -1.5 |
| V01b | sarah | ✅ | 31.5s | -16.5 | -1.5 |
| V03b | eric | ✅ | 32.7s | -16.8 | -1.5 |
| V03b | sarah | ✅ | 33.5s | -16.8 | -1.4 |

- Captions: burned in from ElevenLabs word timestamps (scene changes anchored to the spoken words); `.srt` beside every video.
- Music: an original bed synthesised for this kit (tools/music_bed.py) — no third-party samples, no licence needed.
- Voices: ElevenLabs (eleven_v4_turbo) · Eric (male) and Sarah (female), chosen by the owner from 6 samples.

## Calendar

- Rows: 177 (LinkedIn page 53 · Salwa personal 6 · Instagram 59 · Facebook 59)
- Week-start Sundays: 2026-11-15 … 2027-03-28 (20 weeks) ✅
- Rows whose file is missing: 2026-12-06 Facebook V08, 2026-12-06 Instagram V08, 2026-12-13 Facebook V10, 2026-12-13 Instagram V10, 2026-12-13 LinkedIn (PLI page) V10, 2026-12-27 Facebook V04, 2026-12-27 Instagram V04, 2026-12-29 LinkedIn (PLI page) V04, 2027-01-07 Facebook V11, 2027-01-07 Instagram V11, 2027-01-12 Facebook V14, 2027-01-12 Instagram V14, 2027-01-12 LinkedIn (PLI page) V11, 2027-01-13 LinkedIn (PLI page) V14, 2027-01-17 Facebook V06, 2027-01-17 Instagram V06, 2027-01-19 LinkedIn (PLI page) V06, 2027-01-31 Facebook V07, 2027-01-31 Instagram V07, 2027-01-31 LinkedIn (PLI page) V07, 2027-02-04 Facebook V05, 2027-02-04 Instagram V05, 2027-02-10 LinkedIn (PLI page) V09, 2027-02-11 Facebook V12, 2027-02-11 Instagram V12, 2027-02-17 LinkedIn (PLI page) V08, 2027-02-18 Facebook V09, 2027-02-18 Instagram V09, 2027-02-21 LinkedIn (PLI page) V12, 2027-02-28 LinkedIn (PLI page) V05, 2027-03-16 Facebook V13, 2027-03-16 Instagram V13, 2027-03-16 LinkedIn (PLI page) V13
- Rows without caption: ✅ none
- Images without alt text: ✅ none

## Choices made by the builder (plan 5.5 rule 9)

- Unconfirmed dates are rendered with the plan’s proposed values (e.g. SUN 20 DEC) so assets look final; every one is listed in PLACEHOLDERS_OPEN.md and must be confirmed before publishing.
- No form link exists yet: visuals say “Link in bio · pli@aca.edu.kw”; captions keep a visible {{APPLY_LINK}} (the kit site replaces it once you type the link). Poster QR codes open an email to pli@aca.edu.kw until the form exists.
- Graduate spotlights (S03a–e), Saturday Learning Series recap (C12) and story answer frames are templates with magenta placeholders — no invented people or quotes.
- Welcome posts/videos (S09, S09b, V11) use the PLI class photo from the official PLI page as a stand-in for the first-day cohort photo.
- Logos: PLI shield (LinkedIn page logo, 200 px — replace with the original file when available), ACA logo and Saint Mary’s logo from the official sites. The positive Saint Mary’s version was produced from the official reverse (white) file by setting the wordmark to ink; please replace with the official full-colour file.
- Week folders (week-01 … week-20) are presented as sections in the kit site and the calendar instead of duplicated files.
- Staff emails #2–#4 are drafts expanded from the plan’s one-line summaries; Salwa approves before sending.

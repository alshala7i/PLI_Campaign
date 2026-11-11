# Grow Where You Teach — PLI Campaign Kit

**Live kit:** https://alshala7i.github.io/PLI_Campaign/

The complete social-media campaign for the Professional Learning Institute (American Creativity Academy, Kuwait): the Saint Mary's University of Minnesota MAED and Ed.D cohorts of January (classes from 4 January) and March 2027 (classes from 15 March).

Made entirely with the **مصنع المحتوى (Content Factory)** app: strategy, design, motion, voiceover, captions and calendar.

## What is inside

| Folder | Contents |
|---|---|
| `index.html` | The kit page: calendar, videos, carousels, posts, stories, LinkedIn posts, ads, emails, files |
| `assets/videos/` | 16 motion videos (V01–V14 + V01b, V03b) × 2 voices (Eric · male, Sarah · female) × Reel 9:16 + feed 4:5, with `.srt`, voiceover `.mp3` and Reel cover |
| `assets/carousels/` | 18 carousels (PNG slides 1080×1350) + one LinkedIn PDF each |
| `assets/posts/` | 26 single posts (1080×1350) |
| `assets/stories/` | 31 story frames (1080×1920) |
| `assets/extras/` | Highlight covers, LinkedIn/Facebook covers, A3 staff-room posters, 2-page programme guide, staff emails, Instagram bio |
| `downloads/` | Campaign plan PDF, calendar (CSV + Excel with lead tracker), all captions, QA report, open placeholders, zip of images + docs |
| `source/` | The generator: re-render everything after PLI confirms the placeholders |

## Before publishing

PLI confirmed on 11 Nov 2026: deadlines (Thu 24 Dec · Fri 5 Mar), start dates (Mon 4 Jan · Mon 15 Mar), prices, the Ed.D price (same for everyone), referral terms and the HR-approved Kuwait wording (used word for word). HR reviews every caption, script and post before publishing: `downloads/HR_REVIEW_PACK.md`. Still open (`downloads/PLACEHOLDERS_OPEN.md`): the form link, graduate spotlights (S03a–e, 4 consenting graduates), logos/photos, who runs the accounts and the ad budget.

## Re-render (after editing `source/config/placeholders.json`)

```bash
cd source && npm install
```

```bash
npm run all
```

Single parts: `npm run posts` · `carousels` · `extras` · `videos` · `calendar` · `plan` · `preview`. `npm run final` refuses to render while any placeholder is unconfirmed. Videos need `ELEVENLABS_API_KEY`; voiceovers already generated are cached in `source/cache/tts`, so only changed lines cost new characters. The music bed is original (`npm run music` regenerates it).

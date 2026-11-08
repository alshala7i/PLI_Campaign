"""Parse PLI_Marketing_Plan.md word-for-word into content/content.json (single source of truth)."""
import re, json, sys, os
src = open(sys.argv[1], encoding='utf-8').read()
lines = src.split('\n')

def section(start_pat, end_pat):
    s = next(i for i, l in enumerate(lines) if re.match(start_pat, l))
    e = next(i for i in range(s + 1, len(lines)) if re.match(end_pat, lines[i]))
    return lines[s:e]

def quote_block(ls, i):
    out = []
    while i < len(ls) and (ls[i].startswith('>') or (ls[i].strip() == '' and i + 1 < len(ls) and ls[i + 1].startswith('>'))):
        t = ls[i][1:].strip() if ls[i].startswith('>') else ''
        out.append(t); i += 1
    # collapse blank lines into paragraph breaks
    txt = '\n'.join(out).strip()
    txt = re.sub(r'\n{2,}', '\n\n', txt)
    return txt, i

def table(ls, i):
    rows = []
    while i < len(ls) and ls[i].startswith('|'):
        cells = [c.strip() for c in ls[i].strip().strip('|').split('|')]
        rows.append(cells); i += 1
    hdr, body = rows[0], [r for r in rows[2:]]
    return hdr, body, i

def strip_md(s):
    return re.sub(r'\*\*(.+?)\*\*', r'\1', s).replace('`', '')

def hashtags(t):
    return re.findall(r'#\w+', t)

content = {'videos': [], 'carousels': [], 'posts': [], 'linkedin': [], 'stories': [], 'ads': {}, 'emails': [], 'calendar': []}

# ---------- videos
vs = section(r'## 3\.1 ', r'## 3\.2 ')
i = 0
while i < len(vs):
    m = re.match(r'### (V\d+) — "(.+?)"\s+\((.+)\)', vs[i])
    if not m: i += 1; continue
    v = {'id': m.group(1), 'title': m.group(2), 'meta': m.group(3)}
    i += 1
    while i < len(vs) and not vs[i].startswith('### '):
        l = vs[i]
        if l.startswith('**Objective:**'): v['objective'] = l.split('**Objective:**')[1].strip()
        if l.startswith('**Voiceover'):
            v['vo'], i = quote_block(vs, i + 1); continue
        if l.startswith('| # | Time'):
            hdr, body, i = table(vs, i)
            v['scenes'] = [{'n': int(r[0]), 'time': r[1], 'text': r[2], 'visual': r[3]} for r in body]; continue
        if l.startswith('**IG/FB caption:**'):
            v['caption_ig'], i = quote_block(vs, i + 1); continue
        if l.startswith('**LinkedIn caption:**'):
            v['caption_li'], i = quote_block(vs, i + 1); continue
        if l.startswith('> ⚠️'): v['note'] = l[1:].strip()
        i += 1
    pm = re.search(r'\b(P\d)\b', v['meta']); v['pillar'] = pm.group(1) if pm else ''
    content['videos'].append(v)

# ---------- carousels
cs = section(r'## 3\.2 ', r'## 3\.3 ')
i = 0
while i < len(cs):
    m = re.match(r'### (C\d+) — "(.+?)"(.*?)\s+\((.+)\)\s*$', cs[i])
    if not m: i += 1; continue
    c = {'id': m.group(1), 'title': m.group(2), 'meta': m.group(4), 'slides': []}
    i += 1
    while i < len(cs) and not cs[i].startswith('### '):
        l = cs[i]
        sm = re.match(r'(\d+)\. (.+)$', l)
        if sm and not l.startswith('**'):
            c['slides'].append(sm.group(2).strip())
        elif l.startswith('**IG/FB caption:**'):
            rest = l.split('**IG/FB caption:**')[1].strip()
            if rest: c['caption_ig'] = rest
            else:
                c['caption_ig'], i = quote_block(cs, i + 1); continue
        elif l.startswith('**LinkedIn caption:**'):
            rest = l.split('**LinkedIn caption:**')[1].strip()
            if rest: c['caption_li'] = rest
            else:
                c['caption_li'], i = quote_block(cs, i + 1); continue
        elif l.startswith('**Caption:**'):
            c['caption_ig'] = l.split('**Caption:**')[1].strip()
        elif l.strip() and not l.startswith('---'):
            c.setdefault('notes', []).append(l.strip())
        i += 1
    pm = re.search(r'\b(P\d)', c['meta']); c['pillar'] = pm.group(1) if pm else ''
    content['carousels'].append(c)

# ---------- posts
ps = section(r'## 3\.3 ', r'## 3\.4 ')
i = next(k for k, l in enumerate(ps) if l.startswith('| ID |'))
hdr, body, _ = table(ps, i)
for r in body:
    pid = strip_md(r[0]); txt = r[2]
    d = {'id': pid, 'pillar': r[1], 'raw': txt, 'visual': r[3], 'caption_ig': r[4]}
    for key, lab in (('h', 'H'), ('sub', 'Sub'), ('tag', 'Tag')):
        mm = re.search(r'\*\*' + lab + r':\*\*\s*(.+?)(?=\s*·\s*\*\*(?:H|Sub|Tag):\*\*|$)', txt)
        if mm: d[key] = mm.group(1).strip()
    content['posts'].append(d)

# ---------- linkedin text posts
ls_ = section(r'## 3\.4 ', r'## 3\.5 ')
i = 0
while i < len(ls_):
    m = re.match(r'\*\*(L\d+) — "(.+?)" \((.+?)\)\*\*', ls_[i])
    if m:
        body, i = quote_block(ls_, i + 1)
        content['linkedin'].append({'id': m.group(1), 'title': m.group(2), 'when': m.group(3), 'text': body}); continue
    i += 1

# ---------- stories
ss = section(r'## 3\.5 ', r'## 3\.6 ')
i = next(k for k, l in enumerate(ss) if l.startswith('| ID |'))
hdr, body, _ = table(ss, i)
for r in body:
    content['stories'].append({'id': strip_md(r[0]), 'use': r[1], 'frames': r[2]})

# ---------- ads
ad = section(r'## 3\.6 ', r'## 3\.7 ')
prim = [re.sub(r'^\d+\.\s*', '', l) for l in ad if re.match(r'\d+\. ', l)]
content['ads']['primary_text'] = prim
for l in ad:
    if l.startswith('**Headlines'): content['ads']['headlines'] = [h.strip() for h in l.split(':**', 1)[1].split('·')]
    if l.startswith('**CTA buttons:**'): content['ads']['cta_buttons'] = l.split(':**', 1)[1].strip()
    if l.startswith('**Lead form thank-you'): content['ads']['thank_you'] = l.split(':**', 1)[1].strip()
content['ads']['lead_form_questions'] = next(l for l in lines if l.startswith('**Lead form questions')).split(':**', 1)[1].strip()

# ---------- emails + supporting
sm_ = section(r'## 3\.7 ', r'^# PART 4')
i = 0
while i < len(sm_):
    l = sm_[i]
    m = re.match(r'\*\*(Staff email #\d) \((Week \d+)\) — Subject: (.+?)\*\*(.*)$', l)
    if m:
        e = {'id': m.group(1), 'week': m.group(2), 'subject': m.group(3)}
        if m.group(4).strip():
            e['summary'] = m.group(4).strip(' ·')
            i += 1
        else:
            e['body'], i = quote_block(sm_, i + 1)
        content['emails'].append(e); continue
    if l.startswith('**Staff-room poster'): content['poster_spec'] = strip_md(l)
    if l.startswith('**Programme guide'): content['guide_spec'] = strip_md(l)
    i += 1

# ---------- calendar
cal = section(r'## 4\.3 ', r'## 4\.4 ')
i = next(k for k, l in enumerate(cal) if l.startswith('| Wk |'))
hdr, body, _ = table(cal, i)
for r in body:
    content['calendar'].append({'week': int(r[0]), 'dates': r[1], 'phase': strip_md(r[2]), 'linkedin': r[3], 'instagram': r[4], 'stories': r[5], 'offplatform': strip_md(r[6])})
content['calendar_notes'] = [strip_md(l) for l in cal if l.startswith('**Floating') or l.startswith('**If deadlines')]

# ---------- misc strategy bits used by site
content['bio_instagram'] = re.search(r'\*\*Instagram bio.*?```\n(.*?)```', src, re.S).group(1).strip()
content['highlights'] = ['MAED', 'Ed.D', 'Fees', 'FAQ', 'Grads', 'Series', 'Apply']
content['linkedin_tagline'] = re.search(r'\*\*LinkedIn showcase page tagline:\*\* "(.+?)"', src).group(1)

os.makedirs(os.path.dirname(sys.argv[2]), exist_ok=True)
json.dump(content, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print({k: (len(v) if isinstance(v, (list, dict)) else 1) for k, v in content.items()})

"""Royalty-free music bed synthesised from scratch (no samples): soft piano arpeggio + pad + bass + light percussion.
96 BPM, D major, I–V–vi–IV. Output: assets/music/bed.wav (stereo 48 kHz, 100 s)."""
import numpy as np, wave, sys
SR = 48000; BPM = 96; BEAT = 60 / BPM; BAR = 4 * BEAT; DUR = 100.0
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
prog = [[50, 54, 57], [45, 49, 52], [47, 50, 54], [43, 47, 50]]  # D, A, Bm, G (MIDI)
rng = np.random.default_rng(7)
def add(sig, start, pan=0.0, gain=1.0):
    s = int(start * SR); e = min(N, s + len(sig))
    if s >= N: return
    seg = sig[: e - s] * gain
    L[s:e] += seg * np.sqrt(0.5 * (1 - pan)); R[s:e] += seg * np.sqrt(0.5 * (1 + pan))
def piano(m, dur=1.6, vel=0.5):
    t = np.arange(int(SR * dur)) / SR; f = hz(m)
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
    sig = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t * (1.5 + k * 1.1)) for k, a in [(1, 1), (2, .45), (3, .18), (4, .08)])
    return sig * env * vel
def pad(chord, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    sig = np.zeros_like(t)
    for m in chord + [chord[0] + 12]:
        for det in (-0.12, 0.12):
            f = hz(m + 12) * 2 ** (det / 12)
            sig += np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return sig * env * 0.035
def bass(m, dur):
    t = np.arange(int(SR * dur)) / SR; f = hz(m - 12)
    env = np.minimum(1, t / 0.05) * np.exp(-t * 0.6) * np.minimum(1, (dur - t) / 0.2)
    return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * env * 0.22
def kick():
    t = np.arange(int(SR * 0.35)) / SR
    f = 42 + 50 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * 0.35
def shaker():
    n = int(SR * 0.08); t = np.arange(n) / SR
    x = rng.standard_normal(n); x = np.diff(np.concatenate([[0], x]))  # crude highpass
    return x * np.exp(-t * 60) * 0.025
pattern = [0, 1, 2, 3, 2, 1, 2, 3]  # arpeggio indices over 8 eighths (3 = octave root)
t = 0.0; bar = 0
while t < DUR:
    ch = prog[(bar // 2) % 4]
    if bar % 2 == 0:
        add(pad(ch, 2 * BAR + 1.2), t, 0.0, 1.0)
        add(bass(ch[0], 2 * BAR), t, 0.0)
    notes = ch + [ch[0] + 12]
    for k, idx in enumerate(pattern):
        m = notes[idx] + 12
        add(piano(m, 1.8, 0.16 if k % 2 == 0 else 0.11), t + k * BEAT / 2, pan=(-0.25 if k % 2 else 0.25))
        if k % 2 == 1: add(shaker(), t + k * BEAT / 2, pan=0.4)
    for b in (0, 2): add(kick(), t + b * BEAT)
    t += BAR; bar += 1
st = np.stack([L, R], 1)
# gentle low-pass (one-pole) to soften
a = 0.35
for c in range(2):
    y = np.zeros(N); prev = 0.0; x = st[:, c]
    y = np.copy(x)
    for i in range(1, N, 1): pass
st = st / (np.max(np.abs(st)) + 1e-9) * 0.7
fade = int(SR * 2); st[:fade] *= np.linspace(0, 1, fade)[:, None]; st[-fade:] *= np.linspace(1, 0, fade)[:, None]
pcm = (st * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', DUR)

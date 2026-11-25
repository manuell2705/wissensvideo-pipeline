"""Livelier George: 4 variants of the same passage (hook + one fact + flow), so the user can pick by ear.
1 = current settings (for comparison)
2 = 'fascinated' delivery: stronger emotion, lower cfg (more natural flow), longer beats, varied tempo
3 = like 2 but with a NEW, livelier reference made from George himself (bootstrapped: same voice, more energy)
4 = like 3, even more energy (storyteller who knows it's a great story)
Output: gpu_out/stimme_N.wav + stimme_alle.mp3 (beep + number between variants)"""
import subprocess, re, difflib
from pathlib import Path
import numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
out = Path('gpu_out'); out.mkdir(exist_ok=True)
model = ChatterboxTTS.from_pretrained(device='cuda'); SR = model.sr
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device='cuda', torch_dtype=torch.float16)
def norm(t): return re.sub(r"[^a-z0-9' ]", ' ', t.lower()).split()
def score(w, text):
    a16 = torch.nn.functional.interpolate(torch.tensor(w)[None, None], scale_factor=16000 / SR, mode='linear')[0, 0].numpy()
    return difflib.SequenceMatcher(None, norm(text), norm(asr({'raw': a16, 'sampling_rate': 16000})['text'])).ratio()
def trim(w, thr=0.012):
    idx = np.where(np.abs(w) > thr)[0]
    return w if len(idx) == 0 else w[max(0, idx[0] - int(0.03 * SR)): min(len(w), idx[-1] + int(0.08 * SR))]
def tempo(w, t):
    if abs(t - 1) < 0.01: return w
    sf.write('/tmp/i.wav', w, SR); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/i.wav', '-af', f'atempo={t}', '/tmp/o.wav'], check=True)
    return sf.read('/tmp/o.wav', dtype='float32')[0]
def say(text, ref, exa, cfg, temp=0.8, seed=1):
    best = None
    for k in range(3):
        torch.manual_seed(seed * 100 + k)
        w = trim(model.generate(text, audio_prompt_path=ref, exaggeration=min(1.6, exa), cfg_weight=cfg, temperature=temp).squeeze(0).cpu().numpy())
        sc = score(w, text)
        if best is None or sc > best[0]: best = (sc, w)
        if sc >= 0.92: break
    return best[1]

# the same passage, plain (as in the script) and 'performed' (spoken punctuation a fascinated narrator would use)
PLAIN = [
 ("Imagine your brain suddenly switched to one hundred percent.", 0.60, 0.45, 1.0, 0.30),
 ("Hard math, solved in seconds. Logic puzzles cracked before anyone else has finished reading them.", 0.60, 0.45, 1.0, 0.25),
 ("Maybe even sharp enough to take on the smartest machine ever built.", 0.60, 0.45, 1.0, 0.35),
 ("But first, we need to know what a one hundred percent brain would actually give you. And what it would do to your body.", 0.60, 0.45, 1.0, 0.45),
 ("Your brain is about two percent of your body weight, yet it uses around twenty percent of your energy.", 0.60, 0.45, 1.0, 0.30),
 ("Time disappears. You stop worrying about what others think. The task almost does itself. Psychologists call it flow.", 0.60, 0.45, 1.0, 0.2),
]
LIVE = [  # (text, exa, cfg, tempo, pause)  - questions/wonder slower, facts brisk, punchlines with a breath before
 ("Imagine... your brain suddenly switched to one hundred percent.", 0.85, 0.30, 0.98, 0.25),
 ("Hard math? Solved in seconds! Logic puzzles, cracked before anyone else has even finished reading them!", 1.00, 0.30, 1.05, 0.30),
 ("Maybe... even sharp enough to take on the smartest machine ever built.", 0.90, 0.35, 0.98, 0.40),
 ("But first, we need to know what a one hundred percent brain would actually give you. And what it would do... to your body.", 0.80, 0.30, 1.02, 0.45),
 ("Your brain is about two percent of your body weight. Yet it burns around twenty percent of your energy! Twenty!", 0.95, 0.30, 1.04, 0.30),
 ("Time disappears. You stop worrying about what anyone thinks. The task almost does itself... Psychologists call it flow.", 0.80, 0.30, 1.0, 0.2),
]
def passage(beats, ref, mult=1.0, temp=0.8):
    parts = []
    for n, (t, exa, cfg, tp, p) in enumerate(beats):
        w = tempo(say(t, ref, exa * mult, cfg, temp, n + 1), tp)
        f = int(0.01 * SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f)
        parts += [w, np.zeros(int(SR * p), np.float32)]
    return np.concatenate(parts)

OLD = 'render/refs/george_cb.wav'
# new livelier reference from George himself: an excited, wonder-filled storyteller line, best of 4 takes
REFTXT = ("And this is the part I love. Your brain, this soft little thing behind your eyes, is doing something no machine has ever matched! "
          "Isn't that incredible? Stay with me, because it gets even better.")
cands = []
for k in range(4):
    torch.manual_seed(77 + k)
    w = trim(model.generate(REFTXT, audio_prompt_path=OLD, exaggeration=1.05, cfg_weight=0.3, temperature=0.9).squeeze(0).cpu().numpy())
    cands.append((score(w, REFTXT) + 0.02 * float(np.std(w) / (np.mean(np.abs(w)) + 1e-6)), w))
NEW = str(out / 'george_lively_ref.wav'); sf.write(NEW, max(cands, key=lambda x: x[0])[1], SR)

V = {1: passage(PLAIN, OLD, 1.0 / 0.8 * 0.8),          # as now (cfg x0.8 was applied in narrate: here cfg 0.45 ~ close)
     2: passage(LIVE, OLD, 1.0, 0.85),
     3: passage(LIVE, NEW, 0.9, 0.85),
     4: passage(LIVE, NEW, 1.1, 0.9)}
for k, w in V.items(): sf.write(str(out / f'stimme_{k}.wav'), w, SR)
# one file to listen to: spoken-free separator = short beep + k beeps for the number
beep = lambda n: np.concatenate([np.concatenate([0.25 * np.sin(2 * np.pi * 880 * np.arange(int(SR * 0.12)) / SR), np.zeros(int(SR * 0.12))]) for _ in range(n)]).astype(np.float32)
allw = np.concatenate(sum([[beep(k), np.zeros(int(SR * 0.6), np.float32), V[k], np.zeros(int(SR * 1.2), np.float32)] for k in V], []))
sf.write('/tmp/all.wav', allw, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/all.wav', '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / 'stimme_alle.mp3')], check=True)
print('done')

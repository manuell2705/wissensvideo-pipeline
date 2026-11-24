"""Full narration with Chatterbox (voice: George v4 'warm' = user's pick, 2026-11-24) on GPU.
Each scene is split into beats; each beat gets emotion/pace/pause from punctuation + chapter
(or from an optional scene['delivery'] list written by the script agent).
Quality guard: whisper checks every scene; a garbled take is regenerated (best of 3).
Output (flat, for the release): gpu_out/scene_XXX.wav + scene_XXX.json (word timings like make_video expects).
Usage: python render/gpu/narrate.py <script.json> [variant]"""
import sys, os, re, json, subprocess, difflib
from pathlib import Path
import numpy as np, soundfile as sf, torch
script = json.loads(Path(sys.argv[1]).read_text()); variant = sys.argv[2] if len(sys.argv) > 2 else 'george_boot_warm'
out = Path('gpu_out'); out.mkdir(exist_ok=True)
REF = 'render/refs/george_cb.wav'
EXA = {'george_boot_lively': 1.2}.get(variant, 1.0); CFG = {'george_boot_warm': 0.8}.get(variant, 1.0)
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained(device='cuda'); SR = model.sr
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device='cuda', torch_dtype=torch.float16)

def sentences(t):
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+(?=[A-Z"\'])', t.strip()) if x.strip()]

def beats(scene):
    if scene.get('delivery'):
        return [(d['text'], d.get('exa', 0.6), d.get('cfg', 0.45), d.get('tempo', 1.0), d.get('pause', 0.3)) for d in scene['delivery']]
    calm_end = scene.get('chapter', '').lower().startswith(('ending', 'outro', 'end'))
    groups, cur = [], []
    for x in sentences(scene['narration']):
        if '...' in x:                                 # dramatic pause marker: own beat
            if cur: groups.append(' '.join(cur)); cur = []
            groups.append(x); continue
        cur.append(x)
        if sum(len(y.split()) for y in cur) >= 14:     # 1-3 sentences per beat keeps the melody flowing
            groups.append(' '.join(cur)); cur = []
    if cur:
        if groups and len(' '.join(cur).split()) <= 4 and '...' not in groups[-1] and not cur[-1].endswith(('!', '?')):
            groups.append(' '.join(cur)); weighty_last = True   # short final punchline, said slowly
        else: groups.append(' '.join(cur))
    res = []
    for g in groups:
        n = len(g.split())
        if g.endswith('!'):          exa, cfg, tp, pause = 0.85, 0.45, 1.04, 0.3    # excited
        elif n <= 4 or '...' in g:   exa, cfg, tp, pause = 0.50, 0.30, 0.94, 0.40   # slow, weighty
        elif g.endswith('?'):        exa, cfg, tp, pause = 0.70, 0.40, 1.00, 0.30   # curious
        else:                        exa, cfg, tp, pause = 0.60, 0.45, 1.00, 0.22   # normal storytelling
        if calm_end: exa, tp = exa * 0.85, tp * 0.96
        res.append((g, exa, cfg, tp, pause))
    return res

def trim(w, thr=0.012):
    idx = np.where(np.abs(w) > thr)[0]
    if len(idx) == 0: return w
    return w[max(0, idx[0] - int(0.03 * SR)): min(len(w), idx[-1] + int(0.08 * SR))]

def tempo(w, t):
    if abs(t - 1) < 0.01: return w
    i, o = out / '_t_in.wav', out / '_t_out.wav'; sf.write(str(i), w, SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(i), '-af', f'atempo={t}', str(o)], check=True)
    r, _ = sf.read(str(o), dtype='float32'); return r

def norm(t): return re.sub(r"[^a-z0-9' ]", ' ', t.lower()).split()

def transcribe(w):
    a16 = torch.nn.functional.interpolate(torch.tensor(w)[None, None], scale_factor=16000 / SR, mode='linear')[0, 0].numpy()
    r = asr({'raw': a16, 'sampling_rate': 16000}, return_timestamps='word', chunk_length_s=30)
    return r['text'], [{'w': c['text'].strip(), 's': round(c['timestamp'][0], 3), 'e': round(c['timestamp'][1] or c['timestamp'][0] + 0.2, 3)} for c in r['chunks']]

report = []
for s in script['scenes']:
    best = None
    for take in range(3):
        torch.manual_seed(1000 * take + s['id'])
        parts = []
        for text, exa, cfg, tp, pause in beats(s):
            w = model.generate(text, audio_prompt_path=REF, exaggeration=min(1.5, exa * EXA), cfg_weight=cfg * CFG, temperature=0.8)
            w = tempo(trim(w.squeeze(0).cpu().numpy()), tp)
            f = int(0.01 * SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f)
            parts += [w, np.zeros(int(SR * pause), dtype=np.float32)]
        wav = np.concatenate(parts[:-1]) if len(parts) > 1 else parts[0]
        txt, words = transcribe(wav)
        score = difflib.SequenceMatcher(None, norm(s['narration']), norm(txt)).ratio()
        if best is None or score > best[0]: best = (score, wav, words)
        if score >= 0.9: break
    score, wav, words = best
    sf.write(str(out / f"scene_{s['id']:03d}.wav"), wav, SR)
    (out / f"scene_{s['id']:03d}.json").write_text(json.dumps(words))
    report.append({'id': s['id'], 'score': round(score, 3), 'takes': take + 1, 'sec': round(len(wav) / SR, 2)})
    print('scene', s['id'], report[-1], flush=True)
(out / 'narration_report.json').write_text(json.dumps(report, indent=1))
# one listening file for the user
lst = out / '_list.txt'; lst.write_text(''.join(f"file 'scene_{s['id']:03d}.wav'\n" for s in script['scenes']))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-af', 'apad=pad_dur=0,loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / 'narration_full.mp3')], check=True)
for f in out.glob('_*'): f.unlink()

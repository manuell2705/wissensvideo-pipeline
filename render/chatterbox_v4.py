"""George v4: livelier, more fluent narration.
- beats of 1-3 sentences (keeps the melody flowing instead of resetting every sentence)
- per-beat emotion (exaggeration), pace (cfg + pitch-safe tempo) and natural short pauses
- silences trimmed so the gaps are exactly what we want
Usage: python chatterbox_v4.py <outdir> <variant>"""
import sys, subprocess
from pathlib import Path
import numpy as np, soundfile as sf
out = Path(sys.argv[1]); out.mkdir(exist_ok=True); variant = sys.argv[2]
# (text, exaggeration, cfg_weight, tempo, pause_after)
BEATS = [
 ("You know that feeling. You're drawing, or playing, or writing, and suddenly the world goes quiet.", 0.5, 0.45, 0.97, 0.35),
 ("Time... disappears.", 0.4, 0.3, 0.9, 0.45),
 ("Every move just happens! Athletes call it the zone. Scientists call it flow.", 0.85, 0.45, 1.04, 0.3),
 ("And people who've felt it all say the same thing: it feels like your brain is finally running at full power!", 0.95, 0.5, 1.05, 0.4),
 ("So is that it? Is flow the secret ninety percent waking up?", 0.7, 0.4, 1.0, 0.3),
 ("What if all your neurons fired at once? Well, we actually know what that looks like. And it is not genius.", 0.75, 0.45, 1.02, 0.35),
 ("It's a blackout.", 0.55, 0.3, 0.92, 0.5),
 ("But here's the beautiful part. You don't need every light on. You get to choose which lights to keep burning.", 0.6, 0.35, 0.95, 0.35),
 ("Your brain isn't waiting for an upgrade. It's waiting for you.", 0.65, 0.3, 0.93, 0.2),
]
REF = {'george_flow': None, 'george_boot': 'render/refs/george_cb.wav', 'george_boot_lively': 'render/refs/george_cb.wav',
       'george_boot_warm': 'render/refs/george_cb.wav'}[variant]
EXA = {'george_boot_lively': 1.2}.get(variant, 1.0)
CFG = {'george_boot_warm': 0.8}.get(variant, 1.0)
if REF is None:
    from kokoro import KPipeline
    kp = KPipeline(lang_code='b')
    txt = ("The universe is far stranger than we imagine. Every atom in your body was forged inside a star, "
           "billions of years ago. Isn't that incredible? And the story is only just beginning.")
    a = np.concatenate([r.audio.cpu().numpy() for r in kp(txt, voice='bm_george', speed=1.0)])
    REF = str(out / '_ref.wav'); sf.write(REF, a, 24000)
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained(device='cpu'); SR = model.sr
def trim(w, thr=0.012):
    idx = np.where(np.abs(w) > thr)[0]
    if len(idx) == 0: return w
    a, b = max(0, idx[0] - int(0.03 * SR)), min(len(w), idx[-1] + int(0.08 * SR))
    return w[a:b]
def tempo(w, t):
    if abs(t - 1) < 0.01: return w
    i, o = out / '_t_in.wav', out / '_t_out.wav'; sf.write(str(i), w, SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(i), '-af', f'atempo={t}', str(o)], check=True)
    r, _ = sf.read(str(o), dtype='float32'); return r
parts = []
for text, exa, cfg, tp, pause in BEATS:
    w = model.generate(text, audio_prompt_path=REF, exaggeration=min(1.5, exa * EXA), cfg_weight=cfg * CFG, temperature=0.8)
    w = tempo(trim(w.squeeze(0).cpu().numpy()), tp)
    fade = int(0.01 * SR); w[:fade] *= np.linspace(0, 1, fade); w[-fade:] *= np.linspace(1, 0, fade)
    parts += [w, np.zeros(int(SR * pause), dtype=np.float32)]
    print('beat ok', variant, text[:30], flush=True)
wav = out / f'_{variant}.wav'; sf.write(str(wav), np.concatenate(parts), SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / f'george4_{variant}.mp3')], check=True)

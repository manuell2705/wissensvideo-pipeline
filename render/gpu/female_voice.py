"""Female narrator options in the style of a calm, cool anime explainer narrator (dramatic pauses, low and controlled,
sudden intensity). Style only: synthetic reference voices (MiniMax outputs), no real person is cloned.
Output: gpu_out/frau_<variant>.mp3"""
import subprocess, numpy as np, soundfile as sf, torch
from pathlib import Path
out = Path('gpu_out'); out.mkdir(exist_ok=True)
# (text, exaggeration, cfg_weight, tempo, pause_after)
BEATS = [
 ("You know that feeling.", 0.35, 0.3, 0.92, 0.55),
 ("You're drawing, or playing, or writing... and suddenly, the world goes quiet.", 0.45, 0.35, 0.95, 0.5),
 ("Time disappears.", 0.4, 0.25, 0.88, 0.7),
 ("Athletes call it the zone. Scientists call it flow.", 0.55, 0.4, 1.0, 0.45),
 ("And those who have felt it all say the same thing.", 0.45, 0.35, 0.96, 0.35),
 ("It feels like your brain is finally running at full power!", 0.95, 0.5, 1.05, 0.6),
 ("But what if every single neuron fired at once?", 0.6, 0.35, 0.97, 0.5),
 ("That isn't genius.", 0.5, 0.3, 0.9, 0.4),
 ("That is a blackout.", 0.7, 0.25, 0.86, 0.3),
]
VARIANTS = {'calm': ('render/refs/f_calm.wav', 1.0), 'wise': ('render/refs/f_wise.wav', 1.0),
            'boss': ('render/refs/f_boss.wav', 1.1), 'serene': ('render/refs/f_serene.wav', 0.9)}
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained(device='cuda'); SR = model.sr
def trim(w, thr=0.012):
    idx = np.where(np.abs(w) > thr)[0]
    return w if len(idx) == 0 else w[max(0, idx[0] - int(.03 * SR)): min(len(w), idx[-1] + int(.08 * SR))]
def tempo(w, t):
    if abs(t - 1) < .01: return w
    sf.write('/tmp/i.wav', w, SR); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/i.wav', '-af', f'atempo={t}', '/tmp/o.wav'], check=True)
    return sf.read('/tmp/o.wav', dtype='float32')[0]
for name, (ref, ex) in VARIANTS.items():
    torch.manual_seed(3); parts = []
    for text, exa, cfg, tp, pause in BEATS:
        w = tempo(trim(model.generate(text, audio_prompt_path=ref, exaggeration=min(1.5, exa * ex), cfg_weight=cfg, temperature=0.75).squeeze(0).cpu().numpy()), tp)
        f = int(.01 * SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f)
        parts += [w, np.zeros(int(SR * pause), np.float32)]
    sf.write('/tmp/v.wav', np.concatenate(parts), SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/v.wav', '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / f'frau_{name}.mp3')], check=True)
    print('done', name, flush=True)

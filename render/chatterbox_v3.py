"""Chatterbox round 3: one voice per call, every sentence gets its own emotion (exaggeration), pace (cfg) and pause.
Usage: python chatterbox_v3.py <outdir> <variant>"""
import sys, re
from pathlib import Path
import numpy as np, soundfile as sf, torch, subprocess
out = Path(sys.argv[1]); out.mkdir(exist_ok=True); variant = sys.argv[2]
# (text, exaggeration, cfg_weight, pause_after_seconds) - low cfg = slower, more deliberate; high exaggeration = more emotion
SEGS = [
 ("You know that feeling.", 0.45, 0.5, 0.35),
 ("You're drawing, or playing, or writing... and suddenly, the world goes quiet.", 0.5, 0.45, 0.45),
 ("Time... disappears.", 0.35, 0.3, 0.5),
 ("Every move just... happens!", 0.85, 0.4, 0.3),
 ("Athletes call it the zone. Scientists call it flow.", 0.7, 0.5, 0.25),
 ("And people who've felt it all say the same thing: it feels like your brain is finally running at full power!", 0.95, 0.5, 0.45),
 ("So... is that it?", 0.5, 0.3, 0.4),
 ("Is flow the secret ninety percent waking up? Could you read minds? Move things with your thoughts?", 0.9, 0.45, 0.4),
 ("Well. Let's find out.", 0.65, 0.4, 0.2),
]
REFS = {  # synthetic reference voices only (no real person is cloned)
 'default': None, 'george': ('kokoro', 'bm_george'), 'lewis': ('kokoro', 'bm_lewis'), 'daniel': ('kokoro', 'bm_daniel'),
 'michael': ('kokoro', 'am_michael'), 'fenrir': ('kokoro', 'am_fenrir'), 'emma': ('kokoro', 'bf_emma'),
 'minimax_narrator': ('file', 'render/refs/minimax_narrator.wav'),
 'fable': ('kokoro', 'bm_fable'), 'fable_lively': ('kokoro', 'bm_fable'),
 'isabella': ('kokoro', 'bf_isabella'), 'alice': ('kokoro', 'bf_alice'), 'heart': ('kokoro', 'af_heart'), 'bella': ('kokoro', 'af_bella'),
 'pandora': ('aura', 'pandora'), 'athena': ('aura', 'athena'), 'hera': ('aura', 'hera'),
 'theia': ('aura', 'theia'), 'juno': ('aura', 'juno'), 'cordelia': ('aura', 'cordelia'),
 'isabella_lively': ('kokoro', 'bf_isabella'), 'heart_lively': ('kokoro', 'af_heart'),
}
ref = REFS[variant]; ref_path = None
if ref and ref[0] == 'kokoro':
    from kokoro import KPipeline
    lang = 'b' if ref[1][0] == 'b' else 'a'
    kp = KPipeline(lang_code=lang)
    txt = ("The universe is far stranger than we imagine. Every atom in your body was forged inside a star, "
           "billions of years ago. Isn't that incredible? And the story is only just beginning.")
    a = np.concatenate([r.audio.cpu().numpy() for r in kp(txt, voice=ref[1], speed=1.0)])
    ref_path = out / f'_ref_{variant}.wav'; sf.write(str(ref_path), a, 24000)
elif ref and ref[0] == 'aura':
    import os, json, urllib.request
    txt = ("Let me tell you something remarkable. Every atom in your body was forged inside a star, billions of years ago. "
           "Isn't that incredible? And honestly, the story is only just beginning.")
    req = urllib.request.Request(f"https://api.cloudflare.com/client/v4/accounts/{os.environ['CF_ACCOUNT_ID']}/ai/run/@cf/deepgram/aura-2-en",
        data=json.dumps({'text': txt, 'speaker': ref[1], 'encoding': 'mp3'}).encode(),
        headers={'Authorization': f"Bearer {os.environ['CF_API_TOKEN']}", 'Content-Type': 'application/json'})
    mp = out / f'_ref_{variant}.mp3'; mp.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    ref_path = out / f'_ref_{variant}.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(mp), '-ar', '24000', '-ac', '1', str(ref_path)], check=True); mp.unlink()
elif ref:
    ref_path = Path(ref[1])
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained(device='cpu')
parts = []
LIVELY = 1.25 if variant.endswith('_lively') else (0.9 if ref and ref[0] == 'aura' else 1.0)
for text, exa, cfg, pause in SEGS:
    exa = min(1.4, exa * LIVELY)
    kw = dict(exaggeration=exa, cfg_weight=cfg, temperature=0.85)
    if ref_path: kw['audio_prompt_path'] = str(ref_path)
    w = model.generate(text, **kw).squeeze(0).cpu().numpy()
    parts += [w, np.zeros(int(model.sr * pause), dtype=np.float32)]
    print('seg ok', variant, text[:30], flush=True)
wav = out / f'_cb3_{variant}.wav'; sf.write(str(wav), np.concatenate(parts), model.sr)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / f'chatterbox3_{variant}.mp3')], check=True)
wav.unlink()
if ref_path and ref_path.parent == out: ref_path.unlink()

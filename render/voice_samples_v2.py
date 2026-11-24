"""Voice shoot-out v2: same text, several free voices. Usage: python voice_samples_v2.py <outdir> <part>
part = cloudflare | chatterbox"""
import os, sys, subprocess, json, urllib.request, re
from pathlib import Path
TEXT = ("You've probably heard it. You only use ten percent of your brain. "
        "And honestly? It's a tempting idea. Somewhere inside your skull, ninety percent of you is just... asleep. Waiting. "
        "So what would happen if you woke it all up? Would you read minds? Move things with your thoughts? "
        "Remember every single breakfast you've ever had? Well. Let's find out. "
        "This is your brain, at one hundred percent.")
out = Path(sys.argv[1]); out.mkdir(exist_ok=True); part = sys.argv[2]

def mp3(wav, name):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / name)], check=True)

if part == 'cloudflare':
    acc, tok = os.environ['CF_ACCOUNT_ID'], os.environ['CF_API_TOKEN']
    for model, speakers in [('@cf/deepgram/aura-2-en', ['draco', 'pandora', 'orion', 'arcas', 'odysseus', 'hyperion'])]:
        for sp in speakers:
            req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/{model}',
                data=json.dumps({'text': TEXT, 'speaker': sp, 'encoding': 'mp3'}).encode(),
                headers={'Authorization': f'Bearer {tok}', 'Content-Type': 'application/json'})
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = r.read(); ct = r.headers.get('content-type', '')
                if 'json' in ct:
                    j = json.loads(data); print(sp, str(j)[:300]); import base64
                    data = base64.b64decode(j['result']['audio'])
                raw = out / f'_{sp}.mp3'; raw.write_bytes(data); mp3(raw, f'cloudflare_aura2_{sp}.mp3'); raw.unlink()
                print('ok', sp)
            except Exception as e:
                print('FAILED', sp, e, getattr(e, 'read', lambda: b'')()[:300])

if part == 'chatterbox':
    import torch, torchaudio as ta, numpy as np, soundfile as sf
    # Synthetic reference voices from Kokoro (no real person is cloned)
    from kokoro import KPipeline
    kp = KPipeline(lang_code='b')
    ref_text = ("The universe is far stranger than we imagine. Every atom in your body was forged inside a star, "
                "billions of years ago, long before there was anyone around to wonder about it.")
    refs = {}
    for v in ['bm_george', 'bm_fable']:
        a = np.concatenate([r.audio.cpu().numpy() for r in kp(ref_text, voice=v, speed=0.95)])
        p = out / f'_ref_{v}.wav'; sf.write(str(p), a, 24000); refs[v] = p
    from chatterbox.tts import ChatterboxTTS
    model = ChatterboxTTS.from_pretrained(device='cpu')
    chunks = [c.strip() for c in re.split(r'(?<=[.?!])\s+(?=[A-Z])', TEXT)]
    # group into ~200-char chunks
    groups, cur = [], ''
    for c in chunks:
        if len(cur) + len(c) > 200 and cur: groups.append(cur); cur = c
        else: cur = (cur + ' ' + c).strip()
    if cur: groups.append(cur)
    for name, ref, exa in [('default', None, 0.5), ('george', refs['bm_george'], 0.5), ('george_lively', refs['bm_george'], 0.75), ('fable', refs['bm_fable'], 0.6)]:
        parts = []
        for g in groups:
            kw = dict(exaggeration=exa, cfg_weight=0.45)
            if ref: kw['audio_prompt_path'] = str(ref)
            w = model.generate(g, **kw)
            parts.append(w); parts.append(torch.zeros(1, int(model.sr * 0.25)))
        wav = out / f'_cb_{name}.wav'; ta.save(str(wav), torch.cat(parts, dim=1), model.sr)
        mp3(wav, f'chatterbox_{name}.mp3'); wav.unlink(); print('ok chatterbox', name, flush=True)
    for p in refs.values(): p.unlink()

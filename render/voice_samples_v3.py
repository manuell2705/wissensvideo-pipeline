"""Voice shoot-out v3: younger, livelier free voices for the v5 hook. Usage: python voice_samples_v3.py <outdir> <part>
part = kokoro | chatterbox | cloudflare.  No real person is cloned: references are synthetic Kokoro voices or our own George."""
import os, sys, subprocess, json, urllib.request, re
from pathlib import Path
TEXT = ("Your brain is the most complex thing we know of in the universe. And most of the time, it runs in power-saving mode. "
        "Eighty-six billion neurons, and only a small share of them fire at any moment. All on about twenty watts. Roughly the power of a dim light bulb. "
        "So let's do something slightly irresponsible. Let's take everything science knows about the brain, and turn it all the way up.")
out = Path(sys.argv[1]); out.mkdir(exist_ok=True); part = sys.argv[2]
def mp3(wav, name):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '160k', str(out / name)], check=True)

if part == 'kokoro':
    import numpy as np, soundfile as sf
    from kokoro import KPipeline
    for lang, voices in [('a', ['am_puck', 'am_michael', 'am_fenrir', 'am_echo', 'am_eric']), ('b', ['bm_lewis', 'bm_daniel', 'bm_fable'])]:
        kp = KPipeline(lang_code=lang)
        for v in voices:
            try:
                a = np.concatenate([r.audio.cpu().numpy() for r in kp(TEXT, voice=v, speed=1.08)])
                p = out / f'_{v}.wav'; sf.write(str(p), a, 24000); mp3(p, f'kokoro_{v}.mp3'); p.unlink(); print('ok', v, flush=True)
            except Exception as e: print('FAILED', v, e)

if part == 'cloudflare':
    acc, tok = os.environ['CF_ACCOUNT_ID'], os.environ['CF_API_TOKEN']
    for sp in ['apollo', 'aries', 'hermes', 'orpheus', 'orion', 'arcas']:
        req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/deepgram/aura-2-en',
            data=json.dumps({'text': TEXT, 'speaker': sp, 'encoding': 'mp3'}).encode(),
            headers={'Authorization': f'Bearer {tok}', 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=120) as r: data = r.read(); ct = r.headers.get('content-type', '')
            if 'json' in ct:
                import base64; data = base64.b64decode(json.loads(data)['result']['audio'])
            raw = out / f'_{sp}.mp3'; raw.write_bytes(data); mp3(raw, f'cloudflare_aura2_{sp}.mp3'); raw.unlink(); print('ok', sp)
        except Exception as e: print('FAILED', sp, e)

if part == 'chatterbox':
    import torch, torchaudio as ta, numpy as np, soundfile as sf
    from kokoro import KPipeline
    ref_text = ("The universe is far stranger than we imagine. Every atom in your body was forged inside a star, "
                "billions of years ago, long before there was anyone around to wonder about it.")
    refs = {'george_jetzt': Path('render/refs/george_cb.wav')}
    for lang, v in [('a', 'am_puck'), ('b', 'bm_lewis')]:
        kp = KPipeline(lang_code=lang)
        a = np.concatenate([r.audio.cpu().numpy() for r in kp(ref_text, voice=v, speed=1.05)])
        p = out / f'_ref_{v}.wav'; sf.write(str(p), a, 24000); refs[v] = p
    from chatterbox.tts import ChatterboxTTS
    model = ChatterboxTTS.from_pretrained(device='cpu')
    chunks = [c.strip() for c in re.split(r'(?<=[.?!])\s+(?=[A-Z])', TEXT)]
    groups, cur = [], ''
    for c in chunks:
        if len(cur) + len(c) > 200 and cur: groups.append(cur); cur = c
        else: cur = (cur + ' ' + c).strip()
    if cur: groups.append(cur)
    for name, ref, exa in [('george_jetzt', refs['george_jetzt'], 0.5), ('george_lebendig', refs['george_jetzt'], 0.8),
                           ('jung_puck', refs['am_puck'], 0.7), ('jung_lewis', refs['bm_lewis'], 0.7)]:
        parts = []
        for g in groups:
            w = model.generate(g, audio_prompt_path=str(ref), exaggeration=exa, cfg_weight=0.4)
            parts.append(w); parts.append(torch.zeros(1, int(model.sr * 0.2)))
        wav = out / f'_cb_{name}.wav'; ta.save(str(wav), torch.cat(parts, dim=1), model.sr)
        mp3(wav, f'chatterbox_{name}.mp3'); wav.unlink(); print('ok chatterbox', name, flush=True)

"""Builds a finished video (+ Shorts) from a script.json.

Steps: voice (Kokoro, free/Apache-2.0) -> images (Pollinations or Cloudflare, free)
-> timeline -> GSAP scenes rendered frame by frame in Chromium -> ffmpeg.

Usage: python render/make_video.py --script jobs/<id>/script.json --out out/<id>
Env:   VOICE (default bm_george), SPEED (default 1.0), FPS (default 25),
       IMAGE_PROVIDER (pollinations|cloudflare|none), CF_ACCOUNT_ID, CF_API_TOKEN,
       POLLINATIONS_TOKEN (optional), WORKERS (default 4), ONLY (long|shorts|all), LIMIT_SCENES
"""
import argparse, json, os, re, subprocess, sys, time, math, shutil, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
SR = 24000
STYLE = ("2D anime-inspired cartoon illustration, clean bold dark outlines, flat cel shading, crisp simple shapes, "
         "vivid varied colours: lush green nature, clear sky blue, warm golden sunlight, white clouds, "
         "with glossy glass and clear water accents in Frutiger Aero style, bright daylight, high clarity, sharp details, "
         "cheerful cosy mood, cinematic composition, educational explainer style, no text, no letters, no watermark")
NEG = "text, letters, words, watermark, logo, photo, realistic, 3d render, gore, blood, deformed hands"


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


# ---------------------------------------------------------------- voice
_kp = None


def voice_tensor(kp, spec):
    """'bm_lewis' or a blend like 'bm_lewis:0.7+bm_george:0.3'."""
    if '+' not in spec and ':' not in spec:
        return spec
    parts = [p.split(':') for p in spec.split('+')]
    tot = sum(float(w) for _, w in parts)
    return sum(kp.load_single_voice(v) * (float(w) / tot) for v, w in parts)


# Sound presets (ffmpeg filters) to make the voice deeper / warmer / more "documentary".
FX = {
    'none': None,
    'deeper': 'asetrate=24000*0.94,aresample=24000,atempo=1.0638',
    'warm': 'equalizer=f=140:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1.5:g=-2,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=160',
    'documentary': 'asetrate=24000*0.94,aresample=24000,atempo=1.0638,equalizer=f=140:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1.5:g=-2,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=160,aecho=0.85:0.5:35:0.06',
}


def apply_fx(wav, fx):
    f = FX.get(fx, fx)
    if not f:
        return
    tmp = Path(str(wav) + '.fx.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', f, '-ar', str(SR), '-ac', '1', str(tmp)], check=True)
    tmp.replace(wav)


def kokoro_tts(text, voice, speed):
    global _kp
    from kokoro import KPipeline
    if _kp is None:
        _kp = KPipeline(lang_code='b')  # 'b' = British English
    audio, words, off = [], [], 0.0
    for r in _kp(text, voice=voice_tensor(_kp, voice), speed=speed, split_pattern=r'\n+'):
        a = r.audio.cpu().numpy() if hasattr(r.audio, 'cpu') else np.asarray(r.audio)
        for t in (getattr(r, 'tokens', None) or []):
            if t.start_ts is not None and t.text.strip() and re.search(r'\w', t.text):
                words.append({'w': t.text.strip(), 's': off + t.start_ts, 'e': off + (t.end_ts or t.start_ts + 0.2)})
        audio.append(a)
        off += len(a) / SR
    return np.concatenate(audio), words


def approx_words(text, dur):
    ws = text.split()
    tot = sum(len(w) + 1 for w in ws)
    out, t = [], 0.05
    for w in ws:
        d = (len(w) + 1) / tot * (dur - 0.1)
        out.append({'w': w, 's': t, 'e': t + d}); t += d
    return out


def make_voice(scenes, outdir, voice, speed):
    (outdir / 'audio').mkdir(parents=True, exist_ok=True)
    for s in scenes:
        f = outdir / 'audio' / f"scene_{s['id']:03d}.wav"
        wf = f.with_suffix('.json')
        if f.exists() and wf.exists():
            s['words'] = json.loads(wf.read_text()); s['adur'] = sf.info(str(f)).duration; continue
        if os.environ.get('FAKE_TTS'):
            a, words = np.zeros(int(len(s['narration'].split()) / 2.45 * SR), dtype=np.float32), []
        else:
            a, words = kokoro_tts(s['narration'], voice, speed)
        sf.write(str(f), a, SR)
        fx = os.environ.get('VOICE_FX', 'none')
        if fx != 'none':
            raw = len(a) / SR
            apply_fx(f, fx)
            a, _ = sf.read(str(f), dtype='float32')
            k = (len(a) / SR) / raw  # keep word times in sync if the length changed
            words = [{'w': w['w'], 's': w['s'] * k, 'e': w['e'] * k} for w in words]
        s['adur'] = len(a) / SR
        if len(words) < len(s['narration'].split()) * 0.6:
            words = approx_words(s['narration'], s['adur'])
        s['words'] = words
        wf.write_text(json.dumps(words))
        log('voice', s['id'], f"{s['adur']:.1f}s")


# ---------------------------------------------------------------- images
def img_pollinations(prompt, seed, w, h, path):
    q = urllib.parse.quote(f"{prompt}. {STYLE}")
    url = f"https://image.pollinations.ai/prompt/{q}?width={w}&height={h}&seed={seed}&model=flux&nologo=true&enhance=false"
    tok = os.environ.get('POLLINATIONS_TOKEN')
    req = urllib.request.Request(url, headers={'User-Agent': 'video-pipeline/1.0', **({'Authorization': f'Bearer {tok}'} if tok else {})})
    with urllib.request.urlopen(req, timeout=180) as r:
        data = r.read()
    if len(data) < 5000:
        raise RuntimeError('image too small')
    path.write_bytes(data)


def img_cloudflare(prompt, seed, w, h, path):
    acc, tok = os.environ['CF_ACCOUNT_ID'], os.environ['CF_API_TOKEN']
    url = f"https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/black-forest-labs/flux-1-schnell"
    body = json.dumps({'prompt': f"{prompt}. {STYLE}", 'steps': 6}).encode()
    req = urllib.request.Request(url, data=body, headers={'Authorization': f'Bearer {tok}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        j = json.loads(r.read())
    import base64
    path.write_bytes(base64.b64decode(j['result']['image']))


DEAD = set()  # image providers that answered with a payment/auth error


def make_images(scenes, outdir, landscape=True):
    prov = os.environ.get('IMAGE_PROVIDER', 'pollinations')
    (outdir / 'img').mkdir(parents=True, exist_ok=True)
    w, h = (1344, 768) if landscape else (768, 1344)
    for s in scenes:
        p = outdir / 'img' / f"scene_{s['id']:03d}.jpg"
        s['img'] = None
        if p.exists() and p.stat().st_size > 5000:
            s['img'] = str(p); continue
        if prov == 'none':
            continue
        fns = [img_cloudflare] if prov == 'cloudflare' else [img_pollinations]
        if prov == 'pollinations' and os.environ.get('CF_API_TOKEN'):
            fns.append(img_cloudflare)
        fns = [f for f in fns if f.__name__ not in DEAD]
        if not fns:
            continue
        for attempt in range(4):
            fn = fns[min(attempt // 2, len(fns) - 1)]
            try:
                fn(s['image_prompt'], 1000 + s['id'], w, h, p); s['img'] = str(p); log('image', s['id'], fn.__name__); break
            except Exception as e:
                log('image fail', s['id'], fn.__name__, e)
                # payment/auth errors will not fix themselves: stop asking this provider (saves ~1 min per scene)
                if getattr(e, 'code', None) in (401, 402, 403):
                    DEAD.add(fn.__name__); log('provider disabled', fn.__name__)
                    fns = [f for f in fns if f.__name__ not in DEAD]
                    if not fns: break
                    continue
                time.sleep(8 * (attempt + 1))
        if prov == 'pollinations' and 'img_pollinations' not in DEAD:
            time.sleep(3)  # be polite to the free service


# ---------------------------------------------------------------- timeline + audio
GAP = 0.35


def build_timeline(scenes, lead=0.4):
    t = lead
    for s in scenes:
        extra = 0.7 if s['kind'] in ('title', 'chapter') else 0.0
        s['start'] = round(t, 3)
        s['dur'] = round(s['adur'] + GAP + extra, 3)
        t += s['dur']
    return round(t + 0.8, 3)


def build_audio(scenes, outdir, total, name):
    buf = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for s in scenes:
        a, _ = sf.read(str(outdir / 'audio' / f"scene_{s['id']:03d}.wav"), dtype='float32')
        if a.ndim > 1: a = a.mean(axis=1)
        st = int((s['start'] + (0.35 if s['kind'] in ('title', 'chapter') else 0)) * SR)
        buf[st:st + len(a)] += a[:len(buf) - st]
    wav = outdir / f'{name}_voice.wav'
    sf.write(str(wav), buf[:int(total * SR)], SR)
    return wav


# ---------------------------------------------------------------- render
RENDER_JS = r"""
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [html, out, w, h, fps, f0, f1] = process.argv.slice(2);
  const exe = process.env.CHROME_PATH || undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  await page.goto('file://' + html);
  await page.waitForFunction('window.READY === true');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', fps, out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = +f0; f < +f1; f++) {
    await page.evaluate((t) => window.seekTo(t), f / +fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 250 === 0) console.log('frame', f, '/', f1);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
"""


def label_times(s):
    """Info cards appear exactly when their key word is spoken (falls back to an even spread)."""
    labels = s.get('labels') or []
    if not labels: return []
    off = s['start'] + (0.35 if s['kind'] in ('title', 'chapter') else 0)
    words = s.get('words') or []
    norm = lambda x: re.sub(r'[^a-z0-9%]', '', x.lower())
    out, used = [], -1
    for k, lab in enumerate(labels):
        keys = [norm(x) for x in lab.split() if len(norm(x)) > 2] or [norm(lab)]
        t = None
        for i, w in enumerate(words):
            if i <= used: continue
            if any(kw and (norm(w['w']).startswith(kw[:5]) or kw.startswith(norm(w['w'])[:5] or '#')) for kw in keys):
                t = w['s']; used = i; break
        if t is None: t = s.get('adur', s['dur']) * (0.25 + 0.6 * k / max(1, len(labels)))
        out.append({'text': lab, 't': round(off + max(0.3, t - 0.15), 3)})
    return out


def render(scenes, total, outdir, name, w, h, fps, captions=None, workers=4):
    rdir = outdir / f'_render_{name}'
    if rdir.exists(): shutil.rmtree(rdir)
    rdir.mkdir(parents=True)
    shutil.copytree(HERE / 'vendor', rdir / 'vendor')
    vs = []
    for s in scenes:
        img = None
        if s.get('img'):
            img = f"img_{s['id']:03d}.jpg"; shutil.copy(s['img'], rdir / img)
        vs.append({k: s[k] for k in ('id', 'kind', 'onscreen', 'start', 'dur')} | {'img': img, 'labels': label_times(s)})
    data = {'width': w, 'height': h, 'total': total, 'scenes': vs, 'captions': captions, 'brand': os.environ.get('BRAND', 'MINDSPHERE')}
    (rdir / 'data.js').write_text('window.VIDEO = ' + json.dumps(data) + ';')
    shutil.copy(HERE / 'template.html', rdir / 'index.html')
    (rdir / 'render.js').write_text(RENDER_JS)
    nf = int(math.ceil(total * fps))
    per = math.ceil(nf / workers)
    procs, segs = [], []
    for k in range(workers):
        a, b = k * per, min(nf, (k + 1) * per)
        if a >= b: break
        seg = rdir / f'seg_{k}.mp4'; segs.append(seg)
        procs.append(subprocess.Popen(['node', str(rdir / 'render.js'), str(rdir / 'index.html'), str(seg), str(w), str(h), str(fps), str(a), str(b)]))
    for p in procs:
        if p.wait() != 0: raise SystemExit('render worker failed')
    (rdir / 'list.txt').write_text(''.join(f"file '{s}'\n" for s in segs))
    silent = rdir / 'video.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(rdir / 'list.txt'), '-c', 'copy', str(silent)], check=True)
    return silent


def mux(video, voice_wav, out, music=None):
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', str(video), '-i', str(voice_wav)]
    if music and Path(music).exists():
        cmd += ['-stream_loop', '-1', '-i', str(music), '-filter_complex',
                '[2:a]volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                '-map', '0:v', '-map', '[a]']
    else:
        cmd += ['-filter_complex', '[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]', '-map', '0:v', '-map', '[a]']
    cmd += ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', str(out)]
    subprocess.run(cmd, check=True)


def write_meta(script, outdir):
    desc = script['description'] + '\n\nChapters:\n'
    t, seen = 0, set()
    for s in script['scenes']:
        if s['chapter'] not in seen:
            seen.add(s['chapter']); m, sec = divmod(int(s['start']) if s['start'] > 1 else 0, 60)
            desc += f"{m}:{sec:02d} {s['chapter']}\n"
    desc += '\nSources:\n' + '\n'.join('- ' + x for x in script['sources'])
    desc += '\n\nVoice and illustrations were created with AI tools; script researched and fact-checked.\n'
    desc += ' '.join('#' + re.sub(r'\W', '', t) for t in script.get('tags', [])[:5])
    meta = {'title': script['title'], 'description': desc, 'tags': script.get('tags', []),
            'shorts': [{'title': sh['title'], 'file': f'short_{i + 1}.mp4'} for i, sh in enumerate(script.get('shorts', []))]}
    (outdir / 'metadata.json').write_text(json.dumps(meta, indent=1, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--script', required=True); ap.add_argument('--out', required=True)
    a = ap.parse_args()
    script = json.loads(Path(a.script).read_text())
    out = Path(a.out).resolve(); out.mkdir(parents=True, exist_ok=True)
    fps = int(os.environ.get('FPS', 25)); workers = int(os.environ.get('WORKERS', 4))
    only = os.environ.get('ONLY', 'all')
    scenes = script['scenes']
    if os.environ.get('LIMIT_SCENES'): scenes = scenes[:int(os.environ['LIMIT_SCENES'])]; script['scenes'] = scenes
    music = os.environ.get('MUSIC') or (str(HERE.parent / 'assets' / 'music.mp3'))
    log('voice'); make_voice(scenes, out, os.environ.get('VOICE', 'bm_george'), float(os.environ.get('SPEED', 1.0)))
    log('images'); make_images(scenes, out)
    if only in ('all', 'long'):
        total = build_timeline(scenes)
        wav = build_audio(scenes, out, total, 'long')
        log(f'render long {total:.1f}s')
        vid = render(scenes, total, out, 'long', 1920, 1080, fps, workers=workers)
        mux(vid, wav, out / 'video.mp4', music)
        write_meta(script, out)
        log('long done')
    if only in ('all', 'shorts'):
        byid = {s['id']: s for s in script['scenes']}
        for i, sh in enumerate(script.get('shorts', [])):
            sc = [dict(byid[k]) for k in sh['scene_ids'] if k in byid]
            if not sc: continue
            total = build_timeline(sc, lead=0.2)
            caps = []
            for s in sc:
                off = s['start'] + (0.35 if s['kind'] in ('title', 'chapter') else 0)
                caps += [{'w': w['w'], 's': round(w['s'] + off, 3), 'e': round(w['e'] + off, 3)} for w in s['words']]
            for s in sc:
                if s['kind'] == 'chapter': s['kind'] = 'image'
            wav = build_audio(sc, out, total, f'short{i + 1}')
            log(f'render short {i + 1} {total:.1f}s')
            vid = render(sc, total, out, f'short{i + 1}', 1080, 1920, 30, captions=caps, workers=workers)
            mux(vid, wav, out / f'short_{i + 1}.mp4', music)
    for d in out.glob('_render_*'): shutil.rmtree(d, ignore_errors=True)
    log('ALL DONE')


if __name__ == '__main__':
    main()

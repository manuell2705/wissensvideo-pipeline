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
        if list((outdir / 'img').glob(f"scene_{s['id']:03d}_*.jpg")):   # several GPU shots already there
            s['img'] = str(sorted((outdir / 'img').glob(f"scene_{s['id']:03d}_*.jpg"))[0]); continue
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



# ---------------------------------------------------------------- anime motion pass (2026-11-24)
def sketch(src, dst):
    """Pencil/ink line-art version of an image (colour-dodge sketch), tinted night-blue: used for the 'being drawn' reveal."""
    from PIL import Image, ImageFilter, ImageOps
    im = Image.open(src).convert('L')
    inv = ImageOps.invert(im).filter(ImageFilter.GaussianBlur(6))
    a, b = np.asarray(im, dtype=np.float32), np.asarray(inv, dtype=np.float32)
    d = np.clip(a * 255.0 / np.maximum(1, 255.0 - b), 0, 255)
    d = np.clip((d - 120) * 1.9, 0, 255) / 255.0            # stronger lines
    paper, ink = np.array([12, 30, 63], np.float32), np.array([200, 245, 255], np.float32)   # glowing lines on night blue
    rgb = paper[None, None] * d[..., None] + ink[None, None] * (1 - d[..., None])
    Image.fromarray(rgb.astype(np.uint8)).save(dst, quality=90)


def shot_files(outdir, s):
    """scene_XXX_1.jpg, scene_XXX_2.jpg ... (several shots per scene) or the single scene_XXX.jpg."""
    multi = sorted((outdir / 'img').glob(f"scene_{s['id']:03d}_*.jpg"))
    multi = [m for m in multi if not m.stem.endswith('_line')]
    if multi: return multi
    one = outdir / 'img' / f"scene_{s['id']:03d}.jpg"
    return [one] if one.exists() else []


def detail_points(img, n):
    """Pick n 'interesting' points (most edges/detail) on a 4x3 grid, far apart, for detail shots."""
    from PIL import Image, ImageFilter
    im = Image.open(img).convert('L').resize((320, 180)).filter(ImageFilter.FIND_EDGES)
    px = im.load(); cells = []
    for gy in range(3):
        for gx in range(4):
            x0, y0 = 20 + gx * 70, 15 + gy * 50
            e = sum(px[x, y] for x in range(x0, x0 + 70, 3) for y in range(y0, y0 + 50, 3))
            cells.append((e, (x0 + 35) / 320 * 100, (y0 + 25) / 180 * 100))
    cells.sort(reverse=True); out = []
    for e, x, y in cells:
        if all(abs(x - a['x']) + abs(y - a['y']) > 35 for a in out): out.append({'x': round(x, 1), 'y': round(y, 1), 'z': 1.45})
        if len(out) >= n: break
    return out


def shot_times(s, n):
    """Split the scene into n shots; cut on a sentence start close to the even split, so cuts land on speech rhythm."""
    d, off = s['dur'], s['start']
    if n <= 1: return [(off, d)]
    words = s.get('words') or []
    starts = [w['s'] for i, w in enumerate(words) if i == 0 or re.search(r'[.!?,:]$', words[i - 1]['w'])]
    lead = 0.35 if s['kind'] in ('title', 'chapter') else 0
    cuts = []
    for k in range(1, n):
        ideal = d * k / n
        cand = [lead + t for t in starts if 1.6 < lead + t < d - 1.6]
        c = min(cand, key=lambda t: abs(t - ideal)) if cand and min(abs(t - ideal) for t in cand) < d / n * 0.45 else ideal
        cuts.append(c)
    edges = [0] + sorted(set(round(c, 3) for c in cuts)) + [d]
    return [(off + a, b - a) for a, b in zip(edges, edges[1:]) if b - a > 0.8]



def word_time(s, key, default_frac=0.3):
    """Absolute time when `key` (a word or phrase start) is spoken in scene s."""
    off = s['start'] + (0.35 if s['kind'] in ('title', 'chapter') else 0)
    norm = lambda x: re.sub(r'[^a-z0-9%]', '', x.lower())
    k = norm(key.split()[0]) if key else ''
    for w in s.get('words') or []:
        if k and (norm(w['w']).startswith(k[:5]) or (len(norm(w['w'])) > 2 and k.startswith(norm(w['w'])))):
            return round(off + max(0.1, w['s'] - 0.1), 3)
    return round(off + s.get('adur', s['dur']) * default_frac, 3)


def cutout(src, dst):
    """Character layer for 2.5D parallax (rembg, anime model, runs on CPU)."""
    global _RB
    from rembg import remove, new_session
    from PIL import Image, ImageFilter
    if '_RB' not in globals(): _RB = new_session('isnet-anime')
    im = remove(Image.open(src).convert('RGB'), session=_RB)
    a = im.split()[-1].filter(ImageFilter.MaxFilter(5))      # tiny dilate so no halo of the old copy shows
    im.putalpha(a); im.save(dst)


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
    await page.evaluate(async (t) => await window.seekTo(t), f / +fps);
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
    vs, prev_ch = [], None
    for i, s in enumerate(scenes):
        files = shot_files(outdir, s) if not s.get('img') or Path(s['img']).parent == outdir / 'img' else [Path(s['img'])]
        crops = [None] * len(files)
        # 'small scenes' without extra GPU: a long scene with one picture gets 1-2 calm detail shots (zoom into the busiest regions)
        nv = 1 if s['dur'] < 7 else (2 if s['dur'] < 12 else 3)
        if len(files) == 1 and nv > 1 and s['kind'] == 'image' and not s.get('cutout') and os.environ.get('DETAIL', '1') == '1' \
                and not (outdir / 'clips' / f"clip_{s['id']:03d}.mp4").exists():
            pts = detail_points(files[0], nv - 1)
            files = files * (1 + len(pts)); crops = [None] + pts
        times = shot_times(s, len(files)) if files else [(s['start'], s['dur'])]
        shots = []
        for k, ((t, d), f) in enumerate(zip(times, files or [None])):
            sh = {'t': round(t, 3), 'd': round(d, 3), 'img': None, 'line': None, 'crop': crops[k] if k < len(crops) else None}
            if f:
                sh['img'] = f"img_{s['id']:03d}_{k}.jpg"; shutil.copy(f, rdir / sh['img'])
                if not sh['crop']:   # most interesting point: the camera starts there (show a part first) or flies into it
                    try: sh['focus'] = detail_points(f, 1)[0]
                    except Exception: sh['focus'] = None
                # 'being drawn' reveal on chapter openings and every 4th scene (first shot only)
                if k == 0 and s['kind'] == 'image' and (s['chapter'] != prev_ch or i % 4 == 1) and os.environ.get('SKETCH', '1') == '1':
                    sh['line'] = f"line_{s['id']:03d}.jpg"
                    try: sketch(f, rdir / sh['line'])
                    except Exception as e: log('sketch fail', s['id'], e); sh['line'] = None
            if k == 0:
                clip = outdir / 'clips' / f"clip_{s['id']:03d}.mp4"
                if clip.exists():   # real motion (Wan 2.2): extract frames at render fps, play at <=1x, then hold
                    vd = rdir / f"v_{s['id']:03d}"; vd.mkdir(exist_ok=True)
                    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(clip), '-vf', f'fps={fps},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080',
                                    '-q:v', '3', str(vd / '%04d.jpg')], check=True)
                    n = len(list(vd.glob('*.jpg')))
                    sh['video'] = {'dir': vd.name, 'n': n, 'fps': fps}
                    sh['line'] = None
            shots.append(sh)
        prev_ch = s['chapter']
        energy = s.get('energy') if 'energy' in s else '!' in s['narration'] or bool(re.search(r'\b(boom|suddenly|explod|fire|blackout|switch)', s['narration'].lower()))
        if s.get('cutout') and shots and shots[0]['img'] and not shots[0].get('video'):
            try:
                shots[0]['fg'] = f"fg_{s['id']:03d}.png"; cutout(rdir / shots[0]['img'], rdir / shots[0]['fg'])
            except Exception as e: log('cutout fail', s['id'], e); shots[0]['fg'] = None
        gfx = []
        for g in s.get('gfx') or []:
            g = json.loads(json.dumps(g))
            g['t'] = word_time(s, g.get('at', ''), 0.2)
            for it in g.get('items', []): it['t'] = word_time(s, it.get('at', ''), 0.4) if it.get('at') else g['t']
            if g.get('at2'): g['t2'] = word_time(s, g['at2'], 0.6)
            gfx.append(g)
        vs.append({k: s[k] for k in ('id', 'kind', 'onscreen', 'start', 'dur')} | {'transition': s.get('transition')} | {'gfx': gfx} |
                  {'img': shots[0]['img'], 'shots': shots, 'energy': energy, 'labels': label_times(s)})
    data = {'width': w, 'height': h, 'total': total, 'scenes': vs, 'captions': captions, 'brand': os.environ.get('BRAND', 'MINDSPHERE')}
    (rdir / 'data.js').write_text('window.VIDEO = ' + json.dumps(data) + ';')
    (outdir / f'timeline_{name}.json').write_text(json.dumps(data))   # for the 5-second feedback table
    if os.environ.get('DATA_ONLY'): return None
    shutil.copy(HERE / 'template.html', rdir / 'index.html')
    (rdir / 'render.js').write_text(RENDER_JS)
    nf = int(math.ceil(total * fps))
    f0, f1 = 0, nf
    if os.environ.get('SHARD'):   # split rendering over several machines: SHARD=k/N renders only its slice of frames
        k_, n_ = (int(x) for x in os.environ['SHARD'].split('/'))
        f0, f1 = nf * k_ // n_, nf * (k_ + 1) // n_
    if os.environ.get('SEGS_DIR'):   # all slices already rendered elsewhere: just join them
        segs = sorted(Path(os.environ['SEGS_DIR']).glob('**/shard_*.mp4'), key=lambda x: int(re.findall(r'\d+', x.stem)[0]))
        (rdir / 'list.txt').write_text(''.join(f"file '{s.resolve()}'\n" for s in segs))
        silent = rdir / 'video.mp4'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(rdir / 'list.txt'), '-c', 'copy', str(silent)], check=True)
        return silent
    per = math.ceil((f1 - f0) / workers)
    procs, segs = [], []
    for k in range(workers):
        a, b = f0 + k * per, min(f1, f0 + (k + 1) * per)
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
                f'[2:a]volume={os.environ.get("MUSIC_VOL", "0.1")}[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
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
    if os.environ.get('SCENE_IDS'):   # excerpt, e.g. SCENE_IDS=16-19 (for quick ~20 s previews)
        a_, b_ = (int(x) for x in os.environ['SCENE_IDS'].split('-'))
        scenes = [s for s in scenes if a_ <= s['id'] <= b_]; script['scenes'] = scenes
    if os.environ.get('LIMIT_SCENES'): scenes = scenes[:int(os.environ['LIMIT_SCENES'])]; script['scenes'] = scenes
    music = os.environ.get('MUSIC') or (str(HERE.parent / 'assets' / 'music.mp3'))
    log('voice'); make_voice(scenes, out, os.environ.get('VOICE', 'bm_george'), float(os.environ.get('SPEED', 1.0)))
    log('images'); make_images(scenes, out)
    if only in ('all', 'long'):
        total = build_timeline(scenes)
        wav = build_audio(scenes, out, total, 'long')
        log(f'render long {total:.1f}s')
        vid = render(scenes, total, out, 'long', 1920, 1080, fps, workers=workers)
        if vid is None: log('data only'); return
        if os.environ.get('SHARD'):
            shutil.copy(vid, out / f"shard_{int(os.environ['SHARD'].split('/')[0]):02d}.mp4"); log('shard done'); return
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

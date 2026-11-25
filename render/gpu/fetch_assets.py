"""Download a GPU release (audio wav/json + images) into <out>/audio and <out>/img."""
import json, os, sys, subprocess, urllib.request
from pathlib import Path
tag, out = sys.argv[1], Path(sys.argv[2])
repo = os.environ.get('GITHUB_REPOSITORY', 'manuell2705/wissensvideo-pipeline'); tok = os.environ['GH_TOKEN']
H = {'Authorization': f'Bearer {tok}', 'Accept': 'application/vnd.github+json'}
for d in ('audio', 'img'): (out / d).mkdir(parents=True, exist_ok=True)
assets = []
for tg in tag.split(','):   # several GPU releases can be combined, e.g. gpu-1,gpu-2
    assets += json.load(urllib.request.urlopen(urllib.request.Request(f'https://api.github.com/repos/{repo}/releases/tags/{tg.strip()}', headers=H)))['assets']
import time
def get(a):   # public repo: plain download link first (no auth header to forward on the CDN redirect), API as fallback; retry on limits
    for k in range(6):
        try:
            if k % 2 == 0: return urllib.request.urlopen(a['browser_download_url'], timeout=120).read()
            return urllib.request.urlopen(urllib.request.Request(a['url'], headers={**H, 'Accept': 'application/octet-stream'}), timeout=120).read()
        except Exception as e:
            if k == 5: raise
            print('retry', a['name'], e, flush=True); time.sleep(5 * 2 ** k)
latest = {a['name']: a for a in assets}   # a later release overrides an older file with the same name -> download only that one
for n, a in latest.items():
    if not (n.endswith('.jpg') or (n.startswith('scene_') and n.endswith(('.wav', '.json')))): continue
    d = out / ('img' if n.endswith('.jpg') else 'audio')
    (d / n).write_bytes(get(a))
here = Path(__file__).resolve().parents[1]
t = out / 'img' / 'scene_005_1.jpg'
if not t.exists(): t.write_bytes((here / 'refs' / 'planet_title.jpg').read_bytes())   # title card background
print(len(list((out / 'audio').glob('*.wav'))), 'audio,', len(list((out / 'img').glob('*.jpg'))), 'images')

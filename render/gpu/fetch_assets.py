"""Download a GPU release (audio wav/json + images) into <out>/audio and <out>/img."""
import json, os, sys, subprocess, urllib.request
from pathlib import Path
tag, out = sys.argv[1], Path(sys.argv[2])
repo = os.environ.get('GITHUB_REPOSITORY', 'manuell2705/wissensvideo-pipeline'); tok = os.environ['GH_TOKEN']
H = {'Authorization': f'Bearer {tok}', 'Accept': 'application/vnd.github+json'}
rel = json.load(urllib.request.urlopen(urllib.request.Request(f'https://api.github.com/repos/{repo}/releases/tags/{tag}', headers=H)))
for d in ('audio', 'img'): (out / d).mkdir(parents=True, exist_ok=True)
for a in rel['assets']:
    n = a['name']; d = out / ('audio' if n.endswith(('.wav', '.json')) and n.startswith('scene_') else 'img' if n.endswith('.jpg') else 'raw')
    d.mkdir(exist_ok=True)
    r = urllib.request.urlopen(urllib.request.Request(a['url'], headers={**H, 'Accept': 'application/octet-stream'}))
    (d / n).write_bytes(r.read())
here = Path(__file__).resolve().parents[1]
t = out / 'img' / 'scene_005_1.jpg'
if not t.exists(): t.write_bytes((here / 'refs' / 'planet_title.jpg').read_bytes())   # title card background
print(len(list((out / 'audio').glob('*.wav'))), 'audio,', len(list((out / 'img').glob('*.jpg'))), 'images')

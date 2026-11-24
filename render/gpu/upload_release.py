"""Upload every file in a folder as assets of a GitHub release (used inside the RunPod pod).
Idempotent: reuses the release if the tag exists and skips files already uploaded, so it can be called repeatedly."""
import os, sys, json, urllib.request, urllib.error, mimetypes
from pathlib import Path
repo, tag, folder = os.environ['REPO'], sys.argv[1], Path(sys.argv[2])
tok = os.environ['GH_TOKEN']; H = {'Authorization': f'Bearer {tok}', 'Accept': 'application/vnd.github+json'}
def api(url, data=None, method=None, ct='application/json'):
    r = urllib.request.Request(url, data=data, method=method, headers=H | ({'Content-Type': ct} if data else {}))
    return json.loads(urllib.request.urlopen(r, timeout=600).read() or b'{}')
try:
    rel = api(f'https://api.github.com/repos/{repo}/releases/tags/{tag}')
except urllib.error.HTTPError:
    rel = api(f'https://api.github.com/repos/{repo}/releases', json.dumps({'tag_name': tag, 'name': tag, 'body': 'GPU job'}).encode())
have = {a['name'] for a in api(f"https://api.github.com/repos/{repo}/releases/{rel['id']}/assets?per_page=100")}
page = 2
while len(have) >= 100 * (page - 1):
    more = api(f"https://api.github.com/repos/{repo}/releases/{rel['id']}/assets?per_page=100&page={page}")
    if not more: break
    have |= {a['name'] for a in more}; page += 1
for f in sorted(folder.iterdir()):
    if not f.is_file() or f.name in have or f.name.startswith('_'): continue
    if f.name in ('log.txt', 'zz_DONE.txt') and 'final' not in sys.argv[3:]: continue   # only at the very end
    ct = mimetypes.guess_type(f.name)[0] or 'application/octet-stream'
    for attempt in range(3):
        try:
            api(f"https://uploads.github.com/repos/{repo}/releases/{rel['id']}/assets?name={f.name}", f.read_bytes(), ct=ct); print('uploaded', f.name, flush=True); break
        except Exception as e: print('upload retry', f.name, e, flush=True)

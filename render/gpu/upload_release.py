"""Upload every file in a folder as assets of a new GitHub release (used inside the RunPod pod)."""
import os, sys, json, urllib.request, mimetypes
from pathlib import Path
repo, tag, folder = os.environ['REPO'], sys.argv[1], Path(sys.argv[2])
tok = os.environ['GH_TOKEN']; H = {'Authorization': f'Bearer {tok}', 'Accept': 'application/vnd.github+json'}
req = urllib.request.Request(f'https://api.github.com/repos/{repo}/releases', data=json.dumps({'tag_name': tag, 'name': tag, 'body': 'GPU job'}).encode(), headers=H | {'Content-Type': 'application/json'})
rel = json.loads(urllib.request.urlopen(req).read())
for f in sorted(folder.iterdir()):
    if not f.is_file(): continue
    ct = mimetypes.guess_type(f.name)[0] or 'application/octet-stream'
    up = urllib.request.Request(f"https://uploads.github.com/repos/{repo}/releases/{rel['id']}/assets?name={f.name}", data=f.read_bytes(), headers=H | {'Content-Type': ct})
    urllib.request.urlopen(up, timeout=600).read(); print('uploaded', f.name, flush=True)

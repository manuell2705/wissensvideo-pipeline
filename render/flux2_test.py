"""Test Cloudflare flux-2-dev with a reference image for character consistency."""
import os, sys, json, base64, urllib.request, uuid
from pathlib import Path
out = Path(sys.argv[1]); out.mkdir(exist_ok=True)
acc, tok = os.environ['CF_ACCOUNT_ID'], os.environ['CF_API_TOKEN']
STYLE = ("2D anime cartoon illustration in a cosy TV-series style, clean dark teal line art, soft cel shading, expressive big eyes, "
         "palette of deep night blue, teal, leaf green and warm amber, subtle glossy glass and soft glow, beautiful detailed background, no text, no letters")
REF = Path('render/refs/kai_orbi_sheet.jpg').read_bytes()
P = {
 'kai_desk': "the young man with short dark hair and green-teal hoodie from the reference image drawing at a desk at night, completely absorbed, the small glass orb robot with orbit ring from the reference floating beside him",
 'kai_lake': "the young man from the reference image breathing calmly in an icy blue mountain lake at sunrise, the glass orb robot from the reference watching",
 'orbi_sign': "the small glass orb robot with orbit ring from the reference image holding up a small blank glass sign next to a stack of books, cosy room, day",
}
def multi(fields, files):
    b = uuid.uuid4().hex; body = b''
    for k, v in fields.items(): body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    for k, (fn, data) in files.items(): body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{fn}"\r\nContent-Type: image/jpeg\r\n\r\n'.encode() + data + b'\r\n'
    body += f'--{b}--\r\n'.encode(); return body, b
for name, pr in P.items():
    for mode in ['ref', 'noref']:
        files = {'input_image_0': ('ref.jpg', REF)} if mode == 'ref' else {}
        body, b = multi({'prompt': f"{pr}. {STYLE}", 'width': '1280', 'height': '720', 'steps': '25'}, files)
        req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/black-forest-labs/flux-2-dev', data=body,
            headers={'Authorization': f'Bearer {tok}', 'Content-Type': f'multipart/form-data; boundary={b}'})
        try:
            with urllib.request.urlopen(req, timeout=240) as r: d = r.read(); ct = r.headers.get('content-type', '')
            if 'json' in ct:
                j = json.loads(d); d = base64.b64decode((j.get('result') or {}).get('image') or j.get('image'))
            (out / f'flux2_{mode}_{name}.jpg').write_bytes(d); print('ok', mode, name, flush=True)
        except Exception as e:
            print('FAILED', mode, name, e, getattr(e, 'read', lambda: b'')()[:300], flush=True)

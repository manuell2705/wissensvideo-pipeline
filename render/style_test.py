"""Style test for the new Mindsphere look. Tries several free Cloudflare image models with the same prompts."""
import os, sys, json, base64, urllib.request, uuid
from pathlib import Path
out = Path(sys.argv[1]); out.mkdir(exist_ok=True)
acc, tok = os.environ['CF_ACCOUNT_ID'], os.environ['CF_API_TOKEN']
STYLE = ("2D anime cartoon illustration in a cosy TV-series style, clean confident dark teal line art, soft cel shading, "
         "expressive characters with big friendly eyes, cohesive storybook world-building, palette of deep night blue, teal, "
         "fresh leaf green and warm amber light, subtle Frutiger Aero touches: glossy glass, clear water reflections, soft lens glow, "
         "gentle sky gradients, beautiful detailed background, high clarity, no text, no letters, no watermark")
Y = "a young person with short dark hair and a teal hoodie"
O = "a small floating glass orb robot with a glowing orbit ring around it and two simple dot eyes"
P = {
 'figuren': f"character sheet: {Y} standing and waving next to {O}, full body, plain soft gradient background",
 'planet': "a small green glass planet with a glowing orbit ring floating in space, tiny forests, waterfalls and a glass city on its surface",
 'gehirn_stadt': f"{Y} on a cosy sofa at night, a transparent head showing the brain drawn as a glowing night city inside a glass dome, only a few windows lit",
 'roboterarm': "a person in a wheelchair smiling as a sleek robotic arm lifts a cup of coffee, glowing signal lines from their head to the arm",
 'taxi': "a classic black London taxi driving through a glowing map maze at dusk, a seahorse-shaped glowing structure floating above",
 'orbi_schild': f"{O} holding up a small blank glass sign next to a stack of science journals, friendly wink",
}
def post_json(model, body):
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/{model}', data=json.dumps(body).encode(),
                                 headers={'Authorization': f'Bearer {tok}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r: return r.read(), r.headers.get('content-type', '')
def post_multi(model, fields):
    b = uuid.uuid4().hex; parts = b''
    for k, v in fields.items():
        parts += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    parts += f'--{b}--\r\n'.encode()
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/{model}', data=parts,
                                 headers={'Authorization': f'Bearer {tok}', 'Content-Type': f'multipart/form-data; boundary={b}'})
    with urllib.request.urlopen(req, timeout=180) as r: return r.read(), r.headers.get('content-type', '')
def save(data, ct, path):
    if 'json' in ct:
        j = json.loads(data); img = (j.get('result') or {}).get('image') or j.get('image')
        data = base64.b64decode(img)
    path.write_bytes(data)
MODELS = {
 'schnell': lambda p: post_json('@cf/black-forest-labs/flux-1-schnell', {'prompt': p, 'steps': 8, 'seed': 7}),
 'lucid': lambda p: post_json('@cf/leonardo/lucid-origin', {'prompt': p, 'width': 1280, 'height': 720, 'seed': 7}),
 'flux2dev': lambda p: post_multi('@cf/black-forest-labs/flux-2-dev', {'prompt': p, 'width': '1280', 'height': '720', 'steps': '20', 'seed': '7'}),
}
for m, fn in MODELS.items():
    for name, pr in P.items():
        try:
            d, ct = fn(f"{pr}. {STYLE}"); save(d, ct, out / f'{m}_{name}.jpg'); print('ok', m, name, flush=True)
        except Exception as e:
            body = getattr(e, 'read', lambda: b'')()[:300]; print('FAILED', m, name, e, body, flush=True)
            if m != 'schnell': break

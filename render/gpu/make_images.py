"""All images for one video on GPU, with consistent characters.
Pass 1 (Qwen-Image): character sheet (Kai, Mira, Orbi) + every shot WITHOUT a character.
Pass 2 (Qwen-Image-Edit-2509, sheet as reference): every shot WITH Kai / Mira / Orbi -> same faces & outfits every time.
Speed: Lightning LoRA (8 steps) if available, else 30 steps. Several shots per scene (1-3, by narration length).
Uploads every few images to the release, so nothing is lost if time runs out.
Usage: python render/gpu/make_images.py <script.json> [--limit N]
Output: gpu_out/scene_XXX_K.jpg (K = 1..3)"""
import sys, os, re, json, time, subprocess, torch
from pathlib import Path
script = json.loads(Path(sys.argv[1]).read_text())
LIMIT = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else None
out = Path('gpu_out'); out.mkdir(exist_ok=True)
STYLE = ("2D anime illustration in a premium TV-series style, clean confident line art, soft cel shading, expressive faces, "
         "cinematic lighting and composition, rich depth, palette of deep night blue, teal, fresh leaf green and warm amber light, "
         "subtle glossy glass and clear water touches (Frutiger Aero accents), soft glow, beautiful detailed background, "
         "no text, no letters, no captions, no watermark")
NEG = "text, letters, words, caption, watermark, logo, signature, blurry, deformed, extra fingers, bad hands, photo, 3d render, gore"
KAI = "Kai, a young man with short dark messy hair and a teal hoodie"
MIRA = "Mira, a young woman with a dark ponytail and a warm amber jacket"
ORBI = "Orbi, a small floating glass orb robot with a glowing green orbit ring around it and two simple dot eyes"
CAM = ["", "close-up shot, focus on the face and hands, shallow depth of field, ", "wide cinematic shot from a different angle, dramatic sky, "]
W, H = 1664, 928
def n_shots(s):
    sec = len(s['narration'].split()) / 2.5
    return 1 if s['kind'] != 'image' or sec < 6 else 2 if sec < 11 else 3
def has_char(p): return bool(re.search(r'\b(Kai|Mira|Orbi)\b', p))
jobs = []
for s in script['scenes'][:LIMIT]:
    p = s.get('image_prompt') or s.get('onscreen') or 'the green glass planet with a glowing orbit ring floating in space'
    for k in range(n_shots(s)):
        jobs.append((f"scene_{s['id']:03d}_{k + 1}", CAM[k] + p, has_char(p), s['id'] * 10 + k))
print('images to make', len(jobs), 'with characters', sum(j[2] for j in jobs), flush=True)
tag = os.environ.get('RESULT_TAG'); made = 0
def upload():
    if tag: subprocess.run([sys.executable, 'render/gpu/upload_release.py', tag, str(out)])
def lightning(pipe, which):
    try:
        from diffusers import FlowMatchEulerDiscreteScheduler
        import math
        cfg = {"base_image_seq_len": 256, "base_shift": math.log(3), "invert_sigmas": False, "max_image_seq_len": 8192, "max_shift": math.log(3),
               "num_train_timesteps": 1000, "shift": 1.0, "shift_terminal": None, "stochastic_sampling": False, "time_shift_type": "exponential",
               "use_beta_sigmas": False, "use_dynamic_shifting": True, "use_exponential_sigmas": False, "use_karras_sigmas": False}
        pipe.scheduler = FlowMatchEulerDiscreteScheduler.from_config(cfg)
        f = {'t2i': 'Qwen-Image-Lightning-8steps-V1.1.safetensors',
             'edit': 'Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors'}[which]
        pipe.load_lora_weights('lightx2v/Qwen-Image-Lightning', weight_name=f); pipe.fuse_lora()
        print('lightning on', which, flush=True); return 8, 1.0
    except Exception as e:
        print('lightning unavailable', which, repr(e)[:300], flush=True); return 30, 4.0
def place(pipe):
    free = torch.cuda.get_device_properties(0).total_memory / 2**30
    if free > 70: pipe.to('cuda')
    else: pipe.enable_model_cpu_offload()
    print('gpu GB', round(free), flush=True)
# ---------- pass 1
from diffusers import DiffusionPipeline
pipe = DiffusionPipeline.from_pretrained("Qwen/Qwen-Image", torch_dtype=torch.bfloat16); place(pipe)
steps, cfg = lightning(pipe, 't2i')
def t2i(prompt, seed):
    return pipe(prompt=f"{prompt}. {STYLE}", negative_prompt=NEG, width=W, height=H, num_inference_steps=steps, true_cfg_scale=cfg,
                generator=torch.Generator('cuda').manual_seed(seed)).images[0]
sheet_p = out / 'sheet_figuren.jpg'
if Path('render/refs/sheet_figuren.jpg').exists():
    from PIL import Image; sheet = Image.open('render/refs/sheet_figuren.jpg').convert('RGB'); sheet.save(sheet_p, quality=93)
else:
    sheet = t2i(f"character model sheet on a plain soft teal gradient background: {KAI} on the left, {MIRA} on the right, {ORBI} floating between them, full body, front view, friendly smiles", 7)
    sheet.save(sheet_p, quality=93)
for name, prompt, ch, seed in jobs:
    if ch or (out / f'{name}.jpg').exists(): continue
    t = time.time(); t2i(prompt, seed).save(out / f'{name}.jpg', quality=92); made += 1
    print(name, round(time.time() - t, 1), 's', flush=True)
    if made % 12 == 0: upload()
upload()
del pipe; torch.cuda.empty_cache()
# ---------- pass 2: characters from the sheet
from diffusers import QwenImageEditPlusPipeline
ed = QwenImageEditPlusPipeline.from_pretrained("Qwen/Qwen-Image-Edit-2509", torch_dtype=torch.bfloat16); place(ed)
steps, cfg = lightning(ed, 'edit')
for name, prompt, ch, seed in jobs:
    if not ch or (out / f'{name}.jpg').exists(): continue
    p = prompt.replace('Kai', 'Kai from the reference image').replace('Mira', 'Mira from the reference image').replace('Orbi', 'Orbi from the reference image')
    p = re.sub(r'\s*\((a young|a small)[^)]*\)', '', p)   # the sheet already defines the look
    t = time.time()
    im = ed(image=[sheet], prompt=f"{p}. Wide 16:9 scene, keep their faces, hair and outfits exactly as in the reference. {STYLE}", negative_prompt=NEG,
            num_inference_steps=steps, true_cfg_scale=cfg, width=W, height=H, generator=torch.Generator('cuda').manual_seed(seed)).images[0]
    im.save(out / f'{name}.jpg', quality=92); made += 1
    print(name, round(time.time() - t, 1), 's', flush=True)
    if made % 12 == 0: upload()
print('all images done', made, flush=True)

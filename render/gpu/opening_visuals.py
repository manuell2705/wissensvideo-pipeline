"""Opening sample: consistent character stills (Qwen-Image-Edit-2509 + character sheet) and real motion clips
(Wan 2.2 TI2V-5B image-to-video) for every scene that has a 'motion' description.
Output: gpu_out/scene_XXX_1.jpg (still) and gpu_out/clip_XXX.mp4 (5 s, 24 fps)"""
import sys, json, time, subprocess, torch
from pathlib import Path
from PIL import Image
script = json.loads(Path(sys.argv[1]).read_text()); out = Path('gpu_out'); out.mkdir(exist_ok=True)
tag = __import__('os').environ.get('RESULT_TAG')
def upload():
    if tag: subprocess.run([sys.executable, 'render/gpu/upload_release.py', tag, str(out)])
STYLE = ("2D anime illustration in a premium TV-series style, clean confident line art, soft cel shading, expressive faces, cinematic lighting, "
         "rich depth, palette of deep night blue, teal, fresh leaf green and warm amber light, subtle glossy glass accents, soft glow, "
         "detailed background, no text, no letters, no watermark")
NEG = "faces on objects, text, letters, words, caption, watermark, blurry, deformed, extra fingers, bad hands, photo, 3d render"
sheet = Image.open('render/refs/sheet_figuren.jpg').convert('RGB')
SW, SH = sheet.size
REFS = {'kai': sheet.crop((0, 0, int(SW * 0.62), SH)), 'mira': sheet.crop((int(SW * 0.38), 0, SW, SH)), None: sheet}
def ref_for(s):
    # only the characters that are meant to be in the shot, otherwise the edit model adds both
    if not any(n in s['image_prompt'] for n in ('Kai', 'Mira', 'Orbi')): return None   # topic scene: no characters at all
    return REFS.get(s.get('ref'), sheet)
from diffusers import QwenImageEditPlusPipeline
ed = QwenImageEditPlusPipeline.from_pretrained("Qwen/Qwen-Image-Edit-2509", torch_dtype=torch.bfloat16).to('cuda')
import os
PRE = [int(x) for x in os.environ.get('PREVIEW_IDS', '').split(',') if x]
order = [s for s in script['scenes'] if s['id'] in PRE] + [s for s in script['scenes'] if s['id'] not in PRE]
done = 0
for s in order:
    if done == len([x for x in order if x['id'] in PRE and x.get('image_prompt')]) and PRE and done: upload()   # quick preview first
    if not s.get('image_prompt'): continue
    if (out / f"scene_{s['id']:03d}_1.jpg").exists(): continue
    done += 1
    if done > len(PRE) and done % 10 == 0: upload()
    p = s['image_prompt'].replace('Kai (', 'Kai from the reference image (').replace('Mira (', 'Mira from the reference image (').replace('Orbi (', 'Orbi from the reference image (')
    t = time.time()
    r = ref_for(s)
    if r is None:   # no character: plain text-to-image through the edit model with a neutral canvas is poor -> use the sheet only for style
        r = Image.open('render/refs/style_topic.jpg').convert('RGB')   # style reference without people or faces
        p = p + '. Completely new scene, only keep the art style and colours of the reference image. No people, no characters, no faces on planets, objects or buildings, no text'
    im = ed(image=[r], prompt=f"{p}. Wide 16:9 cinematic scene, keep faces, hair and outfits exactly as in the reference. {STYLE}", negative_prompt=NEG,
            num_inference_steps=30, true_cfg_scale=4.0, width=1664, height=928, generator=torch.Generator('cuda').manual_seed(s['id'] * 10)).images[0]
    im.save(out / '_s.jpg', quality=93); (out / '_s.jpg').replace(out / f"scene_{s['id']:03d}_1.jpg"); print('still', s['id'], round(time.time() - t), 's', flush=True)
upload()
del ed; torch.cuda.empty_cache()
if not any(x.get('motion') for x in script['scenes']): sys.exit(0)
from diffusers import WanImageToVideoPipeline, AutoencoderKLWan
from diffusers.utils import export_to_video
mid = "Wan-AI/Wan2.2-TI2V-5B-Diffusers"
vae = AutoencoderKLWan.from_pretrained(mid, subfolder="vae", torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(mid, vae=vae, torch_dtype=torch.bfloat16).to('cuda')
for s in script['scenes']:
    if not s.get('motion'): continue
    img = Image.open(out / f"scene_{s['id']:03d}_1.jpg").convert('RGB').resize((1280, 704), Image.LANCZOS)
    t = time.time()
    frames = pipe(image=img, prompt=f"2D anime animation, smooth hand-drawn TV anime motion, {s['motion']}", height=704, width=1280,
                  negative_prompt="static, frozen, blurry, distorted faces, extra limbs, text, watermark, photorealistic, 3d",
                  num_frames=121, guidance_scale=5.0, num_inference_steps=40, generator=torch.Generator('cuda').manual_seed(s['id'])).frames[0]
    export_to_video(frames, str(out / f"clip_{s['id']:03d}.mp4"), fps=24); print('clip', s['id'], round(time.time() - t), 's', flush=True)
    upload()

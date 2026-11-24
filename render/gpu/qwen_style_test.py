"""GPU style test with open models (Apache 2.0): Qwen-Image for scenes, Qwen-Image-Edit-2509 for consistent characters."""
import os, time, torch
from pathlib import Path
from PIL import Image
out = Path('gpu_out'); out.mkdir(exist_ok=True)
STYLE = ("2D anime cartoon illustration in a cosy TV-series style, clean dark teal line art, soft cel shading, expressive big eyes, "
         "palette of deep night blue, teal, fresh leaf green and warm amber light, subtle glossy glass and clear water touches, soft glow, "
         "beautiful detailed background, high clarity, no text, no letters, no watermark")
KAI = "Kai, a young man with short dark messy hair and a teal hoodie"
MIRA = "Mira, a young woman with a dark ponytail and a warm amber jacket"
ORBI = "Orbi, a small floating glass orb robot with a glowing green orbit ring around it and two simple dot eyes"
from diffusers import DiffusionPipeline
t = time.time()
pipe = DiffusionPipeline.from_pretrained("Qwen/Qwen-Image", torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()
print('load', round(time.time() - t), flush=True)
def gen(name, prompt, w=1664, h=928, seed=7):
    t = time.time()
    im = pipe(prompt=f"{prompt}. {STYLE}", negative_prompt="text, letters, watermark, blurry, deformed", width=w, height=h,
              num_inference_steps=30, true_cfg_scale=4.0, generator=torch.Generator('cuda').manual_seed(seed)).images[0]
    im.save(out / f'{name}.jpg', quality=92); print(name, round(time.time() - t), 's', flush=True); return im
sheet = gen('sheet_figuren', f"character model sheet on a plain soft teal gradient background: {KAI} on the left, {MIRA} on the right, {ORBI} floating between them, full body, front view, friendly smiles", 1664, 928)
gen('planet', "a small green glass planet with a glowing orbit ring floating in space, tiny forests, waterfalls and a glass city on its surface")
gen('kai_desk', f"{KAI} drawing at a desk at night, completely absorbed, the room fading into soft glowing lines, {ORBI} floating beside him")
gen('mira_skate', f"{MIRA} skateboarding down a glowing hill road at sunset, calm focused smile, everything else blurred into colour")
gen('brain_city', "the human brain drawn as a glowing night city inside a glass dome, districts with tiny lights, roads of light between them")
gen('taxi', "a classic black London taxi driving through a glowing map maze at dusk, a seahorse-shaped glowing structure floating above")
del pipe; torch.cuda.empty_cache()
# consistency test: reuse the character sheet as reference
from diffusers import QwenImageEditPlusPipeline
t = time.time()
ed = QwenImageEditPlusPipeline.from_pretrained("Qwen/Qwen-Image-Edit-2509", torch_dtype=torch.bfloat16)
ed.enable_model_cpu_offload(); print('edit load', round(time.time() - t), flush=True)
for name, pr in [('edit_kai_lake', "Kai from the reference image breathing calmly in an icy blue mountain lake at sunrise, Orbi from the reference floating next to him"),
                 ('edit_mira_library', "Mira from the reference image standing in an endless glass library full of glowing calendars, one page glowing, Orbi watching"),
                 ('edit_both_sofa', "Kai and Mira from the reference image sitting on a cosy sofa at night, looking amazed at a glowing brain-shaped city floating above them")]:
    t = time.time()
    im = ed(image=[sheet], prompt=f"{pr}. {STYLE}", negative_prompt=" ", num_inference_steps=30, true_cfg_scale=4.0,
            generator=torch.Generator('cuda').manual_seed(7)).images[0]
    im.save(out / f'{name}.jpg', quality=92); print(name, round(time.time() - t), 's', flush=True)

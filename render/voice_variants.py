"""Variants of one voice (blends + sound presets) so we can fine-tune it."""
import sys, subprocess
from pathlib import Path
import numpy as np, soundfile as sf
sys.path.insert(0, str(Path(__file__).parent))
from make_video import voice_tensor, apply_fx, SR
from kokoro import KPipeline
TEXT = ("Right now, as you watch this, you are using about ten percent of your brain. "
        "At least, that is what you have probably been told. So here is the question. "
        "If ninety percent of your brain is just sitting there, asleep, what would happen if you woke all of it up?")
VARIANTS = [
    ('1_lewis_original', 'bm_lewis', 1.0, 'none'),
    ('2_lewis_tiefer', 'bm_lewis', 0.97, 'deeper'),
    ('3_lewis_warm', 'bm_lewis', 0.97, 'warm'),
    ('4_lewis_doku', 'bm_lewis', 0.95, 'documentary'),
    ('5_lewis70_george30', 'bm_lewis:0.7+bm_george:0.3', 0.97, 'warm'),
    ('6_lewis70_george30_doku', 'bm_lewis:0.7+bm_george:0.3', 0.95, 'documentary'),
]
out = Path(sys.argv[1]); out.mkdir(exist_ok=True)
kp = KPipeline(lang_code='b')
for name, v, sp, fx in VARIANTS:
    a = np.concatenate([r.audio.cpu().numpy() for r in kp(TEXT, voice=voice_tensor(kp, v), speed=sp)])
    wav = out / f'{name}.wav'; sf.write(str(wav), a, SR); apply_fx(wav, fx)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-b:a', '160k', str(wav.with_suffix('.mp3'))], check=True); wav.unlink()
    print(name, v, sp, fx)

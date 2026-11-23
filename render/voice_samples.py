"""Makes short MP3 samples of free British voices so we can pick one."""
import asyncio, subprocess, sys
from pathlib import Path
import soundfile as sf
TEXT = ("Right now, as you watch this, you are using about ten percent of your brain. "
        "At least, that is what you have probably been told. So here is the question. "
        "If ninety percent of your brain is just sitting there, asleep, what would happen if you woke all of it up?")
out = Path(sys.argv[1]); out.mkdir(exist_ok=True)
from kokoro import KPipeline
import numpy as np
kp = KPipeline(lang_code='b')
for v, sp in [('bm_george', 1.0), ('bm_george', 0.95), ('bm_fable', 1.0), ('bm_lewis', 1.0), ('bm_daniel', 1.0)]:
    a = np.concatenate([r.audio.cpu().numpy() for r in kp(TEXT, voice=v, speed=sp)])
    wav = out / f'kokoro_{v}_{sp}.wav'; sf.write(str(wav), a, 24000)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-b:a', '160k', str(wav.with_suffix('.mp3'))], check=True); wav.unlink()
import edge_tts
async def edge(v):
    await edge_tts.Communicate(TEXT, v, rate='-5%').save(str(out / f'edge_{v}.mp3'))
for v in ['en-GB-ThomasNeural', 'en-GB-RyanNeural']:
    try: asyncio.run(edge(v))
    except Exception as e: print('edge failed', v, e)

"""Free CPU narration for test clips: one wav per line + word timestamps (faster-whisper).
Usage: python narrate_cpu.py <lines.json> <outdir> <voice>
voice = kokoro:<id>[@speed]  |  chatterbox:<ref wav or kokoro id>[@exaggeration]"""
import sys, json, re, subprocess
from pathlib import Path
import numpy as np, soundfile as sf
lines = json.load(open(sys.argv[1])); out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True); voice = sys.argv[3]
kind, spec = voice.split(':', 1); name, _, param = spec.partition('@')
if kind == 'kokoro':
    from kokoro import KPipeline
    kp = KPipeline(lang_code='b' if name.startswith('b') else 'a'); sp = float(param or 1.05)
    for lid, text in lines.items():
        a = np.concatenate([r.audio.cpu().numpy() for r in kp(text, voice=name, speed=sp)]); sf.write(str(out / f'line_{lid}.wav'), a, 24000); print('ok', lid, flush=True)
else:
    import torch, torchaudio as ta
    ref = name
    if not name.endswith('.wav'):
        from kokoro import KPipeline
        kp = KPipeline(lang_code='b' if name.startswith('b') else 'a')
        rt = ("The universe is far stranger than we imagine. Every atom in your body was forged inside a star, "
              "billions of years ago, long before there was anyone around to wonder about it.")
        a = np.concatenate([r.audio.cpu().numpy() for r in kp(rt, voice=name, speed=1.05)]); ref = str(out / '_ref.wav'); sf.write(ref, a, 24000)
    from chatterbox.tts import ChatterboxTTS
    m = ChatterboxTTS.from_pretrained(device='cpu'); exa = float(param or .7)
    for lid, text in lines.items():
        parts = []
        for s in [c.strip() for c in re.split(r'(?<=[.?!])\s+(?=[A-Z])', text)]:
            parts.append(m.generate(s, audio_prompt_path=ref, exaggeration=exa, cfg_weight=.4)); parts.append(torch.zeros(1, int(m.sr * .22)))
        ta.save(str(out / f'line_{lid}.wav'), torch.cat(parts[:-1], dim=1), m.sr); print('ok', lid, flush=True)
from faster_whisper import WhisperModel
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
words = {}
for lid in lines:
    segs, _ = wm.transcribe(str(out / f'line_{lid}.wav'), word_timestamps=True, beam_size=5)
    words[lid] = [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]
    dur = sf.info(str(out / f'line_{lid}.wav')).duration; words[lid + '_dur'] = round(dur, 2)
json.dump(words, open(out / 'words.json', 'w'), indent=1); print('words ok')

"""Background music for Mindsphere videos with ACE-Step 1.5 (MIT licence, open weights). Runs inside the RunPod pod.
Usage: python render/gpu/make_music.py <ace_step_dir> <out_dir>
Makes original tracks (calm 'cosy sandbox game' piano ambient, lo-fi beats, action tracks). Instrumental only: the owner wants no rap or vocals.
and an ~11.5 min demo soundtrack joined with crossfades. Two takes per track so we can pick the better one."""
import os, sys, time, json, subprocess, traceback
from pathlib import Path

ACE, OUT = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ACE))
from acestep.handler import AceStepHandler
from acestep.llm_inference import LLMHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

# Captions describe a genre/mood only; no artist or game names, so the result is our own music.
TRACKS = [
    ("01_ruhig_klavier_tag", 180, 72, "calm ambient piano, sparse gentle melody, soft warm synth pads, nostalgic and peaceful, "
     "cosy open-world exploration mood, sunny meadow morning, light reverb, slow, minimal, instrumental, background music for narration"),
    ("02_ruhig_nacht_sterne", 180, 66, "dreamy ambient night music, soft felt piano, celesta and music box, airy pads, starry sky, "
     "calm and wondering, slow, very minimal, instrumental, background music for narration"),
    ("03_lofi_beat_wissen", 180, 85, "chill lo-fi hip hop beat, dusty drums, mellow rhodes piano chords, warm bass, vinyl crackle, "
     "relaxed and focused, instrumental, no vocals, background music for a science explainer"),
    ("04_neugier_synth", 150, 100, "light curious electronic music, plucky synth arpeggios, glassy bells, soft kick, bright and "
     "optimistic, futuristic clean tech mood, instrumental, background music"),
    ("05_action_gehirn_vs_ki", 150, 128, "epic hybrid action music, driving drums, pulsing synth bass, big orchestral strings and "
     "brass hits, intense showdown, rising tension, cinematic, instrumental"),
    ("06_action_hiphop_beat", 120, 92, "hard hip hop instrumental beat, punchy boom bap drums, deep 808 bass, dark synth melody, "
     "confident and energetic, instrumental, no vocals"),
    ("07_spannung_dunkel", 120, 90, "suspenseful dark ambient, ticking percussion, low drones, mysterious synth, building tension, "
     "cinematic, instrumental"),
    ("09_ruhig_klavier_hoehle", 150, 70, "gentle ambient piano with soft echo, calm underground cave exploration, warm and slightly "
     "mysterious, sparse notes, soft pads, cosy blocky sandbox adventure mood, instrumental, no vocals"),
    ("10_action_abenteuer", 120, 140, "fast adventure action music, energetic drums, bright synth lead and staccato strings, "
     "heroic chase, exciting, video game boss battle feel, instrumental, no vocals"),
    ("08_hoffnung_ende", 150, 80, "warm hopeful ending music, piano and soft strings, gentle uplifting melody, emotional and calm, "
     "sunrise, instrumental, background music"),
]
def log(*a): print(*a, flush=True); open(OUT / "_log.txt", "a").write(" ".join(map(str, a)) + "\n")

dit = AceStepHandler()
msg, ok = dit.initialize_service(project_root=str(ACE), config_path="acestep-v15-turbo", device="auto", offload_to_cpu=False)
log("dit", ok, msg[:300])
if not ok: sys.exit(1)
llm = LLMHandler()
ckpt = ACE / "checkpoints"
lm_name = next((n for n in ("acestep-5Hz-lm-1.7B", "acestep-5Hz-lm-0.6B") if (ckpt / n).exists()), "acestep-5Hz-lm-1.7B")
msg, lm_ok = llm.initialize(checkpoint_dir=str(ckpt), lm_model_path=lm_name, backend="pt", device="auto", offload_to_cpu=False)
log("lm", lm_name, lm_ok, msg[:300])

def gen(name, dur, bpm, caption, lyrics="", instrumental=True):
    for thinking in ((True, False) if lm_ok else (False,)):
        t = time.time()
        try:
            p = GenerationParams(task_type="text2music", thinking=thinking, caption=caption,
                                 lyrics=lyrics or "[Instrumental]", instrumental=instrumental, bpm=bpm,
                                 vocal_language="en" if not instrumental else "unknown", duration=float(dur),
                                 inference_steps=8, guidance_scale=1.0, seed=-1, fade_in_duration=1.5, fade_out_duration=3.0)
            r = generate_music(dit, llm, params=p,
                               config=GenerationConfig(batch_size=2, audio_format="wav"), save_dir=str(OUT / "_raw" / name))
            if r.success and r.audios:
                files = []
                for i, a in enumerate(r.audios):
                    src = a.get("path")
                    if not src: continue
                    dst = OUT / f"{name}_take{i + 1}.mp3"
                    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-b:a", "192k", str(dst)], check=True)
                    files.append(dst)
                log("ok", name, "thinking" if thinking else "plain", f"{time.time() - t:.0f}s", [f.name for f in files])
                if files: return files
            log("fail", name, thinking, getattr(r, "status_message", "")[:300])
        except Exception:
            log("error", name, thinking, traceback.format_exc()[-800:])
    return []

made = {}
for name, dur, bpm, cap in TRACKS:
    made[name] = gen(name, dur, bpm, cap)
    subprocess.run([sys.executable, str(Path(__file__).with_name("upload_release.py")), os.environ.get("RESULT_TAG", "music"), str(OUT)])

# ~11.5 min demo soundtrack: chapter order of a typical video, first 90 s of take 1 of each, 4 s crossfades (8*90-7*4 = 692 s)
order = ["05_action_gehirn_vs_ki", "01_ruhig_klavier_tag", "03_lofi_beat_wissen", "04_neugier_synth", "02_ruhig_nacht_sterne",
         "07_spannung_dunkel", "06_action_hiphop_beat", "08_hoffnung_ende"]
parts = [made[n][0] for n in order if made.get(n)]
if len(parts) >= 2:
    inputs = sum([["-i", str(p)] for p in parts], [])
    f = [f"[{i}:a]atrim=0:90,asetpts=N/SR/TB[t{i}]" for i in range(len(parts))]
    last = "[t0]"
    for i in range(1, len(parts)):
        lab = f"[x{i}]"; f.append(f"{last}[t{i}]acrossfade=d=4:c1=tri:c2=tri{lab}"); last = lab
    f.append(f"{last}afade=t=out:st=686:d=6[fin]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(f), "-map", "[fin]",
                    "-b:a", "192k", str(OUT / "00_DEMO_soundtrack_11min.mp3")])
    log("demo", [p.name for p in parts])
json.dump({k: [p.name for p in v] for k, v in made.items()}, open(OUT / "tracks.json", "w"), indent=1)

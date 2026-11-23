# Wissensvideo-Pipeline

n8n writes `jobs/<id>/script.json` and starts the **Render video** workflow. GitHub Actions makes the voice
(Kokoro, British), the images (Pollinations / Cloudflare, free), animates the scenes with GSAP and renders
with ffmpeg. Result: a GitHub release with `video.mp4`, `short_1..4.mp4` and `metadata.json`.

Optional: put a royalty-free track at `assets/music.mp3` (e.g. from the YouTube Audio Library).

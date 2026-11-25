#!/bin/bash
# Runs inside the RunPod pod. Always deletes its own pod at the end, success or not.
exec > >(tee /tmp/pod.log) 2>&1   # full log (setup included) so a failed pod still tells us why
cleanup() {
  if [ -d /w/render ] && [ ! -f /w/gpu_out/zz_DONE.txt ]; then   # died early: ship the log before the pod goes away
    mkdir -p /w/gpu_out; cp /tmp/pod.log /w/gpu_out/pod_log.txt; echo failed > /w/gpu_out/zz_DONE.txt
    (cd /w && timeout 120 python3 render/gpu/upload_release.py "$RESULT_TAG" /w/gpu_out final)
  fi
  echo "terminating pod $RUNPOD_POD_ID"; curl -s -X DELETE -H "Authorization: Bearer $RUNPOD_API_KEY" "https://api.runpod.io/v2/pods/$RUNPOD_POD_ID"; }
trap cleanup EXIT
set -x
export DEBIAN_FRONTEND=noninteractive
apt-get update -q && apt-get install -y -q ffmpeg espeak-ng git > /dev/null
git clone -q "https://github.com/$REPO" /w && cd /w
pip install -q hf_transfer ${PIP_PKGS:-chatterbox-tts kokoro soundfile} 2>&1 | tail -3
# keep torchvision/torchaudio in lockstep with whatever torch the packages pulled in (else: "operator torchvision::nms does not exist")
TVER=$(python -c "import torch;print(torch.__version__.split('+')[0])")
case "${TVER%.*}" in 2.4) V=0.19;; 2.5) V=0.20;; 2.6) V=0.21;; 2.7) V=0.22;; 2.8) V=0.23;; 2.9) V=0.24;; *) V="";; esac
[ -n "$V" ] && pip install -q "torch==$TVER" "torchvision==$V.*" "torchaudio==$TVER" 2>&1 | tail -2
python -c "import torch, torchvision, transformers; print('torch', torch.__version__, 'tv', torchvision.__version__, 'tf', transformers.__version__, torch.cuda.is_available())"
export DEVICE=cuda HF_HUB_ENABLE_HF_TRANSFER=1
mkdir -p /w/gpu_out
# idle watchdog: once the GPU has worked, 12 minutes in a row at 0 % means the task hangs -> stop (trap deletes the pod)
( seen=0; idle=0; while sleep 60; do u=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits | head -1 | tr -d ' ');
  [ "${u:-0}" -gt 10 ] && seen=1 && idle=0; [ "$seen" = 1 ] && [ "${u:-0}" -eq 0 ] && idle=$((idle+1));
  if [ "$idle" -ge 12 ]; then echo "IDLE WATCHDOG: GPU idle 12 min, stopping" | tee -a /w/gpu_out/log.txt; pkill -f "bash -c $TASK_CMD" ; pkill -f python; break; fi; done ) &
timeout -k 30 "${MAX_MIN:-60}m" bash -c "$TASK_CMD" 2>&1 | tee /w/gpu_out/log.txt   # hard stop: a hung task can never keep a paid pod alive
cp /tmp/pod.log /w/gpu_out/pod_log.txt
echo done > /w/gpu_out/zz_DONE.txt
python render/gpu/upload_release.py "$RESULT_TAG" /w/gpu_out final

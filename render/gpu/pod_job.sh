#!/bin/bash
# Runs inside the RunPod pod. Always deletes its own pod at the end, success or not.
cleanup() { echo "terminating pod $RUNPOD_POD_ID"; curl -s -X DELETE -H "Authorization: Bearer $RUNPOD_API_KEY" "https://rest.runpod.io/v1/pods/$RUNPOD_POD_ID"; }
trap cleanup EXIT
set -x
export DEBIAN_FRONTEND=noninteractive
apt-get update -q && apt-get install -y -q ffmpeg espeak-ng git > /dev/null
git clone -q "https://github.com/$REPO" /w && cd /w
pip install -q ${PIP_PKGS:-chatterbox-tts kokoro soundfile} 2>&1 | tail -3
export DEVICE=cuda
mkdir -p /w/gpu_out
bash -c "$TASK_CMD" 2>&1 | tee /w/gpu_out/log.txt
echo done > /w/gpu_out/zz_DONE.txt
python render/gpu/upload_release.py "$RESULT_TAG" /w/gpu_out

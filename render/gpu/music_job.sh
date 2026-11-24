#!/bin/bash
# GPU task: install ACE-Step 1.5 and make background music (called as TASK_CMD inside the RunPod pod).
set -x
git clone -q --depth 1 https://github.com/ace-step/ACE-Step-1.5.git /ace
# flash-attn would compile for ages, nano-vllm is only needed for the vllm backend (we use the plain PyTorch backend)
grep -viE '^(flash-attn|nano-vllm)' /ace/requirements.txt > /tmp/req.txt
pip install -q -r /tmp/req.txt 2>&1 | tail -5
pip install -q --no-deps -e /ace 2>&1 | tail -2
python -c "import torch; print('torch', torch.__version__, 'cuda', torch.cuda.is_available())"
python render/gpu/make_music.py /ace gpu_out

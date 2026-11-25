#!/bin/bash
# GPU task: install ACE-Step 1.5 and make background music (called as TASK_CMD inside the RunPod pod).
set -x
nvidia-smi --query-gpu=name,driver_version --format=csv
git clone -q --depth 1 https://github.com/ace-step/ACE-Step-1.5.git /ace
# flash-attn would compile for ages, nano-vllm is only for the vllm backend (we use plain PyTorch);
# torch comes separately so it matches the pod's driver
grep -viE '^(flash-attn|nano-vllm|torch|torchvision|torchaudio|triton)' /ace/requirements.txt > /tmp/req.txt
cuda_ok() { python -c "import torch,sys; print('torch', torch.__version__, 'cuda', torch.cuda.is_available()); sys.exit(0 if torch.cuda.is_available() else 1)"; }
pip install -q torch==2.7.1 torchvision==0.22.1 torchaudio==2.7.1 --index-url https://download.pytorch.org/whl/cu126 2>&1 | tail -2
cuda_ok || pip install -q torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124 2>&1 | tail -2
cuda_ok || { echo "NO CUDA, giving up"; exit 1; }
TV=$(python -c "import torch;print(torch.__version__.split('+')[0])")
pip install -q -r /tmp/req.txt "torch==$TV" 2>&1 | tail -5
pip install -q --no-deps -e /ace 2>&1 | tail -2
pip uninstall -y -q torchcodec torchao 2>/dev/null   # need newer torch than we can run; not used for plain generation
cuda_ok || exit 1
python render/gpu/make_music.py /ace gpu_out

"""Create a RunPod pod via REST API v2, trying GPU types in order. Prints pod id to $GITHUB_ENV."""
import json, os, sys, time, urllib.request, urllib.error
KEY = os.environ["RUNPOD_API_KEY"]; KIND = os.environ.get("GPU", "small"); BIG = KIND in ("big", "h100")
GPUS = {"h100": ["NVIDIA H100 80GB HBM3", "NVIDIA H100 PCIe", "NVIDIA H100 NVL", "NVIDIA A100-SXM4-80GB", "NVIDIA A100 80GB PCIe"],
        "big": ["NVIDIA RTX A6000", "NVIDIA L40S", "NVIDIA A40", "NVIDIA RTX 6000 Ada Generation", "NVIDIA L40"],
        "small": ["NVIDIA GeForce RTX 4090", "NVIDIA RTX A5000", "NVIDIA GeForce RTX 3090", "NVIDIA L4", "NVIDIA RTX A4500"]}[KIND]
repo = os.environ["GITHUB_REPOSITORY"]
def req(method, path, body=None):
    r = urllib.request.Request("https://api.runpod.io" + path, method=method, data=json.dumps(body).encode() if body else None,
                               headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=60) as resp: return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:400]
for attempt in range(3):
    for cloud in ("COMMUNITY", "SECURE"):
        for g in GPUS:
            body = {"name": "mindsphere-gpu", "image": "runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04", "cloud": cloud,
                    "gpu": {"id": g, "count": 1}, "disk": 200 if BIG else 60,
                    "env": {"RUNPOD_API_KEY": KEY, "GH_TOKEN": os.environ["GH_TOKEN"], "REPO": repo, "TASK_CMD": os.environ["TASK_CMD"],
                            "PIP_PKGS": os.environ["PIP_PKGS"], "RESULT_TAG": "gpu-" + os.environ["GITHUB_RUN_ID"]},
                    "entrypoint": ["bash", "-c"],
                    "cmd": [f"curl -sL https://raw.githubusercontent.com/{repo}/main/render/gpu/pod_job.sh | bash"]}
            code, d = req("POST", "/v2/pods", body)
            if code in (200, 201) and isinstance(d, dict) and d.get("id"):
                print("pod", d["id"], g, cloud, {k: d.get(k) for k in ("costPerHr", "status", "desiredStatus")})
                open(os.environ["GITHUB_ENV"], "a").write(f"POD={d['id']}\n"); sys.exit(0)
            print("no", g, cloud, code, d if isinstance(d, str) else json.dumps(d)[:300])
    time.sleep(30)
sys.exit("no GPU available")

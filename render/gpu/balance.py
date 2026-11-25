"""Print the RunPod balance (USD) of the account behind RUNPOD_API_KEY. Used before/after every GPU job for a cost report."""
import json, os, urllib.request
q = json.dumps({"query": "query { myself { clientBalance } }"}).encode()
r = urllib.request.Request('https://api.runpod.io/graphql', q, {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + os.environ['RUNPOD_API_KEY']})
print(round(json.load(urllib.request.urlopen(r, timeout=30))['data']['myself']['clientBalance'], 4))

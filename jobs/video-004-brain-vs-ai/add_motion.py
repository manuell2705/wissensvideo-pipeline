"""Every spoken idea gets a visual: info cards (labels), counters (stat), versus/score screens, big questions."""
import json, sys
P = 'jobs/video-004-brain-vs-ai/script.json'
d = json.load(open(P))
T, A = '#3fe0d0', '#ffb547'
add = {
 6:  dict(labels=['Real science', '5 rounds', '1 winner']),
 8:  dict(labels=['Brain scans: every region gets busy'], gfx=[{'type': 'bigq', 'at': 'myth', 'text': '10% = MYTH'}]),
 9:  dict(labels=['AI improves every few months'], gfx=[{'type': 'bigq', 'at': 'actually', 'text': 'WHAT ARE YOU BETTER AT?'}]),
 10: dict(labels=['Every limit removed', 'Perfect focus', 'No sleep needed', 'Real numbers only']),
 11: dict(gfx=[{'type': 'vs', 'at': 'round', 'left': 'ROUND 1', 'left_sub': '', 'right': 'SPEED', 'right_sub': ''}]),
 16: dict(labels=['Neurons as fast as a chip?', 'Brain tissue overheats']),
 17: dict(gfx=[{'type': 'stat', 'at': 'eighty', 'value': 86000000000, 'caption': 'neurons, all working at once'},
               {'type': 'stat', 'at': 'trillion', 'value': 100, 'suffix': ' trillion', 'caption': 'connections', 'pos': 'r'}]),
 18: dict(labels=['Face recognised in a fraction of a second', 'walking + talking + dodging']),
 20: dict(gfx=[{'type': 'vs', 'at': 'round', 'left': 'ROUND 2', 'left_sub': '', 'right': 'MEMORY', 'right_sub': ''}]),
 21: dict(gfx=[{'type': 'stat', 'at': 'trillions', 'value': 10, 'suffix': ' trillion+', 'caption': 'words of text a big AI model learned from'}]),
 22: dict(gfx=[{'type': 'bars', 'at': 'storage', 'max': 1000000, 'items': [
           {'label': 'Your brain (estimate)', 'value': 1000000, 'unit': 'GB', 'color': T, 'at': 'petabyte'},
           {'label': 'Phone', 'value': 128, 'unit': 'GB', 'color': A, 'at': 'million'}]}]),
 23: dict(labels=['Some people remember every day', 'Even the weather']),
 24: dict(labels=['Not files', 'Rebuilt every time', 'Memories change a little']),
 25: dict(labels=['AI: confident but wrong', '"Hallucinating"', 'You: you know when you are unsure']),
 26: dict(labels=['Perfect recall?', 'Forgetting = a feature']),
 28: dict(gfx=[{'type': 'vs', 'at': 'round', 'left': 'ROUND 3', 'left_sub': '', 'right': 'ENERGY', 'right_sub': ''}]),
 31: dict(gfx=[{'type': 'stat', 'at': 'four', 'value': 400, 'suffix': ' kcal', 'caption': 'your brain per day'},
               {'type': 'stat', 'at': 'millions', 'value': 5000000, 'suffix': '+', 'caption': 'sandwiches a day for a data-center brain', 'pos': 'r'}]),
 32: dict(labels=['Data centers: a growing share of world electricity', 'AI pushes it up']),
 34: dict(gfx=[{'type': 'vs', 'at': 'round', 'left': 'ROUND 4', 'left_sub': '', 'right': 'LEARNING', 'right_sub': ''}]),
 36: dict(gfx=[{'type': 'bars', 'at': 'models', 'max': 1000, 'items': [
           {'label': 'Child', 'value': 1, 'unit': 'x', 'color': T, 'at': 'kid'},
           {'label': 'AI model', 'value': 100000, 'unit': 'x text', 'color': A, 'at': 'hundreds', 'overflow': True}]}],
          labels=['1 giraffe = learned forever']),
 37: dict(labels=['Bike', 'Scooter: suddenly easy', 'AI: struggles in new situations']),
 38: dict(labels=['Deep sleep: replay the day', 'Keep what matters', 'AI model: stays the same']),
 39: dict(labels=['Practice', 'Brain physically rewires']),
 41: dict(gfx=[{'type': 'vs', 'at': 'final', 'left': 'ROUND 5', 'left_sub': '', 'right': 'FEELING', 'right_sub': 'creativity'}]),
 42: dict(labels=['Poem: 1 second', 'Picture', 'Song']),
 43: dict(labels=['Learned from human work', 'Every style: invented by someone', 'You: something new']),
 44: dict(labels=['Smell of rain?', 'Missing someone?']),
 45: dict(labels=['Feelings = what matters', 'Without emotions: hard to choose lunch']),
 47: dict(gfx=[{'type': 'stat', 'at': 'hundred', 'value': 100, 'suffix': '%', 'caption': 'every neuron, all at once'}]),
 48: dict(labels=['Movie myth: one pill', 'Read minds? Move objects?', 'Real science: more interesting']),
 49: dict(gfx=[{'type': 'bigq', 'at': 'seizure', 'text': 'SEIZURE'}], labels=['Not genius', 'Chaos']),
 50: dict(labels=['It chooses', 'Like an orchestra', 'Silence matters']),
 53: dict(gfx=[{'type': 'vs', 'at': 'teams', 'left': 'HUMAN + AI', 'left_sub': 'winner', 'right': 'BEST AI', 'right_sub': 'or best player', 'at2': 'best'}]),
 55: dict(labels=['Right lights on', 'At the right time', 'New tools']),
 56: dict(labels=['AI: speed + memory', 'You: curiosity, feeling, courage']),
 57: dict(gfx=[{'type': 'bigq', 'at': 'build', 'text': 'WHAT WILL YOU BUILD?'}]),
}
for s in d['scenes']:
    a = add.get(s['id'])
    if not a: continue
    if 'labels' in a and not s.get('labels'): s['labels'] = a['labels']
    if 'gfx' in a: s['gfx'] = (s.get('gfx') or []) + a['gfx']
json.dump(d, open(P, 'w'), indent=1, ensure_ascii=False)
print('ok', sum(1 for s in d['scenes'] if s.get('gfx') or s.get('labels')), 'of', len(d['scenes']))

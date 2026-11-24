"""Video 005: 'What if your brain ran at 100%?' Main body = brain/body/abilities at 100% (honest), finale = logical 100%-brain vs AI showdown."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
K = "Kai (a young man with short dark messy hair and a teal hoodie)"
M = "Mira (a young woman with a dark ponytail and a warm amber jacket)"
O = "Orbi (a small floating glass orb robot with a glowing green orbit ring and two dot eyes)"
T = "the AI titan (a towering figure of dark glass panels with glowing amber circuit lines and calm amber eyes)"
op = json.load(open(os.path.join(HERE, '..', 'video-004-brain-vs-ai', 'opening.json')))
TE, AM = '#3fe0d0', '#ffb547'

def sc(ch, narr, img, kind='image', onscreen=None, gfx=None, ref=None, cutout=False, transition=None, labels=None, energy=None):
    d = dict(chapter=ch, kind=kind, onscreen=onscreen, labels=labels or [], narration=narr, image_prompt=img)
    if gfx: d['gfx'] = gfx
    if ref: d['ref'] = ref
    if cutout: d['cutout'] = True
    if transition: d['transition'] = transition
    if energy is not None: d['energy'] = energy
    return d
B = lambda at, items, mx=None: dict(type='bars', at=at, items=items, **({'max': mx} if mx else {}))
I = lambda label, value, unit, at, color=TE, **k: dict(label=label, value=value, unit=unit, at=at, color=color, **k)
ST = lambda at, value, caption, **k: dict(type='stat', at=at, value=value, caption=caption, **k)
Q = lambda at, text: dict(type='bigq', at=at, text=text)
VS = lambda at, l, ls, r, rs, at2=None: dict(type='vs', at=at, left=l, left_sub=ls, right=r, right_sub=rs, **({'at2': at2} if at2 else {}))

S = [dict(x) for x in op['scenes'][:4]]          # approved hook: 20 W vs a city, the fight, 'Who wins?'
S += [
 sc("Hook", "But before they fight, a better question. What would one hundred percent actually do to you? To your senses, your memory, your body?",
    "a glowing human silhouette made of night-city lights standing on a hill, a giant dial on the horizon turning from 10 to 100 percent, teal sky",
    gfx=[Q('actually', '100% = ?')], transition='gta'),
 sc("Title", "", "", kind='title', onscreen="Your Brain at 100% vs AI", transition='dive'),

 # ---------- the myth ----------
 sc("The myth", "You've probably heard that we only use ten percent of our brains. It's in movies, ads, and motivational videos.",
    "a cinema screen in a dark theatre showing a glowing brain with only a tiny corner lit up, popcorn on a seat",
    gfx=[ST('ten', 10, 'the famous myth', suffix='%')]),
 sc("The myth", "Here's the truth: you already use all of it. Brain scans show that over a single day, practically every region gets busy.",
    "a human brain drawn as a night city seen from above, district after district lighting up over a day, sun and moon moving overhead",
    labels=['Every region gets busy', 'Over a day'], transition='out'),
 sc("The myth", "Just not all at the same time. At any moment, only a small fraction of your neurons is firing. And that's on purpose.",
    "the brain city at night with only a few calm lights glowing in different districts, the rest resting in soft blue darkness",
    labels=['Only a small fraction at once', 'On purpose']),
 sc("The myth", "Your brain is about two percent of your body weight, yet it uses around twenty percent of your energy. Turning everything on would need far more power than your body can deliver.",
    "a glass human body with a glowing brain, a thick stream of warm energy flowing from the body up into the head like a river",
    gfx=[B('two', [I('Weight', 2, '% of body', 'two'), I('Energy use', 20, '% of body', 'twenty', AM)], 25)]),
 sc("The myth", "So let's play a game. Fantasy rules: what if the limits disappeared? Let's go through it, piece by piece, and keep it honest.",
    "a glowing control panel inside a calm observatory, five big sliders labelled with simple icons for eye, memory, lightning, muscle and sprout, all sliding up",
    labels=['Fantasy rules', 'Piece by piece', 'Honest science']),

 # ---------- senses ----------
 sc("1. Senses", "Level one. Your senses.", "a giant glowing eye made of glass reflecting a sunny meadow", kind='chapter', onscreen="1. Senses", transition='dive'),
 sc("1. Senses", "Right now, your eyes, ears and skin send your brain a flood of information. Millions of signals every second.",
    "a waterfall of glowing light particles pouring from an eye, an ear and a hand into a calm brain-shaped lake",
    gfx=[ST('millions', 10000000, 'bits per second, from your eyes alone (estimate)')]),
 sc("1. Senses", "But your conscious mind only handles a tiny trickle of that. Researchers estimate it at just a few dozen bits per second.",
    "the same waterfall narrowing into a single thin glowing stream that flows through a small golden gate",
    gfx=[B('conscious', [I('Into your senses', 10000000, 'bits/s', 'flood', AM, overflow=True), I('Conscious mind', 10, 'bits/s', 'trickle')], 50)]),
 sc("1. Senses", "So what if you could take it all in? Every sound, every flicker, every itch of your sock. At the same time.",
    f"{K} standing in a busy train station, hundreds of tiny glowing sound waves, flashes and symbols crowding around his head", ref='kai', cutout=True,
    labels=['Every sound', 'Every flicker', 'Every itch'], energy=True),
 sc("1. Senses", "You wouldn't feel like a superhero. You'd feel overwhelmed. Your brain's filter is what lets you hear your name across a noisy room.",
    "a glowing sieve made of light floating over a crowded party, filtering a storm of noise into one clear golden word drifting upward",
    labels=['Overload', 'The filter is the superpower']),
 sc("1. Senses", "Fantasy verdict: more input is not better. Better filtering is.", "a calm glass lighthouse sending one clean beam through a stormy sea of colourful noise",
    gfx=[Q('filtering', 'FILTER > FLOOD')]),

 # ---------- memory ----------
 sc("2. Memory", "Level two. Memory.", "an endless glowing library floating in space, books turning into stars", kind='chapter', onscreen="2. Memory", transition='gta'),
 sc("2. Memory", "Some people already live with an extreme memory. With a rare condition called hyperthymesia, they remember almost every day of their lives.",
    "a corridor of floating glowing calendar pages stretching into the distance, one page opening to show a rainy afternoon",
    labels=['Hyperthymesia', 'Almost every day remembered']),
 sc("2. Memory", "Ask them about a random Tuesday years ago, and they can tell you what they did, and sometimes even the weather.",
    "a single glowing calendar page for a Tuesday unfolding into a small 3D scene of a rainy street with an umbrella",
    labels=['A random Tuesday', 'Even the weather']),
 sc("2. Memory", "Fewer than a hundred cases have been studied. And many of them say it's not only a gift. Bad memories stay sharp too.",
    "a glass jar of glowing memories, mostly warm golden lights but a few dark stormy ones swirling just as bright",
    gfx=[ST('hundred', 100, 'studied cases (fewer than)', prefix='< ')]),
 sc("2. Memory", "And here's the twist: you don't store memories like files. You rebuild them every time you remember, like retelling a story.",
    "a memory drawn as a glowing sandcastle being rebuilt by tiny hands of light, slightly different each time, at the edge of a calm sea",
    labels=['Not files', 'Rebuilt every time'], transition='out'),
 sc("2. Memory", "Forgetting isn't a bug. It's your brain cleaning up, so the important things stand out.",
    "a calm glowing broom of light sweeping dust off a shelf of memory crystals, the brightest crystals shining clearer",
    gfx=[Q('feature', 'FORGETTING = CLEAN-UP')]),

 # ---------- speed ----------
 sc("3. Speed", "Level three. Speed.", "a stopwatch made of light floating over a quiet night race track", kind='chapter', onscreen="3. Speed", transition='dive'),
 sc("3. Speed", "Your fastest nerve signals travel at up to one hundred and twenty meters per second. Faster than a race car on a straight.",
    "a glowing nerve fibre like a highway with a bright pulse of light racing along it past a red race car",
    gfx=[B('signals', [I('Race car', 90, 'm/s', 'faster', AM), I('Nerve signal', 120, 'm/s', 'hundred')], 130)]),
 sc("3. Speed", "Still, it takes you about a quarter of a second to react. See the ball, move your hand.",
    "a tennis ball frozen in mid-air in front of a racket, a glowing timer ring around it showing a quarter",
    gfx=[ST('quarter', 250, 'milliseconds reaction time', suffix=' ms')]),
 sc("3. Speed", "Fantasy upgrade: neurons that fire ten times faster. Sounds great. But more firing means more energy, and more energy means more heat.",
    "a cartoon brain wearing a tiny racing helmet, steam and little flames starting to rise from it",
    labels=['10x faster neurons', 'More energy', 'More heat'], energy=True),
 sc("3. Speed", "Your brain works best in a narrow temperature range. A few degrees too warm, and thinking gets confused. Push it further, and it becomes dangerous.",
    "a glowing thermometer standing next to a brain, the safe zone glowing teal and the top glowing warning amber",
    gfx=[B('degrees', [I('Normal', 37, '°C', 'narrow'), I('Danger zone', 41, '°C', 'dangerous', AM)], 42)]),
 sc("3. Speed", "Your brain has a better trick. It works in parallel. Eighty-six billion neurons and about a hundred trillion connections, all working at once.",
    "an enormous glowing web of neurons stretching like a galaxy, countless tiny pulses travelling at the same time",
    gfx=[ST('eighty', 86000000000, 'neurons'), ST('trillion', 100, 'connections', suffix=' trillion', pos='r')], transition='out'),

 # ---------- body ----------
 sc("4. Body", "Level four. Your body.", "a glowing anatomy figure made of glass standing in a calm sunny field", kind='chapter', onscreen="4. Body", transition='gta'),
 sc("4. Body", "Your brain is also a bodyguard. It never lets your muscles pull with everything they have, because that could tear tendons or crack bones.",
    "a glass arm with glowing muscles, a small glowing safety lock on the elbow holding back the muscle fibres",
    labels=['Built-in safety limit', 'Protects tendons and bones']),
 sc("4. Body", "In extreme moments, with adrenaline flooding in, people have reported surprising bursts of strength. Scientists think the brain loosens that limit for a moment.",
    "a dramatic anime scene of a glowing silhouette lifting the corner of a car on a rainy street, golden adrenaline sparks around them",
    labels=['Adrenaline', 'Limit loosened for a moment'], energy=True),
 sc("4. Body", "Now imagine no limit at all. And no pain either. Sounds powerful, until you remember why pain exists.",
    "a glowing red alarm bell in the shape of a nerve, ringing softly next to a bandaged hand",
    labels=['No limit', 'No pain?']),
 sc("4. Body", "People born unable to feel pain often get badly hurt without noticing. Pain is the alarm that keeps you alive.",
    "a calm glowing smoke detector on a ceiling made of nerves, shielding a small cosy house beneath it",
    gfx=[Q('alarm', 'PAIN = ALARM')]),

 # ---------- learning ----------
 sc("5. Learning", "Level five. Learning.", "a small sprout growing out of a glowing book at dawn", kind='chapter', onscreen="5. Learning", transition='dive'),
 sc("5. Learning", "This is the one upgrade you already have. Every time you practise something, your brain physically rewires itself.",
    "a glowing brain with new bright paths growing between districts like roads being built overnight",
    labels=['Practice', 'Brain rewires itself']),
 sc("5. Learning", "London taxi drivers, who memorise thousands of streets, were found to have a larger memory region in the back of the hippocampus.",
    "a glowing map of a maze-like old city at night, a black cab tracing a golden route, a small glowing seahorse shape above it",
    gfx=[ST('thousands', 25000, 'streets learned by London cabbies', suffix='+')]),
 sc("5. Learning", "And while you sleep, your brain replays the day and keeps what matters. So a well-rested brain is already closer to one hundred percent than a tired one.",
    "a peaceful bedroom at night, a dreamy glowing replay of the day drifting above the bed like constellations",
    labels=['Sleep replays the day', 'Keeps what matters'], transition='out'),

 # ---------- superpowers ----------
 sc("6. Superpowers", "Level six. Superpowers.", "a glowing comic-style lightning bolt inside a glass sphere under the stars", kind='chapter', onscreen="6. Superpowers", transition='gta'),
 sc("6. Superpowers", "In the movie Lucy, a drug unlocks a hundred percent of the brain, and suddenly she can read minds and move objects.",
    "a cinema screen showing a glowing figure with floating objects around her, film reel frames curling at the edges",
    labels=['Movie: read minds', 'Movie: move objects']),
 sc("6. Superpowers", "Real neuroscience has found no sign of any of that. Your brain can't send thoughts through the air or bend a spoon.",
    "a spoon floating in front of a glowing brain, a big friendly teal cross mark next to it",
    gfx=[Q('sign', 'NO EVIDENCE')]),
 sc("6. Superpowers", "And if every neuron really fired at once? We know what that looks like. It's called a seizure. Not genius. Chaos.",
    "the brain city lights flickering wildly and shorting out, lightning between the districts, then darkness",
    gfx=[Q('seizure', 'SEIZURE')], labels=['Not genius', 'Chaos'], energy=True),
 sc("6. Superpowers", "But some real brains do things that look like superpowers. Kim Peek, the man who inspired the film Rain Man, could recall the contents of thousands of books.",
    "an endless glowing bookshelf spiralling up into the night sky, pages lifting off and orbiting like small moons",
    gfx=[ST('thousands', 12000, 'books recalled (reported)', suffix='+')]),
 sc("6. Superpowers", "His brain was wired differently. Some everyday things were hard for him. Every extreme ability seems to come with a cost.",
    "a golden balance scale floating in space, one side a glowing book, the other a small everyday house key",
    labels=['Wired differently', 'Every ability has a cost'], transition='out'),

 # ---------- the real 100% ----------
 sc("The real 100%", "So is there a real one hundred percent? The closest thing might be something you've already felt.",
    "a calm glowing mountain path at sunrise leading to a summit, a small light waiting at the top", gfx=[Q('real', 'THE REAL 100%?')]),
 sc("The real 100%", "Time disappears. You stop worrying about what others think. The task almost does itself. Psychologists call it flow.",
    f"{M} painting on a giant canvas in a quiet studio at night, warm light, time-lapse clocks gently melting into stars around her", ref='mira', cutout=True,
    labels=['Time disappears', 'No self-doubt', 'Flow']),
 sc("The real 100%", "Some researchers think in flow, parts of the brain that judge and second-guess quiet down. Not more brain. Less noise.",
    "the brain city at night with the busy front district dimming calmly while one bright path glows steadily through it",
    gfx=[Q('noise', 'LESS NOISE')]),
 sc("The real 100%", "Flow shows up when a challenge is just a little harder than your skill. Too easy is boring. Too hard is stress. In between is the sweet spot.",
    "a glowing curved path between a sleepy grey valley and a stormy cliff, a bright golden lane running exactly in the middle",
    labels=['Too easy = boring', 'Too hard = stress', 'Sweet spot = flow']),

 # ---------- showdown ----------
 sc("Showdown", "And now, the fight we promised. Your brain, at its very best... versus the smartest AI ever built.",
    "epic anime arena under a starry sky, a glowing human brain of teal light facing a towering figure of dark glass with amber circuit lines",
    gfx=[VS('brain', 'YOUR BRAIN', 'at its best', 'AI', 'smartest ever built', 'versus')], transition='gta', energy=True),
 sc("Showdown", "Round one: speed. A processor ticks billions of times per second. A neuron, a few hundred. That's not a contest. Point to the machine.",
    "split image: on the left a single neuron sparking slowly like a firefly, on the right a computer chip flashing like a strobe",
    gfx=[B('processor', [I('Neuron', 500, 'per s', 'neuron'), I('Processor', 3000000000, 'per s', 'billions', AM, overflow=True)], 600), VS('point', 'BRAIN', '0', 'AI', '1')]),
 sc("Showdown", "Round two: knowledge. A big AI model has read trillions of words. No human could read that in a thousand lifetimes. Point to the machine.",
    f"{T} standing inside a canyon made of stacked glowing books and scrolls, text streams pouring into its chest",
    gfx=[ST('trillions', 10, 'words of training text', suffix=' trillion+'), VS('point', 'BRAIN', '0', 'AI', '2')]),
 sc("Showdown", "Round three: energy. You think all day on twenty watts. The biggest AI systems need power plants. Point to you.",
    "a tiny glowing brain balanced on one side of a golden scale, outweighing a giant power plant on the other side",
    gfx=[B('twenty', [I('Your brain', 20, 'W', 'twenty'), I('AI data center', 100000000, 'W', 'power', AM, overflow=True)], 1000), VS('point', 'BRAIN', '1', 'AI', '2')]),
 sc("Showdown", "Round four: learning. Show a child one giraffe, and they know giraffes forever. AI needs thousands of examples. Point to you.",
    "a little child pointing excitedly at a single giraffe peeking over a fence in a sunny park, glowing outline around the giraffe",
    gfx=[B('giraffe', [I('Child', 1, 'example', 'child'), I('AI', 1000, 'examples', 'thousands', AM, overflow=True)], 20), VS('point', 'BRAIN', '2', 'AI', '2')]),
 sc("Showdown", "Round five: the real world. Folding laundry, climbing stairs, catching a falling glass. Easy for you, still hard for robots. Point to you.",
    "a cosy living room, a glass slipping off a table and a hand of glowing teal light catching it mid-air, a clumsy robot arm tangled in laundry behind",
    gfx=[VS('point', 'BRAIN', '3', 'AI', '2')], labels=['Easy for you', 'Hard for robots']),
 sc("Showdown", "And feeling? It can write a poem about rain. But as far as we can tell, it has never smelled rain. That round stays open.",
    f"{T} gently writing glowing words in the air while real rain falls outside a large window behind it", gfx=[Q('open', '?')]),
 sc("Showdown", "Final score: three to two, for the brain. But the most interesting result came from chess.",
    "the holographic tournament board in the arena showing a close final score, confetti of light",
    gfx=[VS('final', 'BRAIN', '3', 'AI', '2')], energy=True),
 sc("Showdown", "When humans teamed up with computers, those teams beat the best grandmasters and the best chess programs of their time.",
    "a giant glowing chess board in the night sky, a human hand and an amber glass hand moving the same piece together",
    gfx=[VS('teamed', 'HUMAN + AI', 'winner', 'BEST AI', 'or best player', 'best')]),

 # ---------- ending ----------
 sc("Ending", "So your brain doesn't need to run at one hundred percent. It needs the right lights on at the right time. Good sleep. Real challenges. A little less noise.",
    "the brain night city calm and beautiful, the right districts glowing warmly, a soft sunrise beginning on the horizon",
    labels=['Right lights on', 'Good sleep', 'Real challenges', 'Less noise'], transition='dive'),
 sc("Ending", "Let the machine handle speed and memory. Keep the parts only you have: curiosity, feeling, and the courage to try something new.",
    "a glowing human brain and a glowing chip connected by a bridge of light over a calm night city at dawn",
    gfx=[Q('courage', 'BRAIN + AI')]),
 sc("Ending", "The question isn't who wins. It's what you'll build. See you on the next orbit.",
    "a small green glass planet with a glowing orbit ring floating in space at sunrise, tiny forests and a glass city on it"),
]
for i, s in enumerate(S, 1): s['id'] = i
words = sum(len(s['narration'].split()) for s in S)
script = dict(title="What If Your Brain Ran at 100%? (Brain vs AI)", category="Science",
 description="What would really happen if your brain ran at 100%? Your senses, memory, speed, body and 'superpowers', checked honestly with real science. And at the end: could a 100% brain beat the smartest AI ever built?",
 tags=["brain", "100% brain", "10 percent myth", "neuroscience", "brain vs AI", "flow state", "science explained", "Mindsphere"],
 sources=[
  "Herculano-Houzel 2009 / Azevedo et al. 2009: ~86 billion neurons",
  "Raichle & Gusnard 2002, PNAS: brain ~2% of body mass, ~20% of energy (~20 W)",
  "Lennie 2003, Current Biology: energy cost limits how many neurons can be active at once",
  "Zheng & Meister 2024, Neuron: 'The unbearable slowness of being' (~10 bits/s conscious throughput, ~10^9 bits/s sensory input)",
  "Parker, Cahill & McGaugh 2006; LePort et al. 2012: highly superior autobiographical memory (hyperthymesia)",
  "Purves et al., Neuroscience: conduction velocity up to ~120 m/s",
  "Walter & Carraretto 2016, Int J Hyperthermia: effects of brain temperature",
  "Maguire et al. 2000, PNAS: posterior hippocampus in London taxi drivers",
  "Nagasako et al. 2003, Pain: congenital insensitivity to pain",
  "NINDS: seizures as abnormal synchronous neural activity",
  "Treffert & Christensen 2005, Scientific American: Kim Peek",
  "Csikszentmihalyi 1990, Flow; Dietrich 2004: transient hypofrontality hypothesis",
  "Meta 2024: Llama 3 trained on ~15 trillion tokens",
  "IEA 2025, Energy and AI: data center electricity use",
  "Moravec 1988, Mind Children: what is easy for humans is hard for robots",
  "Kasparov 2010, NYRB: freestyle (centaur) chess"],
 scenes=S, shorts=[])
json.dump(script, open(os.path.join(HERE, 'script.json'), 'w'), indent=1, ensure_ascii=False)
print(len(S), 'scenes', words, 'words', round(words / 135, 1), 'min @135wpm')

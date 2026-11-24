import json
K="Kai (a young man with short dark messy hair and a teal hoodie)"
M="Mira (a young woman with a dark ponytail and a warm amber jacket)"
O="Orbi (a small floating glass orb robot with a glowing green orbit ring and two dot eyes)"
T="the AI titan (a towering figure of dark glass panels with glowing amber circuit lines and calm amber eyes)"
op=json.load(open('/home/claude/wissensvideo-pipeline/jobs/video-004-brain-vs-ai/opening.json'))
S=[dict(x) for x in op['scenes'][:4]]
def sc(ch, narr, img, kind='image', onscreen=None, gfx=None, ref=None, cutout=False, transition=None, labels=None, energy=None):
    d=dict(chapter=ch,kind=kind,onscreen=onscreen,labels=labels or [],narration=narr,image_prompt=img)
    if gfx: d['gfx']=gfx
    if ref: d['ref']=ref
    if cutout: d['cutout']=True
    if transition: d['transition']=transition
    if energy is not None: d['energy']=energy
    return d
B=lambda at,items,mx=None: dict(type='bars',at=at,items=items,**({'max':mx} if mx else {}))
I=lambda label,value,unit,at,color='#3fe0d0',**k: dict(label=label,value=value,unit=unit,at=at,color=color,**k)
S+= [
 sc("Title","", "", kind='title', onscreen="100% Brain vs AI: Who Wins?", transition='dive'),
 sc("Intro","Now, to be fair, nobody can actually switch a brain to one hundred percent. But we can play this game honestly, with real science. Five rounds. One winner.",
    "a glowing holographic tournament board floating in a calm night sky above a glass city, five empty round slots shining teal and amber"),
 sc("Intro","And here's a secret before we start: you already use all of your brain. Just not all at the same time.",
    "a human brain drawn as a night city seen from above, different districts lighting up one after another, never all at once", gfx=[dict(type='bigq',at='all',text='100% — just not at once')]),
 sc("Intro","Scans show that over a day, practically every region gets busy. The ten percent idea is a myth.",
    "a glass brain scanner in a calm teal lab, the brain image glowing in many colourful regions", labels=["10% myth"], transition='out'),
 sc("1. Speed","Round one. Speed.", "a stopwatch made of light floating between a glowing brain and a glowing computer chip, dark stadium lights",
    kind='chapter', onscreen="1. Speed"),
 sc("1. Speed","The fastest signals in your nerves race at about one hundred and twenty meters per second. That's faster than a race car.",
    "a glowing nerve fibre like a highway with a bright pulse of light racing along it past a red race car",
    gfx=[B('signals',[I('Race car',90,'m/s','faster','#ffb547'),I('Nerve signal',120,'m/s','hundred')],130)]),
 sc("1. Speed","But inside a chip, electric signals move at a big fraction of the speed of light. Millions of times faster.",
    f"{T} raising one hand, beams of light racing through transparent circuit boards around it",
    gfx=[B('chip',[I('Nerve signal',120,'m/s','signals'),I('Chip signal',150000000,'m/s','fraction','#ffb547',overflow=True)],120)], transition='gta'),
 sc("1. Speed","A neuron can fire maybe a few hundred times per second. A processor ticks billions of times. On pure speed, it's not even close.",
    "split image: on the left a single neuron sparking slowly like a firefly, on the right a computer chip flashing like a strobe",
    gfx=[B('neuron',[I('Neuron',500,'per s','neuron'),I('Processor',3000000000,'per s','billions','#ffb547',overflow=True)],600)]),
 sc("1. Speed","Round one goes to the machine.", f"the holographic tournament board, round one slot glowing amber with the symbol of {T}",
    gfx=[dict(type='vs',at='round',left='BRAIN',left_sub='0',right='AI',right_sub='1')], energy=True),
 sc("2. Memory","Round two. Memory.", "an endless glowing library floating in space, books turning into stars", kind='chapter', onscreen="2. Memory", transition='dive'),
 sc("2. Memory","A large language model has read more text than any human ever could. Trillions of words.",
    f"{T} standing inside a canyon made of stacked glowing books and scrolls, text streams pouring into its chest",
    onscreen="15,000,000,000,000", labels=["trillions of words"]),
 sc("2. Memory","But your brain isn't small either. One estimate suggests its storage could be around a petabyte. That's roughly a million gigabytes.",
    "a human brain made of glass with countless tiny glowing drawers and memory cubes inside, warm amber light",
    onscreen="1,000,000 GB", labels=["~1 petabyte (estimate)"], transition='out'),
 sc("2. Memory","And some people remember almost every day of their lives. Ask them about a random Tuesday years ago, and they'll tell you the weather.",
    f"{M} standing in a corridor of floating glowing calendar pages, one page opening to show a rainy day scene", ref='mira', cutout=True),
 sc("2. Memory","Still, the machine never forgets a fact. You forget where you left your keys. This round is close... but it goes to the AI.",
    f"{K} searching under a sofa cushion for his keys at night while {O} points at the keys on the table", ref='kai', cutout=True,
    gfx=[dict(type='vs',at='close',left='BRAIN',left_sub='0',right='AI',right_sub='2')]),
 sc("3. Energy","Round three. Energy.", "a single glowing light bulb in darkness next to a huge power station on the horizon", kind='chapter', onscreen="3. Energy", transition='gta'),
 sc("3. Energy","Remember: you run on about twenty watts. A banana and a sandwich, and you can think all day.",
    f"{K} eating a banana at a sunny kitchen table, a tiny glowing brain above his head powered by the banana like a battery", ref='kai', cutout=True,
    gfx=[B('twenty',[I('Your whole brain',20,'W','twenty')],100)]),
 sc("3. Energy","Training one of the biggest AI models can use as much electricity as thousands of homes use in a year.",
    "a vast glowing data center at night, thousands of small houses around it whose lights flicker as power flows into the center",
    gfx=[dict(type='icons',at='thousands',n=14,label='thousands of homes for a year')]),
 sc("3. Energy","For the energy it uses, your brain is one of the most efficient thinking machines we know. Round three: the brain. Easily.",
    "a tiny glowing brain balanced on one side of a golden scale, outweighing a giant power plant on the other side",
    gfx=[dict(type='vs',at='round',left='BRAIN',left_sub='1',right='AI',right_sub='2')], energy=True),
 sc("4. Learning","Round four. Learning.", "a small sprout growing out of a glowing book at dawn", kind='chapter', onscreen="4. Learning", transition='dive'),
 sc("4. Learning","By age five, a child has heard maybe tens of millions of words. And from that alone, they speak a whole language.",
    "a little child pointing at a bird in a sunny park, colourful word bubbles floating around as glowing shapes without letters",
    gfx=[B('child',[I('A child (age 5)',30,'million words','child'),I('An AI model',15000000,'million words','language','#ffb547',overflow=True)],40)]),
 sc("4. Learning","AI models need hundreds of thousands of times more text to get there. Show a kid one giraffe, and they'll recognise giraffes forever.",
    f"{M} showing a picture of a giraffe to a smiling child, a real giraffe peeking over a fence behind them", ref='mira', cutout=True, transition='out'),
 sc("4. Learning","Learning fast from tiny examples is still a human superpower. Round four: the brain.",
    "the holographic tournament board, round four slot glowing teal with a brain symbol",
    gfx=[dict(type='vs',at='round',left='BRAIN',left_sub='2',right='AI',right_sub='2')], energy=True),
 sc("5. Feeling","Final round. Creativity and feeling.", "a paint brush and a glowing circuit pen crossing like swords under a starry sky", kind='chapter', onscreen="5. Feeling", transition='gta'),
 sc("5. Feeling","AI can write a poem in a second. Paint a picture. Compose a song. And honestly, some of it is impressive.",
    f"{T} gently painting a glowing landscape on a giant canvas, musical notes of light drifting around"),
 sc("5. Feeling","But it doesn't know what rain smells like. It has never missed someone. As far as we can tell, there's nothing it feels like to be an AI.",
    f"{K} standing alone at a window at night watching rain, a soft reflection of a friend's face in the glass", ref='kai', cutout=True),
 sc("5. Feeling","And here's the strange part: we don't fully know what consciousness is. So this round... stays open.",
    "a mysterious glowing question mark made of stars floating above both a brain and a chip",
    gfx=[dict(type='bigq',at='open',text='?')], transition='dive'),
 sc("The 100% twist","Now, the promised upgrade. What if your brain really fired at one hundred percent? Every neuron, all at once?",
    "the brain night city with every single light switching on at the same moment, blinding white"),
 sc("The 100% twist","We actually know what that looks like. It's called a seizure. Not genius. Chaos.",
    "the brain city lights flickering wildly and shorting out, lightning between the districts, then darkness",
    labels=["seizure = everything at once"], energy=True),
 sc("The 100% twist","Your brain is powerful precisely because it doesn't use everything at once. It chooses. Like an orchestra, where silence matters as much as sound.",
    "a glowing orchestra on a floating stage, some musicians playing while others rest calmly, the music forming the shape of a brain", transition='out'),
 sc("Final score","So, the final score. Speed and memory: the machine. Energy and learning: you.",
    f"the holographic tournament board showing a tie, {T} on one side and a glowing human brain on the other",
    gfx=[dict(type='vs',at='final',left='BRAIN',left_sub='2',right='AI',right_sub='2')]),
 sc("Final score","But in chess, something surprising happened. Teams of humans working with computers beat both the best players and the best programs.",
    f"{M} sitting at a giant glowing chess board, {T} standing beside her as a teammate, pointing at a move together", ref='mira', cutout=True,
    labels=["human + AI teams"]),
 sc("Final score","Maybe that's the real answer. Not brain versus AI. Brain plus AI.",
    "a glowing human brain and a glowing chip connecting with a bridge of light over a calm night city",
    gfx=[dict(type='bigq',at='plus',text='BRAIN + AI')], transition='dive'),
 sc("Ending","Your brain doesn't need to run at one hundred percent. It needs the right lights on, at the right time. And now, you have tools no human ever had.",
    f"{K} and {M} standing on a hill at sunrise looking over a glowing city, {O} floating between them", cutout=True),
 sc("Ending","The question isn't who wins. It's what you'll build. See you on the next orbit.",
    "a small green glass planet with a glowing orbit ring floating in space at sunrise, tiny forests and a glass city on it"),
]
exec(open('/tmp/claude-0/-home-claude/7af9110f-4252-5499-aceb-72ff8c39fd54/scratchpad/add_vs.py').read())
for i, s in enumerate(S, 1): s['id'] = i
words=sum(len(s['narration'].split()) for s in S)
script=dict(title="100% Brain vs AI: Who Wins?", category="Science",
 description="What if your brain ran at 100%... and had to fight the smartest AI ever built? Five rounds: speed, memory, energy, learning and feeling.",
 tags=["brain","AI","artificial intelligence","neuroscience","100% brain","brain vs AI","science explained","Mindsphere"],
 sources=["Azevedo et al. 2009, J Comp Neurol: ~86 billion neurons",
  "Raichle & Gusnard 2002, PNAS: brain energy ~20 W",
  "Bartol et al. 2015, eLife: synaptic information storage, petabyte-scale estimate",
  "Purves et al., Neuroscience: conduction velocity up to ~120 m/s",
  "IEA 2025, Energy and AI: data center electricity use",
  "de Vries 2023, Joule / Luccioni et al. 2023: AI training energy (GWh range)",
  "Meta 2024: Llama 3 trained on ~15 trillion tokens",
  "Gilkerson et al. 2017 / Hart & Risley: words heard by young children",
  "LePort et al. 2012, Neurobiol Learn Mem: highly superior autobiographical memory",
  "NINDS: seizures as abnormal synchronous neural activity",
  "Kasparov 2010, NYRB 'The Chess Master and the Computer': freestyle (centaur) chess"],
 scenes=S, shorts=[])
json.dump(script, open('/home/claude/wissensvideo-pipeline/jobs/video-004-brain-vs-ai/script.json','w'), indent=1)
print(len(S), 'scenes', words, 'words', round(words/150,1), 'min')

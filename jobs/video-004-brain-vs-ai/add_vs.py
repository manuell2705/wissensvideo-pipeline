# extra scenes, inserted before the scene whose narration starts with the key
ADD = [
 ("Round one. Speed.", [
  sc("Intro", "So let's give your brain the fantasy version. Every limit removed. Perfect focus. No sleep needed. And put it in the ring against the smartest AI ever built. The rules: real numbers only.",
     f"{K} stepping into a glowing arena from a tunnel, teal energy around his head, crowds of light in the stands", ref='kai', cutout=True, transition='gta')]),
 ("Round one goes to the machine.", [
  sc("1. Speed", "Fantasy time: what if your neurons could fire as fast as a chip? Your brain would heat up like an overclocked computer. Brain tissue is very sensitive to heat, so that upgrade would cook you before you finished a sentence.",
     f"a cartoon brain wearing a tiny racing helmet, steam and little flames rising from it, {O} spraying it with a water hose", labels=["too hot to handle"]),
  sc("1. Speed", "But your brain has a trick of its own. It works in parallel. About eighty-six billion neurons, linked by something like a hundred trillion connections, all working at the same time.",
     "an enormous glowing web of neurons stretching like a galaxy, countless tiny pulses travelling at once", onscreen="100,000,000,000,000", labels=["86 billion neurons", "~100 trillion connections"]),
  sc("1. Speed", "That's how you recognise a friend's face in a crowd in a fraction of a second, while walking, talking, and dodging a bicycle.",
     f"{M} walking through a busy night market crowd, smiling and waving at a friend far away, a bicycle zooming past her", ref='mira', cutout=True)]),
 ("Still, the machine never forgets a fact.", [
  sc("2. Memory", "But you remember differently. You don't store files. You rebuild a memory every time you recall it, like retelling a story. That's why memories change a little, every time.",
     "a memory drawn as a glowing sandcastle being rebuilt by tiny hands of light, slightly different each time, at the edge of a calm sea", transition='dive'),
  sc("2. Memory", "Fantasy version: perfect recall of everything. Sounds amazing, until you realise you could never forget a single embarrassing moment. Forgetting is a feature, not a bug.",
     f"{K} covering his face in embarrassment while dozens of floating glowing screens replay awkward moments around him", ref='kai', cutout=True, labels=["forgetting = a feature"])]),
 ("For the energy it uses", [
  sc("3. Energy", "And the gap keeps growing. Data centers already use a noticeable share of the world's electricity, and AI is making that share rise fast.",
     "a night view of the Earth from space with bright glowing hotspots where data centers are, power lines pulsing toward them", labels=["rising fast"], transition='out')]),
 ("Learning fast from tiny examples", [
  sc("4. Learning", "You even learn while you sleep. In deep sleep, your brain replays the day and keeps what matters. A trained AI model mostly stays the same, until someone trains it again.",
     f"{M} sleeping peacefully, above her a dreamy glowing replay of her day drifting like constellations, {O} dimmed and resting nearby", ref='mira', cutout=True),
  sc("4. Learning", "Fantasy version: a brain that learns as fast as it wants. Honestly? Your real brain is closer to that than you think. Every time you practise something, it physically rewires itself.",
     "a glowing brain with new bright paths growing between districts like roads being built overnight", labels=["neuroplasticity"])]),
 ("And here's the strange part", [
  sc("5. Feeling", "And your feelings aren't a weakness in this fight. They tell you what matters. People who lose access to their emotions often struggle with even simple decisions, like what to eat for lunch.",
     "a glowing compass inside a heart shape pointing toward a warm light, floating over a calm lake at dusk", labels=["emotions guide decisions"], transition='out')]),
 ("So, the final score.", [
  sc("The 100% twist", "So the real upgrade isn't more power. It's better connections, good sleep, focus, and practice. Those are the settings you can actually change.",
     "a glowing control panel with four sliders labelled by icons: a moon, a target, a running shoe and a book, being gently pushed up by a hand of light",
     gfx=[dict(type='icons', at='connections', n=4, label='sleep · focus · move · practise')])]),
]
for key, extra in ADD:
    idx = next(i for i, s in enumerate(S) if s['narration'].startswith(key))
    S[idx:idx] = extra
ADD2 = [
 ("So let's give your brain the fantasy version.", [
  sc("Intro", "Why does this matter? Because every few months, AI gets better at something we thought only humans could do. So it's fair to ask: what are you actually better at?",
     "a calendar of glowing pages flipping fast while a chip symbol grows bigger on each page, a human silhouette watching calmly", labels=["AI improves fast"])]),
 ("Fantasy time: what if your neurons", [
  sc("1. Speed", "Your reaction time is about a quarter of a second. See a ball, move your hand. For an AI system that's an eternity... but you do it without any instructions at all.",
     f"{K} catching a ball flying toward him in a park at sunset, a little stopwatch hologram showing 0.25 s", ref='kai', cutout=True,
     gfx=[dict(type='bars', at='quarter', max=0.3, items=[dict(label='Your reaction', value=0.25, unit='s', at='quarter', color='#3fe0d0')])])]),
 ("Fantasy version: perfect recall", [
  sc("2. Memory", "And here's a weak spot for the machine: AI can make up facts and sound completely sure about them. Researchers call it hallucinating. Your memory isn't perfect either, but you usually know when you're unsure.",
     f"{T} confidently presenting a glowing chart that is clearly upside down, {O} tilting its head in confusion", labels=["AI hallucinations"])]),
 ("And the gap keeps growing.", [
  sc("3. Energy", "Twenty watts is about four hundred food calories a day. If your brain needed as much power as a big data center, you'd have to eat millions of sandwiches. Every day.",
     "a mountain of sandwiches piled up to the clouds in a cartoon city square, a tiny person looking up at it in shock",
     onscreen="400 kcal", labels=["your brain per day"])]),
 ("You even learn while you sleep.", [
  sc("4. Learning", "And you transfer what you learn. Learn to ride a bike, and a scooter is suddenly easy. Most AI systems struggle to carry a skill into a completely new situation.",
     f"{M} riding a bike on a sunny hill path, then the same path continuing with her on a scooter, smiling confidently", ref='mira', cutout=True)]),
 ("But it doesn't know what rain smells like.", [
  sc("5. Feeling", "But it learned all of that from things humans made. Every style it copies, someone once invented. You can come up with something that has never existed before.",
     "a glowing paintbrush drawing a completely new strange beautiful flower that grows into the sky, a chip trying to copy it from below")]),
 ("We actually know what that looks like.", [
  sc("The 100% twist", "Movies love this idea. One pill, and suddenly you can read minds and move objects. Real neuroscience is less dramatic, but honestly, more interesting.",
     "a cinema screen showing a glowing pill and a person floating with superpowers, popcorn and a skeptical Orbi in the front row", labels=["movie myth"])]),
 ("The question isn't who wins.", [
  sc("Ending", "Use the machine for speed and memory. Keep the parts that only you have: curiosity, feeling, and the courage to try something new.",
     f"{K} holding a glowing tablet showing data while {M} sketches a new idea in a notebook beside him, both on a rooftop at dusk, {O} watching happily", cutout=True)]),
]
for key, extra in ADD2:
    idx = next(i for i, s in enumerate(S) if s['narration'].startswith(key))
    S[idx:idx] = extra

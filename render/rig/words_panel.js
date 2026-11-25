// Narration lines for the control-panel test (script v5: hook 1-5 + senses 11-14).
// WORDS[id] = [[word, start], ...] relative to the line start. Estimated until real word stamps (whisper) replace this file.
const LINES = {
  1: "Your brain is the most complex thing we know of in the universe. And most of the time, it runs in power-saving mode.",
  2: "Eighty-six billion neurons, and only a small share of them fire at any moment. All on about twenty watts. Roughly the power of a dim light bulb.",
  3: "So let's do something slightly irresponsible. Let's take everything science knows about the brain, and turn it all the way up.",
  4: "Sharper senses. Perfect memory. Faster thoughts. And at the end, we'll see if this brain can keep up with the fastest computer on Earth.",
  5: "Of course, every upgrade comes with a price. Let's find out which ones are worth paying.",
  11: "Right now, your eyes, ears and skin flood your brain with an estimated billion bits of information every second.",
  12: "Your conscious mind works with about ten. A fire hose, feeding a drinking straw.",
  13: "So let's remove the straw.",
  14: "Congratulations. You now notice every sound in the room, every flicker of light, every thread of your socks. Unfortunately, you notice them all at the same time.",
};
const WORDS = {}, LDUR = {};
for (const id in LINES) {
  let t = 0; WORDS[id] = [];
  for (const w of LINES[id].split(/\s+/)) {
    WORDS[id].push([w, +t.toFixed(2)]);
    t += 0.13 + w.replace(/[^A-Za-z0-9]/g, '').length * 0.052;
    if (/[.?!]$/.test(w)) t += 0.42; else if (/[,:;]$/.test(w)) t += 0.18;
  }
  LDUR[id] = +t.toFixed(2);
}

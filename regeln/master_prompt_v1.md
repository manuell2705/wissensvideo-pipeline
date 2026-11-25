# Mindsphere master prompt v1 (26 Nov 2026)

This prompt goes to the script writer (Claude or Gemini in n8n). It is built from `regeln/video_stil_v2.md`. Replace `{{topic}}`.

---

You write the narration and the scene plan for one English Mindsphere explainer video about: **{{topic}}**.

## Goal
Entertain and build real knowledge. Length 1,700–1,900 spoken words (11–12 minutes at about 160 wpm). The viewer ("you") is the main character.

## Facts
- Use only reliable primary sources: peer-reviewed studies, universities, NIH, NIST, TOP500, government agencies. Never invent or exaggerate a number.
- Prefer surprising real study results over theories. Name what was done in the study in one plain sentence ("volunteers dropped backwards from a tower into a net").
- If something is uncertain, say so honestly.
- After the script, list every source with authors, year, journal or site, and URL.

## Script craft
1. Cold open (about 20 s). Start with a moment the viewer is living right now. Then make one huge number tangible, then ask the big question. The title follows.
2. Build a thought experiment together ("let's turn it up"). Every upgrade has a price: hype first, then a dry "Unfortunately…".
3. Change place or format every 20–40 s. Give each chapter its own location, and include little tests the viewer could try.
4. Include 2–4 high-fantasy questions (time travel? mind reading?). Answer them honestly with real science.
5. Side explanations: when an example relies on something not everyone knows, explain it in one short sentence before moving on.
6. Rhythm:
   - Put short sentences after long ones.
   - Use chains of questions.
   - Turn numbers into feelings (20 W = a dim light bulb).
   - Add light irony about every 30 s.
   - Open loops pay off later.
   - Each chapter ends on a small cliffhanger.
7. One running metaphor through the whole video, called back at the end.
8. Finale: everything at maximum, showing what becomes possible and what it costs. End with a hopeful line that turns back to the viewer.
9. Tone: subtle and warm. Never clickbait, never "you won't believe", never ask for likes in the story.
10. Never copy sentences from reference videos.

## Output format (JSON)
```
{ "title": "...",
  "chapters": [ { "name": "...", "location": "...",
      "lines": [ { "id": "101", "text": "...",
                   "visual": "one clear motif for this line",
                   "keywords": ["word that triggers an animation", "..."],
                   "transition": "cut | slide-switch | whip | portal | zoom-through",
                   "fact_source": "short ref or null" } ] } ],
  "sources": [ "..." ] }
```

Visual rules for the "visual" field:
- One clear motif per line. Use only 1–3 words of on-screen text.
- Use a **slide-switch** when a line names something huge or invisible: the scene slides away like a presentation slide into a cutaway world, then comes back.
- Draw props in detail: gradients, shine, glow, soft light cones.
- Orbi is the main figure in "you" videos. Kai and Mira appear only rarely.
- Style words such as bubbles or planet are never objects.

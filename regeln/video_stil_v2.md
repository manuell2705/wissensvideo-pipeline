# Mindsphere Video-Stil v2 (Stand 26.11.2026, ersetzt v1)

Alles Feedback von Manuell bis heute in einem Regelwerk. Diese Regeln gelten für jedes Video.
Fest sind nur Qualität, Stimme, Figuren und Stil. Welten, Bewegungen, Übergänge und Text wechseln mit dem Thema, damit kein Video wie das andere aussieht.

## 1. Ziel des Kanals
- Unterhalten **und** echtes Wissen aufbauen. Zuschauer sollen neugierig bleiben, nicht reingelegt werden.
- Englisch, etwa 11–12 Minuten, Sprechtempo 150–170 Wörter pro Minute.
- Qualität wie die Referenzen (Kurzgesagt, auch "Dinge Erklärt"), aber eigener Stil, eigener Text, nichts kopieren.

## 2. Fakten (nicht verhandelbar)
- Nur offizielle, zuverlässige Quellen: begutachtete Studien, Universitäten, NIH, NIST, TOP500, Behörden.
- Nichts erfinden, nichts übertreiben. Wenn etwas unsicher ist, sagen wir es ("scientists still argue about…").
- **Lieber echte, überraschende Studien-Ergebnisse als Theorien.** Beispiele, die gut funktionieren: der Turm-Sprung ins Netz (Zeit fühlt sich länger an), die Frau mit dem vierten Farbzapfen, 1 Milliarde Bits pro Sekunde Sinne gegen 10 Bits pro Sekunde Denken.
- Jede Quelle kommt in die Videobeschreibung.

## 3. Skript
**Einstieg** (aus den deutschen Kurzgesagt-Videos gelernt)
- Erst ein Gefühl oder ein Moment, den der Zuschauer gerade selbst erlebt ("Right now, as you watch this…"), dann eine riesige Zahl greifbar machen, dann die große Frage. Danach sofort der Titel.

**Durch das Video führen**
- "Du" anreden, Gegenwart, der Zuschauer ist mitten in der Geschichte.
- Gedankenexperiment "wir bauen es zusammen": jedes Upgrade hat einen Preis.
- Erst Begeisterung, dann trocken abbremsen ("Unfortunately…").
- Zahlen in Gefühle übersetzen (20 Watt = schwache Glühbirne).
- Kurzer Satz nach langem Satz. Fragen-Ketten. Leichte Ironie etwa alle 30 Sekunden.
- Offene Schleifen: etwas ankündigen und später auflösen. Kleiner Cliffhanger vor jedem Kapitel.
- Eine durchgehende Metapher (bei Video 1: der Gehirn-Regler) mit Rückbezug am Ende.
- **High-Fantasy-Fragen** einbauen (Zeitreise? Gedanken lesen? neue Farben?) und ehrlich mit echter Wissenschaft beantworten.
- **Neu: kurze Neben-Erklärungen.** Wenn ein Beispiel ein Thema benutzt, das nicht jeder kennt, erklären wir es in einem Satz. Beispiel: Beim Regenbogen kurz sagen, warum wir überhaupt Farben sehen (drei Arten von Farbzellen im Auge) und dass der Regenbogen eigentlich keine 7 Farben hat, sondern ein fließender Verlauf ist; die 7 hat Isaac Newton festgelegt.
- Ehrliche Grenzen nennen. Schluss mit Hoffnung, der zum Zuschauer zurückkommt.

**Ton**
- Subtil. Nie reißerisch, nie "you won't believe", nie um Klicks betteln. Sonst wirkt der Kanal "zuschauergeil".

## 4. Aufbau eines Videos
- Etwa alle 20–40 Sekunden ein neuer Ort oder eine neue Darstellungsart.
- Jedes Kapitel hat seinen eigenen Ort: Labor, Café, Prüfungssaal, Rennstrecke, Fitnessstudio, Schlafzimmer, Fantasie-Welten.
- Tests im Video (Quiz, Lineal-Fangtest, Fitness), bei denen Orbi mit 100 % Gehirn antritt.
- Der Zuschauer wird durch verschiedene Welten geführt, nicht eine Minute dieselbe Wiese.
- Großes Finale: alle Regler auf Maximum (auch Körper und Lernen). Was wäre möglich, und was kostet es?

## 5. Bild und Animation
- Freigegebener Look: `test_v5_brain_control_panel`. Dazu gehören Parallax-Welt, Orbi, Gedanken-Lupen, Brain Control Panel, diagonaler Split und Poster-Titel.
- **Folien-Wechsel (oft benutzen):** Wenn der Text etwas Großes und Unsichtbares nennt (Milliarden Bits, Sinne, Zeit), schrumpft die ganze Szene zu einer Karte und schiebt sich wie eine Präsentationsfolie weg. In einer eigenen Welt wird es gezeigt, dann geht es zurück. Code: `slide()` in `render/rig/test_intro.html`.
- Jede Animation startet genau auf ihr Wort (faster-whisper-Zeitstempel).
- Harte Schnitte auf Satzanfänge. Darunter bewegt sich immer etwas sanft: Kamera, Wolken, Blätter, Wasser.
- Pro Satz ein klares Motiv, sehr wenig Text auf dem Bild (1–3 Wörter).
- Requisiten (Glühbirne, Kraftwerk, Roboterkörper, Prisma, Lichtstrahlen) **detailliert, modern und etwas echter** zeichnen: Verläufe, Glanz, Glühen, weiche Lichtkegel statt flacher Linien.
- Stil-Wörter (Blasen, Planet) sind keine Objekte. Nur wenige Blasen. Keine gruseligen Röntgen-Köpfe. Gehirn und Körper als saubere Grafik neben der Figur.
- Look: Cartoon mit etwa 40 % Frutiger Aero (Himmelblau, sattes Grün, Natur, Glas, Technik, Weltraum). Es darf nicht nach generischer KI aussehen.
- Kein GPU nötig: Vektor-Animation im Code (GSAP + Playwright), 50 Bilder pro Sekunde.

## 6. Figuren
- **Orbi** ist die Hauptfigur in "Du"-Videos, weil er weder Mann noch Frau ist. Aussehen fest (freigegeben 25.11.).
- **Kai und Mira**: einfacher, feiner Cartoon (nicht Anime), immer gleiches Aussehen. Nur selten, z. B. in der Stadt-Szene.
- Figuren bewegen sich sichtbar: Kopf, Arme, Hände mit Fingern, Füße.
- Reine Themen-Videos brauchen keine Figur.

## 7. Ton und Stimme
- Sprecher: Kokoro **am_fenrir**, Tempo 1.08, kostenlos über GitHub (`narrate-cpu.yml`).
- Mikrofon-Kette für jede Zeile (lauter, lebendiger, wie in ein Mikrofon gesprochen), Ziel −14 LUFS.
- Soundeffekte bei etwa 0.45. Musik im Moment 0.07 als Platzhalter.
- **Coole Musik kommt erst, wenn das Bild perfekt ist.**

## 8. Arbeitsweise
- Erst kurze Tests zeigen, dann groß bauen. Jedes Kapitel wird gezeigt, bevor das nächste kommt.
- Was Manuell freigibt, wird sofort eine Regel hier.
- Nichts wird ohne seine Freigabe veröffentlicht. GPU-Kosten nur nach Rückfrage.

## Feedback-Verlauf (kurz)
| Datum | Feedback | Regel |
|---|---|---|
| 24.11. | Keine Morph-KI-Clips, wirkt gruselig | Vektor-Animation im Code |
| 25.11. | Stil-Wörter tauchten als Objekte auf | Pro Satz ein klares Motiv |
| 25.11. | Parallax-Welt "Welt" gefällt | Ziel-Look |
| 25.11. | Orbi freigegeben, Kai und Mira lieber Cartoon | Kapitel 6 |
| 25.11. | Arena-Test: Kopf toll, Körper nicht | Requisiten detailliert |
| 25.11. | Skript muss packender sein, aber nicht reißerisch | Kapitel 3 |
| 25.11. | Stimme Nr. 07 (Fenrir), lauter und lebendiger | Kapitel 7 |
| 25.11. | Control-Panel-Test "richtig geil", Stil fixieren | Kapitel 5 |
| 25.11. | Mehr Ortswechsel, Tests, Finale, 11–12 min | Kapitel 4 |
| 25.11. | Fantasy-Fragen, durch Welten führen | Kapitel 3 und 4 |
| 25.11. | Folien-Wechsel in eine eigene Welt | Kapitel 5 |
| 26.11. | Lichtstrahlen moderner und echter; kurze Neben-Erklärungen; echte Studien statt Theorien | Kapitel 2, 3, 5 |

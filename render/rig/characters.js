// Vector character rigs (Kai, Orbi) built from separate SVG parts, so code can move them like a puppet
// (Illustrator/After-Effects style "cut-out" animation). Every part has its own pivot.
// Usage: const kai = Kai(svgParent, {x, y, s});  kai.pose(tl, t, 'point') ...
const NS = 'http://www.w3.org/2000/svg';
const E = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const G = (parent, attrs = {}) => E('g', attrs, parent);

const C = { skin: '#f7d6bd', skinSh: '#e9b99c', hair: '#3a2a2e', hairHi: '#5c4448', hood: '#2f7a72', hoodSh: '#245f59', hoodHi: '#3d958b',
            jeans: '#2b3a5c', jeansSh: '#22304c', shoe: '#f2f5f7', sole: '#9fb3c8', line: '#14203a', iris: '#2a3150', blush: '#f29c9c', white: '#ffffff' };
const ST = { stroke: C.line, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

// The gender-neutral 'you' figure (neither clearly woman nor man): hoodie, jeans, simple eyes, variants A/B/C for the head.
function Person(parent, o = {}) {
  // local coordinates: feet on y=0, head top near y=-860; facing the viewer
  const v = o.v || 'A';   // look variant: A beanie, B short tousled hair, C hood up (all gender-neutral)
  const root = G(parent, { class: 'kai' });
  const body = G(root);                       // whole body (bob / lean)
  const legL = G(body), legR = G(body);
  const leg = (g, sx) => {
    E('path', { d: `M${sx * 18},-400 C${sx * 20},-260 ${sx * 30},-140 ${sx * 34},-50 L${sx * 96},-50 C${sx * 96},-150 ${sx * 92},-280 ${sx * 88},-400 Z`, fill: C.jeans, ...ST }, g);
    E('path', { d: `M${sx * 70},-380 C${sx * 72},-280 ${sx * 76},-170 ${sx * 80},-60`, stroke: C.jeansSh, 'stroke-width': 6, fill: 'none' }, g);
    E('path', { d: `M${sx * 22},-56 C${sx * 10},-30 ${sx * 14},0 ${sx * 40},4 L${sx * 112},4 C${sx * 128},2 ${sx * 126},-30 ${sx * 100},-56 Z`, fill: C.shoe, ...ST }, g);
    E('path', { d: `M${sx * 16},-6 L${sx * 122},-6`, stroke: C.sole, 'stroke-width': 8 }, g);
  };
  leg(legL, -1); leg(legR, 1);
  const armBack = G(body);                    // viewer-left arm (Kai's right)
  const torso = G(body);
  E('path', { d: 'M-118,-640 C-150,-560 -138,-460 -120,-370 L120,-370 C138,-460 150,-560 118,-640 C70,-672 -70,-672 -118,-640 Z', fill: C.hood, ...ST }, torso);
  E('path', { d: 'M-120,-370 L120,-370 L116,-342 C40,-330 -40,-330 -116,-342 Z', fill: C.hoodSh, ...ST }, torso);   // hem
  E('path', { d: 'M-70,-470 L70,-470 L82,-392 L-82,-392 Z', fill: C.hoodSh, ...ST }, torso);                         // pocket
  E('path', { d: 'M-80,-656 C-60,-610 60,-610 80,-656 C60,-690 -60,-690 -80,-656 Z', fill: C.hoodHi, ...ST }, torso);  // hood collar
  E('path', { d: 'M-24,-628 L-30,-540 M24,-628 L30,-540', stroke: '#eef2f5', 'stroke-width': 5, fill: 'none' }, torso); // strings
  E('circle', { cx: -30, cy: -536, r: 6, fill: '#eef2f5' }, torso); E('circle', { cx: 30, cy: -536, r: 6, fill: '#eef2f5' }, torso);
  const armFront = G(body);                   // viewer-right arm (Kai's left), used for pointing
  const neck = E('path', { d: 'M-24,-700 L-22,-650 C-10,-640 10,-640 22,-650 L24,-700 Z', fill: C.skinSh, ...ST }, body);
  const head = G(body);                       // pivot at the neck
  if (v === 'C') E('path', { d: 'M-156,-760 C-166,-884 -70,-936 0,-936 C70,-936 166,-884 156,-760 C154,-690 132,-646 100,-626 L-100,-626 C-132,-646 -154,-690 -156,-760 Z', fill: C.hoodSh, ...ST }, head);   // hood back
  if (v !== 'C') { E('ellipse', { cx: -100, cy: -740, rx: 20, ry: 28, fill: C.skin, ...ST }, head);   // ears
    E('ellipse', { cx: 100, cy: -740, rx: 20, ry: 28, fill: C.skin, ...ST }, head); }
  E('path', { d: 'M-100,-800 C-104,-720 -86,-660 -40,-636 C-16,-626 16,-626 40,-636 C86,-660 104,-720 100,-800 C80,-860 -80,-860 -100,-800 Z', fill: C.skin, ...ST }, head);
  E('ellipse', { cx: -56, cy: -712, rx: 18, ry: 9, fill: C.blush, opacity: .22 }, head);
  E('ellipse', { cx: 56, cy: -712, rx: 18, ry: 9, fill: C.blush, opacity: .22 }, head);
  E('path', { d: 'M-4,-722 C0,-716 6,-716 8,-720', stroke: C.skinSh, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, head);
  const eyes = [];
  for (const sx of [-1, 1]) {
    const eg = G(head);
    E('path', { d: `M${sx * 26},-762 C${sx * 30},-790 ${sx * 76},-792 ${sx * 80},-762 C${sx * 80},-728 ${sx * 30},-724 ${sx * 26},-756 Z`, fill: C.white, ...ST, 'stroke-width': 4 }, eg);
    const iris = G(eg);
    E('ellipse', { cx: sx * 53, cy: -756, rx: 17, ry: 22, fill: C.iris }, iris);
    E('ellipse', { cx: sx * 53, cy: -752, rx: 9, ry: 12, fill: '#11152a' }, iris);
    E('circle', { cx: sx * 47, cy: -764, r: 6, fill: C.white }, iris);
    E('circle', { cx: sx * 59, cy: -746, r: 3, fill: C.white }, iris);
    E('path', { d: `M${sx * 22},-768 C${sx * 36},-798 ${sx * 74},-798 ${sx * 86},-770`, stroke: C.line, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, eg);  // upper lid (thin, no lashes)
    eyes.push({ g: eg, iris, cx: sx * 53, cy: -758 });
  }
  const brows = [-1, 1].map(sx => E('path', { d: `M${sx * 28},-806 C${sx * 44},-816 ${sx * 66},-816 ${sx * 80},-808`, stroke: C.hair, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, head));
  // mouth shapes (only one visible at a time)
  const mouths = {
    smile: E('path', { d: 'M-18,-690 C-8,-680 8,-680 18,-690', stroke: C.line, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, head),
    grin: E('path', { d: 'M-24,-694 C-14,-670 14,-670 24,-694 Z', fill: '#8a2f3c', ...ST, 'stroke-width': 4 }, head),
    o: E('ellipse', { cx: 0, cy: -686, rx: 11, ry: 14, fill: '#8a2f3c', ...ST, 'stroke-width': 4 }, head),
    worry: E('path', { d: 'M-18,-684 C-8,-694 8,-694 18,-684', stroke: C.line, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, head),
  };
  const hairFront = G(head);
  if (v === 'A') {   // beanie with short tufts at the sides
    E('path', { d: 'M-104,-772 C-98,-752 -94,-740 -88,-732 L-84,-770 Z M104,-772 C98,-752 94,-740 88,-732 L84,-770 Z', fill: C.hair, ...ST, 'stroke-width': 4 }, hairFront);
    E('path', { d: 'M-112,-786 C-118,-872 -62,-918 0,-918 C62,-918 118,-872 112,-786 Z', fill: '#f0a63a', ...ST }, hairFront);
    for (const x of [-60, -20, 20, 60]) E('path', { d: `M${x},-812 C${x * 1.05},-850 ${x * 0.9},-880 ${x * 0.6},-904`, stroke: '#c9821f', 'stroke-width': 4, fill: 'none' }, hairFront);
    E('path', { d: 'M-120,-806 C-60,-822 60,-822 120,-806 L118,-772 C60,-788 -60,-788 -118,-772 Z', fill: '#d88d24', ...ST }, hairFront);
    E('circle', { cx: 0, cy: -926, r: 24, fill: '#f6c56a', ...ST }, hairFront);
  } else if (v === 'B') {   // short tousled hair, ears free
    E('path', { d: 'M-108,-770 C-124,-862 -62,-912 0,-910 C66,-910 124,-862 108,-770 C102,-792 94,-802 82,-808 C70,-790 52,-798 42,-814 C28,-796 8,-800 -4,-816 C-18,-798 -40,-800 -52,-814 C-64,-798 -84,-796 -96,-808 C-102,-796 -106,-784 -108,-770 Z', fill: C.hair, ...ST }, hairFront);
    E('path', { d: 'M-40,-880 C-20,-896 20,-898 46,-884', stroke: C.hairHi, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
    E('path', { d: 'M-20,-912 C-14,-936 4,-944 18,-940 C8,-932 4,-922 6,-910', fill: C.hair, ...ST, 'stroke-width': 4 }, hairFront);   // cowlick
  } else {   // hood up, small fringe
    E('path', { d: 'M-92,-796 C-74,-852 74,-852 92,-796 C64,-812 34,-806 0,-818 C-34,-806 -64,-812 -92,-796 Z', fill: C.hair, ...ST, 'stroke-width': 4 }, hairFront);
    E('path', { d: 'M-120,-700 C-128,-860 -64,-904 0,-904 C64,-904 128,-860 120,-700', stroke: C.line, 'stroke-width': 34, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
    E('path', { d: 'M-120,-700 C-128,-860 -64,-904 0,-904 C64,-904 128,-860 120,-700', stroke: C.hoodHi, 'stroke-width': 24, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
  }
  const sweat = E('path', { d: 'M96,-820 C86,-800 88,-786 98,-784 C108,-786 110,-800 96,-820 Z', fill: '#8fd8ff', stroke: '#2a6ea0', 'stroke-width': 3, opacity: 0 }, head);
  // arms: upper arm (shoulder pivot) > forearm (elbow pivot) > hand
  const arm = (g, sx) => {
    const up = G(g), fore = G(up), hand = G(fore);
    E('path', { d: `M${sx * 92},-640 C${sx * 132},-628 ${sx * 150},-590 ${sx * 150},-540 L${sx * 146},-490 L${sx * 104},-494 L${sx * 104},-560 Z`, fill: C.hood, ...ST }, up);
    E('path', { d: `M${sx * 104},-500 L${sx * 148},-496 L${sx * 146},-400 L${sx * 110},-400 Z`, fill: C.hood, ...ST }, fore);
    E('path', { d: `M${sx * 106},-406 L${sx * 150},-404 L${sx * 148},-388 L${sx * 108},-390 Z`, fill: C.hoodSh, ...ST, 'stroke-width': 4 }, fore);
    E('path', { d: `M${sx * 112},-392 C${sx * 104},-360 ${sx * 112},-338 ${sx * 130},-336 C${sx * 150},-338 ${sx * 154},-362 ${sx * 146},-392 Z`, fill: C.skin, ...ST, 'stroke-width': 4 }, hand);
    const finger = E('path', { d: `M${sx * 128},-342 L${sx * 128},-300`, stroke: C.line, 'stroke-width': 18, 'stroke-linecap': 'round', opacity: 0 }, hand);
    const fingerFill = E('path', { d: `M${sx * 128},-342 L${sx * 128},-300`, stroke: C.skin, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, hand);
    return { up, fore, hand, finger: [finger, fingerFill], sh: [sx * 118, -620], el: [sx * 126, -496], wr: [sx * 128, -392] };
  };
  const aR = arm(armBack, -1), aL = arm(armFront, 1);
  const k = { root, body, head, eyes, brows, mouths, legL, legR, aR, aL, sweat, x: o.x || 0, y: o.y || 0, s: o.s || 1 };
  gsap.set(root, { x: k.x, y: k.y, scale: k.s, transformOrigin: '0px 0px' });
  gsap.set(head, { svgOrigin: '0 -650' }); gsap.set(body, { svgOrigin: '0 0' });
  gsap.set(legL, { svgOrigin: '-50 -400' }); gsap.set(legR, { svgOrigin: '50 -400' });
  for (const a of [aR, aL]) { gsap.set(a.up, { svgOrigin: a.sh.join(' ') }); gsap.set(a.fore, { svgOrigin: a.el.join(' ') }); gsap.set(a.hand, { svgOrigin: a.wr.join(' ') }); }
  for (const e of eyes) gsap.set(e.g, { svgOrigin: `${e.cx} ${e.cy}` });
  for (const m in mouths) gsap.set(mouths[m], { opacity: m === 'smile' ? 1 : 0 });

  // ---------- motion vocabulary ----------
  k.idle = (tl, t0, dur) => {   // breathing + small sway + random blinks for the whole shot
    tl.fromTo(body, { scaleY: 1 }, { scaleY: 1.012, duration: 1.6, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.6)), ease: 'sine.inOut' }, t0);
    tl.fromTo(head, { rotation: -1 }, { rotation: 1.5, duration: 2.4, yoyo: true, repeat: Math.max(1, Math.floor(dur / 2.4)), ease: 'sine.inOut' }, t0);
    tl.fromTo(body, { x: -3 }, { x: 3, duration: 3.1, yoyo: true, repeat: Math.max(1, Math.floor(dur / 3.1)), ease: 'sine.inOut' }, t0);   // weight shift
    for (let t = t0 + 1.2; t < t0 + dur; t += 2.6 + ((t * 7) % 1.7)) k.blink(tl, t);
  };
  k.blink = (tl, t) => { for (const e of eyes) tl.to(e.g, { scaleY: 0.08, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.in' }, t); };
  k.face = (tl, t, m) => { for (const n in mouths) tl.to(mouths[n], { opacity: n === m ? 1 : 0, duration: 0.15 }, t);
    const up = m === 'o' ? -10 : m === 'worry' ? 6 : 0;
    brows.forEach((b, i) => tl.to(b, { y: up, rotation: m === 'worry' ? (i ? 12 : -12) : 0, svgOrigin: i ? '54 -810' : '-54 -810', duration: 0.2 }, t)); };
  k.look = (tl, t, dx, dy = 0) => { for (const e of eyes) tl.to(e.iris, { x: dx, y: dy, duration: 0.25, ease: 'power2.out' }, t); };
  k.walkIn = (tl, t, fromX, toX, dur = 1.6) => {   // steps with leg swing + body bob
    tl.fromTo(root, { x: fromX }, { x: toX, duration: dur, ease: 'power1.inOut' }, t);
    const steps = Math.round(dur / 0.4);
    for (let i = 0; i < steps; i++) {
      const s = i % 2 ? 1 : -1, ts = t + i * 0.4;
      tl.to(legL, { rotation: 14 * s, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(legR, { rotation: -14 * s, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(body, { y: -10, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(aR.up, { rotation: -10 * s, duration: 0.2, yoyo: true, repeat: 1 }, ts); tl.to(aL.up, { rotation: 10 * s, duration: 0.2, yoyo: true, repeat: 1 }, ts);
    }
  };
  // fluid arm move: upper arm leads, forearm and hand follow a moment later (follow-through); the gesture LANDS at t
  const setArm = (tl, t, a, u, f, h = 0, d = 0.6, finger = false) => {
    const t0 = t - d * 0.7;
    tl.to(a.up, { rotation: u, duration: d, ease: 'power3.inOut' }, t0);
    tl.to(a.fore, { rotation: f, duration: d, ease: 'back.out(1.15)' }, t0 + 0.07);
    tl.to(a.hand, { rotation: h, duration: d * 0.9, ease: 'sine.inOut' }, t0 + 0.12);
    tl.to(a.finger, { opacity: finger ? 1 : 0, duration: 0.12 }, t0 + d * 0.5);
  };
  // small emphasis on a stressed word: head dips, body bobs, like a person explaining
  k.beat = (tl, t, s = 1) => {
    tl.to(head, { y: 6 * s, rotation: 2 * s, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t - 0.08);
    tl.to(body, { y: -4 * s, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t - 0.08);
  };
  k.pose = (tl, t, name) => {
    const P = {
      rest:   () => { setArm(tl, t, aR, 0, 0); setArm(tl, t, aL, 0, 0); },
      point:  () => { setArm(tl, t, aL, -96, -6, -6, 0.6, true); setArm(tl, t, aR, 0, 0); },                // points to the right (panel)
      pointUp:() => { setArm(tl, t, aR, 160, 10, 0, 0.6, true); setArm(tl, t, aL, 0, 0); },                   // "here's the truth" finger up
      open:   () => { setArm(tl, t, aR, 60, -30, 0); setArm(tl, t, aL, -60, 30, 0); },                         // arms open wide
      wag:    () => { setArm(tl, t, aR, 150, 20, 0, 0.55, true); setArm(tl, t, aL, 0, 0); tl.to(aR.fore, { rotation: 34, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, t + 0.05); },
      pinch:  () => { setArm(tl, t, aL, -150, -40, 0, 0.6, true); setArm(tl, t, aR, 0, 0); },
      thumbs: () => { setArm(tl, t, aR, 30, 120, 0, 0.6, true); setArm(tl, t, aL, 0, 0); tl.to(head, { rotation: 6, duration: 0.2, yoyo: true, repeat: 1 }, t + 0.2); },
      chest:  () => { setArm(tl, t, aR, 30, -95, 0); setArm(tl, t, aL, -30, 95, 0); },
      shrug:  () => { setArm(tl, t, aR, 40, -70, 0); setArm(tl, t, aL, -40, 70, 0); tl.to(body, { y: -8, duration: 0.25, yoyo: true, repeat: 1 }, t); },
      nod:    () => { tl.to(head, { y: 9, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t); },
      shake:  () => { tl.to(head, { x: 7, duration: 0.16, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t); },
    };
    (P[name] || P.rest)();
    if (name !== 'nod' && name !== 'shake') { const lean = { point: 2.5, pinch: 2, pointUp: -1, shrug: 0, open: 0 }[name] || 0;   // whole body leans into the gesture
    tl.to(body, { rotation: lean, duration: 0.8, ease: 'sine.inOut' }, t - 0.5); }
  };
  k.sweatDrop = (tl, t) => { tl.fromTo(sweat, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 }, t); tl.to(sweat, { y: 30, opacity: 0, duration: 1.2, ease: 'power1.in' }, t + 1.2); };
  return k;
}

function Orbi(parent, o = {}) {
  // round glass robot companion with a visor face and a ring
  const root = G(parent, { class: 'orbi' });
  const bob = G(root);
  const defs = E('defs', {}, root);
  const rg = E('radialGradient', { id: 'orbiGlass', cx: '35%', cy: '30%', r: '75%' }, defs);
  E('stop', { offset: '0%', 'stop-color': '#f4ffff' }, rg); E('stop', { offset: '55%', 'stop-color': '#b9e3e6' }, rg); E('stop', { offset: '100%', 'stop-color': '#7fb9c4' }, rg);
  const ringBack = E('path', { d: 'M-118,10 C-118,-16 118,-16 118,10', stroke: '#e9dfa2', 'stroke-width': 12, fill: 'none', ...{ 'stroke-linecap': 'round' } }, bob);
  E('circle', { cx: 0, cy: 0, r: 78, fill: 'url(#orbiGlass)', stroke: '#6b6f2f', 'stroke-width': 4 }, bob);
  E('ellipse', { cx: -30, cy: -44, rx: 18, ry: 9, fill: '#ffffff', opacity: .8, transform: 'rotate(-30 -30 -44)' }, bob);
  const visor = E('rect', { x: -56, y: -30, width: 112, height: 50, rx: 25, fill: '#1d2b33', stroke: '#8a3a3a', 'stroke-width': 2 }, bob);
  const eyes = G(bob);
  const eL = E('circle', { cx: -20, cy: -5, r: 9, fill: '#fff' }, eyes), eR = E('circle', { cx: 20, cy: -5, r: 9, fill: '#fff' }, eyes);
  const alarm = E('text', { x: 0, y: 6, 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 800, fill: '#ffb547', opacity: 0, 'font-family': 'Fredoka, Inter, sans-serif' }, bob); alarm.textContent = '!';
  const ringFront = E('path', { d: 'M-118,10 C-118,36 118,36 118,10', stroke: '#e9dfa2', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, bob);
  E('path', { d: 'M-118,10 C-118,36 118,36 118,10', stroke: '#7d7531', 'stroke-width': 2, fill: 'none', opacity: .7 }, bob);
  const r = { root, bob, eyes, alarm, x: o.x || 0, y: o.y || 0, s: o.s || 1 };
  gsap.set(root, { x: r.x, y: r.y, scale: r.s, transformOrigin: '0px 0px' }); gsap.set(eyes, { svgOrigin: '0 -5' });
  r.idle = (tl, t0, dur) => {
    tl.fromTo(bob, { y: -8, rotation: -4 }, { y: 8, rotation: 4, duration: 1.3, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.3)), ease: 'sine.inOut' }, t0);
    for (let t = t0 + 0.8; t < t0 + dur; t += 3.1) tl.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1 }, t);
  };
  r.fly = (tl, t, x, y, d = 0.9) => tl.to(root, { x, y, duration: d, ease: 'power2.inOut' }, t);
  r.happy = (tl, t) => { tl.to([eL, eR], { attr: { r: 11 }, duration: 0.15, yoyo: true, repeat: 3 }, t); tl.to(bob, { y: -30, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, t); };
  r.alarm = (tl, t, d = 2) => { tl.to(eyes, { opacity: 0, duration: 0.1 }, t); tl.to(alarm, { opacity: 1, duration: 0.1 }, t);
    tl.to(visor, { attr: { fill: '#5a1d1d' }, duration: 0.2, yoyo: true, repeat: Math.floor(d / 0.2) }, t);
    tl.to(alarm, { opacity: 0, duration: 0.1 }, t + d); tl.to(eyes, { opacity: 1, duration: 0.1 }, t + d); };
  r.look = (tl, t, dx) => tl.to(eyes, { x: dx, duration: 0.25 }, t);
  return r;
}

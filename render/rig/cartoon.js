// Toon(): Kai and Mira as clean, fine cartoon figures (no heavy black outlines).
// Flat colour shapes with soft cel shadows and highlights, slim proportions, smooth flowing hair.
// Same motion API as Person(): idle, blink, face, look, walkIn, pose, beat, sweatDrop.  Needs characters.js (E, G, Limb, RIGS).
function Toon(parent, o = {}) {
  const v = o.v || 'kai';
  const P = {
    kai:  { skin: '#e9b48c', skinSh: '#d39871', skinHi: '#f4c9a6', hair: '#22284a', hairSh: '#161a33', hairHi: '#3b4675',
            top: '#2f9a92', topSh: '#237a74', topHi: '#45b5ac', pants: '#2e3b5e', pantsSh: '#232e4b', shoe: '#f3f6f8', shoeSh: '#c7d2dc', eye: '#2a1a14' },
    mira: { skin: '#f6d6bf', skinSh: '#e6b89a', skinHi: '#fde6d4', hair: '#252a52', hairSh: '#181c3a', hairHi: '#434e86',
            top: '#f08c3c', topSh: '#cf6c22', topHi: '#ffa95e', pants: '#2e3b5e', pantsSh: '#232e4b', shoe: '#f3f6f8', shoeSh: '#c7d2dc', eye: '#2a1d3a' },
  }[v];
  const line = (d, col, w, p, extra = {}) => E('path', { d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, p);
  const F = (d, fill, p, extra = {}) => E('path', { d, fill, ...extra }, p);
  const root = G(parent), body = G(root);
  // ---------- legs ----------
  const legL = G(body), legR = G(body);
  const leg = (g, sx) => {
    F(`M${sx * 8},-372 C${sx * 10},-250 ${sx * 18},-140 ${sx * 22},-46 L${sx * 74},-46 C${sx * 76},-140 ${sx * 80},-260 ${sx * 84},-372 Z`, P.pants, g);
    F(`M${sx * 56},-372 C${sx * 60},-260 ${sx * 62},-150 ${sx * 62},-46 L${sx * 74},-46 C${sx * 76},-140 ${sx * 80},-260 ${sx * 84},-372 Z`, P.pantsSh, g);   // shadow side
    F(`M${sx * 14},-52 C${sx * 2},-30 ${sx * 6},2 ${sx * 34},4 L${sx * 98},4 C${sx * 116},2 ${sx * 112},-28 ${sx * 84},-52 Z`, P.shoe, g);
    F(`M${sx * 8},-8 C${sx * 30},0 ${sx * 90},2 ${sx * 110},-6 L${sx * 108},4 L${sx * 30},6 Z`, P.shoeSh, g);
  };
  leg(legL, -1); leg(legR, 1);
  gsap.set(legL, { svgOrigin: '-46 -372' }); gsap.set(legR, { svgOrigin: '46 -372' });
  // ---------- torso ----------
  const armBack = G(body), torso = G(body);
  F('M-100,-628 C-120,-598 -124,-520 -116,-410 L-110,-356 L110,-356 L116,-410 C124,-520 120,-598 100,-628 C64,-654 -64,-654 -100,-628 Z', P.top, torso);
  F('M-100,-628 C-120,-598 -124,-520 -116,-410 L-110,-356 L-62,-356 C-74,-430 -80,-540 -66,-640 Z', P.topSh, torso, { opacity: .55 });   // soft side shadow
  F('M-110,-372 L110,-372 L110,-350 C40,-340 -40,-340 -110,-350 Z', P.topSh, torso);                                                    // hem band
  line('M-30,-520 C-10,-500 10,-500 30,-520', P.topSh, 4, torso, { opacity: .6 });                                                     // fold
  if (v === 'mira') {   // open jacket: cream shirt, green collar, zip edges
    F('M-34,-640 L34,-640 L28,-358 L-28,-358 Z', '#f6e7cc', torso);
    F('M-34,-640 L-28,-358 L-20,-358 L-26,-640 Z', '#e8d5b4', torso);
    F('M-44,-650 L44,-650 C30,-620 16,-606 0,-600 C-16,-606 -30,-620 -44,-650 Z', '#2f6650', torso);
    line('M-36,-630 L-30,-360 M36,-630 L30,-360', P.topSh, 5, torso);
    F('M-92,-470 L-40,-470 L-40,-410 L-92,-410 Z', P.topSh, torso, { opacity: .5 }); F('M40,-470 L92,-470 L92,-410 L40,-410 Z', P.topSh, torso, { opacity: .5 });
  } else {              // hoodie: hood rim, strings, pocket
    F('M-70,-650 C-50,-604 50,-604 70,-650 C50,-676 -50,-676 -70,-650 Z', P.topHi, torso);
    line('M-20,-618 L-24,-540 M20,-618 L24,-540', '#eef3f6', 4, torso);
    E('circle', { cx: -24, cy: -536, r: 5, fill: '#eef3f6' }, torso); E('circle', { cx: 24, cy: -536, r: 5, fill: '#eef3f6' }, torso);
    F('M-62,-462 L62,-462 L72,-396 L-72,-396 Z', P.topSh, torso, { opacity: .7 });
  }
  const armFront = G(body);
  // ---------- arms: one smooth sleeve path, shaded edge, hand with fingers ----------
  const arm = (g, sx) => {
    const S = [sx * 96, -606], E0 = [sx * 110, -490], W0 = [sx * 114, -386];
    const LS = { fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const outline = E('path', { ...LS, stroke: P.topSh, 'stroke-width': 42 }, g);
    const fill = E('path', { ...LS, stroke: P.top, 'stroke-width': 34 }, g);
    const cuff = E('path', { fill: 'none', stroke: P.topSh, 'stroke-width': 36, 'stroke-linecap': 'butt' }, g);
    const hand = G(g);
    for (let i = 0; i < 4; i++) { const fx = sx * (104 + i * 7), fy = -336 + (i === 1 || i === 2 ? 5 : 0);
      line(`M${fx},-356 L${fx},${fy}`, P.skinSh, 9, hand); line(`M${fx},-356 L${fx},${fy + 2}`, P.skin, 6, hand); }
    line(`M${sx * 100},-370 L${sx * 92},-356`, P.skin, 8, hand);
    E('ellipse', { cx: sx * 115, cy: -366, rx: 17, ry: 19, fill: P.skin }, hand);
    E('ellipse', { cx: sx * 121, cy: -362, rx: 8, ry: 12, fill: P.skinSh, opacity: .5 }, hand);
    const f1 = line(`M${sx * 114},-350 L${sx * 114},-300`, P.skinSh, 11, hand, { opacity: 0 });
    const f2 = line(`M${sx * 114},-350 L${sx * 114},-302`, P.skin, 7, hand, { opacity: 0 });
    const L = Limb(S, E0, W0, { outline, fill, cuff, hand });
    return { up: L.up, fore: L.fore, hand: L.hand, finger: [f1, f2] };
  };
  const aR = arm(armBack, -1), aL = arm(armFront, 1);
  // ---------- neck + head ----------
  F('M-20,-690 L-18,-636 C-8,-628 8,-628 18,-636 L20,-690 Z', P.skinSh, body);
  const head = G(body);
  if (v === 'mira') {   // hair mass behind the head + flowing ponytail
    F('M-94,-800 C-104,-744 -100,-700 -82,-668 C-56,-684 56,-684 82,-668 C100,-700 104,-744 94,-800 Z', P.hairSh, head);
    F('M40,-880 C130,-910 184,-850 168,-770 C158,-716 176,-668 150,-610 C138,-650 116,-690 112,-740 C108,-800 90,-840 40,-850 Z', P.hair, head);
    F('M120,-860 C150,-830 158,-780 150,-730 C146,-700 150,-670 148,-640 C140,-680 132,-720 134,-760 C136,-800 132,-836 120,-860 Z', P.hairHi, head, { opacity: .55 });
  }
  E('ellipse', { cx: -88, cy: -742, rx: 15, ry: 22, fill: P.skin }, head); E('ellipse', { cx: 88, cy: -742, rx: 15, ry: 22, fill: P.skin }, head);
  E('ellipse', { cx: -88, cy: -740, rx: 7, ry: 12, fill: P.skinSh }, head); E('ellipse', { cx: 88, cy: -740, rx: 7, ry: 12, fill: P.skinSh }, head);
  F('M-86,-790 C-92,-712 -66,-652 0,-646 C66,-652 92,-712 86,-790 C80,-858 -80,-858 -86,-790 Z', P.skin, head);   // soft rounded face
  F('M-84,-800 C-50,-780 50,-780 84,-800 L84,-776 C50,-760 -50,-760 -84,-776 Z', P.skinSh, head, { opacity: .22 });   // hair shadow
  for (const sx of [-1, 1]) E('ellipse', { cx: sx * 50, cy: -712, rx: 16, ry: 8, fill: '#f08f86', opacity: .3 }, head);
  line('M3,-728 C6,-720 4,-714 -2,-712', P.skinSh, 3.5, head);
  // eyes: simple cartoon ovals with a highlight; lashes only for Mira
  const eyes = [];
  for (const sx of [-1, 1]) {
    const eg = G(head), iris = G(eg);
    E('ellipse', { cx: sx * 40, cy: -746, rx: 11, ry: 15, fill: P.eye }, iris);
    E('ellipse', { cx: sx * 36, cy: -752, rx: 4, ry: 5, fill: '#ffffff' }, iris);
    E('circle', { cx: sx * 44, cy: -740, r: 1.8, fill: '#ffffff', opacity: .8 }, iris);
    if (v === 'mira') line(`M${sx * 28},-760 C${sx * 36},-768 ${sx * 50},-768 ${sx * 56},-760 L${sx * 62},-766`, P.eye, 3.5, eg);
    eyes.push({ g: eg, iris, cx: sx * 40, cy: -746 });
  }
  for (const e of eyes) gsap.set(e.g, { svgOrigin: `${e.cx} ${e.cy}` });
  const brows = [-1, 1].map(sx => line(`M${sx * 26},-780 C${sx * 36},-788 ${sx * 50},-788 ${sx * 58},-782`, P.hair, 5, head));
  const mouths = {
    smile: line('M-14,-688 C-6,-680 6,-680 14,-688', '#6b2f2a', 4, head),
    grin: F('M-18,-692 C-12,-670 12,-670 18,-692 Z', '#8a3a36', head),
    o: E('ellipse', { cx: 0, cy: -686, rx: 8, ry: 10, fill: '#8a3a36' }, head),
    worry: line('M-14,-682 C-6,-690 6,-690 14,-682', '#6b2f2a', 4, head),
  };
  for (const m in mouths) gsap.set(mouths[m], { opacity: m === 'smile' ? 1 : 0 });
  // front hair: smooth flowing clumps with a highlight band
  const hairFront = G(head);
  if (v === 'kai') {
    F('M-92,-770 C-104,-850 -60,-904 0,-904 C66,-904 108,-850 94,-768 C88,-786 80,-796 70,-802 C66,-786 56,-778 44,-776 C48,-792 44,-806 36,-812 C24,-794 8,-786 -10,-786 C-2,-800 -2,-812 -8,-820 C-24,-800 -44,-790 -62,-790 C-56,-800 -54,-808 -56,-814 C-70,-804 -82,-790 -92,-770 Z', P.hair, hairFront);
    F('M-20,-904 C-8,-930 16,-936 34,-930 C20,-924 12,-914 10,-904 Z', P.hair, hairFront);                       // cowlick
    F('M-60,-866 C-30,-888 30,-890 64,-866 C30,-878 -30,-876 -60,-866 Z', P.hairHi, hairFront, { opacity: .8 });  // highlight band
    line('M-20,-860 C-26,-836 -34,-816 -42,-806 M24,-860 C24,-838 22,-822 18,-810', P.hairSh, 3, hairFront, { opacity: .7 });
  } else {
    F('M-94,-760 C-110,-850 -60,-906 4,-904 C70,-902 108,-850 94,-764 C90,-780 84,-792 76,-798 C70,-784 58,-776 44,-776 C52,-790 50,-806 44,-814 C30,-796 6,-788 -18,-790 C-8,-802 -6,-816 -12,-826 C-30,-806 -52,-796 -74,-794 C-82,-786 -88,-774 -94,-760 Z', P.hair, hairFront);
    F('M-96,-790 C-108,-744 -104,-700 -90,-662 C-86,-672 -84,-690 -82,-712 C-80,-740 -78,-766 -72,-790 Z M96,-790 C108,-744 104,-700 90,-662 C86,-672 84,-690 82,-712 C80,-740 78,-766 72,-790 Z', P.hair, hairFront);   // side locks
    F('M-56,-870 C-24,-890 34,-892 66,-866 C34,-880 -24,-878 -56,-870 Z', P.hairHi, hairFront, { opacity: .8 });
    E('circle', { cx: 52, cy: -884, r: 11, fill: '#4a80e0' }, hairFront); E('circle', { cx: 48, cy: -888, r: 4, fill: '#9cc0ff' }, hairFront);
  }
  const sweat = F('M84,-812 C76,-796 78,-784 86,-782 C94,-784 96,-796 84,-812 Z', '#8fd8ff', head, { opacity: 0 });
  const k = { root, body, head, eyes, brows, mouths, legL, legR, aR, aL, sweat };
  gsap.set(head, { svgOrigin: '0 -640' }); gsap.set(body, { svgOrigin: '0 0' });
  // ---------- motion (same vocabulary as Person) ----------
  k.idle = (tl, t0, dur) => {
    tl.fromTo(body, { scaleY: 1 }, { scaleY: 1.01, duration: 1.7, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.7)), ease: 'sine.inOut' }, t0);
    tl.fromTo(head, { rotation: -1.2 }, { rotation: 1.4, duration: 2.5, yoyo: true, repeat: Math.max(1, Math.floor(dur / 2.5)), ease: 'sine.inOut' }, t0);
    tl.fromTo(body, { x: -3 }, { x: 3, duration: 3.2, yoyo: true, repeat: Math.max(1, Math.floor(dur / 3.2)), ease: 'sine.inOut' }, t0);
    for (let t = t0 + 1.2; t < t0 + dur; t += 2.6 + ((t * 7) % 1.7)) k.blink(tl, t);
  };
  k.blink = (tl, t) => { for (const e of eyes) tl.to(e.g, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.in' }, t); };
  k.face = (tl, t, m) => { for (const n in mouths) tl.to(mouths[n], { opacity: n === m ? 1 : 0, duration: 0.15 }, t);
    const up = m === 'o' ? -8 : m === 'worry' ? 5 : 0;
    brows.forEach((b, i) => tl.to(b, { y: up, rotation: m === 'worry' ? (i ? 10 : -10) : 0, svgOrigin: i ? '42 -784' : '-42 -784', duration: 0.2 }, t)); };
  k.look = (tl, t, dx, dy = 0) => { for (const e of eyes) tl.to(e.iris, { x: dx * .6, y: dy * .6, duration: 0.25, ease: 'power2.out' }, t); };
  k.walkIn = (tl, t, fromX, toX, dur = 1.6) => {
    tl.fromTo(root, { x: fromX }, { x: toX, duration: dur, ease: 'power1.inOut' }, t);
    for (let i = 0; i < Math.round(dur / 0.4); i++) { const s = i % 2 ? 1 : -1, ts = t + i * 0.4;
      tl.to(legL, { rotation: 14 * s, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(legR, { rotation: -14 * s, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(body, { y: -10, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts);
      tl.to(aR.up, { rotation: -10 * s, duration: 0.2, yoyo: true, repeat: 1 }, ts); tl.to(aL.up, { rotation: 10 * s, duration: 0.2, yoyo: true, repeat: 1 }, ts); }
  };
  const setArm = (tl, t, a, u, f, h = 0, d = 0.6, finger = false) => { const t0 = t - d * 0.7;
    tl.to(a.up, { rotation: u, duration: d, ease: 'power3.inOut' }, t0);
    tl.to(a.fore, { rotation: f, duration: d, ease: 'back.out(1.15)' }, t0 + 0.07);
    tl.to(a.hand, { rotation: h, duration: d * 0.9, ease: 'sine.inOut' }, t0 + 0.12);
    tl.to(a.finger, { opacity: finger ? 1 : 0, duration: 0.12 }, t0 + d * 0.5); };
  k.beat = (tl, t, s = 1) => { tl.to(head, { y: 5 * s, rotation: 2 * s, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t - 0.08);
    tl.to(body, { y: -4 * s, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t - 0.08); };
  k.pose = (tl, t, name) => {
    const Q = {
      rest: () => { setArm(tl, t, aR, 0, 0); setArm(tl, t, aL, 0, 0); },
      point: () => { setArm(tl, t, aL, -96, -6, -6, 0.6, true); setArm(tl, t, aR, 0, 0); },
      pointUp: () => { setArm(tl, t, aR, 160, 10, 0, 0.6, true); setArm(tl, t, aL, 0, 0); },
      open: () => { setArm(tl, t, aR, 60, -30, 0); setArm(tl, t, aL, -60, 30, 0); },
      wave: () => { setArm(tl, t, aR, 150, 20, 0, 0.55); setArm(tl, t, aL, 0, 0); tl.to(aR.fore, { rotation: 40, duration: 0.2, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + 0.05); },
      thumbs: () => { setArm(tl, t, aR, 30, 120, 0, 0.6, true); setArm(tl, t, aL, 0, 0); },
      chest: () => { setArm(tl, t, aR, 30, -95, 0); setArm(tl, t, aL, -30, 95, 0); },
      shrug: () => { setArm(tl, t, aR, 40, -70, 0); setArm(tl, t, aL, -40, 70, 0); tl.to(body, { y: -8, duration: 0.25, yoyo: true, repeat: 1 }, t); },
      think: () => { setArm(tl, t, aL, -30, -125, 0); setArm(tl, t, aR, 0, 0); },
      nod: () => { tl.to(head, { y: 8, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t); },
      shake: () => { tl.to(head, { x: 6, duration: 0.16, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t); },
    };
    (Q[name] || Q.rest)();
    if (name !== 'nod' && name !== 'shake') tl.to(body, { rotation: { point: 2.5, pointUp: -1 }[name] || 0, duration: 0.8, ease: 'sine.inOut' }, t - 0.5);
  };
  k.sweatDrop = (tl, t) => { tl.fromTo(sweat, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 }, t); tl.to(sweat, { y: 30, opacity: 0, duration: 1.2, ease: 'power1.in' }, t + 1.2); };
  return k;
}

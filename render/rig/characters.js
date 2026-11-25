// Vector character rigs (Kai, Orbi) built from separate SVG parts, so code can move them like a puppet
// (Illustrator/After-Effects style "cut-out" animation). Every part has its own pivot.
// Usage: const kai = Kai(svgParent, {x, y, s});  kai.pose(tl, t, 'point') ...
const NS = 'http://www.w3.org/2000/svg';
const E = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const G = (parent, attrs = {}) => E('g', attrs, parent);
// Rigs redraw their limbs after every seek: pages call drawRigs() inside window.seek.
const RIGS = []; let BOIL_N = 0; const BOILS = [];
function drawRigs() { for (const f of RIGS) f(); BOIL_N++; if (BOIL_N % 6 === 0) for (const t of BOILS) t.setAttribute('seed', 1 + (BOIL_N / 6) % 5); }
function boil(el, scale = 5, freq = 0.015) {   // SVG filter that roughens outlines like a hand-drawn pencil line
  const id = 'boil' + Math.floor(Math.random() * 1e7), f = E('filter', { id, x: '-10%', y: '-10%', width: '120%', height: '120%' }, E('defs', {}, el));
  const tb = E('feTurbulence', { type: 'fractalNoise', baseFrequency: freq, numOctaves: 2, seed: 1, result: 'n' }, f);
  E('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
  BOILS.push(tb); el.setAttribute('filter', `url(#${id})`);
}
const rot = (x, y, d) => { const r = d * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [x * c - y * s, x * s + y * c]; };
// Smooth limb: ONE continuous stroked path through shoulder, elbow and wrist with round joins, so there are no
// visible seams between upper arm and forearm. up/fore/hand are plain objects whose 'rotation' GSAP animates.
function Limb(S, E0, W0, parts) {
  const up = { rotation: 0 }, fore = { rotation: 0 }, hand = { rotation: 0 };
  const draw = () => {
    const a = up.rotation, b = fore.rotation, h = hand.rotation;
    const v1 = rot(E0[0] - S[0], E0[1] - S[1], a), El = [S[0] + v1[0], S[1] + v1[1]];
    const v2 = rot(W0[0] - E0[0], W0[1] - E0[1], a + b), W = [El[0] + v2[0], El[1] + v2[1]];
    const d = `M${S[0]},${S[1]} L${El[0]},${El[1]} L${W[0]},${W[1]}`;
    parts.outline.setAttribute('d', d); parts.fill.setAttribute('d', d);
    if (parts.cuff) parts.cuff.setAttribute('d', `M${El[0] + v2[0] * .8},${El[1] + v2[1] * .8} L${W[0]},${W[1]}`);
    parts.hand.setAttribute('transform', `translate(${W[0]},${W[1]}) rotate(${a + b + h}) translate(${-W0[0]},${-W0[1]})`);
  };
  RIGS.push(draw); draw();
  return { up, fore, hand, draw };
}

const CPAL = { skin: '#f7d6bd', skinSh: '#e9b99c', hair: '#3a2a2e', hairHi: '#5c4448', hood: '#2f7a72', hoodSh: '#245f59', hoodHi: '#3d958b',
            jeans: '#2b3a5c', jeansSh: '#22304c', shoe: '#f2f5f7', sole: '#9fb3c8', line: '#14203a', iris: '#2a3150', blush: '#f29c9c', white: '#ffffff' };
const ST = { stroke: CPAL.line, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

// The gender-neutral 'you' figure (neither clearly woman nor man): hoodie, jeans, simple eyes, variants A/B/C for the head.
function Person(parent, o = {}) {
  // local coordinates: feet on y=0, head top near y=-860; facing the viewer
  const v = o.v || 'A', st = o.st || ((o.v === 'kai' || o.v === 'mira') ? 'simple' : 'anime');   // st: drawing style option for Kai/Mira: anime | cute | soft
  const PALS = { kai: { skin: '#e8b48f', skinSh: '#d39a74', hair: '#1d2440', hairHi: '#36406a', hood: '#2f8f8a', hoodSh: '#24706c', hoodHi: '#3aa8a2' },
                 mira: { skin: '#f9dcc6', skinSh: '#ebbfa2', hair: '#1f2446', hairHi: '#3a4170', hood: '#f08a3a', hoodSh: '#c96a22', hoodHi: '#ffa65a' } };
  const C = { ...CPAL, ...(PALS[v] || {}), ...(o.pal || {}) };   // look variant: A beanie, B short tousled hair, C hood up (all gender-neutral)
  const root = G(parent, { class: 'kai' });
  const body = G(root); boil(body);                       // whole body (bob / lean)
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
  E('path', { d: 'M-116,-636 C-146,-560 -134,-460 -118,-374 L-74,-374 C-90,-460 -100,-560 -80,-652 Z', fill: C.hoodSh, opacity: .5 }, torso);   // cel shadow
  E('path', { d: 'M-120,-370 L120,-370 L116,-342 C40,-330 -40,-330 -116,-342 Z', fill: C.hoodSh, ...ST }, torso);   // hem
  E('path', { d: 'M-70,-470 L70,-470 L82,-392 L-82,-392 Z', fill: C.hoodSh, ...ST }, torso);                         // pocket
  E('path', { d: 'M-80,-656 C-60,-610 60,-610 80,-656 C60,-690 -60,-690 -80,-656 Z', fill: C.hoodHi, ...ST }, torso);  // hood collar
  if (v === 'mira') {   // open zip jacket over a cream shirt with a dark-green collar
    E('path', { d: 'M-40,-648 L40,-648 L32,-372 L-32,-372 Z', fill: '#f6e6c8', ...ST, 'stroke-width': 4 }, torso);
    E('path', { d: 'M-34,-640 L-36,-374 M34,-640 L36,-374', stroke: '#b45a1c', 'stroke-width': 4, 'stroke-dasharray': '6 5', fill: 'none' }, torso);
    E('path', { d: 'M-50,-660 L50,-660 L28,-612 L0,-598 L-28,-612 Z', fill: '#2f5d4a', ...ST, 'stroke-width': 4 }, torso);
  } else {
    E('path', { d: 'M-24,-628 L-30,-540 M24,-628 L30,-540', stroke: '#eef2f5', 'stroke-width': 5, fill: 'none' }, torso); // strings
    E('circle', { cx: -30, cy: -536, r: 6, fill: '#eef2f5' }, torso); E('circle', { cx: 30, cy: -536, r: 6, fill: '#eef2f5' }, torso);
  }
  const armFront = G(body);                   // viewer-right arm (Kai's left), used for pointing
  const neck = E('path', { d: 'M-24,-700 L-22,-650 C-10,-640 10,-640 22,-650 L24,-700 Z', fill: C.skinSh, ...ST }, body);
  const head = G(body);                       // pivot at the neck
  if (v === 'mira') { E('path', { d: 'M30,-888 C120,-936 196,-884 186,-800 C180,-740 204,-690 172,-628 C150,-690 122,-736 112,-800 C106,-840 80,-860 30,-858 Z', fill: C.hair, ...ST }, head);
    E('path', { d: 'M120,-880 C160,-860 170,-800 166,-740', stroke: C.hairHi, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, head); }
  if (v === 'C') E('path', { d: 'M-156,-760 C-166,-884 -70,-936 0,-936 C70,-936 166,-884 156,-760 C154,-690 132,-646 100,-626 L-100,-626 C-132,-646 -154,-690 -156,-760 Z', fill: C.hoodSh, ...ST }, head);   // hood back
  if (v !== 'C') { E('ellipse', { cx: -100, cy: -740, rx: 20, ry: 28, fill: C.skin, ...ST }, head);   // ears
    E('ellipse', { cx: 100, cy: -740, rx: 20, ry: 28, fill: C.skin, ...ST }, head); }
  E('path', { d: st === 'anime' ? 'M-100,-800 C-104,-736 -92,-694 -56,-662 C-30,-640 -10,-628 0,-628 C10,-628 30,-640 56,-662 C92,-694 104,-736 100,-800 C80,-860 -80,-860 -100,-800 Z'
                         : 'M-100,-800 C-106,-724 -84,-656 -36,-634 C-14,-626 14,-626 36,-634 C84,-656 106,-724 100,-800 C80,-860 -80,-860 -100,-800 Z', fill: C.skin, ...ST }, head);
  if (v === 'kai' || v === 'mira') E('path', { d: 'M-98,-806 C-60,-786 60,-786 98,-806 L96,-778 C60,-764 -60,-764 -96,-778 Z', fill: C.skinSh, opacity: .55 }, head);   // hair shadow on the forehead
  // ---- hand-drawn anime face: hatch blush, tiny nose tick, lid bands, iris tucked under the lid ----
  const FL = '#3a2320';   // warm face line colour (colour-hold like in anime cels)
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++)
    E('path', { d: `M${sx * (44 + i * 10)},-704 L${sx * (50 + i * 10)},-716`, stroke: '#e8857a', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: .7 }, head);
  E('path', { d: 'M5,-724 L1,-712', stroke: FL, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .55 }, head);
  const eyes = [], uid = Math.floor(Math.random() * 1e6);
  const IR = { kai: ['#6b4030', '#3a2018', '#c08a5a'], mira: ['#5b3c86', '#2c1a46', '#a785d0'] }[v] || ['#3c6a9c', '#1c2f4a', '#7fb0dc'];
  const band = v === 'mira' ? 1.25 : v === 'kai' ? 1.0 : 0.75;   // lash-band thickness
  for (const sx of [-1, 1]) {
    if (st === 'soft') {   // soft style: simple dark bean eyes with one highlight and a thin lid line
      const eg = G(head), iris = G(eg);
      E('ellipse', { cx: sx * 54, cy: -752, rx: 15, ry: 21, fill: '#1e1a26' }, iris);
      E('ellipse', { cx: sx * 49, cy: -762, rx: 5.5, ry: 7, fill: '#ffffff' }, iris);
      E('circle', { cx: sx * 59, cy: -742, r: 2.5, fill: '#ffffff', opacity: .8 }, iris);
      E('path', { d: `M${sx * 34},-780 C${sx * 46},-790 ${sx * 64},-790 ${sx * 76},-782`, stroke: '#1e1a26', 'stroke-width': v === 'mira' ? 5 : 4, fill: 'none', 'stroke-linecap': 'round' }, eg);
      if (v === 'mira') E('path', { d: `M${sx * 76},-782 L${sx * 86},-788`, stroke: '#1e1a26', 'stroke-width': 4, 'stroke-linecap': 'round' }, eg);
      eyes.push({ g: eg, iris, cx: sx * 54, cy: -752 }); continue;
    }
    const egOuter = G(head, st === 'cute' ? { transform: `translate(${sx * 57},-754) scale(1.22) translate(${-sx * 57},754)` } : {});
    const eg = G(egOuter), cid = `ec${uid}${sx > 0 ? 'r' : 'l'}`;
    const white = `M${sx * 30},-748 C${sx * 36},-784 ${sx * 76},-790 ${sx * 86},-758 C${sx * 82},-730 ${sx * 44},-720 ${sx * 30},-748 Z`;
    E('path', { d: white, fill: '#fffdf8' }, eg);
    const cp = E('clipPath', { id: cid }, eg); E('path', { d: white }, cp);
    const clip = G(eg, { 'clip-path': `url(#${cid})` }), iris = G(clip);
    E('ellipse', { cx: sx * 57, cy: -750, rx: 19, ry: 27, fill: IR[0] }, iris);
    if (st !== 'simple') { E('ellipse', { cx: sx * 57, cy: -774, rx: 24, ry: 13, fill: IR[1] }, iris);   // lid shadow on the iris
      E('ellipse', { cx: sx * 57, cy: -737, rx: 12, ry: 8, fill: IR[2], opacity: .8 }, iris); }   // light bounce
    E('ellipse', { cx: sx * 57, cy: -752, rx: 8, ry: 13, fill: IR[1] }, iris);                   // pupil
    E('ellipse', { cx: sx * 50, cy: -764, rx: 7, ry: 9, fill: '#ffffff', transform: `rotate(${sx * -20} ${sx * 50} -764)` }, iris);
    if (st !== 'simple') E('circle', { cx: sx * 63, cy: -740, r: 3.2, fill: '#ffffff' }, iris);
    const t = band;   // tapered lash band, thicker towards the outer corner, with a small flick
    E('path', { d: `M${sx * 26},-744 C${sx * 32},-${786 + 4 * t} ${sx * 80},-${794 + 6 * t} ${sx * 94},-${760 + 4 * t} L${sx * (98 + 4 * t)},-${752 + 2 * t} C${sx * 92},-754 ${sx * 88},-756 ${sx * 86},-758 C${sx * 78},-784 ${sx * 38},-780 ${sx * 30},-746 Z`, fill: '#1a1420' }, eg);
    if (v === 'mira') E('path', { d: `M${sx * 88},-776 L${sx * 102},-784 L${sx * 92},-768 Z`, fill: '#1a1420' }, eg);
    if (st !== 'simple') E('path', { d: `M${sx * 66},-726 C${sx * 76},-728 ${sx * 82},-732 ${sx * 85},-740`, stroke: '#1a1420', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, eg);
    if (st !== 'simple') E('path', { d: `M${sx * 34},-792 C${sx * 50},-800 ${sx * 66},-800 ${sx * 78},-794`, stroke: FL, 'stroke-width': 2.5, fill: 'none', opacity: .35, 'stroke-linecap': 'round' }, eg);   // lid crease
    eyes.push({ g: eg, iris, cx: sx * 57, cy: -754 });
  }
  const brows = [-1, 1].map(sx => E('path', { d: `M${sx * 30},-804 C${sx * 46},-822 ${sx * 70},-824 ${sx * 88},-812 C${sx * 70},-816 ${sx * 48},-814 ${sx * 32},-800 Z`, fill: C.hair }, head));
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
  } else if (v === 'kai') {   // short, messy, spiky dark hair
    E('path', { d: 'M-112,-770 C-130,-820 -122,-860 -98,-880 L-122,-902 C-82,-910 -62,-930 -30,-934 L-42,-958 C0,-942 30,-950 52,-940 L62,-962 C82,-932 112,-920 126,-890 L148,-896 C132,-860 124,-820 112,-776 C104,-792 96,-800 86,-806 L92,-776 C76,-796 60,-802 44,-814 L46,-786 C30,-800 10,-806 -6,-818 L-12,-790 C-26,-800 -46,-804 -60,-814 L-66,-786 C-78,-796 -94,-798 -104,-808 Z', fill: C.hair, ...ST }, hairFront);
    E('path', { d: 'M-50,-880 C-30,-900 10,-906 40,-896', stroke: C.hairHi, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
  } else if (v === 'mira') {   // fringe with side locks (ponytail is behind the head)
    E('path', { d: 'M-110,-700 C-124,-800 -110,-880 -20,-906 C60,-914 120,-870 112,-780 C110,-740 108,-716 104,-700 C96,-740 94,-770 88,-790 C70,-796 60,-800 50,-812 C36,-798 10,-800 -4,-816 C-20,-800 -44,-800 -58,-812 C-72,-800 -86,-794 -94,-786 C-98,-760 -100,-730 -110,-700 Z', fill: C.hair, ...ST }, hairFront);
    E('path', { d: 'M-40,-880 C-10,-896 30,-896 60,-882', stroke: C.hairHi, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
    E('circle', { cx: 64, cy: -896, r: 12, fill: '#3b6fd6', ...ST, 'stroke-width': 4 }, hairFront);
  } else {   // hood up, small fringe
    E('path', { d: 'M-92,-796 C-74,-852 74,-852 92,-796 C64,-812 34,-806 0,-818 C-34,-806 -64,-812 -92,-796 Z', fill: C.hair, ...ST, 'stroke-width': 4 }, hairFront);
    E('path', { d: 'M-120,-700 C-128,-860 -64,-904 0,-904 C64,-904 128,-860 120,-700', stroke: C.line, 'stroke-width': 34, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
    E('path', { d: 'M-120,-700 C-128,-860 -64,-904 0,-904 C64,-904 128,-860 120,-700', stroke: C.hoodHi, 'stroke-width': 24, fill: 'none', 'stroke-linecap': 'round' }, hairFront);
  }
  const sweat = E('path', { d: 'M96,-820 C86,-800 88,-786 98,-784 C108,-786 110,-800 96,-820 Z', fill: '#8fd8ff', stroke: '#2a6ea0', 'stroke-width': 3, opacity: 0 }, head);
  // arms: one smooth sleeve path (no seams), hand with fingers at the wrist
  const arm = (g, sx) => {
    const S = [sx * 112, -612], E0 = [sx * 126, -496], W0 = [sx * 128, -392];
    const LS = { fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const outline = E('path', { ...LS, stroke: C.line, 'stroke-width': 54 }, g);
    E('circle', { cx: S[0], cy: S[1], r: 21, fill: C.hood }, g);   // hides the seam where the sleeve meets the body
    const fill = E('path', { ...LS, stroke: C.hood, 'stroke-width': 44 }, g);
    const cuff = E('path', { fill: 'none', stroke: C.hoodSh, 'stroke-width': 44, 'stroke-linecap': 'butt' }, g);
    const hand = G(g);
    for (let i = 0; i < 4; i++) { const fx = sx * (118 + i * 8), fy = -340 + (i === 1 || i === 2 ? 6 : 0);   // four fingers
      E('path', { d: `M${fx},-360 L${fx},${fy}`, stroke: C.line, 'stroke-width': 13, 'stroke-linecap': 'round' }, hand);
      E('path', { d: `M${fx},-360 L${fx},${fy}`, stroke: C.skin, 'stroke-width': 6, 'stroke-linecap': 'round' }, hand); }
    E('path', { d: `M${sx * 114},-376 L${sx * 104},-360`, stroke: C.line, 'stroke-width': 13, 'stroke-linecap': 'round' }, hand);   // thumb
    E('path', { d: `M${sx * 114},-376 L${sx * 104},-360`, stroke: C.skin, 'stroke-width': 6, 'stroke-linecap': 'round' }, hand);
    E('path', { d: `M${sx * 112},-394 C${sx * 108},-372 ${sx * 112},-356 ${sx * 130},-354 C${sx * 148},-356 ${sx * 152},-372 ${sx * 146},-394 Z`, fill: C.skin, ...ST, 'stroke-width': 4 }, hand);
    const finger = E('path', { d: `M${sx * 128},-350 L${sx * 128},-300`, stroke: C.line, 'stroke-width': 18, 'stroke-linecap': 'round', opacity: 0 }, hand);
    const fingerFill = E('path', { d: `M${sx * 128},-350 L${sx * 128},-300`, stroke: C.skin, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, hand);
    const L = Limb(S, E0, W0, { outline, fill, cuff, hand });
    return { up: L.up, fore: L.fore, hand: L.hand, finger: [finger, fingerFill] };
  };
  const aR = arm(armBack, -1), aL = arm(armFront, 1);
  const k = { root, body, head, eyes, brows, mouths, legL, legR, aR, aL, sweat, x: o.x || 0, y: o.y || 0, s: o.s || 1 };
  gsap.set(root, { x: k.x, y: k.y, scale: k.s, transformOrigin: '0px 0px' });
  gsap.set(head, { svgOrigin: '0 -650', scale: (v === 'kai' || v === 'mira') ? { anime: 0.86, cute: 1.02, soft: 0.9, simple: 0.9 }[st] : 1 }); gsap.set(body, { svgOrigin: '0 0' });
  gsap.set(legL, { svgOrigin: '-50 -400' }); gsap.set(legR, { svgOrigin: '50 -400' });
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

// Orbi as a full puppet: glass sphere head-body, dark visor with glowing green eyes, green orbit ring,
// two arms with hands and fingers, two short legs with round feet, a small water drop below.
// Gender-neutral main figure for "you" videos. Local coords: sphere centre (0,0), radius 80, feet near y=150.
function OrbiBot(parent, o = {}) {
  const K = { line: '#1d3a4a', glass1: '#f4ffff', glass2: '#bfe9f0', glass3: '#7fc3d2', visor: '#14232c', eye: '#5dffb0', ring: '#6dff9a', limb: '#dff4f7', limbSh: '#a9d6df', boot: '#2f8f8a' };
  const S = { stroke: K.line, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  const id = 'ob' + Math.floor(Math.random() * 1e6);
  const root = G(parent), bob = G(root), defs = E('defs', {}, root); boil(bob, 4);
  const rg = E('radialGradient', { id: id + 'g', cx: '35%', cy: '30%', r: '75%' }, defs);
  E('stop', { offset: '0%', 'stop-color': '#f4ffff' }, rg); E('stop', { offset: '58%', 'stop-color': '#e2f7fa' }, rg); E('stop', { offset: '58%', 'stop-color': '#b6e1ea' }, rg); E('stop', { offset: '100%', 'stop-color': '#a3d5e0' }, rg);
  const gl = E('filter', { id: id + 'f', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); E('feGaussianBlur', { stdDeviation: 4, result: 'b' }, gl);
  const fm = E('feMerge', {}, gl); E('feMergeNode', { in: 'b' }, fm); E('feMergeNode', { in: 'SourceGraphic' }, fm);
  // legs (behind the sphere)
  const leg = sx => { const g = G(bob); E('path', { d: `M${sx * 26},60 L${sx * 30},118`, stroke: K.line, 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${sx * 26},60 L${sx * 30},118`, stroke: K.limb, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${sx * 30 - 22},140 C${sx * 30 - 24},116 ${sx * 30 + 24},112 ${sx * 30 + 26 + sx * 8},134 C${sx * 30 + 26},146 ${sx * 30 - 20},148 ${sx * 30 - 22},140 Z`, fill: K.boot, ...S }, g);
    gsap.set(g, { svgOrigin: `${sx * 26} 60` }); return g; };
  const legL = leg(-1), legR = leg(1);
  // ring back half
  const ringBack = E('path', { d: 'M-122,12 C-122,-14 122,-14 122,12', stroke: K.ring, 'stroke-width': 9, fill: 'none', filter: `url(#${id}f)`, opacity: .9 }, bob);
  // arms: upper > fore > hand (open / point / fist / thumb shapes)
  const arm = sx => {
    const Sx = sx * 70, Sy = 14, Ex = sx * 86, Ey = 58, Wx = sx * 90, Wy = 94;
    const g = G(bob), LS = { fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const outline = E('path', { ...LS, stroke: K.line, 'stroke-width': 22 }, g), fill = E('path', { ...LS, stroke: K.limb, 'stroke-width': 14 }, g);
    const hand = G(g);
    const shapes = {};
    const fing = (g, x1, y1, x2, y2) => { E('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: K.line, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
      E('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: K.limb, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); };
    const palm = g => E('circle', { cx: Wx, cy: Wy + 12, r: 14, fill: K.limb, ...S }, g);
    shapes.open = G(hand); [-12, -4, 4, 12].forEach((dx, i) => fing(shapes.open, Wx + dx * .6, Wy + 18, Wx + dx * 1.3, Wy + 38 - (i === 0 || i === 3 ? 4 : 0))); fing(shapes.open, Wx - sx * 10, Wy + 10, Wx - sx * 24, Wy + 18); palm(shapes.open);
    shapes.point = G(hand); fing(shapes.point, Wx, Wy + 18, Wx, Wy + 46); palm(shapes.point); E('path', { d: `M${Wx - 10},${Wy + 20} L${Wx + 10},${Wy + 20}`, stroke: K.line, 'stroke-width': 3 }, shapes.point);
    shapes.fist = G(hand); palm(shapes.fist); E('path', { d: `M${Wx - 9},${Wy + 18} L${Wx + 9},${Wy + 18} M${Wx - 9},${Wy + 12} L${Wx + 9},${Wy + 12}`, stroke: K.line, 'stroke-width': 3 }, shapes.fist);
    shapes.thumb = G(hand); palm(shapes.thumb); fing(shapes.thumb, Wx - sx * 6, Wy + 4, Wx - sx * 6, Wy - 16);
    for (const k in shapes) gsap.set(shapes[k], { opacity: k === 'open' ? 1 : 0 });
    const L = Limb([Sx, Sy], [Ex, Ey], [Wx, Wy], { outline, fill, hand });
    return { up: L.up, fore: L.fore, hand: L.hand, shapes, sx };
  };
  const aL = arm(-1), aR = arm(1);
  // sphere
  const sphere = G(bob);
  E('circle', { cx: 0, cy: 0, r: 80, fill: `url(#${id}g)`, ...S }, sphere);
  E('path', { d: 'M-60,40 C-40,70 40,72 64,40', stroke: '#ffffff', 'stroke-width': 4, fill: 'none', opacity: .6 }, sphere);
  E('ellipse', { cx: -34, cy: -48, rx: 18, ry: 9, fill: '#ffffff', opacity: .85, transform: 'rotate(-30 -34 -48)' }, sphere);
  for (const sx of [-1, 1]) E('path', { d: `M${sx * 70},-34 C${sx * 92},-30 ${sx * 92},6 ${sx * 70},10 Z`, fill: '#cfd8dc', ...S }, sphere);   // ear caps
  const head = G(bob);   // visor turns as the 'head'
  E('rect', { x: -54, y: -40, width: 108, height: 64, rx: 30, fill: K.visor, ...S }, head);
  E('path', { d: 'M-40,-30 C-20,-38 10,-38 24,-34', stroke: '#ffffff', 'stroke-width': 4, opacity: .25, fill: 'none', 'stroke-linecap': 'round' }, head);
  const face = G(head, { filter: `url(#${id}f)` });
  const F = {
    normal: G(face), happy: G(face), wow: G(face), think: G(face),
  };
  for (const sx of [-1, 1]) {
    E('ellipse', { cx: sx * 22, cy: -10, rx: 9, ry: 12, fill: K.eye }, F.normal);
    E('path', { d: `M${sx * 22 - 10},-6 C${sx * 22 - 6},-18 ${sx * 22 + 6},-18 ${sx * 22 + 10},-6`, stroke: K.eye, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, F.happy);
    E('circle', { cx: sx * 22, cy: -10, r: 13, fill: K.eye }, F.wow);
  }
  E('ellipse', { cx: -22, cy: -10, rx: 9, ry: 12, fill: K.eye }, F.think); E('path', { d: 'M12,-8 L32,-12', stroke: K.eye, 'stroke-width': 5, 'stroke-linecap': 'round' }, F.think);
  const mouth = E('path', { d: 'M-8,10 C-4,14 4,14 8,10', stroke: K.eye, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, face);
  for (const k in F) gsap.set(F[k], { opacity: k === 'normal' ? 1 : 0 });
  // ring front half + water drop
  const ringFront = E('path', { d: 'M-122,12 C-122,38 122,38 122,12', stroke: K.ring, 'stroke-width': 9, fill: 'none', filter: `url(#${id}f)` }, bob);
  const drop = E('path', { d: 'M0,84 C-6,96 -6,104 0,106 C6,104 6,96 0,84 Z', fill: '#9fe8ff', stroke: '#4aaed0', 'stroke-width': 2 }, root);
  const b = { root, bob, head, F, aL, aR, legL, legR, drop, ringFront, ringBack };
  const ox = o.x || 0, oy = o.y || 0, os = o.s || 1;
  gsap.set(root, { attr: { transform: `translate(${ox},${oy}) scale(${os})` } });
  // ---------- motion ----------
  b.idle = (tl, t0, dur) => {
    tl.fromTo(bob, { y: -6 }, { y: 6, duration: 1.4, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.4)), ease: 'sine.inOut' }, t0);
    tl.fromTo([legL, legR], { rotation: -6 }, { rotation: 6, duration: 1.7, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.7)), ease: 'sine.inOut' }, t0);
    tl.fromTo([ringFront, ringBack], { opacity: .75 }, { opacity: 1, duration: 1.1, yoyo: true, repeat: Math.max(1, Math.floor(dur / 1.1)), ease: 'sine.inOut' }, t0);
    for (let t = t0 + 1.1; t < t0 + dur; t += 2.7 + ((t * 7) % 1.3)) b.blink(tl, t);
    for (let t = t0 + 0.5; t < t0 + dur; t += 2.2) tl.fromTo(drop, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, y: 6, duration: .4 }, { y: 60, opacity: 0, duration: .6, ease: 'power2.in' }], immediateRender: false }, t);
  };
  b.blink = (tl, t) => tl.to(face, { scaleY: .1, svgOrigin: '0 -10', duration: .07, yoyo: true, repeat: 1 }, t);
  b.face = (tl, t, k) => { for (const n in F) tl.to(F[n], { opacity: n === k ? 1 : 0, duration: .12 }, t); };
  b.look = (tl, t, dx, dy = 0) => tl.to(head, { x: dx, y: dy, duration: .35, ease: 'power2.inOut' }, t);
  b.hand = (tl, t, a, k) => { for (const n in a.shapes) tl.to(a.shapes[n], { opacity: n === k ? 1 : 0, duration: .08 }, t); };
  // angles: up/fore = how far the arm swings OUTWARD (mirrored automatically for the left arm)
  const setArm = (tl, t, a, up, fore, hand = 'open', d = .55) => { const t0 = t - d * .7;
    tl.to(a.up, { rotation: -a.sx * up, duration: d, ease: 'power3.inOut' }, t0);
    tl.to(a.fore, { rotation: -a.sx * fore, duration: d, ease: 'back.out(1.2)' }, t0 + .07);
    b.hand(tl, t0 + d * .5, a, hand); };
  b.pose = (tl, t, name) => {
    const P = {
      rest:    () => { setArm(tl, t, aL, 12, 8); setArm(tl, t, aR, 12, 8); },
      wave:    () => { setArm(tl, t, aR, 150, 20); setArm(tl, t, aL, 12, 8); tl.to(aR.fore, { rotation: -40, duration: .22, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t); },
      point:   () => { setArm(tl, t, aR, 96, 0, 'point'); setArm(tl, t, aL, 12, 8); },
      pointUp: () => { setArm(tl, t, aR, 168, 0, 'point'); setArm(tl, t, aL, 12, 8); },
      thumbs:  () => { setArm(tl, t, aR, 40, 100, 'thumb'); setArm(tl, t, aL, 12, 8); },
      open:    () => { setArm(tl, t, aL, 75, -20); setArm(tl, t, aR, 75, -20); },
      think:   () => { setArm(tl, t, aR, 30, 135, 'fist'); setArm(tl, t, aL, 12, 8); },
      shrug:   () => { setArm(tl, t, aL, 55, -75); setArm(tl, t, aR, 55, -75); tl.to(bob, { y: -14, duration: .25, yoyo: true, repeat: 1 }, t); },
      count:   () => { setArm(tl, t, aL, 70, 60, 'point'); setArm(tl, t, aR, 70, 60, 'open'); },
    };
    (P[name] || P.rest)();
    tl.to(sphere, { rotation: { point: 4, pointUp: -3, think: -4 }[name] || 0, svgOrigin: '0 0', duration: .7, ease: 'sine.inOut' }, t - .4);
  };
  b.fly = (tl, t, x, y, d = 1) => tl.to(root, { attr: { transform: `translate(${x},${y}) scale(${os})` }, duration: d, ease: 'power2.inOut' }, t);
  b.spin = (tl, t) => { tl.to([ringFront, ringBack], { scaleX: -1, svgOrigin: '0 12', duration: .3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t); };
  return b;
}

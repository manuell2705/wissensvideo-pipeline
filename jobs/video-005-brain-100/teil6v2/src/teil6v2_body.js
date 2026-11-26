
const WA = (id, alts, n = 0) => { for (const a of alts) { try { return W(id, a, n); } catch (e) {} } throw new Error('word ' + id + ' ' + alts); };
const LBL = (p, x, y, txt, col = '#9ff3ff', w = 0, size = 40) => { const g = G(p, { opacity: 0 }); const ww = w || txt.length * size * .62 + 70; E('rect', { x: x - ww / 2 + 5, y: y - size * .95 + 7, width: ww, height: size * 1.7, rx: size * .85, fill: '#000', opacity: .2 }, g); E('rect', { x: x - ww / 2, y: y - size * .95, width: ww, height: size * 1.7, rx: size * .85, fill: '#14243a', stroke: col, 'stroke-width': 5 }, g); T(g, x, y + size * .36, size, txt, '#ffffff', 800); return g; };
const showLbl = (g, t) => { tl.fromTo(g, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .3, ease: 'back.out(2)', immediateRender: false }, t); sfx('pop', t, .3); };
const SC = ['#5fe8d0', '#ffcf4a', '#ff8fb1', '#9fb3ff', '#7ee081', '#ffb070'];
const card = (p, x, y, w, h, fill = '#fff') => { const g = G(p, { opacity: 0 }); E('rect', { x: x - w / 2 + 6, y: y - h / 2 + 8, width: w, height: h, rx: 14, fill: '#000', opacity: .18 }, g); E('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, fill, stroke: '#1d3a4a', 'stroke-width': 5 }, g); return g; };
const grad = (id, stops, v = true) => { const g = E('linearGradient', { id, x1: 0, y1: 0, x2: v ? 0 : 1, y2: v ? 1 : 0 }, defs); stops.forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); return g; };
const rgrad = (id, stops) => { const g = E('radialGradient', { id, cx: '50%', cy: '45%', r: '75%' }, defs); stops.forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); };
grad('tTxt', [[0, '#fff3a8'], [.5, '#ffb547'], [1, '#ff6b9a']]);
const INK = '#1d3a4a';
const bg = (cam, fill) => E('rect', { x: -200, y: -200, width: 2320, height: 1480, fill }, cam);
const stars = (cam, n = 50) => { for (let i = 0; i < n; i++) E('circle', { cx: (i * 337) % 1920, cy: (i * 191) % 1080, r: 1.5 + (i % 3), fill: '#cfe6ff', opacity: .45 }, cam); };
const enter = (from, to, t) => { tl.to(flash, { opacity: .9, duration: .12 }, t - .12); tl.set(from, { opacity: 0 }, t); tl.set(to, { opacity: 1 }, t); tl.to(flash, { opacity: 0, duration: .3 }, t); };

// ============ SET FL: epic beach fight -> flow (851-857) ============
const setFl = G(screen);
const camFl = G(setFl);
{ const g = E('linearGradient', { id: 'bSky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs); [[0, '#3a2a7a'], [.35, '#b04a8a'], [.65, '#ff8a5a'], [1, '#ffd08a']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
{ const g = E('linearGradient', { id: 'bSea', x1: 0, y1: 0, x2: 0, y2: 1 }, defs); [[0, '#ff9a6a'], [.15, '#c86a8a'], [.6, '#3a5aa0'], [1, '#1d3a6a']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
{ const g = E('linearGradient', { id: 'bSand', x1: 0, y1: 0, x2: 0, y2: 1 }, defs); [[0, '#f6c98a'], [1, '#d89a5a']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
{ const g = E('radialGradient', { id: 'bSun', cx: '50%', cy: '50%', r: '50%' }, defs); [[0, '#fffbe0'], [.35, '#fff0a0'], [.6, 'rgba(255,200,120,.55)'], [1, 'rgba(255,160,120,0)']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
{ const g = E('radialGradient', { id: 'bSpot', cx: '50%', cy: '0%', r: '100%' }, defs); [[0, 'rgba(255,255,230,.55)'], [1, 'rgba(255,255,230,0)']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
const blurF = E('filter', { id: 'bgBlur', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs); const blurG = E('feGaussianBlur', { stdDeviation: 0 }, blurF);
const bgL = G(camFl, { filter: 'url(#bgBlur)' });
E('rect', { x: -400, y: -400, width: 2720, height: 1200, fill: 'url(#bSky)' }, bgL);
for (let i = 0; i < 70; i++) E('circle', { cx: (i * 337) % 1920, cy: (i * 97) % 300, r: 1 + (i % 3) * .6, fill: '#fff', opacity: .5 - (i % 5) * .08 }, bgL);
const cloudB = (x, y, s, o) => { const c = G(bgL, { opacity: o }); [[0, 0, 90, 26], [70, -14, 70, 22], [-80, 6, 80, 20], [150, 8, 60, 16]].forEach(([dx, dy, rx, ry]) => E('ellipse', { cx: x + dx * s, cy: y + dy * s, rx: rx * s, ry: ry * s, fill: '#ffc0a8' }, c)); E('ellipse', { cx: x, cy: y + 12 * s, rx: 200 * s, ry: 10 * s, fill: '#ff9a8a', opacity: .6 }, c); tl.to(c, { x: 60, duration: 40, ease: 'none' }, 0); };
cloudB(300, 200, 1.2, .8); cloudB(1300, 150, 1, .7); cloudB(1700, 300, .7, .6); cloudB(700, 330, .6, .5);
E('circle', { cx: 960, cy: 520, r: 330, fill: 'url(#bSun)' }, bgL);
const sun = E('circle', { cx: 960, cy: 520, r: 110, fill: '#fff4c0' }, bgL);
const rays = G(bgL, { opacity: .35 }); for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; E('path', { d: `M${960 + Math.cos(a) * 140},${520 + Math.sin(a) * 140} L${960 + Math.cos(a + .06) * 520},${520 + Math.sin(a + .06) * 520} L${960 + Math.cos(a - .06) * 520},${520 + Math.sin(a - .06) * 520} Z`, fill: '#fff4c0' }, rays); }
tl.to(rays, { rotation: 20, svgOrigin: '960 520', duration: 40, ease: 'none' }, 0);
// distant islands with tiny palms
const isle = (x, w, h) => { E('path', { d: `M${x - w},590 C${x - w * .5},${590 - h} ${x + w * .5},${590 - h} ${x + w},590 Z`, fill: '#5a2a5a', opacity: .8 }, bgL); for (let k = -1; k <= 1; k += 2) { const px = x + k * w * .25; E('path', { d: `M${px},${590 - h * .7} C${px + 4},${590 - h - 20} ${px + 6},${590 - h - 40} ${px + 2},${590 - h - 50}`, stroke: '#4a1f4a', 'stroke-width': 4, fill: 'none' }, bgL); for (let f = 0; f < 5; f++) { const a = -2.6 + f * .55; E('path', { d: `M${px + 2},${590 - h - 50} q${Math.cos(a) * 20},${Math.sin(a) * 10 - 6} ${Math.cos(a) * 34},${Math.sin(a) * 20 + 8}`, stroke: '#4a1f4a', 'stroke-width': 4, fill: 'none' }, bgL); } } };
isle(260, 170, 40); isle(1640, 220, 50);
// the sea with sun glitter
E('rect', { x: -400, y: 588, width: 2720, height: 260, fill: 'url(#bSea)' }, bgL);
for (let k = 0; k < 26; k++) { const y = 600 + k * 8, w = 30 + k * 9; const l = E('rect', { x: 960 - w / 2 + ((k * 37) % 40 - 20), y, width: w, height: 3 + k * .2, rx: 2, fill: '#fff0b0', opacity: .7 - k * .02 }, bgL); tl.to(l, { opacity: .15, duration: .6 + (k % 4) * .2, yoyo: true, repeat: 40, ease: 'sine.inOut' }, (k % 7) * .13); }
for (let k = 0; k < 7; k++) { const wv = E('path', { d: `M-400,${640 + k * 28} ` + Array.from({ length: 30 }, (_, i) => `q50,${-6 - k} 100,0`).join(' '), stroke: '#ffffff', 'stroke-width': 2 + k * .4, fill: 'none', opacity: .18 + k * .03 }, bgL); tl.to(wv, { x: -100, duration: 6 - k * .4, repeat: 10, ease: 'none' }, 0); }
// birds
for (let k = 0; k < 5; k++) { const b = E('path', { d: 'M0,0 q12,-10 24,0 q12,-10 24,0', stroke: '#3a1f4a', 'stroke-width': 4, fill: 'none' }, bgL); tl.fromTo(b, { x: -100 - k * 60, y: 200 + k * 25 }, { x: 2100, y: 160 + k * 30, duration: 30 + k * 3, ease: 'none', immediateRender: true }, 0); tl.to(b, { scaleY: .4, duration: .3, yoyo: true, repeat: 100, ease: 'sine.inOut' }, k * .1); }
// beach
E('path', { d: 'M-400,830 C200,800 700,815 1100,808 C1500,800 1800,820 2320,805 L2320,1400 L-400,1400 Z', fill: 'url(#bSand)' }, bgL);
const foam = E('path', { d: 'M-400,826 C200,796 700,811 1100,804 C1500,796 1800,816 2320,801', stroke: '#ffffff', 'stroke-width': 8, fill: 'none', opacity: .8 }, bgL);
tl.to(foam, { y: 6, duration: 2.2, yoyo: true, repeat: 20, ease: 'sine.inOut' }, 0);
// detailed palm trees (segmented trunk + fronds with leaflets)
const palm = (x, y, h, lean, s, o = 1) => { const p = G(bgL, { opacity: o }); const tx = x + lean, ty = y - h;
  E('path', { d: `M${x - 16 * s},${y} C${x - 10 * s},${y - h * .5} ${tx - 30 * s},${ty + 60} ${tx - 8 * s},${ty} L${tx + 8 * s},${ty} C${tx - 10 * s},${ty + 60} ${x + 8 * s},${y - h * .5} ${x + 16 * s},${y} Z`, fill: '#7a4a2a', stroke: '#3a1f1a', 'stroke-width': 4 }, p);
  for (let k = 1; k < 14; k++) { const t = k / 14; const cx = x + (tx - x) * t * t, cy = y - h * t; E('path', { d: `M${cx - 14 * s * (1 - t * .4)},${cy} q${14 * s},${7 * s} ${28 * s * (1 - t * .4)},0`, stroke: '#4a2a1a', 'stroke-width': 3, fill: 'none', opacity: .8 }, p); }
  const crown = G(p);
  const fronds = [[-150, 40], [-110, -10], [-60, -60], [0, -80], [60, -60], [110, -10], [150, 40], [-30, 70], [40, 75]];
  fronds.forEach(([dx, dy], fi) => { const ex = tx + dx * s * 1.3, ey = ty + dy * s * .9 + 40 * s, mx = tx + dx * s * .6, my = ty - 60 * s + (dy > 0 ? 20 * s : 0); const fr = G(crown);
    E('path', { d: `M${tx},${ty} Q${mx},${my} ${ex},${ey}`, stroke: fi % 2 ? '#2f7a4a' : '#3a8a52', 'stroke-width': 7 * s, fill: 'none', 'stroke-linecap': 'round' }, fr);
    for (let k = 1; k < 12; k++) { const t = k / 12; const qx = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * mx + t * t * ex, qy = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * my + t * t * ey; const dxT = 2 * (1 - t) * (mx - tx) + 2 * t * (ex - mx), dyT = 2 * (1 - t) * (my - ty) + 2 * t * (ey - my); const L = Math.hypot(dxT, dyT) || 1; const nx = -dyT / L, ny = dxT / L; const len = (40 - 22 * t) * s;
      for (const sd of [1, -1]) E('path', { d: `M${qx},${qy} q${nx * sd * len * .5 + dxT / L * 8},${ny * sd * len * .5 + 14 * s} ${nx * sd * len + dxT / L * 10},${ny * sd * len + 26 * s}`, stroke: sd > 0 ? '#3f9a5a' : '#2a6a40', 'stroke-width': 5 * s, fill: 'none', 'stroke-linecap': 'round' }, fr); }
    tl.to(fr, { rotation: (fi % 2 ? 3 : -3), svgOrigin: `${tx} ${ty}`, duration: 1.8 + fi * .15, yoyo: true, repeat: 20, ease: 'sine.inOut' }, fi * .2); });
  for (let k = 0; k < 3; k++) E('circle', { cx: tx - 14 * s + k * 14 * s, cy: ty + 12 * s, r: 11 * s, fill: '#5a3a1a', stroke: '#2a1a0a', 'stroke-width': 3 }, crown);
  return p; };
palm(150, 900, 560, 90, 1.15); palm(380, 860, 420, 40, .9, .95); palm(1780, 900, 580, -110, 1.2); palm(1560, 850, 400, -40, .85, .95);
// ring on the sand
const ringG = G(camFl);
E('path', { d: 'M380,980 L1540,980 L1440,800 L480,800 Z', fill: '#2a3a6a', stroke: '#1d2a4a', 'stroke-width': 6 }, ringG);
E('path', { d: 'M380,980 L1540,980 L1540,1030 L380,1030 Z', fill: '#1d2a4a' }, ringG);
E('path', { d: 'M520,820 L1400,820 L1480,960 L440,960 Z', fill: '#3a4a8a', opacity: .5 }, ringG);
const posts = [[480, 800, 560], [1440, 800, 560], [380, 980, 700], [1540, 980, 700]];
const ropes = G(camFl);
posts.slice(0, 2).forEach(([x, y, t]) => { E('rect', { x: x - 12, y: t, width: 24, height: y - t, rx: 6, fill: '#c6d3e6', stroke: '#1d2a4a', 'stroke-width': 4 }, ringG); E('rect', { x: x - 16, y: t, width: 32, height: 80, rx: 8, fill: '#ff4d5e' }, ringG); });
const ropeCols = ['#ff4d5e', '#ffffff', '#4a7aff'];
const ropeEls = [];
for (let k = 0; k < 3; k++) { const yb = 600 + k * 60; ropeEls.push(E('path', { d: `M480,${yb} L1440,${yb}`, stroke: ropeCols[k], 'stroke-width': 6, opacity: .7 }, ringG)); }
// crowd silhouettes with phone flashes
const crowd = G(camFl); const flashes = [];
for (let r = 0; r < 2; r++) for (let i = 0; i < 26; i++) { const x = (i * 75 + r * 37) % 1980 - 30, y = 1010 + r * 50; if (x > 300 && x < 1620 && r === 0) continue; const h = G(crowd); E('circle', { cx: x, cy: y - 40, r: 26, fill: '#1a1030' }, h); E('path', { d: `M${x - 44},${y + 60} C${x - 40},${y - 10} ${x + 40},${y - 10} ${x + 44},${y + 60} Z`, fill: '#1a1030' }, h); tl.to(h, { y: -14, duration: .22 + (i % 3) * .05, yoyo: true, repeat: 60, ease: 'sine.inOut' }, (i % 5) * .07);
  if (i % 4 === 0) { const f = E('circle', { cx: x + 30, cy: y - 70, r: 7, fill: '#ffffff', opacity: 0, filter: 'url(#glow)' }, crowd); flashes.push(f); tl.to(f, { opacity: 1, duration: .05, yoyo: true, repeat: 1 }, .5 + (i * .37) % 6); tl.to(f, { opacity: 1, duration: .05, yoyo: true, repeat: 1 }, 4 + (i * .53) % 5); } }
for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const side = i < 4 ? 0 : 1, k = i % 4; const x = side ? 1600 + k * 85 + r * 30 : 40 + k * 85 + r * 30, y = 820 + r * 60; const h = G(crowd); E('circle', { cx: x, cy: y - 40, r: 22, fill: '#2a1840' }, h); E('path', { d: `M${x - 36},${y + 40} C${x - 32},${y - 10} ${x + 32},${y - 10} ${x + 36},${y + 40} Z`, fill: '#2a1840' }, h); tl.to(h, { y: -12, duration: .25, yoyo: true, repeat: 60, ease: 'sine.inOut' }, (i + r) * .05); }
const spots = G(camFl, { opacity: .9 }); for (const [x, r] of [[600, 12], [1320, -12]]) { const sp = E('path', { d: `M${x},-60 L${x - 260},1000 L${x + 260},1000 Z`, fill: 'url(#bSpot)', transform: `rotate(${r} ${x} -60)` }, spots); tl.to(sp, { rotation: -r * .6, svgOrigin: `${x} -60`, duration: 2.5, yoyo: true, repeat: 20, ease: 'sine.inOut' }, 0); }

// ---- the fighters: forward-kinematics rigs redrawn every frame ----
const FIGHTERS = [];
function Fighter(parent, X, flip, C) {
  const g = G(parent, { transform: `translate(${X},960) scale(${flip ? -1 : 1},1)` });
  const st = { x: 0, y: -230, lean: 0, bt: 18, bs: 6, ft: -22, fs: 14, bu: -40, bf: -120, fu: -62, ff: -104, head: 0 };
  const LS = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const mk = (w, col) => [E('path', { ...LS, stroke: '#1d1a2a', 'stroke-width': w + 8 }, g), E('path', { ...LS, stroke: col, 'stroke-width': w }, g)];
  const shadow = E('ellipse', { cx: 0, cy: 0, rx: 110, ry: 16, fill: '#000', opacity: .25 }, g);
  const bArm = mk(26, C.skinD), bGlove = E('circle', { r: 30, fill: C.gloveD, stroke: '#1d1a2a', 'stroke-width': 4 }, g);
  const bLeg = mk(36, C.shortsD), bShin = mk(30, C.skinD), bShoe = E('ellipse', { rx: 30, ry: 14, fill: '#f3f3f3', stroke: '#1d1a2a', 'stroke-width': 4 }, g);
  const torso = mk(78, C.top), belt = E('path', { ...LS, stroke: C.shorts, 'stroke-width': 54 }, g);
  const fLeg = mk(38, C.shorts), fShin = mk(32, C.skin), fShoe = E('ellipse', { rx: 32, ry: 15, fill: '#ffffff', stroke: '#1d1a2a', 'stroke-width': 4 }, g);
  const headG = G(g);
  E('circle', { cx: 0, cy: 0, r: 44, fill: C.skin, stroke: '#1d1a2a', 'stroke-width': 5 }, headG);
  E('path', { d: 'M-46,6 C-52,-50 -10,-68 26,-56 C44,-48 50,-30 48,-20 L18,-24 C8,-30 -10,-30 -18,-18 L-22,24 C-34,30 -44,22 -46,6 Z', fill: C.helm, stroke: '#1d1a2a', 'stroke-width': 5 }, headG);
  E('path', { d: 'M-30,-44 C-10,-56 14,-56 30,-48', stroke: '#ffffff', 'stroke-width': 5, opacity: .5, fill: 'none', 'stroke-linecap': 'round' }, headG);
  const eye = E('ellipse', { cx: 22, cy: -4, rx: 6, ry: 8, fill: '#1d1a2a' }, headG);
  const brow = E('path', { d: 'M12,-18 L34,-12', stroke: '#1d1a2a', 'stroke-width': 5, 'stroke-linecap': 'round' }, headG);
  E('path', { d: 'M16,22 L40,18', stroke: C.guard, 'stroke-width': 8, 'stroke-linecap': 'round' }, headG);
  const fArm = mk(28, C.skin), fGlove = E('circle', { r: 32, fill: C.glove, stroke: '#1d1a2a', 'stroke-width': 4 }, g);
  const shine = E('circle', { r: 9, fill: '#ffffff', opacity: .4 }, g);
  const D = a => [-Math.sin(a * Math.PI / 180), Math.cos(a * Math.PI / 180)];
  const seg = (p, a, L) => { const d = D(a); return [p[0] + d[0] * L, p[1] + d[1] * L]; };
  const set = (pair, pts) => { const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'); pair[0].setAttribute('d', d); pair[1].setAttribute('d', d); };
  const draw = () => { const s = st; const hip = [s.x, s.y]; const up = seg(hip, 180 + s.lean, 150); const neck = seg(hip, 180 + s.lean, 170);
    const bS = seg(up, 180 + s.lean - 90, -6), fS = seg(up, 180 + s.lean - 90, 10);
    const bK = seg(hip, s.bt, 105), bA = seg(bK, s.bt + s.bs, 100); set(bLeg, [hip, bK]); set(bShin, [bK, bA]); bShoe.setAttribute('cx', bA[0] + 10); bShoe.setAttribute('cy', bA[1] + 4);
    const fK = seg(hip, s.ft, 105), fA = seg(fK, s.ft + s.fs, 100); set(fLeg, [hip, fK]); set(fShin, [fK, fA]); fShoe.setAttribute('cx', fA[0] + 12); fShoe.setAttribute('cy', fA[1] + 4);
    const bE = seg(bS, s.lean + s.bu, 80), bW = seg(bE, s.lean + s.bu + s.bf, 72); set(bArm, [bS, bE, bW]); bGlove.setAttribute('cx', bW[0]); bGlove.setAttribute('cy', bW[1]);
    const fE = seg(fS, s.lean + s.fu, 82), fW = seg(fE, s.lean + s.fu + s.ff, 74); set(fArm, [fS, fE, fW]); fGlove.setAttribute('cx', fW[0]); fGlove.setAttribute('cy', fW[1]); shine.setAttribute('cx', fW[0] - 10); shine.setAttribute('cy', fW[1] - 12);
    set(torso, [seg(hip, 180 + s.lean, 20), up]); set([belt, belt], [seg(hip, 180 + s.lean, 4), seg(hip, 180 + s.lean, 22)]);
    const hc = seg(neck, 180 + s.lean + s.head * .3, 40); headG.setAttribute('transform', `translate(${hc[0].toFixed(1)},${hc[1].toFixed(1)}) rotate(${(s.lean + s.head).toFixed(1)})`);
    shadow.setAttribute('cx', s.x); };
  const P = { guard: { lean: 6, y: -230, bt: 18, bs: 6, ft: -22, fs: 14, bu: -40, bf: -120, fu: -62, ff: -104, head: 0 },
    bounce: { y: -222 },
    jab: { lean: 12, fu: -92, ff: -4, bu: -46, bf: -118, ft: -30, bt: 26 },
    cross: { lean: 20, bu: -95, bf: -2, fu: -40, ff: -120, bt: 34, ft: -26 },
    kick: { lean: -16, ft: -88, fs: -6, bt: 6, bs: 4, fu: -30, ff: -130, bu: -60, bf: -100, y: -236 },
    duck: { lean: -18, y: -205, bt: 30, bs: -30, ft: -40, fs: 40, head: -8 },
    slip: { lean: 24, y: -212, head: 10 },
    hit: { lean: -22, head: -24, fu: -20, ff: -60, bu: -10, bf: -50 },
    tired: { lean: 2, fu: -40, ff: -80, bu: -25, bf: -90, y: -226, head: 8 },
    upper: { lean: 16, bu: -150, bf: -20, y: -244, bt: 12 } };
  const F = { g, st, draw };
  F.pose = (t, name, d = .18, ease = 'power3.out') => tl.to(st, { ...P.guard, ...P[name], duration: d, ease }, t);
  F.go = (t, name, d = .14, back = .22, ease = 'power4.out') => { F.pose(t, name, d, ease); F.pose(t + d + .06, 'guard', back, 'power2.inOut'); };
  F.step = (t, dx, d = .3) => tl.to(st, { x: `+=${dx}`, duration: d, ease: 'power2.inOut' }, t);
  F.bounce = (t0, t1, p = .42) => { for (let t = t0; t < t1 - p; t += p) tl.to(st, { y: -218, duration: p / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t); };
  FIGHTERS.push(F); draw(); return F;
}
const fighters = G(camFl, { transform: 'translate(960 980) scale(1.22) translate(-960 -980)' });
const fA = Fighter(fighters, 760, false, { skin: '#e8b48a', skinD: '#c99670', top: '#2fb3a8', shorts: '#1d3a6a', shortsD: '#16305a', glove: '#ff4d5e', gloveD: '#c93040', helm: '#ff4d5e', guard: '#9ff3ff' });
const fB = Fighter(fighters, 1160, true, { skin: '#8d5a3b', skinD: '#6e4430', top: '#ff8a4a', shorts: '#3a2a5a', shortsD: '#2a1f48', glove: '#3a7aff', gloveD: '#2a5ad0', helm: '#3a7aff', guard: '#ffcf4a' });
// camera without svgOrigin drift: (cx,cy) is the world point shown at screen centre
const cam = { s: 1, cx: 960, cy: 540 };
const drawCam = () => camFl.setAttribute('transform', `translate(960 540) scale(${cam.s.toFixed(4)}) translate(${(-cam.cx).toFixed(2)} ${(-cam.cy).toFixed(2)})`);
const camC = (s, ox, oy) => ({ s, cx: ox + (960 - ox) / s, cy: oy + (540 - oy) / s });
const camTo = (t, s, ox, oy, d, ease) => tl.to(cam, { ...camC(s, ox, oy), duration: d, ease: ease || 'power2.inOut' }, t);
const drawFighters = () => { FIGHTERS.forEach(f => f.draw()); drawCam(); };
// impact bursts + speed lines + sweat
const burst = (x, y) => { const b = G(fighters, { opacity: 0 }); E('path', { d: `M${x},${y - 60} L${x + 16},${y - 16} L${x + 60},${y - 10} L${x + 22},${y + 12} L${x + 34},${y + 56} L${x},${y + 26} L${x - 34},${y + 56} L${x - 22},${y + 12} L${x - 60},${y - 10} L${x - 16},${y - 16} Z`, fill: '#fff6a8', stroke: '#ffffff', 'stroke-width': 4, filter: 'url(#glow)' }, b); return b; };
const hitAt = (t, x, y, big = false) => { const b = burst(x, y); tl.fromTo(b, { opacity: 1, scale: .3, svgOrigin: `${x} ${y}` }, { scale: big ? 1.6 : 1.1, opacity: 0, duration: .32, ease: 'power2.out', immediateRender: false }, t); sfx('impact', t, big ? .7 : .45); };
const sLines = G(camFl, { opacity: 0 }); for (let k = 0; k < 18; k++) { const a = k * Math.PI / 9; E('path', { d: `M${960 + Math.cos(a) * 420},${560 + Math.sin(a) * 300} L${960 + Math.cos(a) * 1200},${560 + Math.sin(a) * 900}`, stroke: '#ffffff', 'stroke-width': 6, opacity: .6 }, sLines); }
const sweat = []; for (let k = 0; k < 10; k++) { const d = E('ellipse', { cx: 830 + (k % 5) * 14, cy: 560 - (k % 3) * 10, rx: 5, ry: 7, fill: '#bfefff', stroke: '#ffffff', 'stroke-width': 2, opacity: 0 }, fighters); sweat.push(d); }
const dust = []; for (let k = 0; k < 30; k++) { const d = E('circle', { cx: 300 + (k * 211) % 1320, cy: 400 + (k * 137) % 500, r: 2 + k % 3, fill: '#fff4c0', opacity: 0 }, camFl); dust.push(d); }
// slow-mo grade, vignette, thought bubbles, big words
const slowTint = E('rect', { x: -400, y: -400, width: 2720, height: 1900, fill: '#2a4aa0', opacity: 0, 'mix-blend-mode': 'multiply' }, camFl);
{ const g = E('radialGradient', { id: 'vig', cx: '50%', cy: '50%', r: '70%' }, defs); [[.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.75)']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
const vig = E('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'url(#vig)', opacity: 0 }, setFl);
const thoughts = ['win?', 'what do they think?'].map((t, i) => { const g = G(setFl, { opacity: 0 }); const x = 560 + i * 800, y = 220 + i * 40; E('rect', { x: x - 290, y: y - 62, width: 580, height: 116, rx: 58, fill: 'rgba(255,255,255,.85)', stroke: '#1d3a4a', 'stroke-width': 4 }, g); T(g, x, y + 16, 50, t, '#3a5a6a', 800); return g; });
const bigWord = (txt, y, col) => { const g = G(setFl, { opacity: 0 }); for (let k = 10; k > 0; k -= 2) T(g, 960 + k, y + k, 150, txt, '#1a1030', 900); T(g, 960, y, 150, txt, col, 900, { stroke: '#fff7d6', 'stroke-width': 5, 'paint-order': 'stroke' }); return g; };
const wFlow = bigWord('FLOW', 300, 'url(#tTxt)'), wZone = bigWord('THE ZONE', 300, 'url(#tTxt)');
const lastR = G(setFl, { opacity: 0 }); E('rect', { x: 700, y: 90, width: 520, height: 110, rx: 20, fill: '#1a1030', stroke: '#ffcf4a', 'stroke-width': 6 }, lastR); T(lastR, 960, 168, 64, 'LAST ROUND', '#ffcf4a', 900, { 'letter-spacing': 4 });
const real100 = LBL(setFl, 960, 140, 'the real 100%?', '#ffcf4a', 0, 52);
const frameFl = frameOf(setFl);

// ============ SET N: less noise (803) + sweet spot (804) ============
const setN = G(screen, { opacity: 0 });
rgrad('nBg', [[0, '#24306a'], [1, '#0c1030']]);
const camN = G(setN); bg(camN, 'url(#nBg)'); stars(camN, 40);
const brainN = Brain(camN, 160, 200, 1.0);
const front = E('ellipse', { cx: 160 + 140, cy: 200 + 140, rx: 120, ry: 100, fill: '#ff8f4a', opacity: .0, filter: 'url(#glow)' }, camN);
const judgeL = LBL(camN, 420, 120, 'judge & second-guess: quieter', '#ff8fb1', 0, 34);
const noise = E('path', { d: 'M160,820 ' + Array.from({ length: 40 }, (_, i) => `L${160 + i * 14},${820 + ((i * 37) % 9 - 4) * 14}`).join(' '), stroke: '#ff8fb1', 'stroke-width': 6, fill: 'none', opacity: 0 }, camN);
const calm = E('path', { d: 'M160,820 C300,800 440,840 580,820 C640,812 680,820 720,820', stroke: '#7ee081', 'stroke-width': 7, fill: 'none', opacity: 0 }, camN);
const lessL = LBL(camN, 440, 950, 'not more brain. less noise.', '#7ee081', 0, 38);
const chart = G(camN, { opacity: 0 });
E('rect', { x: 1000, y: 160, width: 760, height: 720, rx: 24, fill: 'rgba(255,255,255,.06)', stroke: '#9ff3ff', 'stroke-width': 4 }, chart);
E('path', { d: 'M1060,820 L1720,820 M1060,820 L1060,200', stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round' }, chart);
T(chart, 1390, 870, 30, 'your skill →', '#ffffff', 800); T(chart, 1030, 520, 30, 'challenge →', '#ffffff', 800, { transform: 'rotate(-90 1030 520)' });
const chan = E('path', { d: 'M1060,760 L1080,820 L1720,240 L1700,180 Z', fill: '#7ee081', opacity: 0 }, chart);
const stressZ = G(chart, { opacity: 0 }); E('path', { d: 'M1060,200 L1060,740 L1680,190 Z', fill: '#ff6b6b', opacity: .25 }, stressZ); T(stressZ, 1230, 360, 40, 'stress', '#ff8f8f', 900);
const boredZ = G(chart, { opacity: 0 }); E('path', { d: 'M1100,820 L1720,820 L1720,270 Z', fill: '#9fb3ff', opacity: .25 }, boredZ); T(boredZ, 1560, 700, 40, 'boring', '#9fb3ff', 900);
const flowT = T(chart, 1420, 500, 40, 'flow', '#ffffff', 900, { opacity: 0, transform: 'rotate(-42 1420 500)' });
const dot = E('circle', { cx: 1200, cy: 300, r: 22, fill: '#ffcf4a', stroke: '#fff', 'stroke-width': 5, opacity: 0, filter: 'url(#glow)' }, chart);
const frameN = frameOf(setN);

// ============ SET AR: the arena showdown (805-814) ============
const setAr = G(screen, { opacity: 0 });
rgrad('arBg', [[0, '#2a1e5a'], [1, '#08061a']]);
const camAr = G(setAr); bg(camAr, 'url(#arBg)');
for (let i = 0; i < 4; i++) { const x = 200 + i * 507; const b = E('path', { d: `M${x},-40 L${x - 160},1000 L${x + 160},1000 Z`, fill: '#ffffff', opacity: .06 }, camAr); tl.to(b, { rotation: (i % 2 ? 8 : -8), svgOrigin: `${x} -40`, duration: 3, yoyo: true, repeat: 20, ease: 'sine.inOut' }, i * .4); }
E('ellipse', { cx: 960, cy: 960, rx: 1100, ry: 140, fill: '#3a2a7a' }, camAr);
for (let r = 0; r < 2; r++) for (let i = 0; i < 40; i++) E('circle', { cx: 30 + i * 49 + r * 24, cy: 1000 + r * 40, r: 14, fill: SC[(i + r) % 6], opacity: .5 }, camAr);
// left: Orbi with brain hologram; right: server tower
const orbiAr = OrbiBot(camAr, { x: 340, y: 760, s: 1 });
const holo = Brain(camAr, 190, 280, .5); tl.to(holo.hot, { opacity: .25, duration: 1, yoyo: true, repeat: 30 }, 0);
const rack = G(camAr); E('rect', { x: 1440, y: 300, width: 300, height: 600, rx: 20, fill: '#2a3448', stroke: '#9ff3ff', 'stroke-width': 6 }, rack);
const leds = []; for (let k = 0; k < 10; k++) { E('rect', { x: 1470, y: 330 + k * 56, width: 240, height: 40, rx: 8, fill: '#1a2232' }, rack); for (let j = 0; j < 4; j++) { const l = E('circle', { cx: 1500 + j * 30, cy: 350 + k * 56, r: 6, fill: SC[(k + j) % 6] }, rack); leds.push(l); } }
leds.forEach((l, i) => tl.to(l, { opacity: .2, duration: .15, yoyo: true, repeat: 60, ease: 'none' }, (i % 7) * .09));
// scoreboard
const sb = G(camAr); E('rect', { x: 700, y: 40, width: 520, height: 130, rx: 24, fill: '#14243a', stroke: '#ffcf4a', 'stroke-width': 6 }, sb);
T(sb, 800, 84, 26, 'YOU', '#9ff3ff', 900); T(sb, 1120, 84, 26, 'MACHINE', '#ff8fb1', 900);
const sY = T(sb, 800, 150, 60, '0', '#ffffff', 900), sM = T(sb, 1120, 150, 60, '0', '#ffffff', 900); T(sb, 960, 145, 50, ':', '#ffffff', 900);
const yScore = [0, 0, 0, 1, 2, 3], mScore = [0, 1, 2, 2, 2, 2];
const roundCard = (n, title) => { const g = card(camAr, 960, 520, 820, 560, '#ffffff'); T(g, 960, 290, 30, 'ROUND ' + n, '#9aa9b8', 900); T(g, 960, 345, 46, title, INK, 900); return g; };
const R1 = roundCard(1, 'speed'); { T(R1, 760, 470, 34, 'chip', INK, 800); T(R1, 760, 540, 40, 'billions / s', '#ff4d8a', 900); T(R1, 1160, 470, 34, 'neuron', INK, 800); T(R1, 1160, 540, 40, '≤ few hundred / s', '#2a7ab0', 900); }
const R1bar = E('rect', { x: 600, y: 600, width: 0, height: 40, rx: 12, fill: '#ff8fb1' }, R1); const R1b2 = E('rect', { x: 1060, y: 600, width: 0, height: 40, rx: 12, fill: '#9ff3ff' }, R1);
const R2 = roundCard(2, 'knowledge'); { for (let k = 0; k < 14; k++) E('rect', { x: 620 + (k % 2) * 10, y: 650 - k * 22, width: 200, height: 20, rx: 4, fill: SC[k % 6], stroke: INK, 'stroke-width': 3 }, R2); T(R2, 760, 690, 28, 'trillions of words', '#ff4d8a', 900); T(R2, 1160, 520, 80, '⌛', '#9aa9b8', 900); T(R2, 1160, 600, 30, 'thousands of lifetimes', '#2a7ab0', 900); }
const R3 = roundCard(3, 'raw power'); { T(R3, 760, 450, 32, 'LineShine (China)', INK, 800); T(R3, 760, 520, 40, '≈ 2 quintillion / s', '#ff4d8a', 900); T(R3, 1160, 450, 32, 'your brain', INK, 800); const q = T(R3, 1160, 520, 40, '? (estimate)', '#2a7ab0', 900); }
const sameL = LBL(camAr, 960, 750, 'NIST estimate: same league', '#ffcf4a', 0, 34);
const R3b = G(camAr, { opacity: 0 }); { E('rect', { x: 560, y: 820, width: 800, height: 0, fill: 'none' }, R3b); }
const pw = card(camAr, 960, 520, 820, 560, '#ffffff'); T(pw, 960, 290, 30, 'the power bill', '#9aa9b8', 900);
const pwBig = E('rect', { x: 620, y: 360, width: 160, height: 0, rx: 10, fill: '#ff8fb1', stroke: INK, 'stroke-width': 4 }, pw); T(pw, 700, 740, 30, '≈ 42 MW', INK, 900);
const pwSmall = E('rect', { x: 1140, y: 700, width: 160, height: 0, rx: 4, fill: '#9ff3ff', stroke: INK, 'stroke-width': 4 }, pw); T(pw, 1220, 740, 30, '20 W', INK, 900);
const bulbS = Bulb(pw, 1220, 540, .45);
const twoM = LBL(camAr, 960, 860, '≈ 2,000,000× less', '#7ee081', 0, 44);
const R4 = roundCard(4, 'learning'); { const gir = (x, y, s, o = 1) => { const g = G(R4, { transform: `translate(${x},${y}) scale(${s})`, opacity: o }); E('path', { d: 'M-30,40 L-30,-10 L-20,-90 L0,-90 L5,-20 L40,-10 L40,40', fill: '#ffcf4a', stroke: INK, 'stroke-width': 5 }, g); for (const [a, b] of [[-15, -60], [-20, 10], [20, 5]]) E('circle', { cx: a, cy: b, r: 8, fill: '#c98a3a' }, g); return g; }; gir(760, 560, 1.4); T(R4, 760, 690, 28, 'child: 1 example', '#2a7ab0', 900); for (let k = 0; k < 12; k++) gir(1060 + (k % 4) * 70, 440 + Math.floor(k / 4) * 90, .5, .8); T(R4, 1160, 690, 28, 'AI: huge piles', '#ff4d8a', 900); }
const R5 = roundCard(5, 'the real world'); { const ico = (x, t) => { T(R5, x, 560, 30, t, INK, 800); }; E('rect', { x: 600, y: 420, width: 120, height: 90, rx: 10, fill: '#9fb3ff', stroke: INK, 'stroke-width': 4 }, R5); ico(660, 'laundry'); for (let k = 0; k < 4; k++) E('rect', { x: 880 + k * 40, y: 500 - k * 30, width: 40, height: 30 + k * 30, fill: '#c6d3e6', stroke: INK, 'stroke-width': 3 }, R5); ico(960, 'stairs'); E('path', { d: 'M1220,420 L1300,420 L1285,510 L1235,510 Z', fill: '#e8f8ff', stroke: INK, 'stroke-width': 4 }, R5); ico(1260, 'catching a glass'); T(R5, 960, 660, 30, 'easy for you · still hard for robots', '#2a7ab0', 900); }
const chessC = card(camAr, 960, 520, 900, 580, '#ffffff');
{ T(chessC, 960, 290, 30, 'chess, 2005: humans + computers', '#9aa9b8', 900); for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) E('rect', { x: 820 + c * 46, y: 340 + r * 46, width: 46, height: 46, fill: (r + c) % 2 ? '#8a5530' : '#f6e2c0' }, chessC);
  T(chessC, 890, 420, 60, '♞', INK, 900); T(chessC, 1030, 500, 60, '♛', INK, 900);
  for (const x of [660, 1260]) { E('rect', { x: x - 70, y: 520, width: 140, height: 90, rx: 8, fill: '#2a3448', stroke: INK, 'stroke-width': 4 }, chessC); E('rect', { x: x - 58, y: 530, width: 116, height: 66, rx: 4, fill: '#9fe0ff' }, chessC); E('circle', { cx: x, cy: 440, r: 40, fill: '#f2c29b', stroke: INK, 'stroke-width': 5 }, chessC); } T(chessC, 960, 720, 30, 'winners: two amateurs with ordinary computers', '#2a7ab0', 900); }
const trophy = G(camAr, { opacity: 0 }); E('path', { d: 'M900,140 L1020,140 L1010,220 C1000,260 920,260 910,220 Z', fill: '#ffcf4a', stroke: INK, 'stroke-width': 5 }, trophy); E('rect', { x: 935, y: 255, width: 50, height: 30, fill: '#ffb547', stroke: INK, 'stroke-width': 4 }, trophy);
const gmX = LBL(camAr, 960, 860, 'not grandmasters', '#ff8fb1', 0, 34);
const both = G(camAr, { opacity: 0 }); { const b = Brain(both, 560, 420, .45); E('rect', { x: 1140, y: 420, width: 180, height: 180, rx: 20, fill: '#2a3448', stroke: '#9ff3ff', 'stroke-width': 6 }, both); for (let k = 0; k < 6; k++) { E('path', { d: `M${1160 + k * 28},420 L${1160 + k * 28},390 M${1160 + k * 28},600 L${1160 + k * 28},630`, stroke: '#9ff3ff', 'stroke-width': 5 }, both); } T(both, 960, 560, 110, '+', '#ffcf4a', 900); }
const bothL = LBL(camAr, 960, 800, 'what you do with both', '#ffcf4a', 0, 44);
const frameAr = frameOf(setAr);

// ============ SET E: ending meadow (818-821) ============
const setE = G(screen, { opacity: 0 });
grad('eSky', [[0, '#3fa4e8'], [.6, '#a8e4f6'], [1, '#ffe8c8']]);
const camE = G(setE); bg(camE, 'url(#eSky)');
for (let i = 0; i < 4; i++) { const cx = 200 + i * 520, cy = 140 + (i % 2) * 70; const c = G(camE, { opacity: .9 }); [[0, 0, 70], [60, 10, 55], [-60, 14, 50], [20, -30, 50]].forEach(([dx, dy, r]) => E('circle', { cx: cx + dx, cy: cy + dy, r, fill: '#fff' }, c)); tl.to(c, { x: 140, duration: 40, ease: 'none' }, 0); }
E('path', { d: 'M-200,760 C300,700 900,740 1400,710 C1700,694 1900,720 2120,700 L2120,1300 L-200,1300 Z', fill: '#7ee081' }, camE);
E('path', { d: 'M-200,840 C400,810 1000,830 1500,800 C1800,790 1950,805 2120,795 L2120,1300 L-200,1300 Z', fill: '#57c48a' }, camE);
for (let i = 0; i < 30; i++) { const x = (i * 131) % 1920, y = 860 + (i * 47) % 180; const f = E('circle', { cx: x, cy: y, r: 8, fill: SC[i % 6] }, camE); tl.to(f, { y: -6, duration: 1.2 + (i % 4) * .3, yoyo: true, repeat: 20, ease: 'sine.inOut' }, i * .07); }
const orbiE = OrbiBot(camE, { x: 960, y: 700, s: 1.1 });
const bulbE = Bulb(camE, 1460, 420, 1.1);
const featL = LBL(camE, 960, 140, 'power-saving mode = the feature', '#ffcf4a', 0, 44);
const tips = [['good sleep', '#9fb3ff'], ['real challenges', '#ffcf4a'], ['less noise', '#7ee081']].map(([t, c], i) => LBL(camE, 420 + i * 540, 280, t, c, 0, 40));
const realL = LBL(camE, 960, 1000, 'your real 100%', '#ff8fb1', 0, 48);
const qDials = G(camE, { opacity: 0 }); { E('rect', { x: 460, y: 240, width: 1000, height: 220, rx: 30, fill: 'rgba(255,255,255,.85)', stroke: INK, 'stroke-width': 6 }, qDials); ['SENSES', 'MEMORY', 'SPEED', 'BODY', 'LEARNING'].forEach((n, i) => { const x = 560 + i * 200; E('circle', { cx: x, cy: 330, r: 46, fill: ['#5fe8d0', '#ffb547', '#ff8fb1', '#9fb3ff', '#7ee081'][i], stroke: INK, 'stroke-width': 5 }, qDials); E('path', { d: `M${x},330 L${x + 20},300`, stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, qDials); T(qDials, x, 420, 24, n, INK, 900); }); }
const qT = T(camE, 960, 560, 60, 'which one first?', '#ffffff', 900, { opacity: 0, stroke: INK, 'stroke-width': 8, 'paint-order': 'stroke' });
const outro = G(screen, { opacity: 0 });
rgrad('oBg', [[0, '#3fb6e8'], [1, '#14306a']]);
E('rect', { width: 1920, height: 1080, fill: 'url(#oBg)' }, outro); stars(outro, 60);
const ring = E('ellipse', { cx: 960, cy: 470, rx: 260, ry: 90, fill: 'none', stroke: '#ffcf4a', 'stroke-width': 10, transform: 'rotate(-14 960 470)' }, outro);
E('circle', { cx: 960, cy: 470, r: 120, fill: '#9ff3ff', stroke: '#ffffff', 'stroke-width': 8 }, outro); E('circle', { cx: 920, cy: 430, r: 34, fill: '#ffffff', opacity: .6 }, outro);
const sat = E('circle', { cx: 1220, cy: 405, r: 22, fill: '#ffcf4a', stroke: '#fff', 'stroke-width': 4 }, outro);
T(outro, 960, 720, 90, 'MINDSPHERE', 'url(#tTxt)', 900, { stroke: '#fff7d6', 'stroke-width': 4, 'paint-order': 'stroke', 'letter-spacing': 6 });
T(outro, 960, 810, 42, 'see you on the next orbit', '#ffffff', 700);
const frameE = frameOf(setE);

// ============ SET P: control panel (815-817) ============
@@PANEL@@
@@ICONS@@
const okMk = (x) => { const g = G(camP, { opacity: 0 }); E('circle', { cx: x, cy: 420, r: 34, fill: '#3fbf6a', stroke: '#fff', 'stroke-width': 5 }, g); E('path', { d: `M${x - 16},420 L${x - 4},432 L${x + 18},408`, stroke: '#fff', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g); return g; };
const redP = E('rect', { x: -200, y: -200, width: 2320, height: 1480, fill: '#ff3a2a', opacity: 0 }, camP);
const warn = G(camP, { opacity: 0 }); E('path', { d: 'M960,120 L1060,290 L860,290 Z', fill: '#ffcf4a', stroke: INK, 'stroke-width': 7, 'stroke-linejoin': 'round' }, warn); T(warn, 960, 270, 90, '!', INK, 900);
const energy = card(camP, 360, 520, 420, 420, '#ffffff'); T(energy, 360, 360, 28, 'energy', '#9aa9b8', 900);
E('rect', { x: 230, y: 400, width: 100, height: 300, rx: 12, fill: '#e8eef5', stroke: INK, 'stroke-width': 4 }, energy); const needB = E('rect', { x: 230, y: 700, width: 100, height: 0, rx: 12, fill: '#ff6b6b' }, energy); T(energy, 280, 740, 24, 'needed', INK, 800);
E('rect', { x: 390, y: 400, width: 100, height: 300, rx: 12, fill: '#e8eef5', stroke: INK, 'stroke-width': 4 }, energy); E('rect', { x: 390, y: 580, width: 100, height: 120, rx: 12, fill: '#7ee081' }, energy); T(energy, 440, 740, 24, 'available', INK, 800);
const offL = LBL(camP, 1280, 980, 'knows what to switch off', '#7ee081', 0, 40);
const frameP = frameOf(setP);

// ======================= TIMELINE =======================
// 851-857: the epic fight -> flow
tl.fromTo(cam, camC(1.35, 960, 700), { ...camC(1, 960, 700), duration: 3.2, ease: 'power2.inOut', immediateRender: false }, 0);
fA.bounce(0, W('852', 'crowd')); fB.bounce(.2, W('852', 'crowd'));
tl.to(ropeEls, { opacity: 1, duration: .2, yoyo: true, repeat: 1 }, WA('851', ['-ring', 'ring'])); sfx('whoosh', WA('851', ['-ring', 'ring']), .4);
tl.fromTo(fA.g, { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: false }, W('851', 'two') - .1); tl.fromTo(fB.g, { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: false }, W('851', 'fighters') - .2); sfx('impact', W('851', 'fighters'), .4);
tl.fromTo(lastR, { opacity: 0, scale: 1.6, svgOrigin: '960 145' }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)', immediateRender: false }, W('851', 'last')); sfx('ding', W('851', 'last'), .6);
tl.to(lastR, { opacity: 0, duration: .3 }, W('852', 'crowd') + .4);
// 852: fast exchange at full speed
const tX = W('852', 'crowd') - .1;
fA.step(tX, 40, .2); fA.go(tX + .2, 'jab'); fB.go(tX + .22, 'slip', .12, .2); fB.go(tX + .55, 'cross'); fA.go(tX + .58, 'duck', .12, .25);
fA.go(tX + .95, 'cross'); hitAt(tX + 1.07, 1010, 560); fB.go(tX + 1.05, 'hit', .1, .3);
fB.step(tX + 1.4, -30, .25); fB.go(tX + 1.7, 'jab'); fA.go(tX + 1.72, 'slip', .1, .2);
tl.to(sLines, { opacity: .5, duration: .1, yoyo: true, repeat: 3 }, tX + .9);
fA.pose(W('852', 'heavy') - .2, 'tired', .5, 'power2.out'); camTo(W('852', 'arms') - .3, 1.12, 800, 600, 1.2, 'power2.out');
sweat.forEach((d, i) => tl.fromTo(d, { opacity: .9, x: 0, y: 0 }, { x: -40 - i * 8, y: -30 + i * 6, opacity: 0, duration: .5, ease: 'power2.out', immediateRender: false }, W('852', 'breath') + i * .02));
fB.go(W('852', 'burns') - .2, 'jab', .16, .3); fA.go(W('852', 'burns') - .15, 'duck', .14, .3);
// 853: the shift -> slow motion (same moves, ten times longer)
const tS = W('853', 'shifts') - .2;
tl.to(slowTint, { opacity: .35, duration: 1 }, tS); tl.to(vig, { opacity: 1, duration: 1 }, tS); sfx('rumble', tS, .5);
camTo(tS - .3, 1.05, 960, 600, .8);
fB.pose(tS, 'kick', 3.2, 'sine.inOut'); fA.pose(tS + .4, 'duck', 2.6, 'sine.inOut');
dust.forEach((d, i) => { tl.to(d, { opacity: .8, duration: .6 }, tS + i * .03); tl.to(d, { y: -40 - (i % 5) * 10, x: (i % 2 ? 20 : -20), duration: 10, ease: 'none' }, tS); });
sweat.forEach((d, i) => tl.fromTo(d, { opacity: .9, x: 0, y: 0 }, { x: 60 + i * 12, y: -20 + i * 4, duration: 9, ease: 'none', immediateRender: false }, tS + .3));
// 854: noise fades, crowd disappears, zoom in on your face
tl.to(crowd, { opacity: 0, duration: 1.4 }, W('854', 'crowd') - .2); tl.to(spots, { opacity: .2, duration: 1.4 }, W('854', 'crowd'));
tl.to(blurG, { attr: { stdDeviation: 7 }, duration: 1.6 }, W('854', 'noise'));
tl.to(cam, { s: 2.5, cx: 700, cy: 440, duration: 3.2, ease: 'power2.inOut' }, W('854', 'fades'));
tl.to(fA.st, { head: 4, duration: 2 }, W('854', 'time'));
// 855: thoughts dissolve, calm eyes, then snap
thoughts.forEach((g, i) => { tl.fromTo(g, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, [W('855', 'winning'), W('855', 'worrying')][i] - .2); tl.to(g, { opacity: 0, y: -30, scale: .8, svgOrigin: `${560 + i * 800} 230`, duration: .8 }, [W('855', 'winning'), W('855', 'thinks')][i] + .5); });
const tSnap = W('855', 'happens');
tl.to(fB.st, { ...{ lean: 6, y: -230, bt: 18, bs: 6, ft: -22, fs: 14, bu: -40, bf: -120, fu: -62, ff: -104, head: 0 }, duration: .4 }, tSnap - .5);
tl.to(fA.st, { lean: 6, y: -230, bt: 18, bs: 6, ft: -22, fs: 14, bu: -40, bf: -120, fu: -62, ff: -104, head: 0, duration: .4 }, tSnap - .5);
tl.to(cam, { s: 1, cx: 960, cy: 540, duration: .35, ease: 'power4.in' }, tSnap); tl.to(flash, { opacity: .8, duration: .06, yoyo: true, repeat: 1 }, tSnap + .33);
tl.to([slowTint, vig], { opacity: 0, duration: .3 }, tSnap + .3); tl.to(blurG, { attr: { stdDeviation: 0 }, duration: .3 }, tSnap + .3); tl.to(crowd, { opacity: 1, duration: .3 }, tSnap + .3); tl.to(spots, { opacity: .9, duration: .3 }, tSnap + .3); sfx('whoosh', tSnap, .7);
// 856: flow fight, fast and clean
const tF = tSnap + .45;
fB.go(tF, 'cross'); fA.go(tF + .02, 'slip', .1, .2);
fA.go(tF + .3, 'jab'); hitAt(tF + .42, 1010, 560); fB.go(tF + .4, 'hit', .08, .25);
fA.go(tF + .62, 'cross'); hitAt(tF + .74, 1020, 570); fB.go(tF + .72, 'hit', .08, .25);
fA.go(tF + 1.0, 'kick', .16, .3); hitAt(tF + 1.14, 1040, 700, true); fB.go(tF + 1.12, 'hit', .1, .35); fB.step(tF + 1.12, -60, .3);
tl.to(sLines, { opacity: .7, duration: .1, yoyo: true, repeat: 5 }, tF + .3);
tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: .08, yoyo: true, repeat: 5, immediateRender: false }, tF + .4);
tl.fromTo(wFlow, { opacity: 0, scale: 1.8, svgOrigin: '960 260' }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)', immediateRender: false }, W('856', 'flow') - .05); sfx('impact', W('856', 'flow'), .6);
tl.to(wFlow, { opacity: 0, duration: .2 }, W('856', 'athletes') - .1);
fB.go(W('856', 'athletes') - .1, 'jab'); fA.go(W('856', 'athletes') - .08, 'duck', .1, .25); fA.go(W('856', 'call', 1) - .1, 'upper', .14, .3); hitAt(W('856', 'call', 1) + .03, 1000, 480, true); fB.go(W('856', 'call', 1), 'hit', .1, .4);
tl.fromTo(wZone, { opacity: 0, scale: 1.8, svgOrigin: '960 260' }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)', immediateRender: false }, W('856', 'zone') - .05); sfx('impact', W('856', 'zone'), .6);
// 857: freeze on the question
tl.to(wZone, { opacity: 0, duration: .3 }, OFF['857'] - .2);
fA.pose(OFF['857'] - .2, 'guard', .4); fB.pose(OFF['857'] - .2, 'guard', .4);
camTo(OFF['857'], 1.15, 960, 620, 4, 'power1.inOut');
showLbl(real100, W('857', 'real')); tl.to(slowTint, { opacity: .15, duration: .6 }, W('857', 'maybe'));
fA.bounce(OFF['857'], OFF['857'] + LDUR['857'] + .5); fB.bounce(OFF['857'] + .2, OFF['857'] + LDUR['857'] + .5);

// 803-804: less noise, sweet spot
const tN = OFF['803'] - .4;
slide(setFl, setN, tN, 1, frameFl, frameN);
tl.to(noise, { opacity: 1, duration: .2 }, tN + .6);
tl.to(front, { opacity: .6, duration: .3 }, W('803', 'judge') - .2); showLbl(judgeL, W('803', 'judge'));
tl.to(front, { opacity: .05, duration: 1 }, W('803', 'quiet') - .2); tl.to(brainN.dim, { opacity: .0, duration: .1 }, W('803', 'quiet'));
tl.to(noise, { opacity: 0, duration: .5 }, W('803', 'less')); tl.to(calm, { opacity: 1, duration: .5 }, W('803', 'less')); showLbl(lessL, W('803', 'noise'));
tl.to(chart, { opacity: 1, duration: .4 }, OFF['804'] - .2);
tl.to(chan, { opacity: .35, duration: .4 }, W('804', 'harder'));
tl.to(boredZ, { opacity: 1, duration: .3 }, W('804', 'boring') - .1); tl.to(stressZ, { opacity: 1, duration: .3 }, W('804', 'stress') - .1);
tl.to(dot, { opacity: 1, duration: .1 }, W('804', 'boring') - .2); tl.to(dot, { attr: { cx: 1620, cy: 760 }, duration: .5 }, W('804', 'boring') - .1); tl.to(dot, { attr: { cx: 1140, cy: 260 }, duration: .6 }, W('804', 'stress') - .1);
tl.to(dot, { attr: { cx: 1400, cy: 500 }, duration: .6, ease: 'back.out(2)' }, W('804', 'between')); tl.to(flowT, { opacity: 1, duration: .3 }, W('804', 'sweet')); sfx('chime', W('804', 'sweet'), .5);
// 805-814: the arena
const tAr = OFF['805'] - .4;
slide(setN, setAr, tAr, 1, frameN, frameAr);
tl.fromTo(camAr, { scale: 1.15 }, { scale: 1, svgOrigin: '960 540', duration: 3, ease: 'power2.out', immediateRender: false }, tAr + .3);
orbiAr.idle(tl, tAr, 60); orbiAr.face(tl, W('805', 'best'), 'happy'); orbiAr.pose(tl, W('805', 'best'), 'thumbs'); sfx('impact', W('805', 'machines'), .5);
const score = (k, t, who) => { tl.set(sY, { textContent: String(yScore[k]) }, t); tl.set(sM, { textContent: String(mScore[k]) }, t); tl.fromTo(who === 'y' ? sY : sM, { scale: 1.8, svgOrigin: who === 'y' ? '800 130' : '1120 130' }, { scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, t); sfx('ding', t, .5); };
const rounds = [[R1, '806'], [R2, '807'], [R3, '808']];
pop(R1, W('806', 'round') - .1, 960, 520);
tl.to(R1bar, { attr: { width: 320 }, duration: .6 }, W('806', 'billions')); tl.to(R1b2, { attr: { width: 30 }, duration: .4 }, W('806', 'hundred'));
score(1, W('806', 'machine'), 'm'); orbiAr.pose(tl, W('806', 'machine'), 'shrug');
tl.to(R1, { opacity: 0, duration: .25 }, OFF['807'] - .2); pop(R2, W('807', 'knowledge') - .7, 960, 520);
score(2, W('807', 'machine'), 'm'); orbiAr.face(tl, W('807', 'lifetimes'), 'wow');
tl.to(R2, { opacity: 0, duration: .25 }, OFF['808'] - .2); pop(R3, W('808', 'round') - .1, 960, 520); sfx('zap', W('808', 'line'), .4);
orbiAr.face(tl, W('808', 'brain'), 'think'); showLbl(sameL, W('808', 'league') - .3);
tl.to([R3, sameL], { opacity: 0, duration: .25 }, OFF['809'] - .2); pop(pw, W('809', 'bill') - .2, 960, 520);
tl.to(pwBig, { attr: { y: 360 - 0, height: 340 }, duration: .8, ease: 'power2.out' }, WA('809', ['42', 'forty']) - .2);
tl.to(pwSmall, { attr: { y: 699, height: 1 }, duration: .3 }, WA('809', ['20', 'twenty']) - .1); tl.to([bulbS.halo, bulbS.rays], { opacity: 1, duration: .3 }, WA('809', ['20', 'twenty']));
showLbl(twoM, W('809', 'million') - .2); score(3, W('809', 'point') + .2, 'y'); orbiAr.pose(tl, W('809', 'point'), 'thumbs'); orbiAr.face(tl, W('809', 'point'), 'happy');
tl.to([pw, twoM], { opacity: 0, duration: .25 }, OFF['810'] - .2); pop(R4, W('810', 'round') - .1, 960, 520);
score(4, W('810', 'point') + .2, 'y');
tl.to(R4, { opacity: 0, duration: .25 }, OFF['811'] - .2); pop(R5, W('811', 'round') - .1, 960, 520);
tl.to(rack, { rotation: 3, svgOrigin: '1590 900', duration: .2, yoyo: true, repeat: 3 }, W('811', 'robots')); score(5, W('811', 'point') + .2, 'y'); orbiAr.pose(tl, W('811', 'point'), 'count');
tl.to(R5, { opacity: 0, duration: .25 }, OFF['812'] - .2);
tl.fromTo(sb, { scale: 1 }, { scale: 1.25, svgOrigin: '960 105', duration: .4, yoyo: true, repeat: 1, immediateRender: false }, WA('812', ['3', 'three'])); orbiAr.face(tl, WA('812', ['3', 'three']), 'happy');
pop(chessC, W('812', 'chess') - .2, 960, 520); sfx('pop', W('812', 'chess'), .4);
showLbl(gmX, W('813', 'grandmasters')); pop(trophy, W('813', 'amateur') - .1, 960, 200); sfx('chime', W('813', 'amateur'), .5);
tl.to([chessC, gmX, trophy], { opacity: 0, duration: .3 }, OFF['814'] - .2);
pop(both, W('814', 'brain') - .1, 960, 520); showLbl(bothL, W('814', 'both'));
// 815-817: every dial at max
const tP = OFF['815'] - .4;
slide(setAr, setP, tP, -1, frameAr, frameP);
for (let i = 0; i < 5; i++) lvl(i, tP + .3, .5, .3);
['eye', 'mem', 'bolt', 'body', 'learn'].forEach((k, i) => pop(icons[k], tP + .3, 880 + i * 200, 250));
orbiP.idle(tl, tP, 30);
for (let i = 0; i < 5; i++) { lvl(i, W('815', 'way') + i * .12, 1, .4); tl.to(colGlow[i], { opacity: .8, duration: .2 }, W('815', 'way') + i * .12); }
sfx('zap', W('815', 'once'), .6); orbiP.face(tl, W('815', 'once'), 'wow');
tl.to(redP, { opacity: .25, duration: .5 }, W('816', 'senses')); pop(warn, W('816', 'senses'), 960, 220);
tl.to(camP, { x: 8, duration: .06, yoyo: true, repeat: 30 }, W('816', 'senses')); sfx('rumble', W('816', 'senses'), .5);
pop(energy, W('816', 'energy') - .4, 360, 520); tl.to(needB, { attr: { y: 360, height: 340 }, duration: .8 }, W('816', 'energy')); sfx('beep', W('816', 'deliver'), .5);
orbiP.pose(tl, W('816', 'overheating'), 'shrug');
tl.to([redP, warn, energy], { opacity: 0, duration: .4 }, OFF['817'] - .2);
const tOff = W('817', 'off') - .6;
[.62, .35, .5, .2, .7].forEach((f, i) => { lvl(i, tOff + i * .1, f, .6, 'power2.inOut'); tl.to(colGlow[i], { opacity: f > .55 ? .6 : 0, duration: .3 }, tOff + i * .1); });
showLbl(offL, W('817', 'off')); orbiP.face(tl, W('817', 'off'), 'happy'); orbiP.pose(tl, W('817', 'off'), 'thumbs');
// 818-821: ending
const tE = OFF['818'] - .4;
slide(setP, setE, tE, 1, frameP, frameE);
orbiE.idle(tl, tE, 40); orbiE.face(tl, tE, 'happy');
tl.to([bulbE.halo, bulbE.rays], { opacity: 1, duration: .6 }, tE + .5);
showLbl(featL, W('818', 'feature') - .2);
tl.to(featL, { opacity: 0, duration: .3 }, OFF['819'] - .2);
showLbl(tips[0], W('819', 'sleep') - .1); showLbl(tips[1], W('819', 'challenges') - .1); showLbl(tips[2], W('819', 'noise') - .1);
showLbl(realL, W('819', 'real')); orbiE.pose(tl, W('819', 'real'), 'thumbs');
tl.to(tips.concat([realL]), { opacity: 0, duration: .3 }, OFF['820'] - .2);
pop(qDials, OFF['820'] + .1, 960, 340); tl.to(qT, { opacity: 1, duration: .3 }, W('820', 'first') - .2); orbiE.pose(tl, W('820', 'dial'), 'think'); orbiE.face(tl, W('820', 'dial'), 'think');
tl.to([qDials, qT], { opacity: 0, duration: .3 }, OFF['821'] - .1);
orbiE.face(tl, W('821', 'bulb') - .3, 'happy'); orbiE.pose(tl, W('821', 'bulb') - .3, 'pointUp');
tl.fromTo(bulbE.g, { scale: 1 }, { scale: 1.12, svgOrigin: '1460 420', duration: .4, yoyo: true, repeat: 1, immediateRender: false }, W('821', 'bulb'));
orbiE.pose(tl, W('821', 'see'), 'wave');
const tO = OFF['821'] + LDUR['821'] - .9;
enter(setE, outro, tO); tl.to(sat, { rotation: 360, svgOrigin: '960 470', duration: 4, ease: 'none' }, tO); sfx('chime', tO, .6);
END = tO + 4; tl.to(flash, { opacity: 0, duration: .01 }, END);
window.SFX = SFX; window.DURATION = END; window.OFFS = OFF;
window.seek = t => { tl.seek(t, false); drawRigs(); drawFighters(); };
window.seek(0);
</script></body></html>

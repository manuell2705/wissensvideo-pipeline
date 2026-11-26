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
const fighters = G(camFl);
const fA = Fighter(fighters, 760, false, { skin: '#e8b48a', skinD: '#c99670', top: '#2fb3a8', shorts: '#1d3a6a', shortsD: '#16305a', glove: '#ff4d5e', gloveD: '#c93040', helm: '#ff4d5e', guard: '#9ff3ff' });
const fB = Fighter(fighters, 1160, true, { skin: '#8d5a3b', skinD: '#6e4430', top: '#ff8a4a', shorts: '#3a2a5a', shortsD: '#2a1f48', glove: '#3a7aff', gloveD: '#2a5ad0', helm: '#3a7aff', guard: '#ffcf4a' });
// camera without svgOrigin drift: (cx,cy) is the world point shown at screen centre
const cam = { s: 1, cx: 960, cy: 540 };
const drawCam = () => camFl.setAttribute('transform', `translate(960 540) scale(${cam.s.toFixed(4)}) translate(${(-cam.cx).toFixed(2)} ${(-cam.cy).toFixed(2)})`);
const camC = (s, ox, oy) => ({ s, cx: ox + (960 - ox) / s, cy: oy + (540 - oy) / s });
const camTo = (t, s, ox, oy, d, ease) => tl.to(cam, { ...camC(s, ox, oy), duration: d, ease: ease || 'power2.inOut' }, t);
const drawFighters = () => { FIGHTERS.forEach(f => f.draw()); drawCam(); };
// impact bursts + speed lines + sweat
const burst = (x, y) => { const b = G(camFl, { opacity: 0 }); E('path', { d: `M${x},${y - 60} L${x + 16},${y - 16} L${x + 60},${y - 10} L${x + 22},${y + 12} L${x + 34},${y + 56} L${x},${y + 26} L${x - 34},${y + 56} L${x - 22},${y + 12} L${x - 60},${y - 10} L${x - 16},${y - 16} Z`, fill: '#fff6a8', stroke: '#ffffff', 'stroke-width': 4, filter: 'url(#glow)' }, b); return b; };
const hitAt = (t, x, y, big = false) => { const b = burst(x, y); tl.fromTo(b, { opacity: 1, scale: .3, svgOrigin: `${x} ${y}` }, { scale: big ? 1.6 : 1.1, opacity: 0, duration: .32, ease: 'power2.out', immediateRender: false }, t); sfx('impact', t, big ? .7 : .45); };
const sLines = G(camFl, { opacity: 0 }); for (let k = 0; k < 18; k++) { const a = k * Math.PI / 9; E('path', { d: `M${960 + Math.cos(a) * 420},${560 + Math.sin(a) * 300} L${960 + Math.cos(a) * 1200},${560 + Math.sin(a) * 900}`, stroke: '#ffffff', 'stroke-width': 6, opacity: .6 }, sLines); }
const sweat = []; for (let k = 0; k < 10; k++) { const d = E('ellipse', { cx: 830 + (k % 5) * 14, cy: 560 - (k % 3) * 10, rx: 5, ry: 7, fill: '#bfefff', stroke: '#ffffff', 'stroke-width': 2, opacity: 0 }, camFl); sweat.push(d); }
const dust = []; for (let k = 0; k < 30; k++) { const d = E('circle', { cx: 300 + (k * 211) % 1320, cy: 400 + (k * 137) % 500, r: 2 + k % 3, fill: '#fff4c0', opacity: 0 }, camFl); dust.push(d); }
// slow-mo grade, vignette, thought bubbles, big words
const slowTint = E('rect', { x: -400, y: -400, width: 2720, height: 1900, fill: '#2a4aa0', opacity: 0, 'mix-blend-mode': 'multiply' }, camFl);
{ const g = E('radialGradient', { id: 'vig', cx: '50%', cy: '50%', r: '70%' }, defs); [[.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.75)']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, g)); }
const vig = E('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'url(#vig)', opacity: 0 }, setFl);
const thoughts = ['win?', 'what do they think?'].map((t, i) => { const g = G(setFl, { opacity: 0 }); const x = 560 + i * 800, y = 220 + i * 40; E('rect', { x: x - 210, y: y - 46, width: 420, height: 86, rx: 43, fill: 'rgba(255,255,255,.85)', stroke: '#1d3a4a', 'stroke-width': 4 }, g); T(g, x, y + 10, 34, t, '#9aa9b8', 800); return g; });
const bigWord = (txt, y, col) => { const g = G(setFl, { opacity: 0 }); for (let k = 10; k > 0; k -= 2) T(g, 960 + k, y + k, 150, txt, '#1a1030', 900); T(g, 960, y, 150, txt, col, 900, { stroke: '#fff7d6', 'stroke-width': 5, 'paint-order': 'stroke' }); return g; };
const wFlow = bigWord('FLOW', 300, 'url(#tTxt)'), wZone = bigWord('THE ZONE', 300, 'url(#tTxt)');
const lastR = G(setFl, { opacity: 0 }); E('rect', { x: 700, y: 90, width: 520, height: 110, rx: 20, fill: '#1a1030', stroke: '#ffcf4a', 'stroke-width': 6 }, lastR); T(lastR, 960, 168, 64, 'LAST ROUND', '#ffcf4a', 900, { 'letter-spacing': 4 });
const real100 = LBL(setFl, 960, 140, 'the real 100%?', '#ffcf4a', 0, 52);
const frameFl = frameOf(setFl);

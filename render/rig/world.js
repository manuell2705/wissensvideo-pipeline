// Rich layered vector world (procedural): sky, far mountains, glass towers, mid trees, lake, foreground leaves.
// Each layer is its own group so the camera can move them at different speeds (parallax depth).
function World(svg, o = {}) {
  let sd = o.seed || 11; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  const defs = E('defs', {}, svg);
  const grad = (id, stops, v = true) => { const g = E('linearGradient', { id, x1: 0, y1: 0, x2: v ? 0 : 1, y2: v ? 1 : 0 }, defs);
    stops.forEach(([o, c, a = 1]) => E('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g)); };
  grad('wSky', [[0, '#2fd3e6'], [.55, '#8ff0e0'], [1, '#e9fff4']]);
  grad('wRay', [[0, '#ffffff', .55], [1, '#ffffff', 0]]);
  grad('wLake', [[0, '#5fe1e6'], [1, '#1d8fb0']]);
  grad('wGlass', [[0, '#e6fbff'], [.5, '#9fe3f0'], [1, '#5bb6d6']]);
  const blur = E('filter', { id: 'wBlur' }, defs); E('feGaussianBlur', { stdDeviation: 3 }, blur);
  const soft = E('filter', { id: 'wSoft', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); E('feGaussianBlur', { stdDeviation: 8 }, soft);
  const L = {}; for (const k of ['sky', 'far', 'towers', 'hills', 'mid', 'lake', 'stage', 'near', 'fg', 'fx']) L[k] = G(svg, { id: 'L_' + k });
  const P = (d, fill, p, extra = {}) => E('path', { d, fill, ...extra }, p);
  const C = (cx, cy, rr, fill, p, extra = {}) => E('circle', { cx, cy, r: rr, fill, ...extra }, p);
  // sky + sun glow + clouds
  E('rect', { x: -200, y: -200, width: 2320, height: 1480, fill: 'url(#wSky)' }, L.sky);
  C(1460, 210, 260, '#fffbe0', L.sky, { opacity: .55, filter: 'url(#wSoft)' }); C(1460, 210, 90, '#fff8d2', L.sky);
  const cloud = (x, y, s, p, a = .95) => { const g = G(p, { opacity: a }); [[0, 0, 60], [55, -25, 70], [120, 0, 58], [60, 18, 64], [-45, 14, 42], [165, 18, 40]].forEach(([dx, dy, rr]) => C(x + dx * s, y + dy * s, rr * s, '#ffffff', g)); return g; };
  L.clouds = [cloud(180, 170, 1.1, L.sky), cloud(820, 110, .8, L.sky, .85), cloud(1700, 330, .9, L.sky, .8), cloud(1150, 360, .6, L.sky, .7)];
  // light rays from the sun
  for (let i = 0; i < 6; i++) { const a = -0.3 + i * .23; P(`M1460,210 L${1460 + Math.cos(a + 1.9) * 1600},${210 + Math.sin(a + 1.9) * 1600} L${1460 + Math.cos(a + 1.98) * 1600},${210 + Math.sin(a + 1.98) * 1600} Z`, 'url(#wRay)', L.fx, { opacity: .18 }); }
  // far mountains (3 ridges, lighter = further away)
  const ridge = (y0, amp, col, p, n = 9) => { let d = `M-200,1300 L-200,${y0}`; for (let i = 0; i <= n; i++) { const x = -200 + i * (2320 / n), y = y0 - amp * (0.4 + r() * 0.6); d += ` Q${x - 2320 / n / 2},${y - amp * .5} ${x},${y}`; } return P(d + ' L2120,1300 Z', col, p); };
  ridge(560, 150, '#a8ecd9', L.far); ridge(620, 120, '#7fdcc2', L.far); ridge(680, 90, '#5cc9a6', L.far);
  // glass towers + domes (Frutiger Aero tech city in the distance)
  const tower = (x, w, h, p) => { const y = 700 - h; P(`M${x},700 L${x},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2} L${x + w},700 Z`, 'url(#wGlass)', p, { stroke: '#3f9fc0', 'stroke-width': 3 });
    for (let k = y + w; k < 690; k += 38) E('rect', { x: x + 6, y: k, width: w - 12, height: 6, rx: 3, fill: '#ffffff', opacity: .55 }, p);
    E('rect', { x: x + w * .18, y: y + w * .3, width: w * .12, height: h - w * .5, rx: 4, fill: '#ffffff', opacity: .6 }, p); C(x + w / 2, y - 6, 7, '#ffd36b', p); };
  tower(560, 70, 300, L.towers); tower(650, 96, 380, L.towers); tower(770, 60, 250, L.towers); tower(1240, 84, 330, L.towers); tower(1340, 58, 230, L.towers);
  const dome = (cx, rw, p) => { P(`M${cx - rw},700 A${rw},${rw * .8} 0 0 1 ${cx + rw},700 Z`, 'url(#wGlass)', p, { stroke: '#3f9fc0', 'stroke-width': 3 }); P(`M${cx - rw * .6},${700 - rw * .45} A${rw * .7},${rw * .55} 0 0 1 ${cx + rw * .1},${700 - rw * .74}`, 'none', p, { stroke: '#fff', 'stroke-width': 8, opacity: .7, 'stroke-linecap': 'round' }); };
  dome(1000, 150, L.towers); dome(470, 90, L.towers);
  // rolling hills
  P('M-200,760 C200,660 520,700 760,720 C1040,744 1300,650 1640,690 C1840,712 2000,700 2120,690 L2120,1300 L-200,1300 Z', '#43b97a', L.hills);
  P('M-200,820 C260,760 600,800 980,790 C1300,780 1600,740 2120,780 L2120,1300 L-200,1300 Z', '#2fa065', L.hills);
  // trees: canopy built from clustered circles (dark base, mid, light highlights), curved trunk
  const tree = (x, y, s, p, pal) => { const g = G(p); const [dk, md, lt, tr] = pal;
    P(`M${x - 14 * s},${y} C${x - 10 * s},${y - 120 * s} ${x - 40 * s},${y - 200 * s} ${x - 10 * s},${y - 280 * s} L${x + 14 * s},${y - 280 * s} C${x + 4 * s},${y - 200 * s} ${x + 22 * s},${y - 110 * s} ${x + 18 * s},${y} Z`, tr, g);
    const blobs = []; for (let i = 0; i < 9; i++) blobs.push([x + (r() - .5) * 230 * s, y - 300 * s + (r() - .5) * 120 * s, (60 + r() * 50) * s]);
    blobs.forEach(([bx, by, br]) => C(bx, by + 10 * s, br, dk, g)); blobs.forEach(([bx, by, br]) => C(bx - 8 * s, by - 6 * s, br * .82, md, g));
    blobs.slice(0, 5).forEach(([bx, by, br]) => C(bx - 22 * s, by - 24 * s, br * .38, lt, g, { opacity: .45 }));
    for (let i = 0; i < 4; i++) C(x + (r() - .5) * 200 * s, y - 300 * s + (r() - .3) * 100 * s, 9 * s, '#ffcf5c', g);   // fruit dots
    return g; };
  const PAL1 = ['#11685a', '#1f9070', '#5fd39a', '#5a3b2e'], PAL2 = ['#0f4f63', '#1c7b8c', '#58c7c9', '#4a3a40'];
  L.trees = [tree(140, 860, 1.25, L.mid, PAL2), tree(420, 800, .8, L.mid, PAL1), tree(1560, 820, 1.0, L.mid, PAL1), tree(1820, 880, 1.35, L.mid, PAL2), tree(1320, 790, .6, L.mid, PAL1)];
  // bush rows
  for (let i = 0; i < 26; i++) { const x = -100 + i * 90 + r() * 40, y = 870 + r() * 30; C(x, y, 50 + r() * 30, i % 2 ? '#1f8a5a' : '#27a067', L.mid); C(x - 14, y - 16, 22, '#6fe0a0', L.mid, { opacity: .7 }); }
  // lake with reflections and ripples
  P('M560,900 C700,860 1260,860 1420,900 C1500,930 1400,980 1000,985 C620,985 470,935 560,900 Z', 'url(#wLake)', L.lake, { stroke: '#1a7a95', 'stroke-width': 4 });
  L.ripples = [0, 1, 2, 3].map(i => P(`M${700 + i * 150},${915 + (i % 2) * 25} q40,-8 80,0`, 'none', L.lake, { stroke: '#e6fdff', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .8 }));
  // ground for the figure
  P('M-200,960 C300,930 700,1000 1100,990 C1500,980 1800,940 2120,960 L2120,1300 L-200,1300 Z', '#219058', L.stage);
  // foreground framing: big leaves and flowers (dark, saturated, slightly blurred = close to camera)
  const leaf = (x, y, len, ang, col, vein, p) => { const g = G(p, { transform: `translate(${x},${y}) rotate(${ang})` });
    P(`M0,0 C${len * .3},${-len * .28} ${len * .75},${-len * .25} ${len},0 C${len * .75},${len * .25} ${len * .3},${len * .28} 0,0 Z`, col, g);
    P(`M0,0 L${len * .92},0`, 'none', g, { stroke: vein, 'stroke-width': 5, 'stroke-linecap': 'round' }); return g; };
  L.leaves = [leaf(-40, 1120, 420, -55, '#0c4d4f', '#1f7f78', L.fg), leaf(-60, 1000, 360, -20, '#126b5e', '#2c9a84', L.fg), leaf(80, 1110, 300, -80, '#8a2f6e', '#c4559c', L.fg),
              leaf(1990, 1130, 440, -125, '#0c4d4f', '#1f7f78', L.fg), leaf(2010, 990, 330, -160, '#126b5e', '#2c9a84', L.fg), leaf(1850, 1120, 280, -100, '#d0743a', '#f0a05a', L.fg)];
  const flower = (x, y, s, col, p) => { const g = G(p); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; C(x + Math.cos(a) * 18 * s, y + Math.sin(a) * 18 * s, 14 * s, col, g); } C(x, y, 11 * s, '#ffe08a', g); return g; };
  L.flowers = [flower(260, 1020, 1.2, '#ff8fb1', L.near), flower(1660, 1030, 1.4, '#ffb547', L.near), flower(1480, 1060, 1, '#ff8fb1', L.near), flower(420, 1060, .9, '#ffffff', L.near)];
  for (let i = 0; i < 18; i++) P(`M${r() * 1920},1080 q${(r() - .5) * 30},-${60 + r() * 70} ${(r() - .5) * 20},-${110 + r() * 60}`, 'none', L.near, { stroke: i % 2 ? '#2fa065' : '#45c27f', 'stroke-width': 9, 'stroke-linecap': 'round' });
  // floating light motes
  L.motes = []; for (let i = 0; i < 26; i++) L.motes.push(C(r() * 1920, 200 + r() * 700, 3 + r() * 4, '#fffbe0', L.fx, { opacity: .5 + r() * .4 }));
  return L;
}

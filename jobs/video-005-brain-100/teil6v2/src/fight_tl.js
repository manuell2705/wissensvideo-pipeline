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
tl.to(cam, { s: 2.8, cx: 745, cy: 530, duration: 3.2, ease: 'power2.inOut' }, W('854', 'fades'));
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

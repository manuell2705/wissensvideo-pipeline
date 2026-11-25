// Render an animated HTML page (window.seek(t), window.DURATION) frame by frame to a video: node render_page.js page.html out.mp4 [fps]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
(async () => {
  const [page, out, fps = 25] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(page)); await p.waitForTimeout(300);
  const dur = await p.evaluate(() => window.DURATION), n = Math.ceil(dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-r', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => { window.seek(t); }, i / fps);
    ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 }));
    if (i % 100 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();

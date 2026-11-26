# usage: python3 mix.py page.html wavdir video.mp4 out.mp4
import sys,subprocess,json,os
page,wd,vid,out=sys.argv[1:5]; S=os.path.dirname(os.path.abspath(__file__))
meta=json.loads(subprocess.check_output(['node','-e',"""const { chromium } = require('playwright');const path=require('path');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+path.resolve(process.argv[1]));await p.waitForTimeout(300);console.log(JSON.stringify(await p.evaluate(()=>({sfx:window.SFX,offs:window.OFFS,dur:window.DURATION}))));await b.close();})();""",page]))
CH='highpass=f=75,equalizer=f=180:t=q:w=1:g=2.5,equalizer=f=400:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1.2:g=4,equalizer=f=9000:t=h:w=2000:g=2.5,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=80:makeup=4,aecho=0.8:0.35:12:0.08,loudnorm=I=-14:TP=-1.2:LRA=7'
CH2='highpass=f=70,equalizer=f=120:t=q:w=1:g=4,equalizer=f=320:t=q:w=1.4:g=-3,equalizer=f=2800:t=q:w=1:g=3,equalizer=f=5000:t=q:w=1.5:g=3,deesser=i=0.4:f=0.5,aexciter=amount=1.5:drive=4:blend=0:freq=3000,acompressor=threshold=-22dB:ratio=4:attack=3:release=60:makeup=5,alimiter=limit=0.9,loudnorm=I=-14:TP=-1.2:LRA=6'
if os.environ.get('MIC')=='2': CH=CH2
os.makedirs(wd+'/mic',exist_ok=True)
ins=[];f=[];n=0;D=meta['dur']
for k,t in meta['offs'].items():
  w=f'{wd}/line_{k}.wav'
  if not os.path.exists(w): continue
  m=f'{wd}/mic/line_{k}.wav'; subprocess.run(['ffmpeg','-loglevel','error','-y','-i',w,'-af',CH,'-ar','48000',m],check=True)
  ins+=['-i',m]; f.append(f'[{n}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(t*1000)}|{int(t*1000)}[v{n}]'); n+=1
ins+=['-stream_loop','-1','-i','/home/claude/wissensvideo-pipeline/assets/music.mp3']
f.append(f'[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{D},afade=t=in:d=1,afade=t=out:st={D-2}:d=2,volume=0.07[v{n}]'); n+=1
for name,t,vol in meta['sfx']:
  p=f'{S}/sfx/{name}.wav'
  if not os.path.exists(p): continue
  ins+=['-i',p]; f.append(f'[{n}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(t*1000)}|{int(t*1000)},volume={0.45*vol:.3f}[v{n}]'); n+=1
f.append(''.join(f'[v{i}]' for i in range(n))+f'amix=inputs={n}:normalize=0:duration=longest,atrim=0:{D},alimiter=limit=0.95[a]')
open(wd+'/mix.txt','w').write(';'.join(f))
subprocess.run(['ffmpeg','-loglevel','error','-y']+ins+['-i',vid,'-filter_complex_script',wd+'/mix.txt','-map',f'{n}:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',out],check=True)
print('ok',out,D)

# usage: assemble.py part_no first_id last_id gaps_csv body.js out.html words.js
import sys,re
R='/home/claude/wissensvideo-pipeline/render/rig/'
part,a,b,gaps,body,out,words=sys.argv[1:8]
L=open(R+'test_teil2.html').read().split('\n')
ib=next(i for i,l in enumerate(L) if l.startswith('icons.body'))
panel='\n'.join(L[338:ib])
T3=open('/tmp/claude-0/-home-claude/7af9110f-4252-5499-aceb-72ff8c39fd54/scratchpad/teil3_body.js').read().split('\n')
icons='\n'.join(l for l in T3 if l.startswith('icons.body') or l.startswith('icons.learn'))
h='\n'.join(L[:96])
h=h.replace('words_teil2.js',words)
h=re.sub(r"const ORDER = \[[^\]]*\]","const ORDER = ["+", ".join("'%d'"%i for i in range(int(a),int(b)+1))+"]",h)
h=re.sub(r"\[('[0-9]+', )*'[0-9]+'\]\.includes\(id\) \? 0\.55","["+", ".join("'%s'"%g for g in gaps.split(','))+"].includes(id) ? 0.55",h)
h=re.sub(r"// Real video, PART 2 of 6[^\n]*","// Real video, PART %s of 6"%part,h)
import os
X=os.environ.get('XGAP','')
if X:
    h=h.replace("OFF[id] = acc; acc += LDUR[id] + (","OFF[id] = acc; acc += ({%s}[id] || 0) + LDUR[id] + ("%X,1)
OX=os.environ.get('ORDERX','')
if OX:
    h=re.sub(r"const ORDER = \[[^\]]*\]","const ORDER = ["+", ".join("'%s'"%i for i in OX.split(','))+"]",h)
bd=open(body).read().replace('@@PANEL@@',panel).replace('@@ICONS@@',icons)
open(R+out,'w').write(h+'\n'+bd)

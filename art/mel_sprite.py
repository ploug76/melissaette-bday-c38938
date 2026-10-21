# Melissaette 24x32 sprite generator (source of truth; exported into src/c_art.js as pixel strings).
# Painted in layers with region ids, then auto-outlined (outer + selected inner seams), like hand pixel art.
W,H=24,32
PAL={'k':'#1a1238','h':'#ffffff','H':'#cfd7f0','y':'#ffd23a','Y':'#e3992a','l':'#fff4b0','b':'#5aa2ff','d':'#3270d8','B':'#86bcff',
     'w':'#ffffff','g':'#cfd7f0','e':'#ffffff','p':'#1a1238','i':'#4a8ae8','c':'#ff92b4','m':'#e0405a','s':'#ffffff','S':'#aeb9dc'}
def new():return [['.' ]*W for _ in range(H)],[[None]*W for _ in range(H)]
def put(G,x,y,ch,reg):
  px,rg=G
  if 0<=x<W and 0<=y<H:px[y][x]=ch;rg[y][x]=reg
def ell(G,cx,cy,rx,ry,ch,reg,cond=None):
  for y in range(H):
    for x in range(W):
      if ((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1 and (cond is None or cond(x,y)):put(G,x,y,ch,reg)
def rect(G,x0,y0,x1,y1,ch,reg):
  for y in range(y0,y1+1):
    for x in range(x0,x1+1):put(G,x,y,ch,reg)
def rows(G,spec,reg,ch):  # spec: {y:(x0,x1)}
  for y,(a,b) in spec.items():rect(G,a,y,b,y,ch,reg)
SEAM={frozenset(p) for p in [('hat','hair'),('hat','face'),('hair','face'),('dress','skin'),('dress','hair'),('skin','hair'),('shoe','skin'),('dress','arm'),('arm','hair'),('arm','face'),('face','dress')]}
def outline(G):
  px,rg=G;out=[r[:] for r in px]
  for y in range(H):
    for x in range(W):
      if rg[y][x] is None:
        if any(0<=x+dx<W and 0<=y+dy<H and rg[y+dy][x+dx] is not None for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):out[y][x]='k'
      else:
        for dx,dy in((-1,0),(0,-1)):
          xx,yy=x+dx,y+dy
          if 0<=xx<W and 0<=yy<H and rg[yy][xx] and rg[yy][xx]!=rg[y][x] and frozenset((rg[yy][xx],rg[y][x])) in SEAM and px[y][x] not in 'kp' and out[yy][xx]!='k':
            out[y][x]='k'
  return out
def build(legs='stand',arms='down',mood='norm',bob=0,hairsway=0):
  G=new()
  # back hair: long, wavy, past the shoulders to the waist
  ell(G,12,12,9.6,8.6,'y','hair')
  for y in range(14,24+hairsway//2):
    wv=(1 if (y//2)%2 else 0)
    for x in list(range(2+wv-hairsway,6+wv-hairsway))+list(range(18-wv,22-wv)):
      put(G,x,y,'Y' if x in(3+wv-hairsway,20-wv) else ('l' if (x+y)%7==0 else 'y'),'hair')
  # body
  if arms=='down':
    rect(G,6,19,7,23,'b','arm');rect(G,17,19,18,23,'b','arm');put(G,6,24,'b','arm');put(G,18,24,'b','arm')
  elif arms=='up':
    for i,(x,y) in enumerate([(7,18),(6,17),(5,16),(5,15),(4,14)]):put(G,x,y,'b','arm');put(G,x+1,y,'b','arm')
    for i,(x,y) in enumerate([(17,18),(18,17),(19,16),(19,15),(20,14)]):put(G,x-1,y,'b','arm');put(G,x,y,'b','arm')
  elif arms=='swing1':
    rect(G,6,19,7,22,'b','arm');put(G,5,23,'b','arm');put(G,6,23,'b','arm');rect(G,17,19,18,22,'b','arm');put(G,18,23,'b','arm');put(G,19,23,'b','arm')
  rows(G,{18:(9,15),19:(8,16),20:(8,16),21:(9,15)},'dress','w')
  rect(G,7,18,8,19,'w','dress');rect(G,16,18,17,19,'w','dress')   # puff sleeves
  rows(G,{22:(10,14)},'dress','g')                                   # cinched waist
  rows(G,{23:(9,15),24:(8,16),25:(8,17),26:(7,17),27:(7,18)},'dress','w')
  rows(G,{27:(7,18)},'dress','g')
  for x in(9,12,15):put(G,x,25,'g','dress')                          # skirt folds
  # legs + white heels
  L={'stand':[(10,14)],'w1':[(9,15)],'w2':[(11,13)],'jump':[(10,14)]}[legs]
  for (a,b) in L:
    if legs=='jump':
      rect(G,a,28,a,28,'b','skin');rect(G,b,28,b,28,'b','skin');rect(G,a-1,29,a,29,'s','shoe');rect(G,b,29,b+1,29,'s','shoe')
    else:
      rect(G,a,28,a,29,'b','skin');rect(G,b,28,b,29,'b','skin')
      rect(G,a-1,30,a,30,'s','shoe');rect(G,b,30,b+1,30,'s','shoe');put(G,a-1,31,'S','shoe') if legs!='w1' else None;put(G,b,31,'S','shoe') if legs!='w1' else None
      if legs=='w1':put(G,a-1,31,'S','shoe');put(G,b+1,31,'S','shoe')
  # face
  ell(G,12.5,12.6,6.6,5.6,'b','face')
  rect(G,11,17,13,17,'b','face')
  # bangs (fringe) under the hat
  rows(G,{7:(5,19),8:(5,9)},'hair','y');rows(G,{8:(15,19)},'hair','y');put(G,6,9,'y','hair');put(G,18,9,'y','hair');put(G,10,8,'y','hair');put(G,14,8,'y','hair')
  put(G,7,8,'l','hair');put(G,17,8,'l','hair')
  # hat: floppy Smurf cap (rounded crown, soft tip flopping back over the left, fold shading)
  ell(G,12.5,5.0,7.6,5.0,'h','hat',cond=lambda x,y:y<=7)
  rows(G,{7:(5,20),8:(6,19)},'hat','h')
  for x in range(5,21):put(G,x,7,'H' if x in(5,6,19,20) else 'h','hat')
  for x in range(6,20):put(G,x,8,'H','hat')
  ell(G,4.6,5.4,3.4,2.2,'h','tip');put(G,2,6,'H','tip');put(G,3,6,'H','tip');put(G,2,5,'H','tip')
  for (x,y) in((8,2),(9,2),(10,1)):put(G,x,y,'H','hat')
  # eyes (big, with lashes)
  px,rg=G
  for ex in(8,14):
    for y in range(10,14):
      for x in range(ex,ex+3):put(G,x,y,'e','face')
    put(G,ex+1,12,'i','face');put(G,ex+2,12,'p','face');put(G,ex+1,13,'p','face');put(G,ex+2,13,'p','face')
    for x in range(ex,ex+3):put(G,x,9,'k','face')
  put(G,7,9,'k','face');put(G,17,9,'k','face');put(G,7,10,'k','face');put(G,17,10,'k','face')  # lash flicks
  if mood=='happy':
    for ex in(8,14):
      for y in range(9,14):
        for x in range(ex,ex+3):put(G,x,y,'b','face')
      put(G,ex,12,'k','face');put(G,ex+1,11,'k','face');put(G,ex+2,12,'k','face');put(G,ex-1 if ex==8 else ex+3,11,'k','face')
  if mood=='hurt':
    for ex in(8,14):
      for y in range(9,14):
        for x in range(ex,ex+3):put(G,x,y,'b','face')
      for (dx,dy) in((0,10),(2,10),(1,11),(0,12),(2,12)):put(G,ex+dx,dy,'k','face')
  # nose, cheeks, smile
  put(G,12,13,'d','face');put(G,12,14,'d','face');put(G,13,14,'d','face')
  put(G,7,14,'c','face');put(G,17,14,'c','face')
  if mood=='hurt':rect(G,11,16,13,16,'k','face')
  elif mood=='happy':put(G,10,15,'k','face');rect(G,11,16,13,16,'m','face');put(G,14,15,'k','face');rect(G,11,17,13,17,'k','face')
  else:put(G,10,15,'k','face');rect(G,11,16,13,16,'k','face');put(G,14,15,'k','face');put(G,12,15,'b','face')
  out=outline(G)
  # bob (shift down) for walk frames
  if bob:out=[['.']*W]*bob+out[:-bob]
  return [''.join(r) for r in out]
FR={'stand':build(),'w1':build('w1','swing1',bob=0,hairsway=1),'w2':build('w2','down',bob=1),'jump':build('jump','up',hairsway=0),
    'happy':build('stand','up','happy'),'cheer':build('jump','up','happy'),'hurt':build('stand','down','hurt')}
FRAMES=list(FR)
def frame(n):return FR[n]
if __name__=='__main__':
  import sys
  from PIL import Image,ImageDraw
  S=10;im=Image.new('RGB',(len(FRAMES)*26*S,34*S),'#7d76fc');d=ImageDraw.Draw(im)
  for fi,n in enumerate(FRAMES):
    for j,r in enumerate(frame(n)):
      for i,ch in enumerate(r):
        if ch in PAL:d.rectangle([fi*26*S+i*S,S+j*S,fi*26*S+i*S+S-1,S+j*S+S-1],fill=PAL[ch])
  im.save(sys.argv[1] if len(sys.argv)>1 else '/workspace/melissaette-bday-c38938/test/mel_v2.png')

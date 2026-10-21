# Builds cover.png (1200x630, ColecoVision-box style) + cover-anim.gif. Imports shared covers/gen.py read-only.
import sys;sys.path.insert(0,'/workspace/covers');sys.path.insert(0,'/workspace/melissaette-bday-c38938')
from PIL import Image,ImageDraw
import gen,tools_sprite as ts
F=gen.F;F2=dict(F);F2[',']=['..','..','..','..','..','.#','#.']
def text(d,x,y,s,col,sc,shadow=None):
  old=gen.F;gen.F=F2
  try:gen.text(d,x,y,s,col,sc,shadow=shadow)
  finally:gen.F=old
def tw(s,sc):return sum((len(F2[c][0])+1)*sc for c in s)-sc
W,H=1200,630
ART=Image.open('/workspace/melissaette-bday-c38938/art/ref_clean_full.png').convert('RGB')
def R(d,x,y,w,h,c):d.rectangle([x,y,x+w-1,y+h-1],fill=c)
def castle(d,x,y,s,c='#5a4a8a',win='#ffd84a'):
  R(d,x,y-40*s,70*s,40*s,c)
  for tx in (0,52):R(d,x+tx*s,y-66*s,18*s,66*s,c);[R(d,x+tx*s+i*6*s,y-72*s,4*s,6*s,c) for i in range(3)]
  R(d,x+26*s,y-84*s,18*s,44*s,c);[R(d,x+26*s+i*6*s,y-90*s,4*s,6*s,c) for i in range(3)]
  for wx,wy in ((6,-56),(58,-56),(32,-74),(14,-30),(50,-30)):R(d,x+wx*s,y+wy*s,6*s,8*s,win)
  R(d,x+28*s,y-18*s,14*s,18*s,'#1b1036')
def candle(d,x,y,s,f):
  R(d,x,y,3*s,9*s,['#5455ed','#ffd84a','#5edc78','#42ebf5'][x//7%4]);R(d,x,y-(4+f)*s,3*s,(4+f)*s,'#ffb020');R(d,x+s,y-(3+f)*s,s,2*s,'#fff6a0')
def frame(t=0):
  im=Image.new('RGB',(W,H),'#000000');d=ImageDraw.Draw(im)
  px=600;PW=W-px-28
  # right panel: night scene with castle (drawn first, then masked to the panel)
  R(d,px,52,PW,528,'#120c32')
  for i in range(40):x=px+10+(i*97)%(PW-20);y=200+(i*53)%170;R(d,x,y,3,3,'#ffffff' if (i+t)%5 else '#ffd84a')
  d.ellipse([1080,196,1140,256],fill='#fff6c8');d.ellipse([1098,192,1150,244],fill='#120c32')
  castle(d,900,500,3)
  d.ellipse([560,460,980,640],fill='#21b03b');d.ellipse([820,470,1240,660],fill='#1a8a30')
  R(d,px,500,PW,80,'#21b03b');R(d,px,500,PW,6,'#5edc78')
  rows=ts.happy() if t%4==3 else ts.ROWS;s=8;mx=650+(t%2)*2
  ts.draw(d,mx,500-24*s-(4 if t%2 else 0),s,rows)
  for i in range(6):candle(d,1010+i*22,482,3,(t+i)%2)
  R(d,0,0,px,H,'#000000');R(d,px+PW,0,W,H,'#000000');R(d,0,0,W,52,'#000000');R(d,0,580,W,H,'#000000')
  R(d,px,52,PW,4,'#ffffff');R(d,px,576,PW,4,'#ffffff')
  cols=['#d4524d','#ffb020','#ffd84a','#21c842','#42ebf5','#5455ed','#c95bba']
  for i,c in enumerate(cols):R(d,0,i*6,W,6,c);R(d,0,H-42+i*6,W,6,c)
  side=528;ax,ay=36,52;R(d,ax-8,ay-8,side+16,side+16,'#ffffff');R(d,ax-4,ay-4,side+8,side+8,'#d4524d')
  im.paste(ART.resize((side,side),Image.LANCZOS),(ax,ay))
  tl='MELISSAETTE';sc=8;text(d,px+(PW-tw(tl,sc))//2,76,tl,'#ffd84a',sc,shadow='#c95bba')
  t2="RESCUE IN GARGAMEL'S CASTLE";sc2=3;text(d,px+(PW-tw(t2,sc2))//2,150,t2,'#ffffff',sc2,shadow='#5455ed')
  # birthday banner ribbon across the bottom
  b='HAPPY 54TH BIRTHDAY, MELISSA!';sb=5;bw=tw(b,sb)+48;bx=(W-bw)//2;by=516
  R(d,bx-34,by+14,44,44,'#a0284a');R(d,bx+bw-10,by+14,44,44,'#a0284a')
  R(d,bx,by,bw,56,'#ff5f8f');R(d,bx,by,bw,5,'#ffd0de');R(d,bx,by+51,bw,5,'#c43e7a')
  text(d,bx+24,by+11,b,'#ffffff',sb,shadow='#7a1838')
  return im
if __name__=='__main__':
  frame(-1).save('cover.png',optimize=True)
  fr=[frame(i).resize((600,315),Image.LANCZOS).quantize(colors=128,method=Image.Quantize.MEDIANCUT) for i in range(8)]
  fr[0].save('cover-anim.gif',save_all=True,append_images=fr[1:],duration=180,loop=0,optimize=True)
  print('ok')

import sys,json;sys.path.insert(0,'/workspace/melissaette-bday-c38938/art');sys.path.insert(0,'/workspace/covers')
from PIL import Image,ImageDraw
import mel_sprite as M,gen
OLD=json.load(open('/workspace/melissaette-bday-c38938/art/old_mel_frames.json'))
OPAL={'k':'#141030','h':'#ffffff','H':'#c4cde6','y':'#ffd84a','b':'#4d8df6','d':'#2f62c9','w':'#ffffff','g':'#c4cde6','p':'#ff86a6'}
def spr(rows,pal,s):
  w=max(len(r) for r in rows);im=Image.new('RGBA',(w*s,len(rows)*s),(0,0,0,0));d=ImageDraw.Draw(im)
  for j,r in enumerate(rows):
    for i,ch in enumerate(r):
      if ch in pal:d.rectangle([i*s,j*s,i*s+s-1,j*s+s-1],fill=pal[ch])
  return im
def row(frames,pal,s,label,bg):
  ims=[spr(f,pal,s) for f in frames.values()];W=sum(i.width for i in ims)+40*len(ims)+40;H=max(i.height for i in ims)+90
  im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im);gen.text(d,20,14,label,'#ffffff',4,shadow='#000000');x=40
  for (n,f),sp in zip(frames.items(),ims):im.paste(sp,(x,H-20-sp.height),sp);gen.text(d,x,H-16+2,n.upper(),'#ffd84a',2) if False else None;x+=sp.width+40
  return im
before=row({k:OLD[k] for k in ['stand','w1','w2','jump','happy']},OPAL,12,'BEFORE: 16X24 SPRITE','#5455ed')
after=row(M.FR,M.PAL,9,'AFTER: 24X32 SPRITE - WALK JUMP CHEER','#5455ed')
before.save('/workspace/melissaette-bday-c38938/sprite_before.png');after.save('/workspace/melissaette-bday-c38938/sprite_after.png')
por=Image.open('/workspace/melissaette-bday-c38938/art/mel_portrait_wave.png').convert('RGBA');por=por.crop(por.getbbox());ph=before.height+after.height-40;por=por.resize((int(por.width*ph/por.height),ph),Image.LANCZOS)
W=max(before.width,after.width)+por.width+60;H=before.height+after.height
im=Image.new('RGB',(W,H),'#1b1440');im.paste(before,(0,0));im.paste(after,(0,before.height))
im.paste(por,(max(before.width,after.width)+30,20),por);d=ImageDraw.Draw(im);gen.text(d,max(before.width,after.width)+30,H-26,'NEW TITLE/ENDING PORTRAIT','#ffd84a',2)
im.save('/workspace/melissaette-bday-c38938/sprite_compare.png');print(im.size)

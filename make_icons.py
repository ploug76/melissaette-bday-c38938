# App icons: Melissaette's portrait bust over a night sky with the castle and candles.
from PIL import Image,ImageDraw
P=Image.open('/workspace/melissaette-bday-c38938/art/mel_portrait.png').convert('RGBA')
bb=P.getbbox();bust=P.crop((bb[0]-10,bb[1]-6,bb[2]+10,bb[1]+int((bb[3]-bb[1])*.66)))
def icon(n):
  S=512;im=Image.new('RGBA',(S,S),'#1b1440');d=ImageDraw.Draw(im)
  for y in range(S):d.line([(0,y),(S,y)],fill=(27+y*40//S,20+y*10//S,64+y*60//S))
  for i in range(30):x=(i*97)%S;y=(i*61)%240;d.rectangle([x,y,x+4,y+4],fill='#ffffff' if i%3 else '#ffd84a')
  c='#5a4a8a'
  for (x,w,h) in((300,70,170),(380,90,130),(450,70,200)):d.rectangle([x,S-h,x+w,S],fill=c)
  for x in range(300,520,22):d.rectangle([x,S-212,x+12,S-196],fill=c)
  d.rectangle([0,S-60,S,S],fill='#21b03b');d.rectangle([0,S-60,S,S-52],fill='#5edc78')
  bh=int(S*.92);bw=int(bust.width*bh/bust.height);b=bust.resize((bw,bh),Image.LANCZOS)
  im.paste(b,((S-bw)//2-30,S-bh),b)
  for i in range(5):x=380+i*24;d.rectangle([x,S-100,x+10,S-62],fill=['#ff86a6','#42ebf5','#ffd84a','#5edc78','#c95bba'][i]);d.ellipse([x,S-120,x+10,S-100],fill='#ffb020')
  im.convert('RGB').resize((n,n),Image.LANCZOS).save(f'/workspace/melissaette-bday-c38938/icon-{n}.png',optimize=True)
icon(192);icon(512);print('icons ok')

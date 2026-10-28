# Builds title.jpg (600x600 in-game title picture): original art only - Melissaette's seven Party Pals,
# Baron Humbug's castle and birthday candles (the game overlays Melissaette's portrait on the lower right). Party Pal sprites are rendered from the built game (index.html).
import sys,asyncio,base64,io;sys.path.insert(0,'/workspace/covers')
from PIL import Image,ImageDraw
from playwright.async_api import async_playwright
import gen
D='/workspace/melissaette-bday-c38938/'
async def pals():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page()
    await pg.goto('file://'+D+'index.html');await pg.wait_for_timeout(800)
    url=await pg.evaluate('''()=>{window.__manual=1;const c=document.createElement('canvas');c.width=7*20;c.height=26;const x=c.getContext('2d');
      FRIENDS.forEach((f,i)=>x.drawImage(SPR[f[0]].r[i%2?'happy':'stand'],i*20+2,1));return c.toDataURL()}''')
    await b.close()
  return Image.open(io.BytesIO(base64.b64decode(url.split(',')[1]))).convert('RGBA')
def R(d,x,y,w,h,c):d.rectangle([x,y,x+w-1,y+h-1],fill=c)
def tw(s,sc):return sum((len(gen.F[c][0])+1)*sc for c in s)-sc
def main():
  S=600;im=Image.new('RGB',(S,S));d=ImageDraw.Draw(im)
  for y in range(S):d.line([(0,y),(S,y)],fill=(22+y*40//S,16+y*14//S,58+y*70//S))
  for i in range(60):x=(i*97)%S;y=150+(i*53)%260;R(d,x,y,3,3,'#ffffff' if i%4 else '#ffd84a')
  d.ellipse([500,170,550,220],fill='#fff6c8');d.ellipse([514,166,560,212],fill=(30,22,78))
  c='#4a3a7a'  # Humbug Castle silhouette with lit windows (left), leaving the lower right clear for the game's portrait overlay
  X=60;R(d,X,330,170,150,c);R(d,X-10,280,40,200,c);R(d,X+140,280,40,200,c);R(d,X+60,250,50,230,c)
  for x0,w in((X-10,40),(X+140,40),(X+60,50)):
    for i in range(0,w,12):R(d,x0+i,268 if x0!=X+60 else 238,8,12,c)
  for wx,wy in((X+2,300),(X+152,300),(X+78,270),(X+20,380),(X+120,380),(X+72,330)):R(d,wx,wy,10,14,'#ffd84a')
  R(d,X+70,420,30,60,'#1b1036')
  R(d,0,480,S,120,'#21b03b');R(d,0,480,S,6,'#5edc78')
  for i in range(8):x=262+i*26;R(d,x,452,9,28,['#ff86a6','#42ebf5','#ffd84a','#5edc78','#c95bba'][i%5]);d.ellipse([x,436,x+9,452],fill='#ffb020')
  P=asyncio.run(pals());P=P.resize((P.width*3,P.height*3),Image.NEAREST);cw=60
  for i in [4,5,6,0,1,2,3]:  # back row of 3 on the hill, front row of 4
    cell=P.crop((i*cw,0,(i+1)*cw,P.height));back=i>=4
    x=40+(i-4)*62 if back else 8+i*62;y=(548 if back else 596)-P.height
    im.paste(cell,(x,y),cell)
  # title block
  R(d,0,0,S,128,'#000000')
  for i,col in enumerate(['#d4524d','#ffb020','#ffd84a','#21c842','#42ebf5','#5455ed','#c95bba']):R(d,0,128+i*3,S,3,col)
  t='MELISSA TIME';sc=7;gen.text(d,(S-tw(t,sc))//2,18,t,'#ffd84a',sc,shadow='#c95bba')
  t='THE GREAT BIRTHDAY RESCUE';sc=3;gen.text(d,(S-tw(t,sc))//2,88,t,'#ffffff',sc,shadow='#5455ed')
  im.save(D+'title.jpg',quality=90);print('title ok')
main()

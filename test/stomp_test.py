# Stomp check: landing on a creature from above while falling defeats it without harm; a side hit still hurts.
import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
JS=r'''(k)=>{const T=__T;window.__manual=1;T.start(2);T.step(2);const G=T.G,p=G.p;p.inv=0;G.pw.shield=0;G.gens=[];G.evs=[];
 const mk={bat:(x,y)=>({k:'bat',x,y0:y,y,age:0}),snake:(x,y)=>({k:'snake',x,y,dir:1,v:0,x1:0,x2:999}),spider:(x,y)=>({k:'spider',x,y0:y,y,low:y,per:1,ph:0}),
  cat:(x,y)=>({k:'cat',x,y,vx:0,vy:0,st:'leave',tm:0})};
 const res={};
 // stomp: player just above creature, falling
 let e=mk[k](128,GY-8);G.ents=[e];p.x=e.x;p.y=e.y-(k=='cat'?13:5);p.vy=120;p.on=false;p.jumping=true;const lives=G.lives;
 T.step(1);res.stompGone=!G.ents.includes(e);res.stompPh=G.ph;res.bounce=p.vy<0;
 // side hit
 T.start(2);T.step(2);const G2=T.G,p2=G2.p;p2.inv=0;G2.pw.shield=0;G2.gens=[];G2.evs=[];let e2=mk[k](0,0);e2.x=p2.x+3;e2.y=p2.y-6;if(k=='spider'){e2.y0=e2.low=e2.y}if(k=='bat')e2.y0=e2.y;
 if(k=='cat')e2.y=p2.y;G2.ents=[e2];p2.vy=0;T.step(1);res.sidePh=G2.ph;return res}'''
async def main():
  fails=0
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(600)
    for k in ['bat','snake','spider','cat']:
      r=await pg.evaluate(JS,k);ok=r['stompGone'] and r['stompPh']=='play' and r['bounce'] and r['sidePh']=='die'
      print(k,r,'OK' if ok else 'FAIL');fails+=0 if ok else 1
    print('JS errors',errs);await b.close()
  sys.exit(1 if fails or errs else 0)
asyncio.run(main())

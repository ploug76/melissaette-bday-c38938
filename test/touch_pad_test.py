import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
async def run(b,vw,tag):
  ctx=await b.new_context(viewport={'width':vw[0],'height':vw[1]},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  await pg.goto(URL);await pg.wait_for_timeout(1200);cdp=await ctx.new_cdp_session(pg)
  async def touch(typ,pts):await cdp.send('Input.dispatchTouchEvent',{'type':typ,'touchPoints':[{'x':x,'y':y,'id':i,'radiusX':8,'radiusY':8} for i,(x,y) in pts]})
  ev=pg.evaluate;R={}
  await ev("()=>{__T.start(2);window.__manual=1;__T.step(2);const G=__T.G;G.gens=[];G.evs=[];G.ents=[];G.p.inv=0}")
  L=await ev("()=>({pad:LY.pad,ab:LY.ab})");P=L['pad'];a=P['a'];A=L['ab']['a'];Bb=L['ab']['b']
  right=(P['cx']+a,P['cy']);left=(P['cx']-a,P['cy']);upr=(P['cx']+a*.9,P['cy']-a*.9);Ap=(A['cx'],A['cy']);Bp=(Bb['cx'],Bb['cy'])
  st=lambda n:ev(f"()=>{{__T.step({n});const p=__T.G.p;return {{x:p.x,y:p.y,on:p.on,vx:p.vx,held:{{...held}},ph:__T.G.ph}}}}")
  # 1 walk: hold right
  x0=(await st(0))['x'];await touch('touchStart',[(0,right)]);s=await st(40);R['walk']=dict(dx=round(s['x']-x0,1),held=s['held']);ok_walk=s['x']-x0>30 and s['held']['r']==1
  # 2 multi-touch: keep right held, tap A
  await touch('touchStart',[(0,right),(1,Ap)]);s1=await st(1);await st(8);await touch('touchEnd',[(1,Ap)]);s2=await st(12)
  R['multi']=dict(heldBoth=s1['held'],airborne=not s2['on'],y=round(s2['y'],1),rightStillHeld=s2['held']['r']);ok_multi=s1['held']['r']==1 and s1['held']['j']==1 and not s2['on'] and s2['held']['r']==1 and s2['held']['j']==0
  await pg.screenshot(path=f'multi_{tag}.png')
  # 3 slide right->left without lifting
  await touch('touchMove',[(0,(P['cx']+a*.2,P['cy']))]);await touch('touchMove',[(0,left)]);s=await st(1);ok_slide=s['held']['l']==1 and s['held']['r']==0;R['slide']=s['held']
  # 4 diagonal up-right = right + jump
  await touch('touchMove',[(0,upr)]);s=await st(1);ok_diag=s['held']['r']==1 and s['held']['j']==1;R['diag']=s['held']
  # 5 lift -> all clear
  await touch('touchEnd',[]);s=await st(1);ok_clear=not any(s['held'].values());R['clear']=s['held']
  # 6 B run: speed with B vs without
  await ev("()=>{__T.goScreen(0);const G=__T.G;G.gens=[];G.evs=[];G.ents=[];G.sol=G.sol.filter(s=>s.k=='ground'||s.k=='ceil');G.haz=[];G.p.inv=0}")
  await touch('touchStart',[(0,right)]);s=await st(30);v1=s['vx'];await touch('touchStart',[(0,right),(1,Bp)]);s=await st(30);v2=s['vx'];R['run']=dict(walk_vx=round(v1),run_vx=round(v2),heldB=s['held']['b'])
  await touch('touchEnd',[]);await st(1);ok_run=v2>v1+20
  # 7 stomp a snake using only the pad: hold right, tap A at the best moment (search delay)
  stomped=None
  for d in range(0,40,2):
    await ev("()=>{__T.goScreen(0);const G=__T.G;G.gens=[];G.evs=[];G.sol=G.sol.filter(s=>s.k=='ground'||s.k=='ceil');G.haz=[];G.items=[];G.p.inv=0;G.p.x=40;G.ents=[{k:'snake',x:110,y:GY,dir:1,v:0,x1:0,x2:999}]}")
    await touch('touchStart',[(0,right)]);await st(d);await touch('touchStart',[(0,right),(1,Ap)]);await st(14);await touch('touchEnd',[(1,Ap)]);await st(30);await touch('touchEnd',[])
    r=await ev("()=>{let k=0;for(;k<90;k++){__T.step(1);const G=__T.G;if(G.ph!='play'||!G.ents.some(e=>e.k=='snake'&&!e.dead))break}return {ph:__T.G.ph,alive:__T.G.ents.some(e=>e.k=='snake'&&!e.dead),k}}")
    if r['ph']=='play' and not r['alive']:stomped=d;break
  R['stomp']=dict(delayFrames=stomped);ok_stomp=stomped is not None
  # 8 pointercancel/blur reset
  await touch('touchStart',[(0,right),(1,Ap)]);await st(1);await touch('touchCancel',[]);s=await st(1);ok_cancel=not any(s['held'].values())
  await touch('touchStart',[(0,right)]);await st(1);await ev("()=>{window.dispatchEvent(new Event('blur'))}");s=await ev("()=>({...held})");ok_blur=not any(s.values());await touch('touchEnd',[])
  oks=dict(walk=ok_walk,multi=ok_multi,slide=ok_slide,diag=ok_diag,clear=ok_clear,run=ok_run,stomp=ok_stomp,cancel=ok_cancel,blur=ok_blur)
  print(tag,json.dumps(R),oks,'errors',errs);await ctx.close();return all(oks.values()) and not errs
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ok=True
    for tag,vw in [('portrait',(390,844)),('landscape',(844,390)),('se',(375,667))]:ok&=await run(b,vw,tag)
    await b.close();print('ALL OK' if ok else 'FAIL');sys.exit(0 if ok else 1)
asyncio.run(main())

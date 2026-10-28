# Melissaette (The Great Birthday Rescue): overlap + safety test. Every HUD pill, lane banner, control button, popup, menu button and DOM
# button registers its rect each frame (UIE). Asserts no two overlap, all stay inside the safe area, the Share/Install
# dock never touches a canvas button, and no JS errors. The search bot plays the whole journey IN the live game (rendering,
# banners, popups) while this checks every few frames; plus title / pause / game over / parade / cake.
import sys,asyncio,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
VIEWS=[(390,844,None),(360,640,None),(375,667,None),(430,932,None),(390,844,{'t':47,'r':0,'b':34,'l':0}),(844,390,{'t':0,'r':47,'b':21,'l':47}),(667,375,None),(1024,768,None),(1280,800,None)]
CHECK=r'''(tag)=>{const L=__T.layout(),E=L.els,S=L.SAFE,bad=[];const o=(a,b)=>a.x<b.x+b.w-.01&&b.x<a.x+a.w-.01&&a.y<b.y+b.h-.01&&b.y<a.y+a.h-.01;
 for(let i=0;i<E.length;i++){const a=E[i];if(a.x<S.l-.5||a.y<S.t-.5||a.x+a.w>S.r+.5||a.y+a.h>S.b+.5)bad.push(tag+' edge '+a.k);for(let j=i+1;j<E.length;j++)if(o(a,E[j]))bad.push(tag+' '+a.k+' x '+E[j].k)}
 const dk=['shareBtn','instBtn','dockHint'].map(i=>document.getElementById(i)).filter(e=>e&&getComputedStyle(e).display!=='none'&&e.getClientRects().length);
 for(const d of dk){const r=d.getBoundingClientRect();const q={x:r.left,y:r.top,w:r.width,h:r.height};for(const a of E)if((a.k.startsWith('btn:')||a.k.startsWith('dom:')||a.k.startsWith('title')||a.k=='dedication')&&o(q,a))bad.push(tag+' dock '+d.id+' x '+a.k)}
 return bad}'''
PLAY=r'''async ([sk,stress])=>{const T=__T;T.start(sk);const bad=[];let frames=0,pops=0;const CH=window.__CHECK;const BA=[{r:1},{r:1,j:1},{},{l:1},{l:1,j:1},{j:1},{d:1}];
 for(let guard=0;guard<60;guard++){const G=T.G;if(G.ph=='win'||T.layout().state!='play')break;const res=T.bsearch(G,T.screenGoals(G));if(!res.ok){bad.push('bot stuck at '+G.ri);break}
  for(const a of res.acts){T.setHeld(BA[a]);for(let k=0;k<8;k++){T.step(1);frames++;
    if(stress&&frames%41==0){FXQ.push(['pop','+'+(frames%900),T.G.p.x,T.G.p.y-30,'#fff'],['pop','+540',T.G.p.x+6,T.G.p.y-26,'#ff86a6']);if(frames%123==0)FXQ.push(['banner','Stress test banner number '+frames+' with quite a long message to fit','#fff']);T.runFX();pops+=2}
    if(frames%3==0){const b=CH('play');if(b.length)bad.push(...b.slice(0,3))}}
   if(T.layout().state!='play')break}}
 T.setHeld({});const G=T.G;return{frames,ri:G.ri,won:G.ph=='win'||T.layout().state=='parade',friends:G.friends.length,score:G.score,pops,bad:bad.slice(0,10),nbad:bad.length}}'''
async def main():
  tot=0;errsAll=[];notwon=0
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vi,(w,h,safe) in enumerate(VIEWS):
      ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=True);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      if safe:await ctx.add_init_script('window.__SAFE='+json.dumps(safe))
      await pg.goto(URL);await pg.wait_for_timeout(900);await pg.evaluate('()=>{window.__manual=1;window.__CHECK=eval('+json.dumps(CHECK)+')}')
      await pg.evaluate("()=>{if(window.__dock){__dock.resetHint();__dock.forceInstall();__dock.showHint()}}");await pg.wait_for_timeout(400)
      bad=[]
      bad+=await pg.evaluate("()=>{__T.step(2);__dock&&__dock.tick();return __CHECK('title')}")
      bad+=await pg.evaluate("()=>{__T.setFound(54);__T.toTitle();__T.step(2);__dock&&__dock.tick();const r=__CHECK('title+cake');__T.setFound(0);return r}")
      r=await pg.evaluate(PLAY,[2,True]);bad+=r['bad']
      if not r['won']:notwon+=1
      for nm,act in [('pause',"__T.start(2);__T.step(5);__T.togglePause();__T.step(2)"),('over',"__T.start(2);__T.G.score=4321;__T.gameOver();__T.step(2)"),
                     ('parade',"__T.start(2);__T.G.friends=[0,1,2,3,4,5,6];__T.toParade();__T.setSceneT(5);__T.step(3)"),('cake',"__T.toCake(false);__T.setSceneT(12);__T.step(3)"),
                     ('cakeReplay',"__T.toTitle();__T.toCake(true);__T.setSceneT(5);__T.step(3)")]:
        bad+=await pg.evaluate(f"()=>{{{act};return __CHECK('{nm}')}}")
        bad+=await pg.evaluate(f"()=>{{const n=__T.layout().els.filter(e=>e.k.startsWith('btn:')).length;return n?[]:['{nm} has no buttons']}}")
      line=f"{w}x{h}{' safe' if safe else ''}: bot played {r['frames']} frames, reached screen {r['ri']+1}, rescued GrannyHoot={r['won']}, friends {r['friends']}/7, score {r['score']}, stress popups {r['pops']}"
      print(line,'| overlaps',len(bad),bad[:6],flush=True)
      if errs:print('  JS ERRORS',errs[:5])
      tot+=len(bad);errsAll+=errs;await ctx.close()
    await b.close()
  print(f'TOTAL overlaps {tot} js_errors {len(errsAll)} unfinished_runs {notwon}');sys.exit(1 if tot or errsAll or notwon else 0)
asyncio.run(main())

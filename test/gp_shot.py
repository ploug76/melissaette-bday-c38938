import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
TARGET=int(sys.argv[2]) if len(sys.argv)>2 else 17
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page()
    await pg.goto(URL);await pg.wait_for_timeout(900)
    r=await pg.evaluate('''async (TG)=>{window.__manual=1;const T=__T;T.start(3);const BA=[{r:1},{r:1,j:1},{},{l:1},{l:1,j:1},{j:1},{d:1}];
     for(let guard=0;guard<60;guard++){const G=T.G;if(G.ri>=TG)break;const res=T.bsearch(G,T.screenGoals(G));if(!res.ok)break;for(const a of res.acts){T.setHeld(BA[a]);T.step(8);if(T.G.ri>=TG)break}}
     for(let k=0;k<12;k++){const res=T.bsearch(T.G,T.screenGoals(T.G));if(!res.ok)break;T.setHeld(BA[res.acts[0]]);T.step(8)}
     return T.G.ri}''',TARGET)
    await pg.screenshot(path='../gameplay.png');print('screen',r);await b.close()
asyncio.run(main())

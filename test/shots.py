import asyncio,sys
from playwright.async_api import async_playwright
URL='http://localhost:8800/melissaette-bday-c38938/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h,tag) in [(390,844,'p'),(844,390,'l'),(667,375,'ls')]:
      ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto(URL);await pg.wait_for_timeout(700);await pg.evaluate("()=>{window.__manual=1}")
      await pg.screenshot(path=f'v_{tag}_title.png')
      await pg.evaluate("()=>{__T.start(2);__T.goScreen(4);__T.setHeld({r:1});__T.step(70)}");await pg.screenshot(path=f'v_{tag}_play.png')
      await pg.evaluate("()=>{__T.setHeld({});__T.togglePause();__T.step(2)}");await pg.screenshot(path=f'v_{tag}_pause.png')
      await pg.evaluate("()=>{__T.togglePause();__T.G.friends=[0,1,2,3,4,5,6];__T.toParade();__T.setSceneT(4.5);__T.step(2)}");await pg.screenshot(path=f'v_{tag}_parade.png')
      await pg.evaluate("()=>{__T.toCake(false);__T.setSceneT(7);__T.step(60)}");await pg.screenshot(path=f'v_{tag}_cake.png')
      await pg.evaluate("()=>{__T.start(2);__T.G.score=12345;__T.gameOver();__T.step(2)}");await pg.screenshot(path=f'v_{tag}_over.png')
      print(tag,errs);await ctx.close()
    await b.close()
asyncio.run(main())

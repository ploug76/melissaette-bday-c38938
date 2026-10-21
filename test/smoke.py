import asyncio,sys,json
from playwright.async_api import async_playwright
URL='http://localhost:8800/melissaette-bday-c38938/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto(URL);await pg.wait_for_timeout(800);await pg.screenshot(path='s_title.png')
    await pg.evaluate("()=>{window.__manual=1;__T.start(2)}")
    await pg.evaluate("()=>{__T.setHeld({r:1});__T.step(90)}");await pg.screenshot(path='s_play.png')
    for ri in [3,6,9,12,15,18,20]:
      await pg.evaluate(f"()=>{{__T.goScreen({ri});__T.setHeld({{}});__T.step(100)}}");await pg.screenshot(path=f's_scr{ri}.png')
    print('errs',errs[:5])
    await b.close()
asyncio.run(main())

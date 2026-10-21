import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(1500)
    sw=await pg.evaluate("async()=>{const r=await navigator.serviceWorker.ready;return !!r.active}")
    await pg.tap('#mute');m1=await pg.evaluate("()=>localStorage.length");muted=await pg.evaluate("()=>document.getElementById('mute').textContent")
    await pg.tap('#mute')
    await pg.evaluate("()=>__T.start(2)");await pg.wait_for_timeout(400)
    await pg.evaluate("()=>window.dispatchEvent(new Event('blur'))");await pg.wait_for_timeout(200);ap=await pg.evaluate("()=>paused")
    await pg.evaluate("()=>__T.togglePause()");up=await pg.evaluate("()=>paused")
    await pg.evaluate("()=>{window.__manual=1;__T.goScreen(9);__T.setHeld({r:1});__T.step(75);__T.setHeld({})}");await pg.screenshot(path='../gameplay.png')
    caches=await pg.evaluate("async()=>(await caches.keys())")
    await ctx.set_offline(True);await pg.reload();await pg.wait_for_timeout(1200);off=await pg.evaluate("()=>typeof __T==='object'&&state")
    img=await pg.evaluate("()=>TITLE_IMG.complete&&TITLE_IMG.naturalWidth")
    print('sw',sw,'mutedIcon',muted,'autopause',ap,'resume->paused',up,'caches',caches,'offline state',off,'title img offline',img,'errors',errs)
    await b.close()
asyncio.run(main())

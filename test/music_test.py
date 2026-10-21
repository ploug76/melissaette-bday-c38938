import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8800/melissaette-bday-c38938/'
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(800);await pg.tap('canvas',position={'x':200,'y':760})
    await pg.evaluate("()=>{__T.start(2)}");await pg.wait_for_timeout(2600)
    r=await pg.evaluate("()=>({song:songName,title:SONG_TITLES[songName],ac:ac&&ac.state,step:mStep,banner:banner&&banner.s||banner&&banner.text||JSON.stringify(banner),q:bannerQ.map(x=>x.s||x.text||x[0])})")
    await pg.screenshot(path='song_banner.png')
    out=[]
    for zi in range(8):
      out.append(await pg.evaluate(f"()=>{{const z=ZONES[{zi}];playSong(z.music,true);return [z.name,songName,SONG_TITLES[songName]]}}"))
    print(r);[print(o) for o in out];print('errors',errs);await b.close()
asyncio.run(m())

import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 and sys.argv[1].startswith('http') else 'http://localhost:8800/melissaette-bday-c38938/'
RUNS=[(1,1),(2,1),(3,1),(4,1),(2,2),(3,3)]
if '--quick' in sys.argv:RUNS=[(2,1)]
async def main():
  fails=0
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(500);await pg.evaluate("()=>{window.__manual=1}")
    for sk,rd in RUNS:
      r=await pg.evaluate(f"()=>__T.botPlay({sk},{rd})")
      bad=[o for o in r['out'] if not o['ok']]
      print(f"skill {r['skill']:9s} round {rd}: screens {r['cleared']}/{r['screens']} rescued PapaSmurf={r['won']} friends {r['friends']}/7 score {r['score']} deterministic={r['detAll']} {r['ms']/1000:.1f}s",('FAIL '+json.dumps(bad)) if bad else '',flush=True)
      if not r['won'] or r['friends']<7 or not r['detAll']:fails+=1
    if '--candles' in sys.argv or '--quick' not in sys.argv:
      c=await pg.evaluate("()=>__T.candleProof(2)")
      print(f"candles reachable (collect + finish screen): {c['ok']}/{c['total']}",'FAIL '+json.dumps(c['fail']) if c['fail'] else '',flush=True)
      if c['ok']!=54 or c['total']!=54:fails+=1
    print('JS errors',errs[:3]);await b.close()
  print('BOT FAILURES',fails+len(errs));sys.exit(1 if fails or errs else 0)
asyncio.run(main())

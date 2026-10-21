# Renders the in-game vector portrait (src/c2_portrait.js) to transparent PNGs for the cover/icons.
import asyncio,base64
from playwright.async_api import async_playwright
JS=open('/workspace/melissaette-bday-c38938/src/c2_portrait.js').read()
JOBS=[('art/mel_portrait.png',680,900,'smile',0.0),('art/mel_portrait_wave.png',680,900,'wave',0.15),('art/mel_portrait_happy.png',680,900,'happy',0.3)]+[(f'art/anim/mel_{i}.png',680,900,'wave',i*0.112) for i in range(8)]
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page()
    await pg.set_content('<canvas id=c></canvas><script>'+JS+'</script>')
    for path,w,h,mood,t in JOBS:
      url=await pg.evaluate(f"""()=>{{const c=document.getElementById('c');c.width={w};c.height={h};window.g=c.getContext('2d');g.clearRect(0,0,{w},{h});drawMelPortrait({w}/2,{h}-6,({h}-14)/1.07,'{mood}',{t});return c.toDataURL('image/png')}}""")
      open('/workspace/melissaette-bday-c38938/'+path,'wb').write(base64.b64decode(url.split(',')[1]))
    await b.close()
asyncio.run(m());print('ok')

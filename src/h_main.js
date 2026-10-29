// ---------- flow
let state='title',paused=false,panelOpen=false,skill=CL(ST.get('skill',2),1,4),foundEver=ST.get('candles',[]),gt=0,overAt=-9,acc=0,cakeSongT=0,cakeReplay=false;
function start(){A();G=newGame(skill);state='play';paused=false;PARTS=[];POPS=[];bannerQ=[];banner=null;laneMsg=null;setBanner(ZONES[0].taunt,'#ffd84a');songBanner(ZONES[0].music);playSong(ZONES[0].music);chrome()}
function toTitle(){state='title';paused=false;G=null;PARTS=[];POPS=[];banner=null;bannerQ=[];laneMsg=null;playSong('title');chrome()}
function gameOver(){state='over';overAt=gt;const hs=ST.get('scores',[]);const e={s:G.score,k:G.skill,r:G.round};hs.push(e);hs.sort((a,b)=>b.s-a.s);G.rank=hs.indexOf(e);if(G.rank>4)G.rank=-1;ST.set('scores',hs.slice(0,5));
 const best=ST.get('best',0);G.newBest=G.score>best&&G.score>0;if(G.newBest)ST.set('best',G.score);SFX.over();song=null;chrome()}
function toParade(){state='parade';sceneT=0;PARTS=[];POPS=[];banner=null;bannerQ=[];playSong('parade');const best=ST.get('best',0);if(G.score>best)ST.set('best',G.score);chrome()}
function endParade(){if(foundEver.length>=TOTAL_CANDLES)toCake(false);else nextRound()}
function toCake(replay){cakeReplay=replay;if(replay&&!G){G=newGame(skill);G.friends=[0,1,2,3,4,5,6];G.cont=false}else if(G)G.cont=!replay||G.cont;state='cake';sceneT=0;cakeSongT=-.3;PARTS=[];playSong('bday',true);chrome()}
function endCake(){if(cakeReplay&&!G.cont){toTitle();return}nextRound()}
function nextRound(){G.round++;G.ri=0;G.entryX=10;G.friends=[];G.found=[];G.gifts=[];G.energy=100;G.ph='play';G.p=newPlayer(10);buildScreen(G,1);state='play';laneMsg=null;
 setBanner(`Round ${G.round}! More lands, faster critters!`,'#ffd84a');songBanner(ZONES[0].music);playSong(ZONES[0].music);chrome()}
function togglePause(){if(state!='play')return;paused=!paused;held={l:0,r:0,d:0,j:0};ptrs.clear();chrome()}
function chrome(){$('pause').style.display=state=='play'?'block':'none';$('mute').style.display='block';$('help').style.display=state=='title'||state=='play'?'block':'none';$('pause').textContent=paused?'▶':'⏸';$('pause').setAttribute('aria-label',paused?'Resume':'Pause');try{if(window.__dock)__dock.tick()}catch(e){}}
function showHelp(){if(state=='play'&&!paused)togglePause();panelOpen=true;$('ptext').innerHTML=`<h2>🎂 Melissa Time: The Great Birthday Rescue</h2>
<p>Grumpy <b>Baron Humbug</b>, who hates birthday parties, and his sneaky raccoon <b>Smudge</b> have carried off Melissaette's seven woodland Party Pals! Walk right, screen by screen, through the village, fields, hills, river, woods and cavern to the castle, and set everyone free.</p>
<h3>Controls</h3><ul><li>🎮 <b>Controller</b> (Xbox, PlayStation or Switch; USB or Bluetooth, on a computer or paired to your phone): stick or D-pad to walk and duck, <b>A</b> jump (hold for higher), <b>B</b> or <b>X</b> run, <b>Start</b> pause, <b>Select</b> sound. Menus: D-pad + A, B goes back.</li><li><b>Swipe</b> anywhere: drag sideways to walk (she keeps walking while your finger stays down and stops when you let go), swipe up to jump, swipe down to duck (under low bats, hawks and spiders). Tap to hop.</li><li><b>A</b>: jump. Tap for a hop, <b>hold for a higher jump</b>.</li><li><b>B</b>: hold to <b>run</b> faster (hold B while swiping right, then A for a long jump).</li><li><b>Big Leap</b>: tap A again <i>right away</i> while rising, for extra-long gaps.</li><li>Keyboard: arrows / WASD, Space or ↑ to jump, ↓ to duck, Shift or X to run, P pause, M mute.</li></ul><h3>Watch out</h3><ul><li>Fences, spiky grass, stalagmites and castle spikes: one touch and she takes a pratfall.</li><li>Rivers and pits: don't fall in! Bridges crumble behind you, and trapdoors creak open.</li><li>Bats, hawks, spiders and snakes (not on STROLL skill).</li><li>Baron Humbug throws slippery potions, spells and nets. Smudge pounces and knocks things down from trees.</li></ul>
<h3>Energy</h3><p>Her energy drains as she walks and refills only when she reaches a <b>new land</b>. Leftover energy is bonus points!</p>
<h3>Gifts</h3><ul><li>🫧 Bubble shield: saves you from one oops.</li><li>👟 Spring shoes: higher jumps for 20 s.</li><li>🐌 Snail-time: slows critters and villains.</li><li>🧁 Cupcake: +50 energy.</li></ul>
<h3>🎵 Soundtrack</h3><p>Every land plays its own 8-bit 80s movie hit: Pretty in Pink, Don't You (Forget About Me), Footloose, Girls Just Want to Have Fun, The Power of Love, Take My Breath Away, Ghostbusters and Danger Zone, with The Time of My Life on the title and parade.</p><h3>🕯️ 54 birthday candles</h3><p>54 candles are hidden along the way. Some only appear when you get close, and some need a high jump or a Big Leap. Candles you've found stay found on this device. Find all 54 for a secret birthday surprise at the end!</p>
<h3>Points</h3><table><tr><td>Jump an obstacle (land safely)</td><td>200–300</td></tr><tr><td>Candle</td><td>540</td></tr><tr><td>Gift</td><td>250</td></tr><tr><td>Free a friend</td><td>1,000</td></tr><tr><td>Bell-rope in the lab</td><td>500</td></tr><tr><td>Rescue Granny Hoot</td><td>10,000</td></tr></table>
<p>Extra life every 20,000. After each rescue the journey repeats with more screens and faster critters. An original 8-bit birthday adventure made for Melissa's 54th birthday.</p>`;$('panel').style.display='flex';chrome()}
$('pclose').onclick=e=>{e.stopPropagation();$('panel').style.display='none';panelOpen=false};
['pointerdown','touchstart','mousedown'].forEach(ev=>{$('panel').addEventListener(ev,e=>e.stopPropagation());document.querySelectorAll('.tb').forEach(b=>b.addEventListener(ev,e=>e.stopPropagation()))});
$('mute').onclick=e=>{e.stopPropagation();A();setMute(!muted);if(!muted&&!musicOn)playSong(curMusic())};
$('pause').onclick=e=>{e.stopPropagation();A();togglePause()};
$('help').onclick=e=>{e.stopPropagation();A();showHelp()};
function songBanner(id){if(SONG_TITLES[id])setBanner('♪ '+SONG_TITLES[id],'#ff86a6')}
function curMusic(){return state=='play'&&G?ZONES[G.zi].music:state=='parade'?'parade':state=='cake'?'bday':'title'}
// ---------- input: B/A buttons (multi-touch), swipe anywhere (no D-pad, Peter 10/28), keyboard
let held={l:0,r:0,d:0,j:0,b:0},keys={l:0,r:0,d:0,j:0,b:0},ptrs=new Map(),downBtn=null,padHeld={u:0,a:0};
const inR=(b,x,y,p=0)=>x>=b.x-p&&x<=b.x+b.w+p&&y>=b.y-p&&y<=b.y+b.h+p;
// D-pad: direction from the pad centre (8-way: diagonals press both), works even if the thumb slides off the pad
function padDirs(x,y){const P=LY.pad,dx=x-P.cx,dy=y-P.cy,ax=Math.abs(dx),ay=Math.abs(dy),o=[];if(Math.hypot(dx,dy)<P.a*.32)return o;
 const T=2.414;if(ax>ay/T)o.push(dx>0?'r':'l');if(ay>ax/T)o.push(dy>0?'d':'u');return o}
function onPad(x,y){const P=LY.pad,h=P.a*1.5+14;return Math.abs(x-P.cx)<=h&&Math.abs(y-P.cy)<=h}
// B/A: every button whose (padded) circle holds the point, so a thumb between them presses both
function abAt(x,y,pad=12){const o=[];for(const k of ['b','a']){const q=LY.ab[k];if(Math.hypot(x-q.cx,y-q.cy)<=q.r+pad)o.push(k)}return o}
function inPanel(x,y){return LY.panel.some(p=>inR(p,x,y,0))}
function recompute(){const h={l:0,r:0,d:0,j:0,b:0},ph={u:0,a:0};for(const q of ptrs.values()){
  if(q.pad)for(const k of q.pad){if(k=='u'){h.j=1;ph.u=1}else h[k]=1}
  if(q.ab)for(const k of q.ab){if(k=='a'){h.j=1;ph.a=1}else h.b=1}
  if(q.sw)for(const k of q.sw)h[k]=1}
 for(const k in h)h[k]=h[k]||keys[k];
 for(const k of ['l','r','d','j','b'])if(h[k]&&!held[k])vib(10);held=h;padHeld=ph}
function resetInput(){ptrs.clear();keys={l:0,r:0,d:0,j:0,b:0};recompute()}
c.addEventListener('pointerdown',e=>{e.preventDefault();A();if(!musicOn)playSong(curMusic());const x=e.clientX,y=e.clientY;
 if(state!='play'||paused){downBtn=menuBtns.find(b=>inR(b,x,y,4))||null;return}
 try{c.setPointerCapture(e.pointerId)}catch(_){}
 const ab=abAt(x,y);if(ab.length){ptrs.set(e.pointerId,{ab});recompute();return}
 ptrs.set(e.pointerId,{x0:x,y0:y,t0:performance.now(),sw:[],moved:false});recompute()},{passive:false});
c.addEventListener('pointermove',e=>{const q=ptrs.get(e.pointerId);if(!q||q.dead)return;const x=e.clientX,y=e.clientY;
 if(q.pad){const d=padDirs(x,y);if(d.join()!=q.pad.join()){q.pad=d;recompute()}return}
 if(q.ab){const b=abAt(x,y,16);if(b.length&&b.join()!=q.ab.join()){q.ab=b;recompute()}return}
 const dx=x-q.x0,dy=y-q.y0,th=16;const sw=[];if(dy<-th&&Math.abs(dy)>Math.abs(dx)*.6)sw.push('j');else if(dy>th&&Math.abs(dy)>Math.abs(dx))sw.push('d');if(Math.abs(dx)>th&&Math.abs(dx)>Math.abs(dy)*.6)sw.push(dx>0?'r':'l');
 if(sw.length)q.moved=true;q.sw=sw;recompute()});
// no stuck inputs, no scrolling/zooming/long-press menus on the controller
c.addEventListener('contextmenu',e=>e.preventDefault());
['touchstart','touchmove'].forEach(ev=>c.addEventListener(ev,e=>{if(e.cancelable)e.preventDefault()},{passive:false}));
['touchend','touchcancel'].forEach(ev=>c.addEventListener(ev,e=>{if(e.cancelable)e.preventDefault();if(ev=='touchcancel'||!e.touches.length){ptrs.clear();recompute()}},{passive:false}));
let tapJump=0;
function ptrEnd(e){const q=ptrs.get(e.pointerId);if(q){ptrs.delete(e.pointerId);if(!q.pad&&!q.ab&&!q.dead&&!q.moved&&performance.now()-q.t0<300&&e.type=='pointerup')tapJump=8;recompute()}
 if(downBtn&&e.type=='pointerup'){const x=e.clientX,y=e.clientY;const b=menuBtns.find(b=>inR(b,x,y,6));if(b&&b.x==downBtn.x&&b.y==downBtn.y){SFX.click();b.fn()}}downBtn=null}
c.addEventListener('pointerup',ptrEnd);c.addEventListener('pointercancel',ptrEnd);c.addEventListener('lostpointercapture',e=>{if(ptrs.has(e.pointerId)){ptrs.delete(e.pointerId);recompute()}});
const KM={Shift:'b',x:'b',X:'b',ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r',ArrowDown:'d',s:'d',S:'d',ArrowUp:'j',w:'j',W:'j',' ':'j',z:'j',Z:'j'};
addEventListener('keydown',e=>{if(panelOpen){if(e.key=='Escape'||e.key=='Enter'){$('pclose').click();e.preventDefault()}return}A();const k=KM[e.key];
 if(k&&state=='play'&&!paused){e.preventDefault();keys[k]=1;recompute();return}
 if(e.key=='p'||e.key=='P'||e.key=='Escape'){togglePause();return}if(e.key=='m'||e.key=='M'){setMute(!muted);return}
 if(e.key=='Enter'||e.key==' '){e.preventDefault();if(state=='title')start();else if(state=='over'&&gt-overAt>.8)start();else if(paused)togglePause();else if(state=='parade'&&sceneT>2.5)endParade();else if(state=='cake'&&(cakeSongT>11||cakeReplay))endCake()}});
addEventListener('keyup',e=>{const k=KM[e.key];if(k){keys[k]=0;recompute()}});
function bg(){if(state=='play'&&!paused)togglePause();resetInput()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)bg()});addEventListener('pagehide',bg);addEventListener('blur',bg);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
// ---------- effects queue from the (pure) simulation
let lastZi=-1;
function runFX(){for(const a of FXQ){const k=a[0];
 if(k=='sfx'){if(SFX[a[1]])SFX[a[1]]()}else if(k=='pop')POPS.push({s:a[1],x:a[2],y:a[3],col:a[4],t:0});
 else if(k=='banner')setBanner(a[1],a[2]);
 else if(k=='dust'){for(let i=0;i<4;i++)part(a[1],a[2]-1,(Math.random()-.5)*40,-Math.random()*20,'#e6ce80',.35,2,60)}
 else if(k=='poof'){for(let i=0;i<10;i++)part(a[1],a[2],(Math.random()-.5)*80,(Math.random()-.7)*70,['#fff','#e8e8e8','#ffd84a'][i%3],.4,2,80)}
 else if(k=='spark'){for(let i=0;i<10;i++)part(a[1],a[2],(Math.random()-.5)*90,(Math.random()-.8)*90,['#fff','#ffd84a','#42ebf5'][i%3],.6,2,120)}
 else if(k=='splashfx'){for(let i=0;i<14;i++)part(a[1],GY+4,(Math.random()-.5)*80,-60-Math.random()*90,'#42ebf5',.8,2,300);SFX.splash()}
 else if(k=='candle'){const id=a[1];if(!foundEver.includes(id)){foundEver.push(id);ST.set('candles',foundEver);if(foundEver.length==TOTAL_CANDLES)setBanner('ALL 54 CANDLES! A birthday surprise awaits!','#ff86a6');else setBanner(`Birthday candle ${foundEver.length} of 54!`,'#ff86a6')}SFX.candle();for(let i=0;i<14;i++)part(a[2],a[3]-12,(Math.random()-.5)*80,(Math.random()-.9)*80,['#ffb020','#fff6a0','#ff86a6'][i%3],.7,2,90)}
 else if(k=='friend'){for(let i=0;i<20;i++)part(a[2],a[3]-20,(Math.random()-.5)*120,-Math.random()*120,['#5edc78','#ffd84a','#fff'][i%3],.9,2,160)}
 else if(k=='zone'){SFX.zone();setBanner(`${ZONES[a[1]].name}!  Energy refilled  (+${a[2]})`,'#5edc78');setBanner(ZONES[a[1]].taunt,'#c95bba');songBanner(ZONES[a[1]].music);playSong(ZONES[a[1]].music)}
 else if(k=='screen'){PARTS=[];POPS=POPS.filter(q=>q.t>9)}}FXQ=[]}
// ---------- render + main loop (fixed 60 Hz game time; frozen while paused/backgrounded)
function render(rdt){UIE=domRects();menuBtns=[];g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.fillStyle='#0d0a24';g.fillRect(0,0,c.width,c.height);g.setTransform(DPR,0,0,DPR,0,0);
 const F=LY.field;// field frame
 rr(F.x-3,F.y-3,F.w+6,F.h+6,6,null,'#5455ed',3);
 g.save();g.beginPath();g.rect(F.x,F.y,F.w,F.h);g.clip();g.setTransform(DPR*LY.ws,0,0,DPR*LY.ws,DPR*F.x,DPR*F.y);g.imageSmoothingEnabled=false;
 if(state=='title'){drawTitleWorld(gt)}
 else if(state=='parade')drawParadeWorld(sceneT);else if(state=='cake')drawCakeWorld(sceneT);
 else if(G){const z=ZONES[G.zi],def=defOf(RT(G)[G.ri]);drawBG(z.theme,G.gt,G.zi);drawDeco(def,z.theme,G.gt);drawSolids(G,z.theme,G.gt);drawPuddles(G,G.gt);for(const h of G.haz){if(h.k=='fence')fence(h.x,h.y);else if(h.k=='stal')stal(h.x,h.y);else grassT(h.x,h.y,h.w,h.k)}
  drawBoss(G,G.gt);drawItems(G,G.gt);drawEnts(G,G.gt);drawPlayer(G,G.gt)}
 drawParts(rdt);g.restore();g.setTransform(DPR,0,0,DPR,0,0);
 if(state=='title')drawTitle();
 else if(state=='play'){if(!paused){drawHUD();drawLane();drawControls();drawPops(rdt)}else drawPause()}
 else if(state=='over')drawOver();
 else{drawSceneText();drawLaneScene();drawSceneButtons()}
 BTN=state=='title'?menuBtns.slice():[]}
function drawLaneScene(){if(!laneMsg)return;const L=LY.lane,s=laneMsg.s,sz=fitSize(s,15,L.w-20);g.font=font(sz);const w=Math.min(L.w,g.measureText(s).width+24),x=L.x+(L.w-w)/2;rr(x,L.y,w,L.h,10,'rgba(10,6,30,.75)',laneMsg.c,1.5);txt(s,x+w/2,L.y+L.h/2+1,sz,laneMsg.c);reg('lane',x,L.y,w,L.h)}
function drawTitleWorld(t){drawBG('meadow',t,3);const T=TH.meadow;R(0,GY,FW,FH-GY,T.dirt);R(0,GY,FW,4,T.top);R(0,GY+4,FW,2,T.top2);drawDeco([['deco','cottage',14],['deco','cottage',60],['deco','flowers',110],['deco','sign',150]],'meadow',t);
 for(let i=0;i<6;i++){const x=200+i*9;candle(x,GY,t,false)}}
let lastT=0;
function frame(now){requestAnimationFrame(frame);let rdt=Math.min(.05,(now-lastT)/1000||0);lastT=now;const run=!window.__manual&&!paused&&!panelOpen&&!document.hidden;if(!run)rdt=0;gt+=rdt;
 if(run)advance(rdt);render(rdt)}
function advance(rdt){if(banner){banner.t+=rdt;if(banner.t>(bannerQ.length?2.2:3.4))nextBanner()}
 if(state=='parade'||state=='cake'){sceneT+=rdt;if(state=='cake')cakeSongT+=rdt;return}
 if(state!='play'||!G)return;acc+=rdt;let n=0;while(acc>=DT&&n<4){acc-=DT;n++;const IN={l:held.l,r:held.r,d:held.d,j:held.j||tapJump>0,b:held.b};if(tapJump>0)tapJump--;step(G,IN);runFX();
  if(G.ph=='over'){gameOver();return}if(G.ph=='win'&&G.pht>3){toParade();return}}if(n==4)acc=0}
onResize();buildFolk();setMute(muted);chrome();playSong('title');requestAnimationFrame(t=>{lastT=t;frame(t)});

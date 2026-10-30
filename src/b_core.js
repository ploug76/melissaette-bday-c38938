'use strict';
const GAME_ID='melissaette-bday';
const $=id=>document.getElementById(id),c=$('c');let g=c.getContext('2d');
const CL=(v,a,b)=>v<a?a:v>b?b:v,TAU=Math.PI*2,PI=Math.PI;
const FONT='"Trebuchet MS","Segoe UI",system-ui,-apple-system,sans-serif',MONO='ui-monospace,Menlo,Consolas,"Courier New",monospace';
// world constants (logical pixels, ColecoVision-sized 256x192 screens)
const FW=256,FH=192,GY=160,DT=1/60;
// ---------- storage
const ST={get(k,d){try{const v=localStorage.getItem(GAME_ID+':'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(GAME_ID+':'+k,JSON.stringify(v))}catch(e){}}};
// ---------- safe area + layout (all layout in CSS px; the dock reads SC/OXs/OYs = identity)
const SC=1,OXs=0,OYs=0;
let SAFE={t:0,r:0,b:0,l:0},VW=390,VH=844,DPR=1,LY=null;
function readSafe(){try{if(window.__SAFE){SAFE=Object.assign({t:0,r:0,b:0,l:0},window.__SAFE);return}const d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';document.body.appendChild(d);const cs=getComputedStyle(d);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0};d.remove()}catch(e){}}
function onResize(){readSafe();VW=innerWidth;VH=innerHeight;DPR=Math.min(devicePixelRatio||1,3);c.width=Math.round(VW*DPR);c.height=Math.round(VH*DPR);LY=computeLayout();[['pause',6],['mute',54],['help',102]].forEach(([id,r])=>{const e=$(id);e.style.top=(SAFE.t+6)+'px';e.style.right=(SAFE.r+r)+'px'})}
function computeLayout(){const L=SAFE.l,R=VW-SAFE.r,T=SAFE.t,B=VH-SAFE.b,aw=R-L,ah=B-T;const portrait=ah>=aw*1.12;const o={L,R,T,B,aw,ah,portrait};
 o.dom={x:R-150,y:T+6,w:144,h:42};
 // retro 8-bit controller: cross D-pad (arm = a px, >=56) + round B/A buttons (radius br)
 if(portrait){o.rows=[{x:L+8,y:T+6,w:aw-8-156,h:42},{x:L+8,y:T+52,w:aw-16,h:30}];
  const a=CL(Math.floor(Math.min(aw/7,ah*.09)),56,72),br=CL(Math.round(a*.6),33,42),ph=3*a+58;
  let fw=Math.min(aw,(ah-88-30-ph-10)*4/3);fw=Math.max(160,fw);const fh=fw*.75;const spare=Math.max(0,ah-88-fh-28-8-ph-6),top=T+88+Math.round(spare*.45);
  o.field={x:L+(aw-fw)/2,y:top,w:fw,h:fh};o.lane={x:L+8,y:top+fh+4,w:aw-16,h:24};
  const py=Math.max(o.lane.y+o.lane.h+8,B-6-ph);o.panel=[{x:L+6,y:py,w:aw-12,h:B-6-py}];
  const cy=py+14+1.5*a+6;o.pad={cx:L+6+14+1.5*a,cy,a};
  // Oct 30 (Peter): JUMP (A) bottom-right, RUN (B) bottom-left, mirrored; swipe hint centered
  const ax=R-6-16-br,bx=L+6+16+br;o.pad.cx=(L+R)/2;
  o.ab={b:{cx:bx,cy:cy+br*.35,r:br},a:{cx:ax,cy:cy+br*.35,r:br}};
  o.ctrlArea={x:L,y:py,w:aw,h:B-py}}
 else{o.rows=[{x:L+8,y:T+6,w:aw-8-156,h:42}];const top=T+54;const a=CL(Math.floor(ah*.15),56,68),br=CL(Math.round(a*.6),33,40),side=Math.max(3*a+24,4*br+44);
  let fh=ah-54-32,fw=fh*4/3;if((aw-fw)/2<side){fw=aw-2*side;fh=fw*.75}if(fh>ah-54-32){fh=ah-86;fw=fh*4/3}
  o.field={x:L+(aw-fw)/2,y:top,w:fw,h:fh};o.lane={x:o.field.x,y:top+fh+4,w:fw,h:24};
  const sw=o.field.x-L,cy=B-10-1.5*a;o.pad={cx:L+sw/2,cy,a};
  const rx0=o.field.x+fw,rsw=R-rx0,acx=rx0+rsw/2+br+6,bcy=B-44-br;
  // Oct 30 (Peter): JUMP (A) bottom-right, RUN (B) bottom-left, mirrored; swipe hint above RUN
  o.ab={b:{cx:L+sw/2,cy:bcy,r:br},a:{cx:rx0+rsw/2,cy:bcy,r:br}};o.pad.cy=bcy-br-34;
  const pty=o.pad.cy-32;
  o.panel=[{x:L+4,y:pty,w:sw-8,h:B-4-pty},{x:rx0+4,y:pty,w:rsw-8,h:B-4-pty}];
  o.side=[{x:L+8,y:top,w:sw-16,h:Math.max(0,o.panel[0].y-top-8)},{x:rx0+8,y:top,w:rsw-16,h:Math.max(0,o.panel[1].y-top-8)}];
  o.ctrlArea=null}
 // bounding boxes (used by scene buttons / overlap tests); j = A button
 const bb=q=>({x:q.cx-q.r,y:q.cy-q.r,w:2*q.r,h:2*q.r});const P=o.pad;
 o.btn={pad:{x:P.cx-1.5*P.a,y:P.cy-24,w:3*P.a,h:48},b:bb(o.ab.b),j:bb(o.ab.a)};
 o.ws=o.field.w/FW;return o}
addEventListener('resize',onResize);
const ovl=(a,b,p=0)=>a.x<b.x+b.w+p&&b.x<a.x+a.w+p&&a.y<b.y+b.h+p&&b.y<a.y+a.h+p;
// UI registry: every drawn UI box registers itself here each frame (overlap test reads it)
let UIE=[],menuBtns=[],BTN=[];
function reg(k,x,y,w,h){const e={k,x,y,w,h};UIE.push(e);return e}
function freeAt(r){return !UIE.some(e=>ovl(e,r,1))}
// ---------- seeded RNG (gameplay determinism; the bot clones state and replays it)
function rngNext(G){let t=(G.seed+=0x6D2B79F5)|0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
// ---------- audio
let ac=null,master=null,musicGain=null,sfxGain=null,muted=ST.get('mute',false),SIM=false;
function A(){try{if(!ac){ac=new(window.AudioContext||webkitAudioContext)();master=ac.createGain();master.connect(ac.destination);sfxGain=ac.createGain();sfxGain.gain.value=.5;sfxGain.connect(master);musicGain=ac.createGain();musicGain.gain.value=.22;musicGain.connect(master);master.gain.value=muted?0:1}
 if(ac.state=='suspended')ac.resume()}catch(e){}return ac}
function setMute(m){muted=m;ST.set('mute',m);if(master)master.gain.value=m?0:1;$('mute').textContent=m?'🔇':'🔊'}
function tone(f,d=.1,type='square',v=.3,f2=0,dl=0,dest){const a=ac;if(SIM||!a||muted||a.state!='running')return;const t=a.currentTime+dl,o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);
 gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(v,t+.008);gn.gain.setValueAtTime(v,t+Math.max(.01,d*.7));gn.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(gn);gn.connect(dest||sfxGain);o.start(t);o.stop(t+d+.03)}
let nbuf=null;function noise(d=.1,v=.3,fq=1000,q=1,type='bandpass',dl=0,f2=0,dest){const a=ac;if(SIM||!a||muted||a.state!='running')return;if(!nbuf){nbuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const ch=nbuf.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
 const t=a.currentTime+dl,s=a.createBufferSource(),f=a.createBiquadFilter(),gn=a.createGain();s.buffer=nbuf;s.loop=true;f.type=type;f.frequency.setValueAtTime(fq,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);f.Q.value=q;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(gn);gn.connect(dest||sfxGain);s.start(t,Math.random());s.stop(t+d+.03)}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const SFX={
 jump(){tone(330,.09,'square',.08,700)},
 big(){tone(392,.07,'square',.08,880);tone(660,.12,'square',.07,1320,.06)},
 land(){noise(.04,.08,500,1)},
 step(){noise(.02,.03,1800,2)},
 candle(){[1047,1319,1568,2093].forEach((f,i)=>tone(f,.08,'triangle',.09,0,i*.045))},
 ghost(){tone(1568,.06,'triangle',.05)},
 gift(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.09,'square',.07,0,i*.06))},
 friend(){[784,988,1175,1568].forEach((f,i)=>tone(f,.12,'square',.08,0,i*.08));[392,494,587,784].forEach((f,i)=>tone(f,.14,'triangle',.12,0,i*.08))},
 points(){tone(1318,.05,'square',.05);tone(1760,.06,'square',.05,0,.05)},
 hit(){noise(.25,.35,700,1.2);tone(600,.45,'square',.12,90)},
 fall(){tone(880,.7,'triangle',.12,110)},
 splash(){noise(.5,.4,1600,.7,'lowpass',0,200)},
 bat(){tone(2400,.05,'square',.04,3000);tone(2600,.05,'square',.04,3200,.08)},
 hawk(){tone(1800,.35,'sawtooth',.05,900)},
 hiss(){noise(.35,.12,5000,.8,'highpass')},
 cackle(){[0,1,2,3,4].forEach(i=>tone(520-i*30,.07,'sawtooth',.06,380-i*30,i*.09))},
 chitter(){[0,.06,.12,.18].forEach((d,i)=>tone(1100+(i%2)*260,.05,'square',.06,1400,d))},
 hiss2(){noise(.3,.15,3500,1,'highpass')},
 potion(){tone(500,.25,'sine',.08,1200)},
 slosh(){noise(.3,.25,900,.8,'lowpass',0,300);tone(200,.2,'sine',.08,90)},
 zap(){tone(1400,.18,'sawtooth',.06,300)},
 net(){noise(.25,.2,1200,.6,'bandpass',0,400)},
 crumble(){noise(.3,.25,400,.7,'lowpass')},
 creak(){tone(140,.3,'sawtooth',.05,90)},
 lever(){tone(220,.06,'square',.1);tone(330,.08,'square',.1,0,.07)},
 bonk(){tone(180,.12,'square',.12,80)},
 stomp(){tone(520,.07,'square',.1,1100);noise(.08,.15,1500,.6,'bandpass',.03)},
 lowE(){tone(880,.07,'square',.05)},
 shield(){tone(700,.2,'sine',.1,1400)},
 zone(){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.11,'square',.08,0,i*.09))},
 win(){[523,659,784,1047,1319,1568,2093].forEach((f,i)=>tone(f,.14,'square',.08,0,i*.08));[262,330,392,523].forEach((f,i)=>tone(f,.4,'triangle',.12,0,i*.15))},
 over(){[392,370,349,330,311,294,277,262].forEach((f,i)=>tone(f,.18,'triangle',.12,0,i*.16))},
 oneup(){[523,784,1047,1319,1568,2093].forEach((f,i)=>tone(f,.09,'square',.08,0,i*.06))},
 click(){tone(660,.05,'square',.07)}};
function vib(ms){try{if(!muted&&navigator.vibrate)navigator.vibrate(ms)}catch(e){}}
// ---------- music: step sequencer, 16th-note steps; -1 = hold previous note. Land/title/parade songs live in b2_songs.js; Happy Birthday (public domain) is here.
function S(list){const o=[];for(const [n,d] of list){o.push(n);for(let i=1;i<d;i++)o.push(n?-1:0)}return o}
const SONGS={
 title:{bpm:112,tracks:[{type:'square',vol:.075,notes:S([[72,2],[76,2],[79,2],[84,4],[83,2],[81,2],[79,4],[76,2],[77,2],[79,2],[76,2],[72,4],[74,2],[76,2],[77,2],[74,2],[79,6],[0,2],[72,2],[76,2],[79,2],[84,4],[86,2],[84,2],[81,4],[79,2],[77,2],[76,2],[74,2],[72,6],[0,2]])},
  {type:'triangle',vol:.2,notes:S([[48,4],[55,4],[52,4],[55,4],[53,4],[57,4],[55,4],[59,4],[48,4],[55,4],[57,4],[53,4],[55,4],[50,4],[48,8]])},{type:'drum',vol:.2,notes:[1,0,3,0,2,0,3,0]}]},
 parade:{bpm:132,tracks:[{type:'square',vol:.075,notes:S([[72,2],[72,1],[72,1],[76,2],[79,2],[84,4],[79,2],[76,2],[77,2],[77,1],[77,1],[81,2],[77,2],[79,6],[0,2],[72,2],[72,1],[72,1],[76,2],[79,2],[84,4],[83,2],[81,2],[79,2],[77,2],[76,2],[74,2],[72,6],[0,2]])},
  {type:'triangle',vol:.2,notes:S([[48,2],[55,2],[48,2],[55,2],[53,2],[60,2],[55,2],[59,2],[48,2],[55,2],[53,2],[57,2],[55,2],[50,2],[48,4]])},{type:'drum',vol:.24,notes:[1,0,2,0,1,0,2,3]}]},
 // Happy Birthday (public domain melody), 3/4 time in 16ths
 bday:{bpm:96,once:true,tracks:[{type:'square',vol:.09,notes:S([[67,3],[67,1],[69,4],[67,4],[72,4],[71,8],[67,3],[67,1],[69,4],[67,4],[74,4],[72,8],[67,3],[67,1],[79,4],[76,4],[72,4],[71,4],[69,4],[77,3],[77,1],[76,4],[72,4],[74,4],[72,12],[0,8]])},
  {type:'triangle',vol:.2,notes:S([[0,4],[48,4],[52,4],[55,4],[43,4],[47,4],[50,4],[43,4],[47,4],[50,4],[48,4],[52,4],[55,4],[48,4],[52,4],[55,4],[53,4],[57,4],[60,4],[48,4],[55,4],[43,4],[48,12],[0,8]])},
  {type:'square',vol:.04,notes:S([[0,4],[64,4],[64,4],[64,4],[62,8],[0,4],[65,4],[65,4],[65,4],[64,8],[0,4],[76,4],[72,4],[67,4],[67,4],[65,4],[0,4],[72,4],[69,4],[67,4],[64,12],[0,8]])}]}};
let song=null,songName='',musicOn=false,mStep=0,mNext=0,mTimer=null,songDone=false;
function playSong(n,force){if(songName==n&&musicOn&&!force)return;songName=n;song=SONGS[n];mStep=0;songDone=false;const a=A();if(!a)return;if(!musicOn){musicOn=true;mTimer=setInterval(mTick,40)}mNext=a.currentTime+.08}
function songLen(s){return Math.max(...s.tracks.filter(t=>t.type!='drum').map(t=>t.notes.length))}
function musicPaused(){return paused||panelOpen||document.hidden}
function mTick(){if(!ac||!song)return;const sp=60/song.bpm/4;if(mNext<ac.currentTime-.5)mNext=ac.currentTime+.05;
 while(mNext<ac.currentTime+.2){if(musicPaused()){mNext+=sp;continue}if(song.once&&mStep>=songLen(song)){songDone=true;mNext+=sp;continue}
  if(!muted&&ac.state=='running'){for(const tr of song.tracks){const n=tr.notes[mStep%tr.notes.length];if(n>0){const t0=Math.max(0,mNext-ac.currentTime);
   if(tr.type=='drum'){if(n==1)tone(110,.12,'sine',tr.vol,40,t0,musicGain);else if(n==2)noise(.08,tr.vol*.6,2500,1,'highpass',t0,0,musicGain);else noise(.03,tr.vol*.35,8000,1,'highpass',t0,0,musicGain)}
   else{let k=1;while(tr.notes[(mStep+k)%tr.notes.length]===-1&&k<32)k++;tone(NOTE(n),sp*k*.92,tr.type,tr.vol,0,t0,musicGain)}}}}
  mNext+=sp;mStep++}}

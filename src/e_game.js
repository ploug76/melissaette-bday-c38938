// ---------- skills (like the original's 4 skill options) & game state
const SK=[null,{n:'STROLL',d:'No critters, no energy limit',crit:0,vill:0,drain:0,spd:.85},{n:'ADVENTURE',d:'Critters, villains & energy meter',crit:1,vill:1,drain:1.2,spd:1},{n:'BRAVE',d:'Faster critters, quicker drain',crit:1,vill:1,drain:1.65,spd:1.18},{n:'DARING',d:'Fastest of all!',crit:1,vill:1,drain:2.15,spd:1.35}];
const V0=252,GH=620,GF=1500,RUN=80;
let G=null,FXQ=[];
function fx(...a){if(!SIM)FXQ.push(a)}
function spd(G){return SK[G.skill].spd*(1+.12*(G.round-1))*(G.pw.slow>0?.5:1)}
function newGame(skill,round=1){const G={seed:7919+skill,skill,round,ri:0,lives:5,score:0,energy:100,nextLife:20000,ph:'play',pht:0,gt:0,t:0,
  p:null,sol:[],haz:[],obs:[],items:[],ents:[],puddles:[],gens:[],evs:[],pw:{shield:0,spring:0,slow:0},found:[],friends:[],gifts:[],boss:null,zi:0,entryX:10,zoneStart:0,jumps:0,deaths:0};
 G.p=newPlayer(10);buildScreen(G,1);return G}
function newPlayer(x){return{x,y:GY,vx:0,vy:0,on:true,gi:-1,face:1,duck:false,coy:0,buf:0,jt:9,jx:x,cut:true,jumping:false,bigUsed:true,big:false,net:0,inv:0,h:20,jPrev:false,walkT:0,air:0,dead:'' }}
function topAt(G,x,solidOnly){let t=999;for(const s of G.sol){if(s.k=='ceil'||(solidOnly&&s.one))continue;if(s.k=='trap'||s.k=='plank')continue;if(x>=s.x&&x<=s.x+s.w&&s.y<t)t=s.y}return t}
function buildScreen(G,first){const rt=RT(G)[G.ri],def=defOf(rt),z=ZONES[rt.zi],sk=SK[G.skill];
 G.sol=[];G.haz=[];G.obs=[];G.items=[];G.ents=[];G.puddles=[];G.gens=[];G.evs=[];G.t=0;G.boss=null;G.zi=rt.zi;
 let segs=[[0,FW]];const cut=(a,b)=>{const o=[];for(const [s,e] of segs){if(b<=s||a>=e){o.push([s,e]);continue}if(a>s)o.push([s,a]);if(b<e)o.push([b,e])}segs=o};
 for(const e of def){if(e[0]=='pit'){cut(e[1],e[1]+e[2]);G.obs.push({x:e[1],w:e[2],pts:e[2]>=30?300:200,done:0})}
  if(e[0]=='trap'){cut(e[1],e[1]+e[2]);G.sol.push({k:'trap',x:e[1],y:GY,w:e[2],h:40,per:e[3],ph:e[4],open:0});G.obs.push({x:e[1],w:e[2],pts:200,done:0})}}
 for(const [s,e] of segs)G.sol.push({k:'ground',x:s,y:GY,w:e-s,h:40});
 if(z.ceil)G.sol.push({k:'ceil',x:-40,y:-60,w:FW+80,h:86});
 for(const e of def){const k=e[0];
  if(k=='bluff'||k=='mound')G.sol.push({k,x:e[1],y:GY-e[3],w:e[2],h:e[3]+40});
  else if(k=='ledge'||k=='stone')G.sol.push({k,x:e[1],y:e[2],w:e[3],h:5,one:1});
  else if(k=='bridge'){for(let i=0;i<e[2];i+=8)G.sol.push({k:'plank',x:e[1]+i,y:GY-2,w:Math.min(8,e[2]-i),h:4,one:1,ct:-1,fy:0,fall:0})}
  else if(k=='log')G.sol.push({k:'log',x:e[1],x1:e[1],x2:e[2],y:e[3],w:e[4],h:5,one:1,v:e[5],dir:1,dx:0})}
 for(const e of def){const k=e[0];
  if(k=='fence'){const t=topAt(G,e[1]+3,1);G.haz.push({k,x:e[1],y:t-18,w:6,h:18});G.obs.push({x:e[1],w:6,pts:200,done:0})}
  else if(k=='grass'||k=='spk'){const t=topAt(G,e[1]+e[2]/2,1);G.haz.push({k,x:e[1],y:t-8,w:e[2],h:8});G.obs.push({x:e[1],w:e[2],pts:e[2]>=20?300:200,done:0})}
  else if(k=='stal'){const t=topAt(G,e[1]+5,1);G.haz.push({k,x:e[1],y:t-16,w:10,h:16});G.obs.push({x:e[1],w:10,pts:300,done:0})}
  else if(k=='mound'){G.obs.push({x:e[1],w:e[2],pts:200,done:0})}
  else if(k=='candle'){if(!G.found.includes(e.id))G.items.push({k,x:e[1],y:e[2],id:e.id,hid:e[3]?1:0,rev:0})}
  else if(k=='gift'){const key=G.ri+':'+e[1];if(!G.gifts.includes(key))G.items.push({k,x:e[1],y:e[2],kind:e[3],key})}
  else if(k=='cage'){const fi=G.zi-1;G.items.push({k,x:e[1],y:GY,fi,open:G.friends.includes(fi)?1:0})}
  else if(k=='bat'&&sk.crit)G.gens.push({k,lvl:e[1],per:e[2],nt:e[3],n:0});
  else if(k=='hawk'&&sk.crit)G.gens.push({k,per:e[1],nt:e[2]});
  else if(k=='spider'&&sk.crit)G.ents.push({k,x:e[1],per:e[2],ph:e[3],y:30,y0:z.theme=='woods'?50:z.theme=='lab'?10:28});
  else if(k=='snake'&&sk.crit)G.ents.push({k,x:e[1],x1:e[1],x2:e[2],v:e[3],dir:1,y:GY});
  else if(['potion','spell','net','pounce'].includes(k)&&sk.vill)G.evs.push({k,trig:e[1],a:e[2],done:0});
  else if(k=='drop'&&sk.vill)G.ents.push({k:'dropcat',x:e[1],y:e[2],trig:e[3],st:'sit',tm:0});
  else if(k=='boss')setupBoss(G)}
 const p=G.p;if(first){p.x=G.entryX;p.y=topAt(G,p.x,0);if(p.y>GY)p.y=GY}}
function setupBoss(G){G.sol.push({k:'chair',x:28,y:132,w:34,h:5,one:1},{k:'table',x:90,y:112,w:76,h:5,one:1},{k:'skull',x:174,y:88,w:20,h:5,one:1},{k:'shelf',x:200,y:62,w:56,h:5,one:1},{k:'perch',x:66,y:50,w:46,h:5,one:1});
 G.boss={lev:[0,0,0],L:[{x:46,y:84},{x:150,y:72},{x:184,y:46}],wand:1,netted:0,atk:2.2,n:0,unlocked:0,yarn:null,wx:89,wy:50,pose:'',pt:0,netY:-30,buck:0};
 G.items.push({k:'cage',x:236,y:62,fi:6,open:0,boss:1});
 G.ents.push({k:'bcat',x:215,y:GY,vx:0,vy:0,st:'chase',tm:0,cd:1.5,f:-1});
 if(SK[G.skill].crit){G.ents.push({k:'spider',x:120,per:3.4,ph:.5,y:10,y0:10,low:96});G.ents.push({k:'gbat',a:0})}}
// ---------- player
function pbox(p){const h=p.duck?12:20;return{x:p.x-3,y:p.y-h+2,w:6,h:h-2}}
function solidHit(G,x,y,w,h){for(let i=0;i<G.sol.length;i++){const s=G.sol[i];if(s.one||(s.k=='trap'&&s.open))continue;if(x<s.x+s.w&&s.x<x+w&&y<s.y+s.h&&s.y<y+h)return s}return null}
function stepPlayer(G,IN){const p=G.p,S=spd(G);const jp=IN.j&&!p.jPrev;p.jPrev=IN.j;
 if(p.inv>0)p.inv-=DT;
 if(p.net>0){p.net-=DT*(1)+(jp?.14:0);p.vx=0;p.duck=false;if(p.net<=0){p.net=0;fx('sfx','net')}}
 const canMove=p.net<=0;
 p.duck=canMove&&IN.d&&p.on;p.h=p.duck?12:20;
 let dir=canMove&&!p.duck?(IN.r?1:0)-(IN.l?1:0):0;
 const under=p.on&&p.gi>=0?G.sol[p.gi]:null;const slip=under&&G.puddles.some(q=>Math.abs(q.y-under.y)<1&&Math.abs(p.x-q.x)<q.w/2+2);p.slip=slip;
 const maxv=p.big?122:RUN,acc=p.on?(slip?210:950):560,dec=p.on?(slip?150:1500):0;
 if(dir){p.vx+=CL(dir*maxv-p.vx,-acc*DT,acc*DT);p.face=dir}else if(dec){const s=Math.sign(p.vx);p.vx-=s*Math.min(Math.abs(p.vx),dec*DT)}
 if(!p.big&&p.on&&Math.abs(p.vx)>RUN)p.vx=Math.sign(p.vx)*RUN;
 // jump: buffer + coyote time + variable height; a quick second tap in the air = Big Leap (the original's "push up again immediately")
 if(jp&&canMove)p.buf=.13;if(p.on)p.coy=.1;else p.coy-=DT;p.buf-=DT;
 const spring=G.pw.spring>0;
 if(p.buf>0&&p.coy>0&&canMove){p.vy=-V0*(spring?1.17:1);p.on=false;p.coy=0;p.buf=0;p.jt=0;p.jx=p.x;p.cut=false;p.jumping=true;p.bigUsed=false;p.big=false;p.gi=-1;G.jumps++;fx('sfx','jump')}
 else if(jp&&!p.on&&p.jumping&&!p.bigUsed&&p.jt>.03&&p.jt<.32&&canMove){p.bigUsed=true;p.big=true;p.cut=false;p.vy=-235*(spring?1.12:1);p.vx=p.face*Math.max(Math.abs(p.vx),112);p.buf=0;fx('sfx','big');fx('spark',p.x,p.y)}
 p.jt+=DT;
 if(p.jumping&&!p.cut&&!IN.j&&p.vy<0&&p.jt>=.09){p.vy*=.55;p.cut=true}
 const gr=(p.vy<0&&IN.j&&!p.cut&&p.jt<.5)?GH:GF;p.vy=Math.min(330,p.vy+gr*DT);
 // ride moving platforms
 if(p.on&&under&&under.k=='log')p.x+=under.dx;
 // horizontal move + collide
 p.x+=p.vx*DT;let s=solidHit(G,p.x-4,p.y-p.h,8,p.h-.5);if(s){if(p.x<s.x+s.w/2)p.x=s.x-4.01;else p.x=s.x+s.w+4.01;p.vx=0}
 // vertical
 const oy=p.y;p.y+=p.vy*DT;const wasOn=p.on;p.on=false;let landS=-1;
 for(let i=0;i<G.sol.length;i++){const q=G.sol[i];if(q.k=='trap'&&q.open)continue;if(q.k=='plank'&&q.fall)continue;
  if(p.x+4<=q.x||p.x-4>=q.x+q.w)continue;
  if(p.vy>=0&&oy<=q.y+.01&&p.y>=q.y){if(landS<0||q.y<G.sol[landS].y)landS=i;continue}
  if(!q.one&&p.vy<0&&oy-p.h>=q.y+q.h-.01&&p.y-p.h<q.y+q.h){p.y=q.y+q.h+p.h;p.vy=0;p.cut=true;fx('sfx','bonk')}}
 if(landS>=0){const q=G.sol[landS];p.y=q.y;p.vy=0;p.on=true;p.gi=landS;if(!wasOn)land(G,p)}
 else p.gi=-1;
 if(!p.on)p.air+=DT;else{p.air=0;if(Math.abs(p.vx)>5)p.walkT+=DT}
 if(p.on&&p.gi>=0&&G.sol[p.gi].k=='plank'&&G.sol[p.gi].ct<0){G.sol[p.gi].ct=0;fx('sfx','crumble')}}
function land(G,p){p.jumping=false;p.big=false;p.bigUsed=true;fx('sfx','land');fx('dust',p.x,p.y);
 if(p.x>p.jx+6){let pts=0;for(const o of G.obs){if(!o.done&&o.x>=p.jx-4&&o.x+o.w<=p.x+4){o.done=1;pts+=o.pts}}if(pts)addScore(G,pts,p.x,p.y-26)}}
function addScore(G,n,x,y,col){G.score+=n;if(x!=null)fx('pop','+'+n,x,y,col||'#ffd84a');if(G.score>=G.nextLife){G.nextLife+=20000;G.lives=Math.min(9,G.lives+1);fx('sfx','oneup');fx('banner','Extra life!','#5edc78')}}
// ---------- hurt / death
function hurt(G,why){const p=G.p;if(G.ph!='play'||p.inv>0)return;
 if(G.pw.shield>0){G.pw.shield=0;p.inv=1.6;fx('sfx','shield');fx('banner','Your bubble shield saved you!','#42ebf5');if(why=='fall'){p.vy=-360;p.y=Math.min(p.y,GY+4)}return}
 G.ph='die';G.pht=0;p.dead=why;p.vx=0;p.net=0;G.deaths++;
 if(why=='fall'){fx('sfx','fall');if(ZONES[G.zi].theme=='river'||ZONES[G.zi].theme=='castle')fx('splashfx',p.x)}else if(why=='tired'){fx('sfx','over');p.vy=0}else{fx('sfx','hit');p.vy=-210;vib(80)}
 fx('banner',why=='tired'?'Too tired… she needs a rest!':why=='fall'?'Oops! Splash!':'Ouch! What a pratfall!','#ff7978')}
function respawn(G){G.lives--;if(G.lives<=0){G.ph='over';return}
 G.energy=100;const x=G.entryX;G.p=newPlayer(x);G.p.face=x>128?-1:1;buildScreen(G,1);G.p.inv=1.4;G.ph='play'}
// ---------- moving the world
function step(G,IN){G.gt+=DT;const p=G.p;
 if(G.ph=='die'){G.pht+=DT;if(p.dead!='tired'){p.vy+=900*DT;p.y+=p.vy*DT}if(G.pht>1.7)respawn(G);return}
 if(G.ph=='win'){G.pht+=DT;stepBossAnim(G);return}
 if(G.ph!='play')return;
 G.t+=DT;const S=spd(G),sk=SK[G.skill];
 for(const k in G.pw)if(G.pw[k]>0&&k!='shield')G.pw[k]=Math.max(0,G.pw[k]-DT);
 if(sk.drain&&!ZONES[G.zi].boss){const old=G.energy;G.energy-=sk.drain*(1+.15*(G.round-1))*DT;if(old>=20&&G.energy<20)fx('banner','Energy low! Hurry to the next land!','#ffd84a');if(G.energy<20&&Math.floor(old*2)!=Math.floor(G.energy*2)&&Math.floor(G.energy*2)%8==0)fx('sfx','lowE');if(G.energy<=0){G.energy=0;hurt(G,'tired');return}}
 // platforms
 for(const s of G.sol){if(s.k=='log'){const ox=s.x;s.x+=s.dir*s.v*S*DT;if(s.x>s.x2){s.x=s.x2;s.dir=-1}if(s.x<s.x1){s.x=s.x1;s.dir=1}s.dx=s.x-ox}
  else if(s.k=='plank'){if(s.ct>=0&&!s.fall){s.ct+=DT;if(s.ct>.32){s.fall=1}}if(s.fall)s.fy+=DT*120}
  else if(s.k=='trap'){const tt=((G.t+s.ph)%s.per)/s.per;const was=s.open;s.open=tt>.62?1:0;s.warn=tt>.45&&tt<=.62;if(s.open&&!was)fx('sfx','creak')}}
 stepPlayer(G,IN);
 if(G.ph!='play')return;
 // generators
 for(const gn of G.gens){if(G.t>=gn.nt){gn.nt+=gn.per/S;
  if(gn.k=='bat'){const lvl=gn.lvl=='alt'?(gn.n%2?'mid':'low'):gn.lvl;gn.n++;G.ents.push({k:'bat',x:FW+12,y0:lvl=='low'?141:124,y:0,age:0});fx('sfx','bat')}
  else{const L=[CL(p.x+14,24,236),143],Sx=[FW+16,22],E=[-24,40];G.ents.push({k:'hawk',t0:G.t,T:2.5,S:Sx,C:[2*L[0]-(Sx[0]+E[0])/2,2*L[1]-(Sx[1]+E[1])/2],E,x:Sx[0],y:Sx[1]});fx('sfx','hawk')}}}
 // villain events
 for(const ev of G.evs){if(ev.done||p.x<ev.trig)continue;ev.done=1;
  if(ev.k=='pounce'){G.ents.push({k:'cat',x:-18,y:GY,vx:125,vy:0,st:'run',tm:0});fx('sfx','meow');fx('banner','Here comes Azrael the cat!','#f08a24')}
  else{const wx=ev.k=='potion'?CL(ev.a+50,40,226):ev.k=='net'?CL(p.x+30,30,226):222;G.ents.push({k:'wiz',x:wx,y:58,act:ev.k,a:ev.a,tm:0,n:0,f:-1});fx('sfx','cackle');
   fx('banner',ev.k=='potion'?'Gargamel throws a slippery potion!':ev.k=='spell'?'Gargamel casts a spell! Duck or jump!':'Gargamel drops his net!','#c95bba')}}
 // entities
 const pb=pbox(p),hit=(x,y,w,h)=>p.inv<=0&&ovl(pb,{x,y,w,h});
 // creatures: land on top while falling = stomp (creature knocked out, small bounce, no harm); any other touch still hurts
 const stomp=(e,x,y,w,h)=>{if(!ovl(pb,{x,y,w,h}))return false;if(!(p.vy>0&&!p.on&&p.y<=y+h/2+4))return false;
  e.dead=1;p.vy=-200;p.on=false;p.jumping=true;p.cut=true;p.bigUsed=true;p.big=false;fx('sfx','stomp');fx('poof',e.x,e.y);return true},
  crit=(e,x,y,w,h,why)=>{if(stomp(e,x,y,w,h))return;if(hit(x,y,w,h))hurt(G,why)};
 for(const e of G.ents){switch(e.k){
  case 'bat':e.age+=DT;e.x-=58*S*DT;e.y=e.y0+Math.sin(e.age*6)*2;crit(e,e.x-5,e.y-3,10,6,'bat');if(e.x<-20)e.dead=1;break;
  case 'hawk':{const u=(G.t-e.t0)/(e.T/S);if(u>1){e.dead=1;break}const a=(1-u)*(1-u),b=2*(1-u)*u,cc=u*u;e.x=a*e.S[0]+b*e.C[0]+cc*e.E[0];e.y=a*e.S[1]+b*e.C[1]+cc*e.E[1];crit(e,e.x-6,e.y-3,12,6,'hawk');break}
  case 'spider':{const lowY=e.low||141,tt=((G.t*S+e.ph)%e.per)/e.per;let k=0;if(tt<.28)k=tt/.28;else if(tt<.55)k=1;else if(tt<.8)k=1-(tt-.55)/.25;e.y=e.y0+(lowY-e.y0)*k;crit(e,e.x-4,e.y-3,8,6,'spider');break}
  case 'snake':e.x+=e.dir*e.v*S*DT;if(e.x>e.x2){e.x=e.x2;e.dir=-1}if(e.x<e.x1){e.x=e.x1;e.dir=1}crit(e,e.x-8,e.y-5,16,5,'snake');break;
  case 'cat':e.tm+=DT;if(e.st=='run'){e.x+=e.vx*S*DT;if(p.x>e.x&&p.x-e.x<46){e.st='crouch';e.tm=0;fx('sfx','hiss2')}if(e.x>FW+24)e.dead=1}
   else if(e.st=='crouch'){if(e.tm>.42/S){e.st='pounce';e.vy=-235;e.vx=150;fx('sfx','meow')}}
   else if(e.st=='pounce'){e.x+=e.vx*S*DT;e.vy+=900*S*DT;e.y+=e.vy*S*DT;if(e.y>=GY){e.y=GY;e.st='leave';e.vx=140}}
   else{e.x+=e.vx*S*DT;if(e.x>FW+24)e.dead=1}
   crit(e,e.x-9,e.y-12,18,10,'cat');break;
  case 'dropcat':e.tm+=DT;if(e.st=='sit'&&p.x>=e.trig){e.st='paw';e.tm=0;fx('sfx','meow');G.ents.push({k:'drop',x:e.x,y:e.y,vy:0,tm:0,st:'wob',kind:ZONES[G.zi].theme=='cave'?'rock':'apple'})}
   else if(e.st=='paw'&&e.tm>2.2){e.st='gone'}break;
  case 'drop':e.tm+=DT;if(e.st=='wob'){if(e.tm>.5/S){e.st='fall'}}else if(e.st=='fall'){e.vy+=600*S*DT;e.y+=e.vy*S*DT;const t=topAt(G,e.x,0);if(e.y>=t){e.y=t;e.st='broke';e.tm=0;fx('sfx','bonk')}if(hit(e.x-4,e.y-8,8,8))hurt(G,'drop')}else if(e.tm>.5)e.dead=1;break;
  case 'wiz':stepWiz(G,e,S);break;
  case 'orb':e.x+=e.vx*DT;e.y+=e.vy*DT;e.age=(e.age||0)+DT;if(hit(e.x-3,e.y-3,6,6))hurt(G,'spell');if(e.x<-10||e.x>FW+10||e.y<-10||e.y>FH+10)e.dead=1;break;
  case 'potion':{const oy=e.y;e.x+=e.vx*DT;e.vy+=300*DT;e.y+=e.vy*DT;let landed=null;
   for(const s of G.sol){if(s.k=='ceil'||(s.k=='trap'&&s.open)||(s.k=='plank'&&s.fall))continue;if(e.x>=s.x&&e.x<=s.x+s.w&&oy<=s.y&&e.y>=s.y&&(!landed||s.y<landed.y))landed=s}
   if(landed){e.dead=1;G.puddles.push({x:e.x,y:landed.y,w:30,age:0});fx('sfx','slosh')}else if(e.y>FH+10)e.dead=1;break}
  case 'net':e.vy+=420*DT;e.y+=e.vy*DT;{const t=topAt(G,e.x,0);if(e.y>=t){e.dead=1;G.ents.push({k:'netg',x:e.x,y:t,tm:0});fx('sfx','net');if(Math.abs(p.x-e.x)<16&&p.y>t-30&&p.inv<=0){if(G.pw.shield>0){G.pw.shield=0;p.inv=1.4;fx('sfx','shield')}else{p.net=1.5;G.energy=Math.max(1,G.energy-12);fx('banner','Caught in the net! Tap JUMP to wriggle free!','#ffd84a')}}}}break;
  case 'netg':e.tm+=DT;if(e.tm>1.2)e.dead=1;break;
  case 'bcat':stepBossCat(G,e,S,stomp);break;
  case 'gbat':e.a+=DT*1.9*S;e.x=222+Math.cos(e.a)*22;e.y=36+Math.sin(e.a*2)*12;crit(e,e.x-5,e.y-3,10,6,'bat');break;
  case 'yarn':e.vy+=500*DT;e.y+=e.vy*DT;if(e.y>=GY-3){e.y=GY-3;e.vy=0;e.x+=e.vx*DT;e.vx*=.985}break}}
 if(G.ents.some(e=>e.dead))G.ents=G.ents.filter(e=>!e.dead);
 for(const q of G.puddles)q.age+=DT;
 if(G.ph!='play')return;
 // hazards
 if(p.inv<=0)for(const h of G.haz){if(ovl(pb,{x:h.x+1,y:h.y+1,w:h.w-2,h:h.h-1})){hurt(G,h.k);return}}
 if(p.y>FH+18){hurt(G,'fall');return}
 // items
 for(const it of G.items){if(it.got)continue;
  if(it.k=='candle'){if(it.hid&&!it.rev&&Math.abs(p.x-it.x)<40&&Math.abs(p.y-it.y)<70){it.rev=1;fx('sfx','ghost');fx('spark',it.x,it.y-6)}
   if((!it.hid||it.rev)&&ovl(pb,{x:it.x-4,y:it.y-15,w:8,h:15})){it.got=1;G.found.push(it.id);const ever=foundEver.includes(it.id);addScore(G,ever?54:540,it.x,it.y-18,'#ff86a6');fx('candle',it.id,it.x,it.y)}}
  else if(it.k=='gift'&&ovl(pb,{x:it.x-6,y:it.y-12,w:12,h:12})){it.got=1;G.gifts.push(it.key);addScore(G,250,it.x,it.y-16);applyGift(G,it.kind)}
  else if(it.k=='cage'&&!it.open){if(it.boss){if(ovl(pb,{x:it.x-9,y:it.y-36,w:18,h:36})){if(G.boss.unlocked){it.open=1;finalRescue(G)}else if(!it.warned){it.warned=1;fx('banner','Locked! Pull all 3 bell-ropes first!','#ffd84a')}}}
   else if(ovl(pb,{x:it.x-9,y:70,w:18,h:90})){it.open=1;G.friends.push(it.fi);addScore(G,1000,it.x,it.y-46,'#5edc78');fx('sfx','friend');fx('friend',it.fi,it.x,it.y);fx('banner',FRIENDS[it.fi][1]+' is free! See you at the castle!','#5edc78')}}}
 if(G.items.some(i=>i.got))G.items=G.items.filter(i=>!i.got);
 if(G.boss)stepBoss(G,S);
 // screen edges (flip-screen)
 const first=G.ri==0||RT(G)[G.ri-1].zi!=G.zi;
 if(p.x<3){if(first||ZONES[G.zi].boss){p.x=3;p.vx=Math.max(0,p.vx)}else{G.ri--;G.entryX=FW-8;buildScreen(G,0);p.x=FW-4;fx('screen')}}
 else if(p.x>FW-3){if(ZONES[G.zi].boss){p.x=FW-3;p.vx=0}else{const nz=RT(G)[G.ri+1].zi!=G.zi;G.ri++;G.entryX=8;
  if(nz){const bonus=SK[G.skill].drain?Math.round(G.energy)*20:500;addScore(G,bonus,null,null);G.energy=100;fx('zone',RT(G)[G.ri].zi,bonus)}
  buildScreen(G,0);p.x=4;fx('screen')}}}
function applyGift(G,k){fx('sfx','gift');if(k=='shield'){G.pw.shield=1;fx('banner','Bubble shield! It saves you from one oops.','#42ebf5')}
 else if(k=='spring'){G.pw.spring=20;fx('banner','Spring shoes! Super-high jumps for 20 seconds!','#5edc78')}
 else if(k=='slow'){G.pw.slow=15;fx('banner','Snail-time! Critters & villains slow down!','#c95bba')}
 else{G.energy=Math.min(100,G.energy+50);fx('banner','Cupcake! Energy +50','#ff7978')}}
function stepWiz(G,e,S){e.tm+=DT;const p=G.p;
 if(e.act=='potion'){if(e.tm>.55&&!e.n){e.n=1;e.pose='throw';const x0=e.x-6,y0=e.y-30,T=1,tx=e.a,ty=topAt(G,tx,0);G.ents.push({k:'potion',x:x0,y:y0,vx:(tx-x0)/T,vy:(ty-y0-.5*300*T*T)/T});fx('sfx','potion')}if(e.tm>1.8)e.dead=1}
 else if(e.act=='spell'){const n=e.a||3;const fire=Math.floor((e.tm-.6)/.65);if(e.tm>.6&&fire>=e.n&&e.n<n){e.n++;e.pose='throw';const x0=e.x-8,y0=e.y-28,tx=p.x,ty=p.y-10,d=Math.hypot(tx-x0,ty-y0)||1,v=88*S;G.ents.push({k:'orb',x:x0,y:y0,vx:(tx-x0)/d*v,vy:(ty-y0)/d*v});fx('sfx','zap')}if(e.tm>.6+n*.65+.6)e.dead=1}
 else if(e.act=='net'){if(e.tm<.8){e.x+=CL(p.x-e.x,-130*DT,130*DT);e.f=p.x<e.x?-1:1}else if(!e.n){e.n=1;e.pose='throw';G.ents.push({k:'net',x:e.x,y:e.y-14,vy:30})}if(e.tm>1.7)e.dead=1}}
// ---------- the boss: outsmart Gargamel & Azrael
function stepBossCat(G,e,S,stomp){const p=G.p,B=G.boss;e.tm+=DT;e.cd-=DT;
 if(e.st=='yarn'||e.st=='sit'){const y=G.ents.find(q=>q.k=='yarn');if(y&&e.st=='yarn'){const d=y.x-14-e.x;e.f=Math.sign(y.x-e.x)||1;if(Math.abs(d)>2)e.x+=Math.sign(d)*70*DT;if(e.tm>.5&&Math.abs(d)<4){y.vx+=(Math.sin(G.t*3)>0?1:-1)*0;}}return}
 if(e.st=='chase'){const dx=p.x-e.x;e.f=Math.sign(dx)||e.f;e.x+=CL(dx,-1,1)*58*S*DT;e.x=CL(e.x,8,248);if(Math.abs(dx)<52&&p.y>GY-62&&e.cd<=0&&p.inv<=0){e.st='crouch';e.tm=0;fx('sfx','hiss2')}}
 else if(e.st=='crouch'){if(e.tm>.5/S){e.st='pounce';const dx=p.x-e.x;e.vx=CL(dx/.55,-170,170);e.vy=-250;fx('sfx','meow')}}
 else if(e.st=='pounce'){e.x+=e.vx*S*DT;e.vy+=900*S*DT;e.y+=e.vy*S*DT;e.x=CL(e.x,8,248);if(e.y>=GY){e.y=GY;e.st='chase';e.cd=1.3}}
 if(stomp&&stomp(e,e.x-9,e.y-12,18,10))return;if(p.inv<=0&&ovl(pbox(p),{x:e.x-9,y:e.y-12,w:18,h:10}))hurt(G,'cat')}
function stepBoss(G,S){const B=G.boss,p=G.p,pb=pbox(p);B.pt-=DT;if(B.pt<=0)B.pose='';
 B.L.forEach((l,i)=>{if(!B.lev[i]&&ovl(pb,{x:l.x-4,y:l.y,w:8,h:9})){B.lev[i]=1;addScore(G,500,l.x,l.y-6);fx('sfx','lever');
  if(i==0){G.ents.push({k:'yarn',x:l.x,y:20,vx:55,vy:0});const c=G.ents.find(e=>e.k=='bcat');if(c){c.st='yarn';c.tm=0}fx('banner','A ball of yarn! Azrael can\u2019t resist it!','#f08a24')}
  else if(i==1){B.wand=0;B.buck=1;fx('sfx','splash');fx('banner','SPLASH! Gargamel dropped his wand!','#42ebf5')}
  else{B.netted=1;fx('sfx','net');fx('banner','Ha! Gargamel is caught in his own net!','#5edc78')}
  if(B.lev.every(v=>v)){B.unlocked=1;B.netted=1;const c=G.ents.find(e=>e.k=='bcat');if(c){c.st='sit'}fx('sfx','win');fx('banner','The cage is unlocked! Climb up to Papa Smurf!','#ffd84a')}}});
 if(B.netted)B.netY=Math.min(B.wy-30,B.netY+120*DT);
 if(B.netted)return;
 B.atk-=DT*S;if(B.atk<=0){const gentle=!SK[G.skill].vill;B.n++;B.pose='throw';B.pt=.4;
  if(B.wand&&!gentle&&B.n%2==0){const x0=B.wx-8,y0=B.wy-30,d=Math.hypot(p.x-x0,p.y-10-y0)||1,v=82;G.ents.push({k:'orb',x:x0,y:y0,vx:(p.x-x0)/d*v,vy:(p.y-10-y0)/d*v});fx('sfx','zap')}
  else{const x0=B.wx,y0=B.wy-30,T=1.1,tx=CL(p.x,10,246);G.ents.push({k:'potion',x:x0,y:y0,vx:(tx-x0)/T,vy:(p.y-y0-.5*300*T*T)/T});fx('sfx','potion')}
  B.atk=gentle?4.2:B.wand?2.5:3.3;if(Math.random()<.3&&!SIM)fx('sfx','cackle')}}
function stepBossAnim(G){const B=G.boss;if(B)B.netY=Math.min(B.wy-30,B.netY+120*DT)}
function finalRescue(G){G.friends.push(6);addScore(G,10000,236,20,'#ffd84a');G.ph='win';G.pht=0;fx('sfx','win');fx('friend',6,236,62);fx('banner','You rescued Papa Smurf! Hooray, Melissaette!','#ffd84a')}

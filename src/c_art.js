// ---------- palette (ColecoVision TMS9918-inspired) + sprite helpers
const P={k:'#000000',g1:'#21c842',g2:'#5edc78',b1:'#5455ed',b2:'#7d76fc',r1:'#d4524d',cy:'#42ebf5',r2:'#fc5554',r3:'#ff7978',y1:'#d4c154',y2:'#e6ce80',g3:'#21b03b',mg:'#c95bba',gy:'#cccccc',w:'#ffffff',dk:'#1b1440'};
function R(x,y,w,h,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function Rf(x,y,w,h,col){g.fillStyle=col;g.fillRect(x,y,w,h)}
const SPR={};
function mk(rows,pal){const w=Math.max(...rows.map(r=>r.length)),h=rows.length,cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
 rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const ch=r[i];if(ch=='.'||ch==' ')continue;const col=pal[ch];if(!col)continue;x.fillStyle=col;x.fillRect(i,j,1,1)}});return cv}
function flipC(cv){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');x.translate(cv.width,0);x.scale(-1,1);x.drawImage(cv,0,0);return o}
// little blue forest folk (Melissaette + friends): front 3/4 view, facing right; mirrored for left
const HEAD=[
"......kkkk......",
"...kkkhhhhkkk...",
"..khhhhhhhhhhk..",
".khhhhhhhhhhhhk.",
"khhhhhhhhhhhhhhk",
"kHHkkkkkkkkkkHHk",
".kkyyyyyyyyyykk.",
".kyybbbbbbbbyyk.",
"kyybwwbbbbwwbyyk",
"kyybwkbbbbwkbyyk",
"kyybbbbddbbbbyyk",
"kyybpbbbbbbpbyyk",
"kyyybbbkkbbbyyyk",
"kyyyykbbbbkyyyyk"];
const BODY=[
"kyyykwwwwwwkyyyk",
"kyyybwwwwwwbyyk.",
".kyybwwwwwwbyk..",
"..kkkwwwwwwkkk..",
"...kwwwwwwwwk...",
"..kwwwwwwwwwwk..",
"..kggggggggggk..",
"...kkkkkkkkkk..."];
const LEGS={stand:["....kbk..kbk....","...kwwk..kwwk..."],w1:["...kbk....kbk...","..kwwk.....kwwk."],w2:[".....kbkkbk.....","....kwwkkwwk...."],jump:["...kbbk..kbbk...","...kwwk..kwwk..."]};
const BODYJ=[
"kyyykwwwwwwkyyyk",
"bbyykwwwwwwkyybb",
".kbbkwwwwwwkbbk.",
"..kkkwwwwwwkkk..",
"...kwwwwwwwwk...",
"..kwwwwwwwwwwk..",
"..kggggggggggk..",
"...kkkkkkkkkk..."];
function folkPal(o){return Object.assign({k:'#141030',h:'#ffffff',H:'#c4cde6',y:'#ffd84a',b:'#4d8df6',d:'#2f62c9',w:'#ffffff',g:'#c4cde6',p:'#ff86a6'},o)}
const SM={e:'#ffffff',k:'#141030',h:'#ffffff',H:'#c4cde6',y:'#4d8df6',b:'#4d8df6',d:'#2f62c9',w:'#ffffff',g:'#c4cde6',p:'#3a74e0',r:'#e02a2a',a:'#ffd84a',f:'#ff86a6'};
const FOLK={mel:folkPal({}),brainy:{...SM},hefty:{...SM},clumsy:{...SM},handy:{...SM},jokey:{...SM},vanity:{...SM},papa:{...SM,h:'#e02a2a',H:'#a01818',w:'#e02a2a',g:'#a01818'}};
const OLDFOLK={
 pip:folkPal({h:'#e0403a',H:'#9c2420',y:'#8a5426',w:'#f2e6c8',g:'#c9b48a'}),
 clover:folkPal({h:'#3fbf4a',H:'#22803a',y:'#5a3a1a',w:'#ffe39a',g:'#d4b860'}),
 juniper:folkPal({h:'#9a5cd6',H:'#64349c',y:'#2a2a2a',w:'#e8d8ff',g:'#b8a2e0'}),
 bramble:{...folkPal({h:'#9a6a3a',H:'#6a4422',y:'#d07a2a',w:'#cfe8ff',g:'#9ab8d8'})},
 poppy:folkPal({h:'#ffb020',H:'#c87a10',y:'#e04a8a',w:'#ffd0e0',g:'#e0a0b8'}),
 thistle:folkPal({h:'#9aa0b0',H:'#6a7080',y:'#e8e8e8',w:'#ffffff',g:'#c4cde6'}),
 wren:folkPal({h:'#ff6fae',H:'#c43e7a',y:'#f2a33a',w:'#ffffff',g:'#ffc4de'})};
const FRIENDS=[['brainy','Brainy Smurf'],['hefty','Hefty Smurf'],['clumsy','Clumsy Smurf'],['handy','Handy Smurf'],['jokey','Jokey Smurf'],['vanity','Vanity Smurf'],['papa','Papa Smurf']];
// male Smurfs: Phrygian hat flopping forward, bare blue chest, white trousers
const SHAT=["....kkkkkk......","..kkhhhhhhkkk...",".khhhhhhhhhhhkk.","khhhhhhhhhhhhhhk","khhhhhhhhhhhhkhk","kHHkkkkkkkkkkkHk"];
const SBODY=["...kkbbbbbbkk...","..kbbbbbbbbbbk..",".kbkbbbbbbbbkbk.",".kbkbbbbbbbbkbk.","..kkkwwwwwwkkk..","...kwwwwwwwwk...","...kwgwwwwgwk...","...kkkkkkkkkk..."];
const SBODYJ=["...kkbbbbbbkk...","bbkbbbbbbbbbbkbb",".kbkbbbbbbbbkbk.","..kkbbbbbbbbkk..","..kkkwwwwwwkkk..","...kwwwwwwwwk...","...kwgwwwwgwk...","...kkkkkkkkkk..."];
function smurfRows(id,body,legs){const hd=SHAT.concat(HEAD.slice(6)).map(r=>r);const L=legs.map(r=>r.replace(/b/g,'w'));let rows=hd.concat(body,L);
 const set=(j,i,ch)=>{rows[j]=rows[j].slice(0,i)+ch+rows[j].slice(i+1)};
 if(id=='brainy'){rows[8]="kbbkwwkkkkwwkbbk";rows[9]="kbbkwkkbbkwkkbbk"}
 if(id=='hefty'){set(16,2,'r');set(16,3,'r')}
 if(id=='handy'){set(5,13,'a');set(4,14,'a')}
 if(id=='vanity'){set(2,4,'f');set(1,5,'f');set(2,6,'f');set(3,5,'a')}
 if(id=='clumsy'){set(10,7,'k');set(10,8,'k')}
 if(id=='papa'){rows[11]="kbbbeeeeeeeebbbk";rows[12]="kbbeeeekkeeeebbk";rows[13]="kbbbeeeeeeeebbbk";rows[14]="...kkeeeeeekk...";rows[15]="..kbbkeeeekbbk.."}
 return rows}
function buildFolk(){{const o={},L={};for(const k in MELF){o[k]=mk(MELF[k],MELP);L[k]=flipC(o[k])}SPR.mel={r:o,l:L}}
 for(const [id,pal] of Object.entries(FOLK)){if(id=='mel')continue;const P2=Object.assign({},pal),o={};const male=id!='mel';
  if(id=='papa'){P2.h='#e02a2a';P2.H='#a01818'}
  for(const [fr,lg] of Object.entries(LEGS)){const rows=male?smurfRows(id,fr=='jump'?SBODYJ:SBODY,lg):HEAD.concat(fr=='jump'?BODYJ:BODY,lg);o[fr]=mk(rows,P2)}
  // happy (eyes closed ^^) and hurt (x eyes) heads
  const base=male?smurfRows(id,SBODYJ,LEGS.jump):null;if(male){const hh=base.slice();hh[8]="kbbbbbbbbbbbbbbk";hh[9]="kbbbkkbbbbkkbbbk";if(id!='papa')hh[12]="kbbbbbkkkkbbbbbk";o.happy=mk(hh,P2);const hu=base.slice();hu[8]="kbbkbkbbbbkbkbbk";hu[9]="kbbbkbbbbbbkbbbk";o.hurt=mk(hu,P2);const L={};for(const k in o)L[k]=flipC(o[k]);SPR[id]={r:o,l:L};continue}
  const hh=HEAD.slice();hh[8]="kyybbbbbbbbbbyyk";hh[9]="kyybkkbbbbkkbyyk";hh[12]="kyyybbkkkkbbyyyk";o.happy=mk(hh.concat(BODYJ,LEGS.jump),P2);
  const hu=HEAD.slice();hu[8]="kyybkbkbbkbkbyyk";hu[9]="kyybbkbbbbkbbyyk";hu[12]="kyyybbkwwkbbyyyk";o.hurt=mk(hu.concat(BODYJ,LEGS.jump),P2);
  const L={};for(const k in o)L[k]=flipC(o[k]);SPR[id]={r:o,l:L}}}
// draw a folk sprite: anchor bottom-centre at (x,y). squash<1 = ducking
function drawFolk(id,fr,x,y,face=1,squash=1,s=1){const sp=SPR[id][face>0?'r':'l'][fr]||SPR[id][face>0?'r':'l'].stand;const k=sp.width>16?.75:1,w=sp.width*k*s,h=sp.height*k*s*squash;g.drawImage(sp,Math.round(x-w/2),Math.round(y-h),w,h)}
// ---------- villains & critters (blocky rect pixel art, facing right; f=-1 mirrors)
function mir(x,w,f,ox){return f>0?x:2*ox-x-w}
function wizard(x,y,f=1,t=0,pose=''){ // Gargamel: bald, scraggly, black patched robe, black robe; anchor bottom centre
 const B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);const bob=Math.round(Math.sin(t*6)*1);
 B(-9,-2,18,2,'#0c0a18');B(-9,-2,7,2,'#c8262a');B(3,-2,7,2,'#c8262a'); // robe hem + Gargamel's red shoes
 B(-8,-22,16,20,'#231f36');B(-7,-21,3,18,'#3a3458');B(2,-21,2,18,'#16131f'); // robe
 B(-5,-14,10,2,'#8a1f3a');                          // sash
 B(-9,-20,3,8,'#231f36');B(6,-20,4,8,'#231f36');     // sleeves
 B(-10,-13,3,3,'#e8b48c');B(8,-13,3,3,'#e8b48c');    // hands
 if(pose=='throw'){B(8,-26,3,8,'#231f36');B(9,-29,3,3,'#e8b48c')}
 B(-6,-34+bob,12,12,'#e8b48c');B(-6,-34+bob,12,2,'#f6cfa8');                 // bald head
 B(-8,-29+bob,3,4,'#9a9a9a');B(5,-29+bob,3,4,'#9a9a9a');B(-9,-27+bob,2,3,'#7a7a7a');B(7,-27+bob,2,3,'#7a7a7a'); // scraggly side hair
 B(-4,-30+bob,4,1,'#4a2a1a');B(1,-30+bob,4,1,'#4a2a1a');                    // brows
 B(-3,-29+bob,2,2,'#ffffff');B(2,-29+bob,2,2,'#ffffff');B(-2,-28+bob,1,1,'#000');B(3,-28+bob,1,1,'#000');
 B(3,-27+bob,4,4,'#d48a6a');                                                 // big nose
 B(-3,-24+bob,6,1,'#5a1a1a');B(-2,-23+bob,1,1,'#ffffff')}                    // grumpy mouth + snaggle tooth
function cat(x,y,f=1,t=0,pose='run'){ // orange tabby, anchor bottom centre, ~20x12
 const B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);const o='#f08a24',s='#b8560e',cr='#ffd9a0';
 const leg=pose=='run'?(Math.floor(t*12)%2):0;
 if(pose=='crouch'){B(-9,-6,16,5,o);B(-6,-6,2,5,s);B(-1,-6,2,5,s);B(5,-10,7,7,o);B(6,-12,2,2,o);B(10,-12,2,2,o);B(8,-8,1,1,'#2a2');B(11,-8,1,1,'#2a2');B(-14,-5+(Math.floor(t*10)%2),5,2,o);B(-9,-1,4,1,o);B(3,-1,4,1,o);return}
 if(pose=='sit'){B(-5,-10,10,10,o);B(-3,-9,2,8,s);B(1,-9,2,8,s);B(-4,-17,9,8,o);B(-4,-19,2,2,o);B(3,-19,2,2,o);B(-2,-14,1,1,'#2a2');B(2,-14,1,1,'#2a2');B(-1,-12,3,1,cr);B(5,-3,6,2,o);return}
 B(-8,-9,15,6,o);B(-5,-9,2,6,s);B(-1,-9,2,6,s);B(3,-9,2,6,s);B(-6,-4,12,1,cr);  // body + stripes
 B(6,-13,8,8,o);B(6,-15,2,2,o);B(12,-15,2,2,o);B(9,-11,1,1,'#2a2');B(12,-11,1,1,'#2a2');B(11,-8,3,1,cr);B(13,-9,1,1,'#ff8fa0'); // head
 B(-13,-11+(pose=='pounce'?2:0),5,2,o);B(-14,-13,2,2,s);                       // tail
 if(pose=='pounce'){B(-9,-3,4,2,o);B(5,-4,5,2,o)}else{B(-7+leg*2,-3,2,3,o);B(-3-leg*2,-3,2,3,o);B(2+leg*2,-3,2,3,o);B(5-leg*2,-3,2,3,o)}}
function bat(x,y,t){const fl=Math.floor(t*14)%2;R(x-3,y-2,6,5,'#5a3a8a');R(x-2,y-1,1,1,'#ff4040');R(x+1,y-1,1,1,'#ff4040');
 if(fl){R(x-9,y-4,6,2,'#3a2060');R(x+3,y-4,6,2,'#3a2060');R(x-10,y-2,2,2,'#3a2060');R(x+8,y-2,2,2,'#3a2060')}else{R(x-9,y,6,2,'#3a2060');R(x+3,y,6,2,'#3a2060');R(x-10,y+2,2,1,'#3a2060');R(x+8,y+2,2,1,'#3a2060')}}
function hawk(x,y,t,f){const fl=Math.floor(t*10)%2,B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);
 B(-7,-2,13,4,'#7a4a1a');B(4,-4,5,4,'#7a4a1a');B(8,-3,3,2,'#f8c020');B(6,-3,1,1,'#000');B(-11,-2,4,2,'#5a3410');
 if(fl){B(-4,-9,8,7,'#9a6430');B(-2,-11,4,2,'#9a6430')}else{B(-4,2,8,5,'#9a6430')}}
function spider(x,y,t){R(x-4,y-3,8,6,'#2a1a2a');R(x-2,y-1,1,1,'#ff3030');R(x+1,y-1,1,1,'#ff3030');const k=Math.floor(t*8)%2;
 for(const s of [-1,1]){R(x+s*4-(s<0?3:0),y-3+k,3,1,'#2a1a2a');R(x+s*4-(s<0?3:0),y,3,1,'#2a1a2a');R(x+s*4-(s<0?3:0),y+2-k,3,1,'#2a1a2a')}}
function snake(x,y,t,f){const k=Math.floor(t*6)%2,B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);
 B(-8,-3+k,4,3,'#3aa83a');B(-4,-3-k+1,4,3,'#3aa83a');B(0,-3+k,4,3,'#3aa83a');B(4,-5,5,5,'#3aa83a');B(7,-4,1,1,'#000');B(9,-2,2,1,'#e02020');B(-6,-2+k,2,1,'#d4c154');B(1,-2+k,2,1,'#d4c154')}
function candle(x,y,t,ghost){ // birthday candle: anchor bottom centre ~4x12
 if(ghost){g.globalAlpha=.35}
 R(x-2,y-9,4,9,'#ffffff');R(x-2,y-8,4,1,'#ff5f8f');R(x-2,y-5,4,1,'#5455ed');R(x-2,y-2,4,1,'#ff5f8f');R(x,y-11,1,2,'#333');
 const fl=Math.floor(t*10+x)%3;R(x-1,y-14-fl%2,3,3+fl%2,'#ffb020');R(x,y-13-fl%2,1,2,'#fff6a0');
 if(!ghost&&Math.floor(t*4+x*.3)%5==0){R(x-4,y-15,1,1,'#fff');R(x+4,y-12,1,1,'#fff')}
 g.globalAlpha=1}
function gift(x,y,kind,t){const col={shield:'#42ebf5',spring:'#5edc78',slow:'#c95bba',cake:'#ff7978'}[kind]||'#ff7978';const b=Math.round(Math.sin(t*4)*1);
 R(x-6,y-10+b,12,10,col);R(x-1,y-10+b,2,10,'#ffd84a');R(x-6,y-6+b,12,2,'#ffd84a');R(x-4,y-13+b,3,3,'#ffd84a');R(x+1,y-13+b,3,3,'#ffd84a');R(x-6,y-1+b,12,1,'rgba(0,0,0,.25)')}
function cage(x,y,id,t,open){ // hanging cage, anchor bottom centre, 18x36
 if(!open&&SPR[id])drawFolk(id,Math.floor(t*2)%2?'stand':'happy',x,y-3,Math.sin(t)>0?1:-1);
 const col='#8a8a9a';R(x-9,y-3,18,3,'#5a5a6a');if(!open){for(let i=-9;i<=8;i+=4)R(x+i,y-34,1,31,col)}else{R(x-9,y-34,1,31,col);R(x+8,y-34,1,31,col)}
 R(x-9,y-36,18,3,'#5a5a6a');R(x-1,y-40,2,4,'#5a5a6a');if(!open){R(x+5,y-20,4,4,'#d4c154');R(x+6,y-18,2,2,'#000')}}
function fence(x,y){R(x,y,6,18,'#c88a4a');R(x+1,y+1,4,16,'#e6ae6a');R(x,y,6,1,'#8a5a2a');R(x-3,y+4,12,2,'#a86a30');R(x-3,y+11,12,2,'#a86a30');R(x+2,y-2,2,2,'#e6ae6a')}
function grassT(x,y,w,kind){if(kind=='spk'){for(let i=0;i<w;i+=4){R(x+i,y+2,3,6,'#8a8aa0');R(x+i+1,y,1,2,'#cccccc')}R(x,y+7,w,1,'#5a5a6a');return}
 R(x,y+5,w,3,'#0a4a14');for(let i=0;i<w;i+=3){const h=6+((i*7)%3);R(x+i,y+8-h,2,h,(i/3)%2?'#127a24':'#0e5a1c');R(x+i+((i/3)%2?1:0),y+8-h-1,1,2,'#e6ce80')}}
function stal(x,y){R(x+3,y,4,4,'#9aa0b4');R(x+2,y+4,6,5,'#8a8aa0');R(x+1,y+9,8,4,'#7a7a94');R(x,y+13,10,3,'#6a6a84');R(x+4,y+1,1,8,'#cfd6ea')}

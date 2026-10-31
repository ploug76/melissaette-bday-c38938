// ---------- palette (ColecoVision TMS9918-inspired) + sprite helpers
const P={k:'#000000',g1:'#21c842',g2:'#5edc78',b1:'#5455ed',b2:'#7d76fc',r1:'#d4524d',cy:'#42ebf5',r2:'#fc5554',r3:'#ff7978',y1:'#d4c154',y2:'#e6ce80',g3:'#21b03b',mg:'#c95bba',gy:'#cccccc',w:'#ffffff',dk:'#1b1440'};
function R(x,y,w,h,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function Rf(x,y,w,h,col){g.fillStyle=col;g.fillRect(x,y,w,h)}
const SPR={};
function mk(rows,pal){const w=Math.max(...rows.map(r=>r.length)),h=rows.length,cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
 rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const ch=r[i];if(ch=='.'||ch==' ')continue;const col=pal[ch];if(!col)continue;x.fillStyle=col;x.fillRect(i,j,1,1)}});return cv}
function flipC(cv){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');x.translate(cv.width,0);x.scale(-1,1);x.drawImage(cv,0,0);return o}
// ---------- the Party Pals: Melissaette's seven woodland friends (original critter designs), 16x24, facing right; mirrored for left
const FRIENDS=[['pip','Pip the Bunny'],['clover','Clover the Hedgehog'],['juniper','Juniper the Fox'],['bramble','Bramble the Badger'],['poppy','Poppy the Mouse'],['thistle','Thistle the Frog'],['hoot','Granny Hoot the Owl']];
const PALPAL={
 pip:{a:'#f1e8dc',A:'#c8b6a0',c:'#ffffff',p:'#ff9ab8',r:'#5aa2ff',n:'#ff6f9f'},
 clover:{a:'#e7c49a',A:'#7a4a22',c:'#f6e2c4',p:'#ff9ab8',r:'#3fbf4a',n:'#2a1a1a'},
 juniper:{a:'#f08a24',A:'#6e3412',c:'#fff4e6',p:'#ff9ab8',r:'#ffd84a',n:'#2a1a1a'},
 bramble:{a:'#8c8c98',A:'#2a2a34',c:'#f4f4f4',p:'#ff9ab8',r:'#c95bba',n:'#2a1a1a'},
 poppy:{a:'#b9a9c9',A:'#8a7a9a',c:'#f3eaf6',p:'#ff8fb0',r:'#ff5f8f',n:'#ff6f9f'},
 thistle:{a:'#5edc78',A:'#21a03b',c:'#e8f7c0',p:'#ff8fb0',r:'#c95bba',n:'#21a03b'},
 hoot:{a:'#9a6a3a',A:'#6a4422',c:'#f2e2c4',p:'#ff9ab8',r:'#b48ae0',n:'#f2a33a',g:'#ffd84a'}};
function palRows(id,fr){const W=16,H=24,G=[...Array(H)].map(()=>Array(W).fill('.'));
 const put=(x,y,c)=>{if(x>=0&&x<W&&y>=0&&y<H)G[y][x]=c};
 const ell=(cx,cy,rx,ry,c)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)put(x,y,c)};
 const rect=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)put(x,y,c)};
 const up=fr=='jump'||fr=='happy'||fr=='hurt';
 // tails / backs drawn first (behind the body)
 if(id=='pip')ell(3,18.5,1.8,1.8,'c');
 if(id=='juniper'){ell(2.6,16.5,2.2,3.6,'a');rect(1,19,3,20,'c')}
 if(id=='poppy'){for(const [x,y] of [[3,20],[2,20],[1,19],[1,18],[1,17],[2,16]])put(x,y,'p')}
 if(id=='clover'){ell(6.6,16,5.4,5,'A');ell(6.4,10,6.6,5.6,'A');for(const [x,y] of [[1,8],[2,5],[4,3],[6,3],[8,3],[10,4],[1,12],[0,15],[1,19]])put(x,y,'A')}
 // ears / top features
 if(id=='pip'){for(let y=0;y<=6;y++){put(4,y,'a');put(5,y,y>0&&y<6?'p':'a');put(10,y,y>0&&y<6?'p':'a');put(11,y,'a')}put(4,0,'.');put(11,0,'.');put(12,6,'r');put(13,5,'r');put(13,7,'r');put(14,6,'r')}
 if(id=='juniper'){const E=[[1,[4,4]],[2,[4,5]],[3,[3,5]],[4,[3,6]],[5,[3,6]],[6,[3,6]]];for(const [y,[a,b]] of E){rect(a,y,b,y,y<3?'A':'a');rect(15-b,y,15-a,y,y<3?'A':'a')}}
 if(id=='bramble'){ell(3.6,6.6,1.7,1.7,'A');ell(12.4,6.6,1.7,1.7,'A')}
 if(id=='poppy'){ell(3.6,5.4,3,3,'a');ell(3.6,5.4,1.6,1.6,'p');ell(12.4,5.4,3,3,'a');ell(12.4,5.4,1.6,1.6,'p')}
 if(id=='thistle'){ell(5,7,2.5,2.4,'a');ell(11,7,2.5,2.4,'a')}
 if(id=='hoot'){put(3,4,'A');put(3,5,'A');put(4,5,'A');put(12,4,'A');put(12,5,'A');put(11,5,'A')}
 // body + belly
 ell(8,17.6,4.8,4.2,id=='clover'?'A':'a');ell(8.6,18.4,3,2.8,'c');
 if(id=='hoot'){rect(4,14,12,15,'r');put(5,16,'r');put(11,16,'r')}
 if(id=='bramble'){rect(4,14,12,15,'r');put(12,16,'r');put(12,17,'r')}
 if(id=='thistle'){put(7,14,'r');put(9,14,'r');put(8,14,'k')}
 // head
 if(id=='clover')ell(9.2,11,5.2,4.6,'a');else if(id=='thistle')ell(8,10.8,6.6,4.4,'a');else ell(8,10.6,6.2,5.2,id=='bramble'?'c':'a');
 if(id=='bramble'){rect(2,8,3,13,'a');rect(13,8,13,13,'a');rect(5,6,6,12,'A');rect(10,6,11,12,'A')}
 if(id=='juniper'){ell(10.2,12.8,3.2,2.2,'c');put(3,12,'c');put(4,13,'c')}
 if(id=='hoot'){ell(6.1,10.6,2.3,2.3,'c');ell(10.6,10.6,2.3,2.3,'c')}
 if(id=='thistle'){put(3,11,'A');put(12,9,'A');put(6,15,'A')}
 // arms + feet
 const arm=up?[[3,13],[2,12],[13,13],[14,12]]:[[3,16],[3,17],[13,16],[13,17]];for(const [x,y] of arm)put(x,y,id=='clover'?'a':(id=='thistle'?'a':'A'));
 const F={stand:[[4,6],[9,11]],w1:[[3,5],[10,12]],w2:[[5,7],[8,10]],jump:[[4,6],[9,11]],happy:[[4,6],[9,11]],hurt:[[4,6],[9,11]]}[fr];
 const fy=up?20:21;for(const [a,b] of F)rect(a,fy,b,fy+1,id=='thistle'?'a':'A');
 // auto outline
 const O=G.map(r=>r.slice());for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(G[y][x]=='.'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>G[y+dy]&&G[y+dy][x+dx]&&G[y+dy][x+dx]!='.'))O[y][x]='k';
 const P=(x,y,c)=>{if(x>=0&&x<W&&y>=0&&y<H)O[y][x]=c};
 // face: eyes, nose, mouth, cheeks
 const ey=id=='thistle'?7:10,ex=id=='thistle'?[5,11]:[6,10];
 const ec=id=='bramble'?'e':'k';
 for(const x0 of ex){const x=id=='bramble'&&x0==6?5:x0;if(fr=='happy'){P(x,ey,ec);P(x-1,ey+1,ec);P(x+1,ey+1,ec)}else if(fr=='hurt'){P(x-1,ey-1,ec);P(x+1,ey-1,ec);P(x,ey,ec);P(x-1,ey+1,ec);P(x+1,ey+1,ec)}else if(id=='bramble'){P(x+(x0==6?1:0),ey,'e');P(x+(x0==6?1:0),ey+1,'e')}else{P(x,ey,'k');P(x,ey+1,'k');P(x+1,ey,'k');P(x+1,ey+1,'k')}}
 if(id=='hoot'){for(const x of [6,10]){P(x-2,ey,'g');P(x+2,ey,'g')}P(8,12,'n');P(8,13,'n');P(9,12,'n')}
 else if(id=='thistle'){for(let x=5;x<=11;x++)P(x,12,fr=='hurt'?(x%2?'k':'a'):'k');if(fr=='happy')P(8,13,'p');P(3,11,'p');P(13,11,'p')}
 else{const nx=id=='juniper'?12:id=='clover'?12:9;P(nx,12,'n');if(id!='juniper'&&id!='clover')P(nx-1,12,'n');P(nx-1,13,fr=='hurt'?'k':(fr=='happy'?'p':'k'));P(4,12,'p');if(id!='juniper')P(12,12,'p')}
 if(id=='poppy'){P(15,11,'k');P(15,13,'k');P(13,4,'r');P(14,3,'r');P(14,5,'r');P(15,4,'r');P(14,4,'o')}
 if(id=='clover'){P(10,4,'r');P(11,3,'r');P(11,4,'r');P(10,3,'r');P(9,5,'A')}
 return O.map(r=>r.join(''))}
// facing check (Oct 30 2026): moving frames turn Mel's face 3/4 toward travel (sprite faces right; mirrored for left)
function melTurn(src){const R=src.map(r=>r.padEnd(24,'.').split(''));const ey=R.findIndex(r=>r.join('').includes('eee'));if(ey<2)return src;
 for(let y=ey-2;y<ey+5;y++){const r=R[y],seg=r.slice(6,20),n=r.slice();for(let i=0;i<14;i++)n[8+i]=seg[i];n[6]='y';n[7]='y';if(!'.k'.includes(n[21])&&n[22]=='.')n[22]='k';R[y]=n}
 for(const y of [ey+5,ey+6]){const r=R[y],seg=r.slice(8,18);for(let i=0;i<10;i++)r[10+i]=seg[i];r[8]='y';r[9]='y'}
 for(const y of [ey,ey+1,ey+2]){const r=R[y];for(let x=8;x<14;x++)if('eip'.includes(r[x])){r[x]='b';break}}
 R[ey+2][21]='b';R[ey+2][22]='k';return R.map(r=>r.join(''))}
function buildFolk(){{const o={},L={};for(const k in MELF){o[k]=mk(/^(w1|w2|r\d)$/.test(k)?melTurn(MELF[k]):MELF[k],MELP);L[k]=flipC(o[k])}o.jumpT=mk(melTurn(MELF.jump),MELP);L.jumpT=flipC(o.jumpT);SPR.mel={r:o,l:L}}
 for(const [id] of FRIENDS){const pal=Object.assign({k:'#1a1238',e:'#ffffff',o:'#ffd84a'},PALPAL[id]),o={};
  for(const fr of ['stand','w1','w2','jump','happy','hurt'])o[fr]=mk(palRows(id,fr),pal);
  const L={};for(const k in o)L[k]=flipC(o[k]);SPR[id]={r:o,l:L}}}
// draw a folk sprite: anchor bottom-centre at (x,y). squash<1 = ducking
function drawFolk(id,fr,x,y,face=1,squash=1,s=1){const sp=SPR[id][face>0?'r':'l'][fr]||SPR[id][face>0?'r':'l'].stand;const k=sp.width>16?.75:1,w=sp.width*k*s,h=sp.height*k*s*squash;g.drawImage(sp,Math.round(x-w/2),Math.round(y-h),w,h)}
// ---------- villains & critters (blocky rect pixel art, facing right; f=-1 mirrors)
function mir(x,w,f,ox){return f>0?x:2*ox-x-w}
function wizard(x,y,f=1,t=0,pose=''){ // Baron Humbug: stout party-pooper in a tall top hat, plum tailcoat, walrus moustache + monocle; anchor bottom centre
 const B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);const bob=Math.round(Math.sin(t*6)*1);
 B(-8,-2,7,2,'#1a1a22');B(2,-2,7,2,'#1a1a22');                         // black buttoned boots
 B(-6,-8,5,6,'#6a6f7e');B(2,-8,5,6,'#6a6f7e');B(-5,-8,1,6,'#4a4e5c');B(3,-8,1,6,'#4a4e5c'); // grey striped trousers
 B(-10,-24,20,17,'#6a2a6e');B(-10,-10,4,4,'#6a2a6e');B(6,-10,4,4,'#6a2a6e');        // plum tailcoat (round belly)
 B(-3,-24,6,15,'#e8d8a0');B(-1,-22,2,2,'#ffd84a');B(-1,-17,2,2,'#ffd84a');B(-1,-12,2,2,'#ffd84a'); // waistcoat + gold buttons
 B(-11,-22,3,9,'#4e1e52');B(8,-22,3,9,'#4e1e52');                       // sleeves
 B(-11,-13,3,3,'#f0c8a0');B(8,-13,3,3,'#f0c8a0');                       // hands
 if(pose=='throw'){B(8,-28,3,8,'#4e1e52');B(8,-31,3,3,'#f0c8a0')}
 B(-6,-33+bob,12,10,'#f0c8a0');                                          // round face
 B(-7,-26+bob,6,2,'#f4f4f4');B(1,-26+bob,6,2,'#f4f4f4');B(-8,-25+bob,2,2,'#f4f4f4');B(6,-25+bob,2,2,'#f4f4f4'); // big white walrus moustache
 B(-1,-28+bob,3,3,'#e8907a');                                            // button nose
 B(-4,-30+bob,2,2,'#1a1a22');B(2,-31+bob,4,4,'#ffd84a');B(3,-30+bob,2,2,'#1a1a22'); // eye + gold monocle
 B(-5,-32+bob,3,1,'#1a1a22');B(2,-33+bob,4,1,'#1a1a22');                 // frowny brows
 B(-8,-35+bob,16,2,'#1a1a22');B(-5,-45+bob,10,10,'#1a1a22');B(-5,-38+bob,10,2,'#8a2a8e'); // top hat with plum band
 B(-3,-48+bob,1,3,'#cccccc');B(-4,-49+bob,3,1,'#cccccc')}                 // a snuffed-out candle wick stuck in the hat (he hates parties)
function cat(x,y,f=1,t=0,pose='run'){ // Smudge the raccoon (Humbug's pet), anchor bottom centre, ~20x12
 const B=(dx,dy,w,h,col)=>R(mir(x+dx,w,f,x),y+dy,w,h,col);const o='#8e8e9c',s='#3a3a46',cr='#e8e8ee',M='#22222c';
 const ph=pose=='run'?Math.floor(t*14)%4:0,leg=[1,0,-1,0][ph],up=pose=='run'&&ph%2==1?1:0;
 const tail=(tx,ty)=>{B(tx,ty,6,3,o);B(tx+1,ty,1,3,s);B(tx+4,ty,1,3,s);B(tx-1,ty,1,3,s)};
 const head=(hx,hy)=>{B(hx,hy,9,7,o);B(hx,hy-2,2,2,s);B(hx+6,hy-2,2,2,s);B(hx,hy+2,9,2,M);B(hx+2,hy+2,1,1,cr);B(hx+6,hy+2,1,1,cr);B(hx+3,hy+5,6,2,cr);B(hx+8,hy+4,2,1,'#1a1a22')};
 if(pose=='crouch'){B(-9,-6,15,5,o);B(-6,-6,2,5,s);tail(-15,-5+(Math.floor(t*10)%2));head(4,-11);B(-8,-1,4,1,s);B(2,-1,4,1,s);return}
 if(pose=='sit'){B(-5,-10,10,10,o);B(-3,-8,6,7,cr);tail(5,-3);head(-4,-18);return}
 const by=-up;B(-8,-9+by,15,6,o);B(-6,-4+by,12,1,cr);                                        // body
 head(6,-14+by);                                                              // masked face
 tail(-14,-11+by+(pose=='pounce'?2:0));
 if(pose=='pounce'){B(-9,-3,4,2,s);B(5,-4,5,2,s)}else{const L=(lx,d,lift)=>B(lx+d,-3-up,2,3+up-lift,s);L(-7,leg*2,ph==1?1:0);L(-3,-leg*2,ph==3?1:0);L(2,leg*2,ph==1?1:0);L(5,-leg*2,ph==3?1:0)}}
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

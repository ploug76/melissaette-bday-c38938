// ---------- text helpers (CSS px space)
function font(sz,w='bold',f=FONT){return `${w} ${sz}px ${f}`}
function fitSize(s,size,maxW,w='bold',f=FONT){g.font=font(size,w,f);const m=g.measureText(s).width;return m>maxW?Math.max(8,Math.floor(size*maxW/m)):size}
function txt(s,x,y,size,col,align='center',o={}){g.font=font(size,o.w||'bold',o.f||FONT);g.textAlign=align;g.textBaseline='middle';
 if(o.stroke){g.lineJoin='round';g.lineWidth=o.stroke;g.strokeStyle=o.sc||'#000';g.strokeText(s,x,y)}g.fillStyle=col;g.fillText(s,x,y);return g.measureText(s).width}
function rr(x,y,w,h,r,fill,stroke,lw=2){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke()}}
function button(label,x,y,w,h,col,fn,o={}){const pressed=downBtn&&downBtn.x==x&&downBtn.y==y;rr(x,y+(pressed?2:0),w,h,h/2.4,col,'#ffffff',3);if(!pressed)rr(x,y+h-5,w,5,2.5,'rgba(0,0,0,.25)');
 txt(label,x+w/2,y+h/2+1+(pressed?2:0),fitSize(label,o.sz||18,w-20),'#fff','center',{stroke:3,sc:'rgba(0,0,0,.45)'});const b={x,y,w,h,fn,label};menuBtns.push(b);reg('btn:'+label,x,y,w,h);return b}
// ---------- world drawing (logical px inside the field)
const TH={meadow:{sky:'#6fb6ff',sky2:'#9ad0ff',top:'#5edc78',top2:'#21c842',dirt:'#a8642a',dirt2:'#7a4a1a',far:'#21b03b'},fields:{sky:'#42c8f5',sky2:'#8ae6fa',top:'#5edc78',top2:'#21c842',dirt:'#b8762e',dirt2:'#8a5420',far:'#e6ce80'},
 hills:{sky:'#7d76fc',sky2:'#a8a2ff',top:'#5edc78',top2:'#21b03b',dirt:'#a86a3a',dirt2:'#6a4022',far:'#5455ed'},river:{sky:'#6fb6ff',sky2:'#b0dcff',top:'#5edc78',top2:'#21c842',dirt:'#8a6a3a',dirt2:'#5a4422',far:'#21b03b'},
 woods:{sky:'#164f2c',sky2:'#1f6b3a',top:'#3fbf4a',top2:'#21b03b',dirt:'#6a4422',dirt2:'#4a2e16',far:'#0e3a1e'},cave:{sky:'#140c2a',sky2:'#1e1440',top:'#8a8aa0',top2:'#6a6a84',dirt:'#3a3a54',dirt2:'#2a2a40',far:'#241c44'},
 castle:{sky:'#3a1850',sky2:'#7a3070',top:'#9a94b0',top2:'#7a7490',dirt:'#5a5470',dirt2:'#443e58',far:'#2a1a3a'},lab:{sky:'#2a2440',sky2:'#3a3458',top:'#a0663a',top2:'#7a4a2a',dirt:'#5a3820',dirt2:'#4a2e18',far:'#3a3550'}};
function drawCastleFar(x,base,s,col){const B=(a,b,w,h)=>Rf(x+a*s,base-b*s,w*s,h*s);g.fillStyle=col;B(0,40,60,40);B(-8,64,18,64);B(50,64,18,64);B(22,78,16,78);for(let i=0;i<5;i++){B(-8+i*4,68,2,4);B(50+i*4,68,2,4)}B(-10,72,22,8);B(48,72,22,8);B(20,86,20,8);g.fillStyle='#ffd84a';B(27,60,4,6);B(-2,50,4,5);B(56,50,4,5)}
function drawBG(theme,t,zi){const T=TH[theme];R(0,0,FW,FH,T.sky);
 if(theme=='meadow'||theme=='fields'||theme=='river'||theme=='hills'){for(let i=0;i<4;i++)R(0,60+i*14,FW,14,i%2?T.sky2:T.sky);
  for(let i=0;i<4;i++){const cx=((i*83+t*4*(1+i%2))%(FW+60))-30,cy=14+i*11;R(cx,cy+3,22,6,'#fff');R(cx+5,cy,12,10,'#fff');R(cx+14,cy+2,12,7,'#fff')}
  drawCastleFar(196,GY-30,.28+zi*.07,'#4a3a7a');
  if(theme=='hills'){g.fillStyle=T.far;for(let i=0;i<5;i++){const x=i*64-20;g.beginPath();g.moveTo(x,GY-20);g.lineTo(x+40,GY-80);g.lineTo(x+80,GY-20);g.fill();R(x+34,GY-80+4,12,6,'#fff')}}
  else if(theme=='fields'){R(0,GY-36,FW,16,T.far);for(let i=0;i<FW;i+=16)R(i,GY-34+(i%32?2:6),10,2,'#d4c154');R(0,GY-20,FW,20,'#21b03b')}
  else{for(let i=0;i<FW;i+=24){R(i,GY-40-((i*7)%14),24,60,T.far);R(i+10,GY-46-((i*7)%14),6,8,T.far)}R(0,GY-24,FW,24,'#21b03b')}}
 else if(theme=='woods'){for(let i=0;i<9;i++){const x=i*31-6;R(x,0,10,GY,'#3a2610');R(x+2,0,2,GY,'#4e3418')}for(let i=0;i<12;i++){const x=(i*29)%FW;R(x-12,(i*17)%40,30,18,i%2?'#21b03b':'#1a8a2a')}R(0,GY-20,FW,20,'#0e3a1e')}
 else if(theme=='cave'){for(let i=0;i<FW;i+=16){R(i,26,16,8+((i*13)%10),'#2a2448');R(i+5,34+((i*13)%10),5,6,'#2a2448')}for(let i=0;i<14;i++){const x=(i*41)%FW,y=50+(i*29)%90,k=Math.floor(t*3+i)%6==0;R(x,y,3,3,k?'#fff':i%2?'#42ebf5':'#c95bba')}R(0,GY-30,FW,30,'#1e1838')}
 else if(theme=='castle'){for(let i=0;i<6;i++)R(0,i*14,FW,14,['#2a1240','#3a1850','#4a2060','#5a2870','#7a3070','#9a4070'][i]);R(202,12,12,12,'#fff6c0');R(200,14,16,8,'#fff6c0');R(204,10,8,16,'#fff6c0');R(206,15,3,3,'#e6ce80');R(209,19,2,2,'#e6ce80');
  R(0,70,FW,90,'#5a5470');for(let y=70;y<GY;y+=8)for(let x=((y/8)%2)*8;x<FW;x+=16)R(x,y,15,7,'#68627e');for(let x=0;x<FW;x+=24)R(x,62,14,8,'#5a5470');
  for(const x of [40,128,216]){R(x-8,96,16,30,'#1e1830');R(x-8,92,16,4,'#1e1830');R(x-6,94,12,2,'#1e1830')}for(const x of [84,172]){R(x,104,3,10,'#7a4a2a');const f=Math.floor(t*8)%2;R(x-1,98-f,5,6,'#ffb020');R(x,100-f,3,3,'#fff6a0')}}
 else if(theme=='lab'){for(let y=0;y<GY;y+=8)for(let x=((y/8)%2)*8;x<FW;x+=16)R(x,y,15,7,'#3e3858');R(116,14,30,30,'#14102a');R(118,16,26,26,'#2a2a6a');R(130,16,2,26,'#14102a');R(118,28,26,2,'#14102a');R(134,20,8,8,'#fff6c0');
  R(14,140,26,20,'#2a2a2a');R(12,138,30,4,'#3a3a3a');for(let i=0;i<4;i++){const b=Math.floor(t*4+i)%3;R(17+i*6,134-b*2,3,3,'#5edc78')}R(22,160,10,0,'#000');
  for(let i=0;i<3;i++){R(100+i*12,94,9,18,['#d4524d','#5455ed','#21b03b'][i]);R(102+i*12,96,5,2,'#ffd84a')}}
}
function drawSolids(G,theme,t){const T=TH[theme],water=theme=='river'||theme=='castle';
 // pits: water or darkness
 R(0,GY,FW,FH-GY,water?'#2a3aa8':'#05030c');if(water){for(let i=0;i<FW;i+=12){const o=Math.floor(t*6+i)%12;R(i+o%6,GY+6+(i%3)*8,6,1,'#42ebf5')}}
 for(const s of G.sol){const k=s.k;
  if(k=='ground'||k=='bluff'||k=='mound'){const y=s.y,h=FH-y+4;
   if(k=='mound'){for(let r=0;r<6;r++){const ins=Math.max(0,5-r*1.4);R(s.x+ins,y+r,s.w-2*ins,1,r<3?T.top:T.top2)}R(s.x,y+6,s.w,h-6,T.dirt);for(let xx=s.x+3;xx<s.x+s.w-3;xx+=7)R(xx,y+9+(xx%2)*3,3,2,T.dirt2)}
   else{R(s.x,y,s.w,h,T.dirt);for(let yy=y+8;yy<FH;yy+=8)for(let xx=s.x+((yy/8)%2)*6;xx<s.x+s.w-3;xx+=12)R(xx,yy,3,2,T.dirt2);R(s.x,y,s.w,4,T.top);R(s.x,y+4,s.w,2,T.top2);
    if(theme=='lab'){R(s.x,y,s.w,4,'#c48a4a');for(let xx=s.x;xx<s.x+s.w;xx+=20)R(xx,y,1,FH-y,'#5a3820')}}
   if(k=='bluff'){R(s.x,y,2,h,T.dirt2);R(s.x+s.w-2,y,2,h,T.dirt2)}}
  else if(k=='ledge'){R(s.x,s.y,s.w,4,'#c88a4a');R(s.x,s.y+4,s.w,2,'#7a4a1a');R(s.x+3,s.y+6,2,6,'#7a4a1a');R(s.x+s.w-5,s.y+6,2,6,'#7a4a1a')}
  else if(k=='stone'){R(s.x+1,s.y,s.w-2,6,'#9aa0b4');R(s.x,s.y+2,s.w,6,'#7a7a94');R(s.x+2,s.y+1,3,1,'#cfd6ea')}
  else if(k=='plank'){if(s.fall&&s.fy>40)continue;const sh=s.ct>=0&&!s.fall?(Math.floor(t*30)%2):0;R(s.x+sh,s.y+s.fy,s.w-1,4,'#b87a3a');R(s.x+sh,s.y+s.fy+3,s.w-1,1,'#6a4020')}
  else if(k=='log'){R(s.x,s.y,s.w,6,'#8a5a2a');R(s.x,s.y,s.w,2,'#b07a3a');R(s.x,s.y,3,6,'#e0b070');R(s.x+1,s.y+2,1,2,'#8a5a2a')}
  else if(k=='trap'){const sh=s.warn?(Math.floor(t*30)%2):0;if(s.open){R(s.x,s.y,s.w,FH-s.y,'#05030c');R(s.x,s.y,2,14,'#7a4a2a');R(s.x+s.w-2,s.y,2,14,'#7a4a2a')}else{R(s.x+sh,s.y,s.w,4,'#7a4a2a');R(s.x+sh,s.y+4,s.w,FH-s.y-4,T.dirt);R(s.x+2+sh,s.y+1,s.w-4,1,'#a86a3a');R(s.x+s.w/2-1+sh,s.y+1,2,2,'#d4c154')}}
  else if(k=='ceil'){R(0,0,FW,26,'#2a2448');for(let i=0;i<FW;i+=10){const h=4+((i*7)%9);R(i+2,26,6,h,'#3a3458');R(i+4,26+h,2,3,'#3a3458')}}
  else if(k=='chair'){R(s.x,s.y,s.w,5,'#a0663a');R(s.x,s.y-30,5,30,'#a0663a');R(s.x+1,s.y-28,3,26,'#7a4a2a');R(s.x+2,s.y+5,4,GY-s.y-5,'#7a4a2a');R(s.x+s.w-6,s.y+5,4,GY-s.y-5,'#7a4a2a')}
  else if(k=='table'){R(s.x,s.y,s.w,5,'#b07a42');R(s.x,s.y+5,s.w,2,'#7a4a2a');R(s.x+4,s.y+7,5,GY-s.y-7,'#7a4a2a');R(s.x+s.w-9,s.y+7,5,GY-s.y-7,'#7a4a2a')}
  else if(k=='skull'){R(s.x,s.y+5,s.w,24,'#5455ed');R(s.x,s.y+11,s.w,1,'#ffd84a');R(s.x+1,s.y+12,s.w-2,10,'#d4524d');R(s.x+1,s.y+22,s.w-2,7,'#21b03b');R(s.x+3,s.y-6,14,11,'#e8e0c8');R(s.x+5,s.y-3,3,3,'#000');R(s.x+12,s.y-3,3,3,'#000');R(s.x+9,s.y+1,2,2,'#000');R(s.x+5,s.y+3,10,2,'#c8c0a8')}
  else if(k=='shelf'){R(s.x,s.y,s.w,5,'#a0663a');R(s.x,s.y+5,s.w,2,'#6a4022');R(s.x+4,s.y+7,4,8,'#6a4022');R(s.x+s.w-8,s.y+7,4,8,'#6a4022');for(let i=0;i<3;i++){R(s.x+4+i*7,s.y-12,6,12,['#c95bba','#42ebf5','#d4c154'][i]);R(s.x+5+i*7,s.y-14,4,2,'#ccc')}}
  else if(k=='perch'){R(s.x,s.y,s.w,5,'#5a5470');R(s.x,s.y+5,s.w,3,'#3a3550');R(s.x+s.w/2-2,s.y+8,4,10,'#3a3550')}}}
function drawDeco(def,theme,t){for(const e of def){if(e[0]!='deco')continue;const x=e[2];
 if(e[1]=='cottage'){for(let i=0;i<6;i++)R(x+3+i*4,GY-20,4,20,i%2?'#ff9ab8':'#ffc4d8');R(x+3,GY-20,24,2,'#e06a98');R(x+12,GY-12,6,12,'#7a4a2a');R(x+16,GY-7,1,1,'#ffd84a');R(x+5,GY-16,5,5,'#42ebf5');R(x+7,GY-16,1,5,'#fff');R(x+5,GY-14,5,1,'#fff');R(x,GY-26,30,7,'#fff6e6');R(x+2,GY-31,26,5,'#fff6e6');R(x+6,GY-35,18,4,'#fff6e6');R(x+1,GY-21,4,3,'#fff6e6');R(x+13,GY-21,5,4,'#fff6e6');R(x+24,GY-21,4,2,'#fff6e6');for(const [sx,sy,c] of [[4,-24,'#ff5f8f'],[9,-29,'#5455ed'],[14,-25,'#21c842'],[19,-30,'#ffd84a'],[23,-24,'#c95bba'],[11,-33,'#42ebf5'],[26,-27,'#ff5f8f']])R(x+sx,GY+sy,2,1,c);R(x+13,GY-39,4,4,'#d4243a');R(x+15,GY-41,1,2,'#3a8a3a');R(x+22,GY-43,3,9,'#5455ed');R(x+23,GY-46-(Math.floor(t*8+x)%2),1,3,'#ffb020')}
 else if(e[1]=='sign'){R(x,GY-24,3,24,'#7a4a2a');R(x-10,GY-26,26,10,'#c88a4a');R(x-8,GY-22,18,2,'#5a3010');R(x+10,GY-24,4,6,'#5a3010')}
 else if(e[1]=='tree'){R(x-4,GY-90,10,90,'#6a4422');R(x-2,GY-90,3,90,'#8a5a2e');R(x-26,GY-122,56,30,theme=='woods'?'#21b03b':'#21c842');R(x-18,GY-132,40,12,theme=='woods'?'#1a8a2a':'#21b03b');R(x+4,GY-98,24,4,'#6a4422')}
 else if(e[1]=='flowers'){for(let i=0;i<5;i++){R(x+i*7,GY-5,1,5,'#21b03b');R(x+i*7-1,GY-7,3,3,['#ff7978','#ffd84a','#c95bba','#fff','#42ebf5'][i])}}}}
function drawEnts(G,t){for(const e of G.ents){switch(e.k){
 case 'bat':bat(e.x,e.y,t);break;case 'hawk':R(e.x-5,GY-1,10,2,'rgba(0,0,0,.25)');hawk(e.x,e.y,t,-1);break;
 case 'spider':Rf(e.x,e.y0,1,e.y-e.y0,'#cccccc');spider(e.x,e.y,t);break;case 'gbat':bat(e.x,e.y,t);break;
 case 'snake':snake(e.x,e.y,t,e.dir);break;
 case 'cat':cat(e.x,e.y,1,t,e.st=='crouch'?'crouch':e.st=='pounce'?'pounce':'run');break;
 case 'bcat':cat(e.x,e.y,e.f,t,e.st=='crouch'?'crouch':e.st=='pounce'?'pounce':e.st=='sit'?'sit':e.st=='yarn'?(Math.floor(t*4)%2?'crouch':'sit'):'run');break;
 case 'dropcat':if(e.st!='gone')cat(e.x-6,e.y,1,t,e.st=='paw'&&e.tm<.6?'crouch':'sit');break;
 case 'drop':{const w=e.st=='wob'?(Math.floor(t*20)%2?1:-1):0;if(e.st=='broke'){R(e.x-6,e.y-2,4,2,e.kind=='rock'?'#8a8aa0':'#d4524d');R(e.x+2,e.y-3,4,3,e.kind=='rock'?'#6a6a84':'#d4524d')}else if(e.kind=='rock'){R(e.x-4+w,e.y-8,8,8,'#8a8aa0');R(e.x-2+w,e.y-7,3,2,'#cfd6ea')}else{R(e.x-4+w,e.y-7,8,7,'#d4524d');R(e.x-3+w,e.y-6,2,2,'#ff9a98');R(e.x+w,e.y-10,1,3,'#5a3010');R(e.x+1+w,e.y-10,3,2,'#21c842')}break}
 case 'wiz':{const a=Math.min(1,e.tm/.3,(e.act=='spell'?.6+(e.a||3)*.65+.6:e.act=='net'?1.7:1.8)-e.tm>0?1:0);if(e.tm<.3){for(let i=0;i<6;i++){const an=i/6*TAU+e.tm*8;R(e.x+Math.cos(an)*12*e.tm*3,e.y-16+Math.sin(an)*12*e.tm*3,3,3,'#c95bba')}}
  if(a>0){R(e.x-16,e.y+1,32,2,'#7a4a2a');R(e.x+12,e.y-1,6,5,'#d4c154');wizard(e.x,e.y,e.f,t,e.tm>.5&&e.tm<.9?'throw':'')}break}
 case 'orb':{const k=Math.floor(t*20)%2;R(e.x-3,e.y-3,6,6,k?'#c95bba':'#ff7978');R(e.x-1,e.y-1,2,2,'#fff');R(e.x-e.vx*.04-1,e.y-e.vy*.04-1,2,2,'#c95bba');break}
 case 'potion':R(e.x-2,e.y-4,5,5,'#5edc78');R(e.x-1,e.y-6,3,2,'#e8e0c8');R(e.x-1,e.y-3,1,1,'#fff');break;
 case 'net':case 'netg':{const y=e.y;g.globalAlpha=e.k=='netg'?Math.max(0,1-e.tm/1.2):1;for(let i=-13;i<=13;i+=4)R(e.x+i,y-16,1,16,'#e6ce80');for(let j=0;j<16;j+=4)R(e.x-13,y-16+j,27,1,'#e6ce80');g.globalAlpha=1;if(e.k=='net'){const t2=topAt(G,e.x,0);R(e.x-12,t2-1,24,2,'rgba(0,0,0,.3)')}break}
 case 'yarn':R(e.x-4,e.y-4,8,8,'#ff5f8f');R(e.x-3,e.y-2,6,1,'#ffb0c8');R(e.x-2,e.y+1,5,1,'#ffb0c8');R(e.x+4,e.y+2,6,1,'#ff5f8f');break}}}
function drawItems(G,t){for(const it of G.items){if(it.k=='candle'){if(it.hid&&!it.rev){if(Math.floor(t*2+it.x)%7==0)R(it.x,it.y-8,1,1,'#fff');continue}candle(it.x,it.y,t,foundEver.includes(it.id))}
 else if(it.k=='gift')gift(it.x,it.y,it.kind,t);else if(it.k=='cage'){R(it.x,0,1,it.y-40,'#5a5a6a');cage(it.x,it.y,FRIENDS[it.fi][0],t,it.open)}}}
function drawBoss(G,t){const B=G.boss;if(!B)return;
 B.L.forEach((l,i)=>{const pl=B.lev[i];Rf(l.x,0,1,l.y+(pl?6:0),'#d4c154');R(l.x-3,l.y+(pl?6:0),7,8,pl?'#5edc78':'#ff5f8f');R(l.x-1,l.y+2+(pl?6:0),3,4,'#fff')});
 // bucket over the perch, net above the wizard
 const bx=74;if(!B.buck){R(bx,8,12,10,'#8a8aa0');R(bx+1,9,10,2,'#42ebf5')}else{R(bx,8,10,12,'#8a8aa0');if(G.gt%1<.5)for(let i=0;i<5;i++)R(bx+4+i*3,22+((t*60+i*7)%26),2,3,'#42ebf5')}
 const ny=B.netted?B.netY:-30;for(let i=-16;i<=16;i+=4)R(B.wx+i,ny,1,24,'#e6ce80');for(let j=0;j<24;j+=4)R(B.wx-16,ny+j,33,1,'#e6ce80');
 if(!B.netted||B.netY<B.wy-31){}wizard(B.wx,B.wy,G.p.x<B.wx?-1:1,t,B.pose);if(B.wand){const f=G.p.x<B.wx?-1:1;R(B.wx+f*11,B.wy-20,2,10,'#7a4a2a');R(B.wx+f*11-1,B.wy-22,4,3,Math.floor(t*8)%2?'#ffd84a':'#fff')}else R(B.wx+8,B.wy+2,10,2,'#7a4a2a');
 if(B.netted){for(let i=-12;i<=12;i+=4)R(B.wx+i,B.wy-36,1,36,'#e6ce80');for(let j=0;j<36;j+=5)R(B.wx-12,B.wy-36+j,25,1,'#e6ce80')}}
function drawPuddles(G,t){for(const q of G.puddles){const w=Math.min(q.w,q.age*90+6);R(q.x-w/2,q.y-1,w,2,'#5edc78');R(q.x-w/2+2,q.y-2,w-4,1,'#9af0a8');if(Math.floor(t*3+q.x)%4==0)R(q.x-3,q.y-4,2,2,'#bdfcc6')}}
function drawPlayer(G,t){const p=G.p;if(p.inv>0&&G.ph=='play'&&Math.floor(t*14)%2)return;
 if(G.ph=='die'){const k=G.pht;if(p.dead=='tired'){drawFolk('mel','hurt',p.x,p.y,p.face,.7);R(p.x+6,p.y-26-k*6,3,3,'#fff');R(p.x+9,p.y-31-k*6,2,2,'#fff');return}
  g.save();g.translate(p.x,p.y-10);g.rotate((p.dead=='fall'?.4:1)*k*7*p.face);drawFolk('mel','hurt',0,10,p.face);g.restore();
  if(p.dead!='fall'){const hx=p.x-p.face*k*40,hy=p.y-26-k*50+k*k*60;R(hx-7,hy,14,3,'#fff');R(hx-4,hy-3,8,3,'#fff')}return}
 const fr=!p.on?'jump':Math.abs(p.vx)>8?['w1','stand','w2','stand'][Math.floor(p.walkT*10)%4]:(G.ph=='win'?(Math.floor(gt*3)%2?'cheer':'happy'):'stand');
 drawFolk('mel',p.net>0?'hurt':fr,p.x,p.y,p.face,p.duck?.62:1);
 if(G.pw.spring>0){R(p.x-6,p.y-2,5,2,'#5edc78');R(p.x+1,p.y-2,5,2,'#5edc78')}
 if(p.slip&&Math.abs(p.vx)>20&&Math.floor(t*12)%2)R(p.x-p.face*6,p.y-3,3,2,'#bdfcc6');
 if(G.pw.shield>0){g.strokeStyle='rgba(66,235,245,.8)';g.lineWidth=1.2;g.beginPath();g.arc(p.x,p.y-12,15,0,TAU);g.stroke()}
 if(p.net>0){for(let i=-11;i<=11;i+=4)R(p.x+i,p.y-22,1,22,'#e6ce80');for(let j=0;j<22;j+=4)R(p.x-11,p.y-22+j,23,1,'#e6ce80')}}
// particles & popups
let PARTS=[],POPS=[];
function part(x,y,vx,vy,col,life,sz=2,gr=200){PARTS.push({x,y,vx,vy,col,life,max:life,sz,gr})}
function drawParts(dt){for(const q of PARTS){q.life-=dt;q.vy+=q.gr*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;g.globalAlpha=Math.max(0,Math.min(1,q.life/q.max*1.5));R(q.x,q.y,q.sz,q.sz,q.col)}g.globalAlpha=1;PARTS=PARTS.filter(q=>q.life>0)}

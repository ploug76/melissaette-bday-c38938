// ---------- HUD (CSS px), lane banner, controls, popups
let banner=null,bannerQ=[];
function setBanner(s,col){if(banner&&banner.s==s)return;bannerQ.push({s,col:col||'#fff'});if(bannerQ.length>3)bannerQ.shift();if(!banner)nextBanner()}
function nextBanner(){banner=bannerQ.shift()||null;if(banner)banner.t=0}
function hudItems(){const it=[];const sk=SK[G.skill];
 it.push({k:'score',w:0,draw:(x,y,h,f)=>{txt('SCORE '+String(G.score).padStart(6,'0'),x+8,y+h/2,f,'#ffd84a','left',{f:MONO})},text:'SCORE 000000',mono:1});
 it.push({k:'lives',text:'×'+G.lives+'  ',icon:1,draw:(x,y,h,f)=>{const s=(h-4)/24;const ox=g.getTransform();g.imageSmoothingEnabled=false;g.drawImage(SPR.mel.r.happy,x+6,y+2,16*s,24*s);txt('×'+G.lives,x+8+16*s+2,y+h/2,f,'#fff','left',{f:MONO})}});
 it.push({k:'energy',text:'ENERGY ##########',bar:1,draw:(x,y,h,f,w)=>{const lw=txt('ENERGY',x+8,y+h/2,f*.8,'#fff','left');const bx=x+8+lw+6,bw=w-(bx-x)-8;rr(bx,y+h/2-6,bw,12,4,'#2a2440','#fff',1.5);
  if(!sk.drain||ZONES[G.zi].boss){txt(sk.drain?'BOSS!':'∞ STROLL',bx+bw/2,y+h/2+1,f*.75,'#5edc78','center')}else{const e=G.energy/100,col=e>.5?'#5edc78':e>.2?'#ffd84a':'#fc5554';const flash=e<.2&&Math.floor(gt*4)%2;rr(bx+2,y+h/2-4,Math.max(2,(bw-4)*e),8,3,flash?'#fff':col)}}});
 it.push({k:'candles',text:'🕯 54/54',draw:(x,y,h,f)=>{g.save();g.translate(x+8,y+h/2+6);g.scale(1.3,1.3);g.imageSmoothingEnabled=false;candle(3,0,gt,false);g.restore();txt(foundEver.length+'/'+TOTAL_CANDLES,x+22,y+h/2,f,'#ff86a6','left',{f:MONO})}});
 const pw=[];if(G.pw.shield)pw.push('🫧');if(G.pw.spring>0)pw.push('👟'+Math.ceil(G.pw.spring));if(G.pw.slow>0)pw.push('🐌'+Math.ceil(G.pw.slow));
 if(pw.length)it.push({k:'power',text:pw.join(' '),draw:(x,y,h,f)=>txt(pw.join(' '),x+8,y+h/2,f,'#42ebf5','left')});
 return it}
function drawHUD(){const L=LY,items=hudItems();let f=L.portrait?14:13;
 const regions=L.portrait?L.rows.map(r=>({...r,cx:r.x})):[{...L.rows[0],cx:L.rows[0].x},{...L.side[0],cx:L.side[0].x,col:1,cy:L.side[0].y},{...L.side[1],cx:L.side[1].x,col:1,cy:L.side[1].y}];
 const H=28;for(const it of items){g.font=font(f,'bold',it.mono?MONO:FONT);let w=it.bar?150:Math.ceil(g.measureText(it.text).width)+16+(it.icon?16:0);
  let placed=false;for(const r of regions){if(r.col){const ww=Math.min(w,r.w);if(ww<70||r.cy+H>r.y+r.h)continue;if(it.bar&&ww<110)continue;const box={x:r.x,y:r.cy,w:ww,h:H};if(!freeAt(box))continue;rr(box.x,box.y,box.w,box.h,9,'rgba(10,6,30,.72)','rgba(255,255,255,.55)',1.5);it.draw(box.x,box.y,H,f,box.w);reg('hud:'+it.k,box.x,box.y,box.w,box.h);r.cy+=H+6;placed=true;break}
   const ww=it.bar?Math.min(170,Math.max(120,r.x+r.w-r.cx)):w;if(r.cx+ww>r.x+r.w+.5)continue;const box={x:r.cx,y:r.y+(r.h-H)/2,w:ww,h:H};if(!freeAt(box))continue;
   rr(box.x,box.y,box.w,box.h,9,'rgba(10,6,30,.72)','rgba(255,255,255,.55)',1.5);it.draw(box.x,box.y,H,f,box.w);reg('hud:'+it.k,box.x,box.y,box.w,box.h);r.cx+=ww+6;placed=true;break}}}
function drawLane(){const L=LY.lane;let s,col='#cfe3ff';if(banner){s=banner.s;col=banner.col}else if(state=='play'&&G){const z=ZONES[G.zi];const rt=RT(G),i0=rt.findIndex(r=>r.zi==G.zi),n=rt.filter(r=>r.zi==G.zi).length;s=z.boss?z.name:`${z.name}  ${G.ri-i0+1}/${n}`+(G.round>1?`  •  Round ${G.round}`:'')}
 if(!s)return;const sz=fitSize(s,15,L.w-20);g.font=font(sz);const w=Math.min(L.w,g.measureText(s).width+24),x=L.x+(L.w-w)/2;rr(x,L.y,w,L.h,10,'rgba(10,6,30,.75)',banner?col:'rgba(255,255,255,.4)',1.5);txt(s,x+w/2,L.y+L.h/2+1,sz,col);reg('lane',x,L.y,w,L.h)}
const CTRL_ICON={l:'◀',r:'▶',d:'▼',j:'JUMP'};
function drawControls(){for(const k of ['l','r','d','j']){const b=LY.btn[k],on=held[k];rr(b.x,b.y,b.w,b.h,b.w*.28,on?'rgba(255,255,255,.42)':'rgba(255,255,255,.16)','rgba(255,255,255,.75)',2.5);
  if(k=='j'){txt('▲',b.x+b.w/2,b.y+b.h*.36,b.w*.3,'#fff');txt('JUMP',b.x+b.w/2,b.y+b.h*.7,fitSize('JUMP',b.w*.2,b.w-12),'#fff')}else if(k=='d'){txt('▼',b.x+b.w/2,b.y+b.h*.42,b.w*.34,'#fff');txt('DUCK',b.x+b.w/2,b.y+b.h*.78,fitSize('DUCK',b.w*.18,b.w-12),'#fff')}else txt(CTRL_ICON[k],b.x+b.w/2,b.y+b.h/2+1,b.w*.4,'#fff');
  reg('btn:'+k,b.x,b.y,b.w,b.h)}}
function w2s(x,y){return[LY.field.x+x*LY.ws,LY.field.y+y*LY.ws]}
function drawPops(dt){const F=LY.field;for(const q of POPS){q.t+=dt;q.y-=18*dt}POPS=POPS.filter(q=>q.t<1.1);
 for(const q of POPS){let [sx,sy]=w2s(q.x,q.y);const sz=Math.max(12,Math.round(LY.ws*7));g.font=font(sz);const w=g.measureText(q.s).width+8,h=sz+6;let box={x:sx-w/2,y:sy-h/2,w,h};
  box.x=CL(box.x,F.x+2,F.x+F.w-w-2);box.y=CL(box.y,F.y+2,F.y+F.h-h-2);let ok=freeAt(box);for(let k=1;k<7&&!ok;k++){box.y-=h*.8;if(box.y<F.y+2)break;ok=freeAt(box)}if(!ok)continue;
  g.globalAlpha=Math.min(1,(1.1-q.t)*3);txt(q.s,box.x+w/2,box.y+h/2,sz,q.col,'center',{stroke:3,sc:'#000'});g.globalAlpha=1;reg('pop',box.x,box.y,box.w,box.h)}}
// ---------- screens
function dimAll(a){g.fillStyle=`rgba(8,4,24,${a})`;g.fillRect(0,0,VW,VH)}
function domRects(){const out=[];for(const id of ['pause','mute','help']){const e=$(id);if(getComputedStyle(e).display=='none')continue;const r=e.getBoundingClientRect();out.push({k:'dom:'+id,x:r.left,y:r.top,w:r.width,h:r.height})}return out}
function drawTitle(){const L=LY;dimAll(.35);const cx=L.L+L.aw/2,best=ST.get('best',0);
 const two=!L.portrait;const colW=two?L.aw/2-16:L.aw-24;const lx=two?L.L+L.aw/4+4:cx;let y=L.T+(two?62:70);
 const s1=fitSize("MELISSAETTE",two?30:36,colW),s2t="Rescue in Gargamel's Castle",s2=fitSize(s2t,two?16:18,colW);
 txt("MELISSAETTE",lx,y+s1/2,s1,'#ffd84a','center',{stroke:6,sc:'#1b1440'});reg('title1',lx-colW/2,y,colW,s1);y+=s1+4;
 txt(s2t,lx,y+s2/2,s2,'#fff','center',{stroke:5,sc:'#5455ed'});reg('title2',lx-colW/2,y,colW,s2);y+=s2+8;
 const ded='For Melissa — Happy 54th Birthday 🎂',ds=fitSize(ded,16,colW);rr(lx-colW/2,y,colW,ds+12,10,'rgba(255,134,166,.25)','#ff86a6',1.5);txt(ded,lx,y+(ds+12)/2+1,ds,'#ffd0de');reg('dedication',lx-colW/2,y,colW,ds+12);y+=ds+20;
 const bl=[['▶  START ADVENTURE','#21b03b',()=>start()],['SKILL '+skill+':  '+SK[skill].n+'  ◀▶','#5455ed',cycleSkill],['HOW TO PLAY','#c95bba',showHelp]];
 if(foundEver.length>=TOTAL_CANDLES)bl.push(['🎂  BIRTHDAY CAKE','#d4524d',()=>toCake(true)]);
 const bh=two?40:46,gap=two?8:10,bw=Math.min(300,colW);const info=`BEST ${String(best).padStart(6,'0')}   •   CANDLES ${foundEver.length}/${TOTAL_CANDLES}`;
 let by,bx;if(two){bx=L.L+L.aw*3/4-bw/2-4;by=Math.max(L.T+60,L.T+(L.ah-(bl.length*(bh+gap)+30))/2)}else{bx=cx-bw/2;by=L.B-96-bl.length*(bh+gap)}
 // Peter's title-screen picture, framed like a game box
 const artTop=y,artBot=two?L.B-74:by-14,side=Math.min(artBot-artTop,colW,420);
 if(side>60){const ax=Math.round(lx-side/2),ay=Math.round(artTop+(artBot-artTop-side)/2);rr(ax-5,ay-5,side+10,side+10,8,'#d4524d','#fff',3);
  if(TITLE_IMG.complete&&TITLE_IMG.naturalWidth){g.save();g.imageSmoothingEnabled=true;g.drawImage(TITLE_IMG,ax,ay,side,side);g.restore()}else R(ax,ay,side,side,'#1b1440');
  reg('titleart',ax-5,ay-5,side+10,side+10)}
 bl.forEach((b,i)=>button(b[0],bx,by+i*(bh+gap),bw,bh,b[1],b[2],{sz:18}));
 const iy=by+bl.length*(bh+gap)+10;const is=fitSize(info,13,bw+40,'bold',MONO);txt(info,two?bx+bw/2:cx,iy,is,'#ffd84a','center',{f:MONO,stroke:3,sc:'#000'});g.font=font(is,'bold',MONO);const iw=g.measureText(info).width;reg('info',(two?bx+bw/2:cx)-iw/2,iy-is/2-1,iw,is+2)}
const TITLE_IMG=new Image();TITLE_IMG.src='title.jpg';
function drawFolkAt(id,fr,x,y,s){g.drawImage(SPR[id].r[fr],Math.round(x-8*s),Math.round(y-24*s),16*s,24*s)}
function cycleSkill(){skill=skill%4+1;ST.set('skill',skill)}
function panel(title,lines,btns,col='#ffd84a'){const L=LY,w=Math.min(340,L.aw-24);let h=60+lines.length*22+btns.length*54+10;const x=L.L+(L.aw-w)/2,y=Math.max(L.T+54,L.T+(L.ah-h)/2);
 rr(x,y,w,h,16,'rgba(16,10,44,.94)','#fff',3);const ts=fitSize(title,26,w-30);txt(title,x+w/2,y+30,ts,col,'center',{stroke:4,sc:'#000'});reg('ptitle',x+15,y+30-ts/2,w-30,ts);
 let yy=y+62;for(const [s,c] of lines){const fs=fitSize(s,15,w-24,'normal');const tw=txt(s,x+w/2,yy,fs,c||'#fff','center',{w:'normal'});reg('pline',x+w/2-tw/2,yy-fs/2,tw,fs);yy+=22}
 yy+=6;const bw=w-60;btns.forEach(b=>{button(b[0],x+30,yy,bw,44,b[1],b[2]);yy+=54});}
function drawPause(){dimAll(.55);UIE=UIE.filter(e=>e.k.startsWith('dom:'));panel('PAUSED',[['The game pauses itself if you switch apps.','#cfe3ff']],[['▶  RESUME','#21b03b',togglePause],['RESTART','#5455ed',()=>{paused=false;start()}],['MAIN MENU','#56616e',toTitle]])}
function drawOver(){dimAll(.7);UIE=UIE.filter(e=>e.k.startsWith('dom:'));const hs=ST.get('scores',[]);const lines=[['SCORE  '+G.score.toLocaleString(),'#fff'],[G.newBest?'★ NEW BEST SCORE! ★':'BEST  '+ST.get('best',0).toLocaleString(),'#ffd84a'],[`Friends freed ${G.friends.length}/7  •  Candles ${foundEver.length}/54`,'#ff86a6'],['TOP SCORES','#ffd84a']];
 hs.forEach((e,i)=>lines.push([`${i+1}.  ${String(e.s).padStart(6,'0')}  ${SK[e.k]?SK[e.k].n:''}  R${e.r}`,i==G.rank?'#5edc78':'#fff']));
 panel('GAME OVER',lines,[['▶  PLAY AGAIN','#21b03b',()=>{if(gt-overAt>.7)start()}],['MAIN MENU','#56616e',()=>{if(gt-overAt>.7)toTitle()}]],'#fc5554')}
// ---------- parade & birthday cake scenes (drawn in the field)
let sceneT=0;
function drawParadeWorld(t){drawBG('meadow',t,6);const T=TH.meadow;R(0,GY,FW,FH-GY,T.dirt);R(0,GY,FW,4,T.top);R(0,GY+4,FW,2,T.top2);drawCastleFar(150,GY-10,1.1,'#5a4a8a');
 for(let i=0;i<10;i++){const x=(i*29+t*40)%(FW+20)-10;R(x,10+(i%3)*8,3,3,['#ff7978','#ffd84a','#42ebf5','#5edc78'][i%4])}
 const order=['mel',...G.friends.slice().sort((a,b)=>a-b).map(i=>FRIENDS[i][0])];const lead=Math.min(FW-20,-30+t*42);
 order.forEach((id,i)=>{const x=lead-i*22;if(x<-12)return;const hop=Math.abs(Math.sin(t*7+i))*4;drawFolk(id,Math.floor(t*6+i)%2?'w1':'w2',x,GY-hop,1);if(i==0&&t>6)drawFolk(id,'happy',x,GY-hop,1)});
 // the outsmarted villains, sulking in the net
 for(let i=-12;i<=12;i+=4)R(214+i,GY-38,1,38,'#e6ce80');wizard(214,GY,-1,t,'');cat(232,GY,-1,t,'sit');for(let j=0;j<38;j+=5)R(202,GY-38+j,25,1,'#e6ce80')}
function drawCakeWorld(t){R(0,0,FW,FH,'#2a1a4a');for(let i=0;i<30;i++){const x=(i*53)%FW,y=(i*37)%70,k=Math.floor(t*3+i)%5==0;R(x,y,k?2:1,k?2:1,'#fff')}
 R(0,GY,FW,FH-GY,'#5a3a2a');R(0,GY,FW,4,'#ff86a6');
 // three-tier cake with exactly 54 candles (10 + 18 + 26)
 const cx=128,tiers=[[96,26,GY-26,26],[72,24,GY-50,18],[48,22,GY-72,10]];R(cx-58,GY-4,116,4,'#e8e0c8');
 tiers.forEach(([w,h,y,n],ti)=>{R(cx-w/2,y,w,h,['#ff86a6','#fff0f6','#ffd0de'][ti]);R(cx-w/2,y,w,4,'#ffffff');for(let i=0;i<w;i+=6)R(cx-w/2+i,y+4,3,2+(i%12?0:2),'#ffffff');R(cx-w/2,y+h-3,w,3,['#d4524d','#c95bba','#5455ed'][ti]);
  for(let i=0;i<n;i++){const x=cx-w/2+3+i*(w-6)/(n-1);R(x,y-6,2,6,['#5455ed','#ffd84a','#5edc78','#42ebf5'][i%4]);const f=Math.floor(t*10+i)%3;R(x,y-9-f%2,2,3,'#ffb020');R(x,y-8-f%2,1,1,'#fff6a0')}});
 txt2('54',cx,GY-14,'#d4524d');
 const order=['mel',...G.friends.slice().sort((a,b)=>a-b).map(i=>FRIENDS[i][0])];const slots=[[cx-80,0],[cx+80,0],[cx-100,0],[cx+100,0],[cx-118,0],[cx+118,0],[cx-62,0],[cx+62,0]];
 order.forEach((id,i)=>{const [x]=slots[i];const hop=Math.max(0,Math.sin(t*4+i))*3;drawFolk(id,Math.floor(t*2+i)%3?'happy':'stand',x,GY-hop,x<cx?1:-1);if(Math.floor(t*2+i)%4==0){R(x+(x<cx?8:-10),GY-34-((t*20+i*5)%14),2,5,'#fff');R(x+(x<cx?8:-10),GY-34-((t*20+i*5)%14),4,2,'#fff')}});
 g.save();g.translate(22,GY);g.scale(.8,.8);wizard(0,0,1,t,'');g.restore();R(16,GY-33,10,3,'#ffd84a');R(18,GY-37,6,4,'#ff5f8f');R(20,GY-40,2,3,'#ffd84a');cat(240,GY,-1,t,'sit');R(236,GY-21,8,2,'#ffd84a');R(238,GY-25,4,4,'#42ebf5');
 if(Math.random()<.5&&!paused)for(let k=0;k<2;k++)part(Math.random()*FW,-4,(Math.random()-.5)*30,20+Math.random()*30,['#ff7978','#ffd84a','#42ebf5','#5edc78','#c95bba','#fff'][Math.floor(Math.random()*6)],3,2,20)}
function txt2(s,x,y,col){g.font='bold 12px '+MONO;g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y)}
const LYR=['Happy birthday to you','Happy birthday to you','Happy birthday, dear Melissa','Happy birthday to you!'];
function drawSceneText(){const L=LY;const top=L.portrait?L.T+6:L.T+6;
 if(state=='parade'){const all=foundEver.length>=TOTAL_CANDLES;const s1='The Friendship Parade!',s2=`Friends rescued: ${G.friends.length}/7   •   Round ${G.round}`;
  const a=fitSize(s1,24,L.aw-170);txt(s1,L.L+8+(L.aw-170)/2,top+21,a,'#ffd84a','center',{stroke:4,sc:'#000'});reg('t1',L.L+8,top+21-a/2,L.aw-170,a);
  const msg=sceneT<3?s2:all?'All 54 candles found… a surprise awaits!':`Candles found: ${foundEver.length}/54 — find them all for a birthday surprise!`;setLaneMsg(msg,all?'#ff86a6':'#cfe3ff')}
 else{const s1=LY.portrait?'Happy 54th Birthday,':'Happy 54th Birthday, Melissa!',s2='Melissa!';const a=fitSize(s1,26,L.aw-170);txt(s1,L.L+8+(L.aw-170)/2,top+21,a,'#ffd84a','center',{stroke:5,sc:'#c95bba'});reg('t1',L.L+8,top+21-a/2,L.aw-170,a);
  if(L.portrait){const b=fitSize(s2,30,L.aw-16);txt(s2,L.L+L.aw/2,L.T+67,b,'#ff86a6','center',{stroke:5,sc:'#1b1440'});reg('t2',L.L+8,L.T+67-b/2,L.aw-16,b)}
  const line=Math.min(3,Math.floor(Math.max(0,cakeSongT)/((60/96)*3)));setLaneMsg(L.portrait?'♪ '+LYR[line]+' ♪':'♪ '+LYR[line]+' ♪  —  Melissa!','#ffd84a')}}
let laneMsg=null;function setLaneMsg(s,c){laneMsg={s,c}}
function drawSceneButtons(){const L=LY;if(sceneT<2.5)return;const bw=Math.min(280,L.aw-40);let x,y;
 if(L.portrait){x=L.L+(L.aw-bw)/2;y=Math.min(L.B-60,L.lane.y+L.lane.h+20)}else{x=L.R-8-Math.min(bw,L.side[1].w);y=L.btn.j.y;}
 const w=L.portrait?bw:Math.min(bw,L.side[1].w);if(state=='parade')button('CONTINUE ▶',x,y,w,46,'#21b03b',endParade);else if(cakeSongT>11||cakeReplay)button(cakeReplay&&!G.cont?'BACK TO MENU':'NEXT ROUND ▶',x,y,w,46,'#21b03b',endCake)}

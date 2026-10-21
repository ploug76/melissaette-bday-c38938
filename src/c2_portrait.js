// ---------- Melissaette big portrait (vector, cartoon outline style) for the title, ending and cover.
// (cx,by) = bottom centre (feet), h = full height in current units. mood: 'smile' | 'happy' | 'wave'
function drawMelPortrait(cx,by,h,mood='smile',t=0){const u=h/100,K='#1a1238';g.save();g.translate(cx,by);g.scale(u,u);g.lineJoin='round';g.lineCap='round';
 const P=(pts,fill,lw=2.4,close=true)=>{g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const q=pts[i];if(q.length==6)g.bezierCurveTo(...q);else if(q.length==4)g.quadraticCurveTo(...q);else g.lineTo(q[0],q[1])}if(close)g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(lw){g.strokeStyle=K;g.lineWidth=lw;g.stroke()}};
 const E=(x,y,rx,ry,fill,lw=2.4,rot=0)=>{g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill()}if(lw){g.strokeStyle=K;g.lineWidth=lw;g.stroke()}};
 const L=(pts,col,lw)=>{P(pts,null,0,false);g.strokeStyle=col;g.lineWidth=lw;g.stroke()};
 const sw=Math.sin(t*2.2)*1.2,wave=mood=='wave'||mood=='happy'?Math.sin(t*7)*8:0,happy=mood=='happy'||mood=='wave',closed=mood=='happy';
 const HAIR='#ffd23a',HS='#e3992a',HL='#fff1a0',SKIN='#5aa2ff',SK2='#3c7fe0',W='#ffffff',WS='#cfd7f0';
 // long wavy back hair
 P([[-18,-80],[-27,-78,-27,-66],[-24,-61,-27,-55],[-30,-49,-26,-44],[-29,-38,-24,-33],[-20,-31,-16,-33],[-13,-40],[-12,-52],[12,-52],[13,-40],[16,-33],[20,-31,24,-33],[29,-38,26,-44],[30,-49,27,-55],[24,-61,27,-66],[27,-78,18,-80]],HAIR);
 for(const sx of[-1,1]){L([[sx*20,-74],[sx*25,-62,sx*21,-54],[sx*25,-46,sx*21,-38]],HS,1.4);L([[sx*16,-70],[sx*21,-58,sx*17,-50],[sx*19,-44,sx*17,-40]],HL,1.2)}
 // arms
 const limb=(pts,w)=>{for(const [col,lw] of[[K,w+2.6],[SKIN,w]]){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const q=pts[i];if(q.length==4)g.quadraticCurveTo(...q);else g.lineTo(q[0],q[1])}g.strokeStyle=col;g.lineWidth=lw;g.stroke()}};
 const arm=(sx,up)=>{if(up){limb([[sx*9,-49],[sx*21,-54,sx*27,-72-wave*.5]],4.6);E(sx*27.5,-74.5-wave*.5,3.4,3.6,SKIN,2)}else{limb([[sx*9.5,-49],[sx*15.5,-44,sx*15,-33]],4.6);E(sx*15,-31.5,3.2,3.4,SKIN,2)}};
 arm(-1,mood=='happy');arm(1,mood!='smile');
 // legs + white heeled shoes
 for(const sx of[-1,1]){limb([[sx*4,-17],[sx*4,-5]],3.6);P([[sx*4-4,-5],[sx*4+4.5,-5],[sx*4+6,-2],[sx*4+5,0],[sx*4-1,0],[sx*4-2,-1.5],[sx*4-3.6,-1.5],[sx*4-4,1.2],[sx*4-5.2,1.2],[sx*4-5,-3]],W,2)}
 // white dress: fitted bodice, cinched waist, flared skirt with folds, puff sleeves
 P([[-9,-53],[9,-53],[7.5,-39],[7,-37],[17,-17],[10,-14,0,-14],[-10,-14,-17,-17],[-7,-37],[-7.5,-39]],W);
 P([[-7.6,-40],[7.6,-40],[7.2,-36.5],[-7.2,-36.5]],WS,1.6);
 L([[-4,-35],[-7,-24,-8,-16]],WS,1.4);L([[3,-35],[5,-25,7,-15.5]],WS,1.4);L([[-15,-18],[0,-15.5,15,-18]],WS,1.6);
 for(const sx of[-1,1])E(sx*10,-50,4.6,3.6,W,2);
 E(0,-53.5,3.2,1.8,SKIN,0);
 // ears + face
 for(const sx of[-1,1])E(sx*17,-66,3,4,SKIN,2);
 E(0,-68,17,15,SKIN);
 // bangs under the hat
 P([[-17,-72],[-17,-80],[17,-80],[17,-72],[13,-76,9,-73],[6,-77,1,-74],[-3,-78,-7,-74],[-11,-77,-17,-72]],HAIR,2);
 L([[-6,-77],[-4,-75]],HS,1);L([[8,-77],[10,-75]],HS,1);
 for(const sx of[-1,1])P([[sx*13,-78],[sx*19,-77,sx*19.5,-68],[sx*20,-60,sx*17.5,-55],[sx*16,-60,sx*16.4,-66],[sx*15.6,-72,sx*13,-78]],HAIR,2);
 // eyes with lashes
 const blink=!closed&&((t*0.5)%4)>3.85;
 for(const sx of[-1,1]){const ex=sx*6.3,ey=-68.5;
  if(closed||blink){L([[ex-4,ey+1],[ex,ey-3,ex+4,ey+1]],K,2)}
  else{E(ex,ey,4.8,6.4,W,2);E(ex+sx*-1.1,ey+1.4,2.9,3.9,'#1a1238',0);E(ex+sx*-1.1,ey+2.2,1.9,2.4,'#3a5fd0',0);E(ex+sx*-1.8,ey-.4,1.1,1.1,W,0)}
  // lashes (outer corner)
  L([[ex+sx*3.6,ey-5],[ex+sx*6.4,ey-7.5]],K,1.8);L([[ex+sx*4.6,ey-3],[ex+sx*7.4,ey-4.4]],K,1.8);L([[ex+sx*1.2,ey-6.6],[ex+sx*2.2,ey-9.4]],K,1.6)}
 // small nose, cheeks, smile
 E(0,-62.6,3.2,2.6,SKIN,1.8);E(-.8,-63.4,1,0.8,'#9cc8ff',0);
 g.globalAlpha=.55;E(-10.5,-62,3,1.9,'#ff7aa8',0);E(10.5,-62,3,1.9,'#ff7aa8',0);g.globalAlpha=1;
 if(happy){P([[-5,-58.5],[5,-58.5],[3.5,-53.5,-3.5,-53.5,-5,-58.5]],'#c8304a',1.8);E(0,-55.6,2.2,1.1,'#ff8fb0',0)}
 else L([[-5,-58.6],[-2,-54.8,2,-54.8,5,-58.6]],K,1.8);
 // floppy Smurf hat (crown, tip flopping back to the left, fold shading)
 P([[-18.5,-76],[-21,-88,-12,-102,2,-101],[16,-100,22,-88,18.5,-76],[6,-74,-6,-74,-18.5,-76]],W);
 P([[-3,-100],[-14,-104,-27,-98,-27,-86],[-24,-86,-21,-89,-17,-92],[-12,-95,-7,-97,-3,-100]],W,2.2);
 L([[-16,-79],[0,-76.5,16,-79]],WS,2);L([[8,-97],[14,-92,15,-84]],WS,1.6);L([[-22,-90],[-18,-95,-11,-98]],WS,1.4);
 g.restore()}

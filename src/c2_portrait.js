// ---------- Melissaette big portrait (vector, cartoon outline style) for the title, ending and cover.
// Drawn likeness of Melissa as a little blue forest-folk girl: big curly auburn 80s hair with a fringe, defined brows,
// blue-grey eyes, dark red lips, gold hoop earrings, black bead necklace, pink floral dress with a black belt.
// (cx,by) = bottom centre (feet), h = full height in current units. mood: 'smile' | 'happy' | 'wave'
function drawMelPortrait(cx,by,h,mood='smile',t=0){const u=h/100,K='#1a1238';g.save();g.translate(cx,by);g.scale(u,u);g.lineJoin='round';g.lineCap='round';
 const P=(pts,fill,lw=2.4,close=true)=>{g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const q=pts[i];if(q.length==6)g.bezierCurveTo(...q);else if(q.length==4)g.quadraticCurveTo(...q);else g.lineTo(q[0],q[1])}if(close)g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(lw){g.strokeStyle=K;g.lineWidth=lw;g.stroke()}};
 const E=(x,y,rx,ry,fill,lw=2.4,rot=0)=>{g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill()}if(lw){g.strokeStyle=K;g.lineWidth=lw;g.stroke()}};
 const L=(pts,col,lw)=>{P(pts,null,0,false);g.strokeStyle=col;g.lineWidth=lw;g.stroke()};
 const wave=mood=='wave'||mood=='happy'?Math.sin(t*7)*8:0,happy=mood=='happy'||mood=='wave',closed=mood=='happy',sway=Math.sin(t*2.2)*0.8;
 const HAIR='#a8532a',HS='#6e2e16',HL='#d98a4e',SKIN='#5aa2ff',SK2='#3c7fe0',DRESS='#fbd6e0',DS='#e9a9bd',GOLD='#f2c230',GOLD2='#b8861a',LIP='#a3122c';
 // scalloped outline helper: walks a contour and bulges each segment outward into a curl
 const scal=(pts,bump,fill,lw=2.4,close=true)=>{const n=pts.length;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<=(close?n:n-1);i++){const A=pts[i-1],B=pts[i%n],mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1,bb=B[2]===undefined?bump:B[2];g.quadraticCurveTo(mx+dy/l*bb,my-dx/l*bb,B[0],B[1])}if(close)g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(lw){g.strokeStyle=K;g.lineWidth=lw;g.stroke()}};
 // big wavy-curly back hair (80s volume, past the shoulders)
 const sw2=sway;
 scal([[0,-101],[11,-100],[20,-95],[25.5,-87],[27.5,-78],[28+sw2,-68],[27.5+sw2,-58],[26+sw2,-49],[22+sw2,-40],[15,-36,0],[-15,-36,0],[-22+sw2,-40],[-26+sw2,-49],[-27.5+sw2,-58],[-28+sw2,-68],[-27.5,-78],[-25.5,-87],[-20,-95],[-11,-100]],3.2,HAIR);
 for(const sx of[-1,1]){L([[sx*22,-88],[sx*25,-78,sx*22,-70],[sx*25.5,-60,sx*22,-52],[sx*24,-46,sx*20,-41]],HS,1.4);L([[sx*19,-84],[sx*22,-75,sx*19.5,-66],[sx*22,-58,sx*19,-50]],HL,1.2);L([[sx*25,-64],[sx*23.5,-60]],HL,1)}
 // arms
 const limb=(pts,w)=>{for(const [col,lw] of[[K,w+2.6],[SKIN,w]]){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const q=pts[i];if(q.length==4)g.quadraticCurveTo(...q);else g.lineTo(q[0],q[1])}g.strokeStyle=col;g.lineWidth=lw;g.stroke()}};
 const arm=(sx,up)=>{if(up){limb([[sx*9,-49],[sx*21,-54,sx*27,-72-wave*.5]],4.6);E(sx*27.5,-74.5-wave*.5,3.4,3.6,SKIN,2)}else{limb([[sx*9.5,-49],[sx*15.5,-44,sx*15,-33]],4.6);E(sx*15,-31.5,3.2,3.4,SKIN,2)}};
 arm(-1,mood=='happy');arm(1,mood!='smile');
 // legs + little red flats
 for(const sx of[-1,1]){limb([[sx*4,-17],[sx*4,-4]],3.6);P([[sx*4-4,-4.5],[sx*4+4.5,-4.5],[sx*4+6,-1.5],[sx*4+5,.5],[sx*4-4.5,.5],[sx*4-5,-2]],'#c8304a',2)}
 // pink floral dress: short puff sleeves, black belt with gold buckle, flared skirt
 P([[-9,-53],[9,-53],[7.5,-39],[7,-37],[17,-17],[10,-14,0,-14],[-10,-14,-17,-17],[-7,-37],[-7.5,-39]],DRESS);
 L([[-4,-35],[-7,-24,-8,-16]],DS,1.4);L([[3,-35],[5,-25,7,-15.5]],DS,1.4);
 for(const sx of[-1,1])E(sx*10,-50,4.8,3.8,DRESS,2);
 const fl=[[-4,-48,'#e0405e'],[4,-45,'#9a8ad8'],[-1,-42,'#e0405e'],[-11,-22,'#e0405e'],[-5,-27,'#9a8ad8'],[2,-21,'#e0405e'],[8,-28,'#9a8ad8'],[12,-20,'#e0405e'],[-2,-32,'#e0405e'],[-13,-50,'#9a8ad8'],[11,-51,'#e0405e']];
 for(const [x,y,c] of fl){E(x,y,1.5,1.5,c,0);E(x+1.6,y+1.2,.9,.5,'#6ab06a',0)}
 P([[-7.8,-40.5],[7.8,-40.5],[7.3,-36.5],[-7.3,-36.5]],'#1a1a22',1.4);P([[-2.4,-41],[2.4,-41],[2.4,-36],[-2.4,-36]],GOLD,1.2);E(0,-38.5,1,1.2,'#1a1a22',0);
 E(0,-53.5,3.4,1.8,SKIN,0);
 // black bead necklace with a silver pendant
 g.setLineDash([.1,2.1]);L([[-6.5,-53],[0,-45,6.5,-53]],'#141018',2.2);g.setLineDash([]);
 P([[0,-46],[1.8,-43.5],[0,-40.5],[-1.8,-43.5]],'#d8d8e8',1.1);
 // face (blue), soft oval chin
 P([[0,-84],[16,-84,17,-70],[17,-60,8,-54.5],[0,-52.5,-8,-54.5],[-17,-60,-17,-70],[-16,-84,0,-84]],SKIN);
 // side-swept curly fringe + soft curls framing the face
 scal([[-18,-72],[-19.5,-81],[-14,-89],[-4,-92],[7,-91],[16,-86],[19,-77],[18,-73,1.4],[14.5,-75.5,2.6],[9,-78.5,2.4],[3,-80.5,2.2],[-3,-81,2],[-8,-80,2],[-12.5,-77,2],[-15.5,-73.5,1.6]],3.4,HAIR,2.2);
 L([[-9,-88],[-6,-84,-2,-82.5]],HS,1.1);L([[1,-89],[5,-85,9,-80.5]],HS,1.1);L([[9,-88],[13,-84,15,-77]],HS,1.1);L([[-14,-85],[-15,-80,-14,-76]],HS,1.1);L([[-3,-90],[1,-87]],HL,1.1);L([[6,-89.5],[10,-86]],HL,1.1);for(const [x,y,sx] of[[-23,-82,1],[-24,-62,1],[-22,-48,1],[23,-82,-1],[24,-62,-1],[22,-48,-1],[-6,-96,1],[6,-97,-1]]){g.beginPath();g.arc(x,y,2.6,sx>0?-2.4:-0.7,sx>0?0.9:2.6);g.strokeStyle=HS;g.lineWidth=1.2;g.stroke()}
 for(const sx of[-1,1]){scal(sx<0?[[-17,-78],[-21,-72],[-21.5,-64],[-19.5,-57],[-17,-61,1.2],[-17.5,-68,1.2]]:[[17,-78],[17.5,-68,1.2],[17,-61,1.2],[19.5,-57],[21.5,-64],[21,-72]],1.8,HAIR,2);
  L([[sx*19.5,-73],[sx*20.5,-67,sx*19,-62]],HS,1.1)}
 // gold hoop earrings
 for(const sx of[-1,1]){g.strokeStyle=K;g.lineWidth=3.2;g.beginPath();g.ellipse(sx*17.2,-53.6,2.3,3.2,0,0,Math.PI*2);g.stroke();g.strokeStyle=GOLD;g.lineWidth=1.5;g.stroke();L([[sx*16.4,-56],[sx*17.8,-54.6]],'#fff2b0',.7)}
 // defined auburn eyebrows
 for(const sx of[-1,1])P([[sx*3,-73],[sx*6.5,-77,sx*11.2,-73.8],[sx*11,-72.8],[sx*6.5,-75.6,sx*3.1,-72.2]],HS,1.1);
 // eyes: blue-grey, confident lids, lashes
 const blink=!closed&&((t*0.5)%4)>3.85;
 for(const sx of[-1,1]){const ex=sx*6.4,ey=-66.4;
  if(closed||blink){L([[ex-4,ey+1],[ex,ey-3,ex+4,ey+1]],K,2)}
  else{E(ex,ey,4.6,5.4,'#ffffff',1.8);E(ex+sx*-.9,ey+1,2.8,3.4,'#5d7fae',0);E(ex+sx*-.9,ey+1.4,1.5,1.9,'#141030',0);E(ex+sx*-1.7,ey-.4,1,1,'#ffffff',0);
   L([[ex-4.7,ey-1.2],[ex,ey-5.9,ex+4.7,ey-1.2]],K,2.1)}
  L([[ex+sx*3.8,ey-3.6],[ex+sx*6.6,ey-5.6]],K,1.8);L([[ex+sx*4.6,ey-1.6],[ex+sx*7.2,ey-2.6]],K,1.6)}
 // small nose, soft cheeks, dark red lips
 L([[-.6,-63],[-1.4,-60.6,.6,-60]],SK2,1.5);
 g.globalAlpha=.5;E(-10.5,-60.5,2.8,1.7,'#ff7aa8',0);E(10.5,-60.5,2.8,1.7,'#ff7aa8',0);g.globalAlpha=1;
 if(happy){P([[-4.8,-57.2],[0,-58,4.8,-57.2],[3.4,-53.2,0,-53],[-3.4,-53.2,-4.8,-57.2]],LIP,1.6);P([[-3.2,-56.6],[3.2,-56.6],[2,-55,0,-55],[-2,-55,-3.2,-56.6]],'#fff',0)}
 else{P([[-4.6,-56.6],[-2,-57.8,0,-57],[2,-57.8,4.6,-56.6],[2.8,-54,0,-53.8],[-2.8,-54,-4.6,-56.6]],LIP,1.4);L([[-4.2,-56.4],[0,-55.6,4.2,-56.4]],'#5a0614',1)}
 g.restore()}

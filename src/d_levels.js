// ---------- the journey: 8 lands, screen-by-screen (flip-screen like the 1982 original)
// element formats: ['fence',x] ['grass',x,w] ['spk',x,w] ['stal',x] ['mound',x,w,h] ['bluff',x,w,h] ['pit',x,w] ['ledge',x,y,w] ['stone',x,y,w]
// ['bridge',x,w] (crumbles) ['log',x1,x2,y,w,speed] ['trap',x,w,period,phase] ['candle',x,y,hidden] ['gift',x,y,kind] ['cage',x]
// creatures: ['bat',lvl,period,phase] ['hawk',period,phase] ['spider',x,period,phase] ['snake',x1,x2,speed]
// villains:  ['potion',trigX,targetX] ['spell',trigX,n] ['net',trigX] ['pounce',trigX] ['drop',x,y,trigX]   decor: ['deco',kind,x]
const ZONES=[
 {name:'Smurf Village',sky:'#7d76fc',music:'pink',theme:'meadow',taunt:'Gargamel snatched our Smurfs! Off to the castle!',screens:[
  [['deco','mush',22],['deco','mush',74],['deco','sign',120],['fence',150],['candle',110,150],['candle',153,112]],
  [['ledge',40,128,26],['gift',53,128,'shield'],['fence',90],['grass',130,10],['fence',175],['candle',135,120],['candle',215,150],['bat','mid',4.2,1.5],['deco','flowers',60]],
  [['fence',70],['fence',110],['mound',160,30,10],['grass',210,12],['candle',90,150],['candle',175,150],['candle',232,104,1],['potion',40,135],['hawk',6,3],['deco','flowers',20]]]},
 {name:'Wildflower Fields',sky:'#42ebf5',music:'dontyou',theme:'fields',taunt:'Gargamel: "Heh heh! My cat Azrael is watching you!"',screens:[
  [['grass',60,14],['mound',100,40,14],['grass',165,16],['grass',205,10],['candle',67,124],['candle',120,146],['candle',240,150],['hawk',5.5,2],['pounce',110]],
  [['mound',40,24,10],['grass',85,22],['ledge',125,118,36],['gift',133,118,'spring'],['candle',152,118],['grass',185,14],['candle',96,118],['snake',150,240,22]],
  [['grass',45,12],['grass',75,12],['mound',120,36,18],['grass',175,24],['deco','tree',205],['drop',209,62,150],['cage',236],['candle',81,124],['candle',138,132],['candle',187,120]]]},
 {name:'Bluff Hills',sky:'#5edc78',music:'footloose',theme:'hills',taunt:'Gargamel: "Those hills will tire you out, little one!"',screens:[
  [['bluff',70,60,22],['bluff',130,50,40],['grass',205,12],['candle',100,138],['candle',155,100],['candle',230,150],['bat','mid',4.5,1]],
  [['bluff',30,40,20],['pit',70,30],['bluff',100,50,30],['pit',150,26],['candle',85,112],['candle',125,130],['candle',163,124],['snake',190,240,24],['hawk',6,3],['spell',110,3]],
  [['mound',50,30,12],['bluff',120,70,26],['fence',150],['grass',210,10],['cage',236],['candle',65,124],['candle',150,98,1],['candle',180,134],['gift',95,150,'slow'],['net',140]]]},
 {name:'Rushing River',sky:'#7d76fc',music:'girlsfun',theme:'river',taunt:'Gargamel: "Can you swim? I hope not! Heh heh heh!"',screens:[
  [['pit',70,40],['stone',86,152,10],['pit',150,50],['bridge',150,50],['candle',90,120],['candle',175,130],['bat','low',4,1.2]],
  [['pit',50,150],['log',56,164,154,30,32],['gift',225,150,'cake'],['candle',110,110],['candle',245,120],['potion',8,24],['hawk',6,4]],
  [['pit',40,30],['pit',100,60],['bridge',100,60],['pit',190,20],['cage',232],['candle',55,115],['candle',130,130],['candle',200,112],['spell',80,2]]]},
 {name:'Whispering Woods',sky:'#21b03b',music:'powerlove',theme:'woods',taunt:'Gargamel: "Azrael, knock things on her head!"',screens:[
  [['fence',60],['mound',100,22,10],['fence',150],['fence',200],['deco','tree',125],['drop',129,58,92],['candle',111,120],['candle',175,150],['candle',203,104],['bat','mid',4,2]],
  [['ledge',70,124,30],['ledge',120,104,30],['ledge',170,124,30],['grass',75,30],['grass',150,30],['snake',205,245,20],['candle',85,124],['candle',135,104,1],['candle',185,124],['pounce',40]],
  [['fence',50],['fence',90],['fence',130],['mound',170,20,12],['gift',110,108,'shield'],['cage',232],['candle',70,124],['candle',181,130],['net',160],['hawk',5,2.5]]]},
 {name:'Crystal Cavern',sky:'#140c2a',music:'breath',theme:'cave',ceil:1,taunt:'Gargamel: "Spiders! Bats! Get her!"',screens:[
  [['stal',60],['stal',110],['pit',150,30],['stal',210],['spider',132,3.5,0],['candle',85,130],['candle',165,118],['bat','low',3.5,1]],
  [['stal',45],['stal',65],['pit',100,60],['stone',115,140,14],['stone',140,128,14],['stal',190],['spider',205,3,1],['candle',60,108],['candle',147,110,1],['candle',228,140],['spell',90,2]],
  [['stal',60],['bluff',95,40,20],['pit',160,24],['stal',210],['cage',234],['spider',80,3.2,.5],['drop',144,40,110],['candle',80,118],['candle',115,140],['candle',172,118]]]},
 {name:"Gargamel's Castle",sky:'#3a1850',music:'ghost',theme:'castle',taunt:'Gargamel: "Welcome to my castle... mind the trapdoors!"',screens:[
  [['pit',60,50],['bridge',60,50],['trap',150,24,2.6,0],['spk',200,12],['candle',85,130],['candle',162,118],['candle',232,150],['bat','mid',4,1],['potion',120,185]],
  [['trap',50,20,2.4,0],['trap',100,20,2.4,1.2],['trap',150,20,2.4,.6],['spider',185,3,0],['cage',232],['candle',60,130],['candle',160,110],['pounce',30]]]},
 {name:"Gargamel's Laboratory",sky:'#2a2440',music:'danger',theme:'lab',ceil:0,boss:1,taunt:'Pull all 3 bell-ropes to outsmart Gargamel and Azrael!',screens:[
  [['boss'],['candle',130,112],['candle',210,62,1]]]}];
// flatten round-1 screens, assign stable candle ids
const SCREENS=[];let CANDLES=0;
ZONES.forEach((z,zi)=>z.screens.forEach((s,si)=>{for(const e of s)if(e[0]=='candle')e.id=CANDLES++;SCREENS.push({zi,si,def:s})}));
const TOTAL_CANDLES=54;if(CANDLES!==TOTAL_CANDLES)console.error('candle count',CANDLES);
// mirrored variants (used from round 2 on: more screens per land)
function mirrorDef(def){const o=[];const M=x=>FW-x;
 for(const e of def){const k=e[0];
  if(['candle','gift','cage','drop','potion','spell','net','deco'].includes(k))continue;
  if(k=='fence')o.push([k,FW-e[1]-6]);else if(k=='stal')o.push([k,FW-e[1]-10]);
  else if(['grass','spk','pit','bridge'].includes(k))o.push([k,FW-e[1]-e[2],...e.slice(2)]);
  else if(['mound','bluff'].includes(k))o.push([k,FW-e[1]-e[2],e[2],e[3]]);
  else if(['ledge','stone'].includes(k))o.push([k,FW-e[1]-e[3],e[2],e[3]]);
  else if(k=='log')o.push([k,FW-e[2]-e[4],FW-e[1]-e[4],e[3],e[4],e[5]]);
  else if(k=='trap')o.push([k,FW-e[1]-e[2],e[2],e[3],e[4]]);
  else if(k=='spider')o.push([k,M(e[1]),e[2],e[3]]);else if(k=='snake')o.push(e.slice());
  else o.push(e.slice())}
 if(!def.some(e=>e[0]=='pit'||e[0]=='bluff'||e[0]=='trap'))o.push(['pounce',30]);return o}
// route for a round: list of {zi, def index or mirrored}
function makeRoute(round){const r=[];ZONES.forEach((z,zi)=>{z.screens.forEach((s,si)=>{r.push({zi,si,m:0});
  if(round>=2&&!z.boss&&si==(z.screens.length>=3?1:0))r.push({zi,si,m:1});
  if(round>=3&&!z.boss&&z.screens.length>=3&&si==0)r.push({zi,si:2,m:1})})});return r}
const MIRROR_CACHE={};
function defOf(rt){const d=ZONES[rt.zi].screens[rt.si];if(!rt.m)return d;const k=rt.zi+':'+rt.si;return MIRROR_CACHE[k]||(MIRROR_CACHE[k]=mirrorDef(d))}
const ROUTES={};function RT(G){return ROUTES[G.round]||(ROUTES[G.round]=makeRoute(G.round))}

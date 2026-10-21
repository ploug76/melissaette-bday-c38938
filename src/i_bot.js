// ---------- test hooks + search bot (plays the real engine on cloned game states)
const BA=[{r:1},{r:1,j:1},{},{l:1},{l:1,j:1},{j:1},{d:1}];
function simAct(g,a,k){for(let i=0;i<k;i++){step(g,a);if(g.ph!='play')return}}
function bsearch(G0,goals,opt={}){const K=opt.k||8,beam=opt.beam||48,maxD=opt.maxD||900;SIM=true;let seed=12345;const rnd=()=>((seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff);
 try{let fr=[{g:structuredClone(G0),par:null,a:-1,wp:0}];const seen=new Set();let nodes=0;
  for(let d=0;d<maxD;d++){const nx=[];
   for(const n of fr)for(let ai=0;ai<BA.length;ai++){const g=structuredClone(n.g);simAct(g,BA[ai],K);nodes++;
    if(g.ph=='die'||g.ph=='over')continue;let wp=n.wp;while(wp<goals.length&&goals[wp].done(g))wp++;const node={g,par:n,a:ai,wp};
    if(wp>=goals.length){const acts=[];for(let q=node;q&&q.a>=0;q=q.par)acts.unshift(q.a);return{ok:true,g,acts,nodes,depth:d}}
    const p=g.p,key=[wp,g.ri,Math.round(p.x/3),Math.round(p.y/3),p.on?1:0,Math.round(p.vx/25),Math.floor(g.t*2),p.net>0?1:0].join();if(seen.has(key))continue;seen.add(key);
    const go=goals[wp];node.sc=wp*1e6+(go.score?go.score(g):-Math.hypot(p.x-go.tx,(p.y-10-go.ty)*1.3))-(g.ri<G0.ri?50000:0);nx.push(node)}
   if(!nx.length)return{ok:false,nodes,depth:d,why:'all paths fail'};
   nx.sort((a,b)=>b.sc-a.sc);const top=nx.slice(0,Math.ceil(beam*.75)),rest=nx.slice(Math.ceil(beam*.75));for(let i=0;i<beam-top.length&&rest.length;i++)top.push(rest.splice(Math.floor(rnd()*rest.length),1)[0]);fr=top}
  return{ok:false,nodes,why:'too long'}}finally{SIM=false}}
function replay(G0,acts,K=8){const g=structuredClone(G0);SIM=true;try{for(const a of acts)simAct(g,BA[a],K)}finally{SIM=false}return g}
const onK=k=>g=>g.p.on&&g.p.gi>=0&&g.sol[g.p.gi]&&g.sol[g.p.gi].k==k;
const BOSS_GOALS=[{done:onK('chair'),tx:45,ty:122},{done:g=>g.boss.lev[0],tx:46,ty:88},{done:onK('table'),tx:128,ty:102},{done:g=>g.boss.lev[1],tx:150,ty:76},{done:onK('skull'),tx:184,ty:78},{done:g=>g.boss.lev[2],tx:184,ty:50},{done:onK('shelf'),tx:214,ty:52},{done:g=>g.ph=='win',tx:236,ty:44}];
function screenGoals(G0){if(ZONES[G0.zi].boss)return BOSS_GOALS;const r0=G0.ri;return[{done:g=>g.ri>r0,score:g=>(g.ri-r0)*1000+g.p.x}]}
// play a whole journey: returns per-screen results
function botPlay(sk,round,opt={}){let g=newGame(sk,round);const out=[];const t0=performance.now();
 while(true){const z=ZONES[g.zi],ri=g.ri,res=bsearch(g,screenGoals(g),opt);
  if(!res.ok){out.push({ri,zone:z.name,ok:false,why:res.why,nodes:res.nodes});break}
  const chk=replay(g,res.acts);const det=chk.ri==res.g.ri&&Math.abs(chk.p.x-res.g.p.x)<.001&&chk.ph==res.g.ph;
  out.push({ri,zone:z.name,ok:true,secs:+(res.acts.length*8/60).toFixed(1),nodes:res.nodes,det,friends:res.g.friends.length,score:res.g.score});g=res.g;if(g.ph=='win')break}
 return{skill:SK[sk].n,round,screens:RT(g).length,cleared:out.filter(o=>o.ok).length,won:g.ph=='win',friends:g.friends.length,score:g.score,deaths:g.deaths,ms:Math.round(performance.now()-t0),detAll:out.every(o=>o.det!==false),out}}
// prove every candle can be collected AND the screen still finished afterwards
function candleProof(sk=2){const res=[];const R1=RT({round:1});
 for(let ri=0;ri<R1.length;ri++){const def=defOf(R1[ri]);for(const e of def){if(e[0]!='candle')continue;
  const g=newGame(sk,1);g.ri=ri;g.entryX=10;g.p=newPlayer(10);buildScreen(g,1);const id=e.id;
  const goals=[{done:q=>q.found.includes(id),tx:e[1],ty:e[2]-8},...(ZONES[g.zi].boss?[]:[{done:q=>q.ri>ri,score:q=>q.p.x}])];
  const r=bsearch(g,goals,{beam:60});res.push({id,ri,zone:ZONES[g.zi].name,x:e[1],y:e[2],hidden:!!e[3],ok:r.ok,why:r.why})}}
 return{total:res.length,ok:res.filter(r=>r.ok).length,fail:res.filter(r=>!r.ok)}}
window.__T={layout(){return{els:UIE.map(e=>({...e})),SAFE:{l:SAFE.l,t:SAFE.t,r:VW-SAFE.r,b:VH-SAFE.b},state,paused,LY}},
 start(sk){if(sk)skill=sk;start()},step(n=1){for(let i=0;i<n;i++){advance(DT);render(DT)}},get G(){return G},set G(v){G=v},toTitle,togglePause,toParade,toCake,endParade,gameOver,showHelp,
 closeHelp(){$('pclose').click()},setHeld(h){held=Object.assign({l:0,r:0,d:0,j:0},h)},bsearch,botPlay,candleProof,replay,BOSS_GOALS,screenGoals,ZONES,SK,
 goScreen(ri){G.ri=ri;G.entryX=10;G.p=newPlayer(10);buildScreen(G,1);G.ph='play';playSong(ZONES[G.zi].music)},
 setFound(n){foundEver=[...Array(n).keys()];ST.set('candles',foundEver)},banner:setBanner,get foundEver(){return foundEver},runFX,sceneT:()=>sceneT,setSceneT(v){sceneT=v;cakeSongT=v}};

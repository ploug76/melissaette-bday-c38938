// ---------- 80s/90s movie-hit renditions (square lead / triangle bass / noise drums), one per land.
// Private birthday gift: short melodic 8-bit renditions transcribed from letter-note/lead-sheet sources (see report).
// Tokens: NOTE+octave:16ths (C4 = middle C), r = rest.  BASS(...) builds an 8th-note root/octave bass from [root,16ths] pairs.
function nm(n){const m=n.match(/^([A-G])(#|b)?(-?\d)$/);return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]=='#'?1:m[2]=='b'?-1:0)}
function MELS(s){return S(s.trim().split(/\s+/).map(t=>{const [n,d]=t.split(':');return [n=='r'?0:nm(n),+(d||2)]}))}
function BASS(s,pat='oct'){const o=[];for(const t of s.trim().split(/\s+/)){const [n,d]=t.split(':');const r=nm(n),len=+(d||16);for(let i=0;i<len;i+=2){const q=pat=='oct'?(i%4?r+12:r):pat=='drive'?r:(i%8==4?r+7:i%8==6?r+12:r);o.push(q,-1)}}return o}
const D_ROCK=[1,0,3,0,2,0,3,0,1,1,3,0,2,0,3,3],D_POP=[1,0,3,3,2,0,3,0],D_BALLAD=[1,0,0,3,0,0,3,0,2,0,0,3,0,0,3,0],D_DRIVE=[1,3,2,3,1,3,2,3];
const SONG_TITLES={};
function defSong(id,title,bpm,mel,bass,drum,vol=.075,bpat='oct'){const m=MELS(mel),b=BASS(bass,bpat);SONGS[id]={bpm,title,tracks:[{type:'square',vol,notes:m},{type:'triangle',vol:.2,notes:b},{type:'drum',vol:.18,notes:drum}]};SONG_TITLES[id]=title}
// Land 1 — Pretty in Pink (The Psychedelic Furs, 1986 film), D major: talk-sung verse on A, then the "pretty in pink" hook.
defSong('pink','Pretty in Pink',138,
 `A4:2 A4:1 A4:1 A4:2 A4:2 A4:2 G4:2 A4:4  r:2 A4:2 A4:2 A4:2 G4:2 F#4:2 F#4:4
  A4:2 A4:1 A4:1 A4:2 A4:2 A4:2 G4:2 A4:4  r:2 F#4:2 E4:2 F#4:2 E4:2 D4:6
  r:2 F#4:2 F#4:2 E4:2 D4:6 r:2  B3:2 D4:2 E4:8 r:4
  r:2 F#4:2 F#4:2 E4:2 D4:6 r:2  B3:2 D4:2 E4:2 D4:10`,
 `D2:16 C2:16 G1:16 D2:16 D2:16 C2:16 G1:16 D2:16`,D_ROCK);
// Land 2 — Don't You (Forget About Me) (Simple Minds, The Breakfast Club), E: "hey hey hey hey" intro + chorus.
defSong('dontyou',"Don't You (Forget About Me)",112,
 `E4:4 E4:4 E4:4 G4:4  G4:4 G4:2 C5:2 A4:2 F#4:2 E4:2 D4:2
  r:2 G#4:2 G#4:2 G#4:2 A4:2 A4:2 A4:4  r:2 A4:2 A4:2 A4:2 A4:2 C#5:6
  r:2 G#4:2 G#4:2 G#4:2 A4:2 A4:2 A4:4  r:2 A4:2 A4:2 A4:2 A4:2 D5:4 B3:2`,
 `D2:8 E2:8 C2:8 D2:8 E2:16 D2:16 A1:16 D2:16`,D_POP);
// Land 3 — Footloose (Kenny Loggins), G: guitar-riff intro + "loose, footloose, kick off your Sunday shoes".
defSong('footloose','Footloose',156,
 `G4:2 D5:2 r:2 C5:4 r:2 G4:2 F4:2  r:2 G4:2 r:2 G4:2 D5:2 r:2 C5:4
  C5:4 C5:2 D5:6 r:4  D4:4 F4:4 G4:4 A4:4
  r:2 G4:2 F4:4 D4:4 F4:2 G4:2  A4:4 F4:4 G4:4 F4:4`,
 `G2:16 G2:16 C3:16 G2:16 C3:8 G2:8 G2:16`,D_DRIVE,.07,'drive');
// Land 4 — Girls Just Want to Have Fun (Cyndi Lauper; Girls Just Want to Have Fun 1985 film), G.
defSong('girlsfun','Girls Just Want to Have Fun',120,
 `G4:2 B4:2 B4:2 G4:2 A4:2 B4:4 B4:2  B4:2 D5:2 B4:2 B4:2 A4:2 G4:2 G4:2 r:2
  G4:2 G4:2 A4:2 B4:2 B4:2 A4:2 G4:4  D5:2 D5:2 D5:2 D5:2 B4:2 B4:2 B4:2 B4:2
  C5:2 D5:2 D5:4 C5:2 B4:2 A4:2 A4:2  G4:2 F#4:2 G4:4 D4:4 r:4
  B4:2 D5:6 D5:2 B4:2 B4:2 A4:2  G4:2 A4:2 G4:2 A4:6 r:4`,
 `G2:16 G2:16 E2:16 C2:16 C2:16 D2:16 G2:16 C2:8 D2:8`,D_POP);
// Land 5 — The Power of Love (Huey Lewis & the News, Back to the Future), C.
defSong('powerlove','The Power of Love',120,
 `G4:2 D5:2 C5:2 C5:2 G4:4 G4:2 G4:2  G4:2 G4:2 G4:4 r:4 G4:2 G4:2
  D5:2 C5:2 C5:4 r:2 E4:2 G4:2 G4:2  G4:2 G4:2 G4:4 r:4 G4:2 Bb4:2
  C5:2 D5:4 D5:2 r:4 C5:2 D5:4  r:2 D5:2 C5:2 D5:2 C5:2 G4:4`,
 `C2:16 C2:16 Bb1:16 F1:16 C2:16 C2:8 G1:8`,D_ROCK);
// Land 6 — Take My Breath Away (Berlin, Top Gun), G.
defSong('breath','Take My Breath Away',100,
 `G4:3 G4:2 G4:1 G4:2 G4:2 D4:2 F#4:2 F#4:2  F#4:2 F#4:2 F#4:2 D4:2 E4:8
  G4:3 G4:2 G4:1 G4:2 G4:2 D4:2 F#4:2 F#4:2  F#4:2 F#4:2 G4:2 G4:2 E4:2 D4:2 C4:4
  D4:4 E4:4 G4:6 A4:2  G4:16
  D4:4 E4:4 G4:6 A4:2  G4:12 r:4`,
 `G2:16 D2:16 G2:16 C2:16 G2:8 D2:8 E2:16 C2:16 D2:16`,D_BALLAD,.07,'arp');
// Land 7 — Ghostbusters (Ray Parker Jr.), B: the synth hook + "if there's something strange…".
defSong('ghost','Ghostbusters',116,
 `r:2 B4:2 B4:2 D#5:2 B4:2 C#5:2 A4:4  r:16
  r:2 B4:2 B4:2 D#5:2 B4:2 C#5:2 A4:4  r:16
  B4:2 B4:2 B4:2 B4:2 A4:2 B4:6  B4:2 B4:2 B4:2 B4:2 A4:2 B4:6
  r:2 B4:2 B4:2 D#5:2 B4:2 C#5:2 A4:4  r:8 B4:4 B4:4`,
 `B2:16 B2:16 B2:16 B2:16 B2:16 B2:16 B2:16 B2:16`,D_POP,.075,'drive');
SONGS.ghost.tracks[1].notes=S([[47,2],[47,2],[40,2],[42,2],[44,4],[45,2],[44,2]].concat([[47,2],[47,2],[40,2],[42,2],[44,4],[42,2],[40,2]]));
// Land 8 (Humbug's lab, the boss) — Danger Zone (Kenny Loggins, Top Gun), D minor-ish: verse + chorus over the C-D-F-G riff.
defSong('danger','Danger Zone',152,
 `F5:2 F5:2 F5:2 F5:2 E5:2 D5:2 C5:2 C5:2  D5:8 r:8
  G5:8 F5:8  E5:6 C5:4 D5:6
  r:4 D5:2 D5:2 F5:2 G5:6  F5:4 E5:4 C5:2 D5:6`,
 `D2:16 D2:16 C2:16 D2:16 C2:16 D2:16`,D_DRIVE,.065);
SONGS.danger.tracks[1].notes=S([[36,2],[38,2],[41,2],[43,4],[41,2],[38,4]]);
// Title + Friendship Parade — (I've Had) The Time of My Life (Medley & Warnes, Dirty Dancing), F.
const TOML=`C5:2 C5:2 C5:2 C5:2 D5:2 E5:2 F5:2 E5:2  D5:8 r:4 G4:2 G4:2
  F5:3 F5:1 E5:2 D5:2 C5:2 D5:2 C5:4  r:8 G4:2 D5:2 C5:2 D5:2
  E5:2 F5:2 E5:2 D5:6 r:4  G4:2 G4:2 F5:2 F5:2 F5:2 F5:2 E5:2 D5:2  C5:12 r:4`;
defSong('title','(I\u2019ve Had) The Time of My Life',104,TOML,`F2:16 C2:16 D2:16 Bb1:16 F2:16 C2:16 Bb1:8 C2:8`,D_BALLAD,.075,'arp');
defSong('parade','(I\u2019ve Had) The Time of My Life',128,TOML,`F2:16 C2:16 D2:16 Bb1:16 F2:16 C2:16 Bb1:8 C2:8`,D_ROCK);

"""Melissaette 8-bit walk cycle: 4 real stride frames (contact A, passing A, contact B, passing B).
Body = rows 0-28 of the 'stand' frame. Legs are redrawn per frame: far leg darker ('d' skin, 'S' shoe), near leg
lighter ('b','s'); passing frames are 33 rows tall (planted leg straight + 1 row longer) so the body rises 1px = bob,
and the swing foot is lifted off the ground. Toes point forward (+x); the 'l' sprite set is mirrored at load."""
def legs_frame(body,spec,rows):
  W=len(body[0]);G=[list(r) for r in body[:29]]+[['.']*W for _ in range(rows-29)]
  for skin,shoe,pts,foot in spec:   # pts: [(x,y)] skin pixels; foot: (x,y) heel, toe runs +x 3 px
    L=[['.']*W for _ in range(rows)]
    for x,y in pts:L[y][x]=skin
    fx,fy=foot
    for x in range(fx,fx+3):L[fy][x]=shoe
    # outline this leg (not into the skirt rows), then paint over G: later legs (near) overlap earlier (far)
    O=[r[:] for r in L]
    for y in range(29,rows):
      for x in range(W):
        if L[y][x]=='.' and any(0<=y+dy<rows and 0<=x+dx<W and L[y+dy][x+dx]!='.' for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):O[y][x]='k'
    for y in range(29,rows):
      for x in range(W):
        if O[y][x]!='.':G[y][x]=O[y][x]
  return [''.join(r) for r in G]
def strides(stand):
  F,N=('d','S'),('b','s')
  cA=legs_frame(stand,[(*F,[(10,29),(9,30)],(8,31)),(*N,[(14,29),(15,30)],(15,31))],32)        # far back, near forward
  pA=legs_frame(stand,[(*F,[(11,29),(10,30)],(9,31)),(*N,[(13,29),(13,30),(13,31)],(13,32))],33) # near planted, far lifted behind
  cB=legs_frame(stand,[(*F,[(12,29),(13,30)],(14,31)),(*N,[(12,29),(11,30)],(9,31))],32)        # far forward, near back
  pB=legs_frame(stand,[(*F,[(11,29),(11,30),(11,31)],(11,32)),(*N,[(13,29),(12,30)],(11,31))],33) # far planted, near lifted behind
  return {'r1':cA,'r2':pA,'r3':cB,'r4':pB}

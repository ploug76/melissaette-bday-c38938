# shared: parse Melissaette's pixel sprite from the game source so icons/cover match the game exactly
import re
SRC=open('/workspace/melissaette-bday-c38938/src/c_art.js').read()
def arr(name):
  m=re.search(r'const '+name+r'=\[(.*?)\];',SRC,re.S);return re.findall(r'"([^"]*)"',m.group(1))
HEAD=arr('HEAD');BODY=arr('BODY')
LEGS=re.findall(r'"([^"]*)"',re.search(r'stand:\[(.*?)\]',SRC).group(1))
ROWS=HEAD+BODY+LEGS
PAL={'k':'#141030','h':'#ffffff','H':'#c4cde6','y':'#ffd84a','b':'#4d8df6','d':'#2f62c9','w':'#ffffff','g':'#c4cde6','p':'#ff86a6'}
def happy():
  r=ROWS[:];r[8]="kyybbbbbbbbbbyyk";r[9]="kyybkkbbbbkkbyyk";r[12]="kyyybbkkkkbbyyyk";return r
def draw(d,x0,y0,s=1,rows=None,R=None):
  for j,row in enumerate(rows or ROWS):
    for i,ch in enumerate(row):
      if ch in PAL:d.rectangle([x0+i*s,y0+j*s,x0+i*s+s-1,y0+j*s+s-1],fill=PAL[ch])

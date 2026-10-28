#!/bin/bash
# Build index.html from src/, inject private OG/robots tags and the Share/Install dock.
# Shared tools are only IMPORTED (in-memory cfg); no shared file is modified.
set -e
D=/workspace/melissaette-bday-c38938
cd $D/src && cat a_head.html b_core.js b2_songs.js c_art.js c1_mel.js c2_portrait.js d_levels.js e_game.js f_render.js g_ui.js h_main.js i_bot.js > ../index.html && echo '</script></body></html>' >> ../index.html
if [ "$1" != "nometa" ]; then
python3 - <<'PY'
import sys,html,re
sys.path.insert(0,'/workspace/launch')
import share
REPO='melissaette-bday-c38938';URL=f'https://ploug76.github.io/{REPO}/';IMG=URL+'cover.png?v=6'
T="Melissa Time: The Great Birthday Rescue"
DESC="Happy 54th Birthday, Melissa! 🎂 A birthday game made just for you: guide Melissaette past grumpy Baron Humbug and his raccoon Smudge to rescue her woodland Party Pals to an 8-bit 80s movie soundtrack, and find all 54 hidden candles."
e=lambda s:html.escape(s,quote=True)
tags=(f'<!--og--><meta name="robots" content="noindex,nofollow"><meta name="description" content="{e(DESC)}">'
 f'<meta property="og:type" content="website"><meta property="og:site_name" content="{e(T)}"><meta property="og:title" content="{e(T)}">'
 f'<meta property="og:description" content="{e(DESC)}"><meta property="og:url" content="{URL}"><meta property="og:image" content="{IMG}">'
 f'<meta property="og:image:secure_url" content="{IMG}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200">'
 f'<meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(T)} game box cover: Happy 54th Birthday, Melissa!">'
 f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(T)}"><meta name="twitter:description" content="{e(DESC)}">'
 f'<meta name="twitter:image" content="{IMG}"><link rel="canonical" href="{URL}"><!--/og-->')
p='/workspace/melissaette-bday-c38938/index.html';s=open(p,encoding='utf-8').read()
s=re.sub(r'<meta name="robots"[^>]*>','',s)
s=re.sub(r'<!--og-->.*?<!--/og-->','',s,flags=re.S);s=s.replace('</title>','</title>'+tags,1);open(p,'w',encoding='utf-8').write(s)
share.cfg(REPO,d=REPO,url=URL,title=T,text="Happy 54th Birthday, Melissa! 🎂 Play Melissa Time: The Great Birthday Rescue.")
share.apply(REPO,p)
s=open(p,encoding='utf-8').read();assert 'Peter&#39;s Arcade' not in s and "Peter's Arcade" not in s,'arcade text leaked';print('meta+dock ok')
PY
fi
# central leaderboard (shared Firestore board, same as J Woo's)
PALB_CONFIG_FILE=/workspace/leaderboard/config.firestore.js PALB_TITLE="Melissa Time" python3 /workspace/leaderboard/inject.py melissaette-bday-c38938 $D/index.html
echo built

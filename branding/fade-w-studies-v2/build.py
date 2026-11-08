from pathlib import Path
import json,math,tarfile,shutil,hashlib,xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
root=Path(__file__).resolve().parent
src=root/'sources'
manifest=[]
for f in sorted(src.iterdir()):
 if f.suffix in ['.html','.svg']:
  
  if f.resolve()!=(root/'sources'/f.name).resolve():shutil.copyfile(f,root/'sources'/f.name)
  manifest.append({'id':'SRC-'+str(len(manifest)+1).zfill(2),'filename':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'status':'Observed; original bytes preserved'})
for archive,names in [('fontsource-poppins-5.3.0.tgz',['poppins-latin-200-normal.woff2','poppins-latin-800-normal.woff2']),('fontsource-ibm-plex-sans-thai-5.3.0.tgz',['ibm-plex-sans-thai-thai-400-normal.woff2'])]:
 if not (Path('/tmp/artyverse-brand-fonts')/archive).exists():continue
 with tarfile.open(Path('/tmp/artyverse-brand-fonts')/archive)as t:
  for name in names:(root/'fonts'/name).write_bytes(t.extractfile('package/files/'+name).read())
  (root/'fonts'/('poppins-OFL.txt'if'poppins-'in archive else'ibm-plex-sans-thai-OFL.txt')).write_bytes(t.extractfile('package/LICENSE').read())
fonts={w:TTFont(root/'fonts'/f'poppins-latin-{w}-normal.woff')for w in [200,800]}
def text(s,x,y,size=52,weight=200,fill='currentColor',spacing=-1.7):
 f=fonts[weight];gs=f.getGlyphSet();cmap=f.getBestCmap();scale=size/f['head'].unitsPerEm;result=[];cursor=0
 for ch in s:
  glyph=cmap.get(ord(ch),'.notdef');pen=SVGPathPen(gs);gs[glyph].draw(pen);cmd=pen.getCommands()
  if cmd:result.append(f'<path transform="translate({x+cursor:.3f} {y}) scale({scale:.6f} {-scale:.6f})" d="{cmd}" fill="{fill}"/>')
  cursor+=f['hmtx'][glyph][0]*scale+spacing
 return ''.join(result),cursor
# Rounded centerline sampled through the observed five anchors; proposed continuous taper.
anchors=[(12,22),(28,78),(48,36),(68,78),(84,40)]
def add(a,b):return(a[0]+b[0],a[1]+b[1])
def lerp(a,b,t):return(a[0]*(1-t)+b[0]*t,a[1]*(1-t)+b[1]*t)
def line(a,b,n=12):return[lerp(a,b,i/n)for i in range(1,n+1)]
points=[anchors[0]];last=anchors[0]
for i in range(1,4):
 a,b,c=anchors[i-1:i+2];entry=lerp(b,a,.19);exit=lerp(b,c,.19);points+=line(last,entry)
 for k in range(1,21):
  t=k/20;points.append(add(add((entry[0]*(1-t)**2,entry[1]*(1-t)**2),(2*b[0]*(1-t)*t,2*b[1]*(1-t)*t)),(exit[0]*t*t,exit[1]*t*t)))
 last=exit
points+=line(last,anchors[-1]);dist=[0]
for a,b in zip(points,points[1:]):dist.append(dist[-1]+math.dist(a,b))
def taper(start,end):
 left=[];right=[]
 for i,p in enumerate(points):
  a=points[max(0,i-1)];b=points[min(len(points)-1,i+1)];dx=b[0]-a[0];dy=b[1]-a[1];length=math.hypot(dx,dy);half=(start+(end-start)*dist[i]/dist[-1])/2;nx=-dy/length*half;ny=dx/length*half;left.append((p[0]+nx,p[1]+ny));right.append((p[0]-nx,p[1]-ny))
 fmt=lambda p:f'{p[0]:.3f} {p[1]:.3f}'
 return'M'+fmt(left[0])+' '+' '.join('L'+fmt(p)for p in left[1:])+f' A{end/2} {end/2} 0 0 0 '+fmt(right[-1])+' '+' '.join('L'+fmt(p)for p in right[-2::-1])+f' A{start/2} {start/2} 0 0 0 '+fmt(left[0])+' Z'
original='<g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M12 22L28 78" stroke-width="16"/><path d="M28 78L48 36" stroke-width="12"/><path d="M48 36L68 78" stroke-width="8"/><path d="M68 78L84 40" stroke-width="5"/></g><circle cx="92" cy="22" r="6" fill="#D4006A"/>'
display=f'<path d="{taper(16,3.5)}" fill="currentColor"/><circle cx="92" cy="22" r="6" fill="#D4006A"/>'
micro=f'<path d="{taper(18,9)}" fill="currentColor"/><circle cx="92" cy="22" r="7" fill="#D4006A"/>'
marks={'source':original,'display':display,'micro':micro}
svg=lambda body,v='-6 -6 112 112',color='#000000':f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{v}" style="color:{color}" role="img" aria-label="Fade W brand mark">{body}</svg>'
for name,body in marks.items():
 for theme,color in [('black','#000000'),('white','#FFFFFF')]:
  (root/'assets'/f'fade-w-{name}-{theme}.svg').write_text(svg(body,color=color))
wordmarks={}
for brand,parts in [('whisper',('whisper','X')),('artyverse',('arty','verse'))]:
 wordmarks[brand]={}
 for layout in ['horizontal','underline','stacked','centered','mono','orbit','architecture']:
  prefix,suffix=parts
  if layout in ['horizontal','underline','orbit']:
   label='whisper'if brand=='whisper'else'artyverse';first,w=text(label,160,156,58);tail,_=text('X',160+w+5,156,58,800,'currentColor');body=f'<g transform="translate(25 76) scale(.85)">{{MARK}}</g>'+first+tail
   if layout=='underline':body+=f'<path d="M160 180h{w*.25:.3f}" stroke="#D4006A" stroke-width="5"/>'
   if layout=='orbit':body='<ellipse cx="67" cy="122" rx="60" ry="30" transform="rotate(-23 67 122)" fill="none" stroke="currentColor" stroke-width="1.4"/>'+body
  elif layout=='stacked':
   a,b=('whis','per')if brand=='whisper'else('arty','verse');one,_=text(a,260,102,52);two,w=text(b,260,157,52,800);xx,_=text('X',260+w+4,157,52,800,'#D4006A');body=f'<g transform="translate(105 73) scale(.85)">{{MARK}}</g>'+one+two+xx
  elif layout=='centered':
   label='whisper'if brand=='whisper'else'artyverse';_,w=text(label,0,0,46);_,wx=text('X',0,0,46,800);x=(560-w-wx-5)/2;one,_=text(label,x,222,46);xx,_=text('X',x+w+5,222,46,800,'#D4006A');body='<g transform="translate(226 25)">{MARK}</g>'+one+xx
  elif layout=='mono':
   xx,_=text('X',285,178,108,800);body='<g transform="translate(160 62) scale(1.25)">{MARK}</g>'+xx
  else:
   one,_=text('ARTYVERSE',170,126,32,800,spacing=.6);two,_=text('whisper studio',171,162,22,200,spacing=-.4);body='<g transform="translate(33 75) scale(.85)">{MARK}</g>'+one+two
  wordmarks[brand][layout]=body
  (root/'assets'/f'{brand}-{layout}.svg').write_text(svg(body.replace('{MARK}',display),'0 0 560 260'))
config={'schemaVersion':2,'marks':marks,'wordmarks':wordmarks,'optical':{'display':{'start':16,'end':3.5,'dotRadius':6},'micro':{'start':18,'end':9,'dotRadius':7},'automaticThresholdPx':24},'palette':{'white':'#FFFFFF','black':'#000000','lime':'#D7E317','pink':'#D4006A'},'sourceManifest':manifest}
(root/'design-data.json').write_text(json.dumps(config,ensure_ascii=False,indent=2));(root/'design-data.js').write_text('window.BRAND_DATA='+json.dumps(config,ensure_ascii=False)+';')
print('Generated 6 mark SVGs + 14 outlined wordmarks; source/font originals preserved.')

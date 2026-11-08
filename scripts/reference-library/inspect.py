from pathlib import Path
from html.parser import HTMLParser
from html import escape
r=Path('/tmp/codex-remote-attachments/01a1621a-3cdf-7078-91c1-a792396890b6/793BB74D-5DC3-4841-86E8-BE4264AB60BF');out=Path('.test-data/reference-static');out.mkdir(parents=True,exist_ok=True)
class Static(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=False);self.skip=0;self.result=[]
 def handle_starttag(self,t,attrs):
  if t in ['script','iframe','object','embed']:self.skip+=1;return
  if self.skip or t in ['link','meta','base']:return
  a=[]
  for k,v in attrs:
   if k.startswith('on') or k in ['srcset','action','srcdoc']:continue
   if k in ['src','href','xlink:href'] and v and not v.startswith(('data:','#')):continue
   a.append(k if v is None else k+'="'+escape(v,quote=True)+'"')
  self.result.append('<'+t+' '+ ' '.join(a)+'>')
 def handle_endtag(self,t):
  if t in ['script','iframe','object','embed']:self.skip=max(0,self.skip-1);return
  if not self.skip:self.result.append('</'+t+'>')
 def handle_data(self,d):
  if not self.skip:self.result.append(d)
 def handle_entityref(self,n):
  if not self.skip:self.result.append('&'+n+';')
 def handle_charref(self,n):
  if not self.skip:self.result.append('&#'+n+';')
for f in r.iterdir():
 n=int(f.name.split('-')[0])
 if n not in [4,6,7,8,9,10,11]:continue
 p=Static();p.feed(f.read_text());s=''.join(p.result);s=s.replace('<head >','<head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; form-action \'none\'; base-uri \'none\'"><style>[data-framer-appear-id]{opacity:1!important;transform:none!important}</style>',1);(out/f'S{n:02}.html').write_text(s)
print('Static-only, network-blocked inspection copies created; no imported script execution')

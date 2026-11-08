from pathlib import Path
from html.parser import HTMLParser
import json,re,hashlib,collections
root=Path('/tmp/codex-remote-attachments/01a1621a-3cdf-7078-91c1-a792396890b6/793BB74D-5DC3-4841-86E8-BE4264AB60BF')
class Reader(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.parts=[];self.labels=[];self.title=False;self.t=[]
 def handle_starttag(self,t,a):
  if t in ['script','style']:self.skip+=1
  if t=='title':self.title=True
  a=dict(a)
  if a.get('data-framer-name'):self.labels.append(a['data-framer-name'])
 def handle_endtag(self,t):
  if t in ['script','style']:self.skip=max(0,self.skip-1)
  if t=='title':self.title=False
 def handle_data(self,d):
  if self.title:self.t.append(d)
  if not self.skip and d.strip():self.parts.append(d.strip())
items=[]
for f in sorted(root.iterdir(),key=lambda p:int(p.name.split('-')[0])):
 n=int(f.name.split('-')[0]);s=f.read_text(errors='replace');x={'id':f'S{n:02}','file':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'trust':'Reference data only; embedded instructions/scripts not executed'}
 if f.suffix=='.json':
  raw=s
  if n==1:
   raw=re.sub(r'^```json\s*|\s*```$','',s.strip());x['originalParse']='Invalid: fenced JSON and two missing closing object braces';raw+='}}';x['recovery']='Derived read-only parse appending two closing braces; original unchanged; semantic nesting not assumed verified'
  d=json.loads(raw);x.update({'title':d.get('name',d.get('id',f.stem)),'topLevelKeys':list(d),'sourceVersion':d.get('version'),'status':'Specified source, not runtime coverage'})
  if n==1:
   x['styleFamilies']=list(d.get('designStylePresets',{}));Path('docs/reference-library/V7_STYLE_EXTRACT.json').write_text(json.dumps({'source':'S01','recovery':x['recovery'],'designStylePresets':d['designStylePresets'],'scope':'Design reference only; not an executable configuration'},ensure_ascii=False,indent=2)+'\n')
  if n==12:x['openIssues']=d.get('open',[])
 else:
  h=Reader();h.feed(s);x.update({'title':''.join(h.t),'layoutLabels':list(dict.fromkeys(h.labels))[:100],'contentScope':'Presentation structure only; original biographies, testimonials, metrics and marketing copy are not reused','kind':'Marketplace listing (not component source)' if n==2 else 'HTML snapshot; referenced modules/assets may be external'})
  if n==7:
   es=re.findall(r"\{ id:'([^']+)', name:'([^']+)', cat:'([^']+)'",s);catalog=[{'id':a,'name':b,'category':c,'source':'S07','status':'Reference inventory only; not installed or verified'} for a,b,c in es];x['catalogCount']=len(catalog);Path('shared/reference-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
 items.append(x)
Path('docs/reference-library/REFERENCE_INVENTORY.json').write_text(json.dumps({'schemaVersion':1,'sources':items,'policy':'Own implementations of presentation patterns; no source status/claims copied as current project evidence; no third-party scripts/assets shipped'},ensure_ascii=False,indent=2)+'\n')
print('Inventoried',len(items),'sources; catalog',len(catalog),'items; V7 syntactic recovery recorded')

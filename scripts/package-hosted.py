"""Package tracked V3 source, verified build and preserved research; exclude local user data."""
import pathlib,subprocess,json,hashlib,zipfile,datetime
root=pathlib.Path(__file__).resolve().parents[1]
output=root.parent/'ARTYVERSE_X_V3_HOSTED_RELEASE.zip'
source=json.loads((root/'tests/evidence/deployment/source-manifest.json').read_text())
for item in source['files']:
 p=root/item['path']
 if hashlib.sha256(p.read_bytes()).hexdigest()!=item['sha256']:raise SystemExit('Evidence stale: '+item['path'])
actual={str(p.relative_to(root)) for folder in ['src','shared','server','public'] for p in (root/folder).rglob('*') if p.is_file()}
recorded={x['path'] for x in source['files'] if x['path'].startswith(('src/','shared/','server/','public/'))}
if actual!=recorded:raise SystemExit('Runtime inventory changed; regenerate evidence fingerprint after verification')
build=json.loads((root/'tests/evidence/deployment/build-manifest.json').read_text())
for item in build['files']:
 if hashlib.sha256((root/item['path']).read_bytes()).hexdigest()!=item['sha256']:raise SystemExit('Built artifact changed: '+item['path'])
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0')
files={p:(root/p) for p in tracked if p and not p.startswith(('.data/','.test-data/','.recovery/','.git/','.vercel/')) and not (pathlib.Path(p).name.startswith('.env') and pathlib.Path(p).name!='.env.example')}
for p in (root/'dist').rglob('*'):
 if p.is_file():files[str(p.relative_to(root))]=p
research=root.parent/'blueprint-review'
extras={'blueprint-original.zip':'blueprint.zip','blueprint-reconstructed.zip':'blueprint-reconstructed.zip','design-extraction.zip':'artyverse-design-extraction.zip','framer-plan.zip':'artyverse-framer-plan.zip','BLUEPRINT_SUMMARY_TH.md':'BLUEPRINT_SUMMARY_TH.md','archive-manifest.json':'archive-manifest.json','reconstruction-manifest.json':'reconstruction-manifest.json','repair-ledger.json':'repair-ledger.json'}
for name,original in extras.items():
 p=research/original
 if not p.exists():raise SystemExit('Missing preserved research: '+str(p))
 files['research/'+name]=p
records=[{'path':name,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()} for name,path in sorted(files.items())]
manifest={'schemaVersion':3,'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'product':'ARTYVERSE X V3 / Hosted browser Creative AI Workspace','packagedRevision':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'runtimeRevision':source['sourceRevision'],'runtimeFingerprint':source['fingerprint'],'excluded':['node_modules','local databases/media','browser drafts','secrets','recovery snapshots','.git'],'files':records}
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name,path in sorted(files.items()):z.write(path,'ARTYVERSE_X_V3/'+name)
 z.writestr('ARTYVERSE_X_V3/DELIVERY_MANIFEST.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(output) as z:
 bad=z.testzip()
 if bad:raise SystemExit('ZIP CRC failed: '+bad)
 for item in records:
  if hashlib.sha256(z.read('ARTYVERSE_X_V3/'+item['path'])).hexdigest()!=item['sha256']:raise SystemExit('ZIP hash mismatch: '+item['path'])
summary={'archive':str(output),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'files':len(records)+1,'crc':'passed','hashes':'all entries passed','runtimeFingerprint':source['fingerprint']}
(root.parent/'ARTYVERSE_X_V3_HOSTED_RELEASE_MANIFEST.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))

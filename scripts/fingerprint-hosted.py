"""Record a reproducible runtime fingerprint after completing validation."""
import pathlib, hashlib, json, subprocess
root = pathlib.Path(__file__).resolve().parents[1]
paths = [p for folder in ['src','shared','server','public'] for p in (root/folder).rglob('*') if p.is_file()]
paths += [root/p for p in ['DESIGN_TOKENS.json','index.html','package-lock.json','package.json','tsconfig.json','vite.config.ts','vercel.json']]
files = [{'path': str(p.relative_to(root)), 'bytes': p.stat().st_size, 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(paths)]
fingerprint=hashlib.sha256('\n'.join(x['path']+':'+x['sha256'] for x in files).encode()).hexdigest()
report={'sourceRevision':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'fingerprint':fingerprint,'scope':'Hosted V3 runtime and Vercel build config; browser mode set by VITE_STORAGE_MODE=browser; historical V3 evidence remains separate','files':files}
(root/'tests/evidence/deployment/source-manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(fingerprint)

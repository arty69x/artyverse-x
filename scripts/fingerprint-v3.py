"""Record a reproducible runtime fingerprint after completing validation."""
import pathlib, hashlib, json, subprocess
root = pathlib.Path(__file__).resolve().parents[1]
paths = [p for folder in ['src','shared','server','public'] for p in (root/folder).rglob('*') if p.is_file()]
paths += [root/p for p in ['DESIGN_TOKENS.json','index.html','package-lock.json','package.json','tsconfig.json','vite.config.ts']]
files = [{'path': str(p.relative_to(root)), 'bytes': p.stat().st_size, 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(paths)]
fingerprint=hashlib.sha256('\n'.join(x['path']+':'+x['sha256'] for x in files).encode()).hexdigest()
report={'sourceRevision':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'fingerprint':fingerprint,'scope':'V3 runtime source, assets and generated export; docs/test tools may follow without changing runtime','files':files}
(root/'tests/evidence/v3/source-manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(fingerprint)

from pathlib import Path
import json,hashlib,subprocess,itertools
P=Path('docs/planning');O=P/'campaign3-history-ga-memory-recall-rev1';O.mkdir(exist_ok=True)
def sha(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(Path(p).read_bytes()))
prior=json.loads((P/'campaign3-history-source-roles-rev165/index.json').read_text());archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
rows=[];recovered=[];cache={}
for name in ['GA_RECOLLECTION_PRODUCTION_REVIEW_REV1.json','OBSERVED_ASSOCIATION_RECALL_REVIEW_REV1.json']:
 report=P/name
 for f in json.loads(report.read_text())['sources']:
  path=f['path'];wanted=f['sha256'];candidates=[]
  if path not in cache:
   candidates.append((Path(path).read_bytes(),'CURRENT',path))
   for p in subprocess.check_output(['rg','--files','--hidden','-g',Path(path).name,'-g','!.git'],text=True).splitlines():
    candidates.append((Path(p).read_bytes(),'LOCAL_FILE',p))
   for commit in subprocess.check_output(['git','log','--all','--format=%H','--',path],text=True).splitlines():
    candidates.append((subprocess.check_output(['git','show',commit+':'+path]),'GIT',commit))
   cache[path]=candidates
  candidates=cache[path]
  if wanted in archives:candidates=candidates+[(Path(archives[wanted]).read_bytes(),'PRIOR_ARCHIVE',archives[wanted])]
  hit=None
  for data,method,origin in candidates:
   for label,b in [('exact',data),('LF',data.replace(b'\r\n',b'\n')),('CRLF',data.replace(b'\r\n',b'\n').replace(b'\n',b'\r\n'))]:
    if sha(b)==wanted:hit=(b,method,origin,label);break
   if hit:break
  if hit:
   data,method,origin,label=hit
   if method in ['CURRENT','PRIOR_ARCHIVE'] and label=='exact':resolved=ref(origin)
   else:
    dest=O/(wanted[:16]+'-'+Path(path).name)
    if dest.exists():assert dest.read_bytes()==data
    else:dest.write_bytes(data)
    resolved=ref(dest)
    if not any(x['path']==resolved['path'] for x in recovered):recovered.append(dict(**resolved,method=method+' '+origin+' '+label))
   rows.append(dict(source=ref(report),original=f,status='EXACT',resolved=resolved,method=method,origin=origin,newline=label))
  else:rows.append(dict(source=ref(report),original=f,status='UNAVAILABLE',searched=[dict(method=m,origin=o,sha256=sha(b)) for b,m,o in candidates],disposition='Exclude exact historical implementation-content claim; preserve reported historical validation as report-only. Current tests are separately identified,not substitutes.'))
r=dict(status='SOURCE AUDIT; UNAVAILABLE INTERMEDIATE IMPLEMENTATIONS EXPLICIT',checker=ref(__file__),rows=rows,preservedArtifacts=recovered,limits=['Path-directed local filename search and all-ref Git path histories plus known exact archives. No claim of exhaustive forensic reconstruction of every unreferenced object.'])
p=O/'source-recovery.json'
if p.exists():assert json.loads(p.read_text())==r
else:p.write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(dict(exact=sum(x['status']=='EXACT' for x in rows),unavailable=sum(x['status']=='UNAVAILABLE' for x in rows),recovered=len(recovered))))

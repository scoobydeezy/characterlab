"""Search reachable Git history for exact earlier component receipt bindings."""
from pathlib import Path
import json, hashlib, subprocess
P=Path('docs/planning'); O=P/'campaign3-history-preservation-snapshots-rev1'
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def git(*args): return subprocess.run(['git',*args],capture_output=True,check=True).stdout
inputs=[P/f'campaign3-history-{n}-component-controls-rev1/unresolved.json' for n in ['body','perception']]
gaps=[g for p in inputs for g in json.loads(p.read_text())['gaps']]
pairs=sorted({(g['original']['path'],g['original']['sha256']) for g in gaps});rows=[]
for path,want in pairs:
 commits=git('log','--all','--format=%H','--',path).decode().splitlines(); checked=[]; matches=[]
 for commit in commits:
  r=subprocess.run(['git','show',commit+':'+path],capture_output=True)
  if r.returncode:
   checked.append(dict(commit=commit,status='PATH UNAVAILABLE',diagnostic=r.stderr.decode(errors='replace')));continue
  raw=r.stdout;lf=raw.replace(b'\r\n',b'\n')
  variants={k:hashlib.sha256(v).hexdigest() for k,v in [('raw',raw),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]}
  checked.append(dict(commit=commit,variantHashes=variants))
  matches.extend(dict(commit=commit,variant=k) for k,h in variants.items() if h==want)
 rows.append(dict(path=path,expectedSha256=want,checked=checked,matches=matches))
result=dict(status='BOUNDED EXACT-BYTE GIT SEARCH COMPLETE',checker=ref(__file__),inputs=[ref(p) for p in inputs],head=git('rev-parse','HEAD').decode().strip(),refs=git('show-ref').decode().splitlines(),bindingOccurrences=len(gaps),distinctPairs=len(pairs),matchedPairs=sum(bool(r['matches']) for r in rows),rows=rows,limits=['Search covers git log --all at each exact path and raw/LF/CRLF blob variants. It does not cover renamed paths, dangling objects or other repositories.','No historical writer or test was executed. No absence beyond this search scope or source-exact reproducibility is claimed.','Unmatched receipt detection remains historical testimony; later qualified evidence cannot replace an original source hash.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'])
dest=O/'git-gap-search.json'
if dest.exists(): assert json.loads(dest.read_text())==result
else: dest.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({k:result[k] for k in ['status','bindingOccurrences','distinctPairs','matchedPairs']}))

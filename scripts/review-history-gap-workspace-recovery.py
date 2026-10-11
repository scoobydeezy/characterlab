from pathlib import Path
import json,hashlib,subprocess,collections
P=Path('docs/planning');O=P/'campaign3-history-gap-workspace-recovery-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(Path(p).read_bytes()))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
prior=P/'campaign3-history-gap-census-recovery-rev1/review.json';groups=[x for x in load(prior)['groups'] if not x['exactMatches']];assert len(groups)==200
names={Path(x['target']['path']).name for x in groups}
args=['rg','--files','--hidden','--no-ignore','docs','src','scripts','reference','-g','!**/node_modules/**','-g','!**/.git/**']
run=subprocess.run(args,capture_output=True,check=True);candidates=sorted({p.replace('\\','/') for p in run.stdout.decode('utf-8').splitlines() if Path(p).name in names and not p.replace('\\','/').startswith(O.as_posix()+'/')})
byname=collections.defaultdict(list);seen=[]
for path in candidates:
 data=Path(path).read_bytes();lf=data.replace(b'\r\n',b'\n');variants={'raw':data,'LF':lf,'CRLF':lf.replace(b'\n',b'\r\n')}
 record=dict(path=path,bytes=len(data),variants={k:sha(v) for k,v in variants.items()});seen.append(record);byname[Path(path).name].append(record)
O.mkdir(exist_ok=True);results=[];archived=[]
for g in groups:
 target=g['target'];matches=[]
 for c in byname[Path(target['path']).name]:
  for variant,h in c['variants'].items():
   if h!=target['sha256']:continue
   actual=Path(c['path'])
   if variant!='raw':
    data=actual.read_bytes().replace(b'\r\n',b'\n');data=data if variant=='LF' else data.replace(b'\n',b'\r\n')
    dest=O/'recovered'/(h+'-'+actual.name);dest.parent.mkdir(exist_ok=True)
    if dest.exists():assert dest.read_bytes()==data
    else:dest.write_bytes(data)
    actual=dest
   assert ref(actual)['sha256']==target['sha256']
   matches.append(dict(source=ref(c['path']),variant=variant,exactBytes=ref(actual)))
 results.append(dict(target=target,priorOccurrences=g['occurrences'],matches=matches,status='EXACT BYTES RECOVERED' if matches else 'UNRESOLVED AFTER DECLARED WORKSPACE SEARCH'))
save('inventory.json',dict(command=args,selection='All reported paths whose basename matches one of200 unresolved target pairs, excluding output directory. No Git objects, external repositories, renames with different basename or arbitrary byte synthesis searched.',candidates=seen,predecessor=ref(prior)))
save('review.json',dict(status='EXACT WORKSPACE AND NEWLINE GAP SEARCH',checker=ref(__file__),inventory=ref(O/'inventory.json'),groups=results,limits=['LF/CRLF recovery is accepted only when exact original SHA256 matches; unchanged original files.','This recovers content identity only, not historical timestamp or execution adequacy.','No global absence claim; dependent claim dispositions and independent adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DECLARED WORKSPACE GAP SEARCH',candidateFiles=len(seen),targetPairs=len(groups),recoveredPairs=sum(bool(g['matches']) for g in results),unresolvedPairs=sum(not g['matches'] for g in results),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
print(json.dumps([dict(target=g['target'],match=g['matches'][0]) for g in results if g['matches']]))

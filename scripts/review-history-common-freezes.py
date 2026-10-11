"""Review common freeze declarations as commitments, not runtime verdicts."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-common-freezes-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-common-freezes.mjs') and len(check['rows'])==41
entries={e['path']:e for e in load(B/'manifest.json')['entries']};byhash=collections.defaultdict(list)
for e in entries.values():byhash[e['sha256']].append(e['path'])
sources={};roles=[];bindings=[];pairs={};rosters=[]
for cohort in check['rows']:
 original=cohort['original'];v=load(original)
 assert set(v)=={'date','status','contractSha256','allocationSha256','models'}
 assert v['status'] in ['FROZEN; public qualification not implied','FROZEN before qualification','FROZEN before public qualification']
 assert len(v['models'])==len(cohort['models'])
 authority=[]
 for key in ['contractSha256','allocationSha256']:
  candidates=[p for p in byhash[v[key]] if p.startswith('docs/formal/')]
  if not candidates:candidates=byhash[v[key]]
  assert candidates,key
  p=sorted(candidates)[0];assert sha(p)==v[key];authority.append(ref(p));bindings.append(dict(freeze=original,field=key,**ref(p)))
 for m,c in zip(v['models'],cohort['models']):
  assert m['name']==c['name'] and {k:x for k,x in m.items() if k not in ['name','modelIdentity','files']}==c['claims']
  assert all(isinstance(x,(int,float,bool,str)) for k,val in c['claims'].items() for x in (val.values() if isinstance(val,dict) else [val]))
  for f in m['files']:assert sha(f['path'])==f['sha256'];bindings.append(dict(freeze=original,model=m['name'],**f))
  rosters.append(dict(freeze=original,name=m['name'],claims=c['claims'],modelIdentitySha256=hashlib.sha256(bytes.fromhex(m['modelIdentity'])).hexdigest(),initialStateChecked=c['initialStateChecked']))
 for p in [original,cohort['archive']]:
  assert sha(p)==cohort['sha256']==entries[p]['sha256'];sources[p]=v
  if p!=original:pairs[p]=original
  roles.append(dict(path=p,sha256=sha(p),role='WHOLE COMMON FREEZE COMMITMENT' if p==original else 'EXACT ARCHIVED FREEZE COMMITMENT',judgment='Finite named model roster and scalar settings/law/goal/projection claims are reproduced by the actual compatible compiler from exact frozen parameters/content/registry. Included initial state is compared separately. Contract/allocation fingerprints resolve to exact bytes. Freeze status excludes runtime/public qualification; date does not independently prove chronology. Old and successor cohorts remain distinct,including longitudinal/relationship revision1. No comparator retired or causal/behavioral necessity inferred.',acceptanceChain=[ref(O/'canonical-check.json'),ref(O/'development.json'),*authority]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='FREEZE AUTHORITY LIMIT' if ptr=='/status' else 'MODEL COMMITMENT BACKING',judgment='Freeze declaration and exact model/authority commitment only; behavioral qualification and independent timestamp remain separate.')
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
save(O/'review.json',dict(status='82 COMMON FREEZE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,rosters=rosters,stringLeaves=len(strings),obligations=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'],limits=['362 models are manifest rows,not a claim of globally unique model identities.','No fresh trajectories,public prefix/rollback matrix or behavioral verdict.','Exact rational and legacy revision representation adaptations are explicit;both rejected harnesses retained.','Six structurally different freeze files and other preserved documents remain outside this batch.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),models=check['models'],initialStates=check['initialStates'],originalNarrativeOccurrences=sum(r['role']=='FREEZE AUTHORITY LIMIT' for r in rows),originalBackingOccurrences=sum(r['role']=='MODEL COMMITMENT BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

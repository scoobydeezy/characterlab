"""Bind byte-identical census archive copies without promoting their enclosing cohorts."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-exact-archive-copies-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
ip=P/'campaign3-history-source-roles-rev198/index.json';ix=load(ip)
entries={x['path']:x for x in load(B/'manifest.json')['entries']};by=collections.defaultdict(list)
for r in ix['roleAssignments']:by[r['sha256']].append(r)
sources=[];bindings=[];oldrows={};leaves=[]
for p in ix['unassignedCandidatePaths']:
 matches=by.get(entries[p]['sha256'])
 if not matches:continue
 r=matches[0];q=r['path'];assert Path(p).read_bytes()==Path(q).read_bytes()
 assert ref(p)['sha256']==r['sha256']==entries[p]['sha256']==entries[q]['sha256']
 for e in r['evidence']:assert ref(e['path'])==e
 review=load(r['evidence'][0]['path']);rr=[x for x in review['rows'] if x['source']==q]
 oldrows[p]={(json.dumps(x['location'],sort_keys=True),x['text']):x for x in rr}
 note='Exact byte-identical copy of '+q+'. Inherits only its reviewed content scope: '+r['scope']+' The enclosing archived cohort retains its own rejected/superseded status. Shared contracts, allocations, controls or input plans do not prove unchanged implementation, execution success, source ancestry or chronology. No new run or qualification.'
 chain=[ref(q)]+r['evidence']
 sources.append(dict(**ref(p),role='EXACT ARCHIVE COPY; CONTENT SCOPE INHERITED, COHORT ACCEPTANCE NOT INHERITED',judgment=note,acceptanceChain=chain))
 bindings.append(dict(copy=ref(p),reviewed=ref(q),priorReview=r['evidence'],inheritedScope=r['scope'],byteEquality=True,expectedOriginalOccurrences=len(rr)))
 if p.endswith('.json'):
  lv=list(walk(load(p)));assert lv==list(walk(load(q)))
  leaves.extend(dict(source=p,pointer=k,text=t,role='EXACT REVIEWED CONTENT COPY; NO ADDITIONAL CLAIM') for k,t in lv)
assert len(sources)==11
rows=[];counts=collections.Counter();seen=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in oldrows:continue
  assert u['sourceSha256']==entries[p]['sha256']
  key=(json.dumps(u['location'],sort_keys=True),u['text']);r=oldrows[p][key]
  kind='BACKING' if 'BACKING' in r['role'] else 'NARRATIVE';counts[kind]+=1;seen[p]+=1
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind,reviewedOccurrenceId=r['occurrenceId'],inheritedRole=r['role']))
assert len({r['occurrenceId'] for r in rows})==len(rows)
assert all(seen[p]==len(v) for p,v in oldrows.items())
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All JSON string leaves equal reviewed counterpart; source-path occurrence identities remain distinct. Exact scalar/array/object content verified by raw byte equality.'))
save('review.json',dict(status='ELEVEN EXACT ARCHIVE COPIES RECONCILED WITHOUT COHORT PROMOTION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Two rejected agency cohorts share accepted allocation grammar; allocation equality does not repair observer-ID leakage or wrong intent phase.','Biological public development cohorts share allocation grammar; save-size admission and duplicate-writer findings remain separately preserved.','Task control commitments shared across review revisions do not establish execution/source identity. Relapse copied CONTROL closure and plan remain inherited evidence, not fresh relapse runs.','Absence, routine and relapse copied contracts do not promote enclosing rejected development/harness cohorts.','No source gap closed, runtime/test/build rerun, new scientific verdict or obligation status change. Hashes are not historical timestamps.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT COPY AND ORIGINAL OCCURRENCE JOINS',sources=11,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactByteBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

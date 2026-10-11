"""Reconcile measurement carriage historical acceptance and distinguish recorded reproduction from fresh integrity."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-measurement-carriage-rev1'
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
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limitations','note','preservedOpen','qualification'])
ip=P/'campaign3-history-source-roles-rev215/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
names=['CAMPAIGN2_MEASUREMENT_EVIDENCE_'+n for n in ['MATERIALIZATION.md','QUALIFICATION_REVIEW.md','CONTINUATION_PROOF.json','REMATERIALIZATION_PROOF.json','RUNTIME_PROOF.json']]
paths=[(P/n).as_posix() for n in names];assert all(p in ix['unassignedCandidatePaths'] for p in paths)
notes={}
notes[paths[0]]='Accepted concrete-byte freeze precedes runtime qualification. Seven canonical artifacts plus readable counterparts and review manifest total15 files. Registry slot0 adds9/removes1, slot5 adds8/removes0, slots1..4 unchanged; model fields1/6 change. Four Boolean variant identities are representations, not four packet directories.102 review checks and87 prior-file preservation claims do not imply runtime controls. Initial PACK-F/G and EVC unpassed labels are historical stages, superseded only within the later explicit bounded runtime acceptance. Sandbox/esbuild access failure preserved as tooling, not semantic success. No persistent cognition or whole parent campaign closure.'
notes[paths[1]]='Accepted observer-owned transient carriage uses actual203 production and shared V07 generated intake to publish337 containing exact observation and safe unit. Detached semantic consumer receives only observation/unit/allocated occurrence; no state read/write or learning route. V04 singleton stays shared; V07 is an exact registration extension, not arbitrary version selection. Six ordinal advances/eight children and real-versus-padding ownership are separately checked. EVC-B requires actual generic REG/probe/validation/shared ingress/intake equality plus frozen public changed-anchor exclusion, not public R0 variation. Diagnostic-present-only domain, profile reuse and bounded input corpus remain explicit.563 regression tests preceded five final additions;18 focused tests are not another full suite. Actual restore omission selected old trace binding until compiled carriage configuration was passed; four timeout failures under contention and sandbox access failure remain distinct. Historical337 is immutable after later D changes; no responding cognition, ADAPT9b or full Campaign2 claim.'
notes[paths[2]]='Compact historical two-process continuation attestation: save after carriage, restore in another process, then later authored adaptation with complete canonical save equality. Model digest and two save hashes retained. Receipt does not contain save bytes, ordered inputs or original source manifest; current helper documents exposure2/probe4/exposure6 sequence but is not authenticated as historical helper. Hash strings alone cannot freshly replay or establish historical temporal provenance. No fresh execution performed.'
notes[paths[3]]='Historical two-process delete/rematerialize/verify receipt names15 packet files. Every recorded file hash matches current packet bytes, including frozen review manifest. This fresh integrity check is distinct from rerunning destructive historical reproduction. Seven canonical artifact pairs plus manifest are not15 independent runtime behaviors. Does not qualify authoritative carriage or prove original process/source identity; preserved original construction acceptance and later runtime scope are separate.'
notes[paths[4]]='Runtime summary joins accepted bounded carriage qualification, continuation and rematerialization reports under the same frozen model digest.86files/563tests are the pre-final-addition regression,18 focused tests include final five; counts not additive current suite coverage.197 allocation checks are bookkeeping, not new behavior. B1 actual generic cause witness and B2 public exclusion remain conjunctive; E diagnostic-present, PACK-B exact profile and PACK-I bounded/reuse limits retained. No persistent cognitive update; open ADAPT9b/parent9/PHEN/Campaign2 labels are historical scope, not new current owner rulings.'
packet=P/'campaign2-measurement-evidence-model';proof=load(paths[3]);bindings=[];preserved=[]
assert proof['status']=='PASS' and proof['freshProcesses']==2 and len(proof['deletedAndReproducedFiles'])==15
known={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
for f in proof['deletedAndReproducedFiles']:
 actual=packet/f['name'];assert ref(actual)['sha256']==f['sha256'];bindings.append(dict(owner=paths[3],original=f,actual=ref(actual)))
 if actual.suffix=='.hex' and actual.as_posix() not in known:preserved.append(dict(**ref(actual),method='Exact canonical packet backing resource outside Markdown/JSON census'))
assert len(preserved)==7
v=load(paths[4]);c=load(paths[2]);m=load(packet/'REVIEW_MANIFEST.json')
assert v['modelDigest']==c['modelDigest']==m['modelDigest']=='8dec83b33366ea13217db0005942f9e159ff2e36402c241231af5d5e1f04d22c'
assert c['separateProcesses']==2 and c['savedSha256']!=c['continuedSha256']
assert v['regression']['tests']==563 and v['regression']['files']==86 and v['focused']['tests']==18 and v['allocationChecks']==197
assert m['changedModelFields']==['1','6'] and len(m['checks'])==102 and len(m['variants'])==4 and len(m['preservedSources'])==87
assert [(x['position'],x['byteIdentical'],len(x.get('added',[])),len(x.get('removed',[]))) for x in m['registryDelta']]==[(0,False,9,1),(1,True,0,0),(2,True,0,0),(3,True,0,0),(4,True,0,0),(5,False,8,0)]
for k in ['continuationProof','materializationProof','scopeReview']:assert (P/v[k]).as_posix() in paths
chain=[ref(P/'campaign3-history-probe-carriage-rev1/review.json'),ref(P/'CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='HISTORICAL MEASUREMENT CARRIAGE BYTE FREEZE / BOUNDED RUNTIME SCOPE',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All three compact JSON receipts including short statuses, scope clauses and save/model/file hashes. Two Markdown sources preserve every original prose occurrence.'))
save('review.json',dict(status='FIVE MEASUREMENT CARRIAGE SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),currentHelpers=[ref('scripts/prove-campaign2-measurement-evidence-'+n+'.mjs') for n in ['continuation','rematerialization']],packetManifest=ref(packet/'REVIEW_MANIFEST.json'),limits=['Fresh15-file hash and stored report scope checks only; no writer, deletion, runtime, test, build or rematerialization rerun.','Save hashes attest historical continuation but receipt lacks original save bytes/source manifest; no fresh replay claim.','Packet metadata inspected for bounded count/delta consistency, not whole packet semantic acceptance or new source-role assignment.','No model, law, allocation, verdict, corpus or obligation status change; prior source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED CARRIAGE HISTORY AND PACKET HASH CHECK',sources=5,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newBackingResources=len(preserved),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

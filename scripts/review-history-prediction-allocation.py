"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prediction-design-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'docs/formal/MEASUREMENT_PREDICTION_NUMERIC_PROFILE.md':'Accepted distinct numeric binding for exact point k/10 in0..10, support1..64 and arbitrary-precision reduced mean with no rounding. Fresh64limit before arithmetic, positive n+1, denominator divides10n and bounds640/6400 are consequences not clipping/authentication. Unknown absent notzero, supportidentity not independence/confidence. Earlier exact1 and model identities immutable; controls not alternate production operators; zeroRNG notPERSIST-I.',
'docs/formal/MEASUREMENT_PREDICTION_ALLOCATION.md':'Permanent historical359..369/schema1,45fields,15members,20roles,namespace1127 and one366identity rule. Initial erroneous367field2reference275 and368schema1 retained as allocation history, explicitly superseded for runtime by correction367/2and368/2. No renumber/reuse or allocation as qualification; no new cue/application identity or statefamily.',
'docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.md':'Proposed notpermanent Markdown inventory preserved. Exact record/member/role parity with draftmachine and eventual frozeninventory does not prove semantic correctness of referenced275; later correction owns executable schema exclusion. No model activation or PREDvector pass.',
'docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.json':'All short schema/type/member/failure strings preserved; elevenrecords45fields15members20roles one namespace/occurrence. Four textual failure codes not numericallocations. Draft/frozen payload equality exceptversion/status/acceptance/reviewrefs checked, not psychological or runtime authority. Old275-as-occurrence remains rejected historicalerror.',
'docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_AUDIT.json':'Numeric allocation parity audit, not runtime. Six listed checks establish recorded inventory/preservation scope, not semantic275reference correctness.18exact referenced artifacts/source hashes checked; originalPASS preserved with explicit later narrowed interpretation.',
'docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_AUDIT.json':'Internal frozen numeric audit:166prior preservation refs,16sources,twoaccepted/twodrafts exact. Ten checks include referencedrecord closure but numeric existence missed wrongsemanticname275; later occurrencecorrection explicitly corrects that acceptedshape. Byte preservation is valid separately from erroneous semanticclaim. No runtimequalification/Campaign2closure.'}
ip=P/'campaign3-history-source-roles-rev229/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
O=P/'campaign3-history-prediction-allocation-rev1';O.mkdir(exist_ok=True)
import collections
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];preserved=[]
for p in notes:
 if not p.endswith('.json'):continue
 v=load(p)
 for k in ['sourceFingerprints','preservationFingerprints','reviewedArtifacts','acceptedArtifacts','reviewedDraftArtifacts']:
  for r in v.get(k,[]):
   actual=r['path'] if ref(r['path'])['sha256']==r['sha256'] else archives[r['sha256']]
   assert ref(actual)['sha256']==r['sha256'];bindings.append(dict(receipt=p,original=r,actual=ref(actual)))
x=load('docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json');y=load(P/'MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.json')
assert [k for k in x if x[k]!=y.get(k)]==['version','status','acceptance','reviewedDraftArtifacts']
assert len(y['records'])==11 and sum(len(r['fields']) for r in y['records'])==45
assert len(y['members'])==15 and len(y['roles'])==20 and len(y['namespaces'])==len(y['occurrenceIdentities'])==1
assert [r['typeId'] for r in y['records']]==list(range(359,370))
for p in ['docs/formal/MEASUREMENT_PREDICTION_ALLOCATION.md','docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.md']:
 text=Path(p).read_text(encoding='utf-8')
 for r in y['records']:
  row='| '+str(r['typeId'])+' | 1 | '+r['name']+' | '+'; '.join(f"{f['id']}:{f['name']}:{f['type']}" for f in r['fields'])+' |';assert row in text
 for m in y['members']:assert f"| {m['namespace']} | {m['payload']} |" in text
 for r in y['roles']:assert f"| {r['recordTypeId']} | {r['fieldId']} | {r['requiredNamespace']} | {r['domainValidatorId'] or 'absent'} |" in text
assert len(load('docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_AUDIT.json')['preservationFingerprints'])==166
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','checks','excluded','runtimeQualification','campaign2'])
chain=[ref('docs/formal/MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md'),ref(P/'campaign3-history-allocation-corrections-rev1/review.json'),ref(P/'campaign3-history-prediction-qualification-rev1/review.json')];sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL NUMERIC/ALLOCATION AUTHORITY WITH CORRECTED SEMANTIC CLAIM',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({x['occurrenceId'] for x in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='SIX NUMERIC/ALLOCATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Fresh inventory/parity/hash checks are not new runtime qualification or repair of historical audit semantics.','Historical275error remains preserved; correction binds active schemas separately without renumbering permanentfields.','No new source gap/archive or runtime/test/build rerun; no model/allocation/verdict/corpus/obligation status change.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS NUMERIC/ALLOCATION HISTORY AND EXACT BINDINGS',sources=6,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

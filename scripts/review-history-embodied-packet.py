"""Reconcile the detailed EMB type, dispatch, witness and packaging packet."""
from pathlib import Path
import json, hashlib
P=Path('docs/planning'); O=P/'campaign3-history-embodied-packet-rev1'; B=P/'campaign3-history-universe-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str): yield p,v
specs={
 'CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md':'Proposed SYM1 type closure only. Canonical scalar/record/set/map grammar and semantic key uniqueness are separate. Closed sample schema alias is not an extra wrapper; two conditional union records reject wrong branch fields. Exclusive254 schemas replace two exactly-one277 outputs; retained-sample ingress differs from immediate phase14 parent, leaving276 unchanged. Explicit channel1005 differs from definition1027. Role qualification recurses; valid shape does not authenticate production. Initial31-record proposal precedes the accepted32-record allocation with trace quantization.',
 'CAMPAIGN3_EMBODIED_VOCABULARY_DISPATCH_DRAFT.md':'Proposed SYM2 exact kind/version/schema dispatch, not allocation or activation. Producing seam differs from registration grammar. Eight event types yield six slots, not eight events/sample. Fixed stock token is neither SI conversion nor generic unit registry. Singleton public observer has honest component/profile-exclusion controls, not general multi-observer proof. Permission denial alone yields unavailable; subsequent errors preserve their owning classes. Snapshot string collision scan was historical membership evidence, not semantic approval and not a valid present-day zero-collision expectation after allocation.',
 'CAMPAIGN3_EMBODIED_PROFILE_WITNESS_DRAFT.md':'SYM3 symbolic expectation table, not original runtime receipt. Seven comparisons preserve original input order; only first two hidden89 safe samples match baseline, not all history. Staged refill at75 consumes first refill result. Sampling never reanchors depleted stock. Six slots/five children/three ordinals preserve private missing-experience padding without minting SEM. Complete-instant pending original closure includes both source families. SaveContractError is the actual semantic class, not invented INVALID_SAVE; decode/runtime errors retain their owners. Later packaging clarifies hidden89 same ModelIdentity/different RunIdentity.',
 'CAMPAIGN3_EMBODIED_MODEL_PACKAGING_REV1.md':'Packaging proposal subsequently accepted in shape, not itself model freeze or runtime pass. Nine data-only source fields and independent versions bind six exact slots; descriptors support decoding without authorizing executable entries.297 inherited declarations differ from298 decoder pairs;32 new give329, with45 role positions and exact occurrence rows. Physical455 ownership needs no ADAPT family. New numeric profile explicitly admits stock saturation; old exact-1 is not widened. Six semantic models/seven runs plus separate work7 failure image. Empty RNG metadata must follow admitted no-draw closure; all14 empty content lists still retain authored character identity. Old V04 compiler cannot admit new registration graph.',
 'CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json':'Fresh exact replay reproduces all seven symbolic arithmetic cases,63 input records and42 completed boundaries including allocator/pending-input expectations. Original receipt explicitly says no scheduler/PRJ/SEM/patch/restore executed. Later public reserve replay is separate evidence; arithmetic identity does not establish live source admission or observer isolation.'
}
specs={str(P/k).replace('\\','/'):v for k,v in specs.items()}
reusedExpectationJudgment=specs.pop(str(P/'CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json').replace('\\','/'))
prior=load(P/'campaign3-history-source-roles-rev137/index.json'); known={r['path'] for r in prior['roleAssignments']}
assert not set(specs)&known
expect=load(O/'expectations.json'); assert expect['status']=='PASS' and expect['cases']==7
for k in ['original','checker']: assert ref(expect[k]['path'])==expect[k]
for x in expect['bindings']: assert ref(x['resolvedPath'])['sha256']==x['sha256']
original=load(P/'CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json')
assert len(original['cases'])==7 and sum(len(x['records']) for x in original['cases'].values())==63
assert sum(len(x['boundaries']) for x in original['cases'].values())==42
for k in ['document','script']: assert ref(original[k]['path'])==original[k]
runtime=load(P/'campaign3-history-embodied-reserve-rev1/execution.json')
crosswalk=[]
for name,c in original['cases'].items():
 runtime_name='hidden89' if name=='hiddenInitial' else name
 r=next(x for x in runtime['results'] if x['name']==runtime_name)
 assert r['checkedOriginals']==len(c['records']) and r['checkedBoundaries']==len(c['boundaries'])
 assert r['events']==c['totals']['events'] and r['semOutputs']==c['totals']['semOutputs']
 crosswalk.append(dict(expectationCase=name,publicCase=runtime_name,runDigest=r['runDigest'],scope='Count crosswalk only; exact behavioral/artifact comparison resides in the prior reserve execution audit, not inferred from counts.'))
accept=P.parent/'formal/EMBODIED_MODEL_PACKAGING_ACCEPTANCE.md'
assert 'EPACK-A..H as **NOT PASSED**' in accept.read_text(encoding='utf-8')
q=load(P/'CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json'); assert q['packaging']=='EPACK-A..I PASS in stated bounded composition'
chain=[ref(O/'expectations.json'),ref(accept)]+[ref(P/x) for x in ['campaign3-history-embodied-reserve-rev1/review.json','campaign3-history-embodied-contracts-rev1/review.json','campaign3-history-embodied-boundaries-rev1/review.json','CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json']]
entries={e['path']:e for e in load(B/'manifest.json')['entries']}; roles=[]; strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='TYPE / DISPATCH / SYMBOLIC WITNESS / PACKAGING PROPOSAL',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)): strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']; ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'): assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/limitation']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='DETAILED EMB TYPE/DISPATCH/WITNESS/PACKAGING RECONCILED; HQ011 OPEN',sourceRoles=roles,reusedExpectationJudgment=reusedExpectationJudgment,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=expect['bindings']+[dict(originalPath=original[k]['path'],resolvedPath=original[k]['path'],sha256=original[k]['sha256']) for k in ['document','script']],caseCrosswalk=crosswalk,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh finite arithmetic only; prior47 runtime tests/49prefixes and14packaging component checks are reused, not rerun.','The original historical vocabulary zero-collision scan predates allocation; no present-day zero-collision assertion. Full machine typed/vocabulary/packaging inventories remain separately unassigned.','EPACK proposal and shape acceptance did not pass runtime obligations. Later bounded qualification and prior fresh reserve audit supply scoped evidence; no retroactive pass.','No new model, contract, allocation, law, verdict, obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(r['bindings']),freshArithmeticCases=7,records=63,boundaries=42,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists(): assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

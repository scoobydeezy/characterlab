from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-temporal-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/TEMPORAL_GOAL_CONFLICT_CONTRACT.md': 'Accepted component0.1: independent adopted short/long goals with progress/deadlines/access and exact task grounds. Prior safe source feeds actual inherited choice/intent/expression/execution. Receipt chosen-goal-only; lifecycle fulfillment/cancellation/expiry independent. Component atomic saves/restore bind full state/input/seed, not public scheduler admission.', 'docs/planning/TEMPORAL_GOAL_CONFLICT_READINESS.md': 'Prospective two desired states, not strategies for one goal or times for same benefit. Genuine motives/choice, retained loser/later pursuit, selective retirement and admitted progress. Prefer composition; no opaque roulette or universal temporal currency.', 'docs/planning/CAMPAIGN3_TEMPORAL_QUALIFICATION.md': 'VER-C3-TEMPORAL-001:4 models27 runs243 component saves216 advancing27 terminal;16/328 tests/build historical. Short chosen2 fulfills, long remainsOpen then pursued3/4/5; physical totals1/3. HorizonRelative/NoTemporalBias same sampled sequence but distinct distributions. DropLoser/SharedRetirement both cancel long here; matching failure does not uniquely diagnose collapse. Separate prospection clauses not general integration.', 'docs/planning/TEMPORAL_IMPLEMENTATION_FINDINGS.md': 'Forecast opening not remaining completion capacity. Boolean access/availability narrower than unknown/expired/conflicting belief. Hidden success no perceived progress, false receipt may fulfill; terminal no reopen. Full inherited409/425/426/431/432/433 pipeline, staged RNG rollback. No rejected cohort; prototype expiry fixture differentiated before freeze. Resolved content identity lesson applied before freeze.', 'docs/planning/TEMPORAL_PLAN_REV1.json': 'Four models27 unique runs with resolved goals/actions/deadlines/progress/calibration/dice/arbitration plus artifact commitments. Freeze precedes component experiment; no duplicate or corrected frozen model.', 'docs/planning/TEMPORAL_RESULT_REV1.json': 'Twenty-seven original rows243 exact component prefix saves. Fresh full replay verifies every original run identity, save/snapshot/safe/prefix hash and all original semantic assertions. Not public scheduler/source/owner admission.', 'docs/planning/TEMPORAL_VIEWS_REV1.json': 'Complete27 snapshots/safe views include actual losing-goal preservation/later pursuit, selective retirement, physical versus perceived progress, addresses and full expression. Fresh replay exactly equals originals. False/denied outcome and denied adoption whole-view controls retained.', 'docs/planning/TEMPORAL_CLOSURE_REV1.json': 'Original closure freshly authenticates artifact/result/view/model/run and16/328 build/test evidence.1400/0 no allocation. Component canonical saves/transactions do not qualify public runtime.', 'docs/planning/TEMPORAL_PRESERVATION_REV1.json': 'Exact preserved test/findings artifacts; no failed source/scientific cohort in increment. Keep calibration, current-source and completion-capacity limits, prior identity-binding lesson and diagnostic comparator ambiguity.', 'docs/planning/TEMPORAL_TESTS_REV1.json': 'Historical16 individually passed assertions: independent goals, full pipeline, semantic interventions and atomic after-choice/before-commit faults with staged RNG rollback and exact retry; component save tamper/input/seed rejection. Not fresh test suite.', 'docs/planning/TEMPORAL_REFERENCE_TESTS_REV1.json': 'Historical328 individually passed reference assertions; metadata backing not fresh suite/general temporal qualification.', 'docs/planning/TEMPORAL_BUILD_REV1.json': 'Historical build PASS with exact artifacts. Not fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref(P/'TEMPORAL_CLOSURE_REV1.json'),ref('scripts/qualify-temporal-goals.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='TEMPORAL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'TEMPORAL_RESULT_REV1.json');plan=load(P/'TEMPORAL_PLAN_REV1.json')
assert v['planSha256']==ref(P/'TEMPORAL_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==27 and sum(len(r['prefixHashes']) for r in v['results'])==243
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('TEMPORAL_TESTS_REV1.json',16),('TEMPORAL_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for n in ['TEMPORAL_BUILD_REV1.json','TEMPORAL_PRESERVATION_REV1.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
assert load(O/'replay-check.json')['prefixes']==243
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-001','RO-C3-010','RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWELVE TEMPORAL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh27 trajectories/243 canonical component restores and successors, not public scheduler/source admission or16/328 test/build rerun.','HorizonRelative and NoTemporalBias differ in probability but share primary sampled sequence; no necessity claim.','DropLoser and SharedRetirement coincide here; observation does not uniquely diagnose lifecycle collapse.','Forecast not completion capacity; Boolean current gates not general feasibility beliefs; no optimal scheduling or cross-domain currency.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

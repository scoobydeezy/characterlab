from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-procrastination-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md': 'Accepted0.2 pre-deadline adoption1..5 only. Active accessible feasible work with positive independent task reason may compete with separate immediate task via exact dice. Three observed successful units by6; performed/perceived/terminal states separate. Forecast one opening at6 not completion guarantee. Four valuation candidates retained, no habit/procrastination law.', 'docs/planning/PROCRASTINATION_READINESS.md': 'Prospective retained goal/current access/feasibility/future expectation and actual postponement distinct. Idle alone insufficient. Exact independent reason grammar required; no weak-will trait, optimality or arbitrary utility roulette.', 'docs/planning/CAMPAIGN3_PROCRASTINATION_QUALIFICATION.md': 'VER-C3-PROCRASTINATION-001 corrected0.2:4 models20 runs180 prefixes160 advancing20 terminal;26/328 tests/build historical. Actual defer under intact positive work motive and later work. NoTemporalBias changes distribution not guaranteed action; NoImmediateMotive completes2/3/4. First25 tests/build missed late-adoption bug, preserved targeted failure and old cohort never publicly qualified.', 'docs/planning/PROCRASTINATION_IMPLEMENTATION_FINDINGS.md': 'Adoption at/after6 bypassed deadline branch in0.1; reject6/7/8 in0.2 with new identities, no new valuation law/allocation. Available later is not sufficient completion capacity: one opening versus three units. False visible outcomes change perceived progress; intended/unseen/blocked work and forecast cannot. Current-feasibility Boolean not richer GOAL belief. Diagnostic habit/reward not work valuation.', 'docs/planning/PROCRASTINATION_PUBLIC_PLAN_REV2.json': 'Corrected20 unique original runs, four models and exact source/experiment/comparison commitments. No instructed-action shortcut; controlled task and forecast sources.', 'docs/planning/PROCRASTINATION_PUBLIC_PLAN_REV1.json': 'Original frozen0.1 plan preserved and unexecuted for public qualification. Each binding resolves exact archived bytes or original freeze; not a public PASS.', 'docs/planning/PROCRASTINATION_PUBLIC_RESULT_REV2.json': 'All20 rows180 historical prefixes bound to corrected plan. Fresh stored assertions prove intact-goal actual defer, independent grounds, later work, temporal corrections, access/unavailable/no-goal controls, terminal status and whole-view privacy. No fresh replay.', 'docs/planning/PROCRASTINATION_PUBLIC_VIEWS_REV2.json': 'Twenty stored output/safe views hash-authenticated; original assertions freshly decoded. False forecast preserves choices through5 then unavailable6; false unit outcome can preserve safe views despite truth differences. Forecast itself never progress.', 'docs/planning/PROCRASTINATION_CLOSURE_REV1.json': 'Fresh original closure checks corrected and archived0.1 chains, failure receipt, artifacts and unique counts.1353..1376 inherited1155;1376/0 historical. Integrity not fresh runtime.', 'docs/planning/PROCRASTINATION_PRESERVATION_REV1.json': 'Eight exact artifacts preserve first passing tests/build, failed targeted adoption test/source, old public plan/freeze/archive and findings. No overwritten rejected cohort.', 'docs/planning/PROCRASTINATION_TESTS_REV1.json': 'First25 assertions pass but omit late-adoption boundary; not adequate lifecycle coverage or public qualification.', 'docs/planning/PROCRASTINATION_ADOPTION_FAILURE_REV1.json': 'One targeted rejection regression fails because late adoption compiles; direct evidence first passing suite missed deadline admission. Preserve failure message/source and forward correction.', 'docs/planning/PROCRASTINATION_TESTS_REV2.json': 'Corrected26 individually passing assertions, including added late-adoption rejection and15 stages+commit rollback, phases, authority/ingress/save/original checks. Historical not freshly run.', 'docs/planning/PROCRASTINATION_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing not new findings or fresh execution.', 'docs/planning/PROCRASTINATION_BUILD_REV1.json': 'Initial build PASS despite semantic admission flaw. Historical source bindings authenticated through preserved archive; build success not lifecycle proof.', 'docs/planning/PROCRASTINATION_BUILD_REV2.json': 'Corrected historical build PASS and exact artifacts; not fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'PROCRASTINATION_CLOSURE_REV1.json'),ref('scripts/qualify-procrastination-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='PROCRASTINATION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'PROCRASTINATION_PUBLIC_RESULT_REV2.json');plan=load(P/'PROCRASTINATION_PUBLIC_PLAN_REV2.json')
assert v['planSha256']==ref(P/'PROCRASTINATION_PUBLIC_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==20 and sum(r['prefixes'] for r in v['results'])==180
for i,r in enumerate(v['results']):
 assert set(r)==set('candidate law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('PROCRASTINATION_TESTS_REV2.json',26),('PROCRASTINATION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'PROCRASTINATION_BUILD_REV2.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'PROCRASTINATION_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
t=load(P/'PROCRASTINATION_TESTS_REV1.json');assert t['success'] and t['numPassedTests']==25
assert all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
t=load(P/'PROCRASTINATION_ADOPTION_FAILURE_REV1.json');assert not t['success'] and t['numFailedTests']==1
assert sum(a['status']=='failed' for f in t['testResults'] for a in f['assertionResults'])==1
root=P/'campaign3-procrastination-model-rev1'
for a in load(root/'PRESERVATION.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'PROCRASTINATION_PUBLIC_PLAN_REV1.json')['artifacts']:
 f=Path(a['path']) if 'campaign3-procrastination-model-rev1/FREEZE.json' in a['path'] else root/'preserved'/a['path']
 assert ref(f)['sha256']==a['sha256']
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='SIXTEEN PROCRASTINATION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh20 stored views, not180 prefixes or26/328 tests/build.','First25 tests/build passed despite late-adoption bug; preserved failed regression, old cohort not publicly qualified.','Single later opening not sufficient time for three units; no optimal or justified postponement claim.','Actual defer requires active/access/feasibility/positive work reason; absent option or cancelled goal is not procrastination.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-performance-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/PERFORMANCE_PUBLIC_CONTRACT.md': 'Accepted performance-public0.1: unchanged SeparateGoalPlan availability evaluation plus visit-local admitted failure monitoring. TwoFailures/OutcomeBlind/AnyFailure/TruthOracle distinct. Known alternative required; missing feedback neither increments nor resets; admitted success resets. Goal/plan/knowledge separate; feedback not attainment or causal diagnosis. Plan90/attempt100/execution110 actual consumer after prior learning140.', 'docs/planning/PERFORMANCE_MONITORING_READINESS.md': 'Prospective Brief12.6-5: hold goal and availability fixed while admitted feedback changes later actual strategy. No attempt is not failure; hidden causes cannot enter cognition. Preserve GOAL/CONTROL/SKILL/AGENCY; no universal threshold/resource/choice law.', 'docs/planning/CAMPAIGN3_PERFORMANCE_QUALIFICATION.md': 'VER-C3-PERFORMANCE-001:4 models22 runs198 prefixes176 advancing22 terminal;19/328 tests/build historical. Main none,A,A,B,B,B,B,B with fixed goal/availability and actual B success at4. Blocker also removed at4, so success does not establish B superiority. False failure changes strategy despite physical success; missing/admission and independent attainment controls retained.', 'docs/planning/PERFORMANCE_IMPLEMENTATION_FINDINGS.md': 'VisitStartedAt prevents stale failures on return; probe reevaluation cannot recount sample. Missing feedback is unknown, not success. AnyFailure serious threshold alternative; OutcomeBlind retains diagnostics. Actual downstream action earned, causal improvement not earned because blocker clears. Own-action identity controlled, not inferred. First cohorts pass, no overwritten failure; no competence inference or optimality.', 'docs/planning/PERFORMANCE_PUBLIC_PLAN_REV1.json': 'Four frozen models22 unique original identities, inputs, experiment/comparison and exact artifact bindings. EmptyS0 ordinary deterministic planning, no RNG draws or new Decision/intent/expression qualification.', 'docs/planning/PERFORMANCE_PUBLIC_RESULT_REV1.json': 'All22 rows198 historical prefixes bound to exact plan. Fresh stored semantic assertions verify route sequences, current-visit counts, stable goal/availability, real B attempt/execution, no adoption, external fulfillment and whole later privacy. Not fresh runtime replay.', 'docs/planning/PERFORMANCE_PUBLIC_VIEWS_REV1.json': '22 full output and single-observer views authenticated against result hashes and plan; original assertions freshly decoded. FalseFailure equals main lawful views despite different physical success; Oracle violates hidden-outcome boundary. Evidence retains actual consumer but not alternative superiority.', 'docs/planning/PERFORMANCE_CLOSURE_REV1.json': 'Original closure freshly passes source/model/allocation/artifact/result/view hashes. Historical1292..1310 namespace1183,1310/0. Integrity confirmation not fresh198 restores/tests/build.', 'docs/planning/PERFORMANCE_PRESERVATION_REV1.json': 'Three exact artifacts preserve first passing tests, finite causal limitations and model freeze. Prior GOAL/CONTROL/SKILL/AGENCY retain distinct identities and claims; no reduction.', 'docs/planning/PERFORMANCE_TESTS_REV1.json': 'Historical19 individually passing assertions include8 stages+commit rollback during first monitoring switch, phases/immutable prefixes, malformed source/authority/handles and tampered saves/originals. No fresh execution.', 'docs/planning/PERFORMANCE_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions, metadata backing not new monitoring findings or fresh suite.', 'docs/planning/PERFORMANCE_BUILD_REV1.json': 'Historical successful build and exact artifact hashes, not fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'PERFORMANCE_CLOSURE_REV1.json'),ref('scripts/qualify-performance-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='PERFORMANCE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'PERFORMANCE_PUBLIC_RESULT_REV1.json');plan=load(P/'PERFORMANCE_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'PERFORMANCE_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==22 and sum(r['prefixes'] for r in v['results'])==198
for i,r in enumerate(v['results']):
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('PERFORMANCE_TESTS_REV1.json',19),('PERFORMANCE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'PERFORMANCE_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'PERFORMANCE_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWELVE PERFORMANCE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh22 stored-view comparisons, not22-run/198-prefix runtime replay or19/328 tests/build.','Actual B execution does not establish causal improvement: blocker clears for either route at4.','Controlled action identity and fallible outcome displays; no competence/causal diagnosis or inferred action recognition.','Visit-local threshold candidate, not optimal switching or general control; ordinary planning retains prior Decision/intent/expression obligations.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-agency-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/AGENCY_PUBLIC_CONTRACT.md': 'Accepted agency-public0.3: actual two-option choice continues intent70/expression80/plan90/attempt100/execution110; no identity learning. World competence/blocker separate from own observer evidence, episode/receipt/actor marks explicitly admitted. Fixed empty observer chains prevent denied reports shifting later occurrence provenance. Five candidates retain grouped/last law, outcome-only, violating omniscience and dropped-failed-expression controls. No generic SEM, natural recognition, causal discovery or coercion claim. Exact phase correction is contract compliance, not universal prohibition on other accepted co-location.', 'docs/planning/CAMPAIGN3_AGENCY_QUALIFICATION.md': 'VER-C3-AGENCY-001 final0.3:5 models19 runs71 prefixes52 advance19 terminal,38 tests328 reference historical. First17-run matrix passed its narrower scope but missed nonrecipient provenance leak; corrected19-run matrix includes later-attempt pair. Second cohort fixed leak but intent80 violated required70. Only Plan/ResultREV3 and ClosureREV2 are final authority. Witnessed blockage not counterfactual efficacy; actor chosen intent/archive distinct from outcome and observer belief. Repeated-interference expectation and coercion absent here, even if later separately qualified.', 'docs/planning/AGENCY_IMPLEMENTATION_FINDINGS.md': 'Preserve source checkpoint attempt90 documentation error versus actual required100; identified actor only admitted when blocking visible; blocked competent/incompetent same safe view. Episode-local report contradiction is not calibrated trust or cross-episode expectation. Original35-test terminal-count receipt not falsely relabeled Vitest export. First nonrecipient future-occurrence leak and second exact-phase mismatch are distinct failures, corrected forward with both source cohorts preserved. Neither earlier behavioral PASS establishes final closure.', 'docs/planning/AGENCY_PUBLIC_PLAN_REV3.json': 'Final prospective19-run original/model/run commitments plus ExperimentIdentity/ComparisonCase and source/contract/allocation/freeze hashes. Includes nonrecipient report/no-report followed by later attempt, hidden competence/blocker/access controls, conflicting/corrective/repeated reports and separate episodes. Canonical bytes/labels are backing; no outcome-based model selection or evidence admission inferred.', 'docs/planning/AGENCY_PUBLIC_RESULT_REV3.json': 'Stored final19-run71-prefix rows join exact plan model/run/original bytes,52 advancing19 terminal. Current original closure verifies all frozen bindings; no new19-run replay here. Observer hash pairs and actual earlier record comparisons are evidence for declared finite contrasts, not arbitrary hidden-world invariance. Fresh INFER replay exercises inherited0.3 with its own longer report horizon but does not replace this original matrix.', 'docs/planning/AGENCY_CLOSURE_REV2.json': 'Original read-only checker freshly passes final result/plan,38/328 historical tests/build,18 allocations971..988 namespace1163, all three five-model freezes and exact archived artifact maps for prior two plans. Explicit two preserved failures remain. Hash integrity is not a fresh archived-failure or final runtime reexecution.', 'docs/planning/AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json': 'Actual first regression: one test failed complete Uint8Array view equality after unreceived report. Same belief values insufficient because later occurrence IDs shifted. Stack/runner metadata backing; failure preserved even though narrower17-run experiment passed. No new biological or cognitive mechanism introduced by fixed empty reservations.', 'docs/planning/AGENCY_PHASE_FAILURE_REV1.json': 'Archived0.2 reexecution receipt reports actual intent80 versus required70 and exact prior ModelIdentity/PRESERVATION reference. Expected regression is evidence of mismatch, not success of required phase. Correct0.3 trace-phase test distinguishes actual producers; no allocation or schema change and no rewriting prior model identity.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='AGENCY AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'closure-check.json'),ref(P/'AGENCY_CLOSURE_REV2.json'),ref(P/'agency-rev1/PRESERVATION.json'),ref(P/'agency-rev2/PRESERVATION.json')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'AGENCY_PUBLIC_RESULT_REV3.json');plan=load(P/'AGENCY_PUBLIC_PLAN_REV3.json')
assert v['planSha256']==ref(P/'AGENCY_PUBLIC_PLAN_REV3.json')['sha256']
assert len(v['results'])==len(plan['runs'])==19
assert sum(r['prefixes'] for r in v['results'])==71
for i,r in enumerate(v['results']):
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
failure=load(P/'AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json');assert failure['numFailedTests']==1 and not failure['success']
phase=load(P/'AGENCY_PHASE_FAILURE_REV1.json');assert phase['actualIntentPhase']==80 and phase['requiredIntentPhase']==70

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='EIGHT AGENCY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Original closure freshly verified; no fresh19-run/71-prefix replay or38/328 test/build execution.','Prior two failing cohorts and narrower successful matrices remain preserved, not erased.','Obstruction attribution is not counterfactual efficacy, blame, general expectation or coercion.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=8,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

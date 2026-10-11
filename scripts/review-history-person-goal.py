from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-person-goal-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/PERSON_GOAL_PUBLIC_CONTRACT.md': 'Accepted person-goal-public0.1: standing adopted destination140 first informs later ordinary plan90, attempt100, outcome110, admitted motion/arrival120, retained evidence140, later inference40/appraisal50. Known finite route catalogue supplies affordances not hidden purpose. No draws, contested Decision or mutable plan root. RouteAndOutcome/OutcomeOnly/NoLearning/GoalOracle retained; experimental factors not calibrated inverse planning.', 'docs/planning/PERSON_GOAL_INFERENCE_READINESS.md': 'Prospective bounded question: desired state separate from strategy/action/outcome/observer estimate. Same goal/different strategy, shared action/different goal, failed attempt, ambiguity, error/revision, observers and later whole-view privacy required. Accepted consumer is appraisal, not observer action. Controlled goal catalogue not discovery or recognition.', 'docs/planning/CAMPAIGN3_PERSON_GOAL_QUALIFICATION.md': 'VER-C3-PERSON-GOAL-001:5 models21 runs126 prefixes105 advancing21 terminal;24/328 tests/build historical. Shared hub gives1/2; mirrored failed attempt gives1/4 for actualgoal1 versus B3/4; accurate alternate route/arrival revises to9/10. Same goal record through strategies/failure. Unknown distinct ambiguity, hidden goal/privacy and goal-only appraisal controls preserved. No general inverse planning/persistence/fulfillment.', 'docs/planning/PERSON_GOAL_IMPLEMENTATION_FINDINGS.md': 'Known affordance catalogue is source assumption, not learned recognition or candidate-goal discovery. Motion and arrival can share causal episode; factor multiplication does not establish independence or calibrated confidence. Ordinary route planning follows standing control, not contested choice. No failed construction cohort in this increment; existing historical debt remains.', 'docs/planning/PERSON_GOAL_PUBLIC_PLAN_REV1.json': 'Prospective21 original runs/five models, exact ExperimentIdentity/ComparisonCase and source/contract/fixture bindings. Empty initial state, committed32-byte seed13 but no draws. Frozen names/identities are backing; stored decoded contrasts supply behavioral evidence.', 'docs/planning/PERSON_GOAL_PUBLIC_RESULT_REV1.json': 'Complete21-row126-prefix aggregate from four disjoint worker partitions. Fresh all-view decoding and original assertions authenticate inference/appraisal, plans/goals/attempts and whole later views. Historical105 advancing21 terminal, not new scheduler replay.', 'docs/planning/PERSON_GOAL_CLOSURE_REV1.json': 'Original closure freshly passes all source/model/allocation/worker bindings, plan/result joins and historical24/328 tests/build. Records1178..1194 namespace1175;1194/0 historical. Integrity check does not rerun126 restores or fault suite.', 'docs/planning/PERSON_GOAL_TESTS_REV1.json': 'Historical24 PASS initial suite:14 stages plus commit rollback, actual phases, separate goal/plan/attempt/outcome, observer privacy/evidence, ownership/foreign evidence and malformed model/input/save/handles. No new failed cohort or fresh execution; finite scope.', 'docs/planning/PERSON_GOAL_REFERENCE_TESTS_REV1.json': 'Historical328 passing reference assertions. Repeated names/paths/timings backing to reviewed mechanisms; no new goal-inference finding or fresh suite execution.', 'docs/planning/PERSON_GOAL_BUILD_REV1.json': 'Historical final boundary/TypeScript/Vite PASS with exact source artifacts verified. Not fresh build or full active-suite claim.', 'docs/planning/personGoal-public-workers-rev1/0.json': 'Worker partition0: exact modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh21 stored-view original contrasts verify mistaken/revised inference, shared-action ambiguity, failed attempt, independent channels, goal-only appraisal and later privacy. Not fresh126-prefix runtime replay.', 'docs/planning/personGoal-public-workers-rev1/1.json': 'Worker partition1: exact modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh21 stored-view original contrasts verify mistaken/revised inference, shared-action ambiguity, failed attempt, independent channels, goal-only appraisal and later privacy. Not fresh126-prefix runtime replay.', 'docs/planning/personGoal-public-workers-rev1/2.json': 'Worker partition2: exact modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh21 stored-view original contrasts verify mistaken/revised inference, shared-action ambiguity, failed attempt, independent channels, goal-only appraisal and later privacy. Not fresh126-prefix runtime replay.', 'docs/planning/personGoal-public-workers-rev1/3.json': 'Worker partition3: exact modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh21 stored-view original contrasts verify mistaken/revised inference, shared-action ambiguity, failed attempt, independent channels, goal-only appraisal and later privacy. Not fresh126-prefix runtime replay.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'PERSON_GOAL_CLOSURE_REV1.json'),ref('scripts/qualify-person-goal-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='PERSON-GOAL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'PERSON_GOAL_PUBLIC_RESULT_REV1.json');plan=load(P/'PERSON_GOAL_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'PERSON_GOAL_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==21 and sum(r['prefixes'] for r in v['results'])==126
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('PERSON_GOAL_TESTS_REV1.json',24),('PERSON_GOAL_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'PERSON_GOAL_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-011','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FOURTEEN PERSON-GOAL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh21 stored-view comparisons, not21-run/126-prefix runtime replay or24/328 tests/build.','Motion/arrival may share episode;9/10 is candidate weight, not calibrated confidence.','Known catalogue and standing repeated-delivery control do not establish learned affordances, general goal discovery, fulfillment or persistence.','Ordinary plan selection, no contested choice/DecisionExpression or observer action qualification.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

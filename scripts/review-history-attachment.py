from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-attachment-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/ATTACHMENT_PUBLIC_CONTRACT.md': 'Accepted attachment-public0.1: own admitted support/resolution/prior demand/perceived inability conjunction derives Bond=min(count/2,1), separate person mean relief and current presence/demand/alternative. No omniscient necessity or authored attachment meter. MissingContact versus CurrentUtility distinct; prospective information/assistance probes only. DependenceHistory/PositiveHistory/CurrentUtilityOnly/NoHistory/TruthOracle retained; no universal formation law.', 'docs/planning/ATTACHMENT_DEPENDENCE_READINESS.md': 'Prospective dependence beyond familiarity/reliability/positive valence. Requires matched benefits/self-sufficiency, alternative and no-demand controls, distinct history/person/availability/appraisal. Unmet practical goal not automatically distress. Accepted finite source/consumer avoids new Need/causal box; broader formation unresolved.', 'docs/planning/CAMPAIGN3_ATTACHMENT_QUALIFICATION.md': 'VER-C3-ATTACHMENT-001:6 models25 runs200 prefixes175 advancing25 terminal;23/328 tests/build historical. Two versus one meaningful support gives Bond1 versus1/2 with equal relief1. Adequate alternative or no demand removes utility but not missing-contact, prospective7/9 versus1/2. Self-sufficiency/incidental support defeats DependenceHistory but PositiveHistory counts. Later failure gives mean2/3 versus1/2, Bond persistence candidate only. No enacted care/search, distress/grief or clinical claim.', 'docs/planning/ATTACHMENT_IMPLEMENTATION_FINDINGS.md': 'First23 tests/build pass. Preserve EXP001 reliable-satisfier precedent and BELIEF equal-weight mean/sample-count resistance; not full historical Need precision/decay port. Two-episode scaling experimental, no universal attachment primitive necessity. Admitted inability not hidden capacity. History count0 not negative relationship observation; missing presence unknown. CurrentUtility omits target feasibility; prospective probe not execution plan.', 'docs/planning/ATTACHMENT_PUBLIC_PLAN_REV1.json': 'Prospective25 unique original runs/six models, exact ExperimentIdentity/ComparisonCase and contract/source/test bindings.32-byte seed13 no draws. Controlled episode facts can be mistaken; no chosen caregiving/goal execution source.', 'docs/planning/ATTACHMENT_PUBLIC_RESULT_REV1.json': 'Complete25-row200-prefix aggregate from four workers. Fresh decoded stored assertions verify dependence versus benefits/utility, witness/target specificity, missing versus zero, mean contradiction resistance and whole later privacy.175 advances25 terminal historical, not new scheduler replay.', 'docs/planning/ATTACHMENT_CLOSURE_REV1.json': 'Original closure freshly authenticates model/source/allocation/plan/result/workers, preservation and23/328 tests/build. Records1250..1263 namespace1180;1263/0 historical. Integrity check not fresh200 restores or fault tests.', 'docs/planning/ATTACHMENT_PRESERVATION_REV1.json': 'Exact references bind original passing tests, semantic findings and model evidence; no failed new cohort overwritten. Prior RELATIONSHIP/BELIEF/RELIANCE/FAMILIAR_VALENCE remain distinct; no replacement of older learning/attachment-like controls.', 'docs/planning/ATTACHMENT_TESTS_REV1.json': 'Historical23 initial PASS:13 stages plus commit during acquired-state updates, actual phases, ownership/foreign-target and malformed input/save/handles. Finite prospective response scope, no fresh suite execution.', 'docs/planning/ATTACHMENT_REFERENCE_TESTS_REV1.json': 'Historical328 reference assertions PASS. Names/paths/timing backing to reviewed mechanisms, not new attachment findings or fresh suite execution.', 'docs/planning/ATTACHMENT_BUILD_REV1.json': 'Historical final build PASS with exact source artifacts authenticated, not fresh build or full active-suite claim.', 'docs/planning/attachment-public-workers-rev1/0.json': 'Worker partition0: modulo4 roster, original identities, output/two observer-view hashes and aggregate authenticated. Fresh25 stored-view original assertions preserve matched relief/history/alternatives and later whole-view privacy;200 prefixes remain historical, not new replay.', 'docs/planning/attachment-public-workers-rev1/1.json': 'Worker partition1: modulo4 roster, original identities, output/two observer-view hashes and aggregate authenticated. Fresh25 stored-view original assertions preserve matched relief/history/alternatives and later whole-view privacy;200 prefixes remain historical, not new replay.', 'docs/planning/attachment-public-workers-rev1/2.json': 'Worker partition2: modulo4 roster, original identities, output/two observer-view hashes and aggregate authenticated. Fresh25 stored-view original assertions preserve matched relief/history/alternatives and later whole-view privacy;200 prefixes remain historical, not new replay.', 'docs/planning/attachment-public-workers-rev1/3.json': 'Worker partition3: modulo4 roster, original identities, output/two observer-view hashes and aggregate authenticated. Fresh25 stored-view original assertions preserve matched relief/history/alternatives and later whole-view privacy;200 prefixes remain historical, not new replay.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'ATTACHMENT_CLOSURE_REV1.json'),ref('scripts/qualify-attachment-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ATTACHMENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'ATTACHMENT_PUBLIC_RESULT_REV1.json');plan=load(P/'ATTACHMENT_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'ATTACHMENT_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==25 and sum(r['prefixes'] for r in v['results'])==200
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('ATTACHMENT_TESTS_REV1.json',23),('ATTACHMENT_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'ATTACHMENT_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'ATTACHMENT_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-011','RO-C3-016','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FIFTEEN ATTACHMENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh25 stored-view contrasts, not25-run/200-prefix runtime replay or23/328 tests/build.','Two-episode Bond scaling is candidate, not universal formation law or necessary primitive.','Retain reliable-satisfier/evidence-mean comparators; no full historical Need precision/decay port.','Controlled perceived dependence, not hidden causal necessity; prospective probes not distress/grief/search/care execution.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

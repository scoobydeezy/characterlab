from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-substitution-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/DEPENDENCE_SUBSTITUTES_CONTRACT.md': 'Accepted0.2 component: one common relief task, A/B or no choice; exogenous opportunity demand, not physiological Need. Expected relief and cue history independently admit options, expected relief supplies actual reason. NoActiveReasons has no chosen idle/action. Latest/Mean/ExpectationOnly/HistoryOnly/NoLearning preserve different roles. Component atomic saves not public admission.', 'docs/planning/DEPENDENCE_SUBSTITUTES_READINESS.md': 'Prospective actual acquisition/choice/delivery of alternative, not ATTACHMENT prospective alternative Boolean or HABIT target/idle renamed. Equal total training/current demand with repertoire contrast; unknown/known failure/opportunity separate. Serious expectation-only comparator, no authored dependence trait.', 'docs/planning/CAMPAIGN3_SUBSTITUTION_QUALIFICATION.md': 'VER-C3-SUBSTITUTION-001:5 models29 runs261 component prefixes232 advancing29 terminal;15/328 tests/build historical. Four equally successful A-only versus A/B practices; removeA leaves three unserved versus three actual B deliveries, totals4/7. ExpectationOnly explains primary action contrast. After zero correction history changes candidate sets but both NoActiveReasons, not downstream behavior. No physiological/clinical dependence.', 'docs/planning/SUBSTITUTION_IMPLEMENTATION_FINDINGS.md': 'Two preserved pre-freeze failures: all15 adapter-assumed chosen idle; then11pass4fail three-option domain. Respect no-choice and narrowA/B before freeze, no broadened inherited kernel. Equal latest estimates not equal sample journals. Mean4/5 vsLatest0 after contrary report. HABIT neutral choice remains separate, not replaced. Exogenous demand/world unserved not chronic deficit.', 'docs/planning/SUBSTITUTION_PLAN_REV1.json': 'Five frozen models29 unique identities bind exact canonical task/actions/source/seed/dice/arbitration and all originals before experiment. Development corrections precede freeze; no prior model overwritten.', 'docs/planning/SUBSTITUTION_RESULT_REV1.json': '29 original rows261 canonical component saves and successors. Fresh runtime replay verifies exact identities/result/view/prefix hashes and original semantic assertions, not public scheduler.', 'docs/planning/SUBSTITUTION_VIEWS_REV1.json': 'Complete29 snapshots/safe views retain equal-total-training substitution, acquired candidates versus reasons, actual delivery and named false/denied evidence privacy. Corrected same estimates do not imply identical full evidence journals. Fresh replay exact.', 'docs/planning/SUBSTITUTION_CLOSURE_REV1.json': 'Fresh original closure verifies model/run/plan/results/artifacts and preserved failures.1400/0 no allocation. Component transactions not public queue/source/authority admission.', 'docs/planning/SUBSTITUTION_PRESERVATION_REV1.json': 'Five artifacts and nested development archives preserve both failed cohorts and findings. Initial sandbox startup ran no scientific tests; no public/frozen rejected cohort erased.', 'docs/planning/SUBSTITUTION_DEVELOPMENT_FINDING_REV1.json': 'All15 tests failed on chosenData because NoActiveReasons is not a chosen idle. Correct adapter to no intent/attempt/execution, retain candidates; do not invent motive. Exact four source/contract/test artifacts retained before freeze.', 'docs/planning/SUBSTITUTION_DEVELOPMENT_FINDING_REV2.json': 'Eleven passed/four failed: A/B/idle exceeds accepted two-option arbitration, before injected faults. Narrow finite scope toA/B or no choice; independent abstention/activity remains unqualified, not dispensable. Three exact archives retained.', 'docs/planning/SUBSTITUTION_TESTS_REV1.json': 'Historical0pass15fail no-reason adapter assumption; all failures preserved, not psychological candidate falsification.', 'docs/planning/SUBSTITUTION_TESTS_REV2.json': 'Historical11pass4fail inherited option-domain violation; failed rollback tests had not reached intended fault. Scope correction precedes freeze.', 'docs/planning/SUBSTITUTION_TESTS_REV3.json': 'Final15 individually passing assertions include both fault boundaries/staged RNG exact retry, all-candidate component prefixes, ingress/getter/tamper/seed/original rejection and scientific comparisons; not fresh suite.', 'docs/planning/SUBSTITUTION_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing not fresh tests/new law.', 'docs/planning/SUBSTITUTION_BUILD_REV1.json': 'Historical final build PASS exact artifact hashes; not fresh build/full active suite.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref(P/'SUBSTITUTION_CLOSURE_REV1.json'),ref('scripts/qualify-substitution.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SUBSTITUTION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'SUBSTITUTION_RESULT_REV1.json');plan=load(P/'SUBSTITUTION_PLAN_REV1.json')
assert v['planSha256']==ref(P/'SUBSTITUTION_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==29 and sum(len(r['prefixHashes']) for r in v['results'])==261
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('SUBSTITUTION_TESTS_REV3.json',15),('SUBSTITUTION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for n in ['SUBSTITUTION_BUILD_REV1.json','SUBSTITUTION_PRESERVATION_REV1.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
assert load(O/'replay-check.json')['prefixes']==261
for n,passed,failed in [('SUBSTITUTION_TESTS_REV1.json',0,15),('SUBSTITUTION_TESTS_REV2.json',11,4)]:
 t=load(P/n);assert not t['success'] and t['numPassedTests']==passed and t['numFailedTests']==failed
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert sum(a['status']=='failed' for a in leaves)==failed
for n in ['SUBSTITUTION_DEVELOPMENT_FINDING_REV1.json','SUBSTITUTION_DEVELOPMENT_FINDING_REV2.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/finding','/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='SIXTEEN SUBSTITUTION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh29 trajectories/261 component canonical saves, not public scheduler or15/328 test/build rerun.','ExpectationOnly explains primary substitution; zero-correction history contrast only candidates, both no-action.','Equal resolved latest estimates not equal evidence journals; mean/latest both retained.','Two-option/no-choice scope preserves failures and HABIT neutral-choice alternative; no general abstention reduction, physiology or clinical dependence.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-reinforcement-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/REINFORCEMENT_FEEDBACK_EXPERIMENT_CONTRACT.md': 'Accepted experiment0.1 reuses substitution0.2 unchanged: action gates own admitted sample, expectation changes later reasons/action. All seeds0..7 full/withheld retained. Fixed positive objective reward, no extra habit die; actual divergence required, not monotonic count or rising reward claim. Existing identity/body loops distinct.', 'docs/planning/REINFORCEMENT_ESCALATION_READINESS.md': 'Prospective measurable feedback claim, not habit scalar renamed escalation. Broken feedback at matched opportunities, belief/history/exposure/identity separate. Preserve neutral NoActiveReasons policy; tolerance/withdrawal/craving/addiction remain separate.', 'docs/planning/CAMPAIGN3_REINFORCEMENT_QUALIFICATION.md': 'VER-C3-REINFORCEMENT-001:5 exactly reused models31 new runs279 component prefixes248 advancing31 terminal;8/328 tests/build historical. Seed2 first choice/expression equal then meanA2/3 versus withheld1/2 changes later selection; fullAAAAA versusABAAA. Six seed pairs diverge,0/1equal; equal aggregate counts possible. Not population rate or inevitable lock-in.', 'docs/planning/REINFORCEMENT_FINDINGS.md': 'Receipt withholding changes both belief and performed history; primary mean comparison expectation-mediated with both options positive, not isolated habit cause. Latest already1 after practice, constant success does not strengthen further. Rational rise can plateau in die brackets; counts not necessarily monotone. Controlled negative prior not discovered distribution/trait. Five production identities/source bytes unchanged.', 'docs/planning/REINFORCEMENT_PLAN_REV1.json': '31 unique original identities, all8 paired seeds plus four other candidates at2 and seven controls. Five models exactly same as substitution. New experiment content/source/seed commitments, not new production model.', 'docs/planning/REINFORCEMENT_RESULT_REV1.json': '31 original rows279 canonical saves, six divergent seed pairs2..7 and zero new models. Fresh all-seed replay exactly matches identities/results/views and original semantic assertions; no public scheduler qualification.', 'docs/planning/REINFORCEMENT_VIEWS_REV1.json': 'Complete31 snapshots/safe views preserve first-resolution equality, conditional later belief/choice, physical versus learned outcome and safe false/denied pairs. Fresh replay exact; success does not backwrite expression.', 'docs/planning/REINFORCEMENT_EXPLORATION_REV1.json': 'Complete exploratory full/withheld seeds0..7 retained before freeze, not favorable-seed selection. Exploratory intents/estimates checked against final MeanHistory cohort; not additional independent coverage.', 'docs/planning/REINFORCEMENT_CLOSURE_REV1.json': 'Fresh original closure verifies31 rows279 prefixes, exact reused model IDs, all artifact/test/build hashes and named safe privacy.1400/0 component scope; no new public save/source API.', 'docs/planning/REINFORCEMENT_TESTS_REV1.json': 'Historical8 individually passed scoped assertions; first scientific cohort passed, no rejection omitted. Prior substitution failures preserved; not freshly executed tests.', 'docs/planning/REINFORCEMENT_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing, not new reinforcement findings/fresh suite.', 'docs/planning/REINFORCEMENT_BUILD_REV1.json': 'Historical production build PASS exact artifacts, not fresh build/full active suite.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref(P/'REINFORCEMENT_CLOSURE_REV1.json'),ref('scripts/qualify-reinforcement.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='REINFORCEMENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'REINFORCEMENT_RESULT_REV1.json');plan=load(P/'REINFORCEMENT_PLAN_REV1.json')
assert v['planSha256']==ref(P/'REINFORCEMENT_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==31 and sum(len(r['prefixHashes']) for r in v['results'])==279
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','seed','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('REINFORCEMENT_TESTS_REV1.json',8),('REINFORCEMENT_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for n in ['REINFORCEMENT_BUILD_REV1.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
assert load(O/'replay-check.json')['prefixes']==279
assert plan['models']==load(P/'SUBSTITUTION_PLAN_REV1.json')['models']
assert v['newModels']==0 and v['divergedSeeds']==[2,3,4,5,6,7]
e=load(P/'REINFORCEMENT_EXPLORATION_REV1.json');views=load(P/'REINFORCEMENT_VIEWS_REV1.json')['views']
assert len(e['rows'])==16 and {(r['seed'],r['name']) for r in e['rows']}=={(i,n) for i in range(8) for n in ['full','withheld']}
for r in e['rows']:
 x=next(v for v in views if v['law']=='MeanHistory' and v['seed']==r['seed'] and v['name']==r['name'])['snapshot']
 assert r['intents']==[v['intent'] for v in x['rows']]
 assert r['estimates']==[v['beliefBefore'] for v in x['rows']]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWELVE REINFORCEMENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh31 trajectories/279 exact component saves, not public scheduler or8/328 tests/build rerun.','Six divergent pairs/two equal and possible equal aggregate counts, not population rate or inevitable monotonic repetition.','Receipt withholding changes belief and history; primary route expectation-mediated, not isolated habit necessity.','Fixed physical reward, controlled prior and uncalibrated accumulation; no dose escalation, physiological dependence or universal reinforcement law.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

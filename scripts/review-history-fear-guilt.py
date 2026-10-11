from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-fear-guilt-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/FEAR_GUILT_PUBLIC_CONTRACT.md':'Accepted fear-guilt-public/0.1: hidden wrongdoing, controlled private threat, produced nervousness, admitted observer context, retained latest channels, attribution40 and goal-relative appraisal50 separate. Four laws/five models, one authored incident, no draws or chosen action. ContextOdds exact weights are experimental, not calibrated causal likelihoods. Missing all channels unknown; repeated probes do not multiply support. Only learning140 writes each holder leaf. No guilt emotion, moral identity, trust, causal discovery or general recognition.',
'docs/planning/FEAR_GUILT_ATTRIBUTION_READINESS.md':'Proposal requires innocent fear, alternative explanation and whole later privacy views. Wrong inference can respect evidence boundary; accurate truth Oracle violates it. Accepted contract narrows consumer to appraisal, not action, and supplies event grouping by controlled keys. This is not proof of natural segmentation or learned causes.',
'docs/planning/CAMPAIGN3_FEAR_GUILT_QUALIFICATION.md':'VER-C3-FEAR-GUILT-001:5 models19 runs95 prefixes76 advance19 terminal;21/328 tests/build historical. ContextOdds unknown,3/4,3/8,3/4; uninformed observer15/16. CueOnly stays3/4, explicit alternative context changes support without revealing truth. Goal-only changes3/8 to5/8 appraisal, not attribution. Whole later equalities include hidden truth, equal-display private cause, nonrecipient and denied cue changes. No calibration, guilt emotion or action claim.',
'docs/planning/FEAR_GUILT_DEVELOPMENT_FINDINGS.md':'Preserve20 seed-length failures before settlement, then15 pass/5 test-helper failures and TypeScript rejection. Corrected20 pass; final21 adds malformed model/foreign evidence/input order test. No failed public experiment overwritten. Production handler body unchanged; archived/current runtime differs only unused imports/helper cleanup. Both contain inaccurate0.2 ordinary-planning header; executable imported VERSION and contract are0.1, with no planning/choice stages. Header is not authority.',
'docs/planning/FEAR_GUILT_PUBLIC_PLAN_REV1.json':'Prospective19 distinct run/five model identities, original ExperimentIdentity/ComparisonCase,32-byte seed13 and all frozen source bindings. No random draws. Authored target/incident keys group admitted context; grouping itself is not inferred responsibility or recognition.',
'docs/planning/FEAR_GUILT_PUBLIC_RESULT_REV1.json':'Complete19-row95-prefix aggregate matches four disjoint worker partitions. All stored outputs/views freshly decoded and original contrasts executed; historical76 advances19 terminal not rerun. ContextOdds/CueOnly/NoLearning/TruthOracle and goal-only control remain distinct.',
'docs/planning/FEAR_GUILT_CLOSURE_REV1.json':'Original closure freshly validates all source/model/allocation bindings, worker hashes and aggregate, preserved failures and21/328 tests/build. Records1165..1177 namespace1174;1177/0 historical. Integrity check is not fresh behavioral replay.',
'docs/planning/FEAR_GUILT_PRESERVATION_REV1.json':'Six exact artifacts preserve original seed/test/runtime and failed tests/build. Seed and field helper construction failures do not falsify psychological candidates. Unused runtime cleanup does not change handler body; misleading copied runtime version/planning comment remains frozen and explicitly superseded by model VERSION/formal contract.',
'docs/planning/FEAR_GUILT_TESTS_REV1.json':'All20 historical tests fail before settlement with seed must be exactly32 bytes. No public plan/run freeze yet. Not20 psychological counterexamples; preserves construction failure.',
'docs/planning/FEAR_GUILT_TESTS_REV2.json':'Historical15 passed/5 failed: test field helper calls dataRecord without required type, requires undefined/1. Not inference-law failure. Exact failed source and TypeScript rejection retained.',
'docs/planning/FEAR_GUILT_TESTS_REV3.json':'Historical20 passed after fixture/helper correction; intermediate suite, not additional20 independent tests beyond final21. No runtime mechanism change.',
'docs/planning/FEAR_GUILT_TESTS_REV4.json':'Final historical21 passed, including all12 phases plus commit rollback, immutable judgments and later evidence, privacy/ownership, save/handle/input/model admission. Adds one malformed-model/foreign-evidence/input-order regression over prior20. Not freshly rerun.',
'docs/planning/FEAR_GUILT_REFERENCE_TESTS_REV1.json':'Historical328 passed assertions. Labels, paths and timing backing, not new fear/guilt findings; not fresh suite execution.',
'docs/planning/FEAR_GUILT_BUILD_REV1.json':'Historical TypeScript FAIL for missing dataRecord type argument in test helper. Preserve separately from runtime semantics and later build PASS.',
'docs/planning/FEAR_GUILT_BUILD_REV2.json':'Historical final PASS for boundary check, TypeScript and Vite, with seven exact source artifacts authenticated. Not a fresh build.'}
for i in range(4):specs[f'docs/planning/fearGuilt-public-workers-rev1/{i}.json']=f'Worker partition{i}: exact modulo4 membership, unique identities and aggregate; stored researcher outputs/two recipient views match original hashes. Fresh decode and original contrasts across all19 cases; no scheduler rerun or new95-prefix replay. Actual odds/appraisal values and later whole-view equalities checked, not inferred from labels.'
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'FEAR_GUILT_CLOSURE_REV1.json'),ref('scripts/qualify-fear-guilt-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='FEAR/GUILT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'FEAR_GUILT_PUBLIC_RESULT_REV1.json');plan=load(P/'FEAR_GUILT_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'FEAR_GUILT_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==19 and sum(r['prefixes'] for r in v['results'])==95
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('FEAR_GUILT_TESTS_REV4.json',21),('FEAR_GUILT_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for i,(passed,failed) in enumerate([(0,20),(15,5),(20,0)],1):
 t=load(P/f'FEAR_GUILT_TESTS_REV{i}.json');assert t['numPassedTests']==passed and t['numFailedTests']==failed
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==20
 failures=[a for a in leaves if a['status']=='failed'];assert len(failures)==failed
 if failed:assert all(('run seed must be exactly 32 bytes' if i==1 else 'requires undefined/1') in a['failureMessages'][0] for a in failures)
for n in ['FEAR_GUILT_PRESERVATION_REV1.json','FEAR_GUILT_BUILD_REV2.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
old=(P/'fear-guilt-development-rev1/fearGuiltRuntime.ts').read_text();new=Path('src/campaign3/fearGuiltRuntime.ts').read_text()
assert old[old.index('export function createFearGuiltRuntime'):]==new[new.index('export function createFearGuiltRuntime'):]
assert old.splitlines()[0]==new.splitlines()[0] and '0.2-candidate' in new.splitlines()[0]
assert "VERSION='fear-guilt-public/0.1-candidate'" in Path('src/campaign3/fearGuiltModel.ts').read_text()
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
v=dict(status='NINETEEN FEAR/GUILT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh19 stored-view contrasts, not19-run/95-prefix runtime replay or21/328 tests/build.','ContextOdds weights are arbitrary experimental candidates, not calibrated guilt probability or learned causal likelihood.','Private fear source controlled; no guilt emotion, chosen action, moral identity or natural incident segmentation.','Frozen runtime header0.2/planning is inaccurate; executable VERSION and formal authority remain0.1.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

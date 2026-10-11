from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-intention-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/INTENTION_FORGETTING_COMPONENT_CONTRACT.md': 'Accepted component0.1: goal adoption separate from sole retained route operand, no archive reconstruction. Existing significance-first capacity1/2 with empty protection and exact top-K K1/empty graph; present zero-score selection allowed, absent cue unavailable. Reminder has no action payload; only recalled instruction supplies action. Auto exact reason consumer, no draw. Component reexecution not public scheduler/save admission.', 'docs/planning/INTENTION_FORGETTING_READINESS.md': 'Prospective distinction retained-inaccessible versus truly lost instruction, reminders and actual A/B actions; cancellation/expiry/opportunity/execution separate. Reuse accepted memory mechanisms before parallel store; no invented forgetting law.', 'docs/planning/CAMPAIGN3_INTENTION_QUALIFICATION.md': 'VER-C3-INTENTION-001:3 models54 distinct runs486 component prefixes;15/328 tests/build historical. Main recalledA acts5, B control actsB. Capacity1 loses route not goal, expires7; NoLoss recovers, PersistentAccess acts3 without reminder but cannot recover erased content. Wrong present cue can recall sole instruction at zero score; noNeutral acts3. Component only, no public save/source authentication.', 'docs/planning/INTENTION_IMPLEMENTATION_FINDINGS.md': 'Preserve14-pass1-fail test assumption about noNeutral action5; actual top-K selects3 then fulfilled. No positive-score cutoff introduced. First TS inference build failure, interrupted inefficient tests and local efficiency fixes distinct. First54/486 behavioral PASS had insufficient direct resolved configuration identity binding; corrected content operands change identity while all behavior hashes match.', 'docs/planning/INTENTION_PLAN_REV1.json': 'Superseded original plan committed source but not directly resolved inherited task/actions/dice/calibration; behavioral cohort complete but insufficient identity for closure. Preserved not additive coverage.', 'docs/planning/INTENTION_PLAN_REV2.json': 'Corrected54 unique run identities/3 models with exact canonical content and source/experiment/comparison commitments before rerun. Inputs/laws preserve original behavior; no new psychological law.', 'docs/planning/INTENTION_RESULT_REV1.json': 'Completed superseded54 runs486 component prefixes. Behavior PASS does not cure inadequate content identity. Final/safe/prefix hashes exactly equal corrected cohort, identities differ.', 'docs/planning/INTENTION_RESULT_REV2.json': 'Corrected54 rows with nine prefixes each, exact hashes. Fresh current component trajectories/prefixes compare original full/safe/state/world; not public runtime replay.', 'docs/planning/INTENTION_VIEWS_REV1.json': 'Full superseded component rows/world and safe projection preserved; same behavior as corrected identities. Not independent coverage.', 'docs/planning/INTENTION_VIEWS_REV2.json': 'Full corrected54 trajectories including retained memory/goal/access/world and safe rows/state. Fresh replay verifies bytes/semantics, no hidden-history recovery. Denied differing instructions and hidden execution/false receipt whole-safe controls retained.', 'docs/planning/INTENTION_CLOSURE_REV1.json': 'Original closure freshly authenticates corrected artifacts and old/new behavior equality,15/328 tests/build.1400/0 no records/namespace/root allocation. Component closure only.', 'docs/planning/INTENTION_PRESERVATION_REV1.json': 'Nineteen exact artifacts retain build/type failure, interrupted test/source, zero-score rejected expectation, identity correction and both complete cohorts. No rejected scientific finding discarded.', 'docs/planning/INTENTION_BUILD_FAILURE_REV1.json': 'TS7022/TS7006 loop inference failure before experiment freeze, exact rejected source retained; annotations repair typing, not psychological law.', 'docs/planning/INTENTION_INTERRUPTED_TESTS_REV1.json': 'Interrupted inefficient duplicate-prefix/config rebuild attempt; no PASS. Runtime/test sources preserved, not censored into success.', 'docs/planning/INTENTION_ZERO_SCORE_FINDING_REV1.json': 'Wrong present cue with sole instruction retrieves at zero score; acts3, so expected5 fails after fulfillment. Preserve existing top-K mathematics and absent-cue distinction; no unearned cutoff.', 'docs/planning/INTENTION_IDENTITY_FINDING_REV1.json': 'First experiment completed before interruption,54/486 retained; direct canonical resolved content binding missing. Corrected freeze and full rerun required; source-only identity not enough.', 'docs/planning/INTENTION_TESTS_REV2.json': 'Historical14 passed1 failed: wrong expected later action in noNeutral case. Failure is test assumption, not recall regression; exact rejected source retained.', 'docs/planning/INTENTION_TESTS_REV3.json': 'Final15 individually passed assertions; retention/access/actual action, lifecycle/opportunity/execution, privacy and component prefixes. No public scheduler rollback guarantee.', 'docs/planning/INTENTION_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing not new memory law or fresh test rerun.', 'docs/planning/INTENTION_BUILD_REV2.json': 'Final historical build PASS exact artifacts. No fresh build/full active-suite execution.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref(P/'INTENTION_CLOSURE_REV1.json'),ref('scripts/qualify-intention-forgetting.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='INTENTION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'INTENTION_RESULT_REV2.json');plan=load(P/'INTENTION_PLAN_REV2.json');old=load(P/'INTENTION_RESULT_REV1.json')
assert v['planSha256']==ref(P/'INTENTION_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==54 and sum(len(r['prefixHashes']) for r in v['results'])==486
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
 prior=next(x for x in old['results'] if (x['law'],x['name'])==(r['law'],r['name']))
 assert prior['modelIdentity']!=r['modelIdentity']
 for k in ['prefixHashes','finalSha256','safeSha256']:assert prior[k]==r[k]
for n,count in [('INTENTION_TESTS_REV3.json',15),('INTENTION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
t=load(P/'INTENTION_TESTS_REV2.json');assert not t['success'] and t['numPassedTests']==14 and t['numFailedTests']==1
for n in ['INTENTION_BUILD_REV2.json','INTENTION_PRESERVATION_REV1.json','INTENTION_IDENTITY_FINDING_REV1.json','INTENTION_ZERO_SCORE_FINDING_REV1.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
f=load(P/'INTENTION_BUILD_FAILURE_REV1.json');assert ref(f['source'])['sha256']==f['sha256']
assert load(O/'replay-check.json')['prefixes']==486
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/finding','/failure','/disposition','/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWENTY INTENTION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh54 component trajectories/486 exact prefixes, not public scheduler/source/save admission or15/328 test/build rerun.','Top-K zero-score recall with present cue differs from absent cue; no added cutoff.','Lost route content not lost adoption; no archive reconstruction, new memory law or general prospective-state reduction.','Superseded identity cohort and interrupted/failed development receipts preserved, not additive independent coverage.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

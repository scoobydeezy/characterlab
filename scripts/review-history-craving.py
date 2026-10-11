from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-craving-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/CRAVING_COMPONENT_CONTRACT.md': 'Accepted0.1 derives current urge from safe public EMB pressure and same-subject admitted relief reports. MeanProduct/MeanBottleneck/LatestProduct/NoLearning retained. Access, availability, restraint, eligibility and action separate. Report learning after appraisal; no persistent craving or new public scheduler.', 'docs/planning/CRAVING_READINESS.md': 'Physical absence/tolerance diagnostics not observer evidence. Distinguish admitted body, relief expectation, mental access, eligibility and actual action. No hidden adaptation shortcut or craving inferred merely from repeated choice.', 'docs/planning/CAMPAIGN3_CRAVING_QUALIFICATION.md': '4models56unique component runs60 comparisons300checks280distinct prefixes; separate5public BODY sources15prefixes. Subject464field2 observer label not general ObserverId conversion. Fixed cue/recall/restraint controls not learned association or earned control. Urge may persist without eligibility, no actual action.', 'docs/planning/CRAVING_FINDINGS.md': 'MeanProduct5/12 then1/4, Bottleneck1/2both, Latest5/6 then1/2 under same mixed reports. Hidden6/9 equal safe frames alias IDs, incorrect60unique assertion failed twice before plan/result. Correct56unique preserves60rows. No scientific trajectory discarded or case-label salt.', 'docs/planning/CRAVING_DEVELOPMENT_FINDING_REV1.json': 'Five exact archives preserve pre-freeze60expected56actual identity assertion failure. Equal safe inputs from distinct physical sources legitimately same component identity. No plan/result from rejected attempts; no production/test correction.', 'docs/planning/CRAVING_PLAN_REV1.json': 'Frozen4model56distinctIDs60comparisons bind exact body-source receipt/subject and original source artifacts. Historical embodiedRuntime differs from current repaired wrapper; exact preserved bytes authenticate old commitment, current source not relabeled.', 'docs/planning/CRAVING_RESULT_REV1.json': 'Full snapshots and5save hashes each for60rows,300checks280distinct. FalseReports changes original frames/run identity but whole safe view equals mixed. Hidden6/9 same componentID. Fresh replay required exact complete original result.', 'docs/planning/CRAVING_SOURCES_REV1.json': 'Five actual public BODY sources15prefixes with full saves/states/outputs/traces. Pressure and subject only pass to component. Current repaired runtime compatibility checked by exact full original source result equality, separately from historical artifact identity.', 'docs/planning/CRAVING_CLOSURE_REV1.json': 'Scoped historical closure rechecks all formulas and artifact bindings, resolving only runtime to exact authenticated wrapper archive. Original current-source closure rejected. No unconditional current-source historical-identity assertion.', 'docs/planning/CRAVING_TESTS_REV1.json': 'Seven historical individual passes, formulas/missingzero/truth/access/order/save/domain guards. No fresh test run; component replay separate.', 'docs/planning/CRAVING_REFERENCE_TESTS_REV1.json': 'Historical328 individual passes, not fresh active suite or general addiction evidence.', 'docs/planning/CRAVING_BUILD_REV1.json': 'Historical buildPASS exit0 and original artifacts authenticated. Current repaired runtime compatibility does not retroactively rebuild old source.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref(O/'current-source-finding.json'),ref('scripts/check-history-craving.mjs'),ref('scripts/check-history-craving-closure.mjs'),ref(P/'CRAVING_CLOSURE_REV1.json'),ref('scripts/qualify-craving.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='CRAVING AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'CRAVING_RESULT_REV1.json');plan=load(P/'CRAVING_PLAN_REV1.json')
assert v['planSha256']==ref(P/'CRAVING_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['comparisons'])==60 and len(plan['runs'])==56
assert sum(len(r['prefixHashes']) for r in v['results'])==300
assert len({(r['modelIdentity'],r['runIdentity'],i) for r in v['results'] for i in range(5)})==280
for r,p in zip(v['results'],plan['comparisons']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
for law in [m['law'] for m in plan['models']]:
 get=lambda name:next(r for r in v['results'] if r['law']==law and r['name']==name)
 assert get('hidden6')['runIdentity']==get('hidden9')['runIdentity']
 assert get('mixed')['snapshot']==get('falseReports')['snapshot']
 assert get('mixed')['runIdentity']!=get('falseReports')['runIdentity']
for n,count in [('CRAVING_TESTS_REV1.json',7),('CRAVING_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
archive=P/'public-wrapper-quiescence-rev1/src/campaign3/embodiedRuntime.ts'
for a in load(P/'CRAVING_BUILD_REV1.json')['artifacts']:
 assert ref(archive if a['path']=='src/campaign3/embodiedRuntime.ts' else a['path'])['sha256']==a['sha256']
preserved=[]
for a in load(P/'CRAVING_DEVELOPMENT_FINDING_REV1.json')['artifacts']:
 assert ref(a['preserved'])['sha256']==a['sha256'];preserved.append(ref(a['preserved']))
r=load(O/'replay-check.json');assert r['status']=='PASS' and r['prefixChecks']==300 and r['publicRuns']==5 and r['publicPrefixes']==15
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/finding'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWELVE CRAVING SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh component replay and exact current BODY compatibility; historical runtime commitment authenticated from archive, not current-source identity.','Historical7/328 tests/build not rerun.','300comparison checks280unique prefixes;5public BODY sources15prefixes separate.','Fixed cue/restraint not learned recognition/earned control/actual action; no joint public admission or universal craving law.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

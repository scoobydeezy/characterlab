from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-absence-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/ABSENCE_DEFICIT_CONTRACT.md': 'Accepted component0.1 compares exact acquired displacement against independently held physical baseline/support. R0=50 zero rate is source-checked. LinearGap gap/10, ThresholdGap deadband2, FixedReference ablates D. World-only diagnostic, no sensor/Need/action. Reference, displacement, state, gap and response separate.', 'docs/planning/ABSENCE_DEFICIT_READINESS.md': 'Prospective intake distinguishes unavailable satisfier, ordinary lack, expected relief, tolerance and acquired absence deficit. Zero exposure or displacement alone insufficient. Must compare naive/adapted under matched physical conditions without hidden-state motivation.', 'docs/planning/CAMPAIGN3_ABSENCE_DEFICIT_QUALIFICATION.md': 'VER-C3-ABSENCE-001 bounded3 component models27 composed runs135 historical comparisons108 advancing27 terminal,4 underlying public conditions. Matched absent level50 gives naive gap0/acquired gap4; support4 removes gap without erasingD. Not subjective distress, recovery or new public receiving scope.', 'docs/planning/ABSENCE_FINDINGS.md': 'Preserves wrong borrowed reference80 corrected50 before tests/freeze, then four scientific tests passed but test states array caused build TS7034/TS7005. Original plan unexecuted, successor typing-only correction. Ordinary baseline48 deficit without adaptation; spaced zero counts not recovery. Physical response not experienced distress.', 'docs/planning/ABSENCE_DEVELOPMENT_FINDING_REV1.json': 'Exact four draft archives preserve borrowed R0=80 mistaken source assumption. Caught before test/identity freeze, no failed scientific cohort or old model change. Correct harness checks actual source50/zero rate.', 'docs/planning/ABSENCE_BUILD_REV1.json': 'FAIL exit1 TS7034/TS7005 test array typing after4 tests pass; all frozen source archives authenticate. Correction Uint8Array[] affects test typing only. Failed build remains evidence; not runtime failure or discarded unfavorable run.', 'docs/planning/ABSENCE_PLAN_REV1.json': 'Frozen initial plan remained unexecuted after build failure. Preserved archive maps original artifact paths/hashes; cannot use as completed qualification or add runs to successor.', 'docs/planning/ABSENCE_TESTS_REV1.json': 'Four individually passing historical scientific tests before build failed; test success did not establish build readiness.', 'docs/planning/ABSENCE_PLAN_REV2.json': 'Successor freezes3 model27 distinct composed run identities, exact public model and source reference50. Four underlying public input/state conditions reused by independent laws/challenges. Typing-only source change reidentifies plan.', 'docs/planning/ABSENCE_RESULT_REV2.json': '27 rows with5 exact saves/snapshots/views each. Fresh original closure independently checks all physical formulas and identities;135 historical comparisons not135 unique public saves. No fresh trajectory replay here.', 'docs/planning/ABSENCE_CLOSURE_REV1.json': 'Fresh read-only checker authenticates sources, successor identities, independent exact arithmetic, both development archive cohorts and historical4/328 tests/build. No new scheduled consumer or receiving-horizon experiment.', 'docs/planning/ABSENCE_TESTS_REV2.json': 'Four individually passing corrected historical tests: exhaustive11 displacements21 baselines11 supports perlaw, invalid domains and public acquisition/key/otherleaf/support/deadband controls. No fresh test execution.', 'docs/planning/ABSENCE_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference tests, not fresh suite or general withdrawal evidence.', 'docs/planning/ABSENCE_BUILD_REV2.json': 'Historical successor build PASS exit0 authenticates frozen source artifacts after typing-only correction. No fresh build.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(P/'ABSENCE_CLOSURE_REV1.json'),ref('scripts/qualify-absence.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ABSENCE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'ABSENCE_RESULT_REV2.json');plan=load(P/'ABSENCE_PLAN_REV2.json')
assert v['planSha256']==ref(P/'ABSENCE_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==27 and sum(len(r['prefixHashes']) for r in v['results'])==135
assert len({(tuple(r['counts']),r['other']) for r in plan['runs']})==4
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('ABSENCE_TESTS_REV1.json',4),('ABSENCE_TESTS_REV2.json',4),('ABSENCE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'ABSENCE_BUILD_REV2.json')['artifacts']:assert ref(a['path'])==a
preserved=[]
for a in load(P/'ABSENCE_DEVELOPMENT_FINDING_REV1.json')['artifacts']:
 assert ref(a['preserved'])['sha256']==a['sha256'];preserved.append(ref(a['preserved']))
old=load(P/'ABSENCE_BUILD_REV1.json');assert old['status']=='FAIL' and old['exitCode']==1
assert any('TS7034' in d for d in old['diagnostics']) and any('TS7005' in d for d in old['diagnostics'])
for a in old['artifacts']:assert ref(a['path'])==a;preserved.append(a)
prior=load(P/'ABSENCE_PLAN_REV1.json')
for a in prior['artifacts']:
 matches=[x for x in preserved if x['path'].endswith('/'+a['path']) and x['sha256']==a['sha256']]
 assert matches,a['path']
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/finding','/diagnostics','/disposition'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FOURTEEN ABSENCE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh original closure and independent rational arithmetic; no fresh runtime/tests/build.','27 composed cases135 comparisons reuse4 public conditions.','Wrong-reference draft and failed typing build preserved; initial plan unexecuted.','World-only discrepancy index not subjective distress, Need, craving, recovery or compensatory action.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

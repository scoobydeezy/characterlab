from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-tolerance-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/TOLERANCE_EFFECT_CONTRACT.md': 'Accepted component0.1 world-only challenge of exact public ADAPT tolerance key. Reciprocal d/(1+t), Linear d*(10-t)/10, Unattenuated d; replenish capacity10 separates potential/applied/overflow. Challenge neither creates exposure nor feeds public state/cognition. Four authored exposures, absent key0, other leaves excluded. No sensor/recovery/compensation law.', 'docs/planning/TOLERANCE_READINESS.md': 'Prospective distinguish actual attenuated same-stimulus effect from tolerance state updates, altered motivation or reserve saturation. Existing ADAPT membership not automatic addiction coverage. Scope physical versus perceived/compensatory must be explicit.', 'docs/planning/CAMPAIGN3_TOLERANCE_QUALIFICATION.md': 'VER-C3-TOLERANCE-001:3 component models18 composed runs90 comparisons72 advancing18 terminal from4 public input/state conditions. At tolerance4 unit potential1/5,3/5,1; full reserve applied0all despite unequal potential/overflow. Four/328 tests/build historical. No18 new public models or90 unique public prefixes, no fresh receiving-horizon experiment.', 'docs/planning/TOLERANCE_FINDINGS.md': 'Coverage gap: ADAPT updates tolerance but prior R0+D probe ignores it; state-update qualification valid, effect qualification missing then. New offline consumer supplies effect, not public transition. Count0 preserves equal topology/naive; spaced counts preserve adaptation without recovery. Satiation can mask efficacy, other key/leaves isolate tolerance. No new failed cohort.', 'docs/planning/TOLERANCE_PLAN_REV1.json': '3 component identities18 unique composed runs bind underlying publicModel/source law/content and challenge/state/input separately. Only4 distinct public state/input conditions; law/key/reserve can reuse them. Freeze before qualification.', 'docs/planning/TOLERANCE_RESULT_REV1.json': '18 rows each5 original save/snapshot hashes and exact world challenge results. Original closure freshly verifies all rational outputs against independent formula and stored conditions; not fresh public replay.90 historical comparisons not90 distinct public source saves.', 'docs/planning/TOLERANCE_CLOSURE_REV1.json': 'Fresh original closure validates identities/artifacts, all arithmetic and4/328 tests/build.1400/0 no new allocation. Component challenge on completed public prefixes, not new scheduled effect/source admission.', 'docs/planning/TOLERANCE_TESTS_REV1.json': 'Historical4 individually passing tests include independent exact all11 magnitudes/all11 integer doses for eachlaw, invalid domain and public exposure/key/otherleaf/saturation controls. No fresh suite.', 'docs/planning/TOLERANCE_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference tests; metadata backing not new physical efficacy claim or fresh run.', 'docs/planning/TOLERANCE_BUILD_REV1.json': 'Historical build PASS exit0 with exact artifacts; not fresh build/full active suite.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(P/'TOLERANCE_CLOSURE_REV1.json'),ref('scripts/qualify-tolerance.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='TOLERANCE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'TOLERANCE_RESULT_REV1.json');plan=load(P/'TOLERANCE_PLAN_REV1.json')
assert v['planSha256']==ref(P/'TOLERANCE_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==18 and sum(len(r['prefixHashes']) for r in v['results'])==90
assert len({(tuple(r['counts']),r['other']) for r in plan['runs']})==4
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('TOLERANCE_TESTS_REV1.json',4),('TOLERANCE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'TOLERANCE_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TEN TOLERANCE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh original closure/independent challenge arithmetic, not public replay or4/328 test/build rerun.','18 composed cases/90 comparisons reuse4 public input/state conditions, not new public source coverage.','Offline world effect not scheduled transition/sensor/cognition; prior displacement probe not tolerance consumer.','Saturation masks potential; no universal attenuation, recovery, perceived tolerance or compensatory action.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

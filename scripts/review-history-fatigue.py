from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-fatigue-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/FATIGUE_PUBLIC_CONTRACT.md': 'Accepted fatigue-public0.1: physical grade, gated fallible sensor, retained experienced grade and independent control-effectiveness gate. Not occupying card. SevereThreshold/NoFatigue/MotorOnly/AnyFatigue retained; executor alone may read physical grade in MotorOnly. Unknown flag distinct from diagnostic0. Learning140 affects next40. Closed four-candidate allowlist, inherited unreachable fifth branch excluded.', 'docs/planning/COGNITIVE_FATIGUE_READINESS.md': 'Prospective Brief12.6-7 separates lawful capability, admitted experience, workload, retained goal/history and actual consumer. Authored source only earns bounded source effects, not endogenous accumulation/metabolism/recovery. No universal willpower/resource ontology.', 'docs/planning/CAMPAIGN3_FATIGUE_QUALIFICATION.md': 'VER-C3-FATIGUE-001:4 models20 unique runs180 prefixes160 advancing20 terminal;25/328 tests/build historical. Severe experience impairs5..7 under fixed goal/load/history; physical recovery6 behind missing sensor does not clear experience, admitted rest7 restores8. Actual choice/execution retained. MotorOnly same intent/expression but failed forced execution; later legitimate outcome history may differ. Nine control clauses separately bounded, not joint integration.', 'docs/planning/FATIGUE_IMPLEMENTATION_FINDINGS.md': 'First cohorts pass; duplicate identity rejected before freeze preserves prior rumination lesson. Sensor-mediated witness not all physiological impairment requiring awareness; false recovery not clinical treatment claim. Fatigue versus card may match behavior without common resource currency. Motor challenge history equality does not extend after distinct visible outcomes. Closed1..4 profile excludes inherited unreachable candidate5.', 'docs/planning/FATIGUE_PUBLIC_PLAN_REV1.json': 'Four frozen models20 unique canonical runs, original inputs and exact source/experiment/comparison commitments. Pre-freeze duplicate rejection, no alteration of rumination cohort. Controlled physical/sensor grades, not natural physiology.', 'docs/planning/FATIGUE_PUBLIC_RESULT_REV1.json': 'All20 rows180 historical prefixes hash-bound to plan. Fresh original stored assertions verify onset/persistence/recovery, mild threshold difference, external-load equivalence, stable primary journals, unknown/rested, real action and motor contrast. No fresh runtime replay.', 'docs/planning/FATIGUE_PUBLIC_VIEWS_REV1.json': 'Twenty keyed full output/single-observer views authenticated. False severe/recovery reports yield same safe views as equal admitted grades despite changed truth; hidden reward and denied/absent sensor equal. MotorOnly visible execution consequences legitimately differ; not cognitive truth leak.', 'docs/planning/FATIGUE_CLOSURE_REV1.json': 'Original closure freshly passes source/model/allocation/result/view/preservation hashes.1332..1352 inherited namespace1155;1352/0 historical. Integrity validation not fresh restores or tests.', 'docs/planning/FATIGUE_PRESERVATION_REV1.json': 'Three exact artifacts preserve passing tests, experienced/physical and control/motor distinctions and frozen model. CONTROL/SKILL/BODY/RUMINATION retain separate scopes; no historical reduction.', 'docs/planning/FATIGUE_TESTS_REV1.json': 'Historical25 passing assertions including15 stages+commit rollback after acquired history; phases/lag, malformed grade/authority/initial handle/save/original negatives. Not fresh execution.', 'docs/planning/FATIGUE_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing, not fresh tests or new fatigue claims.', 'docs/planning/FATIGUE_BUILD_REV1.json': 'Historical production build PASS and exact artifact hashes; not fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'FATIGUE_CLOSURE_REV1.json'),ref('scripts/qualify-fatigue-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='FATIGUE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'FATIGUE_PUBLIC_RESULT_REV1.json');plan=load(P/'FATIGUE_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'FATIGUE_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==20 and sum(r['prefixes'] for r in v['results'])==180
for i,r in enumerate(v['results']):
 assert set(r)==set('candidate law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('FATIGUE_TESTS_REV1.json',25),('FATIGUE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'FATIGUE_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'FATIGUE_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-011','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWELVE FATIGUE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh20 stored views, not180 runtime prefixes or25/328 tests/build.','Sensor-mediated experienced fatigue, not endogenous accumulation/recovery or all physiological impairment requiring awareness.','MotorOnly physical execution path legitimate; history equality excludes later distinct admitted motor outcomes.','Matching fatigue/external-load behavior does not establish common resource law; unknown differs from rested grade0.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

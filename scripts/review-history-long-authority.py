from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-long-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'LONGITUDINAL_READINESS.md').as_posix():'Historical intake composes empty/zero biography,skill and relationship in one clock/state/scheduler. Full/Compact/EpisodicOnly/DestructiveSharedSlot hypotheses over finite retention horizon;no box reduction presumed. Existing identity/procedural/social owners remain distinct;character archive resurrection forbidden. Later0.2 qualification discharges bounded intake,not developmental/lifelong scope.',
'docs/formal/LONGITUDINAL_PUBLIC_CONTRACT.md':'Accepted0.1 predecessor remains failed effective-standing control. All source/ownership/retention constraints carried to0.2;old symmetric standing and unit1/4 do not establish selective behavioral influence.15old models remain replayable,not retroactively qualified.',
'docs/formal/LONGITUDINAL_PUBLIC_CONTRACT_REV2.md':'Accepted0.2:one actor,max16instants1..64. Signed alignment maps standing to opposite fixed meanings,unit1/16;no new identity law. Independent skill actual attempt/linear practice,event-sampled HalfAtGap and explicit interference;execution precedes140changes. Own-participant relationship summary independent of current claim. Recent episodes expire age>=4;Compact has no full journal sidecar,identity minimal contributions retained. Full/Compact future folds limited;diagnostic actual skill is not cognitive knowledge.',
(P/'CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md').as_posix():'VER-C3-LONG-001 bounded3family:15models/75files/29main+3probe runs/513prefixes,481advancing/32terminal;120affected/328reference historical tests. Acquired identity/skill/relationship coexist while episodes lost. Family-isolation exact;retained early practice vs removed practice differs after equal later reacquisition,distinct from rust/interference. Full/Compact learned projections and effective biography choices equal,accessible detail differs. Destructive shared slot failure does not forbid all physical shared storage. Research view includes actual skill;no self-belief/security/scalability/lifelong claim. Four exit-audit requirements remain binding,not discharged by registry.',
(P/'LONGITUDINAL_IMPLEMENTATION_FINDINGS.md').as_posix():'Preserve capacity2 adapter selected one task plus prediction;capacity3 corrects existing two-choice requirement. Nonzero acquired identity did not prove standing effect:symmetric matching/unit1/4 failed;separate0.2 alignment/unit1/16 successor. Original practice difficulty nondiscriminating;new frozen1/4 probes establish execution contrast. ObserverView actual competence is diagnostic only. Type annotation correction altered no executable semantics.',
(P/'LONGITUDINAL_WORKSPACE_CONSTRUCTION_FAILURE_REV1.json').as_posix():'96diagnostic construction rows retain zero identity under workspace-capacity mismatch. Settings/times/episode counts and rational objects are diagnostic backing,not qualified cohort or historical law failure. Capacity corrected before qualification.',
(P/'LONGITUDINAL_STANDING_FAILURE_REV1.json').as_posix():'Two preserved16-instant0.1 standing-on/off trajectories acquire identity but identical choice records. Exact models/S0/inputs/seeds/terminal hashes retained;both terminal saves freshly replay by original closure. Failure is matching/calibration,not absence of learning;later successor separate.',
(P/'LONGITUDINAL_PUBLIC_EXPERIMENT_PLAN_REV2.json').as_posix():'Frozen29run0.2 main plan binds15model freeze,exact input/seed and whole-prefix coverage. Isolation,retention/interference/order/false evidence/biography controls declared;finite experiment not whole Brief12.15.',
(P/'LONGITUDINAL_PUBLIC_EXPERIMENT_REV2.json').as_posix():'Merged29stored runs/462prefixes with11scientific gates,three exact part hashes and rows in plan order. Original comparator reproduces full receipt. Current views are research diagnostics;learned projection equality does not imply detail equivalence or safe cognition. No fresh main replay.',
(P/'LONGITUDINAL_EXECUTION_PROBE_PLAN_REV1.json').as_posix():'Prospective3run supplement changes final difficulty only to1/4;fresh-history control removes early practice only. Retained/rust originals equal;model law differs. Designed to distinguish actual execution/reacquisition after lost episodes,not rewrite nondiscriminating main matrix.',
(P/'LONGITUDINAL_EXECUTION_PROBE_REV1.json').as_posix():'Three stored execution probes/51prefixes:retained succeeds at17 before new practice140,rust/fresh fail;retained/fresh episodes gone at14;afterpractice skill1/2vs1/4. Original assertions reproduced;not fresh successor prefix replay.',
(P/'LONGITUDINAL_VALIDATION_CLOSURE_REV2.json').as_posix():'Original closure with exact9historical source scope reproduces;12new filename matches recorded separately after initial audit failure. Both old terminal saves replay fresh;32successor runs/513prefixes and120/328tests stored evidence. Source enumeration drift not historical qualification failure. Diagnostic/self-belief and long-horizon limits remain.'}
for i in range(3):specs[(P/f'LONGITUDINAL_PUBLIC_RUNS_REV2_PART{i}.json').as_posix()]='One frozen execution part of29run main matrix. Exact part hash/plan identity and complete row equality with merged receipt verified. Typed views/decisions/executions/prefix commitments are diagnostic evidence,not character observations or independent new findings.'

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='LONG AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check-rev2.json'),ref(O/'comparison-check.json'),ref(P/'LONGITUDINAL_VALIDATION_CLOSURE_REV2.json'),ref('docs/formal/LONGITUDINAL_PUBLIC_CONTRACT_REV2.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'LONGITUDINAL_PUBLIC_EXPERIMENT_REV2.json');assert v['runs']==len(v['results'])==29 and v['restores']==sum(len(r['prefixes']) for r in v['results'])==462
merged={r['name']:r for r in v['results']}
for part in v['parts']:
 assert ref(part['path'])['sha256']==part['sha256']
 for r in load(part['path'])['results']:assert r==merged[r['name']]
for r in v['results']:
 assert set(r)==set('name model prefixes views decisions executions terminalSaveSha256'.split())
 for x in r['views']:assert set(x)==set('at viewSha256 identity identityBytes skill skillBytes practiceCount relationshipBytes count rupture episodes detail person'.split())
 for x in r['decisions']:assert set(x)==set('at mode chosen effective expressionContext'.split())
 for x in r['executions']:assert set(x)=={'at','practiced','success'}
failed=load(P/'LONGITUDINAL_WORKSPACE_CONSTRUCTION_FAILURE_REV1.json');assert len(failed['rows'])==96 and all(r['identity']['numerator']=='0' for r in failed['rows'])
failed=load(P/'LONGITUDINAL_STANDING_FAILURE_REV1.json');assert len(failed['results'])==2 and failed['results'][0]['choices']==failed['results'][1]['choices']

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/restoreCoverage'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-009','RO-C3-013','RO-C3-016','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='FIFTEEN LONG SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Two predecessor terminal saves replay fresh;no full32run successor replay or fresh tests.','Full/Compact differ in accessible detail;equivalence concerns fixed learned projections/future folds and horizon.','Actual competence diagnostic is not self-belief or safe evidence;retained practice contrast differs from rust.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=15,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

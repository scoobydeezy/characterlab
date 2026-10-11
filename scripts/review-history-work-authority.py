from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-work-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'WORKSPACE_CONTROL_READINESS.md').as_posix():'Historical intake:StoredSet/IndexedReplay share safe journal;cache authority is tested without collapsing retained availability into access. No Willpower/cost primitive. Lifecycle,neutral-card grounds,source ordering and prior attention/memory controls preserved. Later bounded verdict discharges this intake,not wider control.',
'docs/formal/WORKSPACE_CONTROL_CONTRACT.md':'Accepted bounded workspace-control/0.1-candidate. Two adopted tasks[1,6),neutral card,capacity0..3;priority orders access,not reason intensity. Observation120/append140 feeds next40;deadlines retire solely. StoredSet cache vs IndexedReplay journal fold agree only under one frame/opportunity per original,fixed deadline,retained history. No task adoption,fulfillment,ordinary recognition or execution claim. Four diagnostic violating controls remain explicit.',
(P/'CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md').as_posix():'VER-C3-WORK-001 qualifies78runs/624prefixes,546advancing/78terminal;48models/240files;40affected/328reference historical tests. Maintained access,retained status,cue/expiry and grounded intent separate. Independent cache DERIVED only under finite journal/fixed lifecycle assumptions;cost/scale/decay/new lifecycle require rederivation. First test-only narrowing build failure preserved historically. No global cache removal or ORD001 closure.',
(P/'WORK_DISTRACTOR_DESIGN_FINDING.md').as_posix():'WORK-DESIGN-001:main low-distraction fixture changed A and B priorities,so supports priority sensitivity only. Eight preregistered supplementary runs/four exact single-field pairs discharge distractor-only causality while preserving original result and narrowed claim. Methodological correction,no model law change.',
(P/'WORK_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen70-run main plan links exact48-model freeze;closed canonical inputs and declared claims. Main priority contrast alone cannot support distractor-only causality;later supplement supplies that evidence. Names are experimental identifiers,not learned observer facts.',
(P/'WORK_DISTRACTOR_PLAN_REV1.json').as_posix():'Frozen8-run supplement explicitly corrects confounded main fixture. A2/C0 fixed,B1vs3 at time2,two serious representations/support on-off. Exact one-field differences verified by original closure audit;not new psychological law.',
(P/'WORK_PUBLIC_EXPERIMENT_REV1.json').as_posix():'70 stored public results/560 restores and continuations. Exact names/models/seeds bind plan;workspace selected/prior/access/control/status and choice/draw fields are typed behavioral backing. StoredSet/IndexedReplay exact output hashes and negative controls pass original assertions. Not a fresh runtime rerun;unavailable choice null is not zero-valued action.',
(P/'WORK_DISTRACTOR_REV1.json').as_posix():'8 stored supplementary results/64 restores. Four pairs have preintervention equality,unchanged retained status,and support-dependent displacement;candidate outputs equal. Prefix output hashes back narrow causal correction;all results retained.',
(P/'WORK_VALIDATION_CLOSURE_REV1.json').as_posix():'Original closure audit exactly reproduced:240image hashes,contract/allocation/current implementation hashes,test receipts and four decoded input differences.48models/78runs/624prefixes/40affected/328reference are verified stored evidence,not fresh test/runtime execution.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='WORK AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'WORK_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/WORKSPACE_CONTROL_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
for n in ['WORK_PUBLIC_EXPERIMENT_REV1.json','WORK_DISTRACTOR_REV1.json']:
 v=load(P/n);assert v['runs']==len(v['results']) and v['restores']==sum(r['restores'] for r in v['results']) and v['continuations']==sum(r['continuations'] for r in v['results'])
 for r in v['results']:
  assert set(r)<=set('name model seed restores continuations prefixSaveSha256 finalSaveSha256 outputsSha256 stateSha256 workspace choices prefixOutputsSha256'.split());assert len(r['prefixSaveSha256'])==r['restores']
  for w in r['workspace']:assert set(w)==set('at candidateCount selected control prior cue statuses access'.split())
  for c in r['choices']:assert set(c)=={'at','chosen','draws'}
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='NINE WORK SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh78-run replay,rollback or tests.','DERIVED cache limited to retained frames/fixed lifecycle/opportunity sequence;not unlimited general reduction.','Confounded priority claim remains narrowed,not erased.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=9,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

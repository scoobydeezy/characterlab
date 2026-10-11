from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-relationship-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'RELATIONSHIP_READINESS.md').as_posix():'Historical intake separates current person estimate from own-participant dyadic history. Symbolic count/rupture,not universal trust. Contact/absence are prospective probes,not enacted dialogue or grief. Derived/Stored/PersonEstimateOnly and rupture-law alternatives explicit;full history retained. Existing snapshot/privacy precedent does not settle reciprocal ordering/security.',
'docs/formal/RELATIONSHIP_PUBLIC_CONTRACT.md':'Accepted0.1 contract remains failed behavioral predecessor,not silently superseded success. Two observers/one target,max12instants;history848 own-participant cooperation/breach,person850 latest claim,cache852 independent owners. Comfort/caution/missing-contact separate;genuine contact/activity motives precede modifiers. Old inherited unit1 made bounded modifiers inert. Authored RNG roots and safe view restrictions retained;no executed interaction or global privacy claim.',
'docs/formal/RELATIONSHIP_PUBLIC_CONTRACT_REV2.md':'Accepted0.2 correct-forward successor retains schema/source/owners/order/laws;version and modifier unit1/4 change,cap3/activation0 unchanged. StickyRupture retains breach;LatestInteraction clears after cooperation. Same current claim cannot erase rupture;absence changes feasibility without breach/history deletion. Derived/Stored require full finite history and committed-boundary equality. PersonEstimateOnly tested reduction fails;not every richer person model excluded.',
(P/'CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md').as_posix():'VER-C3-REL-001 bounded0.2:11models/55files/24runs/256prefixes,232advancing/24terminal;86affected/328reference historical tests. Equal full person record/different acquisition changes effective response,not just embedded appraisal. Own participation distinct from witnessing;safe views truth/nonrecipient invariant. Order normalization only1156provenance with RNG roots/draws retained. No attribution repair,grief,intensity,compression or enacted social behavior. Old LONG routing historical;RO016 preserves broader debt.',
(P/'RELATIONSHIP_IMPLEMENTATION_FINDINGS.md').as_posix():'Preserve syntax correction before tests (84-pass receipt not failure),analytical vs effective probability distinction,authored RNG roots,SharedHistory simultaneous-participant transactional rejection,and strengthened mutation/cache rollback. REL-FIND005 completed24run predecessor failed behavioral gate:unit1 truncates magnitude1/2,not cap-zero bug. Whole response inequality was weak due embedded differing appraisal. Successor separately frozen;no old receipt overwritten.',
(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen0.1 24run plan retained with failed behavioral cohort. Declared effective-response requirement caught inert calibration;not passed merely because runs completed.',
(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV2.json').as_posix():'Frozen0.2 successor24run plan retains identical run rows/inputs and claims while contract/freeze reference changes. Exact names/models are scoped to different frozen cohort;do not alias versions.',
(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_REV2.json').as_posix():'24stored results/256prefixes with full/semantic observer views,person/history/appraisal and analytical/effective response fields. All original assertions reproduce;result includes actual draws/choices distinct from analytical probabilities. No fresh full successor replay.',
(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_FAILURE_REV1.json').as_posix():'24completed old runs preserved under failing effective1/2-vs1/2 assertion. Appraisals differ but matched effective choice remains equal. Original closure freshly replays one old terminal save exactly;not all24 old runs freshly replayed.',
(P/'RELATIONSHIP_VALIDATION_CLOSURE_REV2.json').as_posix():'Exact original closure verifies both frozen cohorts/hashes,successor single-field contrasts,stored86affected/328reference and current sources;one predecessor terminal save freshly reproduces.256prefix count remains historical. No generalized grief/attribution/history compression.',
(P/'RELATIONSHIP_CALIBRATION_AUDIT_REV1.json').as_posix():'All22 old/new model calibration rows decoded again exactly:old unit1/new1/4,cap3/activation0 unchanged. Explains inert old modifiers without retroactively qualifying cohort or selecting universal calibration.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RELATIONSHIP AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'RELATIONSHIP_VALIDATION_CLOSURE_REV2.json'),ref('docs/formal/RELATIONSHIP_PUBLIC_CONTRACT_REV2.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_REV2.json');assert v['runs']==len(v['results'])==24 and v['restores']==sum(len(r['prefixes']) for r in v['results'])==256
assert load(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV1.json')['runs']==load(P/'RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV2.json')['runs']
for r in v['results']:
 assert set(r)==set('name model prefixes views semanticViews observers'.split());assert len(r['observers'])==2
 for x in r['observers']:
  assert set(x)==set('person historyLength appraisals responses'.split())
  for y in x['responses']:assert set(y)==set('analytical effective mode chosen draws'.split())

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-016','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='ELEVEN RELATIONSHIP SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['One failed predecessor terminal replay fresh;no full24run successor replay or fresh tests.','Cache equivalence assumes full journal/fixed folds;no general compression or episodic equivalence.','Effective response gate matters;changed appraisal/embedded response records alone are insufficient.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=11,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

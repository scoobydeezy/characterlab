"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-task-feedback-calibration-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev280/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={
'TASK_EARNED_FEEDBACK_CALIBRATION_REV1':'Historical reference-component exploration, not canonical identity qualification. Three actual reference choices contribute quantized evidence from initially empty identity under proposed semantic alignment. Later contact-derived means are hypothetical, not generated physical outcomes or runtime prediction evidence. Alignment-scaled feedback changes mode in23/32 seeds; preserve nine equalities and all seeds. Synthetic source strings are controls. No universal threshold movement or semantic qualification follows.',
'TASK_EARNED_FEEDBACK_CALIBRATION_REV2':'Retains all32 choice/evidence histories and older alignment-scaled pulls as comparison fields, but uses Phase2.97 commitmentStandingIdentitySignals direct signed strength for later compilation. Both task options receive that same channel strength rather than option alignment times strength. Mode shifts32/32 for this calibration, not universal benefit, preferred action, or superiority. Builder exposed in memory without editing reference source. Source mapping correction does not erase REV1 or turn hypothetical consequences into generated actions. Later canonical qualification has its own identities and provenance.',
'TASK_GENERATED_OPERAND_CALIBRATION_REV1':'Actual prediction profile records observations0,1 and means0,1/2 after ten authored exposures from displacement-50. Earlier thirty-exposure construction rejected frozen bounds; no widening. Concern/semantic pressure remain proposed operands and standing1/3 is intervened, not earned. Before standing, nuclei2 then1; standing restores2, while equal semantic meanings yield zero alignment. Reference-only tags cannot authenticate canonical sources. Frozen task deadline predates completion of this history, so no intact live-task witness. Later cognitive qualification separately supplies generated actions and original-input public proof.'}
chain=[ref(P/'CAMPAIGN2_COGNITIVE_QUALIFICATION.md'),ref(P/'CAMPAIGN3_IDENTITY_PUBLIC_QUALIFICATION.md')]

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/sourceFingerprints/','/baseline/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='HISTORICAL TASK FEEDBACK CALIBRATION; NOT PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sourceFingerprints']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0,0]
a=load(P/'TASK_EARNED_FEEDBACK_CALIBRATION_REV1.json');b=load(P/'TASK_EARNED_FEEDBACK_CALIBRATION_REV2.json')
def bounded(x):return x/(1+abs(x))
def semantics(m):return [bounded(F(1,10)+(F(i)-m)/10) for i in [4,5]]
steps=0
for v in [a,b]:
 assert [c['seed'] for c in v['cases']]==list(range(32))
 assert sum(c['withoutMode']!=c['withMode'] for c in v['cases'])==v['shiftedCases']
 for c in v['cases']:
  support=opposition=F(0);contacts=0
  for h in c['history']:
   sign=1 if h['chosen']=='B' else -1
   assert F(h['alignment'])==F(sign,25) and F(h['authorshipPotential'])==F(5,7)
   e=F(sign,35);assert F(h['expression'])==e
   support=F(round(1000000*(support+max(F(0),e))),1000000)
   opposition=F(round(1000000*(opposition+max(F(0),-e))),1000000)
   assert F(h['support'])==support and F(h['opposition'])==opposition
   contacts+=1 if h['chosen']=='A' else 2;steps+=1
  assert contacts==c['contacts'] and F(c['hypothesizedLaterMean'])==F(contacts,20)
  strength=(support-opposition)/(F(1,10)+support+opposition);assert F(c['strength'])==strength
  x,y=semantics(F(contacts,20));pull=strength*bounded(x-y)
  field='actualHistoricalProjectedPulls' if v is a else 'olderAlignmentScaledComparisonPulls'
  assert list(map(lambda r:F(r[0]),c[field]))==[pull,-pull]
for old,new in zip(a['cases'],b['cases']):
 for key in ['seed','history','contacts','hypothesizedLaterMean','strength','withoutFeedback','withoutMode']:assert old[key]==new[key]
 assert old['actualHistoricalProjectedPulls']==new['olderAlignmentScaledComparisonPulls']
assert a['shiftedCases']==23 and b['shiftedCases']==32 and steps==192
g=load(P/'TASK_GENERATED_OPERAND_CALIBRATION_REV1.json')
assert g['actualHistory']['authoredExposureEvents']==10
assert list(map(F,g['actualHistory']['retainedMeans']))==[F(0),F(1,2)]
for c in g['cases']:
 m=F(c['forecast']);assert list(map(F,c['concern']))==[(4-m)/10,(5-m)/10]
 x,y=semantics(m);assert list(map(F,c['proposedNonIdentitySemanticAlignment']))==[bounded(x-y),bounded(y-x)]
 assert list(map(F,c['equalMeaningAlignment']))==[0,0]
assert [[len(x['nuclei']) for x in c['beforeStanding']] for c in g['cases']]==[[1,1],[0,1]]
assert [[len(x['nuclei']) for x in c['afterStanding']] for c in g['cases']]==[[1,1],[1,1]]
rows=[]; selected={s['path'] for s in sources}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named files and REV280 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='TASK FEEDBACK CALIBRATION AND MAPPING REVISION RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS TASK FEEDBACK CALIBRATION ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),checkedEvidenceSteps=steps,retainedSeedHistories=32,modeShifts=[23,32],generatedOperandCases=2,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

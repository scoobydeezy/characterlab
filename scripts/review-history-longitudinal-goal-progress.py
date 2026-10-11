"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-longitudinal-goal-progress-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev282/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={
'LONGITUDINAL_GOAL_EXECUTION_CHECKPOINT_REV1':'Historical execution capture:20 trajectories/340 captured prefix hashes, zero restored prefixes and12 native goal pairs. Planned5 models/120 runs/2040 restores are obligations, not completed work. Session IDs are historical metadata and do not establish any currently live process. Counters1508/0 are at capture. Later complete matrix supersedes execution routing without rewriting this receipt.',
'LONGITUDINAL_GOAL_INTERIM_REVIEW_REV1':'First72 trajectories only;24 fine/coarse comparisons give18 probability and14 action differences, with24 retention equalities. Seeds4/5 cancel standing; four additional action equalities coexist with changed probabilities. Eight maintained/withdrawn and maintained/replaced action contrasts are separate. NoFeedback/GoalEqualsOpportunity and restored-prefix roster were still open here. Later matrix supplies those gates; this interim receipt alone never qualified them.',
'LONGITUDINAL_GOAL_TRAJECTORIES_REV1':'All120 trajectory records under five models pass finite comparison, but prefixesVerified is0 of2040. Native source hashes match across receiver/goal interventions; fine versus NoFeedback gives18 probability/14 action differences, coarse versus NoFeedback gives none, retention24 equalities. Keeping detail equal for this consumer does not make detail generally unnecessary. GoalEqualsOpportunity is negative control, not legitimate goal retirement. Subsequent matrix restores one immediate successor per prefix, not every tail; qualification is component goal/receiver composition around native source, not a new joined native scheduler.'}
chain=[ref(P/'CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md'),ref(P/'LONGITUDINAL_GOAL_MATRIX_REV1.json')]

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/sourceFingerprints/','/baseline/','/draft/','/artifacts/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='LONGITUDINAL GOAL INTERMEDIATE EVIDENCE; LATER MATRIX SEPARATE',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['artifacts']+[dict(path=(P/'LONGITUDINAL_GOAL_PLAN_REV1.json').as_posix(),sha256=v['planSha256'])]:
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0,0]
capture=load(P/'LONGITUDINAL_GOAL_EXECUTION_CHECKPOINT_REV1.json');interim=load(P/'LONGITUDINAL_GOAL_INTERIM_REVIEW_REV1.json');full=load(P/'LONGITUDINAL_GOAL_TRAJECTORIES_REV1.json')
assert capture['completedTrajectoriesAtCapture']==20 and capture['capturedPrefixHashes']==340 and capture['restoredPrefixesAtCapture']==0
assert len(capture['artifacts'])==40 and len(interim['artifacts'])==72 and len(full['artifacts'])==242
assert full['prefixesVerified']==0 and full['prefixesRequired']==2040
plan=load(P/'LONGITUDINAL_GOAL_PLAN_REV1.json');runs=[]
for i,identity in enumerate(plan['runs']):
 r=load(P/('longitudinal-goal-execution-rev1/'+str(i).zfill(3)+'.json'))
 assert all(r[k]==value for k,value in identity.items())
 assert len(r['state']['rows'])==16 and len(r['prefixHashes'])==len(r['nativeHashes'])==17
 runs.append(r)
assert len(runs)==120 and len({r['runIdentity'] for r in runs})==120
def get(law,mode,seed,keep=False):return next(r for r in runs if (r['law'],r['mode'],r['seed'],r['keepEpisodes'])==(law,mode,seed,keep))
def choices(r):return [x['choice']['chosen'] for x in r['state']['rows'][8:]]
def probs(r):return [x['choice']['probabilities'] for x in r['state']['rows'][8:]]
for c in full['comparisons']:
 mode=c['mode'];seed=c['seed'];f=get('FineStanding',mode,seed);n=get('NoFeedback',mode,seed);co=get('SeparateOwners',mode,seed);keep=get('FineStanding',mode,seed,True)
 assert f['nativeHashes']==n['nativeHashes']==co['nativeHashes']
 assert c['standing']==f['state']['rows'][8]['standing']==f['state']['rows'][7]['standing']
 assert c['fineVsNoFeedback']==dict(probabilities=probs(f)!=probs(n),actions=choices(f)!=choices(n))
 assert c['coarseVsNoFeedback']==dict(probabilities=probs(co)!=probs(n),actions=choices(co)!=choices(n))
 assert c['retentionActionsEqual'] and choices(f)==choices(keep) and probs(f)==probs(keep)
 assert f['state']['rows'][8]['episodes']==0 and keep['state']['rows'][8]['episodes']>0
for c in interim['comparisons']:
 f=get('FineStanding',c['mode'],c['seed']);co=get('SeparateOwners',c['mode'],c['seed'])
 assert c['probabilitiesDiffer']==(probs(f)!=probs(co)) and c['actionsDiffer']==(choices(f)!=choices(co))
 assert c['retentionChoiceEqual'] and c['standing']==f['state']['rows'][8]['standing']
assert sum(x['probabilitiesDiffer'] for x in interim['comparisons'])==18
assert sum(x['actionsDiffer'] for x in interim['comparisons'])==14
for c in interim['goalComparisons']:
 seed=c['seed'];m=get('FineStanding','Maintained',seed);w=get('FineStanding','Withdrawn',seed);r=get('FineStanding','Replaced',seed);bad=get('GoalEqualsOpportunity','Maintained',seed)
 assert c['maintainedVsWithdrawnActionsDiffer']==(choices(m)!=choices(w))
 assert c['maintainedVsReplacedActionsDiffer']==(choices(m)!=choices(r))
 assert choices(w)==choices(bad) and probs(w)==probs(bad)
 assert m['nativeHashes']==w['nativeHashes']==r['nativeHashes']
later=load(P/'LONGITUDINAL_GOAL_MATRIX_REV1.json');assert later['prefixesVerified']==2040 and later['comparisons']==full['comparisons']
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
save('unresolved.json',dict(searchScope='Current named files and REV282 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='LONGITUDINAL GOAL PROGRESS EVIDENCE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-009','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS LONGITUDINAL GOAL PROGRESS ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedTrajectoriesCompared=120,interimComparisons=24,completeComparisons=24,goalComparisons=8,laterPrefixCount=2040,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

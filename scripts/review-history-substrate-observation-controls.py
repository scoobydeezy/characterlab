"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-substrate-observation-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev281/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={
'CAMPAIGN3_BODY_PROJECTION_SUBSTRATE_REV1':'Three existing PRJ tests concern captured bindings/functions, nested alias isolation, exact read domains and inaccessible internals. They do not execute proposed subject-selected body dispatch, source admission, permissions or EREG public vectors. The446 preserved fingerprint checks are byte consistency, not446 fresh tests. Draft binding is historical; later embodied qualification supplies separately scoped public evidence.',
'CAMPAIGN3_REPLENISHMENT_STATE_SUBSTRATE_REV1':'Six existing ownership/read/patch tests preserve overlap/exclusion, actual read provenance, structural diffs, authority/precondition/alias rejection and deep-copy isolation. They do not execute replenishment admission, same-instant composition or EREP public vectors. The446 fingerprint checks are not new behavioral tests. Later embodied qualification is separately scoped, not retroactive promotion of these substrate tests.',
'PROTOCOL_OBSERVATION_CUT_EXPLORATION_REV1':'Three supplied observer truths produce point0, point1 and censored lower-bound2. At saturation upper is absent, not known2. The unchanged fixed-pulse bridge admits only1 and rejects0/2. Raw safeSourceReferences still contain a private truth record; its field name does not authorize character access. A separately admitted projection must remove protocol truth identity. Requested potential inconsistent with applied zero rejects; this is invalid-truth exclusion, not an actual blocked action. Research IDs are not allocated provenance, and these are supplied truth fixtures, not native ExecutionOutcome production. Later cognitive qualification supersedes missing-runtime routing only within its exact public scope.'}
chain=[ref(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.md'),ref(P/'CAMPAIGN2_COGNITIVE_QUALIFICATION.md')]

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/sourceFingerprints/','/baseline/','/draft/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='EXISTING SUBSTRATE OR OBSERVER COMPONENT CONTROLS; NOT NEW PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sourceFingerprints']+([v['draft']] if 'draft' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0,0]
for name,n in [('CAMPAIGN3_BODY_PROJECTION_SUBSTRATE_REV1',3),('CAMPAIGN3_REPLENISHMENT_STATE_SUBSTRATE_REV1',6)]:
 v=load(P/(name+'.json'));assert len(v['tests'])==n and all(t['state']=='pass' for t in v['tests'])
 assert v['preservedChecks']==446
v=load(P/'PROTOCOL_OBSERVATION_CUT_EXPLORATION_REV1.json')
assert v['blockedRequestedPotentialRejected'] is True
assert v['cases']==[dict(completedCount=i,lower=i,upper=None if i==2 else i,evidenceKind='LowerBound' if i==2 else 'Point',privateTruthReferencePresent=True,oldFixedPulseBridgeAdmitted=i==1) for i in range(3)]
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
save('unresolved.json',dict(searchScope='Current named files and REV281 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='SUBSTRATE AND OBSERVER CONTROL SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SUBSTRATE OBSERVER HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedSubstrateTests=9,observerCases=3,preservationFingerprintChecksPerReceipt=446,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

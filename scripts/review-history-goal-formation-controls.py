"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-goal-formation-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev275/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'FORMATION_AND_CONTEXT_REVIEW_REV4': 'Twenty-four controls preserve empty selection occurrence without invented acquisition, distinct selection/experience/acquisition, per-acquisition rather than per-view identity, prepared context, positive-only children, strict prior concern and ordered unique prior context. An independently consumed inner capability defends replay after outer-map deletion; that substitution is not counted as a detected fault. Later production-boundary REV5 retains these exact fault cases, but source hashes differ and are not replaced. Fixture memory/PRJ remain trusted; no public codec/admission proof.', 'GOAL_DISTANCE_RELATION_REVIEW_REV1': 'Five controls enforce metric-domain admission, strict interval separation, exact singleton equality, independent side positions and correct minimum interval distance. Numeric ordinal domain is not metric. MovingCloser requires after.max<before.min; equal nonsingleton ranges remain indeterminate, not SameDistance. Symmetric equal-distance side crossing can preserve changed position without qualifying distance change. Missing/inactive evidence differs from valid indeterminate assessment; malformed foreign-domain evidence rejects. Read-only distance assessment is not significance, utility, reward or retention authority.', 'GOAL_OUTCOME_QUALIFICATION_REVIEW_REV1': 'Four controls preserve both closer and farther qualification, exclude indeterminate/equal distance and retain direction. The deterioration-only comparator excludes progress as policy, not uncertainty. Equal-distance side crossing remains in the basis without qualifying. Supported attribution and extant target admission remain independent prerequisites; qualification alone neither grants credit nor stores significance or changes goals/history.', 'MAINTENANCE_GOAL_DEADLINE_REVIEW_REV1': 'Three controls prevent expiration of withdrawn goals, require the bound deadline time and preserve withdrawal history. Actual lifecycle guard/source composition is separate from registered scheduler association, once-only ingress, PRJ and canonical persistence. Terminal withdrawal cannot be retroactively rewritten as expiry.'}
chain=[ref(p) for p in [P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md',P/'campaign3-history-production-boundary-revisions-rev1/review.json',Path('docs/formal/GOAL_DISTANCE_RELATION_COMPONENT.md'),Path('docs/formal/GOAL_OUTCOME_QUALIFICATION_COMPONENT.md'),Path('docs/formal/MAINTENANCE_GOAL_DEADLINE_COMPONENT.md')]]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/baseline/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v['faults'])
 faults.append(dict(source=p,count=len(v['faults']),controls=v['faults']))
 sources.append(dict(**ref(p),role='STORED GOAL FORMATION FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[24,5,4,3]
formation=load(P/'FORMATION_AND_CONTEXT_REVIEW_REV4.json');later=load(P/'GA_PRODUCTION_BOUNDARIES_REVIEW_REV5.json')
assert all(x in later['faults'] for x in formation['faults'])
assert formation['defendedSubstitution']==later['defendedSubstitution']
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
save('unresolved.json',dict(searchScope='Current named files and REV275 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='FOUR GOAL AND FORMATION CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS GOAL FORMATION HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

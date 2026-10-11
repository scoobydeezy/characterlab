"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-production-boundary-revisions-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev273/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'GA_PRODUCTION_BOUNDARIES_REVIEW_REV5': 'Forty-one stored controls distinguish selection/acquisition/experience, empty formation, per-acquisition rather than per-view identity, positive children, context, prior concern, temporal position grouping, goal ownership, one-use capability, deferred credit and receiving controls. Credit must not retroactively change current retention. Unlimited/equal selection controls preserve their actual branch labels; hybrid is not forcibly normalized to conserve. Component audit and selected capability only: canonical fixture payload and PRJ remain trusted; public codec/admission gates need separate later evidence. Outer-map deletion substitution does not enable replay because inner prepared capability is consumed; it is explicitly NOT a detected fault. No arbitrary guard deletion necessity or psychological law follows.', 'GA_PRODUCTION_BOUNDARIES_REVIEW_REV6': 'Forty-nine controls retain every REV5 fault unchanged and add eight: independent cue policy, distinct baseline slot, kind dispatch, detached bound ID, three retention controls that ignore significance and preservation of ignored significance. Ignoring an operand at a receiver does not erase owned source state. Changed ordinary-memory source/tests and policy dependencies retain their own hashes. Component audit and selected capability only: canonical fixture payload and PRJ remain trusted; public codec/admission gates need separate later evidence. Outer-map deletion substitution does not enable replay because inner prepared capability is consumed; it is explicitly NOT a detected fault. No arbitrary guard deletion necessity or psychological law follows.', 'GA_PRODUCTION_BOUNDARIES_REVIEW_REV7': 'Fifty controls add actual-loss propagation to the owner protocol while retaining REV6 controls. A formed acquisition can fail retention while its protocol/history consequences remain real; owner settlement cannot pretend it survived. Updated composition-test/reviewer bytes are distinct from earlier cohort. Component audit and selected capability only: canonical fixture payload and PRJ remain trusted; public codec/admission gates need separate later evidence. Outer-map deletion substitution does not enable replay because inner prepared capability is consumed; it is explicitly NOT a detected fault. No arbitrary guard deletion necessity or psychological law follows.', 'GA_PRODUCTION_BOUNDARIES_REVIEW_REV8': 'Sixty controls add presentation and association settlement: no body seeding, remove forgotten history, reject duplicate occurrences/overflow, retain original presentation seed, actual elapsed association time, no retention-based clock rejuvenation, advance clock on formation, reject empty prior node and carrier overflow before retention could hide it. Presentation reinforcement, memory retention and association clocks remain distinct owners/quantities. Component audit and selected capability only: canonical fixture payload and PRJ remain trusted; public codec/admission gates need separate later evidence. Outer-map deletion substitution does not enable replay because inner prepared capability is consumed; it is explicitly NOT a detected fault. No arbitrary guard deletion necessity or psychological law follows.', 'GA_PRODUCTION_BOUNDARIES_REVIEW_REV9': 'Sixty-two controls add graph canonical key ordering and corresponding matrix reindexing, with new graph source/test/reviewer hashes. Canonical reordering must preserve edge meaning, not just sorted labels. Exact set inclusion confirms earlier controls were not silently dropped; 262 repeated detections across receipts represent62 distinct fault names, not262 independent phenomena. Component audit and selected capability only: canonical fixture payload and PRJ remain trusted; public codec/admission gates need separate later evidence. Outer-map deletion substitution does not enable replay because inner prepared capability is consumed; it is explicitly NOT a detected fault. No arbitrary guard deletion necessity or psychological law follows.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_SPATIAL_BINDING_CHECKPOINT.md','GENERAL_ATTENTION_REQUESTED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_COMBINED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_BOUNDED_PERCEPTION_CHECKPOINT.md','GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
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
 sources.append(dict(**ref(p),role='STORED PRODUCTION BOUNDARY FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[41,49,50,60,62]
deltas=[];prior={}
for name in notes:
 v=load(P/(name+'.json'));current={f['name']:f for f in v['faults']}
 assert len(current)==len(v['faults']) and all(current.get(k)==x for k,x in prior.items())
 assert 'not counted as a detected fault' in v['defendedSubstitution']['result']
 assert v['defendedSubstitution']['name'] not in current
 deltas.append(dict(source=(P/(name+'.json')).as_posix(),added=[current[k] for k in current if k not in prior],retained=len(prior),defended=v['defendedSubstitution']))
 prior=current
assert len(prior)==62
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
save('unresolved.json',dict(searchScope='Current named files and REV273 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='FIVE PRODUCTION BOUNDARY REVISIONS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,revisionDeltas=deltas,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS PRODUCTION BOUNDARY HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

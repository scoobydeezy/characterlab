"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-spatial-feedback-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev272/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'PRIOR_CONCERN_FEEDBACK_REVIEW_REV1': 'Seven controls reject same-instant or foreign-subject feedback, reversed residual modulation, zero-as-unavailable, ignored disabled model, borrowed task response and appraisal leakage in carry. Actual character-side transforms still use trusted forecast/status/producer-time fixtures. Later GA proves its bounded same-run delivery separately. Ratified seam is transient character-state to attention; TaskConcern is not general Affect and Candidate A is not the final modulation law.', 'PRIOR_CONCERN_SPATIAL_REVIEW_REV1': 'Four controls preserve focal versus peripheral treatment, preselection divisor, true receiving time and single-use prepared result. Exact prior modulation and selected-only capability do not authenticate carried response/subject, public producer/delivery, model or persistence. Encoding suppression is distinct from retrieval amplification; no law selection follows.', 'POSITIVE_SPATIAL_CANDIDATE_REVIEW_REV1': 'Five controls admit only positive children, exclude sibling bindings/evaluation archives and detach trace rationals/files. Projection does not confer public producer/owner or allocation authority. Diagnostic evaluation content must not become retained cognitive content.', 'PREPARED_POSITIVE_SPATIAL_REVIEW_REV1': 'Four controls require earlier concern, discard zero children, exclude feedback from retained content and consume prepared capability. Preparation carries influence without storing the feedback as episodic evidence. Completed producer/subject remain upstream premises; no public formation or canonical persistence claim.', 'RETAINED_POSITION_PAIR_ATTRIBUTION_REVIEW_REV1': 'Eleven controls preserve start/end choice, ordered prior observations, admission, unread-position validity, actual consumption, unavailable assessment use, strict prior instant/read domain and detached rationals. Binding is not use; support is not required for consumption. Trusted projection/admission does not authenticate public source or persistence. No hidden start/end reconstruction or causal certainty follows.', 'GA_FOCAL_AND_VISUAL_BINDING_REVIEW_REV1': 'Nine controls preserve visual detection when panel absent, shared fallback counter, fallback retirement, consistent shared detections and separation from trial context. Attribution targets explicitly prepared focal endpoint rather than control/last trial or silently chosen start child, with detached focus. Two mutations target fixture coordination. Supplied panel/visual inputs and fallback are not public source or completed-result authentication.', 'GA_VISUAL_CLAIM_TRANSPORT_REVIEW_REV2': 'Five controls over16 carrier records require actual claims rather than truth, bounded batches, selected-only encoder reads and no second identity allocation by owner. Exact field delta and allocation-stage correction do not authenticate public claim producer or admit selected capability. Structure is not epistemic authority.', 'GA_VISUAL_RECALL_REVIEW_REV1': 'Five controls exclude component-only SEM tags, unsampled context, repeated observation, capacity bypass and manufactured current cue. Two fixture substitutions expose coupled recall-capacity/current-sensing boundaries without proving public registration. Supplied roles/subject, serialization and source/lane/allocator remain premises. Duplicate composition-test binding is preserved as two occurrences, one distinct path/hash.'}
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
 sources.append(dict(**ref(p),role='STORED SPATIAL FEEDBACK FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[7,4,5,4,11,9,5,5]
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
save('unresolved.json',dict(searchScope='Current named files and REV272 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='EIGHT SPATIAL FEEDBACK CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SPATIAL FEEDBACK HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

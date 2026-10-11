"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-body-component-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev267/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={
 'BODY_RECALL_REVIEW_REV1': 'Five stored detected mutations cover ordering, self cue, tie direction, timestamp refresh and group-only recall. Supplied cue identity does not authenticate a public source. Recency ranking and retention remain distinct; these mutations are implementation controls, not serious competing psychological laws.',
 'BODY_SIGNAL_CUE_REVIEW_REV1': 'Five stored detected mutations cover permission, absent signal, observer, repeated observation and omitted cue. Component record validity does not authenticate producer completion or opportunity linkage. Absent evidence cannot become an admitted cue.',
 'BODY_SIGNAL_CUE_REVIEW_REV2': 'The same five controls accompany changed component and review bytes and the later local reserve/opportunity baseline. Repetition does not establish five new independent phenomena. Public producer completion and opportunity linkage remain outside this component proof.',
 'INTEROCEPTIVE_SELECTION_REVIEW_REV1': 'Six stored detected controls distinguish capacity, absence, single-use views, observer/time and duplicate channels. Present high-level zero pressure differs from absence. Equal priority is a control, not bodily salience; sampled channels do not prove physiological diversity, public sensing, durable memory or restore.',
 'INTEROCEPTIVE_SIGNAL_SELECTION_REVIEW_REV1': 'Seven stored detected controls distinguish signal slots from views, supplied opportunity from timestamp, contradictory views, byte bounds, single use, repeated observation and absent signals. Supplied grouping is not authenticated public output. Three signals, three views, 4096 bytes and capacity two are finite controls, not permanent public parameters or physiological diversity.',
 'INTEROCEPTIVE_SIGNAL_SELECTION_REVIEW_REV2': 'The same seven controls bind successor source/reviewer bytes and local reserve/opportunity baseline. Contradictory views remain represented; opportunity is not inferred from time. This successor does not retroactively authenticate original bytes or qualify public sensing, fusion, durable memory or restore.',
 'CONTRASTIVE_ATTRIBUTION_REVIEW_REV1': 'Six stored detected controls preserve strict interval contrast, conservative endpoint subtraction, baseline, replication, positive change and rejection of sparse points. Four supplied trials are not authenticated retained history. Hidden-label function invariance is not a public false-attribution demonstration. Supported attribution does not establish magnitude, benefit, causal certainty or consolidation.',
 'RETAINED_ATTRIBUTION_USE_REVIEW_REV1': 'Six stored detected controls distinguish binding from actual use, consume unavailable assessments, require consumption, forbid same-instant use, enforce read domain and normalize rational aliases. Trusted memory snapshots, admission sets and projection adapters do not establish public registration or canonical persistence.',
 'RETAINED_ATTRIBUTION_USE_REVIEW_REV2': 'The same six controls bind corrected source and contrastive-attribution dependency to the later baseline. Available/bound is not used; an unavailable assessment can still consume history. Rational alias repair preserves meaning. Public subject/source/read/commit registration and persistence require later qualification; these mutation controls are not psychological competitors.'}
chain=[ref(P/n) for n in ['BODY_RECALL_COMPONENT_CHECKPOINT.md','BODY_SIGNAL_CUE_COMPONENT_CHECKPOINT.md','INTEROCEPTIVE_ACQUISITION_COMPONENT_CHECKPOINT.md','INTEROCEPTIVE_SIGNAL_ACQUISITION_CHECKPOINT.md','ATTENTION_CONTRASTIVE_ATTRIBUTION_CHECKPOINT.md','RETAINED_ATTRIBUTION_USE_CHECKPOINT.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
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
 sources.append(dict(**ref(p),role='STORED BODY COMPONENT FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+[v['baseline']]:
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[5,5,5,6,7,7,6,6,6]
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
save('unresolved.json',dict(searchScope='Current named files and REV267 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='NINE BODY COMPONENT CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS BODY COMPONENT HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

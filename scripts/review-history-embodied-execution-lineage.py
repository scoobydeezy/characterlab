"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-embodied-execution-lineage-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev287/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']}
notes={
'embodied-execution-rev1/REVIEW.json':'Seven public executions under successor embodied cohort match frozen expectations; each has9 originals/6 boundaries/39 events. Denied/unavailable emit15 outputs and no SEM versus21/6 otherwise; hidden reserve expectation intentionally neither read nor reconstructed. Whole vector review still open; this alone does not establish receiving, action knowledge or final Need ownership.439 preserved receipt entries are consistency metadata, not extra behavioral runs.',
'embodied-execution-rev2/REVIEW.json':'Same seven result rows and21 output/trace/save artifacts asREV1 despite replenishment/runtime/trace source changes. Exact source revisions remain distinct, not one fresh full-suite result. Frozen expectation and cohort commitments unchanged. Hidden truth protection and limitations retained; later broader qualification has separate evidence.',
'embodied-receiving-execution-rev2/REVIEW.json':'28 public specimens/492 checks cover real outputs/read-write boundaries and named contrasts: duplicate grounds retain1/2, independent task/body same-option grounds yield221/256 versus1/2 ablations, no-coverage duplicate2/3. Hidden aliases equal; coarse channel at35 loses body option. Execution permission changes terminal outcome, not intent. NoOptions differs from NoActiveReasons; all five dice/three modes exercised. Deadline removes task branch without losing body origins; maximal instant26events22outputs. Adopted instructions supply no efficacy/replenishment knowledge; aggregate/negative/modifier controls and runtime mutants remain separately owed here.',
'embodied-receiving-execution-rev3/REVIEW.json':'Same28 specimens, boundaries and all196 stored artifact hashes asREV2.688 checks retain all492 earlier occurrences and add28x7 exact byte-preservation checks; these are not196 new scenarios or prefix restores. Runtime/transform/trace source changes have their own hashes. Preserves public named contrasts while generic component comparisons, mutant/preservation reconciliation and parent qualification remain separate. Later embodied qualification supplies those scoped gates, not this receipt alone.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_EMBODIED_QUALIFICATION.md','CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.md']]

def target_refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  else:
   for x in v.values():yield from target_refs(x)
 elif isinstance(v,list):
  for x in v:yield from target_refs(x)

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/artifacts/','/cohort/','/expectations/','/script/','/reviewedSourceChanges/')) or '/files/' in q or q.endswith('/runDigest') else 'NARRATIVE'

sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/name).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='BOUNDED EMBODIED PUBLIC EXECUTION REVIEW; FINAL QUALIFICATION SEPARATE',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in list(target_refs(v)):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0]*4
vs=[load(P/n) for n in notes];a,b,c,d=vs
assert a['results']==b['results'] and len(a['results'])==7
assert a['cohort']==b['cohort'] and a['expectations']==b['expectations'] and a['limits']==b['limits']
assert a['preservedReceiptEntries']==b['preservedReceiptEntries']==439
for x,y in zip(a['artifacts'],b['artifacts']):assert x['sha256']==y['sha256']
assert len(a['artifacts'])==len(b['artifacts'])==21
for r in a['results']:
 assert (r['checkedOriginals'],r['checkedBoundaries'],r['events'])==(9,6,39)
 assert (r['outputs'],r['semOutputs'])==((15,0) if r['name'] in ['denied','unavailable'] else (21,6))
assert len(c['runs'])==len(d['runs'])==28
assert c['checked']==len(c['checks'])==492 and d['checked']==len(d['checks'])==688
remaining=collections.Counter(d['checks']);remaining.subtract(collections.Counter(c['checks']))
assert all(n>=0 for n in remaining.values())
expected=collections.Counter()
for x,y in zip(c['runs'],d['runs']):
 for k in x:
  if k!='files':assert x[k]==y[k]
 assert len(x['files'])==len(y['files'])==7
 for f,g in zip(x['files'],y['files']):
  assert f['sha256']==g['sha256'] and Path(f['path']).name==Path(g['path']).name
  field=Path(f['path']).name.removesuffix('.cenc.hex')
  expected[x['name']+' current bytes preserved '+field]+=1
assert +remaining==expected and sum(expected.values())==196
assert c['limits']==d['limits']
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
save('unresolved.json',dict(searchScope='Current named files and REV287 indexed backing plus census role hashes; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='EMBODIED EXECUTION REVIEW LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EMBODIED EXECUTION LINEAGE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),bodyRuns=7,bodyArtifactPairs=21,receivingRuns=28,receivingArtifactPairs=196,checksRetained=492,byteChecksAdded=196,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

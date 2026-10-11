"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-ga-structural-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev270/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'GA_CARRIER_CODEC_REVIEW_REV1': 'Eight stored detected mutations protect namespace roles, union membership, lower/upper collection bounds, enum domain, typed recursion, inherited domain and referent origin. Structural codec acceptance does not authenticate actual record relations, identity roles, compiled context, sources or model activation. Earlier missing EMB composition was corrected separately; public qualification has its own evidence.', 'GA_CARRIER_EXPRESSIBILITY_REVIEW_REV1': 'Nine rejected structural mutations cover duplicate records/fields, unknown references, optional list elements, ambiguous unions, unbounded collections, recursion, callables and enum collision.163 records,11 union fields and30 primitive names are symbolic expressibility counts, not semantic relation or numeric identity qualification. Every union member requires its distinct reviewed numeric record identity; later carrier allocation and public qualification are separate gates.', 'GA_REGISTRY_MEMBER_SHAPE_REVIEW_REV1': 'Twelve rejected shape controls preserve distinct stage identities, valid phases/inputs, cognitive protocol isolation, safe body metadata, observer/character separation, missing-leaf rejection, owner scopes, goal predicates, role families and complete member inventory.218 members,67 templates,8 accessors and6 authorities are declaration counts, not invocation work or activated capabilities. Naming does not grant authority; exact compiler permissions, roles, source/phase/output and membership remain separately required.', 'GA_WORK_CEILING_REV1': 'Derived local topology bound:67 templates can invoke80 times with58 outputs in either mutually exclusive lane. Nine repeated stages and two three-parent single joins prevent template or parent counts from substituting for execution work.48 next plus18 disjoint conditional edges yield66 edges and12 real roots; next-only26 roots is wrong. Summed phase totals and peak130/25 checked here. This is local derivation, not observed execution, runtime-slot bound or model ceiling. Final composed92 invocations/239 outputs/228 fresh slots includes inherited work and nested identities; observed21 is not the bound. No model may freeze against80/58 alone.', 'GA_SOURCE_BUDGET_REVIEW_REV1': 'Three detected fixture-coordination controls enforce enrollment even for empty selection, independent cue publication and counting attempted rather than successful work. Actual components do not make fixture sampling/selection/opportunity allocation a public compiler or authenticate successor roles/completion. Failed attempts and absent encoding remain budgeted separately from cue access.', 'GA_SOURCE_BUDGET_REVIEW_REV2': 'The same three controls bind successor sample projection and body-only SEM reservation plus local-reserve baseline. Selection allocation and public completion still remain fixture scope. Repeated controls do not add independent phenomena or select a psychological law. Later public source/budget qualification does not overwrite these earlier source identities.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_CARRIER_CHECKPOINT.md','GA_REGISTRY_MEMBER_SHAPE_REV1.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
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
 assert all(f.get('detected',f.get('rejected')) is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='STORED GA STRUCTURAL FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[8,9,12,0,3,3]
work=load(P/'GA_WORK_CEILING_REV1.json')
for lane in work['gaLocalBound'].values():
 assert sum(lane['byPhase'].values())==lane['events']==80
 assert sum(lane['outputsByPhase'].values())==lane['outputs']==58
 assert max(lane['byPhase'],key=lane['byPhase'].get)=='130' and lane['byPhase']['130']==25
 assert len(lane['repeated'])==9
assert work['method']['graph']['nextEdges']+work['method']['graph']['conditionalEdges']==66
assert sum(j['parentCompletions']-j['invocations'] for j in work['joinConvergence'])==4
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
save('unresolved.json',dict(searchScope='Current named files and REV270 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='SIX GA STRUCTURAL AND BUDGET CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS GA STRUCTURAL HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

"""Reconcile Campaign2 evidence inventories and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-campaign2-inventories-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev292/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CAMPAIGN2_BOUNDED_CLOSURE_INVENTORY.json','CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY.json','CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY_REV2.json','CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY_REV3.json','CAMPAIGN2_VECTOR_CROSSWALK_AUDIT.json','CAMPAIGN2_AUTONOMOUS_ADVERSARIAL_REVIEW.md']
vs=[load(P/n) for n in names[:5]];bounded,a,b,c,cross=vs
assert bounded['descriptorCount']==len(bounded['descriptors'])==175 and bounded['descriptorNegativeCalls']==700
assert len(bounded['entries'])==82 and len(bounded['transitions'])==4
assert bounded['successorCapabilitiesAbsent']==['probe','measurement','memory']
assert (bounded['writablePatterns'],bounded['readOnlyPatterns'])==(5,0)
assert [len(v['productionSources']) for v in [a,b,c]]==[71,76,83]
assert all(len(v['reports'])==18 and v['preservationCount']==166 for v in [a,b,c])
assert a['limitations']==b['limitations']==c['limitations']
deltas=[]
for old,new in [(a,b),(b,c)]:
 d={}
 for field in ['reports','productionSources']:
  x={r['path']:r for r in old[field]};y={r['path']:r for r in new[field]}
  d[field]=dict(added=sorted(y.keys()-x.keys()),removed=sorted(x.keys()-y.keys()),changed=sorted(k for k in x.keys()&y.keys() if x[k]!=y[k]))
 assert len(d['reports']['added'])==len(d['reports']['removed'])==5 and not d['reports']['changed']
 assert not d['productionSources']['removed']
 deltas.append(d)
assert [len(x['productionSources']['changed']) for x in deltas]==[3,6]
assert cross['vectors']==len(cross['rows'])==51 and cross['runtimeVerdict']=='NONE'
expected={f'EVID-{chr(65+i)}' for i in range(20)}|{f'REG-{chr(65+i)}' for i in range(18)}|{f'AD-E{i}' for i in range(1,14)}
assert {r['id'] for r in cross['rows']}==expected and all(r['disposition']=='QUALIFICATION OPEN' for r in cross['rows'])
notes={}
notes[(P/names[0]).as_posix()]='Bounded bridge inventory only:175 descriptors/82 entries/four transitions/five writable and zero read-only patterns.700 negative calls describe a separately executed loop; this inventory does not rerun or pass them. Probe/measurement/memory absent in this profile, despite broader registry semantics. No inference from declared schema to executable capability; no exhaustive behavior or PERSIST-I positive witness.'
for n in names[1:4]:notes[(P/n).as_posix()]='Source/packet currency snapshot, not semantic sufficiency or binary identity.18 report identities remain selected; each successor replaces five report versions, with thirteen entries unchanged. Production inventory71->76->83 adds prediction then task files, while three then six retained paths change hashes. Earlier snapshots remain historical, not current-source claims.166 preservation entries do not count behavioral tests. Nested report source fingerprints checked as well as outer report hashes. Later scoped qualification separately supplies behavioral evidence.'
notes[(P/names[4]).as_posix()]='Exact51-ID crosswalk covers EVID-A..T,REG-A..R,AD-E1..13; every row QUALIFICATION OPEN and runtimeVerdict NONE.25 named evidence-file paths are existence references, not hashed historical test bytes or vector passes. ADAPT A-D, packaging and complete PRJ/IDN/OBS/SEM inventory excluded. Later inherited/current qualification must provide semantic sufficiency; inventory cannot close it.'
notes[(P/names[5]).as_posix()]='Chronological autonomous self-review, explicitly not owner/planning-agent verdict. Preserves actual shared projection-instance and reentrancy correction; genuine regulatory/practice routing instead of relabelled-source confound; six-stage failure rollback and four removable-fault continuations without pretending invalid models repair. Occurrence identity may flow to identity output, not adaptation magnitude; trusted JavaScript noninterference unproved. Independent72 arithmetic cases/six substitutions remain scoped. REG-E D=0 guard before arithmetic closes a missed proof/implementation boundary with zero arithmetic calls on mismatch; two-variable generic evidence differs from one-variable public profile. Final finite AD-E passes do not alone close whole thin causal event or Campaign2. Later inherited/factory qualifications supply scoped composition; former open milestones preserved as history.'
chain=[ref(P/n) for n in ['CAMPAIGN2_INHERITED_CURRENT_REVIEW.md','CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md','CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md']]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):
 if p.endswith('.md'):return 'NARRATIVE'
 return 'NARRATIVE' if q in ['/status','/runtimeVerdict','/coverageScope'] or q.startswith(('/limitations/','/limits/','/successorCapabilitiesAbsent/')) or q.endswith('/disposition') else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT CAMPAIGN2 INVENTORY SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL INVENTORY OR SELF-REVIEW; SCOPED QUALIFICATION SEPARATE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)
for p in cross['evidenceFiles']:assert Path(p).is_file(),p
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('deltas.json',dict(revisions=deltas,scope='Exact inventory changes, not new executed tests.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV292 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='CAMPAIGN2 INVENTORY LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),deltas=ref(O/'deltas.json'),limits=['Inventory counts and references are not runtime verdicts or semantic sufficiency.','All nested path/hash bindings searched; unresolved original sources retain exact identities and dependent reproducibility limits.','Historical self-review is scoped separately from owner verdicts and later composition; no runtime or historical assay rerun. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CAMPAIGN2 INVENTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),inventoryRevisions=3,crosswalkVectors=51,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

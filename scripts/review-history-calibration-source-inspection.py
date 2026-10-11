"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-calibration-source-inspection-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev277/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'ATTENTION_CALIBRATION_REFERENCE_CORRECTION_REV1': 'Exact draft correction: three Calibration fields change GovernedContentDefinitionId to existing DefinitionId with corresponding role-family/requirement changes;136 other fields and4 map-key positions remain unchanged. Fresh structural parity checks verify these counts and removal of old review/fault/source claims from roleREV2. These are distinct identity families, not encodings or aliases. Exact definition purpose/schema/model membership remains compiler responsibility. No allocation, public runtime change, frozen model rewrite or transfer of old mutation reviews to new bytes.', 'ATTENTION_CONCERN_SOURCE_INSPECTION_REV2': 'Source inspection and draft sequence explicitly NOT ACS-A..L passed. Capacity2 allows one task plus forecast, capacity1 one task without forecast; capacity3 can select two. Preactivation measurement avoids completing the known-zero task. Actual M1 prediction update140 must precede workspace40 by a committed instant. Existing whole cognitive adapter continues beyond concern, requiring separately governed terminal restriction, not truncation of frozen whole-choice semantics. Measurement/task/prediction descendants and deadline remain work/replay obligations; three local stages are not total source cost. Forecast/status/time are not authored receiver evidence. Later bounded GA qualification supplies actual source evidence independently; TaskConcern is not general Affect.'}
chain=[ref(P/n) for n in ['ATTENTION_CALIBRATION_REFERENCE_CORRECTION.md','ATTENTION_CONCERN_SOURCE_REVIEW_REV2.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
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
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='STORED CALIBRATION SOURCE INSPECTION FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0]
oldW=load(P/'ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json');newW=load(P/'ATTENTION_MEMORY_WRAPPER_INVENTORY_REV2.json')
oldR=load(P/'ATTENTION_MEMORY_IDENTITY_ROLES_REV1.json');newR=load(P/'ATTENTION_MEMORY_IDENTITY_ROLES_REV2.json')
targets={'EncodingEvaluation','RetainedEncoding','SpatialPreparation'}
a={(r['name'],f['name']):f for r in oldW['records'] for f in r['fields']};b={(r['name'],f['name']):f for r in newW['records'] for f in r['fields']}
assert a.keys()==b.keys() and len(a)==139
changes=[]
for k,v in a.items():
 if v==b[k]:continue
 assert k[0] in targets and k[1]=='Calibration' and v['type']==dict(kind='ref',name='GovernedContentDefinitionId')
 copy=json.loads(json.dumps(v));copy['type']['name']='DefinitionId';assert copy==b[k];changes.append('.'.join(k))
assert sorted(changes)==sorted(load(P/'ATTENTION_CALIBRATION_REFERENCE_CORRECTION_REV1.json')['changedFields'])
for x,y in zip(oldR['fields'],newR['fields']):
 if x==y:continue
 assert x['record'] in targets and x['field']=='Calibration'
 copy=json.loads(json.dumps(x));copy['validation']['family']='DefinitionId';copy['validation']['requirement']='existing DefinitionId role unchanged';assert copy==y
assert len(oldR['fields'])==len(newR['fields'])==139 and oldR['mapKeys']==newR['mapKeys'] and len(newR['mapKeys'])==4
assert not any(k in newR for k in ['review','faults','sources'])
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
save('unresolved.json',dict(searchScope='Current named files and REV277 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='TWO CALIBRATION AND SOURCE INSPECTION RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CALIBRATION SOURCE INSPECTION HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

"""Reconcile development allocation copies and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-allocation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev291/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
paths=[Path('docs/formal/DEVELOPMENT_PUBLIC_ALLOCATION_TABLE.json'),P/'development-public-dev1/DEVELOPMENT_PUBLIC_ALLOCATION_TABLE.json',P/'development-public-dev2/DEVELOPMENT_PUBLIC_ALLOCATION_TABLE.json']
assert len({ref(p)['sha256'] for p in paths})==1
v=load(paths[0]);assert v['namespace']==1155 and v['version']=='development-public-allocation/0.1-candidate'
assert [r['typeId'] for r in v['records']]==list(range(1493,1509)) and all(r['schemaVersion']==1 for r in v['records'])
contract=Path('docs/formal/DEVELOPMENT_PUBLIC_CONTRACT.md');assert ref(contract)['sha256']==v['contractSha256']
records={r['typeId']:r for r in v['records']}
assert [f['name'] for f in records[1493]['fields']]==['Version','Curve','Learning','Formation','Constitution']
assert [f['name'] for f in records[1498]['fields']]==['At','Phase','Contribution','Gain','Delta']
assert records[1497]['fields'][0]['type']=={'list':'unitQ','min':0,'max':1}
assert records[1494]['fields'][6]['type']=={'list':'bool','min':0,'max':1}
assert records[1508]['fields'][1]['type']=='data'
notes={p.as_posix():'Exact duplicate of accepted development-public allocation0.1:16 schema1 records1493..1508 and reused namespace1155. The two development archive copies are retained lineage, not alternate schemas or new qualification. Independent Learning/Formation flags and roots preserve skill/belief versus personality authorship. Optional report/estimate preserves absent versus negative/known zero. Formation entry preserves event-time phase, gain, contribution and applied delta, not refolding when age changes. DiagnosticRow data is diagnostic output, not a writable cognitive leaf. Field names/types are backing declarations; ownership, ordered execution, safe observation and restoration require the separately qualified contract/runtime. Immutable constitution is separate and has no new writer. Controlled phase0..4 is not calendar ageing or a universal developmental law.' for p in paths}
chain=[ref(contract)]+[ref(P/n) for n in ['CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_COMPONENT_FINDINGS.md']]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  else:
   for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'NARRATIVE' if q=='/status' else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT DEVELOPMENT ALLOCATION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='ACCEPTED DEVELOPMENT ALLOCATION AND EXACT ARCHIVED COPIES',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)
for p in paths:bind(p.as_posix(),dict(path=contract.as_posix(),sha256=load(p)['contractSha256']))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV291 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='DEVELOPMENT ALLOCATION COPIES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Three allocation files are identical and contract-bound; declarations are not runtime or behavioral proof.','Learning plasticity and personality authorship remain independent. Controlled phases do not qualify general ageing.','Both development cohorts and later native qualification retain their separate evidence. No runtime rerun; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DEVELOPMENT ALLOCATION ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),identicalCopies=3,recordTypes=16,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

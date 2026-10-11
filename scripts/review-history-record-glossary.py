"""Reconcile historical record glossary and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,re,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-record-glossary-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev299/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CURRENT_RECORD_GLOSSARY.json','CURRENT_RECORD_GLOSSARY.md'];v=load(P/names[0]);md=(P/names[1]).read_text()
pc=load(O/'packet-check.json');assert pc['status']=='PASS READ-ONLY HISTORICAL GLOSSARY' and pc['checkerSha256']==ref('scripts/check-history-record-glossary.mjs')['sha256']
assert len(v['records'])==v['recordSchemaPairs']==298 and len({r['id'] for r in v['records']})==297
assert [r for r in v['records'] if r['id']=='373']==[dict(id='373',version=str(i),name='TaskCommitmentState') for i in [1,2]]
assert len(v['namespaceSources'])==18
namespaceRows=[line for line in md.splitlines() if line.startswith('| 1') and '/' not in line.split('|')[1]]
assert len(namespaceRows)==85
notes={
(P/names[0]).as_posix():'Historical scoped reading aid, not allocation authority or whole-repository inventory.298 record/schema pairs over297 type IDs;TaskCommitmentState373 has versions1/2, not a collision. Current cognitive receiving codec names and all field-number/name rows exactly match the stored pair of glossary files. Eighteen namespace-source fingerprints are separate provenance. Names/IDs/schema declarations do not establish executable behavior or psychological coverage.',
(P/names[1]).as_posix():'Generated descriptive Markdown with298 schema rows and85 namespace rows. Exact codec field-number/name parity checked read-only; frozen formal tables remain authority. Shared namespace admitted role names do not alias identity families or grant permissions. Scheduling phases are not record IDs; high frontier452 never meant452 implemented schemas.27/26 denotes event count versus insufficient work budget, not a schema count. This dated reading aid is not the current whole Campaign3 catalog and its older title must not widen scope.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','CAMPAIGN3_ENTRY_READINESS.md']]+[ref('scripts/generate-current-record-glossary.mjs')]
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
def kind(p,q):return 'NARRATIVE' if p.endswith('.md') else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT RECORD GLOSSARY SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='DATED SCOPED READING AID; FORMAL ALLOCATION AUTHORITY SEPARATE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

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
save('unresolved.json',dict(searchScope='Current named paths, REV299 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='HISTORICAL RECORD GLOSSARY RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),packetCheck=ref(O/'packet-check.json'),limits=['Scoped cognitive codec name/field parity verified without regenerating glossary or running runtime.','No claim of current whole-repository inventory, new semantic permissions or behavior from names.','Original dated glossary and formal authority remain distinct; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS RECORD GLOSSARY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),schemaPairs=298,distinctTypes=297,namespaceRows=85,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

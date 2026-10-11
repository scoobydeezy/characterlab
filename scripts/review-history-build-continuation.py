"""Reconcile build metadata and factory continuation receipts and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-build-continuation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev294/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CAMPAIGN2_BUILD_METADATA_PROOF.json','CAMPAIGN2_FACTORY_CONTINUATION_PROOF.json']
v=load(P/names[0]);r=load(P/names[1])
assert [x['target'] for x in v['results']]==['baseline','src/campaign2/adaptationRuntime.ts','src/campaign2/factory.ts']
assert [x['status'] for x in v['results']]==['PASS','DETECTED','DETECTED']
byteChecks=[]
for i,x in enumerate(v['results']):
 a,b=x['pair'];assert a['exposed'] is False and b['exposed'] is True
 assert a['inventoryTypes']==[] and b['inventoryTypes']==[str(n) for n in range(110,118)]
 assert a['model']==b['model'] and a['field9']==a['empty']=='0700' and a['restored']==a['save']
 if i==0:assert a['save']==b['save']==b['restored'] and b['field9']==b['empty']
 if i==1:assert a['save']!=b['save'] and b['field9']!=b['empty'] and 'restored' not in b
 if i==2:assert a['save']==b['save'] and b['field9']==b['empty'] and 'restored' not in b
 for member in x['pair']:
  for k in ['model','save','restored','field9','empty']:
   if k in member:
    raw=bytes.fromhex(member[k]);assert raw.hex()==member[k]
    byteChecks.append(dict(target=x['target'],exposed=member['exposed'],field=k,bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest()))
assert r['processes']==2 and r['originalInitialStateTransferred'] is False
assert r['checkpointRoundTrip']==r['continuedFullSave']=='byte-identical' and r['finalSaveBytes']==6744
notes={
(P/names[0]).as_posix():'Bounded build-inventory exclusion assay:zero/eight RNG schemas exposed without changing codec support or ModelIdentity. Exact stored baseline saves868bytes and restored bytes equal. Runtime substitution inserts build schema IDs into field9, enlarges save to884bytes and restore rejects; factory substitution leaves save equal but restore rejects. Two concrete alternatives detected, not exhaustive build independence. No RNG consumer/draw fabricated; PERSIST-I positive witness remains deferred at this checkpoint. Source hashes are preservation diagnostics, not binary identities.',
(P/names[1]).as_posix():'Historical two-process FCT5 restricted-facade continuation:checkpoint and final save reportedly byte-identical,6744bytes; originalS0not transferred. Current writer inspection confirms model/input/checkpoint handoff and deletes temporary expected/actual bytes after comparison, but receipt has no historical writer hash or full save. Stored digest alone cannot independently reconstruct original execution. No fresh process run, complete transition trace or release qualification implied. Later bounded persistence and factory qualification have separate proof.'}
chain=[ref(P/n) for n in ['CAMPAIGN2_BOUNDED_PERSISTENCE_QUALIFICATION_REVIEW.md','CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md']]
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
 return 'BACKING' if q.startswith('/sourceFingerprints/') or q.endswith(('/model','/save','/restored','/field9','/empty','/finalSaveSha256')) or '/inventoryTypes/' in q else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT BUILD METADATA SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='BOUNDED EXCLUSION OR HISTORICAL FACADE CONTINUATION',judgment=n,acceptanceChain=chain))
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
save('byte-checks.json',dict(rows=byteChecks,scope='Exact stored byte equality and lengths, not current runtime replay.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV294 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='BUILD AND CONTINUATION RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),byteChecks=ref(O/'byte-checks.json'),currentInspectionSources=[ref(p) for p in ['scripts/prove-campaign2-build-metadata.mjs','scripts/prove-campaign2-factory-continuation.mjs','src/test/fixtures/campaign2BuildMetadata.ts']],limits=['Complete build-assay hex compared; no model execution or historical writer rerun.','Factory continuation receipt omits full save and historical writer fingerprint; current writer inspection is not exact old-source recovery.','Empty RNG-relevant projection is bounded exclusion, not positive RNG-consuming PERSIST-I or exhaustive build independence. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS BUILD AND CONTINUATION ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),buildInterventions=3,storedByteFields=len(byteChecks),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

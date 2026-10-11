"""Exact symbolic/type/allocation continuity with historical inventory scope retained."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-inventories-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
specs={
 'CAMPAIGN3_EMBODIED_SYMBOLIC_INVENTORY_REV1.json':'28 named layouts and three symbolic unions only, with exact field types/vocabulary/witness still open at that revision. One shared body registry prevents duplicate binding authority. Subsequent type inventory adds explicit channel identity, changes exclusive output schema references, adds two union records and distinct retained-sample ingress. Existing supporting component hashes establish their own scope, not public EMB vectors. Original12-link/446-preservation count is historical.',
 'CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json':'Fresh original generator reproduces31 records/124 fields, recursive type-reference resolution and required/forbidden union coverage. EmbodiedSample remains a closed schema alias; PressureResult/LevelChainCarrier are actual records. No allocation, numeric tags or production codec admitted here. Fields follow exact id roles and canonical set/map grammar; role/value refinements remain governed by the paired field review.',
 'CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json':'Preserves every REV1 record/field and adds only four-field LevelBinQuantization, yielding32 records/128 fields. Trace-only hidden InputLevel, capacity, bin width and bin index do not create cognitive evidence, occurrence identity or persistent state. Exact ordered names/types/required flags match later permanent allocation453..484; symbolic UNALLOCATED markers retain their historical meaning.',
 'CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json':'27 proposed exact members,8 event/phase rows,9 kind/version/schema dispatch rows and two failure symbols. Membership/target schema parity holds against later allocation; original35-file zero-collision scan predates allocation and is not rerun as a current condition. RegistryKind selects typed grammar, not generic callback or rule-string authority. Single fuel token does not establish SI conversion; no new allocator inferred from later1142 occurrence namespace.',
 'CAMPAIGN3_EMBODIED_MODEL_PACKAGING_REV1.json':'Fresh original inventory decode reproduces297 inherited declarations,78 union entries and70 discarded executable/other entries; proposed329 descriptors82 unions14 other entries total425.45 exact role positions preserve writable455 and readonly268/key grammars, four occurrence schemas and empty routes. Descriptor inheritance is not executable admission. Nine-input/seven-run proposal does not itself freeze bytes or qualify runtime. The exact458/1 input spelling is superseded by accepted459/1 correction; historical bytes stay unchanged.'
}
specs={(P/k).as_posix():v for k,v in specs.items()}
prior=load(P/'campaign3-history-source-roles-rev138/index.json');known={x['path'] for x in prior['roleAssignments']};assert not set(specs)&known
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
sym=load(P/'CAMPAIGN3_EMBODIED_SYMBOLIC_INVENTORY_REV1.json');t1=load(P/'CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json');t2=load(P/'CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json');v=load(P/'CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json');pack=load(P/'CAMPAIGN3_EMBODIED_MODEL_PACKAGING_REV1.json');alloc=load(P.parent/'formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json')
assert len(sym['records'])==28 and len(sym['unions'])==3
assert len(t1['records'])==31 and sum(len(r['fields']) for r in t1['records'])==124
assert t2['records'][:-1]==t1['records'] and t2['records'][-1]['name']=='LevelBinQuantization'
assert len(t2['records'])==32 and sum(len(r['fields']) for r in t2['records'])==128
by1={x['name']:x for x in t1['records']}
for r in sym['records']:
 fields=r['orderedFields'][:]
 if r['name']=='LevelChannelDefinition':fields.insert(0,'ObservationChannelId')
 if r['name']=='LevelSampleOutputChoice':fields=['PresentOutputSchema','UnavailableOutputSchema']
 assert fields==[f['name'] for f in by1[r['name']]['fields']]
for name in ['typeAliases','externalSchemaReferences','identityRoles','unionMatrices','numericTags']:assert t1[name]==t2[name]
byalloc={r['name']:r for r in alloc['records']};fieldCrosswalk=[]
for r in t2['records']:
 a=byalloc[r['name']];assert a['schemaVersion']==1
 assert r['fields']==[{k:f[k] for k in ['name','type','required']} for f in a['fields']]
 assert [f['id'] for f in a['fields']]==list(range(1,len(r['fields'])+1))
 fieldCrosswalk.append(dict(name=r['name'],typeId=a['typeId'],fields=len(r['fields'])))
assert sorted(r['typeId'] for r in fieldCrosswalk)==list(range(453,485))
assert {name:[dict(typeId=byalloc[n]['typeId'],schemaVersion=1) for n in schemas] for name,schemas in t2['typeAliases'].items()}==alloc['typeAliases']
memberKey=lambda ns,payload:(ns,json.dumps(payload,separators=(',',':')))
members={memberKey(m['namespace'],m['payload']) for m in alloc['members']}
assert len(v['members'])==27 and len({(m['existingNamespace'],m['payload']) for m in v['members']})==27
for m in v['members']:assert memberKey(m['existingNamespace'],m['payload']) in members
assert len(v['dispatch'])==9 and len(v['events'])==8
for d in v['dispatch']:
 assert memberKey(1023,d['kind']) in members and d['schema'] in byalloc
 assert d['targetVersion'].endswith('/0.1-candidate')
assert [e['phase'] for e in v['events']]==[10,11,12,13,14,60,60,110]
for e in v['events']:assert memberKey(1001,e['payload']) in members
assert v['newFailureSymbols']==alloc['newFailureCodes']
roles=[dict(type=r['recordTypeId'],field=r['fieldId'],position=r['position'],namespace=r['requiredNamespace']) for r in alloc['roles']+alloc['mapKeyRoles']]
roles += [dict(type=t,field=f,position=p,namespace=n) for t,f,p,n in [(267,1,'RecordField',1002),(268,1,'StateMapKey',1000),(227,1,'RecordField',1106),(227,2,'RecordField',1000)]]
assert roles==pack['proposed']['rolePositions'] and len(roles)==45
assert pack['inherited']['schemaPairs']==297 and len(pack['inherited']['unionEntries'])==78
assert pack['inherited']['discardedExecutableAndOtherEntries']==70
assert pack['proposed']['slot0Items']==329+82+14==425
assert pack['proposed']['inputOuterEntry'][3]=='exact458/1 or478/1 Payload'
correction=P.parent/'formal/EMBODIED_PACKAGING_INPUT_REFERENCE_CORRECTION.md'
assert 'superseded by459/1 and478/1 respectively' in correction.read_text(encoding='utf-8')
assert byalloc['LevelSamplingOpportunity']['typeId']==459 and byalloc['LevelChannelDefinition']['typeId']==458 and byalloc['ReserveReplenishmentInput']['typeId']==478
fresh=[]
for n in ['typed.json','packaging.json']:
 x=load(O/n);assert x['status']=='PASS'
 for k in ['original','checker']:assert ref(x[k]['path'])==x[k]
 fresh.append(ref(O/n))
chain=fresh+[ref(correction)]+[ref(P/n) for n in ['campaign3-history-embodied-packet-rev1/review.json','campaign3-history-embodied-contracts-rev1/review.json','campaign3-history-embodied-reserve-rev1/review.json']]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='SYMBOLIC / TYPED / VOCABULARY / PACKAGING INVENTORY',judgment=j,acceptanceChain=chain))
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  assert path and ref(path)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location']['pointer'];assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],ptr]==u['text']
  narrative=ptr.startswith(('/status','/openGates','/limitation','/remaining','/numericTags','/semantics','/correction'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='EMB MACHINE INVENTORIES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,fieldCrosswalk=fieldCrosswalk,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh typed generator and inherited packaging decode exactly reproduce original receipts, not public runtime tests. Prior reserve execution remains separately scoped evidence.','Historical12-link/35-file vocabulary scan counts retained; no current filesystem collision claim. Short names,types,members and statuses were examined through complete schema traversal, not merely the three-word census.','Input458 spelling is preserved and explicitly superseded by459; current publication cannot consume a channel definition as a source event.','No new model/law/allocation/verdict/corpus/obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),allocatedRecords=32,allocatedFields=128,vocabularyMembers=27,dispatchRows=9,packagingRoles=45,checker=ref(__file__))
for n,x in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==x
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

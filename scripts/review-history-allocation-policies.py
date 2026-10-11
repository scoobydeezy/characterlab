"""Historical rich allocation policies and exact archived aliases."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-allocation-policies-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'EMBODIED_RECEIVING':(31,110,49,'Mixed body/task receiving preserves31 typed records and inherited source identities, target kinds and record/map-key roles. No new namespace; accepted proposal and prior source hashes retained. Append-only permanence does not make numeric adjacency semantic. Allocation approval leaves model packaging and behavior gates separate.'),
'EMBODIED_RESERVE':(32,128,43,'Root455/1 maps qualified CharacterId to454 ReserveAnchor under embodied-reserve authority. EmbodiedSample is an exact alias, not a third union. Union payload lists exclude discriminator1 while schemas require it. Shared runtime allocator does not follow merely from occurrence extraction. No invented logical-family leaf, fuel conversion or widened fixture pulse. Content170,packaging/save gates were later work; primary-agent numeric review is not external review.'),
'MEASUREMENT_EVIDENCE_CARRIAGE':(6,23,6,'Typed observer measurement carriage; occurrence-map rows reuse registry authority. No new LearningRoute member,state root,CharacterId/observation family,evidence store,union variant or domain validator. Runtime implementation excluded from this allocation gate. Safe evidence carriage is not truth access.'),
'MEASUREMENT_MEMORY':(14,41,15,'Root346/1,key344,value345,formation authority and measurement-episode leaf retain episodic-memory topology adaptation-input/0.31. No removal allowed in this profile. No CueId/MemoryEpisodeId/formation/padding identities,stage-policy certificate,new projection kind,write capability,save field or concrete RecallDelay value. ValidatedPendingGeneratedAssociation remains a runtime type,not new canonical record. Allocation does not execute retention/recall.'),
'MEASUREMENT_PREDICTION':(11,45,15,'Historical first prediction allocation; its mistaken275 occurrence reference is explicitly superseded by the separate occurrence correction:367/2 forced-absent retired field,368/2 reference and shared278 under279/3. Preserve original367/1 and368/1 bytes. No new application/cue/observation identity,learning route,evidence variant,state-family or changed old model. Runtime/PRED qualification excluded; numeric existence did not establish semantic role.'),
'MEMORY_WRAPPER':(3,9,0,'Three typed wrapper records preserve342..355 and profile-fixed empty static bindings. No generic CanonicalValue,heterogeneous set,anonymous list wrapper identity,projection-set identity,new registry kind or semantic-bundle entry. Namespaces/members absent by explicit role,not accidental omission. Packaging/runtime controls remain separate from numeric consistency.'),
'TASK_COGNITIVE':(76,244,103,'DefinitionId is shorthand for1027,not a new identity family. Explicit373/schema2 appends field2 while373/schema1 remains unchanged. Existing259 UnionVariantId uses canonical unsigned pair and payload fields exclude discriminator. No new comparison-key role,standalone coverage operand or second occurrence allocator. Numeric adjacency has no meaning. Model materialization and runtime gates remain distinct from internal numeric review.')}
archive={a['original']:a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];sources={};pairs={};bindings=[];inventories=[]
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:
   actual=v['path']
   if actual=='docs/formal/CANONICAL_RECORD_REGISTRY.md' and v['sha256']=='6f95e9f59ce3a66e4acd6de9cdc1b1a77e4893ca537a6286577d54717ea82474':actual=(P/'campaign3-history-allocation-corrections-rev1/CANONICAL_RECORD_REGISTRY.historical.md').as_posix()
   assert sha(actual)==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256'],resolvedPath=actual))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for stem,(rc,fc,mc,j) in specs.items():
 p=(F/(stem+'_ALLOCATION_TABLE.json')).as_posix();v=load(p);a=archive[p];assert v['status']=='PERMANENT AND FROZEN';assert len(v['records'])==rc and sum(len(r['fields']) for r in v['records'])==fc and len(v['members'])==mc;scan(v)
 assert len(set((r['typeId'],r['schemaVersion']) for r in v['records']))==rc
 for r in v['records']:
  assert set(r)=={'typeId','schemaVersion','name','fields'} and type(r['typeId']) is int and type(r['schemaVersion']) is int
  assert [f['id'] for f in r['fields']]==list(range(1,len(r['fields'])+1))
  for f in r['fields']:assert set(f)=={'id','name','type','required'} and type(f['required']) is bool and isinstance(f['type'],str)
 inventories.append(dict(path=p,version=v['version'],records=[dict(typeId=r['typeId'],schemaVersion=r['schemaVersion'],name=r['name'],fields=len(r['fields'])) for r in v['records']],declarationFields=fc,members=mc))
 chain=[ref(P/'public-wrapper-quiescence-rev1/PRESERVATION.json'),ref(P/'campaign3-history-allocation-corrections-rev1/review.json')]
 if isinstance(v.get('authority'),str):assert Path(v['authority']).exists();chain.append(ref(v['authority']))
 elif 'shape'in v:chain.append(v['shape'])
 for q in [p,a['archive']]:
  assert sha(q)==a['sha256']==entries[q]['sha256'];sources[q]=v
  roles.append(dict(path=q,sha256=sha(q),role='WHOLE HISTORICAL ALLOCATION POLICY' if q==p else 'EXACT ARCHIVED POLICY ALIAS',judgment=j+(' Exact pre-repair archive shares declared semantics only; no additional qualification or execution.' if q!=p else ''),acceptanceChain=chain))
  if q!=p:pairs[q]=p
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/notes','/excluded','/acceptance','/permanence')) or ptr.endswith(('/owner','/precedence','/allocator','/origin'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='POLICY / EXCLUSION / HISTORICAL LIMIT' if narrative else 'TYPED DECLARATION BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-001','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='14 RICH ALLOCATION POLICY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,inventories=inventories,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Whole declared policies and source provenance,not new executable conformance or behavioral qualification.','Source fields contain historical exclusions; later qualified source scopes must be established separately.','Old prediction occurrence defect remains preserved; corrected authority is separately reviewed.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('POLICY') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

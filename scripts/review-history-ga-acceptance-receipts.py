"""Review acceptance receipts as static evidence, preserving their exact source chain."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-acceptance-receipts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev188/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
notes={}
for kind in ['CARRIER','REGISTRY_MEMBER','WRITE_SCOPE']:
 for mode in ['SHAPE','ALLOCATION']:
  p=(F/f'GENERAL_ATTENTION_{kind}_{mode}_MANIFEST.json').as_posix()
  notes[p]=f'{kind} {mode} acceptance identity/chronology. Exact referenced paths and hashes bind reviewed artifacts; list inclusion is not whole-source scientific acceptance. '+('Shape authorization precedes permanent numbers; OPEN runtime/profile gates were accurate at that checkpoint and later qualified only within bounded GA scope.' if mode=='SHAPE' else 'Permanent assignments freeze reviewed proposal; they do not activate runtime or select psychological laws.')
names=[('GA_CARRIER_ALLOCATION_REVIEW_REV1.json',16,20,'Exact163 records523 fields38 field-enums11 distinct unions165 roles6 namespaces. Faults target collisions/omissions/renumbering/types/optionality/tags/union aliases/namespaces/payloads/roles/ownership and early permanence. Five output-owner annotations do not prove actual output execution.'),('GA_REGISTRY_MEMBER_ALLOCATION_REVIEW_REV1.json',8,21,'218 exact NFC nonempty member payloads in eight existing namespace families;zero new records/namespaces. Faults target substitution,omission,renaming,duplication,smuggled allocation,early permanence and prior-member reuse. Member names confer no authority.'),('GA_WRITE_SCOPE_ALLOCATION_REVIEW_REV1.json',7,22,'705/706 two records13 fields3roles;exact322/705 closed union and boundary metadata. Faults target old type reuse,field renumber,union alias,role namespace,stage tag,new member and omitted boundary. Frozen704 remains distinct.')]
faults=[];bindings=[];priorBindings=[]
for n,count,prior,note in names:
 p=P/n;v=load(p);assert len(v['faults'])==count and all(x['rejected'] for x in v['faults']) and v['priorArtifactsPreserved']==prior
 notes[p.as_posix()]=note+' Original assert.throws over independently cloned numeric proposals is static rejection evidence; no scheduler,codec runtime,rollback or persistence witness and no fresh fault execution.'
 script=next(x for x in v['sources'] if x['path'].endswith('.mjs'));assert ref(script['path'])==script
 code=Path(script['path']).read_text();assert 'structuredClone(' in code and 'assert.throws(()=>audit(' in code
 for x in v['faults']:assert "'"+x['name']+"'" in code;faults.append(dict(owner=p.as_posix(),**x))
 proposal=load(v['sources'][0]['path']);assert len(proposal['priorAllocations'])==prior
 for x in proposal['priorAllocations']:assert ref(x['path'])==x;priorBindings.append(dict(owner=v['sources'][0]['path'],**x))
for p in notes:
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256'],p
 v=load(p)
 for x in v.get('files',v.get('sources',[])):assert ref(x['path'])==x;bindings.append(dict(owner=p,**x))
assert len(faults)==31 and len(priorBindings)==63
previous=next(x for x in ix['roleAssignments'] if x['path']=='docs/planning/GA_OUTPUT_DECLARATIONS_REVIEW_REV2.json')
assert ref(previous['path'])['sha256']==previous['sha256']
for x in previous['evidence']:assert ref(x['path'])==x
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
schema=[]
for p in notes:
 for pointer,s in walk(load(p)):schema.append(dict(source=p,pointer=pointer,text=s,role='NARRATIVE STATUS/LIMIT' if pointer.split('/')[1] in ['status','limits','publicRuntime','generalAttention','numericAllocation'] else 'VERSION/PATH/HASH/FAULT LABEL BACKING'))
chain=[ref(P/'campaign3-history-ga-public-contracts-rev1/review.json'),ref(P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md')]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  category='NARRATIVE' if u['location']['pointer'].split('/')[1] in ['status','limits','publicRuntime','generalAttention','numericAllocation'] else 'BACKING';counts[category]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=notes[u['source']]))
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=schema))
save('review.json',dict(status='NINE GA ACCEPTANCE RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**ref(p),role='HISTORICAL STATIC ACCEPTANCE RECEIPT; NOT RUNTIME PROOF',judgment=n,acceptanceChain=chain) for p,n in notes.items()],rows=rows,exactBindings=bindings,priorAllocationBindings=priorBindings,recordedFaults=faults,priorOutputReview=previous,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['31 recorded static mutation rejections; current source inspection confirms cloned proposals/assertion guards but no old writer rerun.63 prior bindings are reference occurrences over20/21/22 scopes, not63 unique allocation tables.','Already-reviewed output declaration receipt is rebound, not counted twice. Numeric draft/table contents require separate scope review beyond these receipts.','Later GA qualified scope does not turn static tests into runtime branch witnesses. No scientific reduction,model/allocation/verdict/corpus or obligation change.','Historical source gaps,formula provenance,legacy log and independent adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED ACCEPTANCE RECEIPT RECONCILIATION',sources=9,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(schema),exactBindings=len(bindings),priorAllocationBindings=63,recordedStaticFaults=31,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

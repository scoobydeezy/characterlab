"""Reconcile historical allocation proposals with their exact accepted successors."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');O=P/'campaign3-history-cognitive-allocation-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev182/index.json';ix=load(ip)
paths=[str(P/n) for n in ['TASK_COGNITIVE_ALLOCATION_DRAFT.json','TASK_COGNITIVE_ALLOCATION_DRAFT.md','TASK_COGNITIVE_ALLOCATION_AUDIT.json','TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_DRAFT.json']]+['docs/formal/'+n for n in ['TASK_COGNITIVE_ALLOCATION_FREEZE_AUDIT.json','TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_AUDIT.json','TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_TABLE.json']]
paths=[Path(p).as_posix() for p in paths]
draft=load(paths[0]);audit=load(paths[2]);frozen=load('docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json')
excluded={'version','status','acceptance','reviewedDraftArtifacts','unionDefinitions'}
assert {k:v for k,v in draft.items() if k not in excluded}=={k:v for k,v in frozen.items() if k not in excluded}
assert set(frozen)-set(draft)=={'acceptance','reviewedDraftArtifacts','unionDefinitions'}
assert frozen['unionDefinitions']==audit['unionDefinitions'] and len(frozen['unionDefinitions'])==17
assert len(draft['records'])==76 and sum(len(r['fields']) for r in draft['records'])==244
assert len(draft['members'])==103 and len(draft['roles'])==52
assert [r['typeId'] for r in draft['records']]==list(range(377,453))
text=Path(paths[1]).read_text(encoding='utf-8-sig');sections=re.split(r'^## ',text,flags=re.M)[1:]
for section,r in zip(sections[:77],draft['records']+draft['schemaSuccessors']):
 lines=section.splitlines();assert lines[0]==f"{r['typeId']}/{r['schemaVersion']} {r['name']}"
 fields=[]
 for line in lines[1:]:
  if re.match(r'^\| \d+ \|',line):
   a,b,c,d=[x.strip() for x in line.strip('|').split('|')];fields.append(dict(id=int(a),name=b,required=c=='true',type=d))
 assert fields==r['fields'],r['name']
members=[]
for line in sections[78].splitlines():
 if re.match(r'^\| \d+ \|',line):
  a,b=[x.strip() for x in line.strip('|').split('|')];members.append(dict(namespace=int(a),payload=json.loads(b)))
assert members==draft['members']
ld=load(paths[3]);lf=load(paths[6]);skip={'version','status','reviewedProposal','acceptance'}
assert {k:v for k,v in ld.items() if k not in skip}=={k:v for k,v in lf.items() if k not in skip}
assert lf['records']==lf['namespaces']==[] and lf['members']==[dict(namespace=1032,payload='leaf/task-instruction')]
assert lf['members'][0] not in draft['members']
assert lf['mapping']==dict(logicalFamilyNamespace=1031,logicalFamily='prospective-commitments',rootStateTypeId=373,schemaVersion=2,fieldId=2,readOnly=True)
assert draft['schemaSuccessors'][0]['fields'][1]['name']=='AdoptedInstructions'
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];leaves=[]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def bind(v,owner):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):
   original=v['path'];actual=original if Path(original).exists() and ref(original)['sha256']==v['sha256'] else archives.get(v['sha256'])
   assert actual and ref(actual)['sha256']==v['sha256'],v
   bindings.append(dict(owner=owner,original=v,actual=ref(actual)))
  for x in v.values():bind(x,owner)
 elif isinstance(v,list):
  for x in v:bind(x,owner)
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
for p in paths:
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p);bind(v,p);leaves.extend(dict(source=p,pointer=q,value=s) for q,s in walk(v))
note='Numeric/declaration acceptance only. Base76 records244 fields and103 members unchanged from draft;17 union payload definitions added from reviewed audit.373/schema1 preserved;373/schema2 field2 adds immutable adopted instructions. Separate1032 leaf/task-instruction singleton corrects the fixed-member omission without new record/field/namespace. Historical NOT PASSED/PENDING is chronological, not current runtime failure. Later scoped runtime qualification is separate; no old writer or runtime executed here.'
chain=[ref('docs/formal/TASK_COGNITIVE_PERMANENT_ALLOCATION.md'),ref('docs/formal/TASK_COGNITIVE_PLAN_LEAF_ADDITION.md'),ref(P/'campaign3-history-cognitive-qualification-rev1/review.json')]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in paths:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  pointer=u['location'].get('pointer','');category='NARRATIVE' if u['source'].endswith('.md') or pointer.split('/')[1] in ['status','notes','limits','checks','acceptance','runtime','modelFreeze','campaign2','model'] else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=note))
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,stringLeaves=leaves,role='Exact numeric/schema/identity metadata; narrative status, checks and limits remain explicitly bounded.'))
save('review.json',dict(status='SEVEN ALLOCATION SOURCES RECONCILED; NOT RUNTIME QUALIFICATION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**ref(p),role='HISTORICAL ALLOCATION AND ADDITIVE CORRECTION',judgment=note,acceptanceChain=chain) for p in paths],exactBindings=bindings,rows=rows,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=[note,'Existing exact archive resolves old registry bytes; no timestamp proof or new source recovery. Model declaration audits remain next.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED ALLOCATION RECONCILIATION',sources=len(paths),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),records=76,fields=244,baseMembers=103,additiveMembers=1,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

"""GA symbolic/numeric/member/write-policy scopes with original archive joins."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-allocation-rev1';O.mkdir(exist_ok=True)
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
'ATTENTION_ALLOCATION_TABLE':'Permanent516..541/26records89fields,52 text members/four union members. Two occurrence families1143/1144 reuse shared runtime allocator. Collection identity constraints belong to exact compiler,not scalar VAL role. Two ObserverId map-key roles and11 occurrence mappings retain inherited identities. Primary numeric review is not external verdict,model activation or AT2 qualification.',
'GENERAL_ATTENTION_CARRIER_CANDIDATE':'Accepted symbolic163-record shape explicitly has no numeric assignments. Six identity families distinguish physical LocalReserve from observer-safe InteroceptiveSignal and four runtime occurrence families. Six state-map roles preserve CharacterId/ObserverId distinction; subsequent allocation does not erase symbolic gate or turn symbolic roles into admitted registry instances.',
'GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE':'Permanent542..704 maps163 symbolic records and six families to exact fields/tags. Five owned-occurrence declarations allocate only at actual producers; references allocate nothing. Role positions preserve validator obligations without admitting CanonicalIdentityRole records. Exact registry members,trace/output/work ceilings and model/runtime gates remain separate. Empty pending stage at allocation time is not a current owner ruling.',
'GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE':'218 exact payload assignments in existing namespaces;zero records/new namespaces. Member allocation does not instantiate registry or admit model/runtime. Namespace/payload uniqueness and shape order retained; later qualification requires independent evidence.',
'GENERAL_ATTENTION_WRITE_SCOPE_ALLOCATION_TABLE':'705 path capability and706 stage registration are explicit successor records. Existing704/1 stays frozen,not aliased. Three scalar roles and inherited boundaries preserve StatePathPattern149,WriteCapability322 and subject projection266. Authorization alternatives do not merge owners or permit protocol-root writes. Numeric consistency is not exact model admission.',
'GENERAL_ATTENTION_WRITE_SCOPE_POLICY':'67 fixed stage policies separate ReadOnly,ExactPaths and LearningFamilies. Learning route is not itself write permission; acquisition evidence may carry route but remain ReadOnly. Track roots,maintenance goal owner,episode/association/presentation owners and reserve composite key remain separate. Protocol writes forbidden by source correction. Exact admitted path sets/model scope remain independent from fixed policy.'}
candidate=load(F/'GENERAL_ATTENTION_CARRIER_CANDIDATE.json');allocation=load(F/'GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json');assert candidate['numericAllocations']==[] and len(candidate['records'])==163
records=[]
for i,r in enumerate(candidate['records']):records.append(dict(typeId=542+i,schemaVersion=1,name=r['name'],fields=[dict(id=j+1,name=f['name'],required=f['type']['kind']!='optional',type=f['type']['value'] if f['type']['kind']=='optional' else f['type']) for j,f in enumerate(r['fields'])]))
assert records==allocation['records'];assert allocation['namespaces']==[{**n,'namespace':1044+i if i<2 else 1143+i} for i,n in enumerate(candidate['newIdentityFamilies'])]
shape=load(P/'GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json');write=load(F/'GENERAL_ATTENTION_WRITE_SCOPE_ALLOCATION_TABLE.json');assert write['records']==[dict(typeId=705+i,schemaVersion=1,name=r['name'],fields=[dict(id=j+1,name=f['name'],required=f['type']['kind']!='optional',type=f['type']['value'] if f['type']['kind']=='optional' else f['type']) for j,f in enumerate(r['fields'])]) for i,r in enumerate(shape['records'])]
policy=load(F/'GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json');assert policy['stages']==shape['stages'] and len(policy['stages'])==67
for s in policy['stages']:
 assert set(s)=={'name','writeMode','roots','route'} and s['writeMode'] in ['ReadOnly','ExactPaths','LearningFamilies']
 if s['writeMode']=='ReadOnly':assert s['roots']==[]
 if s['writeMode']=='LearningFamilies':assert s['route']==['route/character-learning']
assert [x['name'] for x in write['fieldEnums'][0]['members']]==[s['name'] for s in policy['stages']]
member=load(F/'GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE.json');assert member['records']==member['newNamespaces']==[] and len(member['members'])==218 and len({(r['namespace'],r['payload']) for r in member['members']})==218
att=load(F/'ATTENTION_ALLOCATION_TABLE.json');assert [r['typeId'] for r in att['records']]==list(range(516,542)) and sum(len(r['fields']) for r in att['records'])==89
archive={a['original']:a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];pairs={};bindings=[]
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:
   actual=v['path']
   if actual=='docs/formal/CANONICAL_RECORD_REGISTRY.md' and v['sha256']=='6f95e9f59ce3a66e4acd6de9cdc1b1a77e4893ca537a6286577d54717ea82474':actual=(P/'campaign3-history-allocation-corrections-rev1/CANONICAL_RECORD_REGISTRY.historical.md').as_posix()
   assert sha(actual)==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256'],resolvedPath=actual))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for stem,j in specs.items():
 p=(F/(stem+'.json')).as_posix();v=load(p);a=archive[p];scan(v)
 for q in [p,a['archive']]:
  assert sha(q)==a['sha256']==entries[q]['sha256'];sources[q]=v
  roles.append(dict(path=q,sha256=sha(q),role='WHOLE GA ALLOCATION/POLICY' if q==p else 'EXACT ARCHIVED GA POLICY',judgment=j+(' Exact archived declaration shares scoped analysis,not new execution authority.' if q!=p else ''),acceptanceChain=[ref(P/'public-wrapper-quiescence-rev1/PRESERVATION.json'),ref(P/'GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json')]))
  if q!=p:pairs[q]=p
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/scope','/limits','/pendingMembers','/permanence','/acceptance')) or ptr.endswith(('/scope','/owner'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='POLICY / AUTHORITY / HISTORICAL LIMIT' if narrative else 'TYPED GA DECLARATION BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='12 GA ALLOCATION/POLICY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Declaration/shape/source consistency only;not fresh runtime/admission/rollback qualification.','Symbolic,permanent member and exact-model gates retain distinct historical roles.','Initial inspection attempted first record of empty member-only table;read-only IndexError did not indicate missing allocation or change evidence.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('POLICY') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

"""Review defining allocation authority separately from execution receipts."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-allocations-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[]
definitions=[('LIFECYCLE','defining-native-lifecycle',[1485,1486,1487],'definingLifecycleCodecs','LIFECYCLE','Goal1485 and report1486 are distinct state owners;1487 is a scheduled source. Optional timing/desired fields do not remove owner invariants or authorize caller mutation. Permanent allocation is not qualification.'),('MEMORY_OWNER','defining-native-memory-owner',[1488,1489],'definingMemoryOwnerCodecs','MEMORY_OWNER','1488 is opportunity;1489 is produced historical goal-relative meaning with Before/After/qualification and attribution. Neither creates a new memory owner or revises historical evidence.'),('CURRENT_ASSESSMENT','defining-native-current-assessment',[1490],'definingCurrentCodecs','CURRENT','1490 is output, not persistent state. Goal1485, historical1489 and actual report1486 remain distinct operands. Missing report cannot fall back to historical After; immutable-goal profile and in-flight baseline are bounded.'),('REHEARSAL','defining-native-rehearsal',[1491,1492],'definingRehearsalCodecs','REHEARSAL','1491 carries an actual prior cue/focal, not fresh perception or self-initiated intent.1492 contains at most16 actual publications and optional actual attribution. Event/body recall and use/presentation owners remain distinct; no new state owner or namespace.')]
for stem,contract,ids,codec,checkstem,judgment in definitions:
 p=f'docs/formal/DEFINING_{stem}_ALLOCATION_TABLE.json';v=load(p);assert sha(p)==entries[p]['sha256'];sources[p]=v
 keys(v,'contract records status' if stem=='LIFECYCLE' else 'contract records');assert v['contract']==contract+'/0.1-candidate';assert [r['typeId'] for r in v['records']]==ids
 for r in v['records']:
  keys(r,'typeId name fields');assert [f['id'] for f in r['fields']]==list(range(1,len(r['fields'])+1))
  for f in r['fields']:
   keys(f,'id name required type');assert type(f['required']) is bool and isinstance(f['name'],str)
   t=f['type']
   if isinstance(t,str):assert t in ['i','bool'] or re.fullmatch('(ref|id):[0-9]+',t)
   elif 'enum' in t:keys(t,'enum');assert all(type(n) is int for n in t['enum']) and len(set(t['enum']))==len(t['enum'])
   elif 'oneOf' in t:keys(t,'oneOf');assert t['oneOf']==['ref:564','ref:565','ref:566','ref:567']
   else:assert t=={'list':'ref:590','min':0,'max':16}
 c=Path('src/campaign3')/(codec+'.ts');text=c.read_text();assert '../../'+p in text and 'allocation.records.map' in text and 'typed(value,f.type as T)' in text
 receipt=P/f'DEFINING_NATIVE_{checkstem}_CHECK_REV1.json';rr=load(receipt);assert any(x['path']==p and x['sha256']==sha(p) for x in rr['files'])
 roles.append(dict(path=p,sha256=sha(p),role='NORMATIVE ALLOCATION GRAMMAR',judgment=judgment+' Imported by the closed structural codec; semantic ownership/causal requirements are supplied by its separate accepted contract. Stored checker bindings authenticate this grammar; no fresh execution in this review.',acceptanceChain=[ref(c),ref(receipt),ref(P/'campaign3-history-defining-native-stages-rev1/review.json')]))
archive='docs/planning/defining-lifecycle-development-rev1/DEFINING_LIFECYCLE_ALLOCATION_TABLE.json';original='docs/formal/DEFINING_LIFECYCLE_ALLOCATION_TABLE.json';assert Path(archive).read_bytes()==Path(original).read_bytes();assert sha(archive)==entries[archive]['sha256'];sources[archive]=load(archive)
preserve=P/'defining-lifecycle-development-rev1/PRESERVATION.json';assert any(x['path']==archive and x['sha256']==sha(archive) for x in load(preserve)['files'])
roles.append(dict(path=archive,sha256=sha(archive),role='EXACT DEVELOPMENT GRAMMAR ALIAS',judgment='Same permanent1485..1487 grammar in the archived TypeScript handler-map rejection cohort. The rejected cohort contains no completed behavior/qualification; later accepted runtime repair does not reallocate IDs. Exact text equality shares grammar analysis, not execution status.',acceptanceChain=[ref(original),ref(preserve),ref(P/'campaign3-history-defining-tests-rev1/review.json')]))
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='ALLOCATION STATUS' if u['location']['pointer']=='/status' else 'TYPED GRAMMAR BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source'])))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='FIVE GRAMMAR SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),obligations=obs,limits='Normative grammar and exact source bindings; existing qualification scopes unchanged. No new execution, allocation or scientific verdict.'))
c=dict(status='PASS; HQ011 OPEN',sources=5,uniqueRecords=8,originalNarrativeOccurrences=sum(x['role']=='ALLOCATION STATUS' for x in rows),originalBackingOccurrences=sum(x['role']!='ALLOCATION STATUS' for x in rows),stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

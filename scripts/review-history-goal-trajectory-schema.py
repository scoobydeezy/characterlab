"""Complete the120 goal trajectory backing roles using their closed producer schema."""
from pathlib import Path
from fractions import Fraction
import json,hashlib,re,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-goal-trajectory-schema-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
priorPath=P/'campaign3-history-goal-backing-rev1/review.json';prior=load(priorPath)
replayPath=P/'campaign3-history-goal-replay-backing-rev1/review.json';replay=load(replayPath)
planPath=P/'LONGITUDINAL_GOAL_PLAN_REV1.json';plan=load(planPath);planHash=sha(planPath)
matrixPath=P/'LONGITUDINAL_GOAL_MATRIX_REV1.json';matrix=load(matrixPath);assert matrix['planSha256']==planHash
entries={e['path']:e for e in load(B/'manifest.json')['entries']};artifacts={a['path']:a['sha256'] for a in matrix['artifacts']}
code=['src/campaign3/longitudinalGoal.ts','src/campaign3/longitudinalGoalChoice.ts','src/campaign3/bodilyMaintenanceGoal.ts','scripts/qualify-longitudinal-goal.mjs']
committed={a['path']:a['sha256'] for a in plan['artifacts']}
for p in code:assert sha(p)==committed[p],p
goalKeys=set('id status adoptedAt changedAt activeFrom expiresAt desired'.split())
shapes={
 '':set('law keepEpisodes mode seed modelIdentity runIdentity planSha256 prefixHashes nativeHashes saveArchiveSha256 state'.split()),
 '/state':set('prefix actor goals rows'.split()),
 '/state/goals/*':goalKeys,
 '/state/rows/*':set('at sourceRun sourceView standing usedStanding episodes opportunity goalsBefore goalsAfter choice'.split()),
 '/state/rows/*/goalsBefore/*':goalKeys,'/state/rows/*/goalsAfter/*':goalKeys,
 '/state/rows/*/choice':set('chosen mode probabilities nuclei draws authorship'.split()),
 '/state/rows/*/choice/probabilities/*':{'name','probability'},'/state/rows/*/choice/draws/*':{'address','result','span'}}
arrayPaths={'/prefixHashes','/nativeHashes','/state/goals','/state/rows','/state/rows/*/goalsBefore','/state/rows/*/goalsAfter','/state/rows/*/choice/probabilities','/state/rows/*/choice/nuclei','/state/rows/*/choice/draws'}
hexPaths={'/modelIdentity','/runIdentity','/state/actor','/state/rows/*/sourceRun','/state/rows/*/sourceView','/state/rows/*/choice/nuclei/*','/state/rows/*/choice/draws/*/address'}
digestPaths={'/planSha256','/prefixHashes/*','/nativeHashes/*','/saveArchiveSha256'}
fractionPaths={'/state/rows/*/standing','/state/rows/*/choice/authorship','/state/rows/*/choice/probabilities/*/probability'}
enumPaths={'/law':set(['SeparateOwners','FineStanding','NoFeedback','GoalEqualsOpportunity']),'/mode':{'Maintained','Withdrawn','Replaced'},'/state/rows/*/choice/mode':{'NoActiveReasons','Auto','PlayerFacingRoll','QuietRoll'},'/state/rows/*/choice/chosen':{'uphold','defer'},'/state/rows/*/choice/probabilities/*/name':{'uphold','defer'}}
for prefix in ['/state/goals/*','/state/rows/*/goalsBefore/*','/state/rows/*/goalsAfter/*']:
 enumPaths[prefix+'/id']={'original','replacement'};enumPaths[prefix+'/status']={'Open','Withdrawn','Expired'};enumPaths[prefix+'/desired']={'0/1','1/1'}
integerStringPaths={p+'/'+k for p in ['/state/goals/*','/state/rows/*/goalsBefore/*','/state/rows/*/goalsAfter/*'] for k in ['adoptedAt','changedAt','activeFrom','expiresAt']}
numberPaths={'/seed','/state/prefix','/state/rows/*/at','/state/rows/*/usedStanding','/state/rows/*/episodes','/state/rows/*/choice/draws/*/result','/state/rows/*/choice/draws/*/span'}
booleanPaths={'/keepEpisodes','/state/rows/*/opportunity'}
def check(x,path='',counts=None,strings=None):
 if isinstance(x,dict):
  assert path in shapes and set(x)==shapes[path],(path,'object fields')
  if path=='/state/rows/*/choice/draws/*':assert 0<=x['result']<x['span']
  for k,v in x.items():check(v,path+'/'+k,counts,strings)
 elif isinstance(x,list):
  assert path in arrayPaths,path
  for v in x:check(v,path+'/*',counts,strings)
 elif isinstance(x,str):
  if path in hexPaths:assert re.fullmatch('(?:[0-9a-f]{2})+',x);role='CANONICAL ENCODED ID/VIEW/REASON/RANDOM ADDRESS'
  elif path in digestPaths:assert re.fullmatch('[0-9a-f]{64}',x);role='EXACT BYTE DIGEST'
  elif path in fractionPaths:
   assert re.fullmatch('-?\d+/[1-9]\d*',x);q=Fraction(x)
   assert x==str(q.numerator)+'/'+str(q.denominator)
   role='EXACT RATIONAL OPERAND'
  elif path in enumPaths:assert x in enumPaths[path],(path,x);role='DECLARED PROFILE/GOAL/CHOICE ENUM'
  elif path in integerStringPaths:assert re.fullmatch('0|[1-9]\d*',x);role='EXACT GOAL LIFECYCLE INSTANT'
  else:raise AssertionError((path,'unclassified string'))
  counts[(path,role)]+=1;strings[0]+=1
 elif type(x)is bool:assert path in booleanPaths,path
 elif type(x)is int:
  assert path in numberPaths,path
  if path!='/state/rows/*/usedStanding':assert x>=0
 elif x is None:assert path=='/state/rows/*/choice/chosen'
 else:raise AssertionError((path,type(x)))
sources=[];allCounts=collections.Counter();totalStrings=0
for i,identity in enumerate(plan['runs']):
 p=P/'longitudinal-goal-execution-rev1'/f'{i:03}.json';path=p.as_posix();v=load(p);h=sha(p)
 assert h==entries[path]['sha256']==artifacts[path]
 assert any(f['path']==path and f['sha256']==h for f in prior['files'])
 assert any(f['path']==path and f['sha256']==h for f in replay['parentBindings'])
 assert v['planSha256']==planHash
 for k,x in identity.items():assert v[k]==x
 assert len(v['prefixHashes'])==len(v['nativeHashes'])==17 and v['state']['prefix']==16
 assert [r['at'] for r in v['state']['rows']]==list(range(1,9))+list(range(14,22))
 counts=collections.Counter();strings=[0];check(v,counts=counts,strings=strings);allCounts.update(counts);totalStrings+=strings[0]
 sources.append(dict(path=path,sha256=h,role='WHOLE CLOSED-SCHEMA TRAJECTORY BACKING',stringLeaves=strings[0],
  schemaCounts=[dict(path=k[0],role=k[1],count=n) for k,n in sorted(counts.items())],
  disposition='Producer snapshot and runner emit only fixed profile/lifecycle/choice enums, exact numeric operands, canonical encoded identities/views/reasons/addresses and byte commitments. All nested fields and strings checked; Open/Withdrawn are goal states, not research decisions.',
  limits='Full schema role does not infer psychological sufficiency from data values or discard the trajectory. Original qualification owns interpretation; no fresh runtime replay or new native admission.'))
selected={s['path'] for s in sources};original=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in selected:original.append(u['id'])
assert set(original)=={r['occurrenceId'] for r in prior['rows']},'Unexpected prose needs separate review'
assert len(sources)==120
# Unknown fields/short prose must fail rather than silently widening the backing classification.
sample=load(sources[0]['path']);faults=[]
for mode in ['extra-prose','unknown-goal-status','free-text-standing']:
 x=json.loads(json.dumps(sample))
 if mode=='extra-prose':x['finding']='OPEN'
 elif mode=='unknown-goal-status':x['state']['goals'][0]['status']='UNRESOLVED'
 else:x['state']['rows'][0]['standing']='not known'
 try:check(x,counts=collections.Counter(),strings=[0])
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
v=dict(status='ALL120 GOAL TRAJECTORY SOURCE SCHEMAS REVIEWED; HQ011 OPEN',sourceRoles=sources,
 originalOccurrenceIds=original,originalBackingOccurrences=len(original),allStringLeaves=totalStrings,
 omittedStringLeaves=totalStrings-len(original),schema=[dict(path=k[0],role=k[1],count=n) for k,n in sorted(allCounts.items())],
 evidence=[dict(path=p.as_posix() if isinstance(p,Path) else p,sha256=sha(p)) for p in [priorPath,replayPath,planPath,matrixPath,P/'campaign3-history-late-qualifications-rev1/review.json',*code]],
 obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['The original2976 goal lifecycle occurrences are reused, not counted again. Prior1584 omitted Withdrawn values are included within this complete string-schema accounting, not new findings.',
 'Other omitted strings remain exactly reconstructible from immutable source hashes and validated closed field paths; large encoded views are not duplicated into a second narrative archive.',
 'Canonical hex strings are typed produced backing records, not omitted free-form prose. Their semantic content remains governed by original contracts, not claimed correct merely from hexadecimal syntax.',
 'Role upgrade from partial fields to whole schema leaves original source bytes and earlier partial receipts untouched. No general schema conclusion for other trajectory families.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],sources=120,originalBackingOccurrences=len(original),allStringLeaves=totalStrings,omittedStringLeaves=totalStrings-len(original),newOriginalOccurrences=0,rejectedSchemaMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

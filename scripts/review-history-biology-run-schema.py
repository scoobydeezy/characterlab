"""Closed-schema accounting of final native biology receipts, no fresh execution."""
from pathlib import Path
from fractions import Fraction
import json,hashlib,re,copy,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-run-schema-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert isinstance(v,dict) and set(v)==set(s.split())
def integer(v,lo=0,hi=1000):assert type(v)==int and lo<=v<=hi
def boolean(v):assert type(v)==bool
def hx(v,n=None):assert isinstance(v,str) and re.fullmatch('[0-9a-f]+',v) and len(v)%2==0 and (n is None or len(v)==n)
def number(v):integer(v)
actions=set('drug meal drink sleep relax work alternative withhold'.split())
domains=set('harm pain sleep hunger stress thirst pleasure withdrawal'.split())
def action(v):assert v is None or v in actions
def rational(v):
 assert isinstance(v,str) and re.fullmatch(r'-?\d+/[1-9]\d*',v);return Fraction(v)
def probe(v):
 keys(v,'appraisal9 decision9');a=v['appraisal9'];d=v['decision9']
 keys(a,'goals habit affect before beliefs control grounds options inhibited');keys(a['goals'],'work maintained protection')
 for x in a['goals'].values():boolean(x)
 assert set(a['habit'])==actions
 for x in a['habit'].values():number(x)
 keys(a['affect'],'threat distress pleasure')
 for x in a['affect'].values():
  if x is not None:number(x)
 keys(a['before'],'pain hunger reward stress thirst arousal pleasure sleepiness intoxication withdrawalReward withdrawalStress withdrawalArousal')
 for x in a['before'].values():
  if x is not None:number(x)
 assert set(a['beliefs'])==actions
 for values in a['beliefs'].values():
  assert set(values)==domains
  for x in values.values():
   if x is not None:number(x)
 if a['control'] is not None:number(a['control'])
 boolean(a['inhibited'])
 assert isinstance(a['options'],list) and len(set(a['options']))==len(a['options']) and set(a['options'])<=actions
 for g in a['grounds']:
  keys(g,'domain option strength');assert g['domain'] in domains|{'protection','protective-goal','work-goal'} and g['option'] in actions;integer(g['strength'],-1000,1000)
 keys(d,'mode draws chosen authorship probabilities');assert d['mode'] in {'Auto','QuietRoll','PlayerFacingRoll','NoActiveReasons'};action(d['chosen']);assert 0<=rational(d['authorship'])<=1
 for x in d['draws']:
  keys(x,'span result address');integer(x['span'],1,100000);integer(x['result'],0,x['span']-1);hx(x['address'])
 for x in d['probabilities']:
  keys(x,'name probability');assert x['name'] in actions and 0<=rational(x['probability'])<=1
 assert sum(rational(x['probability']) for x in d['probabilities']) in [0,1]
planPath=P/'BIOLOGY_PUBLIC_PLAN_REV3.json';plan=load(planPath);planHash=sha(planPath)
def result(v):
 keys(v,'index name law seed modelIdentity runIdentity prefixes prefixHashes observerHash stateHash traceHash componentMatched choices probe');integer(v['index'],0,57);r=plan['runs'][v['index']]
 for k in ['name','law','seed','modelIdentity','runIdentity','prefixes']:assert v[k]==r[k]
 hx(v['modelIdentity']);hx(v['runIdentity']);integer(v['seed'],0,7)
 needed={str(n) for at in r['prefixes'] for n in [at,min(at+1,len(r['frames']))]};assert set(v['prefixHashes'])==needed
 for h in list(v['prefixHashes'].values())+[v['observerHash'],v['stateHash'],v['traceHash']]:hx(h,64)
 boolean(v['componentMatched']);assert v['componentMatched']==(r['baseline'] is not None)
 assert len(v['choices'])==len(r['frames'])
 for x in v['choices']:action(x)
 if r['baseline'] is None:probe(v['probe'])
 else:assert v['probe'] is None
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};paths=[];roles=[]
closure=P/'BIOLOGY_PUBLIC_CLOSURE_REV2.json';closureArtifacts={a['path']:a['sha256'] for a in load(closure)['artifacts']}
parts=[]
for i in range(4):
 path=P/f'BIOLOGY_PUBLIC_RESULT_PART{i}_REV3.json';v=load(path);keys(v,'status part planSha256 results');assert v['status']=='PASS' and v['part']==i and v['planSha256']==planHash
 assert [r['index'] for r in v['results']]==list(range(i,58,4))
 for r in v['results']:result(r)
 assert sha(path)==closureArtifacts[path.as_posix()];parts.append((path,v));sources[path.as_posix()]=v
results={r['index']:r for _,v in parts for r in v['results']};assert len(results)==58
for i in range(58):
 path=P/f'BIOLOGY_PUBLIC_RUN_{i}_REV3.json';v=load(path);keys(v,'planSha256 result');assert v['planSha256']==planHash;result(v['result']);assert v['result']==results[i];sources[path.as_posix()]=v
path=P/'BIOLOGY_PUBLIC_AUX_TAIL_REV3.json';v=load(path);keys(v,'status part planSha256 results');assert v['status']=='PASS' and v['planSha256']==planHash;integer(v['part'],0,3)
assert [r['index'] for r in v['results']]==[55,51,47,43,39,35,31]
for r in v['results']:result(r);assert r==results[r['index']]
assert sha(path)==closureArtifacts[path.as_posix()];sources[path.as_posix()]=v
def strings(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from strings(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from strings(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
stringCounts={};stringMap={}
for path,v in sources.items():
 assert sha(path)==entries[path]['sha256'];ss=list(strings(v));stringCounts[path]=len(ss)
 for ptr,text in ss:stringMap[(path,ptr)]=text
 if 'BIOLOGY_PUBLIC_RUN_' in path:
  i=v['result']['index'];chain=[ref(closure),ref(parts[i%4][0]),ref(path)];basis='Whole result equals its closure-bound partition row; prefix/sample identity checked against plan.'
 else:chain=[ref(closure),ref(path)];basis='Exact closure artifact plus closed schema and all referenced result equality.'
 roles.append(dict(**ref(path),role='WHOLE CLOSED-SCHEMA NATIVE RECEIPT',acceptanceChain=chain,judgment=basis+' These are historical receipt fields, not fresh replay or narrative evidence. Safe-view hashes do not expose underlying body truth.'))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert stringMap[(u['source'],u['location']['pointer'])]==u['text'];rows.append(dict(occurrenceId=u['id'],source=u['source'],location=u['location'],text=u['text'],role='CLOSED-SCHEMA BACKING',judgment='Typed receipt string, not a freeform unresolved scientific assertion.'))
faults=[]
for label,mut in [('added narrative',lambda v:v.update(finding='Needs review')),('bad choice',lambda v:v['choices'].__setitem__(0,'unreviewed')),('false prefix',lambda v:v['prefixHashes'].update({'999':'0'*64})),('extra probe claim',lambda v:v['probe'].update(finding='UNRESOLVED'))]:
 v=copy.deepcopy(results[53]);mut(v)
 try:result(v)
 except AssertionError:faults.append(label)
 else:raise AssertionError(label)
O.mkdir(exist_ok=True);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='FINAL63 BIOLOGY RECEIPTS CLOSED-SCHEMA REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringCounts=stringCounts,stringsReviewed=sum(stringCounts.values()),negativeControls=faults,evidence=[ref(planPath),ref(closure),ref('scripts/qualify-biology-public.mjs'),ref(P/'CAMPAIGN3_HISTORY_BIOLOGY_FINDINGS_CHECKPOINT.md')],obligations=obs,limits=['58 unique runs and270 selected native prefixes, not repeated partitions/auxiliary rows as extra coverage.','Historical result fields and exact binding are checked; no fresh restore or execution.','Plans, prior cohorts, tests and source-code internals are not whole-reviewed by reference.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=len(sources),stringsReviewed=v['stringsReviewed'],originalOccurrences=len(rows),negativeControls=len(faults),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))

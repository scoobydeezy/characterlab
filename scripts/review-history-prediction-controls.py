"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prediction-design-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'CAMPAIGN2_MEASUREMENT_PREDICTION_CONTROL_EXPLORATION.json':'Historical research arithmetic only. Four named cases and1296 six-symbol length-four combinations, negative controls outside diagnostic profile. Exact recurrence/sum oracle/reversal independently rechecked; historical zero-decay unit-weight quantization independently reproduced at each commit, including order witness. Count not confidence/independence; no public admission/ownership/trace/restore. Source fingerprints exact current bytes, no original writer rerun.',
'MEASUREMENT_PREDICTION_STAGE_ACCOUNTING.json':'Executed old-memory-profile schedules and derived prediction delta, not prediction execution.16unique Boolean controls each24events at4/5/6 with11/12/1counts; derived+1/+2/+1gives12/14/2,maximum14below100. Full stored event rows and short strings preserved. Generic authored overload remains failure domain, not covered by successful probe bound. Exact historical memoryExecution recovered fromGit; all other fingerprints currentmatch. Recovery proves bytes, not timestamp or fresh runtime.'}
notes={(P/k).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev227/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
O=P/'campaign3-history-prediction-controls-rev1';O.mkdir(exist_ok=True)
import subprocess,itertools,collections
from fractions import Fraction as Q
rp=O/'historical-memoryExecution.ts';rev='c825d2679f0f54bb12f96b9edd14411bec1db63b';data=subprocess.check_output(['git','show',rev+':src/campaign2/memoryExecution.ts'])
assert hashlib.sha256(data).hexdigest()=='603f21cc9712a9856bf737e3da788600cba2deb5985f4ac8c31fddadf6036297'
if rp.exists():assert rp.read_bytes()==data
else:rp.write_bytes(data)
bindings=[]
for p in notes:
 for r in load(p)['sourceFingerprints']:
  actual=Path(r['path']) if ref(r['path'])['sha256']==r['sha256'] else rp
  assert ref(actual)['sha256']==r['sha256'];bindings.append(dict(original=r,actual=ref(actual)))
def mean(xs):
 m=None
 for n,x in enumerate(xs):m=x if m is None else (n*m+x)/(n+1)
 return m
def hist(xs):
 m=Q(0)
 for n,x in enumerate(xs):m=Q(round((n*m+x)/(n+1)*1000000),1000000)
 return m if xs else None
def show(x):return 'Absent' if x is None else f'{x.numerator}/{x.denominator}'
e=load(P/'CAMPAIGN2_MEASUREMENT_PREDICTION_CONTROL_EXPLORATION.json')
for c in e['cases']:
 xs=list(map(Q,c['inputs']));g=None
 for x in xs:g=x if g is None else (g+x)/2
 assert c['actual']==c['expected']==show(mean(xs))
 assert c['lastReading']==show(xs[-1] if xs else None) and c['constantGainHalf']==show(g) and c['historicalQuantized']==show(hist(xs))
alphabet=list(map(Q,['-1/3','0','1/10','5','51/10','10']));count=0;first=None
for xs in itertools.product(alphabet,repeat=4):
 assert mean(xs)==sum(xs)/4==mean(xs[::-1]);count+=1
 if first is None and hist(xs)!=hist(xs[::-1]):first=dict(inputs=list(map(show,xs)),exactMean=show(mean(xs)),historicalForward=show(hist(xs)),historicalReverse=show(hist(xs[::-1])))
assert count==e['finiteAlgebraCases']==1296 and first==e['quantizationWitness']
t=load(P/'MEASUREMENT_PREDICTION_STAGE_ACCOUNTING.json');keys=['available','permitted','formation','memoryRead'];assert {tuple(r[k] for k in keys) for r in t['controls']}==set(itertools.product([False,True],repeat=4))
for r in t['controls']:
 counts=dict(collections.Counter(x['at'] for x in r['events']));assert counts==r['executedMemoryCounts']=={'4':11,'5':12,'6':1}
 assert r['derivedPredictionCounts']=={k:counts[k]+d for k,d in [('4',1),('5',2),('6',1)]}=={'4':12,'5':14,'6':2}
 assert [(int(x['at']),int(x['phase'])) for x in r['events']]==sorted((int(x['at']),int(x['phase'])) for x in r['events'])
assert max(max(r['derivedPredictionCounts'].values()) for r in t['controls'])==t['maximumDerivedProbeInstantWork']==14<t['workCeiling']==100
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','name'])
chain=[ref(P/'campaign3-history-prediction-qualification-rev1/review.json')];sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL EXPLORATION / DERIVED STAGE ACCOUNTING',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({x['occurrenceId'] for x in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='TWO PREDICTION CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=[dict(**ref(rp),method='Exact Git blob '+rev+' src/campaign2/memoryExecution.ts; no newline transformation')],freshChecks=dict(namedCases=4,finiteAlgebraCases=1296,recordedSchedules=16,recordedEvents=384),limits=['Independent arithmetic and stored schedule counts checked; historical writers/runtime/tests not rerun.','Negative arithmetic controls outside diagnostic domain; derived counts are not prediction execution.','Exact recovered bytes do not prove historical timestamp.','No law/model/allocation/verdict/corpus/obligation status change; adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT ARITHMETIC AND STORED SCHEDULE ACCOUNTING',sources=2,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newArchives=1,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

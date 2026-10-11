"""Whole final component/native run schemas and independent update arithmetic."""
from pathlib import Path
from fractions import Fraction as Q
import json,hashlib,re,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-runs-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def hx(x,n=None):assert isinstance(x,str) and re.fullmatch('[0-9a-f]+',x) and len(x)%2==0 and(n is None or len(x)==n)
def rat(x):assert isinstance(x,str) and re.fullmatch(r'-?\d+/[1-9]\d*',x);return Q(x)
keys=set('at phase learningGain formationGain skillBefore skillAfter attempted executed practiced admittedReport beliefBefore beliefAfter support personalityBefore personalityAfter chosen probabilities authorship contribution expression journal formationEntry forcedExecuted'.split())
def row(r,f,profile,i,previous):
 assert set(r)==keys and r['at']==i+1 and r['phase']==f['phase']
 for k in ['attempted','executed','practiced','forcedExecuted']:assert type(r[k])==bool
 assert r['admittedReport'] is None or type(r['admittedReport'])==bool
 assert r['chosen'] in [None,'A','B'];assert type(r['support'])==int and r['support']>=0
 for k in ['learningGain','formationGain','skillBefore','skillAfter','personalityBefore','personalityAfter','contribution']:rat(r[k])
 for k in ['beliefBefore','beliefAfter','authorship']:
  if r[k] is not None:assert 0<=rat(r[k])<=1
 assert isinstance(r['probabilities'],list) and len(r['probabilities']) in [0,2]
 assert sum(map(rat,r['probabilities'])) in [0,1]
 if r['expression'] is not None:hx(r['expression'])
 hx(r['journal'])
 g=Q(4 if f['phase']<2 else 1) if profile['curve']=='Step' else 1+Q(3*(4-f['phase']),4)
 lg=g if profile['learning'] else Q(1);fg=g if profile['formation'] else Q(1)
 assert rat(r['learningGain'])==lg and rat(r['formationGain'])==fg
 assert r['skillBefore']==('0/1' if previous is None else previous['skillAfter'])
 assert r['beliefBefore']==(None if previous is None else previous['beliefAfter'])
 assert r['personalityBefore']==('0/1' if previous is None else previous['personalityAfter'])
 assert r['attempted']==f['exercise'];assert r['executed']==(f['exercise'] and f['permitted'] and rat(r['skillBefore'])>=Q(f['difficulty'],8))
 assert r['practiced']==(f['exercise'] and f['permitted'] and f['practice'])
 assert rat(r['skillAfter'])==min(Q(1),rat(r['skillBefore'])+(lg/8 if r['practiced'] else 0))
 report=f['report'] if f['exercise'] and f['permitted'] else None;assert r['admittedReport']==report
 prior=r['beliefBefore'];expected=None if prior is None else rat(prior)
 if report is not None:expected=Q(int(report)) if prior is None else rat(prior)+(int(report)-rat(prior))*lg/8
 assert (None if r['beliefAfter'] is None else rat(r['beliefAfter']))==expected
 assert r['support']==(0 if previous is None else previous['support'])+int(report is not None)
 contribution=rat(r['contribution']);before=rat(r['personalityBefore']);after=max(Q(-1,2),min(Q(1,2),before+contribution*fg/4)) if f['choice']=='Learn' else before
 assert rat(r['personalityAfter'])==after
 entry=r['formationEntry']
 if f['choice']=='Learn' and contribution:
  assert set(entry)=={'at','phase','contribution','gain','delta'} and entry['at']==i+1 and entry['phase']==f['phase']
  assert rat(entry['contribution'])==contribution and rat(entry['gain'])==fg and rat(entry['delta'])==after-before
 else:assert entry is None
 assert r['forcedExecuted']==(f['choice']=='Forced' and f['permitted'])
embedded=P/'campaign3-history-development-embedded-rev1/check.json';emb=load(embedded);bindings={s['path']:s['sha256'] for s in emb['sources']}
expectedTexts={'action/longitudinal/a','action/longitudinal/b','Commitment','content/longitudinal/actor','content/longitudinal/task/a','content/longitudinal/task/b','definition/longitudinal/agenda','definition/longitudinal/instruction/0','definition/longitudinal/instruction/1','definition/longitudinal/task/0','definition/longitudinal/task/1','purpose/task-decision-tie','purpose/task-reason-face','subject/action','subject/actor','subject/task'}
assert {x['value'] for x in emb['textValues']}==expectedTexts
entries={x['path']:x for x in load(B/'manifest.json')['entries']};sources={};roles=[];rowCount=0
for lane,rev,checkName,closureName in [('COMPONENT',1,'DEVELOPMENT_COMPONENT_CHECK_REV1.json','DEVELOPMENT_COMPONENT_CLOSURE_REV1.json'),('PUBLIC',3,'DEVELOPMENT_PUBLIC_CHECK_REV3.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json')]:
 planPath=P/f'DEVELOPMENT_{lane}_PLAN_REV{rev}.json';plan=load(planPath);checkPath=P/checkName;check=load(checkPath);files={x['path']:x['sha256'] for x in check['files']};closure=P/closureName
 assert any(x['path']==checkPath.as_posix() and x['sha256']==sha(checkPath) for x in load(closure)['files'])
 for i,original in enumerate(plan['runs']):
  path=P/f'DEVELOPMENT_{lane}_RUN_{i}_REV{rev}.json';v=load(path);key=path.as_posix()
  expected=set('status planSha256 index name modelIdentity runIdentity prefixes rows'.split())|({'traceHash','randomAddresses'} if lane=='PUBLIC' else set());assert set(v)==expected
  assert sha(path)==entries[key]['sha256']==files[key]==bindings[key];assert v['status']=='PASS' and v['index']==i and v['planSha256']==sha(planPath)
  for k in ['name','modelIdentity','runIdentity']:assert v[k]==original[k]
  hx(v['modelIdentity']);hx(v['runIdentity']);assert len(v['rows'])==len(original['frames'])
  for j,r in enumerate(v['rows']):row(r,original['frames'][j],original['profile'],j,v['rows'][j-1] if j else None);rowCount+=1
  assert len(v['prefixes'])==len(v['rows'])+1
  for at,x in enumerate(v['prefixes']):
   if lane=='COMPONENT':assert set(x)=={'at','save','next','advanced'}
   else:assert x==load(P/f'development-public-prefixes-rev3/{i}-{at}.json')
   assert x['at']==at and type(x['advanced'])==bool and x['advanced']==(at<len(v['rows']))
   hx(x['save'],64);hx(x['next'],64);assert x['next']==v['prefixes'][min(at+1,len(v['rows']))]['save']
  if lane=='PUBLIC':
   hx(v['traceHash'],64);assert len(set(v['randomAddresses']))==len(v['randomAddresses'])
   for s in v['randomAddresses']:hx(s)
   assert v['rows']==sources[(P/f'DEVELOPMENT_COMPONENT_RUN_{i}_REV1.json').as_posix()]['rows']
  sources[key]=v;roles.append(dict(**ref(path),role='WHOLE FINAL DEVELOPMENT RUN SCHEMA',judgment='Exact component/native row correspondence and independent update arithmetic, closed receipts and typed canonical expression/journal backing. No fresh replay or general age law.',acceptanceChain=[ref(closure),ref(checkPath),ref(path)]))
def walk(v):
 if isinstance(v,dict):
  for x in v.values():yield from walk(x)
 elif isinstance(v,list):
  for x in v:yield from walk(x)
 elif isinstance(v,str):yield v
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in sources:rows.append(u)
assert not rows,'Unexpected narrative occurrence requires review'
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
v=dict(status='72 FINAL DEVELOPMENT RUN SCHEMAS REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=[],rowExecutionsReviewed=rowCount,stringLeaves=sum(sum(1 for _ in walk(v)) for v in sources.values()),embedded=ref(embedded),embeddedTextDisposition='All16 text values are exact inherited task/action/content/definition identities, Commitment source kind and addressed RNG labels. They are not freeform scientific findings. Structural decoding is not full semantic refinement.',obligations=obs,limits=['No fresh execution/restore. Prior 668-prefix component/native receipts retain distinct scopes.','Plan/schema input admission and eight earlier partial run records are not whole-reviewed by this final-run pass.','Counterfactual findings and scope come from separately reviewed qualifications; arithmetic checks do not prove universal psychological laws.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=72,rowExecutionsReviewed=rowCount,stringLeaves=v['stringLeaves'],originalOccurrences=0,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))

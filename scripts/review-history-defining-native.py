"""Native cohort closed schemas and material qualification distinctions."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';D=P/'defining-native-cohort-rev1';O=P/'campaign3-history-defining-native-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split())
def digest(s):assert isinstance(s,str) and re.fullmatch('[0-9a-f]{64}',s)
def uint(x):assert type(x)==int and x>=0
def files(xs):
 for a in xs:keys(a,'path sha256');assert sha(a['path'])==a['sha256']
def spec(s):
 keys(s,'law goal rehearsals capacity now cue report worldAfter')
 for k,v in dict(law=['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'],goal=['High','Low','Wide','Absent'],rehearsals=[0,3],capacity=[0,1,8],now=[50,400,4000],cue=['matching','absent'],report=['original','contrary','missing'],worldAfter=[20,30]).items():assert s[k] in v
def qualification(q):
 if q['kind']=='Qualifies':keys(q,'kind direction');assert q['direction'] in ['MovingCloser','MovingFarther']
 elif q['kind']=='DoesNotQualify':keys(q,'kind reason');assert q['reason']=='SameDistance'
 else:
  assert q['kind']=='QualificationUnavailable'
  if q['reason']=='IndeterminateRelation':keys(q,'kind reason')
  else:keys(q,'kind reason cause');assert q['reason']=='AssessmentUnavailable' and q['cause'] in ['Absent','MissingEvidence']
ids=O/'identities.json';assert load(ids)['checkerSha256']==sha('scripts/check-history-defining-native-identities.mjs')
manifest=D/'MANIFEST.json';m=load(manifest);keys(m,'version contract scope cases files');assert m['version']==1 and m['contract']=='defining-native-rehearsal/0.1-candidate' and len(m['cases'])==68;files(m['files'])
checkPath=P/'DEFINING_NATIVE_COHORT_CHECK_REV1.json';check=load(checkPath)
keys(check,'status scope runs models runIdentities selectedStages settledInstants coverage retained35NotSelected counters files diagnosticPairs');files(check['files'])
assert check['counters']==dict(highestAllocated=1492,sinceVerdict=8)
sources={manifest.as_posix():m,checkPath.as_posix():check};rs=[]
for i in range(68):
 path=D/f'CASE_{i:02}.json';r=load(path);keys(r,'status index spec modelIdentity runIdentity initialState originals instants stages historical current retainedEvents selected finalRankReads rehearsals finalPresentationSettlements elapsedMs')
 assert r['status']=='PASS' and r['index']==i and r['spec']==m['cases'][i];spec(r['spec']);s=r['spec'];digest(r['initialState']);digest(r['originals']);uint(r['elapsedMs'])
 assert load(ids)['rows'][i]['path']==path.as_posix() and load(ids)['rows'][i]['sha256']==sha(path)
 expected=[1,2,3,4,5,6,16,17,18,19,20,21,22,23,33,34,35,36,37,38]+([39,40,41] if s['rehearsals'] else [])+[42,43]+([100] if s['now']>100 else [])+[s['now']]
 assert r['instants']==list(map(str,expected))
 assert [x['clock'] for x in r['stages']]==list(map(str,[37,38]+([39,40,41] if s['rehearsals'] else [])+[42,43,s['now']]))
 for x in r['stages']:
  keys(x,'clock state outputs trace stateBytes outputBytes traceBytes')
  for k in ['state','outputs','trace']:digest(x[k])
  for k in ['stateBytes','outputBytes','traceBytes']:uint(x[k]);assert x[k]>0
 qualification(r['historical']);qualification(r['current'])
 assert r['retainedEvents'] in [[],['139'],['35'],['24','35','60','71','94','105','128','139']]
 assert r['selected'] in [[],['35'],['139']];assert set(r['selected'])<=set(r['retainedEvents'])
 assert r['finalRankReads']==(0 if s['cue']=='absent' else 2) and r['finalPresentationSettlements']==len(r['selected']) and r['rehearsals']==s['rehearsals']
 if s['cue']=='absent' or s['capacity']==0:assert r['selected']==[]
 assert r['historical']==({'kind':'Qualifies','direction':'MovingCloser'} if s['goal']=='High' else {'kind':'Qualifies','direction':'MovingFarther'} if s['goal']=='Low' else {'kind':'DoesNotQualify','reason':'SameDistance'} if s['goal']=='Wide' else {'kind':'QualificationUnavailable','reason':'AssessmentUnavailable','cause':'Absent'})
 sources[path.as_posix()]=r;rs.append(r)
assert len(set(r['modelIdentity'] for r in rs))==len(set(r['runIdentity'] for r in rs))==68
assert check['runs']==check['models']==check['runIdentities']==68
assert check['selectedStages']==sum(len(r['stages']) for r in rs)==376 and check['settledInstants']==sum(len(r['instants']) for r in rs)==1612
for k,v in check['coverage'].items():assert v==dict(collections.Counter(str(r['spec'][k]) for r in rs))
assert check['retained35NotSelected']==[r['index'] for r in rs if '35' in r['retainedEvents'] and '35' not in r['selected']]
for a,b in check['diagnosticPairs']:
 assert rs[a]['spec']==dict(rs[b]['spec'],worldAfter=30) and rs[b]['spec']['worldAfter']==20
 for k in ['historical','current','retainedEvents','selected','finalRankReads','finalPresentationSettlements']:assert rs[a][k]==rs[b][k]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[]
judgment='Internal native evidence only:68 source programs/four retention candidates,376 selected stages and1612 actual instants, not public restores. Historical qualification, current judgment, retained memory, access and exactly-once final presentation remain distinct. Absent/missing/indeterminate/known neutral preserve separate schema alternatives. Controlled carried cues/rehearsal and diagnostic worldAfter do not establish learned intent or physical sensing. Elapsed and byte sizes are operational metadata; stage hashes are historical harness evidence, not fresh execution.'
for p in sources:
 assert sha(p)==entries[p]['sha256'];roles.append(dict(**ref(p),role='WHOLE NATIVE COHORT SCHEMA',judgment=judgment,acceptanceChain=[ref(checkPath),ref(ids),ref(P/'campaign3-history-defining-public-rev1/commands.json')]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];assert strings[u['source'],u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPE CLAIM' if u['location']['pointer']=='/scope' else 'TYPED NATIVE BACKING',judgment=judgment))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='70 NATIVE COHORT SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Final presentation append extends the component; pre-final history equality does not imply component already settled it.','Ten retained35-but-unselected cases remain explicit; retention is not selection.','Original harness checks exact component rows, rank scores and child content. This audit checks preserved schema, identities and outcome records without executing that harness.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role']=='SCOPE CLAIM' for x in rows),originalBackingOccurrences=sum(x['role']=='TYPED NATIVE BACKING' for x in rows),stringLeaves=len(strings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

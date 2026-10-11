"""Reconcile Values plans/development support without widening historical claims."""
from pathlib import Path
import json,hashlib,re,collections,subprocess
P=Path('docs/planning');O=P/'campaign3-history-values-development-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
files=sorted(p for d in P.glob('values-*') if d.is_dir() for p in d.glob('*.json') if not p.name.startswith('run-'))
assert len(files)==24
entries={x['path'] for x in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']};assert all(p.as_posix() not in entries for p in files)
ix=load(P/'campaign3-history-source-roles-rev185/index.json');archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
preserved=[ref(p) for p in sorted((P/'values-matrix-rev1/rejected-sources').rglob('*')) if p.is_file()]
for x in preserved:archives[x['sha256']]=x['path']
plans=[load(P/d/'plan.json') for d in ['values-matrix-rev1','values-matrix-rev2','values-public-matrix-rev1']]
old,new,native=plans
assert old['contexts']==new['contexts'] and [x['law'] for x in old['models']]==[x['law'] for x in new['models']]==[x['law'] for x in native['models']]
assert len(old['runs'])==len(new['runs'])==len(native['runs'])==256
for a,b,n in zip(old['runs'],new['runs'],native['runs']):
 assert {k:a[k] for k in ['index','model','name','seed','originals']}=={k:b[k] for k in ['index','model','name','seed','originals']}
 assert a['runIdentity']!=b['runIdentity'] and a['inputsSha256']==b['inputsSha256']
 assert n['name']==b['name'] and n['seed']==b['seed'] and n['law']==new['models'][b['model']]['law']
 assert [f['receipt'] for f in n['frames'] if f['receipt'] is not None]==b['originals']
 for i,ctx in enumerate(new['contexts']):
  probe=next(f['probe'] for f in n['frames'] if f['instant']==59+i)
  assert {k:probe[k] for k in ctx}==ctx
 assert n['frames'][-1]['instant']==65
assert not list((P/'values-matrix-rev1').glob('run-*.json'))
for i in [0,64,128,192]:assert load(P/f'values-matrix-rev1/failure-{i}.json')['error']=='SchedulerContractError: chosen resolution required'
rejected=load(P/'values-public-development-rev1/tests-rejected-syntax.json')
assert rejected['success'] is False and rejected['numPassedTests']==19 and rejected['numFailedTests']==0
failed=[x for x in rejected['testResults'] if x['status']=='failed'];assert len(failed)==1 and not failed[0]['assertionResults'] and 'Transform failed' in failed[0]['message']
tests=[]
for p in files:
 v=load(p)
 if 'testResults' in v:
  titles=[dict(file=t['name'],title=a['fullName'],status=a['status']) for t in v['testResults'] for a in t['assertionResults']]
  assert len(titles)==v['numTotalTests']
  tests.append(dict(source=ref(p),success=v['success'],assertions=len(titles),titles=titles,role='Historical executed assertion titles; not independent clause verdicts, source provenance or fresh tests. Rejected native suite has zero assertions.'))
bindings=[];unresolved=[];schemas=collections.defaultdict(collections.Counter);sources=[];rows=[]
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 else:yield p,v
def bind(v,owner):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):
   f={k:v[k] for k in ['path','sha256']};actual=f['path'] if Path(f['path']).exists() and ref(f['path'])==f else archives.get(f['sha256'])
   if actual:
    assert ref(actual)['sha256']==f['sha256'];bindings.append(dict(owner=owner,original=f,actual=ref(actual)))
   else:unresolved.append(dict(owner=owner,**f))
  for x in v.values():bind(x,owner)
 elif isinstance(v,list):
  for x in v:bind(x,owner)
def note(p):
 n=p.name;d=p.parent.name
 if n=='plan.json':return 'Frozen inputs/model identities and source bindings. Rejected REV1 and accepted REV2 retain same256 authored originals and contexts but distinct versioned run identities; native frames add actual59..64 receiving instants and65 expiry. Old source mismatches remain explicit; original plans unchanged.'
 if n.startswith('failure-'):return 'Rejected partition stopped at terminal65 chosenData assumption; no completed run. Stack is failure provenance, not successful observation or model qualification.'
 if n=='obligations-before-closure.json':return 'Preserved pre-closure RO019/020 routing, not current obligation status. Later bounded component/native qualification supersedes missing-owner/public scope only; broader scientific limits and original historical distinctions remain under their existing owners.'
 if 'test' in n:return 'Historical assertion receipt; counts/titles are backing, not expanded scientific scope. Syntax-rejected native suite ran no assertions;19 unchanged component assertions passed. Later31 native/component and328 reference tests remain separate receipt. No fresh tests.'
 if n=='build.json':return 'Historical successful build with103 exact source bindings. Explicitly transcribed observed output; no independently captured terminal log. Earlier pre-final-cache-edit builds do not qualify later bytes.'
 if n=='preservation.json':return 'Exact rejected factory/public-test/findings/receipt/prior-routing bytes preserved. Preservation proves identity only, not successful execution.'
 if d=='values-readiness-rev1':return 'Readiness demonstrates historical unmaterialized Values registration and permitted consolidation topology; not a Values owner or qualification. Later bounded component/public owners separately supply admitted evidence. Quoted source ranges are backing, not whole-document acceptance.'
 if n=='check.json':return 'Scoped stored matrix findings: one successor per prefix; component3/8 divergent5/8 equal; native contexts have differing addressed times. Refold/NeedOnly/Joint equalities preserved. No physical world, autonomous lifecycle, appraisal or age claim.'
 return 'Development limits/failures retained: source-discovery/type/syntax errors distinct from assertions; NeedOnly expectation survives suppressed Value; Refold no private cache. Later external-original/native gates supersede only named missing machinery. Early checkpoint two source identities remain unresolved; no historical build widening.'
for p in files:
 v=load(p);sr=ref(p);bind(v,sr['path']);judgment=note(p);sources.append(dict(**sr,role='POST-CUTOFF VALUES SUPPORT WITH EXPLICIT LIMITS',judgment=judgment))
 for pointer,value in walk(v):
  pattern=re.sub(r'/\d+(?=/|$)','/*',pointer);schemas[(p.parent.name+'/'+p.name,pattern)]['null' if value is None else type(value).__name__]+=1
  if not isinstance(value,str):continue
  location=dict(pointer=pointer);identity=hashlib.sha256(json.dumps([sr['path'],sr['sha256'],location,value],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
  rows.append(dict(occurrenceId=identity,source=sr['path'],sourceSha256=sr['sha256'],location=location,valueSha256=hashlib.sha256(value.encode()).hexdigest(),judgment=judgment))
assert len(unresolved)==2 and all(x['owner'].endswith('values-component-development-rev1/checkpoint.json') for x in unresolved)
search=[]
for f in unresolved:
 commits=subprocess.check_output(['git','log','--format=%H','--',f['path']]).decode().splitlines();hits=[]
 for c in commits:
  raw=subprocess.check_output(['git','show',c+':'+f['path']]);lf=raw.replace(b'\r\n',b'\n')
  for name,b in [('raw',raw),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]:
   if hashlib.sha256(b).hexdigest()==f['sha256']:hits.append(dict(commit=c,newlines=name))
 assert not hits;search.append(dict(**f,reachableExactPathCommits=commits,variants=['raw','LF','CRLF'],matches=hits))
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,fields=[dict(source=s,pointer=p,types=dict(t)) for (s,p),t in sorted(schemas.items())]))
save('tests.json',dict(scope='HISTORICAL RECEIPTS ONLY',receipts=tests))
save('unresolved.json',dict(status='TWO EARLY VALUES CHECKPOINT SOURCE IDENTITIES UNRESOLVED',search=search,scope='Indexed archives, preserved rejected sources and reachable exact-path Git raw/LF/CRLF; not global absence.',blockedClaim='Exact replay or build attribution to these early source versions. Later qualified model/source identities remain separate.',obligations=['RO-C3-021']))
save('review.json',dict(status='24 VALUES SUPPORT SOURCES RECONCILED; TWO EARLY SOURCE GAPS OPEN',checker=ref(__file__),sourceRoles=sources,rows=rows,exactBindings=bindings,rejectedSourceArchives=preserved,unresolved=ref(O/'unresolved.json'),schema=ref(O/'schema.json'),tests=ref(O/'tests.json'),priorNarrative=ref(P/'campaign3-history-values-addition-rev1/review.json'),priorRunBacking=ref(P/'campaign3-history-values-backing-rev1/review.json'),limits=['All24 sources post-cutoff; original census unchanged. Earlier90 paragraphs/15 findings and512 run classification retained, not counted as new scientific findings.','Three stronger Values cases2/3/autonomous7 remain open; no candidate retired.','Two early Values identities add to seven early cognitive runtime,80 exit-inventory and one scheduler identity gaps; final adequacy required.','No old writer/runtime/build rerun; no original source or obligation status changed.'],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED SUPPORT RECONCILIATION; SOURCE ADEQUACY OPEN',sources=24,stringOccurrences=len(rows),exactBindings=len(bindings),unresolvedBindings=2,rejectedSourceArchives=len(preserved),testReceipts=len(tests),originalCensusOccurrencesAdded=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

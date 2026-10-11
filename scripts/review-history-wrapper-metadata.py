"""Repair plan/provenance and test/build receipt schemas."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';R=P/'public-wrapper-quiescence-rev1';O=P/'campaign3-history-wrapper-metadata-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def keys(v,s):assert set(v)==set(s.split()),set(v)
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
closure=P/'PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json';cb={a['path']:a['sha256'] for a in load(closure)['files']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];failures=[];bindings=[]
for name,passed,failed in [('TESTS_REV1.json',4,2),('TESTS_REV2.json',6,0),('TESTS_REV3.json',72,0),('ROLLBACK_TESTS_REV1.json',2,0),('REFERENCE_TESTS_REV1.json',328,0)]:
 p=R/name;v=load(p);keys(v,'numTotalTestSuites numPassedTestSuites numFailedTestSuites numPendingTestSuites numTotalTests numPassedTests numFailedTests numPendingTests numTodoTests snapshot startTime success testResults');keys(v['snapshot'],'added failure filesAdded filesRemoved filesRemovedList filesUnmatched filesUpdated matched total unchecked uncheckedKeysByFile unmatched updated didUpdate')
 assert all(x==0 or x is False or x==[] for x in v['snapshot'].values());counts=collections.Counter()
 for fi,f in enumerate(v['testResults']):
  keys(f,'assertionResults startTime endTime status message name');assert f['message']=='' and f['name'].endswith('.test.ts')
  for ai,a in enumerate(f['assertionResults']):
   keys(a,'ancestorTitles fullName status title duration failureMessages meta');assert a['meta']=={};counts[a['status']]+=1
   if a['status']=='failed':
    assert name=='TESTS_REV1.json' and a['title'].startswith(('identityBiology:','biologyPublic:'));assert len(a['failureMessages'])==1 and 'expected 0 to be greater than 0' in a['failureMessages'][0]
    failures.append(dict(source=p.as_posix(),fileIndex=fi,assertionIndex=ai,title=a['title'],message=a['failureMessages'][0],disposition='Incorrect instant1 fixture expectation; existing guard assertions reached before nonempty-ledger assertion. Corrected fixture advances biological cases through8 so tested draw is9; guard and nonempty-ledger assertions remain.'))
   else:assert a['status']=='passed' and a['failureMessages']==[]
  assert f['status']==('failed' if any(a['status']=='failed' for a in f['assertionResults']) else 'passed')
 assert counts==collections.Counter(passed=passed,failed=failed) and v['numPassedTests']==passed and v['numFailedTests']==failed and v['numTotalTests']==passed+failed and v['numPendingTests']==v['numTodoTests']==0;assert v['success']==(failed==0)
 assert v['numTotalTestSuites']==v['numPassedTestSuites']+v['numFailedTestSuites']+v['numPendingTestSuites']
 sources[p.as_posix()]=v;roles.append(dict(**ref(p),role='WHOLE TEST RECEIPT',judgment='Exact runner outcomes and assertion diagnostics; labels are bounded test intent, not general phenomena. Suite counter may include nested suites and is not file count.72 final affected tests plus2 acquired-ledger rollback tests are distinct;328 reference tests are preserved regression evidence. Earlier4/2 failure and6-pass correction are not extra final coverage.',acceptanceChain=[ref(closure),ref(P/'PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md')]))
old=R/'publicWrapperQuiescence-test-development-rev1.ts';current=Path('src/test/publicWrapperQuiescence.test.ts');added="    // Biological fixture acquires its competing motives before drawing at instant 9.\n    if (name !== 'identityTask') for (let i = 0; i < 8; i++) await run.settle();\n";assert current.read_text().replace(added,'')==old.read_text()
for name in ['REPAIR_PLAN.json','EMBODIED_REPAIR_PLAN.json','PRESERVATION.json','BUILD_REV2.json','BUILD_REV3.json']:
 p=R/name;v=load(p);sources[p.as_posix()]=v;chain=[ref(closure)]
 if name=='REPAIR_PLAN.json':
  keys(v,'status scope parents artifacts runs prefixes');assert v['status']=='FROZEN BEFORE REPAIR QUALIFICATION' and (v['runs'],v['prefixes'])==(142,698)
  assert len(v['parents'])==2 and len(v['artifacts'])==6
  for a in v['parents']+v['artifacts']:keys(a,'path sha256');assert sha(a['path'])==a['sha256'];bindings.append(a)
  j='Frozen repair descriptor references exact two prior cohort plans and six repair sources;142 same runs/698 selected prefixes. Source/parent commitments are exact, but freeze declaration is not independent timestamp proof. No new psychological or identity law.'
 elif name=='EMBODIED_REPAIR_PLAN.json':
  keys(v,'scope artifacts');assert len(v['artifacts'])==5
  for a in v['artifacts']:keys(a,'path sha256');assert sha(a['path'])==a['sha256'];bindings.append(a)
  j='Five exact repair/guard/test/harness bindings; seven preexisting embodied cases, every original complete prefix. Scope derives from original qualifier and frozen sources; no new biological phenomenon.'
 elif name=='PRESERVATION.json':
  keys(v,'status artifacts');assert v['status']=='PRE-REPAIR SOURCE GRAPH' and len(v['artifacts'])==1108;assert len(set(a['original'] for a in v['artifacts']))==1108
  for a in v['artifacts']:keys(a,'original archive sha256');assert sha(a['archive'])==a['sha256'];bindings.append(a)
  j='Exact1108 original/archive mappings preserve pre-repair dependency bytes. Loader hashes archive before substituting original paths for historical receipt checks only. Manifest status is provenance declaration, not current behavioral qualification or whole semantic review of1108 source files. Archive JSON/Markdown occurrences remain separate role work.'
 else:
  assert v=={'exitCode':0,'status':'PASS'};log=R/name.replace('.json','.log');s=log.read_text(encoding='utf-8');assert 'check:boundaries && tsc -b && vite build' in s and 'Reference boundary check passed.' in s and '3 modules transformed.' in s and 'built in' in s;assert sha(log)==cb[log.as_posix()];chain.append(ref(log))
  j='Successful historical boundary/typecheck/Vite build receipt paired with exact log. Three transformed UI modules are not psychological coverage and build is not a test run. No fresh build in this review.'
 roles.append(dict(**ref(p),role='WHOLE PLAN / PROVENANCE / BUILD SCHEMA',judgment=j,acceptanceChain=chain))
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)}
for r in roles:assert r['sha256']==entries[r['path']]['sha256']==cb[r['path']]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text']
  narrative=u['location']['pointer'] in ['/scope','/status'] and not u['source'].endswith(('BUILD_REV2.json','BUILD_REV3.json'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPE / PROVENANCE DECLARATION' if narrative else 'TYPED RUNNER / MANIFEST BACKING',judgment=next(r['judgment'] for r in roles if r['path']==u['source'])))
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='10 REPAIR METADATA SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,failedAssertions=failures,sourceBindings=bindings,stringLeaves=len(strings),testCorrection=[ref(old),ref(current)],obligations=obs,limits=['No fresh tests/replay/build.','Preservation manifest does not establish whole semantic review of its1108 archived files.','Freeze/provenance statuses are declarations, not authenticated timestamps.']))
c=dict(status='PASS; HQ011 OPEN',sources=10,originalNarrativeOccurrences=sum(r['role'].startswith('SCOPE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),failedAssertions=len(failures),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

"""Six developmental runner receipts: all strings, timeouts and actual outcome accounting."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-tests-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
selected={(P/f'DEVELOPMENT_{lane}_{suffix}.json').as_posix():lane for lane in ['COMPONENT','PUBLIC'] for suffix in ['TESTS_DEV1','TESTS_DEV2','REFERENCE_TESTS_REV1']}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};bindings=collections.defaultdict(list)
parents=['DEVELOPMENT_COMPONENT_CLOSURE_REV1.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json','DEVELOPMENT_COMPONENT_CHECK_REV1.json','DEVELOPMENT_PUBLIC_CHECK_REV3.json','DEVELOPMENT_PUBLIC_PLAN_REV1.json']
for name in parents:
 parent=P/name
 for a in load(parent)['files']:
  if a['path'] in selected:bindings[a['path']].append(dict(path=parent.as_posix(),sha256=sha(parent),expected=a['sha256']))
candidate=(P/'DEVELOPMENT_PUBLIC_TESTS_DEV1.json').as_posix()
assert not bindings[candidate]
bindings[candidate].append(dict(path=(B/'manifest.json').as_posix(),sha256=sha(B/'manifest.json'),expected=entries[candidate]['sha256'],role='CENSUS PRESERVATION ONLY; NOT QUALIFICATION ACCEPTANCE'))
reportKeys=set('numTotalTestSuites numPassedTestSuites numFailedTestSuites numPendingTestSuites numTotalTests numPassedTests numFailedTests numPendingTests numTodoTests snapshot startTime success testResults'.split())
snapshotKeys=set('added failure filesAdded filesRemoved filesRemovedList filesUnmatched filesUpdated matched total unchecked uncheckedKeysByFile unmatched updated didUpdate'.split())
fileKeys=set('assertionResults startTime endTime status message name'.split());assertionKeys=set('ancestorTitles fullName status title duration failureMessages meta'.split())
files={};sourceRoles=[];failed=[]
for path,family in selected.items():
 j=load(path);h=sha(path);assert h==entries[path]['sha256'];assert bindings[path],path
 assert all(b['expected']==h for b in bindings[path]),path
 assert set(j)==reportKeys and set(j['snapshot'])==snapshotKeys
 assert j['snapshot']['filesRemovedList']==j['snapshot']['uncheckedKeysByFile']==[]
 assert not j['snapshot']['failure'] and not j['snapshot']['didUpdate']
 assert all(j['snapshot'][k]==0 for k in snapshotKeys-{'filesRemovedList','uncheckedKeysByFile','failure','didUpdate'})
 counts=collections.Counter()
 for fi,f in enumerate(j['testResults']):
  assert set(f)==fileKeys and f['message']=='' and f['status'] in ['passed','failed']
  assert isinstance(f['name'],str) and f['name'].endswith('.test.ts')
  for ai,a in enumerate(f['assertionResults']):
   assert set(a)==assertionKeys and a['meta']=={}
   assert a['status'] in ['passed','failed'];assert all(isinstance(t,str) for t in a['ancestorTitles'])
   assert isinstance(a['fullName'],str) and isinstance(a['title'],str);counts[a['status']]+=1
   if a['status']=='passed':assert a['failureMessages']==[]
   else:
    assert len(a['failureMessages'])==1
    assert Path(path).name=='DEVELOPMENT_COMPONENT_TESTS_DEV1.json'
    assert a['failureMessages'][0].startswith('Error: Test timed out in 5000ms.')
    disposition='Default5000ms timeout, not a failed behavioral assertion. Preserve6 passing/7 timed-out tests; DEV2 raises timeout and passes13 without changing production mathematics. Startup denial ran no tests.'
    failed.append(dict(source=path,fileIndex=fi,assertionIndex=ai,fullName=a['fullName'],message=a['failureMessages'][0],disposition=disposition,qualification=(P/('CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md' if family=='COMPONENT' else 'CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md')).as_posix()))
  assert (f['status']=='failed')==any(a['status']=='failed' for a in f['assertionResults'])
 assert counts['passed']==j['numPassedTests'] and counts['failed']==j['numFailedTests']
 assert counts.total()==j['numTotalTests'] and j['numPendingTests']==j['numTodoTests']==0
 assert j['numPassedTestSuites']+j['numFailedTestSuites']+j['numPendingTestSuites']==j['numTotalTestSuites']
 assert j['success']==(counts['failed']==0)
 files[path]=j
 sourceRoles.append(dict(path=path,sha256=h,role='PRESERVED FAILED TEST RECEIPT' if counts['failed'] else 'AUTHENTICATED TEST BACKING RECEIPT',
  reference=Path(path).name.endswith('REFERENCE_TESTS_REV1.json'),passed=counts['passed'],failed=counts['failed'],bindings=bindings[path],
  acceptance='Typed runner-result schema and actual assertion outcomes checked against original census hash and scoped closure/plan/preservation bindings. Assertion names state test intent; their truth is bounded by the actual tests and qualification, not the wording alone.',
  limits='No new test execution. Repeated reference runs and byte-identical archived copies add no independent psychological finding; old implementation remains a control, not current architectural authority.'))
def walk(x,pointer=''):
 if isinstance(x,str):yield pointer,x
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from walk(v,pointer+'/'+str(i))
 elif isinstance(x,dict):
  for k,v in x.items():yield from walk(v,pointer+'/'+k.replace('~','~0').replace('/','~1'))
def role(pointer):
 if re.fullmatch(r'/testResults/\d+/assertionResults/\d+/(fullName|title|ancestorTitles/\d+)',pointer):return 'EXECUTABLE ASSERTION LABEL'
 if re.fullmatch(r'/testResults/\d+/assertionResults/\d+/failureMessages/\d+',pointer):return 'PRESERVED FAILED ASSERTION DIAGNOSTIC'
 if re.fullmatch(r'/testResults/\d+(?:/assertionResults/\d+)?/status',pointer):return 'TYPED RUNNER STATUS'
 if re.fullmatch(r'/testResults/\d+/name',pointer):return 'TEST SOURCE PATH'
 if re.fullmatch(r'/testResults/\d+/message',pointer):return 'EMPTY SUITE DIAGNOSTIC'
 raise AssertionError((pointer,'unreviewed string field'))
rows=[];original=set()
with (B/'units.jsonl').open(encoding='utf-8') as stream:
 for line in stream:
  u=json.loads(line)
  if u['source'] not in files:continue
  ptr=u['location']['pointer'];r=role(ptr);node=files[u['source']]
  for k in ptr.lstrip('/').split('/'):node=node[int(k)] if isinstance(node,list) else node[k]
  assert node==u['text'];original.add((u['source'],ptr))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=r,
   disposition='Preserved test intent/outcome/diagnostic backing for the exact bound source version; not an unqualified research OPEN or universal equivalence claim. Failed assertions are explicitly reconciled in failureDispositions.',obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
omitted=[]
for path,j in files.items():
 for pointer,text in walk(j):
  r=role(pointer)
  if (path,pointer) not in original:omitted.append(dict(source=path,sourceSha256=sha(path),pointer=pointer,text=text,role=r,disposition='Short/empty typed backing string outside frozen prose extraction; retained with exact context, not a discarded material finding.'))

assert len(failed)==7
for r in sourceRoles:
 if r['path']==candidate:
  r['role']='CENSUS-PRESERVED DEVELOPMENT RECEIPT; NOT DIRECTLY CLOSURE-BOUND'
  r['acceptance']='Exact frozen census identity and closed runner schema; accepted public narrative gives contextual support for two21-pass cohorts, but no direct receipt hash in inspected closure/check/plan set. Final qualification relies on DEV2; this receipt cannot replace it.'
 r['acceptanceChain']=[dict(path=b['path'],sha256=b['sha256']) for b in r['bindings']]+[dict(path=r['path'],sha256=r['sha256'])]
 r['judgment']=r['acceptance']+' '+r['limits']
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='SIX DEVELOPMENT TEST RECEIPTS RECONCILED; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,omittedStrings=omitted,failureDispositions=failed,obligations=obs,limits=['Historical runner outcomes only; no new test execution.','Seven timeouts are incomplete tests, not seven behavioral counterexamples; corrected cohort remains distinct.','Both public test cohorts pass21; separate test-only compiler failure is preserved in the preflight record.','Assertion labels document test intent rather than proving universal psychological claims. Repeated328-test reference receipts remain backing controls.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],sources=len(files),originalBackingOccurrences=len(rows),omittedStrings=len(omitted),failedAssertions=len(failed),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

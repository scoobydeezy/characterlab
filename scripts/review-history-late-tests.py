"""Classify authenticated Vitest receipts, retaining failed cohorts and exact occurrences."""
from pathlib import Path
import json,hashlib,re,collections,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-late-tests-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
families={
 'LONGITUDINAL_GOAL':dict(qualification='CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md',plan='LONGITUDINAL_GOAL_PLAN_REV1.json',closure='LONGITUDINAL_GOAL_CLOSURE_REV1.json',tests=['DEVELOPMENT_TESTS_REV1','DEVELOPMENT_TESTS_REV2','HORIZON_TESTS_REV1','REFERENCE_TESTS_REV1']),
 'LONGITUDINAL_ROUTINE':dict(qualification='CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md',plan='LONGITUDINAL_ROUTINE_PLAN_REV1.json',closure='LONGITUDINAL_ROUTINE_CLOSURE_REV1.json',tests=['DEVELOPMENT_TESTS_REV1','DEVELOPMENT_TESTS_REV2','DEVELOPMENT_TESTS_REV3','REFERENCE_TESTS_REV1']),
 'LONGITUDINAL_HABIT':dict(qualification='CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',plan='LONGITUDINAL_HABIT_PLAN_REV2.json',closure='LONGITUDINAL_HABIT_CLOSURE_REV1.json',tests=['DEVELOPMENT_TESTS_REV1','JOIN_TESTS_REV1','MEMORY_OWNER_TESTS_REV1','REFERENCE_TESTS_REV1']),
 'LONGITUDINAL_PERSONAL_LOSS':dict(qualification='CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md',plan='LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json',closure='LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json',tests=['TESTS_REV1','REFERENCE_TESTS_REV1']),
 'AFFECT_REGULATORY':dict(qualification='CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md',plan='AFFECT_REGULATORY_PLAN_REV1.json',closure='AFFECT_REGULATORY_CLOSURE_REV1.json',tests=['TESTS_REV1','REFERENCE_TESTS_REV1'])
}
selected={str(P/(family+'_'+suffix+'.json')).replace('\\','/'):family for family,s in families.items() for suffix in s['tests']}
aliases={
 'longitudinal-goal-development-rev1/LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV1.json':'LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV1.json',
 'longitudinal-routine-development-rev1/LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV1.json':'LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV1.json',
 'longitudinal-routine-development-rev2/LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV2.json':'LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV2.json'}
for a,original in aliases.items():selected[(P/a).as_posix()]=selected[(P/original).as_posix()]
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
parents={};bindings=collections.defaultdict(list)
parentNames=[s[k] for s in families.values() for k in ['closure','plan']]+[
 'LONGITUDINAL_GOAL_IMPLEMENTATION_CHECK_REV1.json','LONGITUDINAL_ROUTINE_IMPLEMENTATION_CHECK_REV1.json','LONGITUDINAL_HABIT_IMPLEMENTATION_CHECK_REV1.json',
 'longitudinal-goal-development-rev1/PRESERVATION.json','longitudinal-routine-development-rev1/PRESERVATION.json','longitudinal-routine-development-rev2/PRESERVATION.json']
def collect(x,parent):
 if isinstance(x,list):
  for v in x:collect(v,parent)
 elif isinstance(x,dict):
  if 'sha256' in x:
   for k in ['path','preserved']:
    if x.get(k) in selected:bindings[x[k]].append(dict(path=parent,sha256=sha(parent),expected=x['sha256']))
  if x.get('Path','').replace('\\','/') in selected:bindings[x['Path'].replace('\\','/')].append(dict(path=parent,sha256=sha(parent),expected=x['Hash'].lower()))
  for v in x.values():collect(v,parent)
for name in parentNames:
 p=P/name;parents[p.as_posix()]=sha(p);collect(load(p),p.as_posix())
for alias,original in aliases.items():
 a=(P/alias).as_posix();o=(P/original).as_posix();assert sha(a)==sha(o)
 assert bindings[o] and bindings[a],(a,'requires original and preservation binding')
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
    if Path(path).name=='LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV1.json':
     assert a['title']=='NoFeedback preserves acquired biography and goal but removes its later reason modifier' and 'to not deeply equal' in a['failureMessages'][0]
     disposition='Failed expected coarse NoFeedback inequality: source standing survived but coarse receiving quantized to zero. FineStanding is a named calibration comparator, not a silent change to make the original law necessary; coarse equality remains.'
    elif Path(path).name=='LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV1.json':
     assert a['failureMessages'][0].startswith('Error: HABIT_CODEC: occurrence')
     disposition='All nine assertions were blocked by text-versus-unsigned occurrence construction. Later adapter correction and separate successful evidence supersede this construction cohort; these failures did not establish nine psychological counterexamples.'
    elif Path(path).name=='LONGITUDINAL_ROUTINE_DEVELOPMENT_TESTS_REV2.json':
     assert a['title']=='native biography and acquired receiving history both survive the real episode-expiry gap' and 'expected false to be true' in a['failureMessages'][0]
     disposition='Mistaken must-resume-at14 assertion: contrary biography permits availability while selecting idle. Preserve the failure; complete later horizon resumes at15 without changing calibration to force14.'
    else:raise AssertionError((path,a['title'],'unreviewed failure'))
    failed.append(dict(source=path,fileIndex=fi,assertionIndex=ai,fullName=a['fullName'],message=a['failureMessages'][0],disposition=disposition,qualification=(P/families[family]['qualification']).as_posix()))
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
v=dict(status='NINETEEN TEST RECEIPT SOURCE ROLES REVIEWED; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,failureDispositions=failed,
 evidence=[dict(path=(P/'campaign3-history-late-qualifications-rev1/review.json').as_posix(),sha256=sha(P/'campaign3-history-late-qualifications-rev1/review.json'))],
 aliases=[dict(path=(P/a).as_posix(),sameBytesAs=(P/o).as_posix(),sha256=sha(P/a),rationale='Explicit preserved copy of the same failed execution; preserve both original source IDs without counting two independent failures.') for a,o in aliases.items()],
 obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['This classifies closed runner schemas and all string fields, not every test title as a new scientific finding. Matrices/qualifications govern psychological scope.','Failed messages and original versions survive; revised successful reports do not rewrite failed receipts.','No fresh production test/reference suite/build, benchmark or native admission. Numeric wall-clock/duration values are backing execution metadata, not deterministic model semantics.','Other report schemas and source files remain outside this batch.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
addendum=dict(status='ALL STRINGS IN NINETEEN RUNNER RECEIPTS ACCOUNTED',omittedStrings=omitted,evidence=dict(path=(O/'review.json').as_posix(),sha256=sha(O/'review.json')),obligations=['RO-C3-019','RO-C3-020','RO-C3-021'])
save(O/'schema-addendum.json',addendum)
c=dict(status=v['status'],files=len(files),distinctByteIdentities=len({sha(p) for p in files}),originalBackingOccurrences=len(rows),omittedBackingStrings=len(omitted),failedAssertionOccurrences=len(failed),distinctFailedExecutions=3,referenceReportFiles=5,reviewSha256=sha(O/'review.json'),schemaAddendumSha256=sha(O/'schema-addendum.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

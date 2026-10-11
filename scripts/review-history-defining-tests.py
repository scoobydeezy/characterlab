"""Defining runner schemas, setup failures and immutable development cohorts."""
from pathlib import Path
import json,hashlib,collections,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-tests-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
index=load(P/'campaign3-history-source-roles-rev22/index.json');entries={x['path']:x for x in load(B/'manifest.json')['entries']}
selected=[x for x in index['unassignedCandidatePaths'] if 'defining' in x.lower() and 'TESTS_' in x];assert len(selected)==48
findings={p.parent.name:load(p) for p in P.glob('defining-*/PRESERVATION.json')}
failureMap={
 'DEFINING_ACQUISITION_TESTS_DEV1.json':('defining-acquisition-development-rev1','Test read instant instead of dueAt; cutoff assertion failed, not acquisition equality or replay.'),
 'DEFINING_LIFECYCLE_TESTS_DEV1.json':('defining-lifecycle-development-rev2','JSON.stringify omitted Map trace fields. Review also corrected actual successor registration/work-budget commitments; this is not merely a test-only source cohort.'),
 'DEFINING_MEANING_TESTS_DEV1.json':('defining-meaning-development-rev1','Equal uncertain intervals do not imply known SameDistance. Three incorrect test expectations corrected; accepted mathematics retained.'),
 'DEFINING_MEMORY_OWNER_TESTS_DEV1.json':('defining-memory-owner-development-rev2','TRIAL_CONTEXT_SHAPE correctly rejected extra adapter metadata. Narrow adapter to experience/context/panel; do not weaken strict boundary.'),
 'DEFINING_MEMORY_TESTS_DEV1.json':('defining-memory-development-rev1','Set/List adapter failed before psychological assertions.13 rejected tests supply no psychological pass.'),
 'DEFINING_NATIVE_CURRENT_TESTS_DEV1.json':('defining-current-development-rev1','Test parsed StatePatch as145 instead of144. Eight other tests passed; production unchanged by test correction.'),
 'DEFINING_NATIVE_MEANING_CONTROL_TESTS_REV1.json':('defining-memory-owner-development-rev4','Raw protocol580 in generic invariant trace rejected. Encode exact protocol evidence as bytes, outside cognitive reads; not a psychological comparison failure.'),
 'DEFINING_NATIVE_MEMORY_TESTS_DEV1.json':('defining-memory-owner-development-rev3','beforeAll rejected new child1488 in inherited trace codec.40 preserved tests passed; seven native assertions skipped. Add successor codec, preserve original GA codec. Zero failed assertions is not native success.'),
 'DEFINING_NATIVE_MEMORY_TESTS_REV1.json':('defining-memory-owner-development-rev4','beforeAll rejected raw protocol580 in generic trace tuple.40 preserved tests passed; seven native assertions skipped. Typed trace repair is required; zero failed assertions is not success.'),
 'DEFINING_NATIVE_MEMORY_TESTS_REV2.json':('defining-memory-owner-development-rev5','Two terminal test adapters passed successor state1485 to predecessor-only decoder. Project predecessor partition in tests; native scheduling/replay/rollback already passed.'),
 'DEFINING_NATIVE_REHEARSAL_TESTS_DEV1.json':('defining-rehearsal-development-rev1','Test decoded ScheduledEvent as171/field3 instead of130/field2. No-publication assertion reached for absent cue; capacity-zero second control was not reached. Six other tests pass; no production correction.')
}
bindings=collections.defaultdict(list)
for parent in list(P.glob('DEFINING_*CHECK*.json'))+list(P.glob('DEFINING_*CLOSURE*.json'))+list(P.glob('DEFINING_*PLAN*.json'))+list(P.glob('defining-*/PRESERVATION.json')):
 v=load(parent)
 for key in ['files','artifacts']:
  for a in v.get(key,[]):
   if a.get('path') in selected:
    assert sha(a['path'])==a['sha256'];bindings[a['path']].append(ref(parent))
reportKeys=set('numTotalTestSuites numPassedTestSuites numFailedTestSuites numPendingTestSuites numTotalTests numPassedTests numFailedTests numPendingTests numTodoTests snapshot startTime success testResults'.split())
snapshotKeys=set('added failure filesAdded filesRemoved filesRemovedList filesUnmatched filesUpdated matched total unchecked uncheckedKeysByFile unmatched updated didUpdate'.split())
fileKeys=set('assertionResults startTime endTime status message name'.split());assertionKeys=set('ancestorTitles fullName status title duration failureMessages meta'.split())
sources={};roles=[];failures=[];setups=[];summaries=[]
for path in selected:
 v=load(path);h=sha(path);assert h==entries[path]['sha256'];assert set(v)==reportKeys and set(v['snapshot'])==snapshotKeys
 snap=v['snapshot'];assert snap['filesRemovedList']==snap['uncheckedKeysByFile']==[] and not snap['failure'] and not snap['didUpdate'];assert all(snap[k]==0 for k in snapshotKeys-{'filesRemovedList','uncheckedKeysByFile','failure','didUpdate'})
 counts=collections.Counter();badSuite=False
 for fi,f in enumerate(v['testResults']):
  assert set(f)==fileKeys and f['status'] in ['passed','failed'] and f['name'].endswith('.test.ts');badSuite|=f['status']=='failed'
  if f['message']:
   assert f['message'] in ['unknown record schema 1488/1','unknown record schema 580/1'];assert f['status']=='failed'
   finding,disposition=failureMap[Path(path).name];setups.append(dict(source=path,fileIndex=fi,message=f['message'],disposition=disposition,evidence=ref(P/finding/'PRESERVATION.json')))
  for ai,a in enumerate(f['assertionResults']):
   assert set(a) in [assertionKeys,assertionKeys-{'duration'}] and a['meta']=={};assert a['status'] in ['passed','failed','skipped'];counts[a['status']]+=1
   assert all(isinstance(x,str) for x in a['ancestorTitles']) and isinstance(a['title'],str) and isinstance(a['fullName'],str)
   if a['status']=='failed':
    assert len(a['failureMessages'])==1;finding,disposition=failureMap[Path(path).name]
    failures.append(dict(source=path,fileIndex=fi,assertionIndex=ai,title=a['title'],message=a['failureMessages'][0],disposition=disposition,evidence=ref(P/finding/'PRESERVATION.json')))
   else:assert a['failureMessages']==[]
  if f['status']=='passed':assert all(a['status']=='passed' for a in f['assertionResults'])
 assert counts['passed']==v['numPassedTests'] and counts['failed']==v['numFailedTests'] and counts['skipped']==v['numPendingTests'];assert sum(counts.values())==v['numTotalTests'] and v['numTodoTests']==0
 assert v['numPassedTestSuites']+v['numFailedTestSuites']+v['numPendingTestSuites']==v['numTotalTestSuites'];assert v['success']==(not badSuite)
 if counts['skipped']:assert counts['skipped']==7 and Path(path).name in ['DEFINING_NATIVE_MEMORY_TESTS_DEV1.json','DEFINING_NATIVE_MEMORY_TESTS_REV1.json']
 chain=bindings[path] or [ref(B/'manifest.json')]
 judgment='Exact historical runner schema/outcomes; assertion labels are test intent, not universal findings. Repeated reference suites and archive copies add no independent coverage. '+('Scoped receipt hash binding in inspected check/closure/plan/preservation set.' if bindings[path] else 'Census-preserved contextual receipt: no direct hash binding in inspected set; do not substitute for final qualification evidence.')
 roles.append(dict(path=path,sha256=h,role='WHOLE RUNNER RECEIPT SCHEMA',judgment=judgment,acceptanceChain=chain));sources[path]=v
 summaries.append(dict(path=path,sha256=h,passed=counts['passed'],failed=counts['failed'],pending=counts['skipped'],success=v['success'],directBinding=bool(bindings[path])))
for name,v in findings.items():
 p=P/name/'PRESERVATION.json';path=p.as_posix()
 if path not in index['unassignedCandidatePaths']:continue
 assert set(v)<=set('finding status files result diagnostics manifest'.split()) and 'finding' in v;assert sha(p)==entries[path]['sha256']
 for a in v.get('files',[]):assert set(a) in [{'path','sha256'},{'original','path','sha256'}] and sha(a['path'])==a['sha256']
 if 'manifest' in v:assert Path(v['manifest']).exists() and v['diagnostics']==['TS2307 Cannot find module node:crypto','TS2580 Cannot find name Buffer']
 sources[path]=v;roles.append(dict(**ref(p),role='WHOLE DEVELOPMENT FAILURE PRESERVATION',judgment=v['finding']+' '+v.get('result','')+' Preserve attempted source cohort; later success does not rewrite failure. Compiler-before-execution and skipped setup assertions do not supply behavioral qualification.',acceptanceChain=[ref(p),ref(B/'manifest.json')]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)};rows=[];rolemap={x['path']:x for x in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources:continue
  assert u['sourceSha256']==entries[p]['sha256'] and strings[p,u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='PRESERVED DEVELOPMENT FINDING' if p.endswith('/PRESERVATION.json') else 'TYPED TEST BACKING',judgment=rolemap[p]['judgment']))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='DEFINING TEST/FAILURE SCHEMAS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,receipts=summaries,failedAssertions=failures,setupFailures=setups,stringLeaves=len(strings),obligations=obs,limits=['No fresh tests or production changes. Copied failed diagnostics remain separately located but do not count as independent failed executions.','Binding search scope explicit; census-only contextual receipts cannot replace final evidence.','Seven skipped native assertions in each affected copy/cohort are not seven passing native tests.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),runnerSources=len(selected),distinctRunnerHashes=len(set(x['sha256'] for x in summaries)),originalNarrativeOccurrences=sum(x['role']=='PRESERVED DEVELOPMENT FINDING' for x in rows),originalBackingOccurrences=sum(x['role']=='TYPED TEST BACKING' for x in rows),stringLeaves=len(strings),failedAssertionOccurrences=len(failures),setupFailureOccurrences=len(setups),contextualOnlyReceipts=[x['path'] for x in summaries if not x['directBinding']],reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

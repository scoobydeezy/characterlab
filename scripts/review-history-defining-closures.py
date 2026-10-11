"""Closure/identity metadata and separately named owner runner receipts."""
from pathlib import Path
import json,hashlib,subprocess,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-closures-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json':('status scope models cases replayedStages counters files',dict(models=4,cases=288,replayedStages=864),'Component repeated stages, not native restores; bridge leaves broader frontier open. Later qualification does not enlarge this288-case scope.'),
 'DEFINING_MEANING_CLOSURE_REV1.json':('status scope models cases replayedStages counters files',dict(models=4,cases=68,replayedStages=308),'Meaning/use component only; counted rehearsals and goal-relative meaning, native admission separately owed.'),
 'DEFINING_PUBLIC_CLOSURE_REV1.json':('status verdict version scope programs models runs prefixes advancing terminal nativeStageComparisons diagnosticObserverPairs tests referenceTests counters files',dict(programs=68,models=68,runs=68,prefixes=1680,advancing=1612,terminal=68,nativeStageComparisons=376,diagnosticObserverPairs=8,tests=17,referenceTests=328),'Bounded public qualification with one successor per restored prefix. Selected68 programs/four laws, no comparator retirement/full domain/full tails. Historical53/56 and1492/0 remain historical.'),
 'DEFINING_PUBLIC_IDENTITIES_REV1.json':('status scope corpusVersion manifestHash experimentIdentity experimentDigest comparisonCase comparisonDigest runs derivationScript',{},'Exact experiment/comparison/model/run identity graph reconstructed by preserved read-only identity check. Derived from frozen manifest and actual baselines after execution, not independent pre-execution packet. No runtime/RNG intervention.'),
 'DEFINING_PUBLIC_IMPLEMENTATION_CHECK_REV1.json':('status qualification profiles actualInstants selectedNativeStageComparisons saveImages successfulRestoreClocks reachedFaultInstants focusedTests referenceTests counters files',dict(profiles=1,actualInstants=27,selectedNativeStageComparisons=8,saveImages=9,focusedTests=17,referenceTests=328),'Focused1-profile implementation evidence, only restores0/39/4000 with final-tail39 and faults38/39/42/43/4000. Native handler body exact predecessor; this alone did not qualify all68 programs.'),
 'DEFINING_PUBLIC_MATRIX_CHECK_REV1.json':('status scope programs models runIdentities restorePrefixes advancingSuccessorChecks terminalExhaustionChecks nativeStateOutputStageComparisons wholeObserverDiagnosticPairs productionChanges countersAtExecution files',dict(programs=68,models=68,runIdentities=68,restorePrefixes=1680,advancingSuccessorChecks=1612,terminalExhaustionChecks=68,nativeStateOutputStageComparisons=376,productionChanges=0),'Whole receipt tree hashes/counts and diagnostic pairs verified. No fresh replay from this audit, no new physical-world sensing or full-tail claim. Original execution1492/8 distinct from closure reset1492/0.'),
 'DEFINING_WRAPPER_EXTENSION_REV1.json':('status scope producers factories additions evidence',dict(producers=53,factories=56),'Historical53/56 inventory/publication obligation. Both runtime and factory guards with focused tests, not complete prefix qualification. Source bindings verified; current55/58 inventory has successor scope and is not rerun as53 here.')
}
O.mkdir(exist_ok=True);cp=O/'commands.json'
if not cp.exists():
 r=subprocess.run(['node','scripts/check-defining-public-implementation.mjs'],capture_output=True,text=True);assert r.returncode==0,(r.stdout,r.stderr)
 save(cp,dict(command='node scripts/check-defining-public-implementation.mjs',exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref('scripts/check-defining-public-implementation.mjs'),scope='Read-only stored implementation receipt reconstruction; no new tests/replay/build.'))
entries={x['path']:x for x in load(B/'manifest.json')['entries']};sources={};roles=[];bindings=[]
for name,(keys,values,judgment) in specs.items():
 p=P/name;v=load(p);assert set(v)==set(keys.split());assert sha(p)==entries[p.as_posix()]['sha256']
 for k,x in values.items():assert v[k]==x
 for k in ['files','additions','evidence']:
  for a in v.get(k,[]):assert set(a)=={'path','sha256'} and sha(a['path'])==a['sha256'];bindings.append(a)
 if 'counters' in v:
  expected=dict(highestAllocated=1484,sinceVerdict=0) if 'PUBLIC' not in name else dict(highestAllocatedRecordType=1492,allocatedSinceVerdict=0) if 'CLOSURE' in name else dict(highestAllocated=1492,sinceVerdict=8)
  assert v['counters']==expected
 if 'countersAtExecution' in v:assert v['countersAtExecution']==dict(highestAllocated=1492,sinceVerdict=8)
 if 'successfulRestoreClocks' in v:assert v['successfulRestoreClocks']==[0,39,4000] and v['reachedFaultInstants']==[38,39,42,43,4000]
 if 'wholeObserverDiagnosticPairs' in v:assert v['wholeObserverDiagnosticPairs']==load(P/'DEFINING_NATIVE_COHORT_CHECK_REV1.json')['diagnosticPairs']
 if 'experimentIdentity' in v:
  assert v['corpusVersion']=='0.29.0' and v['manifestHash']==sha(P/'defining-public-matrix-rev1/MANIFEST.json') and v['derivationScript']==sha('scripts/identify-defining-public-matrix.mjs') and len(v['runs'])==68
  for i,r in enumerate(v['runs']):
   assert set(r)==set('index modelIdentity runIdentity modelDigest runDigest'.split()) and r['index']==i
   b=load(P/f'defining-public-matrix-rev1/CASE_{i:02}/BASELINE.json')
   for k in ['modelIdentity','runIdentity']:assert r[k]==b[k]
 sources[p.as_posix()]=v;roles.append(dict(**ref(p),role='WHOLE CLOSURE / IDENTITY METADATA',judgment=judgment,acceptanceChain=[ref(cp),ref(P/'campaign3-history-defining-public-rev1/commands.json'),ref(P/'campaign3-history-defining-components-rev1/commands.json')]))
owner=P/'DEFINING_REHEARSAL_OWNERS_DEV1.json';arch=P/'defining-rehearsal-development-rev1/DEFINING_REHEARSAL_OWNERS_DEV1.json';assert owner.read_bytes()==arch.read_bytes()
for p in [owner,arch]:
 v=load(p);assert sha(p)==entries[p.as_posix()]['sha256'];assert set(v)==set('numTotalTestSuites numPassedTestSuites numFailedTestSuites numPendingTestSuites numTotalTests numPassedTests numFailedTests numPendingTests numTodoTests snapshot startTime success testResults'.split())
 assert v['success'] and v['numTotalTests']==v['numPassedTests']==3 and v['numFailedTests']==v['numPendingTests']==v['numTodoTests']==0
 assert v['numTotalTestSuites']==v['numPassedTestSuites']==1 and v['numFailedTestSuites']==v['numPendingTestSuites']==0
 assert v['snapshot']==dict(added=0,failure=False,filesAdded=0,filesRemoved=0,filesRemovedList=[],filesUnmatched=0,filesUpdated=0,matched=0,total=0,unchecked=0,uncheckedKeysByFile=[],unmatched=0,updated=0,didUpdate=False)
 assert len(v['testResults'])==1;f=v['testResults'][0];assert set(f)==set('assertionResults startTime endTime status message name'.split()) and f['status']=='passed' and f['message']=='' and len(f['assertionResults'])==3
 for a in f['assertionResults']:assert set(a)==set('ancestorTitles fullName status title duration failureMessages meta'.split()) and a['status']=='passed' and a['failureMessages']==[] and a['meta']=={}
 sources[p.as_posix()]=v;roles.append(dict(**ref(p),role='WHOLE OWNER TEST RECEIPT / EXACT ARCHIVE',judgment='Three owner tests pass, including68 component continuations and separate final-presentation append; not68 native runs. Exact archived copy is the same execution, not independent coverage. Native6/1 development failure remains separately preserved.',acceptanceChain=[ref(P/'defining-rehearsal-development-rev1/PRESERVATION.json'),ref(P/'DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md')]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};rows=[];rolemap={x['path']:x for x in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources:continue
  assert u['sourceSha256']==entries[p]['sha256'] and strings[p,u['location']['pointer']]==u['text']
  backing='OWNERS_DEV1' in p
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='OWNER TEST BACKING' if backing else 'SCOPED CLOSURE CLAIM',judgment=rolemap[p]['judgment']))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='NINE DEFINING CLOSURE/OWNER RECEIPTS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,bindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Reference binding does not grant whole transitive source review.','Historic wrapper count is not current exhaustive inventory.','Owner repeats, native stages, public prefixes and terminal checks remain distinct.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role']=='SCOPED CLOSURE CLAIM' for r in rows),originalBackingOccurrences=sum(r['role']=='OWNER TEST BACKING' for r in rows),stringLeaves=len(strings),bindings=len(bindings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

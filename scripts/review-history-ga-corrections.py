"""Preserve first GA component receipts and directly reproduced correction findings."""
from pathlib import Path
from collections import Counter
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-corrections-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fps(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fps(x)
 elif isinstance(v,list):
  for x in v:yield from fps(x)
specs={
 'ENCODING_COMPONENT_ISOLATION_CORRECTION.md':'Two JavaScript representation gaps,not newpsychologicallaws:readonly rationals remained runtime-mutable andArray.map skippedholes. Exactpre-correction source pairedwitness reproduces returnedrole mutation changingnext243/1243to0,sharedone1/2to1/100,sharedzero0to99,andaccepted sparse raw hole. Correctedprivateconstants freeze,denselistvalidation andfreshrolecopy preserveunchangedinputsandformulas. No globalExactRationalchange;mutable detachedrole remainsallowed withoutinternalalias. Earlier passingvectors didnotdetecttheseadditionaldistinctions.',
 'OBSERVED_MARKER_TRACKING_DENSE_LIST_CORRECTION.md':'Exactoldtracking reachesTypeError onundefinedsparsedetection; correctedversion rejects atthedense-list boundary. Both leave entireprivate snapshotunchanged andacceptsameoriginalobservationforlateremptydense retry. This isearlier structuralrejection,not repairedpartial-statepublication or formerlyacceptedtrackinginput. No version,identity,record,publicsource extension. Old5faults preserved;forward6adds denseboundary fault.',
 'ENCODING_ACCESS_MATH_REVIEW_REV1.json':'Original12mathvectors/7faults remainhistoricalandfreshlyreplayedagainstSHA-exactpre-correctionkernel,allbaseline/mutantrows exact. Originalcode stillcontainsmutableconstants/sparsearraygaps demonstratedbyseparatepairedwitnesses; originalPASSneverqualifiedthosemissingisolationproperties. ForwardREV2preservesall7faultrows aftercorrection; no rewrittenoldsourcehash.',
 'SELECTED_ENCODING_REVIEW_REV1.json':'Original8selectedvectors/5faults freshlyreplayedwithSHA-exactoldencoder/math/attention. Exactrole/attention/flat/capability/Disabledbranchresults preserved. Additionalreturnedrolealias flaw demonstratedseparately,notretroactivelytestedbyoriginal5faults. UnitBudget aggregatebranch stillunexercised;SmallBudgetsuccessor suppliesdifferentcalibration. PublicadmissionandNeed/Incidental remainunqualified.',
 'OBSERVED_MARKER_TRACKING_REVIEW_REV1.json':'Original8trackingvectors/5faults freshlyreplayedagainstSHA-exactsourcebeforedenseguard. Collision,replay,horizonandatomicmalformedinputresults retainedinforwardREV2. Missingearlydenseguardwasnot partialstateleak: directpairedsparseprobe rejects inbothversions withoutchanges. Glyphinputs remaincomponentpremises,notauthenticatedworldobservations.',
 'ENCODING_ACCESS_MATH_TESTS_REV1.json':'Historical12assertions/onefilePASS; exactnames/statuses includedintheprior-turnfresh72suite. Separate17first-reviewfault replays do notturnthis intoa newfulltestexecution. Originaltests omittedlaterconstant/sparseisolationvectors.',
 'SELECTED_ENCODING_TESTS_REV1.json':'Historical8assertions/onefilePASS; exactnames/statuses retainedinfresh72. Existingoutputdetachmenttest didnotcoverinternalrole-rationalalias,whichadditionalisolationwitness nowreproduces. No claim thatpassedtesttitlesprovedallpossiblemutabilityboundaries.',
 'OBSERVED_MARKER_TRACKING_TESTS_REV1.json':'Historical8assertions/onefilePASS; exactnamedvectoroccurrences retainedinlater9andfresh72. Forwardninthassertion tests earlysparseguard andatomicity; oldmalformedinputcoverage didnotproveearlydensevalidation.',
 'SELECTED_ENCODING_BUDGET_TESTS_REV1.json':'Historical5assertions/onefilePASS,allretainedinfresh72; independentlycalibratedSmallBudget arithmetic,capabilityconsumption andunselectedinvariance. Extendswitnesscoverage ratherthanretroactivelychangingoldUnitBudget control.',
 'ENCODING_ASSOCIATION_COMPOSITION_TESTS_REV1.json':'Historical4assertions/onefilePASS,allretainedinfresh72. Distinguishesstrengthfromgraphoverflow,spreadfromlocal,andhypotheticalpresentationfrommutatingrank. Componentemptygraph/cue assumptions notpublicsourceorwriterqualification.'
}
specs={(P/n).as_posix():j for n,j in specs.items()};prior=load(P/'campaign3-history-source-roles-rev148/index.json');assert len(specs)==10 and not set(specs)&{r['path'] for r in prior['roleAssignments']}
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']};recovery=load(O/'source-recovery.json');assert len(recovery['found'])==3 and recovery['unavailable']==[]
for x in recovery['found']:assert ref(x['resolvedPath'])['sha256']==x['sha256'];archives[x['sha256']]=x['resolvedPath']
total=0
for n,count,forward in [('math',7,'ENCODING_ACCESS_MATH_REVIEW_REV2.json'),('tracking',5,'OBSERVED_MARKER_TRACKING_REVIEW_REV2.json'),('selected',5,'SELECTED_ENCODING_REVIEW_REV2.json')]:
 v=load(O/(n+'.json'));assert v['status']=='PASS' and len(v['faults'])==count;original=load(v['original']['path']);assert v['faults']==original['faults'] and v['baseline']==original['baseline'];assert v['faults']==load(P/forward)['faults'][:count]
 for f in fps(v):assert ref(f['path'])==f
 total+=count
assert total==17
paired=load(O/'paired-witnesses.json');assert paired['status']=='PASS'
for f in fps(paired):assert ref(f['path'])==dict(path=f['path'],sha256=f['sha256'])
a,b=paired['before'],paired['after'];assert [a['laterRoleStrength'],b['laterRoleStrength']]==['0/1','243/1243'];assert [a['afterOne'],b['afterOne']]==['1/100','1/2'];assert [a['afterZero'],b['afterZero']]==['99/1','0/1'];assert a['sparse']['accepted'] and not b['sparse']['accepted'];assert all(v['trackingUnchangedAfterFailure'] and v['emptyRetryAccepted'] for v in [a,b])
def tests(p,total):
 v=load(p);assert v['success'] and v['numPassedTests']==v['numTotalTests']==total and v['numFailedTests']==v['numPendingTests']==v['numTodoTests']==0
 assert set(v)=={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'} and not any(v['snapshot'].values())
 out=Counter()
 for t in v['testResults']:
  assert set(t)=={'assertionResults','endTime','message','name','startTime','status'} and t['status']=='passed' and t['message']==''
  for a in t['assertionResults']:
   assert set(a)=={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'} and a['status']=='passed' and a['failureMessages']==[] and a['meta']=={}
   out[(t['name'].replace('\\','/').split('/characterlab/',1)[1],a['fullName'])]+=1
 assert out.total()==total;return out
fresh=tests(P/'campaign3-history-ga-components-rev1/current-tests.json',72)
for n,total in [('ENCODING_ACCESS_MATH_TESTS_REV1.json',12),('SELECTED_ENCODING_TESTS_REV1.json',8),('OBSERVED_MARKER_TRACKING_TESTS_REV1.json',8),('SELECTED_ENCODING_BUDGET_TESTS_REV1.json',5),('ENCODING_ASSOCIATION_COMPOSITION_TESTS_REV1.json',4)]:assert tests(P/n,total)<=fresh
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
chain=[ref(O/(n+'.json')) for n in ['math','tracking','selected','paired-witnesses','source-recovery']]+[ref(P/'campaign3-history-ga-components-rev1/review.json')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GA FIRST REVIEW / REPRESENTATION CORRECTION / HISTORICAL TEST BACKING',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256']);assert target and ref(target)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith('/limits/')
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA FIRST-REVIEW ISOLATION FINDINGS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[dict(path=x['resolvedPath'],sha256=x['sha256'],method=x['method'],originalPath=x['path']) for x in recovery['found']],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['17freshoriginalfaults plus5directpairedwitnesses; previous72tests reused,notrerun.','SHA-exactpre-correction reconstructions preserveoriginalhashes; notGitbloborindependent chronologyrecovery.','Tracking rejectionboundary differsfromstateleak; math/rolealiases actuallychangefutureunchanged-inputcalls.','No publicmemory/ownership/corpus/psychologicallaworobligationclosure;laterintegrationhistory andfinalHQ011adequacy remain.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),freshFaults=17,freshPairedWitnesses=5,reusedTests=72,historicalSubsetAssertions=37,recoveredArtifacts=3,unavailableBindings=0,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

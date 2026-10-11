"""Reconcile remaining census Vitest exports as historical receipts, not new proofs."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-test-receipts-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def narrative(p): return any(x in p.split('/') for x in ['fullName','title','ancestorTitles','failureMessages','message'])
ip=P/'campaign3-history-source-roles-rev197/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
receipts={}
for p in ix['unassignedCandidatePaths']:
 if not p.endswith('.json'): continue
 v=load(p)
 if isinstance(v,dict) and 'testResults' in v: receipts[p]=v
assert len(receipts)==214
failureNotes={
'AFFECT_PUBLIC_TESTS_REV1.json':'Eleven timeout failures, including the longer rollback test. Timeouts are incomplete verification, not behavioral counterexamples; subsequent green exports do not erase this cohort.',
'ATTENTION_ATTRIBUTION_INTEGRATION_TESTS_REV1.json':'Two tests rejected semantic-binding/0.1-candidate as an unadmitted contract; no successful attribution witness from those failures.',
'CANONICAL_VISUAL_SELECTION_INTEGRATION_REV2.json':'Audit identity ordering expectation failed; preserve lexical-order assumption correction, not a selected-membership relaxation.',
'CANONICAL_VISUAL_SELECTION_TESTS_REV1.json':'Required role claims were removed by the fixture; incomplete role claims rejected. Production validation was not waived.',
'DECISION_COMPONENT_TESTS_REV1.json':'Wrong tie field extracted:423 field2 instead of3. Production arbitration was correct; failed3/4 receipt distinct from broader29-test successor.',
'DECISION_PUBLIC_TESTS_REV1.json':'Fourteen save-after-failure assertions hit the correct quiescent-active save guard. Corrected diagnostic inspection does not permit continuation saves from failed runs.',
'EMB_ACTIVE_TEST_IMPLEMENTATION_REV1.json':'Malformed roster fixture failed with requires list. The1104-test cohort and1072-test retry have different scope and must not be called an identical whole-suite rerun.',
'EPI_PUBLIC_TESTS_REV1.json':'All16 tests rejected a non-32-byte seed before settlement. No executed EPI trajectory from this cohort.',
'GA_ATTRIBUTION_PRODUCER_TESTS_REV1.json':'Four ATTRIBUTION_POSITION_TIME failures; preserve rejected time-domain fixtures and exact diagnostics. This export alone does not establish production cause or correction.',
'GA_CARRIER_CODEC_TESTS_REV1.json':'Three attention grammar unknown schema failures; rejected constructor/schema fixtures do not authorize admitting unknown schemas.',
'GA_PRODUCTION_BOUNDARIES_REGRESSION_REV3.json':'Association node ordering defect. Correct successor canonicalizes both node keys and matrix axes; pre-fix mutation coverage is not post-fix coverage.',
'GA_VISUAL_RECALL_COMPOSITION_TESTS_REV1.json':'Expected GroupingUnavailable but actual earlier gate returned EventRecallUnavailable. Failure-stage distinction retained.',
'GA_WRITE_SCOPE_TESTS_REV1.json':'Constructor requires Campaign-2/VAL schema. Rejected versioned constructor fixture, not proof that the physical capacity path passed.',
'GENERAL_SOURCE_OPPORTUNITY_TESTS_REV1.json':'All five fixtures rejected invalid source symbols. Later valid-symbol tests cannot erase the rejected cohort.',
'GOAL_ASSESSMENT_PRODUCTION_TESTS_REV1.json':'Cross-run acquisition ordinal equality assumption failed. Compare actual consumed formation time/kind/child without suppressing legitimate allocations.',
'INTEROCEPTIVE_SELECTION_TESTS_REV1.json':'Seven undefined-to-BigInt fixture/construction failures. Preserve exact stacks; this receipt alone cannot assign a biological or selector-law failure.',
'LEARN_PUBLIC_TESTS_REV1.json':'Expected rounded25961/500000 was one millionth low. Correct nearest rounding51923/1000000 for raw27/520; production ties-to-even remained correct.',
'PANEL_BODY_OPPORTUNITY_TESTS_REV1.json':'Four invalid three-reserve inventory failures; fixture must supply the required inventory.',
'PANEL_BODY_OPPORTUNITY_TESTS_REV2.json':'Four three-real-mapped-reserves-required failures; second rejected fixture cohort remains distinct from REV1 and passing REV3.',
'POSITION_SCENE_OPPORTUNITY_TESTS_REV1.json':'Occurrence index rejected as noncanonical/duplicate-containing. Preserve exact rejection; no relaxation of provenance order inferred.',
'POSITION_SCENE_SOURCE_TESTS_REV1.json':'Five role-cardinality canonical-order rejections. No successful source runs from these failed assertions.',
'PREPARED_POSITIVE_SPATIAL_TESTS_REV1.json':'Two undefined-to-BigInt failures from missing fixture rational denominators; production arithmetic not replaced.',
'REASON_PRESERVATION_TESTS_REV1.json':'One5000ms save/replay timeout among67. Later targeted retry is one passed and20 skipped, not21 passed or a single67-test rerun.',
'REASON_PUBLIC_TESTS_REV1.json':'Nine unregistered-phase failures plus two unreached-fault expectations;8/19 passing cannot qualify the probe route.',
'REASON_PUBLIC_TESTS_REV2.json':'Two inactive reason fixtures and empty saved RNG ledger assertion failed. Later fixture magnitudes changed with threshold fixed; existing ledger serialized without changing RNG algorithm.',
'REQUESTED_SOURCE_SAMPLING_TESTS_REV2.json':'Sixteen supporting-observation canonical-order rejections. Correct panel/visual occurrence ordering, not weakened uniqueness.',
'SKILL_PUBLIC_TESTS_REV1.json':'Seven invalid zero arbitration-threshold failures. Positive1 threshold correction preserves single-option Auto; no confidence-sensitive-choice inference.',
'SOCIAL_PRESERVATION_TESTS_REV1.json':'Invalid-time fixture accidentally constructed an invalid receipt enum first. Hold valid receipt fixed while varying time.',
'SOCIAL_PUBLIC_TESTS_REV1.json':'Extra runSeed field rejected by closed restore grammar with inherited BELIEF_FIELDS diagnostic. Correct fixture uses exactly three fields.',
'TENTH_SOURCE_INTEGRATION_TESTS_REV1.json':'Actual acquisition127 conflicted with obsolete literal1000 expectation. Actual source replaces supplied competitor bytes.',
'AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json':'Archived first actual observer provenance leak: unreceived report shifted later occurrence IDs although beliefs agreed. Preserve failed byte equality; fixed empty reservations and later phase correction have distinct successor evidence.'}
contextNames=['ga-integration-checkpoints','decision-authority','learn-authority','reason-authority','skill-authority','social-authority','epi-authority','agency']
chain=[ref(P/('campaign3-history-'+n+'-rev1')/'review.json') for n in contextNames]
chain += [ref(P/n) for n in ['LEARN_IMPLEMENTATION_FINDINGS.md','SOCIAL_IMPLEMENTATION_FINDINGS.md','EPI_IMPLEMENTATION_FINDINGS.md','REASON_IMPLEMENTATION_FINDINGS.md']]
roots=set('numTotalTestSuites numPassedTestSuites numFailedTestSuites numPendingTestSuites numTotalTests numPassedTests numFailedTests numPendingTests numTodoTests snapshot startTime success testResults'.split())
sources=[]; cases=[]; leaves=[]; statuses=collections.Counter(); failedNames=[]; countDifferences=[]
for p,v in receipts.items():
 assert ref(p)['sha256']==entries[p]['sha256'],p
 assert set(v)==roots,p
 a=[x for s in v['testResults'] for x in s['assertionResults']]; c=collections.Counter(x['status'] for x in a);statuses.update(c)
 assert set(c)<= {'passed','failed','skipped'}
 assert len(a)==v['numTotalTests'] and c['passed']==v['numPassedTests'] and c['failed']==v['numFailedTests'] and c['skipped']==v['numPendingTests'] and v['numTodoTests']==0,p
 assert v['numTotalTestSuites']==v['numPassedTestSuites']+v['numFailedTestSuites']+v['numPendingTestSuites'],p
 assert v['success']==(c['failed']==0),p
 for s in v['testResults']:
  assert set(s)==set('assertionResults startTime endTime status message name'.split())
  assert s['status']==('failed' if any(x['status']=='failed' for x in s['assertionResults']) else 'passed')
  assert not s['message'] or any(x['failureMessages'] for x in s['assertionResults'])
 n=Path(p).name
 note='Historical runner export only. Assertion labels describe test intent; passing labels do not independently prove the named scientific proposition. Exact source bodies, model/run identity, public prefixes and qualification remain separately owned. No source fingerprint manifest is present in this export. Repeated suites and revised cohorts are not additive current coverage.'
 if c['failed']:
  assert n in failureNotes,n
  note+=' '+failureNotes[n];failedNames.append(n)
 if not a: note+=' ZERO EXECUTED TESTS despite success=true; excluded from positive verification evidence.'
 if c['skipped']: note+=' TARGETED RETRY: one passed,20 skipped; skipped assertions supply no positive verification.'
 if v['numTotalTestSuites']!=len(v['testResults']): countDifferences.append(dict(source=p,reportedSuites=v['numTotalTestSuites'],resultFiles=len(v['testResults'])))
 sources.append(dict(**ref(p),role='HISTORICAL TEST RECEIPT; SCOPED RESULTS AND REJECTED COHORTS PRESERVED',judgment=note,acceptanceChain=chain))
 cases.append(dict(**ref(p),summary={k:x for k,x in v.items() if k not in ['testResults','snapshot']},snapshot=v['snapshot'],resultFiles=len(v['testResults']),failures=[dict(file=s['name'],assertion=x) for s in v['testResults'] for x in s['assertionResults'] if x['status']=='failed'],skipped=[dict(file=s['name'],assertion=x) for s in v['testResults'] for x in s['assertionResults'] if x['status']=='skipped']))
 leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(v))
assert set(failedNames)==set(failureNotes) and len(failedNames)==31
assert statuses==dict(passed=18735,failed=129,skipped=20)
assert [p for p,v in receipts.items() if not v['numTotalTests']]==[(P/'ATTENTION_CONCERN_RETAINED_COMPONENT_TESTS_REV1.json').as_posix()]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in receipts: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='Every string leaf including skipped/passed status and empty diagnostics; original occurrence IDs separately retained. Original receipts own scalar duration/time/count fields; no historical execution timestamp attested by hashing.'))
save('outcomes.json',dict(receipts=cases,suiteCountVersusResultFiles=countDifferences,limits=['Reported suite counts are preserved separately from file-array length; never relabel as number of files.','18735 passing,129 failing and20 skipped are repeated receipt occurrences, not distinct tests or fresh executions.','Zero-test success excluded; targeted retry supplies one pass only. No automatic successor-equivalence claim.']))
save('review.json',dict(status='214 HISTORICAL TEST EXPORTS RECONCILED; SOURCE AND SCIENTIFIC ADEQUACY NOT INFERRED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],schema=ref(O/'schema.json'),outcomes=ref(O/'outcomes.json'),limits=['No runtime,test,mutant,build or historical writer rerun. No model,allocation,law,verdict,corpus or obligation status changed.','Context links explain preserved findings; they are not exact historical executable-source bindings for these exports. Existing identity gaps remain open.','Receipt role assignment does not close source adequacy or independent HQ011 claim reconciliation. Passed test names cannot establish whole-domain qualification.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT RECONCILIATION',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),failedReceipts=31,zeroTestReceipts=1,targetedRetry=dict(passed=1,skipped=20),assertionOccurrences=dict(statuses),suiteCountFileDifferences=len(countDifferences),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

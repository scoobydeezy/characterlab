"""Account for TA requirements without manufacturing historical mutation coverage."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-cognitive-appraisal-rev2'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
prior=P/'campaign3-history-cognitive-appraisal-rev1/crosswalk.json';v=load(prior)
receipt=load(O/'receipt.json');assert len(receipt['results'])==3
assert len(receipt['results'][0]['rows'])==36 and all(x['status']=='PASS' for x in receipt['results'][0]['rows'])
assert len(receipt['invalidOperands'])==9 and all(x['code']=='INVALID_CONFIGURATION' for x in receipt['invalidOperands'])
assert [sum(x['status']=='ASSERTION_FAILURE' for x in z['rows']) for z in receipt['results'][1:]]==[8,8]
for f in receipt['sourceFingerprints']:assert ref(f['path'])==f
old=P/'campaign3-history-cognitive-qualification-rev1';tested=load(old/'test-sources.json')
for f in tested['sourceFingerprints']:assert ref(f['path'])==f
tests=load(old/'tests.json');assert tests['success'] and tests['numPassedTests']==76
titles=['generates the actual seven upstream stages and rejects lookalike children before reads','copies exact public data and rejects capabilities/accessors without invoking them','rolls back a final identity trace failure after genuine draws and retries with identical candidate bytes','rejects independent retained-root, instruction, seed and prior-draw substitutions','keeps frozen meaning and eligible evidence identical when execution is blocked','does not give the status owner an instruction write']
assertions=[a for f in tests['testResults'] for a in f['assertionResults'] if a['title'] in titles]
assert len(assertions)==len(titles) and all(a['status']=='passed' for a in assertions)
static=[]
def anchor(path,needle,judgment):
 text=Path(path).read_text(encoding='utf-8');assert text.count(needle)==1,(path,needle)
 start=text[:text.index(needle)].count('\n')+1
 static.append(dict(**ref(path),startLine=start,exactAnchor=needle,judgment=judgment))
anchor('src/campaign2/cognitiveTransforms.ts','export function appraisalOutput(occurrence:CanonicalValue,workspace:CanonicalValue,criteria:readonly AppraisalCriterion[]){','Actual signature and body have no state/truth/model/trace capability; criteria are resolved by trusted adapter. Not proof against modified trusted code or arbitrary JavaScript globals.')
anchor('src/campaign2/cognitiveTransforms.ts','export function concernOutput(occurrence:CanonicalValue,appraisal:CanonicalValue,definition:CanonicalValue){','Only prior appraisal and exact immutable gain/enabled definition; no independent truth operand or task mutation result.')
anchor('src/campaign2/cognitiveExecution.ts','output=appraisalOutput(occurrence,event.payload,criteria);','Adapter resolves selected criteria from admitted tasks and supplies exact live parent output. Source authentication precedes this branch; psychological transformer does not receive outer state/model.')
anchor('src/campaign2/cognitiveExecution.ts',"}else if(i===2)output=concernOutput(occurrence,event.payload,definition('task-concern'));",'Concern receives exact registered definition, not full registry; output returns no task patch.')
anchor('src/campaign2/adaptationRuntime.ts','return {nextState:context.state,outputs:[result.output],emittedEvents:[...own,...(extra?.emissions()??[])],traceContributions:[],traceFactory:children=>{result.bindAllocatedChildren(children.slice(0,own.length));extra?.bindAllocatedChildren(children.slice(own.length));return [result.trace(children)];}};','Ordinary cognitive adapter retains the same authoritative state. No appraisal/concern patch is applied; later task/identity/ADAPT prepared owners have separate paths. A malicious change to this trusted adapter is not a permitted psychological input.')
anchor('src/campaign2/cognitiveModel.ts',"if(!member)invalidModel('cognitive declaration image is outside the frozen cohort');",'Public model admission requires complete committed cohort image, not an arbitrary transition or authority supplied by caller.')
v['status']='TA REQUIREMENTS ACCOUNTED IN PUBLIC/COMPONENT/STATIC-EXCLUSION SPLIT; NO RETROACTIVE WHOLE TA MUTATION CLAIM'
v['predecessor']=ref(prior);v['currentFollowup']=ref(O/'receipt.json');v['checker']=ref(__file__)
updates={
'TA-D':('SUPPLEMENTAL COMPONENT PASS; PUBLIC SCENE REMAINS OVERLAPPING','Two nonoverlapping interval pairs share forecast5 and produce opposite assessment signs, equal or unequal magnitudes.36 cases across gains/enabled/count;72 associated base/evidence checks. Literal incompatible-goal requirement now has component evidence without rewriting public recipes or historical sketch.'),
'TA-E':('COMPONENT DOMAIN/ENDPOINT PASS; MODEL ADMISSION SEPARATE','REV1 gains0,1/2,1 with maximum distances plus REV2 nine INVALID_CONFIGURATION rejections: gain below/above domain, forecast below/above domain, invalid/reversed criteria, absent or wrong selected reference. These are component owner checks, not nine new public models.'),
'TA-H':('EXECUTED NO-READ/NO-WRITE CONTROL PLUS STATIC CAPABILITY EXCLUSION','Exact prior76-test source fingerprints remain current. Selected generated-chain test verifies actual stage reads and whole-state equality. Static anchors bind restricted inputs and retained-state ordinary adapter. No universal trusted-host or arbitrary-global noninterference claim.'),
'TA-I':('EXISTING EXACT-SOURCE PUBLIC/COMPONENT EVIDENCE','Selected actual chain and full public final-trace failure/restore tests passed in preserved76-test receipt; all source/test hashes reverified unchanged here. Current public and child-binding owners cover source, ordinal, same-phase order and full-instant atomicity. No fresh rerun or every-stage fault-matrix claim.'),
'TA-J':('NAMED EXECUTED MUTATIONS PLUS EXPLICIT STATIC EXCLUSIONS','REV1 four executed mutants include unknown-to-zero; REV2 detects concern promoted to base and invented observation support. Earlier ignored-forecast substitution remains distinct. Truth comparison has no admitted truth operand in these transformers; direct retirement has no patch result and ordinary adapter retains state. Those two are structural exclusions and executed positive no-write controls, NOT separately executed mutation detections. Qualification already distinguishes public/component/exclusion evidence and does not require one separate public model or mutant per proposed branch. Universal trusted-host tampering remains outside claim and owned below.')}
for row in v['vectors']:
 if row['vector'] in updates:row['disposition'],row['evidenceAndLimits']=updates[row['vector']]
v['remaining']=[]
v['localDisposition']='The missing explicit TA evidence mapping is reconciled under the accepted bounded public/component/exclusion proof split. No old receipt, model or qualifier is rewritten; no assertion that every draft mutation was historically run. Independent overall HQ011 adequacy still required.'
v['staticBoundaryEvidence']=static
v['verifiedPriorAssertions']=[dict(title=a['title'],status=a['status']) for a in assertions]
v['priorTestIdentityVerification']=dict(manifest=ref(old/'test-sources.json'),receipt=ref(old/'tests.json'),unchangedFingerprints=len(tested['sourceFingerprints']),freshExecution=False)
v['carriedLimits']=[dict(obligation='RO-C3-021',blockedClaim='Every proposed TA-J mutation was independently executed historically, or arbitrary trusted-host/global code cannot inspect truth or mutate state.',rationale='Neither claim is made. Current reviewed trusted implementation lacks those psychological operands and patch routes; finite checks cannot establish arbitrary-code noninterference.',reopenCondition='Changing transformer capabilities, trusted adapter/state publication, source schema or claiming broader adversarial host guarantees requires new explicit admission/no-write controls.'),dict(obligation='RO-C3-019',blockedClaim='General affect, persistent mood, clinical biological law or public incompatible-goal model qualification.',rationale='Current task discrepancy/concern is bounded and event-local; incompatible-goal supplement is component-only.',reopenCondition='New phenomenon or wider public recipe uses those domains; preserve broader Campaign3 qualifications separately.')]
save(O/'crosswalk.json',v)
save(O/'check.json',dict(status='PASS SCOPED TA RECONCILIATION; HQ011 ADEQUACY OPEN',vectors=len(v['vectors']),newComponentCases=36,baseEvidenceChecks=72,expectedRejectionControls=9,detectedSourceMutants=2,priorSelectedAssertions=len(assertions),priorTestSourcesUnchanged=True,staticBoundaryAnchors=len(static),originalSourcesUnchanged=True,wholeHistoricalMutationCoverageClaim=False,crosswalk=ref(O/'crosswalk.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

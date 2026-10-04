"""Scoped CTL009 provenance/evidence audit; never rewrites old receipts."""
from pathlib import Path
import hashlib,json,copy
P=Path('docs/planning');O=P/'campaign3-history-hq004-rev1'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a,z):
 lines=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);assert 1<=a<=z<=len(lines)
 return dict(path=p,sha256=sha(p),firstLine=a,lastLine=z,text=''.join(lines[a-1:z]))
sources=[excerpt(p,a,z) for p,a,z in [
 ('docs/planning/REFERENCE_MECHANISM_LEDGER.md',191,191),
 ('docs/planning/REFERENCE_MECHANISM_LEDGER.md',500,508),
 ('reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md',1238,1261),
 ('reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md',1263,1339),
 ('reference/src/model/actions.ts',1,23),
 ('reference/src/model/actions.ts',73,140),
 ('reference/src/model/actions.ts',146,177),
 ('reference/src/model/choice.ts',1,12),
 ('reference/src/test/phase2Experiments.test.ts',121,157),
 ('reference/src/experiments/substitution.ts',1,38),
 ('CHARACTER_ARCHITECTURE.md',496,496),
 ('CharacterLab — Ideal Character Research Program Brief.md',2061,2085),
 ('docs/planning/CAMPAIGN3_HABIT_QUALIFICATION.md',14,53),
 ('src/test/habitPublic.test.ts',14,20),
 ('docs/planning/CAMPAIGN3_DECISION_QUALIFICATION.md',30,57),
 ('docs/planning/DECISION_COMPARATOR_PREFLIGHT.md',20,28),
 ('src/campaign3/decisionComparators.ts',14,32),
 ('src/campaign3/decisionMath.ts',26,45),
]]
manifest=load(O/'source-manifest.json')
for f in manifest['files']:assert sha(f['path'])==f['sha256'],f['path']
tests=[]
for name,total,files in [('active-tests.json',34,4),('reference-tests.json',12,2)]:
 t=load(O/name);assert t['success'] and t['numTotalTests']==t['numPassedTests']==total and t['numFailedTests']==t['numPendingTests']==0
 assert len(t['testResults'])==files
 assertions=[a for f in t['testResults'] for a in f['assertionResults']];assert len(assertions)==total and all(a['status']=='passed' for a in assertions)
 tests.append(dict(path=(O/name).as_posix(),sha256=sha(O/name),files=files,passed=total,titles=[a['fullName'] for a in assertions]))
habit=load(P/'HABIT_VALIDATION_CLOSURE_REV1.json')
assert habit['status']=='PASS' and habit['publicRuns']==23 and habit['prefixRestores']==291
for f in habit['sourceFiles']:assert sha(f['path'])==f['sha256']
decision=load(P/'DECISION_VALIDATION_CLOSURE_REV1.json');assert decision['status']=='PASS' and decision['runs']==174 and decision['restores']==360
for f in decision['files']:assert sha(f['path'])==f['sha256']
dispositions=[
 dict(id='baseline-scope',finding='CTL009 is a preserved control label, not an accurate description of every historical implementation. Brief22 and current reference/actions already impose preconditions, accessibility threshold and top-K; candidateActions is the explicitly retained precondition-only baseline.',decision='Preserve the historical baseline and later filter separately. Do not claim all historical options were universally available.'),
 dict(id='additive-scope',finding='Brief23 proposes Need+Value+Personality+Social+Context. Actual evaluateAction implements only the additive Need term; other channels are explicitly deferred. Reason arbitration can also sum signed reason contributions without becoming this old universal scalar architecture.',decision='Do not equate an authored five-term formula, executed Need-only scoring and independent reason-distribution arbitration, or claim all addition was falsified.'),
 dict(id='reference-substitution',finding='The rerun preserves identical Priya accessibility under changed Glen availability while the feasible candidate set changes. The substitution experiment invokes the accessibility-filtered path twice; it is not a matched Phase1-versus-Phase2 candidate-generator experiment despite a broader actions.ts comment.',decision='Preserve feasibility/accessibility separation and the negative substitution finding. Do not promote it to a head-to-head generator result or autonomous sampled substitution.'),
 dict(id='modern-availability',finding='Qualified HABIT and fresh tests retain learned availability after informational expectation correction; matched unrewarded history removes the candidate. Stored/Derived outputs match. This is a bounded availability-mediated effect with neutral alternatives.',decision='Retain availability versus preference and the explicit-belief/no-history competitors; not every generator is distinguished or a universal planner qualified.'),
 dict(id='modern-arbitration',finding='DECISION retains true reason-face resolution and intent/outcome separation. OpaqueWeightedChoice matches exactly balanced unresolved marginals with one draw but lacks reason-face presentation; it is not a calibrated implementation of the historical Need-only score over matched inputs.',decision='Retain the marginal equality and presentation failure together. No matched universal additive-versus-heterogeneous behavioral superiority claim is earned.'),
]
evidence=[(P/'campaign3-history-queue-rev1/review.json').as_posix(),(O/'source-manifest.json').as_posix(),(P/'HABIT_VALIDATION_CLOSURE_REV1.json').as_posix(),(P/'DECISION_VALIDATION_CLOSURE_REV1.json').as_posix()]
r=dict(status='HQ-004 SCOPED AUDIT DISPOSITION RECORDED; GENERAL COMPARISON CONDITIONAL',sources=sources,tests=tests,dispositions=dispositions,evidence=[dict(path=p,sha256=sha(p)) for p in evidence],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],nextGate='Continue HQ-005 inspection UI scope. Before any CTL009 retirement or stronger sufficiency claim, compare declared generators/scorers on matched permitted inputs, candidate sets, future queries and observable explanation obligations, retaining probability equalities.',limits=['46 scoped tests freshly rerun; prior full matrices/source receipts rechecked, not fully re-executed.','No new model, allocation, verdict, law or architecture reduction.','No claim a generally expressive scalar/weighted comparator is behaviorally impossible.','Original queue remains frozen; this overlay is its current disposition, not a rewritten historical receipt.'])
def validate(v):
 assert [d['id'] for d in v['dispositions']]==[d['id'] for d in dispositions]
 assert v['dispositions']==dispositions and v['obligations']==['RO-C3-019','RO-C3-020','RO-C3-021']
 assert v['tests']==tests and len(v['sources'])==len(sources)
 for s in v['sources']:assert s==excerpt(s['path'],s['firstLine'],s['lastLine'])
 for f in v['evidence']:assert sha(f['path'])==f['sha256']
validate(r);save(O/'review.json',r)
faults=[]
for mode in ['changed-excerpt','missing-disposition','lost-equality','missing-obligation','false-test-total']:
 v=copy.deepcopy(r)
 if mode=='changed-excerpt':v['sources'][0]['text']+='changed'
 elif mode=='missing-disposition':v['dispositions'].pop()
 elif mode=='lost-equality':v['dispositions'][-1]['decision']='Comparator universally rejected'
 elif mode=='missing-obligation':v['obligations'].pop()
 else:v['tests'][0]['passed']+=1
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c=dict(status='PASS SCOPED HQ004 ACCOUNTING; BROADER DEBT RETAINED',sourceExcerpts=len(sources),boundSourceFiles=len(manifest['files']),freshActiveTests=34,freshReferenceTests=12,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

"""MEC021 regression and distinct attribution-owner audit."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');O=P/'campaign3-history-hq007-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a,z):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);assert 1<=a<=z<=len(ls),p
 return dict(path=p,sha256=sha(p),firstLine=a,lastLine=z,text=''.join(ls[a-1:z]))
sources=[excerpt(p,a,z) for p,a,z in [
 ('docs/planning/REFERENCE_MECHANISM_LEDGER.md',137,137),
 ('reference/src/model/cognitiveSignals.ts',216,301),
 ('reference/src/test/phase2_97CognitiveSignals.test.ts',187,241),
 ('reference/RESEARCH.md',2720,2734),
 ('src/campaign3/attributionProduction.ts',1,22),
 ('src/campaign3/generalAttributionProduction.ts',1,59),
 ('src/campaign3/directionalSignificanceState.ts',1,32),
 ('src/campaign3/generalBindingProfile.ts',87,95),
 ('src/campaign3/relAttributionModel.ts',15,28),
 ('docs/planning/CAMPAIGN3_REL_ATTRIBUTION_QUALIFICATION.md',14,75),
 ('src/campaign3/definingMeaning.ts',59,82),
 ('src/campaign3/definingMemoryRuntime.ts',59,61),
 ('src/campaign3/definingRehearsalRuntime.ts',66,70),
 ('docs/planning/CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md',20,38),
 ('src/test/definingMeaning.test.ts',13,25),
 ('src/test/generalCreditRuntime.test.ts',7,17),
]]
manifest=load(O/'source-manifest.json')
for f in manifest['files']:assert sha(f['path'])==f['sha256'],f['path']
tests=[]
for name,count in [('active-tests.json',5),('reference-tests.json',3)]:
 t=load(O/name);assert t['success'] and t['numTotalTests']==t['numPassedTests']>0 and t['numFailedTests']==t['numPendingTests']==0
 assert len(t['testResults'])==count
 assertions=[a for f in t['testResults'] for a in f['assertionResults']];assert len(assertions)==t['numPassedTests'] and all(a['status']=='passed' for a in assertions)
 tests.append(dict(path=(O/name).as_posix(),sha256=sha(O/name),passed=t['numPassedTests'],files=count,titles=[a['fullName'] for a in assertions]))
assert tests[1]['passed']==35
rows=[
 dict(id='proportional-participants',finding='The preserved two-participant test gives8/25 and2/25 from outcome2/5 and salience4/5,1/5; both signals keep the same experience EvidenceBasis. A salient incidental lamp outside participants gets no signal.',disposition='Retain proportional participant attribution and shared provenance; do not infer independent evidence from separate referents.'),
 dict(id='single-participant',finding='For one positive salient participant the source formula is z/z=1, preserving outcome strength; no-salience legacy fallback is explicitly tested at2/5. The historical comment describes an earlier raw-salience regression and repaired suite, not an archived executable mutant supplied by this audit.',disposition='Distinguish algebraic positive-single-participant equivalence, freshly tested fallback, and historical narrative. Do not claim a new salience-sweep or rerun of the rejected old mutant.'),
 dict(id='unsupported-causal-object',finding='The historical limitation names a causal lamp that is never a participant. Incidental-lamp exclusion is tested but does not establish attribution of that causal lamp. The fallback to option subject is not a causal inference law.',disposition='Retain the causal-nonparticipant question. Modern acquisition target addresses and dyadic report claims do not automatically discharge a Safety x Lamp x Avoid referent comparison.'),
 dict(id='admitted-target-and-credit',finding='attributionProduction consumes a supported recalled position-pair assessment and publishes targets, not memory edits. generalAttributionProduction emits typed575 consumed/target addresses; a distinct significance/memory operation joins goal qualification and applies directional credit. Native credit tests exercise16 consumed children and one target under four retention recipes.',disposition='Keep support, target identity, permitted goal qualification and historical significance ownership distinct; no true-cause oracle or general attribution law.'),
 dict(id='current-explanation',finding='Relationship history/person journals have disjoint holder/target authorities. Explanation120 updates person evidence140, affecting next appraisal40; original harm and prior judgments remain. The preserved false explanation can reduce accuracy. Defining meaning separately preserves original content/historical significance while later report changes current assessment.',disposition='Current explanation is revisable admitted belief; historical credit is a separate candidate state. Do not erase old evidence, equate changed willingness with incident cause, infer innocence, or universalize monotone historical significance.'),
]
evidence=['docs/planning/REL_ATTRIBUTION_CLOSURE_REV1.json','docs/planning/DEFINING_PUBLIC_CLOSURE_REV1.json']
r=dict(status='HQ-007 SCOPED REGRESSION/OWNER AUDIT COMPLETE; CAUSAL NONPARTICIPANT DEBT RETAINED',sources=sources,tests=tests,dispositions=rows,evidence=[dict(path=f,sha256=sha(f)) for f in evidence],sourceManifestSha256=sha(O/'source-manifest.json'),queueSourceSha256=sha(P/'campaign3-history-queue-rev1/review.json'),obligations=['RO-C3-020','RO-C3-021'],nextGate='HQ-008 bundled P3 phenomena mapping; UI remains owner-deferred except validation needs.',limits=['Fresh scoped tests, not full original matrix or full-suite/build rerun.','Existing relationship closure checker was rerun; defining closure is a cited historical receipt, not a fresh full closure execution.','No new model, verdict, allocation, owner merger or reference mutation.','Source algebra does not substitute for a claimed newly executed mutant or parameter sweep.'])
def validate(x):
 assert x['dispositions']==rows and x['tests']==tests and x['obligations']==['RO-C3-020','RO-C3-021'] and len(x['sources'])==len(sources)
 for s in x['sources']:assert s==excerpt(s['path'],s['firstLine'],s['lastLine'])
 for f in x['evidence']:assert sha(f['path'])==f['sha256']
 assert x['sourceManifestSha256']==sha(O/'source-manifest.json') and x['queueSourceSha256']==sha(P/'campaign3-history-queue-rev1/review.json')
validate(r);save(O/'review.json',r)
faults=[]
for mode in ['changed-source','lost-limit','merged-owners','false-tests','missing-obligation']:
 x=copy.deepcopy(r)
 if mode=='changed-source':x['sources'][0]['text']+='x'
 elif mode=='lost-limit':x['dispositions'].pop(2)
 elif mode=='merged-owners':x['dispositions'][-1]['disposition']='Rewrite historical credit from current explanation'
 elif mode=='false-tests':x['tests'][0]['passed']+=1
 else:x['obligations'].pop()
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c=dict(status='PASS HQ007 ACCOUNTING; WIDER ATTRIBUTION DEBT RETAINED',sourceExcerpts=len(sources),boundSourceFiles=len(manifest['files']),freshActiveTests=tests[0]['passed'],freshReferenceTests=35,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

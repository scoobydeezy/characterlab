"""SUB006 tool/consumer audit; no port or scientific-model change."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');O=P/'campaign3-history-hq006-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a,z):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);assert 1<=a<=z<=len(ls),p
 return dict(path=p,sha256=sha(p),firstLine=a,lastLine=z,text=''.join(ls[a-1:z]))
sources=[excerpt(p,a,z) for p,a,z in [
 ('docs/planning/REFERENCE_MECHANISM_LEDGER.md',98,98),
 ('reference/src/kernel/linalg.ts',1,106),
 ('reference/src/kernel/linalg.ts',108,141),
 ('reference/src/model/activation.ts',1,74),
 ('docs/formal/ENCODING_ACCESS_MATH.md',1,14),
 ('docs/formal/ENCODING_ACCESS_MATH.md',29,41),
 ('src/campaign3/encodingAccessMath.ts',1,12),
 ('src/campaign3/encodingAccessMath.ts',26,44),
 ('src/campaign3/directAssociativeAccess.ts',1,21),
 ('src/campaign3/canonicalEventRecall.ts',1,34),
 ('src/campaign3/recollectionProduction.ts',1,55),
 ('src/campaign3/generalRecallProduction.ts',1,71),
]]
manifest=load(O/'source-manifest.json')
for f in manifest['files']:assert sha(f['path'])==f['sha256'],f['path']
tests=[]
for name,total,count in [('active-tests.json',52,6),('reference-tests.json',18,2)]:
 t=load(O/name);assert t['success'] and t['numTotalTests']==t['numPassedTests']==total and t['numFailedTests']==t['numPendingTests']==0
 assert len(t['testResults'])==count
 assertions=[a for f in t['testResults'] for a in f['assertionResults']];assert len(assertions)==total and all(a['status']=='passed' for a in assertions)
 tests.append(dict(path=(O/name).as_posix(),sha256=sha(O/name),passed=total,files=count,titles=[a['fullName'] for a in assertions]))
rows=[
 dict(id='reference-general',finding='Exact rational Gaussian elimination, not Bareiss. Fixed first-nonzero row swap when diagonal pivot is zero; typed SingularMatrixError reports pivot column when no row exists. Caller supplies row/column order. Residual, swap, singularity and repeated-solve tests pass.',disposition='Preserve as research oracle/control; no default character primitive or new port.'),
 dict(id='reference-consumers',finding='Reference activation uses solveLinearSystem on I-beta W; reference identity imports dot/quadraticForm primitives rather than a matrix solve. Activation uniqueness is conditional on row-substochastic W and beta below1; legal graph tests do not prove arbitrary authored matrices safe.',disposition='Keep solve, vector/quadratic arithmetic and psychological mechanisms distinct.'),
 dict(id='active-restricted',finding='encoding-access-math/0.1-candidate implements a separate exact rational solve using substrate arithmetic, no reference import. It validates finite dimension<=32, dense arrays, graph nonnegativity/zero diagonal/row mass, beta in[0,1), nonnegative base and positive scale. It performs no pivot swaps; invalid zero pivot throws RangeError, not the general reference singularity type.',disposition='Retain the accepted restricted domain. Strict diagonal dominance gives nonsingular leading principal submatrices and supports nonzero elimination pivots; quantify only after the exact solve. Do not widen to arbitrary matrices without a new contract.'),
 dict(id='active-consumers',finding='spreadingActivation feeds directAssociativeAccess, canonicalEventRecall and recollectionProduction, used by generalRecallProduction and other named recall paths. Frozen lexical matches bind each located edge. Public recollection tests pass along with component solve/quantization/isolation/recall tests.',disposition='Already-used algorithmic dependency, not missing port or proof every runtime profile needs nonempty graph spreading. Empty graph/beta0 controls remain meaningful; no general matrix API qualification.'),
 dict(id='boundary-debt',finding='Source inspection: solveLinearSystem returns an empty result before checking b length when A is empty. matVecMul has no explicit dimension check. Reduced exact fractions do not establish a uniform bit-size, memory or runtime bound; beta may approach1 and operands have no fixed precision cap.',disposition='Preserve historical bytes and source-inspected limits. Before arbitrary/untrusted general-solver admission, require complete shape validation including empty dimensions; before scaling claims, measure or bound rational cost. No current restricted-domain failure or universal no-pivot claim.'),
]
r=dict(status='HQ-006 SCOPED TOOL/CONSUMER AUDIT COMPLETE; DOMAIN AND COST DEBT RETAINED',sources=sources,tests=tests,dispositions=rows,sourceManifestSha256=sha(O/'source-manifest.json'),queueSourceSha256=sha(P/'campaign3-history-queue-rev1/review.json'),obligations=['RO-C3-020','RO-C3-021'],nextGate='HQ-007 attribution regression chain; no linear algebra port required now.',limits=['No new runtime implementation, allocation, verdict, law selection or source mutation.','70 scoped tests freshly rerun; no full campaign replay or full-suite/build claim.','Consumer scan is lexical, not an exhaustive call-graph proof.','Validation exceptions are source-inspected observations; no new failing-case execution is claimed.','Exactness and finite test sizes do not establish general performance bounds.'])
def validate(x):
 assert x['dispositions']==rows and x['tests']==tests and x['obligations']==['RO-C3-020','RO-C3-021']
 assert len(x['sources'])==len(sources)
 for s in x['sources']:assert s==excerpt(s['path'],s['firstLine'],s['lastLine'])
 assert x['sourceManifestSha256']==sha(O/'source-manifest.json') and x['queueSourceSha256']==sha(P/'campaign3-history-queue-rev1/review.json')
validate(r);save(O/'review.json',r)
faults=[]
for mode in ['changed-excerpt','missing-domain','lost-cost-limit','false-test-total','missing-obligation']:
 x=copy.deepcopy(r)
 if mode=='changed-excerpt':x['sources'][0]['text']+='x'
 elif mode=='missing-domain':x['dispositions'].pop(2)
 elif mode=='lost-cost-limit':x['dispositions'][-1]['disposition']='Exact arithmetic guarantees bounded cost'
 elif mode=='false-test-total':x['tests'][0]['passed']+=1
 else:x['obligations'].pop()
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c=dict(status='PASS HQ006 ACCOUNTING; NO PORT REQUIRED',sourceExcerpts=len(sources),boundSourceFiles=len(manifest['files']),freshActiveTests=52,freshReferenceTests=18,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

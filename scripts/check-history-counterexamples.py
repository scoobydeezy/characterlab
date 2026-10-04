"""Bind scoped fresh historical tests to reviewed proof-chain claims."""
from pathlib import Path
import json,hashlib,copy
p=Path('docs/planning');out=p/'campaign3-history-counterexamples-rev1';b=p/'campaign3-history-universe-rev1'
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=load(out/'source-manifest.json')
for x in manifest['files']:assert sha(Path(x['path']))==x['sha256'],x['path']
tests=load(out/'tests.json');assert tests['success'] and tests['numPassedTests']==tests['numTotalTests']==55 and tests['numFailedTests']==0
def log(a,z):
 f=b/'sources/reference/RESEARCH.md'; lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':'reference/RESEARCH.md','sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(lines[a-1:z])}
specs=[
 ('RET-002','phase2_5cExperienceInterpretation.test.ts',['assigns every role mechanically','Incidental concept splits'],(887,925),'Historical replacement fixtures located and rerun; role slots and residual attention are controlled reference mechanisms, not natural recognition or permission to import truth-side provenance.'),
 ('RET-003','phase2_5cExperienceInterpretation.test.ts',["review’s own worked example".replace('’',"'"),'original |r-μ| formula'],(1175,1188),'Exact0.40/0.05 lower-bound surprise=0 and point surprise=0.35 assertions. This discriminates formulas on controlled inputs; no old raw-error runtime was reconstructed.'),
 ('RET-004','phase2_5Saturation.test.ts',['naive mu diverges'],(587,608),'Actual naive/censored timeline comparison located and rerun; not LEARN PointOnly. Historical source formulas and finite saturation horizons retained; censoring narrows rather than eliminates divergence.'),
 ('RET-007','phase2_95ReasonConsolidation.test.ts',['neither weak Need pressure'],(2104,2142),'Actual weak-signal combination fixture: each alone below floor, combined admits PlayerFacingRoll instead of Auto. Old separate-bound mutant is described in log, not freshly reconstructed.'),
 ('RET-010','phase2_97CommitmentLifecycle.test.ts',['once DinnerWithGlen is active','once that commitment is retired','new DinnerWithGlen-shaped'],(2620,2650),'Architectural correction linked to independent commitment referent and absent/active/recurrent fixtures. Historical retirement is modeled by removing supplied commitment; no runtime lifecycle transition or old CoreNeed-versus-new paired run claimed.'),
 ('RET-012','phase2_9IdentityFormation.test.ts',['with no trait ever authored'],(1915,1932),'Acquisition without authored trait and separate projectTrait tests support derived labels. Exact injected extra-trait-bonus mutant remains UNLOCATED; no absence-of-code proof or universal reduction inferred.')
]
rows=[]
for id,file,phrases,span,scope in specs:
 t=next(x for x in tests['testResults'] if Path(x['name']).name==file);selected=[]
 for phrase in phrases:
  hits=[a for a in t['assertionResults'] if phrase in a['title']];assert len(hits)==1,(file,phrase)
  a=hits[0];assert a['status']=='passed';selected.append({'title':a['title'],'fullName':a['fullName'],'status':a['status']})
 path='reference/src/test/'+file
 rows.append({'retirement':id,'testPath':path,'testSha256':sha(Path(path)),'assertions':selected,'historicalLog':log(*span),'scope':scope,'obligations':['RO-C3-020','RO-C3-021']})
r={'status':'SIX CHAINS TRACED WITH SCOPE LIMITS; EXTRA TRAIT-BONUS MUTANT GAP RETAINED','sourceManifestSha256':sha(out/'source-manifest.json'),'testReceiptSha256':sha(out/'tests.json'),'freshTestFiles':6,'freshTests':55,'items':rows,'startupFailure':'Initial sandbox run failed loading vite.reference.config.ts: esbuild could not read parent directory. No scientific tests ran. Same command outside sandbox passed55/55; no source changes.','limits':['Current rerun of preserved historical tests, not reconstruction of original execution dates or current public runtime qualification.','No broad proof-chain closure: old raw-error/separate-bound/CoreNeed mutants not freshly rebuilt; trait-bonus negative fixture remains unlocated.','Original source graph verified unchanged before/after. Hash commitments diagnose identity, not psychological equivalence.','No new verdict or obligation closure; five citation issues and final history/corpus gates remain open.']}
f=out/'review.json'
if f.exists():assert load(f)==r
else:write(f,r)
# Meaningful receipt failure checks: a missing or failed asserted test cannot support a chain.
def receipt_ok(t):
 assert t['success'] and t['numTotalTests']==t['numPassedTests']==55 and t['numFailedTests']==0
 assertions=[a for x in t['testResults'] for a in x['assertionResults']]
 assert len(assertions)==55 and all(a['status']=='passed' for a in assertions)
receipt_ok(tests);faults=[]
for mode in ['missing-assertion','failed-assertion','false-total']:
 q=copy.deepcopy(tests)
 if mode=='missing-assertion':q['testResults'][0]['assertionResults'].pop()
 elif mode=='failed-assertion':q['testResults'][0]['assertionResults'][0]['status']='failed'
 else:q['numPassedTests']=56
 try:receipt_ok(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
check={'status':'PASS SOURCE AND FRESH TEST ACCOUNTING','tests':55,'files':6,'sourceFiles':len(manifest['files']),'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==check
else:write(f,check)
print(json.dumps(check))

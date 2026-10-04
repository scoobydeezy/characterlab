from pathlib import Path
import json,hashlib,copy
p=Path('docs/planning');out=p/'campaign3-history-hq001-rev1'
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
m=load(out/'source-manifest.json')
for x in m['files']:assert sha(Path(x['path']))==x['sha256']
t=load(out/'tests.json')
def valid(t):
 assert t['success'] and t['numTotalTests']==t['numPassedTests']==29 and t['numFailedTests']==0
 assert len(t['testResults'])==5
 a=[a for f in t['testResults'] for a in f['assertionResults']];assert len(a)==29 and all(x['status']=='passed' for x in a)
valid(t)
def tests(file):
 f=next(x for x in t['testResults'] if Path(x['name']).name==file)
 return {'file':'reference/src/test/'+file,'sha256':sha(Path('reference/src/test')/file),'passedAssertions':[a['fullName'] for a in f['assertionResults']]}
def source(path,a,z):
 f=Path(path);ls=f.read_bytes().decode('utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(ls[a-1:z])}
rows=[
 {'claim':'Reliable satisfier / EXP001','status':'LEARNING AND CONTRADICTION CHAIN VERIFIED; PREFERENCE LINK PARTIAL','evidence':[tests('determinism.test.ts'),tests('expectation.test.ts'),tests('choice.test.ts')],'source':source('reference/src/experiments/learnedSatisfaction.ts',1,45),'finding':'Forced repeated experiences increase learned expectation/confidence; reinforced expectation resists one contrary observation. Generic higher-score probability test is separate. The learned-satisfaction test does not itself assert an integrated preference shift or autonomous action.','remaining':'Locate exact integrated preference evidence or explicitly narrow the historical claim; do not infer it from generic score monotonicity.'},
 {'claim':'Capacity / EXP002','status':'SWEEP CHAIN VERIFIED; TIMELINE COUPLING LIMIT FOUND','evidence':[tests('phase2_5Saturation.test.ts')],'source':source('reference/src/experiments/saturatedSatisfaction.ts',90,113),'additionalSource':source('reference/src/experiments/saturationCounterfactual.ts',99,110),'finding':'Single-shot sweep resets state/clock and uses same seed with deltaT0 across levels and learning modes. Multi-step run uses seed:timeline:index: modes are paired within each timeline, but A/B use different addressed noise. Same authored magnitude/distribution is not a proved identical realized-effect sequence. Censoring narrows but does not eliminate divergence.','remaining':'Do not claim the multi-step A/B comparison holds every realized effect fixed. A stronger claim needs an explicitly coupled successor, preserving original results. Existing sweep remains its own controlled case.'},
 {'claim':'Upper-bound avoidance / EXP005','status':'BOUNDED HISTORICAL PROBABILITY AND MEAN FIXTURE VERIFIED','evidence':[tests('phase2Experiments.test.ts'),tests('expectation.test.ts')],'source':source('reference/src/experiments/avoidance.ts',86,120),'finding':'Five clean repetitions reduce aversive-action probability while mean stays-0.08; seven-step legacy naive floor control moves mean toward0, corrected default retains-0.08. These are read-only choice-distribution probes after forced experiences, not sampled autonomous avoidance trajectories.','remaining':'No general inhibition reduction, long-horizon efficacy inference or enacted-action qualification; retain exact finite profile and legacy calibration.'}
]
r={'status':'HQ-001 PARTIALLY DISCHARGED; MATERIAL SCOPE GAPS RETAINED','queueSource':{'path':'docs/planning/campaign3-history-queue-rev1/review.json','sha256':sha(p/'campaign3-history-queue-rev1/review.json')},'sourceManifestSha256':sha(out/'source-manifest.json'),'testsSha256':sha(out/'tests.json'),'freshFiles':5,'freshTests':29,'claims':rows,'obligations':['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],'limits':['No change to historical source or model;103 inventoried files unchanged.','Scoped current rerun, not rewritten original execution receipt or new public qualification.','HQ001 stays PARTIAL; no research obligation closed and no whole-corpus pass.']}
f=out/'review.json'
if f.exists():assert load(f)==r
else:write(f,r)
faults=[]
for mode in ['missing-assertion','failed-test','false-total']:
 q=copy.deepcopy(t)
 if mode=='missing-assertion':q['testResults'][0]['assertionResults'].pop()
 elif mode=='failed-test':q['testResults'][0]['assertionResults'][0]['status']='failed'
 else:q['numPassedTests']=30
 try:valid(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS SOURCE/TEST ACCOUNTING; HQ001 PARTIAL','files':5,'tests':29,'sourceFiles':len(m['files']),'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
print(json.dumps(c))

"""Independent uncertainty evidence/update review, preserving bounded authority."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-uncertainty-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
specs['docs/formal/INTEROCEPTIVE_UNCERTAINTY_COMPONENT_CONTRACT.md']='Accepted interoceptive-uncertainty0.1: controlled clipped sensor bins with static actual/bias source-only; admitted interval retained separately and consumed before current update. Set-valued compatibility, not probability/confidence. Five candidate policies and fixed precaution scaling; actual addressed choice only, no physical action or native admission.'
add('CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md','VER-C3-UNCERTAINTY-001:5 models155 cases775 prefixes. Same truth/midpoint, different interval width changes UpperRisk strength/probabilities; six of eight full sequences differ and seeds3/7 remain equal. External error/containment/radius criteria distinguish approximate truth from narrow wrong belief. PointBelief/MidpointRisk/LowerRisk/NoLearning retained; no general confidence or uncertainty-motive law.')
add('UNCERTAINTY_PLAN_REV1.json','Original canonical model/run/experiment/comparison identities and transitive content/source graph freshly reconstruct. All seeds0..7 for narrow/wide/biased; other controls seed7. No seed or equal sequence filtered.')
add('UNCERTAINTY_RESULT_REV1.json','Whole original155-case result freshly replayed with775 complete prefix restores620 advancing155 terminal. Independent620 source projection, prior/new belief, deficit and external accuracy rows verified. Actual choice/RNG bytes preserved by replay, not an independent reimplementation of dice.')
add('UNCERTAINTY_CLOSURE_REV1.json','Original read-only result/source/seed/probability/timing checker freshly passes. No fresh tests/build, native Save132 or full-tail claim.')
add('UNCERTAINTY_TESTS_REV1.json','Historical15 passed assertions:10 new and5 choice tests. Includes3003 unbiased sensor points across widths0/200/600, upper ties/endpoints, actual quality-sensitive choice, mistaken/unknown/point controls, correction timing, missing/duplicate, all-law prefixes, fault/overlap and strict original/save binding. Historical test execution, not new suite run.')
add('UNCERTAINTY_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertion leaves, not freshly rerun.')
add('UNCERTAINTY_BUILD_REV1.json','Historical successful build/exit0 and exact source artifacts, reported completion not fresh build. All first cohorts passed; no failed cohort documented.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev119/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-uncertainty.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-uncertainty-closure.mjs'],text=True).strip()
plan=load(P/'UNCERTAINTY_PLAN_REV1.json');result=load(P/'UNCERTAINTY_RESULT_REV1.json')
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for stem,n in [('TESTS',15),('REFERENCE_TESTS',328)]:
 t=load(P/f'UNCERTAINTY_{stem}_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
build=load(P/'UNCERTAINTY_BUILD_REV1.json');assert build['status']=='PASS' and build['exitCode']==0
for a in build['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
count=0
for case,res in zip(plan['runs'],result['results']):
 belief=None;law=case['law']
 for x,row in zip(case['inputs'],res['safe']['rows']):
  level=None if belief is None else (belief['lower']+belief['upper'])/2 if law=='MidpointRisk' else belief['upper'] if law=='LowerRisk' else belief['lower']
  strength=0 if level is None else min(1000,2*max(0,600-level));assert row['strength']==strength and row['prior']==belief
  evidence=None
  if x['available']:
   sensed=min(1000,max(0,x['actual']+x['bias']));w=x['width']
   center=sensed if not w else 500+w*((sensed-500+w//2)//w)
   evidence=dict(lower=max(0,center-w//2),upper=min(1000,center+w//2))
  assert row['observation']==evidence
  if evidence is not None and law!='NoLearning':
   m=(evidence['lower']+evidence['upper'])/2;belief=dict(lower=m,upper=m) if law=='PointBelief' else evidence
  assert row['after']==belief;count+=1
 assert res['safe']['belief']==belief
 diagnostic=None
 if belief is not None:
  actual=case['inputs'][0]['actual'];m=(belief['lower']+belief['upper'])/2
  diagnostic=dict(actual=actual,estimate=m,radius=(belief['upper']-belief['lower'])/2,error=abs(m-actual),containsTruth=belief['lower']<=actual<=belief['upper'])
 assert res['diagnostic']==diagnostic
assert count==620
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['identities.json','replay.json']]+[ref(p) for p in ['scripts/replay-history-uncertainty.mjs','scripts/check-uncertainty-closure.mjs','scripts/qualify-interoceptive-uncertainty.mjs','src/campaign3/interoceptiveUncertainty.ts','src/test/interoceptiveUncertainty.test.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='UNCERTAINTY AUTHORITY / EVIDENCE QUALITY / POLICY',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/evidence')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [8,10,11,19,20,21]]
r=dict(status='UNCERTAINTY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh155 component cases775 prefixes, one successor each; no native/full tails or actual replenishment.','Historical15/328 tests/build authenticated, not rerun. First cohorts passed.','Intervals are set-valued compatibility, not calibrated probability/confidence; bias can make narrow belief wrong.','Unknown and known zero can select equally while belief states differ; missing or repeated intervals do not manufacture precision.','Current correction changes next choice; preserve all eight declared seeds and equal sequences3/7.','Candidate UpperRisk response does not prove uncertainty universally increases motive; midpoint/optimistic/point/no-learning remain.','Static reserve, controlled bias/quality, latest interval only; no changing physiology, staleness, correlated fusion, source trust or natural sensing.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

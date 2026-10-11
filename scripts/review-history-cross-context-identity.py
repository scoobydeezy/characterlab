"""Historical common-meaning component review; no fresh whole matrix claim."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-cross-context-identity-rev1';B=P/'campaign3-history-universe-rev1'
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
specs['docs/formal/CROSS_CONTEXT_IDENTITY_COMPONENT_CONTRACT.md']='Accepted cross-context-identity0.1: one actor with four actual qualified choices, controlled expected fulfillment of accepted undertakings, held-out fifth probe. Different task/action referents, motive operands and fulfilling ordinal; no cross-domain reward exchange. Millionth ties-even K1 fold; acquisition has no feedback, probe not relearned. Generic world protocol only, no enacted domains/native handlers.'
add('CROSS_CONTEXT_IDENTITY_READINESS.md','Prospective common-meaning requirement: existing task/biological channels do not prove shared meaning. Preserve one actor and original contexts/authorship/qualifications; significant/trivial, unknown/neutral and pressure remain distinct. Enacted coercion is separate; no new universal trait ontology authorized.')
add('CROSS_CONTEXT_IDENTITY_SOURCE_SUFFICIENCY.md','Explicit then-open gates: generic protocol counts do not enact parcel/speech/attendance, and seed7 receiving controls cancel. Requires actual domains plus all seeds and exact context subset. Later successor qualification separately closes bounded gaps; original component is not retroactively broadened.')
add('CAMPAIGN3_CROSS_CONTEXT_IDENTITY_QUALIFICATION.md','VER-C3-CROSS-CONTEXT-COMPONENT-001:127 component cases762 historical prefixes. SharedMeaning vsSeparateContext/NoFeedback differs6/8 probabilities4/8 actions;1/7 distributions equal through cancellation. Same-context seed7 also cancels; no missing-meaning/reversed-probe effect earned there. Refold equality, reversed historic meaning, qualification controls retained. No Brief promotion/native/domain enactment from this report.')
add('CROSS_CONTEXT_IDENTITY_PLAN_REV1.json','Six canonical models127 unique runs/ExperimentIdentity/ComparisonCase freshly reconstructed without executing full matrix. Main all eight seeds each law, opposite all eight onlySharedMeaning,13 controls seed7 each law. Frozen artifacts remain exact.')
add('CROSS_CONTEXT_IDENTITY_RESULT_REV1.json','Original127 whole result rows match all four frozen worker parts and identities;635 independent contribution/quantized-fold/receiving rows verified. Historical762 prefix results authenticated, not freshly rerun. Choice/probability/RNG evidence remains original.')
add('CROSS_CONTEXT_IDENTITY_EXECUTION_REV1.json','Execution-only four-worker partition of unchanged127 prospective runs. Manifest reports at least16 serial completions; later qualification reports24 before throughput stop. Lower-bound16 and later24 are compatible, not two matrices. No final serial result or failed behavioral assertion claimed.')
for i in range(4):add(f'CROSS_CONTEXT_IDENTITY_EXECUTION_PART{i}_REV1.json',f'Original write-once worker{i} subset, execution hash and every run/result match aggregate exactly; no missing/duplicate identity. Historical execution, not fresh worker replay.')
add('CROSS_CONTEXT_IDENTITY_CLOSURE_REV1.json','Original read-only closure freshly passes all parts/source hashes,6/8 probability and4/8 action contrast, equality/source limits and historical tests/build. No current native/public admission or freshness gate claim.')
add('CROSS_CONTEXT_IDENTITY_TESTS_REV1.json','Historical12 passed assertions including actual kernels, all primary seeds, eligibility controls, hidden execution, original history, rollback/overlap and strict model/seed/source/save commitment. Corrected tests preserve cancellation rather than requiring nonzero standing. Not freshly rerun.')
add('CROSS_CONTEXT_IDENTITY_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertion leaves; authenticated not freshly rerun.')
add('CROSS_CONTEXT_IDENTITY_BUILD_REV1.json','Historical PASS/exit0 and exact artifact hashes, recorded completed process not raw log/fresh build. Initial narrowing failure separately preserved.')
for rev in [1,2]:
 j='First2 pass10 fail: nine wrong nested schema failures from positional399 variant2 plus one timeout; build TS2345 missing record narrowing. Corrected named QualificationOccurrenceId, no inherited codec changes.' if rev==1 else 'Second1 pass11 fail: ten timeouts and one incorrect assertion requiring nonzero local seed7 standing. Meaningful opposite contributions cancel; preserve fixture/seed and amend assertion plus time budgets. Not11 demonstrated behavioral defects.'
 add(f'CROSS_CONTEXT_IDENTITY_DEVELOPMENT_TESTS_REV{rev}.json',j)
 add(f'cross-context-identity-development-rev{rev}/CROSS_CONTEXT_IDENTITY_DEVELOPMENT_TESTS_REV{rev}.json','Exact archived duplicate. '+j)
 add(f'cross-context-identity-development-rev{rev}/PRESERVATION.json','Preserved prequalification cohort and source/test/fixture copies, bound through original closure. '+j)
add('cross-context-identity-development-rev1/CROSS_CONTEXT_IDENTITY_COMPONENT_CONTRACT.md','Preserved prequalification contract before typed provenance correction. Governs original intent, not acceptance of failed codec or nonzero-cancellation assertion; final contract/source and later source-sufficiency gate control qualification.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev120/index.json')['roleAssignments']};assert not set(prior)&set(specs)
identity=load(O/'identities.json');assert identity['status']=='PASS' and ref(identity['original'])['sha256']==identity['originalSha256'] and ref('scripts/check-history-cross-context-identities.mjs')['sha256']==identity['checkerSha256']
output=subprocess.check_output(['node','scripts/check-cross-context-identity-closure.mjs'],text=True).strip()
closure=load(P/'CROSS_CONTEXT_IDENTITY_CLOSURE_REV1.json');preserved=[]
for a in closure['artifacts']:
 assert ref(a['path'])['sha256']==a['sha256']
 if '/cross-context-identity-development-' in a['path']:preserved.append(a)
for rev,passed,failed in [(1,2,10),(2,1,11)]:
 t=load(P/f'CROSS_CONTEXT_IDENTITY_DEVELOPMENT_TESTS_REV{rev}.json');assert (t['numPassedTests'],t['numFailedTests'],t['numPendingTests'])==(passed,failed,0)
 assert t==load(P/f'cross-context-identity-development-rev{rev}/CROSS_CONTEXT_IDENTITY_DEVELOPMENT_TESTS_REV{rev}.json')
 bad=[a for f in t['testResults'] for a in f['assertionResults'] if a['status']=='failed'];assert len(bad)==failed
 assert sum('Test timed out' in '\n'.join(a['failureMessages']) for a in bad)==(1 if rev==1 else 10)
for name,n in [('TESTS',12),('REFERENCE_TESTS',328)]:
 t=load(P/f'CROSS_CONTEXT_IDENTITY_{name}_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
plan=load(P/'CROSS_CONTEXT_IDENTITY_PLAN_REV1.json');result=load(P/'CROSS_CONTEXT_IDENTITY_RESULT_REV1.json')
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
fmt=lambda x:f'{x.numerator}/{x.denominator}'
def fold(history):
 support=opposition=F(0)
 for _,v in history:
  support=F(round((support+max(F(0),v))*1000000),1000000);opposition=F(round((opposition+max(F(0),-v))*1000000),1000000)
 return (support-opposition)/(1+support+opposition)
count=0
for case,res in zip(plan['runs'],result['results']):
 history=[];law=case['law']
 for x,row in zip(case['inputs'],res['rows']):
  known=x['meaningAvailable'] and x['accepted'];subset=[] if x['at']!=5 or not known or law=='NoFeedback' else [h for h in history if h[0]==x['context']] if law=='SeparateContext' else history
  assert row['used']==fmt(fold(subset));v=F(0);status='Probe'
  if x['at']<5:
   v=F(row['authorship'])*F(row['alignment']) if row['alignment'] is not None else F(0);status='Accepted'
   if not x['admitted']:status='Withheld';v=F(0)
   elif not known:status='UnknownMeaning';v=F(0)
   elif law=='Frequency':v=F(1) if F(row['alignment'])>0 else F(-1)
   elif law=='Graded':v*=F(x['significance'],4)*(1-F(x['pressure'],4))
   elif x['significance']<2:status='Insignificant';v=F(0)
   elif x['pressure']>=2:status='Constrained';v=F(0)
   if v==0 and status=='Accepted':status='ZeroContribution'
   if v:history.append((x['context'],v))
  assert row['contribution']==fmt(v) and row['disposition']==status and row['strength']==fmt(fold(history));count+=1
assert count==635
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'identities.json')]+[ref(p) for p in ['scripts/check-history-cross-context-identities.mjs','scripts/check-cross-context-identity-closure.mjs','scripts/qualify-cross-context-identity.mjs','src/campaign3/crossContextIdentity.ts','src/campaign2/cognitiveMath.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='CROSS-CONTEXT COMPONENT AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/evidence','/finding','/priorAttempt','/disposition','/build')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [9,10,13,14,16,17,19,20,21]]
r=dict(status='CROSS-CONTEXT COMPONENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh canonical identities and635 independent qualification/fold/receiving calculations; historical127 cases762 prefixes not freshly rerun.','One actor, actual choice/qualification kernels, explicit expected fulfillment and accepted undertaking; no universal moral or cross-domain reward scale.','Generic execution protocol does not enact parcel/speech/attendance; successor evidence must independently qualify those domains.','Seed7 local and global cancellation is nonempty meaningful history; initial receiving controls insufficient until all-seed successor.','6/8 probabilities4/8 actions at held-out probe;1/7 equal distributions,4/6 changed distributions but same actions retained.','Authored pressure is eligibility operand, not enacted coercion; qualification and historical meaning stay separate from physical success.','First codec/narrowing rejection, timeout cohorts and failed nonzero-standing assertion preserved; no test failure deleted by changing seed.','Refold safe-view equality remains; no new native handler, Save132, natural semantic recognition or universal transfer qualification.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

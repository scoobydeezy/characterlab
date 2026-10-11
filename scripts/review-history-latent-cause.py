"""Independent latent-cause evidence/update review, preserving bounded authority."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-latent-cause-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/LATENT_CAUSE_COMPONENT_CONTRACT.md':'Accepted latent-cause-component0.1: fixed attempt, two exclusive/exhaustive hypotheses, equal prior and authored3 or1/3 diagnostic ratios. Prior evidence inference precedes current report; latest-per-channel with first-admitted receipt identity, visible episode scope. Unknown, observed success and failed-but-ambiguous separate. Existing SplitExposure consumes inferred cause and independent goal; no general causal identification or native authority.',
'docs/planning/LATENT_CAUSE_READINESS.md':'Prospective alternative-explanation intake: prior INFER correction did not earn incompetence alternative or cross-episode expectation. Requires independent physical cause/display, mistaken inference, ambiguity/duplicate controls and real downstream consumer. Later component qualification earns bounded pair only; then-partial affect necessity status is historical.',
'docs/planning/CAMPAIGN3_LATENT_CAUSE_QUALIFICATION.md':'VER-C3-LATENT-CAUSE-001:4 models56 cases392 component prefixes. Actual goal-relative appraisal consumes inferred cause without changing inference; hidden-cause swap can make same safe inference wrong. Authored report likelihoods are not empirical confidence/calibration. Research-only accuracy true,true,false over three selected exclusive causes. No physical mitigation, blame/agency rewrite, repeated-interference expectation or native admission.',
'docs/planning/LATENT_CAUSE_PLAN_REV1.json':'Original transitive sources and canonical model/run/experiment/comparison identities freshly reconstructed. All14 cases across four laws remain; fixed action/world apparatus and diagnostic inputs separate. No new model or refreeze.',
'docs/planning/LATENT_CAUSE_RESULT_REV1.json':'Whole original56-case result freshly replayed with392 complete saved prefixes336 advancing56 terminal and one successor each. Independent336-row prior-evidence inference/appraisal and final observation/evidence state match; not full tails or native Save132.',
'docs/planning/LATENT_CAUSE_CLOSURE_REV1.json':'Original read-only checker freshly passes exact artifacts/result/accuracy and historical16/328 test/build bindings. Not a fresh test/build or current wrapper completeness claim.',
'docs/planning/LATENT_CAUSE_TESTS_REV1.json':'Historical16 passed assertions:10 new plus6 factor comparisons. Actual ambiguity/correction, mistaken safe inference, goal-only appraisal, competitor differences, missing/false/success, duplicate/foreign exclusion, whole hidden/denied invariance, prefix history, two reached fault sites, step overlap and strict original/save commitments. No native publication-guard claim.',
'docs/planning/LATENT_CAUSE_REFERENCE_TESTS_REV1.json':'Historical328 passed reference assertion leaves; authenticated, not freshly rerun.',
'docs/planning/LATENT_CAUSE_BUILD_REV1.json':'Historical successful build/exit0 and exact source artifacts; recorded process evidence, not fresh build. No failed construction cohort documented for this increment.'}
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev118/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-latent-cause.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-latent-cause-closure.mjs'],text=True).strip()
plan=load(P/'LATENT_CAUSE_PLAN_REV1.json');result=load(P/'LATENT_CAUSE_RESULT_REV1.json')
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for stem,n in [('TESTS',16),('REFERENCE_TESTS',328)]:
 t=load(P/f'LATENT_CAUSE_{stem}_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
build=load(P/'LATENT_CAUSE_BUILD_REV1.json');assert build['status']=='PASS' and build['exitCode']==0
for a in build['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
fmt=lambda x:f'{x.numerator}/{x.denominator}'
count=0
for case,res in zip(plan['runs'],result['results']):
 outcome=None;evidence=[];observations=[];law=case['law'];rows=[]
 for x,row in zip(case['inputs'],res['safe']['rows']):
  b=None
  if outcome is None:status='Unknown'
  elif outcome:status='NotFailure'
  else:
   motion=next((e['motion'] for e in reversed(evidence) if e['motion'] is not None),None);drag=next((e['drag'] for e in reversed(evidence) if e['drag'] is not None),None);odds=F(1)
   for value in [] if law=='OutcomeOnly' else [motion] if law=='MotionOnly' else [motion,drag]:
    if value is not None:odds*=3 if value else F(1,3)
   b=odds/(1+odds);status='Ambiguous' if b==F(1,2) else 'Obstruction' if b>F(1,2) else 'Limitation'
  inference=dict(status=status,blockage=fmt(b) if b is not None else None,limitation=fmt(1-b) if b is not None else None)
  affect=None if b is None else [fmt(b if x['goal']=='ProtectRoute' else 1-b)]*2
  expected=dict(at=x['at'],goal=x['goal'],inference=inference,affect=affect);assert row==expected;rows.append(expected)
  if x['visible'] and any(x[k] is not None for k in ['outcome','motion','drag']):
   observations.append({k:x[k] for k in ['at','episode','receipt','outcome','motion','drag']})
   if law!='NoLearning' and x['episode']==1:
    if x['outcome'] is not None:outcome=x['outcome']
    if (x['motion'] is not None or x['drag'] is not None) and not any(e['receipt']==x['receipt'] for e in evidence):evidence.append({k:x[k] for k in ['at','receipt','motion','drag']})
  count+=1
 assert res['safe']==dict(prefix=6,intent=dict(at=1,action='AttemptDelivery'),outcome=outcome,evidence=evidence,observations=observations,rows=rows)
assert count==336
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['identities.json','replay.json']]+[ref(p) for p in ['scripts/replay-history-latent-cause.mjs','scripts/check-latent-cause-closure.mjs','scripts/qualify-latent-cause.mjs','src/campaign3/latentCause.ts','src/test/latentCauseFixtures.ts','src/test/latentCause.test.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='LATENT CAUSE AUTHORITY / INFERENCE / APPRAISAL EVIDENCE',judgment=j,acceptanceChain=chain))
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
obs=[f'RO-C3-{n:03}' for n in [10,11,14,19,20,21]]
r=dict(status='LATENT CAUSE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh56 component cases392 original prefixes, one successor each; no native or full-tail claim.','Historical16/328 tests/build authenticated, not rerun; no failed construction cohort documented.','Two exclusive exhaustive explanations, fixed chosen attempt, equal prior and authored diagnostic ratios are apparatus assumptions, not natural causal identification.','Latest per channel avoids multiplying repeated reports; cross-channel independence and first-admitted duplicate policy remain candidates, not source trust/retraction law.','Duplicate/foreign reports can remain observed while excluded from target inference; do not confuse unchanged inference with identical observation history.','Unknown outcome and observed success both make this causal appraisal unavailable, but retain distinct statuses; failed-without-diagnostics is ambiguous.','Goal changes appraisal only; no physical remediation, autonomous diagnostic action, blame or cross-episode expectation.','Hidden truth is researcher diagnostic only; accurate selected controls and mistaken hidden swap do not calibrate belief correctness.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

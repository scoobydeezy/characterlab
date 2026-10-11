from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-belief-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/BELIEF_PUBLIC_CONTRACT.md': 'Accepted belief-public/0.1-candidate construction contract, not itself verdict. One observer/character, two displayed propositions, max32 trial instants through64. Actual world truth and displayed cues separate. Complete monitoring plus opportunity admits binary success/negative; partial monitoring censored even with reported success. Unknown differs from known zero. Consequence140 cannot affect preceding50. Three candidate laws; no calibrated confidence, natural segmentation, general correlation or action-selection claim. Applied support duplicate rejection is occurrence identity protection, not detection of correlated distinct reports.', 'docs/planning/CAMPAIGN3_BELIEF_PLAN.md': 'Preserved preimplementation Stage A plan, counters733/0 historical. EvidenceMean/LastObservation/NoLearning competitors and fixed truth/different evidence, contrary evidence, goal-only, opportunity gating, rollback and prefix requirements. Current-lane ordering isolated, not resolved. Scalar censoring and general likelihood inference distinct; anticipated result is not evidence until public qualification.', 'docs/planning/CAMPAIGN3_BELIEF_QUALIFICATION.md': 'Bounded VER-C3-BELIEF-001: nine models,48 public runs,381 complete prefixes and one successor each. EvidenceMean misleading1, one correction8/9 and nine8/17; latest0; NoLearning absent. Goal sign changes appraisal only. Safe negatives1/6 versus censored/no-opportunity/denied1 with count1. Source truth hidden under matched safe observations. Seventeen final belief tests overlap initial99 for101 distinct affected, not116;328 reference historical. Unknown/current-lane/calibration/correlation/causal limits explicit; no whole Campaign3 closure.', 'docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json': 'Prospective source of48 exact ordered originals,32-byte seed,empty S0, nine frozen model choices and comparison claims. Typed serialized inputs/identities are backing, not cognitive access or independent prose findings. Seed is commitment although no stochastic draws. Claims are obligations checked by actual results, not accepted from case names.', 'docs/planning/BELIEF_PUBLIC_EXPERIMENT_REV1.json': 'Forty-eight exact result rows and381 complete-prefix records. Fresh read-only adapter reexecutes every original and restore plus one successor and compares complete original receipt including all five unchanged qualified source hashes. Arithmetic negative controls are researcher-only. Typed means/precision/support/applications/appraisals/observations and hashes retain timing and observer boundaries; no full-tail replay from every prefix claim.', 'docs/planning/BELIEF_VALIDATION_CLOSURE_REV1.json': 'Historical count/validation summary:9 models36 files48 runs381 restores/continuations;101 distinct affected tests and328 reference. Initial99 contains15 belief plus84 prediction, final17 supersedes15. Build historical; explicitly no full active suite rerun. Current fresh public replay separately authenticates original row/prefix and source identities, not fresh testing of every fault/admission assertion.', 'docs/planning/BELIEF_FOCUSED_TESTS_REV1.json': 'Historical Vitest receipt:99 actual assertion leaves across five file results (reported suite count7 is runner aggregation, not seven files),15 initial belief and84 prediction tests. Assertion titles name intended checks; passed status is historical execution evidence, not proof of broader title wording. Zero failures. Per-test timings/paths/snapshot fields are backing.', 'docs/planning/BELIEF_FINAL_TESTS_REV1.json': 'Historical17 belief assertions, including typed Boolean rejection and committed-state rollback/non-owner checks. Fifteen overlap earlier cohort, so latest distinct affected101. Duplicate evidence test protects exact applied IDs, not general correlated reports. No fresh entire fault/admission test run implied by new replay.', 'docs/planning/BELIEF_REFERENCE_TESTS_REV1.json': 'Historical328 reference assertions; detailed titles are existing reference mechanisms and limits reviewed in the reference source chain, not new BELIEF discoveries. Source/visibility/overflow title cannot establish absence of all truth fields; RET014 and Phase3 plan correction stand. Timing, paths and repeated labels are backing; no fresh reference run here.', 'docs/planning/CAMPAIGN3_BELIEF_PARTIAL_COVERAGE_AUDIT.md': 'Historical REV88 promotes only repeated prediction error from separate reinforcement evidence. MeanHistory seed2 prior1/2,2/3,3/4,4/5,5/6 yields success residual1/2,1/3,1/4,1/5,1/6. Withheld receipts keep1/2 despite relief; six of eight choice pairs differ. This is audit readout, not new surprise circuit. Then-partial uncertainty/accuracy and hidden cause later receive separately bounded UNCERTAINTY and LATENT-CAUSE evidence; old qualification is not retroactively enlarged. LEARN repeated-bound overcredit preserved.', 'docs/planning/BELIEF_PARTIAL_COVERAGE_CHECK_REV1.json': 'Original read-only coverage checker and three transitive closure checks freshly pass. Exact residuals, original REV4 intake counts and historical source hashes preserved. Snapshot116 bounded16 partial is historical, not current132 bounded. Later interval uncertainty and two-cause inference qualify separate components, not general probability calibration or causal discovery.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BELIEF AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'replay.json'),ref(O/'coverage-check.json'),ref(P/'CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md'),ref(P/'CAMPAIGN3_LATENT_CAUSE_QUALIFICATION.md'),ref('src/campaign3/beliefMath.ts')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'BELIEF_PUBLIC_EXPERIMENT_REV1.json');plan=load(P/'BELIEF_EXPERIMENT_PLAN_REV1.json')
assert v['planSha256']==ref(P/'BELIEF_EXPERIMENT_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==48
assert sum(len(r['prefixes']) for r in v['results'])==381
for r in v['results']:
 assert set(r)==set('name caseName law goal modelIdentity runIdentity prefixes beliefs appraisals applications observations stateSha256 safeOutputSha256 traceSha256 finalSaveSha256'.split())
 for q in r['prefixes']:assert set(q)=={'clock','saveSha256'}
 for q in r['beliefs']:assert set(q)=={'mean','precision','support'}
 for q in r['appraisals']:assert set(q)=={'mean','expected','confidence'}
 for q in r['applications']:assert set(q)=={'classification','prior','posterior','applied'}
for n,count in [('BELIEF_FOCUSED_TESTS_REV1.json',99),('BELIEF_FINAL_TESTS_REV1.json',17),('BELIEF_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
a=lambda n:{(Path(f['name']).name,x['fullName']) for f in load(P/n)['testResults'] for x in f['assertionResults']}
assert len(a('BELIEF_FOCUSED_TESTS_REV1.json')|a('BELIEF_FINAL_TESTS_REV1.json'))==101

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-014','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='ELEVEN BELIEF SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh48-run/381-prefix public replay, not a full active/reference test rerun.','Confidence calibration and correlated reports remain unqualified.','Historical partial clauses superseded only by separately scoped later qualifications.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=11,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

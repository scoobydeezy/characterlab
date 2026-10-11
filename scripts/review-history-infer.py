from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-infer-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/INFERENCE_CORRECTION_EXPERIMENT.md': 'Accepted inference-correction-experiment/0.1 over unchanged agency-public0.3. Same observer-local delivery episode obstruction proposition, not culprit/blame/counterfactual efficacy or alternative diagnosis. Five inherited laws,15 prospective comparisons. Admitted report polarity and unique receipts update at140 for later40; direct received episode marks, not hidden scheduler ancestry. Readout labels are researcher diagnostics only. Frozen intent/expression/outcome and prior observations remain; no new state/source/learning law/allocation.', 'docs/planning/CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md': 'VER-C3-INFER-001 bounded report-supported correction:5 reused models15 runs120 prefixes105 advancing15 terminal. GroupedMean1/1,1/2,1/3; LastClaim1,0,0; OutcomeOnly unknown. Duplicate/silence/foreign episode do not correct target; denied report preserves full later view; swapped recipient changes holder. Hidden blocker change keeps safe view but makes correction false, proving no truth repair. SuccessAsIntent loses failed expression; OmniscientCause leaks truth. No alternative cause inferred. Seven new/328 reference tests and build historical;38 inherited agency tests not freshly rerun.', 'docs/planning/INFERENCE_CORRECTION_PUBLIC_PLAN_REV1.json': 'Prospective15 exact original-input/run commitments referencing five already-qualified agency models, ExperimentIdentity and ComparisonCase. Plan commits readout, fixtures, tests, original runner, agency source/contract/allocation/freeze bytes. Current exact original plan/source bindings are verified; scope excludes discovery and calibrated trust. Serialized IDs and inputs are backing, not character knowledge.', 'docs/planning/INFERENCE_CORRECTION_PUBLIC_RESULT_REV1.json': 'Fresh public15-run120-prefix replay compares full saved bytes on restore and one successor, then reproduces complete original result. Exact model/run/input joins and terminal save/state/output/two-observer hashes preserved. Runner checks1/1->1/2->1/3, unknown versus zero, duplicate/foreign scope, causal timing, safe-view equalities, immutable intent/expression and violating controls. No full-tail replay from every prefix or universal inference claim.', 'docs/planning/INFERENCE_CORRECTION_CLOSURE_REV1.json': 'Original read-only closure freshly passes:5 reused models15 runs120 prefixes,105 advance15 terminal,7 tests328 reference historical,20 frozen model files, all original plan/receipt/source bindings. This is closure integrity, not fresh unit/fault or build execution. Fresh public replay is separately recorded.', 'docs/planning/INFERENCE_CORRECTION_TESTS_REV1.json': 'Seven historical passing assertions: same episode/conflict/unknown; LastClaim/outcome/reordered competitors; duplicates/silence/foreign episode; preserved prior outputs/timing; hidden/denied/swapped observer boundaries; intent/expression preservation; diagnostic rejection of other holder/raw output. Readout1/2 is Mixed not unknown,0/2 retains two-source tally not normalized confidence. Titles do not qualify general causal discovery or calibration.', 'docs/planning/INFERENCE_CORRECTION_REFERENCE_TESTS_REV1.json': 'Historical328 reference passing assertions, previously reviewed mechanism semantics. Test names, repeated messages, timing and paths are backing records, not new inference findings or fresh executions. Existing precision-overcredit and observer-truth distinctions remain despite broad labels.', 'docs/planning/INFERENCE_CORRECTION_BUILD_REV1.json': 'Historical npm build exit0 with boundaries/TypeScript/Vite PASS. Summary does not contain detailed output or a fresh build; original closure authenticates its scope.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='INFERENCE CORRECTION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'replay.json'),ref(O/'closure-check.json'),ref(P/'INFERENCE_CORRECTION_CLOSURE_REV1.json'),ref('src/campaign3/inferenceCorrectionReadout.ts'),ref('src/test/inferenceCorrection.test.ts'),ref('src/test/inferenceCorrectionFixtures.ts')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'INFERENCE_CORRECTION_PUBLIC_RESULT_REV1.json');plan=load(P/'INFERENCE_CORRECTION_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'INFERENCE_CORRECTION_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==15
assert sum(r['prefixes'] for r in v['results'])==120
for i,r in enumerate(v['results']):
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('INFERENCE_CORRECTION_TESTS_REV1.json',7),('INFERENCE_CORRECTION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='EIGHT INFERENCE CORRECTION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh15-run/120-prefix replay; historical7/328 tests and build not freshly rerun.','Revising obstruction testimony does not diagnose incompetence or identify culprit.','Readout majority labels and source counts are diagnostics, not calibrated probability or new cognitive states.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=8,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-delayed-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/DELAYED_PUBLIC_CONTRACT.md': 'Accepted delayed-public0.1: same benefit/task option-specific grounds, not two Needs. Admitted prediction/value, actual chosen plan, waiting, executor-owned delivery and learned receipt distinct. Exactly8 instants, choice2,delay1..4 ensures settlement horizon. Hyperbolic/NoDiscount/Exponential preserved; p1/half uncalibrated, costs same-benefit control. Fixed ticket receipt mode avoids contradictory reuse.', 'docs/planning/DELAYED_GRATIFICATION_READINESS.md': 'Prospective larger later versus immediate same-kind benefit with actual wait/delivery/failure. Future promise not received reward; missing evidence not failure. Preserve delay/cost/uncertainty and serious discount controls, no optimal patience/general temporal planner.', 'docs/planning/CAMPAIGN3_DELAYED_QUALIFICATION.md': 'VER-C3-DELAYED-001:3 models26 runs234 prefixes208 advancing26 terminal;27/328 tests/build historical. Actual later choice2 no delivery then, delivery3; immediateLarge chooses now. Six repeated receipt observations yield one retained receipt. Failed promise retains earlier choice/expression; missing receipt unknown. Independent physical amounts may differ even for immediate offer. No adaptive later choice.', 'docs/planning/DELAYED_IMPLEMENTATION_FINDINGS.md': 'Pre-freeze stage pattern142 rejected, corrected149; structural failure not psychological competitor rejection. Initial24 tests expanded27 for actual choice distribution and due-delivery rollback. Unknown/unavailable/absent and missing/knownzero distinct. Static one-shot horizon ensures capacity; no trust learning, endogenous effort/satiety, renegotiation or general planning.', 'docs/planning/DELAYED_PUBLIC_PLAN_REV1.json': 'Frozen26 unique original identities/three models and source/experiment/comparison commitments; one controlled offer/choice/transaction with bounded complete delivery window.', 'docs/planning/DELAYED_PUBLIC_RESULT_REV1.json': 'Twenty-six exact rows234 historical prefixes bound to plan. Fresh stored assertions verify rational discount values, actual distributions/choices, waiting/delivery, receipt deduplication, immutable early expression and safe privacy. Not fresh runtime replay.', 'docs/planning/DELAYED_PUBLIC_VIEWS_REV1.json': '26 full outputs/safe single-observer views hash authenticated. Missing versus zero, false receipt with equal physical truth, hidden settlement behind denied/late common receipt and no redelivery checked. Truth remains executor-owned.', 'docs/planning/DELAYED_CLOSURE_REV1.json': 'Fresh original closure passes artifacts, three frozen models,26 runs234 prefixes and final test/build bindings.1377..1400 namespace1155;1400/0 historical, no new RNG qualification.', 'docs/planning/DELAYED_PRESERVATION_REV1.json': 'Four exact artifacts preserve preliminary rejected allocation, initial24/final27 tests and semantic limits. Frozen candidate identities unchanged by pre-freeze schema correction.', 'docs/planning/DELAYED_SCHEMA_REJECTED_REV1.json': 'Full rejected allocation and digest preserved: stage read/write patterns used ref142 state-path rather than149 pattern. Before model freeze/public run; structural validation failure, not scientific discount-law rejection.', 'docs/planning/DELAYED_TESTS_REV1.json': 'Initial24 individually passed tests; later static review added distribution and due-delivery faults. Initial pass not full final coverage.', 'docs/planning/DELAYED_TESTS_REV2.json': 'Final27 individually passed assertions:12 stages+commit at choice, actual delivery execution/commit faults, phases/immutability/authority/ingress/source horizon and receipt-mode guards. Historical not fresh tests.', 'docs/planning/DELAYED_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference assertions; metadata backing not fresh suite or delayed-learning finding.', 'docs/planning/DELAYED_BUILD_REV1.json': 'Historical build PASS with exact source bindings; no fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'DELAYED_CLOSURE_REV1.json'),ref('scripts/qualify-delayed-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='DELAYED AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'DELAYED_PUBLIC_RESULT_REV1.json');plan=load(P/'DELAYED_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'DELAYED_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==26 and sum(r['prefixes'] for r in v['results'])==234
for i,r in enumerate(v['results']):
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('DELAYED_TESTS_REV1.json',24),('DELAYED_TESTS_REV2.json',27),('DELAYED_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'DELAYED_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'DELAYED_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FOURTEEN DELAYED SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh26 stored views, not234 runtime prefixes or27/328 tests/build.','Pre-freeze schema rejection structural; initial24 tests expanded27, not a failed discount candidate.','Same-benefit finite costs and uncalibrated forecast weights, not universal discount curve or cross-domain currency.','One transaction retains outcome once; no adaptive next choice, trust calibration, endogenous effort/satiety or general temporal planner.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

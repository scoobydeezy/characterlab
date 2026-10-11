from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-reliance-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/RELIANCE_HISTORY_EXPERIMENT.md': 'Accepted experiment0.1 over unchanged rel-dimensions-public0.1/six frozen models. Seven requests separate own commitment fulfillment/failure, denied probes, Y history and later noncommitment X receipt. No new model/allocation/law. Mean1→1/2 versus reverse0→1/2; prospective entrust probabilities, not executed delegation. Seven new tests, inherited authority/fault tests bound not rerun.', 'docs/planning/RELIANCE_HISTORY_READINESS.md': 'Prospective test of new learning horizon using existing models before adding machinery. Requires both outcome orders, missing opportunity, matched other dimensions, observer/target specificity and later privacy. High-trust snapshot alone insufficient. Prospective reliance explicitly distinct from executed delegation.', 'docs/planning/CAMPAIGN3_RELIANCE_HISTORY_QUALIFICATION.md': 'VER-C3-RELIANCE-001:6 reused models22 runs176 prefixes154 advancing22 terminal;7 new328 reference tests/build historical, inherited23 not freshly rerun. Fulfilled then failed changes1 to1/2 and7/9 to1/2; reverse0 then1/2. Unknown versus known mixed same consumer1/2 remain distinct. Task-only changes contaminate SingleScore/PersonOnly but not Split; not claim competence never matters. No sampled action or general trust.', 'docs/planning/RELIANCE_HISTORY_IMPLEMENTATION_FINDINGS.md': 'First6pass/1timeout, no assertion mismatch; planREV1 frozen but unexecuted. Successor changes one test timeout to60s and receipt paths, not models/fixtures. Mean order-insensitive, not recency/betrayal/repair. No opportunity not failure; general incident can enter history without commitment sample. Same consumer output cannot license collapsing unknown/mixed states.', 'docs/planning/RELIANCE_HISTORY_PUBLIC_PLAN_REV1.json': 'Unexecuted prospective22-run roster; exact original artifact bindings resolve through originalPath preservation mapping. Same run/model/input identities as successor; no public result or extra22 runs earned from this plan.', 'docs/planning/RELIANCE_HISTORY_PUBLIC_PLAN_REV2.json': 'Successor22-run plan, exact original identities/input roster retained; fixture/model/production unchanged. Test timeout/harness receipt-path packaging only; frozen ExperimentIdentity/ComparisonCase. No new model qualification.', 'docs/planning/RELIANCE_HISTORY_PUBLIC_RESULT_REV2.json': 'Complete22-row176-prefix aggregate from four disjoint workers. Fresh stored decoding/original contrasts verifies commitment horizon, unknown/mixed distinctions, task contamination controls and later whole-view privacy;154 advances22 terminal historical, not fresh runtime replay.', 'docs/planning/RELIANCE_HISTORY_CLOSURE_REV1.json': 'Original closure freshly validates reused model/source/allocation, both plans through archive mapping, worker bytes and7/328 tests/build. Counters1234/0 historical. Inherited REL_DIMENSIONS23 fault/schema tests are bound, not rerun by this experiment.', 'docs/planning/RELIANCE_HISTORY_PRESERVATION_REV1.json': 'Four exact artifacts preserve old test/harness through originalPath, timeout receipt and unexecuted plan. Packaging correction not psychological falsification; no superseded public PASS claimed.', 'docs/planning/RELIANCE_HISTORY_TESTS_REV1.json': 'Historical6pass/1default5000ms timeout in multimodel comparison. No assertion mismatch reported. Exact rejected harness/test preserved; not a failed learning law or public cohort.', 'docs/planning/RELIANCE_HISTORY_TESTS_REV2.json': 'Final7 historical PASS after single timeout extension to60000ms. Same tests, not additive13 passes. Learning horizon, isolated lens/use, ownership/privacy/timing; inherited23 authority/fault tests not rerun.', 'docs/planning/RELIANCE_HISTORY_REFERENCE_TESTS_REV1.json': 'Historical328 reference assertions PASS, titles/paths/timings backing to reviewed mechanisms; not new reliance findings or fresh execution.', 'docs/planning/RELIANCE_HISTORY_BUILD_REV1.json': 'Historical build PASS with exact source artifacts; no new production module or model semantics. Not fresh build.', 'docs/planning/reliance-history-public-workers-rev2/0.json': 'Worker partition0: original roster modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh22 stored-view contrasts preserve mean order-insensitivity, matched dimensions, denied/no opportunity and later privacy;176 prefixes historical, not new replay.', 'docs/planning/reliance-history-public-workers-rev2/1.json': 'Worker partition1: original roster modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh22 stored-view contrasts preserve mean order-insensitivity, matched dimensions, denied/no opportunity and later privacy;176 prefixes historical, not new replay.', 'docs/planning/reliance-history-public-workers-rev2/2.json': 'Worker partition2: original roster modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh22 stored-view contrasts preserve mean order-insensitivity, matched dimensions, denied/no opportunity and later privacy;176 prefixes historical, not new replay.', 'docs/planning/reliance-history-public-workers-rev2/3.json': 'Worker partition3: original roster modulo4 membership, unique identities, output/two observer-view hashes and complete aggregate. Fresh22 stored-view contrasts preserve mean order-insensitivity, matched dimensions, denied/no opportunity and later privacy;176 prefixes historical, not new replay.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'RELIANCE_HISTORY_CLOSURE_REV1.json'),ref('scripts/qualify-reliance-history-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RELIANCE_HISTORY AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'RELIANCE_HISTORY_PUBLIC_RESULT_REV2.json');plan=load(P/'RELIANCE_HISTORY_PUBLIC_PLAN_REV2.json')
assert v['planSha256']==ref(P/'RELIANCE_HISTORY_PUBLIC_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==22 and sum(r['prefixes'] for r in v['results'])==176
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('RELIANCE_HISTORY_TESTS_REV2.json',7),('RELIANCE_HISTORY_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'RELIANCE_HISTORY_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
pres=load(P/'RELIANCE_HISTORY_PRESERVATION_REV1.json')
for a in pres['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
old=load(P/'RELIANCE_HISTORY_PUBLIC_PLAN_REV1.json');assert old['runs']==plan['runs']
for k in ['initialState','runSeed','experimentIdentity','comparisonCase']:assert old[k]==plan[k]
for a in old['artifacts']:
 saved=next((x for x in pres['artifacts'] if x.get('originalPath')==a['path']),a);assert ref(saved['path'])['sha256']==a['sha256']
t=load(P/'RELIANCE_HISTORY_TESTS_REV1.json');assert t['numPassedTests']==6 and t['numFailedTests']==1
failed=[a for f in t['testResults'] for a in f['assertionResults'] if a['status']=='failed'];assert len(failed)==1 and 'timed out in 5000ms' in failed[0]['failureMessages'][0]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-011','RO-C3-014','RO-C3-016','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='SEVENTEEN RELIANCE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh22 stored-view contrasts, not22-run/176-prefix replay or7/328 tests/build; inherited23 faults not rerun.','No new models/laws; known mixed and unknown both yield1/2 without state equivalence.','Mean order-insensitive, not recency/betrayal/repair or general trust.','Prospective entrust distribution, not chosen action or executed delegation.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

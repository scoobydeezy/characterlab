from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-familiarity-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/FAMILIARITY_PUBLIC_CONTRACT.md': 'Accepted familiarity-public0.1: one observer, two independent Boolean features plus optional peripheral detail, apparatus category person/place, max12 originals through16 and8 displays. Hidden identity excluded baseline. source0/observe10/freeze20/recognize21/consolidate140 uses prior memory so no self-match. Fixed age3 detail removal occurs at consolidation, not continuously; signatures survive. PartialMax, ExactOnly, DetailRequired, MissingAsFalse and TruthIdentity retained. Similarity and coverage differ; no identity probability, positive valence, downstream action or general learned metric.', 'docs/planning/CAMPAIGN3_FAMILIARITY_QUALIFICATION.md': 'VER-C3-FAMILIAR-001:5 models24 runs94 prefixes70 advance24 terminal,16 focused328 reference historical. Person/place familiar-different1/2 after actual detail loss. ExactOnly rejects partial, DetailRequired unknown after loss, MissingAsFalse fabricates matches, TruthIdentity leaks hidden identity through result. NoHistory/Unknown/NoPercept/known zero distinct. Same hidden person may be novel, different person familiar. Ties preserve all best references, not unique identity. No general recognition/retention/defining-memory or affect claim.', 'docs/planning/FAMILIARITY_PUBLIC_PLAN_REV1.json': 'Prospective24 exact run/model/original commitments with five ModelIdentities and ExperimentIdentity/ComparisonCase plus source/contract/allocation/freeze hashes. Main encodes1, absent display4 triggers actual detail removal, current comparison5; no claim mere elapsed time mutates memory without consolidation. Seed commits deterministic no-draw run. Labels and bytes are typed backing, not findings alone.', 'docs/planning/FAMILIARITY_PUBLIC_RESULT_REV1.json': 'Stored24 result rows join all exact original plan values and total94 prefixes. Original closure freshly verifies bindings; no fresh runtime replay here. Runner checks two-category partial after loss, missing/false/coverage, ties, history acquisition, earlier output preservation and full hidden/denied observer equalities. Whole-save plus next-successor historical scope, not full tails. Similarity1 with one known feature does not prove same coverage as two.', 'docs/planning/FAMILIARITY_CLOSURE_REV1.json': 'Original read-only closure freshly passes24 joins,5 model freezes,13 allocations1055..1067/namespace1167,16 focused328 reference/build receipts and preserved failed runtime hash. Integrity is not a fresh24-run94-prefix replay or new test/build execution.', 'docs/planning/FAMILIARITY_BUILD_FAILURE_REV1.json': 'Preserved first build exit1 TS2345: raw bigint lookup in Map keyed by branded SimInstant, only explicit oracle comparator. Exact archived runtime retained. Current difference is simInstant import and validated constructor at lookup; no contract/recipe/model identity changed. This is type admission failure, not a psychological counterexample or a missing baseline identity mechanism.', 'docs/planning/FAMILIARITY_TESTS_REV1.json': 'Initial historical16 assertions pass despite separate later typecheck/build failure. Runtime test pass does not imply static build pass. Same16 assertion names as corrected second cohort; not32 distinct tests. Nine behavior/phase/observer checks, five stage fault checks plus commit and combined admission/authority check; titles scoped, not universal evidence.', 'docs/planning/FAMILIARITY_TESTS_REV2.json': 'Corrected historical16 assertions pass after validated-time correction, before public plan freeze. Actual detail removal checked in memory and comparisons; immutable old observation still contains original detail. Faults proven at detail-loss instant; current display excluded from frozen prior memory. No fresh focused run here.', 'docs/planning/FAMILIARITY_REFERENCE_TESTS_REV1.json': 'Historical328 passing reference assertions. Repeated titles/paths/timings/runner metadata are backing to already reviewed reference mechanisms, not new familiarity claims or fresh execution. No epistemic or precision limits retired by receipt.', 'docs/planning/FAMILIARITY_BUILD_REV2.json': 'Corrected historical npm build exit0, boundaries/TypeScript/Vite PASS. Original failed receipt and exact source remain; summary is not detailed log or fresh build.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='FAMILIARITY AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'closure-check.json'),ref(P/'FAMILIARITY_CLOSURE_REV1.json'),ref('src/campaign3/familiarityMath.ts'),ref('src/test/familiarityPublic.test.ts'),ref('src/test/familiarityFixtures.ts'),ref(P/'familiarity-development/familiarityRuntime.ts')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'FAMILIARITY_PUBLIC_RESULT_REV1.json');plan=load(P/'FAMILIARITY_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'FAMILIARITY_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==24
assert sum(r['prefixes'] for r in v['results'])==94
for i,r in enumerate(v['results']):
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('FAMILIARITY_TESTS_REV1.json',16),('FAMILIARITY_TESTS_REV2.json',16),('FAMILIARITY_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
names=lambda n:{a['fullName'] for f in load(P/n)['testResults'] for a in f['assertionResults']}
assert names('FAMILIARITY_TESTS_REV1.json')==names('FAMILIARITY_TESTS_REV2.json')
old=(P/'familiarity-development/familiarityRuntime.ts').read_text(encoding='utf-8')
expected=old.replace("import {createCognitiveRandomSession}","import {simInstant} from '../substrate/time';\nimport {createCognitiveRandomSession}").replace('world.get(instantValue(f(v,2n)))','world.get(simInstant(instantValue(f(v,2n))))')
assert expected==Path('src/campaign3/familiarityRuntime.ts').read_text(encoding='utf-8')

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='TEN FAMILIARITY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Original closure freshly checked;24-run/94-prefix matrix and16/328 tests/build historical.','Feature familiarity is not instance identity, positive valence or general recognition.','Fixed age3 attrition requires consolidation; no continuously evolving clock-only loss claim.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=10,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

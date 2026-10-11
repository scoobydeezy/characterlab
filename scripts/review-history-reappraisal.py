from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-reappraisal-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/REAPPRAISAL_PUBLIC_CONTRACT.md': 'Accepted reappraisal-public0.1: two acquired conditional means and independently observed availability catalogue; uncontested received instruction, independent attempted completion, separately owned frame140, later appraisal50. Fixed severity1/vulnerability1/control0, no double counting protection. Contemplating protected condition is hypothetical, not physical mitigation or evidence correction. Four laws/five model combinations preserve no-op, override and false relief-credit controls plus two projections. No downstream choice/action, frame expiry, universal cost or spontaneous strategy.', 'docs/planning/AFFECT_REGULATION_READINESS.md': 'Stage A preimplementation question and proposed comparisons, not evidence. Its proposed motive consumer integration is explicitly narrowed by accepted contract/qualification to affect consumer only. Former clause8 BLOCKED is historical status, subsequently bounded by VER-C3-REAPPRAISAL-001; no retroactive claim all readiness wishes executed. Acquisition before use, preserved evidence, failed operations, later receiving and same-instant guard remain obligations. CONTROL slot rule not automatically imported.', 'docs/planning/CAMPAIGN3_REAPPRAISAL_QUALIFICATION.md': 'Bounded instructed conditional framing:5 models20 runs103 prefixes83 advance20 terminal,15 focused328 reference historical. Later likelihood1->0 with fixed beliefs, evidence, goal and physical danger; harmful protection0->1 and mixed1/2 prevent forced-relief interpretation. Missing knowledge/catalogue/failed attempt inert. Override improperly forces0; ReliefAsEvidence contaminates mean with fake credit while retaining observations. HistoricalProduct/SplitExposure not dimensionally discriminated at fixed factors. Freeze copied date22 versus accepted23 preserved without changing bytes.', 'docs/planning/REAPPRAISAL_PUBLIC_PLAN_REV1.json': 'Prospective20 exact original/model/run commitments, five identities, ExperimentIdentity/ComparisonCase, transitive source/contract/allocation/freeze. Seed committed although RNG unused. Readiness expectations are not replaced by plan labels; own declared scope excludes physical mitigation/spontaneous selection/downstream action.', 'docs/planning/REAPPRAISAL_PUBLIC_RESULT_REV1.json': 'Stored20-row103-prefix result and exact plan joins authenticated by original read-only closure.83 advancing20 terminal; whole-save and one-successor semantics in original runner, not full tails. Main/noRequest/NoReappraisal, harmful/ineffective/mixed, unknown/failed/sameInstant, hidden/denied and two diagnostic laws asserted by original runner. No new public matrix replay here; hashes are historical evidence, not fresh behavior.', 'docs/planning/REAPPRAISAL_CLOSURE_REV1.json': 'Original closure freshly passes plan/result/source hashes, five model freezes,15 records1025..1039 namespace1165,15 focused328 reference and build receipts. Frozen date discrepancy explicitly preserved as metadata. Does not freshly execute behavior, fault tests or build.', 'docs/planning/REAPPRAISAL_TESTS_REV1.json': 'Historical15 passing tests: six behavioral/timing/observer checks, seven stage fault checks plus commit, and combined authority/input/save admission check. Preserves acquired beliefs and unknown distinction. Test titles are scoped historical assertions, not universal reappraisal or complete active-suite proof.', 'docs/planning/REAPPRAISAL_REFERENCE_TESTS_REV1.json': 'Historical328 passing reference assertions; titles/timings/paths/runner metadata are backing for reviewed reference mechanisms, not new reappraisal results or fresh execution. No old precision/epistemic limits retired.', 'docs/planning/REAPPRAISAL_BUILD_REV1.json': 'Historical npm build exit0 and boundaries/TypeScript/Vite PASS summary, bound by closure. Not new build or full output transcript.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='REAPPRAISAL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'closure-check.json'),ref(P/'REAPPRAISAL_CLOSURE_REV1.json'),ref('src/campaign3/reappraisalMath.ts'),ref('scripts/qualify-reappraisal-public.mjs')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'REAPPRAISAL_PUBLIC_RESULT_REV1.json');plan=load(P/'REAPPRAISAL_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'REAPPRAISAL_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==20
assert sum(r['prefixes'] for r in v['results'])==103
for i,r in enumerate(v['results']):
 assert set(r)==set('law projection name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('REAPPRAISAL_TESTS_REV1.json',15),('REAPPRAISAL_REFERENCE_TESTS_REV1.json',328)]:
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
obs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='NINE REAPPRAISAL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Original closure freshly checked;20-run/103-prefix matrix and15/328 tests/build historical.','Instructed conditional framing does not qualify contested choice, downstream action or physical mitigation.','Fixed factors do not establish dimensional necessity; copied freeze date remains unchanged.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=9,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

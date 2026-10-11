from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-rel-dimensions-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/REL_DIMENSIONS_PUBLIC_CONTRACT.md': 'Accepted rel-dimensions-public0.1 derives four optional appraisal proxies from own assistance/commitments, witnessed task evidence and current threat cue. Separate observer/target history/person leaves; current cue not familiarity. Four real reason/distribution probes with independent base motives, no sampled choice/intent/execution. SplitLenses/SingleScore/PersonOnly/NoRetention/TruthOracle retained; no authoritative emotion axes or general definitions.', 'docs/planning/RELATIONSHIP_DIMENSIONS_READINESS.md': 'Prospective affection/respect/trust/comfort dissociations, source-specificity and real consumer required. Does not require four independently stored scalars or a universal update law. Accepted scope earns prospective response distributions, not enacted social interaction; own history differs from witnessed person evidence.', 'docs/planning/CAMPAIGN3_REL_DIMENSIONS_QUALIFICATION.md': 'VER-C3-REL-DIMENSIONS-001:6 models23 runs161 prefixes138 advancing23 terminal;23/328 tests/build historical. X lenses1/0/1/0 versus Y0/1/1/1; selective sources affect matching lens/probe only. Exact7/9 and2/9 versus unknown/disabled1/2. SingleScore loses opposite directions, PersonOnly ignores assistance but retains journals. Whole later privacy includes received X evidence after denied intervention. No universal dimensionality/affect or enacted behavior claim.', 'docs/planning/REL_DIMENSIONS_IMPLEMENTATION_FINDINGS.md': 'Initial21/23 tests failed due incorrect downstream dice expectation and whole-record equality under changed participation. Inherited consolidation maps raw1 to1/2 before die/modifier quantization: d6 with plus/minus2, exact7/9 and2/9. Correct witness invariant is same task evidence/estimate, not identical records containing changed participant flag. Production/model/contract unchanged. Zero proxy is not contempt/dislike; familiarity not inferred.', 'docs/planning/REL_DIMENSIONS_PUBLIC_PLAN_REV1.json': 'Prospective23 original runs/six models with frozen ExperimentIdentity/ComparisonCase and exact source/contract/test bindings. Seed32 bytes13, no draws. Actual inherited reason analysis supports probabilities; controlled assistance/performance/commitment/threat are not psychological labels supplied as answers.', 'docs/planning/REL_DIMENSIONS_PUBLIC_RESULT_REV1.json': 'Complete23-row161-prefix aggregate from four workers. Fresh decoded stored assertions verify lens/probe selective effects, target/observer specificity, same journal comparators, unknown and later whole-view privacy.138 advancing23 terminal historical, not fresh scheduler replay.', 'docs/planning/REL_DIMENSIONS_CLOSURE_REV1.json': 'Original closure freshly checks plan/result/model/source/allocation/worker bindings, preserved3-artifact development inventory and23/328 tests/build. Records1207..1220 namespace1177;1220/0 historical. No fresh161-prefix replay or fault suite.', 'docs/planning/REL_DIMENSIONS_PRESERVATION_REV1.json': 'Three exact artifacts preserve rejected test source, old public harness expectations and initial21pass/2fail receipt. Corrections change expectations/projections, not production/model/contract. Earlier failed assertions remain visible.', 'docs/planning/REL_DIMENSIONS_TESTS_REV1.json': 'Historical21pass/2fail. Failed probability expectation23/25 versus actual7/9 and full person-record equality despite changed participation. These are incorrect test assumptions, not model falsifications. Exact source diff preserves correction; no public PASS overwritten.', 'docs/planning/REL_DIMENSIONS_TESTS_REV2.json': 'Final historical23 PASS:13 stages plus commit rollback, behavioral/distribution/ownership/privacy, malformed model/input/save/handles, foreign-target checks. Replaces initial23 cohort, not additive coverage. Prospective distributions only; not sampled social response.', 'docs/planning/REL_DIMENSIONS_REFERENCE_TESTS_REV1.json': 'Historical328 reference assertions passed. Labels/paths/timings backing to reviewed mechanisms, not new relational findings or fresh suite execution.', 'docs/planning/REL_DIMENSIONS_BUILD_REV1.json': 'Historical final build PASS and exact source bindings authenticated, not fresh build or full active-suite claim.', 'docs/planning/relDimensions-public-workers-rev1/0.json': 'Worker partition0: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh23 stored-view original assertions preserve selective lenses/probabilities and whole later privacy;161 prefixes remain historical, no new runtime replay.', 'docs/planning/relDimensions-public-workers-rev1/1.json': 'Worker partition1: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh23 stored-view original assertions preserve selective lenses/probabilities and whole later privacy;161 prefixes remain historical, no new runtime replay.', 'docs/planning/relDimensions-public-workers-rev1/2.json': 'Worker partition2: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh23 stored-view original assertions preserve selective lenses/probabilities and whole later privacy;161 prefixes remain historical, no new runtime replay.', 'docs/planning/relDimensions-public-workers-rev1/3.json': 'Worker partition3: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh23 stored-view original assertions preserve selective lenses/probabilities and whole later privacy;161 prefixes remain historical, no new runtime replay.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'REL_DIMENSIONS_CLOSURE_REV1.json'),ref('scripts/qualify-rel-dimensions-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='REL_DIMENSIONS AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'REL_DIMENSIONS_PUBLIC_RESULT_REV1.json');plan=load(P/'REL_DIMENSIONS_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'REL_DIMENSIONS_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==23 and sum(r['prefixes'] for r in v['results'])==161
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('REL_DIMENSIONS_TESTS_REV2.json',23),('REL_DIMENSIONS_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'REL_DIMENSIONS_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'REL_DIMENSIONS_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
t=load(P/'REL_DIMENSIONS_TESTS_REV1.json');assert t['numPassedTests']==21 and t['numFailedTests']==2
failed=[a for f in t['testResults'] for a in f['assertionResults'] if a['status']=='failed'];assert len(failed)==2
assert 'derives affection' in failed[0]['title'] and 'observer participation' in failed[1]['title']
from fractions import Fraction
for modifier,expected in [(2,Fraction(7,9)),(-2,Fraction(2,9))]:
 wins=sum(a+modifier>b for a in range(1,7) for b in range(1,7));ties=sum(a+modifier==b for a in range(1,7) for b in range(1,7))
 assert Fraction(2*wins+ties,72)==expected
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
v=dict(status='SIXTEEN RELATIONSHIP DIMENSION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh23 stored-view contrasts and independent fair-tie enumeration, not23-run/161-prefix runtime replay or23/328 tests/build.','Four derived proxies and response distributions, not sampled choice/intent/execution or general emotion axes.','Consolidation-before-quantization and participant-field record difference preserve initial failure explanations.','No general bonding, normative respect, calibrated trust, familiarity integration or universal dimensionality.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

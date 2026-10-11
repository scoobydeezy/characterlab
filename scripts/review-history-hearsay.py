from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-hearsay-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/HEARSAY_PUBLIC_CONTRACT.md': 'Accepted hearsay-public0.1: controlled actual conduct, fallible speaker/direct displays, latest speaker belief and automatic relay110, recipient channel-labelled evidence120/retention140, later inference40/appraisal50. Public speaker/ticket dedup, conflicting delivered reuse rejected. DirectPriority/LatestEvidence/NoLearning/TruthOracle retained. No chosen speech, global reputation, calibrated trust or independent corroboration.', 'docs/planning/REPUTATION_HEARSAY_READINESS.md': 'Prospective report versus direct-evidence distinction, not qualified reputation itself. Requires sincere error, report/direct conflict, duplicate handling or explicit dependence deferral and later privacy. Accepted finite one-speaker public-ticket scope does not cover multispeaker concealed common sources.', 'docs/planning/CAMPAIGN3_HEARSAY_QUALIFICATION.md': 'VER-C3-HEARSAY-001:5 models23 runs138 prefixes115 advancing23 terminal;23/328 tests/build historical. A direct positive revises mistaken testimony while B retains negative hearsay. DirectPriority versus LatestEvidence share exact history; simultaneous tie explicitly favors report for latest. False direct display keeps priority wrong. Goal-only changes appraisal, not evidence; later hidden/private/nonrecipient views equal. No joint social integration or global reputation.', 'docs/planning/HEARSAY_IMPLEMENTATION_FINDINGS.md': 'Automatic relay is not chosen speech/deception. Repeated visible speaker/ticket yields new reception but no retained duplicate, including after newer tickets; denied recipient may later receive it. New tickets not independent proof. DirectPriority not universally superior; direct display fallible. No initial failed construction cohort; source trust/correlation and natural recognition remain open.', 'docs/planning/HEARSAY_PUBLIC_PLAN_REV1.json': 'Prospective23 unique original runs/five models, frozen ExperimentIdentity/ComparisonCase and exact source/contract/test bindings. Empty initial state,32-byte seed13 and no draws. Keys are public message labels, not hidden provenance or truth certificates.', 'docs/planning/HEARSAY_PUBLIC_RESULT_REV1.json': 'Complete23-row138-prefix aggregate from four disjoint workers. Fresh stored decoding/original assertions check channel estimates, dedup/delayed reception, false direct evidence, goal intervention and whole later privacy;115 advancing23 terminal historical, not fresh scheduler replay.', 'docs/planning/HEARSAY_CLOSURE_REV1.json': 'Original closure freshly validates plan/result/model/source/allocation/worker hashes and historical23/328 tests/build. Records1195..1206 namespace1176;1206/0 historical. Integrity check does not rerun138 prefix restores or fault tests.', 'docs/planning/HEARSAY_TESTS_REV1.json': 'Historical23 PASS includes12 stages plus commit rollback, actual phases, duplicate/delayed reception and conflicting ticket rejection, authority/foreign evidence/malformed input/model/save/handle checks. Initial successful cohort, no new failed cohort; not fresh execution.', 'docs/planning/HEARSAY_REFERENCE_TESTS_REV1.json': 'Historical328 reference assertions passed. Titles/paths/timings backing to reviewed mechanisms, not new hearsay findings or fresh suite execution.', 'docs/planning/HEARSAY_BUILD_REV1.json': 'Historical final build PASS with exact source artifact bindings authenticated. Not fresh build or full active-suite claim.', 'docs/planning/hearsay-public-workers-rev1/0.json': 'Worker partition0: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh all23 stored-view contrasts preserve direct/testimony separation, same retained history across priority laws, visible-key dedup and later privacy. Not fresh138-prefix runtime replay.', 'docs/planning/hearsay-public-workers-rev1/1.json': 'Worker partition1: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh all23 stored-view contrasts preserve direct/testimony separation, same retained history across priority laws, visible-key dedup and later privacy. Not fresh138-prefix runtime replay.', 'docs/planning/hearsay-public-workers-rev1/2.json': 'Worker partition2: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh all23 stored-view contrasts preserve direct/testimony separation, same retained history across priority laws, visible-key dedup and later privacy. Not fresh138-prefix runtime replay.', 'docs/planning/hearsay-public-workers-rev1/3.json': 'Worker partition3: modulo4 membership, original identities, output/two observer-view hashes and aggregate authenticated. Fresh all23 stored-view contrasts preserve direct/testimony separation, same retained history across priority laws, visible-key dedup and later privacy. Not fresh138-prefix runtime replay.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'HEARSAY_CLOSURE_REV1.json'),ref('scripts/qualify-hearsay-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='HEARSAY AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'HEARSAY_PUBLIC_RESULT_REV1.json');plan=load(P/'HEARSAY_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'HEARSAY_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==23 and sum(r['prefixes'] for r in v['results'])==138
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('HEARSAY_TESTS_REV1.json',23),('HEARSAY_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'HEARSAY_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-011','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FOURTEEN HEARSAY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh23 stored-view contrasts, not23-run/138-prefix runtime replay or23/328 tests/build.','Visible speaker/ticket dedup is not hidden-source dependence detection or independent corroboration.','Automatic relay is not chosen speech; DirectPriority is fallible, not truth transfer or learned trust.','Separate profile coverage is not joint social integration or global reputation.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

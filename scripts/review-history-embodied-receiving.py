"""Whole-source receiving claim review with fresh behavioral replay and explicit inherited limits."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-receiving-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
specs={
 'docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.md':'Bounded reserve/safe interoception/pressure/adopted instruction/shared-choice closure, not general biology. Independent same-option grounds, duplicate coverage and instruction access are behaviorally distinct. Public singleton support and component three-basis aggregate remain separate. Inherited body76/EPACK and old task feedback require their own evidence review; this batch does not newly certify them.',
 'docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json':'Eighteen ER claim rows plus three parent EMB receiving rows map to fresh execution, association, replay, focused tests and fault substitutions. Original453 fingerprints preserved through exact current/archive bytes. Parent inherited body qualification and higher-level adequacy are separate, not established merely by this receipt PASS.',
 'docs/planning/embodied-receiving-execution-rev4/REVIEW.json':'Fresh28 public runs preserve196 exact canonical artifacts and all688 original assertions. Same-option221/256 versus either ground removed1/2; duplicate1/2 versus NoCoverage2/3. Hidden71/79 cognitive equality, fine/coarse35 access difference, five dice, three modes, no-options/no-active distinction, blocked execution terminal-only change, deadline and26-event ceiling. No learned efficacy, relief or body identity update.',
 'docs/planning/EMBODIED_RECEIVING_REPLAY_REV2.json':'Fresh86 complete prefixes across29 specimens/all13 frozen models restore and replay the entire remaining tail to equal final save/output/trace bytes. Includes extra work25 positive baseline specimen. Finite recorded set, not arbitrary admitted sequence coverage.',
 'docs/planning/EMBODIED_RECEIVING_MUTANTS_REV3.json':'Fresh twenty actual source substitutions are detected, with eight unchanged public controls and exact original receipt equality. Production rejection differs from canonical-output disagreement: reference-law expectations determine the intended winner. Fault sensitivity does not select a universal psychological law.',
 'docs/planning/EMBODIED_RECEIVING_COVERAGE_MUTANT_REV1.json':'Fresh genuine aggregate kernel on bases a,b,ab gives5/9 with final overlap1; pairwise-only substitute gives11/19 with overlap1/2. Three-description component control does not widen closed public instruction vocabulary.',
 'docs/planning/EMBODIED_RECEIVING_ASSOCIATION_REVIEW_REV1.json':'Fresh59 checks preserve pressure and original task candidate inputs while removal/rebinding changes instruction-origin association; initial/final adopted task/body context equal across28 runs; actual expression90 precedes execution110.',
 'docs/planning/EMBODIED_RECEIVING_PRESERVATION_REV1.json':'Historical composed1137 active tests/133 files replaces22 old receiving tests with27;328 reference tests are historical.436 unchanged cognitive references and10 changed references to3 helpers retain exact older identities. Separate body receiving entry extensions recovered by exact SHA reconstruction. No fresh full/reference suite claimed; new27 focused tests are separately recorded.',
 'docs/planning/EMBODIED_RECEIVING_TARGETED_TESTS_REV2.json':'Historical27 assertions in6 files: token/original/sibling authority,13 exact model admissions, prefix/restore tampering, concurrency/all-stage rollback/work ceiling,304 trace field corruptions, actual transforms and addressed RNG. Fresh same27 current tests pass; historical timing/absolute paths remain original metadata.',
 'docs/planning/embodied-receiving-execution-rev1/DISPOSITION.md':'All28 original cases wrote196 artifacts but whole review stopped at incorrect Auto expectation. Symmetric contest1 under strict contest<thetaRoll1 correctly selects PlayerFacingRoll; corrected admitted asymmetric context selects Auto. Preserve failed cohort as historical evidence, never qualified whole packet; no model/math change or seed selection.',
 'docs/formal/EMBODIED_RECEIVING_DEADLINE_ROUTE_CLARIFICATION.md':'No-learning excludes character-learning route, not existing prospective-control deadline route. Original deadline owner writes373/1 only; immutable instruction373/2 and new root487 have no new writer. Body455 physical ownership remains separate. Clarification repairs packaging prerequisite, adds no cognitive law or allocation.'
}
prior=load(P/'campaign3-history-source-roles-rev132/index.json');known={x['path'] for x in prior['roleAssignments']};assert not known.intersection(specs)
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
artifacts=[ref(p) for p in sorted([*O.glob('historical/**/*.ts'),*O.glob('reconstructed/**/*.ts'),*(P/'embodied-receiving-execution-rev1').glob('*/*.hex')])]
assert len(list((P/'embodied-receiving-execution-rev1').glob('*/*.hex')))==196
for a in artifacts:archives[a['sha256']]=a['path']
fresh=[]
for name in ['execution','replay','associations','coverage','mutants']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'];assert ref(r['checker']['path'])==r['checker'];fresh.append(ref(O/(name+'.json')))
assert load(O/'execution.json')['comparedArtifacts']==196
tests=load(O/'current-tests.json');assert tests['success'] and tests['numPassedTests']==27 and tests['numFailedTests']==0 and len(tests['testResults'])==6
auto=load(O/'auto-witness.json');assert auto['status']=='PASS' and [r['mode'] for r in auto['rows']]==['3','1']
fresh += [ref(O/'current-tests.json'),ref(O/'auto-witness.json'),ref('scripts/check-history-embodied-receiving-sources.py')]
q=load(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.json');assert len(q['rows'])==18 and [r['id'] for r in q['rows']]==['ER-'+chr(65+i) for i in range(18)]
execution=load(P/'embodied-receiving-execution-rev4/REVIEW.json');assert len(execution['runs'])==28 and execution['checked']==688
replay=load(P/'EMBODIED_RECEIVING_REPLAY_REV2.json');assert (replay['models'],replay['publicSpecimens'],replay['prefixes'])==(13,29,86)
mut=load(P/'EMBODIED_RECEIVING_MUTANTS_REV3.json');assert len(mut['results'])==20 and mut['unchangedPublicControlExecutions']==8
pres=load(P/'EMBODIED_RECEIVING_PRESERVATION_REV1.json');assert (pres['tests'],pres['files'],pres['receivingTests'],pres['unchangedCognitiveFingerprintReferences'])==(1137,133,27,436)
# Reproduce historical composition from historical receipts, not today's expanded test tree.
full=load(P/'EMBODIED_RECEIVING_FULL_TESTS_REV1.json');target=load(P/'EMBODIED_RECEIVING_TARGETED_TESTS_REV2.json');reference=load(P/'EMBODIED_RECEIVING_REFERENCE_TESTS_REV1.json')
assert all(x['success'] for x in [full,target,reference]) and full['numPassedTests']==1460 and reference['numPassedTests']==328
def relative(name):return name.replace('\\','/').split('/characterlab/',1)[1]
files={relative(r['name']):r for r in full['testResults'] if relative(r['name']).startswith('src/')}
assert sum(len(r['assertionResults']) for r in files.values())==1132
files.update({relative(r['name']):r for r in target['testResults']})
assert len(files)==133 and sum(len(r['assertionResults']) for r in files.values())==1137
assert all(a['status']=='passed' for r in files.values() for a in r['assertionResults'])
assert set(files)=={r['path'] for r in pres['currentTestFiles']}
bindings=[]
for p in specs:
 if not p.endswith('.json'):continue
 for a in fingerprints(load(p)):
  path=Path(a['path']);resolved=a['path'] if path.exists() and ref(path)['sha256']==a['sha256'] else archives.get(a['sha256'])
  assert resolved and ref(resolved)['sha256']==a['sha256'],a
  bindings.append(dict(source=p,originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
for a in pres['changedCognitiveFingerprintReferences']+pres['bodySourceExtensions']:
 resolved=a['path'] if ref(a['path'])['sha256']==a['currentSha256'] else archives.get(a['currentSha256'])
 assert resolved and ref(resolved)['sha256']==a['currentSha256']
 bindings.append(dict(source='docs/planning/EMBODIED_RECEIVING_PRESERVATION_REV1.json',originalPath=a['path'],sha256=a['currentSha256'],resolvedPath=resolved,role='historical successor hash, not necessarily current working bytes'))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BOUNDED RECEIVING BEHAVIOR / FAILURE / PRESERVATION',judgment=j,acceptanceChain=fresh))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/inherited','/reviewer')) or '/witness' in ptr or '/reason' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BOUNDED RECEIVING CLAIM SPINE RECONCILED; INHERITED BODY / MULTISOURCE AUDIT REMAINS',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=artifacts,bindings=bindings,obligations=['RO-C3-001','RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No general biology, heterogeneous same-fact receiving law, action-conditioned relief learning or body identity loop claimed.','The earlier body76/EPACK qualification, original helper-source predecessor scientific adequacy and later MULTISOURCE/GA remain separate audits. Exact bytes alone are not scientific authority.','Fresh27 focused tests and20 mutants; old1137 active/328 reference composition is historical, not a fresh full suite.','Three exact Git source recoveries and two SHA-verified reconstructions are distinct provenance mechanisms. Failed Auto cohort remains unqualified.','No production change, corpus promotion, obligation closure, new verdict or allocation. HQ011 and mandatory RO021 remain open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),preservedArtifacts=len(artifacts),freshRuns=28,freshPrefixes=86,freshTests=27,freshMutants=20,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

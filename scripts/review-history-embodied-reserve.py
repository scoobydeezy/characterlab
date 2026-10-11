"""Reconcile bounded reserve qualification without conflating component, public or historical scopes."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-reserve-rev1';B=P/'campaign3-history-universe-rev1'
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
 'docs/planning/CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.md':'Bounded reserve/current safe observation/support-only SEM/option-free pressure/external replenishment qualifies76 obligations in explicit component/public composition. Rate1/3, capacity sample, zero delivery and two valid bodies have component-positive/public-exclusion scope. Hidden host validation differs from character capability. No behavioral receiving or final Need ownership follows; later receiving closure is separate. Historical prefix wording means baseline-seven control; fresh49-prefix extension is separately dated.',
 'docs/planning/CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json':'All76 exact frozen obligation lines retained and cross-referenced with scoped witnesses/test groups; packaging acceptance inherited from separately reviewed corrected freeze. Public7 trajectories and fresh47 focused tests support stated composition, not public reachability of every component positive. Inherited shared PRJ/WRT tests remain their historical scoped evidence. Deferred EMB-M/O and parent closure labels describe then-state, not retirement of later receiving evidence.',
 'docs/planning/embodied-execution-rev3/REVIEW.json':'Fresh seven public trajectories reproduce independent preimplementation expectations:63 originals42 committed instants273 events and21 exact canonical output/trace/final-save artifacts. Six successful model recipes; hidden89 reuses baseline with distinct S0, work7 remains separate failure control. Source metadata is historical and explicitly reconciled to archives; current source identities separately retained, never aliased.',
 'docs/planning/CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json':'Independent fixture arithmetic precedes production: nine inputs, sample before tied delivery, rational depletion/saturation/bin pressure, branch-neutral ordinal budgets. Scale2 exactly represents these finite inputs including rate1/2; not a general numerical model. Unavailable expectations contain diagnostic reserve values that runtime must not read. Public replay checks branch-appropriate outputs, not character access to hidden oracle fields.',
 'docs/planning/EMBODIED_TARGETED_TESTS_REV2.json':'47 historical assertions in9 files; same47 fresh tests pass. Actual codecs, live capability/SEM binding, wrong body target, two-body and zero-delivery components, data-only factory, baseline-seven-prefix restore,45 rollback injections, work7, exact arithmetic and trace facts. Original full-suite list/set failure corrected here; not a fresh full-suite result.',
 'docs/planning/EMBODIED_REGRESSION_RECONCILIATION_REV2.json':'Historical1103 passed/1 failed broad run plus replacement of all9 EMB files yields1110 passed in127 files. Exact original failed test/messages retained: harness treated canonical state set as list, not production failure. Historical currentTestFiles means current at receipt creation. Fresh47 focused tests do not make this an independently rerun1110-test suite.',
 'docs/planning/EMBODIED_RUNTIME_MUTANTS_REV3.json':'Fresh12 real source substitutions reproduce same failures/output differences. Stored-current-level and lost-overflow differ canonically; unauthorized pressure read/read-then-redact reject ILLEGAL_READ. Allocation, occurrence reuse, padding, quantization, child/SEM binding and negative-debt paths reject. Output differences require retained law expectations; bounded fault sensitivity is not reduction or clinical adequacy.',
 'docs/planning/EMBODIED_ROLE_MUTANTS_REV1.json':'Fresh actual collection and state-map-key controls separate both role gates while recursive record-field VAL remains active. Intact rejects both; each mutation admits only its targeted bad structure. These are actual compiler/state components, not mutated public frozen model admissions.',
 'docs/planning/CAMPAIGN3_EMBODIED_IMPLEMENTATION_REVIEW_REV1.md':'Dated implementation-before-qualification review retains source459-versus458 and pressure PRJ field2-versusfield1 corrections. Distinct corrected cohort/RunIdentity, not alias. Earlier9-mutant and1072-test claims remain dated predecessors; later12-mutant/1110-composed qualification supplies closure. Explicit all-seven restore positions refers to baseline positions, not all-seven trajectories. Component exclusions and439 unchanged versus7 amended fingerprint occurrences preserved.'
}
prior=load(P/'campaign3-history-source-roles-rev133/index.json');known={x['path'] for x in prior['roleAssignments']};assert not known.intersection(specs)
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
ex=load(O/'execution.json');assert ex['status']=='PASS' and len(ex['results'])==7 and len(ex['artifacts'])==21
assert sum(x['checkedOriginals'] for x in ex['results'])==63 and sum(x['checkedBoundaries'] for x in ex['results'])==42 and sum(x['events'] for x in ex['results'])==273
for x in [ex['original'],ex['checker'],*ex['artifacts'],*ex['currentSources']]:assert ref(x['path'])==x
for name in ['runtime-mutants','role-mutants']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'];assert ref(r['checker']['path'])==r['checker']
 for a in r['currentSources']:assert ref(a['path'])==a
tests=load(O/'current-tests.json');assert tests['success'] and tests['numPassedTests']==47 and tests['numFailedTests']==0 and len(tests['testResults'])==9
prefix=load(O/'prefixes.json');assert prefix['status']=='PASS' and prefix['prefixes']==49 and prefix['trajectories']==7 and len(prefix['rows'])==49
assert all(r['result']=='PASS' and r['successors']==6-r['index'] for r in prefix['rows'])
for a in prefix['sources']:assert ref(a['path'])==a
original=load(P/'CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json');assert len(original['rows'])==76 and len({r['id'] for r in original['rows']})==76
for r in original['rows']:assert r['obligation'] in Path(r['source']).read_text(encoding='utf-8-sig')
assert len(load(P/'EMBODIED_RUNTIME_MUTANTS_REV1.json')['results'])==9 and len(load(P/'EMBODIED_RUNTIME_MUTANTS_REV3.json')['results'])==12
roles=load(P/'EMBODIED_ROLE_MUTANTS_REV1.json')['results'];assert [(r['collectionAccepted'],r['keyAccepted']) for r in roles]==[(False,False),(True,False),(False,True)]
reg=load(P/'EMBODIED_REGRESSION_RECONCILIATION_REV2.json');full=load(reg['full']['path']);target=load(reg['targeted']['path'])
assert (full['numPassedTests'],full['numFailedTests'])==(1103,1) and target['success'] and target['numPassedTests']==47
def relative(p):return p.replace('\\','/').split('/characterlab/',1)[1]
files={relative(r['name']):r for r in full['testResults']};files.update({relative(r['name']):r for r in target['testResults']})
assert len(files)==reg['files']==127 and sum(len(r['assertionResults']) for r in files.values())==reg['tests']==1110
assert all(a['status']=='passed' for r in files.values() for a in r['assertionResults'])
assert set(files)=={a['path'] for a in reg['currentTestFiles']}
failed=[dict(file=relative(r['name']),test=a['fullName'],originalFailure=a['failureMessages']) for r in full['testResults'] for a in r['assertionResults'] if a['status']=='failed'];assert failed==reg['corrected'] and 'requires list' in failed[0]['originalFailure'][0]
fresh=[ref(O/n) for n in ['execution.json','current-tests.json','prefixes.json','prefix-scope-finding.json','runtime-mutants.json','role-mutants.json']]+[ref(P/'campaign3-history-embodied-freeze-rev1/review.json')]
bindings=[]
for p in specs:
 if not p.endswith('.json'):continue
 for a in fingerprints(load(p)):
  path=Path(a['path']);resolved=a['path'] if path.exists() and ref(path)['sha256']==a['sha256'] else archives.get(a['sha256'])
  assert resolved and ref(resolved)['sha256']==a['sha256'],a
  bindings.append(dict(source=p,originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sourceRoles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sourceRoles.append(dict(**ref(p),role='BOUNDED RESERVE BEHAVIOR / FAILURE / COMPONENT SCOPE',judgment=j,acceptanceChain=fresh))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/reviewer','/limitation','/deferred')) or '/witness' in ptr or '/obligation' in ptr or '/originalFailure' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BOUNDED RESERVE CLAIMS RECONCILED; HISTORICAL PREFIX SCOPE CORRECTED FORWARD; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Historical baseline seven-prefix restore differs from fresh49-prefix seven-trajectory replay. Work7 remains separately rejected rollback control.','Capacity sample, zero refill, rational-thirds and two qualified bodies retain explicit component scope; no new public positive or ordinary multi-observer admission.','Trusted trace/state validation can inspect truth; character-side source/pressure capabilities remain bounded. No inference of universal biology/Need law.','Earlier9-mutant and1072-test predecessor claims remain historical. Exact source hashes and PASS counts do not replace scientific evidence.','Fresh47 tests/7 trajectories/49prefixes/12 runtime plus2 role mutations; historical1110-test composed result is not a fresh full suite.','Formal intake/shape and earlier construction history continue separately; no allocation/verdict/corpus/obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),freshRuns=7,freshPrefixes=49,freshTests=47,freshRuntimeMutants=12,freshRoleMutants=2,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

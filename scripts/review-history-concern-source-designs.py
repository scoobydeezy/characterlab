"""Reconcile concern source designs and historical receipts without rerunning writers."""
from pathlib import Path
import json, hashlib, collections, subprocess
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-concern-source-designs-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev193/index.json'; ix=load(ip)
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
notes={
'ATTENTION_CONCERN_SOURCE_REVIEW_REV2.md':'Draft source direction, not accepted runtime. Capacity2 admits one task plus gated forecast; capacity1 cannot donate a forecast slot. Actual permitted probe/M1/prediction140 precedes later workspace; preactivation probe avoids fulfilling the known-zero task. Preserve all measurement/prediction/task descendants and deadline. Terminal-at-concern requires a governed successor, not truncation of frozen whole-choice adapter. Illustrative0/1/2..9/20 schedule is superseded by actual positive-time reconciliation. Capacity, access denial and absent prior are distinct unavailable sources; no task is not known zero. Expected0/5/10 intensities are proposed arithmetic, not recorded GA outcomes. Receiver ablation must preserve source bytes. Three local cognitive events exclude upstream work and deliveries from that subtotal.',
'ATTENTION_ENCODING_SOURCE_DESIGN_REV1.md':'Draft eight-sweep source proposed independently missing role/glyph/position, false tracking and observer-safe selected spatial witnesses. Later admitted scene grammar requires glyph/position: those missing-facet cases remain component controls, not materialized public models. Governed objects are not perceived identities; no authored salience/concern/memory key. Preselection divisor fixed; Unknown not zero or implicit role fallback. New envelope required, not widened534/541. Need/surprise disabled is restricted comparison; historical Incidental/Cause/category/realized Need/surprise remain separately owed. Proposed12 encoded graph nodes and eight sweeps are draft bounds, not final ten-sweep profile. Cue query zeros mean no injection, not evidence of absence; beta0 retains source/history.',
'ATTENTION_DELAYED_CONCERN_DESIGN_REV1.md':'Historical draft of same-run actual concern carriage; narrow existing occurrence/producer time/subject/response, no nested forecast or private archive. No selected task emits no invented response occurrence; multiple concerns not aggregated. Candidate A P*(1-q),omegaA1+q retained, not universal affect law; later OD002 independent arms and fixture-relative ceiling govern intended candidate. Known0 and unavailable numerically equal baseline but distinct source status. Pure authored appraisal is not public source proof. Source identity, actual parents, strict later time, rollback and complete prefix gates separately required.',
'ATTENTION_FEEDBACK_JOIN_REVIEW_REV1.md':'Historical ordering correction: scene and earlier concern are distinct causal parents. No hidden closure cache or invented phase39. Delivery15 before actual join40; explicit PRJ subject comparison precedes content reads. Missing expected delivery is admission failure, not delivered Unavailable. Receiver ablation keeps graph and source. Rollback includes associations/consumption; successful saves have no half-join and restore via exact original-prefix queue equality. Encoding allocation only, not eligibility/K or capacity narrowing. Later REV2 resolves selected-parent and target-original details; old prose is not whole public acceptance.',
'ATTENTION_FEEDBACK_JOIN_BINDING_REV2.md':'Settled target-original plus due-time association and actual two-parent algorithm, not public qualification by itself. Generic scheduler accepts allocated future parents and opaque Dependencies; trusted adapter must prove completed delivery/output equality, exact target, one-use and subject before reads. One distinct delivery per receiver; no new occurrence namespace or public authored carry. Transactional consumption and no unresolved join at commit; exact replay queue required. Preselection count preserved, selection unchanged, encoding and retrieval separate. AJB-A..M frozen here, not passed by JXP fixtures. Later bounded GA evidence controls only its executed scope.',
'ATTENTION_JOIN_SCHEDULER_VECTORS.md':'Seven fixture vectors use actual scheduler/test namespace10030, not TaskConcern or production identity. Allocated future additional parent and opaque Dependencies accepted as intended substrate behavior, not scheduler defects. Explicit completion guard, phase15 before40, exact payload and second-parent checks are adapter obligations. D..G whole receiving instant rollback covers fixture state/outputs/allocators/queue, not public subject or same-run source qualification. Four recorded substitutions target fixture adapter, not production feedback.',
'GA_PRIOR_CONCERN_SOURCE_RECONCILIATION_REV1.md':'Three final public frozen workspace-two tests constrain successor, not GA join qualification. Probe1/prediction140/cognition2; D=-50 gives mean0 and2/5 concern. D0 must be absent displacement, and mean5 fulfills already-active tasks: no-task rather than known-zero concern. D50 mean10 commits before later whole-choice ADAPTATION_REFERENCE_OUT_OF_RANGE rollback; transient concern from failed instant cannot be exported. Original baseline two-task rejection remains correct. Corrected source activates task after warmup and uses terminal-at-concern successor; R0=50 with D offsets is explicit new source recipe, not old bytes. Missing glyph/position excluded from public first profile, not secretly repaired.',
'GA_PRIOR_FEEDBACK_CARRIER_REV1.md':'Symbolic actual concern or no-task carry, generated exact-target delivery, same-run completed parent/output/subject/strict-time checks even when disabled. Observer equality before PRJ, selected-only encoding and actual visual cue recall; no nested forecast or durable child feedback copy. Trace-only provenance and read-only ranking precede separate presentation. Exact1-q/1+q is Candidate A, not final affect law or body-recall law. Known zero remains known; no later goal assessment becomes prior concern. Shape/registration/save remained open at this receipt.',
'GENERAL_ATTENTION_CONCERN_STATE_DECISION.md':'Historical owner choice resolved by maintenance-goal A acceptance. Active prospective commitment differs from durable preference B after withdrawal; satisfaction does not retire maintenance. Existing one-shot measurement task cannot be relabeled or widened. Identical bodies can have different goals; committed old assessments survive new goal state. State-source approval does not accept boundary-only numeric law, credit or survival composition. Durable preference remains explicit later comparator, not rejected ontology.',
'CONCERN_STATE_AND_ASSESSMENT_DRAFT_REV1.md':'Unaccepted boundary-only proposal preserved with its reduction: Outside->Outside misses worsening/continued severe failure, improvement and defining events. Ambiguous->Unavailable was this draft, not later accepted Assessed/Indeterminate distance relation. Owner maintenance-goal decision separate from metric law. Initial adopted goal is authored premise, not learned preference/autonomous adoption/development. Transient TaskConcern is not persistent concern goal or significance. Immutable consequence-time basis, attribution independent of assessment, extant exact child target and fixed-use controls remain. Arithmetic examples/proposed CS vectors are not executed public witnesses. Later metric-only exact distance retains independent endpoint/boundary dimensions, no universal importance score.',
'CONCERN_SIGNIFICANCE_SOURCE_COMPOSITION_CHECKPOINT.md':'Controlled continuous reserve/safe sample/SEM/memory/recall/context/attribution/goal/credit/retention composition. REV5 removes REV4 schedule-pairing shortcut by resolving returned grouped experience IDs to unique retained views; permutation witness added. Body-recall limit cannot be bypassed by stored source values. Three wiring mutations are fixture substitutions, not public admission proof. Roles/perception/selected inputs, JSON child codec, event reads, focal designation and newer-use comparator are trusted premises. Historical qualification is local value, not immutable scheduler delivery/save proof. Earlier formation before credits does not prove future metadata preservation. Distinguish independent recall, attribution, significance and retention.'
}
notes={(P/k).as_posix():v for k,v in notes.items()}
tests=[]; faults=[]; bindings=[]; unresolved=[]; search=[]
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
patterns=['ATTENTION_JOIN_SCHEDULER_*.json','CONCERN_SIGNIFICANCE_SOURCE_COMPOSITION_*.json','GA_PRIOR_CONCERN_PUBLIC_SOURCE_TESTS_*.json']
jsonpaths=[p for pattern in patterns for p in sorted(P.glob(pattern))]
assert len(jsonpaths)==12
for p in jsonpaths:
 v=load(p)
 if 'testResults' in v:
  assertions=[a for suite in v['testResults'] for a in suite['assertionResults']]
  assert len(assertions)==v['numTotalTests']
  assert sum(a['status']=='passed' for a in assertions)==v['numPassedTests']
  assert sum(a['status']=='failed' for a in assertions)==v['numFailedTests']
  tests.append(dict(**ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],failed=v['numFailedTests'],success=v['success'],assertions=assertions))
  if p.name.startswith('GA_PRIOR'):
   n=int(p.stem[-1]);assert (v['numPassedTests'],v['numFailedTests'])==[(0,3),(1,2),(3,0)][n-1]
   notes[p.as_posix()]=['Rejected development cohort: two-task projection, explicit zero displacement and unhandled later REG range failure. Exact failure stacks retained; no successful GA source claim.','Partially passing development cohort: lower source passes; no-task shape access fails missing field2, upper branch assertion expected wrong public code. Correcting these does not make an in-range fulfilled task a known-zero concern.','Three public frozen-model tests pass their bounded expectations, including no selected task and whole-instant failure rollback. Not three successful feedback trajectories; final GA delivery and new terminal adapter separate.'][n-1]
  elif p.name.startswith('ATTENTION_JOIN'):
   assert (v['numPassedTests'],v['numFailedTests'])==(7,0)
   notes[p.as_posix()]='Seven historical JXP assertions pass actual scheduler fixture graph and adapter guards, including intentional acceptance of allocated future parents. No production concern/source/save qualification and no new execution.'
  else:
   n=int(p.stem[-1]);assert (v['numPassedTests'],v['numFailedTests'])==([3,4,4,4,5][n-1],0)
   notes[p.as_posix()]='Historical passing composition cohort; revisions1..4 cannot inherit REV5 correction of schedule-derived addresses or its permutation assertion. REV5 has five component tests, not public source qualification. These test reports have no source fingerprint manifest of their own; named later reviews bind only their explicitly fingerprinted scope.'
 else:
  for f in v['faults']:
   assert f['detected'];faults.append(dict(owner=p.as_posix(),**f))
  notes[p.as_posix()]='Historical fixture mutation receipt with exact sources and baseline. Detected substitutions concern guard/wiring sensitivity, not general public noninterference. No old writer rerun. Unrecovered historical source identity, if any, remains explicitly open; current changed code cannot stand in for it.'
  for s in v['sources']+[v.get('testEvidence',v.get('baseline'))]+([v['preserved']] if 'preserved' in v else []):
   actual=s['path'] if ref(s['path'])==s else archives.get(s['sha256'])
   if actual:
    assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(owner=p.as_posix(),original=s,actual=ref(actual)))
   else: unresolved.append(dict(owner=p.as_posix(),**s))
assert len(tests)==9 and len(faults)==10 and len(unresolved)==2
assert {x['path'] for x in unresolved}=={'src/test/concernSignificanceSourceComposition.test.ts'}
target=unresolved[0]['path'];commits=subprocess.check_output(['git','log','--all','--format=%H','--',target],text=True).splitlines()
for commit in commits:
 r=subprocess.run(['git','show',commit+':'+target],capture_output=True)
 if r.returncode: search.append(dict(commit=commit,path=target,missing=True));continue
 raw=r.stdout;lf=raw.replace(b'\r\n',b'\n')
 for mode,data in [('raw',raw),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]:
  h=hashlib.sha256(data).hexdigest();assert h not in {x['sha256'] for x in unresolved}
  search.append(dict(commit=commit,path=target,normalization=mode,sha256=h))
quiescent=P/'public-wrapper-quiescence-rev1'/target
raw=quiescent.read_bytes();lf=raw.replace(b'\r\n',b'\n')
for mode,data in [('raw',raw),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]:
 h=hashlib.sha256(data).hexdigest();assert h not in {x['sha256'] for x in unresolved}
 search.append(dict(path=quiescent.as_posix(),normalization=mode,sha256=h))
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def narrative(pointer):
 return pointer.split('/')[1] in ['status','limits'] or any(x in pointer for x in ['/fullName','/title','/ancestorTitles','/failureMessages','/message','/failedWitnesses'])
leaves=[dict(source=p.as_posix(),pointer=q,text=s,role='NARRATIVE' if narrative(q) else 'BACKING') for p in jsonpaths for q,s in walk(load(p))]
chain=[ref(P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),ref(P/'GENERAL_ATTENTION_MAINTENANCE_GOAL_RESOLUTION.md'),ref(P/'GENERAL_ATTENTION_GOAL_RELATION_RESOLUTION.md'),ref(P/'CAMPAIGN3_PENDING_OWNER_DECISIONS.md'),ref(P/'campaign3-history-spatial-concern-contracts-rev1/review.json')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256'],p
 sources.append(dict(**ref(p),role='HISTORICAL CONCERN SOURCE DESIGN/RECEIPT WITH EXPLICIT SUCCESSOR SCOPE',judgment=n,acceptanceChain=chain))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  category='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[category]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=notes[u['source']]))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All JSON string leaves including short status/identity/version/labels. Original occurrence IDs are separately retained; fields not extracted by the original prose threshold remain schema backing.'))
save('unresolved.json',dict(status='TWO HISTORICAL COMPOSITION TEST SOURCE IDENTITIES UNRECOVERED',entries=unresolved,search=search,scope='Current bytes,indexed archives,reachable exact-path Git raw/LF/CRLF and named quiescence copy; not unreachable objects,renamed paths or global absence.',disposition='RO-C3-021 remains unsatisfied. Preserve old mutation assertions as historical reports with missing exact test bodies; no replacement of those identities by current code. Independent adequacy must resolve or explicitly dispose the claim gap before HQ012.'))
save('review.json',dict(status='23 CONCERN SOURCE DESIGNS/RECEIPTS RECONCILED; EXACT HISTORICAL SOURCE GAPS OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,recordedTests=tests,recordedFaults=faults,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),preservedArtifacts=[],limits=['Eleven MD sources and twelve JSON receipts; nine historical test cohorts, three mutation receipts. Counts are not independent scientific phenomena.','No runtime,mutant,build,old writer,model,allocation,verdict,corpus or obligation status changed. Test-only fixture mutations do not prove public authentication.','Two old composition test identities add to existing source gaps. Test reports without source manifests are not retroactively attributed to changed current tests.','Historical no-task and failed-instant branches remain successful assertions of limits, not successful known-zero or committed upper concern sources.'],obligations=['RO-C3-002','RO-C3-003','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECONCILIATION; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(unresolved),recordedTestCohorts=len(tests),recordedFaults=len(faults),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

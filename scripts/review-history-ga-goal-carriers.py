"""Preserve GA goal-carrier revisions and distinguish projection from authentication."""
from pathlib import Path
from collections import Counter
import json,hashlib,copy
P=Path('docs/planning');O=P/'campaign3-history-ga-goal-carriers-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fps(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fps(x)
 elif isinstance(v,list):
  for x in v:yield from fps(x)
specs={}
def add(names,judgment):
 for n in names:specs[n]=judgment
add(['docs/planning/GA_GOAL_AND_RESULT_IDENTITY_REVIEW_REV1.md'],
 'Symbolic identity precedent, not allocation: maintenance goal key uses qualified character and declared goal-instance referent, separate from immutable definition and task fulfillment. Satisfaction never retires maintenance; same-key adoption is once-only. Assessment and attribution each need their own occurrence family; existing TaskAppraisal1129 and OutcomeEvaluation1116 cannot be repurposed by name. No qualification/use/target/motion identity. Exact-expiry reads excluded from the first profile, not solved by projected state or a new phase. Missing deadline must fail complete-prefix admission. Withdrawn expiry is no-op; public lifecycle and broader recurring adoption remain separate evidence.')
add(['docs/planning/GA_GOAL_RESULT_CARRIER_REV1.md','docs/planning/GA_GOAL_RESULT_CARRIER_REV1.json','docs/planning/GA_GOAL_RESULT_CARRIER_REVIEW_REV1.json'],
 'Initial 20-record/61-field symbolic grammar reconstructed exactly and 12 original structural mutants reproduced. Goal ledger has immutable spec references, terminal status and once-only keys, not a second desired-range/baseline state. Full numerical assessment is trace-only; delayed qualification and significance join exclude its reachable basis. Consumed child set is actual semantic use, including partial unavailable results; focal supported target is one consumed surviving event child, never body by ordering coincidence. Address and view ordinal are not new identities. Structural shape/reachability does not prove source authority, target survival or public persistence. ExactInterval and OriginalAddress bindings were still unresolved at this revision.')
add(['docs/planning/GA_GOAL_RESULT_BINDING_REV2.md','docs/planning/GA_GOAL_RESULT_CARRIER_REV2.json','docs/planning/GA_GOAL_RESULT_CARRIER_REVIEW_REV2.json'],
 'REV2 adds GoalClosedInterval and substitutes it for three ExactInterval references; OriginalAddress becomes the existing unsigned ordered-input index. Exact 21-record/63-field inventory reconstructed, 12 original structural mutants reproduced. A fresh current witness rejects zero-width physical record462 but accepts a point goal interval; similar fields do not imply equivalent domains. Decoder462 still requires positive width. Ordered-input compiler uses zero-based eventId/eventSequence and exact serialization/source authority, so unsigned shape alone cannot authenticate an original. No old record semantics, namespace or public qualification changed.')
add(['docs/planning/GA_GOAL_RESULT_CARRIER_REV3.json'],
 'REV3 preserves all REV2 records except GoalQualificationDelivery: Carry becomes optional and SourceAt is added. Completed absence is distinct from a real unavailable assessment and missing delivery. Verified exact structural delta plus the prior stage-history REV2 checks; do not claim the REV2 carrier reviewer accepts optional grammar or that public absence executed in this symbolic packet. SourceAt is actual source time, strictly before due time; no synthetic assessment identity or new cognitive state.')
add(['docs/planning/GA_QUALIFICATION_CARRY_PROJECTION_REV2.md','docs/formal/GOAL_QUALIFICATION_PROJECTION_COMPONENT.md'],
 'Narrow qualification projection corrects ambiguous exact-safe-result wording: range, side and distance could reconstruct an earlier sample despite no RawSample field. Trusted projection yields fresh frozen direction/reason/cause only, no assessment, state, identity or callback. Two different numerical bases have equal projected direction; all five absence causes survive. Exact actual assessment, subject/consequence/target/time and transactional delivery authentication belong to the outer adapter. Carry cannot recover forgotten payloads or rescue a lost target. QP-A..G were frozen public obligations, not passed by this component or trusted scheduler tuple. Current 11 projection/qualification/handoff assertions and four detected mutants support that narrower boundary.')
add(['docs/formal/GOAL_OUTCOME_QUALIFICATION_COMPONENT.md'],
 'Both determinate directions qualify independently of magnitude, count or valence; deterioration-only remains a separately named policy excluding progress. SameDistance including side crossing, indeterminate relation and unavailable evidence stay distinct. Full assessment basis retains positions/boundary and provenance; projection is a later operation. Actual supported attribution and surviving target remain required for credit. Fresh GQ-A..D and GQP-A..C execute these component distinctions without new memory authority or a general significance law.')
add(['docs/planning/GA_GOAL_RESULT_CLOSURE_CHECKPOINT.md'],
 'Historical field-closure checkpoint reports 21 records/63 fields, 12 structural faults, 19 component assertions and four projection mutants, all preserved by exact inventory/reviewer reconstruction and fresh 42-test successor run containing all 19 named assertions. Current composition file adds 23 controls and retains supplied-use versus actual-use modes; it is not the original whole module. Trusted scheduler handoff crosses withdrawal, rolls back producer/receiver failure, resumes trusted snapshots and cannot recreate lost target. Public QP/HJ and full canonical/save/registration acceptance were not proved. No fresh typecheck claim; original TypeScript-pass prose remains historical.')
add(['docs/planning/GOAL_QUALIFICATION_PROJECTION_REVIEW_REV1.json'],
 'All four original source mutations freshly detected by their named GQP witnesses using unchanged exact qualification source and test bytes: copied numerical assessment, erased deterioration, collapsed absence and indeterminate-as-no-change. Each intentional mutant run has six passing/one failing assertion; retained failure reports are expected controls, not production regressions. Original whole result receipt including source commitments reproduced. This is projection coverage, not producer/delivery authenticity.')
add(['docs/planning/GOAL_QUALIFICATION_PROJECTION_TESTS_REV1.json'],
 'Historical 19-passing-test receipt: seven qualification/projection, four scheduler handoff and eight source-composition assertions. Complete closed Vitest schema inspected, including all short strings; every named assertion is in the fresh 42 passing tests (7/4/31). Current composition has evolved; matching names are retained vectors, not proof of original loaded dependency identity or full canonical public admission. Scheduler tuple and trusted snapshot restore remain narrower than public Save132/complete-prefix validation.')
assert len(specs)==14
prior=load(P/'campaign3-history-source-roles-rev150/index.json');assert not set(specs)&{r['path'] for r in prior['roleAssignments']}
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']};recovery=load(O/'source-recovery.json');assert len(recovery['found'])==1 and recovery['unavailable']==[]
old=recovery['found'][0];assert ref(old['resolvedPath'])['sha256']==old['sha256'];archives[old['sha256']]=old['resolvedPath']
source=Path(old['path']).read_text();marker='/** maintenance-goal-deadline-component/0.1-candidate; actual scheduled deadline authentication upstream. */'
assert source.count(marker)==1 and source.split(marker)[0].encode()==Path(old['resolvedPath']).read_bytes()
chain=[]
for name in ['builder-1','builder-2','carrier-review-1','carrier-review-2','projection-faults','interval-witness']:
 p=O/(name+'.json');v=load(p);assert v['status'].startswith('PASS')
 for f in fps(v):assert ref(f['path'])==f
 chain.append(ref(p))
for rev,records,fields in [(1,20,61),(2,21,63)]:
 v=load(O/f'carrier-review-{rev}.json');assert len(v['faults'])==12 and (v['records'],v['fields'])==(records,fields)
 assert v['faults']==load(P/f'GA_GOAL_RESULT_CARRIER_REVIEW_REV{rev}.json')['faults']
v2=load(P/'GA_GOAL_RESULT_CARRIER_REV2.json');v3=load(P/'GA_GOAL_RESULT_CARRIER_REV3.json');expected=copy.deepcopy(v2['records']);delivery=next(r for r in expected if r['name']=='GoalQualificationDelivery');delivery['fields'][2]['type']={'kind':'optional','value':{'kind':'ref','name':'GoalQualificationCarry'}};delivery['fields'].append({'name':'SourceAt','type':{'kind':'ref','name':'Instant'}});assert expected==v3['records']
for k in ['external','storage','traceOnly','delayedCharacterProjection','invariants','status']:assert v2[k]==v3[k]
def tests(p,total,failed=0):
 v=load(p);assert v['success']==(failed==0) and v['numPassedTests']==total-failed and v['numTotalTests']==total and v['numFailedTests']==failed and v['numPendingTests']==v['numTodoTests']==0
 assert set(v)=={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'} and not any(v['snapshot'].values())
 out=Counter();failures=[]
 for t in v['testResults']:
  assert set(t)=={'assertionResults','endTime','message','name','startTime','status'}
  if failed==0:assert t['status']=='passed' and t['message']==''
  for a in t['assertionResults']:
   assert set(a)=={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'} and a['meta']=={}
   if a['status']=='passed':assert a['failureMessages']==[]
   else:assert a['status']=='failed' and a['failureMessages'];failures.append(a['fullName'])
   out[(t['name'].replace('\\','/').split('/characterlab/',1)[1],a['fullName'])]+=1
 assert out.total()==total and len(failures)==failed;return out,failures
fresh,_=tests(O/'current-tests.json',42);historical,_=tests(P/'GOAL_QUALIFICATION_PROJECTION_TESTS_REV1.json',19);assert historical<=fresh
for name,witness in [('copy-numeric-assessment','GQP-A'),('erase-deterioration','GQP-A'),('collapse-absence','GQP-C'),('indeterminate-is-no-change','GQP-B')]:
 _,failed=tests(O/f'fault-{name}.json',7,1);assert witness in failed[0]
chain += [ref(O/n) for n in ['current-tests.json','source-recovery.json']]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GA GOAL CARRIER / QUALIFICATION PROJECTION HISTORY',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256']);assert target and ref(target)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/external/','/invariants/','/limits/')) or ptr in ['/status','/absence']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA GOAL CARRIER HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[dict(path=old['resolvedPath'],sha256=old['sha256'],method=old['method'],originalPath=old['path'])],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['24 structural fault executions, four projection mutants, 42 current assertions and one interval distinction witness; not new public qualification.','Exact older maintenance-goal source reconstructed by removing its separately versioned deadline extension; not Git recovery or chronology proof.','All19 historical test names retained; current source-composition implementation differs. Supplied later use, actual-read use and scheduler trusted tuple premises remain explicit.','REV3 optional absence is a symbolic successor, not claimed accepted by REV2 carrier checker. Full registration/codec/identity inventory and final history adequacy remain open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshStructuralFaults=24,freshProjectionMutants=4,freshTests=42,historicalSubsetAssertions=19,intervalWitnesses=1,recoveredArtifacts=1,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

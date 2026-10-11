"""Whole historical attributed authority and independent consequence/credit audit."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-attributed-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
specs['docs/formal/ATTRIBUTED_PUBLIC_CONTRACT.md']='Accepted attributed-public0.1: one proposition, A/B/C own histories and keyed observer-target person models. Latest/Majority/NoPersonModel versus explicit PrivateStateOracle; normal/forced/balanced relevance controls. Source reports are fallible semantic claims, not target state or exposure/comprehension.21 actual phases, own learning30 then probe40, receipt120/learning140; intent70/expression80 separate.'
add('ATTRIBUTED_KNOWLEDGE_READINESS.md','Prospective finite-depth attribution with actual communicative consumer; own belief, target belief and attributed target belief must differ. Requires held-fixed B actual state, safe-view noninterference, false attribution, correction, observer disagreement and serious alternatives. No recursive general mentalizing or factive knowledge authority.')
add('CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md','VER-C3-ATTRIBUTED-001:6 models30 public runs120 prefixes freshly reproduced. A can falsely defer then explain while C disagrees; corrected report-only contrast disables delivery in both arms to hold actual B fixed. Oracle violates hidden-target boundary; Latest/Majority retain distinct behavior. No natural intention recognition, learned trust, deeper nesting or universal relevance law.')
add('ATTRIBUTED_PUBLIC_PLAN_REV1.json','Whole original six-model30 distinct RunIdentity/ExperimentIdentity/ComparisonCase plan freshly reconstructed with exact source/empty initial state/originals/seed13. Law1 normal/forced/balanced plus laws2/3/4 normal; no seed search or refreeze.')
add('ATTRIBUTED_PUBLIC_RESULT_REV1.json','Whole fresh native result matches original:30 runs120 original-prefix restores90 advancing30 terminal. Complete worker outputs and all three holder views independently match frozen bytes; one next successor, not all tails. Independent decoded360 updates270 probes90 contexts90 intent assertions verify accumulation/projection separately from dice.')
add('ATTRIBUTED_CLOSURE_REV1.json','Original read-only closure authenticates complete roster, worker partition/views/output hashes, frozen models/allocations, development artifacts and historical34/328 validation. No new public producer, allocation or comparison-law retirement.')
add('ATTRIBUTED_DEVELOPMENT_FINDINGS.md','Preserved construction failures: initial duplicate local before writes; stale1083 references; partial freeze max1 read-domain rejects declared two-read Oracle; generic record-reader typing.34 tests passed before compiler/source review correction. Stronger fixed-target comparison added before public qualification; earlier current-probe equality did not hold complete B state fixed.')
add('ATTRIBUTED_DEVELOPMENT_PRESERVATION_REV1.json','Twenty-nine exact archives preserve copied sources, incomplete model files and later fixture/math/test cohort. Partial five-model files are not a FREEZE or public plan. Original allocation differs only max1->2 for already-contracted Oracle read domain. No psychological candidate rejected by construction failures.')
add('attributed-development-rev1/allocation-before-read-bound.json','Superseded exact allocation with stage read-list maximum1. Current allocation changes only records[13].fields[2].type.max to2 for declared Oracle; lawful one-holder read domains unchanged. This is a construction correction, not a new epistemic authority granted by implementation.')
add('ATTRIBUTED_TESTS_REV1.json','Historical34 passed pre-strengthening conformance assertions. Passing tests did not establish held-fixed B entire state or TypeScript compilation. Preserve weaker test, then source/fixture refinement; not another independent final qualification.')
add('ATTRIBUTED_TESTS_REV2.json','Historical34 passed corrected conformance assertions,21 stage+commit faults, contested faults, actual phases, holder authority/strict sources/forged originals and saves. Reports-to-choice pair now has delivery disabled in both arms. Authenticated not freshly rerun.')
add('ATTRIBUTED_REFERENCE_TESTS_REV1.json','Historical328 passing reference assertion leaves; authenticated not freshly rerun.')
add('ATTRIBUTED_BUILD_REV1.json','Historical FAIL TS2345 generic CanonicalValue passed to field reader in math/test helper; archived source confirms missing narrowing. Not a behavior, model-law or scheduler failure.')
add('ATTRIBUTED_BUILD_REV2.json','Historical PASS command/includes/date receipt for boundary/TypeScript/Vite; not raw log or fresh build. Corrected source and frozen artifact hashes remain exact.')
for i in range(4):add(f'attributed-public-workers-rev1/{i}.json',f'Original worker{i} partition freshly reproduced in full including canonical outputs and all holder views; exact disjoint30-run aggregate. Typed hex payloads are authenticated executable backing, not independent prose findings; decoded learning audit separately checks observed own/report histories and projections.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev126/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']+[f'worker-{i}' for i in range(4)]:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-attributed.mjs')['sha256']==r['checkerSha256']
learning=load(O/'learning.json');assert learning['status']=='PASS' and (learning['updates'],learning['probes'],learning['contexts'],learning['intents'])==(360,270,90,90)
for a in learning['sources']+learning['artifacts']+[learning['checker']]:assert ref(a['path'])['sha256']==a['sha256']
output=subprocess.check_output(['node','scripts/check-attributed-closure.mjs'],text=True).strip()
plan=load(P/'ATTRIBUTED_PUBLIC_PLAN_REV1.json');result=load(P/'ATTRIBUTED_PUBLIC_RESULT_REV1.json')
for a in plan['artifacts']+load(P/'ATTRIBUTED_CLOSURE_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
preserved=[]
for a in load(P/'ATTRIBUTED_DEVELOPMENT_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256'];preserved.append(ref(a['path']))
old=load(P/'attributed-development-rev1/allocation-before-read-bound.json');assert old['records'][13]['fields'][2]['type']['max']==1;old['records'][13]['fields'][2]['type']['max']=2;assert old==load('docs/formal/ATTRIBUTED_PUBLIC_ALLOCATION_TABLE.json')
assert load(P/'ATTRIBUTED_BUILD_REV1.json')['status']=='FAIL' and load(P/'ATTRIBUTED_BUILD_REV2.json')['status']=='PASS'
for name,n in [('TESTS_REV1',34),('TESTS_REV2',34),('REFERENCE_TESTS_REV1',328)]:
 t=load(P/f'ATTRIBUTED_{name}.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
backing=[ref('docs/formal/ATTRIBUTED_PUBLIC_ALLOCATION_TABLE.json'),ref(P/'campaign3-attributed-model-rev1/FREEZE.json')]
for a in backing:assert prior[a['path']]['sha256']==a['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/(n+'.json')) for n in ['identities','replay','learning']+[f'worker-{i}' for i in range(4)]]+[ref(p) for p in ['scripts/replay-history-attributed.mjs','scripts/check-attributed-closure.mjs','src/campaign3/attributedRuntime.ts','src/campaign3/attributedModel.ts','src/campaign3/attributedMath.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ATTRIBUTED BELIEF AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/output')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [14,19,20,21]]
r=dict(status='ATTRIBUTED BELIEF SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,alreadyReviewedBacking=backing,obligations=obs,originalCheckerOutput=output,limits=['Fresh6 models30 public runs120 prefixes90 advancing30 terminal; complete original worker views/results equal, one successor per prefix not all tails.','Independent decoded360 own/report updates270 probes90 contexts90 intended assertions; no independent RNG/decision reconstruction.','Latest/Majority report history, unknown versus known ignorance, C disagreement and false A attribution retained. NoPersonModel cannot borrow actual B state.','Corrected report-only contrast disables delivery both arms: whole B state fixed while A evidence/choice differs. Earlier probe-only comparison was insufficient.','Successful receipt can change B without changing A person model; current receipt120/learning140 cannot change earlier choice/intent.','PrivateStateOracle is explicit violating comparator, not lawful observer access. Normal/forced/balanced hidden-view equalities retained with actual1/2 dice at seed13.','Construction failures and29 archives preserved; allocation correction changes only max read-list1->2 to implement predeclared Oracle. No model law selected or retired.','Historical34 corrected/34 initial/328 reference and failed/successful build receipts authenticated, not freshly executed conformance suite.','Fixed proposition/recognized semantic reports/relevance mapping and finite depth; no exposure-to-comprehension, natural inference, learned trust or recursive mentalizing claim.','ATTRIBUTED_CHILD_BOUNDARY_COMPONENT and its tests are a separate memory-target seam, excluded from this person-model review despite name overlap.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

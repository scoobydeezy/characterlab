"""Whole historical goal-strategy authority and independent consequence/credit audit."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-goal-strategy-rev1';B=P/'campaign3-history-universe-rev1'
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
specs['docs/formal/GOAL_STRATEGY_COMPONENT_CONTRACT.md']='Accepted goal-strategy-component0.1 trusted operand selector, not public learned S0. Latest route reading, inclusive expiry, no revival of older reading, duplicate idempotence and simultaneous-source ambiguity rejection. Preserve goal independently of plan; three explicit reductions, no action/learning/fulfillment owner.'
specs['docs/formal/GOAL_STRATEGY_PUBLIC_CONTRACT.md']='Accepted public0.1:989..1007 namespace1164, empty S0; separate goal994/plan996/knowledge1000 owners. Context40 sees prior state; plan90/attempt100/execution110/observe120/evidence130/lifecycle and learning140. Truth and perceived criterion distinct; same-instant adoption remains Active. Positive criterion precedes control abandonment. Deterministic ordinary planning, no Decision or stochastic claim.'
add('GOAL_STRATEGY_READINESS.md','Prospective desired outcome versus mutable route question, old373 immutable instruction boundary and original MEC controls. Public source/owned lifecycle/execution/identities/replay then owed, later bounded qualification discharges; broader planning/efficacy/control remains outside scope.')
add('GOAL_STRATEGY_COMPONENT_CHECKPOINT.md','Then Stage A/B only, eight development tests and no-emit typecheck. Pure trusted component preserves missing/expired/unavailable, routes and desired state but does not qualify public sources or arbitrary learned initial state. Public successor later earns specified gates.')
add('GOAL_STRATEGY_COMPONENT_CHECK_REV1.json','Historical eight-test/typecheck development receipt and four exact source hashes. No Model/Run/Experiment/Comparison identities here; component PASS alone is not public qualification.')
add('GOAL_STRATEGY_COMPONENT_TESTS_REV1.json','Historical eight passing component assertions including exact expiry endpoint, input ordering/deduplication, copied goal, contradictions/future/simultaneous rejection, same goal route switch/gap and three collapse controls. Not freshly rerun.')
add('GOAL_STRATEGY_DEVELOPMENT_TESTS_REV1.json','Historical24 passing assertions before final matrix strengthened actual route-B completion. Final26 supersedes qualification coverage without deleting this development receipt; no failed behavior claimed and no prechange source reconstruction implied.')
add('CAMPAIGN3_GOAL_STRATEGY_QUALIFICATION.md','VER-C3-GOAL-001 bounded native public closure:4 models19 runs94 prefixes freshly reproduced. Same goal survives A/B switch and no-route gap, resumes and fulfills through B. Three controls abandon in gap, persist failed A, or retire after mere failure. Perceived goal fulfillment separate from actual success; hidden/false/external evidence controls. No contested Decision, general search, learned efficacy or universal persistence law.')
add('GOAL_STRATEGY_PUBLIC_PLAN_REV1.json','Whole original four-model19-distinct-run canonical plan freshly reconstructed from exact recipes, empty initial state, original inputs/seed, ExperimentIdentity and ComparisonCase. The original four-model freeze and allocation source already have separate reviewed roles; their bytes remain binding.')
add('GOAL_STRATEGY_PUBLIC_RESULT_REV1.json','Fresh19 native public runs94 original-prefix continuations75 advancing19 terminal match whole original result, final save/state/output/observer hashes and original inputs. No full tails; fixed seed with zero consumed random addresses. Original replay assertions verify named routes, actual B completion, lifecycle and whole observer controls.')
add('GOAL_STRATEGY_CLOSURE_REV1.json','Original read-only checker freshly passes complete original artifact/model/identity/result bindings, contiguous19 allocations and frozen model files, historical26/328 assertions/build. Current review does not allocate, refreeze or alter existing public wrapper scope.')
add('GOAL_STRATEGY_TESTS_REV1.json','Historical26 passed leaves:8 component,16 runtime,2 public. Actual trace-producer phases; eight stage faults plus precommit from adopted state; state/queue/trace/output/allocators/RNG rollback. Faulted runtime cannot save. Edited originals/saves, foreign writer/schema/observer/handle and duplicate adoption rejected. Not a fresh fault-test run.')
add('GOAL_STRATEGY_REFERENCE_TESTS_REV1.json','Historical328 passing reference assertion leaves; authenticated not rerun.')
add('GOAL_STRATEGY_BUILD_REV1.json','Historical PASS/exit0 boundary/TypeScript/Vite status record; not raw process output or a fresh build. Accepted closure authenticates original receipt.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev125/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-goal-strategy.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-goal-strategy-closure.mjs'],text=True).strip()
plan=load(P/'GOAL_STRATEGY_PUBLIC_PLAN_REV1.json');result=load(P/'GOAL_STRATEGY_PUBLIC_RESULT_REV1.json')
for a in plan['artifacts']+load(P/'GOAL_STRATEGY_CLOSURE_REV1.json')['artifacts']+load(P/'GOAL_STRATEGY_COMPONENT_CHECK_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for name,n in [('TESTS',26),('DEVELOPMENT_TESTS',24),('COMPONENT_TESTS',8),('REFERENCE_TESTS',328)]:
 t=load(P/f'GOAL_STRATEGY_{name}_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
freeze=load(P/'campaign3-goal-strategy-model-rev1/FREEZE.json')
for model in freeze['models']:
 for a in model['files']:assert ref(a['path'])['sha256']==a['sha256']
assert len(plan['runs'])==len(result['results'])==19 and result['restores']==94 and result['advancing']==75 and result['terminal']==19
assert sum(x['prefixes'] for x in result['results'])==94 and len(set(x['runIdentity'] for x in result['results']))==19
backing=[ref('docs/formal/GOAL_STRATEGY_PUBLIC_ALLOCATION_TABLE.json'),ref(P/'campaign3-goal-strategy-model-rev1/FREEZE.json')]
for a in backing:assert prior[a['path']]['sha256']==a['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/(n+'.json')) for n in ['identities','replay']]+[ref(p) for p in ['scripts/replay-history-goal-strategy.mjs','scripts/check-goal-strategy-closure.mjs','src/campaign3/goalStrategyRuntime.ts','src/campaign3/goalStrategyModel.ts','src/campaign3/goalStrategyComponent.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GOAL/STRATEGY AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
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
obs=[f'RO-C3-{n:03}' for n in [12,14,19,20,21]]
r=dict(status='GOAL/STRATEGY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],alreadyReviewedBacking=backing,obligations=obs,originalCheckerOutput=output,limits=['Fresh whole canonical plan and19 native public runs94 prefixes75 advancing19 terminal; one successor per prefix, no full-tail claim.','Actual replay verifies routes [0,1,1,2,0,2,0], gap-preserved goal, actual B completion and separate comparator trajectories.','Source/model/runtime/math/tests read together establish disjoint owners and prior140-to-next40 timing; no new permanent allocation or public producer.','World success, destination attainment and admitted criterion are separate; external and false attainment can fulfill, hidden attainment cannot.','All four observation IDs reserved on denied branches preserve later observer provenance; missing/expired/known-unavailable and duplicate receipt controls retained.','Seed committed but random ledger empty: deterministic ordinary planning, no stochastic law or meaningful Decision qualified.','Historical8 component24 development26 final328 reference tests and build authenticated not rerun. Final source strengthens real B completion; no failed development behavior or exact prechange source archive claimed.','One goal/two authored routes, controlled evidence validity/criterion and authored priority; no learned efficacy, general search, multi-goal competition or universal persistence law.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

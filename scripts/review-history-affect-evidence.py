"""Audit AFFECT historical result/plan joins without executing public runs."""
from pathlib import Path
from fractions import Fraction as Q
import json,hashlib,collections,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-affect-evidence-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['scope','status','purpose','claims','checks','limitations','disposition','rule'])
ip=P/'campaign3-history-source-roles-rev199/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if Path(p).name.startswith('AFFECT_') and p.endswith('.json')];assert len(paths)==12
plan=load(P/'AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json');exp=load(P/'AFFECT_PUBLIC_EXPERIMENT_REV1.json');closure=load(P/'AFFECT_VALIDATION_CLOSURE_REV1.json');freeze=load(P/'campaign3-affect-model-rev1/FREEZE.json')
assert load(O/'aggregate-check.json')['status']=='PASS EXACT ORIGINAL AGGREGATE AND ELEVEN CLAIM CHECKS'
parts=[load(P/f'AFFECT_PUBLIC_EXPERIMENT_REV1_PART{i}.json') for i in range(4)]
assert [r for p in parts for r in p['runs']]==exp['results']
assert len(plan['runs'])==len(exp['results'])==exp['runs']==91
models={m['name']:m for m in freeze['models']};assert len(models)==exp['models']==18
bindings=[]
def bind(p,h,owner):
 assert ref(p)['sha256']==h,(owner,p)
 bindings.append(dict(owner=owner,**ref(p)))
bind(P/'campaign3-affect-model-rev1/FREEZE.json',plan['modelFreezeSha256'],'main plan')
for m in models.values():
 for f in m['files']:bind(f['path'],f['sha256'],m['name'])
assert sum(len(m['files']) for m in models.values())==closure['modelFiles']==90
pr={r['name']:r for r in plan['runs']};assert len(pr)==91
for i,p in enumerate(parts):
 assert p['part']==i and p['parts']==4 and p['code']==exp['code']
 bind(P/'AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json',p['planSha256'],f'part{i}')
 assert [r['name'] for r in p['runs']]==[r['name'] for j,r in enumerate(plan['runs']) if j%4==i]
 for r in p['runs']:
  assert r['model']==pr[r['name']]['model'] and r['seed']==pr[r['name']]['seed'] and r['model'] in models
  assert r['prefixes']==r['nextSteps'] and r['prefixes']>0
assert len({r['runIdentity'] for r in exp['results']})==91
assert sum(r['prefixes'] for r in exp['results'])==exp['prefixRestores']==exp['nextStepEqualities']==1236
for x in closure['finalCode']+closure['predecessorDependencies']+closure['receipts']:bind(x['path'],x['sha256'],'closure')
assert closure['finalCode']==exp['code'] and closure['mainRuns']==91 and closure['supplementaryExecutions']==14
assert closure['prefixRestores']==closure['nextStepEqualities']==1236
for x in closure['receipts']:
 t=load(x['path']);assert t['numPassedTests']==x['passed'] and t['numFailedTests']==t['numPendingTests']==0
assert sum(x['passed'] for x in closure['receipts'][:2])==closure['affectedTests']==82
assert closure['receipts'][2]['passed']==closure['referenceTests']==328
timingPlan=load(P/'AFFECT_PREFIX_CONTRAST_PLAN_REV1.json');timing=load(P/'AFFECT_PREFIX_CONTRASTS_REV1.json')
bind(P/'AFFECT_PREFIX_CONTRAST_PLAN_REV1.json',timing['planSha256'],'timing result')
assert timing['runs']==8 and len(timing['results'])==len(timingPlan['pairs'])==4
for p,r in zip(timingPlan['pairs'],timing['results']):
 assert (p['name'],p['prefix'],p['field'],p['firstDifferentAt'])==(r['name'],r['exactEqualPrefixInstants'],r['field'],r['firstDifferentFactorAt'])
 for k in ['a','b']:
  a=p[k]
  if a['name'] in pr:assert a==pr[a['name']]
  else:
   assert a['name']=='relief-context-held'
   assert a['seed']==pr['relief']['seed'] and a['model']==pr['relief']['model'] and a['orderedInputs']!=pr['relief']['orderedInputs']
interiorPlan=load(P/'AFFECT_INTERIOR_FEEDBACK_PLAN_REV1.json');interior=load(P/'AFFECT_INTERIOR_FEEDBACK_REV1.json')
bind(P/'AFFECT_INTERIOR_FEEDBACK_PLAN_REV1.json',interior['planSha256'],'interior result')
assert interiorPlan['orderedInputs']==pr['factor-3-0.5-1-1-0']['orderedInputs'] and interiorPlan['seed']==0
assert interiorPlan['models']==[f'candidate-{c}-feedback-{f}' for c in [1,2,3] for f in ['false','true']]
assert all(n in models for n in interiorPlan['models']) and interior['runs']==6 and len(interior['results'])==3
for c,r in enumerate(interior['results'],1):
 assert (r['candidate'],r['exactEqualPrefixInstants'],r['previousAt'],r['at'])==(c,13,13,14)
 assert r['baseline']==['1/2']*(2 if c==2 else 1) and r['feedback']==['5/8']*(2 if c==2 else 1)
factors=load(P/'AFFECT_FACTOR_COMPARISON_REV1.json');assert factors['factorCells']==81 and factors['candidateEvaluations']==243
bind('src/campaign3/affectFactorComparison.ts',factors['codeSha256'],'pure comparison')
def expected(inp):
 p,s,v,c=(Q(inp[n]) for n in ['likelihood','severity','vulnerability','control']);e=p*s*(1+v)/2;u=e*(1-c)
 return {'HistoricalProduct':[e*(2-c)/2],'SplitExposure':[e,u],'ScalarUncontrolled':[u]}
for r in factors['rows']+factors['collision']:
 actual={k:[Q(x) for x in v] for k,v in r['results'].items()};assert actual==expected(r['input'])
assert len({tuple(r['input'].values()) for r in factors['rows']})==81
assert factors['collision'][0]['results']['ScalarUncontrolled']==factors['collision'][1]['results']['ScalarUncontrolled']
assert factors['collision'][0]['results']['SplitExposure']!=factors['collision'][1]['results']['SplitExposure']
assert all(x['result']['status']=='Unavailable' for x in factors['unknown'])
notes={
'AFFECT_FACTOR_COMPARISON_REV1.json':'81 exact arithmetic cells/243 candidate evaluations; scalar collision and unavailable control. No source/model/public admission or psychological irreducibility proof. All three maps remain serious candidates.',
'AFFECT_INTERIOR_FEEDBACK_PLAN_REV1.json':'Six-model fixed interior-input comparison, same seed0 and actual main-plan input. Nonsaturation avoids mistaking ScalarUncontrolled zero at full control for general inability to feed back. Frozen-before-execution is historical declaration, not a timestamp proved by hashing.',
'AFFECT_INTERIOR_FEEDBACK_REV1.json':'Six historical supplementary executions: all three candidates1/2 to5/8 at14 from prior13 with recorded equal13-instant prefixes and shared belief-state hashes. No new complete-prefix count or general feedback law; stored assertions not freshly replayed.',
'AFFECT_PREFIX_CONTRAST_PLAN_REV1.json':'Four paired supplementary interventions: likelihood/control/feedback/vulnerability-relief. Seven sides exactly reuse main plan rows; one explicitly modified relief-context-held input. Same model/seed does not imply identical input. Actual writer specifies field14 intervention; no new source of physiological control inferred.',
'AFFECT_PREFIX_CONTRASTS_REV1.json':'Eight executions/four pairs retain exact prefix lengths3/9/10/9 and first differences7/13/11/11. Read-only plan/result joins verify recorded timing claims, not a fresh execution. Main matrix owns restoration counts.',
'AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json':'91 original ordered-input/model/seed commitments across18 models with exact90 model file bindings. Input ordering and run names retained; no automatic current public qualification from plan existence.',
'AFFECT_PUBLIC_EXPERIMENT_REV1.json':'Exact four-part concatenation reproduced with all eleven original claim assertions.91 distinct RunIdentity values;48 public factor cells, hidden-truth safe-output/state equality, display-relative beliefs, independent unknown/zero/availability and later feedback. Two of eight competing-goal seed pairs change sampled choice; six equal retained. Fear-as-command/extra-die/relief-as-evidence are rejected distinct oracles.1236 save/next-step checks include91 terminal checks, hence1145 advancing steps, not1236 advancing. No fresh runtime replay or universal scalar law.',
'AFFECT_VALIDATION_CLOSURE_REV1.json':'Historical90 model files,91 main runs,14 supplementary executions,1236 prefix/next checks and82 affected/328 reference tests. Exact source,predecessor and test-receipt bindings checked now; source equality does not mean the tests were rerun. Initial timeout preserved; no full active-suite claim. Historical765/19 counters do not replace current1519/0.'}
for i in range(4):notes[f'AFFECT_PUBLIC_EXPERIMENT_REV1_PART{i}.json']=f'Historical partition{i} of4 selected by original plan index modulo4. Exact rows preserved and joined into aggregate without deduplication, reordering or double-counting. The common seven-file source commitment matches current bytes; numeric/hash/RunIdentity fields are typed execution backing. No separate scientific verdict or fresh restore claim.'
chain=[ref(O/'aggregate-check.json'),ref(P/'campaign3-history-affect-authority-rev1/review.json'),ref(P/'campaign3-history-affect-authority-rev1/canonical-check.json'),ref('scripts/qualify-affect-public.mjs'),ref('scripts/qualify-affect-prefix-contrasts.mjs'),ref('scripts/qualify-affect-interior-feedback.mjs')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p in paths:
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='AFFECT HISTORICAL PLAN / RESULT / CLOSURE; EXACT BOUNDED JOINS',judgment=notes[Path(p).name],acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=s,role='NARRATIVE' if narrative(q) else 'BACKING') for q,s in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in paths:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All twelve JSON sources; original occurrence identities separately retained. IDs,hex payloads,rational strings,hashes and labels are typed backing, not scientific claims.'))
save('review.json',dict(status='TWELVE AFFECT EVIDENCE SOURCES RECONCILED; NO NEW PUBLIC EXECUTION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],schema=ref(O/'schema.json'),checkerFailure=dict(receipt=ref(O/'checker-failure-rev1.json'),rejectedChecker=ref(O/'rejected-reviewer-rev1.py'),disposition='First Python checker used invented ScalarBalanced key instead of recorded HistoricalProduct. Formula unchanged; corrected checker label only. No production/scientific failure inferred.'),verification=dict(mainRuns=91,uniqueRunIdentities=91,parts=4,modelFiles=90,prefixChecks=1236,advancingSteps=1145,terminalChecks=91,supplementaryExecutions=14,pureCells=81,pureCandidateEvaluations=243,changedChoicePairs=2,unchangedChoicePairs=6),limits=['Read-only exact historical aggregation and arithmetic, not a fresh runtime,test,restore,mutant or build.','Equal source/model/plan digests do not establish execution time. Supplementary reports record prior behavior; main-part rows carry their own run identities.','All existing source gaps and independent adequacy remain open. No law,allocation,verdict,corpus or obligation status changed.'],obligations=['RO-C3-010','RO-C3-011','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED AFFECT EVIDENCE JOINS',sources=12,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

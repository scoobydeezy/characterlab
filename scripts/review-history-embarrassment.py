"""Chosen reappraisal component authority and independent arithmetic review."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embarrassment-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
from fractions import Fraction as F
specs={}
specs['docs/formal/EMBARRASSMENT_CONTRACT.md']='Accepted component0.1: six originals, one incident/evaluator/authored standard, three independently admitted propositions. Latest mismatch/awareness, Mean or Latest adverse evaluation; complete-factor unknown policy. Reputation severity separate from avoidance/participation motives. Affect modifies positive avoidance base, never creates a separate die. Exact choice/attempt/execution, physical presence and cue distinct. Prequalification unit1/4 cap3 amendment preserves CoarseUnit; native authority remains separate.'
specs['docs/planning/EMBARRASSMENT_READINESS.md']='Prospective intake for embarrassment despite participation. Must not infer emotion from action or true evaluator mind. Controlled reports and known authored standard permitted by Architecture4.3; norm discovery/trust/general taxonomy not supplied. Existing operands alone are insufficient. Later component qualification earns only specified bounded witness.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_READINESS.md']='Prospective native admission requirement: three independent owners, actual phases, typed safe originals, exact row/RNG/presence preservation and full restore/fault/publication checks. Historical51/54 extension requirement later separately discharged by native0.2 verdict; this note itself is not native evidence.'
specs['docs/planning/CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md']='VER-C3-EMBARRASSMENT-001:6 models69 distinct cases483 component prefixes414 advancing69 terminal. Five of eight primary seeds participate with positive affect and live avoidance base; removing participation goal selects withdrawal at same appraisal. Failed withdrawal leaves presence without free participation. Private affect, cue, intent, physical state and independently admitted reports differ. All five laws/scalar projection retained; historical15/328 tests/build, then-native debt separate.'
specs['docs/planning/EMBARRASSMENT_FINDINGS.md']='Preserve original32 coarse trajectories: affect and NoAffectReasons probabilities equal1/3,2/3, so phenotype not causal affect-choice proof. Fine calibration unit1/4 cap3 yields1/2,1/2 and seed2 switch; all eight seeds retained. First14-pass1-fail decoder helper lacked408 schema, corrected without production change. Exact fixture aliases not extra runs. Complete-factor unknown, controlled standard/report meaning, no physiological cue/trust/identity join and coincident coordinates retained.'
specs['docs/planning/EMBARRASSMENT_PLAN_REV1.json']='Frozen six model/69 unique original run identities, source graph, explicit experiment/comparison and all primary/paired goal-only seeds. Fresh identities/artifacts/fixtures reconstruct exactly. FalseReport and DeniedUnchanged aliases excluded from distinct run count, not dropped outcomes.'
specs['docs/planning/EMBARRASSMENT_RESULT_REV1.json']='Exact original aggregate and semantic cross-case assertions checked; fresh69 component cases483 restores reproduce complete snapshot/observer/save hashes. One successor per prefix, not native Save132 or full tails.'
specs['docs/planning/EMBARRASSMENT_CLOSURE_REV1.json']='Original closure equality, source/test/build bindings and four coarse-development archives checked under authenticated historical51/54 predecessor wrapper scope. Not current55/58 completeness or fresh test/build.'
specs['docs/planning/EMBARRASSMENT_TESTS_REV1.json']='Historical15 passed assertion leaves, including actual positive-affect participation, paired withdrawal, failed execution, absent-base exclusion, unknown/context/judgment/goal controls, display separation, Mean/Latest correction, coarse law, hidden views, faults/busy/retry and restore. Not freshly rerun tests.'
specs['docs/planning/EMBARRASSMENT_REFERENCE_TESTS_REV1.json']='Historical328 passed assertion leaves, not fresh reference suite.'
specs['docs/planning/EMBARRASSMENT_BUILD_REV1.json']='Historical build exit0 and exact log hash, no fresh build.'
specs['docs/planning/EMBARRASSMENT_TESTS_DEV1.json']='Preserved14 pass1 fail. Generic canonical decoder cannot inspect schema408 in zero-base reason test; helper changed to inherited receiving codec. Not a behavioral failure or fully passing cohort.'
specs['docs/planning/EMBARRASSMENT_EXPLORATION_REV1.json']='Original32 exploratory seed/law result projections with coarse receiving. All probabilities1/3,2/3 and affect1,1; six participating seeds, two withdrawing. Matches final CoarseUnit primary results under same seed, not final fine receiving. No fresh exploratory source execution here.'
specs['docs/planning/EMBARRASSMENT_EXPLORATION_REV2.json']='Corrected40 exploratory projections for five laws/eight seeds exactly match corresponding frozen final results. Fine laws1/2,1/2 vs NoAffectReasons/CoarseUnit1/3,2/3. These are projected exploratory rows, not independent extra qualified runs.'
specs['docs/planning/embarrassment-development-rev1/PRESERVATION.json']='Four exact archives preserve source, fixtures, explorer and all32 coarse projected results. Equality finding is not erased by later fine calibration. Three non-JSON source archives and duplicate result are authenticated by hashes.'
specs['docs/planning/embarrassment-development-rev1/EMBARRASSMENT_EXPLORATION_REV1.json']='Exact duplicate archive of rejected coarse receiving exploration; same32 results, not32 extra experiments or independent confirmation.'
for i in range(69):specs[(P/f'EMBARRASSMENT_RUN_{i}_REV1.json').as_posix()]=f'Frozen component worker{i}: six semantic rows/seven complete saved prefixes freshly reproduce all original bytes/hashes, whole snapshot and safe observer. Physical presence and committed RNG retained separately. One successor per prefix; no native source/authority proof.'
plan=load(P/'EMBARRASSMENT_PLAN_REV1.json');assert len(plan['models'])==6 and len(plan['runs'])==69 and plan['prefixes']==483
assert len({r['runIdentity'] for r in plan['runs']})==69
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
rp=load(O/'replay-check.json');assert rp['status']=='PASS' and (rp['cases'],rp['prefixes'])==(69,483)
assert [x['index'] for x in rp['checks']]==list(range(69))
for x in rp['checks']:assert x['resultSha256']==ref(P/f'EMBARRASSMENT_RUN_{x["index"]}_REV1.json')['sha256']
for name,n in [('TESTS',15),('REFERENCE_TESTS',328)]:
 t=load(P/f'EMBARRASSMENT_{name}_REV1.json');assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
t=load(P/'EMBARRASSMENT_TESTS_DEV1.json');assert not t['success'] and (t['numPassedTests'],t['numFailedTests'],t['numPendingTests'])==(14,1,0)
leaves=[a for f in t['testResults'] for a in f['assertionResults']];bad=[a for a in leaves if a['status']=='failed'];assert len(leaves)==15 and len(bad)==1 and 'unknown record schema 408/1' in '\n'.join(bad[0]['failureMessages'])
b=load(P/'EMBARRASSMENT_BUILD_REV1.json');assert b['status']=='PASS' and b['exitCode']==0 and ref(b['log'])['sha256']==b['logSha256']
preserved=[]
for a in load(P/'embarrassment-development-rev1/PRESERVATION.json')['files']:
 assert ref(a['archive'])['sha256']==a['sha256'];preserved.append(ref(a['archive']))
runs=[load(P/f'EMBARRASSMENT_RUN_{i}_REV1.json') for i in range(69)]
for rev,n in [(1,32),(2,40)]:
 rows=load(P/f'EMBARRASSMENT_EXPLORATION_REV{rev}.json');assert len(rows)==n
 assert len({(x['law'],x['seed']) for x in rows})==n
 for x in rows:
  law='CoarseUnit' if rev==1 else x['law'];r=next(r for r in runs if r['scenario']=='Balanced' and r['law']==law and r['seed']==x['seed'] and r['projection']==2);row=r['snapshot']['rows'][3]
  assert all(x[k]==row[k] for k in ['chosen','probabilities','affect']) and x['present']==r['snapshot']['present']
# Independent prior-evidence arithmetic, cue and physical presence from original inputs.
fmt=lambda x:None if x is None else f'{x.numerator}/{x.denominator}'
count=0
for case,result in zip(plan['runs'],runs):
 history=[[],[],[]];present=True;goals=None
 for source,row,world in zip(case['input'],result['snapshot']['rows'],result['snapshot']['world']):
  at=source['at'];goals=[source[k] for k in ['reputation','avoid','participate']] if at==1 else goals
  assert row['goals']==goals and row['knowledgeBefore']==history
  mismatch=history[0][-1]['value'] if history[0] else None;seen=history[1][-1]['value'] if history[1] else None
  js=history[2];judgment=None if not js else F(int(js[-1]['value'])) if case['law']=='Latest' else F(sum(x['value'] for x in js),len(js))
  likelihood=None if mismatch is None or seen is None or judgment is None else judgment if case['law']=='JudgmentOnly' or mismatch and seen else F(0)
  severity=F(goals[0],4);u=None if likelihood is None else likelihood*severity;affect=[] if u is None else [fmt(u)]*(2 if case['projection']==2 else 1)
  assert (row['mismatch'],row['seen'],row['judgment'],row['likelihood'],row['severity'])==(mismatch,seen,fmt(judgment),fmt(likelihood),fmt(severity))
  assert row['vulnerability']=='1/1' and row['control']=='0/1' and row['affect']==affect and row['cue']==(fmt(u) if source['display'] else None)
  options=[i for i in [0,1] if source['opportunity'] and goals[i+1]>0];assert (row['chosen'] in options) if options else row['chosen']==-1
  assert row['completion']==(row['chosen']>=0 and source['complete'])
  if row['completion']:present=row['chosen']==1
  assert world==dict(at=at,mismatch=source['worldMismatch'],seen=source['worldSeen'],judgment=source['worldJudgment'],present=present)
  reports=[source[k] if source[k+'Access'] else None for k in ['mismatch','seen','judgment']];assert row['observation']==dict(at=at,reports=reports)
  history=[xs+[dict(at=at,value=reports[i])] if reports[i] is not None else xs for i,xs in enumerate(history)]
  assert row['knowledgeAfter']==history;count+=1
 assert result['snapshot']['present']==present and result['snapshot']['history']==history
assert count==414
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','replay-check.json']]+[ref('scripts/'+n+'.mjs') for n in ['check-history-embarrassment-closure','replay-history-embarrassment','check-embarrassment','qualify-embarrassment']]+[ref('src/campaign3/embarrassment.ts'),ref('src/test/embarrassmentFixtures.ts')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='EMBARRASSMENT COMPONENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/scope','/finding'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='EMBARRASSMENT COMPONENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=count,limits=['Fresh69 component cases483 complete-prefix restores414 advancing69 terminal; no native claim.','Historical15/328 tests/build authenticated, not rerun. Exploration32/40 projected rows checked against final counterparts, not fresh old-source execution.','Coarse equality preserved; fine calibration earns bounded receiving sensitivity, not universal units or independently necessary affect dimension.','Unknown any proposition conservatively leaves appraisal unavailable; authored standard/reports do not prove norm discovery, calibrated trust or private-mind access.','Positive-affect participation is distinct from failed withdrawal; cue, DecisionExpression and physical presence remain distinct.','FalseReport/HiddenTruth and DeniedUnchanged/UnknownJudgment are exact aliases, not extra distinct runs.','Component native-debt wording is historical and later separately discharged; old helper decoder failure and all coarse source/results preserved.'])

check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

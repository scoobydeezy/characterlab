"""Whole sleep/intoxication authority reconciliation, with fresh original native replay."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-perturbation-control-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
specs[(P/'SLEEP_CONTROL_READINESS.md').as_posix()]='Prospective intake under Architecture7.4: temporary pressure distinct from constitution, competence, acquired identity, belief and goals. Presence of operands does not qualify a phenomenon. Demands prior real acquisition, causal later recovery, independent sensing/execution, all seeds and no implicit Task join. Subsequent bounded qualification discharges only this specified witness.'
specs[(P/'INTOXICATION_CONTROL_READINESS.md').as_posix()]='Prospective intake; sleep does not earn intoxication. Requires identical exposure with constitutional contrast, independent competence/control/execution and admitted sensing. Later finite clearance experiment meets narrow requirement; clinical/general substance/development and Task integration remain outside scope.'
specs[(P/'CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md').as_posix()]='VER-C3-SLEEP-CONTROL-001:2 models20 runs52 selected native prefixes32 advancing20 terminal. Prior wake changes admission/control and inhibition, recovery consequence8 affects9. Real signed acquired identity and outcome learning preserved within seed. NoControl removes access difference; unknown versus biased known zero and unmaintained-but-adopted goal distinct. Seeds1/2 switch,0/3 do not. No execution impairment in this law, no general personality stability or chosen bedtime. Historical13/328 tests/build; wrapper50/53 is dated.'
specs[(P/'CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md').as_posix()]='VER-C3-INTOXICATION-CONTROL-001:5 models20 runs55 selected native prefixes35 advancing20 terminal. Equal external800 exposure with clearance100/400 and fixed competence300. Slow execution recovers10, inhibition11, burden still300 at12. Strict execution boundary differs from inclusive inhibition. Higher850 competence is separate comparison. Four-channel blind whole view, biased known zero and inert interference controls preserve observer boundary. Historical12/328 tests/build and dated50/53 wrapper scope.'
specs[(P/'SLEEP_CONTROL_FINDINGS.md').as_posix()]='Rejected early one-option prelude earned status4/zero identity, so preservation was vacuous; asleep reward training admitted positive sleep-relief confound. Corrected before frozen qualification using awake practice and genuine common-load contest. Helper identityFold access error and Python alias issue preserved. REV2 exploratory identity is numerator only. NoControl retained; external sleep, disabled learning, inert blocked withholding and candidate calibration bound claims.'
specs[(P/'INTOXICATION_CONTROL_FINDINGS.md').as_posix()]='Constitutional clearance separate from competence. challenge<competence strict equality fails; control>=threshold equality inhibits. Blind masks intoxication plus legitimate downstream reward/pleasure/withdrawalReward; this scope was set before qualification, not a failed scientific cohort. Exposure after choice7 acts8; functional recovery distinct from complete clearance. No automatic identity rewrite does not imply immunity to future learning. No clinical law or general Task join.'
specs[(P/'SLEEP_CONTROL_EXPLORATION_REV1.json').as_posix()]='Rejected eight exploratory12-row cases. All second-instant identity qualification4 and fold0; sighted reward practice admits sleep relief100, blind sleep estimate unknown. Empty identity and changed motivation fail intended isolation. Source/runner archives authenticate this discarded fixture; no fresh exploration replay claimed.'
specs[(P/'SLEEP_CONTROL_EXPLORATION_REV2.json').as_posix()]='Corrected eight exploratory12-row cases. Actual contest qualifies nonzero identity79327 numerator, known zero sleep relief, common load800 only at2. Every appraisal/choice/physical row and numerator matches corresponding final seed0 case. Exploratory numerator is not a full rational; no fresh exploratory scheduler run claimed.'
specs[(P/'sleep-control-development-rev1/PRESERVATION.json').as_posix()]='Two exact archived sources preserve rejected empty-identity/sleep-relief fixture and corrected exploratory helper; original failures are neither suppressed nor final qualification. Hashes authenticated; helper initially misread fold object and environment Python alias was unavailable. No runtime law changed.'
for family,models,prefixes,tests in [('SLEEP',2,52,13),('INTOXICATION',5,55,12)]:
 stem=family+'_CONTROL';lower=family.lower()
 specs['docs/formal/'+stem+'_EXPERIMENT_CONTRACT.md']='Accepted '+lower+'-control-experiment/0.1-candidate using unchanged identity-public Biological. One actor12 instants, separately controlled external physical input, sensing, control, reasons/dice, expression, execution and learning. Frozen20-case all-seed roster and selected-prefix coverage; no clinical units, new law, writer, factory, allocation or general cognition/Task join.'
 for suffix,judgment in {
  'PLAN_REV1.json':'Frozen original source graph, fixture bytes, models/runs, explicit experiment and comparison. Whole plan independently rebuilt exactly, including all original artifacts and source hashes; no refreeze or seed substitution.',
  'RESULT_REV1.json':'Aggregate recomputed from all original workers and substantive cross-case assertions; final native executions and every selected save/next-save compared with entire original result. Prefix coverage is selected and one successor each, not all tails.',
  'CLOSURE_REV1.json':'Original closure equality and source/test/build bindings pass with independently authenticated historical wrapper50/53 predecessor scope. Current55/58 exhaustive inventory remains separate; no fresh tests/build.',
  'TESTS_REV1.json':'Historical focused tests, all individual assertion leaves passed without pending/failing leaves. Original source-bound suite; native matrix is freshly replayed separately, these tests are not rerun.',
  'REFERENCE_TESTS_REV1.json':'Historical328 reference passes, all individual assertion leaves checked, not a fresh test run.',
  'BUILD_REV1.json':'Historical successful TypeScript/build exit0 with exact log hash checked; not a fresh build.'}.items():specs[(P/(stem+'_'+suffix)).as_posix()]=judgment
 for i in range(20):specs[(P/f'{stem}_RUN_{i}_REV1.json').as_posix()]=f'Original native worker{i}:12 semantic rows, original model/run inputs, full observer/state hashes and exact selected native Save132/next-save hashes freshly reproduced. Terminal restore is no-op. Whole original result equality; no wider full-tail or all-prefix claim.'
 plan=load(P/(stem+'_PLAN_REV1.json'));assert len(plan['models'])==models and len(plan['runs'])==20 and plan['prefixes']==prefixes
 for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
 parts=[load(O/f'{lower}-part{i}.json') for i in range(2)]
 assert all(x['status']=='PASS' and x['cases']==10 for x in parts) and sum(x['prefixes'] for x in parts)==prefixes
 cases=[x for part in parts for x in part['checks']];assert sorted(x['index'] for x in cases)==list(range(20))
 for x in cases:assert x['resultSha256']==ref(P/f'{stem}_RUN_{x["index"]}_REV1.json')['sha256']
 for name,n in [('TESTS_REV1.json',tests),('REFERENCE_TESTS_REV1.json',328)]:
  t=load(P/(stem+'_'+name));assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
  leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
 t=load(P/(stem+'_BUILD_REV1.json'));assert t['status']=='PASS' and t['exitCode']==0 and ref(t['log'])['sha256']==t['logSha256']
 assert sum(len(load(P/f'{stem}_RUN_{i}_REV1.json')['semantic']) for i in range(20))==240
preserved=[]
for a in load(P/'sleep-control-development-rev1/PRESERVATION.json')['artifacts']:
 assert ref(a['archive'])['sha256']==a['sha256'];preserved.append(ref(a['archive']))
d=load(O/'identity-development.json');assert ref(d['archive']['path'])==d['archive'];preserved.append(d['archive'])
assert load(O/'identity-check.json')['status']=='PASS'
early=load(P/'SLEEP_CONTROL_EXPLORATION_REV1.json');later=load(P/'SLEEP_CONTROL_EXPLORATION_REV2.json')
assert early['status']==later['status']=='EXPLORATORY' and len(early['results'])==len(later['results'])==8
runs=[load(P/f'SLEEP_CONTROL_RUN_{i}_REV1.json') for i in range(20)]
for case in early['results']:
 assert len(case['rows'])==12 and case['rows'][1]['qualification']=='4' and all(r['identity']=='0' for r in case['rows'])
 assert case['rows'][1]['appraisal']['beliefs']['drug']['sleep']==(None if case['scenario'].startswith('Blind') else 100)
for case in later['results']:
 r=next(r for r in runs if r['scenario']==case['scenario'] and r['law']=='Full' and r['seed']==0)
 assert len(case['rows'])==12
 for old,new in zip(case['rows'],r['semantic']):
  assert all(old[k]==new[k] for k in ['at','appraisal','choice','physical'])
  assert old['qualification']==str(new['status']) and old['identity']==new['identity'].split('/')[0]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','identity-check.json','identity-development.json','sleep-part0.json','sleep-part1.json','intoxication-part0.json','intoxication-part1.json']]+[ref('scripts/'+n+'.mjs') for n in ['check-history-perturbation-control-closure','check-history-perturbation-control-identities','replay-history-sleep-control','replay-history-intoxication-control','check-sleep-control','check-intoxication-control']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SLEEP / INTOXICATION CONTROL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
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
obs=['RO-C3-008','RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='SLEEP / INTOXICATION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh40 original native cases/107 selected prefixes67 advancing40 terminal; one successor per prefix, not full tails or all prefixes.','Historical13/12 focused and328 reference tests/build not rerun; original historical50/53 inventory is not current completeness.','External sleep/exposure, learning-disabled probes and fixed candidate calibration do not prove general personality stability, clinical biology, chosen regulation or Task join.','Four-channel intoxication mask prevents legitimate downstream reward differences; failed inert withholding equivalence does not generalize to all failed actions.','Strict execution versus inclusive control and separate recovery timing retained; final slow burden300 is not complete clearance.','Rejected sleep empty-identity and sleep-relief confound, numerator-only exploration and new audit-only Vite loader failure preserved.'])

check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

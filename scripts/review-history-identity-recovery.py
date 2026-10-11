from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-identity-recovery-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
 'docs/formal/IDENTITY_RECOVERY_EXPERIMENT_CONTRACT.md':'Accepted experiment0.1 over unchanged five-instant native Task/belief contracts. Empty histories, seed4, externally controlled significance0 at third actual act. Source actions are generated, not input labels. Separate standing/self/observer recovery and later appraisal; no plastic adaptation or biological/task scale. Require full original histories and report probability versus sampled-action scope.',
 'docs/planning/IDENTITY_RECOVERY_READINESS.md':'Prospective Brief12.12-8 intake: changed reports are not changed biography, temporary goal is not identity, self-concept is not dispositional adaptation. Reuse existing evidence before adding machinery; no silent horizon extension. Contrary acts remain in history whether estimates reverse or resist.',
 'docs/planning/CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md':'VER-C3-IDENTITY-RECOVERY-001 bounded recovery after one initial negative act, not entrenched lifetime identity. Historical5 reused models/13 cases/78 prefixes65 advancing13 terminal,11 new inputs2 exact old repeats. BABA with insignificant third act yields Mean-1,0,0,+1/3 and standing changes sooner; Latest+1 after second. NoFeedback probe1/2 versus7/9 both sampleA. No final significance keeps known0; withheld observer stays-1 despite self+1/3. Historical8/328/build, no adaptation claim.',
 'docs/planning/IDENTITY_RECOVERY_FINDINGS.md':'Pre-freeze dependency walker failed to strip Vite query suffix; stopped before plan/qualification. Corrected filesystem resolution, no changed model/result. Preserve all24 exploration cases and canonical RO019 ACTIVE versus RO021 CONDITIONAL mandatory-exit distinction; correcting routing prose does not close an obligation.',
 'docs/planning/IDENTITY_RECOVERY_PLAN_REV1.json':'Frozen exact original inputs, five reused model identities,13 unique run identities, experiment/comparison and whole dependency manifest. Fresh compilation reproduces model/run/input commitments. Eleven new inputs plus two old native Mean identities; no changed source recipe/horizon.',
 'docs/planning/IDENTITY_RECOVERY_RESULT_REV1.json':'Typed cross-case result, bound to all13 raw workers. Checks separate standing/belief recovery, unchanged biography under report/goal changes, missing/neutral, failed execution and propensity versus sample equality. Historical78 prefix denominator is preserved; fresh component reproduction is not fresh native restore.',
 'docs/planning/IDENTITY_RECOVERY_CLOSURE_REV1.json':'Fresh original read-only closure passes with current bound artifacts. Preserves13 cases/78 native prefixes, two exact old cases,8 affected/328 reference and build. Reuses existing laws, no record allocation or production change. Links next adaptation intake without qualifying it.',
 'docs/planning/IDENTITY_RECOVERY_EXPLORATION_REV1.json':'All24 prior exploratory Threshold component cases retained across Meaningful/WorkOnly/HomeOnly and seeds0..7. Fresh whole component rows reproduce exactly. Exploration precedes fixed comparison roster; selected significant-act fixture is not unselected population evidence or long-run recovery.',
 'docs/planning/IDENTITY_RECOVERY_BUILD_REV1.json':'Historical successful production build and original log authenticate recorded source scope; no fresh build claimed.',
 'docs/planning/IDENTITY_RECOVERY_TESTS_REV1.json':'Historical8 affected passes: three recovery-specific causal/history/rollback tests and five prior public quiescence/save checks. All individual test leaves checked; no fresh test execution.',
 'docs/planning/IDENTITY_RECOVERY_REFERENCE_TESTS_REV1.json':'Historical328 reference tests all pass; preserved suite scope, not whole active suite or fresh execution.',
}
for i in range(13):
 specs[(P/f'IDENTITY_RECOVERY_RUN_{i}_REV1.json').as_posix()]=f'Original native worker{i}: committed input/model/run identity, five authentic source rows and six complete-prefix successor hashes. Fresh component source execution matches all source fields. Belief cases independently reconstruct full holder histories, delayed appraisal and all observer hashes; source-only cases have no represented-belief data. Exact old cases compare full rows/views/save identities. Native restoration itself is historical.'
for name,count in [('IDENTITY_RECOVERY_TESTS_REV1.json',8),('IDENTITY_RECOVERY_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/name);assert t['success'] and t['numPassedTests']==count and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
b=load(P/'IDENTITY_RECOVERY_BUILD_REV1.json');assert b['status']=='PASS' and b['exitCode']==0
s=load(O/'schema-check.json');assert s['status']=='PASS' and (s['sourceRows'],s['beliefRows'],s['observerViews'],s['explorationCases'])==(65,55,33,24)
plan=load(P/'IDENTITY_RECOVERY_PLAN_REV1.json');assert len(plan['runs'])==13 and len({r['runIdentity'] for r in plan['runs']})==13
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','schema-check.json']]+[ref('scripts/check-history-identity-recovery.mjs'),ref(P/'IDENTITY_RECOVERY_CLOSURE_REV1.json'),ref('scripts/check-identity-recovery.mjs'),ref('scripts/check-identity-recovery-closure.mjs'),ref('scripts/qualify-identity-recovery.mjs'),ref('scripts/explore-identity-recovery.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='IDENTITY RECOVERY AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
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
obs=['RO-C3-009','RO-C3-010','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='IDENTITY RECOVERY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh component source replay13 frozen input cases and24 preserved exploration cases; native rows/views and identities checked read-only, no fresh Save132 restoration or tests/build.','Recovery after one initial negative act; externally controlled significance; Work/Home are existing Task settings, not independent cross-domain traits.','Standing, represented belief, goal-relative appraisal and plastic disposition remain distinct. Changed probe probabilities can preserve sampled action.','No contrary act deleted: insignificant expression remains original but contributes no qualified standing or report. General recovery rate and long-horizon adaptation remain unqualified.','RO021 CONDITIONAL remains a mandatory unsatisfied exit gate; historical prose correction does not change status.'])
check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

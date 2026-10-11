"""Native disposition authority review; preserve historical inventory and timing scope."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-disposition-public-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
 'docs/formal/DISPOSITION_PUBLIC_CONTRACT.md':'Accepted native0.1,18 instants and same seven laws/constitutional controls. Separate context40/reasons52/decision60/intent70/expression80/attempt100/execution110/qualify130/identity140/adapt140. Identity causally emits adaptation after journal update; only execution consumes permission. Constitution has no writer, Refold no plastic leaf. Typed1455 lineage authenticates fixed producer, not general fusion or observer testimony. Structural restore installs nothing and requires bounded full original replay/save equality.',
 'docs/formal/DISPOSITION_PUBLIC_ALLOCATION_TABLE.json':'Accepted eight schema1 records1451..1458, reused namespace1155, exact current contract hash. Closed profile/original/constitution/plastic/operand/update/root fields; originals alone contain world permission. Effective/plastic/standing are separate operands, feedback unrestricted rational permits joint sum, actor maps cardinality1. This allocation is structural vocabulary; authority and character evidence admission require separate model contracts.',
 'docs/planning/CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md':'VER-C3-DISPOSITION-PUBLIC-001:9 models15 cases285 native prefixes270 advancing15 terminal,2700 events. Typed operands and distinct owners preserve component expressions/journals and values; only inactive constitution/effective diagnostic displays normalize to null. Historical44 affected328 reference/build. Refold and failed-execution whole projections match. Projection is mechanism inspection, not represented self-knowledge. Dated50/53 wrapper count is historical, not current55/58.',
 'docs/planning/DISPOSITION_PUBLIC_FINDINGS.md':'Preserves pre-run mechanical TypeScript scaffolding corrections,16-pass development before redundant output refinement removal, five exact archives, Windows C:path loader packaging correction, and interruption-safe runner. Experiment/comparison packaging occurred during execution over unchanged frozen roster; not falsely pre-execution canonical packaging. Save costs44-45MB reflect complete trace/history, no scalability advantage. Component retry differs from native Failed. No new self/observer source from characterProjection naming.',
 'docs/planning/disposition-public-development-rev1/PRESERVATION.json':'Five exact pre-qualification source archives preserve implementation after16 development passes and before redundant post-construction refinement removal. Closed producer construction plus input/state refinement remain; full native/component comparison is independent of the optimization. No discarded behavioral failure is claimed.',
 'docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json':'Original frozen nine-model15-run input roster and complete native artifact manifest; all current artifact hashes match. Fresh compilation recomputes every model/run/input commitment. No source seed or law substitution. Experiment/comparison encoding is separately bound during execution, not present in this initial manifest.',
 'docs/planning/DISPOSITION_PUBLIC_EXPERIMENT_REV1.json':'Canonical binding of already frozen plan, nine models and15 runs with explicit comparison/coupling text. Fresh recomputation matches complete encoding. Packaging occurred during execution without altering roster, source or semantic comparison; this evidence is not retroactive proof of pre-execution canonical packaging.',
 'docs/planning/DISPOSITION_PUBLIC_RESULT_REV1.json':'Typed native aggregate binds all15 raw workers, component correspondence,19 prefix links each,44/328 historical tests/build and whole-projection controls. Fresh reconstruction checks270 rows and15 complete typed projections; actual native execution/restores remain historical.',
 'docs/planning/DISPOSITION_PUBLIC_CLOSURE_REV1.json':'Historical native closure authenticated under explicit historical wrapper scope. Original result/predecessor/component/recovery evidence checks pass;49/52 predecessor archived inventory/routing and repair matrix authenticate extension to50/53 with added source hashes/guard/tests. No claim that dated extension enumerates current tree, and no fresh native replay.',
 'docs/planning/DISPOSITION_WRAPPER_EXTENSION_REV1.json':'Exact historical extension49-to50 producers and52-to53 public factories; one guarded disposition runtime/direct factory. Predecessor exclusion loader is scoped only to added modules. Fresh historical checks authenticate prior graph/routes and addition membership/hashes; later additions make its current-directory scan dated. This does not reopen RO022 or prove current exhaustive inventory.',
 'docs/planning/DISPOSITION_PUBLIC_SAVE_SIZE_REV1.json':'Three final-prefix measurements bind original native hashes:44252262 Plastic,45443023 Leaky,44241327 Refold bytes. These are historical measured saves, not newly reconstructed save sizes or marginal-cost/scaling proof. Removing one stored leaf does not remove retained full-history trace cost.',
 'docs/planning/DISPOSITION_PUBLIC_BUILD_REV1.json':'Historical TypeScript/production build PASS and exact closure-bound log; no fresh build run.',
 'docs/planning/DISPOSITION_PUBLIC_TESTS_DEV1.json':'Historical16 native development passes before redundant output-refinement removal; retained exact source archives. Not a failed cohort or final complete suite.',
 'docs/planning/DISPOSITION_PUBLIC_TESTS_REV1.json':'Historical44 passes:17 native plus27 inherited. Primary full18-instant exact phase vector, RNG and component correspondence; foreign/constitution writer rejection, closed admission, forge/restore, caller copies, all10 reached stage faults plus precommit, and exact microtask/concurrency publication guard. No whole-active-suite claim.',
 'docs/planning/DISPOSITION_PUBLIC_REFERENCE_TESTS_REV1.json':'Historical328 reference passes; all individual leaves verified. No fresh test or wider-suite claim.',
}
for i in range(15):specs[(P/f'DISPOSITION_PUBLIC_RUN_{i}_REV1.json').as_posix()]=f'Frozen native worker{i}: original model/run/input commitments freshly recompute,18 rows exactly match its component with only inactive diagnostic display normalization,19 complete-prefix links and180 recorded events. Whole mechanism projection reconstructed from exact original expressions/journals and separate typed operands. Native Save132/RNG continuation assertions remain original historical execution, not a fresh scheduler run.'
for name,n in [('DISPOSITION_PUBLIC_TESTS_DEV1.json',16),('DISPOSITION_PUBLIC_TESTS_REV1.json',44),('DISPOSITION_PUBLIC_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/name);assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
 if n==44:
  titles={a['title'] for a in leaves}
  for stage in ['context','reasons','decision','intent','expression','attempt','execution','qualify','identity','adapt','commit']:assert 'native Failed rollback at reached '+stage in titles
  assert 'whole-wrapper barrier spans scheduler commit through RNG-ledger publication' in titles
t=load(P/'DISPOSITION_PUBLIC_BUILD_REV1.json');assert t['status']=='PASS' and t['exitCode']==0
preserved=[]
for a in load(P/'disposition-public-development-rev1/PRESERVATION.json')['artifacts']:
 assert ref(a['archive'])['sha256']==a['sha256'];preserved.append(ref(a['archive']))
allocation=load('docs/formal/DISPOSITION_PUBLIC_ALLOCATION_TABLE.json');assert allocation['contractSha256']==ref('docs/formal/DISPOSITION_PUBLIC_CONTRACT.md')['sha256'] and allocation['namespace']==1155
assert [x['typeId'] for x in allocation['records']]==list(range(1451,1459)) and all(x['schemaVersion']==1 for x in allocation['records'])
assert all([f['id'] for f in x['fields']]==list(range(1,len(x['fields'])+1)) and all(f['required'] for f in x['fields']) for x in allocation['records'])
for i,x in enumerate(load(P/'DISPOSITION_PUBLIC_SAVE_SIZE_REV1.json')['rows']):
 assert (x['case'],x['at'],x['bytes'])==(i,18,[44252262,45443023,44241327][i]) and x['sha256']==load(P/f'DISPOSITION_PUBLIC_RUN_{i}_REV1.json')['prefixes'][18]['saveSha256']
s=load(O/'schema-check.json');assert s['status']=='PASS' and (s['models'],s['runs'],s['rows'],s['projections'])==(9,15,270,15) and s['authorityRejections']>0
plan=load(P/'DISPOSITION_PUBLIC_PLAN_REV1.json')
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','schema-check.json']]+[ref('scripts/check-history-disposition-public-closure.mjs'),ref('scripts/check-history-disposition-public-schema.mjs'),ref('scripts/check-history-wrapper-inventory.mjs'),ref('scripts/check-history-wrapper-repair-matrix.mjs'),ref(P/'DISPOSITION_PUBLIC_CLOSURE_REV1.json'),ref('scripts/check-disposition-public.mjs'),ref('scripts/check-disposition-public-closure.mjs'),ref('scripts/qualify-disposition-public.mjs'),ref('scripts/resume-disposition-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='NATIVE DISPOSITION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
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
obs=['RO-C3-009','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='NATIVE DISPOSITION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh read-only identity/270-row/15-whole-projection reconstruction and pure mutation-authority checks, not fresh native execution, Save132 restore or tests/build.','Historical50/53 wrapper membership and hashes authenticated; current55/58 exhaustiveness is separate.','Mechanism-side characterProjection is not conscious self-belief or an admitted observer testimony source.','Inactive normalization affects only absent consumer display fields; immutable constitution and plastic owner state remain.','Experiment/comparison packaging occurred during execution over unchanged frozen roster; do not claim prior canonical packaging.','Whole diagnostic saves44-45MB are measured historical footprints, not marginal-cost or scalability proof.','Refold/Plastic and JointMax/StandingOnly equalities remain; joint fusion, independent necessity, wider horizons and developmental calibration unresolved.'])
check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

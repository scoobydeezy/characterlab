"""Chosen reappraisal component authority and independent arithmetic review."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embarrassment-public-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
specs['docs/formal/EMBARRASSMENT_PUBLIC_CONTRACT.md']='Accepted native0.2: six typed originals, separate goal/history/presence authorities,12 events with parent-ordered complete110/display110. Actual reasons52/decision60/expression80 and observe120/learn140. Physical transition1484 diagnostic only, safe projections exclude hidden originals. No frame state; source/domain/registry/seed/emptyS0/restore and native Failed/publication obligations explicit.0.2 correction before qualification retains allocation fields and psychology.'
specs['docs/formal/EMBARRASSMENT_PUBLIC_ALLOCATION_TABLE.json']='Accepted17 schema1 records1468..1484, existing1165 namespace, exact corrected contract hash. Original16 sourcefields/3owned roots/report proposition coordinates/context/appraisal/reasons/completion/cue/observation/learning/physical transition. Old0.1 table same records/fields/namespace; phase correction changes contract binding, not record identity.'
specs['docs/planning/CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md']='VER-C3-EMBARRASSMENT-PUBLIC-001:6 models69 native runs483 prefixes414 advancing69 terminal;72 events per run, exact component414 rows/RNG/physical presence. Fine five-of-eight positive-affect participation, failed withdrawal distinct; all prior inference/calibration controls preserved. Historical22/328 tests/build and52/55 inventory. Native0.1 rejected before acquired-state witness;0.2 actual reached faults separately earned. No extra clause promotion or universal emotion law.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_FINDINGS.md']='Preserve unregistered display115 development:21/22 tests fail before acquisition, not reached rollback evidence. Corrected0.2 uses separate parent-authenticated display110 child aftercomplete110; no scheduler or field schema changes. Immutable result summary next-instant frame is explicit copy-template erratum: only report-learning-to-later-appraisal exists. Twelve events not twelve distinct phase numbers. Distinct goal/history/presence owners, diagnostic1484, cue independent of choice/success, controlled-source limits retained.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_PLAN_REV1.json']='Frozen corrected0.2 dependency graph,six model69 distinct run/experiment/comparison bindings and exact component predecessor hash. Fresh audit reconstructs identities/fixture bytes and source manifest, with all seeds/laws retained. No refreeze or preselected component action.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_RESULT_REV1.json']='Exact69 worker bindings and all414 component rows, RNG and physical presence correspond. Fresh native executions/all483 restores/whole original receipts reproduce evidence. Frozen next-instant frame phrase is false metadata already corrected by explicit findings; no frame owner/operation claim admitted.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json']='Original result/closure/test/build/archive assertions pass with authenticated historical52/55 addition membership and predecessor51/54/50/53/49 scopes. Not current55/58 completeness or fresh fault/test/build evidence.'
specs['docs/planning/EMBARRASSMENT_WRAPPER_EXTENSION_REV1.json']='Historical52 producers55 factories adds guarded embarrassment runtime/direct factory. Guard/source hash/recorded microtask and concurrency tests and exact receipt checked against authenticated predecessor51/54. Scoped historical exclusion not a blanket exemption for future wrappers.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_TESTS_DEV1.json']='Rejected native0.1:1 passed21 failed. Unregistered display115 prevents intended acquired-state witness; nominal rollback test titles do not establish reached fault points. Preserve complete receipt; corrected0.2 cohort separately qualified.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_TESTS_REV1.json']='Historical22 individually passed assertions: exact12 events/component/RNG/presence, strict history coordinates, foreign owners, copied/closed source/handle/seed, forged saves,12 reached stage faults plus commit, Failed, hidden safe views and publicationmicrotask. Not freshly rerun tests.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_REFERENCE_TESTS_REV1.json']='Historical328 individual reference assertions passed; no new suite execution.'
specs['docs/planning/EMBARRASSMENT_PUBLIC_BUILD_REV1.json']='Historical build exit0 with exact log hash; not fresh build.'
specs['docs/planning/embarrassment-public-development-rev1/PRESERVATION.json']='Ten exact archives authenticate rejected0.1 contract/allocation/test receipt plus seven source/test files. Current-source comparison changes only version comments/version constant and display115-to110; psych mathematics, factory, fixture and tests unchanged. No new allocation identity or scheduler edit.'
specs['docs/planning/embarrassment-public-development-rev1/EMBARRASSMENT_PUBLIC_CONTRACT.md']='Superseded native0.1 contract proposed unregistered display115. Retained failed proposal, not accepted0.2 proof or authority to extend closed phase registry. Later parent-ordered110 amendment makes corrected sequence explicit.'
specs['docs/planning/embarrassment-public-development-rev1/EMBARRASSMENT_PUBLIC_ALLOCATION_TABLE.json']='Archived0.1 table binds superseded contract; same17 record identities/fields and namespace as corrected table. Does not prove erroneousphase115 executable. Preserve original contract binding rather than rewriting archive.'
specs['docs/planning/embarrassment-public-development-rev1/EMBARRASSMENT_PUBLIC_TESTS_DEV1.json']='Exact duplicate of1-pass21-fail development receipt; same unregistered-phase cohort, not independent additional tests or qualifying reached fault coverage.'
for i in range(69):specs[(P/f'EMBARRASSMENT_PUBLIC_RUN_{i}_REV1.json').as_posix()]=f'Frozen native worker{i}: six instants72 actual stages, seven whole Save132 originals/restored successors freshly match entire original receipt; all component rows, physical presence, RNG and safe hashes equal. Separate complete/display110 events, not framing. No full-tail claim.'
plan=load(P/'EMBARRASSMENT_PUBLIC_PLAN_REV1.json');assert len(plan['models'])==6 and len(plan['runs'])==69 and plan['prefixes']==483
assert plan['predecessorSha256']==ref(P/'EMBARRASSMENT_PLAN_REV1.json')['sha256']
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
parts=[load(O/f'replay-part{i}.json') for i in range(3)];assert all(x['status']=='PASS' for x in parts) and sum(x['cases'] for x in parts)==69 and sum(x['prefixes'] for x in parts)==483
checks=[x for part in parts for x in part['checks']];assert sorted(x['index'] for x in checks)==list(range(69))
for x in checks:assert x['resultSha256']==ref(P/f'EMBARRASSMENT_PUBLIC_RUN_{x["index"]}_REV1.json')['sha256']
for i in range(69):
 r=load(P/f'EMBARRASSMENT_PUBLIC_RUN_{i}_REV1.json');old=load(P/f'EMBARRASSMENT_RUN_{i}_REV1.json')
 assert r['rows']==old['snapshot']['rows'] and r['addresses']==old['snapshot']['addresses'] and r['traceEvents']==72
 assert r['presence']==[x['present'] for x in old['snapshot']['world']] and r['componentReceiptSha256']==ref(P/f'EMBARRASSMENT_RUN_{i}_REV1.json')['sha256']
for name,n in [('TESTS',22),('REFERENCE_TESTS',328)]:
 t=load(P/f'EMBARRASSMENT_PUBLIC_{name}_REV1.json');assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
 if n==22:
  titles={a['title'] for a in leaves}
  for stage in ['context','appraise','reasons','decision','intent','expression','plan','attempt','complete','display','observe','learn','commit']:assert 'native Failed rollback at reached '+stage in titles
  assert 'whole-wrapper barrier spans commit through RNG ledger publication microtask' in titles
failed=load(P/'EMBARRASSMENT_PUBLIC_TESTS_DEV1.json');assert not failed['success'] and (failed['numPassedTests'],failed['numFailedTests'],failed['numPendingTests'])==(1,21,0)
leaves=[a for f in failed['testResults'] for a in f['assertionResults']];assert len(leaves)==22 and sum(a['status']=='passed' for a in leaves)==1
bad=[a for a in leaves if a['status']=='failed'];assert len(bad)==21 and all('event phase is not registered' in '\n'.join(a['failureMessages']) for a in bad)
b=load(P/'EMBARRASSMENT_PUBLIC_BUILD_REV1.json');assert b['status']=='PASS' and b['exitCode']==0 and ref(b['log'])['sha256']==b['logSha256']
a=load('docs/formal/EMBARRASSMENT_PUBLIC_ALLOCATION_TABLE.json');old=load(P/'embarrassment-public-development-rev1/EMBARRASSMENT_PUBLIC_ALLOCATION_TABLE.json')
assert a['namespace']==old['namespace']==1165 and a['records']==old['records']
assert a['contractSha256']==ref('docs/formal/EMBARRASSMENT_PUBLIC_CONTRACT.md')['sha256'] and old['contractSha256']==ref(P/'embarrassment-public-development-rev1/EMBARRASSMENT_PUBLIC_CONTRACT.md')['sha256']
assert [x['typeId'] for x in a['records']]==list(range(1468,1485)) and all(x['schemaVersion']==1 for x in a['records'])
assert all([f['id'] for f in x['fields']]==list(range(1,len(x['fields'])+1)) and all(f['required'] for f in x['fields']) for x in a['records'])
preserved=[]
for a in load(P/'embarrassment-public-development-rev1/PRESERVATION.json')['files']:
 assert ref(a['archive'])['sha256']==a['sha256'];preserved.append(ref(a['archive']))
 if a['path'].endswith('.ts'):
  original=Path(a['archive']).read_text(encoding='utf-8');current=Path(a['path']).read_text(encoding='utf-8')
  assert original.replace('embarrassment-public/0.1-candidate','embarrassment-public/0.2-candidate').replace("['display',115]","['display',110]")==current
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','replay-part0.json','replay-part1.json','replay-part2.json']]+[ref('scripts/'+n+'.mjs') for n in ['check-history-embarrassment-public-closure','replay-history-embarrassment-public','check-embarrassment-public','qualify-embarrassment-public']]+[ref(P/'campaign3-history-embarrassment-rev1/review.json')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='NATIVE EMBARRASSMENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
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
obs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='NATIVE EMBARRASSMENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh69 native cases483 prefixes414 advancing69 terminal,4968 actual events, exact original receipt/component rows/presence/RNG. One successor per prefix, not full tails.','Historical22/328 tests/build authenticated, not rerun. Historical52/55 addition membership not current55/58 exhaustive inventory.','Rejected0.1 phase115 cohort21 failed1 passed before acquisition does not earn reached fault coverage;0.2 uses parent-ordered complete/display110 without scheduler or field changes.','Frozen next-instant frame summary is erroneous metadata, already corrected explicitly in findings; embarrassment has no framing state or operation.','Retain all component calibration, unknown, report trust/norm scope, coincident affect-coordinate and cue/choice/execution distinctions; no general social emotion or physiology claim.'])

check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

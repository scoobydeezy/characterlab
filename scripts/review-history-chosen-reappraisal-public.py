"""Chosen reappraisal component authority and independent arithmetic review."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chosen-reappraisal-public-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
specs['docs/formal/CHOSEN_REAPPRAISAL_PUBLIC_CONTRACT.md']='Accepted native0.1 successor preserves component and older instructed model. Eight typed originals, twelve actual scheduler phases, context/learning/frame own disjoint roots. Only prior knowledge1463 can author frame lineage; observation/learning140 cannot retroactively affect50 or60. Separate intent/expression/attempt/completion. Strict copied input/opaque model/empty S0 admission and complete Save132 replay. No physical protection, external work, relief evidence or new benefit law.'
specs['docs/formal/CHOSEN_REAPPRAISAL_PUBLIC_ALLOCATION_TABLE.json']='Accepted nine schema1 records1459..1467 in existing namespace1165, exact contract hash. Closed profile/original/goal/context/reasons/completion/learning/frame schemas; no caller-chosen strategy or affect. Typed vocabulary alone is not authority; native registered owners and scheduler evidence separately required.'
specs['docs/planning/CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md']='VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001:4 models43 runs387 native prefixes344 advancing43 terminal,96 events per run. Every component row and random address preserved by actual twelve phases and disjoint goal/knowledge/frame owners. Whole safe views preserve hidden-source contrasts. Separate Failed lifecycle, restore and wrapper guard. Historical21/328 tests/build; then51/54 inventory is dated, not current55/58. Immediate native gate discharged, wider generalization remains.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_FINDINGS.md']='Preserves first TypeScript mechanical duplicate Public suffix/missing record schema and20-pass1-fail helper cohort before frozen qualification. requires undefined/1 occurred in nativeRows before comparison; correction was test helper, not behavioral change. Each stage reserves slot; safe coordinates independent of physical source. Native failure terminal unlike component retry; whole publication spans RNG commit/cleanup. No general planning, physical protection or Task/Biological join.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_PLAN_REV1.json']='Frozen dependency manifest and4 native models43 original run bindings, predecessor hash, explicit experiment/comparison before qualification. Fresh audit recomputes identities, fixture originals and artifact lists; no source refreeze or seed substitution.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_RESULT_REV1.json']='Aggregate exact43-worker/predecessor joins,344 rows and RNG equality. Fresh native original execution and all387 prefix restores reproduce entire original worker result, phases96 per run and safe hashes. One successor per complete prefix, not full continuation tails.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json']='Original closure/result bindings authenticate with historical51/54 wrapper membership separately checked through predecessor50/53 and49/52. Historical test/build receipts not fresh runs; current directory completeness is not inferred.'
specs['docs/planning/CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json']='Historical51 producers54 factories: unchanged independently authenticated prior50/53 plus guarded chosen runtime/direct factory. Source hashes, guard/test and exact extension receipt checked. Historical exclusion loader is bounded to authenticated added paths; no blanket future exemption.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_TESTS_DEV1.json']='Preserved20 passed1 failed among21. Failure is first component-correspondence row extraction requiring undefined/1 in nativeRows helper, before semantic comparison. Other20 passes retained. Not a rejected scientific model/run cohort and not relabeled fully passed.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_TESTS_REV1.json']='Historical21 passes, all assertion leaves checked. Twelve reached stage faults plus commit after actual draws, terminal Failed rollback, cross-owner rejection, closed sources/handles/seeds, forged-save/foreign-model rejection, copying and hidden views. Two publication tests include queued microtask across RNG-ledger publication. Not freshly rerun tests.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_REFERENCE_TESTS_REV1.json']='Historical328 individual passing reference assertions, no fresh test or wider-suite claim.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_BUILD_REV1.json']='Historical successful exit0 TypeScript/build with exact log hash, not fresh build.'
for i in range(43):specs[(P/f'CHOSEN_REAPPRAISAL_PUBLIC_RUN_{i}_REV1.json').as_posix()]=f'Frozen native worker{i}: all nine Save132 prefixes freshly restore by original execution and exact next-save equality, then entire original receipt equality. Twelve actual stages per instant,96 events, exact component344-row cohort and RNG correspondence, whole observer bytes. Native identities distinct from component despite same psychological coordinates.'
plan=load(P/'CHOSEN_REAPPRAISAL_PUBLIC_PLAN_REV1.json');assert len(plan['models'])==4 and len(plan['runs'])==43 and plan['prefixes']==387
assert plan['predecessorSha256']==ref(P/'CHOSEN_REAPPRAISAL_PLAN_REV1.json')['sha256']
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
parts=[load(O/f'replay-part{i}.json') for i in range(3)];assert all(x['status']=='PASS' for x in parts)
assert sum(x['cases'] for x in parts)==43 and sum(x['prefixes'] for x in parts)==387
checks=[x for part in parts for x in part['checks']];assert sorted(x['index'] for x in checks)==list(range(43))
for x in checks:assert x['resultSha256']==ref(P/f'CHOSEN_REAPPRAISAL_PUBLIC_RUN_{x["index"]}_REV1.json')['sha256']
for i in range(43):
 r=load(P/f'CHOSEN_REAPPRAISAL_PUBLIC_RUN_{i}_REV1.json');old=load(P/f'CHOSEN_REAPPRAISAL_RUN_{i}_REV1.json')
 assert r['rows']==old['snapshot']['rows'] and r['addresses']==old['snapshot']['addresses'] and r['traceEvents']==96
 assert r['componentReceiptSha256']==ref(P/f'CHOSEN_REAPPRAISAL_RUN_{i}_REV1.json')['sha256']
for name,n in [('TESTS',21),('REFERENCE_TESTS',328)]:
 t=load(P/f'CHOSEN_REAPPRAISAL_PUBLIC_{name}_REV1.json');assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
 if n==21:
  titles={a['title'] for a in leaves}
  for stage in ['context','appraise','reasons','decision','intent','expression','plan','attempt','complete','observe','learn','frame','commit']:assert 'native Failed rollback at reached '+stage in titles
  assert 'whole-wrapper barrier spans commit through RNG ledger publication microtask' in titles
failed=load(P/'CHOSEN_REAPPRAISAL_PUBLIC_TESTS_DEV1.json');assert not failed['success'] and (failed['numPassedTests'],failed['numFailedTests'],failed['numPendingTests'])==(20,1,0)
leaves=[a for f in failed['testResults'] for a in f['assertionResults']];assert len(leaves)==21 and sum(a['status']=='passed' for a in leaves)==20
bad=[a for a in leaves if a['status']=='failed'];assert len(bad)==1 and 'requires undefined/1' in '\n'.join(bad[0]['failureMessages']) and 'nativeRows' in '\n'.join(bad[0]['failureMessages'])
build=load(P/'CHOSEN_REAPPRAISAL_PUBLIC_BUILD_REV1.json');assert build['status']=='PASS' and build['exitCode']==0 and ref(build['log'])['sha256']==build['logSha256']
a=load('docs/formal/CHOSEN_REAPPRAISAL_PUBLIC_ALLOCATION_TABLE.json');assert a['namespace']==1165 and a['contractSha256']==ref('docs/formal/CHOSEN_REAPPRAISAL_PUBLIC_CONTRACT.md')['sha256']
assert [x['typeId'] for x in a['records']]==list(range(1459,1468)) and all(x['schemaVersion']==1 for x in a['records'])
assert all([f['id'] for f in x['fields']]==list(range(1,len(x['fields'])+1)) and all(f['required'] for f in x['fields']) for x in a['records'])
preserved=[]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','replay-part0.json','replay-part1.json','replay-part2.json']]+[ref('scripts/'+n+'.mjs') for n in ['check-history-chosen-reappraisal-public-closure','replay-history-chosen-reappraisal-public','check-chosen-reappraisal-public','qualify-chosen-reappraisal-public']]+[ref(P/'campaign3-history-chosen-reappraisal-rev1/review.json')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='NATIVE CHOSEN REAPPRAISAL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
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
v=dict(status='NATIVE CHOSEN REAPPRAISAL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh43 native cases387 prefixes344 advancing43 terminal,4128 actual events, entire original receipt/component row and RNG equality. One successor per prefix, not full tails.','Historical21/328 tests/build authenticated, not rerun. Historical51/54 wrapper membership is not current55/58 completeness.','Native Failed is terminal; component retry remains separate. Structural Save132 parsing never installs supplied state.','Fixed appraisal factors leave projection coordinates equal in this cohort; no dimensional-reduction or universal benefit law claim.','Completion/goal/opportunity sources are controlled; no physical protection, external work outcome, spontaneous goal discovery, learned efficacy or global cognition/biology join.','Preserve20-pass1-fail nativeRows helper receipt and earlier TypeScript scaffolding corrections; no failed frozen scientific cohort invented or discarded.'])

check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))

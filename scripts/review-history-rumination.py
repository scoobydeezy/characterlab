from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-rumination-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/RUMINATION_PUBLIC_CONTRACT.md': 'Accepted rumination-public0.1: controlled unresolved-task journal, later recurrent access, internal/external occupancy and inherited CONTROL actual inhibition/reason-dice/intent70/expression80/execution separate. Fixed observation reservation even on absence. Repeated access creates no evidence/reward learning. EveryOpportunity/NoRecurrence/StaticLoad/Alternating retained. Explicit interruption not self-chosen regulation; latest admitted resolution affects next40 only.', 'docs/planning/RUMINATION_READINESS.md': 'Prospective matched external workload and goals with lawful recurrence source and actual consumer. Internal access cannot masquerade as new observation/corroboration. Requires retention/access/occupancy distinction and interruption versus resolution; no general affect/resource ontology.', 'docs/planning/CAMPAIGN3_RUMINATION_QUALIFICATION.md': 'VER-C3-RUMINATION-001:4 models22 distinct runs198 prefixes176 advancing22 terminal;23 executions207 checks include9 duplicate checks.25/328 tests/build historical. Access4/6/7; interruption5 frees inhibition without erasing history; resolution7 releases at8. Actual habit execution and idle at5/8. No clinical/general rumination, self-chosen regulation or memory reinforcement.', 'docs/planning/RUMINATION_IMPLEMENTATION_FINDINGS.md': 'Load-induced behavior alone cannot identify recurrent processing: StaticLoad matches unbroken impairment but persists through interruption; external card also blocks spare slot. Two-slot bound cannot distinguish summed loads though recorded separately. Alternating differs by odd age, not decay. PrivateTruth isolated apparatus bit, not physical model. False resolution releases recurrence without repairing world. First scientific cohorts pass.', 'docs/planning/RUMINATION_PUBLIC_PLAN_REV1.json': 'Frozen23 rows22 run identities and4 models with exact source/experiment/comparison commitments. Inherited neutral-card scope caption understates new source; accepted contract and explicit assertions govern, frozen caption preserved. Unbroken/noInterruption identical canonical run, not independent coverage.', 'docs/planning/RUMINATION_PUBLIC_RESULT_REV1.json': '23 executions207 checks historical,22 unique runs198 unique prefixes. Fresh full stored-view assertions verify access/inhibition timing, stable concern across interruptions, same journals across candidates, safe privacy and actual execution. Duplicate rows preserved unchanged.', 'docs/planning/RUMINATION_PUBLIC_VIEWS_REV1.json': '23 keyed full outputs/single-observer views hash-bound to rows;22 canonical identities. Fresh original semantic assertions distinguish access from occupancy and evidence. Whole views equal under hidden truth/reward/false resolution and denied/nonrecipient/absent source through later draws.', 'docs/planning/RUMINATION_DUPLICATE_CASE_FINDING_REV1.json': 'Preserved inventory flaw: unbroken and noInterruption same RunIdentity, nine duplicate checks. Exact pair guarded, no frozen rewrite. Metadata caption inherited neutral-card language, accepted source broader. Accounting correction not mechanism repair.', 'docs/planning/RUMINATION_CLOSURE_REV1.json': 'Original closure freshly passes artifacts/model/allocation/unique and executed counts.1311..1331; inherited namespace1155, no new namespace;1331/0 historical. Hash closure not fresh simulation.', 'docs/planning/RUMINATION_PRESERVATION_REV1.json': 'Three exact artifacts preserve first passing tests/build and semantic load/source limits; prior CONTROL/RUMINATION identities/scopes remain. No failed research cohort overwritten.', 'docs/planning/RUMINATION_TESTS_REV1.json': 'Historical25 passing assertions including15 stages+commit rollback, actual producers/learning lag, foreign writer/malformed source/initial handle/save/original negatives; no fresh execution.', 'docs/planning/RUMINATION_REFERENCE_TESTS_REV1.json': 'Historical328 reference PASS leaves individually authenticated; metadata backing, not fresh tests or new rumination finding.', 'docs/planning/RUMINATION_BUILD_REV1.json': 'Historical build PASS with exact artifact bindings; no fresh build or full active-suite claim.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'RUMINATION_CLOSURE_REV1.json'),ref('scripts/qualify-rumination-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RUMINATION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'RUMINATION_PUBLIC_RESULT_REV1.json');plan=load(P/'RUMINATION_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'RUMINATION_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==23 and sum(r['prefixes'] for r in v['results'])==207
for i,r in enumerate(v['results']):
 assert set(r)==set('candidate law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==1
for n,count in [('RUMINATION_TESTS_REV1.json',25),('RUMINATION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'RUMINATION_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'RUMINATION_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
finding=load(P/'RUMINATION_DUPLICATE_CASE_FINDING_REV1.json')
assert finding['planSha256']==ref(P/'RUMINATION_PUBLIC_PLAN_REV1.json')['sha256']
unique={r['runIdentity']:r for r in v['results']};assert len(unique)==22 and sum(r['prefixes'] for r in unique.values())==198
pair=[r for r in v['results'] if r['runIdentity']==finding['duplicates'][0]['runIdentity']]
assert [r['name'] for r in pair]==['unbroken','noInterruption']
assert {k:x for k,x in pair[0].items() if k!='name'}=={k:x for k,x in pair[1].items() if k!='name'}
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/finding','/disposition','/metadataLimit','/rationale','/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='THIRTEEN RUMINATION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh23 stored case views/22 distinct identities, not198 distinct runtime prefixes or25/328 tests/build.','Nine duplicate checks and inherited neutral-card caption remain preserved, not independent coverage.','Static/external load matches immediate impairment; behavior alone cannot identify recurrence or summed load magnitude.','Controlled task status and explicit interruption, not general Affect, clinical rumination, self-chosen regulation, physical truth dynamics or memory reinforcement.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

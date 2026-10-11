"""Reconcile bounded reserve qualification without conflating component, public or historical scopes."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-contracts-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
specs={'docs/formal/EMBODIED_MODEL_PACKAGING_ACCEPTANCE.md': 'Packaging shape only:329 declared descriptors versus298 decoder pairs/297 inherited declarations;425 slot0 entries82 unions14 others45 roles. Six semantic models plus separate work7, seven run specimens with hidden89 reusing baseline.14 actual inherited component checks do not implement numeric/domain/exact-state/activation closure. EPACK-A/H remained unpassed; later input correction adds I.', 'docs/formal/EMBODIED_PACKAGING_INPUT_REFERENCE_CORRECTION.md': 'Correct-forward459 opportunity versus458 channel-definition transcription.478 refill unchanged. Same outer five-position inputs, phases, nine inputs and source authentication. EPACK-I rejects valid metadata submitted as observation opportunity; no allocation/math/schema renumbering and no old receipt rewrite.', 'docs/formal/EMBODIED_PRESSURE_PROJECTION_CORRECTION.md': 'Source ObserverId field1 versus sample ObserverId field2; sample field1 is ObservationId. Real PRJ correctly rejects old materialized cohort. Corrected seven models/runs have distinct commitments, not aliases.1072 pre-runtime test retry is historical, not new-body behavioral qualification. Exact old/new cohorts reviewed earlier and current47 tests retain old rejection.', 'docs/formal/EMBODIED_RESERVE_PERMANENT_ALLOCATION.md': 'Permanent453..484 schema1:32records128fields,1142 pressure occurrence,43 members including4union pairs.40 direct/1map-key/2collection roles are distinct. Closed461/463 alias has no wrapper identity. Fuel unit profile does not widen old singleton or create unit-conversion machinery.79 declaration roundtrips do not qualify semantic-domain/runtime behavior.', 'docs/formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md': 'Symbolic-only nine seam versions and explicit packet precedence. Anchor-owned physical reserve, transient evidence-relative pressure, no absent-to-known-zero, actual same-opportunity SEM and whole-instant rollback. Host validation differs from character capability. Empty reserve pressure5/6 reflects safe-bin upper bound, not truth-calibrated deficit. CTL001 retained; broader physiology/Need/receiving/learning remain outside. Actual prior qualification and current audit separately discharge bounded execution; intake packet still needs its own whole-source audit.', 'docs/formal/EMBODIED_RECEIVING_PERMANENT_ALLOCATION.md': 'Permanent485..515 schema1:31records110fields.49 text members plus5union pairs means54 typed members, no new namespace.19scalar/1map-key/4collection roles,10occurrence mappings and4nonunion finite domains distinct. Root487 readonly without logical family/writer. Fresh485 numeric checks/six faults preserve exact table, not runtime semantics.', 'docs/formal/EMBODIED_RECEIVING_SHAPE_ACCEPTANCE.md': 'Receiving symbolic scope: pressure0.2 outgoing edge,16 closed stage forms,31records110fields49textmembers. Actual sibling joins and separate grounds;13model recipes include runnable NoCoverage comparator. NoStateWrites new rows, only old deadline/body owners write. Missing forecasts, acquired standing, mixed identity and learning cannot be filled by fake task or relief inputs. ER18/EMB3 unpassed at acceptance, later separately qualified.', 'docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json': 'Exact12-file symbolic packet inventory,13recipes/21frozen runtime vectors. Six finite domains include two union discriminators; numeric table lists four nonunion domains. Fingerprints identify packet only; not acceptance of every unreviewed historical draft claim. Arithmetic/abstract scheduling remain distinct from semantic execution.', 'docs/formal/EMBODIED_RESERVE_ALLOCATION_FREEZE_AUDIT.json': 'Links reviewed proposal and79-roundtrip numeric receipt to permanent table/version and disposition.446 preserved entries were historical; archive-backed identity reconciliation does not claim current working sources unchanged. Runtime/model/parent remained open then.', 'docs/planning/EMBODIED_RESERVE_ALLOCATION_REVIEW_REV1.json': 'Fresh independent Markdown/JSON symbolic/numeric parity, exact unions/roles/members/collision checks and79actual canonical roundtrips reproduce receipt. Original prior registry version resolved through indexed exact archive.298supported schema pairs differ from297declared inherited pairs. Metadata preservation is archive-aware, not new runtime qualification.', 'docs/planning/EMBODIED_RECEIVING_ALLOCATION_REVIEW_REV1.json': 'Fresh485 original checks and6 altered-table rejections reproduce original permanent table and receipt. Prior table scope frozen to exact original18references rather than scanning later allocations and treating self as prior.49textmembers excludes5union pairs; no namespace addition or behavioral qualification.', 'docs/planning/EMBODIED_PACKAGING_COMPONENT_REVIEW_REV1.json': 'Fresh14 actual inherited VAL/state/occurrence checks preserve qualified character, exact map-key grammar/role, readonly/writable separation and4occurrence declarations. Missing pressure role and optional carrier reservation reject. Structural test codec is not production semantic-domain validator; no full EPACK/runtime promotion.', 'docs/planning/EMBODIED_MODEL_PACKAGING_ACCEPTANCE_REV1.json': 'Exact packaging acceptance inventory425/329/82/14/45 with6semanticmodels7specimens1workcontrol.14component checks support bounded expressibility; runtime NOT PASSED and model images NOT FROZEN were proper then-state, not current completion claims. No generic input or declaration interpreter inferred.'}

prior=load(P/'campaign3-history-source-roles-rev134/index.json');known={r['path'] for r in prior['roleAssignments']};assert not set(specs)&known
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']}
fresh=[]
for name in ['EMBODIED_RESERVE_ALLOCATION_REVIEW_REV1.json','EMBODIED_PACKAGING_COMPONENT_REVIEW_REV1.json','EMBODIED_RECEIVING_ALLOCATION_TABLE.json','EMBODIED_RECEIVING_ALLOCATION_REVIEW_REV1.json']:
 r=load(O/name);assert r['status']=='PASS' and ref(r['original']['path'])==r['original'] and ref(r['checker']['path'])==r['checker'];fresh.append(ref(O/name))
assert load(P/'EMBODIED_RESERVE_ALLOCATION_REVIEW_REV1.json')['canonicalDeclarationRoundTrips']==79
assert load(P/'EMBODIED_PACKAGING_COMPONENT_REVIEW_REV1.json')['checked']==14
receiving=load(P/'EMBODIED_RECEIVING_ALLOCATION_REVIEW_REV1.json');assert (receiving['checks'],receiving['negativeControls'])==(485,6)
assert len(receiving['priorAllocations'])==18
manifest=load('docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json');assert len(manifest['files'])==12 and len(manifest['frozenRuntimeVectors'])==21
qualification=load(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.json');assert manifest['frozenRuntimeVectors']==[r['id'] for r in qualification['parent']]+[r['id'] for r in qualification['rows']]
search=load(O/'authority-history-search.json');artifacts=[dict(path=m['path'],sha256=m['sha256']) for r in search['rows'] for m in r['matches']];assert len(artifacts)==3
for a in artifacts:assert ref(a['path'])==a
missing=[r['original'] for r in search['rows'] if not r['matches']];assert len(missing)==1 and missing[0]['path']=='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
fresh += [ref(O/'authority-history-search.json'),ref(O/'intake-finding.json')]+[ref(P/n) for n in ['campaign3-history-embodied-reserve-rev1/review.json','campaign3-history-embodied-receiving-rev1/review.json','campaign3-history-embodied-freeze-rev1/review.json']]
bindings=[]
for p in specs:
 if not p.endswith('.json'):continue
 for a in fingerprints(load(p)):
  path=Path(a['path']);resolved=a['path'] if path.exists() and ref(path)['sha256']==a['sha256'] else archives.get(a['sha256'])
  assert resolved and ref(resolved)['sha256']==a['sha256'],a
  bindings.append(dict(source=p,originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sourceRoles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sourceRoles.append(dict(**ref(p),role='SYMBOLIC ACCEPTANCE / NUMERIC GATE / CORRECT-FORWARD PACKAGING',judgment=j,acceptanceChain=fresh))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/reviewer','/limitation','/deferred')) or '/witness' in ptr or '/obligation' in ptr or '/originalFailure' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='FORMAL EMB GATE DISPOSITIONS RECONCILED; INTAKE/HISTORICAL LEDGER AUTHORITY REMAINS OPEN',sourceRoles=sourceRoles,rows=rows,stringLeaves=len(strings),preservedArtifacts=artifacts,bindings=bindings,pendingAuthorityReferences=missing,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['This batch reviews exact formal acceptance/allocation/correction dispositions, not every paragraph of their cited intake packets.','Three exact authority versions recovered from Git; source possession alone is not whole-source conceptual reconciliation. Earlier mechanism ledger hash remains unrecovered after26 local exact-path versions; no substitute or alias.','Fresh structural/numeric checks remain distinct from earlier separately audited runtime qualification.446 historical preservation references resolve exact archives; current source equality not claimed.','No new law, allocation, model change, verdict, corpus promotion, obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),recoveredAuthorities=3,pendingAuthorityReferences=1,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

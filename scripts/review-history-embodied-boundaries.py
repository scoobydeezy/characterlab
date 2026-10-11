import re
"""Reconcile bounded reserve qualification without conflating component, public or historical scopes."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-boundaries-rev1';B=P/'campaign3-history-universe-rev1'
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
specs={'docs/planning/CAMPAIGN3_EMBODIED_OBSERVATION_ADMISSION_DRAFT.md': 'Distinct finite-level461 and unavailable463 successors preserve old effect203/204 and consumer domains. Exact detached sample handoff plus live same-opportunity SEM support differs from reference/payload lookup; top-level ObserverId PRJ still traces roster read. Unavailable is no-operand metadata, not Known0, maximum pressure, stale evidence or negative reserve evidence.9 SEM checks establish expressibility only. No automatic learning/retention admission; pressure60 uses admitted upper bound/H, not hidden body or failure reason.', 'docs/planning/CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md': 'Original source identity keys transaction-local production/settlement/child/consume state; no public copied trace or serializable token can authenticate it. Six same-DueAt slots10/11/12/13/14/60,5children,3runtime ordinals with private absence padding; no fake227. Only complete-instant restores preserve original sample and refill queues. Branch-variable original event suggestion is superseded by fixed source event; phase0 wording does not create a materialization event. Count equality alone is not authority/noninterference proof.', 'docs/planning/CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md': 'IDN then exact precompiled direct body binding preserves existing PRJ grammar; no chained selector, alternate roster, caller CharacterId, callback or synthetic q leaf. Permission failure retains actual roster read but no anchor read. Exact target equality adds to maximum ReadDomain, and malformed body rejects rather than becoming absence. Earlier embedded bindings, missing channel identity and output277/existing ingress reuse proposals are explicitly corrected by consolidation/field-type review. Actual valid-other-body positive remains component-only; singleton exclusion is not general isolation.', 'docs/planning/CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md': 'External original110 world intervention, not authored learned motive or chosen successful action. Definition-owned qualified target needs no fictitious observer/PRJ. Sole physical writer reads staged anchor, exact expected-prior set, bounded applied/overflow; zero reanchors by law but cannot add stock. Anonymous result remains trace-only, no downstream evidence.6S+R events/5Schildren/3Sordinals; samples60 precede delivery110, no120consequence. Whole-instant rollback includes earlier staged writes; restore validates both pending original families. Earlier empty rounding assertion is superseded by explicit sample-bin quantization, not refill quantization.', 'docs/planning/CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json': 'Fresh original9component checks reproduce exact receipt: one current-lane support-only assembly/reservation/freeze/settlement with empty semantic collections; empty/cross-observer support, wrong phase/reservation and orphan/duplicate reject; no present evidence gives no reservation. This does not authenticate a new observation producer or qualify absent-marker/public runtime behavior.'}

O.mkdir(exist_ok=True)
prior=load(P/'campaign3-history-source-roles-rev136/index.json');known={r['path'] for r in prior['roleAssignments']};assert not set(specs)&known
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']}
sem=load(O/'sem.json');assert sem['status']=='PASS' and sem['checks']==9 and ref(sem['original']['path'])==sem['original'] and ref(sem['checker']['path'])==sem['checker']
original=load(P/'CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json');assert len(original['checks'])==9
shape=load(P/'CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json');qualification=load(P/'CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json');q={r['id']:r for r in qualification['rows']};crosswalk=[]
for path in specs:
 if not path.endswith('.md'):continue
 vectors=[r for r in shape['proofVectors'] if r['source']==path]
 assert len(vectors)=={'EOBS':15,'EING':14,'EREG':12,'EREP':12}[vectors[0]['id'].split('-')[0]]
 for r in vectors:
  assert r['exactLine'] in Path(path).read_text() and q[r['id']]['obligation']==r['exactLine']
  crosswalk.append(dict(id=r['id'],source=path,originalLine=r['exactLine'],laterWitness=q[r['id']]['witness'],scope='Explicit public/component scope in original qualification; current reserve audit separately exercises it.'))
assert len(crosswalk)==53
corrections=[
 dict(source='CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md',old='sample and pressure event types may be distinct by schema branch',successor='CAMPAIGN3_EMBODIED_SYMBOLIC_CONSOLIDATION.md',accepted='One fixed InputOnly sampling EventTypeId at10',meaning='Only generated pressure varies by branch; availability cannot rewrite a compiled original event.'),
 dict(source='CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md',old='ChannelDefinitions, BodyBindings, OutputChoice',successor='CAMPAIGN3_EMBODIED_SYMBOLIC_CONSOLIDATION.md',accepted='LevelSourceDefinition uses BodyBindingDefinitionId in place of embedded BodyBindings.',meaning='One immutable body registry owns shared binding authority.'),
 dict(source='CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md',old='PresentOutputDefinition, UnavailableOutputDefinition',successor='CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md',accepted='PresentOutputSchema',meaning='Exclusive254schema alternatives replace two independently exactly-one277outputs.'),
 dict(source='CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md',old='Ingress reuses the accepted event/phase binding layout',successor='CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md',accepted='LevelPressureIngressDefinition',meaning='Pressure consumes retained sample despite immediate phase14parent emitting227or nothing; old276unchanged.'),
 dict(source='CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md',old='RNG and rounding\noperations are empty in every row.',successor='CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.md',accepted='QuantizationOperations is exactly the singleton operation',meaning='Sample binning gets one hidden trace operation; unavailable/refill remain without quantization.'),
 dict(source='CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md',old='Pre-existing phase0 semantics provide the truth',successor='CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md',accepted='No synthetic phase0 event or materialization patch is added.',meaning='Pure anchor materialization obeys cutoff without another event/cache/writer.')]
for r in corrections:
 assert r['old'] in (P/r['source']).read_text() and r['accepted'] in (P/r['successor']).read_text(),r
fresh=[ref(O/'sem.json')]+[ref(P/n) for n in ['campaign3-history-embodied-reserve-rev1/review.json','campaign3-history-embodied-intake-rev1/review.json','campaign3-history-embodied-contracts-rev1/review.json']]
bindings=[]
for a in fingerprints(original):
 resolved=a['path'] if ref(a['path'])['sha256']==a['sha256'] else archives.get(a['sha256']);assert resolved and ref(resolved)['sha256']==a['sha256']
 bindings.append(dict(source='docs/planning/CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json',originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sourceRoles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sourceRoles.append(dict(**ref(p),role='OBSERVATION / INGRESS / PHYSICAL ACCESS AND WRITER BOUNDARY',judgment=j,acceptanceChain=fresh))
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
r=dict(status='DETAILED EMB SOURCE/INGRESS/WRITER DRAFTS RECONCILED; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,vectorCrosswalk=crosswalk,explicitCorrections=corrections,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh9SEM component checks, not new public producer/admission qualification. Prior47tests/49prefixes and role/runtime faults remain separately scoped evidence; not rerun here.','53exact draft vectors map to later explicit public/component witnesses. Valid-other-body/zero-refill remain component scope; no public general multi-observer or delayed-pressure admission.','Six documented corrections supersede exact draft suggestions only; no old schema/provenance/source byte is rewritten. Channel field and complete typed/vocabulary closure remain next whole-source audit.','Absence disclosure assumes public scheduled self-sampling context; future hidden opportunity or learned failed-sensing inference needs fresh contract.','No allocation/model/law/obligation/corpus/verdict change or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),mappedVectors=len(crosswalk),explicitCorrections=len(corrections),freshSEMChecks=9,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

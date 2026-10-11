"""Scope-reconcile GA admission/persistence contracts and their exact acceptance links."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-public-contracts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'CANONICAL_BODY_PRODUCTION':'Serialization reuses actual contextual selector1143/audit603 and one-use formation1145/549; no canonicalization-time reselection/allocation. Empty selection still audit, no groups means no acquisition. Selection and acquisition IDs separate; actual panel/event-file/experience context, no invented sensory/trial/truth IDs.1045 symbols need exact model membership. Capability closes/consumes on failure; outer whole-instant transaction owns allocator/trace/state rollback. Output may leave character state identical; codec output not public source/PRJ/role admission.',
'CANONICAL_RECALL_PROJECTION':'Decode whole admitted ledger before event/body partition; same observer,unique acquisitions strictly prior to receiving. Copy surviving positive evidence and exact source identity/time/version, never reconstruct losses. Erase use/significance metadata so it cannot affect ranking through this projection. Detached values/empty partitions no mutation/allocation. Trusted leaf/observer not public authority; accessor must enforce provenance/read-domain/cue gate before leaf read. Shared body projection does not collapse goal-baseline versus ordinary recall policy.',
'CODEC_COMPONENT':'Exact schema/version/primitive/union grammar under cenc; inherited attention+embodied registries must agree, unchanged owner decoders retained. Round-trip through authoritative registry prevents forged nested-schema bypass; sets/maps ordering/duplicates unchanged. VersionText/LatticeMass require trusted compiled context, not value-derived context. Structural validity not cross-field/source/subject/state authority. Closed322/705 write union only in706;704 remains322-only. Wildcard declaration does not waive actual-target qualification.',
'COMPLETE_PREFIX':'Exact closed S0/calendar/32-byte seed; generated events never original authority. Save132 binds model/run,clock,state,three allocators,queue,trace,outputs and ordered649 analytical anchors. Deterministic profile has no random-relevant IDs or continuing inputs; not generic permission to omit them elsewhere. Restore reconstructs identity from actual original S0/calendar/seed, reexecutes full prefix and compares entire save bytes, returning that live runtime to rebuild private pending capabilities. Clock/state/count equality alone insufficient. No arbitrary warm state,mid-transition save or callbacks; deterministic replay not psychological equivalence.',
'PRIMITIVE_GRAMMAR_COMPONENT':'Canonical encoding before exact domains; generic Rational unrestricted, maintenance field owns0..100/order. Nonnegative signedint64 time,positive field ordinal and unsigned original address do not establish actual schema/run membership. Glyph/cell0..7,view0..2,count0..3,SourceBound32 and67-template phases incl110/excl150 are finiteprofile domains. Committed scale1..1000 bounds lattice; exact compiled version whitelist, canonical Boolean not unsigned tag. No record/role/source/compiler admission from primitive checks.',
'TRACE_BINDING':'Actual event160 trace0.2;706 supplies exact seam/version/read domain, inherited stages retain own bindings. Recursive unique source-occurrence index is diagnostic omniscient trace metadata, never character evidence or roster read. Actual/derived paths constrained to domains and snapshot values; accessor still enforces erasure/subject. Terminal owner groups prepare commonB0, earliest owner event carries combined reads/patch/diffs, later contributions emptypatch but retain ancestry. Formation governance stays separate protocol InvariantResults, not cognitive patch/read or recall. Final traces only after successful apply; whole-save replay includes trace/queue/allocator. No fake draws/quantization.',
'CARRIER_SHAPE_ACCEPTANCE':'163 symbolic layouts165 scalar positions208 recursive boundaries and six proposed families accepted representationally; no numeric allocation or mechanism/law/authority change.67 templates/8 projections/fixed members need own gates. Immediate full acquisition loss, independent graph/episodes and erased retention metadata preserved. Historical fault counts are structural controls, not executed public branches. Output reviewREV2 binds declarationsREV3; no revision contradiction. Public missing-facet/profile exclusions and same-run feedback remain separate.',
'CARRIER_ALLOCATION_ACCEPTANCE':'Permanent542..704/1,523fields,38field-local tags,11distinct unions and six namespaces; no shifting/reuse or semantic adjacency.165 numeric role positions retain domain obligations, not compiled roles/member admission. Five owner annotations not actual output-slot execution.16 historical allocation faults/20prior tables are numerical evidence; fixed members/context/model/public gates still separate. No new allocation by this review.',
'REGISTRY_MEMBER_SHAPE_ACCEPTANCE':'218symbolic members identify67templates/eight projections/six scopes; names confer no access. No new causal edge/perception authority on old models, cognitive protocol or physical accessor. Maintenance predicate does not replace spec/content/holder coupling. Separate numeric member gate; historical12shape controls not public execution.',
'REGISTRY_MEMBER_ALLOCATION_ACCEPTANCE':'218exact payloads in existing namespaces,zero new records/namespaces; no aliases/renaming. Eight historical numeric faults and21preserved tables do not authenticate model definitions,source/profile,roles,paths,slots or work ceiling. Old corpus status is chronological, not current corpus0.29 regression.',
'WRITE_SCOPE_SHAPE_ACCEPTANCE':'Two-record representational successor corrects expressibility without changing authority.322ReadOnly and322character-learning retain scope; onlytwo perception,two goal owners andphysical replenishment use explicit path authorization. No protocol-root permission. Exact patterns/holder qualification required; frozen704 unchanged, not alias. Eight structural controls do not allocate or execute.',
'WRITE_SCOPE_ALLOCATION_ACCEPTANCE':'705/1 and706/1,13fields and322/705union append-only;seven historical numeric controls and22prior tables preserved. Zero newnamespace/member. Old704 not alias or broadened. Fixed scope checks/model/public execution remain separate; no permanent assignment changed here.'
}
notes={(F/('GENERAL_ATTENTION_'+k+'.md')).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev187/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
bindings=[];manifests=[]
for kind in ['CARRIER','REGISTRY_MEMBER','WRITE_SCOPE']:
 for mode in ['SHAPE','ALLOCATION']:
  p=F/f'GENERAL_ATTENTION_{kind}_{mode}_MANIFEST.json';manifests.append(ref(p))
  for f in load(p)['files']:assert ref(f['path'])==f;bindings.append(dict(owner=p.as_posix(),**f))
for n,count in [('GA_CARRIER_ALLOCATION_REVIEW_REV1.json',16),('GA_REGISTRY_MEMBER_ALLOCATION_REVIEW_REV1.json',8),('GA_WRITE_SCOPE_ALLOCATION_REVIEW_REV1.json',7),('GA_OUTPUT_DECLARATIONS_REVIEW_REV2.json',14)]:
 v=load(P/n);assert len(v['faults'])==count and all(f['rejected'] for f in v['faults'])
 for f in v['sources']:assert ref(f['path'])==f;bindings.append(dict(owner=(P/n).as_posix(),**f))
assert load(P/'GA_OUTPUT_DECLARATIONS_REVIEW_REV2.json')['sources'][0]['path']=='docs/planning/GA_OUTPUT_DECLARATIONS_REV3.json'
chain=[ref(P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),ref(P/'campaign3-history-retained-selection-contracts-rev1/review.json')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256'],p
 sources.append(dict(**ref(p),role='GA REPRESENTATION/ADMISSION CONTRACT; HISTORICAL ACCEPTANCE WITH SEPARATE PUBLIC GATE',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE',judgment=notes[u['source']]))
O.mkdir(exist_ok=True)
save('review.json',dict(status='TWELVE GA PUBLIC/ACCEPTANCE CONTRACTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,acceptanceManifests=manifests,exactBindings=bindings,preservedArtifacts=[],limits=['Six manifests and referenced source hashes verified; numerical fault records remain historical, no writer or fault suite rerun. Manifests are backing here, not automatically whole reviewed scientific sources.','Symbolic shape,numeric/member acceptance,codec,model compilation,public source/owner and persistence proofs are separate; old OPEN labels superseded only within later bounded GA qualification.','No new model/allocation/runtime/build/verdict/corpus/obligation change. Existing historical source gaps,formula provenance,legacy log and independent adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED GA PUBLIC CONTRACT RECONCILIATION',sources=12,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,acceptanceManifests=6,exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

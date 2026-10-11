"""Historical attention construction, source proposal and supersession audit."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-attention-construction-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield v
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
add('CAMPAIGN3_ATTENTION_DRAFT.md','Historical unaccepted revision1 proposed Cause/Target/Incidental residual-priority finite selection. Actual initial SEM could not derive Cause/Incidental. Superseded first profile, not silently qualified by later participant weighting. Residual allocation and encoding budgets remain separate; unknown role cannot become Incidental. All AT-A..N then unpassed.')
add('CAMPAIGN3_ATTENTION_INSPECTION.md','Historical substrate investigation separates phase10 perception,14 freeze,15 role derivation,20 recognition and later active control. Frozen body source lacks plural pool; task workspace and typed measurement memory do not supply attention encoding. Historical multiplicative/residual models remain controls, retired tagging/authored attention flags not admitted. No implementation proof.')
add('CAMPAIGN3_ATTENTION_CLOSURE_REV2.md','Forward proposal corrects unsupported roles to Actor/Target/Participant and phase40 active control; separates trace audit from selected consumer capability. No residual-pool replacement, early sensory gating or task-workspace equivalence. Proposal to use projectEventRoleEvidence before track creation subsequently refined by source closure. Fourteen AT2 obligations were not passed by eight SEM checks.')
add('CAMPAIGN3_ATTENTION_COMPONENT_CHECKPOINT.md','Original11-test/five-mutant component qualification with no new persisted/public record or identity. First empty fixture lacked required supporting observation; corrected source has observation but zero units. Actual claim rederivation and revocable selected-only copies preserve authority. Canonical ordering correction later supersedes source fingerprints; no public qualification at this point.')
add('CAMPAIGN3_ATTENTION_SOURCE_CLOSURE_REV1.md','Three physical ports with fixed truth cardinality and independent denied/exact/unresolved modes. New observation freezes role evidence10 before actual tracking11/binding12; no downstream truth reread. Empty branch reserves no experience, K0 preserves actual evidence. Fresh64 component mask cases96 hidden substitutions match original; graph counts proposed, not scheduler proof. Excludes multiple roles on one public unit.')
add('CAMPAIGN3_ATTENTION_PUBLIC_INTEGRATION_REV1.md','Historical24-record69-field inventory establishes selected-only receipt, observer-only diagnostic refinement, explicit output/slot budgets and whole-prefix obligations. V04 cannot admit identity-free wrappers/tracking unchanged; dedicated finite compiler chosen, not weakened V04 or forged identities. Later26-record declaration closes abstract union layouts; not whole-shape acceptance itself.')
add('CAMPAIGN3_ATTENTION_MODEL_CHECKPOINT.md','32-model/224-run packaging checkpoint, not execution. Historical65 image checks/seven corruption controls. Reported four-byte seed stopped first materialization;12 partial images remain. Later list-S0 admission flaw invalidates all224 original runs despite correct model identities; corrected public cohort previously audited. No admission assurance inferred from independent image review.')
specs['docs/formal/ATTENTION_COMPONENT_SHAPE_ACCEPTANCE.json']='Pure computation/ephemeral capability exception: no permanent record, namespace, public input or persisted schema. Does not authorize unregistered later public wrappers or bypass producer proof.'
add('ATTENTION_COMPONENT_QUALIFICATION_REV1.json','Twelve AC vectors supported by historical11 passing tests/five source mutants,1148 active tests and453 EMB fingerprints. All direct bindings resolved including three exact pre-order source reconstructions. Later order bug does not erase original bounded evidence or promote old hashes to current. Historical reference328 retained not rerun.')
add('ATTENTION_COMPONENT_TESTS_REV1.json','Ten passes and one preserved empty-source fixture failure: at least one supporting observation required. SEM contract unchanged; actual component fixture repaired, not a production defect.')
add('ATTENTION_COMPONENT_TESTS_REV2.json','Eleven historical passes after empty fixture correction; later decimal-boundary witness absent here. Current12-test coverage belongs to separate prior audit, not this old receipt.')
add('ATTENTION_COMPONENT_MUTANTS_REV1.json','Five historical alternatives detected on pre-order source. Exact old source/fixture bytes reconstructed by reversing documented changes and matching committed hashes; no Git provenance claim. Later five-mutant revision differs in collateral access result for reversed ranking and is kept separately.')
add('ATTENTION_SOURCE_COMPOSITION_REV1.json','Fresh complete behavior equality for64 visible/unresolved mask pairs and96 hidden-role checks. Only27 effective mask classes and21 unique safe digests; not64 distinct public models. Actual SEM/tracking/reservation/role derivation, selected reads and source slot arithmetic; event counts are manually proposed graph, no scheduler execution.')
add('ATTENTION_SEM_COMPONENT_REVIEW_REV1.json','Fresh eight checks reproduce actual supported role claims and reject foreign observer indexes. Initial rule has neither Cause nor Incidental. Explicit fixtures/local counters only, no public observer source or selection qualification.')
add('ATTENTION_SOURCE_CHECKPOINT_REVIEW_REV1.json','Historical composed1149=1148 minus11 plus12,134 files, six mutants and64/96 source evidence. Exact old and then-current source hashes authenticated separately. Source construction still not public shape or execution; no full-suite freshness claim.')
add('ATTENTION_MODEL_REVIEW_REV1.json','Historical independent image reader65 checks,32 identities224 commitments and seven declared recipe corruptions. All138 reviewed-file bindings exact; earlier canonical freeze audit corroborates commitments. Does not validate old list S0 for state restore or prove public compiler rejection.')
add('attention-model-review-rev1/INCOMPLETE.json','Preserved report of four-byte seed failure before first cohort completion. Twelve partial hex files equal corresponding completed images; absent REVIEW/FREEZE. Reported sourceHash545c... has not been recovered; do not claim exact original failing materializer authenticated. Scoped provenance debt retained in audit findings.')
add('attention-model-review-rev2/REVIEW.json','Completed proposal32 models224 run commitments,32-byte seed,323 descriptors105 entries. Exact original model/source/shared-file identities, predecessor to frozen cohort. Empty-list S0 subsequently superseded for admission; commitment recomputation is not valid runtime execution.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev129/index.json')['roleAssignments']};assert not set(specs)&set(prior)
recovered=load(O/'source-recovery.json')['rows'];mapping={x['sha256']:x['path'] for x in recovered}
mapping['48aee9c0e57d825ad3d1c9829d1bd11b5ade16e2025df2ba7422420a1af3943d']='docs/planning/campaign3-history-attention-public-rev1/attentionSelection.original.ts'
bindings=[]
for p in specs:
 if p.endswith('.json'):
  for a in refs(load(p)):
   resolved=mapping.get(a['sha256'],a['path']);assert ref(resolved)['sha256']==a['sha256'],(p,a)
   bindings.append(dict(source=p,originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
for n in ['source-composition','sem-components']:
 r=load(O/(n+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref(r['checker']['path'])==r['checker']
 for b in r['bindings']:
  for k in ['historical','current']:assert ref(b[k]['path'])==b[k]
composition=load(P/'ATTENTION_SOURCE_COMPOSITION_REV1.json');assert (composition['cases'],composition['hiddenRoleEqualityChecks'])==(64,96)
assert len(composition['results'])==64
assert len({(r['visible'],r['unresolved']&r['visible']) for r in composition['results']})==27
assert len({r['safeDigest'] for r in composition['results']})==21
for r in composition['results']:
 n=r['visible'].bit_count();q=(r['visible']&~r['unresolved']&7).bit_count()
 assert (r['units'],r['claims'])==(n,q)
 assert (r['runtime'],r['sourceEvents'],r['sourceOutputs'])==((7+2*n+q,7,4+2*n+q) if n else (5,2,2))
for rev,counts in [(1,(10,1)),(2,(11,0))]:
 t=load(P/f'ATTENTION_COMPONENT_TESTS_REV{rev}.json');a=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(a)==11 and (t['numPassedTests'],t['numFailedTests'])==counts
 if rev==1:assert 'at least one supporting observation is required' in next(x for x in a if x['status']=='failed')['failureMessages'][0]
 else:assert all(x['status']=='passed' and not x['failureMessages'] for x in a)
assert len(load(P/'ATTENTION_COMPONENT_QUALIFICATION_REV1.json')['rows'])==12
m=load(P/'ATTENTION_COMPONENT_MUTANTS_REV1.json');assert len(m['results'])==5 and all(x['detected'] for x in m['results'])
m=load(P/'ATTENTION_MODEL_REVIEW_REV1.json');assert len(m['checks'])==65 and len(m['negativeControls'])==7 and len(m['reviewedFiles'])==138
proposal=load(P/'attention-model-review-rev2/REVIEW.json');assert len(proposal['models'])==32 and len(proposal['runs'])==224 and len(bytes.fromhex(proposal['seed']))==32
assert all(x['descriptors']==323 and x['registryEntries']==105 for x in proposal['models'])
old=P/'attention-model-review-rev1';partial=sorted(old.rglob('*.hex'));assert len(partial)==12 and not (old/'REVIEW.json').exists() and not (old/'FREEZE.json').exists()
for p in partial:assert p.read_bytes()==(P/'attention-model-review-rev2'/p.relative_to(old)).read_bytes()
archives=[ref(x['path']) for x in recovered]+[ref(p) for p in partial]
chain=[ref(O/(n+'.json')) for n in ['source-recovery','source-composition','sem-components']]+[ref(P/'campaign3-history-attention-freeze-rev1/canonical-check.json'),ref(P/'campaign3-history-attention-public-rev1/review.json')]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ATTENTION CONSTRUCTION / PROPOSAL / SUPERSESSION',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/reason','/remainingPublicGate')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='ATTENTION CONSTRUCTION RECONCILED WITH EXPLICIT PROVENANCE LIMIT; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=archives,bindings=bindings,obligations=['RO-C3-004','RO-C3-006','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh64 component mask pairs96 hidden comparisons/eight SEM checks; event counts are proposal arithmetic, not fresh scheduler runs.27 effective masks and21 unique safe digests, no count inflation.','Three pre-order source reconstructions match frozen hashes; no Git provenance claim. Twelve partial materialization images match completed counterparts; original four-byte failing script hash unrecovered.','Old Cause/Incidental residual proposal superseded for first profile, its research question retained. Participant weighting does not discharge residual/encoding obligations.','Model identity/image review did not prove initial-state admission. Prior public audit preserves list-to-set correction; no original models/receipts edited.','Historical routing hash in ATTENTION_CLOSURE_REVIEW_REV2 is outside this batch; remaining declaration, allocation and draft-review receipt chain still requires reconciliation.'])
c=dict(status='PASS WITH EXPLICIT PROVENANCE LIMIT; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),bindings=len(bindings),checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

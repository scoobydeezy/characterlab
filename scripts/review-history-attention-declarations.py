"""Reconcile symbolic attention design, accepted declarations and permanent allocation."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-attention-declarations-rev1';B=P/'campaign3-history-universe-rev1'
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
add('ATTENTION_PUBLIC_INVENTORY_REV1.json','Fresh whole24-record69-field symbolic inventory equals original: ten stages, exact graph/budget formulas, observer-only subject and selected read receipt. Abstract unions not final canonical layouts; replaced by explicit tagged declaration records. Ten design checks are not runtime admission.')
add('ATTENTION_PUBLIC_INVENTORY_REVIEW_REV1.json','Fresh ten original symbolic checks reproduced and complete receipt equal. Unique types, closed references, two occurrence families, no CharacterId, acyclic phases, tracking-only writes, selected terminal consumer, bounds and component-source scope. Does not freeze shape or authenticate actual children.')
add('CAMPAIGN3_ATTENTION_DECLARATION_CLOSURE_REV1.md','Finite recipe declaration, not generic transition language.26 records89 fields, ten stages, explicit source/read unions, exact required/forbidden fields, nested slot ownership and private experience reservation.62 scalar roles plus two map-key roles, three collection checks, separate governed scene-object compiler.297 inherited descriptors are not inherited executable entries. Future runtime child provenance, whole trace/rollback/save and strict model admission remain separate obligations.')
add('ATTENTION_SYMBOLIC_DECLARATIONS_REV1.json','Fresh symbolic review verifies closed field grammar, ten parent/phase/write rows, two tagged unions, namespace/validator constraints,52 members, three collection checks, seven scenes32 recipes,297 inherited descriptors and11 occurrence rules. Existing373/schema2 remains declared; old schema1 decoder support not promoted. Exact original builder/inherited source hashes retained.')
add('ATTENTION_DECLARATION_CLOSURE_REVIEW_REV1.json','Fresh four substantive checks and12 symbolic corruptions reproduce original receipt. Generic CONTENT accepts three governed objects; old character-only VAL rejects them. Correct occurrence-field ownership and required scalar fields checked against actual SEM. Historical occurrenceIdentity hash resolves to prior archive; current modules execute checks. No general runtime proof.')
specs['docs/formal/ATTENTION_PUBLIC_SHAPE_MANIFEST.json']='Accepted exact13-file packet with symbolic input,26 records89 fields, observer-only subject refinement, and all runtime vectors then unpassed. Earlier source/integration/component documents keep their scoped meanings. Numeric allocation/model identities explicitly not yet performed at this gate; later qualification does not retroactively change this status.'
add('ATTENTION_ALLOCATION_DRAFT.md','Historical reviewed proposal516..541, namespaces1143/1144,52 text members and four1024 unsigned pairs. Optional fields and literal capacity0/1/2 preserved. Numeric adjacency carries no psychological semantics; original draft never silently relabeled permanent.')
add('ATTENTION_ALLOCATION_DRAFT.json','Fresh independent parity against accepted symbolic shape and prior occupied identities, including all field positions, optionality, role/map-key/collection ownership, finite tags, union operands and11 occurrence paths. Actual scalar/container applicability preserved. Proposal status not permanent authority.')
add('ATTENTION_ALLOCATION_REVIEW_REV1.json','Fresh277 parity checks,11 numeric corruptions and135 canonical declaration round trips reproduce complete original receipt. Separate prior allocation fingerprints and453 historical EMB references remain verified with pre-quiescence archive. Checks establish consistency, not public source or behavior qualification.')
specs['docs/formal/ATTENTION_PERMANENT_ALLOCATION.md']='Permanent append-only26 records516..541 and two shared-allocator occurrence namespaces1143/1144. No occurrence for views, units, audit rows or receipt elements.62 scalar/two map-key roles and three compiler-owned identity collections stay distinct.135 round trips/277 parity are numeric consistency only; no law or runtime verdict.'
specs['docs/formal/ATTENTION_ALLOCATION_FREEZE_AUDIT.json']='Freeze links exact numeric review, accepted shape, draft-derived permanent table and prior allocations. Whole draft payload preserved except declared version/status and explicit acceptance metadata. Existing allocation-table role retained. Freeze proves permanent assignment, not codec activation, model admission or public execution.'
prior=load(P/'campaign3-history-source-roles-rev130/index.json');known={x['path']:x for x in prior['roleAssignments']};assert not set(specs)&set(known)
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
embArchive=ref(P/'public-wrapper-quiescence-rev1/src/campaign3/embodiedRuntime.ts')
assert embArchive['sha256']=='d8103b0b9d9a6e16e00ba1d1c05ca4ed803deb8cbb2075fe8de974d713307fbe'
archives[embArchive['sha256']]=embArchive['path']
bindings=[]
for p in list(specs)+['docs/formal/ATTENTION_ALLOCATION_TABLE.json','docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json']:
 if p.endswith('.json'):
  for a in refs(load(p)):
   resolved=a['path'] if ref(a['path'])['sha256']==a['sha256'] else archives.get(a['sha256'])
   assert resolved and ref(resolved)['sha256']==a['sha256'],(p,a)
   bindings.append(dict(source=p,originalPath=a['path'],resolvedPath=resolved,sha256=a['sha256']))
for n in ['declaration-closure','allocation','inventory','inventory-review']:
 r=load(O/(n+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref(r['checker']['path'])==r['checker']
 for a in r.get('sourceMappings',[]):
  assert ref(a['path'])['sha256']==a['currentSha256'] and ref(a['historicalPath'])['sha256']==a['historicalSha256']
failed=load(O/'original-verifier-rejections.json');assert len(failed['results'])==2 and all(x['exitCode']!=0 for x in failed['results'])
assert 'embodiedRuntime.ts' in failed['results'][0]['stderr'] and 'occurrenceIdentity.ts' in failed['results'][1]['stderr']
d=load(P/'ATTENTION_SYMBOLIC_DECLARATIONS_REV1.json');a=load(P/'ATTENTION_ALLOCATION_DRAFT.json');t=load('docs/formal/ATTENTION_ALLOCATION_TABLE.json')
assert len(d['records'])==26 and sum(map(len,d['records'].values()))==89 and len(d['stages'])==10
assert len(d['roles'])==62 and len(d['collectionChecks'])==3 and len(d['members'])==52
for k,v in a.items():
 if k not in ['version','status']:assert t[k]==v,k
assert set(t)-set(a)=={'acceptance','acceptedProposal','permanence'}
assert t['status']=='PERMANENT AND FROZEN' and t['version']=='attention-allocation/0.1-candidate'
assert ref(P/'ATTENTION_ALLOCATION_DRAFT.json')==t['acceptedProposal']
assert t['acceptance']['numericReview']==ref(P/'ATTENTION_ALLOCATION_REVIEW_REV1.json')
assert [x['typeId'] for x in t['records']]==list(range(516,542)) and [x['namespace'] for x in t['newNamespaces']]==[1143,1144]
assert len(t['roles'])==62 and len(t['mapKeyRoles'])==2 and len(t['collectionIdentityChecks'])==3 and len(t['occurrenceIdentities'])==11
shape=load('docs/formal/ATTENTION_PUBLIC_SHAPE_MANIFEST.json');assert len(shape['files'])==13 and shape['numericAllocation']=='NOT PERFORMED' and shape['runtimeVectors']=='AT2-A..N FROZEN NOT PASSED'
review=load(P/'ATTENTION_DECLARATION_CLOSURE_REVIEW_REV1.json');assert len(review['checks'])==4 and len(review['detectedSymbolicFaults'])==12
review=load(P/'ATTENTION_ALLOCATION_REVIEW_REV1.json');assert (review['parityChecks'],len(review['negativeControls']),review['canonicalDeclarationRoundTrips'])==(277,11,135)
model=Path('src/campaign3/attentionModel.ts').read_text();assert "approved=freeze.models.find(m=>m.modelIdentity===key(identity.value));if(!approved)fail('model outside frozen attention cohort')" in model
chain=[ref(O/(n+'.json')) for n in ['original-verifier-rejections','declaration-closure','allocation','inventory','inventory-review']]+[ref('src/campaign3/attentionModel.ts')]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ATTENTION DECLARATION / ALLOCATION AUTHORITY',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/limitations','/contentProbe','/runtime'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='ATTENTION DECLARATION AND ALLOCATION AUTHORITY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[embArchive],bindings=bindings,alreadyReviewedBacking=[ref('docs/formal/ATTENTION_ALLOCATION_TABLE.json')],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh exact symbolic inventory/ten design checks, four declaration checks12 symbolic faults,277 parity checks11 numeric faults135 round trips; no new public runtime execution.','Original read-only verifiers still reject later embodiedRuntime and occurrenceIdentity changes. Exact historical archives resolve preservation hashes; current declaration/content modules execute substantive tests.','The exact pre-quiescence embodiedRuntime archive was previously referenced through receipts but absent from the explicit outside-census archive list. Initial audit resolver detected that accounting gap; this revision adds the existing file, without altering its bytes.','Finite model admission checks recomputed ModelIdentity against32 frozen commitments. This is not a generic authored-transition validator or proof of every possible malformed runtime child.','Earlier draft-review/routing hashes and incomplete materializer sourceHash still await reconciliation. No new allocation, qualification verdict or obligation closure.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),bindings=len(bindings),checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

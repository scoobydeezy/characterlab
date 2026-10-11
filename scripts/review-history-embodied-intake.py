from fractions import Fraction
import re
"""Reconcile bounded reserve qualification without conflating component, public or historical scopes."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-embodied-intake-rev1';B=P/'campaign3-history-universe-rev1'
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
specs={'docs/planning/CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md': 'First unaccepted research hypothesis: exact saturating stock, independently calibrated finite-bin level sensing, conservative upper-bound pressure. No automatic impairment, generic biology or learned motive. CTL001 retained;23explicit mechanism/finding IDs preserve decomposition, truth cut, learning/surprise/attention, independent grounds and constitutional/time distinctions. Phase0 materialization language is superseded by later pure source-owned materialization, not a new scheduler event. Later receiving closes only bounded M/N/O. Unknown differs from zero; old203 finite-bin exclusion remains real.', 'docs/planning/CAMPAIGN3_EMBODIED_SYMBOLIC_CONSOLIDATION.md': 'Explicit corrective proposal centralizes one immutable body registry, fixes one branch-independent original sampling event, authenticates consumer match by producer/O/channel/definition/version/branch, and separates maximum domain from exact target. Unavailable is metadata not negative evidence; body result trace-only/event-owned. Same pressure value is not whole-record equality across different identities. No new phase0 event, q cache, generic VAL collection schema or inferred learned efficacy. Typed/vocabulary/witness gates remain dated scope.', 'docs/planning/CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.md': 'Preserves genuine draft flaw: exact arithmetic still loses information in sensor bins, requiring one hidden trace-only quantization record per present sample and none for absent. Completes SubjectIds/SourceRecordIds/version ownership without extra reads; unavailable slots do not claim SEM work. Capacity last-bin tie, valid-other-body component and5/6empty-stock pressure remain scoped. Adds32nd record without identity/event/allocation budget expansion; numerical expectations are not a golden runtime trace.', 'docs/planning/CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.json': 'Fresh independent exact-Fraction recomputation matches30 stored bin-operation examples and3 endpoint examples; baseline6 versus denied/unavailable0. Original calculated-only scope remains: no production codec, trace validator or epistemic test executed by this receipt. Later47-test/7-trajectory audit supplies separate runtime evidence.', 'docs/planning/CAMPAIGN3_EMBODIED_REVIEW_MANIFEST_REV1.md': 'Role ownership clarification: recursive field VAL differs from state-key grammar/role and two closed compiler collection checks; polymorphic171 StableId cannot become generic DefinitionId. Exact versions/kinds/target equality add to namespace admission. Source/pressure independently resolve PRJ; restored trace does not authenticate child. EROLE A/E obligations supplement prior76proof burden, not blanket assurance from schema integrity.', 'docs/planning/CAMPAIGN3_EMBODIED_REVIEW_MANIFEST_REV1.json': 'Exact15-file dependency packet,43identity positions/43dependencies/5external schema references and2inspected role sources; fresh hash and vector association checks. Manifest scope is symbolic consistency, not semantic adequacy of all15source documents. Unreviewed detailed intake companions remain queued despite exact hashes.', 'docs/planning/CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json': '79 exact source vectors preserve76unpassed implementation obligations plus3deferred receiving at the date. Current qualification maps exact76 and later receiving3 independently; no retroactive execution. Four authority bindings exact via current/recovered files; old mechanism-ledger hash unavailable and explicitly excluded from source-authentication claims. Original script only fingerprints authorities, derives vectors from packet; no missing-ledger content reconstructed.'}

O.mkdir(exist_ok=True)
prior=load(P/'campaign3-history-source-roles-rev135/index.json');known={r['path'] for r in prior['roleAssignments']};assert not set(specs)&known
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']}
manifest=load(P/'CAMPAIGN3_EMBODIED_REVIEW_MANIFEST_REV1.json');shape=load(P/'CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json');vectors=[]
for a in manifest['packet']+manifest['inspectedRoleSources']:assert ref(a['path'])==a
for a in manifest['packet']:
 if not a['path'].endswith('.md'):continue
 for line in Path(a['path']).read_text().splitlines():
  m=re.match(r'^(?:\| |\* )((?:EMB|EOBS|EING|EREG|EREP|ECOMP|EROLE)-[A-O])(?:\s|:)',line)
  if m:vectors.append(dict(id=m[1],source=a['path'],exactLine=line,disposition='DEFERRED RECEIVING DEPENDENCY' if m[1] in ['EMB-M','EMB-N','EMB-O'] else 'FROZEN; NOT PASSED'))
assert vectors==shape['proofVectors'] and len(vectors)==79
assert (shape['implementationObligations'],shape['deferredReceivingObligations'])==(76,3)
assert (len(manifest['identityPositions']),len(manifest['dependencies']),len(manifest['externalSchemaReferences']))==(43,43,5)
qualification=load(P/'CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json');assert {r['id']:r['obligation'] for r in qualification['rows']}=={v['id']:v['exactLine'] for v in vectors if v['disposition'].startswith('FROZEN')}
calc=load(P/'CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.json');expected=load(P/'CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json');total=0
for name,rows0 in calc['expectedQuantizationOperations'].items():
 rows=[];w=Fraction(20 if name=='coarser' else 10)
 for e in expected['cases'][name]['records']:
  if e['kind']!='sample' or e['interval'] is None:continue
  q=Fraction(e['reserve']);k=int(100/w)-1 if q==100 else int(q//w)
  rows.append(dict(inputEvent=e['input'],operation=dict(InputLevel=e['reserve'],Capacity='100/1',BinWidth=str(w.numerator)+'/1',BinIndex=str(k))))
 assert rows==rows0;total+=len(rows)
assert total==calc['quantizationExamplesChecked']==30
assert [int(Fraction(q)//20) if q<100 else 4 for q in [0,20,100]]==[0,1,4]
ids=['CTL-001','CTL-004']+['MEC-'+str(i).zfill(3) for i in [1,2,3,4,5,6,7,*range(12,21)]]+['EXP-009','EXP-014','P3-009','P3-010','P3-011'];assert len(ids)==23
ledger=Path('docs/planning/REFERENCE_MECHANISM_LEDGER.md');currentRows=[]
for id in ids:
 rows=[dict(id=id,line=i+1,text=line) for i,line in enumerate(ledger.read_text().splitlines()) if line.startswith('| `'+id+'` |')];assert len(rows)==1;currentRows.extend(rows)
missing=[];bindings=[]
for p in specs:
 if not p.endswith('.json'):continue
 for a in fingerprints(load(p)):
  path=Path(a['path']);resolved=a['path'] if path.exists() and ref(path)['sha256']==a['sha256'] else archives.get(a['sha256'])
  row=dict(source=p,originalPath=a['path'],sha256=a['sha256'])
  if resolved:assert ref(resolved)['sha256']==a['sha256'];bindings.append(dict(**row,resolvedPath=resolved))
  else:missing.append(row)
assert len(missing)==1 and missing[0]['sha256']=='050435eca7053f06eb925f63894a9dcdb0c700965856c57f48f0b8167de0ed88'
script=Path('scripts/review-campaign3-embodied-shape.mjs').read_text();assert script.count('REFERENCE_MECHANISM_LEDGER.md')==1 and 'authorities:authorities.map(path=>({path,sha256:hash(path)}))' in script
unavailable=dict(**missing[0],disposition='UNAVAILABLE HISTORICAL AUTHORITY HASH; NOT USED AS AUTHENTICATED CONTENT',reason='Original script fingerprints authorities only; exact vectors derive from committed packet. Explicit23mechanism obligations in preserved motivation draft are reconciled against independently reviewed current ledger rows and separate accepted boundaries. Current ledger is not an alias for missing bytes.',blockedClaim='Whole historical ledger reconstruction and any assertion about its unseen unique prose remain unverified.',reopen='Authenticated original bytes become available or a substantive distinction depends on missing unique content.',owner='RO-C3-021')
evidence=dict(status='PASS WITH EXPLICIT HISTORICAL SOURCE EXCLUSION',vectors=79,implementationVectors=76,deferredVectors=3,quantizationExamples=30,endpointExamples=3,ledgerCorroboration=dict(source=ref(ledger),rows=currentRows,scope='Named23intake obligations only; not recovery/alias of historical ledger or a new whole-ledger audit.'),unavailableSourceDisposition=unavailable,sources=[ref('scripts/review-campaign3-embodied-shape.mjs'),ref(P/'campaign3-history-embodied-contracts-rev1/authority-history-search.json')])
p=O/'evidence.json';p.write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n') if not p.exists() else None
assert load(p)==evidence
fresh=[ref(p)]+[ref(P/n) for n in ['campaign3-history-embodied-reserve-rev1/review.json','campaign3-history-embodied-receiving-rev1/review.json','campaign3-history-embodied-contracts-rev1/review.json']]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sourceRoles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sourceRoles.append(dict(**ref(p),role='BOUNDED INTAKE / COMPOSITION CORRECTION / SYMBOLIC PROOF BURDEN',judgment=j,acceptanceChain=fresh))
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
r=dict(status='BOUNDED EMB INTAKE/CORRECTIONS RECONCILED; HISTORICAL LEDGER EXCLUSION EXPLICIT; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,unavailableSourceDispositions=[unavailable],obligations=['RO-C3-001','RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No missing-ledger recovery or alias; only its observed fingerprint-only use and explicit preserved23mechanism obligations are disposed here. Final HQ011 must assess exclusions together with remaining claim chain.','Detailed observation/ingress/registration/replenishment/field/vocabulary/witness companions remain separate whole-source work;15-file identity does not pass their scientific claims.','Draft phase0/empty-quantization/implicit-map-role suggestions are corrected by named successors, not current behavior.','Fresh exact vector/arithmetic checks do not rerun production. Prior fresh runtime audit remains separately cited; no new allocation, verdict, obligation closure or HQ012 entry.'])
c=dict(status='PASS WITH SOURCE EXCLUSION; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(missing),checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

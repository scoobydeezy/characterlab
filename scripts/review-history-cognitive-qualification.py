"""Historical cognitive claims, exact archived identities and separate current replay."""
from pathlib import Path
import collections,hashlib,json,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-cognitive-qualification-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev175/index.json';ix=load(ip)
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
aliases=collections.defaultdict(list)
for x in ix['explicitBackingOutsideProseManifest']:aliases[x['sha256']].append(x['path'])
bindings=[]
def bind(x,owner):
 path=x['path'];h=x['sha256'];resolved=path
 if not Path(path).is_file() or sha(path)!=h:
  resolved=next((p for p in aliases[h] if Path(p).is_file() and sha(p)==h),None)
  assert resolved,(owner,path,h)
 b=dict(owner=owner,originalPath=path,sha256=h,bytes=ref(resolved),method='CURRENT EXACT BYTES' if resolved==path else 'EXACT PREVIOUSLY PRESERVED HISTORICAL BYTES; LIVE SOURCE DIFFERS')
 bindings.append(b);return b
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def fingerprints(v,owner):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):bind(v,owner)
  for x in v.values():fingerprints(x,owner)
 elif isinstance(v,list):
  for x in v:fingerprints(x,owner)
docs={
'CAMPAIGN2_COGNITIVE_QUALIFICATION.md':'Exact frozen task-cognitive-path0.1 internal qualification, not external acceptance or psychological sufficiency. Public factory empty learned S0 is separate from synthetic component operands and exclusion arguments. Canonical bytes are persistence relation, not chosen actions. Preserve 21 distinct models, four choices/eligible contributions, counts2/1/2/2,128 rows/114 outputs/nine draws. All vector groups retain public/component split: capacities0..3; Unknown versus zero; immutable adopted instruction; availability separate from base; whole-expression Avoid; direct I excluded from nonidentity meaning; rejected identity has no prior/patch; authoritative history carries provenance beyond equal strength. Same-source coverage/tie grammar and preflight cardinality before priors are separate from later rollback.27 event bound rejects26. Seven saved-trace substitutions qualify receiving save boundary, not generic generation oracle. Preserve307 successor codec repair, actual composed route269/270/342/429, missingI preflight repair and no repeated semantic fold. Final118/1063 supersedes117/1059; reference43/328 historical API-config workaround waives no assertion. ORD001, general memory, efficacy, coercion and universal necessity are not solved.',
'CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md':'Bounded RNG-capable successor PERSIST-I is exact original-S0/input-prefix replay with copied public bytes and no external coupling map. Complete committed trace boundary rejects mid-instant/exhaustion; imported state/queue/allocator/trace never becomes alternative authority. Exact random root traversal includes IDN/task/instruction action/retained decision identities, not qualification/observation IDs. Zero-meaning draw may leave no identity entry but still consumes private address; replay rebuilds it. Preserve seed/root/provenance/trace substitutions and final-trace post-draw rollback. Public64/65 receipt does not alone measure private queue/allocator/ledger; final-trace test does. No new serialized ledger/outcome table. Same seed across different natural addresses is not coupling. Original cross-build absent-consumer gate is distinct and was later supplied by the bounded module-graph PERSIST-I history proof; neither old receipt is rewritten. Reopen on root/profile/ownership/save/coupling changes; no scalable restore or generic provenance claim.',
'CAMPAIGN2_COMPLETION_REVIEW.md':'Campaign2 completed only its thin bounded reference scaffold under internal review; five campaign conditions refer to used contracted authorities, real causal path, retained dice/identity port, truth/evidence/intent/outcome separation and no slice-relevant P0.373/schema2 field2 instruction versus lifecycle field1 and identity415 remain separate; common140 prior reads follow complete preflight/B0. Actual307 differs from observer evidence. Task pressure is not Core Need; protocol count not reward; two actions not a general planner.17 source substitutions demonstrate local conformance, not universal psychological RETAINED status or whole Decision/BIO coverage. Preserve wrong-field nondiscriminating save attempt, assay-anchor failures and missingI repair.270/11/12 component comparisons and18 predecessor assays have exact finite scope.1063/328 suite counts historical, not newly executed. Weighted-Jaccard subset residual and successive half-even rounding are intentional. Deferred broader ordering/feedback/cost/coercion/sources/planning/learning are superseded only by exact later Campaign3 scope. UI subsequently owner-deferred except validation needs. No old draft/model/allocation/corpus rewrite; Campaign2 completion is not Campaign3 exit.'}
json_notes={
'COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json':'Fingerprint consistency index24 reports/446 checks/74 implementation-test paths. Not behavioral proof; nine live source paths now differ and exact historical archives are used explicitly.',
'COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json':'Historical118 files/1063 active and43/328 reference tests;352 before/after source fingerprints. API config:false runner avoids ancestor-path loader restriction, not tests. Fresh76 focused tests below are distinct; no fresh full historical suite/build claimed.',
'COGNITIVE_RUNTIME_COHORT_REV2.json':'21 public frozen recipes, six original events each. Save digests and all complete reported result rows reproduced now. Original history-boundary recipe has four contributions, not64; later separate64/65 receipt supersedes this limited concern. Original additional-persistence-open wording is historical; later successor qualification and separately scoped cross-build witness remain.',
'COGNITIVE_HISTORY_BOUNDARY_REV2.json':'Genuine public64 contributions from empty learned S0, novel65 fails atomically and leaves terminal run. Recorded clock65/error/save digest verified as historical values, not freshly rerun here. State/output/trace/clock rollback and pre-failure queue/allocator save do not independently prove private-ledger rollback.',
'COGNITIVE_SOURCE_SUBSTITUTIONS_REV2.json':'Four baseline suites and17 named source substitutions have executed passing baselines and failing assertions for every mutant; compilation failure is not detection. Actual source/from/to/test-result strings are executable-control metadata. No overwritten production files,17 public models, exhaustive mutation or universal psychological necessity claim. Last-history-only differs from retired pairwise-max; direct independent collective fixture provides that discrimination.',
'COGNITIVE_MATH_REFERENCE_COMPARISON_REV2.json':'Actual historical component differential:270 dice cases/140 active and11 ordered identity histories. Empty evidence bases do not prove aggregate coverage, public provenance, generated choice, RNG or persistence. Fresh exact comparison separately passes unchanged counts.',
'COGNITIVE_COVERAGE_REFERENCE_REV1.json':'12 component comparisons: six fixtures with both orders, weighted/collective/subset/identical/disjoint/empty and canonical byte-derived tie key. Synthetic mathematical source operands grant no public source authority. Fresh all12 result rows match.',
'COGNITIVE_PREDECESSOR_PRESERVATION_REV1.json':'18 named retained assays refreshed without old receipt overwrite.17 EXISTING REFRESH RECEIPT entries do not assert the index writer reran those assays; one metadata-state-scan entry records its actual generated successor. Codec, original-input exclusion and conditional save anchors adapted without broadening public scope. Descendant assay semantics are not transitively accepted by this index.'}
sources={};objects={};schemas=collections.defaultdict(lambda:dict(count=0,values=set()))
for name,note in {**docs,**json_notes}.items():
 p=P/name;s=p.as_posix();assert s in ix['unassignedCandidatePaths'] and sha(p)==entries[s]['sha256'];sources[s]=(ref(p),note)
 if name in json_notes:
  v=load(p);objects[name]=v;fingerprints(v,s)
  for pointer,text in walk(v):
   field=re.sub(r'/\d+(?=/|$)','/*',pointer);schemas[field]['count']+=1;schemas[field]['values'].add(text)
assert len(bindings)==1220
changed=[x for x in bindings if x['method'].startswith('EXACT PREVIOUSLY')]
assert len(changed)==57 and len({(x['originalPath'],x['sha256']) for x in changed})==9
index=objects['COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json']
assert [len(index[k]) for k in ['reports','checks','implementationAndTests']]==[24,446,74]
suite=objects['COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json'];assert [(x['files'],x['tests']) for x in suite['results']]==[(118,1063),(43,328)]
sub=objects['COGNITIVE_SOURCE_SUBSTITUTIONS_REV2.json'];assert len(sub['baselines'])==4 and len(sub['results'])==17
assert all(t['status']=='pass' for b in sub['baselines'] for t in b['tests'])
assert all(x['status']=='DETECTED' and any(t['status']=='fail' for t in x['tests']) for x in sub['results'])
history=objects['COGNITIVE_HISTORY_BOUNDARY_REV2.json'];assert history['entries']==64 and history['clock']=='65' and history['failure']=='IDENTITY_EVIDENCE_LIMIT_EXCEEDED'
pred=objects['COGNITIVE_PREDECESSOR_PRESERVATION_REV1.json'];assert len(pred['results'])==18
predecessors=[]
for x in pred['results']:
 current=P/Path(x['current']).name
 if 'sha256' in x:assert sha(current)==x['sha256']
 else:assert sha(current)==entries[current.as_posix()]['sha256']
 if 'scriptSha256' in x:assert sha(x['script'])==x['scriptSha256']
 if 'historicalSha256' in x:assert sha(x['historical'])==x['historicalSha256']
 predecessors.append(dict(historical=ref(x['historical']),successor=ref(current),recordedStatus=x['status'],scope='EXACT INDEX LINK; DESCENDANT SEMANTICS SEPARATE'))
fresh_runtime=load(O/'runtime.json');assert fresh_runtime['results']==objects['COGNITIVE_RUNTIME_COHORT_REV2.json']['results'];assert len(fresh_runtime['results'])==21
math=load(O/'math.json');assert (math['diceCases'],math['activeCases'],math['identityHistories'])==(270,140,11)
assert load(O/'coverage.json')['results']==objects['COGNITIVE_COVERAGE_REFERENCE_REV1.json']['results']
test=load(O/'tests.json');assert test['success'] and test['numPassedTests']==76 and test['numFailedTests']==test['numPendingTests']==0
for name in ['runtime.json','math.json','coverage.json','test-sources.json']:
 for a in load(O/name)['sourceFingerprints']:assert ref(a['path'])==a
fresh=[ref(O/n) for n in ['runtime.json','math.json','coverage.json','tests.json','test-sources.json']]
adapters=[ref('scripts/replay-history-cognitive-'+s+'.mjs') for s in ['runtime','math','coverage','tests']]
chain=[ref(P/'campaign3-history-cognitive-rev1/review.json'),ref(P/'campaign3-history-cognitive-freeze-rev1/review.json'),ref(P/'campaign3-history-persist-i-rev1/proof.json'),ref(P/'CAMPAIGN3_HISTORY_PERSIST_I_CHECKPOINT.md'),ref(P/'campaign3-history-exit-consolidation-rev2/review.json')]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);s=u['source']
  if s not in sources:continue
  sr,note=sources[s];assert u['sourceSha256']==sr['sha256']
  ptr=u['location'].get('pointer','');category='NARRATIVE' if s.endswith('.md') or ptr=='/scope' or ptr.startswith('/scope/') or ptr.startswith('/limits') or ptr=='/runner' else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=s,sourceSha256=sr['sha256'],location=u['location'],text=u['text'],category=category,judgment=note))
assert len({x['occurrenceId'] for x in rows})==len(rows)
save('identity-bindings.json',dict(status='PASS;1220 EXACT BINDINGS INCLUDING57 ARCHIVED OCCURRENCES/NINE HISTORICAL PATH IDENTITIES',bindings=bindings,predecessorReceipts=predecessors))
save('schema.json',dict(fields=[dict(path=k,occurrences=v['count'],uniqueValues=len(v['values']),role='SOURCE/TEST/RESULT METADATA OR EXPLICIT SCOPE; SEE PER-SOURCE JUDGMENT') for k,v in sorted(schemas.items())],shortStringsIncluded=True))
save('review.json',dict(status='COGNITIVE QUALIFICATION CLAIMS RECONCILED; HQ011 ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**sr,role='BOUNDED COGNITIVE CLAIM/EVIDENCE WITH PUBLIC-COMPONENT SPLIT',judgment=note,acceptanceChain=chain) for sr,note in sources.values()],rows=rows,preservedArtifacts=[],identityBindings=ref(O/'identity-bindings.json'),stringSchema=ref(O/'schema.json'),currentReplay=fresh,adapters=adapters,
 findings=['Nine changed live source paths have exact historical copies already indexed; no old fingerprint was relaxed.57 occurrences resolve to those historical bytes,1163 to current exact bytes.',
 'Concurrent Vite arithmetic runners printed a WebSocket port-in-use warning, then both completed with exit0 and successful assertion receipts. Runtime cohort and focused tests also completed successfully. No failed arithmetic assertion or restart was hidden.',
 'Current21 public result rows/save digests match the historical cohort; this hash comparison is not a substitute for full canonical continuation comparisons exercised separately in focused factory/history tests.',
 'All21 exit-rationale supporting paths now have explicit source roles after this index extension; that list is not the complete HQ011 universe.'],
 limits=['No fresh17-mutant matrix,64/65 run,18 predecessor assays,1063/328 full suites or build. Their exact historical evidence remains separately labeled.','Mandatory authority adequacy,remaining source roles,80 inventory identities,post-cutoff additions and exclusions remain open. No new verdict,law,corpus promotion or obligation closure.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
for sr,note in sources.values():assert ref(sr['path'])==sr
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
save('check.json',dict(status='PASS;11 SOURCE ROLES AND BOUNDED CURRENT REPLAY',sources=11,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=sum(x['count'] for x in schemas.values()),historicalFingerprintBindings=1220,archivedBindingOccurrences=57,distinctArchivedIdentities=9,publicRecipes=21,diceCases=270,identityHistories=11,coverageComparisons=12,freshTests=76,recoveredArtifacts=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

"""Reconcile early cognitive receipts; retain unresolved exact-source obligations."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');O=P/'campaign3-history-cognitive-runtime-receipts-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev184/index.json';ix=load(ip)
names=['DICE_RECIPE_EXPLORATION','RANDOM_ROLLBACK_EXPLORATION','RUNTIME_COHORT','HISTORY_BOUNDARY','MATH_REFERENCE_COMPARISON','SOURCE_SUBSTITUTIONS']
paths=[(P/f'COGNITIVE_{n}_REV1.json').as_posix() for n in names]
dice,rollback,runtime,boundary,math,mutants=[load(p) for p in paths]
laterRuntime=load(P/'campaign3-history-cognitive-qualification-rev1/runtime.json')
assert len(runtime['results'])==len(laterRuntime['results'])==21
for a,b in zip(runtime['results'],laterRuntime['results']):
 assert a=={k:b[k] for k in a}
 assert set(b)-set(a)=={'arbitrationModes','rejectionReasons','maxInstantWork','diceFaces'}
laterMath=load(P/'campaign3-history-cognitive-qualification-rev1/math.json')
assert {k:v for k,v in math.items() if k!='sourceFingerprints'}=={k:v for k,v in laterMath.items() if k!='sourceFingerprints'}
assert len(dice['cases'])==6 and len(rollback['checks'])==7 and all(rollback['checks'].values())
assert (boundary['entries'],boundary['clock'],boundary['failure'])==(64,'65','IDENTITY_EVIDENCE_LIMIT_EXCEEDED')
assert (math['diceCases'],math['activeCases'],math['identityHistories'])==(270,140,11)
assert len(mutants['baselines'])==4 and sum(len(x['tests']) for x in mutants['baselines'])==53
assert all(x['status']=='PASS' and all(t['status']=='pass' for t in x['tests']) for x in mutants['baselines'])
assert len(mutants['results'])==17 and all(x['status']=='DETECTED' and any(t['status']=='fail' for t in x['tests']) for x in mutants['results'])
for x in mutants['results']:
 assert x['from']!=x['to'] and x['from'] in Path(x['source']).read_text(),x['name']
search=load(O/'source-search.json');archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};preserved=[]
for s in search:
 if s['commit']:
  raw=subprocess.check_output(['git','show',s['commit']+':'+s['path']]);assert hashlib.sha256(raw).hexdigest()==s['sha256']
  target=O/(Path(s['path']).stem+'.historical.ts')
  if target.exists():assert target.read_bytes()==raw
  else:target.write_bytes(raw)
  archives[s['sha256']]=target.as_posix();preserved.append(dict(**ref(target),method='Exact raw Git blob at '+s['commit'],original=s['path']))
assert len(preserved)==2
bindings=[];unresolved=[];leaves=[]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
for p in paths:
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 v=load(p)
 for f in v.get('sourceFingerprints',[]):
  actual=f['path'] if ref(f['path'])==f else archives.get(f['sha256'])
  if actual:
   assert ref(actual)['sha256']==f['sha256'];bindings.append(dict(owner=p,original=f,actual=ref(actual)))
  else:unresolved.append(dict(owner=p,**f))
 leaves.extend(dict(source=p,pointer=q,value=s) for q,s in walk(v))
assert len(unresolved)==7 and all(x['owner']==paths[2] for x in unresolved)
notes=[
 'Historical six-case mathematical exploration only: proposed concern operands and historical RNG, not canonical public sources or substrate persistence. Later real component/public evidence is separately bound.',
 'Seven executed substrate oracle/local-adapter checks. Discarding local pending state simulates later failure; not actual scheduler rollback or PERSIST-I. Complete draw records, distinct purposes and repeated-address checks retained; research namespaces not production vocabulary.',
 'Finite21-recipe public cohort, six authored input events. All original result fields including Save digests match later qualified replay; later receipt adds four diagnostic columns. Seven exact old source identities remain unresolved after indexed archive and reachable exact-path Git search. Same outcomes do not reconstruct missing bytes. Does not cover64-entry boundary or complete persistence gate.',
 '64 acquired public history entries then novel65 rejects; failed run terminal; snapshot clock/state/trace/outputs unchanged. Original receipt has no source fingerprint manifest: current writer inspection is explanatory only, not authenticated historical execution source. Pre-failure Save digest alone cannot prove private-ledger rollback; separate final-trace control required. No fresh boundary rerun.',
 '270 dice/140 active cases and11 ordered histories match later replay exactly excluding source fingerprints; old cognitiveMath recovered from exact Git blob. External mathematical operands do not prove public generated choice, RNG or qualified expression.',
 'Four passing baselines53 tests,17 mutants each with actual failed assertions and exact source/from/to. Compile/anchor failures are explicitly excluded by writer. Avoid and aggregate coverage remain component scope; generated-source/sealing controls do not broaden public source scope. Historical math test recovered exactly; no mutant rerun.'
]
chain=[ref(P/'campaign3-history-cognitive-qualification-rev1/review.json'),ref(P/'campaign3-history-persist-i-rev1/proof.json')]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in paths:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  pointer=u['location']['pointer'];category='NARRATIVE' if pointer.split('/')[1] in ['status','scope','limits','limitations'] or pointer.endswith('/name') else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=notes[paths.index(u['source'])]))
save('schema.json',dict(shortStringsIncluded=True,stringLeaves=leaves))
save('unresolved.json',dict(status='SEVEN EARLY RUNTIME SOURCE IDENTITIES UNRESOLVED',entries=unresolved,search=ref(O/'source-search.json'),searchScope='Existing indexed archives and reachable Git history at exact paths; not unreachable objects, renames or global absence.',additionalBoundaryLimit='64/65 original receipt omits a source-fingerprint manifest; current writer cannot supply historical attestation.',disposition='RO-C3-021 remains mandatory unsatisfied. Current replay equality is separate evidence, not source reconstruction. Independent adequacy must assess these gaps before HQ012.'))
save('review.json',dict(status='SIX EARLY RECEIPTS SCOPE-RECONCILED; SOURCE ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**ref(p),role='HISTORICAL COGNITIVE RECEIPT WITH EXPLICIT LIMITS',judgment=n,acceptanceChain=chain) for p,n in zip(paths,notes)],exactBindings=bindings,unresolved=ref(O/'unresolved.json'),rows=rows,schema=ref(O/'schema.json'),preservedArtifacts=preserved,inspectionSources=[ref('scripts/audit-cognitive-history-boundary.mjs'),ref('scripts/prove-cognitive-substitutions.mjs')],limits=['No runtime or old writer executed. Original reports unchanged.','Seven early runtime source identities add to80 exit-inventory gaps and one older scheduler identity; no conflation or closure.','Later runtime row comparison projects to original fields; four newly recorded diagnostic fields are not historical deltas.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS RECEIPT SCOPE RECONCILIATION; HISTORICAL SOURCE GAPS OPEN',sources=6,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(unresolved),recoveredArtifacts=2,mutants=17,baselineTests=53,originalRuntimeRowsMatched=21,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

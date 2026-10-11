"""Retained assay semantics and correct-forward pairs; no old writer execution."""
from pathlib import Path
import collections,hashlib,json,re,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-cognitive-preservation-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=digest(Path(p).read_bytes()))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev176/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
aliases=collections.defaultdict(list)
for x in ix['explicitBackingOutsideProseManifest']:aliases[x['sha256']].append(x['path'])
notes={
'BATCH_WITNESSES':'Single-rule topology/allocation remains at zero count; collision check precedes target/gate reads even with false gate. Same-path target/gate has distinct ordered accessor evidence. Five selected tests/four mutations are not all ADAPT controls.',
'APPLICABILITY':'Applicability depends on declared referent matching, not prior gate state. Empty/nonmatching resolver emits dispatch; false gate retains evaluation. Isolated two-rule component uses existing runtime-origin wrong referent, not another character/content kind.',
'INDEPENDENT_GATES':'72 FrozenBaseline/signed-Step cases use an independent scalar expected oracle with shared canonical transport/factory. Six wrong-gate/sign/no-change-write alternatives differ. Frozen baseline means no Set; unchanged values must not invent writes. Not full REG/persistence/PHEN-ADAPT.',
'EVID_REG_CONSTRUCTION':'23 fixed mutations preserve REG identity/domain/character/totality/normal-form/parameter ownership and EVID exact payload, cardinality, occurrence extraction, no-write-before-output-validation and child topology. Staged-write gate violates frozen snapshot. REG messages are diagnostic; public carrier is INVALID_CONFIGURATION, not normative wording. No arbitrary body callbacks or complete EVID-S/REG-M release.',
'REG_KEY_PRESERVATION':'Two-variable generic component preserves selected key/query identity; D0 admits both variables but wrong key rejects before arithmetic. Public first profile excludes two-variable setup. Does not prove arbitrary malicious replacement of both trusted operands.',
'READ_EVIDENCE':'Active evaluation/finish exclusion and per-rule instrumentation/staged-read comparison own read evidence. Internal admitted batch boundary is not public injection. Ten tests/four substitutions retain partial AD-E7 scope and historical evaluator-sensitive refresh requirement.',
'STAGE_BOUNDARY':'Ordinary phase140, handler InputOnly origins, late-child stage and unconsumed batch reject at distinct boundaries before later ingress failure. Positive one batch/execution per original plus duplicate execution controls do not authorize public scheduling injection. Cognitive successor changes the guard anchor only.',
'WRITE_BOUNDARY':'Exact rule-target association, family scope, target membership, actual WRT diff and staged output are distinct checks. Preserve one pre-snapshot label swap and one staged association swap. Redundant staged-patch guard survived an earlier mutation and was removed; actual-diff guard carries the obligation. Generic alternate subject/family-scope witnesses do not widen bounded profile. Successor decoder anchor only.',
'ROUTE_SEPARATION':'Five public tests/two mutations separate named event ordinal and causal-parent magnitude dependencies. Opaque EVID occurrence remains carried identity; exact payload closure is separate. Not universal trusted-host noninterference.',
'RULE_OVERLAP':'Guaranteed overlap is rejected statically; disjoint matcher positives remain admitted but actual runtime targets may collide. Five key forms/Step/Gate controls plus one runtime collision prove named ordering/no-read/public snapshot checks, not arbitrary matcher language or private queue/allocator rollback.',
'MAGNITUDE_BOUNDARY':'Unsigned negative values reject rather than clamp; inclusive finite maxima reject maximum+1; unbounded leaves retain large exact values. Finite matrix not arbitrary-integer proof. Public snapshot rollback is separate from AD-E12 full queue/allocator proof; confinement also relies on exact target/diff.',
'REFERENCE_SETTLEMENT':'Pre-instant invalid reference cannot be repaired by a later committed rule before validation. Unknown-variable translation is a real domain-component witness with separate earlier public exclusion; not a new admitted profile or exhaustive fault matrix.',
'STATE_INVARIANT':'Full-map initial/restore checks preserve zero normal form, tolerance/load bounds and regulatory/load/procedure existence including procedural family. Thirteen tests include one future-writer invariant, not every AD-F7 substitution or general factory qualification.',
'ADAPT_ROLLBACK':'Six explicit failure stages and four publication leaks separate state, queue, allocator, trace/output atomicity. Not all host failures. Historical predecessor scheduler fingerprint is unrecovered; refreshed assay has an independently exact source binding. Do not substitute later source for missing earlier bytes.',
'FCT_C':'Preserve real direct context.state capability leak despite guarded PRJ rejection; correction separates production semantic execution from host context. Generic A/B/absent roster with fixed input/allocation is not admitted bounded profile.18 expected-rejection interventions across evaluation/learning require inner ILLEGAL_READ, outer TRANSITION_FAILURE, no roster reads and rollback; passing rejection tests are not failing-mutant tests. Named hidden operands are not proof against arbitrary trusted host inspecting nested bytes. Host admission/allocation/state validation remains separate.',
'PRJ_SUBSTITUTIONS':'Existing generic PRJ registration tests observer selection, projected value versus wrapper, source-wrapper evidence, required presence and roster static bans. Not zero-read EVID specialization or frozen first-model activation; inherited assertion controls not independent general interpreter.',
'BRIDGE_SUBSTITUTIONS':'Two first-profile inputs count0/2 have fixed safe pulse; six differential substitutions test hidden-count leakage, truth provenance, observation omission and SEM missing/duplicate/time support. Exact bytes were compared in memory; report hashes diagnostic. No independent OBS/SEM interpreter or roster/public PRJ widening.',
'METADATA_STATE_SCAN':'Populated state still has exact profile-specific empty metadata; save and restore all-state-ID scans fail independently. Four cases per baseline/variant preserve field8/9/10 and restoration distinctions. PERSIST-D control is not original PERSIST-I production-consumer/cross-build witness.'}
pre_path=P/'COGNITIVE_PREDECESSOR_PRESERVATION_REV1.json';pre=load(pre_path)
sources={};pairs=[];binding_rows=[];archives={};searches={};schemas=collections.defaultdict(lambda:dict(count=0,values=set()))
def bind(f,owner):
 path,h=f['path'],f['sha256'];resolved=next((p for p in [path,*aliases[h]] if Path(p).is_file() and digest(Path(p).read_bytes())==h),None)
 if resolved is None:
  if path not in searches:
   commits=subprocess.run(['git','log','--all','--format=%H','--',path],capture_output=True,check=True).stdout.decode().splitlines()
   searches[path]=dict(commits=commits,blobs=[])
   for commit in commits:
    result=subprocess.run(['git','show',commit+':'+path],capture_output=True,check=True);searches[path]['blobs'].append((commit,result.stdout))
  for commit,raw in searches[path]['blobs']:
   if digest(raw)!=h:continue
   p=O/'historical'/f'{h}.ts';p.parent.mkdir(exist_ok=True)
   if p.exists():assert p.read_bytes()==raw
   else:p.write_bytes(raw)
   resolved=p.as_posix();aliases[h].append(resolved)
   archives[h]=dict(**ref(p),method='EXACT REACHABLE GIT BLOB',originalPath=path,commit=commit)
   break
 if resolved:
  binding_rows.append(dict(owner=owner,originalPath=path,sha256=h,bytes=ref(resolved),method='CURRENT EXACT BYTES' if resolved==path else 'EXACT HISTORICAL BYTES'))
 else:binding_rows.append(dict(owner=owner,originalPath=path,sha256=h,method='UNRECOVERED HISTORICAL IDENTITY; NO LATER-SOURCE SUBSTITUTION'))
def diff(a,b,p=''):
 if type(a)!=type(b):return [dict(pointer=p,before=a,after=b)]
 if isinstance(a,dict):
  assert set(a)==set(b)
  return [z for k in a if k not in ['sourceFingerprints','sourceFingerprint','harnessSha256'] for z in diff(a[k],b[k],p+'/'+k)]
 if isinstance(a,list):
  assert len(a)==len(b)
  return [z for i,(x,y) in enumerate(zip(a,b)) for z in diff(x,y,p+'/'+str(i))]
 return [] if a==b else [dict(pointer=p,before=a,after=b)]
def walk(x,p=''):
 if isinstance(x,str):yield p,x
 elif isinstance(x,dict):
  for k,v in x.items():yield from walk(v,p+'/'+k)
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from walk(v,p+'/'+str(i))
for link in pre['results']:
 tag=Path(link['current']).name.removeprefix('COGNITIVE_PRESERVATION_').removesuffix('_REV1.json');note=notes[tag]
 values=[]
 for key in ['historical','current']:
  p=Path(link[key]);s=p.as_posix();assert s in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[s]['sha256']
  v=load(p);values.append(v);sources[s]=(ref(p),note)
  fs=v.get('sourceFingerprints',v.get('sourceFingerprint',[]));fs=[fs] if isinstance(fs,dict) else fs
  for f in fs:bind(f,s)
  if 'harnessSha256' in v:bind(dict(path='src/test/fixtures/campaign2GateComparison.ts',sha256=v['harnessSha256']),s)
  for pointer,text in walk(v):
   k=re.sub(r'/\d+(?=/|$)','/*',pointer);schemas[k]['count']+=1;schemas[k]['values'].add(text)
 a,b=values;delta=diff(a,b)
 assert [x['pointer'] for x in delta]==({'STAGE_BOUNDARY':['/mutants/1/from'],'WRITE_BOUNDARY':['/mutants/4/from']}.get(tag,[]))
 tests=[]
 for group in [b.get('baseline'),*b.get('baselines',[])]:
  if isinstance(group,dict) and 'tests' in group:assert all(t['state']=='pass' for t in group['tests']);tests+=group['tests']
 mutations=b.get('mutants',b.get('mutations',[]))
 for m in mutations:
  assert m['status']=='DETECTED'
  assert any(t['state']=='fail' for t in m.get('tests',[])) or bool(m.get('differences'))
 if tag=='FCT_C':
  assert len(b['projectionRejections'])==18
  assert {(x['stage'],x['field']) for x in b['projectionRejections']}=={(stage,field) for stage in ['evaluation','learning'] for field in ['state','event','trace','parent','content','registry','identityOrdinal','traceAncestry','perceivedSuccess']}
  assert all(t['state']=='pass' for x in [b['genericBaseline'],b['boundedBaseline'],*b['projectionRejections']] for t in x['tests'])
 if tag=='INDEPENDENT_GATES':assert len(b['baseline']['cases'])==72 and all(x['agrees'] for x in b['baseline']['cases'])
 if tag=='METADATA_STATE_SCAN':
  assert len(b['results'])==3 and all(x['agrees'] for x in b['results'][0]['cases'])
  assert all(any(not x['agrees'] for x in m['cases']) for m in b['results'][1:])
 pairs.append(dict(tag=tag,predecessor=ref(link['historical']),successor=ref(link['current']),judgment=note,nonFingerprintDifferences=delta,recordedMutations=len(mutations),limits=b.get('limitations',b.get('scope'))))
missing=[x for x in binding_rows if 'bytes' not in x]
assert len(archives)==5 and {x['sha256'] for x in missing}=={'58ac5e7607b73829d3d7908f005e67b18d9a4da1b2a88cc3da5addbae99b6a67'}
save('identity-bindings.json',dict(status='EXACT AVAILABLE BINDINGS; ONE HISTORICAL SCHEDULER IDENTITY OPEN',rows=binding_rows,preservedArtifacts=list(archives.values()),searches=[dict(path=p,commits=x['commits'],scope='Reachable exact-path whole Git bytes; no unreachable/rename/global absence claim') for p,x in searches.items()],unresolved=missing))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);s=u['source']
  if s not in sources:continue
  sr,note=sources[s];assert u['sourceSha256']==sr['sha256'];pointer=u['location']['pointer']
  category='NARRATIVE' if pointer.startswith(('/limitations','/scope','/priorFailure')) or pointer in ['/comparison','/expected'] else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=s,sourceSha256=sr['sha256'],location=u['location'],text=u['text'],category=category,judgment=note))
assert len({x['occurrenceId'] for x in rows})==len(rows)
chain=[ref(pre_path),ref(P/'campaign3-history-cognitive-qualification-rev1/review.json')]
save('schema.json',dict(shortStringsIncluded=True,fields=[dict(path=k,occurrences=v['count'],uniqueValues=len(v['values']),role='CONTROL/TEST/ERROR/BYTE METADATA EXCEPT EXPLICIT SCOPE AND PRESERVED FAILURE PROSE') for k,v in sorted(schemas.items())]))
save('review.json',dict(status='18 PREDECESSOR/REFRESH PAIRS RECONCILED; HISTORICAL BYTE GAP RETAINED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**sr,role='FINITE PRESERVATION ASSAY; HISTORICAL/REFRESH SCOPE SEPARATE',judgment=note,acceptanceChain=chain) for sr,note in sources.values()],pairs=pairs,rows=rows,identityBindings=ref(O/'identity-bindings.json'),schema=ref(O/'schema.json'),preservedArtifacts=list(archives.values()),limits=['No fresh assay/test/build execution. Recorded results are unchanged across pairs apart from two explicit mutation anchors; source fingerprints differ and are bound separately.','Five exact reachable Git blobs recovered; one earlier scheduler identity remains unresolved. Later refreshed scheduler evidence cannot replace the absent earlier bytes or prove no lost finding. RO-C3-021 retains this adequacy question.','Finite controls and passing expected-rejection tests do not establish generic host noninterference, psychological necessity or whole factory/persistence qualification. Earlier failed controls remain preserved. No new verdict/law/corpus/obligation closure.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
for sr,n in sources.values():assert ref(sr['path'])==sr
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
save('check.json',dict(status='PASS; DECLARED PAIRS/CONTROL SCOPES; ONE IDENTITY OPEN',sources=len(sources),pairs=len(pairs),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=sum(x['count'] for x in schemas.values()),sourceBindings=len(binding_rows),unresolvedBindingOccurrences=len(missing),unresolvedIdentities=1,recoveredArtifacts=len(archives),recordedMutations=sum(x['recordedMutations'] for x in pairs),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))

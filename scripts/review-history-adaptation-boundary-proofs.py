"""Audit historical ADAPT mutation receipts and preserve unrecovered source identities."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-adaptation-boundary-proofs-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=digest(Path(p).read_bytes()))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','name','errors','required','requiredTest'])
ip=P/'campaign3-history-source-roles-rev206/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and any(n in Path(p).name for n in ['READ_EVIDENCE_PROOF','PROJECTION_BINDING_ISOLATION_PROOF','MAGNITUDE_BOUNDARY_PROOF','REFERENCE_SETTLEMENT_PROOF'])];assert len(paths)==7
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
requests=[dict(owner=p,**s) for p in paths for s in load(p)['sourceFingerprints']]
missing={(s['path'],s['sha256']) for s in requests if ref(s['path'])['sha256']!=s['sha256'] and s['sha256'] not in archives}
assert len(missing)==4
search=[];recovered=[];O.mkdir(exist_ok=True)
def inspect(data,where):
 lf=data.replace(b'\r\n',b'\n')
 for mode,b in [('raw',data),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]:
  h=digest(b);search.append(dict(**where,normalization=mode,sha256=h))
  if h in {s[1] for s in missing} and h not in archives:
   dest=O/('recovered-'+h+'.ts')
   if dest.exists():assert dest.read_bytes()==b
   else:dest.write_bytes(b)
   archives[h]=dest.as_posix();recovered.append(dict(**ref(dest),method='Exact historical source recovered from '+json.dumps(where,sort_keys=True)+' with '+mode+' byte normalization; committed hash matched',origin=where,normalization=mode))
for path in sorted({s[0] for s in missing}):
 commits=subprocess.check_output(['git','log','--all','--format=%H','--',path],text=True).splitlines()
 for c in commits:
  r=subprocess.run(['git','show',c+':'+path],capture_output=True)
  if r.returncode:search.append(dict(commit=c,path=path,missing=True));continue
  inspect(r.stdout,dict(commit=c,path=path))
files=subprocess.check_output(['rg','--files','--hidden','-g','adaptationEvaluation.ts','-g','campaign2ReadEvidence.test.ts','-g','adaptationRuntime.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==0
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==4
existing=P/'campaign3-history-adaptation-proof-cohorts-rev1/unresolved.json'
prior={(x['path'],x['sha256']) for x in load(existing)['groups']};newGroups=[x for x in groups if x not in prior];assert len(newGroups)==3
receipts=[];notes={};totalMutants=0;survived=0
for p in paths:
 v=load(p);base=v['baseline'];assert base['status']=='PASS' and all(t['state']=='pass' for t in base['tests'])
 assert len({t['name'] for t in base['tests']})==len(base['tests'])
 summary=[]
 for m in v['mutants']:
  totalMutants+=1;failed=[t for t in m['tests'] if t['state']=='fail']
  assert [t['name'] for t in m['tests']]==[t['name'] for t in base['tests']]
  assert m['status']==('DETECTED' if failed else 'SURVIVED')
  if 'required' in m or 'requiredTest' in m:assert any(t['name'].startswith(m.get('required',m.get('requiredTest'))) for t in failed)
  if not failed:survived+=1;assert m['name']=='skip-staged-patch'
  summary.append(dict(name=m['name'],status=m['status'],failedTests=len(failed)))
 assert v['status'] in ['EVIDENCE SUBMITTED','CORRECTION EVIDENCE SUBMITTED']
 receipts.append(dict(**ref(p),baselineTests=len(base['tests']),mutants=summary))
 note='Historical in-memory mutation receipt; original statuses,test names,errors and replacement strings preserved. Recorded detections are not fresh execution or universal equivalence. Source manifest is partial,not a full dependency closure; exact bytes do not prove execution time. '
 n=Path(p).name
 if 'MAGNITUDE' in n:note+='13 baseline tests/three detected mutants. Bounded clamp also incorrectly clamps unbounded load because it keys on field alone; its third failed witness is preserved,not described as an isolated bounded-only mutation. Unbounded ceiling and negative clamp remain separate. REV1/2 payloads match apart from evaluator fingerprint; old REV1 evaluator remains unrecovered. Partial public snapshot is not full queue/allocator rollback.'
 elif 'BINDING' in n:note+='Three baseline tests/two alias mutants:whole-binding alias changes direct4 to7 and derive4 to999;nested path alias changes direct4 to7. Exact source/test bodies resolve. No closure-captured-state purity,public injection API or universal reflection claim.'
 elif 'READ_EVIDENCE' in n:note+='Seven-test original/two guard removals. Missing instrumentation has two failed witnesses;staged association has four. This predates the ten-test active-interleaving cohort already reviewed separately. Original evaluator and test hashes remain unrecovered; later bodies do not retrospectively repair that identity gap.'
 else:note+='Eight tests/two detected mutants. Removing early validation still reaches ingress at INT64_MAX,detected by REG-O and AC-H;collapsing unknown-variable mapping fails actual component witness. All three reports share identical payloads except source fingerprints;domain changes REV1-to2 and runtime changes REV2-to3 remain real identity distinctions. REV3 runtime unrecovered. Not exhaustive fault-stage or whole B/FCT qualification.'
 notes[p]=note
assert totalMutants==16 and survived==0
for names in [['CAMPAIGN2_MAGNITUDE_BOUNDARY_PROOF.json','CAMPAIGN2_MAGNITUDE_BOUNDARY_PROOF_REV2.json'],['CAMPAIGN2_REFERENCE_SETTLEMENT_PROOF.json','CAMPAIGN2_REFERENCE_SETTLEMENT_PROOF_REV2.json','CAMPAIGN2_REFERENCE_SETTLEMENT_PROOF_REV3.json']]:
 payloads=[{k:v for k,v in load(P/n).items() if k!='sourceFingerprints'} for n in names];assert all(x==payloads[0] for x in payloads)
chain=[ref(P/'campaign3-history-adaptation-boundaries-rev1/review.json'),ref(P/'campaign3-history-adaptation-proof-cohorts-rev1/review.json'),ref(P/'campaign3-history-cognitive-preservation-rev1/review.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL ADAPT MUTATION COHORT; EXACT SOURCE GAPS RETAINED',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All seven JSON exports including short statuses and exact mutation code strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='FOUR OLD SOURCE IDENTITIES UNRECOVERED; THREE ADDITIONAL TO PRIOR ADAPT GROUPS',groups=[dict(path=p,sha256=h) for p,h in groups],additionalGroups=[dict(path=p,sha256=h) for p,h in newGroups],occurrences=unresolved,search=search,priorAdaptationGaps=ref(existing),scope='Current files,indexed1193 archives and reviewed sources,reachable exact-path Git raw/LF/CRLF,seven exact-basename workspace candidates. No unreachable-object,renamed-file or global-absence claim.',disposition='RO-C3-021 remains unsatisfied. Recover exact bodies or explicitly limit/exclude dependent historical claims in independent adequacy before HQ012; current changed source cannot impersonate committed old identities.'))
save('review.json',dict(status='SEVEN ADAPT BOUNDARY PROOFS RECONCILED; THREE ADDITIONAL SOURCE GAPS',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['16 historical detected mutant instances across seven reports; revisions are not independent mechanisms.','No runtime,mutant,test,build or writer rerun; original receipts unchanged.','Four unresolved source groups include one previously recorded ADAPT evaluator and three additional identities; total ADAPT gaps now eight.','No model,law,allocation,verdict,corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),additionalUnresolvedGroups=len(newGroups),recordedMutants=totalMutants,survivedMutants=survived,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

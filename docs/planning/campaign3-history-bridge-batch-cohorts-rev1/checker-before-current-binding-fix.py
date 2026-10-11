"""Reconcile historical bridge, applicability and batch controls without rerunning writers."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-bridge-batch-cohorts-rev1'
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
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','name','errors','expected','description','mode'])
ip=P/'campaign3-history-source-roles-rev214/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and any(n in Path(p).name for n in ['BRIDGE_SUBSTITUTION_PROOF','APPLICABILITY_PROOF_REV3','APPLICABILITY_WRITE_BOUNDARY','BATCH_MUTATION_PROOF'])];assert len(paths)==5
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
requests=[dict(owner=p,**s) for p in paths for s in load(p)['sourceFingerprints']]
missing={(s['path'],s['sha256']) for s in requests if ref(s['path'])['sha256']!=s['sha256'] and s['sha256'] not in archives}
assert len(missing)==1
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
files=subprocess.check_output(['rg','--files','--hidden','-g','adaptationEvaluation.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==0
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==1
receipts=[];notes={}
bridge=[load(p) for p in paths if 'BRIDGE_SUBSTITUTION' in p];assert bridge[0]==bridge[1]
app=[load(p) for p in paths if 'APPLICABILITY' in p];assert {k:v for k,v in app[0].items() if k!='sourceFingerprints'}=={k:v for k,v in app[1].items() if k!='sourceFingerprints'}
for p in paths:
 v=load(p);assert v['status']=='COMPONENT PASS'
 if 'BRIDGE_SUBSTITUTION' in p:
  assert [x['count'] for x in v['baseline']]==[0,2]
  assert [m['name'] for m in v['mutations']]==['retain-truth-provenance','omit-authoritative-observation','omit-sem-support','duplicate-sem-support','shift-sem-time']
  for m in v['mutations']:
   assert m['status']=='DETECTED' and [x['count'] for x in m['cases']]==[0,2]
   identity=next(s for s in v['sourceFingerprints'] if s['path']==m['source']);source=Path(archives[identity['sha256']]).read_text();assert source.count(m['from'])==1
   for baseline,c,d in zip(v['baseline'],m['cases'],m['differences']):
    assert c['count']==d['count']==baseline['count'];changed=[k for k in ['state','outputs','trace'] if c['hashes'][k]!=baseline['hashes'][k]];assert changed==d['changed']
    if m['name']=='omit-authoritative-observation':assert 'error' not in c and 'error' not in d and changed==['outputs','trace'] and 'rollback' not in c
    else:assert c['error']==d['error']=='TRANSITION_FAILURE' and c['rollback'] is True and c['hashes']['state']==v['baseline'][0]['hashes']['state']
  receipts.append(dict(**ref(p),baselineInputs=2,substitutions=5,recordedMutantCases=10))
  notes[p]='Exact duplicate historical bridge receipts, not independent replication. Two authored contact counts 0/2 share a fixed safe pulse under rules/campaign2-bounded-bridge/0.2-candidate. Five substitutions each record two cases. Omitting the authoritative observation changes outputs and trace without failure or state change; retaining truth provenance, omitting/duplicating SEM support and shifting SEM time record TRANSITION_FAILURE and rollback. Stored hashes independently reproduce each changed-field list; they do not reconstruct original exact byte comparisons or full rollback state. Original harness claim compared exact bytes in memory. These five-mutant receipts do not contain the later sixth hidden-count pulse mutant in the current writer. Differential bridge controls are not an independent OBS/SEM implementation, complete FCT-F or PRJ execution. No historical runtime rerun.'
 else:
  base=v['baseline'];assert base['status']=='PASS' and all(t['state']=='pass' for t in base['tests']);names=[t['name'] for t in base['tests']]
  appCase='APPLICABILITY' in p;assert len(names)==(2 if appCase else 5)
  expectedNames=['ignore-referent-match','omit-empty-dispatch','state-dependent-applicability'] if appCase else ['omit-batch-collision-check','filter-zero-count-rule','reverse-target-gate-read-evidence','omit-gate-read-evidence']
  expectedFail=[1,1,2] if appCase else [2,3,1,1]
  assert [m['name'] for m in v['mutants']]==expectedNames
  for m,n in zip(v['mutants'],expectedFail):
   assert m['status']=='DETECTED' and [t['name'] for t in m['tests']]==names
   assert all(t['state'] in ['pass','fail'] for t in m['tests']) and sum(t['state']=='fail' for t in m['tests'])==n
   assert all(t.get('errors') for t in m['tests'] if t['state']=='fail')
  receipts.append(dict(**ref(p),baselineTests=len(names),substitutions=len(expectedNames),failedAssertionsPerSubstitution=expectedFail))
  if appCase:notes[p]='Two-rule applicability specimen preserves false-gate evaluations and exactly one dispatch even for empty/nonmatching resolvers. Reversing committed rule identities changes identity and evaluation order but preserves frozen-snapshot tolerance1/load2 result. Three mutations fail 1/1/2 of two tests; unrelated passing rows retained. Wrong referent is a valid runtime-origin family, not a second character or new content kind. Original/refresh payloads match except evaluator hash; refresh evaluator remains unresolved. Component gate evaluation is distinct from structural applicability; a false gate must not silently erase dispatch/evaluation. No exhaustive applicability or whole factory claim.'
  else:notes[p]='Five batch tests preserve zero-count topology/allocation, collision rejection before target/gate reads with and without a false gate, two ordered distinct-accessor reads for the same path, and settled-state equality under noncolliding event permutation. Four mutants fail 2/3/1/1 tests; passing rows and asymmetry retained. Filtering zero-count rules fails the zero-count collision control but not positive-count false-gate collision. Ordered read records must not collapse merely because paths match. Permutation equality covers state, not identical run identity, trace or allocator history. Batch receipt lacks transformation source strings; current writer supplies interpretation only, not authenticated historical mutation bytes. No whole ADAPT/VAL/factory verdict.'
chain=[ref(P/'campaign3-history-factory-qualification-history-rev1/review.json'),ref(P/'CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL BRIDGE / APPLICABILITY / BATCH CONTROLS WITH SOURCE LIMITS',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All five JSON exports including short statuses, diagnostic hashes and available mutation strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='ONE REFRESH EVALUATOR IDENTITY UNRECOVERED',groups=[dict(path=p,sha256=h) for p,h in groups],occurrences=unresolved,search=search,scope='Current files, indexed 1197 archives and reviewed sources, three reachable exact-path Git revisions raw/LF/CRLF and three exact-basename workspace candidates. No unreachable-object, renamed-file or global-absence claim.',disposition='Recover exact evaluator or explicitly limit/exclude its dependent refreshed claims during independent adequacy before HQ012. Matching rows do not authenticate changed code.'))
save('review.json',dict(status='FIVE BRIDGE/APPLICABILITY/BATCH RECEIPTS RECONCILED; ONE REFRESH SOURCE OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),currentWriters=[ref('scripts/'+n) for n in ['prove-campaign2-bridge-substitutions.mjs','prove-campaign2-applicability.mjs','prove-campaign2-batch-witnesses.mjs']],limits=['Stored-row, source-binding and bridge hash-difference checks only; no runtime, mutation, test, build or historical writer rerun.','Two bridge reports are exact duplicates; the current writer has a sixth mutation absent from both.','One additional refresh evaluator identity unresolved; prior gaps remain open.','No model, law, allocation, verdict, corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

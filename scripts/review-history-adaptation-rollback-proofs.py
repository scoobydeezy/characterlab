"""Audit historical ADAPT mutation receipts and preserve unrecovered source identities."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-adaptation-rollback-proofs-rev1'
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
ip=P/'campaign3-history-source-roles-rev207/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and any(n in Path(p).name for n in ['ADAPT_ROLLBACK_PROOF','STAGE_BOUNDARY_PROOF'])];assert len(paths)==6
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
requests=[dict(owner=p,**s) for p in paths for s in load(p)['sourceFingerprints']]
missing={(s['path'],s['sha256']) for s in requests if ref(s['path'])['sha256']!=s['sha256'] and s['sha256'] not in archives}
assert len(missing)==5
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
files=subprocess.check_output(['rg','--files','--hidden','-g','scheduler.ts','-g','campaign2StageBoundary.test.ts','-g','adaptationRuntime.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==0
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==5
existing=P/'campaign3-history-adaptation-boundary-proofs-rev1/unresolved.json'
prior={(x['path'],x['sha256']) for x in load(existing)['groups']};newGroups=[x for x in groups if x not in prior];assert len(newGroups)==4
receipts=[];notes={};totalMutants=0;survived=0
for p in paths:
 v=load(p);base=v['baseline'];assert base['status']=='PASS' and all(t['state']=='pass' for t in base['tests'])
 assert len({t['name'] for t in base['tests']})==len(base['tests'])
 summary=[]
 for m in v['mutants']:
  totalMutants+=1;failed=[t for t in m['tests'] if t['state']=='fail']
  assert [t['name'] for t in m['tests']]==[t['name'] for t in base['tests']]
  assert m['status']==('DETECTED' if failed else 'SURVIVED')
  if 'required' in m or 'requiredTest' in m:assert any(t['name'].endswith(m.get('required',m.get('requiredTest'))) for t in failed)
  if not failed:survived+=1;assert m['name']=='skip-staged-patch'
  summary.append(dict(name=m['name'],status=m['status'],failedTests=len(failed)))
 assert v['status']=='EXECUTED BOUNDED EVIDENCE'
 if 'ROLLBACK' in Path(p).name:
  assert len(base['tests'])==6 and len(v['mutants'])==4
  assert all(any(t['state']=='fail' and t['name'].startswith('AD-E12 final-trace') for t in m['tests']) for m in v['mutants'])
 receipts.append(dict(**ref(p),baselineTests=len(base['tests']),mutants=summary))
 note='Recorded historical fault/mutation receipt,not fresh execution or exhaustive host-failure proof. Test names,states,errors and injection strings preserved verbatim. Partial source manifest is not a full dependency closure; source gaps cannot be repaired by unchanged result rows. '
 if 'ROLLBACK' in Path(p).name:note+='Six stages:after reads,later out-of-range,staged outputs,patch union,final trace,work ceiling. Four leak substitutions affect state,queue,allocators and trace/outputs. Failed working-state publication is detected only at final trace;the other three fail all six witnesses. Every mutant includes final-trace detection. REV1/2 payloads equal except source fingerprints;terminal Failed status is not Active recovery or continuing a failed run.'
 else:note+='Phase140 stage rejection remains distinct from later ingress failure. Original four-test/two-mutant cohort expands to five/three with InputOnly handler emission and then seven/four with missing/duplicate execution. Positive one-batch/exact-once witness remains;duplicate rejects without extra reads. Forbidden late child is detected by attempted continuation count,not by assuming a later error is sufficient. Internal injections are not public scheduling authority. REV3/4 payloads equal except source fingerprints. Later script also guards Task deadlines;that added source condition is not retroactively in these original receipts.'
 notes[p]=note
assert totalMutants==21 and survived==0
for names in [['CAMPAIGN2_ADAPT_ROLLBACK_PROOF.json','CAMPAIGN2_ADAPT_ROLLBACK_PROOF_REV2.json'],['CAMPAIGN2_STAGE_BOUNDARY_PROOF_REV3.json','CAMPAIGN2_STAGE_BOUNDARY_PROOF_REV4.json']]:
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
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All six JSON exports including short statuses and exact mutation code strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='FIVE OLD SOURCE IDENTITIES UNRECOVERED; FOUR ADDITIONAL TO PRIOR ADAPT GROUPS',groups=[dict(path=p,sha256=h) for p,h in groups],additionalGroups=[dict(path=p,sha256=h) for p,h in newGroups],occurrences=unresolved,search=search,priorAdaptationGaps=ref(existing),scope='Current files,indexed1193 archives and reviewed sources,reachable exact-path Git raw/LF/CRLF,nine exact-basename workspace candidates. No unreachable-object,renamed-file or global-absence claim.',disposition='RO-C3-021 remains unsatisfied. Recover exact bodies or explicitly limit/exclude dependent historical claims in independent adequacy before HQ012; current changed source cannot impersonate committed old identities.'))
save('review.json',dict(status='SIX ADAPT ROLLBACK/STAGE PROOFS RECONCILED; FOUR ADDITIONAL SOURCE GAPS',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['21 historical detected mutant instances across six reports; revisions are not independent mechanisms.','No runtime,mutant,test,build or writer rerun; original receipts unchanged.','Five unresolved source groups include one previously recorded ADAPT runtime and four additional scheduler/test identities; total ADAPT-associated groups now twelve.','No model,law,allocation,verdict,corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),additionalUnresolvedGroups=len(newGroups),recordedMutants=totalMutants,survivedMutants=survived,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

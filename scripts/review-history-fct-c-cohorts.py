"""Audit historical ADAPT mutation receipts and preserve unrecovered source identities."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-fct-c-cohorts-rev1'
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
ip=P/'campaign3-history-source-roles-rev210/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and 'FCT_C_PROOF' in Path(p).name];assert len(paths)==3
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
files=subprocess.check_output(['rg','--files','--hidden','-g','state.ts','-g','transitionIngressV04.ts','-g','adaptationRuntime.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==2
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==2
existing=P/'campaign3-history-adaptation-boundary-proofs-rev1/unresolved.json'
prior={(x['path'],x['sha256']) for x in load(existing)['groups']};newGroups=[x for x in groups if x not in prior];assert len(newGroups)==1
receipts=[];notes={};totalRejections=0
versions=[load(p) for p in paths]
assert {k:v for k,v in versions[1].items() if k!='sourceFingerprints'}=={k:v for k,v in versions[2].items() if k!='sourceFingerprints'}
for i,p in enumerate(paths):
 v=load(p);fields=['state','event','trace','parent','content','registry']+([] if i==0 else ['identityOrdinal','traceAncestry','perceivedSuccess'])
 for k in ['genericBaseline','boundedBaseline']:
  assert v[k]['status']=='PASS' and v[k]['mode']=='BASELINE' and len(v[k]['tests'])==2 and all(t['state']=='pass' for t in v[k]['tests'])
 expected={(stage,field) for stage in ['evaluation','learning'] for field in fields}
 assert {(x['stage'],x['field']) for x in v['projectionRejections']}==expected and len(v['projectionRejections'])==len(expected)
 for x in v['projectionRejections']:
  assert x['status']=='PASS' and x['mode']=='EXACT REJECTION WITNESS' and len(x['tests'])==1 and x['tests'][0]['state']=='pass'
  if x['field']!='state':assert x['attempt']=='void (input as any).'+x['field']+';'
  else:assert '(input as any).state' in x['attempt'] and 'rootStateTypeId:268n' in x['attempt']
 assert v['priorFailure']==versions[0]['priorFailure']
 totalRejections+=len(expected)
 receipts.append(dict(**ref(p),genericBaselineTests=2,boundedBaselineTests=2,rejectionWitnesses=len(expected),stages=['evaluation','learning'],fields=fields))
 notes[p]='Historical split-scope FCT-C receipt. Generic actual production EVID uses A/B/absent rosters with fixed X and allocation; bounded profile excludes roster declarations and state before construction. Two generic and two bounded baseline tests are separate from '+str(len(expected))+' expected-rejection substitutions. Each substitution records one passing targeted test asserting inner ILLEGAL_READ,outer TRANSITION_FAILURE,zero roster lookup and whole-instant rollback. This is not arbitrary failed-test detection or a new public injection API. Direct context.state bypass in original inline semantic handler remains preserved; detached operand capability fixes that distinct defect. Later identityOrdinal/traceAncestry/perceivedSuccess exclusions do not prove arbitrary trusted-host noninspection of carried occurrence bytes. Original ingress/state bodies recovered by exact Git hash;original runtime remains unrecovered and later REV3 also uses previously unresolved runtime. Same result rows do not equate source identities. No new FCT/VAL/ADAPT/Campaign2 verdict.'
assert totalRejections==48
chain=[ref(P/'campaign3-history-factory-qualification-history-rev1/review.json'),ref(P/'CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md')]
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
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All three JSON exports including short statuses and exact mutation code strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='TWO OLD RUNTIME IDENTITIES UNRECOVERED; ONE ADDITIONAL TO PRIOR ADAPT-ASSOCIATED GROUPS',groups=[dict(path=p,sha256=h) for p,h in groups],additionalGroups=[dict(path=p,sha256=h) for p,h in newGroups],occurrences=unresolved,search=search,priorAdaptationGaps=ref(existing),scope='Current files,indexed1193 archives and reviewed sources,reachable exact-path Git raw/LF/CRLF,six exact-basename workspace candidates. No unreachable-object,renamed-file or global-absence claim.',disposition='RO-C3-021 remains unsatisfied. Recover exact bodies or explicitly limit/exclude dependent historical claims in independent adequacy before HQ012; current changed source cannot impersonate committed old identities.'))
save('review.json',dict(status='THREE FCT-C COHORTS RECONCILED; TWO SOURCES RECOVERED; ONE ADDITIONAL GAP',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['48 historical expected-rejection witness executions across12/18/18 cohorts,not48 independent mechanisms or failing-test mutants.','No runtime,mutant,test,build or writer rerun; original receipts unchanged.','Two unresolved runtime groups include one previously recorded identity and one additional;ADAPT-associated gap groups now thirteen. Two exact original ingress/state bodies recovered from reachable Git.','No model,law,allocation,verdict,corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),additionalUnresolvedGroups=len(newGroups),recordedExpectedRejections=totalRejections,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

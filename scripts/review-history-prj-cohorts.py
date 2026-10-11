"""Reconcile generic projection substitution receipts without rerunning historical writers."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prj-cohorts-rev1'
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
ip=P/'campaign3-history-source-roles-rev213/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and 'PRJ_SUBSTITUTION_PROOF' in Path(p).name];assert len(paths)==3
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
requests=[dict(owner=p,**s) for p in paths for s in load(p)['sourceFingerprints']]
missing={(s['path'],s['sha256']) for s in requests if ref(s['path'])['sha256']!=s['sha256'] and s['sha256'] not in archives}
assert len(missing)==3
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
files=subprocess.check_output(['rg','--files','--hidden','-g','campaign2TransitionAdmission.test.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==1
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==2
receipts=[];notes={}
versions=[load(p) for p in paths]
assert all({k:v for k,v in x.items() if k!='sourceFingerprints'}=={k:v for k,v in versions[0].items() if k!='sourceFingerprints'} for x in versions)
expected=['select-occurrence-instead-of-observer','expose-roster-wrapper','lose-source-wrapper-evidence','skip-required-presence-carrier','skip-roster-static-read-ban','skip-required-roster-projection']
production=Path(archives[versions[0]['sourceFingerprints'][0]['sha256']]).read_text()
selected='FCT-G/K and IDN-8d: required projection accepts only admitted input and exposes only the field'
for p in paths:
 v=load(p);assert v['status']=='COMPONENT PASS'
 assert v['baseline']==dict(name='baseline',status='PASS',tests=[dict(name=selected,state='pass')])
 assert [m['name'] for m in v['mutations']]==expected
 for m in v['mutations']:
  assert m['status']=='DETECTED' and m['source']=='src/campaign2/requiredProjection.ts'
  assert production.count(m['from'])==1 and m['from']!=m['to']
  assert len(m['tests'])==1 and m['tests'][0]['name']==selected and m['tests'][0]['state']=='fail' and m['tests'][0]['errors']
 receipts.append(dict(**ref(p),selectedBaselineTests=1,selectedMutantFailures=6,mutationNames=expected))
 notes[p]='One selected assertion-based generic projection test passes in the baseline and fails for each of six isolated compiler substitutions. Observer selection, exposed field, retained source wrapper, required presence, roster static-read prohibition and mandatory roster projection remain separate controls. The recovered original test verifies forged input rejection before reads, one admitted read, field-only access and full source wrapper evidence. Generic fixture admission is not frozen zero-read EVID activation or an independent projection interpreter. Three receipt payloads are identical except test-file fingerprints; later source bodies remain unresolved. Eighteen recorded mutant failures across repeated cohorts are not eighteen independent mechanisms. The current writer selects pass/fail tasks only, asserts exactly one selected test and one transform, and excludes skipped tasks; it is inspected as current helper provenance, not authenticated as the original writer. No historical writer, test or mutation rerun and no new public qualification.'
chain=[ref(P/'campaign3-history-factory-qualification-history-rev1/review.json'),ref(P/'CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL GENERIC PROJECTION MUTATION COHORT; EXACT SOURCE GAPS RETAINED',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All three JSON exports including short statuses and exact mutation code strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='TWO LATER PROJECTION TEST IDENTITIES UNRECOVERED',groups=[dict(path=p,sha256=h) for p,h in groups],occurrences=unresolved,search=search,scope='Current files, indexed 1196 archives and reviewed sources, four reachable exact-path Git revisions raw/LF/CRLF, and two exact-basename workspace candidates. No unreachable-object, renamed-file or global-absence claim.',disposition='Recover exact bodies or explicitly limit/exclude their dependent historical claims during independent adequacy before HQ012. Identical recorded results do not authenticate changed test sources.'))
save('review.json',dict(status='THREE PROJECTION COHORTS RECONCILED; ORIGINAL TEST RECOVERED; TWO LATER IDENTITIES OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),currentWriter=ref('scripts/prove-campaign2-prj-substitutions.mjs'),limits=['Three baseline and eighteen mutant selected-test executions recorded across three historical cohorts; six distinct substitutions, not a full test suite.','Original test recovered exactly from reachable Git; later two test bodies unresolved. Production compiler already preserved exactly.','Fresh stored-receipt and source-anchor checks only; no test, build, mutation or historical writer rerun.','No model, law, allocation, verdict, corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),recordedMutantFailures=18,distinctSubstitutions=6,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

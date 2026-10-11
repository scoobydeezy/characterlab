"""Audit historical ADAPT mutation receipts and preserve unrecovered source identities."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-adaptation-proof-cohorts-rev1'
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
ip=P/'campaign3-history-source-roles-rev203/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and any(n in Path(p).name for n in ['ADAPT_WRITE_BOUNDARY','RULE_OVERLAP','STATE_INVARIANT'])];assert len(paths)==9
md=(P/'CAMPAIGN2_AD_E13_CONSOLIDATION_REVIEW.md').as_posix();assert md in ix['unassignedCandidatePaths']
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
requests=[dict(owner=p,**s) for p in paths for s in load(p)['sourceFingerprints']]
missing={(s['path'],s['sha256']) for s in requests if ref(s['path'])['sha256']!=s['sha256'] and s['sha256'] not in archives}
assert len(missing)==6
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
files=subprocess.check_output(['rg','--files','--hidden','-g','adaptationEvaluation.ts','-g','campaign2MutationEvidence.test.ts','-g','adaptationDomains.ts','-g','!.git/**'],text=True).splitlines()
for p in sorted(files):inspect(Path(p).read_bytes(),dict(path=Path(p).as_posix(),kind='workspace exact basename candidate'))
assert len(recovered)==1
bindings=[];unresolved=[]
for s in requests:
 actual=s['path'] if ref(s['path'])['sha256']==s['sha256'] else archives.get(s['sha256'])
 if actual:
  assert ref(actual)['sha256']==s['sha256'];bindings.append(dict(original=s,actual=ref(actual)))
 else:unresolved.append(s)
groups=sorted({(s['path'],s['sha256']) for s in unresolved});assert len(groups)==5
existing=P/'campaign3-history-exit-consolidation-rev2/unresolved-identities.json'
assert not any(h in existing.read_text(encoding='utf-8') for _,h in groups)
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
 assert v['status']==('COMPONENT PASS' if all(m['status']=='DETECTED' for m in v['mutants']) else 'INCOMPLETE')
 receipts.append(dict(**ref(p),baselineTests=len(base['tests']),mutants=summary))
 note='Historical fixed in-memory substitutions,not exhaustive equivalence or new runtime evidence. Exact full test names,statuses,errors and from/to replacements retained. Detection means the named historical tests failed,not a generic setup error. Missing old source hashes remain explicit; later refreshed evidence cannot impersonate earlier bodies. '
 n=Path(p).name
 if 'APPLICABILITY' in n:note+='Two-rule controls distinguish referent membership,empty dispatch and state-dependent filtering. Same numerical outcomes across revisions do not equate source commitments.'
 elif 'RULE_OVERLAP' in n:note+='21 baseline cases:15 overlap negatives,four disjoint positives,one original positive and one contingent runtime collision. Construction and runtime rejection remain distinct. Mixed Gate is literal Always versus FrozenBaseline; original rule unchanged. Public Failed status expected; full queue/allocator rollback is separately owned.'
 elif 'STATE_INVARIANT' in n:note+='13 tests/seven omissions:explicit zero,tolerance/load bounds,three referenced-domain checks and full procedural-map coverage. Includes initial/restore and generic future-writer scope,not all AD-F7. Exact old adaptationDomains body recovered from reachable Git; hashing does not prove execution time.'
 elif n=='CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF.json':note+='INCOMPLETE16-test cohort retained:skip-staged-patch SURVIVED,while target and actual-diff omissions detected. Later accepted removal of redundant guard does not rewrite this receipt.'
 else:note+='Successor16/23/24/25-test cohorts enlarge scope:counterfactual component family guard,qualified subject split,staged output and then independent pre-snapshot label/path oracle. Generic positives are not admitted public branches; equal-value Set retains WRT semantics.'
 notes[p]=note
assert totalMutants==35 and survived==1
notes[md]='Accepted finite AD-E13 construction/runtime matrix with21 tests and three policy mutants. Mixed-Gate ambiguity resolved by reading existing original Always and duplicate FrozenBaseline fields,not rerunning or changing fixtures. Literal Gate/Step variation,all five key forms,both basis kinds and disjoint positives retained. Initial Active-after-failure expectation corrected to Failed without production change. Queue/allocator rollback not proved by public snapshot alone. Last forward acceptance supersedes pending review text; does not close all B/FCT or manufacture five evaluated rules from five outputs.'
chain=[ref(P/'campaign3-history-adaptation-packaging-rev1/review.json'),ref(P/'CAMPAIGN2_ADAPT_WRITE_BOUNDARY_REVIEW.md'),ref(P/'CAMPAIGN2_ADAPT_B_REACHABILITY_REVIEW.md'),ref(P/'CAMPAIGN2_AD_E4_E8_CONSOLIDATION_REVIEW.md'),ref(P/'CAMPAIGN2_ADAPT_COMPOSITION_REVIEW.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL ADAPT MUTATION COHORT; SOURCE GAPS AND SURVIVED CONTROL RETAINED',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All nine JSON exports including short statuses and exact mutation code strings. No new execution or source fingerprint inferred from labels.'))
save('unresolved.json',dict(status='FIVE OLD ADAPT SOURCE IDENTITIES UNRECOVERED',groups=[dict(path=p,sha256=h) for p,h in groups],occurrences=unresolved,search=search,existingExitInventory=ref(existing),scope='Current files,indexed1192 archives and reviewed sources,reachable exact-path Git raw/LF/CRLF,seven exact-basename workspace files. Not unreachable Git objects,renamed files or global absence.',disposition='RO-C3-021 remains unsatisfied. Independent adequacy must recover exact bodies or explicitly dispose affected historical claims before HQ012; changed current source cannot replace committed old identities.'))
save('review.json',dict(status='TEN ADAPT PROOF/REVIEW SOURCES RECONCILED; FIVE SOURCE GAPS OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['35 historical mutant instances include34 detections and one survived redundant guard; revisions are not independent mechanism counts.','No runtime,mutant,test,build or historical writer rerun. No model,law,allocation,verdict,corpus or obligation status change.','Five unrecovered historical hashes are additional to existing source gaps; one exact old domain source recovered. Byte integrity does not establish historical timestamp.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED RECEIPT REVIEW; SOURCE ADEQUACY OPEN',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=len(recovered),unresolvedIdentityGroups=len(groups),recordedMutants=totalMutants,survivedMutants=survived,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))

"""Review superseded embodied proposals and historical execution metadata, preserving missing-source limits."""
from pathlib import Path
import json,hashlib,re
from collections import Counter
P=Path('docs/planning');O=P/'campaign3-history-embodied-metadata-rev1';B=P/'campaign3-history-universe-rev1'
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
specs={
 'CAMPAIGN3_EMBODIED_DRAFT_AUDIT_REV1.json':'Fresh original nine finite scaled-integer examples and two invalid-width checks exactly reproduce receipt;446 historical preservation entries resolve to exact bytes. Not a partition theorem, runtime execution, biological law or EMB-A..O acceptance. Later independent fixture arithmetic and public qualification carry those separate scopes.',
 'CAMPAIGN3_EMBODIED_INGRESS_DRAFT_AUDIT_REV1.json':'Historical22link/14vector/446preservation document check explicitly executed no producer, absence, budget or restore control. Old ingress draft and CURRENT hashes unavailable: exclude unseen content and old link target authority. Separately reviewed accepted ingress shape and later public evidence carry actual scientific claims; no alias or fresh22link claim.',
 'EMBODIED_RECEIVING_ALLOCATION_DRAFT.json':'All proposal fields except version/status exactly equal the later permanent table;31records/110fields/49text members plus5union variants,19scalar roles,one map key,four collection checks and10output identities. Pure numeric proposal does not activate a model or settle a receiving law. Original no-new-namespace and inherited alias boundaries retained.',
 'EMBODIED_RECEIVING_ALLOCATION_DRAFT.md':'All31record names and110ordered field labels match machine proposal and later accepted table. Markdown delegates exact member payloads/roles/unions to JSON and required independent review, which is separately bound by formal-contract audit. Draft not-permanent status is dated, not a current allocation blocker or behavioral verdict.',
 'EMBODIED_REGRESSION_RECONCILIATION_REV1.json':'Historical1103pass/one list-versus-set harness failure plus replacing all EMB files with46targeted assertions yields1109/127files. Later47targeted gives1110, with one additional trace-metadata/projection test and original46 retained. Five old implementation/test hashes unavailable; do not authenticate their content from test titles. Current-source qualified47/49prefix/12mutant evidence is separate corroboration, not a fresh1109suite.',
 'EMBODIED_RESERVE_ALLOCATION_DRAFT.json':'All proposal fields except version/status exactly equal permanent table:32records/128fields,one1142namespace,43members including4union variants,40scalar roles,one map key andtwo collection gates. Shared occurrence allocator, closed sample alias and no new logical leaf preserved. Numeric allocation does not widen old pulse-unit singleton or qualify behavior.',
 'EMBODIED_RESERVE_ALLOCATION_DRAFT.md':'All32record names and128ordered field labels match machine proposal. Conditional payload fields are exact union restrictions, not unconstrained optional fields. Explicit roles, absence without reservation, no numeric failure enum invention, no activation/renumbering and separate numeric gate remain. Later accepted table and review supersede dated NOT PERMANENT without erasing these boundaries.',
 'EMBODIED_RESERVE_ALLOCATION_DRAFT_AUDIT.json':'Proposal integrity only;32records128fields43members4unions2finitevalues40roles1mapkey2collectionchecks,17prior tables/298schema pairs and446preserved entries. Same-generator Markdown is not independent parity, and no new codec/behavior executes here. Later formal-contract audit supplies independent79roundtrips and6faults, not retroactive draft qualification.',
 'EMBODIED_RUNTIME_MUTANTS_REV1.json':'All9actual substitution/result rows retained byte-for-byte as JSON values in later12case cohorts. New controls add delivery allocation, unauthorized pressure body read and sample occurrence reuse. Three old code hashes unavailable and excluded as authenticated implementation content; later fresh12case replay corroborates exact outcomes. Production rejection differs from canonical reference-law disagreement; no reduction verdict.',
 'EMBODIED_RUNTIME_MUTANTS_REV2.json':'All12intervention/result rows exactly equal laterREV3, including failure messages and code substitutions; prior nine retained. Three old code hashes unavailable; current qualified implementation is not their alias. Prior fresh12fault replay supports bounded detection without authenticating old source versions or universal biology/receiving claims.',
 'EMBODIED_TARGETED_TESTS_REV1.json':'Historical46passed assertions in9file results; reported19nested suites kept separate. Same46 assertion occurrences retained in later47; additional test covers every metadata/projection field against actual execution facts. No pending/failure/snapshot payloads hidden in reporter metadata. Titles identify scoped tests, not source-byte proof or new psychological findings. No fresh46test run claimed.'
}
specs={(P/k).as_posix():v for k,v in specs.items()};prior=load(P/'campaign3-history-source-roles-rev142/index.json');assert not set(specs)&{x['path'] for x in prior['roleAssignments']}
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
arithmetic=load(O/'arithmetic.json');assert arithmetic['status']=='PASS' and arithmetic['arithmeticChecks']==11
for k in ['original','checker']:assert ref(arithmetic[k]['path'])==arithmetic[k]
for b in arithmetic['bindings']:assert ref(b['resolvedPath'])['sha256']==b['sha256']
allocation=[]
for name,counts in [('RESERVE',(32,128)),('RECEIVING',(31,110))]:
 d=load(P/f'EMBODIED_{name}_ALLOCATION_DRAFT.json');f=load(Path('docs/formal')/f'EMBODIED_{name}_ALLOCATION_TABLE.json')
 assert all(v==f[k] for k,v in d.items() if k not in ['version','status'])
 assert (len(d['records']),sum(len(x['fields']) for x in d['records']))==counts
 md=(P/f'EMBODIED_{name}_ALLOCATION_DRAFT.md').read_text(encoding='utf-8-sig')
 for r in d['records']:
  if name=='RESERVE':row=f"| {r['typeId']} | {r['name']} | ";sep=': '
  else:row=f"|{r['typeId']}/1|{r['name']}|";sep=' '
  line=next(x for x in md.splitlines() if x.startswith(row));labels=line[len(row):].rstrip(' |').split('; ')
  expected=[str(x['id'])+sep+x['name']+('?' if not x['required'] and name=='RESERVE' else '') for x in r['fields']]
  # Reserve Markdown uses compact id:name spelling.
  if name=='RESERVE':expected=[x.replace(': ',':') for x in expected]
  assert labels==expected,(r['name'],labels,expected)
 allocation.append(dict(draft=ref(P/f'EMBODIED_{name}_ALLOCATION_DRAFT.json'),accepted=ref(Path('docs/formal')/f'EMBODIED_{name}_ALLOCATION_TABLE.json'),records=counts[0],fields=counts[1],allNonStatusProposalFieldsUnchanged=True))
audit=load(P/'EMBODIED_RESERVE_ALLOCATION_DRAFT_AUDIT.json');assert [audit[k] for k in ['records','fields','newNamespaces','members','unionVariants','finiteValues','roles','mapKeyRoles','collectionIdentityChecks','priorTables','existingRuntimeSchemaPairs','preservedChecks']]==[32,128,1,43,4,2,40,1,2,17,298,446]
ingress=load(P/'CAMPAIGN3_EMBODIED_INGRESS_DRAFT_AUDIT_REV1.json');assert (ingress['links'],ingress['proposedVectors'],ingress['frozenChecks'])==(22,14,446)
reportKeys={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'}
suiteKeys={'assertionResults','endTime','message','name','startTime','status'};assertionKeys={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'}
def relative(p):return p.replace('\\','/').split('/characterlab/',1)[1]
def tests(n,count):
 v=load(P/n);assert set(v)==reportKeys and v['success'] and v['numTotalTests']==v['numPassedTests']==count and len(v['testResults'])==9
 assert not any(v[k] for k in ['numFailedTestSuites','numPendingTestSuites','numFailedTests','numPendingTests','numTodoTests']) and not any(v['snapshot'].values())
 for r in v['testResults']:
  assert set(r)==suiteKeys and r['message']=='' and r['status']=='passed'
  for a in r['assertionResults']:assert set(a)==assertionKeys and a['status']=='passed' and a['failureMessages']==[] and a['meta']=={}
 return {relative(r['name']):r for r in v['testResults']}
x=tests('EMBODIED_TARGETED_TESTS_REV1.json',46);y=tests('EMBODIED_TARGETED_TESTS_REV2.json',47)
names=lambda rows:Counter((p,a['fullName'],a['status']) for p,r in rows.items() for a in r['assertionResults'])
assert names(x)<=names(y) and names(x).total()==46 and names(y).total()==47
added=list((names(y)-names(x)).elements());assert len(added)==1 and 'every metadata/projection field' in added[0][1]
reg=load(P/'EMBODIED_REGRESSION_RECONCILIATION_REV1.json');full=load(reg['full']['path']);assert (full['numPassedTests'],full['numFailedTests'])==(1103,1)
rows={relative(r['name']):r for r in full['testResults']};rows.update(x)
assert len(rows)==reg['files']==127 and names(rows).total()==reg['tests']==1109 and all(a['status']=='passed' for r in rows.values() for a in r['assertionResults'])
assert set(rows)=={x['path'] for x in reg['currentTestFiles']}
failed=[dict(file=relative(r['name']),test=a['fullName'],originalFailure=a['failureMessages']) for r in full['testResults'] for a in r['assertionResults'] if a['status']=='failed'];assert failed==reg['corrected'] and 'requires list' in failed[0]['originalFailure'][0]
mutants=[load(P/f'EMBODIED_RUNTIME_MUTANTS_REV{i}.json') for i in [1,2,3]];assert [len(x['results']) for x in mutants]==[9,12,12]
for old,new in zip(mutants,mutants[1:]):
 after={x['name']:x for x in new['results']};assert all(after[x['name']]==x for x in old['results'])
assert mutants[1]['results']==mutants[2]['results']
search=load(O/'source-recovery.json');assert search['found']==[] and len(search['unavailable'])==10
missing={(x['path'],x['sha256']) for x in search['unavailable']}
assert all(v['sha256'] not in {x[1] for x in missing} for s in search['searches'] for v in s['versions'])
chain=[ref(O/'arithmetic.json'),ref(O/'source-recovery.json')]+[ref(P/n/'review.json') for n in ['campaign3-history-embodied-contracts-rev1','campaign3-history-embodied-boundaries-rev1','campaign3-history-embodied-reserve-rev1']]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[];unavailable=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SUPERSEDED NUMERIC PROPOSAL / HISTORICAL METADATA OR FAULT RECEIPT',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  if path:assert ref(path)['sha256']==f['sha256'];bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
  else:
   assert (f['path'],f['sha256']) in missing
   unavailable.append(dict(source=p,**f,disposition='Excluded from authenticated old source-content authority. Original receipt remains historical evidence; later separately authenticated contracts/tests/faults corroborate bounded claims without aliasing missing bytes. Final HQ011 adequacy must assess exclusion.'))
occurrences=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/limitation','/notes')) or '/originalFailure' in ptr or ('MUTANTS' in u['source'] and bool(re.fullmatch(r'/results/\d+/(name|detectedBy|failure|message)',ptr)))
  occurrences.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='EMBODIED METADATA RECONCILED WITH EXPLICIT HISTORICAL CONTENT EXCLUSIONS; HQ011 OPEN',sourceRoles=roles,rows=occurrences,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,unavailableSourceBindings=unavailable,allocationParity=allocation,addedTest=added,originalHarnessFailure=failed,obligations=['RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No old link audit, full suite or old implementation rerun claimed. Eleven fresh arithmetic checks only; later47tests/49prefixes/12mutants are reused dated evidence.','Ten unavailable historical hashes (two document, two test, six implementation) after bounded exact-path local Git search remain excluded as source-content authority; no remote or all-object exhaustion claim.','Numeric draft fields exactly survive permanence, but model admission and psychological/biological adequacy remain separate.','Current compound regression1109/1110 wording is historical receipt scope, never fresh full-suite evidence. No new law, allocation, verdict, corpus or obligation closure. Final HQ011 adequacy still required.'])
c=dict(status='PASS WITH EXPLICIT HISTORICAL CONTENT EXCLUSIONS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in occurrences),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in occurrences),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(unavailable),unavailableDistinctHashes=len(missing),freshArithmeticChecks=11,unchangedProposalRecords=63,unchangedProposalFields=238,historicalTests=46,composedHistoricalTests=1109,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

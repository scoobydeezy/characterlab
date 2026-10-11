"""Reconcile GA historical failed/passing regression and unchanged-evidence promotion."""
from pathlib import Path
from collections import Counter
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-support-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fps(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fps(x)
 elif isinstance(v,list):
  for x in v:yield from fps(x)
reportKeys={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'}
def tests(path,total,failed,files):
 v=load(path);assert set(v)==reportKeys and v['numTotalTests']==total and v['numPassedTests']==total-failed and v['numFailedTests']==failed and v['success']==(failed==0)
 assert v['numPendingTests']==v['numTodoTests']==0 and not any(v['snapshot'].values())
 rows={t['name'].replace('\\','/').split('/characterlab/',1)[1]:t for t in v['testResults']};assert len(rows)==files and sum(len(t['assertionResults']) for t in rows.values())==total
 for t in rows.values():
  assert set(t)=={'assertionResults','endTime','message','name','startTime','status'}
  for a in t['assertionResults']:
   assert set(a)=={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'} and a['meta']=={}
   assert a['status'] in ['passed','failed'] and (a['failureMessages']==[])==(a['status']=='passed')
 return rows
names=lambda rows:Counter((p,a['fullName']) for p,t in rows.items() for a in t['assertionResults'])
old=tests(P/'GA_FULL_SOURCE_TESTS_2026_09_19.json',2163,9,273);new=tests(P/'GA_FULL_SOURCE_TESTS_2026_09_20.json',2171,0,273);reference=tests(P/'GA_REFERENCE_TESTS_2026_09_20.json',328,0,43);promotionTests=tests(P/'GA_CORPUS_PROMOTION_TESTS_2026_09_20.json',6,0,1);fresh=tests(O/'current-tests.json',60,0,3)
assert set(old)==set(new) and names(old)<=names(new)
added=list((names(new)-names(old)).elements());assert len(added)==8 and all(p=='src/test/generalDeclarationProfile.test.ts' and 'footprint-' in title for p,title in added)
failed=[dict(file=p,title=a['fullName'],messages=a['failureMessages']) for p,t in old.items() for a in t['assertionResults'] if a['status']=='failed']
assert len(failed)==9
assert sum(x['file']=='src/test/generalFactory.test.ts' and x['messages'][0].startswith('Error: GA_UNADMITTED_RECIPE') for x in failed)==8
assert failed[-1]['file']=='src/test/generalSourceStateIntegration.test.ts' and 'length of 2 but got 3' in failed[-1]['messages'][0]
assert names(fresh)==names({p:new[p] for p in fresh})
assert names(promotionTests)==names({'src/test/contentGovernance.test.ts':fresh['src/test/contentGovernance.test.ts']})
assert len(fresh['src/test/generalFactory.test.ts']['assertionResults'])==45 and len(fresh['src/test/generalSourceStateIntegration.test.ts']['assertionResults'])==9
rollback=new['src/test/generalStageRollback.test.ts']['assertionResults'];assert len(rollback)==84
stagePrefix='rolls back the whole instant after actual stage '
stages={a['fullName'][len(stagePrefix):] for a in rollback if a['fullName'].startswith(stagePrefix)}
result=load(P/'general-attention-public-comparisons-rev1/RESULTS.json');actual=set()
for row in result['runs']:actual.update(load(row['file']['path'])['stageCounts'])
assert stages==actual and len(stages)==77
commits=[a['fullName'] for a in rollback if a['fullName'].startswith('rolls back completed owner batches')]
assert len(commits)==6 and all(any(t.endswith(str(n)+'n') for t in commits) for n in [3,6,37,38,39,100])
count=0
for n in ['campaign3-general-attention-model-rev1/FREEZE.json','campaign3-general-attention-model-rev2/FREEZE.json']:
 f=load(P/n)
 for model in f['models']:
  for image in model['files'].values():assert ref(image['path'])==image;count+=1
 for image in f['shared'].values():assert ref(image['path'])==image;count+=1
assert count==550
completion=load(P/'GA_COMPLETION_RECEIPT_2026_09_20.json');assert completion['frozenImageFilesVerified']==550 and completion['verdictEntries']==13
promotion=load(O/'promotion.json');assert promotion['status']=='PASS' and promotion['preservedMembers']==20
for f in fps(promotion):assert ref(f['path'])==f
recovery=load(O/'source-recovery.json');assert len(recovery['found'])==2 and len(recovery['unavailable'])==5
prior=load(P/'campaign3-history-source-roles-rev146/index.json');archives={a['sha256']:a['path'] for a in prior['explicitBackingOutsideProseManifest']}
for f in recovery['found']:assert ref(f['resolvedPath'])['sha256']==f['sha256'];archives[f['sha256']]=f['resolvedPath']
missing={(f['path'],f['sha256']) for f in recovery['unavailable']}
specs={
 'GA_FULL_SOURCE_TESTS_2026_09_19.json':'Historical process FAIL:2163 assertions/273 files,2154passed/9failed. Eight footprint factory recipes rejected asGA_UNADMITTED_RECIPE and one source-state spatial fixture expected2graph keys butgot3. Original failed receipt retained; later pass doesnot retroactively make itpassed. Same assertion occurrences survive September20 with eight additional declaration controls. Qualification reports mixed-module/implicit-baseline cause; current tests explicitly choose allocation-spatial. No authenticated snapshot of the running mixed modules is claimed.',
 'GA_FULL_SOURCE_TESTS_2026_09_20.json':'Historical2171assertions/273filesPASS. All2163 earlier assertions retained, eight new footprint declaration tests. Exact77stage rollback names equal77active event types in actual43run summaries;84rollback assertions comprise77stagefaults,6beforecommitfaults and1coverage assertion. Read current fault harness: reached injection aftertracevalidation,exact clock/state/threeallocators/queue/trace/outputs rollback,Failed status; internal conformancehook,notpublic ingress orRNGclaim. Fresh only54factory/source integration plus6governance tests,not2171/fullreference/build.',
 'GA_REFERENCE_TESTS_2026_09_20.json':'Historical328assertions/43referencefilesPASS; full reporter schema/failure fields inspected. Source and reference denominators remain separate. No fresh reference execution or canonical topology authority follows from these legacy assertions.',
 'GA_CORPUS_PROMOTION_TESTS_2026_09_20.json':'Historical6governance assertions in1file,exact occurrence names/statuses freshly pass. Firstfive exercise content/registry commitment and ten-member legacy manifest golden behavior; sixth checks current corpus row/section agreement. Those alone do not prove21member promotion semantics; independent original promotion transformation now reconstructs all21entries/preserved20sections/ATTNrequirements.',
 'CORPUS_0_29_0_PROMOTION_REV1.json':'Fresh read-only execution of original promotion transformation exactly reconstructs full existing corpus text and receipt. Both0.28 and0.29canonical manifests anddistinct ExperimentIdentities recomputed. ATTN1.0.0-draft→1.1.0 preserves its requirements; other20entire sections unchanged. Old0.28public results reused explicitly,notrerunorrenamed. No corpus publication or wholephenomenonPASS. Preserved prior document is backing to this exact transformation,not a new whole-source semantic review.',
 'GA_COMPLETION_RECEIPT_2026_09_20.json':'Historical completion metadata,not new scientific qualification.550image-file checks=247 predecessor plus303 successor commitments,not550models. Three missing ledger entries correctedforward September20 withoutbackdating; current ledger records correction,old13entry count remains historical because exactoldledger unavailable. AGENTS exactGitblob andSEAM_LEDGER SHA-exact LF→CRLF reconstruction recovered. Five unavailable oldstatusdocs excluded ascontentauthority; no currentdoc alias. Build/referenceboundaryPASS dated,notrerun. No owner ruling or runtime law selected.'
}
specs={(P/n).as_posix():v for n,v in specs.items()};assert not set(specs)&{x['path'] for x in prior['roleAssignments']}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[];unavailable=[]
chain=[ref(O/n) for n in ['promotion.json','current-tests.json','source-recovery.json','startup-failure.json']]+[ref(P/'campaign3-history-ga-public-rev1/review.json')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GA HISTORICAL REGRESSION / FAILURE / PROMOTION SUPPORT',judgment=j,acceptanceChain=chain));v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  if target:
   assert ref(target)['sha256']==f['sha256'];bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target))
  else:
   assert (f['path'],f['sha256']) in missing
   unavailable.append(dict(source=p,**f,disposition='Exclude unavailable snapshot as authenticated historical content; do not substitute current file. Concrete behavior supported by separately bound run/test/promotion evidence. Final HQ011 authority adequacy must assess this exclusion.'))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location']['pointer'];assert strings[u['source'],ptr]==u['text'] and u['sourceSha256']==entries[u['source']]['sha256']
  narrative=ptr in ['/ledgerCorrection','/build','/executionProvenance'] or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
sourcePaths=['src/test/generalStageRollback.test.ts','src/test/generalFactory.test.ts','src/test/generalSourceStateIntegration.test.ts','src/test/contentGovernance.test.ts','scripts/replay-history-ga-support-tests.mjs']
r=dict(status='GA QUALIFICATION SUPPORT RECONCILED WITH FIVE HISTORICAL CONTENT EXCLUSIONS; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,unavailableSourceBindings=unavailable,preservedArtifacts=[dict(path=x['resolvedPath'],sha256=x['sha256'],method=x['method'],originalPath=x['path']) for x in recovery['found']],originalFailures=failed,addedDeclarationAssertions=added,currentInspectedSources=[ref(p) for p in sourcePaths],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh60focused assertions andread-onlypromotion reconstruction only; no fresh84rollback,2171full,328reference orbuild.','Oldfaultnames andcurrentharness inspection corroborate precise historicalscope,not oldrunningmodule byte provenance. NoRNG/fullpublicinputfaultclaim.','Five unavailable historicalstatusdocs remain excluded from contentauthority afterboundedlocalGitsearch. Finaladequacy open.','Startup directCLI failed config access beforetests; established config:false harness preserves exact current-source tests.','Corpus/0.29promotion is unchanged-evidence reuse,not renaming0.28executions orwholecorpusPASS. No obligation closure.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(unavailable),freshTests=60,historicalRollbackStages=77,historicalCommitFaults=6,preservedImageChecks=550,recoveredArtifacts=2,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

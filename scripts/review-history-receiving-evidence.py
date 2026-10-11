"""Reconcile declaration/test/mutant/replay history with explicit missing-source limits."""
from pathlib import Path
import json,hashlib,re
from collections import Counter
P=Path('docs/planning');O=P/'campaign3-history-receiving-evidence-rev1';B=P/'campaign3-history-universe-rev1'
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
 'EMBODIED_RECEIVING_DECLARATION_REVIEW_REV1.json':'Fresh585 original component assertions across13materialized images reproduce receipt. Exact two-kind content/recursive roles,5state families,3bodyPRJ,16stage schema/phase/NoStateWrites,workspace-onlyIDN,20occurrence mappings,deadline-onlyroute and new descriptors. Does not by itself prove complete definition-reference/recipe closure or runtime/RNG/joins/replay; prior180-check freeze review and public qualification remain separate.',
 'EMBODIED_RECEIVING_TARGETED_TESTS_REV1.json':'Historical25passed assertions in5file results, not10files (reported nested suite count10). Supersedes22receiving assertions in broad historical suite; laterREV2 adds concurrent-settlement and actual-sibling tests to27in6files with all25retained. Empty failure/message/meta/snapshot fields and exact reporter schema carry execution metadata, not independent research claims or current code provenance. No fresh25-test run claimed.',
 'EMBODIED_RECEIVING_FULL_TESTS_REV1.json':'Historical1460passed assertions in174files:1132active in131files plus328reference in43files. Reporter380suite count is not file count. Includes22receiving assertions; replacing their suites with later27 gives1137active in133files. No hidden failure messages/pending/todo/snapshot differences. Test titles are scoped execution backing rather than new laws; no present-day full suite or source fingerprint authority inferred from absolute filenames.',
 'EMBODIED_RECEIVING_REFERENCE_TESTS_REV1.json':'Historical328passed reference assertions in43file results; reported153nested suites retained separately. Exact assertion name/status set agrees with reference part of broad suite. Timings/path/name/status fields are historical execution metadata, not current source commitments or scientific proof beyond separately reviewed claims. No freshreference execution claimed.',
 'EMBODIED_RECEIVING_REPLAY_REV1.json':'All29specimen/all13model/86prefix result rows, hashes and save sizes equal laterREV2 exactly; only three source fingerprint entries differ. Prior freshREV2 replay supplies scoped behavioral corroboration. Old8a458runtime bytes unavailable and excluded from authenticated implementation evidence; newer runtime is not its alias. Complete finite witness tails are not arbitrary admitted-sequence coverage.',
 'EMBODIED_RECEIVING_MUTANTS_REV1.json':'Historical14named actual-source substitutions and7unchanged controls. Every intervention/result/failure row survives unchanged in later19/20case cohorts; fresh20case audit corroborates those results. Production rejection differs from reference-law output disagreement. Old07b229runtime bytes unavailable and excluded from authenticated old implementation evidence. Detection is not universal law selection or proof for future producers.',
 'EMBODIED_RECEIVING_MUTANTS_REV2.json':'Historical19substitutions preserve14prior rows and add5trace-field omissions/subject corruption, all detected by independenttrace verification. LaterREV3 adds late-execution-body-read and eighth control. Exact old19rows survive; no claim of freshly running the old implementation.8a458runtime missing-source exclusion remains. Handler-owned body access and concurrent settle correction receive later separate evidence.'
}
specs={(P/k).as_posix():v for k,v in specs.items()}
prior=load(P/'campaign3-history-source-roles-rev141/index.json');assert not set(specs)&{x['path'] for x in prior['roleAssignments']}
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
fresh=load(O/'declarations.json');assert fresh['status']=='PASS'
for k in ['original','checker']:assert ref(fresh[k]['path'])==fresh[k]
for b in fresh['bindings']:assert ref(b['resolvedPath'])['sha256']==b['sha256']
for b in fresh['currentSources']:assert ref(b['path'])==b
declaration=load(P/'EMBODIED_RECEIVING_DECLARATION_REVIEW_REV1.json');assert declaration['checked']==len(declaration['checks'])==585
assert len(set(declaration['checks']))==585
manifest=load(P/'embodied-receiving-model-review-rev1/REVIEW.json');assert len(manifest['models'])==13
for m in manifest['models']:assert sum(x.startswith(m['name']+' ') or x.startswith(m['name']+'20 ') or x.startswith(m['name']+'deadline-only') or x.startswith(m['name']+'all new') for x in declaration['checks'])==45
reportKeys={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'}
suiteKeys={'assertionResults','endTime','message','name','startTime','status'};assertionKeys={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'}
testSummary=[]
def relative(p):return p.replace('\\','/').split('/characterlab/',1)[1]
def tests(name,count,files):
 v=load(P/name);assert set(v)==reportKeys and v['success'] and v['numPassedTests']==v['numTotalTests']==count and len(v['testResults'])==files
 assert all(v[k]==0 for k in ['numFailedTestSuites','numPendingTestSuites','numFailedTests','numPendingTests','numTodoTests'])
 assert not any(v['snapshot'].values())
 rows={}
 for r in v['testResults']:
  assert set(r)==suiteKeys and r['status']=='passed' and r['message']==''
  for a in r['assertionResults']:
   assert set(a)==assertionKeys and a['status']=='passed' and a['failureMessages']==[] and a['meta']=={}
  rows[relative(r['name'])]=r
 assert len(rows)==files and sum(len(r['assertionResults']) for r in rows.values())==count
 testSummary.append(dict(source=name,assertions=count,files=files,reportedSuites=v['numTotalTestSuites'],scope='Historical reporter metadata, not fresh execution or code-byte authentication.'))
 return rows
full=tests('EMBODIED_RECEIVING_FULL_TESTS_REV1.json',1460,174);target=tests('EMBODIED_RECEIVING_TARGETED_TESTS_REV1.json',25,5);reference=tests('EMBODIED_RECEIVING_REFERENCE_TESTS_REV1.json',328,43)
names=lambda rows:Counter((p,a['fullName'],a['status']) for p,r in rows.items() for a in r['assertionResults'])
assert names(reference)==names({p:r for p,r in full.items() if p.startswith('reference/')})
active={p:r for p,r in full.items() if p.startswith('src/')};assert len(active)==131 and names(active).total()==1132
receiving={p:r for p,r in active.items() if p.startswith('src/test/receiving')};assert names(receiving).total()==22
latest=load(P/'EMBODIED_RECEIVING_TARGETED_TESTS_REV2.json');later={relative(r['name']):r for r in latest['testResults']}
assert names(target)<=names(later);added=sorted(x[1] for x in (names(later)-names(target)).elements());assert len(added)==2
assert any('concurrent settle' in x for x in added) and any('completed siblings' in x for x in added)
active.update(later);assert len(active)==133 and names(active).total()==1137
r1=load(P/'EMBODIED_RECEIVING_REPLAY_REV1.json');r2=load(P/'EMBODIED_RECEIVING_REPLAY_REV2.json')
assert {k:v for k,v in r1.items() if k!='sources'}=={k:v for k,v in r2.items() if k!='sources'}
assert (r1['models'],r1['publicSpecimens'],r1['prefixes'])==(13,29,86)
assert sum(len(x['prefixes']) for x in r1['results'])==86
assert all(p['restoreAndContinuation']=='PASS' for r in r1['results'] for p in r['prefixes'])
replayDeltas=[dict(before=a,after=b) for a,b in zip(r1['sources'],r2['sources']) if a!=b];assert len(replayDeltas)==3
mutants=[load(P/f'EMBODIED_RECEIVING_MUTANTS_REV{i}.json') for i in [1,2,3]];assert [len(v['results']) for v in mutants]==[14,19,20]
mutantAdditions=[]
for old,new in zip(mutants,mutants[1:]):
 before={x['name']:x for x in old['results']};after={x['name']:x for x in new['results']};assert all(after[k]==v for k,v in before.items());mutantAdditions.append(sorted(set(after)-set(before)))
assert len(mutantAdditions[0])==5 and mutantAdditions[1]==['late-execution-body-read']
assert [v['unchangedPublicControlExecutions'] for v in mutants]==[7,7,8]
exclusion=load(O/'source-exclusion.json');missing=set(exclusion['missing']);assert len(missing)==2
assert ref(exclusion['basis']['path'])==exclusion['basis'] and len(exclusion['candidateHashes'])==64 and all(x['sha256'] not in missing for x in exclusion['candidateHashes'])
search=load(O/'source-recovery.json');assert set(search['missing'])==missing and search['found']==[]
chain=[ref(O/'declarations.json'),ref(O/'source-exclusion.json'),ref(O/'source-recovery.json'),ref(P/'campaign3-history-embodied-receiving-rev1/review.json'),ref(P/'campaign3-history-receiving-freeze-rev1/review.json')]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[];unavailable=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='DECLARATION COMPONENT / HISTORICAL TEST OR MUTANT / SUPERSEDED REPLAY',judgment=j,acceptanceChain=chain))
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  if path:
   assert ref(path)['sha256']==f['sha256'];bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
  else:
   assert f['path']=='src/campaign3/receivingRuntime.ts' and f['sha256'] in missing
   unavailable.append(dict(source=p,**f,disposition='Excluded as authenticated implementation content; exact receipt results corroborated by later separately authenticated replay/mutant evidence. No byte alias or reconstruction.'))
assert len(unavailable)==3
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location']['pointer'];assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],ptr]==u['text']
  narrative=ptr.startswith(('/status','/limits')) or ('MUTANTS' in u['source'] and bool(re.fullmatch(r'/results/\d+/(name|detectedBy|failure|message)',ptr)))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RECEIVING EVIDENCE HISTORY RECONCILED WITH EXPLICIT OLD-RUNTIME EXCLUSIONS; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,unavailableSourceBindings=unavailable,testSummary=testSummary,addedTests=added,replaySourceDeltas=replayDeltas,mutantAdditions=mutantAdditions,obligations=['RO-C3-001','RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh585static declaration checks only. Old full/reference/targeted suites,old14/19mutants and old86prefix implementation are not rerun or called current.','Two runtime SHAs are unavailable after local exact-path history and64known-correction reversal candidates. No failed candidate stored/admitted as old code. Final authority adequacy must assess exclusions; unique old-implementation claims reopen recovery/material reconciliation.','Later20mutant and86prefix evidence exactly covers original result rows; this corroborates behavior without authenticating missing old source bytes.','No new law/model/allocation/verdict/corpus/obligation closure or HQ012 entry.'])
c=dict(status='PASS WITH EXPLICIT HISTORICAL SOURCE EXCLUSIONS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(unavailable),unavailableDistinctHashes=len(missing),freshDeclarationChecks=585,models=13,unchangedPrefixRows=86,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

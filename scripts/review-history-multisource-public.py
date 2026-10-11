"""Reconcile bounded public multisource claims after exact fresh replays finish."""
from pathlib import Path
import json,hashlib
from collections import Counter
P=Path('docs/planning');O=P/'campaign3-history-multisource-public-rev1';B=P/'campaign3-history-universe-rev1'
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
 'docs/formal/MULTISOURCE_PUBLIC_CONTRACT.md':'Bounded one-character/two-task/two-action/three-reserve public extension with genuine task opponent, immutable criteria and actual selected safe observations. Ground/role/sign/description remain independent axes. Separate13current stages,owned replenishment/private deadline,exact originals and RNG-ledger rollback. Hull/upper-bound suitability is not learned efficacy or conversion. Public maximum6signals/4descriptions extends separately versioned component domains. No universal law,arbitrary authoring,renaming invariance or new Need owner.',
 'docs/planning/CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md':'Bounded public qualification corroborated by fresh62runs/227restore checks/22focused tests.43distinct models versus55scenario images.55scenarios restore allfour prefixes; seven interventions restore final whole prefixes only, not every intermediate intervention prefix or full continuation tails. Orphan1/5to1/3 and1/2to3/5,cumulative redundancy,and matched raw-byte DescriptionDice witnesses retained. Missing/zero/capacity/adoption distinct. Historical2236composed results correct receipt2191distinct-name count; no fresh broad/reference/build claim. Six transfer constraints remain scoped, no wholeMULTI/Campaign3 PASS.',
 'docs/planning/MULTISOURCE_PUBLIC_EXPERIMENT_REV1.json':'Fresh original55scenario result rows and220prefixes exactly reproduced,including source assessments,coverage,nuclei,analytical probabilities,outputs,state/trace and run hashes. Legacy models55 counts scenarios,not43distinct models. Clocks0/45/70/100 exhaust these fixed calendars. Restoration checks exact current prefix after original-input reexecution; no separate full-tail test from every prefix. Quantized equal probabilities do not erase intermediate differences.',
 'docs/planning/MULTISOURCE_PUBLIC_INTERVENTIONS_REV1.json':'Fresh seven committed S0/original/seed interventions reproduce all exact rows and final-save restoration. Two Base-only matched DescriptionDice contrasts prove raw-byte equality before changing dice unit. Hidden21/29 gives identical complete safe outputs; independent owned B delivery changes task strength without changing body A. These are7terminal-prefix restores,not allintermediate prefixes. No learning,statistical sensor independence or action-relief efficacy inferred.',
 'docs/planning/MULTISOURCE_FINAL_REEXECUTION_REV1.json':'All62whole-save hashes equal newly reexecuted main/intervention final saves and preserve43models. Exact final decoder hash still matches current file. This independently dates current replay without overwriting historical receipt or claiming prior failed full process passed.',
 'docs/planning/MULTISOURCE_FULL_TESTS_REV1.json':'Historical2236assertions/282files,2235passed/one codec regression failure. Complete reporter schemas and failure payload retained; display-name duplicates are assertion occurrences,not missingtests. Original processfailed. Onlyfive22assertion suites replaced by laterpassing focused receipts for composedcoverage; no fresh broad suite.',
 'docs/planning/MULTISOURCE_FINAL_FOCUSED_TESTS_REV1.json':'First corrected22tests/fivefiles allpassed. Exact test occurrence/name/status multiset matchesREV2 andfresh22tests. No new scientific findings in reporter timings/names; codec regression and separately scoped public/rollback/parity/admission assertions preserved.',
 'docs/planning/MULTISOURCE_FINAL_FOCUSED_TESTS_REV2.json':'Final22tests/fivefiles historicalPASS, same22now freshPASS. Each fault boundary must be reached; failedinstants preserve queue,state,outputs,trace,allocators,RNG. Other controls reject closedslot record substitution,rejectedcohort/getters/generatedoriginals/model/S0edits/erasedRNGledger. Synthetic receiver parity is not public ancestry.',
 'docs/planning/MULTISOURCE_REFERENCE_TESTS_REV1.json':'Historical328reference assertions; nofresh reference execution. Reporter labels,timings andpaths are scoped preservation metadata. Public replay/focused tests do not turn this old receipt into a current broad-suite result.',
 'docs/planning/MULTISOURCE_VALIDATION_CLOSURE_REV1.json':'Preserved erroneous latestEvidenceCoverage2191 is exactly distinct file/fullName/status keys. Reconstructed multiset has2236passing assertion occurrences in282files afterfive-suite substitution;45duplicate occurrences explain difference. Full2235pass/onefailure remainsfailed. ModelFilesHashChecked660 is historicalcombinedcohort count; acceptedfreshcohort330files separate. Build/reference/predecessordiff statements remain dated,notfresh checks.',
 'docs/planning/MULTISOURCE_CONSTRUCTION_FINDING_REV1.json':'Rejected first modelcohort copied body instruction naming actionone while criterion named actiontwo. Recipe equality alone insufficient: cross-declaration semantic agreement required. Successor changes newregistrycopy; predecessor frozenregistry notrewritten. Fresh rejectiontest retains failedcohort; imagefreeze neverwas runtimequalification.',
 'docs/planning/MULTISOURCE_CODEC_BOUNDARY_FINDING_REV1.json':'False-surrogate decoding could hide newrecord in inheritedBoolean slot. Repair validates actualvalue and allows canonical byte surrogate only in explicitly open canonical-value slots. Universalbyte replacement would also be unsafe for closedBytes slots. Fresh exactregression rejectsBoolean substitution. No publicsource bypass demonstrated because finite model/S0/input grammar separately rejected shape; no model/formula/identity change.',
 'docs/planning/MULTISOURCE_COHORT_COUNT_CLARIFICATION_REV1.json':'55namedscenarios carry43distinct ModelIdentities; knownzero/no-task/no-body modifyS0 ratherthanmodelparameters. Exactfreeze identities and RunIdentities remain distinct. No modelbytes rewritten or newpsychologicalparameter inferred.'
}
prior=load(P/'campaign3-history-source-roles-rev144/index.json');assert not set(specs)&{x['path'] for x in prior['roleAssignments']}
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
for name,runs,prefixes in [('execution',55,220),('interventions',7,7)]:
 a=load(O/(name+'.json'));assert a['status']=='PASS' and a['runs']==runs and a['prefixRestores']==prefixes
 assert a['results']==load(a['original']['path'])['results']
 for x in [a['original'],a['checker'],*a['currentSources']]:assert ref(x['path'])==x
main=load(P/'MULTISOURCE_PUBLIC_EXPERIMENT_REV1.json');extra=load(P/'MULTISOURCE_PUBLIC_INTERVENTIONS_REV1.json');final=load(P/'MULTISOURCE_FINAL_REEXECUTION_REV1.json');freeze=load(P/'campaign3-multisource-model-rev2/FREEZE.json')
assert len(freeze['models'])==55 and len({x['modelIdentity'] for x in freeze['models']})==43 and sum(len(x['files']) for x in freeze['models'])==330
assert all([x['clock'] for x in r['checkpoints']]==['0','45','70','100'] for r in main['results'])
expected={r['name']:r['checkpoints'][-1]['saveSha256'] for r in main['results']};expected.update({r['name']:r['saveSha256'] for r in extra['results']});assert len(expected)==62
assert {r['name']:r['wholeSaveSha256'] for r in final['results']}==expected
codec=ref('src/campaign3/multisourcePublicCodecs.ts');assert codec['sha256']==final['codecSha256']
get=lambda c,l='GroundAggregate':next(r for r in main['results'] if r['caseName']==c and r['law']==l)
body=lambda r:next(g for g in r['coverage'] if g['family']==2)
prob=lambda r:next(x['probability'] for x in r['decision']['probabilities'] if x['option'].endswith('two'))
assert [body(get(c))['base'] for c in ['orphan','orphan-removed']]==['1/3','1/3']
assert [body(get(c,'FamilyNormalized'))['base'] for c in ['orphan','orphan-removed']]==['1/5','1/3']
assert [prob(get(c,'FamilyNormalized')) for c in ['orphan','orphan-removed']]==['1/2','3/5']
assert [body(get('aggregate',l))['base'] for l in ['GroundAggregate','GroundPairwise']]==['5/11','1/2']
assert [prob(get('aggregate',l)) for l in ['GroundAggregate','GroundPairwise']]==['349/384','349/384']
for r in get('unavailable')['assessments']:assert r['kind']==1 and 'strength' not in r and r['support']==[]
for r in get('known-zero')['assessments']:assert r['kind']==2 and r['strength']=='0/1' and len(r['support'])==1
assert all(x=='0' for x in get('execution-blocked')['outcomes'])
e={r['name']:r for r in extra['results']};assert e['hidden-21']['outputsSha256']==e['hidden-29']['outputsSha256']
for c,n,p in [('duplicate',[2,3],['3/5','73/80']),('aggregate',[2,4],['2/3','2511/2560'])]:
 pair=[e[c+'-matched-'+l] for l in ['aggregate','description-dice']];assert pair[0]['firstRawSha256']==pair[1]['firstRawSha256'];assert [r['reasonCounts'][0] for r in pair]==n
 assert [next(x['probability'] for x in r['probabilities'][0] if x['option'].endswith('two')) for r in pair]==p
reportKeys={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'}
suiteKeys={'assertionResults','endTime','message','name','startTime','status'};assertionKeys={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'}
def relative(p):return p.replace('\\','/').split('/characterlab/',1)[1]
def tests(path,total,failed=0):
 v=load(path);assert set(v)==reportKeys and v['numTotalTests']==total and v['numPassedTests']==total-failed and v['numFailedTests']==failed and v['success']==(failed==0)
 assert v['numPendingTests']==v['numTodoTests']==0 and not any(v['snapshot'].values())
 rows={relative(r['name']):r for r in v['testResults']};assert len(rows)==len(v['testResults']) and sum(len(r['assertionResults']) for r in rows.values())==total
 for r in rows.values():
  assert set(r)==suiteKeys
  for a in r['assertionResults']:assert set(a)==assertionKeys and a['meta']=={} and a['status'] in ['passed','failed'] and (a['failureMessages']==[])==(a['status']=='passed')
 return rows
names=lambda rows:Counter((p,a['fullName'],a['status']) for p,r in rows.items() for a in r['assertionResults'])
full=tests(P/'MULTISOURCE_FULL_TESTS_REV1.json',2236,1);target1=tests(P/'MULTISOURCE_FINAL_FOCUSED_TESTS_REV1.json',22);target2=tests(P/'MULTISOURCE_FINAL_FOCUSED_TESTS_REV2.json',22);fresh=tests(O/'current-tests.json',22);reference=tests(P/'MULTISOURCE_REFERENCE_TESTS_REV1.json',328)
assert len(full)==282 and len(target2)==5 and names(target1)==names(target2)==names(fresh)
failure=[dict(file=p,fullName=a['fullName'],messages=a['failureMessages']) for p,r in full.items() for a in r['assertionResults'] if a['status']=='failed'];assert len(failure)==1 and 'inherited boolean field' in failure[0]['fullName']
full.update(target2);counts=names(full);assert counts.total()==2236 and len(counts)==2191 and all(k[2]=='passed' for k in counts)
finding=load(O/'count-finding.json');assert finding['assertionOccurrences']==2236 and finding['distinctDisplayKeys']==2191 and finding['duplicateOccurrences']==45
chain=[ref(O/n) for n in ['execution.json','interventions.json','current-tests.json','count-finding.json']]+[ref(P/'campaign3-history-multisource-freeze-rev1/review.json')]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[dict(source=(P/'MULTISOURCE_FINAL_REEXECUTION_REV1.json').as_posix(),originalPath=codec['path'],sha256=codec['sha256'],resolvedPath=codec['path'])]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BOUNDED MULTISOURCE PUBLIC CONTRACT / QUALIFICATION / FAILURE OR TEST EVIDENCE',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256']);assert path and ref(path)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/scope','/disposition','/finding','/repair','/rootCause','/regression','/reason','/countingRule','/modelImpact','/qualificationClaimWithdrawn','/latestEvidenceCoverage/method','/fullSuite/failures')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BOUNDED PUBLIC MULTISOURCE CLAIMS RECONCILED; HISTORICAL COUNT CORRECTED FORWARD; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],originalCodecFailure=failure,obligations=['RO-C3-001','RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['227restores means220atallfourprefixesof55scenarios plus7terminalinterventionprefixes. No every-intermediate intervention or allremaining-tail claim.','Original failedfullsuite retained;2236composedassertions versus2191distinctdisplaykeys. Fresh22focusedtests only; reference328/build history unchanged.','GroundAggregate candidate,FamilyNormalized negative andBase-onlyDescriptionDice preserved; no generic normalization,renaming/order invariance,Need ownership,physiology or learned efficacy.','Independent controlledreserves differ from statisticallyindependent same-signal readings. Exactintermediates matter even with unchanged probabilities/winners.','No production/model/allocation/verdict/corpus/obligation closure; HQ011authority adequacy andHQ012stillopen.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),freshRuns=62,freshPrefixChecks=227,freshTests=22,distinctModels=43,scenarioImages=55,composedHistoricalAssertions=2236,distinctHistoricalDisplayKeys=2191,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

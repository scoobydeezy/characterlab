from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-costly-reward-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/COSTLY_REWARD_INTEGRATION_CONTRACT.md': 'Accepted0.1 single-owner component joins existing reason/dice/intent/execution with separate learned benefit/harm, protectivegoal and cuehistory. FrozenCONTROL single rewardBool insufficient for simultaneous reward/harm, not reinterpreted. Two options/two nuclei/upto3addresseddraws; Bactualwithhold distinct NoActiveReasons. No public scheduler or physiology admission.', 'docs/planning/ADDICTION_INTEGRATION_READINESS.md': 'Pre-integration audit: independent bounded physiology/craving/relapse witnesses cannot be concatenated or hidden diagnostics fed to cognition. Define narrow behavioral claim and lawful joint causal path first; no generic Addicted state or requirement to solve all biology for bounded behavior.', 'docs/planning/CAMPAIGN3_COSTLY_REWARD_QUALIFICATION.md': 'VER-C3-COSTLY-REWARD-001:6models50runs650historicalcomponentprefix continuations600advancing50terminal. Main costlycounts2,3,2,1,3,3,3,2 acrossall8seeds;7repeat,seed3one. Maintained protectivegoal and load; sparecapacityrestoreswithholding. No clinical/fulladdiction/biological/public integration claim.', 'docs/planning/COSTLY_REWARD_FINDINGS.md': 'Separate benefit/harm reasons avoid hiding conflict in rewardbit. Full99exploration informed50frozenqualification roster, not independent statisticalsample. Feedback raises harmbelief but4sequenceschange4same;seed4harm3vs2withheld, no monotonicbehaviorclaim. BeliefAccessmatchesprimary butdiffersothercue, historynecessitynotearned. No scientifictest/buildfailure; operational tsbuildinfo restoration separately reported.', 'docs/planning/COSTLY_REWARD_PLAN_REV1.json': '6model50distinct runIDs committed after99exploration.24meanseedpairs plus10meancontrols15otherlawmain/noLoad/withheld and1BeliefAccessotherCue. Exact source/content/seed bindings; finite authored control no universal law.', 'docs/planning/COSTLY_REWARD_RESULT_REV1.json': '50rows13savehashes each, fullsnapshot/safeview/addressedRNG. Fresh closure independently reconstructs belief/maintenance/physicaloutcomes/receiptgating for everyrow.650historical fullcomponentcontinuations not newly publicsavequalification. B/nochoice provides noAlearning; failedexecutiondistinctchosenA.', 'docs/planning/COSTLY_REWARD_EXPLORATION_REV1.json': 'All99exploratory trajectories preserved:6laws13cases plusall8Meanmain/noLoad/withheld seeds. Everyfinal50case exactly matches earliersequence/harmandrowprojection. Selectiondesign explicit, no independent validation sample or discarded scientific failures.', 'docs/planning/COSTLY_REWARD_CLOSURE_REV1.json': 'Fresh original readonly closure authenticates sourceartifacts, exact row arithmetic, observerpaircontrols and historical17/328tests/build. Not freshruntime or fullactive-suite claim.', 'docs/planning/COSTLY_REWARD_TESTS_REV1.json': 'Historical17individualpasses including precommit fault/retry and malformed/wrongoriginal/law/seed rejection. Component RNGrollback not publicfactory qualification. No fresh tests.', 'docs/planning/COSTLY_REWARD_REFERENCE_TESTS_REV1.json': 'Historical328individualpasses. Not new empiricalcalibration or fresh fullsuite.', 'docs/planning/COSTLY_REWARD_BUILD_REV1.json': 'HistoricalbuildPASSexit0, exactartifactbinding. Operational sandbox restoration failure did not change scientific sources/results or build receipt.', 'docs/planning/COSTLY_REWARD_AUDIT_RECOVERY_REV1.json': 'Bookkeeping staleAGENTSanchor followed uncheckedwrite overwroteREV49 inventory/verdicts. Preserved erroneoussnapshot and reconstructedprior with exactprefixinputs. No independent pre-overwrite digest; cannot call independently hash-proven recovery. All scientificfrozenartifacts unaffected; successor nooverwriteguard.', 'docs/planning/COSTLY_REWARD_AUDIT_OVERWRITE_REV1.json': 'Preserved erroneous documentation audit snapshot, not authority for then-current verdict/inventory count. Compared whole object to reconstructedREV49: only inventory and verdict arrays differ. Contains copied old sourceclaims, not fresh execution or independent historicaladequacy proof. Recovery limitation retained.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(P/'COSTLY_REWARD_CLOSURE_REV1.json'),ref('scripts/qualify-costly-reward.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='COSTLY_REWARD AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'COSTLY_REWARD_RESULT_REV1.json');plan=load(P/'COSTLY_REWARD_PLAN_REV1.json')
assert v['planSha256']==ref(P/'COSTLY_REWARD_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==50 and sum(len(r['prefixHashes']) for r in v['results'])==650
explore=load(P/'COSTLY_REWARD_EXPLORATION_REV1.json')['results'];assert len(explore)==99
keys=['at','goal','maintained','rewardBelief','harmBelief','habit','admittedA','inhibited','values','intent','receipt']
for r,p in zip(v['results'],plan['runs']):
 for k in ['law','name','seed','runIdentity','modelIdentity']:assert r[k]==p[k]
 e=next(e for e in explore if all(e[k]==r[k] for k in ['law','name','seed']))
 assert e['sequence']==r['sequence'] and e['harm']==sum(w['harm'] for w in r['snapshot']['world'])
 assert e['rows']==[{k:x[k] for k in keys} for x in r['snapshot']['rows']]
get=lambda name,seed:next(r for r in v['results'] if r['law']=='MeanHistory' and r['name']==name and r['seed']==seed)
counts=lambda name:[sum(w['harm'] for w in get(name,seed)['snapshot']['world'][4:]) for seed in range(8)]
assert counts('main')==[2,3,2,1,3,3,3,2] and counts('withheld')==[4,3,3,1,2,3,3,2]
assert sum(get('main',i)['sequence']!=get('withheld',i)['sequence'] for i in range(8))==4
for n,count in [('COSTLY_REWARD_TESTS_REV1.json',17),('COSTLY_REWARD_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'COSTLY_REWARD_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
recovery=load(P/'COSTLY_REWARD_AUDIT_RECOVERY_REV1.json')
for k in ['erroneous','reconstruction']:
 a=recovery[k];assert ref(a['path'])['sha256']==a['sha256']
err=load(recovery['erroneous']['path']);restored=load(recovery['reconstruction']['path'])
assert {k for k in err if err[k]!=restored.get(k)}=={'inventory','verdicts'}
assert 'No independent pre-overwrite digest' in recovery['limitation']
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/finding','/cause','/unaffected','/limitation','/prevention'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='THIRTEEN COSTLY REWARD SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh original closure, independent row arithmetic and exact50of99 exploration crosscheck; no freshruntime/tests/build.','Higher harmbelief not pathwiseharmreducing, all8seeds and nonecessitycomparator equalitypreserved.','Singleowner component not publicsaveadmission or physiological/clinical/fulladdiction.','Reconstructed prior audit has no independent pre-overwrite digest; copied audit clauses not fresh scientific evidence.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

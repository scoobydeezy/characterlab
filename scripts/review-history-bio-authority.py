from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-bio-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/BIO_COMPARISON_CONTRACT.md':'Accepted bio-coupled-comparison/0.2 component scope. Empty history,actual kernels,19steps:4early learning,probe,12contrary,probe,reversed context. No world success learning. K1/millionth fold,learningunit1/probe1/16. Seeds6/0 early only,255probe254nondecision;fixed selected contrary seeds are protocol not psychological evidence. All32calibrations/attempts retained,existential nottypicality. Six candidates preserve fullhistory Refold equality versus present-context reinterpretation failure;Display/HistoryOnly behavior equality. No public factory or general direction/compression law.',
'docs/formal/BIO_COMPARISON_IDENTITY_BINDING.md':'Research Brief6.1 requires instantiated identities evencomponent scope. Initial source/input commitments insufficient. Separate manifest6models13orderedruns,ExperimentIdentity/ComparisonCase before13complete reruns. EmptyS0;earlyseed runfield notmodelparameter;common19step schedule and254diagnostic seed. Address algorithm unchanged,finite routing explicitresearch profile not public admission orComparisonDrawMap. Original260prefix evidence historical,not newpublic persistence.',
(P/'CAMPAIGN3_BIO_QUALIFICATION.md').as_posix():'VER-C3-BIO-001:6componentcandidates13cases260prefixes247advance13terminal;13separateidentity-bound reruns matchoriginal hashes;56affected328reference historical. EarlyA/A/A/A vsB/A/B/B,authorship7/9 evidence+/-1/9. Probe+3/-3 probabilities1/0 versus-2/+2 probabilities1/18,17/18. Auto probes needno draw;ablations rollcommonseed. Onecontrary reducespositive,12reverse. Fixedtrait/display/history/reinterpretation controls distinct;Refold equal fullretainedhistory notcompression. Failedcalibration/packaging/staleprose preserved;notlater fullbiologicalsystem claim.',
(P/'BIO_COMPARISON_FINDINGS.md').as_posix():'Initial32calibrations all0/0 modifiers,actual10/147 evidence and10/21authorship belowcriterion. Equal-d6 learning/unit1/16 correction retainskernels/K1. Allrevisedcohorts/contraryattempts retained;selected witness notpopulationestimate. UnexecutedREV2 stale1/4phrase correctedREV3 withoutbehavior relabeling. Missingcanonicalidentities correctedbeforeverdict bymanifest+13reruns;notretroactivepackagecompletion. Refold originalqualification !=recomputeoldmeaning;display/history equality retained. Broadereligibility/coercion/calibration/historyloss conditional.',
(P/'BIO_CALIBRATION_REV1.json').as_posix():'All32rejected earlyseed cohorts preserved:choices/evidence/history differ butprobe0/0 for each. Failed receiving calibration,not missingidentityfeedback orchangedacceptedmath. No qualification matrix executed underthissetup.',
(P/'BIO_CALIBRATION_REV2.json').as_posix():'All32revisedcohorts preserveactualchoices/evidence/probemodifiers/history. Deterministicfirst allpositive seed6 andfirstdifferent eligible seed0;selection apparatus,notestimatedfrequency. Equalsacceptedplan calibration exactly.',
(P/'bio-calibration-rev1/FAILURE.json').as_posix():'Failure declaration andthree exact original contract/source/script archives authenticated byoriginal closure. Non-MD/JSON txt artifacts are explicit backing,not omitted findings;no source overwritten.32cohort evidence path retained.',
(P/'BIO_COMPARISON_PLAN_REV2.json').as_posix():'Unexecuted superseded plan retainsfull calibration/contraryattempts/cases/sourcecommitments. REV3metadata already reviewed inREV47;samecases/calibration/routing,stalecontractprose correctedbeforeexecution. No failed behavioralresult relabeled.',
(P/'BIO_COMPARISON_RESULT_REV3.json').as_posix():'13storedcases with19stages and20prefixes each;coupledrepeat exacthash,Refold rows equalEarned. Frozenarchive survivesreversedcontext baseline,RecomputedHistory differs. Nondecisiontranscripts equal;probe255,contraryactualnegative/highauthorship. Typedprobabilities/modifiers/evidence/history/archive/raw/context/draws distinct;no newpublic saves.',
(P/'BIO_IDENTITY_PLAN_REV1.json').as_posix():'Exactfullmanifest freshly reconstructed usingoriginal canonicalconstructors:6distinctmodels13orderedruns12unique dueintentionalrepeat,ExperimentIdentity/ComparisonCase,S0andinputs. Identitymetadata notbehavioralrerun;separate historicalrerun evidence required andretained.',
(P/'BIO_IDENTITY_RERUN_REV1.json').as_posix():'13separatecompletehistorical reruns underfrozenidentity manifest eachmatchoriginal finalsave andrunidentity. Not13newsemanticcases orfresh260prefix suite;doesnotretroactivelyinstantiate identities inthefirstmatrixplan.',
(P/'BIO_COMPARISON_CLOSURE_REV1.json').as_posix():'Original fullclosure equality passes source/plan/result/failedcalibration/identity/test bindings.6candidates13cases13identityreruns260componentprefixes56affected328reference historical. No freshbehavioralrun/tests orpublicRNG admission inthisaudit.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BIO AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'BIO_COMPARISON_CLOSURE_REV1.json'),ref('docs/formal/BIO_COMPARISON_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'BIO_COMPARISON_RESULT_REV3.json');assert len(v['results'])==13 and sum(r['prefixes'] for r in v['results'])==260
for r in v['results']:
 assert set(r)==set('law earlySeed name prefixes saveSha256 rows'.split())
 for q in r['rows']:assert set(q)==set('at seed chosen authorship mode probabilities modifiers evidence strength history archive expression context raw reasons nondecision display addresses draws'.split())
for n in [1,2]:
 c=load(P/f'BIO_CALIBRATION_REV{n}.json')['calibration'];assert [x['seed'] for x in c]==list(range(32))
 for r in c:assert set(r)==set('seed choices evidence probe history'.split())
plan=load(P/'BIO_COMPARISON_PLAN_REV3.json');assert plan['calibration']==load(P/'BIO_CALIBRATION_REV2.json')['calibration']
for at in range(6,18):
 attempts=[a for a in plan['contraryAttempts'] if a['at']==at];assert [a['seed'] for a in attempts]==list(range(plan['contrarySeeds'][at-6]+1));assert attempts[-1]['evidence'].startswith('-');assert all(not a['evidence'].startswith('-') for a in attempts[:-1])

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='TWELVE BIO SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh13behavioral reruns or260prefix replay/tests.','Refold preservesfullhistory;no compression/meaningrewrite equivalence.','RNG routing research-only;calibrated witnesses nottypicality.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=12,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))

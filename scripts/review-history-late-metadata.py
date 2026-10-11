"""HQ011 accepted metadata role review; preserve exact original text and bounded claims."""
from pathlib import Path
from fractions import Fraction
import json,hashlib,re,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-late-metadata-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
families=['LONGITUDINAL_GOAL','LONGITUDINAL_ROUTINE','LONGITUDINAL_HABIT','LONGITUDINAL_PERSONAL_LOSS','AFFECT_REGULATORY']
scope={
 'LONGITUDINAL_GOAL':'Bounded acquired biography/current goal/episode-expiry/later-choice composition; native source with component owners, no new native admission.',
 'LONGITUDINAL_ROUTINE':'Bounded routine acquisition/interruption/resumption composition. Authenticated reused native source; fresh receiver replay plus selected fresh joined conformance. No all504-run native restore claim.',
 'LONGITUDINAL_HABIT':'Bounded same-actor biography, practice-specific episode loss, habit inhibition/release/relearning. Component memory admission; raw habit audit persists; no new native scheduler or global erasure.',
 'LONGITUDINAL_PERSONAL_LOSS':'Bounded acquired valued-contact loss with actual later actions and independent execution. Controlled reports/goal adoption, component only; no native admission, clinical grief or affect dimensionality claim.',
 'AFFECT_REGULATORY':'Bounded body-only regulatory reduction fails existing delayed stress receiving. ScalarThreat remains sufficient. No general psychological scalar impossibility claim.'}
disposition={
 'LONGITUDINAL_GOAL':'Fine standing changes probabilities18/24 and actions14/24 versus NoFeedback; coarse equality0/24, zero-standing seeds4/5 and stochastic equalities persist. Goal withdrawal/replacement8/8 differ without native source changes. Component owners do not earn new native admission.',
 'LONGITUDINAL_ROUTINE':'504 receiver trajectories retain96 Stored/Derived equalities,24 retention equalities and seed0 resumption15 rather than14. ScheduledOnly is available at all8 later opportunities but performs7 for seed0.16 native sources are reused; only4 joined horizons/8 restores are fresh in the original qualification.',
 'LONGITUDINAL_HABIT':'960 receivers compare actual practice-specific episodic loss against retained raw habit history.192 Stored/Derived and480 retention behavioral equalities remain. Observed renewal reaches447/512 while hidden/unavailable remain63/128.4/8 later action sequences include practice; all equalities remain. REV2 is the corrected harness identity, not a rewrite of REV1.',
 'LONGITUDINAL_PERSONAL_LOSS':'480 component runs preserve160 observer-boundary comparisons: hidden loss, false loss, recovery and failed execution each40. Choice is independent of successful execution; historical contact persists through later reports. No clinical grief, native admission or affect dimensionality qualification.',
 'AFFECT_REGULATORY':'64 sources/832 component prefixes,320 receiving trials repeated twice,4 native sentinels/16 selected prefixes remain distinct evidence. Complete body-history collision rejects body-only receiving; ScalarThreat64/64 and earlier ScalarUncontrolled retrieval equality remain valid. No arbitrary psychological scalar impossibility.'}
laws={families[0]:'SeparateOwners FineStanding NoFeedback GoalEqualsOpportunity',families[1]:'Derived Stored ExplicitBeliefOnly ScheduledOnly EraseHistory',families[2]:'Derived Stored ExplicitBeliefOnly ScheduledOnly EraseHistory',families[3]:'Latest Mean NoLearning NoAffect HistoricalProduct',families[4]:'Full NoAppraisalImpulse FullAffect ScalarThreat ScalarStress ScalarPain ScalarRewardDeviation'}
verdicts=dict(zip(families,['VER-C3-LONGITUDINAL-GOAL-001','VER-C3-LONGITUDINAL-ROUTINE-001','VER-C3-LONGITUDINAL-HABIT-001','VER-C3-LONGITUDINAL-LOSS-001','VER-C3-AFFECT-REGULATORY-001']))
selected={}
for family in families:
 for kind in ['PLAN','RESULT' if family==families[4] else 'MATRIX','CLOSURE','BUILD']:
  rev=2 if family==families[2] and kind in ['PLAN','MATRIX'] else 1
  selected[(P/f'{family}_{kind}_REV{rev}.json').as_posix()]=(family,kind)
for family,suffix in [(families[0],'CLOSURE_BUILD'),(families[1],'CLOSURE_BUILD'),(families[2],'QUALIFICATION_BUILD')]:selected[(P/f'{family}_{suffix}_REV1.json').as_posix()]=(family,'BUILD')
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];schemas=[];allStrings=0;bindings=0
buildLines={'','> characterlab@0.1.0 build','> npm run check:boundaries && tsc -b && vite build','> characterlab@0.1.0 check:boundaries','> node scripts/check-reference-boundary.mjs','Reference boundary check passed.','vite v5.4.21 building for production...','transforming...','✓ 3 modules transformed.','rendering chunks...','computing gzip size...','dist/index.html                0.36 kB │ gzip: 0.26 kB','dist/assets/index-k_IDpMXL.js  0.98 kB │ gzip: 0.53 kB'}
def textRole(x,p,family,kind):
 leaf=p.split('/')[-1]
 if p in ['/scope','/disposition']:
  expected=scope[family] if kind=='CLOSURE' else ('Fresh personal-loss component build; no native admission.' if family==families[3] else 'New comparison fixtures/tests; production sources unchanged.')
  assert x==expected;return 'BOUNDED SCOPE STATEMENT'
 if p=='/command':assert x=='npm run build';return 'HISTORICAL BUILD COMMAND'
 if p=='/output' or p=='/output/*':
  assert kind=='BUILD'
  for line in x.split('\n'):assert line in buildLines or re.fullmatch(r'✓ built in (67|68|69|71|76)ms',line),line
  return 'HISTORICAL BUILD TRANSCRIPT'
 if p=='/status':
  expected='FROZEN BEFORE QUALIFICATION' if kind=='PLAN' else 'COMPLETE MATRIX PASS' if kind=='MATRIX' and family==families[0] else 'COMPONENT MATRIX PASS' if kind=='MATRIX' and family==families[3] else 'COMPOSITION MATRIX PASS' if kind=='MATRIX' else 'PASS'
  assert x==expected;return 'BOUNDED RUNNER STATUS'
 if p=='/verdict':assert x==verdicts[family];return 'ACCEPTED VERDICT LINK'
 if p in ['/build','/boundaryCheck','/typecheck','/viteBuild']:assert x=='PASS';return 'HISTORICAL BUILD STATUS'
 if p=='/date':assert x=='2026-10-03';return 'HISTORICAL EXECUTION DATE'
 if p=='/version':assert x=='affect-regulatory-reduction/0.1-candidate';return 'SEAM VERSION'
 if leaf=='path':assert '/artifacts/*/path' in p and Path(x).is_file();return 'BOUND ARTIFACT PATH'
 if leaf in ['sha256','planSha256','saveHash','successorHash'] or p.endswith('/nativeHashes/*'):
  assert re.fullmatch(r'[0-9a-f]{64}',x);return 'BYTE COMMITMENT'
 if leaf in ['modelIdentity','runIdentity','experimentIdentity','comparisonCase','sourceRun'] or p in ['/sourceModels/*','/nativeModels/*']:
  assert re.fullmatch(r'(?:[0-9a-f]{2})+',x);return 'ENCODED PROSPECTIVE IDENTITY'
 if leaf=='law':assert x in laws[family].split();return 'DECLARED COMPARISON LAW'
 if leaf=='worldLaw':assert x=='Full';return 'DECLARED WORLD LAW'
 if leaf=='mode':assert x in ('Maintained Replaced Withdrawn' if family==families[0] else 'Maintained Opposed Withdrawn').split();return 'DECLARED GOAL MODE'
 if leaf=='relearning':assert x in ['Observed','Hidden','Unavailable'];return 'DECLARED ADMISSION CONTROL'
 if leaf=='condition':assert x in 'ReportedLoss HiddenLoss NoLoss FalseLoss Corrected Recovered OneInteraction MaskedAcquisition WithdrawnGoal HighControl FailedSupport StrongContinuity'.split();return 'DECLARED LOSS CONDITION'
 if leaf=='standing' or leaf.endswith('Strength'):
  assert re.fullmatch(r'-?\d+/[1-9]\d*',x);q=Fraction(x);assert x==f'{q.numerator}/{q.denominator}';return 'EXACT OPERAND'
 if p.startswith('/comparisons/*/') and p.endswith('Actions/*') or p=='/comparisons/*/actions/*':assert x in ['practice','idle'];return 'OBSERVED CHOICE LABEL'
 if p.startswith('/behavior/*/') and p.endswith('/*'):assert x in ['contact','support'];return 'OBSERVED CHOICE LABEL'
 if family==families[4]:
  if leaf=='name':assert x in 'NoHarm FalseHarm NoGoal DeniedHarm NoReceipt NoImpulse HiddenA HiddenB'.split();return 'DECLARED REGULATORY CONDITION'
  if leaf=='channel':assert x in ['reward','stress'];return 'DECLARED PHYSICAL CHANNEL'
  if leaf=='exposure':assert x in ['meal','relax','alternative','appraised-threat'];return 'DECLARED EXPOSURE'
  if p.endswith('/available/*') or leaf=='practice':assert x in ['drug','withhold'];return 'INSTRUCTED ACTION'
  if p.endswith('/denied/*'):assert x in 'hunger thirst sleepiness pain intoxication reward pleasure stress arousal withdrawalReward withdrawalStress withdrawalArousal'.split();return 'EXPLICIT SENSOR MASK'
 raise AssertionError((family,kind,p,x))
for path,(family,kind) in selected.items():
 v=load(path);h=sha(path);assert h==entries[path]['sha256'];counts=collections.Counter()
 def walk(x,p=''):
  global bindings
  if isinstance(x,dict):
   if set(x)=={'path','sha256'}:assert sha(x['path'])==x['sha256'],x['path'];bindings+=1
   for k,val in x.items():walk(val,p+'/'+k)
  elif isinstance(x,list):
   for val in x:walk(val,p+'/*')
  elif isinstance(x,str):counts[(p,textRole(x,p,family,kind))]+=1
  else:assert x is None or type(x)in [bool,int],(p,type(x))
 walk(v);n=sum(counts.values());allStrings+=n
 if kind=='BUILD':assert v['exitCode']==0
 roles.append(dict(path=path,sha256=h,role='ACCEPTED '+kind+' METADATA; WHOLE STRING ROLE REVIEW',stringLeaves=n,acceptance='Exact original census bytes; bound through the accepted family qualification/closure and reviewed producers. '+disposition[family],limits='Historical build/freshness labels refer to the original qualification, not current audit execution. No arbitrary native promotion or law selection.'))
 schemas.append(dict(path=path,fields=[dict(path=k[0],role=k[1],count=n) for k,n in sorted(counts.items())]))
rows=[];narrative=backing=0
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected:continue
  family,kind=selected[u['source']];pointer=u['location']['pointer'];norm=re.sub(r'/\d+(?=/|$)','/*',pointer);role=textRole(u['text'],norm,family,kind)
  isNarrative=role=='BOUNDED SCOPE STATEMENT';narrative+=isNarrative;backing+=not isNarrative
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=role,category='NARRATIVE_LIMIT' if isNarrative else 'TYPED_BACKING',disposition=disposition[family] if isNarrative else 'Typed '+role.lower()+' in the authenticated plan/result/build. This occurrence is retained; its label is not an independent psychological finding. '+('Original qualification timing only; no fresh current build.' if 'BUILD' in role else ''),obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
commands=[]
for suffix in ['longitudinal-goal-closure','longitudinal-routine-closure','longitudinal-habit-closure','longitudinal-personal-loss-closure','affect-regulatory']:
 command=['node','scripts/check-'+suffix+'.mjs'];r=subprocess.run(command,capture_output=True,text=True,encoding='utf-8');assert r.returncode==0,(command,r.stderr)
 commands.append(dict(command=command,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(command[1]),scope='READ-ONLY STORED EVIDENCE VALIDATION; CONSOLE FRESH BUILD LABELS ARE HISTORICAL'))
obligations=['RO-C3-006','RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FIVE FAMILY METADATA ROLES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,schemas=schemas,originalNarrativeOccurrences=narrative,originalBackingOccurrences=backing,allStringLeaves=allStrings,omittedStringLeaves=allStrings-len(rows),artifactBindingChecks=bindings,evidence=[ref(P/'campaign3-history-late-qualifications-rev1/review.json'),ref(P/'campaign3-history-late-contracts-rev1/review.json'),ref(P/'campaign3-history-receiver-schemas-rev1/review.json'),ref(P/'campaign3-history-regulatory-backing-rev1/review.json')],obligations=obligations,limits=['Acceptance follows exact qualification/closure bindings and scientific scope review, not filename or PASS status alone.', 'Numeric comparison backing is authenticated and rechecked by the inspected original closure programs. Complete string-role accounting does not claim a general validator for every future numeric metadata shape.', 'Original HABIT REV1 and wider implementation/preservation metadata remain separate candidates; selecting accepted REV2 does not erase failed history.', 'Encoded comparison/model identities remain typed commitments to the reviewed producer plans, not independently accepted narrative authority.'])
O.mkdir(exist_ok=True);save(O/'review.json',v);save(O/'commands.json',commands)
c=dict(status=v['status'],sources=len(roles),originalNarrativeOccurrences=narrative,originalBackingOccurrences=backing,allStringLeaves=allStrings,omittedStringLeaves=v['omittedStringLeaves'],artifactBindingChecks=bindings,readOnlyChecks=len(commands),reviewSha256=sha(O/'review.json'),commandsSha256=sha(O/'commands.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))

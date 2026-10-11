"""Review the original GA mathematical/selected-capability qualification and its bounds."""
from pathlib import Path
from collections import Counter
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-components-rev1';B=P/'campaign3-history-universe-rev1'
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
specs={
 'docs/formal/ENCODING_ACCESS_MATH.md':'Exact bounded comparison kernels,not cognitive/public owners. Independentx/(1+x),historicalshared x/max(B,sumx),hybrid important exemption andlowremainingfloor,flatnegative distinct. Neither shared norhybrid conserves totalB. Graph decay/Hebbian thenRoundEven thenoverflowlargestremainders withopaque canonicalties,not clipping. Exact(I-betaW) solve forbeta<1 precedes outputquantization;beta0 retained. Accessibility usesorderednonfuture history,averagedpull andseparateomegaB/omegaA;rankdoesnotrecordpresentation. Historical notyetpassed language resolved onlyatcomponent scope by original72test/28fault qualification andfresh checks.',
 'docs/formal/OBSERVED_MARKER_TRACKING_COMPONENT.md':'Original8sweeps×8detections component withactual SEM files. Unique currentandpreviousglyph correspondence;missing/colliding/disappearedglyphs never implytruthidentity. Wrongphysicalobjectcontinuity canpersist. Empty sweepclearsmatchingwindow butnotactivefiles. Actual supportedSEM transitions,detachedopaqueinstance andatomicstate advance. No observationauthority,arbitraryrecognition orcrossmodality inference. SHA-exactpre-successor source pinned for original6fault replay;current72tests independently exerciseoriginalfactory,notnine/tensweepqualification.',
 'docs/formal/SELECTED_ENCODING_BUDGET_CONTROL.md':'Additive0.2budgetcontrol keeps0.1liveonce-consumedview/source semantics. UnitBudget1versusSmallBudget1/5,threshold1/4. Two/threeselectedActorsshared1/2→1/3onlySmallBudget; originalUnitBudget branch not discriminated. HybridActor3/13exceeds1/5leavingzero,lowParticipants1→1/2each;totalcanexceed1. No clipping/conserved-resourcecorrection. Invalidcalibration stillconsumesvalidview. No extra evidenceoccurrence orpublicowner.',
 'docs/formal/SELECTED_ENCODING_COMPONENT.md':'Actual completeSelectedView consumedonce,includinginvalidcalibrationattempt; no pool/audit/truth/resolver/state access. ExistingSEM224/240oneevent/role pereligiblecontinuant,homogeneous3/10priornotcategoryinference. RoleR andattentionA distinct despiteequalcalibration;disabledattentionA1. Need/surpriseDisablednotObservedZero. Rowsretainfactors/existingrefs;nooccurrence/allocation/writer. Spatialcoordinatesnotadmitted bythisclosedshape;laterseparatecontract required.',
 'docs/formal/SPATIAL_CONTEXT_ALLOCATION_COMPONENT.md':'Purepositivegeometryclassification withclosedrectangle0..7,completepreselectionlist,max8. SpatialPeripheralnotIncidental;FocalnotActor/need/selection. MissingpositionUnknown hasnoallocation,knownzero hasexplicitvalue. Peripheralpool/n computedbeforeselection,notredistributedoverwinners. Rectangleisdeclaredcandidate calibration,notgoal/worldfact. Exactboundary/detachment/missingpool faults tested;historicalMEC005 semanticmembership obligation remains distinct.',
 'docs/planning/ENCODING_ASSOCIATION_COMPOSITION_VECTORS.md':'Four actualSelectedView→budget→graph component vectors. Two/threeActors Independent/Hybridstrength3/13andedge5/100;Shared1/2→1/3edge25/100→11/100;Flatstrength1whileedge1→1/2viaoverflow. Retiredflatbeta1/2activation133/100,67/100 versus6/5,2/5,2/5;beta0local retained. Hypotheticalpresentation adds1to1/11base withoutwritinghistory. Syntheticemptygraph/cue operands are not publiclearnedstate,realrecall orpersistent reinforcement.',
 'docs/planning/GENERAL_ATTENTION_CLOSURE_PLAN.md':'Wholecurrentplan retainssevenobligations; explicitSep14ordering correction andSep20boundedclosure supersedeoldOPENrouting. Implementationdrift163records/67templates/17crosswalkrevisionsbeforearithmetic ispreserved methodologicalfinding. OriginalSep11plan recoveredexactGit andboundtoearlycomponentreceipt. Currenttransientfeedbackratification doesnotmakeTaskConcerngeneralAffect;A/B/Cunresolved. Missingrole≠Incidental,homogeneousprior≠classification,graph/retention/access/reinforcementseparate. ThreeSep14verdict-recordingclaims requireSep20forwardledgercorrection alreadyreviewed;notbackdatedexecution.',
 'docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json':'Historical72assertions/11files:49newcomponent plus23retainedattention.28detectedfaults acrossfive reviewedreceipts. Freshsame72current-sourceassertions andexact28originalfaultrows withhistoricalattention/trackingpinned corroboratecomponent scope. No persistentmemory/graphwriter,authenticatedcue,delayedjoin,publicencoding/model orcorpuspromotion atthischeckpoint. Earlierhashedsourceversionsnotaliases; explicitrecovery distinguishesoldclosureplanGitfromtrackingreconstruction.',
 'docs/planning/GENERAL_ATTENTION_COMPONENT_REGRESSION_REV1.json':'Historical72passingassertions,exactname/statusmultiset freshlyreproduced. TwelveEAM,eightOMT+onedense,eightspatial,eightselected,fivebudget,threeisolation,fourcomposition=49;eightattentionboundaries/threepublic/twelveselection=23retained. Publicselector tests donotqualifypublicencodingorlearnedmemory. Allreporterstringleaves inspectedasnamedtestbacking,notindependentpsychologicalfindings.',
 'docs/planning/ENCODING_ACCESS_MATH_REVIEW_REV2.json':'Fresh7originalsubstitutionfaults matchbaseline/outcomes exactly:Independent1/2vs1/3,Shared1/2vsincorrectBscaled1/10,RoundEven4vstruncation3,remainder0/1/2/2vsreversetie0/2/2/1,beta1andfuturehistoryrejection,meanpull1vssum2. Exactsourcebindingsretaincorrectedimmutableconstants/denseinputscope;olderreceiptstillhistorical. Mathematicalkernel only.',
 'docs/planning/OBSERVED_MARKER_TRACKING_REVIEW_REV2.json':'Fresh6originalfaults onSHA-exact8sweepsource matchcurrentcollision2vs1,previouscollisionNewTrackvsContinue,replayreject,horizon8vs9,atomicstatefailure,andearlydenseboundaryrejection. Densefault concernswhere invalidsparseinputrejects: original also rejectedlater withoutpublishingstate,so not a demonstrated accepted-inputleak. Addedninthtest assertsspecificboundary. No publicsourceauthentication.',
 'docs/planning/SPATIAL_CONTEXT_ALLOCATION_REVIEW_REV1.json':'Fresh5faults exactlyreproduceclosedboundary,unknownconsumingpool1/5→1/10,missingdivision1/10→1/5,Unknownbecomingzero,andcoordinatealias. PositivegeometrymembershipisnotSEMcausalroleorIncidentalrecognition. Actualcallercompleteness/sourcebinding remainsoutsidecomponent.',
 'docs/planning/SELECTED_ENCODING_REVIEW_REV2.json':'Fresh5faults exact:flattenrole243/1243→3/13,disableablation27/127→243/1243,flatignored1→3/13,retainedcapabilityreuse andDisabled→ObservedZero. OriginalUnitBudgetmaxrawsum9/10cannotreachnormalizingbranch;do notinferlawnecessityfromsameoutputs. Historicalattentionimplementationpinned,notcurrentwiderselectiongrammar.',
 'docs/planning/ENCODING_ISOLATION_AND_BUDGET_REVIEW_REV1.json':'Fresh5faults exact:mutableonecorruptsresponse1/2→1/100,sparserawaccepted,returnedrolealiaschangesnext243/1243→0,erasedSmallBudget1/2→3/10,thresholdchange3/13→25/34. These areisolation/admission andcalibrationdistinctions,notnewpsychologicalstates.28testreceiptincludes12math+8selected+3isolation+5budget,not28newfaults.',
 'docs/planning/ENCODING_COMPONENT_TESTS_REV2.json':'Historical28assertions/fourfiles entirelycontainedin72fresh/current andhistoricalqualification. Twelveexistingmath/eightselected plusthreeisolation/fivebudget;separatereviewfaultdenominators notsummedastests.',
 'docs/planning/OBSERVED_MARKER_TRACKING_TESTS_REV2.json':'Historical9assertions/twofiles entirelycontainedin72fresh/current:8baseSEMtracking and1explicitdenseinputboundary. Original8sweepfactory retainedwithlaterfixedsuccessors separate. No currentnativecalendarclaim.',
 'docs/planning/SPATIAL_CONTEXT_ALLOCATION_TESTS_REV1.json':'Historical8assertions/onefile whollypreservedinfresh72;closedgeometry/peripheralpool/unknown/zero/renaming/detachment/source-shapebounds. No Incidentalroleinference or selectedwinnerreallocation.'
}
prior=load(P/'campaign3-history-source-roles-rev147/index.json');assert len(specs)==17 and not set(specs)&{r['path'] for r in prior['roleAssignments']}
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']};recovery=load(O/'source-recovery.json');assert len(recovery['found'])==2 and not recovery['unavailable']
for r in recovery['found']:assert ref(r['resolvedPath'])['sha256']==r['sha256'];archives[r['sha256']]=r['resolvedPath']
faults=[]
for name,count in [('math',7),('tracking',6),('spatial',5),('selected',5),('isolation',5)]:
 v=load(O/(name+'.json'));assert v['status']=='PASS' and len(v['faults'])==count
 original=load(v['original']['path']);assert v['faults']==original['faults'] and v['baseline']==original['baseline']
 for f in fps(v):assert ref(f['path'])==f
 for f in v['faults']:assert f['detected'] and f['baseline']!=f['actual'];faults.append(dict(receipt=v['original']['path'],name=f['name']))
qual=load(P/'GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json');assert faults==qual['faults']
def tests(p,total,files):
 v=load(p);assert v['success'] and v['numTotalTests']==v['numPassedTests']==total and v['numFailedTests']==v['numPendingTests']==v['numTodoTests']==0 and len(v['testResults'])==files
 assert set(v)=={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'} and not any(v['snapshot'].values())
 out=Counter()
 for t in v['testResults']:
  assert set(t)=={'assertionResults','endTime','message','name','startTime','status'} and t['status']=='passed' and t['message']==''
  for a in t['assertionResults']:
   assert set(a)=={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'} and a['status']=='passed' and a['failureMessages']==[] and a['meta']=={}
   out[(t['name'].replace('\\','/').split('/characterlab/',1)[1],a['fullName'])]+=1
 assert out.total()==total;return out
full=tests(P/'GENERAL_ATTENTION_COMPONENT_REGRESSION_REV1.json',72,11);assert tests(O/'current-tests.json',72,11)==full
for n,total,files in [('ENCODING_COMPONENT_TESTS_REV2.json',28,4),('OBSERVED_MARKER_TRACKING_TESTS_REV2.json',9,2),('SPATIAL_CONTEXT_ALLOCATION_TESTS_REV1.json',8,1)]:assert tests(P/n,total,files)<=full
assert sum(n for (p,t),n in full.items() if '/attention' in p)==23
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
chain=[ref(O/(n+'.json')) for n in ['math','tracking','spatial','selected','isolation','current-tests','source-recovery']]+[ref(P/'campaign3-history-ga-public-rev1/review.json')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GA COMPONENT CONTRACT / COMPARISON / QUALIFICATION OR CORRECTION',judgment=j,acceptanceChain=chain))
 if p.endswith('.md'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256']);assert target and ref(target)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/limits/','/componentScopes/'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA EARLY COMPONENT CLAIMS RECONCILED; PUBLIC/OWNER HISTORY SEPARATE; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[dict(path=f['resolvedPath'],sha256=f['sha256'],method=f['method'],originalPath=f['path']) for f in recovery['found']],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh72current-source tests and28original fault probes; fault probes pinexactolderattention/tracking where currentfiles advanced. Not a freshpublicGA runtime matrix.','Originalcomponentcue/emptygraph/hypotheticalpresentation aremathematicaloperands,notauthenticated learnedmemory orreinforcement.','No law selection,conservedbudgetreinterpretation,unknown-aszero orSpatialPeripheral-asIncidental.','First-review source snapshots andearlierdevelopmenttestlineage stillrequire separatewhole-sourcehistory; laterowner/source/feedback/retention packets next.','No newmodel/allocation/verdict/corpusorobligationclosure. FinalHQ011adequacy andHQ012remainopen.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),freshTests=72,freshFaults=28,recoveredArtifacts=2,unavailableBindings=0,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))

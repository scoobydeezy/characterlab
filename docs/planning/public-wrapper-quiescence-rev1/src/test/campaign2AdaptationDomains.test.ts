import {describe,it,expect} from 'vitest';
import {canonicalEncode,record,set,map,unsigned,signed,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {timeSchemas} from '../substrate/time';
import {AuthoritativeState,statePathPatternValue,type StatePath} from '../substrate/state';
import {mutationAuthorityRegistryValue,type MutationAuthorityDefinition} from '../substrate/mutationAuthority';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {campaign2Record as r,campaign2SchemaByType} from '../campaign2/codecs';
import {compileAdaptationTransitions} from '../campaign2/adaptationTransitions';
import {compileTransitionAdmissionV04,compileTransitionAdmissionV06} from '../campaign2/transitionAdmissionV04';
import {compileFirstCampaign2Content} from '../campaign2/contentProfile';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileAdaptationDomains} from '../campaign2/adaptationDomains';
import {compileAdaptationEvaluator} from '../campaign2/adaptationEvaluation';
import {createAdaptationRuntime} from '../campaign2/adaptationRuntime';
import {compileFirstCampaign2Bridge} from '../campaign2/consequenceBridge';
import {evidEntries,evidOccurrences,evidRoute,evidTransitions} from './fixtures/campaign2EvidModel';
import {observationChannelValue} from '../observation/observation';
import {ExactRational} from '../substrate/exactMath';
import {beginTransitionIngressV04,admittedInputFacts} from '../campaign2/transitionIngressV04';
import {compileOrderedInputProfile,ORDERED_INPUT_PROFILE,AUTHORED_FACT_EVENT,beginAuthoredSourceInstant} from '../campaign2/orderedInputs';
import {list} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {fixtureContentInputs,fixtureRoleConstraints,fixtureCharacterRole,recordConstraint,namespaceRole} from './fixtures/campaign2Model';
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s)),enc=canonicalEncode;
const contentId=governedContentDefinitionId('character/mina'),character=semanticReferentFromAuthoredContent(contentId),variable=id(1029,'variable/control'),load=id(1033,'load/control'),procedure=id(1034,'procedure/control');
const entry=(stable:CanonicalValue,kind:string,definition:CanonicalValue,version='adaptation-input/0.31-candidate')=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,kind)],[3n,text(version)],[4n,definition]]));
const names=['leaf/tolerance','leaf/sensitization','leaf/regulatory-displacement','leaf/accumulated-load','leaf/procedural-competence'];
const pattern=(i:number)=>({rootStateTypeId:i===4?303n:302n,fieldId:BigInt(i===4?1:i+1),selectors:[{kind:'wildcard' as const,selectorKind:'mapKey' as const}]});
const leaf=(i:number)=>entry(id(1032,names[i]),'registry/adaptation-leaf-family',r('AdaptationLeafFamilyDefinition',{DomainSource:r('AdaptationDomainSource',i<2?{VariantTag:unsigned(1),Scale:unsigned(10+i)}:{VariantTag:unsigned(i)})}));
function topology(){
  const empty=['belief-expectation','episodic-memory','associations','values','habits','person-model','relationships','identity-disposition'].map(name=>[id(1031,name),r('Campaign2StateFamilyDefinition',{Route:id(1026,'route/character-learning'),Storage:r('Campaign2Storage',{VariantTag:unsigned(1)})})] as [CanonicalValue,CanonicalValue]);
  for(const [name,root,indexes] of [['regulatory-adaptation',302,[0,1,2,3]],['procedural-skill',303,[4]]] as const)
    empty.push([id(1031,name),r('Campaign2StateFamilyDefinition',{Route:id(1026,'route/automatic-adaptation'),Storage:r('Campaign2Storage',{VariantTag:unsigned(2),RootStateTypeId:unsigned(root),LeafFields:map(indexes.map(i=>[id(1032,names[i]),unsigned(i===4?1:i+1)]))})})]);
  return entry(id(1027,'definition/campaign2-state-families'),'registry/campaign2-state-family',r('Campaign2StateFamilyRegistry',{Families:map(empty)}));
}
const declarations=()=>[topology(),...names.map((_,i)=>leaf(i)),entry(load,'registry/load-domain',r('LoadDomainDefinition',{Scale:unsigned(5),Capacity:r('LoadCapacity',{VariantTag:unsigned(2),Maximum:unsigned(8)})})),entry(procedure,'registry/procedure',r('ProcedureDefinition',{CompetenceScale:unsigned(3)}))];
const owners=(removal=true):MutationAuthorityDefinition[]=>[
  {authorityName:'authority/regulatory-adaptation',ownedLeaves:[0,1,2,3].map(i=>({pattern:pattern(i),valueGrammar:{kind:'canonical-record',recordTypeId:BigInt(297+i)},removalAllowed:removal}))},
  {authorityName:'authority/procedural-skill',ownedLeaves:[{pattern:pattern(4),valueGrammar:{kind:'canonical-record',recordTypeId:301n},removalAllowed:removal}]},
];
async function fixture(removal=true,omitRole=false){
  const {content,entries}=fixtureContentInputs(contentId),constraints=[...fixtureRoleConstraints,recordConstraint(201,5,namespaceRole(1039)),recordConstraint(227,1,namespaceRole(1106)),recordConstraint(269,1,namespaceRole(1116)),recordConstraint(270,1,namespaceRole(1117)),recordConstraint(281,1,fixtureCharacterRole),recordConstraint(307,1,namespaceRole(1118)),recordConstraint(324,1,namespaceRole(1119)),recordConstraint(325,1,namespaceRole(1120))];
  for(const [type,ns] of [[293,1029],[294,1029],[295,1033],[296,1034]]){
    if(!(omitRole&&type===296))constraints.push(recordConstraint(type,1,fixtureCharacterRole));
    if(type===293)constraints.push(recordConstraint(type,2,namespaceRole(1002)));
    constraints.push(recordConstraint(type,type===293?3:2,namespaceRole(ns)));
  }
  const c=await compileFirstCampaign2Content(content,entries,enc(set(constraints)),entries);
  const stateModel=compileCampaign2StateModel(enc(mutationAuthorityRegistryValue(owners(removal))),enc(set([])),enc(set(names.map((_,i)=>r('StateKeyGrammarDefinition',{Pattern:statePathPatternValue(pattern(i)),KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(2),RecordTypeId:unsigned(292+i)})})))),c);
  const parameter=id(1030,'parameter/control'),p=record(timeSchemas.linearRateParameters,new Map([[1n,parameter],[2n,signed(0)],[3n,unsigned(1)],[4n,signed(0)],[5n,signed(100)]])),anchor=record(timeSchemas.analyticalAnchor,new Map([[1n,signed(80)],[2n,unsigned(0)],[3n,parameter],[4n,unsigned(0)]]));
  const reg=compileRegulatoryReferences(enc(set([entry(variable,'registry/regulatory-variable',r('RegulatoryVariableRegistration',{VariableDefinition:r('RegulatoryVariableDefinition',{Scale:unsigned(10),Minimum:signed(0),Maximum:signed(100)}),ReferenceDefinition:r('RegulatoryReferenceDefinition',{CharacterReferences:map([[r('RegulatoryCharacterReferenceKey',{CharacterId:character}),anchor]]),Parameters:map([[parameter,p]])})}),'regulatory-reference/0.5-candidate')])),c);
  return {c,stateModel,reg,compile:(ds=declarations())=>compileAdaptationDomains(enc(set(ds)),stateModel,reg,c)};
}
const keys=()=>[
  r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}),
  r('SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}),
  r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:variable}),
  r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:load}),r('ProceduralCompetenceKey',{CharacterId:character,ProcedureId:procedure}),
];
const values=(n:bigint[])=>['ToleranceValue','SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue','ProceduralCompetenceValue'].map((name,i)=>r(name,{Magnitude:i===2?signed(n[i]):unsigned(n[i])}));
function state(n=[2n,999n,-500n,8n,999n],ks=keys()){
  const vs=values(n);return new AuthoritativeState(vs.map((value,i)=>({path:{rootStateTypeId:pattern(i).rootStateTypeId,fieldId:pattern(i).fieldId,selectors:[{kind:'mapKey',key:ks[i]}]} as StatePath,value})));
}
describe('ADAPT F topology/domain construction',()=>{
  it('compiles the two V06 consumers with exact rules/read domains and rejects construction mutants',async()=>{
    const {compile,c,reg,stateModel}=await fixture(),domains=compile(),ruleId=id(1035,'rule/tolerance');
    const ref=(type:number)=>record(campaign2SchemaByType(254n),new Map([[1n,unsigned(type)],[2n,unsigned(1)]]));
    const producer=entry(id(1027,'definition/authored-adaptation-facts'),'registry/authored-adaptation-facts',r('AuthoredAdaptationFactProducerDefinition',{EventTypeId:id(1001,'event/authored-adaptation-fact'),PayloadSchema:ref(304),OutputSchema:ref(307),Phase:unsigned(110)}));
    const regulatory=id(1009,'transition/regulatory-adaptation'),procedural=id(1009,'transition/procedural-adaptation');
    const settlement=entry(id(1027,'definition/adaptation-settlement'),'registry/adaptation-settlement',r('AdaptationSettlementDefinition',{Consumers:set([regulatory,procedural]),PhasePolicy:unsigned(1)}),'adaptation-settlement/0.2-candidate');
    const rule=(stable=ruleId,step=1)=>entry(stable,'registry/adaptation-rule',r('AdaptationRuleDefinition',{Match:r('AdaptationMatch',{VariantTag:unsigned(1),ExposureReferentId:character}),TargetStateFamilyId:id(1031,'regulatory-adaptation'),TargetLeafFamilyId:id(1032,'leaf/tolerance'),KeyDerivation:r('AdaptationKeyDerivation',{VariantTag:unsigned(1),RegulatoryVariableId:variable}),Gate:r('AdaptationGate',{VariantTag:unsigned(1)}),Step:signed(step)}));
    const registration=(practice=false,assigned:CanonicalValue[]=[],extraRead=false,wrongBasis=false)=>entry(practice?procedural:regulatory,'registry/transition-registration',r('TransitionRegistrationV06',{
      ExecutingSeamId:id(1036,'seam/automatic-adaptation'),ExecutingSeamVersion:text('adaptation-input/0.31-candidate'),
      TransitionDefinitionV06:r('TransitionDefinitionV06',{InputAdmission:r('TransitionInputAdmissionV06',{InputRecordSchema:ref(307),Producer:r('TransitionInputProducerV06',{VariantTag:unsigned(3),ProducerDefinition:id(1027,'definition/authored-adaptation-facts')}),RequiredSourceRelation:unsigned(1)}),ReadDomain:set(assigned.length||extraRead?[statePathPatternValue(pattern(0))]:[]),OutputDefinitions:set([r('TransitionOutputDefinition',{OutputRecordSchema:ref(324),Multiplicity:unsigned(1)})]),WriteCapability:r('WriteCapabilityV06',{VariantTag:unsigned(2),MutationAuthority:id(1025,practice?'authority/procedural-skill':'authority/regulatory-adaptation'),WritableFamilies:set([id(1031,practice?'procedural-skill':'regulatory-adaptation')])})}),
      IngressDefinition:r('TransitionIngressDefinition',{ConsumerEventTypeId:id(1001,practice?'event/procedural-adaptation':'event/regulatory-adaptation'),DueAtRule:unsigned(1),ConsumerPhase:unsigned(140),PayloadRule:unsigned(1),Multiplicity:unsigned(1)}),
      AdaptationExtension:r('AdaptationTransitionRegistrationExtension',{AcceptedBasis:unsigned(wrongBasis?2:practice?2:1),RuleResolutionContract:r('RuleResolutionContract',{Rules:set(assigned)}),OutputProduction:r('AdaptationOutputProductionDefinition',{DispatchSchema:ref(324),EvaluationSchema:ref(325),Rule:unsigned(1)})}),
    }),'transition-admission-extension/0.6-candidate');
    const build=(rs:CanonicalValue[],registrations:CanonicalValue[])=>compileAdaptationTransitions(enc(set(registrations)),enc(set(rs)),enc(producer),enc(settlement),domains,reg,c);
    expect(build([],[registration(),registration(true)]).ruleCount).toBe(0);
    const source=enc(set([registration(false,[ruleId]),registration(true)])),compiled=compileAdaptationTransitions(source,enc(set([rule()])),enc(producer),enc(settlement),domains,reg,c),snapshot=compiled.registrationBytes();source.fill(0);
    expect(compiled.ruleCount).toBe(1);expect(compiled.registrationBytes()).toEqual(snapshot);
    const auto=id(1026,'route/automatic-adaptation'),singleton=entry(id(1027,'definition/transition-admission'),'registry/transition-admission',r('TransitionAdmissionRegistry',{
      LearningRoutes:set([auto]),TransitionRoutes:map([[regulatory,auto],[procedural,auto]]),OccurrenceIdentities:map([[307,1118],[324,1119],[325,1120]].map(([type,namespace])=>[ref(type),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(namespace)})])),
    }),'transition-admission/0.4-candidate');
    const shared=compileTransitionAdmissionV06(enc(set([])),enc(singleton),c,compiled);
    expect(shared.outputClosure(auto)).toEqual(['324/1','325/1']);
    expect(shared.registrations()).toHaveLength(2);
    const empty=await commitManifest(list([])),modelIdentity=await createModelIdentity({rulesVersion:'test/v06-input-binding',contentSchemaVersion:'test',contentManifest:empty,parameterSchemaVersion:'test',parameterSet:empty,numericProfileVersion:'test',randomAlgorithmVersion:'test',registrySchemaVersion:'test',registryManifest:empty});
    const authored=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(0)})});
    const inputs=await compileOrderedInputProfile(ORDERED_INPUT_PROFILE,c,domains).create(enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,authored,list([])])])),enc(list([])),modelIdentity,new Uint8Array(32));
    const sources=beginAuthoredSourceInstant(inputs,2n),ingress=beginTransitionIngressV04(shared,2n);let allocated=0n;
    const sourceEvent=inputs.initialEvents[0],aai=sources.execute(sourceEvent,{allocateRuntimeId:()=>allocated++}),plan=ingress.observeAuthoredSource(sourceEvent,enc(aai));
    expect(plan.emissions()).toHaveLength(1);expect(plan.emissions()[0].eventTypeId).toEqual(id(1001,'event/regulatory-adaptation'));
    const child={...plan.emissions()[0],eventId:1n,eventSequence:1n,causalParentEventIds:[sourceEvent.eventId]};
    expect(()=>ingress.admit(child)).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
    plan.bindAllocatedChildren([child]);
    expect(()=>ingress.admit({...child,payload:r('AutomaticAdaptationInput',{AutomaticAdaptationInputId:typedIdentifier(1118,unsigned(0)),Basis:r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:procedure,CompletedRepetitions:unsigned(0)}),OccurredAt:signed(2),TransformationVersion:text('adaptation-input/0.31-candidate')})})).toThrow();
    const admitted=ingress.admit(child);expect(admittedInputFacts(admitted).payload).toEqual(aai);
    expect(()=>ingress.finish()).toThrowError(expect.objectContaining({code:'TRANSITION_INGRESS_VIOLATION'}));
    const evaluator=compileAdaptationEvaluator(compiled,domains,stateModel);
    expect(()=>evaluator.prepare([admitted,admitted],2n)).toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_COLLISION'}));expect(allocated).toBe(1n);
    const initial=new AuthoritativeState([]),evaluated=evaluator.prepare([admitted],2n).evaluate(initial,{allocateRuntimeId:()=>allocated++});
    expect(evaluated.executions[0].outputs).toHaveLength(2);expect(evaluated.executions[0].actualReads).toHaveLength(1);
    expect(enc(evaluated.state.canonicalValue())).toEqual(enc(initial.canonicalValue()));
    expect(()=>ingress.completeAdaptation({...evaluated.executions[0]})).toThrow();
    const terminal=ingress.completeAdaptation(evaluated.executions[0]);expect(terminal.emissions()).toHaveLength(0);terminal.bindAllocatedChildren([]);
    ingress.finish();sources.close();expect(()=>admittedInputFacts(admitted)).toThrow();expect(allocated).toBe(3n);
    const runtime=async(counts:bigint[],maxWork=100n)=>{
      const manifest=list(counts.map(count=>list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])])));
      const compilation=await compileOrderedInputProfile(ORDERED_INPUT_PROFILE,c,domains).create(enc(manifest),enc(initial.canonicalValue()),modelIdentity,new Uint8Array(32));
      return createAdaptationRuntime(compilation,initial,shared,evaluator,domains,stateModel,maxWork);
    };
    const positive=await runtime([2n]),positiveResult=await positive.settleNextInstant();
    expect(positiveResult!.executedEvents.map(e=>e.phase)).toEqual([110n,140n]);expect(positiveResult!.outputs).toHaveLength(3);
    expect(positiveResult!.state.entries()).toHaveLength(1);expect(positiveResult!.state.entries()[0].value).toEqual(r('ToleranceValue',{Magnitude:unsigned(2)}));
    const noOp=await runtime([0n]);expect(enc((await noOp.settleNextInstant())!.state.canonicalValue())).toEqual(enc(initial.canonicalValue()));
    for(const [counts,maxWork,code] of [[[0n,0n],100n,'ADAPTATION_TARGET_COLLISION'],[[11n],100n,'ADAPTATION_MAGNITUDE_OUT_OF_RANGE'],[[1n],1n,'CASCADE_LIMIT_EXCEEDED']] as const){
      const run=await runtime([...counts],maxWork),before=run.snapshot();
      await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code}));
      const after=run.snapshot();expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.outputs).toEqual(before.outputs);
      expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.clock).toBe(0n);
    }
    const fullSingleton=entry(id(1027,'definition/transition-admission'),'registry/transition-admission',r('TransitionAdmissionRegistry',{
      LearningRoutes:set([auto,evidRoute]),TransitionRoutes:map([[regulatory,auto],[procedural,auto],...evidTransitions.map(t=>[t,evidRoute] as [CanonicalValue,CanonicalValue])]),
      OccurrenceIdentities:map([...evidOccurrences(),...[[307,1118],[324,1119],[325,1120]].map(([type,ns])=>[ref(type),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(ns)})] as [CanonicalValue,CanonicalValue])]),
    }),'transition-admission/0.4-candidate');
    const fullShared=compileTransitionAdmissionV06(enc(set(evidEntries())),enc(fullSingleton),c,compiled),channelId=id(1005,'channel/pulse');
    const bridgeDefinition=entry(id(1027,'definition/authored-fact-consequence-bridge'),'registry/authored-fact-consequence-bridge',r('AuthoredFactConsequenceBridgeDefinition',{Channels:map([[channelId,observationChannelValue({observationChannelId:channelId,observerId:id(1000,'observer/mina'),subjectId:character,modalityId:id(1006,'modality/pulse'),unitId:id(1039,'unit/fixture-pulse'),polarityId:1n,measurementModeId:1n,precision:ExactRational.of(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n})]])}));
    const bridge=compileFirstCampaign2Bridge(enc(bridgeDefinition),c);
    const both=async(count:bigint)=>{
      const payload=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})});
      const compilation=await compileOrderedInputProfile(ORDERED_INPUT_PROFILE,c,domains).create(enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,payload,list([])])])),enc(initial.canonicalValue()),modelIdentity,new Uint8Array(32));
      return createAdaptationRuntime(compilation,initial,fullShared,evaluator,domains,stateModel,100n,bridge);
    };
    const pairA=await both(0n),pairB=await both(2n),resultA=(await pairA.settleNextInstant())!,resultB=(await pairB.settleNextInstant())!;
    expect(resultA.executedEvents.map(e=>e.phase)).toEqual([110n,120n,121n,122n,123n,124n,130n,130n,140n]);
    const type=(v:CanonicalValue)=>(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId;
    expect(resultA.outputs.filter(v=>type(v)===203n)).toHaveLength(1);
    expect(resultA.outputs.filter(v=>[203n,227n,269n,270n].includes(type(v))).map(enc)).toEqual(resultB.outputs.filter(v=>[203n,227n,269n,270n].includes(type(v))).map(enc));
    expect(enc(resultA.state.canonicalValue())).not.toEqual(enc(resultB.state.canonicalValue()));
    expect(resultA.executedEvents.find(e=>e.phase===120n)!.causalParentEventIds).toEqual([0n]);expect(resultA.executedEvents.find(e=>e.phase===140n)!.causalParentEventIds).toEqual([0n]);
    const projected=resultA.outputs.find(v=>type(v)===203n) as Extract<CanonicalValue,{kind:'record'}>;
    const bridgePayload=resultA.executedEvents.find(e=>e.phase===120n)!.payload as Extract<CanonicalValue,{kind:'record'}>;
    const committedChannel=bridgePayload.fields.get(2n) as Extract<CanonicalValue,{kind:'record'}>;
    expect(committedChannel.fields.get(5n)).toEqual(id(1039,'unit/fixture-pulse'));
    expect(projected.fields.get(10n)).toEqual(list([]));expect(projected.fields.get(11n)).toEqual(text('authored-fact-observation/0.1-candidate'));
    expect(pairA.snapshot().allocators.nextRuntimeId).toBe(8n);
    const failedBoth=await both(11n),beforeBoth=failedBoth.snapshot();await expect(failedBoth.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_MAGNITUDE_OUT_OF_RANGE'}));
    const afterBoth=failedBoth.snapshot();expect(afterBoth.outputs).toEqual([]);expect(afterBoth.committedTrace).toEqual(beforeBoth.committedTrace);expect(afterBoth.queue).toEqual(beforeBoth.queue);expect(afterBoth.allocators).toEqual(beforeBoth.allocators);
    expect(()=>shared.validateOutputs(regulatory,[])).toThrow(/closed rule execution/);
    expect(()=>compileTransitionAdmissionV04(compiled.registrationBytes(),enc(singleton),c)).toThrow(/unsupported/);
    expect(()=>build([rule()],[registration(),registration(true)])).toThrow(/orphan/);
    expect(()=>build([],[registration(false,[ruleId]),registration(true)])).toThrow(/unresolved/);
    expect(()=>build([],[registration(false,[],true),registration(true)])).toThrow(/ReadDomain/);
    expect(()=>build([],[registration(false,[],false,true),registration(true)])).toThrow(/AcceptedBasis/);
    expect(()=>build([rule(ruleId,0)],[registration(false,[ruleId]),registration(true)])).toThrow(/nonzero/);
    const other=id(1035,'rule/duplicate-target');
    expect(()=>build([rule(),rule(other,2)],[registration(false,[ruleId,other]),registration(true)])).toThrow(/collision/);
  });
  it('admits exact five physical maps and validates static magnitudes without evaluating R0',async()=>{
    const model=(await fixture()).compile(),s=state(),before=enc(s.canonicalValue());
    expect(()=>model.validateStatic(new AuthoritativeState([]))).not.toThrow();expect(()=>model.validateStatic(s)).not.toThrow();
    expect(enc(s.canonicalValue())).toEqual(before); // -500 displacement deliberately fails REG bounds, which static validation does not evaluate.
    expect(model.hasLoad(load)).toBe(true);expect(model.hasProcedure(procedure)).toBe(true);
  });
  it('rejects missing/extra topology domains, missing roles and forbidden baseline removal',async()=>{
    const fixtureModel=await fixture();
    expect(()=>fixtureModel.compile(declarations().slice(1))).toThrow(/singleton/);
    expect(()=>fixtureModel.compile(declarations().filter((_,i)=>i!==3))).toThrow(/missing leaf/);
    const foreign=entry(id(1032,'leaf/foreign'),'registry/adaptation-leaf-family',r('AdaptationLeafFamilyDefinition',{DomainSource:r('AdaptationDomainSource',{VariantTag:unsigned(1),Scale:unsigned(1)})}));
    expect(()=>fixtureModel.compile([...declarations(),foreign])).toThrow(/unknown adaptation leaf/);
    const noRemove=await fixture(false);expect(()=>noRemove.compile()).toThrow(/removal declaration/);
    const noRole=await fixture(true,true);expect(()=>noRole.compile()).toThrow(/missing ADAPT key role/);
  });
  it('rejects explicit zero, tolerance overflow and bounded-load overflow; unbounded magnitudes stay valid',async()=>{
    const model=(await fixture()).compile();
    for(let i=0;i<5;i++){const n=[2n,999n,-500n,8n,999n];n[i]=0n;expect(()=>model.validateStatic(state(n))).toThrowError(expect.objectContaining({code:'INVALID_VALUE'}));}
    expect(()=>model.validateStatic(state([11n,999n,-500n,8n,999n]))).toThrow(/tolerance exceeds/);
    expect(()=>model.validateStatic(state([2n,999n,-500n,9n,999n]))).toThrow(/load exceeds/);
  });
  it('preserves PRJ key shape/role precedence and resolves key domains before value interpretation',async()=>{
    const model=(await fixture()).compile(),wrong=keys();wrong[1]=wrong[0];
    expect(()=>model.validateStatic(state(undefined,wrong))).toThrowError(expect.objectContaining({code:'INVALID_PATH'}));
    const unknown=keys();unknown[3]=r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:id(1033,'missing')});
    expect(()=>model.validateStatic(state(undefined,unknown))).toThrow(/unknown load domain/);
    const malformed=keys();malformed[3]=r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:id(1000,'missing')});
    expect(()=>model.validateStatic(state(undefined,malformed))).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  });
});

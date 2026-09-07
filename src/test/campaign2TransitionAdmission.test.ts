import {describe,it,expect} from 'vitest';
import {canonicalEncode,bytesToHex,list,set,map,unsigned,text,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {semanticRecordValue,semanticOccurrenceId,semanticTypedId,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {campaign2Record as r,campaign2SchemaByType,decodeCampaign2} from '../campaign2/codecs';
import {compileFirstCampaign2Content} from '../campaign2/contentProfile';
import {compileTransitionAdmissionV04} from '../campaign2/transitionAdmissionV04';
import {compileOccurrenceIdentities} from '../campaign2/occurrenceIdentity';
import {identityRolesCompatible} from '../campaign2/identityRoles';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {admittedInputFacts,type AdmittedTransitionInput} from '../campaign2/admittedInput';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission} from '../substrate/scheduler';
import {DeterministicScheduler,type EventHandler} from '../substrate/scheduler';
import {AuthoritativeState,statePathPatternValue,type StatePathPattern} from '../substrate/state';
import {mutationAuthorityRegistryValue,leafValueGrammarValue} from '../substrate/mutationAuthority';
import {compileRequiredProjections} from '../campaign2/requiredProjection';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {fixtureContentInputs,fixtureRoleConstraints,recordConstraint,namespaceRole,fixtureCharacterRole} from './fixtures/campaign2Model';
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s)),enc=canonicalEncode;
const evalKind=id(1009,'OutcomeEvaluationTransition'),learnKind=id(1009,'OutcomeLearningEvidenceTransition'),route=id(1026,'route/character-learning');
const ref=(type:number)=>record(campaign2SchemaByType(254n),new Map([[1n,unsigned(type)],[2n,unsigned(1)]]));
const registry=(stable:CanonicalValue,kind:string,definition:CanonicalValue)=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,kind)],[3n,text('transition-admission/0.4-candidate')],[4n,definition]]));
function occurrenceMap(field=1,ns=1116){return map([[ref(227),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(1106)})],
  [ref(269),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(field),IdentityRole:namespaceRole(ns)})],
  [ref(270),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(1117)})]]);}
function bundle(occurrences=occurrenceMap(),routes:CanonicalValue=map([[evalKind,route],[learnKind,route]])){
  return registry(id(1027,'definition/transition-admission'),'registry/transition-admission',r('TransitionAdmissionRegistry',{LearningRoutes:set([route]),TransitionRoutes:routes,OccurrenceIdentities:occurrences}));
}
function registration(second=false,phase=130,sourceOverride?:CanonicalValue,eventOverride?:CanonicalValue){
  const producer=sourceOverride??(second?r('TransitionInputProducerV04',{VariantTag:unsigned(2),ProducingTransitionKind:evalKind}):r('TransitionInputProducerV04',{VariantTag:unsigned(1),ProducingSeamId:id(1036,'seam/event-truth-to-pre-recognition-experience'),ProducingSeamVersion:text('semantic-binding/0.1-candidate#SEM-001H'),Lane:unsigned(2)}));
  return registry(second?learnKind:evalKind,'registry/transition-registration',r('TransitionRegistrationV04',{
    ExecutingSeamId:id(1036,'seam/character-learning-evidence'),ExecutingSeamVersion:text('character-learning-evidence/0.5-candidate'),
    TransitionDefinition:r('TransitionDefinitionV04',{InputAdmission:r('TransitionInputAdmissionV04',{InputRecordSchema:ref(second?269:227),Producer:producer,RequiredSourceRelation:unsigned(1)}),ReadDomain:set([]),OutputDefinitions:set([r('TransitionOutputDefinition',{OutputRecordSchema:ref(second?270:269),Multiplicity:unsigned(1)})]),WriteCapability:r('WriteCapabilityV04',{VariantTag:unsigned(1)})}),
    IngressDefinition:r('TransitionIngressDefinition',{ConsumerEventTypeId:eventOverride??id(1001,second?'event/outcome-learning-evidence':'event/outcome-evaluation'),DueAtRule:unsigned(1),ConsumerPhase:unsigned(phase),PayloadRule:unsigned(1),Multiplicity:unsigned(1)}),
  }));
}
async function context(omitExperienceRole=false){
  const {content,entries}=fixtureContentInputs(governedContentDefinitionId('character/mina'));
  const roles=[...fixtureRoleConstraints,...(omitExperienceRole?[]:[recordConstraint(227,1,namespaceRole(1106))]),recordConstraint(269,1,namespaceRole(1116)),recordConstraint(270,1,namespaceRole(1117))];
  return compileFirstCampaign2Content(content,entries,enc(set(roles)),entries);
}
const experience=()=>preRecognitionSemanticExperienceValue({experienceId:1n,observerId:'observer/mina',occurredAt:10n,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
const evaluation=(ordinal=2)=>r('OutcomeEvaluation',{OutcomeEvaluationId:typedIdentifier(1116,unsigned(ordinal)),ConsequenceExperience:experience(),TransformationVersion:text('character-learning-evidence/0.5-candidate')});
describe('V04 shared occurrence and output construction controls',()=>{
  it('EVID-A/S: both stages reject zero, two distinct, two identical and wrong-schema outputs with the exact carrier',async()=>{
    const model=compileTransitionAdmissionV04(enc(set([registration(),registration(true)])),enc(bundle()),await context());
    for(const second of [false,true]){
      const output=(ordinal:number)=>second?r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:typedIdentifier(1117,unsigned(ordinal)),Evaluation:evaluation(),TransformationVersion:text('character-learning-evidence/0.5-candidate')}):evaluation(ordinal);
      expect(model.validateOutputs(second?learnKind:evalKind,[enc(output(100))])).toEqual([output(100)]);
      for(const outputs of [[],[output(100),output(101)],[output(100),output(100)],[unsigned(0)]])
        expect(()=>model.validateOutputs(second?learnKind:evalKind,outputs.map(enc))).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
    }
  });
  it('uses real scheduler child/occurrence allocation and rolls back externally injected consumer work',async()=>{
    const model=compileTransitionAdmissionV04(enc(set([registration(),registration(true)])),enc(bundle()),await context());
    for(const mode of ['valid','forged','duplicate-ingress']){
      const forged=mode==='forged';
      const rt=beginTransitionIngressV04(model,10n),root=id(1001,'fixture/sem-freeze');let successfulAllocations=0;
      const handlers=new Map<string,EventHandler<CanonicalValue>>();
      handlers.set(bytesToHex(enc(root)),ctx=>{
        // Trusted-adapter control at the actual freeze event; full SEM adapter proof remains separate.
        const stage=rt.observeSemanticFreeze(ctx.event,[enc(experience())]);
        return {nextState:ctx.state,emittedEvents:mode==='duplicate-ingress'?[...stage.emissions(),...stage.emissions()]:stage.emissions(),traceContributions:[],outputs:[],traceFactory:children=>{stage.bindAllocatedChildren(children);return [];}};
      });
      for(const second of [false,true])handlers.set(bytesToHex(enc(id(1001,second?'event/outcome-learning-evidence':'event/outcome-evaluation'))),ctx=>{
        const cap=rt.admit(ctx.event); // Before any allocation or projection operation.
        const occurrence=rt.allocateEvidIdentity(cap,{allocateRuntimeId:()=>{successfulAllocations++;return ctx.allocateRuntimeId();}});
        const output=second?r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:occurrence,Evaluation:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')}):r('OutcomeEvaluation',{OutcomeEvaluationId:occurrence,ConsequenceExperience:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
        const stage=rt.completeEvid(cap,[enc(output)]);
        return {nextState:ctx.state,emittedEvents:stage.emissions(),traceContributions:[],outputs:[output],traceFactory:children=>{stage.bindAllocatedChildren(children);if(second)rt.finish();return [];}};
      });
      const scheduler=new DeterministicScheduler<CanonicalValue>({initialState:list([]),stateAdapter:{clone:structuredClone,validate:()=>{},canonicalValue:x=>x},handlers,maxSettlementWorkPerSimulationInstant:10n});
      scheduler.schedule({dueAt:simInstant(10n),phase:forged?130n:124n,eventTypeId:forged?id(1001,'event/outcome-evaluation'):root,payload:forged?experience():unsigned(0),dependencies:list([])});
      const before=scheduler.getAllocatorState();
      const expectedCode=forged?'INPUT_NOT_ADMITTED':'TRANSITION_INGRESS_VIOLATION';
      if(mode!=='valid')await expect(scheduler.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:expectedCode}));else await scheduler.settleNextInstant();
      if(mode!=='valid'){expect(scheduler.failureDiagnostic?.code).toBe(expectedCode);expect(successfulAllocations).toBe(0);expect(scheduler.getAllocatorState()).toEqual(before);rt.abort();}
      else {expect(scheduler.failureDiagnostic).toBeUndefined();expect(successfulAllocations).toBe(2);expect(scheduler.getAllocatorState().nextRuntimeId).toBe(before.nextRuntimeId+2n);}
    }
  });
  it('FCT-G/K and IDN-8d: required projection accepts only admitted input and exposes only the field',async()=>{
    const c=await context(),pattern:StatePathPattern={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]};
    const tolerancePattern={...pattern,rootStateTypeId:302n},tolerancePatternValue=statePathPatternValue(tolerancePattern);
    const owner={authorityName:'authority/regulatory-adaptation',ownedLeaves:[{pattern:tolerancePattern,valueGrammar:{kind:'canonical-record' as const,recordTypeId:297n},removalAllowed:true}]};
    const p=statePathPatternValue(pattern),readOnly=r('ReadOnlyStateFamilyDefinition',{Pattern:p,ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:267n})});
    const grammars=[r('StateKeyGrammarDefinition',{Pattern:p,KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(1)})}),r('StateKeyGrammarDefinition',{Pattern:tolerancePatternValue,KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(2),RecordTypeId:unsigned(292)})})];
    const stateModel=compileCampaign2StateModel(enc(mutationAuthorityRegistryValue([owner])),enc(set([readOnly])),enc(set(grammars)),c);
    expect(()=>compileCampaign2StateModel(enc(mutationAuthorityRegistryValue([owner])),enc(set([readOnly])),enc(set(grammars.slice(0,1))),c)).toThrow(/coverage/);
    const overlap=r('ReadOnlyStateFamilyDefinition',{Pattern:tolerancePatternValue,ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:297n})});
    expect(()=>compileCampaign2StateModel(enc(mutationAuthorityRegistryValue([owner])),enc(set([readOnly,overlap])),enc(set(grammars)),c)).toThrow(/overlaps/);
    const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,x]]));};
    const get=(v:CanonicalValue,n:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return v.fields.get(n)!;};
    // Generic PRJ control registration; not the accepted zero-read EVID specialization.
    const initial=registration(),base=get(initial,4n),definition=replace(get(base,3n),2n,set([p,tolerancePatternValue]));
    const declared=replace(replace(replace(base,3n,definition),1n,id(1036,'seam/projection-control')),2n,text('projection-control/1'));
    const entry=replace(replace(initial,1n,id(1009,'projection-control')),4n,declared);
    const model=compileTransitionAdmissionV04(enc(set([entry])),enc(bundle(undefined,map([]))),c),rt=beginTransitionIngressV04(model,10n);
    const accessor=id(1028,'ResolvedCharacterSubject'),requirement=r('EventDependentProjectedFieldRequirement',{SelectorSourceFieldId:unsigned(2),TargetStatePathTemplate:p,ProjectedFieldId:unsigned(1),OutputRole:fixtureCharacterRole,OutputAccessor:accessor});
    const compiler=compileRequiredProjections(enc(declared),enc(set([requirement])),[],stateModel,c);
    let reads=0;class ObservedState extends AuthoritativeState {override read(path:Parameters<AuthoritativeState['read']>[0]){reads++;return super.read(path);}}
    const characterValue=typedIdentifier(1002,typedIdentifier(1037,governedContentDefinitionId('character/mina')));
    const state=new ObservedState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/mina')}]},value:r('CharacterObserverBindingValue',{CharacterId:characterValue})}]);
    const staged=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(staged.emissions()[0],11n,10n);
    expect(()=>compiler.construct(event as unknown as AdmittedTransitionInput,state)).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));expect(reads).toBe(0);
    staged.bindAllocatedChildren([event]);const cap=rt.admit(event),result=compiler.construct(cap,state);
    expect(reads).toBe(1);expect(result.projection.read(accessor)).toEqual(characterValue);expect(Object.keys(result.projection)).toEqual(['read']);
    expect(result.actualReadRecords()[0].derivedSources[0].value).toEqual(r('CharacterObserverBindingValue',{CharacterId:characterValue}));
    expect(()=>result.projection.read(id(1028,'wrapper'))).toThrowError(expect.objectContaining({code:'UNKNOWN_ACCESSOR'}));
    expect(()=>compiler.construct(cap,new AuthoritativeState([]))).toThrowError(expect.objectContaining({code:'REQUIRED_PROJECTION_VALUE_ABSENT'}));
    expect(()=>compileRequiredProjections(enc(declared),enc(set([])),[],stateModel,c)).toThrow(/exactly one/);
    const direct={kind:'direct' as const,accessorId:id(1028,'wrapper'),path:state.entries()[0].path};
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[direct],stateModel,c)).toThrow(/roster access/);
    const alternate=replace(requirement,5n,id(1028,'alternate'));
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement,alternate])),[],stateModel,c)).toThrow(/IDN subject requirement/);
    const toleranceKey=r('ToleranceKey',{CharacterId:characterValue,ExposureReferentId:characterValue,RegulatoryVariableId:id(1029,'variable/control')}),tolerancePath={rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:toleranceKey}]};
    const staticBinding={kind:'direct' as const,accessorId:id(1028,'accessor/adaptation-target-prior'),path:tolerancePath};
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[staticBinding],stateModel,c)).not.toThrow();
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[{...staticBinding,accessorId:accessor}],stateModel,c)).toThrow(/duplicate/);
    expect(()=>compileRequiredProjections(enc(declared),enc(set([replace(requirement,1n,unsigned(1))])),[],stateModel,c)).toThrow(/incompatible projection roles/);
    expect(()=>compileRequiredProjections(enc(declared),enc(set([replace(requirement,4n,namespaceRole(1000))])),[],stateModel,c)).toThrow(/incompatible projection roles/);
    const badPath={...tolerancePath,selectors:[{kind:'mapKey' as const,key:r('RegulatoryAdaptationKey',{CharacterId:characterValue,RegulatoryVariableId:id(1029,'variable/control')})}]};
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[{...staticBinding,path:badPath}],stateModel,c)).toThrowError(expect.objectContaining({code:'INVALID_PATH'}));
    const badRoleKey=replace(toleranceKey,3n,id(1000,'wrong variable'));
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[{...staticBinding,path:{...tolerancePath,selectors:[{kind:'mapKey',key:badRoleKey}]}}],stateModel,c)).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    const derived={kind:'derived' as const,accessorId:id(1028,'wrapper'),projectionPath:tolerancePath,sourcePaths:[state.entries()[0].path],transformationId:id(1028,'wrapper'),derive:()=>unsigned(0)};
    expect(()=>compileRequiredProjections(enc(declared),enc(set([requirement])),[derived],stateModel,c)).toThrow(/roster access/);
    rt.abort();
  });
  const source=():ScheduledEvent=>({eventId:10n,eventSequence:10n,dueAt:simInstant(10n),phase:124n,eventTypeId:id(1001,'fixture/sem-freeze'),payload:unsigned(0),dependencies:set([]),causalParentEventIds:[]});
  const child=(emission:EventEmission,n:bigint,parent:bigint):ScheduledEvent=>({...emission,eventId:n,eventSequence:n,causalParentEventIds:[parent]});
  async function runtime(){const model=compileTransitionAdmissionV04(enc(set([registration(),registration(true)])),enc(bundle()),await context());return beginTransitionIngressV04(model,10n);}
  it('EVID-B/M/O: empty and current-lane freezes grant no EVID ingress; archived E and wrong producer versions fail',async()=>{
    // Trusted-adapter boundary controls; reservation derivation remains owned by SEM.
    for(const current of [false,true]){
      const rt=await runtime(),stage=rt.observeSemanticFreeze({...source(),phase:current?14n:124n},current?[enc(experience())]:[]);
      expect(stage.emissions()).toEqual([]);stage.bindAllocatedChildren([]);
      let allocations=0;
      const injected={...source(),eventId:11n,eventSequence:11n,phase:130n,eventTypeId:id(1001,'event/outcome-evaluation'),payload:experience(),causalParentEventIds:[10n]};
      expect(()=>{const cap=rt.admit(injected);rt.allocateEvidIdentity(cap,{allocateRuntimeId:()=>{allocations++;return 100n;}});}).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
      expect(allocations).toBe(0);rt.finish();
    }
    const rt=await runtime();
    for(const phase of [13n,123n,130n,150n])expect(()=>rt.observeSemanticFreeze({...source(),phase},[enc(experience())])).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
    expect(()=>rt.observeSemanticFreeze(source(),[enc(evaluation())])).toThrow();
    // Rejected boundary calls leave no pending dispatch or execution.
    rt.finish();
    const wrongProducer=r('TransitionInputProducerV04',{VariantTag:unsigned(1),ProducingSeamId:id(1036,'seam/event-truth-to-pre-recognition-experience'),ProducingSeamVersion:text('semantic-binding/unsupported'),Lane:unsigned(2)});
    const c=await context();
    expect(()=>compileTransitionAdmissionV04(enc(set([registration(false,130,wrongProducer),registration(true)])),enc(bundle()),c)).toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
  });
  it('FCT-G/H/I/K: resemblance grants no admission or selector access',async()=>{
    const rt=await runtime(),staged=rt.observeSemanticFreeze(source(),[enc(experience())]),generated=child(staged.emissions()[0],11n,10n);
    let selectors=0,reads=0,allocations=0;
    const consume=(event:ScheduledEvent)=>{const cap=rt.admit(event);admittedInputFacts(cap);selectors++;reads++;allocations++;};
    expect(()=>consume(structuredClone(generated))).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
    expect([selectors,reads,allocations]).toEqual([0,0,0]);
    expect(()=>admittedInputFacts(generated as unknown as AdmittedTransitionInput)).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
    staged.bindAllocatedChildren([generated]);
    expect(()=>consume({...generated,eventId:12n,eventSequence:12n})).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
    expect(()=>consume({...generated,causalParentEventIds:[9n]})).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
    expect([selectors,reads,allocations]).toEqual([0,0,0]);
    const cap=rt.admit(generated);expect(admittedInputFacts(cap).payload).toEqual(experience());rt.abort();
    expect(()=>admittedInputFacts(cap)).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
  });
  it('authenticates both EVID stages, fresh IDs, terminal output and quiescent capability expiry',async()=>{
    const rt=await runtime(),staged=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(staged.emissions()[0],11n,10n);
    staged.bindAllocatedChildren([event]);const cap=rt.admit(event);let ordinal=100n;
    const allocator={allocateRuntimeId:()=>ordinal++};
    const e=r('OutcomeEvaluation',{OutcomeEvaluationId:rt.allocateEvidIdentity(cap,allocator),ConsequenceExperience:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    const next=rt.completeEvid(cap,[enc(e)]),event2=child(next.emissions()[0],12n,11n);next.bindAllocatedChildren([event2]);
    const cap2=rt.admit(event2),l=r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:rt.allocateEvidIdentity(cap2,allocator),Evaluation:admittedInputFacts(cap2).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    const terminal=rt.completeEvid(cap2,[enc(l)]);expect(terminal.emissions()).toEqual([]);terminal.bindAllocatedChildren([]);rt.finish();
    expect(ordinal).toBe(102n);expect(()=>admittedInputFacts(cap2)).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
  });
  it('EVID-L: canonical nonempty event-classification and explicit false survive both admitted nested copies',async()=>{
    const empty=experience() as Extract<CanonicalValue,{kind:'record'}>,eventFile=perceptualEventReferentIdValue({observerId:'observer/mina',observerEventSequence:3n});
    // Canonical carrier fixture at the trusted freeze boundary, not a new SEM classification rule.
    const classification=semanticRecordValue('PerceptualEventClassificationEvidence',{
      EventClassificationEvidenceId:semanticOccurrenceId('EventClassificationEvidenceId',4n),ExperienceId:empty.fields.get(1n)!,ObserverId:id(1000,'observer/mina'),PerceptualEventReferentId:eventFile,
      PerceptualEventFacetId:semanticTypedId('PerceptualEventFacetId',text('perceptual-event-facet/appears-rope-skipping-pattern-like')),TypedPerceivedValue:false,
      EventClassificationRuleId:semanticTypedId('PerceptualEventClassificationRuleId',text('event-classification-rule/rope-skipping-pattern-conjunction')),
      SupportingEventFeatureObservationIds:set([]),SupportingPerceptualReferentIds:set([]),SupportingObservationIds:set([]),OccurredAt:unsigned(10),TransformationVersion:text('semantic-binding/0.1-candidate#SEM-001H'),
    });
    const x=record(empty.schema,new Map([...empty.fields,[4n,set([eventFile])],[7n,set([classification])]]));
    expect(decodeCampaign2(enc(x))).toEqual(x);expect(enc(x)).not.toEqual(enc(empty));
    const rt=await runtime(),stage=rt.observeSemanticFreeze(source(),[enc(x)]),event=child(stage.emissions()[0],11n,10n);stage.bindAllocatedChildren([event]);
    const cap=rt.admit(event);let ordinal=100n;const allocator={allocateRuntimeId:()=>ordinal++};
    const e=r('OutcomeEvaluation',{OutcomeEvaluationId:rt.allocateEvidIdentity(cap,allocator),ConsequenceExperience:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    const next=rt.completeEvid(cap,[enc(e)]),event2=child(next.emissions()[0],12n,11n);next.bindAllocatedChildren([event2]);const cap2=rt.admit(event2);
    const l=r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:rt.allocateEvidIdentity(cap2,allocator),Evaluation:admittedInputFacts(cap2).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    const terminal=rt.completeEvid(cap2,[enc(l)]);terminal.bindAllocatedChildren([]);rt.finish();
    const nested=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture record');return v.fields.get(2n)!;};
    expect(enc(nested(decodeCampaign2(enc(e))))).toEqual(enc(x));expect(enc(nested(nested(decodeCampaign2(enc(l)))))).toEqual(enc(x));expect(ordinal).toBe(102n);
  });
  it('EVID-J/S: no-write rejection precedes bad output validation at both stages and does not consume the execution',async()=>{
    for(const second of [false,true]){
      const rt=await runtime(),stage=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(stage.emissions()[0],11n,10n);stage.bindAllocatedChildren([event]);
      let cap=rt.admit(event),ordinal=100n;const allocator={allocateRuntimeId:()=>ordinal++};
      let output=r('OutcomeEvaluation',{OutcomeEvaluationId:rt.allocateEvidIdentity(cap,allocator),ConsequenceExperience:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
      if(second){const next=rt.completeEvid(cap,[enc(output)]),event2=child(next.emissions()[0],12n,11n);next.bindAllocatedChildren([event2]);cap=rt.admit(event2);
        output=r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:rt.allocateEvidIdentity(cap,allocator),Evaluation:admittedInputFacts(cap).payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});}
      const before=ordinal;
      expect(()=>rt.completeEvid(cap,[enc(unsigned(0))],{operations:[{} as never]})).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_FORBIDDEN'}));
      expect(()=>rt.completeEvid(cap,[enc(unsigned(0))],{operations:[]},list([]),list([true]))).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_FORBIDDEN'}));
      expect(()=>rt.completeEvid(cap,[enc(unsigned(0))],{operations:[]},list([]))).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_FORBIDDEN'}));
      expect(()=>rt.completeEvid(cap,[enc(output)],{operations:[]},list([]),list([]))).not.toThrow();expect(ordinal).toBe(before);rt.abort();
    }
  });
  it('EVID-B/C/H: altered observer, time or occurrence bytes cannot reuse generated admission or allocate output identity',async()=>{
    for(const [field,value] of [[2n,id(1000,'observer/other')],[3n,unsigned(11)],[1n,typedIdentifier(1106,unsigned(99))]] as [bigint,CanonicalValue][]){
      const rt=await runtime(),stage=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(stage.emissions()[0],11n,10n);stage.bindAllocatedChildren([event]);
      const payload=event.payload as Extract<CanonicalValue,{kind:'record'}>;let allocations=0;
      const consume=(e:ScheduledEvent)=>{const cap=rt.admit(e);rt.allocateEvidIdentity(cap,{allocateRuntimeId:()=>{allocations++;return 100n;}});};
      expect(()=>consume({...event,payload:record(payload.schema,new Map([...payload.fields,[field,value]]))})).toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
      expect(allocations).toBe(0);expect(()=>consume(event)).not.toThrow();expect(allocations).toBe(1);rt.abort();
    }
  });
  it('FCT-J: unused-looking or reused valid IDs cannot replace the execution allocation',async()=>{
    const rt=await runtime(),stage=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(stage.emissions()[0],11n,10n);
    stage.bindAllocatedChildren([event]);const cap=rt.admit(event);
    expect(()=>rt.completeEvid(cap,[enc(evaluation(2))])).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
    rt.allocateEvidIdentity(cap,{allocateRuntimeId:()=>100n});
    expect(()=>rt.completeEvid(cap,[enc(evaluation(2))])).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
    expect(()=>rt.completeEvid(cap,[],{operations:[{} as never]})).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_FORBIDDEN'}));
    expect(()=>rt.completeEvid(cap,[],{operations:[]},list([]),list([unsigned(1)]))).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_FORBIDDEN'}));rt.abort();
  });
  it('detects missing/duplicate child topology even when no consumer enters',async()=>{
    for(const mode of ['missing','duplicate','unbound']){
      const rt=await runtime(),stage=rt.observeSemanticFreeze(source(),[enc(experience())]),event=child(stage.emissions()[0],11n,10n);
      if(mode==='unbound')expect(()=>rt.finish()).toThrowError(expect.objectContaining({code:'TRANSITION_INGRESS_VIOLATION'}));
      else expect(()=>stage.bindAllocatedChildren(mode==='missing'?[]:[event,event])).toThrowError(expect.objectContaining({code:'TRANSITION_INGRESS_VIOLATION'}));
      rt.abort();
    }
  });
  it('derives inhabited route closure and exact terminal output cardinality',async()=>{
    const compiled=compileTransitionAdmissionV04(enc(set([registration(),registration(true)])),enc(bundle()),await context());
    expect(compiled.outputClosure(route)).toEqual(['269/1','270/1']);
    const e=evaluation(),l=r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:typedIdentifier(1117,unsigned(3)),Evaluation:e,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    expect(compiled.validateOutputs(evalKind,[enc(e)])).toEqual([e]);
    expect(compiled.validateOutputs(learnKind,[enc(l)])).toEqual([l]);
    for(const [kind,good,wrong] of [[evalKind,e,l],[learnKind,l,e]])for(const outputs of [[],[enc(good),enc(good)],[enc(wrong)]])
      expect(()=>compiled.validateOutputs(kind,outputs)).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
    expect(()=>compiled.validateOutputs(evalKind,[enc(e),enc(evaluation(4))])).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));
  });
  it('rejects missing/incompatible identity roles and wrong identity fields',async()=>{
    const registrations=enc(set([registration(),registration(true)])),c=await context();
    for(const rules of [occurrenceMap(2),occurrenceMap(1,1117)])expect(()=>compileTransitionAdmissionV04(registrations,enc(bundle(rules)),c)).toThrow(/occurrence/);
    const missing=await context(true);expect(()=>compileTransitionAdmissionV04(registrations,enc(bundle()),missing)).toThrow(/occurrence/);
    const occurrence=compileOccurrenceIdentities(enc(occurrenceMap()),c);
    expect(occurrence.extract(enc(evaluation()))).toEqual(typedIdentifier(1116,unsigned(2)));
    const bad=r('OutcomeEvaluation',{OutcomeEvaluationId:typedIdentifier(1117,unsigned(2)),ConsequenceExperience:experience(),TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    expect(()=>occurrence.extract(enc(bad))).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  });
  it('rejects unresolved producers, backward/unschedulable ingress, shared event IDs and unknown routes',async()=>{
    const c=await context();
    const unknown=r('TransitionInputProducerV04',{VariantTag:unsigned(2),ProducingTransitionKind:id(1009,'unknown')});
    for(const entries of [[registration(),registration(true,130,unknown)],[registration(false,120),registration(true)],[registration(false,150),registration(true)],
      [registration(),registration(true,130,undefined,id(1001,'event/outcome-evaluation'))]])
      expect(()=>compileTransitionAdmissionV04(enc(set(entries)),enc(bundle()),c)).toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
    expect(()=>compileTransitionAdmissionV04(enc(set([registration(),registration(true)])),enc(bundle(undefined,map([[id(1009,'unknown'),route]]))),c)).toThrow(/route/);
  });
  it('uses exact PRJ role compatibility, with no validator implication',()=>{
    expect(identityRolesCompatible(enc(fixtureCharacterRole),enc(namespaceRole(1002)))).toBe(true);
    expect(identityRolesCompatible(enc(namespaceRole(1002)),enc(fixtureCharacterRole))).toBe(false);
    expect(identityRolesCompatible(enc(fixtureCharacterRole),enc(fixtureCharacterRole))).toBe(true);
    expect(identityRolesCompatible(enc(namespaceRole(1000)),enc(namespaceRole(1002)))).toBe(false);
  });
});

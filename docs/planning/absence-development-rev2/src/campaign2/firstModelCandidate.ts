/** Frozen first-model specimen, 2026-09-06. This builder is not an activation API. */
import allocation from '../../docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json';
import {canonicalEncode,list,set,map,record,text,unsigned,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createGovernedContentDefinition,compileContentDefinition,contentRegistrySchemas} from '../substrate/contentManifest';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {observationUnitId} from '../substrate/observationUnitId';
import {mutationAuthorityRegistryValue,type MutationAuthorityDefinition} from '../substrate/mutationAuthority';
import {statePathPatternValue} from '../substrate/state';
import {orderingPhaseRegistryValue,orderingParametersValue} from '../substrate/scheduler';
import {timeSchemas} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {observationChannelValue} from '../observation/observation';
import {ExactRational} from '../substrate/exactMath';
import {campaign2Record as r,campaign2SchemaByType} from './codecs';
import {trustedSchemaDescriptors,trustedUnionEntries,BOUNDED_RULES,REGISTRY_PROFILE,PARAMETER_PROFILE} from './modelPackaging';
export const candidateId=(ns:number,payload:string)=>typedIdentifier(ns,text(payload));
const id=candidateId,empty=list([]),ADAPT='adaptation-input/0.31-candidate';
const entry=(stable:CanonicalValue,kind:string,definition:CanonicalValue,version=ADAPT)=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,kind)],[3n,text(version)],[4n,definition]]));
const ref=(type:number)=>record(campaign2SchemaByType(254n),new Map([[1n,unsigned(type)],[2n,unsigned(1)]]));
export const candidatePattern=(i:number)=>({rootStateTypeId:i===4?303n:302n,fieldId:BigInt(i===4?1:i+1),selectors:[{kind:'wildcard' as const,selectorKind:'mapKey' as const}]});
export const namespaceRole=(ns:number)=>r('CanonicalIdentityRole',{RequiredNamespace:unsigned(ns)});
export const recordRole=(type:number,field:number,role:CanonicalValue)=>r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(type),FieldId:unsigned(field)}),Role:role});
const charRole=()=>r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:id(1021,'validator/character-qualification')});
export function firstModelCandidate(){
  const stable=governedContentDefinitionId('character/bridge-subject'),character=semanticReferentFromAuthoredContent(stable),kind=id(1004,'semantic-kind/character');
  const variable=id(1029,'variable/fixture-regulation'),parameter=id(1030,'parameter/fixture-reference'),load=id(1033,'load/fixture-load'),procedure=id(1034,'procedure/fixture-practice');
  const content=compileContentDefinition(createGovernedContentDefinition({stableId:stable,semanticKind:kind,declaredInputs:empty,declaredOutputs:empty,preconditions:empty,worldEffects:empty,unitsDomainsBounds:empty,epistemicVisibility:empty,observationAffordances:empty,lifecycle:empty,referencedRegistryIds:[],referencedContentIds:[],validationInvariants:empty,sourceProvenance:empty,changeHistory:empty,formalSeamMappings:empty})).canonicalDefinition;
  const entries:CanonicalValue[]=[...trustedUnionEntries(),
    entry(kind,'registry/semantic-kind',r('GovernedContentKindDefinition',{ContentSchema:ref(170)}),'content-kind/0.1-candidate'),
    entry(id(1021,'validator/character-qualification'),'registry/domain-validator',r('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:kind}),'governed-domain-validator/0.1-candidate')];
  const names=['leaf/tolerance','leaf/sensitization','leaf/regulatory-displacement','leaf/accumulated-load','leaf/procedural-competence'];
  const families=['belief-expectation','episodic-memory','associations','values','habits','person-model','relationships','identity-disposition'].map(name=>[id(1031,name),r('Campaign2StateFamilyDefinition',{Route:id(1026,'route/character-learning'),Storage:r('Campaign2Storage',{VariantTag:unsigned(1)})})] as [CanonicalValue,CanonicalValue]);
  for(const [name,root,indexes] of [['regulatory-adaptation',302,[0,1,2,3]],['procedural-skill',303,[4]]] as const)families.push([id(1031,name),r('Campaign2StateFamilyDefinition',{Route:id(1026,'route/automatic-adaptation'),Storage:r('Campaign2Storage',{VariantTag:unsigned(2),RootStateTypeId:unsigned(root),LeafFields:map(indexes.map(i=>[id(1032,names[i]),unsigned(i===4?1:i+1)]))})})]);
  entries.push(entry(id(1027,'definition/campaign2-state-families'),'registry/campaign2-state-family',r('Campaign2StateFamilyRegistry',{Families:map(families)})));
  names.forEach((name,i)=>entries.push(entry(id(1032,name),'registry/adaptation-leaf-family',r('AdaptationLeafFamilyDefinition',{DomainSource:r('AdaptationDomainSource',i<2?{VariantTag:unsigned(1),Scale:unsigned(10)}:{VariantTag:unsigned(i)})}))));
  entries.push(entry(load,'registry/load-domain',r('LoadDomainDefinition',{Scale:unsigned(10),Capacity:r('LoadCapacity',{VariantTag:unsigned(2),Maximum:unsigned(10)})})),entry(procedure,'registry/procedure',r('ProcedureDefinition',{CompetenceScale:unsigned(10)})));
  const rate=record(timeSchemas.linearRateParameters,new Map([[1n,parameter],[2n,signed(0)],[3n,unsigned(1)],[4n,signed(0)],[5n,signed(100)]]));
  const anchor=record(timeSchemas.analyticalAnchor,new Map([[1n,signed(50)],[2n,unsigned(0)],[3n,parameter],[4n,unsigned(0)]]));
  entries.push(entry(variable,'registry/regulatory-variable',r('RegulatoryVariableRegistration',{VariableDefinition:r('RegulatoryVariableDefinition',{Scale:unsigned(10),Minimum:signed(0),Maximum:signed(100)}),ReferenceDefinition:r('RegulatoryReferenceDefinition',{CharacterReferences:map([[r('RegulatoryCharacterReferenceKey',{CharacterId:character}),anchor]]),Parameters:map([[parameter,rate]])})}),'regulatory-reference/0.5-candidate'));
  const rules=names.map(n=>id(1035,`rule/fixture-${n.slice(5)}`));
  names.forEach((name,i)=>entries.push(entry(rules[i],'registry/adaptation-rule',r('AdaptationRuleDefinition',{
    Match:r('AdaptationMatch',i===4?{VariantTag:unsigned(2),ProcedureId:procedure}:{VariantTag:unsigned(1),ExposureReferentId:character}),
    TargetStateFamilyId:id(1031,i===4?'procedural-skill':'regulatory-adaptation'),TargetLeafFamilyId:id(1032,name),
    KeyDerivation:r('AdaptationKeyDerivation',i<2?{VariantTag:unsigned(1),RegulatoryVariableId:variable}:i===2?{VariantTag:unsigned(2),RegulatoryVariableId:variable}:i===3?{VariantTag:unsigned(3),LoadDomainId:load}:{VariantTag:unsigned(4)}),Gate:r('AdaptationGate',{VariantTag:unsigned(1)}),Step:signed(1),
  }))));
  const regulatory=id(1009,'transition/regulatory-adaptation'),procedural=id(1009,'transition/procedural-adaptation'),evid=[id(1009,'OutcomeEvaluationTransition'),id(1009,'OutcomeLearningEvidenceTransition')];
  for(const practice of [false,true]){
    const indexes=practice?[4]:[0,1,2,3];
    entries.push(entry(practice?procedural:regulatory,'registry/transition-registration',r('TransitionRegistrationV06',{
      ExecutingSeamId:id(1036,'seam/automatic-adaptation'),ExecutingSeamVersion:text(ADAPT),
      TransitionDefinitionV06:r('TransitionDefinitionV06',{InputAdmission:r('TransitionInputAdmissionV06',{InputRecordSchema:ref(307),Producer:r('TransitionInputProducerV06',{VariantTag:unsigned(3),ProducerDefinition:id(1027,'definition/authored-adaptation-facts')}),RequiredSourceRelation:unsigned(1)}),ReadDomain:set(indexes.map(i=>statePathPatternValue(candidatePattern(i)))),OutputDefinitions:set([r('TransitionOutputDefinition',{OutputRecordSchema:ref(324),Multiplicity:unsigned(1)})]),WriteCapability:r('WriteCapabilityV06',{VariantTag:unsigned(2),MutationAuthority:id(1025,practice?'authority/procedural-skill':'authority/regulatory-adaptation'),WritableFamilies:set([id(1031,practice?'procedural-skill':'regulatory-adaptation')])})}),
      IngressDefinition:r('TransitionIngressDefinition',{ConsumerEventTypeId:id(1001,practice?'event/procedural-adaptation':'event/regulatory-adaptation'),DueAtRule:unsigned(1),ConsumerPhase:unsigned(140),PayloadRule:unsigned(1),Multiplicity:unsigned(1)}),
      AdaptationExtension:r('AdaptationTransitionRegistrationExtension',{AcceptedBasis:unsigned(practice?2:1),RuleResolutionContract:r('RuleResolutionContract',{Rules:set(indexes.map(i=>rules[i]))}),OutputProduction:r('AdaptationOutputProductionDefinition',{DispatchSchema:ref(324),EvaluationSchema:ref(325),Rule:unsigned(1)})}),
    }),'transition-admission-extension/0.6-candidate'));
  }
  evid.forEach((transition,index)=>entries.push(entry(transition,'registry/transition-registration',r('TransitionRegistrationV04',{
    ExecutingSeamId:id(1036,'seam/character-learning-evidence'),ExecutingSeamVersion:text('character-learning-evidence/0.5-candidate'),
    TransitionDefinition:r('TransitionDefinitionV04',{InputAdmission:r('TransitionInputAdmissionV04',{InputRecordSchema:ref(index?269:227),Producer:r('TransitionInputProducerV04',index?{VariantTag:unsigned(2),ProducingTransitionKind:evid[0]}:{VariantTag:unsigned(1),ProducingSeamId:id(1036,'seam/event-truth-to-pre-recognition-experience'),ProducingSeamVersion:text('semantic-binding/0.1-candidate#SEM-001H'),Lane:unsigned(2)}),RequiredSourceRelation:unsigned(1)}),ReadDomain:set([]),OutputDefinitions:set([r('TransitionOutputDefinition',{OutputRecordSchema:ref(index?270:269),Multiplicity:unsigned(1)})]),WriteCapability:r('WriteCapabilityV04',{VariantTag:unsigned(1)})}),
    IngressDefinition:r('TransitionIngressDefinition',{ConsumerEventTypeId:id(1001,index?'event/outcome-learning-evidence':'event/outcome-evaluation'),DueAtRule:unsigned(1),ConsumerPhase:unsigned(130),PayloadRule:unsigned(1),Multiplicity:unsigned(1)}),
  }),'transition-admission/0.4-candidate')));
  entries.push(entry(id(1027,'definition/authored-adaptation-facts'),'registry/authored-adaptation-facts',r('AuthoredAdaptationFactProducerDefinition',{EventTypeId:id(1001,'event/authored-adaptation-fact'),PayloadSchema:ref(304),OutputSchema:ref(307),Phase:unsigned(110)})),entry(id(1027,'definition/adaptation-settlement'),'registry/adaptation-settlement',r('AdaptationSettlementDefinition',{Consumers:set([regulatory,procedural]),PhasePolicy:unsigned(1)}),'adaptation-settlement/0.2-candidate'));
  const channel=id(1005,'channel/fixture-pulse');
  entries.push(entry(id(1027,'definition/authored-fact-consequence-bridge'),'registry/authored-fact-consequence-bridge',r('AuthoredFactConsequenceBridgeDefinition',{Channels:map([[channel,observationChannelValue({observationChannelId:channel,observerId:id(1000,'observer/bridge-subject'),subjectId:character,modalityId:id(1006,'modality/fixture-pulse'),unitId:observationUnitId('unit/fixture-pulse'),polarityId:1n,measurementModeId:1n,precision:ExactRational.of(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n})]])})));
  const occurrences=[[227,1106],[269,1116],[270,1117],[307,1118],[324,1119],[325,1120]];
  entries.push(entry(id(1027,'definition/transition-admission'),'registry/transition-admission',r('TransitionAdmissionRegistry',{LearningRoutes:set([id(1026,'route/character-learning'),id(1026,'route/automatic-adaptation')]),TransitionRoutes:map([...evid.map(t=>[t,id(1026,'route/character-learning')] as [CanonicalValue,CanonicalValue]),...[regulatory,procedural].map(t=>[t,id(1026,'route/automatic-adaptation')] as [CanonicalValue,CanonicalValue])]),OccurrenceIdentities:map(occurrences.map(([type,ns])=>[ref(type),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(ns)})]))}),'transition-admission/0.4-candidate'));
  const owners:MutationAuthorityDefinition[]=[{authorityName:'authority/regulatory-adaptation',ownedLeaves:[0,1,2,3].map(i=>({pattern:candidatePattern(i),valueGrammar:{kind:'canonical-record',recordTypeId:BigInt(297+i)},removalAllowed:true}))},{authorityName:'authority/procedural-skill',ownedLeaves:[{pattern:candidatePattern(4),valueGrammar:{kind:'canonical-record',recordTypeId:301n},removalAllowed:true}]}];
  const ns=new Map(allocation.namespaces.map(n=>[n.name,n.namespace]));
  for(const [name,n] of [['CharacterId',1002],['ExposureReferentId',1002],['ObserverId',1000],['SemanticReferentId',1002],['MutationAuthorityId',1025],['TransitionKindId',1009],['EventTypeId',1001],['DomainValidatorId',1021]] as const)ns.set(name,n);
  const roles:CanonicalValue[]=[];
  for(const schema of allocation.records)for(const field of schema.fields){const namespace=ns.get(field.type);if(namespace!==undefined)roles.push(recordRole(schema.typeId,field.id,field.type==='CharacterId'?charRole():namespaceRole(namespace)));}
  // Inherited records retain their own shapes; these are first-profile role declarations only.
  for(const [type,field,namespace] of [[201,1,1005],[201,2,1000],[201,3,1002],[201,4,1006],[201,5,1039],[227,1,1106],[227,2,1000],[203,1,1115],[203,2,1000],[203,3,1002],[203,4,1005],[200,9,1121]])roles.push(recordRole(type,field,namespaceRole(namespace)));
  const registry=list([set([...trustedSchemaDescriptors(),...entries]),orderingPhaseRegistryValue(),mutationAuthorityRegistryValue(owners),set([]),set(names.map((_,i)=>r('StateKeyGrammarDefinition',{Pattern:statePathPatternValue(candidatePattern(i)),KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(2),RecordTypeId:unsigned(292+i)})}))),set(roles)]);
  return {rulesVersion:BOUNDED_RULES,contentSchemaVersion:'content/0.2-candidate',registrySchemaVersion:REGISTRY_PROFILE,parameterSchemaVersion:PARAMETER_PROFILE,numericProfileVersion:'numeric/exact-1',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,content:canonicalEncode(set([content])),registry:canonicalEncode(registry),parameters:canonicalEncode(list([orderingParametersValue(100n)]))};
}

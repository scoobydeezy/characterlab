import {record,map,set,text,unsigned,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {contentRegistrySchemas} from '../../substrate/contentManifest';
import {campaign2Record as r,campaign2SchemaByType} from '../../campaign2/codecs';
import {namespaceRole} from './campaign2Model';
const id=(ns:number,name:string)=>typedIdentifier(ns,text(name));
const ref=(type:number)=>record(campaign2SchemaByType(254n),new Map([[1n,unsigned(type)],[2n,unsigned(1)]]));
const wrap=(stable:CanonicalValue,definition:CanonicalValue)=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,'registry/transition-registration')],[3n,text('transition-admission/0.4-candidate')],[4n,definition]]));
export const evidRoute=id(1026,'route/character-learning');
export const evidTransitions=[id(1009,'OutcomeEvaluationTransition'),id(1009,'OutcomeLearningEvidenceTransition')];
export const evidOccurrences=()=>[ [227,1106],[269,1116],[270,1117] ].map(([type,ns])=>[ref(type),r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:namespaceRole(ns)})] as [CanonicalValue,CanonicalValue]);
export function evidEntries(){return evidTransitions.map((transition,index)=>wrap(transition,r('TransitionRegistrationV04',{
  ExecutingSeamId:id(1036,'seam/character-learning-evidence'),ExecutingSeamVersion:text('character-learning-evidence/0.5-candidate'),
  TransitionDefinition:r('TransitionDefinitionV04',{InputAdmission:r('TransitionInputAdmissionV04',{InputRecordSchema:ref(index?269:227),Producer:r('TransitionInputProducerV04',index?{VariantTag:unsigned(2),ProducingTransitionKind:evidTransitions[0]}:{VariantTag:unsigned(1),ProducingSeamId:id(1036,'seam/event-truth-to-pre-recognition-experience'),ProducingSeamVersion:text('semantic-binding/0.1-candidate#SEM-001H'),Lane:unsigned(2)}),RequiredSourceRelation:unsigned(1)}),ReadDomain:set([]),OutputDefinitions:set([r('TransitionOutputDefinition',{OutputRecordSchema:ref(index?270:269),Multiplicity:unsigned(1)})]),WriteCapability:r('WriteCapabilityV04',{VariantTag:unsigned(1)})}),
  IngressDefinition:r('TransitionIngressDefinition',{ConsumerEventTypeId:id(1001,index?'event/outcome-learning-evidence':'event/outcome-evaluation'),DueAtRule:unsigned(1),ConsumerPhase:unsigned(130),PayloadRule:unsigned(1),Multiplicity:unsigned(1)}),
})));}

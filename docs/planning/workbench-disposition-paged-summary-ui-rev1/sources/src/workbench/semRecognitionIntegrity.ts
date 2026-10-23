import {canonicalEncode,bytesToHex,set,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentValue} from '../substrate/referentOrigin';
import {assertAdmittedTransformationVersion,assertCanonicalRoundTrip,observerIdValue,perceptualReferentIdValue,semanticOccurrenceId,semanticRecordValue,semanticTypedId,semanticUnionValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue,recognitionResolutionRecordValue} from '../semanticBinding/semanticEvidenceCodecs';
import {evaluateContinuantRecognition,RECOGNITION_CONTRACT_VERSION,type RecognitionEvaluation,type RecognitionRequest,type RecognitionResolutionRecord} from '../semanticBinding/recognition';
import {GLEN,createRunAllocator,projectObserver,truthBindings,observerCatalog,recognitionModel,type ObserverProjection} from '../test/fixtures/phenSem001';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {digest} from './canonical';
import {negativeDiagnostic} from './semNegativeRecorder';

/** Detached diagnostic construction using frozen SEM-001I.2 types233/234.
 * This does not install an evaluation root or alter the native scheduler/trace. */
export function recognitionEvaluationDiagnosticValue(e:RecognitionEvaluation):CanonicalValue{
 assertAdmittedTransformationVersion(e.recognitionVersion);
 const reasons={NoQualifyingCandidate:1n,AmbiguousCandidates:2n,SameCandidateMaintained:3n} as const;
 const result=e.result.kind==='no-update'?semanticUnionValue('RecognitionEvaluationResult',1n,{NoUpdateReason:unsigned(reasons[e.result.reason])}):e.result.kind==='assert-unique-candidate'?semanticUnionValue('RecognitionEvaluationResult',2n,{CandidateSemanticReferentId:semanticReferentValue(e.result.candidateSemanticReferentId)}):semanticUnionValue('RecognitionEvaluationResult',3n,{});
 return semanticRecordValue('RecognitionEvaluation',{
  RecognitionEvaluationId:semanticOccurrenceId('RecognitionEvaluationId',e.recognitionEvaluationId),ExperienceId:semanticOccurrenceId('ExperienceId',e.experienceId),ObserverId:observerIdValue(e.observerId),PerceptualReferentId:perceptualReferentIdValue(e.perceptualReferentId),RecognitionRuleId:semanticTypedId('RecognitionRuleId',text(e.recognitionRuleId)),EvaluatedRecognitionCueEvidenceIds:set(e.evaluatedRecognitionCueEvidenceIds.map(id=>semanticOccurrenceId('RecognitionCueEvidenceId',id))),PriorRecognitionResolutionId:e.priorRecognitionResolutionId===undefined?undefined:semanticOccurrenceId('RecognitionResolutionId',e.priorRecognitionResolutionId),Result:result,OccurredAt:unsigned(e.occurredAt),RecognitionVersion:text(e.recognitionVersion),
 });
}
const encoded=(value:CanonicalValue)=>{assertCanonicalRoundTrip(value);return bytesToHex(canonicalEncode(value));};
export async function runSemRecognitionIntegrity(){
 const allocator=createRunAllocator(5000n),truth=truthBindings(),model=recognitionModel();
 const candidates=[{candidateSemanticReferentId:authoredReferentKey('person.mina'),recognitionTemplateId:'template/mina'},{candidateSemanticReferentId:authoredReferentKey('person.darius'),recognitionTemplateId:'template/darius'}];
 let prior:ObserverProjection|undefined;
 const project=(experienceId:bigint,at:bigint)=>{const p=projectObserver({observerId:GLEN,truth,allocator,experienceId,occurredAt:at,continuantFiles:prior?.continuantFiles,eventFiles:prior?.eventFiles,priorTracksByLabel:prior?.tracksByLabel});prior=p;return p;};
 const makeRequest=(p:ObserverProjection,candidate:number|null,polarity:'SupportsCandidate'|'ContradictsCandidate',history:readonly RecognitionResolutionRecord[]):RecognitionRequest=>{
  const track=p.tracksByLabel.get('glen/actor');const binding=p.perceivedBindings.find(b=>b.perceptualReferentId.observerTrackSequence===track?.observerTrackSequence);if(!binding)throw Error('Original Glen consumed-track binding absent');
  const selected=candidate===null?undefined:candidates[candidate];
  return {experience:p.experience,perceptualReferentId:binding.perceptualReferentId,candidateCatalog:observerCatalog(GLEN,candidates),identitySymbolMappings:[],cueEvidence:selected?[{recognitionCueEvidenceId:allocator.next(),experienceId:p.experience.experienceId,observerId:GLEN,perceptualReferentId:binding.perceptualReferentId,candidateSemanticReferentId:selected.candidateSemanticReferentId,recognitionCueSource:{kind:'retained-template-match',recognitionTemplateId:selected.recognitionTemplateId},cuePolarity:polarity,supportingExperienceEvidenceRefs:[{kind:'perceived-binding',perceivedBindingId:binding.perceivedBindingId}],occurredAt:p.experience.occurredAt,transformationVersion:RECOGNITION_CONTRACT_VERSION}]:[],priorResolutionHistory:history,recognitionVersion:RECOGNITION_CONTRACT_VERSION};
 };
 const evaluate=(request:RecognitionRequest)=>{const start=allocator.next(),result=evaluateContinuantRecognition(model,request,start);while(allocator.peek()<result.nextRuntimeId)allocator.next();return result;};
 const proof=async(exact:string)=>({encoding:'cenc/1-hex',exact,sha256:await digest(Uint8Array.from(exact.match(/../g)??[],x=>parseInt(x,16)))});
 const first=project(1n,10n),before=encoded(preRecognitionSemanticExperienceValue(first.experience)),alternatives=[];
 for(const [id,candidate] of [['unresolved',null],['assert-mina',0],['assert-darius',1]] as const){const request=makeRequest(first,candidate,'SupportsCandidate',[]),result=evaluate(request),after=encoded(preRecognitionSemanticExperienceValue(first.experience));if(before!==after)throw Error('Recognition changed perception');alternatives.push({id,request:negativeDiagnostic(request),result:negativeDiagnostic(result),experience:await proof(after),evaluation:await proof(encoded(recognitionEvaluationDiagnosticValue(result.evaluation))),resolution:result.resolutionRecord?await proof(encoded(recognitionResolutionRecordValue(result.resolutionRecord))):null});}
 const history:RecognitionResolutionRecord[]=[],retained:{experience:ObserverProjection['experience'];evaluation:RecognitionEvaluation;resolution?:RecognitionResolutionRecord;bytes:string[]}[]=[],lifecycle=[];
 const bytes=(r:typeof retained[number])=>[encoded(preRecognitionSemanticExperienceValue(r.experience)),encoded(recognitionEvaluationDiagnosticValue(r.evaluation)),...(r.resolution?[encoded(recognitionResolutionRecordValue(r.resolution))]:[])];
 for(const [id,at,candidate,polarity] of [['assert-darius',20n,1,'SupportsCandidate'],['no-cue',30n,null,'SupportsCandidate'],['same-candidate',40n,1,'SupportsCandidate'],['withdraw',50n,1,'ContradictsCandidate'],['replace-mina',60n,0,'SupportsCandidate']] as const){
  const p=project(at,at),request=makeRequest(p,candidate,polarity,[...history]),result=evaluate(request);
  const preservation=retained.map((r,index)=>({index,equal:JSON.stringify(bytes(r))===JSON.stringify(r.bytes),before:r.bytes,after:bytes(r)}));if(preservation.some(p=>!p.equal))throw Error('Historical recognition bytes changed');
  const r={experience:p.experience,evaluation:result.evaluation,resolution:result.resolutionRecord,bytes:[] as string[]};r.bytes=bytes(r);retained.push(r);if(r.resolution)history.push(r.resolution);
  lifecycle.push({id,request:negativeDiagnostic(request),result:negativeDiagnostic(result),records:await Promise.all(r.bytes.map(proof)),preservation,history:negativeDiagnostic(history)});
 }
 return {version:'sem-recognition-integrity/0.1',contract:RECOGNITION_CONTRACT_VERSION,alternatives,lifecycle,scope:'New declared diagnostic experiment using the accepted PHEN-SEM-001 Glen projection and native recognition rule, not a rewritten historical test. Same canonical experience supports unresolved, Mina and Darius alternatives. Five later evaluations check every earlier experience/evaluation/resolution after each append; no-cue and same-candidate steps emit no replacement. Types227/233/234/235/236 use accepted SEM-001I.2 schemas with cenc/1 round trips. Evaluation construction is detached workbench diagnostics, not a new native state root, scheduler trace or persistence claim. Catalog identities are observer-owned; no correctness/confidence flag is inferred. CV-SEM-004/005/006 bounded witnesses only, not full SEM or Campaign4 acceptance.'};
}

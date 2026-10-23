import * as f from './semRecognitionFixture';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {evaluateContinuantRecognition,currentRecognitionResolution,RecognitionContractError,type RecognitionRequest,type RecognitionResolutionRecord} from '../semanticBinding/recognition';
import {digest} from './canonical';
/** Diagnostic JSON, not a re-versioned SEM canonical record. Explicit tagged
 * bigint/undefined retain the original component DTO values and absence. */
export const recognitionDiagnostic=(value:unknown)=>JSON.stringify(value,(_key,v)=>typeof v==='bigint'?{$bigint:String(v)}:v===undefined?{$undefined:true}:v,2);
async function evidence(value:unknown){const exact=recognitionDiagnostic(value);return {encoding:'recognition-component-diagnostic-json/0.1',sha256:await digest(new TextEncoder().encode(exact)),exact};}
export async function runSemRecognitionControls(){
 const model=f.initialModel(),glen=authoredReferentKey('person.glen'),darius=authoredReferentKey('person.darius'),exp=f.experience();
 const evaluate=async(id:string,vector:string,request:RecognitionRequest,start:bigint)=>{
  const before=recognitionDiagnostic(request),r=evaluateContinuantRecognition(model,request,start);
  if(before!==recognitionDiagnostic(request))throw Error('Recognition mutated its input evidence/history');
  const history=[...request.priorResolutionHistory,...(r.resolutionRecord?[r.resolutionRecord]:[])];
  return {report:{id,vector,allocatorStart:String(start),nextRuntimeId:String(r.nextRuntimeId),evaluation:r.evaluation.result,resolutionEmitted:!!r.resolutionRecord,current:currentRecognitionResolution(history,f.observerId,request.perceptualReferentId)?.resolution??null,request:await evidence(request),result:await evidence(r),history:await evidence(history)},result:r};
 };
 const cases=[];
 const inputs=[
  ['unfamiliar','CV-SEM-061',[]],
  ['contradicted','CV-SEM-061',[f.cue(exp,glen,'ContradictsCandidate',1)]],
  ['ambiguous','CV-SEM-061',[f.cue(exp,glen,'SupportsCandidate',1),f.cue(exp,darius,'SupportsCandidate',2)]],
  ['assert-glen','CV-SEM-062',[f.cue(exp,glen,'SupportsCandidate',1)]],
  ['assert-darius','CV-SEM-062',[f.cue(exp,darius,'SupportsCandidate',1)]],
  ['support-and-contradiction','CV-SEM-063',[f.cue(exp,glen,'SupportsCandidate',1),f.cue(exp,glen,'ContradictsCandidate',2)]],
  ['unique-uncontradicted','CV-SEM-063',[f.cue(exp,glen,'SupportsCandidate',1),f.cue(exp,darius,'ContradictsCandidate',2)]],
  ['ambiguous-reversed','CV-SEM-063',[f.cue(exp,darius,'SupportsCandidate',1),f.cue(exp,glen,'SupportsCandidate',2)]],
 ] as const;
 for(const [id,vector,cues] of inputs)cases.push((await evaluate(id,vector,f.request(exp,cues),0n)).report);
 const history:RecognitionResolutionRecord[]=[],lifecycle=[];
 for(const [id,experienceId,at,start,candidate,polarity] of [
  ['first',8802n,10n,0n,glen,'SupportsCandidate'],
  ['no-cue',8801n,20n,2n,null,null],
  ['same-candidate',8806n,30n,3n,glen,'SupportsCandidate'],
  ['withdraw',8808n,40n,4n,glen,'ContradictsCandidate'],
  ['replace',8805n,50n,6n,darius,'SupportsCandidate'],
 ] as const){const e=f.experience(experienceId,at),r=await evaluate(id,'CV-SEM-065',f.request(e,candidate&&polarity?[f.cue(e,candidate,polarity,1)]:[],history),start);lifecycle.push(r.report);if(r.result.resolutionRecord)history.push(r.result.resolutionRecord);}
 const negatives=[];
 const invalids:[string,string,RecognitionRequest][]=[
  ['catalog-reversed','CV-SEM-063',f.request(exp,[],[],{candidateCatalog:[...f.catalog()].reverse()})],
  ['cross-track','CV-SEM-067',f.request(exp,[f.cue(exp,glen,'SupportsCandidate',1,{perceptualReferentId:f.otherTrack})])],
  ['unavailable-evidence','CV-SEM-067',f.request(exp,[f.cue(exp,glen,'SupportsCandidate',1,{supportingExperienceEvidenceRefs:[{kind:'perceived-binding',perceivedBindingId:999n}]})])],
  ['stale-cue','CV-SEM-067',f.request(exp,[f.cue(exp,glen,'SupportsCandidate',1,{occurredAt:9n})])],
 ];
 for(const [id,vector,request] of invalids){const before=recognitionDiagnostic(request);let failure:{code:string;message:string}|undefined;try{evaluateContinuantRecognition(model,request,0n);}catch(error){if(!(error instanceof RecognitionContractError))throw error;failure={code:error.code,message:error.message};}if(!failure)throw Error('Expected recognition rejection');if(before!==recognitionDiagnostic(request))throw Error('Rejected recognition mutated request');negatives.push({id,vector,request:await evidence(request),failure});}
 return {version:'sem-recognition-controls/0.1',contract:f.version,source:f.originalSource,boundary:'Original recognition component witnesses; no scheduler or native Save132/SEM record-codec claim.',cases,lifecycle,negatives,scope:'Original no-update, assertion, unique support, ambiguity, append-only withdrawal/replacement and selected evidence-closure witnesses. Diagnostic JSON retains original version and bigint/undefined values. No truth-correctness/confidence claim. Symbol-mapping, continuity, allocator rollback, emission-target and broader semantic witnesses remain separate.'};
}

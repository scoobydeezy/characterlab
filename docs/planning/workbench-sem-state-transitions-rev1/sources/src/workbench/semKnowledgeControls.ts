import * as f from './semKnowledgeFixture';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {evaluateContinuantRecognition,RecognitionContractError,type RecognitionRequest} from '../semanticBinding/recognition';
import {semanticUnionValue,semanticOccurrenceId,assertCanonicalRoundTrip,encodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {recognitionDiagnostic} from './semRecognitionControls';
import {digest} from './canonical';
const encodedMappingRef=(ordinal:bigint,experience=1n)=>semanticUnionValue('RecognitionCueSource',2,{PerceivedIdentitySymbolId:semanticOccurrenceId('ExperienceId',experience),ObserverSymbolCandidateMappingId:semanticOccurrenceId('ObserverSymbolCandidateMappingId',ordinal)});
export async function runSemKnowledgeControls(){
 const exp=f.experience(),glen=authoredReferentKey('person.glen'),darius=authoredReferentKey('person.darius'),a=f.mapping(4200n,glen),b=f.mapping(4201n,darius),second=f.mapping(4300n,glen),before=recognitionDiagnostic(a),referenceBefore=bytesToHex(encodeSemanticValue(encodedMappingRef(4200n)));
 const dariusEntry=f.catalogEntry(darius,['template/darius-face']),face=f.catalogEntry(glen,['template/glen-face']),gait=f.catalogEntry(glen,['template/glen-gait']);
 const recipes:[string,string,RecognitionRequest][]=[
  ['active-A','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,glen,4200n)],[a])],
  ['inactive-B','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,glen,4201n)],[a])],
  ['active-B','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,darius,4201n)],[b])],
  ['retired-A','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,darius,4200n)],[b])],
  ['duplicate-symbol','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,glen,4200n)],[a,b])],
  ['near-miss-occurrence','CV-SEM-099',f.request(exp,[f.identityClaimCue(exp,glen,4199n)],[a])],
  ['catalog-face','CV-SEM-100',f.request(exp,[],[],[dariusEntry,face])],
  ['catalog-gait','CV-SEM-100',f.request(exp,[],[],[dariusEntry,gait])],
  ['duplicate-candidate','CV-SEM-100',f.request(exp,[],[],[dariusEntry,face,gait])],
 ];
 const cases=[];
 for(const [id,vector,request] of recipes){const input=recognitionDiagnostic(request);let result:ReturnType<typeof evaluateContinuantRecognition>|undefined,failure:{code:string;message:string}|undefined;
  try{result=evaluateContinuantRecognition(f.model(),request,0n);}catch(error){if(!(error instanceof RecognitionContractError))throw error;failure={code:error.code,message:error.message};}
  if(input!==recognitionDiagnostic(request))throw Error('Knowledge control changed input');
  const exact=recognitionDiagnostic({request,result,failure});cases.push({id,vector,accepted:!!result,evaluation:result?.evaluation.result??null,resolution:result?.resolutionRecord?.resolution??null,failure:failure??null,exact,sha256:await digest(new TextEncoder().encode(exact))});
 }
 const result=evaluateContinuantRecognition(f.model(),recipes[0][2],0n),referenceAfter=bytesToHex(encodeSemanticValue(encodedMappingRef(4200n)));
 if(before!==recognitionDiagnostic(a)||referenceBefore!==referenceAfter)throw Error('Mapping replacement changed retained occurrence');
 return {version:'sem-recognition-knowledge-controls/0.1',contract:f.version,source:f.originalSource,cases,
  occurrencePreservation:{mappingBefore:before,mappingAfter:recognitionDiagnostic(a),referenceBefore,referenceAfter,distinctSecondOccurrence:String(second.observerSymbolCandidateMappingId),roundTripHex:bytesToHex(assertCanonicalRoundTrip(encodedMappingRef(4200n,0n))),scope:'Original CV-SEM-099 codec witness retained verbatim, including its typed ExperienceId symbol payload. It is not a new semantic symbol-validation claim.'},
  resolutionState:{evaluationId:String(result.evaluation.recognitionEvaluationId),resolutionId:String(result.resolutionRecord!.recognitionResolutionId),hasEvaluationPointer:Object.hasOwn(result.resolutionRecord!,'recognitionEvaluationId'),exact:recognitionDiagnostic(result.resolutionRecord)},
  scope:'Original component knowledge-state witnesses: active mapping occurrence, immutable replacement, duplicate symbol/catalog rejection and resolution independent of evaluation pointer. Diagnostic JSON preserves recognition/0.1-candidate without re-versioning. No native save/load, scheduler, stronger state persistence, general recognition or observer narrative claim.'};
}

import * as f from './semRecognitionFixture';
import {recognitionDiagnostic as diagnostic} from './semRecognitionControls';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {INITIAL_RECOGNITION_RULE, INITIAL_RECOGNITION_DERIVATION, compileRecognitionModel, evaluateContinuantRecognition, recognitionSemanticView, validateResolutionHistory, assertRecognitionEmissionTarget, RecognitionContractError, type RecognitionRequest, type RecognitionCandidateCatalogEntry} from '../semanticBinding/recognition';
import {type PerceptualReferentId} from '../semanticBinding/perceptualEventFiles';
import {DeterministicScheduler, type StateAdapter, type EventHandler} from '../substrate/scheduler';
import {bytesToHex, canonicalEncode, typedIdentifier, text, list} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {digest} from './canonical';

export async function runSemRecognitionBoundaryControls(){
 const evidence=async(value:unknown)=>{const exact=diagnostic(value);return {encoding:'recognition-component-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))};};
 const model=f.initialModel(),glen=authoredReferentKey('person.glen'),darius=authoredReferentKey('person.darius');
 const evaluate=(request:RecognitionRequest,start:bigint)=>{const before=diagnostic(request);const result=evaluateContinuantRecognition(model,request,start);if(before!==diagnostic(request))throw Error('Recognition mutated input');return result;};
 const rejects=(run:()=>unknown)=>{try{run();}catch(e){if(!(e instanceof RecognitionContractError))throw e;return {code:e.code,message:e.message};}throw Error('Expected rejection');};
 const exp=f.experience(),claim=f.cue(exp,glen,'SupportsCandidate',1,{recognitionCueSource:{kind:'identity-claim-mapping',perceivedIdentitySymbolId:'perceived-symbol/GLEN',observerSymbolCandidateMappingId:4200n}});
 const unmapped=f.request(exp,[claim]);
 const mapping={observerSymbolCandidateMappingId:4200n,observerId:f.observerId,perceivedIdentitySymbolId:'perceived-symbol/GLEN',candidateSemanticReferentId:glen,mappingVersion:f.version};
 const mapped=f.request(exp,[claim],[],{identitySymbolMappings:[mapping],candidateCatalog:f.catalog({glenDomain:'DiscreteObject'})});
 const truthInjected={...f.catalog()[0],truthEntityId:darius} as RecognitionCandidateCatalogEntry;
 const truthRequest=f.request(exp,[],[],{candidateCatalog:[truthInjected,f.catalog()[1]]});
 const mappingReport={vector:'CV-SEM-064',unmapped:await evidence(unmapped),missing:rejects(()=>evaluate(unmapped,0n)),mapped:await evidence(mapped),result:await evidence(evaluate(mapped,0n)),semanticView:recognitionSemanticView(evaluate(mapped,0n).resolutionRecord),truthRequest:await evidence(truthRequest),truthGuard:rejects(()=>evaluate(truthRequest,0n))};
 const firstExp=f.experience(8803n,10n),firstRequest=f.request(firstExp,[f.cue(firstExp,glen,'SupportsCandidate',1)]),first=evaluate(firstRequest,0n);
 const secondExp=f.experience(8800n,20n),secondRequest=f.request(secondExp,[f.cue(secondExp,darius,'SupportsCandidate',1)],[first.resolutionRecord!]),second=evaluate(secondRequest,2n);
 const splitExp=f.experience(8807n,30n,f.otherTrack),splitRequest=f.request(splitExp,[f.cue(splitExp,glen,'SupportsCandidate',1,{perceptualReferentId:f.otherTrack})],[],{perceptualReferentId:f.otherTrack}),split=evaluate(splitRequest,4n);
 const continuity={vector:'CV-SEM-066',cases:await Promise.all([['first',firstRequest,first],['replacement',secondRequest,second],['split',splitRequest,split]].map(async([id,request,result])=>({id,request:await evidence(request),result:await evidence(result)}))),sameTrackAfterReplacement:diagnostic(first.resolutionRecord?.perceptualReferentId)===diagnostic(second.resolutionRecord?.perceptualReferentId),changedRecognition:recognitionSemanticView(first.resolutionRecord)!==recognitionSemanticView(second.resolutionRecord),splitTrack:diagnostic(first.resolutionRecord?.perceptualReferentId)!==diagnostic(split.resolutionRecord?.perceptualReferentId),sameRecognitionAcrossSplit:recognitionSemanticView(first.resolutionRecord)===recognitionSemanticView(split.resolutionRecord)};
 const rule={...INITIAL_RECOGNITION_RULE,recognitionRuleId:'recognition-rule/alternative',derivationFunctionId:'derivation/alternative'};
 const authority={vector:'CV-SEM-068',alternativeModel:compileRecognitionModel('model/alternative',[rule],[{derivationFunctionId:'derivation/alternative',derive:INITIAL_RECOGNITION_DERIVATION.derive}]).modelIdentity,guards:[
  rejects(()=>compileRecognitionModel('model/missing',[],[INITIAL_RECOGNITION_DERIVATION])),
  rejects(()=>compileRecognitionModel('model/duplicate',[INITIAL_RECOGNITION_RULE,{...INITIAL_RECOGNITION_RULE,recognitionRuleId:'recognition-rule/other'}],[INITIAL_RECOGNITION_DERIVATION])),
  rejects(()=>evaluate(f.request(f.experience(),[],[],{perceptualReferentId:exp.perceptualEventReferentIds[0] as unknown as PerceptualReferentId}),0n)),
  rejects(()=>compileRecognitionModel('model/llm',[{...INITIAL_RECOGNITION_RULE,derivationFunctionId:'llm/recognize'}],[INITIAL_RECOGNITION_DERIVATION]))]};
 const req=f.request(exp,[f.cue(exp,glen,'SupportsCandidate',1)]),low=evaluate(req,4n),replay=evaluate(structuredClone(req),4n),shifted=evaluate(req,900n);
 const branched={...low.resolutionRecord!,recognitionResolutionId:99n,experienceId:8600n,occurredAt:20n};
 const allocation={vector:'CV-SEM-069',request:await evidence(req),low:await evidence(low),replay:await evidence(replay),shifted:await evidence(shifted),exactReplay:diagnostic(low)===diagnostic(replay),sameSemanticView:recognitionSemanticView(low.resolutionRecord)===recognitionSemanticView(shifted.resolutionRecord),differentResolutionId:low.resolutionRecord?.recognitionResolutionId!==shifted.resolutionRecord?.recognitionResolutionId,branchedHistory:await evidence([low.resolutionRecord!,branched]),historyGuard:rejects(()=>validateResolutionHistory([low.resolutionRecord!,branched]))};
 interface State {readonly valid:boolean}
 const adapter:StateAdapter<State>={clone:state=>({...state}),validate:state=>{if(!state.valid)throw Error('injected recognition commit failure');},canonicalValue:state=>state.valid};
 const handlerId=typedIdentifier(32002n,text('event/sem-001f-rollback'));let allocatedEvaluation:string|undefined;
 const handler:EventHandler<State>=({allocateRuntimeId})=>{const result=evaluate(req,allocateRuntimeId());allocatedEvaluation=String(result.evaluation.recognitionEvaluationId);return {nextState:{valid:false},emittedEvents:[],traceContributions:[],outputs:[]};};
 const scheduler=new DeterministicScheduler({initialState:{valid:true},stateAdapter:adapter,handlers:new Map([[bytesToHex(canonicalEncode(handlerId)),handler]]),maxSettlementWorkPerSimulationInstant:10n,initialAllocators:{nextRuntimeId:50n,nextEventId:0n,nextEventSequence:0n}});
 scheduler.schedule({dueAt:simInstant(1n),phase:10n,eventTypeId:handlerId,payload:list([]),dependencies:list([])});
 const capture=()=>{const s=scheduler.exportQuiescentSnapshot();return {state:diagnostic(s.state),allocators:diagnostic(s.allocators),trace:diagnostic(s.committedTrace),outputs:diagnostic(s.outputs),status:s.status,clock:String(s.clock),queue:diagnostic(s.queue)};};
 const before=capture();let failure:string|undefined;try{await scheduler.settleNextInstant();}catch(e){failure=e instanceof Error?e.message:String(e);}if(failure!=='injected recognition commit failure')throw Error('Unexpected rollback outcome');const after=capture();
 const rollback={vector:'CV-SEM-069',allocatedEvaluation,failure,before,after,preserved:{state:before.state===after.state,allocators:before.allocators===after.allocators,trace:before.trace===after.trace,outputs:before.outputs===after.outputs}};
 const targets=['recognition-resolution-log','perceptual-track','semantic-experience','belief','memory','person-model','relationship','appraisal','pressure','reason','option','identity','world-truth'] as const;
 const emissions=targets.map(target=>{if(target==='recognition-resolution-log'){assertRecognitionEmissionTarget(target);return {target,accepted:true,failure:null};}return {target,accepted:false,failure:rejects(()=>assertRecognitionEmissionTarget(target))};});
 const original=evaluate(req,0n),laterExp=f.experience(8804n,20n),repeatedRequest=f.request(laterExp,[f.cue(laterExp,glen,'SupportsCandidate',1)],[original.resolutionRecord!]),repeated=evaluate(repeatedRequest,2n);
 return {version:'sem-recognition-boundary-controls/0.1',contract:f.version,source:f.originalSource,mapping:mappingReport,continuity,authority,allocation,rollback,emission:{vector:'CV-SEM-070',targets:emissions,first:await evidence(original),repeatedRequest:await evidence(repeatedRequest),repeated:await evidence(repeated),resolutionEmitted:!!repeated.resolutionRecord,result:repeated.evaluation.result},scope:'Original CV-SEM-064/066/068/069/070 component witnesses. Diagnostic JSON preserves the original recognition version. Isolated failed settlement preserves data but changes scheduler status; no active-run intervention, native Save132 codec, truth-correctness or full SEM acceptance claim.'};
}

import * as f from '../test/fixtures/phenSem001';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {endPerceptualContinuantFile} from '../semanticBinding/perceptualContinuantFiles';
import {PerceptualFeatureId as Feature} from '../semanticBinding/perceptualClassification';
import {evaluateContinuantRecognition,type RecognitionResolutionRecord,type PermittedRecognitionCueEvidence} from '../semanticBinding/recognition';
import {eventBindingValue,preRecognitionSemanticExperienceValue,recognitionResolutionRecordValue} from '../semanticBinding/semanticEvidenceCodecs';
import {perceptualContinuantFileStateValue} from '../semanticBinding/semanticCodecs';
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {exactKey,digest,fromHex} from './canonical';
import {continuantDiagnostic} from './semContinuantControls';
const appearances=['discrete','metallic','no-assertion'] as const;
const tracking=['continued','reacquired'] as const;
const recognition=['unresolved','glen','darius','corrected'] as const;
const label='mina/companion',glen=authoredReferentKey('person.glen'),darius=authoredReferentKey('person.darius');
const catalog=[{candidateSemanticReferentId:glen,recognitionTemplateId:'template/glen'},{candidateSemanticReferentId:darius,recognitionTemplateId:'template/darius'}];
async function evidence(value:CanonicalValue){const canonicalHex=exactKey(value);return {canonicalHex,sha256:await digest(fromHex(canonicalHex))};}
export async function runSemAxesControls(){
 const cases=[];
 for(const appearance of appearances)for(const trackMode of tracking)for(const recognitionMode of recognition){
  const allocator=f.createRunAllocator(),truth=f.truthBindings(),initial=f.projectObserver({observerId:f.MINA,truth,allocator,experienceId:1n,occurredAt:10n});
  const initialTrack=initial.tracksByLabel.get(label)!;
  const history:RecognitionResolutionRecord[]=[];
  const evaluate=(p:f.ObserverProjection,candidate:string|null,prior:readonly RecognitionResolutionRecord[],start:bigint)=>{
   const track=p.tracksByLabel.get(label)!,binding=p.perceivedBindings.find(b=>b.perceptualReferentId.observerTrackSequence===track.observerTrackSequence)!;
   const cues:PermittedRecognitionCueEvidence[]=candidate?[{recognitionCueEvidenceId:start,experienceId:p.experience.experienceId,observerId:f.MINA,perceptualReferentId:track,candidateSemanticReferentId:candidate,recognitionCueSource:{kind:'retained-template-match',recognitionTemplateId:catalog.find(c=>c.candidateSemanticReferentId===candidate)!.recognitionTemplateId},cuePolarity:'SupportsCandidate',supportingExperienceEvidenceRefs:[{kind:'perceived-binding',perceivedBindingId:binding.perceivedBindingId}],occurredAt:p.experience.occurredAt,transformationVersion:f.RECOGNITION_VERSION}]:[];
   const request={experience:p.experience,perceptualReferentId:track,candidateCatalog:f.observerCatalog(f.MINA,catalog),identitySymbolMappings:[],cueEvidence:cues,priorResolutionHistory:prior,recognitionVersion:f.RECOGNITION_VERSION};
   const before=continuantDiagnostic(request),result=evaluateContinuantRecognition(f.recognitionModel(),request,start+1n);if(before!==continuantDiagnostic(request))throw Error('Recognition mutated axis evidence');return {request,result};
  };
  const priorEvaluation=recognitionMode==='corrected'?evaluate(initial,darius,[],19000n):null;
  if(priorEvaluation?.result.resolutionRecord)history.push(priorEvaluation.result.resolutionRecord);
  let files=initial.continuantFiles;const priorTracks=new Map(initial.tracksByLabel);let retirement=null;
  if(trackMode==='reacquired'){const retired=endPerceptualContinuantFile(files,{observerId:f.MINA,perceptualReferentId:initialTrack,supportingObservationIds:[{observerId:f.MINA,observationId:18000n}],occurredAt:20n,transformationVersion:f.SEM_A});files=retired.state;retirement=retired.trackEnd;priorTracks.delete(label);}
  const features=appearance==='no-assertion'?[]:appearance==='discrete'?[Feature.ObservedDiscreteObjectForm]:[Feature.ObservedDiscreteObjectForm,Feature.ObservedMetallicSurface];
  const projection=f.projectObserver({observerId:f.MINA,truth,allocator,experienceId:2n,occurredAt:30n,continuantFiles:files,eventFiles:initial.eventFiles,priorTracksByLabel:priorTracks,trackFeatures:{...f.TRACK_FEATURES,[label]:features}});
  const track=projection.tracksByLabel.get(label)!,before=exactKey(preRecognitionSemanticExperienceValue(projection.experience));
  const candidate=recognitionMode==='unresolved'?null:recognitionMode==='darius'?darius:glen;
  const current=evaluate(projection,candidate,history,20000n);if(current.result.resolutionRecord)history.push(current.result.resolutionRecord);
  if(before!==exactKey(preRecognitionSemanticExperienceValue(projection.experience)))throw Error('Axis evidence changed');
  const facets=projection.classifications.filter(c=>c.perceptualReferentId.observerTrackSequence===track.observerTrackSequence).map(c=>({facet:c.perceptualFacetId,value:c.typedPerceivedValue})).sort((a,b)=>a.facet.localeCompare(b.facet));
  // A resolution on a retired track remains history; the new track does not revise it.
  cases.push({id:`${appearance}/${trackMode}/${recognitionMode}`,appearance,trackMode,recognitionMode,views:{classification:facets,tracking:{initial:String(initialTrack.observerTrackSequence),current:String(track.observerTrackSequence),retired:!!retirement},recognition:{candidate:current.result.resolutionRecord?.resolution??null,history:history.map(h=>({track:String(h.perceptualReferentId.observerTrackSequence),resolution:h.resolution,revises:h.revisesRecognitionResolutionId===undefined?null:String(h.revisesRecognitionResolutionId)}))}},truth:await evidence(list(truth.map(eventBindingValue))),initial:await evidence(preRecognitionSemanticExperienceValue(initial.experience)),experience:await evidence(preRecognitionSemanticExperienceValue(projection.experience)),state:await evidence(perceptualContinuantFileStateValue(projection.continuantFiles)),resolutions:await evidence(list(history.map(recognitionResolutionRecordValue))),diagnostic:continuantDiagnostic({priorEvaluation,retirement,transitions:projection.trackTransitions,current,history}),scope:recognitionMode==='corrected'&&trackMode==='reacquired'?'Later correct assertion on a new track; original wrong assertion retained, no revision link across tracks.':recognitionMode==='corrected'?'Later correct assertion revises the original wrong assertion on the same track.':'Independent final recognition evaluation.'});
 }
 const comparisons=[];
 for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){const a=cases[i],b=cases[j],axes=(['appearance','trackMode','recognitionMode'] as const).filter(k=>a[k]!==b[k]);if(axes.length!==1)continue;
  const equal=(x:unknown,y:unknown)=>continuantDiagnostic(x)===continuantDiagnostic(y);
  // Recognition semantics exclude carrier references and revision addresses when
  // tracking changes. Exact history/addresses remain in both originals.
  const recognitionView=(c:typeof a)=>({candidate:c.views.recognition.candidate,history:c.views.recognition.history.map(h=>h.resolution)});
  comparisons.push({a:a.id,b:b.id,changedAxis:axes[0],equal:{truth:a.truth.canonicalHex===b.truth.canonicalHex,initial:a.initial.canonicalHex===b.initial.canonicalHex,experience:a.experience.canonicalHex===b.experience.canonicalHex,classification:equal(a.views.classification,b.views.classification),tracking:equal(a.views.tracking,b.views.tracking),recognition:equal(recognitionView(a),recognitionView(b))}});
 }
 return {version:'sem-three-axis-controls/0.1',contract:'semantic-binding/0.1-candidate',vector:'CV-SEM-016',recipe:'New bounded composition of accepted projection, retirement, classification and recognition APIs; original component implementations unchanged.',alignment:'One shared initial observation at10, optional retirement at20, final observation at30. Classification compares exact facet/value pairs for the selected carrier. Tracking compares observer-local initial/current identity and retirement. Recognition compares asserted candidate plus ordered resolution meanings; carrier/revision addresses remain visible in originals but are excluded only from that cross-track semantic comparison. No RNG draws.',cases,comparisons,scope:'24 declared component cases and72 single-axis comparisons, not a native scheduler/Save132 run. Glen/Darius are explicitly seeded observer catalog candidates, never copied from truth. Correctness is researcher fixture context only. Reacquired-track correction is a new assertion, not a rewrite or cross-track revision. No general independence law, full CV016 or Campaign4 entry acceptance claim.'};
}

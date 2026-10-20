import * as f from './semMeasurementFixture';
import {permittedEvidenceValue} from '../observation/observation';
import {perceivedBindingEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {semanticOccurrenceId} from '../semanticBinding/semanticCodecs';
import {MINA,projectObserver,truthBindings,createRunAllocator} from '../test/fixtures/phenSem001';
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {exactKey,exactText,digest,fromHex} from './canonical';
import {recognitionDiagnostic} from './semRecognitionControls';
async function evidence(value:CanonicalValue){const canonicalHex=exactKey(value);return {canonicalHex,sha256:await digest(fromHex(canonicalHex)),exact:exactText(value)};}
export async function runSemMeasurementControls(){
 const measured=f.measuredBinding(),binding=measured.binding,observation=measured.observed;
 const cited=semanticOccurrenceId('ObservationId',binding.supportingObservationIds[0].observationId);
 const ordinary=projectObserver({observerId:MINA,truth:truthBindings(),allocator:createRunAllocator(),experienceId:1n});
 const {scheduler,adapter}=f.rollbackFixture();
 const capture=async()=>{const s=scheduler.exportQuiescentSnapshot();return {state:await evidence(adapter.canonicalValue(s.state)),allocators:recognitionDiagnostic(s.allocators),trace:await evidence(list(s.committedTrace)),outputs:await evidence(list(s.outputs)),clock:String(s.clock),status:s.status,queue:recognitionDiagnostic(s.queue)};};
 const before=await capture();let failure:string|undefined;
 try{await scheduler.settleNextInstant();}catch(error){failure=error instanceof Error?error.message:String(error);}
 if(!failure?.includes('injected semantic-binding commit failure'))throw Error('Original rollback guard did not fire');
 const after=await capture();
 return {version:'sem-measurement-rollback-controls/0.1',source:f.originalSource,
  measurement:{vector:'CV-SEM-011',observation:await evidence(permittedEvidenceValue(observation)),binding:await evidence(perceivedBindingEvidenceValue(binding)),citedObservationHex:exactKey(cited),actualObservationHex:exactKey(observation.observationId),citationMatches:exactKey(cited)===exactKey(observation.observationId),namespace:String(observation.observationId.namespaceId),track:String(binding.perceptualReferentId.observerTrackSequence),supportOrdinal:String(binding.supportingObservationIds[0].observationId),role:binding.eventRoleEvidence,lower:observation.measurementInterval.lower?String(observation.measurementInterval.lower.numerator)+'/'+String(observation.measurementInterval.lower.denominator):null,ordinaryBindings:await evidence(list(ordinary.perceivedBindings.map(perceivedBindingEvidenceValue))),ordinaryCount:ordinary.perceivedBindings.length,ordinarySupportKeys:Object.keys(ordinary.perceivedBindings[0].supportingObservationIds[0]).sort()},
  rollback:{vector:'CV-SEM-014',failure,before,after,preserved:{state:before.state.canonicalHex===after.state.canonicalHex,allocators:before.allocators===after.allocators,trace:before.trace.canonicalHex===after.trace.canonicalHex,outputs:before.outputs.canonicalHex===after.outputs.canonicalHex}},
  scope:'Original bounded measurement support and isolated scheduler settlement-failure witnesses. Binding cites the actual measurement occurrence without copying interval or truth into role evidence. Failed scheduler status is preserved explicitly; this is not active-run rollback or successful continuation. No broader measurement/SEM acceptance claim.'};
}

/** Internal canonical binding/freeze adapters for SEM-001C/H. Actual sample and
 * tracking producer admission is the caller's obligation; no truth is accepted. */
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {compilePerceivedBindings,type PerceivedBindingEvidence} from '../semanticBinding/perceptualEventFiles';
import type {EventRoleEvidence,EventRoleId} from '../semanticBinding/eventBindings';
import {freezeAndStageSemanticExperience,OBSERVATION_LANES,type ExperienceReservation} from '../semanticBinding/phaseOrdering';
import {perceivedBindingEvidenceValue,preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalSubject,generalBindingContext} from './generalBindingProfile';
import type {compileGeneralTrackingStage} from './generalTrackingStage';
type Tracking=ReturnType<ReturnType<ReturnType<typeof compileGeneralTrackingStage>['prepare']>['result']>;
const context=generalBindingContext(),who=generalSubject(),observer=txt(identity(who.observer).payload);
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
function samples(value:CanonicalValue){const s=rec(decode(enc(value),context),656n);if(key(f(s,1n))!==key(who.observer))fail('GA semantic source observer');return s;}
export function produceGeneralBindings(value:CanonicalValue,tracking:Tracking,allocate:()=>bigint){
 const s=samples(value),visual=s.fields.has(6n)?rec(f(s,6n),610n):undefined,event=tracking.perceived?.visualEventTransition??tracking.perceived?.transition;
 const detections=visual?items(f(visual,5n),'list'):[];
 if(tracking.tracks.length!==detections.length||tracking.tracks.length&&!event)fail('GA binding tracking source coverage');
 const at=(f(s,2n) as Extract<CanonicalValue,{kind:'signed'}>).value;
 const requests=tracking.tracks.map(track=>{
  if(track.observerId!==observer||track.occurredAt!==at)fail('GA binding tracking subject/time');
  const candidates=detections.filter(v=>ordinal(f(rec(f(rec(v,609n),1n),214n),2n))===track.currentDetectionId.detectionOccurrenceId);if(candidates.length!==1)fail('GA binding detection association');
  const role=rec(f(rec(candidates[0],609n),2n),223n),evidence:EventRoleEvidence=uint(f(role,1n))===1n?{kind:'exact',eventRoleId:txt(identity(f(role,2n)).payload) as EventRoleId}:{kind:'unresolved'};
  return {observerId:observer,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:track.perceptualReferentId,eventRoleEvidence:evidence,supportingObservationIds:[{observerId:observer,observationId:ordinal(f(visual!,1n))}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'};
 });
 const used=new Set<bigint>();const bindings=compilePerceivedBindings(requests,0n).bindings.map(binding=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))fail('GA binding allocation');used.add(n);return {...binding,perceivedBindingId:n};});
 return Object.freeze({bindings:()=>structuredClone(bindings),outputs:()=>bindings.map(perceivedBindingEvidenceValue)});
}
export function freezeGeneralExperience(value:CanonicalValue,tracking:Tracking,bindings:readonly PerceivedBindingEvidence[],reservation:ExperienceReservation|undefined){
 const s=samples(value),at=(f(s,2n) as Extract<CanonicalValue,{kind:'signed'}>).value;
 if(!reservation){if(s.fields.has(8n)||bindings.length)fail('GA missing semantic reservation');return undefined;}
 if(!s.fields.has(8n)||ordinal(f(s,8n))!==reservation.experienceId)fail('GA semantic reservation identity');
 const support:{observerId:string;observationId:bigint}[]=[];
 if(s.fields.has(4n))for(const v of items(f(rec(f(s,4n),654n),3n),'list')){if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===461n)support.push({observerId:observer,observationId:ordinal(f(v,1n))});}
 if(s.fields.has(5n)){const panel=f(s,5n);if(typeof panel!=='boolean'&&panel.kind==='record'&&panel.schema.typeId===542n)support.push({observerId:observer,observationId:ordinal(f(panel,1n))});}
 if(s.fields.has(6n)){const visual=rec(f(s,6n),610n);if(items(f(visual,5n),'list').length)support.push({observerId:observer,observationId:ordinal(f(visual,1n))});}
 support.sort((a,b)=>a.observationId<b.observationId?-1:a.observationId>b.observationId?1:0);
 const event=tracking.perceived?.visualEventTransition??tracking.perceived?.transition;
 const staged=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:observer,occurredAt:at,perceptualEventReferentIds:event?[event.perceptualEventReferentId]:[],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[reservation.lane].phases.ExperienceFreeze);
 return Object.freeze({staged:()=>structuredClone(staged),output:()=>preRecognitionSemanticExperienceValue(staged.experience)});
}

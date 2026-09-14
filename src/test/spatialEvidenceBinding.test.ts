import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {applyPerceptualTrackTransition,emptyPerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import {applyPerceptualEventTransition,emptyPerceptualEventFileState} from '../semanticBinding/perceptualEventFiles';
import {bindSpatialEvidence} from '../campaign3/spatialEvidenceBinding';
import {attentionFixture} from './attentionFixtures';
import {prepareAttentionPool,selectAttention,selectedReferences} from '../campaign3/attentionSelection';
import {encodeSelectedSpatialEvidence} from '../campaign3/selectedSpatialEncoding';
import {prepareSelectedSpatialEncoding,encodePreparedSpatialEvidence,closePreparedSpatialEncoding,type PreparedSpatialEncoding} from '../campaign3/selectedSpatialEncoding';
import {encodePreparedSpatialWithPriorConcern} from '../campaign3/selectedSpatialEncoding';
import {cognitiveRecord} from '../campaign2/cognitiveCodecs';
import {typedIdentifier,text,unsigned,rational} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
const calibration=()=>({minX:0n,maxX:0n,minY:0n,maxY:0n,focalWeight:Q.of(1n),residualPool:Q.of(1n,5n)});
function fixture(){
 const f=attentionFixture(),observerId=f.experience.observerId,supportingObservationIds=[{observerId,observationId:0n}];let state=emptyPerceptualContinuantFileState();
 const tracks=[1n,2n,3n].map(detectionOccurrenceId=>{const r=applyPerceptualTrackTransition(state,{observerId,currentDetectionId:{observerId,detectionOccurrenceId},continuityKind:'NewTrack',supportingObservationIds,occurredAt:1n,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'});state=r.state;return r.transition;});
 const event=applyPerceptualEventTransition(emptyPerceptualEventFileState(),{observerId,currentEventDetectionId:{observerId,eventDetectionOccurrenceId:9n},continuityKind:'NewEventFile',supportingObservationIds,occurredAt:1n,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'}).transition;
 return {observation:{observerId,observationId:0n,occurredAt:1n,eventDetectionId:9n,detections:[{detectionId:1n,position:{x:0n,y:0n}},{detectionId:2n,position:{x:7n,y:0n}},{detectionId:3n,position:{x:7n,y:1n}}]},tracks,event,experience:f.experience};
}
describe('actual track joins for observed spatial evidence',()=>{
 it('SEB-G: a component label cannot masquerade as an admitted SEM event transformation',()=>{const f=fixture();expect(()=>bindSpatialEvidence({...f,event:{...f.event,transformationVersion:'panel-visual-event-composition/0.1-candidate'}},calibration())).toThrow('not an admitted seam contract');});
 it('SEB-A: coordinates attach to actual resulting files, independent of track array order',()=>{const f=fixture(),a=bindSpatialEvidence(f,calibration()),b=bindSpatialEvidence({...f,tracks:[...f.tracks].reverse()},calibration());expect(b).toEqual(a);expect(a.map(r=>r.unit.perceptualReferentId.observerTrackSequence)).toEqual([0n,1n,2n]);expect(a.map(r=>r.spatialClass==='SpatialUnknown'?undefined:r.allocation)).toEqual([Q.of(1n),Q.of(1n,10n),Q.of(1n,10n)]);expect(a.every(r=>r.peripheralCount===2)).toBe(true);});
 it('SEB-B: missing position stays Unknown; zero allocation remains known',()=>{const f=fixture(),unknown={...f,observation:{...f.observation,detections:[{detectionId:1n},...f.observation.detections.slice(1)]}},a=bindSpatialEvidence(unknown,calibration()),b=bindSpatialEvidence(f,{...calibration(),focalWeight:Q.of(0n)});expect(a[0]).toMatchObject({spatialClass:'SpatialUnknown'});expect(a[0]).not.toHaveProperty('allocation');expect(b[0]).toMatchObject({spatialClass:'SpatialFocal',allocation:Q.of(0n)});});
 it('SEB-C: foreign observer/time or event-detection substitution cannot rebind a coordinate',()=>{for(const mutate of [(f:ReturnType<typeof fixture>)=>f.observation.observerId='foreign',(f:ReturnType<typeof fixture>)=>f.observation.occurredAt=2n,(f:ReturnType<typeof fixture>)=>f.observation.eventDetectionId=10n]){const f=fixture();mutate(f);expect(()=>bindSpatialEvidence(f,calibration())).toThrow();}});
 it('SEB-D: duplicated, missing, unsupported or foreign detection/file joins reject',()=>{const f=fixture();for(const tracks of [[f.tracks[0],f.tracks[0],f.tracks[2]],f.tracks.slice(0,2),[{...f.tracks[0],currentDetectionId:{...f.tracks[0].currentDetectionId,detectionOccurrenceId:8n}},...f.tracks.slice(1)],[{...f.tracks[0],supportingObservationIds:[{observerId:f.observation.observerId,observationId:7n}]},...f.tracks.slice(1)]])expect(()=>bindSpatialEvidence({...f,tracks},calibration())).toThrow();});
 it('SEB-E: experience must cover the exact bound files and current observation',()=>{const f=fixture();expect(()=>bindSpatialEvidence({...f,experience:{...f.experience,perceivedBindings:f.experience.perceivedBindings.slice(1)}},calibration())).toThrow('UNBOUND_TRACK');const bindings=f.experience.perceivedBindings.map(b=>({...b,supportingObservationIds:[{observerId:b.observerId,observationId:7n}]}));expect(()=>bindSpatialEvidence({...f,experience:{...f.experience,perceivedBindings:bindings,supportingObservationIds:[...f.experience.supportingObservationIds,{observerId:f.observation.observerId,observationId:7n}]}},calibration())).toThrow('BINDING');});
 it('SEB-F: output is detached and does not create roles, strength, selection or owner claims',()=>{const f=fixture(),before=structuredClone(f),out=bindSpatialEvidence(f,calibration());(out[0].unit.perceptualReferentId as {observerTrackSequence:bigint}).observerTrackSequence=99n;expect(f).toEqual(before);expect(bindSpatialEvidence(f,calibration())[0].unit.perceptualReferentId.observerTrackSequence).toBe(0n);for(const k of ['role','strength','selection','character','truth','source'])expect(out[0]).not.toHaveProperty(k);});
});
describe('selected spatial encoding successor',()=>{
 const view=(capacity=1)=>{const f=attentionFixture();return selectAttention(prepareAttentionPool(f.experience,f.claims),capacity).view;};
 it('SSE-A: independently peripheral actor keeps its role and preselection divisor',()=>{const f=fixture();f.observation.detections[0].position.x=7n;const r=encodeSelectedSpatialEvidence(view(),f,calibration(),'independent');expect(r.rows).toHaveLength(1);expect(r.evidence).toHaveLength(2);expect(r.rows[0]).toMatchObject({roleId:'causal-role/actor',status:'Positive',factors:{base:Q.of(3n,10n),role:Q.of(1n),attention:Q.of(1n,15n),raw:Q.of(1n,50n)},strength:Q.of(1n,51n),witness:{peripheralCount:3}});});
 it('SSE-B: unknown and known zero remain distinct and neither forms positive intact content',()=>{const f=fixture(),unknown={...f,observation:{...f.observation,detections:[{detectionId:1n},...f.observation.detections.slice(1)]}};const a=encodeSelectedSpatialEvidence(view(),unknown,calibration(),'independent'),b=encodeSelectedSpatialEvidence(view(),f,{...calibration(),focalWeight:Q.of(0n)},'independent');expect(a.rows[0].status).toBe('UnavailableAllocation');expect(a.rows[0]).not.toHaveProperty('strength');expect(a.rows[0]).not.toHaveProperty('factors');expect(b.rows[0]).toMatchObject({status:'KnownZero',strength:Q.of(0n)});});
 it('SSE-C: foreign same-binding experience cannot borrow selected claims and failure closes capability',()=>{const f=fixture(),v=view();expect(()=>encodeSelectedSpatialEvidence(v,{...f,experience:{...f.experience,experienceId:21n}},calibration(),'independent')).toThrow('SPATIAL_ENCODING_EXPERIENCE');expect(()=>selectedReferences(v)).toThrow();const w=view();expect(()=>encodeSelectedSpatialEvidence(w,{...f,tracks:[]},calibration(),'independent')).toThrow();expect(()=>selectedReferences(w)).toThrow();});
 it('SSE-D: empty actual selection emits no rows or witness archive',()=>{const r=encodeSelectedSpatialEvidence(view(0),fixture(),calibration(),'independent');expect(r.rows).toEqual([]);expect(r.evidence).toEqual([]);expect(r).not.toHaveProperty('source');expect(r).not.toHaveProperty('witnesses');});
 it('SSE-E: changing selected binding identity rejects despite matching file, role and position',()=>{const f=fixture(),v=view(),experience={...f.experience,perceivedBindings:f.experience.perceivedBindings.map(b=>({...b,perceivedBindingId:b.perceivedBindingId+100n}))};expect(()=>encodeSelectedSpatialEvidence(v,{...f,experience},calibration(),'independent')).toThrow('SPATIAL_ENCODING_BINDING');expect(()=>selectedReferences(v)).toThrow();});
 it('SSE-F: the named retired-flat control preserves its distinct treatment of known zero',()=>{const f=fixture(),c={...calibration(),focalWeight:Q.of(0n)};expect(encodeSelectedSpatialEvidence(view(),f,c,'retired-flat').rows[0]).toMatchObject({status:'Positive',strength:Q.of(1n)});for(const law of ['independent','historical-shared','historical-hybrid'] as const)expect(encodeSelectedSpatialEvidence(view(),f,c,law).rows[0]).toMatchObject({status:'KnownZero',strength:Q.of(0n)});});
});
describe('selected-only spatial capability',()=>{
 const view=(capacity=1)=>{const f=attentionFixture();return selectAttention(prepareAttentionPool(f.experience,f.claims),capacity).view;};
 it('SSC-A: preparation revokes the old view and encoder needs no subsequent source access',()=>{
  const source=fixture(),c=calibration(),v=view(),token=prepareSelectedSpatialEncoding(v,source,c);
  expect(()=>selectedReferences(v)).toThrow();expect(Reflect.ownKeys(token)).toEqual([]);
  source.observation.detections[0].position.x=7n;Reflect.set(c.focalWeight,'numerator',99n);
  Object.defineProperty(source,'experience',{get(){throw Error('SOURCE_READ_AFTER_PREPARATION');}});
  const result=encodePreparedSpatialEvidence(token,'independent');
  expect(result).toEqual(encodeSelectedSpatialEvidence(view(),fixture(),calibration(),'independent'));
  expect(result.rows).toHaveLength(1);expect(result.evidence).toHaveLength(2);
  expect(()=>encodePreparedSpatialEvidence(token,'independent')).toThrow('CAPABILITY');
 });
 it('SSC-B: forged, closed and failed-law capabilities cannot be reused',()=>{
  expect(()=>encodePreparedSpatialEvidence({} as PreparedSpatialEncoding,'independent')).toThrow('CAPABILITY');
  const a=prepareSelectedSpatialEncoding(view(),fixture(),calibration());closePreparedSpatialEncoding(a);
  expect(()=>encodePreparedSpatialEvidence(a,'independent')).toThrow('CAPABILITY');
  const b=prepareSelectedSpatialEncoding(view(),fixture(),calibration());expect(()=>encodePreparedSpatialEvidence(b,'invalid' as 'independent')).toThrow();
  expect(()=>encodePreparedSpatialEvidence(b,'independent')).toThrow('CAPABILITY');
 });
 it('SSC-C: empty selection transports no unselected evidence or witnesses',()=>{
  const token=prepareSelectedSpatialEncoding(view(0),fixture(),calibration()),r=encodePreparedSpatialEvidence(token,'independent');expect(r.rows).toEqual([]);expect(r.evidence).toEqual([]);
 });
});
describe('prior concern selected spatial composition',()=>{
 const subject=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/spatial-component'));
 // Carrier/subject authentication is a premise here; actual388 projection is tested separately.
 const carry=(sourceAt=0n)=>({kind:'Concern' as const,subject,sourceAt,concern:typedIdentifier(1130,unsigned(1)),response:cognitiveRecord(386,[unsigned(2),rational(2,5)])});
 const prepare=()=>{const f=attentionFixture();return prepareSelectedSpatialEncoding(selectAttention(prepareAttentionPool(f.experience,f.claims),2).view,fixture(),calibration());};
 it('PCS-A: narrows only selected peripheral allocation with the original preselection denominator',()=>{
  const baseline=encodePreparedSpatialEvidence(prepare(),'independent'),result=encodePreparedSpatialWithPriorConcern(prepare(),'independent',carry(),subject,true);
  expect(result.rows[0]).toEqual(baseline.rows[0]);expect(result.rows[1].witness.peripheralCount).toBe(2);
  const row=result.rows[1];if(!('factors'in row))throw Error('expected known allocation');expect(row.factors.attention).toEqual(Q.of(3n,50n));expect(row.factors.raw).toEqual(Q.of(81n,5000n));expect(result.evidence).toEqual(baseline.evidence);
 });
 it('PCS-B: disabling modulation preserves the exact selected encoding and consumes the capability',()=>{
  const token=prepare(),{feedback,...result}=encodePreparedSpatialWithPriorConcern(token,'independent',carry(),subject,false);
  expect(result).toEqual(encodePreparedSpatialEvidence(prepare(),'independent'));expect(feedback.branch).toBe('DisabledFeedback');expect(()=>encodePreparedSpatialEvidence(token,'independent')).toThrow('CAPABILITY');
 });
 it('PCS-C: the token owns receiving time; same-time feedback rejects and cannot be retried',()=>{
  const token=prepare();expect(()=>encodePreparedSpatialWithPriorConcern(token,'independent',carry(1n),subject,true)).toThrow('FUTURE_OR_CURRENT');expect(()=>encodePreparedSpatialEvidence(token,'independent')).toThrow('CAPABILITY');
 });
});

import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {applyPerceptualTrackTransition,emptyPerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import {applyPerceptualEventTransition,emptyPerceptualEventFileState} from '../semanticBinding/perceptualEventFiles';
import {prepareAttentionPool,selectAttention} from '../campaign3/attentionSelection';
import {encodePositiveSpatialCandidate,encodePreparedPositiveSpatialCandidate,encodePreparedPositiveSpatialWithPriorConcern} from '../campaign3/positiveSpatialCandidate';
import {prepareSelectedSpatialEncoding} from '../campaign3/selectedSpatialEncoding';
import {typedIdentifier,unsigned,rational} from '../substrate/canonicalEncoding';
import {cognitiveRecord} from '../campaign2/cognitiveCodecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {attentionFixture} from './attentionFixtures';
function setup(weight=Q.of(1n),missing=false,capacity=2){
 const f=attentionFixture(),observerId=f.experience.observerId,supportingObservationIds=[{observerId,observationId:0n}];let state=emptyPerceptualContinuantFileState();
 const tracks=[1n,2n,3n].map(detectionOccurrenceId=>{const r=applyPerceptualTrackTransition(state,{observerId,currentDetectionId:{observerId,detectionOccurrenceId},continuityKind:'NewTrack',supportingObservationIds,occurredAt:1n,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'});state=r.state;return r.transition;});
 const event=applyPerceptualEventTransition(emptyPerceptualEventFileState(),{observerId,currentEventDetectionId:{observerId,eventDetectionOccurrenceId:9n},continuityKind:'NewEventFile',supportingObservationIds,occurredAt:1n,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'}).transition;
 const observation={observerId,observationId:0n,occurredAt:1n,eventDetectionId:9n,detections:[{detectionId:1n,...(missing?{}:{position:{x:0n,y:0n}})},{detectionId:2n,position:{x:7n,y:0n}},{detectionId:3n,position:{x:7n,y:1n}}]};
 return {view:selectAttention(prepareAttentionPool(f.experience,f.claims),capacity).view,source:{observation,tracks,event,experience:f.experience},calibration:{minX:0n,maxX:0n,minY:0n,maxY:0n,focalWeight:weight,residualPool:Q.of(1n,5n)}};
}
function run(weight=Q.of(1n),missing=false,capacity=2){const f=setup(weight,missing,capacity);return encodePositiveSpatialCandidate(f.view,f.source,f.calibration,'independent');}
describe('positive-only selected spatial candidate',()=>{
 it('PSC-A: each positive unit contains its own selected closure and no acquisition/protection state',()=>{const r=run();expect(r.candidate.units).toHaveLength(2);for(const u of r.candidate.units){expect(u.bindings).toHaveLength(1);expect(u.claims).toHaveLength(1);for(const k of ['evaluation','source','acquisition','character','selection','useProtection','outcomeSignificanceDirections'])expect(u).not.toHaveProperty(k);}expect(r.candidate.units[0].bindings[0]).not.toEqual(r.candidate.units[1].bindings[0]);});
 it('PSC-B: zero and unavailable rows remain trace-only; positive siblings retain only their own evidence',()=>{for(const r of [run(Q.of(0n)),run(Q.of(1n),true)]){expect(r.evaluation.rows).toHaveLength(2);expect(r.candidate.units).toHaveLength(1);expect(r.candidate.units[0].unit.perceptualReferentId.observerTrackSequence).toBe(1n);expect(r.candidate.units[0].bindings).toHaveLength(1);expect(r.candidate.units[0].claims).toHaveLength(1);}});
 it('PSC-C: empty selection or no positive winner produces no candidate identity',()=>{for(const r of [run(Q.of(1n),false,0),run(Q.of(0n),false,1),run(Q.of(1n),true,1)]){expect(r.candidate.units).toEqual([]);expect(Object.keys(r.candidate).sort()).toEqual(['units','version']);}});
 it('PSC-D: changing trace bytes, factors and identities cannot alter positive evidence',()=>{const r=run(),before=run().candidate;r.evaluation.evidence[0].bytes.fill(0);const row=r.evaluation.rows[0];if(!('factors'in row))throw Error('known');Reflect.set(row.factors!.base,'numerator',99n);(row.witness.unit.perceptualReferentId as {observerTrackSequence:bigint}).observerTrackSequence=99n;expect(r.candidate).toEqual(before);});
});

describe('prepared positive candidate boundary',()=>{
 const subject=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/positive-spatial'));
 // Completed producer and subject authentication remain explicit upstream premises.
 const carry=(sourceAt=0n)=>({kind:'Concern' as const,subject,sourceAt,concern:typedIdentifier(1130,unsigned(1)),response:cognitiveRecord(386,[unsigned(2),rational(1,1)])});
 const prepare=()=>{const f=setup();return {source:f.source,token:prepareSelectedSpatialEncoding(f.view,f.source,f.calibration)};};
 it('PPC-A: positive projection consumes only the prepared selected capability',()=>{
  const {source,token}=prepare();Object.defineProperty(source,'experience',{get(){throw Error('SOURCE_ACCESS');}});
  expect(encodePreparedPositiveSpatialCandidate(token,'independent')).toEqual(run());
  expect(()=>encodePreparedPositiveSpatialCandidate(token,'independent')).toThrow('CAPABILITY');
 });
 it('PPC-B: full earlier concern leaves focal child positive and zero peripheral child trace-only',()=>{
  const result=encodePreparedPositiveSpatialWithPriorConcern(prepare().token,'independent',carry(),subject,true);
  expect(result.evaluation.rows.map(r=>r.status)).toEqual(['Positive','KnownZero']);
  expect(result.candidate.units).toEqual([run().candidate.units[0]]);
  expect(result.candidate).not.toHaveProperty('feedback');expect(result.evaluation.feedback.branch).toBe('EnabledKnown');
 });
 it('PPC-C: disabled feedback preserves candidate and failed temporal admission revokes capability',()=>{
  const result=encodePreparedPositiveSpatialWithPriorConcern(prepare().token,'independent',carry(),subject,false);
  expect(result.candidate).toEqual(run().candidate);
  const {token}=prepare();expect(()=>encodePreparedPositiveSpatialWithPriorConcern(token,'independent',carry(1n),subject,true)).toThrow('FUTURE_OR_CURRENT');
  expect(()=>encodePreparedPositiveSpatialCandidate(token,'independent')).toThrow('CAPABILITY');
 });
});

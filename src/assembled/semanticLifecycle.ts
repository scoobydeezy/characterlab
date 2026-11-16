/** Versioned source grammar and canonical C1 lifecycle output, not another owner. */
import {list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,invalidModel} from '../campaign2/canonicalData';
import {semanticRecordValue as sr,observerIdValue,perceptualEventReferentIdValue as eventValue,currentEventDetectionIdValue,supportingObservationIdValue,EventContinuityKindValue} from '../semanticBinding/semanticCodecs';
import type {PerceptualEventTransition,PerceptualEventEnd} from '../semanticBinding/perceptualEventFiles';
export const LIFECYCLE_VERSION='assembled-character-semantic-lifecycle/0.1-candidate';
export function lifecycleSource(v:CanonicalValue){const a=items(v,'list');if(a.length!==4||a.some(x=>typeof x!=='boolean')||a[0]&&a[1]||a[2]&&a[3])invalidModel('semantic lifecycle contradictory flags/grammar');return list(a);}
const support=(x:PerceptualEventEnd)=>set(x.supportingObservationIds.map(o=>supportingObservationIdValue(o.observerId,o.observationId)));
export function eventTransitionValue(x:PerceptualEventTransition){return sr('PerceptualEventTransition',{ObserverId:observerIdValue(x.observerId),PriorPerceptualEventReferentId:x.priorPerceptualEventReferentId?eventValue(x.priorPerceptualEventReferentId):undefined,PerceptualEventReferentId:eventValue(x.perceptualEventReferentId),CurrentEventDetectionId:currentEventDetectionIdValue(x.observerId,x.currentEventDetectionId.eventDetectionOccurrenceId),ContinuityKind:u(EventContinuityKindValue[x.continuityKind]),SupportingObservationIds:support(x),OccurredAt:u(x.occurredAt),TransformationVersion:text(x.transformationVersion)});}
export function eventEndValue(x:PerceptualEventEnd){return sr('PerceptualEventEnd',{ObserverId:observerIdValue(x.observerId),PerceptualEventReferentId:eventValue(x.perceptualEventReferentId),SupportingObservationIds:support(x),OccurredAt:u(x.occurredAt),TransformationVersion:text(x.transformationVersion)});}

import {it,expect} from 'vitest';
import {createMarkerTracker,applyMarkerSweep,markerTrackingSnapshot} from '../campaign3/observedMarkerTracking';

it('OMT-G forward correction: sparse detection lists reject atomically before SEM tracking',()=>{
 const tracker=createMarkerTracker('observer/a'),before=markerTrackingSnapshot(tracker);
 const detections=new Array(2);detections[1]={detectionId:2n,glyph:1n};
 expect(()=>applyMarkerSweep(tracker,{observerId:'observer/a',observationId:0n,occurredAt:1n,detections})).toThrow('dense detection array');
 expect(markerTrackingSnapshot(tracker)).toEqual(before);
 expect(applyMarkerSweep(tracker,{observerId:'observer/a',observationId:0n,occurredAt:1n,detections:[]})).toEqual([]);
});

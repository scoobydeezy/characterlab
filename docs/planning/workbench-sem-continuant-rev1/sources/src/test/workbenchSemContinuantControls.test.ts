import {it,expect} from 'vitest';
import {runSemContinuantControls} from '../workbench/semContinuantControls';
it('retains original lifecycle, observer independence, rejection and exact repeatable allocation',async()=>{
 const r=await runSemContinuantControls();expect(await runSemContinuantControls()).toEqual(r);expect(r.cases).toHaveLength(10);
 expect(r.summary).toEqual({reacquiredSequence:'2',nextSequence:'3',restoredStateEqual:true,restoredContinuationEqual:true,interleavingPreservesTracks:true,continuityNext:'1',discontinuityNext:'2',shiftedTracksDiffer:true,shiftedSemanticViewEqual:true,foreignSemanticViewEqual:true,duplicateCode:'DUPLICATE_DETECTION_TRANSITION',duplicateEndCode:'INACTIVE_CONTINUANT_FILE',foreignEndCode:'CROSS_OBSERVER_REFERENCE'});
 expect(r.negatives.map(n=>n.code)).toEqual(['FORBIDDEN_TRUTH_FIELD','INVALID_TRACK_TRANSITION','INVALID_SUPPORTING_OBSERVATION','CROSS_OBSERVER_REFERENCE','CROSS_OBSERVER_REFERENCE','INACTIVE_CONTINUANT_FILE','INVALID_TRACK_TRANSITION']);
 expect(r.detectionOrdinals.map(d=>d.label)).toEqual(['det/1','det/2','det/3','det/1x','det/2x','det/glen','det/after-occlusion','det/glen-a','det/glen-b']);
 expect(r.detectionOrdinals.map(d=>d.ordinal)).toEqual(['0','1','2','3','4','5','6','7','8']);
 const noReuse=JSON.parse(r.cases[0].evidence.exact);expect(noReuse.reacquired.state.nextTrackSequenceByObserver.$map).toEqual([['character/mina',{$bigint:'3'}]]);
 const split=JSON.parse(r.cases[4].evidence.exact);expect(split.firstTransitionPreserved).toBe(true);expect(split.firstTransitionFrozen).toBe(true);
});

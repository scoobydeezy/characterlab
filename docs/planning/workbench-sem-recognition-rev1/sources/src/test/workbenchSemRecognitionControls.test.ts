import {it,expect} from 'vitest';
import {runSemRecognitionControls} from '../workbench/semRecognitionControls';
it('retains no-update reasons, append-only resolution lifecycle and original rejection guards',async()=>{
 const r=await runSemRecognitionControls();expect(await runSemRecognitionControls()).toEqual(r);expect(r.cases).toHaveLength(8);
 expect(r.cases.map(c=>c.resolutionEmitted)).toEqual([false,false,false,true,true,false,true,false]);
 expect(r.cases.filter(c=>c.evaluation.kind==='no-update').map(c=>c.evaluation)).toEqual([
 {kind:'no-update',reason:'NoQualifyingCandidate'},{kind:'no-update',reason:'NoQualifyingCandidate'},{kind:'no-update',reason:'AmbiguousCandidates'},{kind:'no-update',reason:'NoQualifyingCandidate'},{kind:'no-update',reason:'AmbiguousCandidates'}]);
 expect(r.lifecycle.map(c=>c.nextRuntimeId)).toEqual(['2','3','4','6','8']);expect(r.lifecycle.map(c=>c.resolutionEmitted)).toEqual([true,false,false,true,true]);
 expect(r.lifecycle[1].current).toEqual(r.lifecycle[0].current);expect(r.lifecycle[2].current).toEqual(r.lifecycle[0].current);expect(r.lifecycle[3].current).toEqual({kind:'withdrawn'});expect(r.lifecycle[4].current).not.toEqual(r.lifecycle[0].current);
 const history=JSON.parse(r.lifecycle[4].history.exact);expect(history).toHaveLength(3);expect(history[1].revisesRecognitionResolutionId).toEqual(history[0].recognitionResolutionId);expect(history[2].revisesRecognitionResolutionId).toEqual(history[1].recognitionResolutionId);
 expect(r.negatives.map(n=>n.failure.code)).toEqual(['INVALID_MODEL','INVALID_CUE','INVALID_EVIDENCE_REFERENCE','INVALID_CUE']);
});

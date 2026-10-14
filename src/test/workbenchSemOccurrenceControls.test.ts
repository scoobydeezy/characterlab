import {it,expect} from 'vitest';
import {runSemOccurrenceControls} from '../workbench/semOccurrenceControls';
import {createOccurrenceRecorder} from '../workbench/semOccurrenceRecorder';
it('retains original occurrence ordering and exact boundary failures',async()=>{
 const r=await runSemOccurrenceControls();expect(await runSemOccurrenceControls()).toEqual(r);expect(r.cases).toHaveLength(6);expect(r.cases.map(c=>c.failures.map(f=>f.code))).toEqual([[],['INVALID_TRACK_TRANSITION','INVALID_SUPPORTING_OBSERVATION','INVALID_SUPPORTING_OBSERVATION','INVALID_SUPPORTING_OBSERVATION'],[],[],['INVALID_REFERENT','INVALID_REFERENT'],[]]);const ordering=JSON.parse(r.cases[2].evidence.exact);expect(ordering.assertions[1].actual).toBe(JSON.stringify([{$bigint:'2'},{$bigint:'9'},{$bigint:'10'}],null,2));expect(ordering.assertions[2].negated).toBe(true);
});
it('rejects missing/wrong coded throws and false defined assertions',async()=>{
 for(const body of [(r:ReturnType<typeof createOccurrenceRecorder>)=>r.expect(()=>{}).toThrowError({code:'X'}),(r:ReturnType<typeof createOccurrenceRecorder>)=>r.expect(()=>{throw Object.assign(Error('bad'),{code:'Y'});}).toThrowError({code:'X'}),(r:ReturnType<typeof createOccurrenceRecorder>)=>r.expect(undefined).toBeDefined(),(r:ReturnType<typeof createOccurrenceRecorder>)=>r.expect(1).toBeUndefined()]){const r=createOccurrenceRecorder();r.it('deliberate failure',()=>body(r));await expect(r.finish()).rejects.toThrow();}
});

import {describe,it,expect} from 'vitest';
import {runSemEventFileControls} from '../workbench/semEventFileControls';
describe('SEM event-file inspection controls',()=>{
 it('retains grouping, observer identity, opaque ordinals and failed-settlement state separately',async()=>{
  const r=await runSemEventFileControls();expect(await runSemEventFileControls()).toEqual(r);
  expect(r.cases.map(c=>c.vector)).toEqual(Array.from({length:9},(_,i)=>`CV-SEM-${String(31+i).padStart(3,'0')}`));
  expect(r.negatives.map(n=>n.code)).toEqual(['FORBIDDEN_TRUTH_FIELD','ACTION_AS_CONTINUANT_FILE']);
  expect(r.summary).toEqual({simultaneousGroups:2,simultaneousBindings:5,distinctExperiences:true,persistentEvent:true,continuedEvent:true,restartedSequence:'1',concurrentGroups:2,concurrentBindings:3,restoredStateEqual:true,restoredContinuationEqual:true,minaSecondSequence:'1',dariusFirstSequence:'0',shiftedGroupingEqual:true,shiftedIdsDiffer:true});
  expect(r.rollback.allocated).toBe('20');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(Object.values(r.rollback.preserved)).toEqual([true,true,true,true]);
  const records=Object.fromEntries(r.cases.map(c=>[c.id,JSON.parse(c.evidence.exact)]));
  expect(records['simultaneous-groupings'].grouping).toEqual([['exact:event-role/actor=continuant-file:0','exact:event-role/instrument=continuant-file:2','exact:event-role/target=continuant-file:1'],['exact:event-role/actor=continuant-file:3','exact:event-role/target=continuant-file:4']]);
  expect(records['concurrent-participation'].grouping).toEqual([['exact:event-role/actor=continuant-file:4','exact:event-role/target=continuant-file:4'],['exact:event-role/participant=continuant-file:4']]);
  expect(records['observer-side-detection'].transition).not.toHaveProperty('truthEventId');
 });
});

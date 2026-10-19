import {it,expect} from 'vitest';
import {LongRoutineWorkbenchRun} from '../workbench/longRoutineAdapter';
import {projectLongRoutineOwnedState as project} from '../workbench/longRoutineOwnedProjection';
it('keeps receiver ownership separate from profile, source and execution trace',async()=>{
 const r=await LongRoutineWorkbenchRun.create();for(let n=0;n<9;n++)await r.advance();const before=r.checkpoint(),s=r.snapshot().state,p=project(s);expect(Object.keys(p)).toEqual(['actor','practiceHistory','derivedCache','rewardBelief','goals']);s.rows.forEach(row=>{row.performed=!row.performed;row.observed=!row.observed;row.standing='1/1';});const changed={...s,profile:{...s.profile,seed:255}};expect(project(changed)).toEqual(p);p.goals.length=0;expect(project(r.snapshot().state).goals).not.toHaveLength(0);expect(r.checkpoint()).toEqual(before);
});

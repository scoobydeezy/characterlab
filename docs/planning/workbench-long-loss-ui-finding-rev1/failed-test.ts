import {it,expect} from 'vitest';
import {LongLossWorkbenchRun} from '../workbench/longLossAdapter';
import {projectLongLossOwnedState} from '../workbench/longLossOwnedProjection';
it('excludes execution, scenario labels and trace from detached owned-state inspection',async()=>{
 const run=await LongLossWorkbenchRun.create();for(let n=0;n<5;n++)await run.advance();const state=run.snapshot().state,prior=run.checkpoint(),a=projectLongLossOwnedState(state);
 expect(Object.keys(a)).toEqual(['actor','target','relationshipHistory','availabilityBelief','goals']);state.rows.forEach(r=>{r.physicalContact=!r.physicalContact;r.contactCompleted=!r.contactCompleted;r.supportCompleted=!r.supportCompleted;});state.profile.condition='NoLoss';expect(projectLongLossOwnedState(state)).toEqual(a);a.goals.length=0;expect(projectLongLossOwnedState(run.snapshot().state).goals.length).toBeGreaterThan(0);expect(run.checkpoint()).toEqual(prior);
});

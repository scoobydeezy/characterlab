import {it,expect} from 'vitest';
import {LongLossWorkbenchRun} from '../workbench/longLossAdapter';
import {projectLongLossOwnedState} from '../workbench/longLossOwnedProjection';
import {describeLongLossOwnedState as describe} from '../workbench/longLossStateDescription';
it('describes retained belief and lifecycle without claiming physical truth or current goal activation',async()=>{
 const run=await LongLossWorkbenchRun.create(0);const report=()=>describe(projectLongLossOwnedState(run.snapshot().state));expect(report().belief.estimate).toBeNull();
 for(let n=0;n<3;n++)await run.advance();expect(report().belief.estimate).toBe('1/1');expect(report().relationship.count).toBe(2);expect(report().goals[0]).toMatchObject({status:'Open',activeFrom:'4'});
 await run.advance();const before=run.checkpoint(),owned=projectLongLossOwnedState(run.snapshot().state),a=describe(owned);expect(a.belief.estimate).toBe('0/1');expect(a.goals[0].status).toBe('Open');
 expect(describe({...owned,physicalContact:true,profile:'NoLoss',trace:['secret']} as typeof owned)).toEqual(a);a.goals.length=0;expect(describe(owned).goals.length).toBe(2);expect(run.checkpoint()).toEqual(before);
 expect(()=>describe({...owned,availabilityBelief:'xx'})).toThrow();expect(()=>describe({...owned,goals:[...owned.goals,owned.goals[0]]})).toThrow();
});
it('keeps descriptions identical under matched evidence and changed actual contact',async()=>{
 const a=await LongLossWorkbenchRun.create(8),b=await LongLossWorkbenchRun.create(16);for(let n=0;n<=12;n++){expect(describe(projectLongLossOwnedState(a.snapshot().state))).toEqual(describe(projectLongLossOwnedState(b.snapshot().state)));if(n<12){await a.advance();await b.advance();}}expect(a.snapshot().state.rows.at(-1)!.physicalContact).not.toBe(b.snapshot().state.rows.at(-1)!.physicalContact);
});

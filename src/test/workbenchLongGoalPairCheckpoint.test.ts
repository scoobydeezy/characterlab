import {it,expect} from 'vitest';
import {LongGoalWorkbenchRun} from '../workbench/longGoalAdapter';
import {LONG_GOAL_COMPARISONS} from '../workbench/longGoalComparison';
import {captureLongGoalPair,restoreLongGoalPair} from '../workbench/longGoalPairCheckpoint';
it('restores both original identities, rejects mismatched prefixes and disposes a partial failed restore',async()=>{
 const spec=LONG_GOAL_COMPARISONS[0],a=await LongGoalWorkbenchRun.create(spec.control),b=await LongGoalWorkbenchRun.create(spec.candidate),saved=await captureLongGoalPair(spec.id,[a,b]);
 const pair=await restoreLongGoalPair(saved,LongGoalWorkbenchRun.restore,()=>{});expect(pair.map(r=>r.snapshot())).toEqual([a.snapshot(),b.snapshot()]);
 let calls=0;await expect(restoreLongGoalPair({...saved,candidate:{...saved.candidate,prefix:1}},async c=>{calls++;return c;},()=>{})).rejects.toThrow('prefix');expect(calls).toBe(0);
 await expect(restoreLongGoalPair({...saved,comparison:'coarse:Maintained:0'},LongGoalWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
 const disposed:unknown[]=[];await expect(restoreLongGoalPair({...saved,candidate:{...saved.candidate,saveHash:'bad'}},LongGoalWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed.length).toBe(1);
 const detached=await captureLongGoalPair(spec.id,[a,b]);detached.control.saveHex='bad';expect(a.checkpoint()).toEqual(saved.control);
},600000);

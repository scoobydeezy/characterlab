import {it,expect} from 'vitest';
import original from '../../docs/planning/longitudinal-personal-loss-execution-rev1/000.json';
import {LongLossWorkbenchRun,LONG_LOSS_CASES} from '../workbench/longLossAdapter';
it('preserves original prefixes and restores report and correction boundaries',async()=>{
 const run=await LongLossWorkbenchRun.create();
 for(let prefix=0;prefix<=12;prefix++){expect(run.snapshot().saveHash).toBe(original.prefixes[prefix].saveHash);if([3,4,8,12].includes(prefix)){const restored=await LongLossWorkbenchRun.restore(run.checkpoint());expect(restored.snapshot()).toEqual(run.snapshot());expect(await restored.advance()).toBe(prefix<12);expect(restored.snapshot().saveHash).toBe(original.prefixes[prefix].successorHash);}if(prefix<12)await run.advance();}
 expect(run.snapshot().state).toEqual(original.state);expect(await run.advance()).toBe(false);
},120000);
it('preserves cognitive equality despite unequal physical contact and rejects altered checkpoints',async()=>{
 const find=(condition:string)=>LONG_LOSS_CASES.findIndex(p=>p.law==='Latest'&&p.seed===0&&p.condition===condition),a=await LongLossWorkbenchRun.create(find('HiddenLoss')),b=await LongLossWorkbenchRun.create(find('NoLoss'));
 for(let n=0;n<12;n++){await a.advance();await b.advance();}
 const cognitive=(s:ReturnType<typeof a.snapshot>)=>s.state.rows.map(({physicalContact,contactCompleted,supportCompleted,...r})=>r);
 expect(cognitive(a.snapshot())).toEqual(cognitive(b.snapshot()));expect(a.snapshot().state.rows.map(r=>r.physicalContact)).not.toEqual(b.snapshot().state.rows.map(r=>r.physicalContact));
 const checkpoint=a.checkpoint();await expect(LongLossWorkbenchRun.restore({...checkpoint,index:find('NoLoss')})).rejects.toThrow(/identity/);await expect(LongLossWorkbenchRun.restore({...checkpoint,prefix:11})).rejects.toThrow(/SAVE_MISMATCH/);await expect(LongLossWorkbenchRun.restore({...checkpoint,saveHash:'bad'})).rejects.toThrow(/digest/);await expect(LongLossWorkbenchRun.create(480)).rejects.toThrow(/Unknown/);
 const copy=a.snapshot();copy.state.rows.length=0;expect(a.snapshot().state.rows).toHaveLength(12);expect(a.checkpoint()).toEqual(checkpoint);
},120000);

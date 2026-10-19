import {it,expect} from 'vitest';
import {LongRoutineWorkbenchRun} from '../workbench/longRoutineAdapter';
import original from '../../docs/planning/longitudinal-routine-execution-rev1/000.json';
it('restores the original receiving boundary and preserves availability versus enactment',async()=>{
 const r=await LongRoutineWorkbenchRun.create(0);for(let n=0;n<8;n++)await r.advance();const c=r.checkpoint(),state=r.snapshot();expect(state.saveHash).toBe(original.prefixes[8].saveHash);expect(state.pairHash).toBe(original.prefixes[8].pairHash);expect(state.state.belief).toBe(false);
 const restored=await LongRoutineWorkbenchRun.restore(c);expect(restored.snapshot()).toEqual(state);await restored.advance();expect(restored.snapshot().saveHash).toBe(original.prefixes[9].saveHash);expect(restored.snapshot().state.rows.at(-1)).toMatchObject({at:14,available:true,performed:false});await restored.advance();expect(restored.snapshot().state.rows.at(-1)).toMatchObject({at:15,performed:true});expect(r.checkpoint()).toEqual(c);
 const detached=r.snapshot();detached.state.goals.length=0;expect(r.snapshot()).toEqual(state);
 await expect(LongRoutineWorkbenchRun.restore({...c,pairHash:'00'.repeat(32)})).rejects.toThrow('commitment');await expect(LongRoutineWorkbenchRun.restore({...c,prefix:7})).rejects.toThrow('prefix bytes');await expect(LongRoutineWorkbenchRun.restore({...c,index:96})).rejects.toThrow('identity');
});
it('rejects overlap and exposes no in-flight state',async()=>{
 const r=await LongRoutineWorkbenchRun.create(0),p=r.advance();expect(()=>r.snapshot()).toThrow('advancing');expect(()=>r.checkpoint()).toThrow('advancing');await expect(r.advance()).rejects.toThrow('in flight');await p;expect(r.snapshot().prefix).toBe(1);
});

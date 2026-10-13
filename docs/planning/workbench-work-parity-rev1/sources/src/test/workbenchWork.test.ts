import {it,expect} from 'vitest';
import {WorkWorkbenchRun,WORK_PROGRAMS} from '../workbench/workAdapter';
it('retains both frozen cohorts and authenticates learned-source checkpoint continuation',async()=>{
 expect(WORK_PROGRAMS).toHaveLength(78);expect(WORK_PROGRAMS.filter(r=>r.cohort==='distractor')).toHaveLength(8);
 const a=await WorkWorkbenchRun.create(),pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;
 const checkpoint=a.checkpoint(),before=a.snapshot(),b=await WorkWorkbenchRun.restore(checkpoint);expect(b.snapshot()).toEqual(before);const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot()).toEqual(before);
 await a.advance();await b.advance();expect(b.snapshot()).toEqual(a.snapshot());expect(a.snapshot().fields.some(f=>f.root==='771')).toBe(true);
 await expect(WorkWorkbenchRun.restore({...checkpoint,prefix:0})).rejects.toThrow('prefix mismatch');await expect(WorkWorkbenchRun.restore({...checkpoint,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(WorkWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('keeps StoredSet and IndexedReplay equal outputs while retaining their separate state ownership',async()=>{
 const a=await WorkWorkbenchRun.create('c1-k1-s1'),b=await WorkWorkbenchRun.create('c2-k1-s1');for(let i=0;i<2;i++){await a.advance();await b.advance();}
 expect(a.snapshot().outputsHash).toBe(b.snapshot().outputsHash);expect(a.snapshot().stateHash).not.toBe(b.snapshot().stateHash);expect(a.snapshot().fields.some(f=>f.root==='772')).toBe(true);expect(b.snapshot().fields.some(f=>f.root==='772')).toBe(false);
},600000);

import {expect,it} from 'vitest';
import {CommitWorkbenchRun} from '../workbench/commitAdapter';
it('authenticates a learned-state prefix and preserves both observer projections on continuation',async()=>{
 const a=await CommitWorkbenchRun.create('1/main');const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const saved=a.checkpoint(),b=await CommitWorkbenchRun.restore(saved);expect(b.snapshot()).toEqual(a.snapshot());
 const detached=a.snapshot();detached.observerViews[0].exact='edited';expect(a.snapshot().observerViews[0].exact).not.toBe('edited');await a.advance();await b.advance();expect(b.snapshot()).toEqual(a.snapshot());
 await expect(CommitWorkbenchRun.restore({...saved,prefix:0})).rejects.toThrow('prefix mismatch');await expect(CommitWorkbenchRun.restore({...saved,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(CommitWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('keeps private lifecycle changes out of both observer views',async()=>{
 const a=await CommitWorkbenchRun.create('1/private'),b=await CommitWorkbenchRun.create('1/absent');for(let i=0;i<3;i++){await a.advance();await b.advance();}expect(a.snapshot().observerViews).toEqual(b.snapshot().observerViews);expect(a.snapshot().stateHash).not.toBe(b.snapshot().stateHash);expect(a.snapshot().outputsHash).not.toBe(b.snapshot().outputsHash);
},600000);

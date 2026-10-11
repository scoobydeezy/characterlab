import {expect,it} from 'vitest';
import {LearnWorkbenchRun} from '../workbench/learnAdapter';
it('preserves missing versus admitted zero and detached diagnostics',async()=>{
 const zero=await LearnWorkbenchRun.create('1/1/zero'),missing=await LearnWorkbenchRun.create('1/1/missing');
 await zero.advance();await missing.advance();
 expect(zero.snapshot().fields).toHaveLength(0);expect(missing.snapshot().fields).toHaveLength(0);
 expect(zero.snapshot().researchOutputs).not.toBe(missing.snapshot().researchOutputs);
 expect(zero.snapshot().projection).toBe('Researcher diagnostics only');
 const before=zero.snapshot();before.timeline.length=0;expect(zero.snapshot().timeline.length).toBeGreaterThan(0);
 const knownZero=await LearnWorkbenchRun.create('2/1/zero');await knownZero.advance();
 expect(knownZero.snapshot().fields).toHaveLength(1);
 expect(knownZero.snapshot().stateHash).not.toBe(zero.snapshot().stateHash);
},600000);
it('authenticates checkpoints and resumes the complete original tail',async()=>{
 const a=await LearnWorkbenchRun.create('1/1/repeated');await a.advance();
 const c=a.checkpoint(),b=await LearnWorkbenchRun.restore(c);
 let more=true;while(more){more=await a.advance();expect(await b.advance()).toBe(more);expect(b.checkpoint()).toEqual(a.checkpoint());}
 expect(a.snapshot().fields).toHaveLength(1);
 await expect(LearnWorkbenchRun.restore({...c,program:'2/1/repeated'})).rejects.toThrow('mismatch');
 await expect(LearnWorkbenchRun.restore({...c,prefix:65})).rejects.toThrow('Invalid');
 await expect(LearnWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('rejects overlapping advancement and unauthenticated saves',async()=>{
 const run=await LearnWorkbenchRun.create('1/1/zero'),advance=run.advance();
 expect(()=>run.snapshot()).toThrow('advancing');expect(()=>run.checkpoint()).toThrow('advancing');
 await expect(run.advance()).rejects.toThrow('in flight');await advance;
 const c=run.checkpoint();await expect(LearnWorkbenchRun.restore({...c,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');
 await expect(LearnWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix mismatch');
},600000);
